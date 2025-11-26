#!/bin/bash

# MiniMax Studio - Deploy to Netlify via GitHub
# This script automates the entire deployment process

echo "🚀 MiniMax Studio - Deploy to Netlify"
echo "====================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not initialized"
    echo "   Run: git init"
    exit 1
fi

# Get GitHub repository URL
echo "📝 Enter your GitHub repository URL:"
echo "   Format: https://github.com/USERNAME/REPO.git"
echo "   Example: https://github.com/ftyadu/minimax-studio.git"
echo ""
read -p "Repository URL: " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ Repository URL is required"
    exit 1
fi

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "🔄 Updating existing remote..."
    git remote set-url origin "$repo_url"
else
    echo "➕ Adding remote..."
    git remote add origin "$repo_url"
fi

# Ensure we're on main branch
echo "🌿 Switching to main branch..."
git branch -M main

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📦 Uncommitted changes detected. Committing..."
    git add .
    read -p "Commit message (or press Enter for default): " commit_msg
    if [ -z "$commit_msg" ]; then
        commit_msg="Update MiniMax Studio"
    fi
    git commit -m "$commit_msg"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎯 Next Steps:"
    echo "=============="
    echo ""
    echo "1. Go to Netlify: https://app.netlify.com"
    echo "2. Click 'Add new site' → 'Import an existing project'"
    echo "3. Choose 'GitHub' and select your repository"
    echo "4. Click 'Deploy site'"
    echo ""
    echo "🎉 Your site will be live in 2-3 minutes!"
    echo ""
    echo "📖 Full guide: See NETLIFY.md"
    echo ""
else
    echo ""
    echo "❌ Failed to push to GitHub"
    echo ""
    echo "💡 Common fixes:"
    echo "   1. Make sure you created the repository on GitHub"
    echo "   2. Check if you need to authenticate (git credential helper)"
    echo "   3. Verify the repository URL is correct"
    echo ""
fi
