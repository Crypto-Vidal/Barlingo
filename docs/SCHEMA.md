# Firestore Schema

## Collections

### users
```json
{
  "id": "user123",
  "email": "bartender@example.com",
  "displayName": "John Mixologist",
  "photoURL": "https://...",
  "orgId": "org456",
  "role": "student",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z",
  "streak": {
    "current": 7,
    "longest": 15,
    "lastActivityDate": "2025-01-22"
  },
  "totalXP": 1250,
  "level": 5,
  "settings": {
    "notifications": true,
    "soundEnabled": true,
    "language": "en"
  }
}
```

### organizations
```json
{
  "id": "org456",
  "name": "Speakeasy Bar Group",
  "type": "bar_chain",
  "adminIds": ["user123"],
  "memberCount": 45,
  "assignedCourseIds": ["course789"],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z",
  "subscription": {
    "plan": "premium",
    "status": "active",
    "seats": 50,
    "expiresAt": "2026-01-01T00:00:00Z"
  },
  "branding": {
    "logo": "https://...",
    "primaryColor": "#FF6B35"
  }
}
```

### courses
```json
{
  "id": "course789",
  "title": "Classic Cocktails Mastery",
  "description": "Master 50 essential classic cocktails",
  "category": "cocktails",
  "level": "beginner",
  "imageURL": "https://...",
  "moduleIds": ["mod001", "mod002"],
  "totalLessons": 25,
  "estimatedHours": 12,
  "xpReward": 500,
  "tags": ["classics", "spirits", "techniques"],
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-10T00:00:00Z",
  "published": true,
  "prerequisiteCourseIds": [],
  "stats": {
    "enrollments": 1250,
    "completions": 840,
    "avgRating": 4.8
  }
}
```

### modules
```json
{
  "id": "mod001",
  "courseId": "course789",
  "title": "Introduction to Spirits",
  "description": "Learn the base spirits",
  "order": 1,
  "lessonIds": ["lesson001", "lesson002", "lesson003"],
  "xpReward": 100,
  "locked": false,
  "prerequisiteModuleId": null
}
```

### lessons
```json
{
  "id": "lesson001",
  "moduleId": "mod001",
  "courseId": "course789",
  "title": "Understanding Gin",
  "type": "interactive",
  "order": 1,
  "xpReward": 25,
  "content": {
    "intro": {
      "text": "Gin is a spirit flavored with juniper berries...",
      "imageURL": "https://...",
      "audioURL": "https://..."
    },
    "sections": [
      {
        "type": "text",
        "content": "History of gin..."
      },
      {
        "type": "image",
        "url": "https://...",
        "caption": "Types of gin"
      },
      {
        "type": "video",
        "url": "https://...",
        "duration": 180
      }
    ]
  },
  "quiz": {
    "questions": [
      {
        "id": "q1",
        "type": "multiple_choice",
        "question": "What is the primary botanical in gin?",
        "options": [
          "Juniper berries",
          "Coriander",
          "Angelica root",
          "Citrus peel"
        ],
        "correctAnswer": 0,
        "explanation": "Juniper berries are the defining botanical in gin.",
        "xp": 5
      },
      {
        "id": "q2",
        "type": "image_match",
        "question": "Match the gin type to its image",
        "pairs": [
          {
            "text": "London Dry",
            "imageURL": "https://..."
          },
          {
            "text": "Old Tom",
            "imageURL": "https://..."
          }
        ],
        "xp": 10
      },
      {
        "id": "q3",
        "type": "drag_drop",
        "question": "Order the steps in making a Gin & Tonic",
        "items": [
          "Fill glass with ice",
          "Pour 2oz gin",
          "Top with tonic",
          "Garnish with lime"
        ],
        "correctOrder": [0, 1, 2, 3],
        "xp": 10
      }
    ],
    "passingScore": 80,
    "timeLimit": 300
  },
  "estimatedMinutes": 10,
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-01-10T00:00:00Z"
}
```

### progress
```json
{
  "id": "prog_user123_course789",
  "userId": "user123",
  "courseId": "course789",
  "startedAt": "2025-01-15T10:00:00Z",
  "lastActivityAt": "2025-01-22T14:30:00Z",
  "status": "in_progress",
  "completedAt": null,
  "currentModuleId": "mod001",
  "currentLessonId": "lesson003",
  "completedLessonIds": ["lesson001", "lesson002"],
  "completedModuleIds": [],
  "totalXPEarned": 75,
  "overallProgress": 0.24,
  "moduleProgress": {
    "mod001": {
      "status": "in_progress",
      "completedLessons": 2,
      "totalLessons": 5,
      "xpEarned": 75
    }
  },
  "lessonAttempts": {
    "lesson001": {
      "attempts": 1,
      "bestScore": 95,
      "completedAt": "2025-01-15T11:00:00Z",
      "xpEarned": 25
    },
    "lesson002": {
      "attempts": 2,
      "bestScore": 85,
      "completedAt": "2025-01-16T10:00:00Z",
      "xpEarned": 25
    }
  }
}
```

### lessonAttempts
```json
{
  "id": "attempt_abc123",
  "userId": "user123",
  "lessonId": "lesson001",
  "courseId": "course789",
  "moduleId": "mod001",
  "startedAt": "2025-01-15T10:30:00Z",
  "completedAt": "2025-01-15T10:45:00Z",
  "timeSpent": 900,
  "answers": [
    {
      "questionId": "q1",
      "userAnswer": 0,
      "correct": true,
      "timeSpent": 15,
      "xpEarned": 5
    },
    {
      "questionId": "q2",
      "userAnswer": [0, 1],
      "correct": true,
      "timeSpent": 45,
      "xpEarned": 10
    }
  ],
  "score": 95,
  "totalQuestions": 3,
  "correctAnswers": 3,
  "xpEarned": 25,
  "passed": true
}
```

### leaderboards
```json
{
  "id": "global_weekly_2025_w03",
  "type": "global",
  "period": "weekly",
  "startDate": "2025-01-13",
  "endDate": "2025-01-19",
  "entries": [
    {
      "rank": 1,
      "userId": "user123",
      "displayName": "John Mixologist",
      "photoURL": "https://...",
      "xp": 850,
      "lessonsCompleted": 15,
      "streak": 7
    },
    {
      "rank": 2,
      "userId": "user456",
      "displayName": "Jane Bartender",
      "photoURL": "https://...",
      "xp": 720,
      "lessonsCompleted": 12,
      "streak": 5
    }
  ],
  "updatedAt": "2025-01-19T23:59:59Z"
}
```

### orgLeaderboards
```json
{
  "id": "org456_monthly_2025_01",
  "orgId": "org456",
  "type": "organization",
  "period": "monthly",
  "startDate": "2025-01-01",
  "endDate": "2025-01-31",
  "entries": [
    {
      "rank": 1,
      "userId": "user123",
      "displayName": "John Mixologist",
      "photoURL": "https://...",
      "xp": 2850,
      "lessonsCompleted": 45,
      "coursesCompleted": 2
    }
  ],
  "updatedAt": "2025-01-22T00:00:00Z"
}
```

### achievements
```json
{
  "id": "ach_first_lesson",
  "title": "First Steps",
  "description": "Complete your first lesson",
  "iconURL": "https://...",
  "xpReward": 10,
  "type": "milestone",
  "criteria": {
    "lessonsCompleted": 1
  },
  "tier": "bronze"
}
```

### userAchievements
```json
{
  "id": "userachv_user123_ach_first_lesson",
  "userId": "user123",
  "achievementId": "ach_first_lesson",
  "unlockedAt": "2025-01-15T11:00:00Z",
  "progress": 1,
  "completed": true
}
```
