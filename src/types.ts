/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'hi';

export interface StudentProfile {
  name: string;
  grade: string; // "Class 1" to "Class 12"
  stateBoard: string; // e.g., "UP Board", "Bihar Board", "CBSE"
  interests: string[];
  streak: number;
  coins: number;
  badges: Badge[];
  rankName: string;
  completedLessons: string[]; // Subject key or Lesson IDs
}

export interface Badge {
  id: string;
  titleEn: string;
  titleHi: string;
  icon: string; // lucide icon name
  unlockedAt?: string;
  descEn: string;
  descHi: string;
}

export interface Subject {
  id: string;
  nameEn: string;
  nameHi: string;
  color: string;
  icon: string;
  chaptersCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Chapter {
  id: string;
  subjectId: string;
  titleEn: string;
  titleHi: string;
  summaryEn: string;
  summaryHi: string;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: {
    id: string;
    titleEn: string;
    titleHi: string;
    contentEn: string;
    contentHi: string;
    diyActivityEn: string;
    diyActivityHi: string;
  }[];
}

export interface DoubtQuestion {
  id: string;
  question: string;
  answer?: string;
  timestamp: string;
  isAudio?: boolean;
}

export interface Announcement {
  id: string;
  titleEn: string;
  titleHi: string;
  category: 'scholarship' | 'scheme' | 'general';
  descEn: string;
  descHi: string;
  link?: string;
  eligibilityEn?: string;
  eligibilityHi?: string;
}

export interface CareerPath {
  id: string;
  titleEn: string;
  titleHi: string;
  classesFilter: string; // "10+", "12+", "all"
  descEn: string;
  descHi: string;
  salaryEn: string;
  salaryHi: string;
  stepsEn: string[];
  stepsHi: string[];
}

export interface VideoShort {
  id: string;
  titleEn: string;
  titleHi: string;
  author: string;
  subject: string;
  likes: number;
  comments: number;
  videoUrl: string; // high-quality mockup static layout
}

export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  answerIndex: number;
  explanationEn: string;
  explanationHi: string;
}

export interface Scholarship {
  id: string;
  titleEn: string;
  titleHi: string;
  provider: string;
  amountEn: string;
  amountHi: string;
  deadline: string;
  eligibilityEn: string;
  eligibilityHi: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  class_grade: string;
  thumbnail: string;
  status: string;
  created_at?: string;
}

export interface CurriculumChapter {
  id: string;
  class_grade: string;
  subject: string;
  chapter_number: number;
  chapter_name: string;
  videoUrl: string;
  notesPdfUrl: string;
  quiz_available: boolean;
  book_name?: string;
  animatedVideoUrl?: string;
  interactiveActivityUrl?: string;
}

export interface ChapterVideo {
  id: string;
  chapter_id: string;
  videoTitle: string;
  videoUrl: string;
  teacherName: string;
  language: string;
  duration: string;
  videoType: string;
}
