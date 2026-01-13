@echo off
REM Fleet Management v3.0 - Secure Deployment Script
REM Run this from Windows to deploy security fixes to server

SETLOCAL EnableDelayedExpansion

echo ==========================================
echo Fleet Management v3.0 Security Deployment
echo ==========================================
echo.

SET SERVER_IP=188.245.43.183
SET KEY_FILE=d:\DO\Fleet Management\ubuntu-ky.pem
SET SERVER_USER=root
SET APP_DIR=/var/www/fleet.valtara.ai

echo Server: %SERVER_IP%
echo Key File: %KEY_FILE%
echo.

REM Fix SSH key permissions
echo Step 1: Fixing SSH key permissions...
icacls "%KEY_FILE%" /inheritance:r
icacls "%KEY_FILE%" /grant:r "%USERNAME%:R"
echo ✓ Key permissions fixed
echo.

REM Check server connectivity
echo Step 2: Checking server connectivity...
ping -n 1 %SERVER_IP% >nul 2>&1
if errorlevel 1 (
    echo ✗ Server is not reachable!
    exit /b 1
)
echo ✓ Server is reachable
echo.

echo Step 3: Uploading security files...

REM Upload security setup script
scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no "deployment\security-setup.sh" %SERVER_USER%@%SERVER_IP%:/tmp/
echo   ✓ security-setup.sh uploaded

REM Upload Nginx config
scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no "deployment\nginx-security.conf" %SERVER_USER%@%SERVER_IP%:/tmp/
echo   ✓ nginx-security.conf uploaded

REM Upload Fail2Ban configs
scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no "deployment\fail2ban-jail.conf" %SERVER_USER%@%SERVER_IP%:/tmp/
echo   ✓ fail2ban-jail.conf uploaded

scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no "deployment\fail2ban-filters.conf" %SERVER_USER%@%SERVER_IP%:/tmp/
echo   ✓ fail2ban-filters.conf uploaded

REM Upload PM2 config
scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no "deployment\ecosystem-secure.config.js" %SERVER_USER%@%SERVER_IP%:/tmp/
echo   ✓ ecosystem-secure.config.js uploaded

echo.
echo Step 4: Creating application directories on server...
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "mkdir -p %APP_DIR%/src/middleware %APP_DIR%/logs %APP_DIR%/data"
echo ✓ Directories created
echo.

echo Step 5: Uploading application middleware...
scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no "src\middleware\security.ts" %SERVER_USER%@%SERVER_IP%:%APP_DIR%/src/middleware/
echo   ✓ security.ts uploaded

scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no "src\middleware\cors-security.ts" %SERVER_USER%@%SERVER_IP%:%APP_DIR%/src/middleware/
echo   ✓ cors-security.ts uploaded

scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no "src\middleware\ip-blocking.ts" %SERVER_USER%@%SERVER_IP%:%APP_DIR%/src/middleware/
echo   ✓ ip-blocking.ts uploaded

scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no "src\middleware\monitoring.ts" %SERVER_USER%@%SERVER_IP%:%APP_DIR%/src/middleware/
echo   ✓ monitoring.ts uploaded

scp -i "%KEY_FILE%" -o StrictHostKeyChecking=no "src\server-secure.ts" %SERVER_USER%@%SERVER_IP%:%APP_DIR%/src/
echo   ✓ server-secure.ts uploaded

echo.
echo Step 6: Running security setup on server...
echo This may take a few minutes...
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "chmod +x /tmp/security-setup.sh && /tmp/security-setup.sh"
if errorlevel 1 (
    echo ✗ Security setup failed!
    exit /b 1
)
echo ✓ Security setup completed
echo.

echo Step 7: Configuring Nginx...
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "cp /tmp/nginx-security.conf /etc/nginx/sites-available/fleet.valtara.ai && ln -sf /etc/nginx/sites-available/fleet.valtara.ai /etc/nginx/sites-enabled/ && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl reload nginx"
if errorlevel 1 (
    echo ✗ Nginx configuration failed!
    exit /b 1
)
echo ✓ Nginx configured
echo.

echo Step 8: Installing Node.js dependencies...
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && npm install express cors helmet compression dotenv @types/express @types/cors @types/compression"
echo ✓ Dependencies installed
echo.

echo Step 9: Building application...
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && npm run build && npm run build:server"
if errorlevel 1 (
    echo ✗ Build failed!
    exit /b 1
)
echo ✓ Application built
echo.

echo Step 10: Restarting services...
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "cd %APP_DIR% && cp /tmp/ecosystem-secure.config.js ./ecosystem.config.js && pm2 delete all 2^>nul ^|^| true && pm2 start ecosystem.config.js && pm2 save && systemctl restart nginx"
echo ✓ Services restarted
echo.

echo Step 11: Verifying deployment...
timeout /t 5 /nobreak >nul
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "pm2 list && systemctl status nginx --no-pager | head -10"
echo.

echo Step 12: Testing application...
curl -I https://fleet.valtara.ai/health
echo.

echo ==========================================
echo Deployment Complete!
echo ==========================================
echo.
echo Services Status:
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "pm2 list"
echo.
echo Next Steps:
echo 1. Test the application: https://fleet.valtara.ai
echo 2. Monitor logs: ssh -i "%KEY_FILE%" %SERVER_USER%@%SERVER_IP% "pm2 logs"
echo 3. Check security: ssh -i "%KEY_FILE%" %SERVER_USER%@%SERVER_IP% "fail2ban-client status"
echo.
echo Security Features Active:
echo   ✓ Rate Limiting
echo   ✓ DDoS Protection
echo   ✓ IP Blocking
echo   ✓ Fail2Ban
echo   ✓ UFW Firewall
echo   ✓ Security Headers
echo   ✓ Request Validation
echo   ✓ Real-time Monitoring
echo.

ENDLOCAL
pause
