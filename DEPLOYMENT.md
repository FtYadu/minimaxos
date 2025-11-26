# Deployment Guide

This guide will help you deploy MiniMax Studio to various platforms.

## 🚀 Vercel (Recommended)

Vercel is the fastest and easiest way to deploy Next.js applications.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Configure build settings (auto-detected)
   - Click "Deploy"

3. **Done!** Your app will be live at `your-app.vercel.app`

### Environment Variables:
No environment variables needed! API keys are stored in browser.

---

## 📦 Netlify

### Steps:

1. **Build Command:** `npm run build`
2. **Publish Directory:** `.next`
3. **Deploy**

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

## 🐳 Docker

### Dockerfile
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Build & Run
```bash
docker build -t minimax-studio .
docker run -p 3000:3000 minimax-studio
```

---

## ☁️ AWS Amplify

### Steps:

1. Connect your GitHub repository
2. Build settings (auto-detected):
   - Build command: `npm run build`
   - Output directory: `.next`
3. Deploy

---

## 🔷 Azure Static Web Apps

### azure-pipelines.yml
```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '18.x'
    displayName: 'Install Node.js'

  - script: |
      npm install
      npm run build
    displayName: 'npm install and build'

  - task: AzureStaticWebApp@0
    inputs:
      app_location: '/'
      output_location: '.next'
```

---

## 🌐 Self-Hosted (VPS/Dedicated Server)

### Using PM2

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Build the app**
   ```bash
   npm run build
   ```

3. **Start with PM2**
   ```bash
   pm2 start npm --name "minimax-studio" -- start
   pm2 save
   pm2 startup
   ```

4. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 🔧 Build Optimization

### Next.js Config for Production

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: ['api.minimax.io', 'api.minimaxi.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Performance
  experimental: {
    optimizeCss: true,
  },
};
```

---

## 📊 Performance Tips

1. **Enable Compression**
   - Vercel/Netlify handle this automatically
   - For self-hosted, use nginx gzip

2. **CDN Integration**
   - Vercel Edge Network (automatic)
   - Cloudflare (add as DNS proxy)

3. **Caching Strategy**
   - Static assets cached for 1 year
   - API responses not cached (dynamic content)

4. **Bundle Size**
   - Current bundle: ~500KB gzipped
   - Code splitting automatic with Next.js
   - Lazy load panels for faster initial load

---

## 🔒 Security Checklist

- ✅ HTTPS enabled (always!)
- ✅ API keys stored in browser only
- ✅ CSP headers configured
- ✅ No sensitive data in code
- ✅ Regular dependency updates

---

## 🌍 Custom Domain

### Vercel
1. Go to project settings
2. Add domain
3. Configure DNS (A or CNAME record)
4. Automatic SSL provisioning

### Netlify
1. Domain settings
2. Add custom domain
3. Update DNS records
4. Enable HTTPS

---

## 📈 Monitoring

### Recommended Tools:
- **Vercel Analytics** (built-in)
- **Sentry** (error tracking)
- **LogRocket** (session replay)
- **Google Analytics** (user analytics)

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Out of Memory
```bash
# Increase Node.js memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## 🎯 Production Checklist

- [ ] Build succeeds locally
- [ ] All features tested
- [ ] API key configuration works
- [ ] Images load correctly
- [ ] Videos download properly
- [ ] Code sandbox functional
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Domain configured
- [ ] Analytics added (optional)

---

**Happy Deploying! 🚀**

Need help? Check the [main README](README.md) or create an issue.
