// Easter Eggs Components - Barrel Export
// Command Center Elite

export { KonamiCode, useKonamiCode } from './KonamiCode';
export { ClickCounter, useClickCounter } from './ClickCounter';
export { SecretPage } from './SecretPage';
export { HiddenAchievementNotification, useHiddenAchievementNotifications } from './HiddenAchievementNotification';
export { ConfettiEffect, ConfettiBurst, useConfetti } from './ConfettiEffect';

// Re-export types for convenience
export type {
    HiddenAchievement,
    HiddenAchievementTrigger,
    HiddenAchievementRarity,
    EasterEgg,
    HiddenAchievementNotification as HiddenAchievementNotificationType,
} from '../../types/hidden-achievements';

export {
    HIDDEN_ACHIEVEMENTS,
    EASTER_EGGS,
    RARITY_COLORS,
    RARITY_GLOW
} from '../../types/hidden-achievements';
