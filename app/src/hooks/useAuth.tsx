import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase-auth'
import { useSettingsStore } from '../store/useSettingsStore'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

interface AuthContextType {
    user: User | null
    session: Session | null
    profile: Database['public']['Tables']['profiles']['Row'] | null
    loading: boolean
    profileLoading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    updateProfile: (updates: Partial<Database['public']['Tables']['profiles']['Update']>) => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: React.ReactNode
}

// Fetch or create profile for a user
const fetchOrCreateProfile = async (userId: string, email?: string): Promise<Database['public']['Tables']['profiles']['Row'] | null> => {
    // Try to fetch existing profile
    const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (existingProfile) {
        return existingProfile
    }

    // If no profile exists, create one
    const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
            id: userId,
            username: email?.split('@')[0] || `user_${userId.slice(0, 8)}`,
            display_name: email?.split('@')[0] || 'New User',
            xp: 0,
            level: 1,
            streak: 0,
        })
        .select()
        .single()

    if (createError) {
        console.error('Error creating profile:', createError)
        return null
    }

    return newProfile
}

// Fetch user profile
const fetchProfile = async (userId: string): Promise<Database['public']['Tables']['profiles']['Row'] | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return null
    }

    return data
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null)
    const [loading, setLoading] = useState(true)
    const [profileLoading, setProfileLoading] = useState(false)

    // Update settings store with profile data
    const updateSettingsWithProfile = useCallback((profileData: Database['public']['Tables']['profiles']['Row'] | null, email?: string) => {
        if (profileData) {
            useSettingsStore.getState().setUserProfile({
                name: profileData.display_name || profileData.username || 'Usuário',
                email: email || '',
            })
        }
    }, [])

    // ============================================================
    // EFFECT 1: Auth State Listener
    // ============================================================
    useEffect(() => {
        setLoading(true)

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, authSession) => {
                console.log('[Auth] onAuthStateChange event:', event)
                setUser(authSession?.user ?? null)
                setSession(authSession)
                setLoading(false)
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    // ============================================================
    // EFFECT 2: Profile Loading
    // ============================================================
    useEffect(() => {
        if (!user) {
            setProfile(null)
            setProfileLoading(false)
            useSettingsStore.getState().setUserProfile({ name: 'Usuário', email: '' })
            return
        }

        const loadProfile = async () => {
            setProfileLoading(true)
            try {
                const profileData = await fetchOrCreateProfile(user.id, user.email)
                setProfile(profileData)
                updateSettingsWithProfile(profileData, user.email ?? undefined)
            } catch (error) {
                console.error('[Auth] Profile loading failed:', error)
                setProfile(null)
            } finally {
                setProfileLoading(false)
            }
        }

        loadProfile()
    }, [user, updateSettingsWithProfile])

    const refreshProfile = async () => {
        if (!user) return
        setProfileLoading(true)
        try {
            const profileData = await fetchProfile(user.id)
            setProfile(profileData)
            updateSettingsWithProfile(profileData, user.email ?? undefined)
        } catch (error) {
            console.error('[Auth] Profile refresh failed:', error)
        } finally {
            setProfileLoading(false)
        }
    }

    const handleSignIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
    }

    const handleSignUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
    }

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut()
            setUser(null)
            setSession(null)
            setProfile(null)
            window.location.href = '/'
        } catch (error) {
            console.error('Error signing out:', error)
            throw error
        }
    }

    const handleUpdateProfile = async (updates: Partial<Database['public']['Tables']['profiles']['Update']>) => {
        if (!user) throw new Error('No user logged in')
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single()
        if (error) throw error
        setProfile(data)
        if (data) {
            useSettingsStore.getState().setUserProfile({
                name: data.display_name || data.username || 'Usuário',
            })
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            session,
            profile,
            loading,
            profileLoading,
            signIn: handleSignIn,
            signUp: handleSignUp,
            signOut: handleSignOut,
            updateProfile: handleUpdateProfile,
            refreshProfile,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

