import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
    SkillTree,
    SkillNode,
    SkillCategory,
    SkillTreeAchievement,
} from '@/types/skill-tree';

// Default skill trees data based on PETROBRAS plan
const createDefaultSkillTrees = (): SkillTree[] => {
    const trees: SkillTree[] = [
        {
            id: 'portugues-concursos',
            name: 'Português para Concursos',
            description: 'Domine a língua portuguesa para provas de concursos públicos',
            icon: '📝',
            color: '#3B82F6',
            subject: 'Português',
            nodes: [],
            totalNodes: 0,
            completedNodes: 0,
        },
        {
            id: 'meio-ambiente',
            name: 'Meio Ambiente',
            description: 'Conhecimentos ambientais para concursos e atuação profissional',
            icon: '🌿',
            color: '#22C55E',
            subject: 'Meio Ambiente',
            nodes: [],
            totalNodes: 0,
            completedNodes: 0,
        },
        {
            id: 'seguranca',
            name: 'Segurança',
            description: 'Normas e práticas de segurança do trabalho',
            icon: '🛡️',
            color: '#EF4444',
            subject: 'Segurança',
            nodes: [],
            totalNodes: 0,
            completedNodes: 0,
        },
    ];

    // Add nodes to each tree
    trees[0].nodes = createPortuguesNodes();
    trees[0].totalNodes = trees[0].nodes.length;

    trees[1].nodes = createMeioAmbienteNodes();
    trees[1].totalNodes = trees[1].nodes.length;

    trees[2].nodes = createSegurancaNodes();
    trees[2].totalNodes = trees[2].nodes.length;

    return trees;
};

const createPortuguesNodes = (): SkillNode[] => {
    const nodes: SkillNode[] = [
        // Fundamentos
        {
            id: 'port-gramatica-basica',
            name: 'Gramática Básica',
            description: 'Fundamentos da gramática portuguesa: classes de palavras, estrutura de orações',
            icon: '📖',
            category: 'fundamentos',
            level: 0,
            maxLevel: 3,
            xpCost: [50, 100, 150],
            prerequisites: [],
            unlocked: true,
            completed: false,
            progress: 0,
            children: ['port-analise-sintatica', 'port-concordancia'],
            xpBonus: 100,
        },
        {
            id: 'port-interpretacao',
            name: 'Interpretação de Textos',
            description: 'Técnicas de leitura e compreensão textual, identificação de ideias principais',
            icon: '🔍',
            category: 'fundamentos',
            level: 0,
            maxLevel: 3,
            xpCost: [50, 100, 150],
            prerequisites: [],
            unlocked: true,
            completed: false,
            progress: 0,
            children: ['port-figuras-linguagem', 'port-semantica'],
            xpBonus: 100,
        },
        // Técnicas
        {
            id: 'port-analise-sintatica',
            name: 'Análise Sintática',
            description: 'Sujeito, predicado, complementos, orações coordenadas e subordinadas',
            icon: '🔬',
            category: 'tecnicas',
            level: 0,
            maxLevel: 4,
            xpCost: [75, 125, 175, 225],
            prerequisites: ['port-gramatica-basica'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['port-questoes-cespe'],
            xpBonus: 150,
        },
        {
            id: 'port-concordancia',
            name: 'Concordância',
            description: 'Concordância verbal e nominal, casos especiais e exceções',
            icon: '🔗',
            category: 'tecnicas',
            level: 0,
            maxLevel: 4,
            xpCost: [75, 125, 175, 225],
            prerequisites: ['port-gramatica-basica'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['port-regencia'],
            xpBonus: 150,
        },
        {
            id: 'port-regencia',
            name: 'Regência',
            description: 'Regência verbal e nominal, crase e casos especiais',
            icon: '🎯',
            category: 'tecnicas',
            level: 0,
            maxLevel: 4,
            xpCost: [75, 125, 175, 225],
            prerequisites: ['port-concordancia'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['port-questoes-fcc'],
            xpBonus: 150,
        },
        // Avançado
        {
            id: 'port-figuras-linguagem',
            name: 'Figuras de Linguagem',
            description: 'Metáforas, metonímias, hipérboles e outras figuras de linguagem',
            icon: '🎭',
            category: 'avancado',
            level: 0,
            maxLevel: 3,
            xpCost: [100, 150, 200],
            prerequisites: ['port-interpretacao'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['port-semantica'],
            xpBonus: 200,
        },
        {
            id: 'port-semantica',
            name: 'Semântica',
            description: 'Significado das palavras, polissemia, homonímia, sinonímia e antonímia',
            icon: '💭',
            category: 'avancado',
            level: 0,
            maxLevel: 3,
            xpCost: [100, 150, 200],
            prerequisites: ['port-interpretacao', 'port-figuras-linguagem'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['port-questoes-cespe', 'port-questoes-fcc'],
            xpBonus: 200,
        },
        // Especialização
        {
            id: 'port-questoes-cespe',
            name: 'Questões CESPE',
            description: 'Técnicas específicas para resolver questões da CESPE/CEBRASPE',
            icon: '🏆',
            category: 'especializacao',
            level: 0,
            maxLevel: 5,
            xpCost: [150, 200, 250, 300, 350],
            prerequisites: ['port-analise-sintatica', 'port-semantica'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: [],
            xpBonus: 500,
        },
        {
            id: 'port-questoes-fcc',
            name: 'Questões FCC',
            description: 'Técnicas específicas para resolver questões da FCC',
            icon: '🏅',
            category: 'especializacao',
            level: 0,
            maxLevel: 5,
            xpCost: [150, 200, 250, 300, 350],
            prerequisites: ['port-regencia', 'port-semantica'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: [],
            xpBonus: 500,
        },
    ];

    return nodes;
};

const createMeioAmbienteNodes = (): SkillNode[] => {
    const nodes: SkillNode[] = [
        // Fundamentos
        {
            id: 'ma-legislacao',
            name: 'Legislação Ambiental',
            description: 'Principais leis ambientais: Política Nacional do Meio Ambiente, CONAMA',
            icon: '⚖️',
            category: 'fundamentos',
            level: 0,
            maxLevel: 3,
            xpCost: [50, 100, 150],
            prerequisites: [],
            unlocked: true,
            completed: false,
            progress: 0,
            children: ['ma-licenciamento', 'ma-areas-protegidas'],
            xpBonus: 100,
        },
        {
            id: 'ma-eia-rima',
            name: 'EIA/RIMA',
            description: 'Estudo de Impacto Ambiental e Relatório de Impacto Ambiental',
            icon: '📊',
            category: 'fundamentos',
            level: 0,
            maxLevel: 3,
            xpCost: [50, 100, 150],
            prerequisites: [],
            unlocked: true,
            completed: false,
            progress: 0,
            children: ['ma-licenciamento', 'ma-gestao-ambiental'],
            xpBonus: 100,
        },
        // Técnicas
        {
            id: 'ma-licenciamento',
            name: 'Licenciamento Ambiental',
            description: 'Processo de licenciamento, tipos de licenças, etapas e prazos',
            icon: '📋',
            category: 'tecnicas',
            level: 0,
            maxLevel: 4,
            xpCost: [75, 125, 175, 225],
            prerequisites: ['ma-legislacao', 'ma-eia-rima'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['ma-auditoria'],
            xpBonus: 150,
        },
        {
            id: 'ma-areas-protegidas',
            name: 'Áreas Protegidas',
            description: 'Unidades de Conservação, APPs, Reservas Legais',
            icon: '🌳',
            category: 'tecnicas',
            level: 0,
            maxLevel: 4,
            xpCost: [75, 125, 175, 225],
            prerequisites: ['ma-legislacao'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['ma-gestao-ambiental'],
            xpBonus: 150,
        },
        // Avançado
        {
            id: 'ma-gestao-ambiental',
            name: 'Gestão Ambiental',
            description: 'Sistemas de gestão ambiental, ISO 14001, sustentabilidade',
            icon: '🔄',
            category: 'avancado',
            level: 0,
            maxLevel: 3,
            xpCost: [100, 150, 200],
            prerequisites: ['ma-areas-protegidas', 'ma-eia-rima'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['ma-petrobras-ambiental'],
            xpBonus: 200,
        },
        {
            id: 'ma-auditoria',
            name: 'Auditoria Ambiental',
            description: 'Processos de auditoria, conformidade, relatórios',
            icon: '🔎',
            category: 'avancado',
            level: 0,
            maxLevel: 3,
            xpCost: [100, 150, 200],
            prerequisites: ['ma-licenciamento'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['ma-petrobras-ambiental'],
            xpBonus: 200,
        },
        // Especialização
        {
            id: 'ma-petrobras-ambiental',
            name: 'PETROBRAS Ambiental',
            description: 'Políticas ambientais específicas da PETROBRAS, práticas e procedimentos',
            icon: '🛢️',
            category: 'especializacao',
            level: 0,
            maxLevel: 5,
            xpCost: [150, 200, 250, 300, 350],
            prerequisites: ['ma-gestao-ambiental', 'ma-auditoria'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: [],
            xpBonus: 500,
        },
    ];

    return nodes;
};

const createSegurancaNodes = (): SkillNode[] => {
    const nodes: SkillNode[] = [
        // Fundamentos
        {
            id: 'seg-nrs-basicas',
            name: 'NRs Básicas',
            description: 'Normas Regulamentadoras fundamentais: NR-1, NR-5, NR-7, NR-9',
            icon: '📕',
            category: 'fundamentos',
            level: 0,
            maxLevel: 3,
            xpCost: [50, 100, 150],
            prerequisites: [],
            unlocked: true,
            completed: false,
            progress: 0,
            children: ['seg-epi-epc', 'seg-analise-riscos'],
            xpBonus: 100,
        },
        {
            id: 'seg-sipat',
            name: 'SIPAT',
            description: 'Semana Interna de Prevenção de Acidentes do Trabalho',
            icon: '📢',
            category: 'fundamentos',
            level: 0,
            maxLevel: 3,
            xpCost: [50, 100, 150],
            prerequisites: [],
            unlocked: true,
            completed: false,
            progress: 0,
            children: ['seg-gestao-seguranca'],
            xpBonus: 100,
        },
        // Técnicas
        {
            id: 'seg-epi-epc',
            name: 'EPI/EPC',
            description: 'Equipamentos de Proteção Individual e Coletiva, seleção e uso',
            icon: '⛑️',
            category: 'tecnicas',
            level: 0,
            maxLevel: 4,
            xpCost: [75, 125, 175, 225],
            prerequisites: ['seg-nrs-basicas'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['seg-gestao-seguranca'],
            xpBonus: 150,
        },
        {
            id: 'seg-analise-riscos',
            name: 'Análise de Riscos',
            description: 'Identificação, avaliação e controle de riscos ocupacionais',
            icon: '⚠️',
            category: 'tecnicas',
            level: 0,
            maxLevel: 4,
            xpCost: [75, 125, 175, 225],
            prerequisites: ['seg-nrs-basicas'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['seg-investigacao'],
            xpBonus: 150,
        },
        // Avançado
        {
            id: 'seg-gestao-seguranca',
            name: 'Gestão de Segurança',
            description: 'Sistema de gestão de segurança, indicadores, cultura de segurança',
            icon: '📈',
            category: 'avancado',
            level: 0,
            maxLevel: 3,
            xpCost: [100, 150, 200],
            prerequisites: ['seg-epi-epc', 'seg-sipat'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['seg-petrobras-seguranca'],
            xpBonus: 200,
        },
        {
            id: 'seg-investigacao',
            name: 'Investigação de Acidentes',
            description: 'Metodologias de investigação, análise de causa raiz, relatórios',
            icon: '🔍',
            category: 'avancado',
            level: 0,
            maxLevel: 3,
            xpCost: [100, 150, 200],
            prerequisites: ['seg-analise-riscos'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: ['seg-petrobras-seguranca'],
            xpBonus: 200,
        },
        // Especialização
        {
            id: 'seg-petrobras-seguranca',
            name: 'Segurança PETROBRAS',
            description: 'Normas e procedimentos de segurança específicos da PETROBRAS',
            icon: '🛢️',
            category: 'especializacao',
            level: 0,
            maxLevel: 5,
            xpCost: [150, 200, 250, 300, 350],
            prerequisites: ['seg-gestao-seguranca', 'seg-investigacao'],
            unlocked: false,
            completed: false,
            progress: 0,
            children: [],
            xpBonus: 500,
        },
    ];

    return nodes;
};

// Skill Tree Achievements
const SKILL_TREE_ACHIEVEMENTS: SkillTreeAchievement[] = [
    // Portuguese Tree
    {
        id: 'port-fundamentos-complete',
        name: 'Fundamentos da Língua',
        description: 'Complete todos os fundamentos de Português',
        icon: '📚',
        treeId: 'portugues-concursos',
        type: 'branch_complete',
        requirement: 2,
        xpBonus: 200,
        unlocked: false,
    },
    {
        id: 'port-tree-complete',
        name: 'Mestre do Português',
        description: 'Complete toda a árvore de Português',
        icon: '🎓',
        treeId: 'portugues-concursos',
        type: 'tree_complete',
        requirement: 9,
        xpBonus: 1000,
        unlocked: false,
    },
    // Environment Tree
    {
        id: 'ma-fundamentos-complete',
        name: 'Ambientalista Iniciante',
        description: 'Complete todos os fundamentos de Meio Ambiente',
        icon: '🌱',
        treeId: 'meio-ambiente',
        type: 'branch_complete',
        requirement: 2,
        xpBonus: 200,
        unlocked: false,
    },
    {
        id: 'ma-tree-complete',
        name: 'Especialista Ambiental',
        description: 'Complete toda a árvore de Meio Ambiente',
        icon: '🌿',
        treeId: 'meio-ambiente',
        type: 'tree_complete',
        requirement: 7,
        xpBonus: 1000,
        unlocked: false,
    },
    // Security Tree
    {
        id: 'seg-fundamentos-complete',
        name: 'Guardião da Segurança',
        description: 'Complete todos os fundamentos de Segurança',
        icon: '🛡️',
        treeId: 'seguranca',
        type: 'branch_complete',
        requirement: 2,
        xpBonus: 200,
        unlocked: false,
    },
    {
        id: 'seg-tree-complete',
        name: 'Mestre da Segurança',
        description: 'Complete toda a árvore de Segurança',
        icon: '🏆',
        treeId: 'seguranca',
        type: 'tree_complete',
        requirement: 7,
        xpBonus: 1000,
        unlocked: false,
    },
    // All Trees
    {
        id: 'all-trees-complete',
        name: 'Concurseiro Elite',
        description: 'Complete todas as árvores de habilidades',
        icon: '👑',
        treeId: 'all',
        type: 'all_trees',
        requirement: 23,
        xpBonus: 5000,
        unlocked: false,
    },
    // Specializations
    {
        id: 'all-specializations',
        name: 'Especialista PETROBRAS',
        description: 'Complete todas as especializações PETROBRAS',
        icon: '⭐',
        treeId: 'all',
        type: 'specialization',
        requirement: 3,
        xpBonus: 2000,
        unlocked: false,
    },
];

interface SkillTreeStore {
    // State
    trees: SkillTree[];
    selectedTreeId: string | null;
    selectedNodeId: string | null;
    totalXpSpent: number;
    totalSkillsCompleted: number;
    achievements: SkillTreeAchievement[];

    // Actions
    initializeTrees: () => void;
    selectTree: (treeId: string | null) => void;
    selectNode: (nodeId: string | null) => void;
    unlockNode: (treeId: string, nodeId: string) => { success: boolean; message: string; xpSpent: number };
    levelUpNode: (treeId: string, nodeId: string) => { success: boolean; message: string; xpSpent: number; xpBonus: number };
    getTree: (treeId: string) => SkillTree | undefined;
    getNode: (treeId: string, nodeId: string) => SkillNode | undefined;
    getNodesByCategory: (treeId: string, category: SkillCategory) => SkillNode[];
    checkAchievements: () => SkillTreeAchievement[];
    getUnlockedAchievements: () => SkillTreeAchievement[];
    getLockedAchievements: () => SkillTreeAchievement[];
    getTreeProgress: (treeId: string) => { completed: number; total: number; percentage: number };
    getTotalProgress: () => { completed: number; total: number; percentage: number };
    resetSkillTrees: () => void;
}

export const useSkillTreeStore = create<SkillTreeStore>()(
    persist(
        (set, get) => ({
            trees: [],
            selectedTreeId: null,
            selectedNodeId: null,
            totalXpSpent: 0,
            totalSkillsCompleted: 0,
            achievements: SKILL_TREE_ACHIEVEMENTS,

            initializeTrees: () => {
                const { trees } = get();
                if (trees.length === 0) {
                    set({ trees: createDefaultSkillTrees() });
                }
            },

            selectTree: (treeId: string | null) => {
                set({ selectedTreeId: treeId, selectedNodeId: null });
            },

            selectNode: (nodeId: string | null) => {
                set({ selectedNodeId: nodeId });
            },

            unlockNode: (treeId: string, nodeId: string) => {
                const { trees } = get();
                const treeIndex = trees.findIndex(t => t.id === treeId);

                if (treeIndex === -1) {
                    return { success: false, message: 'Árvore não encontrada', xpSpent: 0 };
                }

                const tree = trees[treeIndex];
                const nodeIndex = tree.nodes.findIndex(n => n.id === nodeId);

                if (nodeIndex === -1) {
                    return { success: false, message: 'Nó não encontrado', xpSpent: 0 };
                }

                const node = tree.nodes[nodeIndex];

                if (node.unlocked) {
                    return { success: false, message: 'Skill já desbloqueada', xpSpent: 0 };
                }

                // Check prerequisites
                const allPrereqsMet = node.prerequisites.every(prereqId => {
                    const prereqNode = tree.nodes.find(n => n.id === prereqId);
                    return prereqNode && prereqNode.completed;
                });

                if (!allPrereqsMet) {
                    return { success: false, message: 'Pré-requisitos não atendidos', xpSpent: 0 };
                }

                // Unlock the node (no XP cost to unlock, only to level up)
                const updatedTrees = [...trees];
                updatedTrees[treeIndex] = {
                    ...tree,
                    nodes: tree.nodes.map(n =>
                        n.id === nodeId ? { ...n, unlocked: true } : n
                    ),
                };

                set({ trees: updatedTrees });
                return { success: true, message: 'Skill desbloqueada!', xpSpent: 0 };
            },

            levelUpNode: (treeId: string, nodeId: string) => {
                const { trees, totalXpSpent, totalSkillsCompleted } = get();
                const treeIndex = trees.findIndex(t => t.id === treeId);

                if (treeIndex === -1) {
                    return { success: false, message: 'Árvore não encontrada', xpSpent: 0, xpBonus: 0 };
                }

                const tree = trees[treeIndex];
                const nodeIndex = tree.nodes.findIndex(n => n.id === nodeId);

                if (nodeIndex === -1) {
                    return { success: false, message: 'Nó não encontrado', xpSpent: 0, xpBonus: 0 };
                }

                const node = tree.nodes[nodeIndex];

                if (!node.unlocked) {
                    return { success: false, message: 'Skill não está desbloqueada', xpSpent: 0, xpBonus: 0 };
                }

                if (node.completed) {
                    return { success: false, message: 'Skill já está completa', xpSpent: 0, xpBonus: 0 };
                }

                const xpCost = node.xpCost[node.level] || node.xpCost[node.xpCost.length - 1];
                const newLevel = node.level + 1;
                const isCompleted = newLevel >= node.maxLevel;
                const progress = (newLevel / node.maxLevel) * 100;
                const xpBonus = isCompleted ? node.xpBonus : 0;

                const updatedTrees = [...trees];
                const updatedNodes = tree.nodes.map(n =>
                    n.id === nodeId
                        ? {
                            ...n,
                            level: newLevel,
                            completed: isCompleted,
                            progress,
                        }
                        : n
                );

                // Update completed nodes count
                const completedNodes = updatedNodes.filter(n => n.completed).length;

                updatedTrees[treeIndex] = {
                    ...tree,
                    nodes: updatedNodes,
                    completedNodes,
                };

                // Unlock children if node is completed
                if (isCompleted) {
                    updatedTrees[treeIndex].nodes = updatedTrees[treeIndex].nodes.map(n => {
                        if (node.children.includes(n.id)) {
                            // Check if all prerequisites for this child are met
                            const allPrereqsMet = n.prerequisites.every(prereqId => {
                                const prereqNode = updatedTrees[treeIndex].nodes.find(pn => pn.id === prereqId);
                                return prereqNode && prereqNode.completed;
                            });
                            if (allPrereqsMet) {
                                return { ...n, unlocked: true };
                            }
                        }
                        return n;
                    });
                }

                set({
                    trees: updatedTrees,
                    totalXpSpent: totalXpSpent + xpCost,
                    totalSkillsCompleted: isCompleted ? totalSkillsCompleted + 1 : totalSkillsCompleted,
                });

                // Check achievements
                get().checkAchievements();

                return {
                    success: true,
                    message: isCompleted ? `Skill completa! +${xpBonus} XP bônus!` : `Nível ${newLevel} alcançado!`,
                    xpSpent: xpCost,
                    xpBonus,
                };
            },

            getTree: (treeId: string) => {
                return get().trees.find(t => t.id === treeId);
            },

            getNode: (treeId: string, nodeId: string) => {
                const tree = get().trees.find(t => t.id === treeId);
                return tree?.nodes.find(n => n.id === nodeId);
            },

            getNodesByCategory: (treeId: string, category: SkillCategory) => {
                const tree = get().trees.find(t => t.id === treeId);
                return tree?.nodes.filter(n => n.category === category) || [];
            },

            checkAchievements: () => {
                const { trees, achievements } = get();
                const newlyUnlocked: SkillTreeAchievement[] = [];

                const updatedAchievements = achievements.map(achievement => {
                    if (achievement.unlocked) return achievement;

                    let shouldUnlock = false;

                    if (achievement.type === 'branch_complete') {
                        const tree = trees.find(t => t.id === achievement.treeId);
                        if (tree) {
                            const fundamentalsNodes = tree.nodes.filter(n => n.category === 'fundamentos');
                            const completedFundamentals = fundamentalsNodes.filter(n => n.completed).length;
                            shouldUnlock = completedFundamentals >= achievement.requirement;
                        }
                    } else if (achievement.type === 'tree_complete') {
                        const tree = trees.find(t => t.id === achievement.treeId);
                        if (tree) {
                            shouldUnlock = tree.completedNodes >= achievement.requirement;
                        }
                    } else if (achievement.type === 'all_trees') {
                        const totalCompleted = trees.reduce((sum, t) => sum + t.completedNodes, 0);
                        shouldUnlock = totalCompleted >= achievement.requirement;
                    } else if (achievement.type === 'specialization') {
                        const specializationNodes = trees.flatMap(t =>
                            t.nodes.filter(n => n.category === 'especializacao' && n.completed)
                        );
                        shouldUnlock = specializationNodes.length >= achievement.requirement;
                    }

                    if (shouldUnlock) {
                        newlyUnlocked.push(achievement);
                        return { ...achievement, unlocked: true, unlockedAt: new Date().toISOString() };
                    }

                    return achievement;
                });

                if (newlyUnlocked.length > 0) {
                    set({ achievements: updatedAchievements });
                }

                return newlyUnlocked;
            },

            getUnlockedAchievements: () => {
                return get().achievements.filter(a => a.unlocked);
            },

            getLockedAchievements: () => {
                return get().achievements.filter(a => !a.unlocked);
            },

            getTreeProgress: (treeId: string) => {
                const tree = get().trees.find(t => t.id === treeId);
                if (!tree) {
                    return { completed: 0, total: 0, percentage: 0 };
                }
                return {
                    completed: tree.completedNodes,
                    total: tree.totalNodes,
                    percentage: Math.round((tree.completedNodes / tree.totalNodes) * 100),
                };
            },

            getTotalProgress: () => {
                const { trees } = get();
                const totalCompleted = trees.reduce((sum, t) => sum + t.completedNodes, 0);
                const totalNodes = trees.reduce((sum, t) => sum + t.totalNodes, 0);
                return {
                    completed: totalCompleted,
                    total: totalNodes,
                    percentage: totalNodes > 0 ? Math.round((totalCompleted / totalNodes) * 100) : 0,
                };
            },

            resetSkillTrees: () => {
                set({
                    trees: createDefaultSkillTrees(),
                    selectedTreeId: null,
                    selectedNodeId: null,
                    totalXpSpent: 0,
                    totalSkillsCompleted: 0,
                    achievements: SKILL_TREE_ACHIEVEMENTS,
                });
            },
        }),
        {
            name: 'estudos-tracker-skill-trees',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                trees: state.trees,
                totalXpSpent: state.totalXpSpent,
                totalSkillsCompleted: state.totalSkillsCompleted,
                achievements: state.achievements,
            }),
        }
    )
);

// Export default trees for external use
export { createDefaultSkillTrees };
