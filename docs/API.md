# Cloud Functions API

## Authentication

### signup
**Endpoint:** `POST /api/auth/signup`

**Request:**
```json
{
  "email": "bartender@example.com",
  "password": "securePassword123",
  "displayName": "John Mixologist",
  "orgCode": "SPEAKEASY2025"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "bartender@example.com",
      "displayName": "John Mixologist",
      "orgId": "org456",
      "role": "student",
      "createdAt": "2025-01-15T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### login
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "bartender@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "email": "bartender@example.com",
      "displayName": "John Mixologist",
      "orgId": "org456",
      "role": "student",
      "totalXP": 1250,
      "level": 5
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### refreshToken
**Endpoint:** `POST /api/auth/refresh`

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Courses

### fetchCourses
**Endpoint:** `GET /api/courses`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Params:**
```
?category=cocktails&level=beginner&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "course789",
        "title": "Classic Cocktails Mastery",
        "description": "Master 50 essential classic cocktails",
        "category": "cocktails",
        "level": "beginner",
        "imageURL": "https://...",
        "totalLessons": 25,
        "estimatedHours": 12,
        "xpReward": 500,
        "stats": {
          "enrollments": 1250,
          "completions": 840,
          "avgRating": 4.8
        },
        "userProgress": {
          "enrolled": true,
          "progress": 0.24,
          "currentLessonId": "lesson003"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "hasMore": true
    }
  }
}
```

### fetchCourse
**Endpoint:** `GET /api/courses/:courseId`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {
      "id": "course789",
      "title": "Classic Cocktails Mastery",
      "description": "Master 50 essential classic cocktails",
      "category": "cocktails",
      "level": "beginner",
      "imageURL": "https://...",
      "totalLessons": 25,
      "estimatedHours": 12,
      "xpReward": 500,
      "tags": ["classics", "spirits", "techniques"],
      "prerequisiteCourseIds": []
    },
    "modules": [
      {
        "id": "mod001",
        "title": "Introduction to Spirits",
        "description": "Learn the base spirits",
        "order": 1,
        "lessonIds": ["lesson001", "lesson002", "lesson003"],
        "xpReward": 100,
        "locked": false,
        "userProgress": {
          "completed": false,
          "progress": 0.4,
          "completedLessons": 2
        }
      }
    ],
    "userProgress": {
      "enrolled": true,
      "status": "in_progress",
      "progress": 0.24,
      "currentModuleId": "mod001",
      "currentLessonId": "lesson003",
      "totalXPEarned": 75
    }
  }
}
```

### enrollCourse
**Endpoint:** `POST /api/courses/:courseId/enroll`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "progress": {
      "id": "prog_user123_course789",
      "userId": "user123",
      "courseId": "course789",
      "startedAt": "2025-01-15T10:00:00Z",
      "status": "in_progress",
      "currentModuleId": "mod001",
      "currentLessonId": "lesson001"
    }
  }
}
```

---

## Lessons

### fetchLesson
**Endpoint:** `GET /api/lessons/:lessonId`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lesson": {
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
            "xp": 5
          }
        ],
        "passingScore": 80,
        "timeLimit": 300
      },
      "estimatedMinutes": 10
    },
    "userAttempt": {
      "attempts": 1,
      "bestScore": 95,
      "completed": true,
      "xpEarned": 25
    }
  }
}
```

### startLesson
**Endpoint:** `POST /api/lessons/:lessonId/start`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attemptId": "attempt_abc123",
    "startedAt": "2025-01-15T10:30:00Z"
  }
}
```

### submitAttempt
**Endpoint:** `POST /api/lessons/:lessonId/submit`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:**
```json
{
  "attemptId": "attempt_abc123",
  "answers": [
    {
      "questionId": "q1",
      "answer": 0,
      "timeSpent": 15
    },
    {
      "questionId": "q2",
      "answer": [0, 1],
      "timeSpent": 45
    },
    {
      "questionId": "q3",
      "answer": [0, 1, 2, 3],
      "timeSpent": 30
    }
  ],
  "totalTimeSpent": 900
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "id": "attempt_abc123",
      "score": 95,
      "totalQuestions": 3,
      "correctAnswers": 3,
      "xpEarned": 25,
      "passed": true,
      "completedAt": "2025-01-15T10:45:00Z"
    },
    "results": [
      {
        "questionId": "q1",
        "correct": true,
        "correctAnswer": 0,
        "explanation": "Juniper berries are the defining botanical in gin.",
        "xpEarned": 5
      },
      {
        "questionId": "q2",
        "correct": true,
        "correctAnswer": [0, 1],
        "xpEarned": 10
      },
      {
        "questionId": "q3",
        "correct": true,
        "correctAnswer": [0, 1, 2, 3],
        "xpEarned": 10
      }
    ],
    "progress": {
      "courseProgress": 0.32,
      "moduleProgress": 0.6,
      "totalXP": 100,
      "newLevel": 5,
      "levelUp": false
    },
    "achievements": []
  }
}
```

---

## Progress

### fetchProgress
**Endpoint:** `GET /api/progress`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Params:**
```
?courseId=course789
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user123",
      "displayName": "John Mixologist",
      "totalXP": 1250,
      "level": 5,
      "streak": {
        "current": 7,
        "longest": 15,
        "lastActivityDate": "2025-01-22"
      }
    },
    "courses": [
      {
        "courseId": "course789",
        "courseTitle": "Classic Cocktails Mastery",
        "status": "in_progress",
        "progress": 0.24,
        "completedLessons": 6,
        "totalLessons": 25,
        "xpEarned": 75,
        "lastActivityAt": "2025-01-22T14:30:00Z",
        "currentLessonId": "lesson003"
      }
    ],
    "recentActivity": [
      {
        "type": "lesson_completed",
        "lessonId": "lesson002",
        "lessonTitle": "Understanding Vodka",
        "courseTitle": "Classic Cocktails Mastery",
        "xpEarned": 25,
        "timestamp": "2025-01-22T14:30:00Z"
      }
    ],
    "stats": {
      "totalCoursesEnrolled": 3,
      "coursesCompleted": 1,
      "totalLessonsCompleted": 32,
      "totalTimeSpent": 28800,
      "avgScore": 88
    }
  }
}
```

### fetchLeaderboard
**Endpoint:** `GET /api/leaderboard`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Params:**
```
?type=global&period=weekly&limit=50
```

**Response:**
```json
{
  "success": true,
  "data": {
    "leaderboard": {
      "type": "global",
      "period": "weekly",
      "startDate": "2025-01-13",
      "endDate": "2025-01-19"
    },
    "entries": [
      {
        "rank": 1,
        "userId": "user123",
        "displayName": "John Mixologist",
        "photoURL": "https://...",
        "xp": 850,
        "lessonsCompleted": 15,
        "streak": 7,
        "isCurrentUser": true
      },
      {
        "rank": 2,
        "userId": "user456",
        "displayName": "Jane Bartender",
        "photoURL": "https://...",
        "xp": 720,
        "lessonsCompleted": 12,
        "streak": 5,
        "isCurrentUser": false
      }
    ],
    "userRank": {
      "rank": 1,
      "xp": 850,
      "percentile": 98
    },
    "updatedAt": "2025-01-19T23:59:59Z"
  }
}
```

---

## Admin

### assignCourseToOrg
**Endpoint:** `POST /api/admin/organizations/:orgId/courses`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request:**
```json
{
  "courseIds": ["course789", "course456"],
  "autoEnroll": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": "org456",
      "name": "Speakeasy Bar Group",
      "assignedCourseIds": ["course789", "course456"]
    },
    "enrolledUsers": 45,
    "message": "Courses assigned and 45 users auto-enrolled"
  }
}
```

### fetchOrgProgress
**Endpoint:** `GET /api/admin/organizations/:orgId/progress`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "organization": {
      "id": "org456",
      "name": "Speakeasy Bar Group",
      "memberCount": 45
    },
    "overview": {
      "totalEnrollments": 135,
      "totalCompletions": 67,
      "avgProgress": 0.58,
      "totalXPEarned": 45600,
      "activeUsers": 38
    },
    "courseStats": [
      {
        "courseId": "course789",
        "courseTitle": "Classic Cocktails Mastery",
        "enrolled": 45,
        "completed": 28,
        "avgProgress": 0.72,
        "avgScore": 87
      }
    ],
    "topPerformers": [
      {
        "userId": "user123",
        "displayName": "John Mixologist",
        "totalXP": 2850,
        "coursesCompleted": 2,
        "rank": 1
      }
    ]
  }
}
```

---

## Webhooks

### paymentWebhook
**Endpoint:** `POST /api/webhooks/payment`

**Headers:**
```
Content-Type: application/json
Stripe-Signature: t=1234567890,v1=abc123...
```

**Request (Stripe):**
```json
{
  "id": "evt_1234567890",
  "type": "invoice.payment_succeeded",
  "data": {
    "object": {
      "id": "in_1234567890",
      "customer": "cus_1234567890",
      "subscription": "sub_1234567890",
      "amount_paid": 49900,
      "metadata": {
        "orgId": "org456"
      }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "processed": true,
    "organization": {
      "id": "org456",
      "subscription": {
        "status": "active",
        "expiresAt": "2026-01-22T00:00:00Z"
      }
    }
  }
}
```

**Request (Invoice Failed):**
```json
{
  "id": "evt_0987654321",
  "type": "invoice.payment_failed",
  "data": {
    "object": {
      "id": "in_0987654321",
      "customer": "cus_1234567890",
      "subscription": "sub_1234567890",
      "metadata": {
        "orgId": "org456"
      }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "processed": true,
    "organization": {
      "id": "org456",
      "subscription": {
        "status": "past_due"
      }
    },
    "notificationSent": true
  }
}
```
