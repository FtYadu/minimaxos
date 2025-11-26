# 🚀 Quick Start - Get Running in 2 Minutes!

## Option 1: Automatic Setup (Linux/Mac)

```bash
cd minimax-studio
./setup.sh
```

The script will:
1. Check Node.js version
2. Install all dependencies
3. Start the dev server automatically

**That's it!** Open http://localhost:3000

---

## Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:3000
```

---

## First Time Usage

### Step 1: Configure API Key
1. Click **"No API Key"** button (top right)
2. Select region: **International** or **China**
3. Paste your MiniMax API key
4. Click **"Save API Key"**

### Step 2: Start Creating!

**Generate a Video:**
1. Click "Video Generation" in sidebar
2. Enter prompt: "A serene lake at sunset"
3. Click "Generate Video"
4. Wait 2-3 minutes
5. Download!

**Generate an Image:**
1. Click "Image Generation"
2. Enter prompt: "A futuristic cityscape"
3. Click "Generate Image"
4. Download immediately (expires in 24h!)

**Chat with AI:**
1. Click "Text Generation"
2. Type your message
3. Press Enter
4. Get AI response!

**Create Music:**
1. Click "Music Generation"
2. Describe style: "Upbeat jazz piano"
3. (Optional) Add lyrics
4. Click "Generate Music"
5. Play and download!

**Generate Code:**
1. Click "Code Sandbox"
2. Choose template (React/Vanilla)
3. Describe: "Todo list app"
4. Click "Generate Code"
5. Edit and preview live!

---

## Getting Your API Key

1. Go to [platform.minimax.io](https://platform.minimax.io)
2. Sign up / Log in
3. Navigate to API Keys section
4. Create new API key
5. Copy and save it securely

---

## Need Help?

- **Full Documentation**: See [README.md](README.md)
- **API Features**: See [API_FEATURES.md](API_FEATURES.md)
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Pro Tips 💡

1. **Video Generation**
   - Use camera commands for cinematic shots
   - Try `[Pan left,Zoom in]` for dynamic movement
   - 768P for quick previews, 1080P for final

2. **Image Generation**
   - Be descriptive: "photorealistic, 4K, detailed"
   - Use seed for consistent variations
   - Download images within 24 hours!

3. **Text Generation**
   - Lower temperature (0.3) for facts
   - Higher temperature (1.2) for creativity
   - Use full 204K context!

4. **Music Generation**
   - Specify instruments and mood
   - Use structure tags for better flow
   - 256kbps bitrate for production

5. **Code Generation**
   - Be specific about features
   - Mention styling preferences
   - Request error handling

---

## Troubleshooting

**Port 3000 already in use?**
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9
```

**Module not found errors?**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**API key not working?**
- Check it's copied correctly (no spaces)
- Verify region matches your account
- Ensure you have API credits

---

## What's Included? ✨

- ✅ All 7 video models
- ✅ 15 camera commands
- ✅ Image generation with custom sizes
- ✅ MiniMax M2 LLM (204K context)
- ✅ Music generation with lyrics
- ✅ Live code sandbox
- ✅ Browser storage (IndexedDB)
- ✅ Modern dark UI
- ✅ Complete generation history
- ✅ Download management
- ✅ Mobile responsive

---

## Production Deployment

**Deploy to Vercel (Free):**
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for more options!

---

**🎉 You're ready to create amazing AI content!**

Enjoy MiniMax Studio! 🎨🎬🎵💻
