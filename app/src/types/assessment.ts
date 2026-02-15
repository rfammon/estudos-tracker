import { BloomLevel } from './topic';

// Question Types
export type QuestionType = 'single-choice' | 'multiple-choice' | 'true-false' | 'essay';

// Assessment Types
export type AssessmentType = 'diagnostic' | 'formative' | 'summative';

// Difficulty Levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Question Interface
export interface Question {
    id: string;
    type: QuestionType;
    question: string;
    options?: string[]; // For single-choice, multiple-choice, true-false
    correctAnswer: string | string[]; // Single answer or array for multiple-choice
    explanation?: string;
    bloomLevel: BloomLevel;
    difficulty: Difficulty;
    points: number;
    imageUrl?: string;
    hint?: string;
}

// Assessment Interface
export interface Assessment {
    id: string;
    topicId: string;
    type: AssessmentType;
    title: string;
    description: string;
    questions: Question[];
    timeLimit?: number; // in minutes, optional
    passingScore: number; // percentage (0-100)
    maxAttempts: number; // 0 = unlimited
    shuffleQuestions: boolean;
    showCorrectAnswers: boolean; // Show correct answers after completion
    showExplanations: boolean; // Show explanations after answering
    createdAt: string;
    updatedAt: string;
}

// User's Answer for a Question
export interface QuestionAnswer {
    questionId: string;
    answer: string | string[]; // Single answer or array for multiple-choice
    isCorrect?: boolean;
    timeSpent?: number; // seconds
}

// Assessment Result Interface
export interface AssessmentResult {
    id: string;
    assessmentId: string;
    topicId: string;
    score: number; // percentage (0-100)
    correctAnswers: number;
    totalQuestions: number;
    totalPoints: number;
    earnedPoints: number;
    timeSpent: number; // in seconds
    completedAt: string;
    answers: Record<string, QuestionAnswer>;
    passed: boolean;
    attemptNumber: number;
}

// Assessment Attempt (in-progress)
export interface AssessmentAttempt {
    id: string;
    assessmentId: string;
    topicId: string;
    startedAt: string;
    currentQuestionIndex: number;
    answers: Record<string, QuestionAnswer>;
    timeRemaining?: number; // seconds remaining if timed
}

// Assessment Statistics
export interface AssessmentStats {
    assessmentId: string;
    totalAttempts: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    passRate: number; // percentage
    averageTimeSpent: number; // seconds
    questionStats: Record<string, QuestionStats>;
}

// Question Statistics
export interface QuestionStats {
    questionId: string;
    correctCount: number;
    incorrectCount: number;
    averageTimeSpent: number;
    mostCommonWrongAnswer?: string;
}

// Assessment Progress for a Topic
export interface TopicAssessmentProgress {
    topicId: string;
    diagnosticCompleted: boolean;
    diagnosticScore?: number;
    formativeCompleted: number; // count of completed formative assessments
    formativeAverageScore?: number;
    summativeCompleted: boolean;
    summativeScore?: number;
    totalQuizzesTaken: number;
    totalXpEarned: number;
    lastAssessmentAt?: string;
}

// Quiz Streak
export interface QuizStreak {
    currentStreak: number;
    longestStreak: number;
    lastQuizDate: string;
    quizzesThisWeek: number;
}

// Assessment Form Data (for creating/editing)
export interface AssessmentFormData {
    topicId: string;
    type: AssessmentType;
    title: string;
    description: string;
    questions: Omit<Question, 'id'>[];
    timeLimit?: number;
    passingScore: number;
    maxAttempts: number;
    shuffleQuestions: boolean;
    showCorrectAnswers: boolean;
    showExplanations: boolean;
}

// Labels and Constants
export const ASSESSMENT_TYPE_LABELS: Record<AssessmentType, string> = {
    diagnostic: 'Diagnóstica',
    formative: 'Formativa',
    summative: 'Somativa',
};

export const ASSESSMENT_TYPE_DESCRIPTIONS: Record<AssessmentType, string> = {
    diagnostic: 'Avaliação inicial para identificar conhecimento prévio',
    formative: 'Quiz para verificar o aprendizado durante o estudo',
    summative: 'Avaliação final do módulo ou capítulo',
};

export const ASSESSMENT_TYPE_COLORS: Record<AssessmentType, { bg: string; text: string; border: string }> = {
    diagnostic: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    formative: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    summative: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
    'single-choice': 'Escolha Única',
    'multiple-choice': 'Múltipla Escolha',
    'true-false': 'Verdadeiro/Falso',
    'essay': 'Dissertativa',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
};

export const DIFFICULTY_COLORS: Record<Difficulty, { bg: string; text: string; border: string }> = {
    easy: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
    hard: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
};

// XP Values for Assessments
export const ASSESSMENT_XP: Record<AssessmentType, number> = {
    diagnostic: 50,
    formative: 30,
    summative: 100,
};

// Bonus XP for high scores
export const HIGH_SCORE_BONUS = {
    threshold: 90, // percentage
    bonus: 50, // extra XP
};

// Perfect score bonus
export const PERFECT_SCORE_BONUS = 100;

// XP per difficulty
export const DIFFICULTY_XP_MULTIPLIER: Record<Difficulty, number> = {
    easy: 1,
    medium: 1.5,
    hard: 2,
};

// Default assessment settings
export const DEFAULT_ASSESSMENT_SETTINGS = {
    passingScore: 70,
    maxAttempts: 3,
    shuffleQuestions: true,
    showCorrectAnswers: true,
    showExplanations: true,
};
