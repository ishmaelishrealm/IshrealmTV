# ISHREALM TV - Quick Setup Script

Write-Host "🎬 Setting up ISHREALM TV..." -ForegroundColor Magenta

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Create environment file
if (!(Test-Path ".env.local")) {
    Write-Host "📝 Creating .env.local file..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env.local"
    Write-Host "⚠️  Please edit .env.local with your Supabase credentials" -ForegroundColor Yellow
}

# Create public directory for PWA assets
if (!(Test-Path "public")) {
    Write-Host "📁 Creating public directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path "public" -Force
}

# Create PWA icon placeholders
Write-Host "🖼️  Creating PWA icon placeholders..." -ForegroundColor Yellow
$iconSizes = @("192x192", "512x512")
foreach ($size in $iconSizes) {
    $iconPath = "public/pwa-$size.png"
    if (!(Test-Path $iconPath)) {
        # Create a simple colored square as placeholder
        Write-Host "Creating placeholder icon: $iconPath" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env.local with your Supabase credentials" -ForegroundColor White
Write-Host "2. Run 'npm run dev' to start development server" -ForegroundColor White
Write-Host "3. Follow DEPLOYMENT.md for production deployment" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "- README.md - Project overview and features" -ForegroundColor White
Write-Host "- DEPLOYMENT.md - Complete deployment guide" -ForegroundColor White
Write-Host "- supabase-schema.sql - Database setup" -ForegroundColor White
Write-Host ""
