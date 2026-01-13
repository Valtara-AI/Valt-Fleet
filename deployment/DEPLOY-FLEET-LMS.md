# 🚀 Fleet Management LMS - Deployment Guide

## Server Details
- **Domain**: fleet.valtara.ai
- **IP**: 49.13.239.172 (shown in attachment)
- **Alternative IP**: 91.99.79.131 (from command)
- **User**: root
- **Port**: 3000 (Next.js app)

---

## 📋 Prerequisites Verification

### Step 1: Connect to Server
```bash
ssh root@91.99.79.131
```
*Enter root password when prompted*

### Step 2: Check Current Services
```bash
# Check what's running on required ports
ss -tulnp | egrep ':(80|443|3000|5000) '

# Check Nginx config
ls -la /etc/nginx/sites-enabled/
cat /etc/nginx/sites-enabled/fleet.valtara.ai 2>/dev/null || echo "No fleet config yet"
```

---

## 🔧 Part 1: Server Setup

### Install Required Packages
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install other requirements
apt install -y nginx git build-essential python3-certbot-nginx ufw

# Install PM2
npm install -g pm2@latest

# Verify installations
node --version
npm --version
pm2 --version
nginx -v
```

### Configure Firewall
```bash
# Allow SSH, HTTP, HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

---

## 📁 Part 2: Deploy Application

### Create Application Directory
```bash
# Create app directory
mkdir -p /var/www/fleet-lms
cd /var/www/fleet-lms

# Create necessary folders
mkdir -p logs backups public/assets
```

### Upload Files from Windows

**Open PowerShell on your Windows machine** at `D:\DO\Fleet Management`:

```powershell
# Method 1: Using SCP (recommended)
scp -r app src public package.json package-lock.json next.config.mjs tsconfig.json next-env.d.ts root@91.99.79.131:/var/www/fleet-lms/

# Method 2: Using SFTP
sftp root@91.99.79.131
cd /var/www/fleet-lms
put -r *
exit
```

**Alternative**: Use WinSCP or FileZilla to upload all files.

---

## 🔨 Part 3: Build Application

### Back on the Server
```bash
cd /var/www/fleet-lms

# Create production environment file
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
# Add your database URL, API keys, etc. below:
# DATABASE_URL=
# API_KEY=
EOF

# Secure the env file
chmod 600 .env.production

# Install dependencies
npm ci --production=false

# Build the application
npm run build

# Verify build
ls -la .next/
```

---

## 🚀 Part 4: Configure PM2

### Create PM2 Ecosystem File
```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'fleet-lms',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/fleet-lms',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/www/fleet-lms/logs/err.log',
    out_file: '/var/www/fleet-lms/logs/out.log',
    log_file: '/var/www/fleet-lms/logs/combined.log',
    time: true
  }]
};
EOF

# Start the application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u root --hp /root
# Run the command that PM2 outputs

# Check status
pm2 status
pm2 logs fleet-lms --lines 20
```

### Test Local Access
```bash
# Test if app is running
curl -I http://localhost:3000

# Should see HTTP 200 OK
```

---

## 🌐 Part 5: Configure Nginx

### Create Nginx Configuration
```bash
cat > /etc/nginx/sites-available/fleet.valtara.ai << 'EOF'
# Rate limiting
limit_req_zone $binary_remote_addr zone=fleet_limit:10m rate=10r/s;

# Upstream backend
upstream fleet_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP Server (will redirect to HTTPS after SSL setup)
server {
    listen 80;
    listen [::]:80;
    server_name fleet.valtara.ai;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logging
    access_log /var/log/nginx/fleet-access.log;
    error_log /var/log/nginx/fleet-error.log;

    # Client settings
    client_max_body_size 10M;
    client_body_timeout 30s;
    client_header_timeout 30s;

    # Rate limiting
    limit_req zone=fleet_limit burst=20 nodelay;

    # Root location
    location / {
        proxy_pass http://fleet_backend;
        proxy_http_version 1.1;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static assets caching
    location /_next/static {
        proxy_pass http://fleet_backend;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    # Next.js image optimization
    location /_next/image {
        proxy_pass http://fleet_backend;
        proxy_cache_valid 200 60m;
    }

    # Favicon
    location /favicon.ico {
        proxy_pass http://fleet_backend;
        access_log off;
    }

    # Robots.txt
    location /robots.txt {
        proxy_pass http://fleet_backend;
        access_log off;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/fleet.valtara.ai /etc/nginx/sites-enabled/

# Remove default site if exists
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# If test passes, reload Nginx
systemctl reload nginx

# Check Nginx status
systemctl status nginx
```

### Verify HTTP Access
```bash
# Test from server
curl -I http://localhost:3000
curl -I http://fleet.valtara.ai

# Check from your browser
# Visit: http://fleet.valtara.ai
```

---

## 🔒 Part 6: Setup SSL Certificate

### Install SSL with Let's Encrypt
```bash
# Install Certbot for Nginx
apt install -y python3-certbot-nginx

# Obtain and install SSL certificate
certbot --nginx -d fleet.valtara.ai

# Follow the prompts:
# 1. Enter your email address
# 2. Agree to terms of service (Y)
# 3. Choose whether to share email (Y/N)
# 4. Select option 2: Redirect HTTP to HTTPS

# Verify SSL certificate
certbot certificates

# Test automatic renewal
certbot renew --dry-run
```

### SSL Auto-Renewal (Already configured by Certbot)
```bash
# Check renewal timer
systemctl status certbot.timer

# Manual renewal (if needed)
certbot renew
systemctl reload nginx
```

---

## ✅ Part 7: Final Verification

### Check All Services
```bash
# Check PM2 process
pm2 status
pm2 logs fleet-lms --lines 30

# Check Nginx
systemctl status nginx
nginx -t

# Check listening ports
ss -tulnp | grep -E ':(80|443|3000)'

# Check application logs
tail -f /var/www/fleet-lms/logs/combined.log

# Check Nginx logs
tail -f /var/log/nginx/fleet-error.log
```

### Test the Deployment
```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://fleet.valtara.ai

# Test HTTPS
curl -I https://fleet.valtara.ai

# Test local backend
curl -I http://localhost:3000
```

### From Your Browser
1. Visit: https://fleet.valtara.ai
2. Verify SSL certificate (should show green lock)
3. Test all pages and features
4. Check browser console for errors

---

## 🔄 Part 8: Maintenance Commands

### Update Application
```bash
cd /var/www/fleet-lms

# Backup current version
tar -czf ~/backups/fleet-lms-$(date +%Y%m%d-%H%M%S).tar.gz .

# Pull new code or upload new files
# ... upload new files ...

# Rebuild
npm ci --production=false
npm run build

# Restart
pm2 restart fleet-lms
pm2 logs fleet-lms --lines 20
```

### View Logs
```bash
# PM2 logs
pm2 logs fleet-lms
pm2 logs fleet-lms --lines 100
pm2 logs fleet-lms -f  # Follow mode

# Nginx logs
tail -f /var/log/nginx/fleet-access.log
tail -f /var/log/nginx/fleet-error.log

# Application logs
tail -f /var/www/fleet-lms/logs/combined.log
```

### Restart Services
```bash
# Restart application
pm2 restart fleet-lms

# Reload Nginx (no downtime)
systemctl reload nginx

# Restart Nginx (brief downtime)
systemctl restart nginx

# Restart both
pm2 restart fleet-lms && systemctl reload nginx
```

### Monitor Resources
```bash
# Check disk space
df -h

# Check memory
free -h

# Check CPU and processes
top
htop  # If installed

# PM2 monitoring
pm2 monit
```

---

## 🆘 Troubleshooting

### Application Won't Start
```bash
cd /var/www/fleet-lms

# Check logs
pm2 logs fleet-lms --lines 50

# Rebuild
npm ci --production=false
npm run build

# Restart
pm2 delete fleet-lms
pm2 start ecosystem.config.js
```

### 502 Bad Gateway
```bash
# Check if app is running
pm2 status
curl http://localhost:3000

# Restart app
pm2 restart fleet-lms

# Check Nginx error logs
tail -f /var/log/nginx/fleet-error.log

# Verify Nginx config
nginx -t
systemctl reload nginx
```

### Port Already in Use
```bash
# Find what's using port 3000
lsof -i :3000
netstat -tlnp | grep :3000

# Kill the process if needed
kill -9 <PID>

# Restart your app
pm2 restart fleet-lms
```

### SSL Issues
```bash
# Check certificate
certbot certificates

# Renew certificate
certbot renew --force-renewal

# Reload Nginx
systemctl reload nginx

# Check SSL configuration
openssl s_client -connect fleet.valtara.ai:443 -servername fleet.valtara.ai
```

### DNS Not Resolving
```bash
# Check DNS records (from your Windows machine)
nslookup fleet.valtara.ai
ping fleet.valtara.ai

# Should point to: 49.13.239.172

# Update DNS settings with your domain registrar
# A Record: fleet.valtara.ai -> 49.13.239.172
```

---

## 📊 Health Checks

### Create Health Check Script
```bash
cat > /root/check-fleet-health.sh << 'EOF'
#!/bin/bash
echo "=== Fleet LMS Health Check ==="
echo ""
echo "PM2 Status:"
pm2 status fleet-lms
echo ""
echo "Port 3000:"
ss -tlnp | grep :3000
echo ""
echo "Nginx Status:"
systemctl status nginx --no-pager
echo ""
echo "Local Test:"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
echo ""
echo "Public Test:"
curl -s -o /dev/null -w "%{http_code}" https://fleet.valtara.ai
echo ""
echo "Disk Space:"
df -h /var/www
echo ""
echo "Memory:"
free -h
EOF

chmod +x /root/check-fleet-health.sh

# Run health check
/root/check-fleet-health.sh
```

---

## 🎯 Quick Reference

### Essential Commands
```bash
# App status
pm2 status

# View logs
pm2 logs fleet-lms -f

# Restart app
pm2 restart fleet-lms

# Nginx reload
systemctl reload nginx

# Full health check
/root/check-fleet-health.sh

# Test site
curl -I https://fleet.valtara.ai
```

### Important Paths
- **Application**: `/var/www/fleet-lms`
- **Logs**: `/var/www/fleet-lms/logs/`
- **Nginx Config**: `/etc/nginx/sites-available/fleet.valtara.ai`
- **SSL Certs**: `/etc/letsencrypt/live/fleet.valtara.ai/`

---

## ✨ Post-Deployment Checklist

- [ ] Application built successfully
- [ ] PM2 process running (green/online)
- [ ] Port 3000 responding locally
- [ ] Nginx configured and running
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate valid
- [ ] Domain resolves correctly
- [ ] All pages load properly
- [ ] PM2 startup configured
- [ ] SSL auto-renewal tested
- [ ] Firewall configured
- [ ] Logs accessible

---

## 📞 Support

If you encounter issues:

1. Check logs: `pm2 logs fleet-lms --lines 50`
2. Check Nginx: `tail -f /var/log/nginx/fleet-error.log`
3. Run health check: `/root/check-fleet-health.sh`
4. Verify DNS: `nslookup fleet.valtara.ai`

---

**Deployment Date**: November 6, 2025
**Server**: 91.99.79.131 (49.13.239.172)
**Domain**: fleet.valtara.ai
**Port**: 3000
