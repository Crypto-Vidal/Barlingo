# Barlingo

Bartending training web app with micro-lessons, skill trees, and AI roleplay.

## Structure

```
├── app/                        # Next.js app directory
│   ├── page.tsx               # Onboard screen
│   ├── skill-tree/page.tsx    # Skill tree
│   ├── lesson/[id]/page.tsx   # Lesson player
│   ├── rush/page.tsx          # Rush simulator
│   ├── progress/page.tsx      # Progress tracker
│   └── globals.css
│
├── api/                        # Vercel serverless functions
│   └── gradeLesson.js
│
├── lib/
│   ├── types.ts               # TypeScript types
│   └── firebase.ts            # Firebase config
│
├── functions/                  # Firebase Cloud Functions (alternative)
│   └── src/index.ts
│
├── data/
│   └── lesson-example.json
│
├── docs/
│   └── ai-roleplay-integration.md
│
└── firestore.rules
```

## Deploy to Vercel

```bash
vercel --prod
```

## Setup

```bash
npm install
cp .env.example .env
# Add Firebase credentials to .env
npm run dev
```

## Environment Variables

Add to Vercel dashboard or `.env.local`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Routes

- `/` - Onboard
- `/skill-tree` - Skills
- `/lesson/[id]` - Lessons
- `/rush` - Rush Hour
- `/progress` - Progress

## API

- `POST /api/gradeLesson` - Grade quiz answers
