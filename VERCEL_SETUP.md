# 🚀 Vercel Deployment Guide - Fix White Screen

## The Problem

If your app works on **localhost** but shows a **white screen on Vercel**, it's because the authentication system needs environment variables that aren't configured on Vercel yet.

## ✅ Solution: Add Environment Variables to Vercel

### Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### Step 2: Add to Vercel

#### Option A: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/dashboard
2. Select your **IshrealmTV** project
3. Click **Settings** → **Environment Variables**
4. Add these three variables:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_GUEST_SESSION_MINUTES` | `90` |

5. **Important:** Select "Production", "Preview", and "Development" for all variables
6. Click **Save**

#### Option B: Via Command Line

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link to your project
vercel link

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste your URL when prompted

vercel env add VITE_SUPABASE_ANON_KEY
# Paste your key when prompted

vercel env add VITE_GUEST_SESSION_MINUTES
# Enter: 90
```

### Step 3: Redeploy

After adding the environment variables:

1. Go to your project on Vercel
2. Click **Deployments**
3. Find the latest deployment
4. Click the **⋯** (three dots)
5. Select **Redeploy**
6. Check "Use existing Build Cache" → **NO** (important!)
7. Click **Redeploy**

## 🎯 What This Fixes

### Before (White Screen):
```
❌ App loads but crashes silently
❌ No error message
❌ Auth system fails to initialize
❌ React can't render
```

### After (Working):
```
✅ App loads successfully
✅ Auth modal appears
✅ Guest mode works (90 min timer)
✅ Full authentication when Supabase is configured
```

## 🧪 Verify It Works

After redeployment:

1. Visit your Vercel URL
2. You should see the auth modal
3. Click "Continue as Guest"
4. You should see the timer in bottom-right
5. App should work normally

## 🆘 Troubleshooting

### Still white screen after adding env vars?

**Make sure you:**
1. ✅ Spelled variable names correctly (case-sensitive!)
2. ✅ Selected all environments (Production, Preview, Development)
3. ✅ Redeployed **without** using build cache
4. ✅ Waited 1-2 minutes for deployment to complete

### Check Vercel logs:

1. Go to **Deployments**
2. Click your latest deployment
3. Check **Build Logs** for errors
4. Check **Function Logs** (Runtime Logs) for crashes

### Common mistakes:

| Mistake | Fix |
|---------|-----|
| Wrong variable name (e.g., `SUPABASE_URL` instead of `VITE_SUPABASE_URL`) | Must start with `VITE_` for Vite to recognize them |
| Missing from "Production" environment | Make sure all 3 environments are checked |
| Old build cache | Redeploy without cache |
| Didn't redeploy after adding vars | Environment changes require redeployment |

## 🎉 App Features (Once Working)

### For Guests:
- ⏱️ 90 minutes free per day
- 🎬 Watch parties with friends
- 💬 Real-time chat
- 📺 YouTube/Twitch sync

### For Registered Users:
- ✨ Unlimited hosting
- 👤 User profiles
- 📊 Watch history
- 🎨 Premium themes (coming soon)

## 📝 Notes

- **Guest mode works without Supabase** - users can still use your app!
- **Sign-up/login requires Supabase** - shows a helpful message if not configured
- **Environment variables are private** - never commit `.env` to git
- **Vercel auto-deploys** - push to GitHub triggers new deployment

## 🔐 Security

Your environment variables are:
- ✅ Encrypted at rest on Vercel
- ✅ Only accessible to your deployments
- ✅ Not exposed in client-side code (except `VITE_*` prefixed ones, which are safe)
- ✅ Can be rotated anytime in Vercel dashboard

---

**Need help?** Check the Vercel logs or create an issue on GitHub!

