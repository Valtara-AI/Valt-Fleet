# Fleet Management System - Security Deployment Guide

## Critical Security Updates Applied

### 🛡️ Multi-Layer DDoS/DoS Protection

This deployment includes comprehensive security measures to protect against DDoS attacks and other threats.

---

## 📋 Quick Fix for Current 502 Errors

### Immediate Steps (Run on Server):

```bash
# 1. SSH into server
ssh -i "ubuntu-ky.pem" root@188.245.43.183

# 2. Check what's running
pm2 list
systemctl status nginx

# 3. Restart services
pm2 restart all
systemctl restart nginx

# 4. Check logs for errors
pm2 logs --lines 50
tail -50 /var/log/nginx/error.log

# 5. Test the application
curl -I http://localhost:3000/health
curl -I https://fleet.valtara.ai
```

---

## 🚀 Full Security Deployment

### Prerequisites
- Ubuntu 20.04+ server
- Root access
- Domain pointing to server IP

### Step 1: Upload Files

```bash
# From Windows (PowerShell)
scp -i "d:\DO\Fleet Management\ubuntu-ky.pem" deployment/security-setup.sh root@188.245.43.183:/tmp/
scp -i "d:\DO\Fleet Management\ubuntu-ky.pem" deployment/nginx-security.conf root@188.245.43.183:/tmp/
scp -i "d:\DO\Fleet Management\ubuntu-ky.pem" deployment/fail2ban-jail.conf root@188.245.43.183:/tmp/
scp -i "d:\DO\Fleet Management\ubuntu-ky.pem" deployment/fail2ban-filters.conf root@188.245.43.183:/tmp/
```

### Step 2: Run Security Setup

```bash
# SSH into server
ssh -i "ubuntu-ky.pem" root@188.245.43.183

# Make script executable
chmod +x /tmp/security-setup.sh

# Run security setup
/tmp/security-setup.sh
```

### Step 3: Configure Nginx

```bash
# Copy Nginx config
cp /tmp/nginx-security.conf /etc/nginx/sites-available/fleet.valtara.ai

# Enable site
ln -s /etc/nginx/sites-available/fleet.valtara.ai /etc/nginx/sites-enabled/

# Remove default
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

### Step 4: Setup SSL Certificate

```bash
# Install SSL certificate
certbot --nginx -d fleet.valtara.ai --non-interactive --agree-tos -m your-email@valtara.ai

# Test auto-renewal
certbot renew --dry-run
```

### Step 5: Deploy Application with Security

```bash
# Navigate to app directory
cd /var/www/fleet.valtara.ai

# Pull latest code
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Copy security middleware (if not in git)
mkdir -p src/middleware
# Upload the middleware files we created

# Restart PM2
pm2 restart all
pm2 save
```

---

## 🔒 Security Features Implemented

### 1. Application Layer
- ✅ Rate limiting (100 req/min per IP)
- ✅ Burst protection (20 req/second)
- ✅ Request validation and sanitization
- ✅ IP blocking system with auto-ban
- ✅ Security headers (HSTS, CSP, XSS protection)
- ✅ CORS with strict origin validation
- ✅ API key authentication
- ✅ Request size limits (1MB max)
- ✅ Timeout protection

### 2. Nginx Layer
- ✅ Rate limiting zones (general, API, login)
- ✅ Connection limits (10 per IP)
- ✅ Request size limits
- ✅ Bad bot blocking
- ✅ Suspicious pattern blocking
- ✅ SSL/TLS hardening
- ✅ Security headers

### 3. System Layer
- ✅ UFW Firewall
- ✅ Fail2Ban with custom rules
- ✅ IPTables DDoS protection
- ✅ Kernel hardening (sysctl)
- ✅ SYN flood protection
- ✅ Connection tracking

### 4. Monitoring
- ✅ Real-time security event logging
- ✅ System metrics tracking
- ✅ Automated alerting
- ✅ DDoS detection
- ✅ Log rotation

---

## 📊 Monitoring Commands

```bash
# Check Fail2Ban status
fail2ban-client status

# View banned IPs
fail2ban-client status nginx-limit-req

# Check firewall rules
ufw status numbered

# Monitor DDoS activity
tail -f /var/log/ddos-monitor.log

# Check security events
tail -f /var/www/fleet.valtara.ai/logs/security/security-events.log

# View Nginx error log
tail -f /var/log/nginx/fleet.valtara.ai.error.log

# Check active connections
netstat -an | grep ESTABLISHED | wc -l

# Top connection sources
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n | tail -20
```

---

## 🚨 Emergency Procedures

### Unblock an IP Address

```bash
# Using the provided script
/usr/local/bin/unblock-ip.sh <IP_ADDRESS>

# Manual unblock
ufw delete deny from <IP_ADDRESS>
fail2ban-client unban <IP_ADDRESS>
```

### Stop DDoS Attack

```bash
# Block attacking IP immediately
ufw insert 1 deny from <ATTACKING_IP>

# Check top connection sources
netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n | tail -20

# Block entire subnet if needed
ufw deny from <SUBNET>/24
```

### Service Recovery

```bash
# Restart all services
systemctl restart nginx
pm2 restart all
systemctl restart fail2ban

# If still issues, check logs
journalctl -u nginx -n 100
pm2 logs --lines 100
```

---

## 🔍 Troubleshooting

### 502 Bad Gateway
1. Check if Node.js app is running: `pm2 list`
2. Check app logs: `pm2 logs`
3. Verify app responds: `curl http://localhost:3000/health`
4. Check Nginx error log: `tail -50 /var/log/nginx/error.log`

### 429 Too Many Requests
- Normal for rate limiting
- Check if legitimate user affected
- Whitelist IP if needed (add to ALLOWED_ORIGINS in code)

### High CPU/Memory
- Check for DDoS: `/var/log/ddos-monitor.log`
- View top processes: `top`
- Check connections: `netstat -an | grep ESTABLISHED | wc -l`

---

## 📝 Configuration Files

### Application Files Created:
- `src/middleware/security.ts` - Main security middleware
- `src/middleware/cors-security.ts` - CORS and security headers
- `src/middleware/ip-blocking.ts` - IP blocking manager
- `src/middleware/monitoring.ts` - Security monitoring

### Deployment Files Created:
- `deployment/nginx-security.conf` - Nginx configuration
- `deployment/fail2ban-jail.conf` - Fail2Ban jail config
- `deployment/fail2ban-filters.conf` - Custom filters
- `deployment/security-setup.sh` - Automated setup script

---

## 🔐 Environment Variables

Add to your `.env` file:

```env
NODE_ENV=production
PORT=3000

# Security
VALID_API_KEYS=your-secret-key-1,your-secret-key-2

# Monitoring
SECURITY_ALERT_EMAIL=security@valtara.ai

# Rate Limiting (optional overrides)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_BLOCK_DURATION=900000
```

---

## 📞 Support

If you continue to experience issues:

1. **Check server status**: All services should be running
2. **Review logs**: Look for specific error messages
3. **Monitor traffic**: Use the monitoring tools provided
4. **Contact Hetzner**: If IP is still blocked, request unblock after implementing these fixes

---

## ✅ Post-Deployment Checklist

- [ ] All security scripts uploaded and executed
- [ ] Nginx configured with security settings
- [ ] SSL certificate installed and working
- [ ] Fail2Ban running and configured
- [ ] UFW firewall active
- [ ] Application running with security middleware
- [ ] Monitoring logs being generated
- [ ] Test rate limiting: `ab -n 200 -c 10 https://fleet.valtara.ai/`
- [ ] Verify HTTPS: `curl -I https://fleet.valtara.ai`
- [ ] Check security headers: `curl -I https://fleet.valtara.ai`

---

## 🎯 Next Steps

1. **Test the application** thoroughly
2. **Monitor logs** for 24-48 hours
3. **Tune rate limits** based on legitimate traffic
4. **Document** any IPs that should be whitelisted
5. **Setup automated backups** of security configs
6. **Schedule regular security audits**

---

**Last Updated**: December 13, 2025
**Version**: 3.0 (DDoS Protected)
