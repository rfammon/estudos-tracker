/**
 * Seed data for Portuguese Study Plan
 * Run this script to populate the study_plans, plan_months, plan_weeks, and study_topics tables
 */

import { supabase } from './supabase-auth';

// UUID generator for consistent IDs
const generateUUID = () => crypto.randomUUID();

// Portuguese Study Plan Structure
const planId = generateUUID();
const months: { id: string; plan_id: string; month_number: number; title: string; objective: string }[] = [];
const weeks: { id: string; plan_id: string; month_id: string; week_number: number; title: string }[] = [];
const topics: { id: string; week_id: string; title: string; description: string; order_index: number; estimated_minutes: number }[] = [];

// Month 1: Fundamentos da Gramática
const month1Id = generateUUID();
months.push({
    id: month1Id,
    plan_id: planId,
    month_number: 1,
    title: 'Fundamentos da Gramática',
    objective: 'Dominar as classes de palavras e estrutura de orações'
});

// Weeks for Month 1
const month1Weeks = [
    { title: 'Classes de Palavras I', topics: ['Substantivos', 'Artigos', 'Adjetivos', 'Pronomes'] },
    { title: 'Classes de Palavras II', topics: ['Verbos - Tempos e Modos', 'Verbos - Conjugação', 'Advérbios', 'Preposições'] },
    { title: 'Estrutura da Oração', topics: ['Sujeito e Predicado', 'Complementos Verbais', 'Adjuntos', 'Vozes Verbais'] },
    { title: 'Concordância', topics: ['Concordância Verbal', 'Concordância Nominal', 'Casos Especiais', 'Revisão do Mês 1'] },
];

month1Weeks.forEach((weekData, index) => {
    const weekId = generateUUID();
    weeks.push({
        id: weekId,
        plan_id: planId,
        month_id: month1Id,
        week_number: index + 1,
        title: weekData.title
    });

    weekData.topics.forEach((topicTitle, topicIndex) => {
        topics.push({
            id: generateUUID(),
            week_id: weekId,
            title: topicTitle,
            description: `Estudo detalhado sobre ${topicTitle.toLowerCase()}`,
            order_index: topicIndex + 1,
            estimated_minutes: 45
        });
    });
});

// Month 2: Interpretação de Texto
const month2Id = generateUUID();
months.push({
    id: month2Id,
    plan_id: planId,
    month_number: 2,
    title: 'Interpretação de Texto',
    objective: 'Desenvolver técnicas avançadas de compreensão textual'
});

const month2Weeks = [
    { title: 'Tipos Textuais', topics: ['Texto Narrativo', 'Texto Descritivo', 'Texto Dissertativo', 'Texto Injuntivo'] },
    { title: 'Gêneros Textuais', topics: ['Carta Argumentativa', 'Editorial', 'Crônica', 'Resenha'] },
    { title: 'Coesão e Coerência', topics: ['Conectivos', 'Referenciação', 'Progressão Temática', 'Paráfrase'] },
    { title: 'Inferência e Implícitos', topics: ['Pressupostos', 'Subentendidos', 'Ironia e Humor', 'Revisão do Mês 2'] },
];

month2Weeks.forEach((weekData, index) => {
    const weekId = generateUUID();
    weeks.push({
        id: weekId,
        plan_id: planId,
        month_id: month2Id,
        week_number: index + 5,
        title: weekData.title
    });

    weekData.topics.forEach((topicTitle, topicIndex) => {
        topics.push({
            id: generateUUID(),
            week_id: weekId,
            title: topicTitle,
            description: `Estudo detalhado sobre ${topicTitle.toLowerCase()}`,
            order_index: topicIndex + 1,
            estimated_minutes: 45
        });
    });
});

// Month 3: Redação Oficial
const month3Id = generateUUID();
months.push({
    id: month3Id,
    plan_id: planId,
    month_number: 3,
    title: 'Redação Oficial',
    objective: 'Dominar a escrita oficial e técnicas de argumentação'
});

const month3Weeks = [
    { title: 'Características da Redação Oficial', topics: ['Impessoalidade', 'Formalidade', 'Clareza e Concisão', 'Objetividade'] },
    { title: 'Tipos de Documentos', topics: ['Ofício', 'Memorando', 'Relatório', 'Ata'] },
    { title: 'Argumentação', topics: ['Tipos de Argumentos', 'Falácias', 'Estrutura Argumentativa', 'Coesão Textual'] },
    { title: 'Revisão Final', topics: ['Exercícios de Fixação', 'Simulados', 'Revisão Geral', 'Preparação para Prova'] },
];

month3Weeks.forEach((weekData, index) => {
    const weekId = generateUUID();
    weeks.push({
        id: weekId,
        plan_id: planId,
        month_id: month3Id,
        week_number: index + 9,
        title: weekData.title
    });

    weekData.topics.forEach((topicTitle, topicIndex) => {
        topics.push({
            id: generateUUID(),
            week_id: weekId,
            title: topicTitle,
            description: `Estudo detalhado sobre ${topicTitle.toLowerCase()}`,
            order_index: topicIndex + 1,
            estimated_minutes: 45
        });
    });
});

export async function seedPortuguesePlan() {
    console.log('Starting to seed Portuguese study plan...');

    try {
        // Check if plan already exists
        const { data: existingPlan } = await supabase
            .from('study_plans')
            .select('id')
            .eq('name', 'Português Completo')
            .single();

        if (existingPlan) {
            console.log('Portuguese plan already exists. Skipping seed.');
            return { success: true, message: 'Plan already exists' };
        }

        // Insert the study plan
        const { error: planError } = await supabase
            .from('study_plans')
            .insert({
                id: planId,
                name: 'Português Completo',
                description: 'Plano completo de estudos de Português para concursos públicos, cobrindo gramática, interpretação de texto e redação oficial.',
                total_weeks: 12,
                daily_goal_minutes: 60,
                is_active: true
            });

        if (planError) throw planError;
        console.log('Study plan inserted');

        // Insert months
        const { error: monthsError } = await supabase
            .from('plan_months')
            .insert(months);

        if (monthsError) throw monthsError;
        console.log(`${months.length} months inserted`);

        // Insert weeks
        const { error: weeksError } = await supabase
            .from('plan_weeks')
            .insert(weeks);

        if (weeksError) throw weeksError;
        console.log(`${weeks.length} weeks inserted`);

        // Insert topics
        const { error: topicsError } = await supabase
            .from('study_topics')
            .insert(topics);

        if (topicsError) throw topicsError;
        console.log(`${topics.length} topics inserted`);

        return { success: true, message: 'Portuguese study plan seeded successfully!' };
    } catch (error) {
        console.error('Error seeding Portuguese plan:', error);
        return { success: false, error };
    }
}

// Export the data for reference
export const portuguesePlanData = {
    plan: {
        id: planId,
        name: 'Português Completo',
        description: 'Plano completo de estudos de Português para concursos públicos',
        total_weeks: 12,
        daily_goal_minutes: 60
    },
    months,
    weeks,
    topics
};
