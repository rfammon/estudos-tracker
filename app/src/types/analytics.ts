// Analytics Types for Estudos Tracker

import { BloomLevel } from './topic';

/**
 * Analytics data for a single study session
 */
export interface StudySessionAnalytics {
    date: Date;
    duration: number; // in seconds
    topics: string[];
    xpEarned: number;
    objectivesCompleted: number;
    assessmentsTaken: number;
}

/**
 * Weekly report data structure
 */
export interface WeeklyReport {
    weekStart: Date;
    weekEnd: Date;
    totalStudyTime: number; // in seconds
    sessionsCount: number;
    averageSessionDuration: number; // in seconds
    xpEarned: number;
    objectivesCompleted: number;
    streakDays: number;
    topTopics: string[];
    improvement: number; // % compared to previous week
}

/**
 * Learning metrics and insights
 */
export interface LearningMetrics {
    retentionRate: number; // % of objectives retained
    averageAssessmentScore: number;
    strongestTopics: string[];
    weakestTopics: string[];
    recommendedFocus: string[];
}

/**
 * Daily study data for charts
 */
export interface DailyStudyData {
    date: string;
    totalMinutes: number;
    sessionsCount: number;
    xpEarned: number;
}

/**
 * Weekly XP data for charts
 */
export interface WeeklyXPData {
    weekLabel: string;
    xpEarned: number;
    sessionsCount: number;
}

/**
 * Topic distribution data for pie charts
 */
export interface TopicDistributionData {
    topicId: string;
    topicName: string;
    totalMinutes: number;
    percentage: number;
    color: string;
}

/**
 * Hourly activity data for heatmap
 */
export interface HourlyActivityData {
    hour: number;
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    totalMinutes: number;
    sessionsCount: number;
    intensity: number; // 0-1 normalized intensity
}

/**
 * Goal progress data
 */
export interface GoalProgressData {
    type: 'daily' | 'weekly' | 'monthly';
    target: number; // target minutes
    current: number; // current minutes
    percentage: number;
    isOnTrack: boolean;
    remainingMinutes: number;
}

/**
 * Trend data point
 */
export interface TrendDataPoint {
    date: string;
    value: number;
    trend?: 'up' | 'down' | 'stable';
}

/**
 * Study insight
 */
export interface StudyInsight {
    id: string;
    type: 'recommendation' | 'achievement' | 'warning' | 'info';
    title: string;
    description: string;
    icon: string;
    priority: 'high' | 'medium' | 'low';
    actionable: boolean;
    actionLabel?: string;
    actionData?: Record<string, unknown>;
}

/**
 * Prediction data for plan completion
 */
export interface PlanCompletionPrediction {
    estimatedDate: Date;
    daysRemaining: number;
    currentProgress: number;
    requiredDailyMinutes: number;
    isOnTrack: boolean;
    confidence: number; // 0-1
}

/**
 * Study pattern analysis
 */
export interface StudyPatternAnalysis {
    bestStudyHours: number[]; // hours of day with most productivity
    mostProductiveDays: string[]; // days of week with most study
    averageSessionLength: number;
    preferredSessionLength: number;
    consistency: number; // 0-1 score
    recommendations: string[];
}

/**
 * Bloom's taxonomy progress
 */
export interface BloomLevelProgress {
    level: BloomLevel;
    totalObjectives: number;
    completedObjectives: number;
    percentage: number;
    averageScore?: number;
}

/**
 * Comprehensive analytics state
 */
export interface AnalyticsState {
    sessionAnalytics: StudySessionAnalytics[];
    weeklyReports: WeeklyReport[];
    learningMetrics: LearningMetrics | null;
    dailyStudyData: DailyStudyData[];
    weeklyXPData: WeeklyXPData[];
    topicDistribution: TopicDistributionData[];
    hourlyActivity: HourlyActivityData[];
    goalProgress: GoalProgressData[];
    insights: StudyInsight[];
    predictions: PlanCompletionPrediction | null;
    studyPatterns: StudyPatternAnalysis | null;
    bloomLevelProgress: BloomLevelProgress[];
}

/**
 * Analytics filter options
 */
export interface AnalyticsFilter {
    startDate?: Date;
    endDate?: Date;
    topicIds?: string[];
    categories?: string[];
    period?: 'day' | 'week' | 'month' | 'year' | 'all';
}

/**
 * Export format options
 */
export type ExportFormat = 'pdf' | 'csv' | 'json';

/**
 * Export data structure
 */
export interface ExportData {
    title: string;
    generatedAt: Date;
    period: {
        start: Date;
        end: Date;
    };
    summary: {
        totalStudyTime: number;
        totalSessions: number;
        totalXP: number;
        objectivesCompleted: number;
        assessmentsTaken: number;
    };
    weeklyReports: WeeklyReport[];
    topicProgress: TopicDistributionData[];
    insights: StudyInsight[];
}
