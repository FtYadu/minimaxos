#!/bin/bash

# MiniMax Studio - Deploy to Cloudflare Pages
# Automated deployment script

clear
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║       🚀 MiniMax Studio → Cloudflare Pages Deploy 🚀          ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Current location: $(pwd)"
echo "✅ Project ready to deploy!"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Choose your deployment method:"
echo ""
echo "1. GitHub + Cloudflare (Recommended) - CI/CD enabled"
echo "2. Wrangler CLI (Direct) - Instant deployment"
echo "3. Show manual commands"
echo ""
read -p "Select (1/2/3): " method

case $method in
    1)
        clear
        echo "════════════════════════════════════════════════════════════════"
        echo "📝 METHOD 1: GitHub + Cloudflare Pages"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "STEP 1: Create GitHub Repository"
        echo "---------------------------------"
        echo ""
        echo "1. Open: https://github.com/new"
        echo "2. Repository name: minimax-studio"
        echo "3. Visibility: Public or Private"
        echo "4. DON'T check 'Initialize with README'"
        echo "5. Click 'Create repository'"
        echo ""
        read -p "✋ Press Enter after creating the repo..."
        echo ""
        
        echo "STEP 2: Enter Your GitHub Username"
        echo "-----------------------------------"
        echo ""
        read -p "GitHub username: " USERNAME
        
        if [ -z "$USERNAME" ]; then
            echo "❌ Username required!"
            exit 1
        fi
        
        REPO_URL="https://github.com/$USERNAME/minimax-studio.git"
        echo ""
        echo "Repository: $REPO_URL"
        echo ""
        
        echo "STEP 3: Pushing to GitHub..."
        echo "----------------------------"
        echo ""
        
        if git remote get-url origin &> /dev/null; then
            git remote set-url origin "$REPO_URL"
        else
            git remote add origin "$REPO_URL"
        fi
        
        git branch -M main
        git push -u origin main
        
        if [ $? -eq 0 ]; then
            clear
            echo "╔════════════════════════════════════════════════════════════════╗"
            echo "║                                                                ║"
            echo "║                ✅ CODE PUSHED TO GITHUB! ✅                    ║"
            echo "║                                                                ║"
            echo "╚════════════════════════════════════════════════════════════════╝"
            echo ""
            echo "🔗 Your repo: https://github.com/$USERNAME/minimax-studio"
            echo ""
            echo "════════════════════════════════════════════════════════════════"
            echo ""
            echo "STEP 4: Deploy to Cloudflare Pages"
            echo "-----------------------------------"
            echo ""
            echo "1. Go to: https://dash.cloudflare.com"
            echo "   (Sign up if needed - FREE!)"
            echo ""
            echo "2. Navigate to: 'Workers & Pages' (in sidebar)"
            echo ""
            echo "3. Click: 'Create application' → 'Pages' tab"
            echo ""
            echo "4. Click: 'Connect to Git'"
            echo "   (Authorize GitHub if first time)"
            echo ""
            echo "5. Select repository: 'minimax-studio'"
            echo ""
            echo "6. Build settings (should auto-detect):"
            echo "   ✓ Framework preset: Next.js"
            echo "   ✓ Build command: npm run build"
            echo "   ✓ Build output directory: .next"
            echo ""
            echo "7. Click: 'Save and Deploy'"
            echo ""
            echo "⏱️  Build time: 2-3 minutes"
            echo ""
            echo "════════════════════════════════════════════════════════════════"
            echo ""
            echo "🎉 YOUR SITE WILL BE LIVE AT:"
            echo ""
            echo "https://minimax-studio.pages.dev"
            echo ""
            echo "Customize your URL in Cloudflare dashboard!"
            echo ""
        else
            echo ""
            echo "❌ Push failed. Check errors above."
            echo ""
            echo "Common fix: Use GitHub Personal Access Token"
            echo "https://github.com/settings/tokens"
            echo ""
        fi
        ;;
        
    2)
        clear
        echo "════════════════════════════════════════════════════════════════"
        echo "📝 METHOD 2: Wrangler CLI Deploy"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        
        # Check if wrangler is installed
        if ! command -v wrangler &> /dev/null; then
            echo "📦 Installing Wrangler CLI..."
            echo ""
            npm install -g wrangler
            
            if [ $? -ne 0 ]; then
                echo "❌ Failed to install Wrangler"
                exit 1
            fi
        fi
        
        echo "✅ Wrangler installed!"
        echo ""
        echo "🔐 Logging into Cloudflare..."
        echo "(Browser will open for authentication)"
        echo ""
        
        wrangler login
        
        if [ $? -ne 0 ]; then
            echo "❌ Login failed"
            exit 1
        fi
        
        echo ""
        echo "✅ Logged in!"
        echo ""
        echo "📦 Building the app..."
        echo ""
        
        npm install
        npm run build
        
        if [ $? -ne 0 ]; then
            echo "❌ Build failed"
            exit 1
        fi
        
        echo ""
        echo "✅ Build complete!"
        echo ""
        echo "🚀 Deploying to Cloudflare Pages..."
        echo ""
        
        wrangler pages deploy .next --project-name=minimax-studio
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "╔════════════════════════════════════════════════════════════════╗"
            echo "║                                                                ║"
            echo "║              ✅ DEPLOYED TO CLOUDFLARE! ✅                     ║"
            echo "║                                                                ║"
            echo "╚════════════════════════════════════════════════════════════════╝"
            echo ""
            echo "🎉 Your site is LIVE!"
            echo ""
        else
            echo ""
            echo "❌ Deployment failed"
            exit 1
        fi
        ;;
        
    3)
        clear
        echo "════════════════════════════════════════════════════════════════"
        echo "📋 MANUAL DEPLOYMENT COMMANDS"
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "Option A: GitHub + Cloudflare"
        echo "------------------------------"
        echo ""
        echo "# 1. Create repo on GitHub: https://github.com/new"
        echo ""
        echo "# 2. Push code (replace YOUR_USERNAME):"
        echo "git remote add origin https://github.com/YOUR_USERNAME/minimax-studio.git"
        echo "git branch -M main"
        echo "git push -u origin main"
        echo ""
        echo "# 3. Deploy on Cloudflare:"
        echo "#    Go to: https://dash.cloudflare.com"
        echo "#    Workers & Pages → Create → Connect to Git"
        echo "#    Select repo → Deploy"
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        echo "Option B: Direct Deploy with Wrangler"
        echo "--------------------------------------"
        echo ""
        echo "npm install -g wrangler"
        echo "wrangler login"
        echo "npm install && npm run build"
        echo "wrangler pages deploy .next --project-name=minimax-studio"
        echo ""
        echo "════════════════════════════════════════════════════════════════"
        echo ""
        ;;
        
    *)
        echo "Invalid selection"
        exit 1
        ;;
esac

echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "✨ POST-DEPLOYMENT STEPS:"
echo ""
echo "1. Open your Cloudflare Pages URL"
echo "2. Click 'No API Key' button"
echo "3. Add MiniMax API key from: https://platform.minimax.io"
echo "4. Start creating AI content! 🎨🎬🎵💻"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "📚 Full Documentation:"
echo "  • CLOUDFLARE.md - Complete guide"
echo "  • README.md - Project docs"
echo "  • API_FEATURES.md - All features"
echo ""
echo "🚀 DEPLOYMENT COMPLETE! 🚀"
echo ""
