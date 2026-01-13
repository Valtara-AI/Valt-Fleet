# Fleet Management LMS - Windows Deployment Script
# Run this from D:\DO\Fleet Management directory

$ErrorActionPreference = "Stop"

$SERVER_IP = "91.99.79.131"
$SERVER_USER = "root"
$REMOTE_PATH = "/var/www/fleet-lms"
$LOCAL_PATH = "D:\DO\Fleet Management"

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Fleet Management LMS - Deployment Script" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found. Please run this from the project root." -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Preparing files for upload..." -ForegroundColor Cyan
Write-Host "--------------------------------------"

# Files and directories to upload
$filesToUpload = @(
    "app",
    "src", 
    "public",
    "package.json",
    "package-lock.json",
    "next.config.mjs",
    "tsconfig.json",
    "next-env.d.ts",
    "deployment/ecosystem.config.js",
    "deployment/deploy.sh"
)

# Check if files exist
$missingFiles = @()
foreach ($file in $filesToUpload) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "WARNING: The following files/folders are missing:" -ForegroundColor Yellow
    $missingFiles | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    $continue = Read-Host "Continue anyway? (Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        exit 1
    }
}

Write-Host "[OK] Files ready for upload" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Creating remote directories..." -ForegroundColor Cyan
Write-Host "---------------------------------------"

$sshCommand = "ssh ${SERVER_USER}@${SERVER_IP}"

# Create directories on server
$createDirsCmd = "${sshCommand} `"mkdir -p ${REMOTE_PATH}/{logs,backups,public/assets}`""
Write-Host "Executing: $createDirsCmd" -ForegroundColor Gray
Invoke-Expression $createDirsCmd

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Remote directories created" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to create directories" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 3: Uploading files to server..." -ForegroundColor Cyan
Write-Host "-------------------------------------"
Write-Host "This may take several minutes..." -ForegroundColor Yellow

# Upload files using SCP
foreach ($file in $filesToUpload) {
    if (Test-Path $file) {
        Write-Host "Uploading: $file" -ForegroundColor Gray
        
        $scpCommand = "scp -r `"$file`" ${SERVER_USER}@${SERVER_IP}:${REMOTE_PATH}/"
        
        try {
            Invoke-Expression $scpCommand
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  [OK] $file uploaded" -ForegroundColor Green
            } else {
                Write-Host "  [WARN] Failed to upload $file" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  [ERROR] Exception uploading $file : $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "[OK] File upload completed" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Running deployment script on server..." -ForegroundColor Cyan
Write-Host "-----------------------------------------------"

# Make deploy.sh executable and run it
$deployCommand = @"
${sshCommand} "cd ${REMOTE_PATH} && chmod +x deployment/deploy.sh && ./deployment/deploy.sh"
"@

Write-Host "Executing remote deployment..." -ForegroundColor Gray
Invoke-Expression $deployCommand

Write-Host ""
Write-Host "Step 5: Setting up SSL certificate..." -ForegroundColor Cyan
Write-Host "--------------------------------------"

Write-Host ""
Write-Host "To setup SSL, connect to the server and run:" -ForegroundColor Yellow
Write-Host "  ssh ${SERVER_USER}@${SERVER_IP}" -ForegroundColor White
Write-Host "  certbot --nginx -d fleet.valtara.ai" -ForegroundColor White
Write-Host ""

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Deployment Process Summary" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Server IP    : ${SERVER_IP}" -ForegroundColor White
Write-Host "Remote Path  : ${REMOTE_PATH}" -ForegroundColor White
Write-Host "Domain       : fleet.valtara.ai" -ForegroundColor White
Write-Host "Port         : 3000" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Connect to server: ssh ${SERVER_USER}@${SERVER_IP}" -ForegroundColor White
Write-Host "2. Check status: pm2 status" -ForegroundColor White
Write-Host "3. View logs: pm2 logs fleet-lms" -ForegroundColor White
Write-Host "4. Setup SSL: certbot --nginx -d fleet.valtara.ai" -ForegroundColor White
Write-Host "5. Test site: https://fleet.valtara.ai" -ForegroundColor White
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Cyan
Write-Host "  pm2 logs fleet-lms     - View application logs" -ForegroundColor White
Write-Host "  pm2 restart fleet-lms  - Restart application" -ForegroundColor White
Write-Host "  systemctl reload nginx - Reload Nginx" -ForegroundColor White
Write-Host ""

# Test the deployment
Write-Host "Testing deployment..." -ForegroundColor Cyan
$testCommand = "${sshCommand} `"curl -s -o /dev/null -w '%{http_code}' http://localhost:3000`""
$httpCode = Invoke-Expression $testCommand

if ($httpCode -eq "200") {
    Write-Host "[OK] Application is responding (HTTP $httpCode)" -ForegroundColor Green
} else {
    Write-Host "[WARN] Application returned HTTP $httpCode" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Visit: http://fleet.valtara.ai (or https:// after SSL setup)" -ForegroundColor Cyan
Write-Host ""
