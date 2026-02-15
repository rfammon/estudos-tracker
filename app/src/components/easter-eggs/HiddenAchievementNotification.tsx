import { useEffect, useState, useCallback } from 'react';
import { useHiddenAchievementsStore } from '../../store/use-hidden-achievements-store';
import { HiddenAchievement, RARITY_COLORS, RARITY_GLOW } from '../../types/hidden-achievements';
import { ConfettiEffect } from './ConfettiEffect';

interface HiddenAchievementNotificationProps {
    autoHideDuration?: number;
}

/**
 * HiddenAchievementNotification component
 * Displays special notifications when hidden achievements are discovered
 * 
 * Features:
 * - Animated entrance with glow effect
 * - Rarity-based styling
 * - Confetti effect
 * - Sound effect (optional)
 * - Auto-hide with progress bar
 */
export function HiddenAchievementNotification({
    autoHideDuration = 5000,
}: HiddenAchievementNotificationProps) {
    const notifications = useHiddenAchievementsStore((state) => state.notifications);
    const removeNotification = useHiddenAchievementsStore((state) => state.removeNotification);

    const [currentNotification, setCurrentNotification] = useState<HiddenAchievement | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [progress, setProgress] = useState(100);
    const [isVisible, setIsVisible] = useState(false);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        const timeoutId = setTimeout(() => {
            setCurrentNotification((current) => {
                if (current) {
                    removeNotification(current.id);
                }
                return null;
            });
            setShowConfetti(false);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [removeNotification]);

    // Process notifications queue
    useEffect(() => {
        const activeNotification = notifications.find((n) => n.show);
        if (activeNotification && !currentNotification) {
            setCurrentNotification(activeNotification.achievement);
            setShowConfetti(true);
            setIsVisible(true);
            setProgress(100);

            // Play sound effect
            playAchievementSound();

            // Announce to screen readers
            announceToScreenReader(
                `Conquista oculta desbloqueada: ${activeNotification.achievement.name}. ${activeNotification.achievement.description}`
            );
        }
    }, [notifications, currentNotification]);

    // Auto-hide timer
    useEffect(() => {
        if (!currentNotification) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const newProgress = prev - (100 / (autoHideDuration / 100));
                if (newProgress <= 0) {
                    handleClose();
                    return 0;
                }
                return newProgress;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [currentNotification, autoHideDuration, handleClose]);

    if (!currentNotification) return null;

    const rarityColor = RARITY_COLORS[currentNotification.rarity];
    const rarityGlow = RARITY_GLOW[currentNotification.rarity];

    return (
        <>
            {/* Confetti effect */}
            {showConfetti && (
                <ConfettiEffect
                    duration={3000}
                    particleCount={50}
                    onComplete={() => setShowConfetti(false)}
                />
            )}

            {/* Notification */}
            <div
                className={`fixed top-4 right-4 z-50 max-w-sm transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                    }`}
                role="alert"
                aria-live="assertive"
            >
                <div
                    className="relative bg-gray-900/95 backdrop-blur-lg rounded-2xl overflow-hidden border-2"
                    style={{
                        borderColor: rarityColor,
                        boxShadow: rarityGlow,
                    }}
                >
                    {/* Animated border glow */}
                    <div
                        className="absolute inset-0 animate-pulse opacity-30"
                        style={{
                            background: `linear-gradient(45deg, transparent, ${rarityColor}, transparent)`,
                        }}
                    />

                    {/* Content */}
                    <div className="relative p-4">
                        {/* Header */}
                        <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div
                                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                style={{
                                    backgroundColor: `${rarityColor}20`,
                                    boxShadow: `0 0 20px ${rarityColor}40`,
                                }}
                            >
                                {currentNotification.icon}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-xs font-semibold uppercase tracking-wider"
                                        style={{ color: rarityColor }}
                                    >
                                        {currentNotification.rarity === 'legendary' && '🌟 LENDÁRIA'}
                                        {currentNotification.rarity === 'epic' && '💜 ÉPICA'}
                                        {currentNotification.rarity === 'rare' && '💙 RARA'}
                                        {currentNotification.rarity === 'common' && '⭐ COMUM'}
                                    </span>
                                    <span className="text-xs text-gray-500">Conquista Oculta</span>
                                </div>

                                <h3 className="text-lg font-bold text-white mt-1">
                                    {currentNotification.name}
                                </h3>

                                <p className="text-sm text-gray-400 mt-1">
                                    {currentNotification.description}
                                </p>

                                {/* XP Reward */}
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-yellow-400 font-bold">
                                        +{currentNotification.xpReward} XP
                                    </span>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="flex-shrink-0 text-gray-500 hover:text-white transition-colors"
                                aria-label="Fechar notificação"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-100"
                                style={{
                                    width: `${progress}%`,
                                    backgroundColor: rarityColor,
                                }}
                            />
                        </div>
                    </div>

                    {/* Sparkle effects for legendary */}
                    {currentNotification.rarity === 'legendary' && (
                        <>
                            <div className="absolute top-2 left-2 animate-ping">
                                <span className="text-yellow-400 text-xs">✨</span>
                            </div>
                            <div className="absolute bottom-2 right-2 animate-ping" style={{ animationDelay: '0.5s' }}>
                                <span className="text-yellow-400 text-xs">✨</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

/**
 * Play achievement sound effect
 */
function playAchievementSound() {
    try {
        // Create a simple achievement sound using Web Audio API
        const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

        // Create oscillator for the main tone
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Configure the sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
        // Audio not supported or blocked
    }
}

/**
 * Announce to screen readers
 */
function announceToScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Hook to check for new hidden achievement notifications
 */
export function useHiddenAchievementNotifications() {
    const notifications = useHiddenAchievementsStore((state) => state.notifications);
    const discoveredAchievements = useHiddenAchievementsStore((state) => state.getDiscoveredAchievements());

    return {
        hasNotifications: notifications.length > 0,
        notificationCount: notifications.length,
        discoveredCount: discoveredAchievements.length,
        latestNotification: notifications[notifications.length - 1]?.achievement || null,
    };
}

export default HiddenAchievementNotification;
