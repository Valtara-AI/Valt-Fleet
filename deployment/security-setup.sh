#!/bin/bash

# Fleet Management System - Security Setup Script
# Run this on your Ubuntu server to configure all security measures

set -e

echo "======================================"
echo "Fleet Management Security Setup"
echo "======================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Update system
echo "Updating system packages..."
apt-get update && apt-get upgrade -y

# Install required packages
echo "Installing security packages..."
apt-get install -y \
    ufw \
    fail2ban \
    nginx \
    certbot \
    python3-certbot-nginx \
    nginx-extras \
    iptables-persistent

# Configure UFW Firewall
echo "Configuring UFW firewall..."
ufw --force disable
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw allow 3000/tcp  # Node.js app
ufw --force enable

# Configure Fail2Ban
echo "Setting up Fail2Ban..."
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.conf.backup
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
backend = systemd
destemail = security@valtara.ai
sender = fail2ban@valtara.ai
action = %(action_mwl)s

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 86400

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/*error.log
maxretry = 10
findtime = 60
bantime = 7200

[nginx-badbots]
enabled = true
port = http,https
filter = nginx-badbots
logpath = /var/log/nginx/*access.log
maxretry = 2
bantime = 86400
EOF

# Create custom Fail2Ban filters
mkdir -p /etc/fail2ban/filter.d

cat > /etc/fail2ban/filter.d/nginx-limit-req.conf << 'EOF'
[Definition]
failregex = limiting requests, excess:.* by zone.*client: <HOST>
ignoreregex =
EOF

cat > /etc/fail2ban/filter.d/nginx-badbots.conf << 'EOF'
[Definition]
failregex = ^<HOST> -.*".*HTTP.*" .* ".*(?:aggressive|email|harvest|libwww|nikto|scan|spider|sqlmap|nmap).*"
ignoreregex =
EOF

# Restart Fail2Ban
systemctl restart fail2ban
systemctl enable fail2ban

# Configure IPTables for DDoS protection
echo "Setting up IPTables rules..."

# Limit connections per IP
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 20 -j REJECT --reject-with tcp-reset
iptables -A INPUT -p tcp --dport 443 -m connlimit --connlimit-above 20 -j REJECT --reject-with tcp-reset

# Limit new connections per IP
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 80 -m state --state NEW -m recent --update --seconds 60 --hitcount 30 -j DROP

iptables -A INPUT -p tcp --dport 443 -m state --state NEW -m recent --set
iptables -A INPUT -p tcp --dport 443 -m state --state NEW -m recent --update --seconds 60 --hitcount 30 -j DROP

# Block invalid packets
iptables -A INPUT -m state --state INVALID -j DROP

# Block fragmented packets
iptables -A INPUT -f -j DROP

# Block XMAS packets
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP

# Block NULL packets
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP

# Syn flood protection
iptables -A INPUT -p tcp ! --syn -m state --state NEW -j DROP

# Save IPTables rules
netfilter-persistent save

# Generate DH parameters for Nginx (if not exists)
if [ ! -f /etc/nginx/dhparam.pem ]; then
    echo "Generating DH parameters (this may take a while)..."
    openssl dhparam -out /etc/nginx/dhparam.pem 2048
fi

# Configure sysctl for network security
echo "Configuring kernel parameters..."
cat >> /etc/sysctl.conf << 'EOF'

# IP Spoofing protection
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignore ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# Ignore send redirects
net.ipv4.conf.all.send_redirects = 0

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Log Martians
net.ipv4.conf.all.log_martians = 1

# Ignore ICMP ping requests
net.ipv4.icmp_echo_ignore_all = 0

# Ignore Directed pings
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Accept Redirects? No
net.ipv4.conf.all.secure_redirects = 0

# Syn flood protection
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
net.ipv4.tcp_syn_retries = 5

# Increase TCP buffer sizes
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216

# Connection tracking
net.netfilter.nf_conntrack_max = 1000000
net.netfilter.nf_conntrack_tcp_timeout_established = 600
EOF

# Apply sysctl settings
sysctl -p

# Create monitoring script
cat > /usr/local/bin/monitor-ddos.sh << 'EOF'
#!/bin/bash

# Monitor for DDoS attacks
LOG_FILE="/var/log/ddos-monitor.log"
THRESHOLD=100

# Count connections per IP
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n | tail -20 | while read count ip; do
    if [ "$count" -gt "$THRESHOLD" ]; then
        echo "$(date): High connection count from $ip: $count" >> $LOG_FILE
        
        # Block the IP
        ufw insert 1 deny from $ip
        echo "$(date): Blocked $ip" >> $LOG_FILE
    fi
done
EOF

chmod +x /usr/local/bin/monitor-ddos.sh

# Add to crontab to run every 5 minutes
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-ddos.sh") | crontab -

# Create unblock script
cat > /usr/local/bin/unblock-ip.sh << 'EOF'
#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <ip-address>"
    exit 1
fi

IP=$1

# Remove from UFW
ufw delete deny from $IP

# Remove from Fail2Ban
fail2ban-client unban $IP

echo "IP $IP has been unblocked"
EOF

chmod +x /usr/local/bin/unblock-ip.sh

echo ""
echo "======================================"
echo "Security Setup Complete!"
echo "======================================"
echo ""
echo "Services Status:"
systemctl status ufw --no-pager | head -3
systemctl status fail2ban --no-pager | head -3
echo ""
echo "Next Steps:"
echo "1. Copy nginx-security.conf to /etc/nginx/sites-available/fleet.valtara.ai"
echo "2. Create symlink: ln -s /etc/nginx/sites-available/fleet.valtara.ai /etc/nginx/sites-enabled/"
echo "3. Test nginx: nginx -t"
echo "4. Reload nginx: systemctl reload nginx"
echo "5. Setup SSL: certbot --nginx -d fleet.valtara.ai"
echo ""
echo "Monitoring:"
echo "- DDoS Monitor: tail -f /var/log/ddos-monitor.log"
echo "- Fail2Ban: fail2ban-client status"
echo "- Firewall: ufw status numbered"
echo "- Unblock IP: /usr/local/bin/unblock-ip.sh <ip>"
echo ""
echo "Security measures active:"
echo "✓ UFW Firewall"
echo "✓ Fail2Ban"
echo "✓ IPTables DDoS protection"
echo "✓ Kernel hardening"
echo "✓ Automated monitoring"
