import { useCallback, useEffect } from 'react';
import { useMultiplierStore } from '../store/use-multiplier-store';
import { useGamificationStore } from '../store/use-gamification-store';
import { Multiplier, MultiplierType } from '../types/multipliers';

/**
 * Hook for managing multipliers in the application
 */
export const useMultipliers = () => {
    const {
        activeMultipliers,
        comboState,
        notifications,
        activateMultiplier,
        deactivateMultiplier,
        calculateTotalMultiplier,
        applyMultiplier,
        updateStreakMultiplier,
        checkTimeBonus,
        incrementCombo,
        resetCombo,
        checkComboTimeout,
        checkActiveEvents,
        checkFirstSessionBonus,
        markFirstSessionUsed,
        addNotification,
        getActiveMultipliersByType,
        isMultiplierActive,
        initializeBonusEvents,
    } = useMultiplierStore();

    const { addPointsWithMultiplier, currentStreak } = useGamificationStore();

    // Initialize bonus events on first use
    useEffect(() => {
        initializeBonusEvents();
    }, [initializeBonusEvents]);

    // Check and activate time-based multipliers
    const checkAndActivateTimeMultipliers = useCallback(() => {
        // Check time bonus
        const timeBonus = checkTimeBonus();
        if (timeBonus && !isMultiplierActive(timeBonus.id)) {
            activateMultiplier(timeBonus);
        }

        // Check first session bonus
        const firstSessionBonus = checkFirstSessionBonus();
        if (firstSessionBonus && !isMultiplierActive(firstSessionBonus.id)) {
            activateMultiplier(firstSessionBonus);
        }

        // Check active events
        const activeEvents = checkActiveEvents();
        activeEvents.forEach(event => {
            if (!isMultiplierActive(event.id)) {
                activateMultiplier(event);
            }
        });

        // Check combo timeout
        checkComboTimeout();
    }, [
        checkTimeBonus,
        checkFirstSessionBonus,
        checkActiveEvents,
        checkComboTimeout,
        activateMultiplier,
        isMultiplierActive,
    ]);

    // Add points with active multipliers and handle combo
    const addPointsWithCombo = useCallback((baseXP: number): number => {
        // Increment combo
        incrementCombo();

        // Add points with multiplier
        const finalXP = addPointsWithMultiplier(baseXP);

        return finalXP;
    }, [incrementCombo, addPointsWithMultiplier]);

    // Complete a task (for combo system)
    const completeTask = useCallback((baseXP: number): number => {
        return addPointsWithCombo(baseXP);
    }, [addPointsWithCombo]);

    // Start a study session (activates first session bonus if applicable)
    const startStudySession = useCallback(() => {
        checkAndActivateTimeMultipliers();

        // Check if first session bonus was activated
        const firstSessionBonus = checkFirstSessionBonus();
        if (firstSessionBonus && isMultiplierActive(firstSessionBonus.id)) {
            markFirstSessionUsed();
        }
    }, [checkAndActivateTimeMultipliers, checkFirstSessionBonus, isMultiplierActive, markFirstSessionUsed]);

    // End a study session
    const endStudySession = useCallback((earnedXP: number): number => {
        return addPointsWithCombo(earnedXP);
    }, [addPointsWithCombo]);

    // Get total multiplier value
    const getTotalMultiplier = useCallback((): number => {
        return calculateTotalMultiplier().totalMultiplier;
    }, [calculateTotalMultiplier]);

    // Check if any multiplier is active
    const hasActiveMultiplier = activeMultipliers.length > 0;

    // Get multiplier breakdown for display
    const getMultiplierBreakdown = useCallback(() => {
        const calculation = calculateTotalMultiplier();
        return calculation.multipliers.map(m => ({
            name: m.name,
            value: m.value,
            type: m.type,
        }));
    }, [calculateTotalMultiplier]);

    return {
        // State
        activeMultipliers,
        comboState,
        notifications,
        hasActiveMultiplier,

        // Actions
        activateMultiplier,
        deactivateMultiplier,
        checkAndActivateTimeMultipliers,
        addPointsWithCombo,
        completeTask,
        startStudySession,
        endStudySession,
        resetCombo,

        // Utilities
        getTotalMultiplier,
        getMultiplierBreakdown,
        getActiveMultipliersByType,
        isMultiplierActive,
        applyMultiplier,
        updateStreakMultiplier,
        addNotification,
    };
};

/**
 * Hook for combo system specifically
 */
export const useComboSystem = () => {
    const {
        comboState,
        incrementCombo,
        resetCombo,
        checkComboTimeout,
    } = useMultiplierStore();

    // Check for combo timeout on mount and periodically
    useEffect(() => {
        checkComboTimeout();

        const interval = setInterval(() => {
            checkComboTimeout();
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [checkComboTimeout]);

    const recordActivity = useCallback(() => {
        incrementCombo();
    }, [incrementCombo]);

    const getCurrentCombo = useCallback(() => {
        return comboState.currentCombo;
    }, [comboState.currentCombo]);

    const getComboMultiplier = useCallback(() => {
        return comboState.comboMultiplier;
    }, [comboState.comboMultiplier]);

    const getTimeSinceLastActivity = useCallback((): number | null => {
        if (!comboState.lastActivityTime) return null;
        return Date.now() - new Date(comboState.lastActivityTime).getTime();
    }, [comboState.lastActivityTime]);

    const getTimeUntilTimeout = useCallback((): number | null => {
        const timeSince = getTimeSinceLastActivity();
        if (timeSince === null) return null;
        return Math.max(0, comboState.comboTimeout - timeSince);
    }, [getTimeSinceLastActivity, comboState.comboTimeout]);

    return {
        currentCombo: comboState.currentCombo,
        comboMultiplier: comboState.comboMultiplier,
        lastActivityTime: comboState.lastActivityTime,
        recordActivity,
        resetCombo,
        getCurrentCombo,
        getComboMultiplier,
        getTimeSinceLastActivity,
        getTimeUntilTimeout,
    };
};

/**
 * Hook for bonus events
 */
export const useBonusEvents = () => {
    const {
        bonusEvents,
        checkActiveEvents,
        activateEventMultiplier,
    } = useMultiplierStore();

    const getActiveEvents = useCallback(() => {
        return checkActiveEvents();
    }, [checkActiveEvents]);

    const getUpcomingEvents = useCallback(() => {
        const now = new Date();

        return bonusEvents.filter(event => {
            // Check if event hasn't started yet
            if (new Date(event.startDate) > now) {
                return true;
            }

            // Check if it's a recurring event that's not currently active
            if (event.recurring) {
                const activeEvents = checkActiveEvents();
                return !activeEvents.some(ae => ae.source === event.id);
            }

            return false;
        });
    }, [bonusEvents, checkActiveEvents]);

    const activateEvent = useCallback((eventId: string) => {
        const event = bonusEvents.find(e => e.id === eventId);
        if (event) {
            activateEventMultiplier(event);
        }
    }, [bonusEvents, activateEventMultiplier]);

    return {
        events: bonusEvents,
        activeEvents: getActiveEvents(),
        upcomingEvents: getUpcomingEvents(),
        activateEvent,
    };
};

export default useMultipliers;
