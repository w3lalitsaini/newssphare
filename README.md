# 🌐 NewsSphere — Production Blog & News Platform

A fully-featured, SEO-optimized news/blog platform built with **Next.js 16 App Router**, **TypeScript**, **Tailwind CSS**, **MongoDB**, and **NextAuth**.

## ✨ Features

- **Modern Homepage** with hero slider, trending, latest articles, category sections
- **Dark/Light Mode** toggle with next-themes
- **Full Article Pages** with reading time, share, save, comments, related articles
- **Google AdSense** ready ad placements (top banner, sidebar, in-article, footer)
- **Admin Dashboard** with CRUD for articles, categories, tags, users, comments, ads
- **Authentication** via NextAuth (credentials-based, extensible to OAuth)
- **Cloudinary** media uploads
- **Full-text search** powered by MongoDB text indexes
- **SEO-optimized**: OpenGraph, Twitter cards, JSON-LD schema, sitemap.xml, robots.txt
- **Category & Tag pages** with pagination
- **Comment system** with moderation
- **Newsletter signup** integration

## 🛠 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.local.example .env.local
```

Fill in your `.env.local`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/newssphere
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_SITE_NAME=NewsSphere
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. Run development server
```bash
npm run dev
```

### 4. Create admin user
After first registration, update the user role to `admin` in MongoDB:
```js
db.users.updateOne({ email: "admin@email.com" }, { $set: { role: "admin" } })
```

## 📁 Project Structure

```
/app
  /admin          — Admin dashboard (CRUD articles, users, comments, ads)
  /api            — API routes (articles, auth, comments, upload, search)
  /article/[slug] — Individual article pages
  /auth           — Login & register pages
  /category/[slug]— Category listing pages
  /search         — Search results page
/components
  /ads            — AdSlot component (Google AdSense)
  /admin          — Admin sidebar, shared components
  /article        — ArticleCard, CommentSection, Sidebar
  /home           — HeroSlider
  /layout         — Navbar, Footer, SessionWrapper
/lib              — db.ts, auth.ts, utils.ts
/models           — MongoDB/Mongoose models (Article, User, Category, Tag, Comment, Ad)
```

## 🚀 Deploy

Deploy to Vercel with one click:
- Connect your GitHub repo
- Set environment variables in Vercel dashboard
- Done! Auto-deploys on every push

## 📈 Ad Revenue Setup

1. Sign up for Google AdSense at adsense.google.com
2. Add your `NEXT_PUBLIC_ADSENSE_CLIENT_ID` to `.env.local`
3. Configure ad placements in `/admin/advertisements`
4. AdSlots are pre-positioned at all high-value locations

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | MongoDB + Mongoose |
| Auth | NextAuth.js |
| Media | Cloudinary |
| SEO | Next.js Metadata API + JSON-LD |
| Deployment | Vercel-ready |
