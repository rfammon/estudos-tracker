import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../lib/supabase-auth'
import { useAuth } from './useAuth'
import type {
    StudyPlan,
    PlanMonth,
    PlanWeek,
    StudyTopic,
    UserTopicProgress,
    StudyPlanComplete,
    PlanMonthWithWeeks,
    PlanWeekWithTopics,
    StudyTopicWithProgress,
} from '../types/database.types'

interface UsePortuguesePlanReturn {
    plan: StudyPlanComplete | null
    loading: boolean
    error: string | null
    progress: {
        total: number
        completed: number
        inProgress: number
        percentage: number
    }
    updateTopicProgress: (topicId: string, status: 'not_started' | 'in_progress' | 'completed', notes?: string) => Promise<void>
    getTopicProgress: (topicId: string) => UserTopicProgress | null
    refreshPlan: () => Promise<void>
}

export function usePortuguesePlan(): UsePortuguesePlanReturn {
    const { user } = useAuth()
    const [plan, setPlan] = useState<StudyPlanComplete | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [progressMap, setProgressMap] = useState<Map<string, UserTopicProgress>>(new Map())

    // Calculate overall progress
    const progress = useCallback(() => {
        if (!plan) {
            return { total: 0, completed: 0, inProgress: 0, percentage: 0 }
        }

        let total = 0
        let completed = 0
        let inProgress = 0

        plan.months.forEach(month => {
            month.weeks.forEach(week => {
                week.topics.forEach(topic => {
                    total++
                    const topicProgress = progressMap.get(topic.id)
                    if (topicProgress?.status === 'completed') {
                        completed++
                    } else if (topicProgress?.status === 'in_progress') {
                        inProgress++
                    }
                })
            })
        })

        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

        return { total, completed, inProgress, percentage }
    }, [plan, progressMap])

    // Fetch the complete plan with all nested data
    const fetchPlan = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            // Fetch the Portuguese study plan
            const { data: planData, error: planError } = await supabase
                .from('study_plans')
                .select('*')
                .eq('name', 'Português Completo')
                .single()

            if (planError) throw planError
            if (!planData) throw new Error('Portuguese plan not found')

            // Fetch months
            const { data: monthsData, error: monthsError } = await supabase
                .from('plan_months')
                .select('*')
                .eq('plan_id', planData.id)
                .order('month_number', { ascending: true })

            if (monthsError) throw monthsError

            // Fetch weeks
            const { data: weeksData, error: weeksError } = await supabase
                .from('plan_weeks')
                .select('*')
                .eq('plan_id', planData.id)
                .order('week_number', { ascending: true })

            if (weeksError) throw weeksError

            // Fetch topics
            const { data: topicsData, error: topicsError } = await supabase
                .from('study_topics')
                .select('*')
                .order('order_index', { ascending: true })

            if (topicsError) throw topicsError

            // Fetch user progress if logged in
            const newProgressMap = new Map<string, UserTopicProgress>()
            if (user) {
                const { data: progressData, error: progressError } = await supabase
                    .from('user_topic_progress')
                    .select('*')
                    .eq('user_id', user.id)

                if (!progressError && progressData) {
                    progressData.forEach(p => {
                        newProgressMap.set(p.topic_id, p)
                    })
                    setProgressMap(newProgressMap)
                }
            }

            // Assemble the complete plan structure
            const monthsMap = new Map<string, PlanMonth>()
            monthsData?.forEach(m => monthsMap.set(m.id, m))

            const weeksMap = new Map<string, PlanWeek[]>()
            weeksData?.forEach(w => {
                const monthWeeks = weeksMap.get(w.month_id) || []
                monthWeeks.push(w)
                weeksMap.set(w.month_id, monthWeeks)
            })

            const topicsMap = new Map<string, StudyTopic[]>()
            topicsData?.forEach(t => {
                const weekTopics = topicsMap.get(t.week_id) || []
                weekTopics.push(t)
                topicsMap.set(t.week_id, weekTopics)
            })

            // Build the nested structure
            const completePlan: StudyPlanComplete = {
                ...planData,
                months: (monthsData || []).map(month => ({
                    ...month,
                    weeks: (weeksMap.get(month.id) || []).map(week => ({
                        ...week,
                        topics: (topicsMap.get(week.id) || []).map(topic => ({
                            ...topic,
                            progress: newProgressMap.get(topic.id) || null,
                        })),
                    })),
                })),
            }

            setPlan(completePlan)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch plan'
            setError(errorMessage)
            console.error('Error fetching Portuguese plan:', err)
        } finally {
            setLoading(false)
        }
    }, [user])

    // Update topic progress
    const updateTopicProgress = useCallback(async (
        topicId: string,
        status: 'not_started' | 'in_progress' | 'completed',
        notes?: string
    ) => {
        if (!user) {
            throw new Error('User must be logged in to update progress')
        }

        setLoading(true)
        setError(null)

        try {
            const now = new Date().toISOString()
            const existingProgress = progressMap.get(topicId)

            const progressData = {
                user_id: user.id,
                topic_id: topicId,
                status,
                started_at: status !== 'not_started' ? (existingProgress?.started_at || now) : null,
                completed_at: status === 'completed' ? now : null,
                notes: notes || existingProgress?.notes || null,
                updated_at: now,
            }

            if (existingProgress) {
                // Update existing progress
                const { error: updateError } = await supabase
                    .from('user_topic_progress')
                    .update(progressData)
                    .eq('id', existingProgress.id)

                if (updateError) throw updateError
            } else {
                // Insert new progress
                const { error: insertError } = await supabase
                    .from('user_topic_progress')
                    .insert(progressData)

                if (insertError) throw insertError
            }

            // Refresh progress data
            await fetchPlan()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update progress'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }, [user, progressMap, fetchPlan])

    // Get progress for a specific topic
    const getTopicProgress = useCallback((topicId: string): UserTopicProgress | null => {
        return progressMap.get(topicId) || null
    }, [progressMap])

    // Refresh plan data
    const refreshPlan = useCallback(async () => {
        await fetchPlan()
    }, [fetchPlan])

    // Initial fetch
    useEffect(() => {
        fetchPlan()
    }, [fetchPlan])

    return {
        plan,
        loading,
        error,
        progress: progress(),
        updateTopicProgress,
        getTopicProgress,
        refreshPlan,
    }
}

export type { UsePortuguesePlanReturn }
