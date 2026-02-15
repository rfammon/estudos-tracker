import { PETROBRAS_STUDY_PLAN } from './study-plan-data';
import { useTopicStore } from '@/store/use-topic-store';
import { usePlanStore } from '@/store/use-plan-store';
import { DAY_ORDER } from '@/types/plan';

export const initializePetrobrasPlan = () => {
    const { addTopic, topics: existingTopics } = useTopicStore.getState();
    const { createPlan, updatePlan, plan: currentPlan } = usePlanStore.getState();

    // 1. Clear existing topics if user wants (or just add new ones)
    // For this implementation, we will just add the new topics

    const newTopicIds: Record<string, string> = {};

    // 2. Create all topics
    PETROBRAS_STUDY_PLAN.forEach(topicData => {
        // Check if topic already exists to avoid duplicates
        const existing = existingTopics.find(t => t.name === topicData.name);
        if (existing) {
            newTopicIds[topicData.name] = existing.id;
        } else {
            // We need to use the store's action to ensure persistence
            addTopic({
                name: topicData.name,
                description: topicData.description,
                category: topicData.category,
                priority: topicData.priority,
                targetHours: topicData.targetHours,
            });
            // Since addTopic generates its own ID, we need to find it
            // This is a bit hacky because addTopic doesn't return the ID
        }
    });

    // Re-fetch topics after adding
    const updatedTopics = useTopicStore.getState().topics;
    PETROBRAS_STUDY_PLAN.forEach(topicData => {
        const found = updatedTopics.find(t => t.name === topicData.name);
        if (found) {
            newTopicIds[topicData.name] = found.id;
        }
    });

    // 3. Setup initial schedule (Week 1)
    const week1Topics = PETROBRAS_STUDY_PLAN.filter(t => t.week === 1);

    // Distribute topics across the week (Monday to Friday, 2 per day)
    const weeklyPlan = DAY_ORDER.map((day, index) => {
        const dayTopics = [];
        if (index < 5) { // Seg a Sex
            // Just an example distribution
            const topic1 = week1Topics[index % week1Topics.length];
            if (topic1) {
                dayTopics.push({
                    topicId: newTopicIds[topic1.name],
                    durationMinutes: 60
                });
            }
        }
        return {
            day,
            topics: dayTopics,
            isRestDay: index === 6 // Sunday is rest
        };
    });

    // 4. Create/Update Plan
    if (!currentPlan) {
        createPlan('Preparação Petrobras 3 Meses', 'Cronograma completo de 12 semanas focando em base, estrutura e refinamento.');
    }

    const finalPlan = usePlanStore.getState().plan;
    if (finalPlan) {
        updatePlan({
            name: 'Preparação Petrobras 3 Meses',
            description: 'Cronograma completo de 12 semanas focando em base, estrutura e refinamento.',
            weeklyPlan,
            dailyGoal: {
                targetMinutes: 120, // 2 hours as suggested
                targetTopics: 2
            }
        });
    }
};
