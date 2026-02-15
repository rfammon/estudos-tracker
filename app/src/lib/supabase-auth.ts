import { createClient, User } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Re-export from existing supabase.ts to avoid duplication
export { supabase as supabaseClient }

// Auth types
export interface AuthState {
    user: User | null
    profile: Database['public']['Tables']['profiles']['Row'] | null
    loading: boolean
}

// Auth functions
export const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
}

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export const getCurrentUser = async (): Promise<User | null> => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
}

// Get user session
export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
}

// Reset password
export const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
    return data
}

// Update user email
export const updateEmail = async (email: string) => {
    const { data, error } = await supabase.auth.updateUser({ email })
    if (error) throw error
    return data
}

// Update user password
export const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    return data
}

// Listen to auth changes
export const onAuthStateChange = (callback: (event: string, session: unknown) => void) => {
    return supabase.auth.onAuthStateChange(callback)
}
