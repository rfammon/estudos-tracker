import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Assessment } from '@/types/assessment';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { QuestionCard } from './QuestionCard';
import { QuizProgress } from './QuizProgress';
import { AssessmentResultComponent } from './AssessmentResult';
import { useAssessmentStore } from '@/store/use-assessment-store';
import { useAnnouncement } from '@/hooks/useAnnouncement';

interface AssessmentViewProps {
    assessment: Assessment;
    onComplete: (result: ReturnType<typeof useAssessmentStore.getState>['results'][0]) => void;
    onCancel: () => void;
}

type ViewState = 'intro' | 'quiz' | 'review' | 'result';

export const AssessmentView: React.FC<AssessmentViewProps> = ({
    assessment,
    onComplete,
    onCancel,
}) => {
    const {
        currentAttempt,
        startAttempt,
        saveAnswer,
        setCurrentQuestionIndex,
        decrementTimeRemaining,
        submitAttempt,
        cancelAttempt,
    } = useAssessmentStore();

    const [viewState, setViewState] = useState<ViewState>('intro');
    const [showConfirmExit, setShowConfirmExit] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    const [result, setResult] = useState<ReturnType<typeof useAssessmentStore.getState>['results'][0] | null>(null);
    const [reviewMode, setReviewMode] = useState(false);
    const { announcePolite } = useAnnouncement();

    // Timer effect
    useEffect(() => {
        if (viewState !== 'quiz' || !currentAttempt?.timeRemaining) return;

        const timer = setInterval(() => {
            decrementTimeRemaining();
        }, 1000);

        return () => clearInterval(timer);
    }, [viewState, currentAttempt?.timeRemaining, decrementTimeRemaining]);

    // Check for auto-submit when time runs out
    useEffect(() => {
        if (currentAttempt?.timeRemaining === 0) {
            handleSubmit(true);
        }
    }, [currentAttempt?.timeRemaining]);

    // Shuffle questions if needed
    const questions = useMemo(() => {
        if (assessment.shuffleQuestions) {
            return [...assessment.questions].sort(() => Math.random() - 0.5);
        }
        return assessment.questions;
    }, [assessment.questions, assessment.shuffleQuestions]);

    const handleStart = useCallback(() => {
        const attempt = startAttempt(assessment.id);
        if (attempt) {
            setViewState('quiz');
            announcePolite(`Iniciando ${assessment.title}. Questão 1 de ${questions.length}`);
        }
    }, [assessment.id, assessment.title, questions.length, startAttempt, announcePolite]);

    const handleAnswer = useCallback((questionId: string, answer: string | string[]) => {
        saveAnswer(questionId, answer);
    }, [saveAnswer]);

    const handleNext = useCallback(() => {
        if (!currentAttempt) return;
        const nextIndex = currentAttempt.currentQuestionIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestionIndex(nextIndex);
            announcePolite(`Questão ${nextIndex + 1} de ${questions.length}`);
        }
    }, [currentAttempt, questions.length, setCurrentQuestionIndex, announcePolite]);

    const handlePrevious = useCallback(() => {
        if (!currentAttempt) return;
        const prevIndex = currentAttempt.currentQuestionIndex - 1;
        if (prevIndex >= 0) {
            setCurrentQuestionIndex(prevIndex);
            announcePolite(`Questão ${prevIndex + 1} de ${questions.length}`);
        }
    }, [currentAttempt, questions.length, setCurrentQuestionIndex, announcePolite]);

    const handleGoToQuestion = useCallback((index: number) => {
        setCurrentQuestionIndex(index);
        announcePolite(`Questão ${index + 1} de ${questions.length}`);
    }, [questions.length, setCurrentQuestionIndex, announcePolite]);

    const handleSubmit = useCallback((force = false) => {
        if (!force) {
            // Check if all questions are answered
            const answeredCount = Object.keys(currentAttempt?.answers || {}).length;
            if (answeredCount < questions.length) {
                setShowConfirmSubmit(true);
                return;
            }
        }
        setShowConfirmSubmit(false);
        const submissionResult = submitAttempt();
        if (submissionResult) {
            setResult(submissionResult);
            setViewState('result');
            announcePolite(`Avaliação finalizada. Sua pontuação: ${submissionResult.score}%`);
            onComplete(submissionResult);
        }
    }, [currentAttempt?.answers, questions.length, submitAttempt, announcePolite, onComplete]);

    const handleCancel = useCallback(() => {
        setShowConfirmExit(true);
    }, []);

    const confirmCancel = useCallback(() => {
        cancelAttempt();
        setShowConfirmExit(false);
        onCancel();
    }, [cancelAttempt, onCancel]);

    const handleViewAnswers = useCallback(() => {
        setReviewMode(true);
        setViewState('review');
    }, []);

    const handleRetry = useCallback(() => {
        setResult(null);
        setReviewMode(false);
        setViewState('intro');
    }, []);

    const currentQuestion = currentAttempt ? questions[currentAttempt.currentQuestionIndex] : null;
    const currentAnswer = currentAttempt?.answers[currentQuestion?.id || '']?.answer;
    const answeredCount = Object.keys(currentAttempt?.answers || {}).length;

    // Intro Screen
    if (viewState === 'intro') {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">{assessment.title}</CardTitle>
                        <p className="text-gray-400">{assessment.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Assessment Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                                <p className="text-3xl font-bold text-gray-100">{questions.length}</p>
                                <p className="text-sm text-gray-400">Questões</p>
                            </div>
                            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
                                <p className="text-3xl font-bold text-gray-100">
                                    {assessment.timeLimit ? `${assessment.timeLimit}min` : '∞'}
                                </p>
                                <p className="text-sm text-gray-400">Tempo</p>
                            </div>
                        </div>

                        {/* Rules */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-300">Informações</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Nota mínima para aprovação: {assessment.passingScore}%
                                </li>
                                {assessment.timeLimit && (
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Tempo limite: {assessment.timeLimit} minutos
                                    </li>
                                )}
                                <li className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Tentativas: {assessment.maxAttempts === 0 ? 'Ilimitadas' : assessment.maxAttempts}
                                </li>
                                {assessment.showExplanations && (
                                    <li className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Explicações disponíveis após cada questão
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={onCancel}>
                                Cancelar
                            </Button>
                            <Button className="flex-1" onClick={handleStart}>
                                Iniciar Avaliação
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Result Screen
    if (viewState === 'result' && result) {
        return (
            <div className="max-w-2xl mx-auto">
                <AssessmentResultComponent
                    result={result}
                    assessment={assessment}
                    onRetry={handleRetry}
                    onViewAnswers={handleViewAnswers}
                    onClose={onCancel}
                />
            </div>
        );
    }

    // Quiz/Review Screen
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Progress Header */}
            <div className="sticky top-0 z-10 bg-gray-950/95 backdrop-blur-sm p-4 rounded-xl border border-gray-800">
                <QuizProgress
                    currentQuestion={(currentAttempt?.currentQuestionIndex || 0) + 1}
                    totalQuestions={questions.length}
                    answeredCount={answeredCount}
                    timeRemaining={currentAttempt?.timeRemaining}
                    showTimer={!!assessment.timeLimit}
                />
            </div>

            {/* Question Navigation */}
            <div className="flex flex-wrap gap-2 justify-center">
                {questions.map((q, index) => {
                    const isAnswered = !!currentAttempt?.answers[q.id];
                    const isCurrent = index === currentAttempt?.currentQuestionIndex;

                    return (
                        <button
                            key={q.id}
                            onClick={() => handleGoToQuestion(index)}
                            className={cn(
                                'w-10 h-10 rounded-lg text-sm font-medium transition-all',
                                isCurrent && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-950',
                                isAnswered
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            )}
                            aria-label={`Ir para questão ${index + 1}${isAnswered ? ' (respondida)' : ''}`}
                            aria-current={isCurrent ? 'step' : undefined}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>

            {/* Question Card */}
            {currentQuestion && (
                <QuestionCard
                    question={currentQuestion}
                    questionNumber={(currentAttempt?.currentQuestionIndex || 0) + 1}
                    totalQuestions={questions.length}
                    onAnswer={handleAnswer}
                    currentAnswer={currentAnswer}
                    showResult={reviewMode}
                    isCorrect={reviewMode ? currentAttempt?.answers[currentQuestion.id]?.isCorrect : undefined}
                    disabled={reviewMode}
                    showHint={!reviewMode}
                />
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center gap-4">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={(currentAttempt?.currentQuestionIndex || 0) === 0}
                >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Anterior
                </Button>

                <div className="flex gap-2">
                    {!reviewMode && (
                        <Button variant="ghost" onClick={handleCancel}>
                            Sair
                        </Button>
                    )}
                    {reviewMode && (
                        <Button variant="outline" onClick={onCancel}>
                            Fechar Revisão
                        </Button>
                    )}
                </div>

                {(currentAttempt?.currentQuestionIndex || 0) < questions.length - 1 ? (
                    <Button onClick={handleNext}>
                        Próxima
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                ) : !reviewMode ? (
                    <Button onClick={() => handleSubmit()}>
                        Finalizar
                        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </Button>
                ) : (
                    <Button onClick={onCancel}>
                        Concluir
                    </Button>
                )}
            </div>

            {/* Submit Button (Mobile) */}
            {!reviewMode && (
                <div className="md:hidden">
                    <Button
                        className="w-full"
                        onClick={() => handleSubmit()}
                        disabled={answeredCount === 0}
                    >
                        Finalizar Avaliação
                    </Button>
                </div>
            )}

            {/* Confirm Exit Dialog */}
            <Dialog open={showConfirmExit} onOpenChange={setShowConfirmExit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sair da Avaliação?</DialogTitle>
                        <DialogDescription>
                            Se você sair agora, seu progresso será perdido e isso contará como uma tentativa.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmExit(false)}>
                            Continuar Avaliação
                        </Button>
                        <Button variant="destructive" onClick={confirmCancel}>
                            Sair Mesmo Assim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirm Submit Dialog */}
            <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Questões não respondidas</DialogTitle>
                        <DialogDescription>
                            Você ainda tem {questions.length - answeredCount} questão(ões) não respondida(s).
                            Deseja enviar mesmo assim?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirmSubmit(false)}>
                            Continuar Respondendo
                        </Button>
                        <Button onClick={() => handleSubmit(true)}>
                            Enviar Mesmo Assim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AssessmentView;
