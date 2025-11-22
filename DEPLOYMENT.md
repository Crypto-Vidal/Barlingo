# Barlingo - Vercel Deployment

## Issue
React Native apps can't deploy to Vercel. Vercel hosts web apps, React Native is for iOS/Android.

## Options

### Option 1: Vercel API + Expo Web

**Backend (Vercel Serverless):**
```bash
# Already created: /api/gradeLesson.js
vercel deploy
```

**Frontend (Expo Web):**
```bash
cd mobile
npm install
npx expo export:web
# Deploy the web-build folder to Vercel
```

### Option 2: Full Next.js Web App

Create Next.js version instead of React Native:
```bash
npx create-next-app@latest web
# Rebuild screens as Next.js pages
```

### Option 3: Keep Mobile + Firebase

React Native → App Stores (not Vercel)
Cloud Functions → Firebase (not Vercel)

## Current Setup

✅ **Vercel API ready:** `/api/gradeLesson.js`
❌ **Mobile app:** Needs Expo build or Next.js conversion

## Deploy Vercel API Only

```bash
vercel --prod
```

API endpoint: `https://your-project.vercel.app/api/gradeLesson`

Test:
```bash
curl -X POST https://your-project.vercel.app/api/gradeLesson \
  -H "Content-Type: application/json" \
  -H "x-user-id: user123" \
  -d '{"lessonId":"test","answers":[{"assessmentId":"quiz-1","answer":"White Rum"}]}'
```
