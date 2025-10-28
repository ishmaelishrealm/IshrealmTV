# Supabase Storage Setup for Video Uploads

## 📦 Quick Setup (5 minutes)

### Step 1: Create Storage Bucket

1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** (left sidebar)
3. Click **"New Bucket"**
4. Configure the bucket:
   ```
   Name: ishrealm-videos
   Public bucket: ✓ (checked)
   File size limit: 524288000 (500 MB)
   Allowed MIME types: video/mp4, video/webm, video/ogg, video/x-matroska
   ```
5. Click **"Create bucket"**

### Step 2: Set Storage Policies

1. Click on the **`ishrealm-videos`** bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**

#### Policy 1: Public Read Access
```sql
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'ishrealm-videos' );
```

#### Policy 2: Authenticated Upload
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'ishrealm-videos' );
```

#### Policy 3: Owner Delete
```sql
CREATE POLICY "Users can delete their own uploads"
ON storage.objects FOR DELETE
USING ( bucket_id = 'ishrealm-videos' AND auth.uid() = owner );
```

### Step 3: Test Upload

1. Make sure your `.env` has:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Go to **Create Room** → **Upload File**
3. Select a small video file (< 10MB for testing)
4. Watch the upload progress!

---

## 📊 Free Tier Limits

Supabase Free Tier includes:
- **1 GB storage** (perfect for testing!)
- **2 GB bandwidth/month**
- **50 MB max file size** (we set 500MB but free tier limits to 50MB)

### Upgrade for Production:
- **Pro Plan ($25/month)**: 100 GB storage, 200 GB bandwidth
- **Pay-as-you-go**: $0.021/GB storage, $0.09/GB bandwidth

---

## 🎬 How It Works

### User Flow:
1. **User uploads video** → Instantly starts uploading to Supabase Storage
2. **Progress bar shows** → Real-time feedback (50% → 100%)
3. **Gets public CDN URL** → e.g., `https://abc.supabase.co/storage/v1/object/public/ishrealm-videos/videos/1234-abc.mp4`
4. **Room uses hosted URL** → All guests access the same CDN URL
5. **Perfect sync** → Works across all devices globally! 🌍

### Technical Flow:
```
Local File → Supabase Storage → CDN → Public URL → localStorage → All Devices
```

---

## 🔐 Security Notes

- **Public bucket** = Anyone with URL can view (needed for watch parties)
- **Upload restricted** = Only authenticated users can upload
- **Delete restricted** = Only owner can delete their files
- **Max file size** = 500 MB (configurable in bucket settings)

---

## 🚀 Future Enhancements

When you're ready to monetize:

1. **Payment Integration:**
   - Free tier: YouTube/Twitch only
   - Paid tier: Video uploads enabled
   - Stripe integration for payments

2. **File Management:**
   - Auto-delete old uploads (7-30 days)
   - Compression/transcoding (FFmpeg + Supabase Edge Functions)
   - Multiple quality options (360p, 720p, 1080p)

3. **Analytics:**
   - Track upload count per user
   - Bandwidth usage monitoring
   - Storage quota alerts

---

## ✅ Checklist

- [ ] Created `ishrealm-videos` bucket
- [ ] Set bucket to public
- [ ] Added storage policies
- [ ] Added Supabase env vars to `.env`
- [ ] Added env vars to Vercel
- [ ] Tested upload locally
- [ ] Tested sync across devices

---

## 🐛 Troubleshooting

**Upload fails immediately:**
- Check if Supabase env vars are set
- Verify bucket name is exactly `ishrealm-videos`
- Check if bucket is set to public

**Upload succeeds but video won't play:**
- Check CORS settings in Supabase
- Verify the public URL is accessible
- Check browser console for errors

**"Policy violation" error:**
- Make sure all 3 storage policies are created
- Check if user is authenticated (guest mode may need adjustment)

---

**Happy Uploading! 🎉**

