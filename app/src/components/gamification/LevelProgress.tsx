import { useGamificationStore, LEVELS, Level } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, Crown } from 'lucide-react';
import { LiveRegion } from '@/components/accessibility';
import { useEffect, useState, useRef } from 'react';

interface LevelProgressProps {
    /**
     * Whether to announce level changes to screen readers
     */
    announceChanges?: boolean;
}

export function LevelProgress({ announceChanges = true }: LevelProgressProps) {
    const {
        totalPoints,
        getCurrentLevel,
        getPointsToNextLevel,
        getProgressToNextLevel,
        currentStreak,
        bestStreak,
        totalSessions
    } = useGamificationStore();

    const currentLevel = getCurrentLevel();
    const pointsToNext = getPointsToNextLevel();
    const progressPercent = getProgressToNextLevel();

    // Track level changes for announcements
    const [announcement, setAnnouncement] = useState('');
    const previousLevelRef = useRef(currentLevel.number);

    // Announce level changes
    useEffect(() => {
        if (announceChanges && previousLevelRef.current !== currentLevel.number) {
            if (currentLevel.number > previousLevelRef.current) {
                setAnnouncement(`Parabéns! Você subiu para o nível ${currentLevel.number}: ${currentLevel.name}!`);
            }
            previousLevelRef.current = currentLevel.number;

            // Clear announcement after 5 seconds
            const timer = setTimeout(() => setAnnouncement(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [currentLevel.number, currentLevel.name, announceChanges]);

    const getLevelIcon = (level: Level) => {
        if (level.number >= 10) return <Crown className="h-6 w-6" aria-hidden="true" />;
        if (level.number >= 7) return <Trophy className="h-6 w-6" aria-hidden="true" />;
        return <Star className="h-6 w-6" aria-hidden="true" />;
    };

    const getLevelIconLabel = (level: Level) => {
        if (level.number >= 10) return 'Ícone de coroa - nível mestre';
        if (level.number >= 7) return 'Ícone de troféu - nível avançado';
        return 'Ícone de estrela - nível em progresso';
    };

    return (
        <>
            <Card
                className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200"
                role="region"
                aria-label="Progresso de nível"
            >
                <CardHeader className="pb-2">
                    <CardTitle
                        className="text-lg flex items-center gap-2 text-violet-800"
                    >
                        <span role="img" aria-label={getLevelIconLabel(currentLevel)}>
                            {getLevelIcon(currentLevel)}
                        </span>
                        <span>
                            Nível {currentLevel.number}: {currentLevel.name}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Progress to next level */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-violet-700" id="progress-label">
                                Progresso até próximo nível
                            </span>
                            <span
                                className="font-medium text-violet-800"
                                aria-label={
                                    currentLevel.number < LEVELS.length
                                        ? `${pointsToNext} pontos restantes`
                                        : 'Nível máximo alcançado'
                                }
                            >
                                {currentLevel.number < LEVELS.length ? `${pointsToNext} pts` : 'Nível máximo!'}
                            </span>
                        </div>
                        <Progress
                            value={progressPercent}
                            className="h-3 bg-violet-200"
                            indicatorClassName="bg-gradient-to-r from-violet-500 to-purple-500"
                            label="Progresso até próximo nível"
                            aria-labelledby="progress-label"
                        />
                    </div>

                    {/* Stats grid */}
                    <div
                        className="grid grid-cols-3 gap-4 pt-2 border-t border-violet-200"
                        role="list"
                        aria-label="Estatísticas do jogador"
                    >
                        <div
                            className="text-center"
                            role="listitem"
                        >
                            <div
                                className="text-2xl font-bold text-violet-700"
                                aria-label={`${totalPoints} pontos totais`}
                            >
                                {totalPoints}
                            </div>
                            <div className="text-xs text-violet-600">Pontos</div>
                        </div>
                        <div
                            className="text-center"
                            role="listitem"
                        >
                            <div
                                className="text-2xl font-bold text-orange-600"
                                aria-label={`${currentStreak} dias consecutivos`}
                            >
                                {currentStreak}
                            </div>
                            <div className="text-xs text-orange-600">
                                Dias <span aria-hidden="true">🔥</span>
                                <span className="sr-only">consecutivos</span>
                            </div>
                        </div>
                        <div
                            className="text-center"
                            role="listitem"
                        >
                            <div
                                className="text-2xl font-bold text-amber-600"
                                aria-label={`${bestStreak} dias de recorde`}
                            >
                                {bestStreak}
                            </div>
                            <div className="text-xs text-amber-600">Recorde</div>
                        </div>
                    </div>

                    {/* Total sessions */}
                    <div
                        className="text-center text-xs text-violet-600"
                        aria-label={`${totalSessions} sessões de estudo completadas`}
                    >
                        {totalSessions} sessões completadas
                    </div>
                </CardContent>
            </Card>

            {/* Live region for level change announcements */}
            {announceChanges && (
                <LiveRegion
                    message={announcement}
                    aria-live="assertive"
                    clearAfter={5000}
                />
            )}
        </>
    );
}

/**
 * LevelProgressCompact component for smaller displays
 */
interface LevelProgressCompactProps {
    onClick?: () => void;
}

export function LevelProgressCompact({ onClick }: LevelProgressCompactProps) {
    const { getCurrentLevel, getProgressToNextLevel, totalPoints } = useGamificationStore();
    const currentLevel = getCurrentLevel();
    const progressPercent = getProgressToNextLevel();

    return (
        <button
            className="flex items-center gap-3 p-2 rounded-lg bg-violet-100 hover:bg-violet-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={onClick}
            aria-label={`Nível ${currentLevel.number}: ${currentLevel.name}. ${totalPoints} pontos. ${progressPercent}% para o próximo nível.`}
        >
            <div className="text-2xl" aria-hidden="true">
                {currentLevel.number >= 10 ? '👑' : currentLevel.number >= 7 ? '🏆' : '⭐'}
            </div>
            <div className="flex-1">
                <div className="text-sm font-medium text-violet-800">
                    Nv. {currentLevel.number}
                </div>
                <div
                    className="h-1.5 bg-violet-200 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${progressPercent}% para o próximo nível`}
                >
                    <div
                        className="h-full bg-violet-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>
            <div className="text-xs font-medium text-violet-600">
                {totalPoints} pts
            </div>
        </button>
    );
}
