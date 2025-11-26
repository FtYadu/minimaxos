# 🚀 Deploy to Cloudflare Pages - Complete Guide

Deploy MiniMax Studio to **Cloudflare's Global Edge Network** for blazing fast performance worldwide! ⚡

---

## 🌟 Why Cloudflare Pages?

✅ **Fastest CDN** - 300+ edge locations worldwide  
✅ **Free Tier** - Unlimited bandwidth, unlimited requests  
✅ **Auto HTTPS** - Free SSL certificates  
✅ **DDoS Protection** - Built-in security  
✅ **Zero Config** - Just connect & deploy  
✅ **Edge Computing** - Super low latency  

---

## 📋 Method 1: GitHub + Cloudflare (Recommended) ⭐

### Step 1: Create GitHub Repository (2 min)

1. **Go to GitHub**: [github.com/new](https://github.com/new)
2. **Repository name**: `minimax-studio`
3. **Visibility**: Public or Private (your choice)
4. **DON'T** initialize with README
5. Click **"Create repository"**

### Step 2: Push Code to GitHub (1 min)

```bash
cd /home/claude/minimax-studio

# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/minimax-studio.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/ftyadu/minimax-studio.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Cloudflare Pages (2 min)

1. **Go to Cloudflare**: [dash.cloudflare.com](https://dash.cloudflare.com) (sign up if needed - FREE!)
2. Navigate to **"Workers & Pages"** in sidebar
3. Click **"Create application"** → **"Pages"** tab → **"Connect to Git"**
4. **Authorize GitHub** (if first time)
5. Select **"minimax-studio"** repository
6. **Build settings**:
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   ```
7. Click **"Save and Deploy"**

### Step 4: Done! 🎉

Build completes in **2-3 minutes**.

**Your site will be live at:**
`https://minimax-studio.pages.dev`

**Custom domain?**
- Pages settings → Custom domains → Add domain
- Follow DNS instructions
- Free SSL included!

---

## 📋 Method 2: Wrangler CLI (Fastest - Direct Deploy)

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

Opens browser for authentication.

### Step 3: Deploy

```bash
cd /home/claude/minimax-studio

# Build the app
npm install
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy .next --project-name=minimax-studio
```

### Step 4: Done! 🎉

CLI gives you the live URL instantly!

**Example URL:**
`https://minimax-studio.pages.dev`

---

## 📋 Method 3: Direct Upload (No Git)

### Step 1: Build Locally

```bash
cd /home/claude/minimax-studio
npm install
npm run build
```

### Step 2: Deploy via Dashboard

1. Go to: [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create application** → **Pages** → **Upload assets**
3. **Drag & drop** the `.next` folder
4. Click **"Deploy site"**

**Note**: This method doesn't support auto-updates. Use Methods 1 or 2 for CI/CD.

---

## 🔄 Continuous Deployment

With **Method 1** (GitHub + Cloudflare):

**Every git push auto-deploys!**

```bash
# Make changes to code
git add .
git commit -m "Added awesome feature"
git push

# Cloudflare automatically:
# ✅ Detects push
# ✅ Builds new version
# ✅ Deploys globally in seconds
```

---

## 🌍 Custom Domain Setup

### Use Your Own Domain

1. **In Cloudflare Dashboard**:
   - Workers & Pages → Your project → Custom domains
   - Click "Set up a custom domain"
   - Enter: `yourdomain.com`

2. **Two options**:

   **A) Domain already on Cloudflare:**
   - One click setup! ✅
   - DNS records added automatically

   **B) Domain elsewhere:**
   - Update nameservers to Cloudflare
   - Or add CNAME record: `project.pages.dev`

3. **SSL/HTTPS** - Automatic & Free! 🔒

---

## ⚡ Performance Benefits

Cloudflare Pages provides:

✅ **Global CDN** - 300+ locations  
✅ **Edge Caching** - Ultra-fast responses  
✅ **HTTP/3** - Newest protocol  
✅ **Brotli Compression** - Smaller files  
✅ **Smart Routing** - Fastest path  
✅ **DDoS Protection** - Always secure  
✅ **Web Analytics** - Built-in (free)  
✅ **Unlimited Bandwidth** - No caps!  

**Your site will be INSANELY fast!** 🚀

---

## 🔧 Build Configuration

Cloudflare should auto-detect Next.js, but if needed:

**Build command:**
```bash
npm run build
```

**Build output directory:**
```
.next
```

**Root directory:**
```
/
```

**Node version:**
```
18
```

**Environment variables:**
Not needed! API keys stored in browser (IndexedDB).

---

## 📊 Monitoring & Analytics

### Cloudflare Web Analytics (Free!)

1. Workers & Pages → Your project → Analytics
2. View:
   - Page views
   - Unique visitors
   - Performance metrics
   - Geographic data

### Real User Monitoring (RUM)

Cloudflare automatically tracks:
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)

---

## 🔍 Troubleshooting

### Build Failed?

**Check build logs in Cloudflare dashboard**

Common fixes:
```bash
# Test build locally first
cd /home/claude/minimax-studio
npm install
npm run build

# If successful, push to GitHub
git add .
git commit -m "Fix build"
git push
```

### Site Shows Error?

1. Check build output directory: `.next`
2. Verify framework preset: `Next.js`
3. Check build logs for errors

### Assets Not Loading?

1. Check public folder structure
2. Verify image paths are relative
3. Clear Cloudflare cache: Project settings → Cache

### API Not Working?

1. Configure MiniMax API key in the app (not in Cloudflare)
2. Check browser console for errors
3. Verify API key is valid at platform.minimax.io

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
- [ ] Analytics enabled (optional)

---

## 💡 Pro Tips

### 1. Preview Deployments

**Every branch gets a preview URL!**
```bash
git checkout -b feature-branch
git push origin feature-branch
```
Cloudflare auto-creates: `feature-branch.minimax-studio.pages.dev`

### 2. Rollback Instantly

- Project → Deployments
- Click any previous deployment
- Click "Rollback to this deployment"
- **Done in seconds!**

### 3. Environment Variables

If you need them later:
- Project settings → Environment variables
- Add key-value pairs
- Available during build & runtime

### 4. Functions (Serverless)

Cloudflare Pages supports serverless functions:
```
/functions
  /api
    /hello.ts  → https://site.pages.dev/api/hello
```

### 5. Redirects & Headers

Create `_redirects` or `_headers` in public folder:

**_redirects:**
```
/old-path  /new-path  301
/docs/*    https://docs.example.com/:splat  200
```

**_headers:**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

---

## 📈 Scaling

**Free Tier Limits:**
- ✅ Unlimited bandwidth
- ✅ Unlimited requests
- ✅ 500 builds/month
- ✅ Unlimited sites
- ✅ 1 concurrent build

**Pro Plan ($20/mo):**
- Everything in Free
- 5,000 builds/month
- 5 concurrent builds
- Advanced SSL
- Priority support

---

## 🔐 Security Features

Cloudflare provides:

✅ **Free SSL/TLS** - Universal certificates  
✅ **DDoS Protection** - Up to 300 Tbps  
✅ **WAF** - Web Application Firewall  
✅ **Bot Management** - Smart filtering  
✅ **Rate Limiting** - API protection  
✅ **DNSSEC** - Domain security  

**Enterprise-grade security for FREE!** 🛡️

---

## 🎯 Quick Reference

### Commands
```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy .next --project-name=minimax-studio

# Check status
wrangler pages project list

# View logs
wrangler pages deployment tail
```

### URLs
- Cloudflare Dashboard: [dash.cloudflare.com](https://dash.cloudflare.com)
- Documentation: [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- Community: [community.cloudflare.com](https://community.cloudflare.com)

---

## ✨ Next Steps After Deployment

1. **Configure API Key** in deployed app
2. **Test all 5 features**:
   - Video Generation (Hailuo 2.3)
   - Image Generation (image-01)
   - Text Chat (MiniMax M2)
   - Music Generation (music-2.0)
   - Code Sandbox (live editor)
3. **Add custom domain** (optional)
4. **Enable Web Analytics** (free!)
5. **Share with clients** - professional URL on Cloudflare's edge! ⚡

---

## 🆘 Need Help?

**Cloudflare Support:**
- Community Forum: [community.cloudflare.com](https://community.cloudflare.com)
- Documentation: [developers.cloudflare.com](https://developers.cloudflare.com)
- Discord: [discord.gg/cloudflaredev](https://discord.gg/cloudflaredev)

**Platform Issues:**
- Check [QUICKSTART.md](QUICKSTART.md)
- See [README.md](README.md)
- Review [API_FEATURES.md](API_FEATURES.md)

---

## 🎉 Success!

Your MiniMax Studio is now on **Cloudflare's Edge Network** - accessible worldwide with INSANE speed! 🌍⚡

**Example URL:** `https://minimax-studio.pages.dev`

Share your URL and start creating amazing AI content! 🎨🎬🎵💻

---

## 🔥 Cloudflare vs Other Platforms

| Feature | Cloudflare | Netlify | Vercel |
|---------|-----------|---------|--------|
| Bandwidth | ✅ Unlimited | 100GB | 100GB |
| Builds | 500/mo | 300 min/mo | 6000 min/mo |
| Edge Locations | 300+ | 13 | 100+ |
| DDoS Protection | ✅ Included | ❌ Paid | ❌ Paid |
| Analytics | ✅ Free | ❌ Paid | ❌ Paid |
| Custom Domains | ✅ Unlimited | ✅ Unlimited | ✅ Unlimited |
| Free SSL | ✅ Yes | ✅ Yes | ✅ Yes |

**Cloudflare wins on bandwidth & protection!** 🏆

---

**Made with ❤️ for the AI community**

Deploy on the edge, create forever! 🚀
