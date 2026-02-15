export type TopicCategory = 'gramatica' | 'interpretacao' | 'redacao' | 'vocabulario' | 'literatura' | 'outro';
export type TopicPriority = 'alta' | 'media' | 'baixa';
export type TopicStatus = 'nao_iniciado' | 'em_progresso' | 'dominado';

// Bloom's Taxonomy Levels
export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

export interface LearningObjective {
    id: string;
    topicId: string;
    description: string;
    bloomLevel: BloomLevel;
    completed: boolean;
    targetDate?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface LearningObjectiveFormData {
    description: string;
    bloomLevel: BloomLevel;
    targetDate?: string;
}

export interface Topic {
    id: string;
    name: string;
    description: string;
    category: TopicCategory;
    priority: TopicPriority;
    status: TopicStatus;
    progress: number;
    targetHours: number;
    objectives?: LearningObjective[];
    createdAt: string;
    updatedAt: string;
}

export interface TopicFormData {
    name: string;
    description: string;
    category: TopicCategory;
    priority: TopicPriority;
    targetHours: number;
}

export const CATEGORY_LABELS: Record<TopicCategory, string> = {
    gramatica: 'Gramática',
    interpretacao: 'Interpretação de Texto',
    redacao: 'Redação',
    vocabulario: 'Vocabulário',
    literatura: 'Literatura',
    outro: 'Outro',
};

export const PRIORITY_LABELS: Record<TopicPriority, string> = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa',
};

export const STATUS_LABELS: Record<TopicStatus, string> = {
    nao_iniciado: 'Não Iniciado',
    em_progresso: 'Em Progresso',
    dominado: 'Dominado',
};

export const CATEGORY_COLORS: Record<TopicCategory, string> = {
    gramatica: 'blue',
    interpretacao: 'purple',
    redacao: 'orange',
    vocabulario: 'green',
    literatura: 'pink',
    outro: 'gray',
};

// Bloom's Taxonomy Labels (Portuguese)
export const BLOOM_LEVEL_LABELS: Record<BloomLevel, string> = {
    remember: 'Lembrar',
    understand: 'Compreender',
    apply: 'Aplicar',
    analyze: 'Analisar',
    evaluate: 'Avaliar',
    create: 'Criar',
};

// Bloom's Taxonomy Descriptions
export const BLOOM_LEVEL_DESCRIPTIONS: Record<BloomLevel, string> = {
    remember: 'Recordar fatos e conceitos básicos',
    understand: 'Explicar ideias ou conceitos',
    apply: 'Usar informações em novas situações',
    analyze: 'Conectar relações entre ideias',
    evaluate: 'Justificar decisões ou cursos de ação',
    create: 'Produzir trabalho novo ou original',
};

// Bloom's Taxonomy Colors (gradient from lower to higher order thinking)
export const BLOOM_LEVEL_COLORS: Record<BloomLevel, { bg: string; text: string; border: string }> = {
    remember: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    understand: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    apply: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    analyze: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
    evaluate: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
    create: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
};

// Bloom's Taxonomy XP values (higher order = more XP)
export const BLOOM_LEVEL_XP: Record<BloomLevel, number> = {
    remember: 10,
    understand: 15,
    apply: 20,
    analyze: 25,
    evaluate: 30,
    create: 40,
};
