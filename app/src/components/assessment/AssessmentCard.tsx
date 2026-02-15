import React from 'react';
import { Assessment, ASSESSMENT_TYPE_LABELS, ASSESSMENT_TYPE_COLORS } from '@/types/assessment';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/store/use-assessment-store';

interface AssessmentCardProps {
    assessment: Assessment;
    onStart: (assessmentId: string) => void;
    onViewResults: (assessmentId: string) => void;
    compact?: boolean;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
    assessment,
    onStart,
    onViewResults,
    compact = false,
}) => {
    const { getBestResult, getAttemptCount, canAttempt } = useAssessmentStore();
    const bestResult = getBestResult(assessment.id);
    const attemptCount = getAttemptCount(assessment.id);
    const canTakeAttempt = canAttempt(assessment.id);

    const typeColor = ASSESSMENT_TYPE_COLORS[assessment.type];
    const typeLabel = ASSESSMENT_TYPE_LABELS[assessment.type];

    const formatTime = (minutes: number): string => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    };

    if (compact) {
        return (
            <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn('p-2 rounded-lg', typeColor.bg, typeColor.border, 'border')}>
                                {assessment.type === 'diagnostic' && (
                                    <svg className={cn('w-5 h-5', typeColor.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                )}
                                {assessment.type === 'formative' && (
                                    <svg className={cn('w-5 h-5', typeColor.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {assessment.type === 'summative' && (
                                    <svg className={cn('w-5 h-5', typeColor.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-100">{assessment.title}</h4>
                                <p className="text-sm text-gray-400">
                                    {assessment.questions.length} questões
                                    {assessment.timeLimit && ` • ${formatTime(assessment.timeLimit)}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {bestResult && (
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        bestResult.passed ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'
                                    )}
                                >
                                    {bestResult.score}%
                                </Badge>
                            )}
                            <Button
                                size="sm"
                                onClick={() => canTakeAttempt ? onStart(assessment.id) : onViewResults(assessment.id)}
                                disabled={!canTakeAttempt && !bestResult}
                            >
                                {canTakeAttempt ? 'Iniciar' : 'Ver Resultados'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-200">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className={cn(typeColor.bg, typeColor.text, typeColor.border)}>
                                {typeLabel}
                            </Badge>
                            {bestResult && (
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        bestResult.passed
                                            ? 'border-green-500/50 text-green-400'
                                            : 'border-red-500/50 text-red-400'
                                    )}
                                >
                                    {bestResult.passed ? 'Aprovado' : 'Reprovado'} • {bestResult.score}%
                                </Badge>
                            )}
                        </div>
                        <CardTitle className="text-xl text-gray-100">
                            {assessment.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                            {assessment.description}
                        </CardDescription>
                    </div>
                    <div className={cn('p-3 rounded-xl', typeColor.bg, typeColor.border, 'border')}>
                        {assessment.type === 'diagnostic' && (
                            <svg className={cn('w-8 h-8', typeColor.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        )}
                        {assessment.type === 'formative' && (
                            <svg className={cn('w-8 h-8', typeColor.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {assessment.type === 'summative' && (
                            <svg className={cn('w-8 h-8', typeColor.text)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Questões</p>
                        <p className="text-lg font-semibold text-gray-100">{assessment.questions.length}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Tempo</p>
                        <p className="text-lg font-semibold text-gray-100">
                            {assessment.timeLimit ? formatTime(assessment.timeLimit) : 'Sem limite'}
                        </p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Nota Mínima</p>
                        <p className="text-lg font-semibold text-gray-100">{assessment.passingScore}%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Tentativas</p>
                        <p className="text-lg font-semibold text-gray-100">
                            {assessment.maxAttempts === 0 ? 'Ilimitadas' : `${attemptCount}/${assessment.maxAttempts}`}
                        </p>
                    </div>
                </div>

                {/* Best Result */}
                {bestResult && (
                    <div className={cn(
                        'p-4 rounded-lg border',
                        bestResult.passed
                            ? 'bg-green-500/10 border-green-500/20'
                            : 'bg-red-500/10 border-red-500/20'
                    )}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Melhor resultado</p>
                                <p className={cn(
                                    'text-2xl font-bold',
                                    bestResult.passed ? 'text-green-400' : 'text-red-400'
                                )}>
                                    {bestResult.score}%
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">
                                    {bestResult.correctAnswers}/{bestResult.totalQuestions} corretas
                                </p>
                                <p className="text-sm text-gray-400">
                                    Tentativa {bestResult.attemptNumber}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    {canTakeAttempt && (
                        <Button
                            className="flex-1"
                            onClick={() => onStart(assessment.id)}
                        >
                            {attemptCount > 0 ? 'Tentar Novamente' : 'Iniciar Avaliação'}
                        </Button>
                    )}
                    {bestResult && (
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => onViewResults(assessment.id)}
                        >
                            Ver Resultados
                        </Button>
                    )}
                </div>

                {/* Info */}
                {!canTakeAttempt && attemptCount >= (assessment.maxAttempts || 0) && assessment.maxAttempts > 0 && (
                    <p className="text-sm text-center text-yellow-400">
                        Você atingiu o limite de tentativas para esta avaliação.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};

export default AssessmentCard;
