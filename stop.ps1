##############################################
#  PiDeploy Platform — Stop Everything Script
##############################################

Write-Host ""
Write-Host "========================================" -ForegroundColor Red
Write-Host "   PiDeploy Platform — Stopping All...    " -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
docker stop pideploy-redis mini-paas-nginx 2>$null | Out-Null
docker rm pideploy-redis mini-paas-nginx 2>$null | Out-Null

# Also stop any backend containers
$backends = docker ps -a --filter "name=backend_" --format "{{.Names}}" 2>$null
if ($backends) {
    Write-Host "Stopping backend app containers..." -ForegroundColor Yellow
    docker stop $backends 2>$null | Out-Null
    docker rm $backends 2>$null | Out-Null
}

Write-Host "  All containers stopped ✓" -ForegroundColor Green

Write-Host ""
Write-Host "Docker containers removed." -ForegroundColor Green
Write-Host "Close the Platform API and CLI windows manually (or press Ctrl+C in them)." -ForegroundColor DarkGray
Write-Host ""
