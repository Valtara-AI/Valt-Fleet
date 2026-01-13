@echo off
REM Fleet Management LMS - Windows Deployment Helper
REM This script will guide you through the deployment process

color 0A
echo ========================================
echo Fleet Management LMS - Deployment
echo ========================================
echo.

set SERVER_IP=91.99.79.131
set SERVER_USER=root
set REMOTE_PATH=/var/www/fleet-lms
set DOMAIN=fleet.valtara.ai

echo Step 1: Upload Files to Server
echo --------------------------------
echo.
echo This will upload all project files to the server.
echo You will be prompted for the root password.
echo.
pause

echo.
echo Uploading application files...
scp -r app src public package.json package-lock.json next.config.mjs tsconfig.json next-env.d.ts %SERVER_USER%@%SERVER_IP%:%REMOTE_PATH%/

echo.
echo Uploading deployment files...
scp deployment\ecosystem.config.js %SERVER_USER%@%SERVER_IP%:%REMOTE_PATH%/

echo.
echo [OK] Files uploaded!
echo.
echo ========================================
echo Step 2: Connect to Server and Deploy
echo ========================================
echo.
echo I will now connect you to the server.
echo.
echo Run these commands on the server:
echo.
echo   cd /var/www/fleet-lms
echo   npm ci --production=false
echo   npm run build
echo   pm2 start npm --name fleet-lms -- start
echo   pm2 save
echo.
pause

echo.
echo Connecting to server...
ssh %SERVER_USER%@%SERVER_IP%

echo.
echo ========================================
echo Deployment Instructions
echo ========================================
echo.
echo If you disconnected from the server, run:
echo   ssh %SERVER_USER%@%SERVER_IP%
echo.
echo Then complete the deployment by running:
echo   1. cd /var/www/fleet-lms
echo   2. npm ci --production=false
echo   3. npm run build
echo   4. pm2 start npm --name fleet-lms -- start
echo   5. pm2 save
echo   6. Configure Nginx (see deploy-commands.txt)
echo   7. Setup SSL: certbot --nginx -d %DOMAIN%
echo.
echo Full instructions are in: deployment\deploy-commands.txt
echo.
pause
