export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalPoints: number;
  questions: Question[];
  instructorId: string;
  createdAt: string;
  startTime?: string;
  endTime?: string;
  isActive: boolean;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, string>;
  submittedAt: string;
  score?: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  loading: boolean;
} 