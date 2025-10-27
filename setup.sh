#!/bin/bash

# ISHREALM TV - Quick Setup Script

echo "🎬 Setting up ISHREALM TV..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your Supabase credentials"
fi

# Create public directory for PWA assets
if [ ! -d "public" ]; then
    echo "📁 Creating public directory..."
    mkdir -p public
fi

# Create PWA icon placeholders
echo "🖼️  Creating PWA icon placeholders..."
# Note: You'll need to add actual icon files later

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Run 'npm run dev' to start development server"
echo "3. Follow DEPLOYMENT.md for production deployment"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview and features"
echo "- DEPLOYMENT.md - Complete deployment guide"
echo "- supabase-schema.sql - Database setup"
echo ""
