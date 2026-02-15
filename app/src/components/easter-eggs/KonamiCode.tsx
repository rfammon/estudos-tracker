import { useEffect, useCallback } from 'react';
import { useHiddenAchievementsStore } from '../../store/use-hidden-achievements-store';

interface KonamiCodeProps {
    onActivated?: () => void;
}

/**
 * KonamiCode component - Detects the Konami code sequence
 * ↑↑↓↓←→←→BA
 * 
 * This component listens for keyboard events and triggers
 * the hidden achievement when the sequence is completed.
 */
export function KonamiCode({ onActivated }: KonamiCodeProps) {
    const handleKonamiKey = useHiddenAchievementsStore((state) => state.handleKonamiKey);
    const konamiProgress = useHiddenAchievementsStore((state) => state.konamiProgress);

    // Konami code sequence for reference
    const KONAMI_CODE = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const key = event.code;

            // Only listen for arrow keys, B, and A
            const validKeys = [
                'ArrowUp',
                'ArrowDown',
                'ArrowLeft',
                'ArrowRight',
                'KeyB',
                'KeyA',
            ];

            if (!validKeys.includes(key)) return;

            const activated = handleKonamiKey(key);

            if (activated && onActivated) {
                onActivated();
            }
        },
        [handleKonamiKey, onActivated]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    // Calculate progress percentage
    const progress = (konamiProgress.length / KONAMI_CODE.length) * 100;

    // Show subtle visual hint when user is on the right track
    const showProgress = konamiProgress.length > 0 && konamiProgress.length < KONAMI_CODE.length;

    if (!showProgress) return null;

    return (
        <div
            className="fixed top-4 right-4 z-50 pointer-events-none"
            role="status"
            aria-live="polite"
            aria-label="Konami code progress"
        >
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-2 border border-purple-500/30">
                <div className="flex items-center gap-2">
                    <span className="text-purple-400 text-sm">🎮</span>
                    <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-500 transition-all duration-200"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Hook to use Konami code detection
 * Returns the current progress and whether it's been activated
 */
export function useKonamiCode() {
    const konamiProgress = useHiddenAchievementsStore((state) => state.konamiProgress);
    const achievements = useHiddenAchievementsStore((state) => state.achievements);

    const KONAMI_CODE = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';
    const konamiAchievement = achievements.find((a) => a.id === 'konami-code');

    return {
        progress: konamiProgress.length,
        total: KONAMI_CODE.length,
        percentage: (konamiProgress.length / KONAMI_CODE.length) * 100,
        isActivated: konamiAchievement?.discovered ?? false,
        isInProgress: konamiProgress.length > 0 && konamiProgress.length < KONAMI_CODE.length,
    };
}

export default KonamiCode;
