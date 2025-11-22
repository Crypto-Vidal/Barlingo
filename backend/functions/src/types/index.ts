export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  orgId?: string;
  role: 'student' | 'admin' | 'org_admin';
  createdAt: string;
  updatedAt: string;
  streak: {
    current: number;
    longest: number;
    lastActivityDate: string;
  };
  totalXP: number;
  level: number;
  settings: {
    notifications: boolean;
    soundEnabled: boolean;
    language: string;
  };
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  adminIds: string[];
  memberCount: number;
  assignedCourseIds: string[];
  createdAt: string;
  updatedAt: string;
  subscription: {
    plan: string;
    status: string;
    seats: number;
    expiresAt: string;
  };
  branding?: {
    logo: string;
    primaryColor: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  imageURL: string;
  moduleIds: string[];
  totalLessons: number;
  estimatedHours: number;
  xpReward: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
  prerequisiteCourseIds: string[];
  stats: {
    enrollments: number;
    completions: number;
    avgRating: number;
  };
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessonIds: string[];
  xpReward: number;
  locked: boolean;
  prerequisiteModuleId?: string;
}

export type QuestionType = 'multiple_choice' | 'image_match' | 'drag_drop' | 'fill_blank';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: number | number[] | string[];
  explanation?: string;
  xp: number;
  imageURL?: string;
  pairs?: Array<{ text: string; imageURL: string }>;
  items?: string[];
  correctOrder?: number[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  type: 'interactive' | 'video' | 'practice';
  order: number;
  xpReward: number;
  content: {
    intro: {
      text: string;
      imageURL?: string;
      audioURL?: string;
    };
    sections: Array<{
      type: 'text' | 'image' | 'video';
      content?: string;
      url?: string;
      caption?: string;
      duration?: number;
    }>;
  };
  quiz: {
    questions: Question[];
    passingScore: number;
    timeLimit: number;
  };
  estimatedMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  courseId: string;
  startedAt: string;
  lastActivityAt: string;
  status: 'in_progress' | 'completed' | 'paused';
  completedAt?: string;
  currentModuleId: string;
  currentLessonId: string;
  completedLessonIds: string[];
  completedModuleIds: string[];
  totalXPEarned: number;
  overallProgress: number;
  moduleProgress: Record<string, {
    status: string;
    completedLessons: number;
    totalLessons: number;
    xpEarned: number;
  }>;
  lessonAttempts: Record<string, {
    attempts: number;
    bestScore: number;
    completedAt: string;
    xpEarned: number;
  }>;
}

export interface LessonAttempt {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  moduleId: string;
  startedAt: string;
  completedAt?: string;
  timeSpent: number;
  answers: Array<{
    questionId: string;
    userAnswer: number | number[] | string[];
    correct: boolean;
    timeSpent: number;
    xpEarned: number;
  }>;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  passed: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  lessonsCompleted: number;
  streak: number;
}

export interface Leaderboard {
  id: string;
  type: 'global' | 'organization';
  period: 'daily' | 'weekly' | 'monthly' | 'all_time';
  startDate: string;
  endDate: string;
  entries: LeaderboardEntry[];
  updatedAt: string;
  orgId?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconURL: string;
  xpReward: number;
  type: 'milestone' | 'streak' | 'mastery' | 'special';
  criteria: Record<string, any>;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  progress: number;
  completed: boolean;
}
