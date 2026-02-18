##############################################
#  MyHost Platform — Stop Everything Script
##############################################

Write-Host ""
Write-Host "========================================" -ForegroundColor Red
Write-Host "   MyHost Platform — Stopping All...    " -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

Write-Host "Stopping Docker containers..." -ForegroundColor Yellow
docker stop myhost-redis mini-paas-nginx 2>$null | Out-Null
docker rm myhost-redis mini-paas-nginx 2>$null | Out-Null
Write-Host "  Redis & Nginx stopped ✓" -ForegroundColor Green

Write-Host ""
Write-Host "Docker containers removed." -ForegroundColor Green
Write-Host "Close the Platform API and CLI windows manually (or press Ctrl+C in them)." -ForegroundColor DarkGray
Write-Host ""
