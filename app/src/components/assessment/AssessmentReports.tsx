import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/store/use-assessment-store';
import { useTopicStore } from '@/store';
import { CATEGORY_LABELS } from '@/types';
import { ASSESSMENT_TYPE_LABELS, ASSESSMENT_TYPE_COLORS } from '@/types/assessment';

interface AssessmentReportsProps {
    topicId?: string;
}

export const AssessmentReports: React.FC<AssessmentReportsProps> = ({ topicId }) => {
    const { getAssessmentsByTopic, getResultsByTopic, getTopicProgress, getAssessmentStats, streak } = useAssessmentStore();
    const { topics } = useTopicStore();

    const reportData = useMemo(() => {
        if (topicId) {
            const topic = topics.find((t) => t.id === topicId);
            const assessments = getAssessmentsByTopic(topicId);
            const progress = getTopicProgress(topicId);

            return {
                type: 'single' as const,
                topic,
                assessments,
                progress,
            };
        }

        // Aggregate data for all topics
        const allResults = topics.flatMap((t) => getResultsByTopic(t.id));
        const allProgress = topics.map((t) => ({
            topic: t,
            progress: getTopicProgress(t.id),
        }));

        return {
            type: 'all' as const,
            topics: allProgress,
            totalResults: allResults,
        };
    }, [topicId, topics, getAssessmentsByTopic, getResultsByTopic, getTopicProgress]);

    // Single Topic Report
    if (reportData.type === 'single' && reportData.topic) {
        const { topic, assessments, progress } = reportData;

        return (
            <div className="space-y-6">
                {/* Topic Header */}
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{topic.name}</CardTitle>
                            <Badge variant="outline" className="text-gray-400">
                                {CATEGORY_LABELS[topic.category]}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                                <p className="text-2xl font-bold text-gray-100">{progress.totalQuizzesTaken}</p>
                                <p className="text-xs text-gray-400">Avaliações</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                                <p className="text-2xl font-bold text-green-400">
                                    {progress.diagnosticScore !== undefined ? `${progress.diagnosticScore}%` : '-'}
                                </p>
                                <p className="text-xs text-gray-400">Diagnóstica</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                                <p className="text-2xl font-bold text-blue-400">
                                    {progress.formativeAverageScore !== undefined ? `${Math.round(progress.formativeAverageScore)}%` : '-'}
                                </p>
                                <p className="text-xs text-gray-400">Média Quizzes</p>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                                <p className="text-2xl font-bold text-purple-400">
                                    {progress.summativeScore !== undefined ? `${progress.summativeScore}%` : '-'}
                                </p>
                                <p className="text-xs text-gray-400">Final</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Assessment Breakdown */}
                {assessments.map((assessment) => {
                    const stats = getAssessmentStats(assessment.id);
                    const typeColor = ASSESSMENT_TYPE_COLORS[assessment.type];

                    return (
                        <Card key={assessment.id} className="bg-gray-900/50 border-gray-800">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Badge className={cn(typeColor.bg, typeColor.text, typeColor.border)}>
                                            {ASSESSMENT_TYPE_LABELS[assessment.type]}
                                        </Badge>
                                        <CardTitle className="text-lg">{assessment.title}</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {stats ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-gray-100">{stats.totalAttempts}</p>
                                                <p className="text-xs text-gray-400">Tentativas</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-green-400">{Math.round(stats.averageScore)}%</p>
                                                <p className="text-xs text-gray-400">Média</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-blue-400">{stats.highestScore}%</p>
                                                <p className="text-xs text-gray-400">Melhor</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-bold text-yellow-400">{Math.round(stats.passRate)}%</p>
                                                <p className="text-xs text-gray-400">Taxa Aprovação</p>
                                            </div>
                                        </div>

                                        {/* Question Performance */}
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-gray-300">Desempenho por Questão</p>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(stats.questionStats).map(([questionId, qStats], index) => {
                                                    const total = qStats.correctCount + qStats.incorrectCount;
                                                    const rate = total > 0 ? (qStats.correctCount / total) * 100 : 0;

                                                    return (
                                                        <div
                                                            key={questionId}
                                                            className={cn(
                                                                'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium',
                                                                rate >= 70
                                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                                    : rate >= 50
                                                                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                            )}
                                                            title={`Questão ${index + 1}: ${Math.round(rate)}% de acerto`}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center py-4">
                                        Nenhuma tentativa registrada
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}

                {assessments.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Nenhuma avaliação disponível para este tópico.</p>
                    </div>
                )}
            </div>
        );
    }

    // All Topics Report
    const totalResults = reportData.type === 'all' ? reportData.totalResults : [];
    const topicsData = reportData.type === 'all' ? reportData.topics : [];
    const totalAssessments = totalResults.length;
    const averageScore = totalAssessments > 0
        ? totalResults.reduce((sum, r) => sum + r.score, 0) / totalAssessments
        : 0;
    const passedCount = totalResults.filter((r) => r.passed).length;
    const passRate = totalAssessments > 0 ? (passedCount / totalAssessments) * 100 : 0;

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-xl">Visão Geral de Avaliações</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                            <p className="text-3xl font-bold text-gray-100">{totalAssessments}</p>
                            <p className="text-sm text-gray-400">Total de Avaliações</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                            <p className="text-3xl font-bold text-blue-400">{Math.round(averageScore)}%</p>
                            <p className="text-sm text-gray-400">Média Geral</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                            <p className="text-3xl font-bold text-green-400">{Math.round(passRate)}%</p>
                            <p className="text-sm text-gray-400">Taxa de Aprovação</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-center">
                            <p className="text-3xl font-bold text-yellow-400">{streak.currentStreak}</p>
                            <p className="text-sm text-yellow-400/80">Dias Seguidos</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Quiz Streak */}
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-2xl">🔥</span>
                        Sequência de Quizzes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Sequência Atual</p>
                            <p className="text-3xl font-bold text-orange-400">{streak.currentStreak} dias</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-400 text-sm">Melhor Sequência</p>
                            <p className="text-3xl font-bold text-yellow-400">{streak.longestStreak} dias</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Quizzes esta semana: {streak.quizzesThisWeek}</p>
                        <Progress value={Math.min(streak.quizzesThisWeek / 7 * 100, 100)} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Topics Progress */}
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-lg">Progresso por Tópico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {topicsData
                        .filter((t) => t.progress.totalQuizzesTaken > 0)
                        .map(({ topic, progress }) => (
                            <div
                                key={topic.id}
                                className="p-4 rounded-lg bg-gray-800/50 border border-gray-700"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-100">{topic.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {CATEGORY_LABELS[topic.category]}
                                        </Badge>
                                    </div>
                                    <span className="text-sm text-gray-400">
                                        {progress.totalQuizzesTaken} avaliações
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                    <div className={cn(
                                        'p-2 rounded',
                                        progress.diagnosticCompleted ? 'bg-green-500/10 text-green-400' : 'bg-gray-700/50 text-gray-500'
                                    )}>
                                        Diagnóstica
                                    </div>
                                    <div className={cn(
                                        'p-2 rounded',
                                        progress.formativeCompleted > 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-700/50 text-gray-500'
                                    )}>
                                        {progress.formativeCompleted} Quizzes
                                    </div>
                                    <div className={cn(
                                        'p-2 rounded',
                                        progress.summativeCompleted ? 'bg-purple-500/10 text-purple-400' : 'bg-gray-700/50 text-gray-500'
                                    )}>
                                        Final
                                    </div>
                                </div>
                                {progress.totalXpEarned > 0 && (
                                    <p className="text-xs text-yellow-400 mt-2">
                                        +{progress.totalXpEarned} XP ganho
                                    </p>
                                )}
                            </div>
                        ))}

                    {topicsData.filter((t) => t.progress.totalQuizzesTaken > 0).length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-400">Nenhuma avaliação completada ainda.</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Complete avaliações para ver seu progresso aqui.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AssessmentReports;
