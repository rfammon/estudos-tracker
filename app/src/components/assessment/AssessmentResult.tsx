import React, { useMemo } from 'react';
import { AssessmentResult as AssessmentResultType, Assessment, ASSESSMENT_XP, HIGH_SCORE_BONUS, PERFECT_SCORE_BONUS } from '@/types/assessment';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAssessmentStore } from '@/store/use-assessment-store';

interface AssessmentResultProps {
    result: AssessmentResultType;
    assessment: Assessment;
    onRetry?: () => void;
    onViewAnswers?: () => void;
    onClose?: () => void;
}

export const AssessmentResultComponent: React.FC<AssessmentResultProps> = ({
    result,
    assessment,
    onRetry,
    onViewAnswers,
    onClose,
}) => {
    const { canAttempt, calculateResultXP, getBestResult } = useAssessmentStore();

    const xpEarned = calculateResultXP(assessment.id, result);
    const isHighScore = result.score >= HIGH_SCORE_BONUS.threshold;
    const isPerfectScore = result.score === 100;
    const canRetry = canAttempt(assessment.id);
    const bestResult = getBestResult(assessment.id);
    const isNewBest = bestResult?.id === result.id;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getScoreMessage = (): string => {
        if (isPerfectScore) return 'Pontuação Perfeita! 🎉';
        if (isHighScore) return 'Excelente Trabalho! 🌟';
        if (result.passed) return 'Parabéns! Você Passou! ✅';
        return 'Continue Tentando! 💪';
    };

    const getScoreColor = (): string => {
        if (isPerfectScore) return 'text-yellow-400';
        if (isHighScore) return 'text-green-400';
        if (result.passed) return 'text-blue-400';
        return 'text-red-400';
    };

    const questionBreakdown = useMemo(() => {
        return assessment.questions.map((question) => {
            const answer = result.answers[question.id];
            return {
                question,
                answer,
                isCorrect: answer?.isCorrect ?? false,
            };
        });
    }, [assessment.questions, result.answers]);

    const correctByDifficulty = useMemo(() => {
        const stats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
        questionBreakdown.forEach(({ question, isCorrect }) => {
            stats[question.difficulty].total++;
            if (isCorrect) stats[question.difficulty].correct++;
        });
        return stats;
    }, [questionBreakdown]);

    return (
        <div className="space-y-6">
            {/* Header with Score */}
            <Card className={cn(
                'overflow-hidden',
                result.passed ? 'border-green-500/30' : 'border-red-500/30'
            )}>
                <div className={cn(
                    'h-2',
                    result.passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-orange-500'
                )} />
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        {isPerfectScore ? (
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center animate-pulse">
                                    <span className="text-4xl">🏆</span>
                                </div>
                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                                    PERFEITO!
                                </div>
                            </div>
                        ) : isHighScore ? (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                                <span className="text-4xl">🌟</span>
                            </div>
                        ) : result.passed ? (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center">
                                <span className="text-4xl">✅</span>
                            </div>
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-red-400 to-orange-500 flex items-center justify-center">
                                <span className="text-4xl">💪</span>
                            </div>
                        )}
                    </div>
                    <CardTitle className={cn('text-2xl', getScoreColor())}>
                        {getScoreMessage()}
                    </CardTitle>
                    {isNewBest && (
                        <Badge className="mt-2 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                            🏅 Novo Recorde Pessoal!
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Score Circle */}
                    <div className="flex justify-center">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-gray-800"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={440}
                                    strokeDashoffset={440 - (440 * result.score) / 100}
                                    className={cn(
                                        'transition-all duration-1000',
                                        result.passed ? 'text-green-500' : 'text-red-500'
                                    )}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={cn('text-4xl font-bold', getScoreColor())}>
                                    {result.score}%
                                </span>
                                <span className="text-sm text-gray-400">de acerto</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                            <p className="text-2xl font-bold text-gray-100">
                                {result.correctAnswers}/{result.totalQuestions}
                            </p>
                            <p className="text-xs text-gray-400">Questões Corretas</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                            <p className="text-2xl font-bold text-gray-100">
                                {result.earnedPoints}/{result.totalPoints}
                            </p>
                            <p className="text-xs text-gray-400">Pontos</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                            <p className="text-2xl font-bold text-gray-100">
                                {formatTime(result.timeSpent)}
                            </p>
                            <p className="text-xs text-gray-400">Tempo</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-center">
                            <p className="text-2xl font-bold text-yellow-400">
                                +{xpEarned}
                            </p>
                            <p className="text-xs text-yellow-400/80">XP Ganho</p>
                        </div>
                    </div>

                    {/* XP Breakdown */}
                    {(isHighScore || isPerfectScore) && (
                        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                            <h4 className="font-medium text-yellow-400 mb-2">Bônus de XP</h4>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between text-gray-300">
                                    <span>Base ({assessment.type})</span>
                                    <span>+{ASSESSMENT_XP[assessment.type]} XP</span>
                                </div>
                                {isHighScore && !isPerfectScore && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Bônus Alta Pontuação ({HIGH_SCORE_BONUS.threshold}%+)</span>
                                        <span>+{HIGH_SCORE_BONUS.bonus} XP</span>
                                    </div>
                                )}
                                {isPerfectScore && (
                                    <>
                                        <div className="flex justify-between text-green-400">
                                            <span>Bônus Alta Pontuação</span>
                                            <span>+{HIGH_SCORE_BONUS.bonus} XP</span>
                                        </div>
                                        <div className="flex justify-between text-yellow-400">
                                            <span>Bônus Pontuação Perfeita</span>
                                            <span>+{PERFECT_SCORE_BONUS} XP</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Difficulty Breakdown */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-300">Desempenho por Dificuldade</h4>
                        <div className="space-y-2">
                            {['easy', 'medium', 'hard'].map((diff) => {
                                const stats = correctByDifficulty[diff as keyof typeof correctByDifficulty];
                                const percentage = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
                                const labels = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };
                                const colors = { easy: 'green', medium: 'yellow', hard: 'red' };

                                return (
                                    <div key={diff} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">{labels[diff as keyof typeof labels]}</span>
                                            <span className="text-gray-300">
                                                {stats.correct}/{stats.total} ({Math.round(percentage)}%)
                                            </span>
                                        </div>
                                        <Progress
                                            value={percentage}
                                            className={cn('h-2', `bg-${colors[diff as keyof typeof colors]}-900/30`)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Question Overview */}
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-300">Visão Geral das Questões</h4>
                        <div className="flex flex-wrap gap-2">
                            {questionBreakdown.map(({ question, isCorrect }, index) => (
                                <div
                                    key={question.id}
                                    className={cn(
                                        'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium',
                                        isCorrect
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    )}
                                    title={`Questão ${index + 1}: ${isCorrect ? 'Correta' : 'Incorreta'}`}
                                >
                                    {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        {onViewAnswers && (
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={onViewAnswers}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Ver Respostas
                            </Button>
                        )}
                        {canRetry && onRetry && (
                            <Button
                                className="flex-1"
                                onClick={onRetry}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Tentar Novamente
                            </Button>
                        )}
                        {onClose && (
                            <Button
                                variant="ghost"
                                className="flex-1"
                                onClick={onClose}
                            >
                                Fechar
                            </Button>
                        )}
                    </div>

                    {/* Recommendations */}
                    {!result.passed && (
                        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <h4 className="font-medium text-blue-400 mb-2">💡 Recomendações</h4>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li>• Revise o conteúdo do tópico antes de tentar novamente</li>
                                <li>• Foque nas questões que você errou</li>
                                <li>• Consulte materiais de apoio disponíveis</li>
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AssessmentResultComponent;
