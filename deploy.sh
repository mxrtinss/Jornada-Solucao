#!/bin/bash

# Vercel Deployment Script
echo "🚀 Starting Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to set your MONGODB_URI environment variable in the Vercel dashboard!"
echo "🔗 Check your deployment at: https://your-app.vercel.app"
echo "🧪 Test your API at: https://your-app.vercel.app/api/test" 