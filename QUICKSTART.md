# 🚀 QUICK START GUIDE - Fleet Management v3.0

## ⚡ IMMEDIATE FIX (30 seconds)

```powershell
cd "d:\DO\Fleet Management\deployment"
.\quick-fix.bat
```

---

## 🎯 FULL SECURITY DEPLOYMENT (10 minutes)

### Step 1: Open PowerShell as Administrator
```powershell
cd "d:\DO\Fleet Management"
```

### Step 2: Configure Environment
```powershell
copy .env.example .env
notepad .env
```
Add your API key (generate one: use a password generator with 32+ characters)

### Step 3: Deploy Everything
```powershell
cd deployment
.\deploy-secure.bat
```

### Step 4: Verify
```powershell
curl https://fleet.valtara.ai/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "version": "3.0.0",
  "security": "enabled",
  "timestamp": "2025-12-13T..."
}
```

---

## 📊 WHAT GETS DEPLOYED

```
┌─────────────────────────────────────────────┐
│        FLEET MANAGEMENT v3.0                │
│        Security Architecture                │
└─────────────────────────────────────────────┘

Layer 1: Client/Browser
   ↓ HTTPS (TLS 1.2/1.3)
   
Layer 2: Cloudflare/CDN (optional)
   ↓ DDoS Protection Layer 7
   
Layer 3: Nginx (Port 443/80)
   │ ✓ Rate Limiting (10 req/s)
   │ ✓ Connection Limits (10/IP)
   │ ✓ Bad Bot Blocking
   │ ✓ Request Size Limits
   │ ✓ SSL Termination
   ↓ Reverse Proxy
   
Layer 4: Node.js App (Port 3000)
   │ ✓ Rate Limiting (100 req/min)
   │ ✓ Burst Protection (20 req/s)
   │ ✓ IP Blocking
   │ ✓ Request Validation
   │ ✓ Security Headers
   │ ✓ CORS Protection
   │ ✓ Real-time Monitoring
   ↓ Application Logic
   
Layer 5: System Security
   │ ✓ UFW Firewall
   │ ✓ Fail2Ban
   │ ✓ IPTables Rules
   │ ✓ Kernel Hardening
   └─ Server (188.245.43.183)
```

---

## 🛡️ PROTECTION METRICS

| Feature | Threshold | Action |
|---------|-----------|--------|
| Rate Limit | 100 req/min | 15 min block |
| Burst | 20 req/sec | Immediate block |
| Violations | 3 times | 24h auto-ban |
| Request Size | 1 MB max | Reject |
| URL Length | 2048 chars | Reject |
| Connection/IP | 10 max | Drop new |
| Login Attempts | 5/min | Block IP |

---

## 🔍 MONITORING COMMANDS

### Quick Status Check
```bash
ssh -i "ubuntu-ky.pem" root@188.245.43.183 "pm2 list && ufw status"
```

### View Security Events
```bash
ssh -i "ubuntu-ky.pem" root@188.245.43.183 "tail -50 /var/www/fleet.valtara.ai/logs/security/security-events.log"
```

### Check Blocked IPs
```bash
ssh -i "ubuntu-ky.pem" root@188.245.43.183 "fail2ban-client status nginx-limit-req"
```

### Monitor Live Traffic
```bash
ssh -i "ubuntu-ky.pem" root@188.245.43.183 "tail -f /var/log/nginx/fleet.valtara.ai.access.log"
```

---

## 🚨 EMERGENCY PROCEDURES

### Server Not Responding
```bash
ssh -i "ubuntu-ky.pem" root@188.245.43.183
pm2 restart all
systemctl restart nginx
```

### Under Attack
```bash
# Block attacking IP immediately
ssh -i "ubuntu-ky.pem" root@188.245.43.183 "ufw insert 1 deny from <ATTACKING_IP>"

# Check top attackers
ssh -i "ubuntu-ky.pem" root@188.245.43.183 "netstat -ntu | awk '{print \$5}' | cut -d: -f1 | sort | uniq -c | sort -n | tail -20"
```

### Unblock Legitimate IP
```bash
ssh -i "ubuntu-ky.pem" root@188.245.43.183 "/usr/local/bin/unblock-ip.sh <IP>"
```

---

## ✅ SUCCESS INDICATORS

After deployment, you should see:

1. **Application Health**: `https://fleet.valtara.ai/health` returns 200 OK
2. **PM2 Running**: `pm2 list` shows "online" status
3. **Nginx Active**: `systemctl status nginx` shows "active (running)"
4. **Firewall Active**: `ufw status` shows "Status: active"
5. **Fail2Ban Active**: `fail2ban-client status` shows active jails
6. **No 502 Errors**: Website loads normally
7. **Security Headers**: Response includes HSTS, CSP, etc.

---

## 📞 NEXT STEPS

1. **Test Application**: Visit https://fleet.valtara.ai
2. **Monitor for 24h**: Watch logs for any issues
3. **Contact Hetzner**: Request IP unblock for realtor.valtara.ai (49.13.239.172)
4. **Document**: Note any IPs that should be whitelisted
5. **Backup**: Save security configurations

---

## 💾 FILES TO BACKUP

After successful deployment, backup these:
- `/etc/nginx/sites-available/fleet.valtara.ai`
- `/etc/fail2ban/jail.local`
- `/etc/fail2ban/filter.d/` (custom filters)
- `/var/www/fleet.valtara.ai/.env`
- `/var/www/fleet.valtara.ai/ecosystem.config.js`

---

## 🎓 LEARN MORE

- **Full Guide**: See `SECURITY-DEPLOYMENT.md`
- **Detailed README**: See `SECURITY-README.md`
- **Code Documentation**: See `src/middleware/*.ts`

---

## 🆘 NEED HELP?

1. Check logs: `.\quick-fix.bat`
2. Review: `SECURITY-DEPLOYMENT.md`
3. Test: `curl -I https://fleet.valtara.ai`

---

**Ready to deploy? Run:**
```powershell
cd "d:\DO\Fleet Management\deployment"
.\deploy-secure.bat
```

🎉 **Your fleet management system will be DDoS-protected in ~10 minutes!**
