# ✅ Fleet Management LMS - Deployment Checklist

Use this checklist to track your deployment progress.

---

## Pre-Deployment

- [ ] Server access verified (root@91.99.79.131)
- [ ] Domain DNS configured (fleet.valtara.ai → 49.13.239.172)
- [ ] Project builds successfully locally (`npm run build`)
- [ ] All files committed and ready

---

## Server Preparation

- [ ] Node.js 18+ installed
- [ ] NPM installed
- [ ] PM2 installed globally
- [ ] Nginx installed
- [ ] Certbot installed
- [ ] Firewall configured (UFW)
- [ ] Application directory created (`/var/www/fleet-lms`)

### Commands:
```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs nginx certbot python3-certbot-nginx
npm install -g pm2@latest
mkdir -p /var/www/fleet-lms/{logs,backups,public/assets}
```

---

## File Upload

- [ ] `app/` directory uploaded
- [ ] `src/` directory uploaded
- [ ] `public/` directory uploaded
- [ ] `package.json` uploaded
- [ ] `package-lock.json` uploaded
- [ ] `next.config.mjs` uploaded
- [ ] `tsconfig.json` uploaded
- [ ] `next-env.d.ts` uploaded
- [ ] `ecosystem.config.js` uploaded

### Commands:
```powershell
cd "D:\DO\Fleet Management"
scp -r app src public package.json package-lock.json next.config.mjs tsconfig.json next-env.d.ts root@91.99.79.131:/var/www/fleet-lms/
scp deployment/ecosystem.config.js root@91.99.79.131:/var/www/fleet-lms/
```

---

## Application Build

- [ ] Dependencies installed (`npm ci`)
- [ ] Production build completed (`npm run build`)
- [ ] `.next` directory created
- [ ] No build errors
- [ ] Environment file created (`.env.production`)

### Commands:
```bash
cd /var/www/fleet-lms
npm ci --production=false
npm run build
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
EOF
chmod 600 .env.production
```

---

## PM2 Configuration

- [ ] PM2 process started
- [ ] Process status: **online** (not errored)
- [ ] PM2 configuration saved
- [ ] PM2 startup configured
- [ ] Logs accessible

### Commands:
```bash
pm2 start npm --name fleet-lms -- start
pm2 status
pm2 save
pm2 startup systemd -u root --hp /root
pm2 logs fleet-lms --lines 20
```

### Verification:
```bash
# Should show "online"
pm2 list

# Should return HTTP 200
curl -I http://localhost:3000
```

---

## Nginx Configuration

- [ ] Nginx config file created
- [ ] Site enabled (symlink created)
- [ ] Default site disabled
- [ ] Nginx configuration test passed
- [ ] Nginx reloaded/restarted
- [ ] Nginx status: active

### Commands:
```bash
# Create config (see deploy-commands.txt for full config)
nano /etc/nginx/sites-available/fleet.valtara.ai

# Enable site
ln -sf /etc/nginx/sites-available/fleet.valtara.ai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload
nginx -t
systemctl reload nginx
systemctl status nginx
```

### Verification:
```bash
# Should return HTTP 200
curl -I http://fleet.valtara.ai

# Should see nginx listening
ss -tulnp | grep ':80'
```

---

## SSL Certificate

- [ ] Certbot command executed
- [ ] Email provided
- [ ] Terms accepted
- [ ] Certificate obtained
- [ ] HTTP to HTTPS redirect configured
- [ ] Certificate auto-renewal tested

### Commands:
```bash
certbot --nginx -d fleet.valtara.ai
certbot certificates
certbot renew --dry-run
```

### Verification:
```bash
# Should return HTTP/2 200 with SSL
curl -I https://fleet.valtara.ai

# Check certificate expiry
openssl s_client -connect fleet.valtara.ai:443 -servername fleet.valtara.ai 2>/dev/null | openssl x509 -noout -dates
```

---

## Firewall Configuration

- [ ] SSH port allowed (22)
- [ ] HTTP port allowed (80)
- [ ] HTTPS port allowed (443)
- [ ] Firewall enabled
- [ ] Firewall status verified

### Commands:
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

---

## Final Verification

### Application Status
- [ ] PM2 shows process as **online**
- [ ] Application responds on port 3000
- [ ] No errors in PM2 logs
- [ ] Memory usage reasonable

```bash
pm2 status
pm2 monit
pm2 logs fleet-lms --lines 50
```

### Web Access
- [ ] HTTP redirects to HTTPS
- [ ] HTTPS loads successfully
- [ ] SSL certificate valid (green lock)
- [ ] All pages accessible
- [ ] No console errors in browser

```bash
curl -I http://fleet.valtara.ai
curl -I https://fleet.valtara.ai
```

### Services Running
- [ ] Node.js process running (port 3000)
- [ ] Nginx running (ports 80, 443)
- [ ] PM2 running
- [ ] No port conflicts

```bash
ss -tulnp | grep -E ':(80|443|3000)'
systemctl status nginx
pm2 status
```

### Browser Tests
- [ ] Visit https://fleet.valtara.ai
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Images load
- [ ] No 404 errors
- [ ] Mobile responsive

---

## Post-Deployment

- [ ] PM2 startup on boot configured
- [ ] SSL auto-renewal verified
- [ ] Monitoring setup (optional)
- [ ] Backup strategy planned
- [ ] Documentation reviewed
- [ ] Admin credentials secured
- [ ] Error logging configured

### Commands:
```bash
# Verify PM2 startup
systemctl status pm2-root

# Check SSL renewal timer
systemctl status certbot.timer

# Create backup
cd /var/www
tar -czf ~/fleet-lms-backup-$(date +%Y%m%d).tar.gz fleet-lms/
```

---

## Health Checks

Run these periodically to ensure everything is working:

```bash
# Quick status
pm2 status && systemctl status nginx

# Application health
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
curl -s -o /dev/null -w "%{http_code}" https://fleet.valtara.ai

# Disk space
df -h /var/www

# Memory
free -h

# Logs
pm2 logs fleet-lms --lines 20 --nostream
tail -20 /var/log/nginx/fleet-error.log
```

---

## Troubleshooting

### If PM2 process is errored:
```bash
pm2 logs fleet-lms --lines 100
cd /var/www/fleet-lms
npm ci --production=false
npm run build
pm2 restart fleet-lms
```

### If Nginx returns 502:
```bash
pm2 status
systemctl status nginx
tail -f /var/log/nginx/fleet-error.log
pm2 restart fleet-lms
```

### If SSL doesn't work:
```bash
certbot certificates
certbot renew --force-renewal
systemctl reload nginx
```

---

## Success Criteria

Your deployment is successful when:

1. ✅ `pm2 status` shows fleet-lms as **online**
2. ✅ `curl http://localhost:3000` returns **200 OK**
3. ✅ `systemctl status nginx` shows **active (running)**
4. ✅ `https://fleet.valtara.ai` loads in browser
5. ✅ SSL certificate shows **valid** (green lock)
6. ✅ All pages and features work
7. ✅ No errors in logs
8. ✅ PM2 survives server reboot

---

## Deployment Complete! 🎉

**Your application is now live at:**
### 🌐 https://fleet.valtara.ai

---

**Deployment Date:** __________  
**Deployed By:** __________  
**Server:** 91.99.79.131 (49.13.239.172)  
**Stack:** Next.js + PM2 + Nginx + Let's Encrypt

---

## Quick Reference

```bash
# View status
pm2 status

# View logs
pm2 logs fleet-lms -f

# Restart app
pm2 restart fleet-lms

# Reload Nginx
systemctl reload nginx

# Check site
curl -I https://fleet.valtara.ai
```

---

*Keep this checklist for future deployments and updates!*
