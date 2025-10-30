# 🎨 Logo Setup Guide

## Current Logo
- **File:** `ishrealmtvlogo.png`
- **Location:** `/public/ishrealmtvlogo.png`
- **Used in:** Navbar (top-left corner)

---

## How to Update Logo

### Step 1: Prepare Your Logo
- **Recommended format:** PNG with transparent background
- **Recommended size:** 256x256px or 512x512px (square)
- **File name:** Keep as `ishrealmtvlogo.png` (or update Navbar.tsx)

### Step 2: Replace the File
```bash
# Simply replace the file in the public folder
cp your-new-logo.png public/ishrealmtvlogo.png
```

### Step 3: Rebuild (if needed)
```bash
npm run build
```

---

## Current Display Settings

### Mobile:
- **Size:** 32x32px (w-8 h-8)
- **Effects:** Pink drop shadow glow

### Desktop:
- **Size:** 40x40px (w-10 h-10)
- **Effects:** Pink drop shadow glow

### Styling:
```css
.logo {
  object-fit: contain;  /* Maintains aspect ratio */
  drop-shadow: 0 0 8px rgba(236, 72, 153, 0.5);  /* Pink glow */
}
```

---

## Code Location

The logo is used in:
- **File:** `src/components/Navbar.tsx`
- **Line:** ~31-35

```tsx
<img 
  src="/ishrealmtvlogo.png" 
  alt="ISHREALM TV Logo" 
  className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]"
/>
```

---

## To Change Logo File Name

If you want to use a different file name:

1. Update `src/components/Navbar.tsx`:
```tsx
// Change this line:
src="/ishrealmtvlogo.png"

// To:
src="/your-new-logo-name.png"
```

2. Place your logo in `/public/your-new-logo-name.png`

---

## Tips for Best Results

✅ **DO:**
- Use PNG format with transparency
- Use square aspect ratio (1:1)
- Keep file size under 100KB
- Use high resolution (at least 256x256px)

❌ **AVOID:**
- JPG (no transparency)
- Very large files (> 500KB)
- Non-square logos (will be distorted)
- Low resolution (< 128px)

---

## Advanced: Custom Styling

To change the logo glow color, update the `drop-shadow`:

```css
/* Pink glow (current) */
drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]

/* Blue glow */
drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]

/* Green glow */
drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]

/* Gold glow */
drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]
```

---

## Troubleshooting

**Logo not showing?**
- Check file is in `/public/` folder
- Check file name matches exactly
- Hard refresh browser (Ctrl+F5)
- Rebuild: `npm run build`

**Logo looks pixelated?**
- Use higher resolution image (512x512px recommended)

**Logo has wrong colors?**
- Check PNG has transparency
- Verify image editor didn't add background

---

**Happy branding! 🎨**

