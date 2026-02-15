import React, { useState, useEffect, useCallback } from 'react';
import { Question, DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '@/types/assessment';
import { BLOOM_LEVEL_LABELS, BLOOM_LEVEL_COLORS } from '@/types/topic';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnnouncement } from '@/hooks/useAnnouncement';

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    onAnswer: (questionId: string, answer: string | string[]) => void;
    currentAnswer?: string | string[];
    showResult?: boolean;
    isCorrect?: boolean;
    disabled?: boolean;
    showHint?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    questionNumber,
    totalQuestions,
    onAnswer,
    currentAnswer,
    showResult = false,
    isCorrect = false,
    disabled = false,
    showHint = false,
}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [essayAnswer, setEssayAnswer] = useState('');
    const [showExplanation, setShowExplanation] = useState(false);
    const { announcePolite } = useAnnouncement();

    // Initialize state from currentAnswer
    useEffect(() => {
        if (currentAnswer) {
            if (question.type === 'essay') {
                setEssayAnswer(typeof currentAnswer === 'string' ? currentAnswer : '');
            } else if (question.type === 'multiple-choice') {
                setSelectedOptions(Array.isArray(currentAnswer) ? currentAnswer : []);
            } else {
                setSelectedOptions(typeof currentAnswer === 'string' ? [currentAnswer] : []);
            }
        } else {
            setSelectedOptions([]);
            setEssayAnswer('');
        }
    }, [question.id, currentAnswer, question.type]);

    const handleSingleSelect = useCallback((option: string) => {
        if (disabled) return;
        setSelectedOptions([option]);
        onAnswer(question.id, option);
        announcePolite(`Opção ${option} selecionada`);
    }, [disabled, question.id, onAnswer, announcePolite]);

    const handleMultipleSelect = useCallback((option: string) => {
        if (disabled) return;
        setSelectedOptions((prev) => {
            const newSelection = prev.includes(option)
                ? prev.filter((o) => o !== option)
                : [...prev, option];
            onAnswer(question.id, newSelection);
            announcePolite(newSelection.includes(option)
                ? `${option} selecionado`
                : `${option} desmarcado`);
            return newSelection;
        });
    }, [disabled, question.id, onAnswer, announcePolite]);

    const handleEssayChange = useCallback((value: string) => {
        if (disabled) return;
        setEssayAnswer(value);
        onAnswer(question.id, value);
    }, [disabled, question.id, onAnswer]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent, option: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (question.type === 'multiple-choice') {
                handleMultipleSelect(option);
            } else {
                handleSingleSelect(option);
            }
        }
    }, [question.type, handleMultipleSelect, handleSingleSelect]);

    const isOptionSelected = (option: string): boolean => {
        return selectedOptions.includes(option);
    };

    const isOptionCorrect = (option: string): boolean => {
        if (!showResult) return false;
        const correctAnswer = question.correctAnswer;
        if (Array.isArray(correctAnswer)) {
            return correctAnswer.includes(option);
        }
        return correctAnswer === option;
    };

    const isOptionIncorrect = (option: string): boolean => {
        if (!showResult) return false;
        return isOptionSelected(option) && !isOptionCorrect(option);
    };

    const getOptionClasses = (option: string): string => {
        const baseClasses = 'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';

        if (showResult) {
            if (isOptionCorrect(option)) {
                return cn(baseClasses, 'border-green-500 bg-green-500/10 text-green-400');
            }
            if (isOptionIncorrect(option)) {
                return cn(baseClasses, 'border-red-500 bg-red-500/10 text-red-400');
            }
            return cn(baseClasses, 'border-gray-700 bg-gray-800/50 text-gray-400');
        }

        if (isOptionSelected(option)) {
            return cn(baseClasses, 'border-blue-500 bg-blue-500/10 text-blue-400 ring-2 ring-blue-500');
        }

        return cn(baseClasses, 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-800 focus:ring-blue-500');
    };

    const renderOptions = () => {
        if (question.type === 'essay') {
            return (
                <div className="space-y-3">
                    <label htmlFor={`essay-${question.id}`} className="sr-only">
                        Sua resposta
                    </label>
                    <textarea
                        id={`essay-${question.id}`}
                        value={essayAnswer}
                        onChange={(e) => handleEssayChange(e.target.value)}
                        disabled={disabled}
                        placeholder="Digite sua resposta aqui..."
                        className={cn(
                            'w-full min-h-[150px] p-4 rounded-lg border-2 bg-gray-800/50 text-gray-100 placeholder-gray-500',
                            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            'resize-y',
                            disabled && 'opacity-50 cursor-not-allowed',
                            showResult && 'border-gray-700'
                        )}
                        aria-describedby={`essay-hint-${question.id}`}
                    />
                    {showHint && question.hint && (
                        <p id={`essay-hint-${question.id}`} className="text-sm text-gray-400 italic">
                            💡 Dica: {question.hint}
                        </p>
                    )}
                    {showResult && (
                        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <p className="text-yellow-400 text-sm">
                                ⚠️ Questões dissertativas requerem revisão manual.
                            </p>
                        </div>
                    )}
                </div>
            );
        }

        const options = question.options || ['Verdadeiro', 'Falso'];

        return (
            <div
                className="space-y-3"
                role={question.type === 'multiple-choice' ? 'group' : 'radiogroup'}
                aria-label="Opções de resposta"
            >
                {options.map((option, index) => (
                    <button
                        key={index}
                        type="button"
                        role={question.type === 'multiple-choice' ? 'checkbox' : 'radio'}
                        aria-checked={isOptionSelected(option)}
                        onClick={() => {
                            if (question.type === 'multiple-choice') {
                                handleMultipleSelect(option);
                            } else {
                                handleSingleSelect(option);
                            }
                        }}
                        onKeyDown={(e) => handleKeyDown(e, option)}
                        disabled={disabled}
                        className={getOptionClasses(option)}
                        tabIndex={0}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center',
                                    question.type === 'multiple-choice' ? 'rounded-md' : 'rounded-full',
                                    isOptionSelected(option)
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-500'
                                )}
                            >
                                {isOptionSelected(option) && (
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        {question.type === 'multiple-choice' ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        ) : (
                                            <circle cx="12" cy="12" r="4" fill="currentColor" />
                                        )}
                                    </svg>
                                )}
                            </div>
                            <span className="flex-1">{option}</span>
                            {showResult && isOptionCorrect(option) && (
                                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {showResult && isOptionIncorrect(option) && (
                                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </div>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <Card className="w-full bg-gray-900/50 border-gray-800">
            <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-gray-400 border-gray-700">
                            Questão {questionNumber} de {totalQuestions}
                        </Badge>
                        <Badge className={cn(DIFFICULTY_COLORS[question.difficulty].bg, DIFFICULTY_COLORS[question.difficulty].text, DIFFICULTY_COLORS[question.difficulty].border)}>
                            {DIFFICULTY_LABELS[question.difficulty]}
                        </Badge>
                        <Badge className={cn(BLOOM_LEVEL_COLORS[question.bloomLevel].bg, BLOOM_LEVEL_COLORS[question.bloomLevel].text, BLOOM_LEVEL_COLORS[question.bloomLevel].border)}>
                            {BLOOM_LEVEL_LABELS[question.bloomLevel]}
                        </Badge>
                    </div>
                    <Badge variant="outline" className="text-gray-400 border-gray-700">
                        {question.points} {question.points === 1 ? 'ponto' : 'pontos'}
                    </Badge>
                </div>
                <CardTitle className="text-xl text-gray-100 leading-relaxed">
                    {question.question}
                </CardTitle>
                {question.type !== 'essay' && (
                    <p className="text-sm text-gray-400">
                        {question.type === 'multiple-choice'
                            ? 'Selecione todas as opções corretas'
                            : 'Selecione uma opção'}
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {question.imageUrl && (
                    <div className="mb-4">
                        <img
                            src={question.imageUrl}
                            alt="Imagem da questão"
                            className="max-w-full h-auto rounded-lg border border-gray-700"
                        />
                    </div>
                )}

                {renderOptions()}

                {showHint && question.hint && question.type !== 'essay' && (
                    <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <p className="text-blue-400 text-sm">
                            💡 Dica: {question.hint}
                        </p>
                    </div>
                )}

                {showResult && question.explanation && (
                    <div className="mt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowExplanation(!showExplanation)}
                            className="text-gray-400 hover:text-gray-300"
                            aria-expanded={showExplanation}
                        >
                            {showExplanation ? 'Ocultar' : 'Ver'} explicação
                            <svg
                                className={cn('ml-2 w-4 h-4 transition-transform', showExplanation && 'rotate-180')}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </Button>
                        {showExplanation && (
                            <div className={cn(
                                'mt-3 p-4 rounded-lg border',
                                isCorrect
                                    ? 'bg-green-500/10 border-green-500/20'
                                    : 'bg-red-500/10 border-red-500/20'
                            )}>
                                <p className={cn('text-sm', isCorrect ? 'text-green-400' : 'text-red-400')}>
                                    {question.explanation}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {showResult && (
                    <div
                        className={cn(
                            'mt-4 p-4 rounded-lg flex items-center gap-3',
                            isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                        )}
                        role="alert"
                        aria-live="polite"
                    >
                        {isCorrect ? (
                            <>
                                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-green-400 font-medium">Correto! +{question.points} pontos</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-400 font-medium">Incorreto</span>
                            </>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default QuestionCard;
