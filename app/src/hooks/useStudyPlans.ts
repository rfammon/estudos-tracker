import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase-auth'
import { useAuth } from './useAuth'
import type { Database } from '../types/database.types'

type Subject = Database['public']['Tables']['subjects']['Row']
type StudyPlanModel = Database['public']['Tables']['study_plan_models']['Row']
type UserStudyPlan = Database['public']['Tables']['user_study_plans']['Row'] & {
    subject: Subject
    plan_model: StudyPlanModel
}

interface StudyPlansState {
    subjects: Subject[]
    planModels: StudyPlanModel[]
    userPlans: UserStudyPlan[]
    loading: boolean
    error: string | null
}

interface UseStudyPlansReturn extends StudyPlansState {
    updatePlan: (subjectId: string, planModelId: string) => Promise<{ data?: UserStudyPlan; error?: string }>
    getPlanForSubject: (subjectId: string) => UserStudyPlan | undefined
    removePlan: (subjectId: string) => Promise<{ error?: string }>
    refreshPlans: () => Promise<void>
}

export function useStudyPlans(): UseStudyPlansReturn {
    const { user } = useAuth()
    const [state, setState] = useState<StudyPlansState>({
        subjects: [],
        planModels: [],
        userPlans: [],
        loading: true,
        error: null,
    })

    // Fetch all data
    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        try {
            // Fetch subjects
            const { data: subjectsData, error: subjectsError } = await supabase
                .from('subjects')
                .select('*')
                .eq('is_active', true)
                .order('order_index')

            if (subjectsError) throw subjectsError

            // Fetch plan models
            const { data: modelsData, error: modelsError } = await supabase
                .from('study_plan_models')
                .select('*')

            if (modelsError) throw modelsError

            // Fetch user plans if logged in
            let plansData: UserStudyPlan[] = []
            if (user) {
                const { data, error: plansError } = await supabase
                    .from('user_study_plans')
                    .select(`
            *,
            subject:subjects(*),
            plan_model:study_plan_models(*)
          `)
                    .eq('user_id', user.id)
                    .eq('is_active', true)

                if (plansError) throw plansError
                plansData = data as UserStudyPlan[] || []
            }

            setState({
                subjects: subjectsData || [],
                planModels: modelsData || [],
                userPlans: plansData,
                loading: false,
                error: null,
            })
        } catch (error) {
            console.error('Error fetching study plans data:', error)
            setState(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch data',
            }))
        }
    }, [user?.id])

    // Initial fetch
    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Update or create plan
    const updatePlan = useCallback(async (subjectId: string, planModelId: string): Promise<{ data?: UserStudyPlan; error?: string }> => {
        if (!user) return { error: 'Not authenticated' }

        const planModel = state.planModels.find(m => m.id === planModelId)
        if (!planModel) return { error: 'Invalid plan model' }

        const weeklyHours = Math.round(5 * planModel.weekly_hours_multiplier)

        try {
            const { data, error } = await supabase
                .from('user_study_plans')
                .upsert({
                    user_id: user.id,
                    subject_id: subjectId,
                    plan_model_id: planModelId,
                    weekly_hours: weeklyHours,
                    updated_at: new Date().toISOString(),
                }, {
                    onConflict: 'user_id,subject_id',
                })
                .select(`
          *,
          subject:subjects(*),
          plan_model:study_plan_models(*)
        `)
                .single()

            if (error) throw error

            // Update local state
            setState(prev => {
                const filtered = prev.userPlans.filter(p => p.subject_id !== subjectId)
                return {
                    ...prev,
                    userPlans: [...filtered, data as UserStudyPlan],
                }
            })

            return { data: data as UserStudyPlan }
        } catch (error) {
            console.error('Error updating plan:', error)
            return { error: error instanceof Error ? error.message : 'Failed to update plan' }
        }
    }, [user?.id, state.planModels])

    // Get plan for subject
    const getPlanForSubject = useCallback((subjectId: string): UserStudyPlan | undefined => {
        return state.userPlans.find(p => p.subject_id === subjectId)
    }, [state.userPlans])

    // Remove plan
    const removePlan = useCallback(async (subjectId: string): Promise<{ error?: string }> => {
        if (!user) return { error: 'Not authenticated' }

        try {
            const { error } = await supabase
                .from('user_study_plans')
                .update({ is_active: false })
                .eq('user_id', user.id)
                .eq('subject_id', subjectId)

            if (error) throw error

            // Update local state
            setState(prev => ({
                ...prev,
                userPlans: prev.userPlans.filter(p => p.subject_id !== subjectId),
            }))

            return {}
        } catch (error) {
            console.error('Error removing plan:', error)
            return { error: error instanceof Error ? error.message : 'Failed to remove plan' }
        }
    }, [user?.id])

    // Refresh plans
    const refreshPlans = useCallback(async () => {
        await fetchData()
    }, [fetchData])

    return {
        ...state,
        updatePlan,
        getPlanForSubject,
        removePlan,
        refreshPlans,
    }
}
