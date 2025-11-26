# MiniMax Studio 🚀

A modern, production-ready web platform for AI content generation using the **MiniMax API**. Create videos, images, text, music, and code with a beautiful, intuitive interface.

![MiniMax Studio](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)

## ✨ Features

### 🎬 Video Generation
- **All MiniMax Models**: Hailuo 2.3, 2.3-Fast, 02, Director (T2V/I2V), Live Animation, Subject Consistency
- **15 Camera Commands**: Pan, truck, tilt, zoom, push, pull, pedestal, shake, tracking, static
- **Multiple Resolutions**: 512P, 720P, 768P, 1080P
- **Duration Options**: 6s or 10s videos
- **First/Last Frame Control**: Upload images for frame interpolation
- **Prompt Optimizer**: Built-in AI prompt enhancement
- **Real-time Progress**: Live status updates during generation
- **Direct Download**: Get your videos instantly

### 🖼️ Image Generation
- **High-Quality Models**: image-01 and image-01-live
- **8 Preset Aspect Ratios**: 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 21:9
- **Custom Dimensions**: 512-2048px with 8px increments
- **Batch Generation**: Create up to 9 images at once
- **Subject Reference**: Upload reference images for character consistency
- **Seed Control**: Reproducible results with seed numbers
- **Prompt Optimizer**: AI-enhanced prompts

### 💬 Text Generation (LLM)
- **MiniMax M2**: Advanced reasoning model
- **204K Context Window**: Massive context for complex tasks
- **Streaming Support**: Real-time response generation
- **Chat Interface**: Full conversation history
- **Temperature Control**: Precise to creative outputs
- **Markdown Rendering**: Beautiful formatted responses

### 🎵 Music Generation
- **Music 2.0 Model**: Professional quality tracks
- **Style & Mood Control**: Describe your desired sound
- **Lyrics Support**: Add custom lyrics with structure tags
- **Structure Tags**: [Intro], [Verse], [Chorus], [Bridge], [Outro]
- **Audio Settings**: Sample rate, bitrate, format customization
- **Multiple Formats**: MP3, PCM, FLAC, WAV
- **~5 Minute Tracks**: Full-length compositions

### 💻 Code Sandbox
- **AI Code Generation**: Describe your app, get working code
- **Live Editor**: Real-time code editing with Sandpack
- **4 Templates**: React, React+TS, Vanilla JS, Vanilla TS
- **Instant Preview**: See your code running immediately
- **Syntax Highlighting**: Professional code editor experience

## 🎨 UI/UX Features

- **Modern Dark Theme**: Sleek glassmorphism design
- **Responsive Layout**: Works on all screen sizes
- **Sidebar Navigation**: Quick access to all features
- **Collapsible Sidebar**: Maximize workspace
- **Real-time Status**: Live generation progress
- **Error Handling**: Clear error messages and recovery
- **Keyboard Shortcuts**: Efficient workflow
- **Smooth Animations**: Framer Motion powered

## 💾 Data Management

- **IndexedDB Storage**: Browser-based persistence
- **API Key Management**: Secure local storage
- **Region Selection**: International or China endpoints
- **Generation History**: Track all your creations
- **Metadata Tracking**: Full generation parameters stored
- **Export Support**: Download all generated content

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A MiniMax API key (get one at [platform.minimax.io](https://platform.minimax.io))

### Installation

1. **Clone or download the project**
```bash
cd minimax-studio
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:3000
```

### First Time Setup

1. Click the **"No API Key"** button in the header
2. Select your region (International or China)
3. Enter your MiniMax API key
4. Click **"Save API Key"**
5. Start creating! 🎉

## 📖 Usage Guide

### Video Generation

1. Navigate to **Video Generation** in sidebar
2. Select your model (Hailuo 2.3 recommended for production)
3. Enter a detailed prompt (be specific!)
4. Choose duration and resolution
5. (Optional) Select camera movements (up to 3)
6. (Optional) Upload first/last frame images
7. Click **"Generate Video"**
8. Wait for completion (~2-5 minutes for 1080P/6s)
9. Download your video!

**Pro Tips:**
- Use camera commands for cinematic control: `[Pan left,Zoom in]`
- Enable Prompt Optimizer for better results
- Use 768P for faster previews
- Hailuo 2.3-Fast for quick iterations

### Image Generation

1. Navigate to **Image Generation**
2. Select image-01 model
3. Write your image description
4. Choose aspect ratio or custom size
5. Set number of images (1-9)
6. (Optional) Upload subject reference for consistency
7. Click **"Generate Image(s)"**
8. Download images (they expire in 24h!)

**Pro Tips:**
- Be descriptive: "A serene lake at sunset with mountains, photorealistic, 4K quality"
- Use seed for variations of same concept
- Subject reference ensures character consistency

### Text Generation

1. Navigate to **Text Generation**
2. Select MiniMax M2 model
3. Type your message
4. Adjust temperature (0.7 for balanced)
5. Press Enter or click Send
6. Get AI response with full markdown support

**Pro Tips:**
- Lower temperature (0.3) for factual tasks
- Higher temperature (1.2) for creative writing
- Use system prompts for specialized behavior

### Music Generation

1. Navigate to **Music Generation**
2. Describe style & mood: "Upbeat electronic dance music"
3. (Optional) Add lyrics with structure tags
4. Configure audio settings
5. Click **"Generate Music"**
6. Play and download your track

**Pro Tips:**
- Be specific about genre and instruments
- Use structure tags for proper song flow
- Higher bitrate (256kbps) for production quality

### Code Sandbox

1. Navigate to **Code Sandbox**
2. Choose template (React, Vanilla, etc.)
3. Describe what you want to build
4. Click **"Generate Code"**
5. Edit code in live editor
6. See instant preview

**Pro Tips:**
- Be specific: "Todo app with add, remove, edit, and local storage"
- Mention styling: "with Tailwind CSS" or "dark theme"
- Request features: "with validation and error handling"

## 🛠️ Technical Stack

- **Frontend**: Next.js 15, React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Database**: IndexedDB (idb)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Code Editor**: Sandpack
- **Markdown**: React Markdown

## 📁 Project Structure

```
minimax-studio/
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── page.tsx         # Main app page
│   │   ├── layout.tsx       # Root layout
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Header.tsx       # Top header
│   │   ├── ApiKeyModal.tsx  # API configuration
│   │   └── panels/          # Generation panels
│   │       ├── VideoPanel.tsx
│   │       ├── ImagePanel.tsx
│   │       ├── TextPanel.tsx
│   │       ├── MusicPanel.tsx
│   │       └── CodePanel.tsx
│   └── lib/
│       ├── db.ts            # IndexedDB service
│       ├── minimax-client.ts # MiniMax API client
│       └── store.ts         # Zustand store
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🔒 Security

- **API keys stored locally**: Never sent to any server except MiniMax
- **No backend required**: Pure client-side application
- **IndexedDB encryption**: Browser-level security
- **HTTPS only**: Secure API communications

## 💰 Pricing (MiniMax API)

### Video
- Hailuo 2.3-Fast 768P/6s: $0.19
- Hailuo 2.3-Fast 1080P/6s: $0.33
- Hailuo 2.3/02 768P/6s: $0.28
- Hailuo 2.3/02 1080P/6s: $0.49

### Other
- Image (image-01): $0.0035 per image
- Text (M2): $0.30/M input, $1.20/M output tokens
- Music: $0.03 per 5-minute track

## 🚦 Rate Limits

- Video (Hailuo-2.3): 5 RPM
- Image (image-01): 10 RPM
- Text (M2-Stable): 500 RPM
- Music: 120 RPM

Contact api@minimax.io for higher limits.

## 🐛 Troubleshooting

### "No API Key" Error
- Make sure you've configured your API key in settings
- Verify your key is valid at platform.minimax.io
- Check your region selection matches your account

### Video Generation Timeout
- Large videos (1080P/10s) can take 5-10 minutes
- Check your network connection
- Verify you have sufficient API credits

### Images Not Loading
- Image URLs expire after 24 hours
- Download images immediately after generation
- Regenerate if URLs expired

### Code Sandbox Not Working
- Ensure you selected correct template
- Check browser console for errors
- Try refreshing the page

## 📄 License

This project is open source and available for use.

## 🙏 Credits

- Built with **MiniMax API** - [platform.minimax.io](https://platform.minimax.io)
- UI inspired by modern AI platforms
- Icons by **Lucide**
- Code editor by **Sandpack**

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📞 Support

For MiniMax API support: api@minimax.io
For platform issues: Create an issue in this repository

---

**Made with ❤️ for the AI community**

Enjoy creating amazing content with MiniMax Studio! 🎨🎬🎵💻
