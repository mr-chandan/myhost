##############################################
#  PiDeploy Platform — Start Everything Script
##############################################

$ROOT = $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PiDeploy Platform — Starting All...    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Redis ──────────────────────────────────────
Write-Host "[1/4] Starting Redis..." -ForegroundColor Yellow
$redis = docker ps -a --filter "name=pideploy-redis" --format "{{.Names}}" 2>$null
if ($redis -eq "pideploy-redis") {
    $running = docker ps --filter "name=pideploy-redis" --format "{{.Names}}" 2>$null
    if ($running -eq "pideploy-redis") {
        Write-Host "  Redis already running ✓" -ForegroundColor Green
    } else {
        docker start pideploy-redis | Out-Null
        Write-Host "  Redis restarted ✓" -ForegroundColor Green
    }
} else {
    docker run -d --name pideploy-redis -p 6379:6379 redis:alpine | Out-Null
    Write-Host "  Redis started ✓" -ForegroundColor Green
}

# ── 2. Nginx (single port 80, path-based routing) ─
Write-Host "[2/4] Starting Nginx..." -ForegroundColor Yellow

# Ensure apps config directory exists
if (-not (Test-Path "$ROOT\nginx\apps")) {
    New-Item -ItemType Directory -Path "$ROOT\nginx\apps" -Force | Out-Null
}

$nginx = docker ps -a --filter "name=mini-paas-nginx" --format "{{.Names}}" 2>$null
if ($nginx -eq "mini-paas-nginx") {
    $running = docker ps --filter "name=mini-paas-nginx" --format "{{.Names}}" 2>$null
    if ($running -eq "mini-paas-nginx") {
        Write-Host "  Nginx already running ✓" -ForegroundColor Green
    } else {
        docker start mini-paas-nginx | Out-Null
        Write-Host "  Nginx restarted ✓" -ForegroundColor Green
    }
} else {
    docker run -d `
        --name mini-paas-nginx `
        -p 80:80 `
        -v "${ROOT}\nginx\default.conf:/etc/nginx/conf.d/default.conf" `
        -v "${ROOT}\nginx\apps:/etc/nginx/apps" `
        -v "${ROOT}\apps:/apps" `
        nginx:alpine | Out-Null
    Write-Host "  Nginx started on port 80 ✓" -ForegroundColor Green
}

# ── 3. Platform API (includes ngrok tunnel) ───────
Write-Host "[3/4] Starting Platform API + Tunnel..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "
    `$Host.UI.RawUI.WindowTitle = 'PiDeploy — Platform API';
    cd '$ROOT\platform-api';
    Write-Host '🚀 Platform API starting (with ngrok tunnel)...' -ForegroundColor Cyan;
    npm start
"
Write-Host "  Platform API launched in new window ✓" -ForegroundColor Green

# ── 4. CLI (watch mode) ──────────────────────────
Write-Host "[4/4] Starting CLI dev watcher..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "
    `$Host.UI.RawUI.WindowTitle = 'PiDeploy — CLI Dev';
    cd '$ROOT\my-host-cli';
    Write-Host '⚡ CLI watcher starting...' -ForegroundColor Cyan;
    npm run dev
"
Write-Host "  CLI watcher launched in new window ✓" -ForegroundColor Green

# ── Done ──────────────────────────────────────────
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   All services started!                " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Redis          → localhost:6379"
Write-Host "  Nginx          → localhost:80 (all apps)"
Write-Host "  Platform API   → localhost:3000"
Write-Host "  Ngrok Tunnel   → check API window for public URL"
Write-Host "  CLI            → watching for changes"
Write-Host ""
Write-Host "Deployed apps accessible at:" -ForegroundColor Cyan
Write-Host "  https://<tunnel-url>/<app_id>/" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop everything run:  .\stop.ps1" -ForegroundColor DarkGray
Write-Host ""
