# 🚀 Fleet Management LMS - Deployment Package

Complete deployment resources for deploying Fleet Management LMS to production.

## 📁 Files in This Directory

| File | Description | Use When |
|------|-------------|----------|
| **QUICKSTART.md** | ⚡ Quick start guide with 3 deployment methods | Start here! |
| **DEPLOY-FLEET-LMS.md** | 📖 Complete step-by-step documentation | Need detailed instructions |
| **deploy.ps1** | 🪟 Windows PowerShell deployment script | Deploying from Windows (automated) |
| **deploy.sh** | 🐧 Linux bash deployment script | Running on server |
| **quick-deploy.sh** | ⚡ One-command deploy script | Ultra-fast deployment |
| **ecosystem.config.js** | ⚙️ PM2 process configuration | Used by PM2 |

---

## 🎯 Quick Start (Choose One)

### Option 1: Automated Windows Deployment (EASIEST)
```powershell
cd "D:\DO\Fleet Management"
.\deployment\deploy.ps1
```
**Time**: ~10 minutes | **Difficulty**: ⭐☆☆☆☆

### Option 2: Copy Files + Run Script
```bash
# 1. Upload files via WinSCP/FileZilla to /var/www/fleet-lms
# 2. SSH to server
ssh root@91.99.79.131

# 3. Run deployment script
cd /var/www/fleet-lms
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```
**Time**: ~15 minutes | **Difficulty**: ⭐⭐☆☆☆

### Option 3: Manual Step-by-Step
See **DEPLOY-FLEET-LMS.md** for complete instructions.

**Time**: ~20 minutes | **Difficulty**: ⭐⭐⭐☆☆

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [x] Server access (root@91.99.79.131 with password)
- [x] Domain configured (fleet.valtara.ai → 49.13.239.172)
- [x] Project built successfully locally
- [x] SSH client installed (Windows: Built-in, or PuTTY)
- [x] File transfer tool (SCP, WinSCP, or FileZilla)

---

## 🔧 Server Setup (First Time Only)

If your server is fresh, install these first:

```bash
ssh root@91.99.79.131

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install other tools
apt install -y nginx certbot python3-certbot-nginx git build-essential

# Install PM2
npm install -g pm2@latest

# Verify
node --version  # Should show v18.x
pm2 --version
nginx -v
```

---

## 🌐 DNS Configuration

Make sure your DNS is configured correctly:

**DNS Records:**
```
Type: A
Host: fleet
Value: 49.13.239.172
TTL: 3600
```

**Verify DNS:**
```bash
nslookup fleet.valtara.ai
# Should return: 49.13.239.172
```

---

## 🚀 Deployment Steps Summary

1. **Upload Files**
   - Transfer project files to `/var/www/fleet-lms`
   
2. **Install & Build**
   - `npm ci --production=false`
   - `npm run build`
   
3. **Start Application**
   - `pm2 start npm --name fleet-lms -- start`
   - `pm2 save && pm2 startup`
   
4. **Configure Nginx**
   - Create config in `/etc/nginx/sites-available/`
   - Enable site and reload nginx
   
5. **Setup SSL**
   - `certbot --nginx -d fleet.valtara.ai`

---

## ✅ Verification

After deployment, verify everything works:

### 1. PM2 Status
```bash
pm2 status
# Should show: fleet-lms | online
```

### 2. Application Port
```bash
curl -I http://localhost:3000
# Should return: HTTP/1.1 200 OK
```

### 3. Nginx
```bash
systemctl status nginx
curl -I http://fleet.valtara.ai
```

### 4. SSL Certificate
```bash
curl -I https://fleet.valtara.ai
# Should return: HTTP/2 200
```

### 5. Browser Test
- Visit: https://fleet.valtara.ai
- Should show: Fleet Management LMS homepage
- SSL: Green lock icon visible

---

## 📊 Server Information

| Item | Value |
|------|-------|
| **Primary IP** | 49.13.239.172 |
| **Alt IP** | 91.99.79.131 |
| **Domain** | fleet.valtara.ai |
| **User** | root |
| **App Directory** | /var/www/fleet-lms |
| **App Port** | 3000 |
| **Web Port** | 80 (HTTP), 443 (HTTPS) |
| **PM2 App Name** | fleet-lms |

---

## 🔄 Common Operations

### View Logs
```bash
pm2 logs fleet-lms           # Application logs
pm2 logs fleet-lms -f         # Follow mode
tail -f /var/log/nginx/fleet-error.log  # Nginx errors
```

### Restart Services
```bash
pm2 restart fleet-lms         # Restart app
systemctl reload nginx        # Reload Nginx
```

### Update Application
```bash
cd /var/www/fleet-lms
npm ci --production=false
npm run build
pm2 restart fleet-lms
```

### Check Status
```bash
pm2 status                    # PM2 processes
systemctl status nginx        # Nginx status
ss -tulnp | grep -E ':(80|443|3000)'  # Open ports
```

---

## 🆘 Troubleshooting

### Application Not Starting
```bash
cd /var/www/fleet-lms
pm2 logs fleet-lms --lines 50
npm ci --production=false
npm run build
pm2 restart fleet-lms
```

### 502 Bad Gateway
```bash
pm2 status                    # Check if app is running
pm2 restart fleet-lms         # Restart app
systemctl reload nginx        # Reload Nginx
```

### Port Already in Use
```bash
lsof -i :3000                 # Find process
kill -9 <PID>                 # Kill process
pm2 restart fleet-lms         # Start app
```

### SSL Issues
```bash
certbot certificates          # Check certs
certbot renew --force-renewal # Renew
systemctl reload nginx        # Reload
```

---

## 📚 Documentation

- **Quick Start**: `QUICKSTART.md` - Fast deployment guide
- **Full Guide**: `DEPLOY-FLEET-LMS.md` - Complete documentation
- **This File**: Overview and quick reference

---

## 🔐 Security Notes

After deployment, consider:

1. **SSH Key Authentication** (instead of password)
2. **Fail2ban** (brute-force protection)
3. **Firewall** (UFW configured)
4. **Regular Updates** (`apt update && apt upgrade`)
5. **Backup Strategy** (database and files)
6. **Monitoring** (PM2, logs, uptime)

---

## 📞 Support & Help

### Quick Help
```bash
pm2 --help
nginx -h
certbot --help
```

### Logs Location
- Application: `/var/www/fleet-lms/logs/`
- Nginx: `/var/log/nginx/`
- PM2: `pm2 logs fleet-lms`

### Useful Links
- PM2 Documentation: https://pm2.keymetrics.io/
- Nginx Documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/

---

## ✨ Success Checklist

After deployment, you should have:

- [x] Application deployed to `/var/www/fleet-lms`
- [x] PM2 process running (status: online)
- [x] Nginx configured and active
- [x] SSL certificate installed and valid
- [x] Domain resolving correctly
- [x] Website accessible at https://fleet.valtara.ai
- [x] PM2 auto-start on boot configured
- [x] Firewall configured (ports 80, 443, 22)

---

## 🎉 You're All Set!

Your Fleet Management LMS should now be live at:

**🌐 https://fleet.valtara.ai**

To manage your deployment:
```bash
ssh root@91.99.79.131
pm2 status
pm2 logs fleet-lms
```

---

*Created: November 6, 2025*  
*Server: 91.99.79.131 (49.13.239.172)*  
*Domain: fleet.valtara.ai*  
*Stack: Next.js + PM2 + Nginx + Let's Encrypt*
