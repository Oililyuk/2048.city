#!/bin/bash

# 2048.city Setup Script
# This script helps set up the project for development

echo "🎮 Setting up 2048.city with Reddit Integration..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Copy static files
echo "📁 Copying static files..."

# Create public directory if it doesn't exist
mkdir -p public/asset

# Copy stylesheet
if [ -f "style.css" ]; then
    cp style.css public/style.css
    echo "  ✓ Copied style.css"
else
    echo "  ⚠️  style.css not found"
fi

# Copy asset folder
if [ -d "asset" ]; then
    cp -r asset/* public/asset/ 2>/dev/null
    echo "  ✓ Copied asset folder"
else
    echo "  ⚠️  asset folder not found"
fi

# Copy icon if exists
if [ -f "icon.png" ]; then
    cp icon.png public/icon.png
    echo "  ✓ Copied icon.png"
fi

echo ""

# Setup game core
echo "🎮 Setting up game core..."
if [ -f "script.js" ]; then
    # Check if game-core.js already has content
    if [ ! -s "public/game-core.js" ] || grep -q "Copy entire class from script.js here" "public/game-core.js"; then
        echo "  ℹ️  game-core.js needs the Game2048 class from script.js"
        echo "  ℹ️  Attempting to copy (you may need to adjust manually)..."
        
        # This is a simple approach - may need manual adjustment
        head -n 1500 script.js > public/game-core.js
        
        echo "  ⚠️  IMPORTANT: Please verify public/game-core.js contains the complete Game2048 class"
        echo "  ⚠️  You may need to manually copy the entire class from script.js"
    else
        echo "  ✓ game-core.js already configured"
    fi
else
    echo "  ⚠️  script.js not found - cannot setup game core"
fi

echo ""

# Setup environment file
echo "⚙️  Setting up environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "  ✓ Created .env file from template"
    echo "  ⚠️  IMPORTANT: Edit .env to add your Reddit API credentials"
else
    echo "  ✓ .env file already exists"
fi

echo ""

# Check if .env has been configured
if grep -q "your_reddit_client_id_here" .env 2>/dev/null; then
    echo "⚠️  Reddit API not configured yet"
    echo ""
    echo "📝 Next steps to enable Reddit integration:"
    echo ""
    echo "1. Go to: https://www.reddit.com/prefs/apps"
    echo "2. Create a new app:"
    echo "   - Type: web app"
    echo "   - Redirect URI: http://localhost:3000/api/auth/reddit/callback"
    echo "3. Copy your Client ID and Secret"
    echo "4. Edit .env file and add your credentials"
    echo "5. Run: npm run dev"
    echo ""
fi

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "📖 Documentation:"
echo "   - Quick Start: QUICKSTART.md"
echo "   - Architecture: ARCHITECTURE.md"
echo "   - Deployment: DEPLOYMENT.md"
echo ""
echo "🎮 After starting:"
echo "   - New app: http://localhost:3000/app"
echo "   - Original: http://localhost:3000/"
echo ""
