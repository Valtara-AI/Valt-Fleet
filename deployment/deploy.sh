#!/bin/bash

# Fleet Management LMS - Automated Deployment Script
# Run this on the server after uploading files

set -e  # Exit on any error

echo "=========================================="
echo "Fleet Management LMS Deployment Script"
echo "=========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/var/www/fleet-lms"
DOMAIN="fleet.valtara.ai"
PORT="3000"
APP_NAME="fleet-lms"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}Please run as root${NC}"
   exit 1
fi

echo -e "${GREEN}✓${NC} Running as root"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check prerequisites
echo ""
echo "Step 1: Checking prerequisites..."
echo "-----------------------------------"

if command_exists node; then
    echo -e "${GREEN}✓${NC} Node.js installed: $(node --version)"
else
    echo -e "${RED}✗${NC} Node.js not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
fi

if command_exists npm; then
    echo -e "${GREEN}✓${NC} npm installed: $(npm --version)"
fi

if command_exists pm2; then
    echo -e "${GREEN}✓${NC} PM2 installed: $(pm2 --version)"
else
    echo -e "${RED}✗${NC} PM2 not found. Installing..."
    npm install -g pm2@latest
fi

if command_exists nginx; then
    echo -e "${GREEN}✓${NC} Nginx installed: $(nginx -v 2>&1)"
else
    echo -e "${RED}✗${NC} Nginx not found. Installing..."
    apt install -y nginx
fi

# Step 2: Setup application directory
echo ""
echo "Step 2: Setting up application directory..."
echo "-------------------------------------------"

if [ ! -d "$APP_DIR" ]; then
    echo -e "${YELLOW}!${NC} Creating directory: $APP_DIR"
    mkdir -p "$APP_DIR"
fi

cd "$APP_DIR"
echo -e "${GREEN}✓${NC} Working directory: $(pwd)"

# Create necessary subdirectories
mkdir -p logs backups public/assets
echo -e "${GREEN}✓${NC} Created subdirectories"

# Step 3: Install dependencies and build
echo ""
echo "Step 3: Installing dependencies and building..."
echo "-----------------------------------------------"

if [ -f "package.json" ]; then
    echo "Installing dependencies..."
    npm ci --production=false
    echo -e "${GREEN}✓${NC} Dependencies installed"
    
    echo "Building application..."
    npm run build
    echo -e "${GREEN}✓${NC} Application built"
else
    echo -e "${RED}✗${NC} package.json not found. Please upload application files first."
    exit 1
fi

# Step 4: Setup environment file
echo ""
echo "Step 4: Checking environment configuration..."
echo "----------------------------------------------"

if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}!${NC} Creating default .env.production"
    cat > .env.production << EOF
NODE_ENV=production
PORT=${PORT}
NEXT_TELEMETRY_DISABLED=1
# Add your environment variables below:
# DATABASE_URL=
# API_KEY=
EOF
    chmod 600 .env.production
    echo -e "${YELLOW}!${NC} Please edit .env.production with your actual values"
else
    echo -e "${GREEN}✓${NC} .env.production exists"
fi

# Step 5: Setup PM2
echo ""
echo "Step 5: Configuring PM2..."
echo "--------------------------"

# Stop existing process if running
if pm2 list | grep -q "$APP_NAME"; then
    echo "Stopping existing PM2 process..."
    pm2 stop "$APP_NAME"
    pm2 delete "$APP_NAME"
fi

# Start with ecosystem file
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js
else
    echo -e "${YELLOW}!${NC} ecosystem.config.js not found, using default config"
    pm2 start npm --name "$APP_NAME" -- start
fi

pm2 save
echo -e "${GREEN}✓${NC} PM2 configured and started"

# Setup PM2 startup
echo "Configuring PM2 startup..."
pm2 startup systemd -u root --hp /root
echo -e "${GREEN}✓${NC} PM2 startup configured"

# Step 6: Test local access
echo ""
echo "Step 6: Testing local application..."
echo "------------------------------------"

sleep 3  # Give app time to start

if curl -s -o /dev/null -w "%{http_code}" http://localhost:${PORT} | grep -q "200"; then
    echo -e "${GREEN}✓${NC} Application responding on port ${PORT}"
else
    echo -e "${RED}✗${NC} Application not responding. Check logs with: pm2 logs ${APP_NAME}"
fi

# Step 7: Configure Nginx
echo ""
echo "Step 7: Configuring Nginx..."
echo "----------------------------"

NGINX_CONFIG="/etc/nginx/sites-available/${DOMAIN}"

cat > "$NGINX_CONFIG" << 'NGINXEOF'
# Rate limiting
limit_req_zone $binary_remote_addr zone=fleet_limit:10m rate=10r/s;

# Upstream backend
upstream fleet_backend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP Server
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
NGINXEOF

echo -e "${GREEN}✓${NC} Nginx configuration created"

# Enable site
ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
echo -e "${GREEN}✓${NC} Site enabled"

# Test and reload Nginx
if nginx -t; then
    systemctl reload nginx
    echo -e "${GREEN}✓${NC} Nginx reloaded successfully"
else
    echo -e "${RED}✗${NC} Nginx configuration test failed"
    exit 1
fi

# Step 8: Configure firewall
echo ""
echo "Step 8: Configuring firewall..."
echo "--------------------------------"

if command_exists ufw; then
    ufw allow OpenSSH
    ufw allow 'Nginx Full'
    ufw --force enable
    echo -e "${GREEN}✓${NC} Firewall configured"
else
    echo -e "${YELLOW}!${NC} UFW not installed, skipping firewall configuration"
fi

# Step 9: Summary
echo ""
echo "=========================================="
echo "Deployment Summary"
echo "=========================================="
echo ""
echo -e "${GREEN}✓${NC} Application deployed to: $APP_DIR"
echo -e "${GREEN}✓${NC} PM2 process: $(pm2 list | grep -c "$APP_NAME") instance(s) running"
echo -e "${GREEN}✓${NC} Nginx configured for: $DOMAIN"
echo -e "${GREEN}✓${NC} Application running on port: $PORT"
echo ""
echo "Next Steps:"
echo "1. Edit environment variables: nano $APP_DIR/.env.production"
echo "2. Setup SSL certificate: certbot --nginx -d $DOMAIN"
echo "3. Test the site: curl -I http://$DOMAIN"
echo ""
echo "Useful Commands:"
echo "  pm2 status              - Check PM2 status"
echo "  pm2 logs $APP_NAME      - View application logs"
echo "  pm2 restart $APP_NAME   - Restart application"
echo "  systemctl status nginx  - Check Nginx status"
echo ""
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo ""
