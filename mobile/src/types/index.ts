export interface User {
  uid: string;
  email: string;
  displayName?: string;
  xp: number;
  level: number;
  streak: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'text' | 'video' | 'quiz' | 'roleplay';
  steps: LessonStep[];
  media_refs: string[];
  assessments: Assessment[];
  xp_value: number;
  pass_threshold: number;
  tags: string[];
}

export interface LessonStep {
  id: string;
  type: 'text' | 'video' | 'audio' | 'quiz';
  content: string;
  duration?: number;
}

export interface Assessment {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'matching';
  question: string;
  options?: string[];
  correct_answer: string | string[];
  points: number;
}

export interface Progress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastAttempt: Date;
  xpEarned: number;
}

export interface Order {
  id: string;
  items: string[];
  totalPrice: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SkillNode {
  id: string;
  title: string;
  description: string;
  lessons: string[];
  prerequisites: string[];
  unlocked: boolean;
  completed: boolean;
  xpRequired: number;
}
