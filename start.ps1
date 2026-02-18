##############################################
#  MyHost Platform — Start Everything Script
##############################################

$ROOT = $PSScriptRoot

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   MyHost Platform — Starting All...    " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Redis ──────────────────────────────────────
Write-Host "[1/4] Starting Redis..." -ForegroundColor Yellow
$redis = docker ps -a --filter "name=myhost-redis" --format "{{.Names}}" 2>$null
if ($redis -eq "myhost-redis") {
    $running = docker ps --filter "name=myhost-redis" --format "{{.Names}}" 2>$null
    if ($running -eq "myhost-redis") {
        Write-Host "  Redis already running ✓" -ForegroundColor Green
    } else {
        docker start myhost-redis | Out-Null
        Write-Host "  Redis restarted ✓" -ForegroundColor Green
    }
} else {
    docker run -d --name myhost-redis -p 6379:6379 redis:alpine | Out-Null
    Write-Host "  Redis started ✓" -ForegroundColor Green
}

# ── 2. Nginx ──────────────────────────────────────
Write-Host "[2/4] Starting Nginx..." -ForegroundColor Yellow
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
        -p 8080-8090:8080-8090 `
        -v "${ROOT}\nginx:/etc/nginx/conf.d" `
        -v "${ROOT}\apps:/apps" `
        nginx:alpine | Out-Null
    Write-Host "  Nginx started ✓" -ForegroundColor Green
}

# ── 3. Platform API ──────────────────────────────
Write-Host "[3/4] Starting Platform API..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "
    `$Host.UI.RawUI.WindowTitle = 'MyHost — Platform API';
    cd '$ROOT\platform-api';
    Write-Host '🚀 Platform API starting on port 3000...' -ForegroundColor Cyan;
    npm start
"
Write-Host "  Platform API launched in new window ✓" -ForegroundColor Green

# ── 4. CLI (watch mode) ──────────────────────────
Write-Host "[4/4] Starting CLI dev watcher..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "
    `$Host.UI.RawUI.WindowTitle = 'MyHost — CLI Dev';
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
Write-Host "  Nginx          → localhost:8080-8090"
Write-Host "  Platform API   → localhost:3000"
Write-Host "  CLI            → watching for changes"
Write-Host ""
Write-Host "To stop everything run:  .\stop.ps1" -ForegroundColor DarkGray
Write-Host ""
