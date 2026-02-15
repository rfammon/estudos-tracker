import React, { useMemo } from 'react';
import { Assessment, AssessmentResult, Question } from '@/types/assessment';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAssessmentStore } from '@/store/use-assessment-store';

interface AssessmentFeedbackProps {
    assessment: Assessment;
    result: AssessmentResult;
    onReviewTopic?: () => void;
    onRetryAssessment?: () => void;
}

export const AssessmentFeedback: React.FC<AssessmentFeedbackProps> = ({
    assessment,
    result,
    onReviewTopic,
    onRetryAssessment,
}) => {
    const { getWeakAreas } = useAssessmentStore();

    const weakAreas = useMemo(() => {
        return getWeakAreas(assessment.topicId);
    }, [assessment.topicId, getWeakAreas]);

    const questionFeedback = useMemo(() => {
        return assessment.questions.map((question) => {
            const answer = result.answers[question.id];
            const isCorrect = answer?.isCorrect ?? false;
            const userAnswer = answer?.answer;

            return {
                question,
                isCorrect,
                userAnswer,
                correctAnswer: question.correctAnswer,
            };
        });
    }, [assessment.questions, result.answers]);

    const correctCount = questionFeedback.filter((q) => q.isCorrect).length;
    const incorrectCount = questionFeedback.length - correctCount;

    const getPerformanceLevel = (): { level: string; color: string; message: string } => {
        if (result.score >= 90) {
            return {
                level: 'Excelente',
                color: 'text-green-400',
                message: 'Você demonstrou um excelente domínio do conteúdo!',
            };
        }
        if (result.score >= 70) {
            return {
                level: 'Bom',
                color: 'text-blue-400',
                message: 'Você está no caminho certo! Continue praticando.',
            };
        }
        if (result.score >= 50) {
            return {
                level: 'Regular',
                color: 'text-yellow-400',
                message: 'Você precisa revisar alguns conceitos.',
            };
        }
        return {
            level: 'Precisa Melhorar',
            color: 'text-red-400',
            message: 'Recomendamos revisar o conteúdo antes de tentar novamente.',
        };
    };

    const performance = getPerformanceLevel();

    const getAnswerDisplay = (question: Question, userAnswer: string | string[] | undefined): string => {
        if (!userAnswer) return 'Não respondida';
        if (question.type === 'true-false') {
            return userAnswer === 'Verdadeiro' ? 'Verdadeiro' : 'Falso';
        }
        if (Array.isArray(userAnswer)) {
            return userAnswer.join(', ');
        }
        return userAnswer.toString();
    };

    const getCorrectAnswerDisplay = (question: Question): string => {
        if (question.type === 'true-false') {
            return question.correctAnswer === 'Verdadeiro' ? 'Verdadeiro' : 'Falso';
        }
        if (Array.isArray(question.correctAnswer)) {
            return question.correctAnswer.join(', ');
        }
        return question.correctAnswer.toString();
    };

    return (
        <div className="space-y-6">
            {/* Performance Summary */}
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <span className={performance.color}>{performance.level}</span>
                        <span className="text-gray-400 text-sm font-normal">
                            - {performance.message}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-green-400 font-bold">{correctCount}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Corretas</p>
                        </div>
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="text-red-400 font-bold">{incorrectCount}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Incorretas</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Weak Areas */}
            {weakAreas.length > 0 && (
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Áreas para Revisão
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {weakAreas.slice(0, 5).map((area, index) => (
                            <div
                                key={area.questionId}
                                className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-300 line-clamp-2">
                                            {area.question}
                                        </p>
                                        <p className="text-xs text-yellow-400 mt-1">
                                            Taxa de acerto: {Math.round(area.correctRate)}%
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-yellow-400 border-yellow-500/30">
                                        #{index + 1}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                        {onReviewTopic && (
                            <Button
                                variant="outline"
                                className="w-full mt-4"
                                onClick={onReviewTopic}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Revisar Conteúdo
                            </Button>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Question-by-Question Feedback */}
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-lg">Detalhamento por Questão</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {questionFeedback.map((feedback, index) => (
                        <div
                            key={feedback.question.id}
                            className={cn(
                                'p-4 rounded-lg border',
                                feedback.isCorrect
                                    ? 'bg-green-500/5 border-green-500/20'
                                    : 'bg-red-500/5 border-red-500/20'
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={cn(
                                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                                        feedback.isCorrect
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-red-500/20 text-red-400'
                                    )}
                                >
                                    {index + 1}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="text-gray-200">{feedback.question.question}</p>

                                    <div className="grid gap-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">Sua resposta:</span>
                                            <span
                                                className={cn(
                                                    'font-medium',
                                                    feedback.isCorrect ? 'text-green-400' : 'text-red-400'
                                                )}
                                            >
                                                {getAnswerDisplay(feedback.question, feedback.userAnswer)}
                                            </span>
                                        </div>

                                        {!feedback.isCorrect && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-400">Resposta correta:</span>
                                                <span className="font-medium text-green-400">
                                                    {getCorrectAnswerDisplay(feedback.question)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {feedback.question.explanation && (
                                        <div className="mt-2 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                                            <p className="text-sm text-gray-300">
                                                <span className="font-medium text-gray-200">Explicação: </span>
                                                {feedback.question.explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Recomendações
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm text-gray-300">
                        {result.score < 70 && (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    Revise o material do tópico antes de tentar novamente
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-400">•</span>
                                    Foque nas questões que você errou
                                </li>
                            </>
                        )}
                        {result.score >= 70 && result.score < 90 && (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    Você está no caminho certo! Continue praticando
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    Tente melhorar sua pontuação na próxima tentativa
                                </li>
                            </>
                        )}
                        {result.score >= 90 && (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400">•</span>
                                    Excelente trabalho! Você dominou este conteúdo
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400">•</span>
                                    Prosiga para o próximo tópico ou avaliação
                                </li>
                            </>
                        )}
                        {assessment.type === 'formative' && (
                            <li className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                Quizzes formativos ajudam a fixar o conhecimento - pratique regularmente!
                            </li>
                        )}
                    </ul>

                    {onRetryAssessment && result.score < assessment.passingScore && (
                        <Button
                            className="w-full mt-4"
                            onClick={onRetryAssessment}
                        >
                            Tentar Novamente
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AssessmentFeedback;
