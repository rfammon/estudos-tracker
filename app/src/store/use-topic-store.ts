import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Topic, TopicFormData, TopicStatus, LearningObjective, LearningObjectiveFormData, BLOOM_LEVEL_XP, BloomLevel } from '@/types';

interface TopicState {
    topics: Topic[];
    isLoading: boolean;
    addTopic: (topic: TopicFormData) => void;
    updateTopic: (id: string, updates: Partial<Topic>) => void;
    deleteTopic: (id: string) => void;
    getTopicById: (id: string) => Topic | undefined;
    updateTopicStatus: (id: string, status: TopicStatus) => void;
    updateTopicProgress: (id: string, seconds: number) => void;
    // Learning Objectives
    addObjective: (topicId: string, objective: LearningObjectiveFormData) => void;
    updateObjective: (topicId: string, objectiveId: string, updates: Partial<LearningObjective>) => void;
    completeObjective: (topicId: string, objectiveId: string) => { xpEarned: number; bloomLevel: string };
    removeObjective: (topicId: string, objectiveId: string) => void;
    getObjectivesByTopic: (topicId: string) => LearningObjective[];
    getObjectiveProgress: (topicId: string) => { completed: number; total: number; percentage: number; totalXP: number; byLevel: Record<BloomLevel, { completed: number; total: number }> };
    getAllObjectives: () => LearningObjective[];
    getTotalObjectiveProgress: () => { completed: number; total: number; percentage: number; totalXP: number; byLevel: Record<BloomLevel, { completed: number; total: number }> };
}

export const useTopicStore = create<TopicState>()(
    persist(
        (set, get) => ({
            topics: [],
            isLoading: false,

            addTopic: (topicData) => {
                const now = new Date().toISOString();
                const newTopic: Topic = {
                    ...topicData,
                    id: crypto.randomUUID(),
                    status: 'nao_iniciado',
                    progress: 0,
                    createdAt: now,
                    updatedAt: now,
                };
                set((state) => ({ topics: [...state.topics, newTopic] }));
            },

            updateTopic: (id, updates) => {
                set((state) => ({
                    topics: state.topics.map((t) =>
                        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
                    ),
                }));
            },

            deleteTopic: (id) => {
                set((state) => ({
                    topics: state.topics.filter((t) => t.id !== id),
                }));
            },

            getTopicById: (id) => {
                return get().topics.find((t) => t.id === id);
            },

            updateTopicStatus: (id, status) => {
                set((state) => ({
                    topics: state.topics.map((t) =>
                        t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t
                    ),
                }));
            },

            updateTopicProgress: (id, seconds) => {
                const topic = get().topics.find((t) => t.id === id);
                if (topic) {
                    const currentHours = (topic.progress / 100) * topic.targetHours;
                    const newHours = currentHours + seconds / 3600;
                    const newProgress = Math.min(100, (newHours / topic.targetHours) * 100);

                    let newStatus: TopicStatus = topic.status;
                    if (newProgress > 0 && topic.status === 'nao_iniciado') {
                        newStatus = 'em_progresso';
                    }
                    if (newProgress >= 100) {
                        newStatus = 'dominado';
                    }

                    set((state) => ({
                        topics: state.topics.map((t) =>
                            t.id === id
                                ? { ...t, progress: newProgress, status: newStatus, updatedAt: new Date().toISOString() }
                                : t
                        ),
                    }));
                }
            },

            // Learning Objectives Actions
            addObjective: (topicId, objectiveData) => {
                const now = new Date().toISOString();
                const newObjective: LearningObjective = {
                    id: crypto.randomUUID(),
                    topicId,
                    description: objectiveData.description,
                    bloomLevel: objectiveData.bloomLevel,
                    completed: false,
                    targetDate: objectiveData.targetDate,
                    createdAt: now,
                    updatedAt: now,
                };

                set((state) => ({
                    topics: state.topics.map((t) =>
                        t.id === topicId
                            ? {
                                ...t,
                                objectives: [...(t.objectives || []), newObjective],
                                updatedAt: now,
                            }
                            : t
                    ),
                }));
            },

            updateObjective: (topicId, objectiveId, updates) => {
                const now = new Date().toISOString();
                set((state) => ({
                    topics: state.topics.map((t) =>
                        t.id === topicId
                            ? {
                                ...t,
                                objectives: t.objectives?.map((o) =>
                                    o.id === objectiveId
                                        ? { ...o, ...updates, updatedAt: now }
                                        : o
                                ),
                                updatedAt: now,
                            }
                            : t
                    ),
                }));
            },

            completeObjective: (topicId, objectiveId) => {
                const topic = get().topics.find((t) => t.id === topicId);
                const objective = topic?.objectives?.find((o) => o.id === objectiveId);

                if (!objective) {
                    return { xpEarned: 0, bloomLevel: '' };
                }

                const now = new Date().toISOString();
                const xpEarned = BLOOM_LEVEL_XP[objective.bloomLevel];

                set((state) => ({
                    topics: state.topics.map((t) =>
                        t.id === topicId
                            ? {
                                ...t,
                                objectives: t.objectives?.map((o) =>
                                    o.id === objectiveId
                                        ? { ...o, completed: true, completedAt: now, updatedAt: now }
                                        : o
                                ),
                                updatedAt: now,
                            }
                            : t
                    ),
                }));

                return { xpEarned, bloomLevel: objective.bloomLevel };
            },

            removeObjective: (topicId, objectiveId) => {
                const now = new Date().toISOString();
                set((state) => ({
                    topics: state.topics.map((t) =>
                        t.id === topicId
                            ? {
                                ...t,
                                objectives: t.objectives?.filter((o) => o.id !== objectiveId),
                                updatedAt: now,
                            }
                            : t
                    ),
                }));
            },

            getObjectivesByTopic: (topicId) => {
                const topic = get().topics.find((t) => t.id === topicId);
                return topic?.objectives || [];
            },

            getObjectiveProgress: (topicId) => {
                const topic = get().topics.find((t) => t.id === topicId);
                const objectives = topic?.objectives || [];
                const total = objectives.length;
                const completed = objectives.filter((o) => o.completed).length;
                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                // Calculate total XP
                const totalXP = objectives
                    .filter((o) => o.completed)
                    .reduce((sum, o) => sum + BLOOM_LEVEL_XP[o.bloomLevel], 0);

                // Calculate by Bloom level
                const bloomLevels: BloomLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
                const byLevel: Record<BloomLevel, { completed: number; total: number }> = {} as Record<BloomLevel, { completed: number; total: number }>;

                bloomLevels.forEach((level) => {
                    const levelObjectives = objectives.filter((o) => o.bloomLevel === level);
                    byLevel[level] = {
                        total: levelObjectives.length,
                        completed: levelObjectives.filter((o) => o.completed).length,
                    };
                });

                return { completed, total, percentage, totalXP, byLevel };
            },

            getAllObjectives: () => {
                const allObjectives: LearningObjective[] = [];
                get().topics.forEach((topic) => {
                    if (topic.objectives) {
                        allObjectives.push(...topic.objectives);
                    }
                });
                return allObjectives;
            },

            getTotalObjectiveProgress: () => {
                const allObjectives = get().getAllObjectives();
                const total = allObjectives.length;
                const completed = allObjectives.filter((o) => o.completed).length;
                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                // Calculate total XP
                const totalXP = allObjectives
                    .filter((o) => o.completed)
                    .reduce((sum, o) => sum + BLOOM_LEVEL_XP[o.bloomLevel], 0);

                // Calculate by Bloom level
                const bloomLevels: BloomLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
                const byLevel: Record<BloomLevel, { completed: number; total: number }> = {} as Record<BloomLevel, { completed: number; total: number }>;

                bloomLevels.forEach((level) => {
                    const levelObjectives = allObjectives.filter((o) => o.bloomLevel === level);
                    byLevel[level] = {
                        total: levelObjectives.length,
                        completed: levelObjectives.filter((o) => o.completed).length,
                    };
                });

                return { completed, total, percentage, totalXP, byLevel };
            },
        }),
        {
            name: 'estudos-tracker-topics',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
