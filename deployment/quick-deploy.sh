#!/bin/bash
# Fleet Management LMS - One-Command Deployment
# Upload this script to server and run: bash quick-deploy.sh

echo "🚀 Fleet Management LMS - Quick Deploy"
echo "======================================"

# Install prerequisites
apt update
apt install -y nodejs npm nginx certbot python3-certbot-nginx
npm install -g pm2

# Setup application
cd /var/www/fleet-lms
npm ci --production=false
npm run build

# Start with PM2
pm2 start npm --name fleet-lms -- start
pm2 save
pm2 startup

# Configure Nginx
cat > /etc/nginx/sites-available/fleet.valtara.ai << 'EOF'
upstream fleet_backend { server 127.0.0.1:3000; }
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

ln -sf /etc/nginx/sites-available/fleet.valtara.ai /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Setup SSL
certbot --nginx -d fleet.valtara.ai --non-interactive --agree-tos --email admin@valtara.ai

echo "✅ Deployment Complete!"
echo "Visit: https://fleet.valtara.ai"
pm2 status
