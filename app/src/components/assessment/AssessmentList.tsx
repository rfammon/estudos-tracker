import React, { useState, useMemo } from 'react';
import { AssessmentType } from '@/types/assessment';
import { cn } from '@/lib/utils';
import { AssessmentCard } from './AssessmentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAssessmentStore } from '@/store/use-assessment-store';

interface AssessmentListProps {
    topicId: string;
    onStartAssessment: (assessmentId: string) => void;
    onViewResults: (assessmentId: string) => void;
}

export const AssessmentList: React.FC<AssessmentListProps> = ({
    topicId,
    onStartAssessment,
    onViewResults,
}) => {
    const { getAssessmentsByTopic, getTopicProgress } = useAssessmentStore();
    const [filter, setFilter] = useState<AssessmentType | 'all'>('all');

    const assessments = getAssessmentsByTopic(topicId);
    const progress = getTopicProgress(topicId);

    const groupedAssessments = useMemo(() => {
        return {
            diagnostic: assessments.filter((a) => a.type === 'diagnostic'),
            formative: assessments.filter((a) => a.type === 'formative'),
            summative: assessments.filter((a) => a.type === 'summative'),
        };
    }, [assessments]);

    const getProgressStats = () => {
        const total = assessments.length;
        const completed = [
            progress.diagnosticCompleted,
            progress.formativeCompleted > 0,
            progress.summativeCompleted,
        ].filter(Boolean).length;

        return { total, completed };
    };

    const stats = getProgressStats();

    if (assessments.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-100 mb-2">
                    Nenhuma avaliação disponível
                </h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                    As avaliações para este tópico serão adicionadas em breve.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Progress Overview */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-100">Progresso das Avaliações</h3>
                    <span className="text-sm text-gray-400">
                        {stats.completed}/{stats.total} completas
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-gray-900/50">
                        <div className={cn(
                            'text-2xl font-bold',
                            progress.diagnosticCompleted ? 'text-green-400' : 'text-gray-400'
                        )}>
                            {progress.diagnosticCompleted ? '✓' : '○'}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Diagnóstica</p>
                        {progress.diagnosticScore !== undefined && (
                            <p className="text-sm font-medium text-gray-300">{progress.diagnosticScore}%</p>
                        )}
                    </div>
                    <div className="p-3 rounded-lg bg-gray-900/50">
                        <div className={cn(
                            'text-2xl font-bold',
                            progress.formativeCompleted > 0 ? 'text-green-400' : 'text-gray-400'
                        )}>
                            {progress.formativeCompleted}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Quizzes</p>
                        {progress.formativeAverageScore !== undefined && (
                            <p className="text-sm font-medium text-gray-300">{Math.round(progress.formativeAverageScore)}%</p>
                        )}
                    </div>
                    <div className="p-3 rounded-lg bg-gray-900/50">
                        <div className={cn(
                            'text-2xl font-bold',
                            progress.summativeCompleted ? 'text-green-400' : 'text-gray-400'
                        )}>
                            {progress.summativeCompleted ? '✓' : '○'}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Final</p>
                        {progress.summativeScore !== undefined && (
                            <p className="text-sm font-medium text-gray-300">{progress.summativeScore}%</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <Tabs value={filter} onValueChange={(v) => setFilter(v as AssessmentType | 'all')}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="diagnostic">Diagnóstica</TabsTrigger>
                    <TabsTrigger value="formative">Formativa</TabsTrigger>
                    <TabsTrigger value="summative">Somativa</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4 space-y-4">
                    {/* Diagnostic Section */}
                    {groupedAssessments.diagnostic.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Avaliação Diagnóstica
                            </h4>
                            {groupedAssessments.diagnostic.map((assessment) => (
                                <AssessmentCard
                                    key={assessment.id}
                                    assessment={assessment}
                                    onStart={onStartAssessment}
                                    onViewResults={onViewResults}
                                />
                            ))}
                        </div>
                    )}

                    {/* Formative Section */}
                    {groupedAssessments.formative.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Quizzes Formativos ({groupedAssessments.formative.length})
                            </h4>
                            <div className="grid gap-3 md:grid-cols-2">
                                {groupedAssessments.formative.map((assessment) => (
                                    <AssessmentCard
                                        key={assessment.id}
                                        assessment={assessment}
                                        onStart={onStartAssessment}
                                        onViewResults={onViewResults}
                                        compact
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Summative Section */}
                    {groupedAssessments.summative.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                                Avaliação Final
                            </h4>
                            {groupedAssessments.summative.map((assessment) => (
                                <AssessmentCard
                                    key={assessment.id}
                                    assessment={assessment}
                                    onStart={onStartAssessment}
                                    onViewResults={onViewResults}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="diagnostic" className="mt-4 space-y-4">
                    {groupedAssessments.diagnostic.map((assessment) => (
                        <AssessmentCard
                            key={assessment.id}
                            assessment={assessment}
                            onStart={onStartAssessment}
                            onViewResults={onViewResults}
                        />
                    ))}
                    {groupedAssessments.diagnostic.length === 0 && (
                        <p className="text-center text-gray-400 py-8">
                            Nenhuma avaliação diagnóstica disponível.
                        </p>
                    )}
                </TabsContent>

                <TabsContent value="formative" className="mt-4 space-y-4">
                    <div className="grid gap-3 md:grid-cols-2">
                        {groupedAssessments.formative.map((assessment) => (
                            <AssessmentCard
                                key={assessment.id}
                                assessment={assessment}
                                onStart={onStartAssessment}
                                onViewResults={onViewResults}
                                compact
                            />
                        ))}
                    </div>
                    {groupedAssessments.formative.length === 0 && (
                        <p className="text-center text-gray-400 py-8">
                            Nenhum quiz formativo disponível.
                        </p>
                    )}
                </TabsContent>

                <TabsContent value="summative" className="mt-4 space-y-4">
                    {groupedAssessments.summative.map((assessment) => (
                        <AssessmentCard
                            key={assessment.id}
                            assessment={assessment}
                            onStart={onStartAssessment}
                            onViewResults={onViewResults}
                        />
                    ))}
                    {groupedAssessments.summative.length === 0 && (
                        <p className="text-center text-gray-400 py-8">
                            Nenhuma avaliação somativa disponível.
                        </p>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AssessmentList;
