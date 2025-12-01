#!/bin/bash

# Git Preparation Script for 2048.city
# This script prepares the project for pushing to a new GitHub repository

echo "🚀 Preparing 2048.city for GitHub..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Step 1: Add all new files
echo "📦 Step 1: Adding new files to git..."
git add .env.example
git add .gitignore
git add LICENSE
git add package.json
git add setup.sh
git add server/
git add public/
git add ARCHITECTURE.md
git add DEPLOYMENT.md
git add QUICKSTART.md
git add FILES_CHECKLIST.md
git add PROJECT_SUMMARY.md
git add REDDIT_API_APPLICATION.md
git add README_GITHUB.md

echo "✅ New files added"
echo ""

# Step 2: Show what will be committed
echo "📋 Step 2: Files to be committed:"
git status --short
echo ""

# Step 3: Create commit
echo "💾 Step 3: Creating commit..."
read -p "Enter commit message (or press Enter for default): " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="Add Reddit OAuth integration and new architecture

- Implement complete Reddit OAuth 2.0 flow
- Add backend API server (Node.js + Express)
- Create new frontend with Reddit login
- Add score sharing to r/2048city
- Include comprehensive documentation
- Add security features (CSRF, rate limiting)
- Maintain backward compatibility with original game"
fi

git commit -m "$commit_msg"

if [ $? -eq 0 ]; then
    echo "✅ Commit created successfully"
else
    echo "⚠️  Commit failed or no changes to commit"
fi
echo ""

# Step 4: Instructions for creating new repo
echo "📝 Next Steps:"
echo ""
echo "To push to a NEW GitHub repository (2048.city):"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   - Go to: https://github.com/new"
echo "   - Repository name: 2048.city"
echo "   - Description: Modern 2048 game with Reddit integration"
echo "   - Visibility: Public"
echo "   - DO NOT initialize with README, .gitignore, or license"
echo ""
echo "2. Run these commands:"
echo "   git remote add city https://github.com/Oililyuk/2048.city.git"
echo "   git push -u city main"
echo ""
echo "To push to the EXISTING repository (2048):"
echo ""
echo "   git push origin main"
echo ""
echo "3. After pushing, update README on GitHub:"
echo "   - Rename README_GITHUB.md to README.md on GitHub"
echo "   - This will be the public-facing README"
echo ""
echo "4. Submit for Reddit API review:"
echo "   - Visit: https://www.reddit.com/prefs/apps"
echo "   - Reference: REDDIT_API_APPLICATION.md"
echo ""

# Optional: Show git log
echo ""
read -p "Show recent commits? (y/n): " show_log
if [ "$show_log" = "y" ]; then
    echo ""
    git log --oneline -5
fi

echo ""
echo "✅ Git preparation complete!"
echo ""
echo "⚠️  Remember:"
echo "   - Review .env.example (no secrets included)"
echo "   - Update contact information in REDDIT_API_APPLICATION.md"
echo "   - Test locally before pushing"
echo ""
