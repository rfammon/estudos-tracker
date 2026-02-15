import React, { useState, useEffect, useCallback } from 'react'
import { LeaderboardPeriod, LeaderboardCategory as LeaderboardCategoryType, CATEGORY_CONFIGS, PERIOD_CONFIGS } from '../../types/leaderboard'
import { useLeaderboardStore, CURRENT_USER_ID } from '../../store/use-leaderboard-store'
import { LeaderboardTabs } from './LeaderboardTabs'
import { LeaderboardCategory } from './LeaderboardCategory'
import { LeaderboardEntry } from './LeaderboardEntry'
import { LeaderboardUserCard } from './LeaderboardUserCard'

interface LeaderboardViewProps {
    initialPeriod?: LeaderboardPeriod
    initialCategory?: LeaderboardCategoryType
    showUserCard?: boolean
    maxEntries?: number
    compact?: boolean
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
    initialPeriod = 'weekly',
    initialCategory = 'xp',
    showUserCard = true,
    maxEntries = 10,
    compact = false
}) => {
    const [activePeriod, setActivePeriod] = useState<LeaderboardPeriod>(initialPeriod)
    const [activeCategory, setActiveCategory] = useState<LeaderboardCategoryType>(initialCategory)

    const {
        getLeaderboard,
        getCurrentUserEntry,
        checkAndResetPeriods
    } = useLeaderboardStore()

    // Check for period resets on mount
    useEffect(() => {
        checkAndResetPeriods()
    }, [checkAndResetPeriods])

    // Get leaderboard data
    const leaderboard = getLeaderboard(activePeriod, activeCategory)
    const currentUserEntry = getCurrentUserEntry(activePeriod, activeCategory)

    // Split entries for display
    const topThree = leaderboard.entries.slice(0, 3)
    const restEntries = leaderboard.entries.slice(3, maxEntries)

    // Find current user in the list
    const currentUserInList = leaderboard.entries.find(e => e.userId === CURRENT_USER_ID)
    const isCurrentUserInTopEntries = currentUserInList && currentUserInList.rank <= maxEntries

    // Handle period change
    const handlePeriodChange = useCallback((period: LeaderboardPeriod) => {
        setActivePeriod(period)
    }, [])

    // Handle category change
    const handleCategoryChange = useCallback((category: LeaderboardCategoryType) => {
        setActiveCategory(category)
    }, [])

    return (
        <div
            className="space-y-6"
            role="region"
            aria-label="Ranking"
        >
            {/* Header */}
            {!compact && (
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="text-2xl">🏆</span>
                            Ranking
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {CATEGORY_CONFIGS[activeCategory].description}
                        </p>
                    </div>
                </div>
            )}

            {/* Period Tabs */}
            <LeaderboardTabs
                activePeriod={activePeriod}
                onPeriodChange={handlePeriodChange}
                showCountdown={!compact}
            />

            {/* Category Selector */}
            <LeaderboardCategory
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                layout={compact ? 'horizontal' : 'grid'}
            />

            {/* Current User Card */}
            {showUserCard && currentUserEntry && (
                <LeaderboardUserCard
                    entry={currentUserEntry}
                    period={activePeriod}
                    category={activeCategory}
                    totalParticipants={leaderboard.totalParticipants}
                />
            )}

            {/* Top 3 Podium */}
            {topThree.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Pódio
                    </h3>
                    <div
                        className="grid gap-3"
                        style={{
                            gridTemplateColumns: topThree.length >= 2
                                ? '1fr 1fr'
                                : '1fr'
                        }}
                        role="list"
                        aria-label="Top 3 do ranking"
                    >
                        {/* First Place - Larger */}
                        {topThree[0] && (
                            <div
                                className={`
                  col-span-1 ${topThree.length === 1 ? '' : 'sm:col-span-2'}
                  ${topThree.length >= 2 ? 'sm:row-span-1' : ''}
                `}
                            >
                                <LeaderboardEntry
                                    entry={topThree[0]}
                                    category={activeCategory}
                                    isHighlighted={topThree[0].userId === CURRENT_USER_ID}
                                />
                            </div>
                        )}

                        {/* Second Place */}
                        {topThree[1] && (
                            <LeaderboardEntry
                                entry={topThree[1]}
                                category={activeCategory}
                                isHighlighted={topThree[1].userId === CURRENT_USER_ID}
                            />
                        )}

                        {/* Third Place */}
                        {topThree[2] && (
                            <LeaderboardEntry
                                entry={topThree[2]}
                                category={activeCategory}
                                isHighlighted={topThree[2].userId === CURRENT_USER_ID}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Rest of the Leaderboard */}
            {restEntries.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Continuação
                    </h3>
                    <div
                        className="space-y-2"
                        role="list"
                        aria-label="Demais posições do ranking"
                    >
                        {restEntries.map(entry => (
                            <LeaderboardEntry
                                key={entry.id}
                                entry={entry}
                                category={activeCategory}
                                isHighlighted={entry.userId === CURRENT_USER_ID}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Current User Position (if not in visible entries) */}
            {currentUserInList && !isCurrentUserInTopEntries && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                        <span>•</span>
                        <span>Sua posição</span>
                        <span>•</span>
                        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <LeaderboardEntry
                        entry={currentUserInList}
                        category={activeCategory}
                        isHighlighted={true}
                        showRankBadge={true}
                    />
                </div>
            )}

            {/* Empty State */}
            {leaderboard.entries.length === 0 && (
                <div className="text-center py-8">
                    <div className="text-4xl mb-3">📊</div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                        Nenhum dado ainda
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Complete atividades para aparecer no ranking!
                    </p>
                </div>
            )}

            {/* Footer Info */}
            {!compact && (
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span>
                        {leaderboard.totalParticipants} participantes
                    </span>
                    <span>
                        {PERIOD_CONFIGS[activePeriod].name} • {CATEGORY_CONFIGS[activeCategory].name}
                    </span>
                </div>
            )}
        </div>
    )
}

export default LeaderboardView
