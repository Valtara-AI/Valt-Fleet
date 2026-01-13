# 🚀 Fleet Management LMS - Quick Deployment Guide

## Server Information
- **Domain**: fleet.valtara.ai  
- **IP**: 49.13.239.172 / 91.99.79.131
- **User**: root (password authentication)
- **App Port**: 3000

---

## ⚡ Quick Deploy (3 Methods)

### Method 1: Automated PowerShell Deployment (RECOMMENDED)

**From Windows PowerShell in `D:\DO\Fleet Management`:**

```powershell
# Run the automated deployment script
.\deployment\deploy.ps1
```

This will:
1. Upload all files to server
2. Install dependencies
3. Build the application
4. Setup PM2
5. Configure Nginx
6. Start the application

---

### Method 2: Manual SCP Upload + Remote Script

**Step 1: Upload files (from PowerShell)**
```powershell
cd "D:\DO\Fleet Management"

# Upload application files
scp -r app src public package.json package-lock.json next.config.mjs tsconfig.json next-env.d.ts root@91.99.79.131:/var/www/fleet-lms/

# Upload deployment scripts
scp -r deployment root@91.99.79.131:/var/www/fleet-lms/
```

**Step 2: Connect and deploy**
```bash
ssh root@91.99.79.131

# Run deployment script
cd /var/www/fleet-lms
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

---

### Method 3: Step-by-Step Manual (Most Control)

#### A. Connect to Server
```bash
ssh root@91.99.79.131
# Enter password when prompted
```

#### B. Quick Setup Commands
```bash
# 1. Create directory
mkdir -p /var/www/fleet-lms/logs

# 2. Upload files (from your Windows machine in another terminal)
# Use WinSCP, FileZilla, or scp command

# 3. Install and build (on server)
cd /var/www/fleet-lms
npm ci --production=false
npm run build

# 4. Start with PM2
npm install -g pm2
pm2 start npm --name fleet-lms -- start
pm2 save
pm2 startup

# 5. Setup Nginx
cat > /etc/nginx/sites-available/fleet.valtara.ai << 'EOF'
upstream fleet_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name fleet.valtara.ai;

    location / {
        proxy_pass http://fleet_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/fleet.valtara.ai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# 6. Setup SSL
certbot --nginx -d fleet.valtara.ai
```

---

## ✅ Verification Steps

### 1. Check PM2 Status
```bash
pm2 status
pm2 logs fleet-lms --lines 20
```

Should show: **status: online**

### 2. Test Local Port
```bash
curl -I http://localhost:3000
```

Should return: **HTTP/1.1 200 OK**

### 3. Test Nginx
```bash
systemctl status nginx
curl -I http://fleet.valtara.ai
```

### 4. Check Ports
```bash
ss -tulnp | grep -E ':(80|443|3000)'
```

Should show Nginx on 80/443, Node on 3000

### 5. Test from Browser
- HTTP: http://fleet.valtara.ai (should work or redirect to HTTPS)
- HTTPS: https://fleet.valtara.ai (after SSL setup)

---

## 🔧 Common Issues & Fixes

### Issue: Port 3000 Already in Use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Restart your app
pm2 restart fleet-lms
```

### Issue: 502 Bad Gateway
```bash
# Check if app is running
pm2 status
pm2 logs fleet-lms

# Restart app
pm2 restart fleet-lms

# Check Nginx logs
tail -f /var/log/nginx/error.log
```

### Issue: Build Failed
```bash
cd /var/www/fleet-lms

# Clear node_modules and rebuild
rm -rf node_modules .next
npm ci --production=false
npm run build

pm2 restart fleet-lms
```

### Issue: SSL Certificate Failed
```bash
# Make sure DNS points to server first
nslookup fleet.valtara.ai  # Should show your IP

# Try again
certbot --nginx -d fleet.valtara.ai

# Check certificate
certbot certificates
```

---

## 📋 Essential Commands

### Application Management
```bash
pm2 status                    # Check status
pm2 logs fleet-lms            # View logs
pm2 logs fleet-lms -f         # Follow logs
pm2 restart fleet-lms         # Restart app
pm2 stop fleet-lms            # Stop app
pm2 start fleet-lms           # Start app
pm2 monit                     # Monitor resources
```

### Nginx Management
```bash
systemctl status nginx        # Check status
systemctl reload nginx        # Reload config (no downtime)
systemctl restart nginx       # Restart (brief downtime)
nginx -t                      # Test configuration
tail -f /var/log/nginx/fleet-error.log   # View error logs
```

### SSL Management
```bash
certbot certificates          # List certificates
certbot renew                 # Renew certificates
certbot renew --dry-run      # Test renewal
```

### System Monitoring
```bash
df -h                         # Disk space
free -h                       # Memory usage
top                          # CPU/Process monitor
ss -tulnp                    # Open ports
```

---

## 🔄 Update Deployment

When you need to deploy updates:

### Quick Update
```bash
# On server
cd /var/www/fleet-lms

# Backup current version
tar -czf ~/fleet-backup-$(date +%Y%m%d).tar.gz .

# Upload new files from Windows
# (use SCP/WinSCP/FileZilla)

# Rebuild and restart
npm ci --production=false
npm run build
pm2 restart fleet-lms
```

### Zero-Downtime Update
```bash
# Build in a separate directory
cd ~
mkdir temp-build
cd temp-build

# Upload new files here, build
npm ci --production=false
npm run build

# Quick swap
cd /var/www
mv fleet-lms fleet-lms-old
mv ~/temp-build fleet-lms

# Restart
pm2 restart fleet-lms

# If successful, remove old
rm -rf fleet-lms-old
```

---

## 🔒 Security Checklist

- [ ] SSH key authentication enabled (optional but recommended)
- [ ] Firewall (UFW) configured
- [ ] SSL certificate installed
- [ ] Environment variables secured (chmod 600 .env)
- [ ] Nginx security headers enabled
- [ ] PM2 process running as non-root user (optional)
- [ ] Regular backups configured
- [ ] Fail2ban installed (optional)

---

## 📞 Quick Help

### View Full Documentation
```bash
cat /var/www/fleet-lms/deployment/DEPLOY-FLEET-LMS.md
```

### Health Check
```bash
# Quick status check
pm2 status && systemctl status nginx

# Full health check
curl -I http://localhost:3000
curl -I https://fleet.valtara.ai
ss -tulnp | grep -E ':(80|443|3000)'
```

### Get Help
```bash
pm2 --help
nginx -h
certbot --help
```

---

## 📝 Important Files

| Path | Description |
|------|-------------|
| `/var/www/fleet-lms/` | Application root |
| `/var/www/fleet-lms/logs/` | Application logs |
| `/etc/nginx/sites-available/fleet.valtara.ai` | Nginx config |
| `/etc/letsencrypt/live/fleet.valtara.ai/` | SSL certificates |
| `~/deployment/DEPLOY-FLEET-LMS.md` | Full documentation |

---

## ⏱️ Expected Timeline

- File upload: 2-5 minutes
- Dependencies install: 3-5 minutes  
- Build: 2-4 minutes
- Nginx setup: 1 minute
- SSL setup: 2 minutes
- **Total: ~10-20 minutes**

---

## ✨ Success Indicators

When deployment is successful, you should see:

1. ✅ PM2 shows "online" status
2. ✅ `curl localhost:3000` returns 200 OK
3. ✅ Nginx is active and running
4. ✅ Domain resolves to your server
5. ✅ Website loads in browser
6. ✅ SSL certificate is valid (green lock)

---

**Ready to deploy? Run:**
```powershell
cd "D:\DO\Fleet Management"
.\deployment\deploy.ps1
```

Or follow the manual steps above!

---

*Last Updated: November 6, 2025*  
*Server: 91.99.79.131*  
*Domain: fleet.valtara.ai*
