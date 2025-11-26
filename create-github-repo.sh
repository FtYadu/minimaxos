#!/bin/bash

# MiniMax Studio - Create GitHub Repo & Deploy to Netlify
# Interactive deployment script

clear
echo "🚀 MiniMax Studio - GitHub + Netlify Deployment"
echo "================================================"
echo ""
echo "This will help you:"
echo "  1. Create a new GitHub repository"
echo "  2. Push your code"
echo "  3. Deploy to Netlify"
echo ""
echo "Prerequisites:"
echo "  ✓ GitHub account (free at github.com)"
echo "  ✓ Git configured with your credentials"
echo ""
read -p "Press Enter to continue..."

clear
echo "📋 Step 1: Create GitHub Repository"
echo "===================================="
echo ""
echo "Option A: Use GitHub Website (Recommended)"
echo "-----------------------------------------"
echo "1. Open: https://github.com/new"
echo "2. Repository name: minimax-studio"
echo "3. Description: AI Content Generation Platform with MiniMax API"
echo "4. Public or Private: Your choice"
echo "5. DON'T check 'Initialize with README'"
echo "6. Click 'Create repository'"
echo ""
echo "Option B: Use GitHub CLI (If installed)"
echo "---------------------------------------"
echo "gh repo create minimax-studio --public --source=. --remote=origin"
echo ""
read -p "Have you created the repository? (y/n): " created

if [ "$created" != "y" ] && [ "$created" != "Y" ]; then
    echo ""
    echo "❌ Please create the repository first, then run this script again."
    exit 1
fi

clear
echo "🔗 Step 2: Connect to GitHub"
echo "============================"
echo ""
read -p "Enter your GitHub username: " username

if [ -z "$username" ]; then
    echo "❌ Username is required"
    exit 1
fi

repo_name="minimax-studio"
repo_url="https://github.com/$username/$repo_name.git"

echo ""
echo "Repository URL: $repo_url"
echo ""
read -p "Is this correct? (y/n): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo ""
    read -p "Enter the full repository URL: " repo_url
fi

# Configure git remote
echo ""
echo "🔧 Configuring remote..."

if git remote get-url origin &> /dev/null; then
    git remote set-url origin "$repo_url"
    echo "✓ Remote updated"
else
    git remote add origin "$repo_url"
    echo "✓ Remote added"
fi

# Ensure on main branch
echo "🌿 Switching to main branch..."
git branch -M main

# Show current status
echo ""
echo "📊 Current Status:"
git remote -v
echo ""
git log --oneline -5

clear
echo "📤 Step 3: Push to GitHub"
echo "========================="
echo ""
echo "Pushing to: $repo_url"
echo ""
echo "You may be prompted for credentials..."
echo ""

git push -u origin main

if [ $? -eq 0 ]; then
    clear
    echo "✅ SUCCESS! Code pushed to GitHub!"
    echo "=================================="
    echo ""
    echo "Your repository: https://github.com/$username/$repo_name"
    echo ""
    echo ""
    echo "🚀 Step 4: Deploy to Netlify"
    echo "============================="
    echo ""
    echo "Quick Deploy Method:"
    echo "-------------------"
    echo "1. Go to: https://app.netlify.com"
    echo "2. Click: 'Add new site' → 'Import an existing project'"
    echo "3. Choose: 'GitHub'"
    echo "4. Authorize Netlify (if first time)"
    echo "5. Select repository: '$repo_name'"
    echo "6. Build settings (auto-detected):"
    echo "   Build command: npm run build"
    echo "   Publish directory: .next"
    echo "7. Click: 'Deploy site'"
    echo ""
    echo "⏱️  Build time: 2-3 minutes"
    echo ""
    echo "After deployment:"
    echo "----------------"
    echo "• Your site will be at: https://random-name.netlify.app"
    echo "• Customize: Site settings → Domain → Edit site name"
    echo "• Suggested: minimax-studio-yadu"
    echo ""
    echo "🎉 DONE!"
    echo ""
    echo "Open Netlify now? https://app.netlify.com"
    echo ""
else
    echo ""
    echo "❌ Push Failed"
    echo "============="
    echo ""
    echo "Common issues:"
    echo ""
    echo "1. Authentication Required:"
    echo "   - Configure git credentials:"
    echo "     git config --global user.name 'Your Name'"
    echo "     git config --global user.email 'your@email.com'"
    echo ""
    echo "2. Repository doesn't exist:"
    echo "   - Make sure you created it on GitHub"
    echo "   - Check the repository name is correct"
    echo ""
    echo "3. Permission denied:"
    echo "   - Generate GitHub personal access token"
    echo "   - Use as password when prompted"
    echo "   - Create at: https://github.com/settings/tokens"
    echo ""
    echo "Try again:"
    echo "./create-github-repo.sh"
    echo ""
fi
