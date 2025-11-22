# Project Structure

```
barlingo/
├── mobile/                         # React Native App
│   ├── src/
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── LoginScreen.tsx
│   │   │   │   └── SignupScreen.tsx
│   │   │   ├── home/
│   │   │   │   └── HomeScreen.tsx
│   │   │   ├── courses/
│   │   │   │   ├── CourseListScreen.tsx
│   │   │   │   └── CourseDetailScreen.tsx
│   │   │   ├── lessons/
│   │   │   │   ├── LessonScreen.tsx
│   │   │   │   └── QuizScreen.tsx
│   │   │   ├── progress/
│   │   │   │   └── ProgressScreen.tsx
│   │   │   └── leaderboard/
│   │   │       └── LeaderboardScreen.tsx
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Input.tsx
│   │   │   ├── lesson/
│   │   │   │   ├── MultipleChoice.tsx
│   │   │   │   ├── DragDrop.tsx
│   │   │   │   └── ImageMatch.tsx
│   │   │   └── progress/
│   │   │       ├── ProgressBar.tsx
│   │   │       └── StreakCounter.tsx
│   │   ├── navigation/
│   │   │   ├── AppNavigator.tsx
│   │   │   └── AuthNavigator.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── storage.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCourses.ts
│   │   │   └── useProgress.ts
│   │   └── assets/
│   │       ├── images/
│   │       └── fonts/
│   ├── App.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── web/                            # Next.js Web App
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── signup/
│   │   │   │       └── page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── courses/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [courseId]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── lessons/
│   │   │   │   │   └── [lessonId]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── progress/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── leaderboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── admin/
│   │   │   │       ├── page.tsx
│   │   │   │       └── courses/
│   │   │   │           └── assign/
│   │   │   │               └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── SignupForm.tsx
│   │   │   ├── courses/
│   │   │   │   ├── CourseCard.tsx
│   │   │   │   └── CourseList.tsx
│   │   │   ├── lessons/
│   │   │   │   ├── LessonPlayer.tsx
│   │   │   │   └── QuizComponent.tsx
│   │   │   ├── admin/
│   │   │   │   └── CourseAssignment.tsx
│   │   │   └── ui/
│   │   │       ├── Button.tsx
│   │   │       └── Card.tsx
│   │   ├── lib/
│   │   │   ├── firebase.ts
│   │   │   ├── api.ts
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useCourses.ts
│   │   │   └── useProgress.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── public/
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                        # Firebase Backend
│   ├── functions/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   ├── auth.ts
│   │   │   │   ├── courses.ts
│   │   │   │   ├── lessons.ts
│   │   │   │   ├── progress.ts
│   │   │   │   ├── admin.ts
│   │   │   │   └── webhooks.ts
│   │   │   ├── services/
│   │   │   │   ├── userService.ts
│   │   │   │   ├── courseService.ts
│   │   │   │   ├── lessonService.ts
│   │   │   │   ├── progressService.ts
│   │   │   │   └── leaderboardService.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── validators.ts
│   │   │   │   └── helpers.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── firestore/
│   │   ├── firestore.rules
│   │   └── firestore.indexes.json
│   └── firebase.json
│
└── docs/
    ├── SCHEMA.md
    └── API.md
```
