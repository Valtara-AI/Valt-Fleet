#!/bin/bash

# Emergency Server Recovery Script
# Use this to diagnose and fix the 502 Bad Gateway errors

set -e

SERVER_IP="188.245.43.183"
KEY_FILE="d:\\DO\\Fleet Management\\ubuntu-ky.pem"

echo "======================================"
echo "Emergency Server Recovery"
echo "======================================"
echo ""

# Function to run command on server
run_remote() {
    ssh -i "$KEY_FILE" -o StrictHostKeyChecking=no root@$SERVER_IP "$1"
}

echo "Step 1: Checking server connectivity..."
if ping -n 1 $SERVER_IP > /dev/null 2>&1; then
    echo "✓ Server is reachable"
else
    echo "✗ Server is not reachable"
    exit 1
fi

echo ""
echo "Step 2: Checking services status..."
run_remote "pm2 list"
run_remote "systemctl status nginx --no-pager | head -20"

echo ""
echo "Step 3: Checking logs..."
run_remote "tail -50 /var/log/nginx/error.log"

echo ""
echo "Step 4: Checking Node.js app logs..."
run_remote "pm2 logs --lines 50 --nostream"

echo ""
echo "Step 5: Restarting services..."
run_remote "pm2 restart all"
run_remote "systemctl restart nginx"

echo ""
echo "Step 6: Verifying services..."
sleep 5
run_remote "pm2 list"
run_remote "curl -I http://localhost:3000/health"

echo ""
echo "Step 7: Checking Nginx configuration..."
run_remote "nginx -t"

echo ""
echo "======================================"
echo "Recovery Attempt Complete"
echo "======================================"
echo ""
echo "Test the application:"
echo "curl -I https://fleet.valtara.ai"
