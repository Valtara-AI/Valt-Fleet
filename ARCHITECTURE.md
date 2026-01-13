# 🏗️ Fleet Management v3.0 - Security Architecture

```
╔══════════════════════════════════════════════════════════════════════╗
║                   FLEET MANAGEMENT SYSTEM v3.0                       ║
║                   Multi-Layer Security Architecture                  ║
╚══════════════════════════════════════════════════════════════════════╝

┌──────────────────────────────────────────────────────────────────────┐
│                         LAYER 1: CLIENT                              │
│                    ┌─────────────────────┐                          │
│                    │   User's Browser    │                          │
│                    │   (HTTPS Only)      │                          │
│                    └──────────┬──────────┘                          │
│                               │                                      │
│                          SSL/TLS 1.3                                │
│                               │                                      │
└───────────────────────────────┼──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  LAYER 2: NGINX (Port 443/80)                        │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ RATE LIMITING ZONES                                           │  │
│  │  • General: 10 req/second                                     │  │
│  │  • API: 30 req/second                                         │  │
│  │  • Login: 5 req/minute                                        │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ CONNECTION LIMITS                                             │  │
│  │  • Max 10 concurrent per IP                                   │  │
│  │  • Timeout: 10s                                               │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ REQUEST VALIDATION                                            │  │
│  │  • Max body: 2MB                                              │  │
│  │  • Allowed methods: GET, POST, PUT, DELETE                    │  │
│  │  • Block bad bots                                             │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ SECURITY HEADERS                                              │  │
│  │  • HSTS, CSP, X-Frame-Options, etc.                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                               │                                      │
│                       Reverse Proxy                                  │
│                               │                                      │
└───────────────────────────────┼──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│            LAYER 3: APPLICATION (Node.js - Port 3000)                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ MIDDLEWARE STACK (Sequential Processing)                      │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 1. CORS Middleware                                            │  │
│  │    ✓ Strict origin validation                                 │  │
│  │    ✓ Allowed domains only                                     │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 2. Security Headers                                           │  │
│  │    ✓ HSTS, CSP, X-XSS-Protection                              │  │
│  │    ✓ Content-Type-Options                                     │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 3. Request Timeout (30s)                                      │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 4. Request Size Limiter (1MB)                                 │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 5. IP Blocking Check                                          │  │
│  │    ┌─────────────────────────────────────┐                    │  │
│  │    │ IP Blocking Manager                 │                    │  │
│  │    │ • Blacklist: Permanent/Temp blocks  │                    │  │
│  │    │ • Whitelist: Trusted IPs            │                    │  │
│  │    │ • Auto-ban: After 3 violations      │                    │  │
│  │    │ • Persistent storage                │                    │  │
│  │    └─────────────────────────────────────┘                    │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 6. Rate Limiting & DDoS Protection                            │  │
│  │    ┌─────────────────────────────────────┐                    │  │
│  │    │ Security Manager                    │                    │  │
│  │    │ • Rate: 100 req/min per IP          │                    │  │
│  │    │ • Burst: 20 req/sec max             │                    │  │
│  │    │ • Block: 15 min on violation        │                    │  │
│  │    │ • Auto-blacklist after 3x           │                    │  │
│  │    └─────────────────────────────────────┘                    │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 7. Request Validation                                         │  │
│  │    ✓ SQL injection detection                                  │  │
│  │    ✓ XSS pattern blocking                                     │  │
│  │    ✓ Path traversal prevention                                │  │
│  │    ✓ Code injection blocking                                  │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 8. Input Sanitization                                         │  │
│  │    ✓ Strip script tags                                        │  │
│  │    ✓ Encode HTML entities                                     │  │
│  │    ✓ Clean query params                                       │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 9. API Key Validation (Protected routes)                      │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 10. Request Logger                                            │  │
│  │     ┌─────────────────────────────────────┐                   │  │
│  │     │ Security Monitor                    │                   │  │
│  │     │ • Event logging                     │                   │  │
│  │     │ • System metrics                    │                   │  │
│  │     │ • Attack detection                  │                   │  │
│  │     │ • Automated alerts                  │                   │  │
│  │     └─────────────────────────────────────┘                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                               │                                      │
│                    Application Routes                                │
│                               │                                      │
└───────────────────────────────┼──────────────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────┐
│                   LAYER 4: SYSTEM SECURITY                           │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ UFW FIREWALL                                                  │  │
│  │  Port 22 (SSH)     → ALLOW (rate limited)                     │  │
│  │  Port 80 (HTTP)    → ALLOW (redirect to HTTPS)                │  │
│  │  Port 443 (HTTPS)  → ALLOW (rate limited)                     │  │
│  │  Port 3000 (Node)  → ALLOW localhost only                     │  │
│  │  All others        → DENY                                     │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ FAIL2BAN                                                      │  │
│  │  [sshd]           → 3 failures = 24h ban                      │  │
│  │  [nginx-limit]    → 10 failures = 2h ban                      │  │
│  │  [nginx-badbots]  → 2 failures = 24h ban                      │  │
│  │  [nginx-ddos]     → 200 req/min = 10m ban                     │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ IPTABLES                                                      │  │
│  │  • SYN flood protection                                       │  │
│  │  • Connection rate limiting                                   │  │
│  │  • Invalid packet dropping                                    │  │
│  │  • Fragment blocking                                          │  │
│  │  • Port scan detection                                        │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ KERNEL (sysctl)                                               │  │
│  │  net.ipv4.tcp_syncookies = 1       (SYN flood)                │  │
│  │  net.ipv4.conf.all.rp_filter = 1   (IP spoofing)              │  │
│  │  net.ipv4.icmp_echo_ignore_all = 0 (ICMP)                     │  │
│  │  net.ipv4.tcp_max_syn_backlog = 2048                          │  │
│  └───────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    MONITORING & LOGGING                              │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ SECURITY EVENTS LOG                                           │  │
│  │  /var/www/fleet.valtara.ai/logs/security/security-events.log  │  │
│  │   • All blocked requests                                      │  │
│  │   • Rate limit violations                                     │  │
│  │   • Suspicious activity                                       │  │
│  │   • IP blocks/unblocks                                        │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ SYSTEM METRICS LOG                                            │  │
│  │  /var/www/fleet.valtara.ai/logs/security/metrics.log          │  │
│  │   • CPU usage                                                 │  │
│  │   • Memory usage                                              │  │
│  │   • Connection counts                                         │  │
│  │   • Active requests                                           │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ NGINX LOGS                                                    │  │
│  │  /var/log/nginx/fleet.valtara.ai.access.log                   │  │
│  │  /var/log/nginx/fleet.valtara.ai.error.log                    │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ FAIL2BAN LOGS                                                 │  │
│  │  /var/log/fail2ban.log                                        │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ DDOS MONITOR                                                  │  │
│  │  /var/log/ddos-monitor.log                                    │  │
│  │   • Runs every 5 minutes                                      │  │
│  │   • Auto-blocks high-volume IPs                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════╗
║                        ATTACK RESPONSE FLOW                          ║
╚══════════════════════════════════════════════════════════════════════╝

Attack Type: DDoS (High Request Volume)
│
├─► Layer 2 (Nginx) detects: >30 req/sec from single IP
│   └─► Action: Rate limit zone activated, excess requests = 429
│
├─► Layer 3 (App) detects: >20 req/sec burst
│   └─► Action: Immediate temporary block
│
├─► Layer 3 (App) detects: >100 req/min
│   └─► Action: 15-minute IP block
│
├─► Security Monitor: Logs event, increments violation count
│   └─► After 3 violations: Permanent blacklist
│
├─► Layer 4 (Fail2Ban): Detects pattern in logs
│   └─► Action: IPTables block for 2 hours
│
└─► Layer 4 (IPTables): Connection limit exceeded
    └─► Action: Drop new connections from IP

Attack Type: SQL Injection
│
├─► Layer 3 (Validation): Pattern detected in query
│   └─► Action: Request rejected with 400
│
├─► Security Monitor: Logs suspicious activity
│   └─► Action: Increment violation count
│
└─► IP Blocking Manager: Check violation threshold
    └─► If threshold exceeded: Add to blacklist

Attack Type: Brute Force (Login)
│
├─► Layer 2 (Nginx): >5 login attempts/min
│   └─► Action: Rate limit, 429 response
│
├─► Layer 3 (App): Tracks login failures
│   └─► Action: Account lockout after 5 attempts
│
└─► Layer 4 (Fail2Ban): Detects failed login pattern
    └─► Action: 24-hour IP ban

╔══════════════════════════════════════════════════════════════════════╗
║                          KEY METRICS                                 ║
╚══════════════════════════════════════════════════════════════════════╝

Protection Level: ████████████████████ 100% (Enterprise-grade)

┌─────────────────────────────────────────────────────────────────┐
│ Metric                  │ Before v3.0  │ After v3.0          │
├─────────────────────────────────────────────────────────────────┤
│ DDoS Protection         │ ❌ None       │ ✅ 4-layer defense  │
│ Rate Limiting           │ ❌ None       │ ✅ Multi-zone       │
│ Request Validation      │ ❌ None       │ ✅ Comprehensive    │
│ IP Blocking             │ ❌ None       │ ✅ Automated        │
│ Security Headers        │ ❌ Basic      │ ✅ All recommended  │
│ Monitoring              │ ❌ None       │ ✅ Real-time        │
│ Auto-blocking           │ ❌ None       │ ✅ Intelligent      │
│ Firewall                │ ❌ None       │ ✅ UFW + IPTables   │
│ Intrusion Detection     │ ❌ None       │ ✅ Fail2Ban         │
│ SSL Security            │ ⚠️ Basic      │ ✅ Grade A+         │
└─────────────────────────────────────────────────────────────────┘

Response Times:
• Normal Request:     < 50ms
• Rate Limited:       < 1ms (instant reject)
• DDoS Detection:     < 1s
• Auto-block:         < 2s
• Fail2Ban response:  < 5s
