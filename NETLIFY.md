# 🚀 Deploy to Netlify - Step by Step

This guide will help you deploy MiniMax Studio to Netlify in **under 5 minutes**.

## ✅ Prerequisites

- GitHub account (create at [github.com](https://github.com))
- Netlify account (create at [netlify.com](https://netlify.com)) - **FREE!**
- Git installed on your computer

---

## 📋 Method 1: GitHub + Netlify (Recommended)

### Step 1: Create GitHub Repository

1. **Go to GitHub** → [github.com/new](https://github.com/new)
2. **Repository name**: `minimax-studio` (or any name you like)
3. **Visibility**: Choose Public or Private
4. **DON'T** initialize with README (we already have files)
5. Click **"Create repository"**

### Step 2: Push Your Code to GitHub

```bash
cd /home/claude/minimax-studio

# Add GitHub remote (replace YOUR_USERNAME and YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Rename branch to main (if needed)
git branch -M main

# Push code
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/ftyadu/minimax-studio.git
git branch -M main
git push -u origin main
```

You'll be prompted to login - use your GitHub credentials.

### Step 3: Deploy to Netlify

1. **Go to Netlify** → [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"GitHub"** (authorize if needed)
4. Select your **`minimax-studio`** repository
5. **Build settings** (should auto-detect):
   ```
   Build command: npm run build
   Publish directory: .next
   ```
6. Click **"Deploy site"**

### Step 4: Wait for Build (2-3 minutes)

Watch the deploy logs. You'll see:
- Installing dependencies
- Building Next.js app
- Deploying to Netlify Edge

### Step 5: Done! 🎉

Your site is live at: `https://random-name-123.netlify.app`

**Customize your URL:**
1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Change to: `minimax-studio-yadu` (or any available name)
4. Your new URL: `https://minimax-studio-yadu.netlify.app`

---

## 📋 Method 2: Netlify CLI (Fastest)

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

This opens your browser to authenticate.

### Step 3: Deploy

```bash
cd /home/claude/minimax-studio

# Initial deploy
netlify deploy

# Follow prompts:
# - Create & configure a new site: Yes
# - Team: Choose your team
# - Site name: minimax-studio-yadu (or leave blank for random)
# - Publish directory: .next

# After testing, deploy to production
netlify deploy --prod
```

### Step 4: Done! 🎉

CLI will give you the live URL.

---

## 📋 Method 3: Drag & Drop (No Git Required)

### Step 1: Build Locally

```bash
cd /home/claude/minimax-studio
npm install
npm run build
```

### Step 2: Deploy to Netlify

1. **Go to** [app.netlify.com/drop](https://app.netlify.com/drop)
2. **Drag & drop** the `.next` folder
3. **Done!** Instant deployment

**Note**: No auto-updates with this method. Use Methods 1 or 2 for continuous deployment.

---

## 🔧 Build Configuration

Netlify should auto-detect Next.js, but if needed, set:

**Build command:**
```bash
npm run build
```

**Publish directory:**
```
.next
```

**Node version:**
```
18
```

These are already configured in `netlify.toml`!

---

## 🌍 Custom Domain Setup

### Free Netlify Subdomain

1. Site settings → Domain management
2. Edit site name → `your-name.netlify.app`

### Your Own Domain

1. **Buy domain** (GoDaddy, Namecheap, etc.)
2. **In Netlify**:
   - Domain management → Add custom domain
   - Enter: `yourdomain.com`
3. **Update DNS**:
   - Add A record: `75.2.60.5`
   - Or CNAME: `your-site.netlify.app`
4. **Enable HTTPS** (automatic with Netlify)

---

## 🔄 Continuous Deployment

With Method 1 (GitHub + Netlify):

**Every git push auto-deploys!**

```bash
# Make changes to code
git add .
git commit -m "Added new feature"
git push

# Netlify automatically:
# ✅ Detects push
# ✅ Builds new version
# ✅ Deploys to production
```

**Build notifications:**
- Email on deploy success/failure
- Slack integration available
- Discord webhooks supported

---

## 🎯 Environment Variables

**Not needed!** API keys are stored in browser (IndexedDB).

But if you want to add any:
1. Site settings → Environment variables
2. Add key-value pairs
3. Redeploy

---

## 🚀 Performance Optimizations

Netlify automatically provides:

✅ **Global CDN** - Fast worldwide  
✅ **HTTPS** - Free SSL certificate  
✅ **HTTP/2** - Faster loading  
✅ **Gzip compression** - Smaller files  
✅ **Image optimization** - Smart caching  
✅ **Edge caching** - Super fast responses  

**Your site will be BLAZING fast!** ⚡

---

## 📊 Monitoring & Analytics

### Netlify Analytics (Optional - Paid)

1. Site settings → Analytics
2. Enable Netlify Analytics
3. View traffic, performance, etc.

### Free Alternatives:

**Google Analytics:**
```typescript
// Add to src/app/layout.tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
```

**Plausible Analytics:**
```html
<script defer data-domain="yourdomain.com" 
  src="https://plausible.io/js/script.js">
</script>
```

---

## 🔍 Troubleshooting

### Build Failed?

**Check build logs in Netlify dashboard**

Common fixes:
```bash
# Clear cache and rebuild locally
rm -rf .next node_modules
npm install
npm run build

# If successful, push to GitHub
git add .
git commit -m "Fix build"
git push
```

### Site Shows 404?

1. Check publish directory: `.next`
2. Verify build succeeded
3. Check deploy logs for errors

### Styles Not Loading?

1. Clear Netlify cache: Deploy settings → Clear cache
2. Redeploy site

### API Not Working?

1. Configure your MiniMax API key in the app (not in Netlify)
2. Check browser console for errors
3. Verify API key is valid

---

## 🎨 Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] Can configure API key
- [ ] Video generation works
- [ ] Image generation works
- [ ] Text chat works
- [ ] Music generation works
- [ ] Code sandbox works
- [ ] Mobile responsive
- [ ] HTTPS enabled (automatic)
- [ ] Custom domain (optional)

---

## 💡 Pro Tips

1. **Branch Previews**: 
   - Create feature branch
   - Push to GitHub
   - Netlify auto-creates preview URL
   - Test before merging to main

2. **Deploy Notifications**:
   - Settings → Build & deploy → Deploy notifications
   - Add Slack/Discord webhook
   - Get notified on every deploy

3. **Split Testing**:
   - Netlify supports A/B testing
   - Test different versions
   - Analytics included

4. **Form Handling**:
   - Netlify Forms for contact forms
   - No backend needed
   - Free tier: 100 submissions/month

---

## 📈 Scaling

**Free Tier Limits:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- Unlimited team members

**Upgrade when needed:**
- More bandwidth
- Faster builds
- Priority support
- Advanced features

---

## 🔐 Security

Netlify provides:
- ✅ Free SSL/HTTPS
- ✅ DDoS protection
- ✅ CDN security
- ✅ Headers configuration
- ✅ Role-based access

**Additional security:**
```toml
# Add to netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

---

## 🎯 Quick Reference

### Commands
```bash
# Deploy to production
netlify deploy --prod

# Open site
netlify open:site

# Check status
netlify status

# View logs
netlify logs
```

### URLs
- Netlify Dashboard: [app.netlify.com](https://app.netlify.com)
- Documentation: [docs.netlify.com](https://docs.netlify.com)
- Community: [community.netlify.com](https://community.netlify.com)

---

## ✨ Next Steps

1. **Configure API Key** in deployed app
2. **Test all features** (video, image, text, music, code)
3. **Share with clients** - professional URL!
4. **Add custom domain** (optional)
5. **Set up analytics** (optional)

---

## 🆘 Need Help?

**Netlify Support:**
- Community Forum: [community.netlify.com](https://community.netlify.com)
- Documentation: [docs.netlify.com](https://docs.netlify.com)
- Twitter: [@Netlify](https://twitter.com/netlify)

**Platform Issues:**
- Check [QUICKSTART.md](QUICKSTART.md)
- See [README.md](README.md)
- Review [API_FEATURES.md](API_FEATURES.md)

---

## 🎉 Success!

Your MiniMax Studio is now **LIVE** and accessible worldwide! 🌍

Share your URL and start creating amazing AI content! 🎨🎬🎵💻

**Example URL:** `https://minimax-studio-yadu.netlify.app`

---

**Made with ❤️ for the AI community**

Deploy once, create forever! 🚀
