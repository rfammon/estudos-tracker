import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface QuizProgressProps {
    currentQuestion: number;
    totalQuestions: number;
    answeredCount: number;
    timeRemaining?: number;
    showTimer?: boolean;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
    currentQuestion,
    totalQuestions,
    answeredCount,
    timeRemaining,
    showTimer = false,
}) => {
    const progressPercentage = (answeredCount / totalQuestions) * 100;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimeColor = (): string => {
        if (!timeRemaining) return 'text-gray-400';
        if (timeRemaining <= 60) return 'text-red-400 animate-pulse';
        if (timeRemaining <= 180) return 'text-yellow-400';
        return 'text-green-400';
    };

    return (
        <div className="w-full space-y-3">
            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                        Progresso
                    </span>
                    <span className="text-gray-300 font-medium">
                        {answeredCount} de {totalQuestions} respondidas
                    </span>
                </div>
                <Progress
                    value={progressPercentage}
                    className="h-2 bg-gray-800"
                    aria-label={`Progresso: ${Math.round(progressPercentage)}%`}
                />
            </div>

            {/* Question Indicators */}
            <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Indicadores de questões"
            >
                {Array.from({ length: totalQuestions }, (_, index) => {
                    const questionNum = index + 1;
                    const isCurrent = questionNum === currentQuestion;
                    const isAnswered = questionNum <= answeredCount;

                    return (
                        <div
                            key={index}
                            role="status"
                            aria-label={`Questão ${questionNum}${isCurrent ? ' (atual)' : ''}${isAnswered ? ' (respondida)' : ''}`}
                            className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200',
                                isCurrent && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900',
                                isAnswered
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                            )}
                        >
                            {isAnswered ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                questionNum
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Timer */}
            {showTimer && timeRemaining !== undefined && (
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                    <svg
                        className={cn('w-5 h-5', getTimeColor())}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span
                        className={cn('text-2xl font-mono font-bold', getTimeColor())}
                        aria-live="polite"
                        aria-atomic="true"
                        role="timer"
                    >
                        {formatTime(timeRemaining)}
                    </span>
                    <span className="text-gray-400 text-sm">restantes</span>
                </div>
            )}
        </div>
    );
};

export default QuizProgress;
