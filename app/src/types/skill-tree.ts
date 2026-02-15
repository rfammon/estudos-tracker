// Skill Tree Types for Estudos Tracker

/**
 * Categories of skills in the skill tree
 */
export type SkillCategory = 'fundamentos' | 'tecnicas' | 'avancado' | 'especializacao';

/**
 * Labels for skill categories
 */
export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
    fundamentos: 'Fundamentos',
    tecnicas: 'Técnicas',
    avancado: 'Avançado',
    especializacao: 'Especialização',
};

/**
 * Colors for skill categories
 */
export const SKILL_CATEGORY_COLORS: Record<SkillCategory, string> = {
    fundamentos: '#22C55E', // Green
    tecnicas: '#3B82F6',    // Blue
    avancado: '#8B5CF6',    // Purple
    especializacao: '#F59E0B', // Amber
};

/**
 * Represents a single node in the skill tree
 */
export interface SkillNode {
    /** Unique identifier for the node */
    id: string;
    /** Display name of the skill */
    name: string;
    /** Detailed description of the skill */
    description: string;
    /** Emoji or icon identifier */
    icon: string;
    /** Category of the skill */
    category: SkillCategory;
    /** Current level of the skill (0 = not started) */
    level: number;
    /** Maximum level for this skill */
    maxLevel: number;
    /** XP cost for each level (array index = level - 1) */
    xpCost: number[];
    /** IDs of prerequisite skills */
    prerequisites: string[];
    /** Whether the skill is unlocked (prerequisites met) */
    unlocked: boolean;
    /** Whether the skill is fully completed (max level reached) */
    completed: boolean;
    /** Progress percentage (0-100) */
    progress: number;
    /** IDs of child skills (skills that depend on this one) */
    children: string[];
    /** Related topic IDs for study integration */
    relatedTopics?: string[];
    /** Related learning objective IDs */
    relatedObjectives?: string[];
    /** XP bonus when completed */
    xpBonus: number;
    /** Position in the tree for visualization */
    position?: {
        x: number;
        y: number;
    };
}

/**
 * Represents a complete skill tree
 */
export interface SkillTree {
    /** Unique identifier for the tree */
    id: string;
    /** Display name of the skill tree */
    name: string;
    /** Detailed description of the skill tree */
    description: string;
    /** Emoji or icon identifier for the tree */
    icon: string;
    /** All nodes in this skill tree */
    nodes: SkillNode[];
    /** Total number of nodes in the tree */
    totalNodes: number;
    /** Number of completed nodes */
    completedNodes: number;
    /** Color theme for the tree */
    color: string;
    /** Related subject/category */
    subject: string;
}

/**
 * State for a skill tree including user progress
 */
export interface SkillTreeState {
    /** All skill trees */
    trees: SkillTree[];
    /** Currently selected tree ID */
    selectedTreeId: string | null;
    /** Currently selected node ID */
    selectedNodeId: string | null;
    /** Total XP spent on skills */
    totalXpSpent: number;
    /** Total skills completed */
    totalSkillsCompleted: number;
    /** Achievement IDs unlocked through skill trees */
    unlockedSkillAchievements: string[];
}

/**
 * Achievement specifically for skill tree progress
 */
export interface SkillTreeAchievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    /** Tree ID this achievement belongs to */
    treeId: string;
    /** Type of achievement */
    type: 'branch_complete' | 'tree_complete' | 'all_trees' | 'specialization';
    /** Requirement value (e.g., number of nodes) */
    requirement: number;
    /** XP bonus for unlocking */
    xpBonus: number;
    /** Whether unlocked */
    unlocked: boolean;
    /** When unlocked */
    unlockedAt?: string;
}

/**
 * Default skill tree data for initialization
 */
export interface DefaultSkillTreeData {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    subject: string;
    nodes: Omit<SkillNode, 'unlocked' | 'completed' | 'progress' | 'level' | 'children'>[];
}

/**
 * Props for skill node component
 */
export interface SkillNodeProps {
    node: SkillNode;
    isSelected: boolean;
    isAccessible: boolean;
    onSelect: (nodeId: string) => void;
    onUnlock: (nodeId: string) => void;
}

/**
 * Props for skill tree view component
 */
export interface SkillTreeViewProps {
    tree: SkillTree;
    selectedNodeId: string | null;
    onSelectNode: (nodeId: string | null) => void;
    onUnlockNode: (nodeId: string) => void;
    userXp: number;
}

/**
 * Props for skill tree progress component
 */
export interface SkillTreeProgressProps {
    tree: SkillTree;
    showDetails?: boolean;
}

/**
 * Props for skill tree category component
 */
export interface SkillTreeCategoryProps {
    category: SkillCategory;
    nodes: SkillNode[];
    onSelectNode: (nodeId: string) => void;
    selectedNodeId: string | null;
}

/**
 * Props for skill node details component
 */
export interface SkillNodeDetailsProps {
    node: SkillNode;
    tree: SkillTree;
    userXp: number;
    onClose: () => void;
    onUnlock: (nodeId: string) => void;
    onLevelUp: (nodeId: string) => void;
}
