# Barlingo

Bartending training app with micro-lessons, skill trees, and AI roleplay.

## Structure

```
├── mobile/                     # React Native app
│   ├── src/
│   │   ├── screens/           # UI screens
│   │   │   ├── Onboard.tsx
│   │   │   ├── SkillTree.tsx
│   │   │   ├── LessonPlayer.tsx
│   │   │   ├── RushSimulator.tsx
│   │   │   └── Progress.tsx
│   │   └── types/
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── functions/                  # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts           # gradeLesson function
│   ├── package.json
│   └── tsconfig.json
│
├── data/
│   └── lesson-example.json    # Sample lesson structure
│
├── docs/
│   └── ai-roleplay-integration.md
│
└── firestore.rules            # Security rules
```

## Setup

### Mobile
```bash
cd mobile
npm install
npm start
```

### Cloud Functions
```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

### Firestore
```bash
firebase deploy --only firestore:rules
```

## Collections

- `users` - User profiles with XP/level
- `lessons` - Lesson content and assessments
- `skills` - Skill tree nodes
- `progress` - User lesson progress
- `achievements` - User achievements
- `rush_results` - Rush simulator scores

## Cloud Function

**gradeLesson** - Grades quiz answers, updates progress, awards XP

```typescript
{
  lessonId: string,
  answers: [{ assessmentId: string, answer: string }]
}
```

Returns: score, passed, xpEarned, results

## AI Roleplay

See `docs/ai-roleplay-integration.md` for Claude/OpenAI integration details.
