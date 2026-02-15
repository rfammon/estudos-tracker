import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    Assessment,
    AssessmentResult,
    AssessmentAttempt,
    AssessmentStats,
    TopicAssessmentProgress,
    QuizStreak,
    QuestionAnswer,
    Question,
    ASSESSMENT_XP,
    HIGH_SCORE_BONUS,
    PERFECT_SCORE_BONUS,
    DIFFICULTY_XP_MULTIPLIER,
} from '@/types/assessment';

// Helper to check if answer is correct
const checkAnswer = (question: Question, answer: string | string[]): boolean => {
    if (question.type === 'essay') {
        // Essays are always marked as needing review
        return false;
    }

    if (Array.isArray(question.correctAnswer)) {
        if (!Array.isArray(answer)) return false;
        return (
            question.correctAnswer.length === answer.length &&
            question.correctAnswer.every((a) => answer.includes(a))
        );
    }

    return question.correctAnswer === answer;
};

// Helper to calculate XP for an assessment result
const calculateXP = (
    assessment: Assessment,
    result: AssessmentResult
): number => {
    let xp = ASSESSMENT_XP[assessment.type];

    // Add bonus for high score
    if (result.score >= HIGH_SCORE_BONUS.threshold) {
        xp += HIGH_SCORE_BONUS.bonus;
    }

    // Add bonus for perfect score
    if (result.score === 100) {
        xp += PERFECT_SCORE_BONUS;
    }

    // Multiply by average difficulty
    const avgDifficultyMultiplier = assessment.questions.reduce((sum, q) => {
        const multiplier = DIFFICULTY_XP_MULTIPLIER[q.difficulty];
        return sum + multiplier;
    }, 0) / assessment.questions.length;

    return Math.round(xp * avgDifficultyMultiplier);
};

export interface AssessmentState {
    // Data
    assessments: Assessment[];
    results: AssessmentResult[];
    currentAttempt: AssessmentAttempt | null;
    streak: QuizStreak;

    // Assessment CRUD
    addAssessment: (assessment: Assessment) => void;
    updateAssessment: (id: string, updates: Partial<Assessment>) => void;
    deleteAssessment: (id: string) => void;
    getAssessment: (id: string) => Assessment | undefined;
    getAssessmentsByTopic: (topicId: string) => Assessment[];
    getAssessmentsByType: (type: Assessment['type']) => Assessment[];

    // Attempt Management
    startAttempt: (assessmentId: string) => AssessmentAttempt | null;
    saveAnswer: (questionId: string, answer: string | string[], timeSpent?: number) => void;
    setCurrentQuestionIndex: (index: number) => void;
    decrementTimeRemaining: () => void;
    submitAttempt: () => AssessmentResult | null;
    cancelAttempt: () => void;

    // Results
    getResultsByAssessment: (assessmentId: string) => AssessmentResult[];
    getResultsByTopic: (topicId: string) => AssessmentResult[];
    getBestResult: (assessmentId: string) => AssessmentResult | undefined;
    getAttemptCount: (assessmentId: string) => number;
    canAttempt: (assessmentId: string) => boolean;

    // Statistics
    getAssessmentStats: (assessmentId: string) => AssessmentStats | null;
    getTopicProgress: (topicId: string) => TopicAssessmentProgress;

    // Streak Management
    updateStreak: () => void;
    getStreak: () => QuizStreak;

    // XP Calculation
    calculateResultXP: (assessmentId: string, result: AssessmentResult) => number;

    // Recommendations
    getWeakAreas: (topicId: string) => { questionId: string; question: string; correctRate: number }[];
}

export const useAssessmentStore = create<AssessmentState>()(
    persist(
        (set, get) => ({
            assessments: [],
            results: [],
            currentAttempt: null,
            streak: {
                currentStreak: 0,
                longestStreak: 0,
                lastQuizDate: '',
                quizzesThisWeek: 0,
            },

            // Assessment CRUD
            addAssessment: (assessment: Assessment) => {
                set((state: AssessmentState) => ({
                    assessments: [...state.assessments, assessment],
                }));
            },

            updateAssessment: (id: string, updates: Partial<Assessment>) => {
                set((state: AssessmentState) => ({
                    assessments: state.assessments.map((a: Assessment) =>
                        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
                    ),
                }));
            },

            deleteAssessment: (id: string) => {
                set((state: AssessmentState) => ({
                    assessments: state.assessments.filter((a: Assessment) => a.id !== id),
                    results: state.results.filter((r: AssessmentResult) => r.assessmentId !== id),
                }));
            },

            getAssessment: (id: string) => {
                return get().assessments.find((a: Assessment) => a.id === id);
            },

            getAssessmentsByTopic: (topicId: string) => {
                return get().assessments.filter((a: Assessment) => a.topicId === topicId);
            },

            getAssessmentsByType: (type: Assessment['type']) => {
                return get().assessments.filter((a: Assessment) => a.type === type);
            },

            // Attempt Management
            startAttempt: (assessmentId: string) => {
                const assessment = get().getAssessment(assessmentId);
                if (!assessment) return null;

                // Check if attempts are allowed
                if (!get().canAttempt(assessmentId)) return null;

                const now = new Date().toISOString();
                const attempt: AssessmentAttempt = {
                    id: crypto.randomUUID(),
                    assessmentId,
                    topicId: assessment.topicId,
                    startedAt: now,
                    currentQuestionIndex: 0,
                    answers: {},
                    timeRemaining: assessment.timeLimit ? assessment.timeLimit * 60 : undefined,
                };

                set({ currentAttempt: attempt });
                return attempt;
            },

            saveAnswer: (questionId: string, answer: string | string[], timeSpent?: number) => {
                set((state: AssessmentState) => {
                    if (!state.currentAttempt) return state;

                    const questionAnswer: QuestionAnswer = {
                        questionId,
                        answer,
                        timeSpent,
                    };

                    return {
                        currentAttempt: {
                            ...state.currentAttempt,
                            answers: {
                                ...state.currentAttempt.answers,
                                [questionId]: questionAnswer,
                            },
                        },
                    };
                });
            },

            setCurrentQuestionIndex: (index: number) => {
                set((state: AssessmentState) => {
                    if (!state.currentAttempt) return state;
                    return {
                        currentAttempt: {
                            ...state.currentAttempt,
                            currentQuestionIndex: index,
                        },
                    };
                });
            },

            decrementTimeRemaining: () => {
                set((state: AssessmentState) => {
                    if (!state.currentAttempt || !state.currentAttempt.timeRemaining) return state;
                    return {
                        currentAttempt: {
                            ...state.currentAttempt,
                            timeRemaining: Math.max(0, state.currentAttempt.timeRemaining - 1),
                        },
                    };
                });
            },

            submitAttempt: () => {
                const { currentAttempt, assessments, results } = get();
                if (!currentAttempt) return null;

                const assessment = assessments.find((a: Assessment) => a.id === currentAttempt.assessmentId);
                if (!assessment) return null;

                // Calculate results
                let correctAnswers = 0;
                let earnedPoints = 0;
                let totalPoints = 0;

                const processedAnswers: Record<string, QuestionAnswer> = {};

                assessment.questions.forEach((question) => {
                    totalPoints += question.points;
                    const userAnswer = currentAttempt.answers[question.id];

                    if (userAnswer) {
                        const isCorrect = checkAnswer(question, userAnswer.answer);
                        if (isCorrect) {
                            correctAnswers++;
                            earnedPoints += question.points;
                        }
                        processedAnswers[question.id] = {
                            ...userAnswer,
                            isCorrect,
                        };
                    } else {
                        processedAnswers[question.id] = {
                            questionId: question.id,
                            answer: '',
                            isCorrect: false,
                        };
                    }
                });

                const score = Math.round((earnedPoints / totalPoints) * 100);
                const timeSpent = assessment.timeLimit
                    ? (assessment.timeLimit * 60) - (currentAttempt.timeRemaining || 0)
                    : Math.round((new Date().getTime() - new Date(currentAttempt.startedAt).getTime()) / 1000);

                const attemptNumber = get().getAttemptCount(assessment.id) + 1;

                const result: AssessmentResult = {
                    id: crypto.randomUUID(),
                    assessmentId: assessment.id,
                    topicId: assessment.topicId,
                    score,
                    correctAnswers,
                    totalQuestions: assessment.questions.length,
                    totalPoints,
                    earnedPoints,
                    timeSpent,
                    completedAt: new Date().toISOString(),
                    answers: processedAnswers,
                    passed: score >= assessment.passingScore,
                    attemptNumber,
                };

                // Update streak
                get().updateStreak();

                set({
                    results: [...results, result],
                    currentAttempt: null,
                });

                return result;
            },

            cancelAttempt: () => {
                set({ currentAttempt: null });
            },

            // Results
            getResultsByAssessment: (assessmentId: string) => {
                return get().results.filter((r: AssessmentResult) => r.assessmentId === assessmentId);
            },

            getResultsByTopic: (topicId: string) => {
                return get().results.filter((r: AssessmentResult) => r.topicId === topicId);
            },

            getBestResult: (assessmentId: string) => {
                const results = get().getResultsByAssessment(assessmentId);
                if (results.length === 0) return undefined;
                return results.reduce((best: AssessmentResult, current: AssessmentResult) =>
                    current.score > best.score ? current : best
                );
            },

            getAttemptCount: (assessmentId: string) => {
                return get().results.filter((r: AssessmentResult) => r.assessmentId === assessmentId).length;
            },

            canAttempt: (assessmentId: string) => {
                const assessment = get().getAssessment(assessmentId);
                if (!assessment) return false;

                // Unlimited attempts
                if (assessment.maxAttempts === 0) return true;

                const attemptCount = get().getAttemptCount(assessmentId);
                return attemptCount < assessment.maxAttempts;
            },

            // Statistics
            getAssessmentStats: (assessmentId: string) => {
                const results = get().getResultsByAssessment(assessmentId);
                const assessment = get().getAssessment(assessmentId);

                if (results.length === 0 || !assessment) return null;

                const totalAttempts = results.length;
                const scores = results.map((r: AssessmentResult) => r.score);
                const averageScore = scores.reduce((a: number, b: number) => a + b, 0) / totalAttempts;
                const highestScore = Math.max(...scores);
                const lowestScore = Math.min(...scores);
                const passRate = (results.filter((r: AssessmentResult) => r.passed).length / totalAttempts) * 100;
                const averageTimeSpent = results.reduce((sum: number, r: AssessmentResult) => sum + r.timeSpent, 0) / totalAttempts;

                // Question stats
                const questionStats: Record<string, { correct: number; incorrect: number; timeSpent: number; wrongAnswers: Record<string, number> }> = {};

                assessment.questions.forEach((q) => {
                    questionStats[q.id] = { correct: 0, incorrect: 0, timeSpent: 0, wrongAnswers: {} };
                });

                results.forEach((result: AssessmentResult) => {
                    Object.entries(result.answers).forEach(([questionId, answer]) => {
                        if (questionStats[questionId]) {
                            if (answer.isCorrect) {
                                questionStats[questionId].correct++;
                            } else {
                                questionStats[questionId].incorrect++;
                                const wrongAnswer = Array.isArray(answer.answer) ? answer.answer.join(',') : answer.answer;
                                questionStats[questionId].wrongAnswers[wrongAnswer] =
                                    (questionStats[questionId].wrongAnswers[wrongAnswer] || 0) + 1;
                            }
                            questionStats[questionId].timeSpent += answer.timeSpent || 0;
                        }
                    });
                });

                const formattedQuestionStats = Object.fromEntries(
                    Object.entries(questionStats).map(([id, stats]) => {
                        const totalAnswered = stats.correct + stats.incorrect;
                        const mostCommonWrongAnswer = Object.entries(stats.wrongAnswers)
                            .sort((a, b) => b[1] - a[1])[0]?.[0];

                        return [id, {
                            questionId: id,
                            correctCount: stats.correct,
                            incorrectCount: stats.incorrect,
                            averageTimeSpent: totalAnswered > 0 ? stats.timeSpent / totalAnswered : 0,
                            mostCommonWrongAnswer,
                        }];
                    })
                );

                return {
                    assessmentId,
                    totalAttempts,
                    averageScore,
                    highestScore,
                    lowestScore,
                    passRate,
                    averageTimeSpent,
                    questionStats: formattedQuestionStats,
                };
            },

            getTopicProgress: (topicId: string) => {
                const assessments = get().getAssessmentsByTopic(topicId);
                const results = get().getResultsByTopic(topicId);

                const diagnostic = assessments.find((a: Assessment) => a.type === 'diagnostic');
                const formative = assessments.filter((a: Assessment) => a.type === 'formative');
                const summative = assessments.find((a: Assessment) => a.type === 'summative');

                const diagnosticResult = diagnostic ? get().getBestResult(diagnostic.id) : undefined;
                const summativeResult = summative ? get().getBestResult(summative.id) : undefined;

                const formativeResults = formative
                    .map((a: Assessment) => get().getBestResult(a.id))
                    .filter((r): r is AssessmentResult => r !== undefined);

                const formativeScores = formativeResults.map((r: AssessmentResult) => r.score);
                const formativeAverage = formativeScores.length > 0
                    ? formativeScores.reduce((a: number, b: number) => a + b, 0) / formativeScores.length
                    : undefined;

                const totalXpEarned = results.reduce((sum: number, r: AssessmentResult) => {
                    const assessment = get().getAssessment(r.assessmentId);
                    return sum + (assessment ? get().calculateResultXP(assessment.id, r) : 0);
                }, 0);

                const lastResult = results.sort((a: AssessmentResult, b: AssessmentResult) =>
                    new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
                )[0];

                return {
                    topicId,
                    diagnosticCompleted: !!diagnosticResult,
                    diagnosticScore: diagnosticResult?.score,
                    formativeCompleted: formativeResults.length,
                    formativeAverageScore: formativeAverage,
                    summativeCompleted: !!summativeResult,
                    summativeScore: summativeResult?.score,
                    totalQuizzesTaken: results.length,
                    totalXpEarned,
                    lastAssessmentAt: lastResult?.completedAt,
                };
            },

            // Streak Management
            updateStreak: () => {
                const today = new Date().toISOString().split('T')[0];

                set((state: AssessmentState) => {
                    const lastDate = state.streak.lastQuizDate;
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];

                    let newStreak = state.streak.currentStreak;

                    if (lastDate === today) {
                        // Already completed a quiz today, no streak change
                    } else if (lastDate === yesterdayStr) {
                        // Consecutive day
                        newStreak = state.streak.currentStreak + 1;
                    } else if (!lastDate) {
                        // First quiz
                        newStreak = 1;
                    } else {
                        // Streak broken
                        newStreak = 1;
                    }

                    // Calculate quizzes this week
                    const weekStart = new Date();
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
                    weekStart.setHours(0, 0, 0, 0);

                    const quizzesThisWeek = state.results.filter(
                        (r: AssessmentResult) => new Date(r.completedAt) >= weekStart
                    ).length + 1; // +1 for current quiz

                    return {
                        streak: {
                            currentStreak: newStreak,
                            longestStreak: Math.max(state.streak.longestStreak, newStreak),
                            lastQuizDate: today,
                            quizzesThisWeek,
                        },
                    };
                });
            },

            getStreak: () => get().streak,

            // XP Calculation
            calculateResultXP: (assessmentId: string, result: AssessmentResult) => {
                const assessment = get().getAssessment(assessmentId);
                if (!assessment) return 0;
                return calculateXP(assessment, result);
            },

            // Recommendations
            getWeakAreas: (topicId: string) => {
                const assessments = get().getAssessmentsByTopic(topicId);
                const weakAreas: { questionId: string; question: string; correctRate: number }[] = [];

                assessments.forEach((assessment) => {
                    const stats = get().getAssessmentStats(assessment.id);
                    if (!stats) return;

                    Object.entries(stats.questionStats).forEach(([questionId, qStats]) => {
                        const total = qStats.correctCount + qStats.incorrectCount;
                        if (total > 0) {
                            const correctRate = (qStats.correctCount / total) * 100;
                            if (correctRate < 70) {
                                const question = assessment.questions.find((q) => q.id === questionId);
                                if (question) {
                                    weakAreas.push({
                                        questionId,
                                        question: question.question,
                                        correctRate,
                                    });
                                }
                            }
                        }
                    });
                });

                return weakAreas.sort((a, b) => a.correctRate - b.correctRate);
            },
        }),
        {
            name: 'estudos-tracker-assessments',
            storage: createJSONStorage(() => localStorage),
            partialize: (state: AssessmentState) => ({
                assessments: state.assessments,
                results: state.results,
                streak: state.streak,
            }),
        }
    )
);

// Sample assessments data generator
export const generateSampleAssessments = (topicId: string, topicName: string): Assessment[] => {
    const now = new Date().toISOString();

    // Diagnostic Assessment
    const diagnostic: Assessment = {
        id: crypto.randomUUID(),
        topicId,
        type: 'diagnostic',
        title: `Avaliação Diagnóstica - ${topicName}`,
        description: 'Identifique seu nível de conhecimento prévio sobre este tópico.',
        questions: [
            {
                id: crypto.randomUUID(),
                type: 'single-choice',
                question: 'Qual é o seu nível de conhecimento prévio sobre este tópico?',
                options: ['Nenhum', 'Básico', 'Intermediário', 'Avançado'],
                correctAnswer: 'Básico',
                bloomLevel: 'remember',
                difficulty: 'easy',
                points: 10,
            },
        ],
        passingScore: 50,
        maxAttempts: 1,
        shuffleQuestions: false,
        showCorrectAnswers: true,
        showExplanations: true,
        createdAt: now,
        updatedAt: now,
    };

    // Formative Assessment (Quiz)
    const formative: Assessment = {
        id: crypto.randomUUID(),
        topicId,
        type: 'formative',
        title: `Quiz - ${topicName}`,
        description: 'Teste seus conhecimentos com este quiz rápido.',
        questions: [
            {
                id: crypto.randomUUID(),
                type: 'single-choice',
                question: 'Exemplo de questão de escolha única?',
                options: ['Opção A', 'Opção B', 'Opção C', 'Opção D'],
                correctAnswer: 'Opção A',
                explanation: 'Esta é a explicação da resposta correta.',
                bloomLevel: 'understand',
                difficulty: 'medium',
                points: 20,
            },
            {
                id: crypto.randomUUID(),
                type: 'multiple-choice',
                question: 'Quais das seguintes opções são corretas? (Selecione todas)',
                options: ['Opção A', 'Opção B', 'Opção C', 'Opção D'],
                correctAnswer: ['Opção A', 'Opção C'],
                explanation: 'As opções A e C estão corretas porque...',
                bloomLevel: 'analyze',
                difficulty: 'hard',
                points: 30,
            },
            {
                id: crypto.randomUUID(),
                type: 'true-false',
                question: 'Esta afirmação é verdadeira.',
                options: ['Verdadeiro', 'Falso'],
                correctAnswer: 'Verdadeiro',
                explanation: 'A afirmação é verdadeira porque...',
                bloomLevel: 'remember',
                difficulty: 'easy',
                points: 10,
            },
        ],
        timeLimit: 10,
        passingScore: 70,
        maxAttempts: 3,
        shuffleQuestions: true,
        showCorrectAnswers: true,
        showExplanations: true,
        createdAt: now,
        updatedAt: now,
    };

    // Summative Assessment
    const summative: Assessment = {
        id: crypto.randomUUID(),
        topicId,
        type: 'summative',
        title: `Avaliação Final - ${topicName}`,
        description: 'Avaliação final para verificar o domínio do tópico.',
        questions: [
            {
                id: crypto.randomUUID(),
                type: 'single-choice',
                question: 'Questão 1 da avaliação final?',
                options: ['A', 'B', 'C', 'D'],
                correctAnswer: 'A',
                explanation: 'Explicação da questão 1.',
                bloomLevel: 'apply',
                difficulty: 'medium',
                points: 25,
            },
            {
                id: crypto.randomUUID(),
                type: 'essay',
                question: 'Explique com suas palavras o conceito principal deste tópico.',
                correctAnswer: '',
                bloomLevel: 'create',
                difficulty: 'hard',
                points: 50,
            },
        ],
        timeLimit: 30,
        passingScore: 70,
        maxAttempts: 2,
        shuffleQuestions: false,
        showCorrectAnswers: false,
        showExplanations: true,
        createdAt: now,
        updatedAt: now,
    };

    return [diagnostic, formative, summative];
};
