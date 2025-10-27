# 🚀 ISHREALM TV - Deployment Guide

This guide will help you deploy ISHREALM TV to GitHub, Vercel, and set up Supabase for the backend.

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js 18+](https://nodejs.org/) installed
- [GitHub account](https://github.com/)
- [Vercel account](https://vercel.com/)
- [Supabase account](https://supabase.com/)

## 🔧 Step 1: Push to GitHub

### 1.1 Initialize Git Repository
```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: ISHREALM TV watch party platform"

# Add remote origin (replace with your GitHub repo URL)
git remote add origin https://github.com/ishmaelishrealm/IshrealmTV.git

# Push to GitHub
git push -u origin main
```

### 1.2 GitHub Repository Setup
1. Go to [GitHub](https://github.com/ishmaelishrealm/IshrealmTV)
2. Make sure the repository is public
3. Enable GitHub Pages if needed

## 🗄️ Step 2: Set Up Supabase Backend

### 2.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com/)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `ishrealm-tv`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users

### 2.2 Set Up Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL script
4. This will create all necessary tables and policies

### 2.3 Get Supabase Credentials
1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## 🌐 Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel
1. Go to [Vercel](https://vercel.com/)
2. Click "New Project"
3. Import your GitHub repository: `ishmaelishrealm/IshrealmTV`
4. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Set Environment Variables
In Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_NAME=ISHREALM TV
VITE_APP_VERSION=1.0.0
VITE_APP_URL=https://your-app.vercel.app
```

### 3.3 Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Your app will be available at `https://your-app.vercel.app`

## 📱 Step 4: PWA Mobile Setup

### 4.1 PWA Icons
Create the following icon files in the `public/` directory:

- `pwa-192x192.png` (192x192 pixels)
- `pwa-512x512.png` (512x512 pixels)
- `apple-touch-icon.png` (180x180 pixels)
- `favicon-32x32.png` (32x32 pixels)
- `favicon-16x16.png` (16x16 pixels)

### 4.2 Install PWA
Users can install the app on mobile devices:
1. Open the app in mobile browser
2. Look for "Add to Home Screen" prompt
3. Or use browser menu → "Add to Home Screen"

## 🔄 Step 5: GitHub Actions (Optional)

The project includes GitHub Actions for automatic deployment:

### 5.1 Set GitHub Secrets
Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5.2 Get Vercel Tokens
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token
3. Get your Org ID and Project ID from Vercel dashboard

## 🧪 Step 6: Testing

### 6.1 Local Development
```bash
# Install dependencies
npm install

# Copy environment variables
cp env.example .env.local

# Edit .env.local with your Supabase credentials
# Start development server
npm run dev
```

### 6.2 Test Features
- ✅ Create a room
- ✅ Join a room with room code
- ✅ Test video playback sync
- ✅ Test chat functionality
- ✅ Test PWA installation on mobile

## 🚀 Step 7: Production Deployment

### 7.1 Final Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel (if using CLI)
vercel --prod
```

### 7.2 Domain Setup (Optional)
1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed

## 📊 Step 8: Monitoring & Analytics

### 8.1 Supabase Analytics
- Monitor database usage in Supabase dashboard
- Check real-time connections
- Monitor API usage

### 8.2 Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user engagement

## 🔧 Troubleshooting

### Common Issues:

**1. Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Supabase Connection Issues**
- Check environment variables
- Verify Supabase project is active
- Check database schema is properly set up

**3. PWA Not Working**
- Ensure all icon files are present
- Check manifest.json is accessible
- Test in different browsers

**4. Real-time Features Not Working**
- Verify Supabase real-time is enabled
- Check RLS policies are correct
- Test with different browsers

## 📱 Mobile App (Future)

For native mobile apps, consider:
- **React Native**: Convert to React Native
- **Capacitor**: Wrap PWA as native app
- **Expo**: Use Expo for React Native development

## 🎯 Next Steps

1. **User Authentication**: Add Supabase Auth
2. **User Profiles**: Store user preferences
3. **Room History**: Save previous rooms
4. **Screen Sharing**: Add screen share feature
5. **Voice Chat**: Integrate WebRTC
6. **Analytics**: Add user analytics
7. **Monetization**: Add premium features

## 📞 Support

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/ishmaelishrealm/IshrealmTV/issues)
2. Review [Supabase Documentation](https://supabase.com/docs)
3. Check [Vercel Documentation](https://vercel.com/docs)

---

**🎉 Congratulations! Your ISHREALM TV app is now live and ready for users!**
