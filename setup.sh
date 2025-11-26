#!/bin/bash

# MiniMax Studio Setup Script
# This script installs dependencies and starts the dev server

echo "🚀 MiniMax Studio - Setup"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
echo ""
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "🚀 Starting development server..."
    echo ""
    npm run dev
else
    echo ""
    echo "❌ Failed to install dependencies"
    exit 1
fi
