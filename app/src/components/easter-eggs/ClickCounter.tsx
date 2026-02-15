import { useState, useCallback } from 'react';
import { useHiddenAchievementsStore } from '../../store/use-hidden-achievements-store';

interface ClickCounterProps {
    children: React.ReactNode;
    onClick?: () => void;
}

/**
 * ClickCounter component - Wraps an element and counts clicks
 * Triggers hidden achievements at specific click milestones
 * 
 * Milestones:
 * - 10 clicks: "Curioso" (50 XP)
 * - 50 clicks: "Muito Curioso" (100 XP)
 * - 100 clicks: "Obsessivo" (200 XP)
 */
export function ClickCounter({ children, onClick }: ClickCounterProps) {
    const [showRipple, setShowRipple] = useState(false);
    const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

    const handleLogoClick = useHiddenAchievementsStore((state) => state.handleLogoClick);
    const logoClickCount = useHiddenAchievementsStore((state) => state.logoClickCount);

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            // Create ripple effect
            const rect = event.currentTarget.getBoundingClientRect();
            setRipplePosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
            setShowRipple(true);

            setTimeout(() => setShowRipple(false), 500);

            // Handle the click for achievements
            handleLogoClick();

            // Call original onClick if provided
            if (onClick) {
                onClick();
            }
        },
        [handleLogoClick, onClick]
    );

    // Show hint at certain milestones
    const showHint = logoClickCount > 0 && logoClickCount < 10 && logoClickCount % 3 === 0;
    const showProgress = logoClickCount >= 10 && logoClickCount < 100;

    // Get next milestone
    const getNextMilestone = () => {
        if (logoClickCount < 10) return { target: 10, name: 'Curioso' };
        if (logoClickCount < 50) return { target: 50, name: 'Muito Curioso' };
        if (logoClickCount < 100) return { target: 100, name: 'Obsessivo' };
        return null;
    };

    const nextMilestone = getNextMilestone();

    return (
        <div
            className="relative cursor-pointer select-none"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label={`Click counter: ${logoClickCount} clicks`}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
            }}
        >
            {children}

            {/* Ripple effect */}
            {showRipple && (
                <span
                    className="absolute pointer-events-none animate-ping rounded-full bg-white/30"
                    style={{
                        left: ripplePosition.x - 10,
                        top: ripplePosition.y - 10,
                        width: 20,
                        height: 20,
                    }}
                />
            )}

            {/* Hint for first-time clickers */}
            {showHint && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs text-gray-400 animate-pulse">
                        🤔 Continua clicando...
                    </span>
                </div>
            )}

            {/* Progress indicator */}
            {showProgress && nextMilestone && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>🎯</span>
                        <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-200"
                                style={{
                                    width: `${((logoClickCount % (nextMilestone.target === 50 ? 40 : 50)) / (nextMilestone.target === 50 ? 40 : 50)) * 100}%`,
                                }}
                            />
                        </div>
                        <span>{logoClickCount}/{nextMilestone.target}</span>
                    </div>
                </div>
            )}

            {/* Celebration at milestones */}
            {logoClickCount === 100 && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 animate-pulse bg-yellow-500/20 rounded-lg" />
                </div>
            )}
        </div>
    );
}

/**
 * Hook to use click counter state
 */
export function useClickCounter() {
    const logoClickCount = useHiddenAchievementsStore((state) => state.logoClickCount);
    const achievements = useHiddenAchievementsStore((state) => state.achievements);

    const curiousAchievement = achievements.find((a) => a.id === 'curious-clicker');
    const veryCuriousAchievement = achievements.find((a) => a.id === 'very-curious');
    const obsessiveAchievement = achievements.find((a) => a.id === 'obsessive-clicker');

    return {
        clickCount: logoClickCount,
        milestones: {
            curious: {
                target: 10,
                achieved: curiousAchievement?.discovered ?? false,
            },
            veryCurious: {
                target: 50,
                achieved: veryCuriousAchievement?.discovered ?? false,
            },
            obsessive: {
                target: 100,
                achieved: obsessiveAchievement?.discovered ?? false,
            },
        },
        progress: Math.min(logoClickCount / 100, 1) * 100,
    };
}

export default ClickCounter;
