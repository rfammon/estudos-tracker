import { create } from 'zustand';
import {
    StudySessionAnalytics,
    WeeklyReport,
    LearningMetrics,
    DailyStudyData,
    WeeklyXPData,
    TopicDistributionData,
    HourlyActivityData,
    GoalProgressData,
    StudyInsight,
    PlanCompletionPrediction,
    StudyPatternAnalysis,
    BloomLevelProgress,
    AnalyticsFilter,
    ExportData,
} from '@/types/analytics';
import { BloomLevel } from '@/types/topic';
import { useTopicStore } from './use-topic-store';
import { useSessionStore } from './use-session-store';
import { useGamificationStore } from './use-gamification-store';
import { usePlanStore } from './use-plan-store';
import { useAssessmentStore } from './use-assessment-store';

interface AnalyticsState {
    // Computed analytics data
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

    // Actions
    calculateAllAnalytics: (filter?: AnalyticsFilter) => void;
    getSessionAnalytics: (filter?: AnalyticsFilter) => StudySessionAnalytics[];
    getWeeklyReports: (weeks?: number) => WeeklyReport[];
    getLearningMetrics: () => LearningMetrics | null;
    getDailyStudyData: (days?: number) => DailyStudyData[];
    getWeeklyXPData: (weeks?: number) => WeeklyXPData[];
    getTopicDistribution: () => TopicDistributionData[];
    getHourlyActivity: () => HourlyActivityData[];
    getGoalProgress: () => GoalProgressData[];
    getInsights: () => StudyInsight[];
    getPredictions: () => PlanCompletionPrediction | null;
    getStudyPatterns: () => StudyPatternAnalysis | null;
    getBloomLevelProgress: () => BloomLevelProgress[];
    exportData: (format: 'json' | 'csv') => string | ExportData;
}

// Color palette for topics
const TOPIC_COLORS = [
    '#3B82F6', // blue
    '#22C55E', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
    '#6366F1', // indigo
    '#84CC16', // lime
];

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
    sessionAnalytics: [],
    weeklyReports: [],
    learningMetrics: null,
    dailyStudyData: [],
    weeklyXPData: [],
    topicDistribution: [],
    hourlyActivity: [],
    goalProgress: [],
    insights: [],
    predictions: null,
    studyPatterns: null,
    bloomLevelProgress: [],

    calculateAllAnalytics: (filter?: AnalyticsFilter) => {
        const sessionAnalytics = get().getSessionAnalytics(filter);
        const weeklyReports = get().getWeeklyReports();
        const learningMetrics = get().getLearningMetrics();
        const dailyStudyData = get().getDailyStudyData(filter?.period === 'month' ? 30 : filter?.period === 'year' ? 365 : 30);
        const weeklyXPData = get().getWeeklyXPData();
        const topicDistribution = get().getTopicDistribution();
        const hourlyActivity = get().getHourlyActivity();
        const goalProgress = get().getGoalProgress();
        const insights = get().getInsights();
        const predictions = get().getPredictions();
        const studyPatterns = get().getStudyPatterns();
        const bloomLevelProgress = get().getBloomLevelProgress();

        set({
            sessionAnalytics,
            weeklyReports,
            learningMetrics,
            dailyStudyData,
            weeklyXPData,
            topicDistribution,
            hourlyActivity,
            goalProgress,
            insights,
            predictions,
            studyPatterns,
            bloomLevelProgress,
        });
    },

    getSessionAnalytics: (filter?: AnalyticsFilter): StudySessionAnalytics[] => {
        const sessionStore = useSessionStore.getState();
        const topicStore = useTopicStore.getState();
        const assessmentStore = useAssessmentStore.getState();

        const sessions = sessionStore.sessions;
        const topics = topicStore.topics;

        // Group sessions by date
        const sessionByDate = new Map<string, StudySessionAnalytics>();

        sessions.forEach(session => {
            const date = new Date(session.startTime);
            const dateKey = date.toISOString().split('T')[0];

            // Apply filter
            if (filter?.startDate && date < filter.startDate) return;
            if (filter?.endDate && date > filter.endDate) return;
            if (filter?.topicIds && !filter.topicIds.includes(session.topicId)) return;

            const existing = sessionByDate.get(dateKey);
            const topic = topics.find(t => t.id === session.topicId);
            const topicName = topic?.name || 'Unknown';

            if (existing) {
                existing.duration += session.duration;
                existing.xpEarned += session.points;
                if (!existing.topics.includes(topicName)) {
                    existing.topics.push(topicName);
                }
            } else {
                sessionByDate.set(dateKey, {
                    date,
                    duration: session.duration,
                    topics: [topicName],
                    xpEarned: session.points,
                    objectivesCompleted: 0,
                    assessmentsTaken: 0,
                });
            }
        });

        // Add objectives and assessments data
        topics.forEach(topic => {
            topic.objectives?.forEach(obj => {
                if (obj.completedAt) {
                    const dateKey = obj.completedAt.split('T')[0];
                    const existing = sessionByDate.get(dateKey);
                    if (existing) {
                        existing.objectivesCompleted++;
                    }
                }
            });
        });

        // Add assessments data
        assessmentStore.results.forEach(result => {
            const dateKey = result.completedAt.split('T')[0];
            const existing = sessionByDate.get(dateKey);
            if (existing) {
                existing.assessmentsTaken++;
            }
        });

        return Array.from(sessionByDate.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
    },

    getWeeklyReports: (weeks: number = 4): WeeklyReport[] => {
        const sessionStore = useSessionStore.getState();
        const topicStore = useTopicStore.getState();
        const sessions = sessionStore.sessions;
        const topics = topicStore.topics;
        const reports: WeeklyReport[] = [];

        for (let i = 0; i < weeks; i++) {
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() - (i * 7));
            weekEnd.setHours(23, 59, 59, 999);

            const weekStart = new Date(weekEnd);
            weekStart.setDate(weekStart.getDate() - 6);
            weekStart.setHours(0, 0, 0, 0);

            const weekSessions = sessions.filter(s => {
                const sessionDate = new Date(s.startTime);
                return sessionDate >= weekStart && sessionDate <= weekEnd;
            });

            const totalStudyTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);
            const xpEarned = weekSessions.reduce((sum, s) => sum + s.points, 0);

            // Get top topics
            const topicTimeMap = new Map<string, number>();
            weekSessions.forEach(s => {
                const topic = topics.find(t => t.id === s.topicId);
                if (topic) {
                    topicTimeMap.set(topic.name, (topicTimeMap.get(topic.name) || 0) + s.duration);
                }
            });

            const topTopics = Array.from(topicTimeMap.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name]) => name);

            // Calculate streak days
            const daysWithStudy = new Set(
                weekSessions.map(s => new Date(s.startTime).toISOString().split('T')[0])
            ).size;

            // Calculate objectives completed
            let objectivesCompleted = 0;
            topics.forEach(topic => {
                topic.objectives?.forEach(obj => {
                    if (obj.completedAt) {
                        const completedDate = new Date(obj.completedAt);
                        if (completedDate >= weekStart && completedDate <= weekEnd) {
                            objectivesCompleted++;
                        }
                    }
                });
            });

            // Calculate improvement compared to previous week
            let improvement = 0;
            if (i < weeks - 1) {
                const prevWeekStart = new Date(weekStart);
                prevWeekStart.setDate(prevWeekStart.getDate() - 7);
                const prevWeekEnd = new Date(weekEnd);
                prevWeekEnd.setDate(prevWeekEnd.getDate() - 7);

                const prevWeekSessions = sessions.filter(s => {
                    const sessionDate = new Date(s.startTime);
                    return sessionDate >= prevWeekStart && sessionDate <= prevWeekEnd;
                });

                const prevTotalTime = prevWeekSessions.reduce((sum, s) => sum + s.duration, 0);
                if (prevTotalTime > 0) {
                    improvement = Math.round(((totalStudyTime - prevTotalTime) / prevTotalTime) * 100);
                }
            }

            reports.push({
                weekStart,
                weekEnd,
                totalStudyTime,
                sessionsCount: weekSessions.length,
                averageSessionDuration: weekSessions.length > 0 ? Math.round(totalStudyTime / weekSessions.length) : 0,
                xpEarned,
                objectivesCompleted,
                streakDays: daysWithStudy,
                topTopics,
                improvement,
            });
        }

        return reports;
    },

    getLearningMetrics: (): LearningMetrics | null => {
        const topicStore = useTopicStore.getState();
        const assessmentStore = useAssessmentStore.getState();
        const topics = topicStore.topics;

        if (topics.length === 0) return null;

        // Calculate retention rate (objectives still completed)
        let totalObjectives = 0;
        let completedObjectives = 0;
        const topicProgressMap = new Map<string, { completed: number; total: number }>();

        topics.forEach(topic => {
            const objCount = topic.objectives?.length || 0;
            const completed = topic.objectives?.filter(o => o.completed).length || 0;
            totalObjectives += objCount;
            completedObjectives += completed;
            topicProgressMap.set(topic.id, { completed, total: objCount });
        });

        const retentionRate = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;

        // Calculate average assessment score
        const results = assessmentStore.results;
        const averageAssessmentScore = results.length > 0
            ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
            : 0;

        // Find strongest and weakest topics
        const sortedTopics = Array.from(topicProgressMap.entries())
            .map(([id, { completed, total }]) => {
                const topic = topics.find(t => t.id === id);
                return {
                    id,
                    name: topic?.name || 'Unknown',
                    progress: total > 0 ? (completed / total) * 100 : 0,
                };
            })
            .sort((a, b) => b.progress - a.progress);

        const strongestTopics = sortedTopics.slice(0, 3).map(t => t.name);
        const weakestTopics = sortedTopics.slice(-3).reverse().filter(t => t.progress < 50).map(t => t.name);

        // Generate recommendations
        const recommendedFocus: string[] = [];
        if (weakestTopics.length > 0) {
            recommendedFocus.push(...weakestTopics.slice(0, 2));
        }
        if (averageAssessmentScore < 70) {
            recommendedFocus.push('Revisar conteúdos com baixo desempenho em avaliações');
        }

        return {
            retentionRate,
            averageAssessmentScore,
            strongestTopics,
            weakestTopics,
            recommendedFocus,
        };
    },

    getDailyStudyData: (days: number = 30): DailyStudyData[] => {
        const sessionStore = useSessionStore.getState();
        const sessions = sessionStore.sessions;
        const result: DailyStudyData[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const dateStr = date.toISOString();
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            const nextDateStr = nextDate.toISOString();

            const daySessions = sessions.filter(s => s.startTime >= dateStr && s.startTime < nextDateStr);
            const totalMinutes = Math.round(daySessions.reduce((sum, s) => sum + s.duration, 0) / 60);
            const xpEarned = daySessions.reduce((sum, s) => sum + s.points, 0);

            result.push({
                date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                totalMinutes,
                sessionsCount: daySessions.length,
                xpEarned,
            });
        }

        return result;
    },

    getWeeklyXPData: (weeks: number = 8): WeeklyXPData[] => {
        const sessionStore = useSessionStore.getState();
        const sessions = sessionStore.sessions;
        const result: WeeklyXPData[] = [];

        for (let i = weeks - 1; i >= 0; i--) {
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() - (i * 7));
            weekEnd.setHours(23, 59, 59, 999);

            const weekStart = new Date(weekEnd);
            weekStart.setDate(weekStart.getDate() - 6);
            weekStart.setHours(0, 0, 0, 0);

            const weekSessions = sessions.filter(s => {
                const sessionDate = new Date(s.startTime);
                return sessionDate >= weekStart && sessionDate <= weekEnd;
            });

            const xpEarned = weekSessions.reduce((sum, s) => sum + s.points, 0);

            result.push({
                weekLabel: `${weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${weekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`,
                xpEarned,
                sessionsCount: weekSessions.length,
            });
        }

        return result;
    },

    getTopicDistribution: (): TopicDistributionData[] => {
        const sessionStore = useSessionStore.getState();
        const topicStore = useTopicStore.getState();
        const sessions = sessionStore.sessions;
        const topics = topicStore.topics;

        const topicTimeMap = new Map<string, number>();

        sessions.forEach(s => {
            topicTimeMap.set(s.topicId, (topicTimeMap.get(s.topicId) || 0) + s.duration);
        });

        const totalTime = Array.from(topicTimeMap.values()).reduce((sum, t) => sum + t, 0);

        return Array.from(topicTimeMap.entries())
            .map(([topicId, duration], index) => {
                const topic = topics.find(t => t.id === topicId);
                return {
                    topicId,
                    topicName: topic?.name || 'Desconhecido',
                    totalMinutes: Math.round(duration / 60),
                    percentage: totalTime > 0 ? Math.round((duration / totalTime) * 100) : 0,
                    color: TOPIC_COLORS[index % TOPIC_COLORS.length],
                };
            })
            .sort((a, b) => b.totalMinutes - a.totalMinutes);
    },

    getHourlyActivity: (): HourlyActivityData[] => {
        const sessionStore = useSessionStore.getState();
        const sessions = sessionStore.sessions;

        // Create a map for all hour/day combinations
        const activityMap = new Map<string, { totalMinutes: number; sessionsCount: number }>();

        sessions.forEach(s => {
            const date = new Date(s.startTime);
            const hour = date.getHours();
            const dayOfWeek = date.getDay();
            const key = `${hour}-${dayOfWeek}`;

            const existing = activityMap.get(key) || { totalMinutes: 0, sessionsCount: 0 };
            existing.totalMinutes += s.duration / 60;
            existing.sessionsCount++;
            activityMap.set(key, existing);
        });

        // Find max for normalization
        const maxMinutes = Math.max(...Array.from(activityMap.values()).map(v => v.totalMinutes), 1);

        // Generate all combinations
        const result: HourlyActivityData[] = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                const key = `${hour}-${dayOfWeek}`;
                const data = activityMap.get(key) || { totalMinutes: 0, sessionsCount: 0 };
                result.push({
                    hour,
                    dayOfWeek,
                    totalMinutes: Math.round(data.totalMinutes),
                    sessionsCount: data.sessionsCount,
                    intensity: data.totalMinutes / maxMinutes,
                });
            }
        }

        return result;
    },

    getGoalProgress: (): GoalProgressData[] => {
        const sessionStore = useSessionStore.getState();
        const planStore = usePlanStore.getState();
        const sessions = sessionStore.sessions;
        const plan = planStore.plan;

        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);

        // Daily goal
        const todaySessions = sessions.filter(s => new Date(s.startTime) >= todayStart);
        const todayMinutes = Math.round(todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60);
        const dailyTarget = plan?.dailyGoal?.targetMinutes || 60;

        // Weekly goal
        const weekStart = new Date(todayStart);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekSessions = sessions.filter(s => new Date(s.startTime) >= weekStart);
        const weekMinutes = Math.round(weekSessions.reduce((sum, s) => sum + s.duration, 0) / 60);
        const weeklyTarget = dailyTarget * 7;

        // Monthly goal
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthSessions = sessions.filter(s => new Date(s.startTime) >= monthStart);
        const monthMinutes = Math.round(monthSessions.reduce((sum, s) => sum + s.duration, 0) / 60);
        const monthlyTarget = dailyTarget * 30;

        return [
            {
                type: 'daily',
                target: dailyTarget,
                current: todayMinutes,
                percentage: Math.min(100, Math.round((todayMinutes / dailyTarget) * 100)),
                isOnTrack: todayMinutes >= dailyTarget * 0.5,
                remainingMinutes: Math.max(0, dailyTarget - todayMinutes),
            },
            {
                type: 'weekly',
                target: weeklyTarget,
                current: weekMinutes,
                percentage: Math.min(100, Math.round((weekMinutes / weeklyTarget) * 100)),
                isOnTrack: weekMinutes >= weeklyTarget * 0.5,
                remainingMinutes: Math.max(0, weeklyTarget - weekMinutes),
            },
            {
                type: 'monthly',
                target: monthlyTarget,
                current: monthMinutes,
                percentage: Math.min(100, Math.round((monthMinutes / monthlyTarget) * 100)),
                isOnTrack: monthMinutes >= monthlyTarget * 0.5,
                remainingMinutes: Math.max(0, monthlyTarget - monthMinutes),
            },
        ];
    },

    getInsights: (): StudyInsight[] => {
        const insights: StudyInsight[] = [];
        const topicStore = useTopicStore.getState();
        const sessionStore = useSessionStore.getState();
        const gamificationStore = useGamificationStore.getState();
        const assessmentStore = useAssessmentStore.getState();
        const topics = topicStore.topics;
        const sessions = sessionStore.sessions;

        // Check for topics with low progress
        const lowProgressTopics = topics.filter(t => t.progress < 30 && t.status !== 'dominado');
        if (lowProgressTopics.length > 0) {
            insights.push({
                id: 'low-progress-topics',
                type: 'warning',
                title: 'Tópicos com Baixo Progresso',
                description: `Você tem ${lowProgressTopics.length} tópico(s) com menos de 30% de progresso. Considere dedicar mais tempo a eles.`,
                icon: '⚠️',
                priority: 'high',
                actionable: true,
                actionLabel: 'Ver tópicos',
                actionData: { topicIds: lowProgressTopics.map(t => t.id) },
            });
        }

        // Check for study streak
        const currentStreak = gamificationStore.currentStreak;
        if (currentStreak >= 7) {
            insights.push({
                id: 'streak-achievement',
                type: 'achievement',
                title: 'Sequência de Estudos!',
                description: `Parabéns! Você está em uma sequência de ${currentStreak} dias de estudo. Continue assim!`,
                icon: '🔥',
                priority: 'medium',
                actionable: false,
            });
        } else if (currentStreak === 0 && sessions.length > 0) {
            insights.push({
                id: 'no-streak',
                type: 'warning',
                title: 'Sequência Interrompida',
                description: 'Sua sequência de estudos foi interrompida. Comece uma nova sessão hoje!',
                icon: '💔',
                priority: 'high',
                actionable: true,
                actionLabel: 'Iniciar sessão',
            });
        }

        // Check for assessment performance
        const recentResults = assessmentStore.results.slice(-5);
        if (recentResults.length >= 3) {
            const avgScore = recentResults.reduce((sum, r) => sum + r.score, 0) / recentResults.length;
            if (avgScore < 70) {
                insights.push({
                    id: 'low-assessment-score',
                    type: 'recommendation',
                    title: 'Melhore suas Avaliações',
                    description: `Sua média nas últimas ${recentResults.length} avaliações é ${Math.round(avgScore)}%. Revise os conteúdos antes de novas tentativas.`,
                    icon: '📊',
                    priority: 'medium',
                    actionable: true,
                    actionLabel: 'Ver avaliações',
                });
            }
        }

        // Check for best study time
        const hourlyActivity = get().getHourlyActivity();
        const mostProductiveHour = hourlyActivity.reduce((max, curr) =>
            curr.totalMinutes > max.totalMinutes ? curr : max
            , { totalMinutes: 0, hour: 0 });

        if (mostProductiveHour.totalMinutes > 0) {
            insights.push({
                id: 'best-study-time',
                type: 'info',
                title: 'Melhor Horário para Estudar',
                description: `Você é mais produtivo às ${mostProductiveHour.hour}:00. Considere agendar sessões importantes nesse horário.`,
                icon: '⏰',
                priority: 'low',
                actionable: false,
            });
        }

        // Check for objectives completion
        const totalObjectives = topics.reduce((sum, t) => sum + (t.objectives?.length || 0), 0);
        const completedObjectives = topics.reduce((sum, t) => sum + (t.objectives?.filter(o => o.completed).length || 0), 0);

        if (totalObjectives > 0 && completedObjectives > 0) {
            const completionRate = Math.round((completedObjectives / totalObjectives) * 100);
            if (completionRate >= 80) {
                insights.push({
                    id: 'objectives-progress',
                    type: 'achievement',
                    title: 'Excelente Progresso!',
                    description: `Você completou ${completionRate}% dos seus objetivos de aprendizagem. Continue assim!`,
                    icon: '🎯',
                    priority: 'medium',
                    actionable: false,
                });
            }
        }

        return insights.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    },

    getPredictions: (): PlanCompletionPrediction | null => {
        const topicStore = useTopicStore.getState();
        const sessionStore = useSessionStore.getState();
        const topics = topicStore.topics;
        const sessions = sessionStore.sessions;

        if (topics.length === 0) return null;

        // Calculate average daily study time
        const last30Days = sessions.filter(s => {
            const sessionDate = new Date(s.startTime);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return sessionDate >= thirtyDaysAgo;
        });

        const totalMinutesLast30Days = last30Days.reduce((sum, s) => sum + s.duration, 0) / 60;
        const averageDailyMinutes = totalMinutesLast30Days / 30;

        // Calculate remaining progress
        const totalTargetHours = topics.reduce((sum, t) => sum + t.targetHours, 0);
        const totalCompletedHours = topics.reduce((sum, t) => sum + (t.progress / 100) * t.targetHours, 0);
        const remainingHours = totalTargetHours - totalCompletedHours;
        const currentProgress = totalTargetHours > 0 ? Math.round((totalCompletedHours / totalTargetHours) * 100) : 0;

        if (remainingHours <= 0 || averageDailyMinutes <= 0) {
            return {
                estimatedDate: new Date(),
                daysRemaining: 0,
                currentProgress: 100,
                requiredDailyMinutes: 0,
                isOnTrack: true,
                confidence: 1,
            };
        }

        const remainingMinutes = remainingHours * 60;
        const daysRemaining = Math.ceil(remainingMinutes / averageDailyMinutes);
        const estimatedDate = new Date();
        estimatedDate.setDate(estimatedDate.getDate() + daysRemaining);

        // Calculate required daily minutes to finish in 30 days
        const requiredDailyMinutes = Math.ceil(remainingMinutes / 30);
        const isOnTrack = averageDailyMinutes >= requiredDailyMinutes;

        // Confidence based on consistency
        const daysWithStudy = new Set(last30Days.map(s => new Date(s.startTime).toISOString().split('T')[0])).size;
        const confidence = daysWithStudy / 30;

        return {
            estimatedDate,
            daysRemaining,
            currentProgress,
            requiredDailyMinutes,
            isOnTrack,
            confidence,
        };
    },

    getStudyPatterns: (): StudyPatternAnalysis | null => {
        const sessionStore = useSessionStore.getState();
        const sessions = sessionStore.sessions;

        if (sessions.length < 5) return null;

        // Analyze hourly patterns
        const hourlyProductivity = new Map<number, number>();
        sessions.forEach(s => {
            const hour = new Date(s.startTime).getHours();
            hourlyProductivity.set(hour, (hourlyProductivity.get(hour) || 0) + s.duration);
        });

        const sortedHours = Array.from(hourlyProductivity.entries())
            .sort((a, b) => b[1] - a[1]);
        const bestStudyHours = sortedHours.slice(0, 3).map(([hour]) => hour);

        // Analyze daily patterns
        const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const dailyProductivity = new Map<number, number>();
        sessions.forEach(s => {
            const day = new Date(s.startTime).getDay();
            dailyProductivity.set(day, (dailyProductivity.get(day) || 0) + s.duration);
        });

        const sortedDays = Array.from(dailyProductivity.entries())
            .sort((a, b) => b[1] - a[1]);
        const mostProductiveDays = sortedDays.slice(0, 3).map(([day]) => dayNames[day]);

        // Calculate average session length
        const averageSessionLength = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;

        // Find preferred session length (mode)
        const sessionLengths = sessions.map(s => Math.round(s.duration / 300) * 5); // Round to 5 minutes
        const lengthCounts = new Map<number, number>();
        sessionLengths.forEach(len => lengthCounts.set(len, (lengthCounts.get(len) || 0) + 1));
        const preferredSessionLength = Array.from(lengthCounts.entries())
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 25;

        // Calculate consistency score
        const last30Days = new Set(
            sessions
                .filter(s => {
                    const sessionDate = new Date(s.startTime);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return sessionDate >= thirtyDaysAgo;
                })
                .map(s => new Date(s.startTime).toISOString().split('T')[0])
        ).size;
        const consistency = last30Days / 30;

        // Generate recommendations
        const recommendations: string[] = [];
        if (bestStudyHours.length > 0) {
            recommendations.push(`Estude às ${bestStudyHours[0]}:00 para melhor produtividade`);
        }
        if (consistency < 0.5) {
            recommendations.push('Tente estudar com mais frequência para melhor retenção');
        }
        if (averageSessionLength < 1500) { // Less than 25 minutes
            recommendations.push('Considere sessões mais longas para melhor foco');
        }

        return {
            bestStudyHours,
            mostProductiveDays,
            averageSessionLength,
            preferredSessionLength,
            consistency,
            recommendations,
        };
    },

    getBloomLevelProgress: (): BloomLevelProgress[] => {
        const topicStore = useTopicStore.getState();
        const topics = topicStore.topics;
        const bloomLevels: BloomLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

        return bloomLevels.map(level => {
            let totalObjectives = 0;
            let completedObjectives = 0;

            topics.forEach(topic => {
                const levelObjectives = topic.objectives?.filter(o => o.bloomLevel === level) || [];
                totalObjectives += levelObjectives.length;
                completedObjectives += levelObjectives.filter(o => o.completed).length;
            });

            return {
                level,
                totalObjectives,
                completedObjectives,
                percentage: totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0,
            };
        });
    },

    exportData: (format: 'json' | 'csv'): string | ExportData => {
        const dailyStudyData = get().getDailyStudyData(30);
        const weeklyReports = get().getWeeklyReports(4);
        const topicDistribution = get().getTopicDistribution();
        const insights = get().getInsights();

        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const exportData: ExportData = {
            title: 'Relatório de Estudos - Estudos Tracker',
            generatedAt: now,
            period: {
                start: thirtyDaysAgo,
                end: now,
            },
            summary: {
                totalStudyTime: dailyStudyData.reduce((sum, d) => sum + d.totalMinutes, 0),
                totalSessions: dailyStudyData.reduce((sum, d) => sum + d.sessionsCount, 0),
                totalXP: dailyStudyData.reduce((sum, d) => sum + d.xpEarned, 0),
                objectivesCompleted: weeklyReports.reduce((sum, r) => sum + r.objectivesCompleted, 0),
                assessmentsTaken: 0, // Would need to get from assessment store
            },
            weeklyReports,
            topicProgress: topicDistribution,
            insights,
        };

        if (format === 'json') {
            return exportData;
        }

        // CSV format
        const headers = ['Data', 'Tempo (min)', 'Sessões', 'XP'];
        const rows = dailyStudyData.map(d => [d.date, d.totalMinutes, d.sessionsCount, d.xpEarned]);

        return [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');
    },
}));
