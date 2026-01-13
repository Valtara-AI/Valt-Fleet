@echo off
REM Quick Fix for 502 Gateway Errors
REM Run this first to diagnose and fix current issues

SETLOCAL EnableDelayedExpansion

echo ==========================================
echo Fleet Management - Emergency Fix
echo ==========================================
echo.

SET SERVER_IP=188.245.43.183
SET KEY_FILE=d:\DO\Fleet Management\ubuntu-ky.pem
SET SERVER_USER=root

REM Fix SSH key permissions
echo Fixing SSH key permissions...
icacls "%KEY_FILE%" /inheritance:r >nul 2>&1
icacls "%KEY_FILE%" /grant:r "%USERNAME%:R" >nul 2>&1
echo ✓ Done
echo.

echo Connecting to server: %SERVER_IP%
echo.

echo ======================================
echo STEP 1: Checking Services Status
echo ======================================
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "echo '--- PM2 Status ---' && pm2 list && echo '' && echo '--- Nginx Status ---' && systemctl status nginx --no-pager | head -10"
echo.

echo ======================================
echo STEP 2: Checking Application Port
echo ======================================
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "echo 'Checking if app is listening on port 3000...' && netstat -tuln | grep :3000 || echo 'Port 3000 is NOT listening!'"
echo.

echo ======================================
echo STEP 3: Checking Recent Errors
echo ======================================
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "echo '--- Nginx Errors ---' && tail -30 /var/log/nginx/error.log && echo '' && echo '--- PM2 Errors ---' && pm2 logs --lines 30 --nostream --err"
echo.

echo ======================================
echo STEP 4: Attempting Service Restart
echo ======================================
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "echo 'Restarting PM2 apps...' && pm2 restart all && echo 'Restarting Nginx...' && systemctl restart nginx && echo 'Waiting 5 seconds...' && sleep 5"
echo.

echo ======================================
echo STEP 5: Verifying Fix
echo ======================================
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "pm2 list && echo '' && echo 'Testing local app...' && curl -I http://localhost:3000/health 2^>^&1 || echo 'App not responding on port 3000!'"
echo.

echo ======================================
echo STEP 6: Testing Public Access
echo ======================================
echo Testing https://fleet.valtara.ai/health
curl -I https://fleet.valtara.ai/health
echo.

echo ======================================
echo STEP 7: Checking Firewall/IPTables
echo ======================================
ssh -i "%KEY_FILE%" -o StrictHostKeyChecking=no %SERVER_USER%@%SERVER_IP% "echo 'UFW Status:' && ufw status | head -20 && echo '' && echo 'Checking if port 3000 is allowed...' && ufw status | grep 3000 || echo 'Port 3000 not in firewall rules'"
echo.

echo ======================================
echo Diagnosis Complete
echo ======================================
echo.
echo If still not working, check:
echo 1. Application code errors: ssh -i "%KEY_FILE%" %SERVER_USER%@%SERVER_IP% "pm2 logs"
echo 2. Nginx configuration: ssh -i "%KEY_FILE%" %SERVER_USER%@%SERVER_IP% "nginx -t"
echo 3. Port conflicts: ssh -i "%KEY_FILE%" %SERVER_USER%@%SERVER_IP% "netstat -tuln | grep 3000"
echo.
echo To deploy full security fixes, run: deploy-secure.bat
echo.

ENDLOCAL
pause
