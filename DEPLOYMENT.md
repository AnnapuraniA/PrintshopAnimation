# 🚀 Deployment Guide - CraftPrint Website

## ✅ Production Checklist

### 1. Test Production Build Locally
```bash
npm run build
npm run preview
```
Visit `http://localhost:4173` to test the production build.

### 2. Verify All Features
- [ ] Loading animation works correctly
- [ ] 3D animations run smoothly
- [ ] Sound effects play properly
- [ ] Header and footer display correctly
- [ ] Mobile responsive design works
- [ ] All object types (bottle, t-shirt, pillow, cup) render
- [ ] Customer smile animation appears
- [ ] Mute/unmute button functions

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Free tier available
- Automatic deployments from Git
- Built-in CDN
- Perfect for React/Vite apps
- Zero configuration needed

**Steps:**

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - CraftPrint website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/craftprint-website.git
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "Add New Project"
   - Import your repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"
   - Done! Your site is live at `https://your-project.vercel.app`

3. **Custom Domain (Optional):**
   - In Vercel dashboard → Settings → Domains
   - Add your custom domain
   - Follow DNS instructions

---

### Option 2: Netlify

**Steps:**

1. **Push code to GitHub** (same as above)

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Build settings (auto-detected):
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Custom Domain:**
   - Site settings → Domain management → Add custom domain

---

### Option 3: GitHub Pages

**Steps:**

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update `vite.config.ts`:**
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import path from 'path'

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
     base: '/craftprint-website/', // Replace with your repo name
   })
   ```

3. **Add deploy script to `package.json`:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Your site will be at: `https://YOUR_USERNAME.github.io/craftprint-website/`

---

### Option 4: Self-Hosted (VPS/Server)

**Steps:**

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to your server

3. **Configure web server (Nginx example):**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/craftprint/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Enable gzip compression
       gzip on;
       gzip_types text/css application/javascript application/json image/svg+xml;
       gzip_min_length 1000;
   }
   ```

4. **Restart Nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

---

## 🔧 Performance Optimizations

### 1. Code Splitting (Optional)
The build warning suggests splitting large chunks. Add to `vite.config.ts`:

```typescript
export default defineConfig({
  // ... existing config
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 2. Enable Compression
Most hosting platforms (Vercel, Netlify) enable this automatically.

### 3. Add Analytics (Optional)

**Google Analytics:**
Add to `index.html` in `<head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

---

## 🔒 Security & SEO

### Update `index.html` Meta Tags

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    <title>CraftPrint - Custom Printing Solutions</title>
    <meta name="description" content="Professional custom printing services for bottles, t-shirts, pillows, cups and more. Watch our interactive 3D printing process." />
    <meta name="keywords" content="custom printing, personalized gifts, t-shirt printing, bottle printing, custom merchandise" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://yourwebsite.com/" />
    <meta property="og:title" content="CraftPrint - Custom Printing Solutions" />
    <meta property="og:description" content="Professional custom printing services with interactive 3D preview" />
    <meta property="og:image" content="https://yourwebsite.com/preview.jpg" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://yourwebsite.com/" />
    <meta property="twitter:title" content="CraftPrint - Custom Printing Solutions" />
    <meta property="twitter:description" content="Professional custom printing services with interactive 3D preview" />
    <meta property="twitter:image" content="https://yourwebsite.com/preview.jpg" />
    
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 📊 Post-Deployment Checklist

- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Verify loading times (use [PageSpeed Insights](https://pagespeed.web.dev/))
- [ ] Check console for errors
- [ ] Test all interactive features
- [ ] Verify custom domain (if applicable)
- [ ] Set up SSL certificate (auto on Vercel/Netlify)
- [ ] Add to Google Search Console
- [ ] Submit sitemap

---

## 🆘 Troubleshooting

### Issue: Blank page after deployment
**Solution:** Check browser console for errors. Usually a base URL issue.

### Issue: 404 on refresh
**Solution:** Configure routing (Vercel/Netlify handle this automatically)

### Issue: 3D scene not rendering
**Solution:** Check WebGL support. Add fallback message for unsupported browsers.

### Issue: Slow loading
**Solution:** 
- Enable code splitting
- Optimize 3D assets
- Enable CDN caching

---

## 📞 Contact & Support

For issues or questions:
- Check browser console for errors
- Verify all dependencies are installed
- Ensure Node.js version is 18+ 

---

## 🎉 Quick Start (Fastest Method)

**Recommended: Deploy to Vercel in 2 minutes**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# Follow prompts - that's it!
```

Your site will be live at `https://your-project.vercel.app`

---

**Need help?** Open an issue on GitHub or contact support.

Good luck with your deployment! 🚀

