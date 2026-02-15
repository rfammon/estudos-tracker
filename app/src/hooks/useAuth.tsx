import { useState, useEffect, createContext, useContext, type ReactNode } from 'react'
import { supabase } from '../lib/supabase-auth'
import type { User, Session } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

interface AuthContextType {
    user: User | null
    session: Session | null
    profile: Database['public']['Tables']['profiles']['Row'] | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    updateProfile: (updates: Partial<Database['public']['Tables']['profiles']['Update']>) => Promise<void>
    refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
    children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [profile, setProfile] = useState<Database['public']['Tables']['profiles']['Row'] | null>(null)
    const [loading, setLoading] = useState(true)

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
    const fetchProfile = async (userId: string) => {
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

    // Refresh profile data
    const refreshProfile = async () => {
        if (user) {
            const profileData = await fetchProfile(user.id)
            setProfile(profileData)
        }
    }

    useEffect(() => {
        // Check current user on mount
        const initAuth = async () => {
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser()
                const { data: { session: currentSession } } = await supabase.auth.getSession()

                if (currentUser) {
                    setUser(currentUser)
                    setSession(currentSession)
                    // Fetch profile
                    const profileData = await fetchProfile(currentUser.id)
                    setProfile(profileData)
                }
            } catch (error) {
                console.error('Error initializing auth:', error)
            } finally {
                setLoading(false)
            }
        }

        initAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, authSession) => {
            if (authSession?.user) {
                setUser(authSession.user)
                setSession(authSession)
                // Fetch or create profile
                const profileData = await fetchOrCreateProfile(authSession.user.id, authSession.user.email)
                setProfile(profileData)
            } else {
                setUser(null)
                setSession(null)
                setProfile(null)
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        if (data.user) {
            setUser(data.user)
            setSession(data.session)
            const profileData = await fetchOrCreateProfile(data.user.id, data.user.email)
            setProfile(profileData)
        }
    }

    const handleSignUp = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        if (data.user) {
            setUser(data.user)
            // Profile will be created via onAuthStateChange or on first login
        }
    }

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        setUser(null)
        setSession(null)
        setProfile(null)
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
    }

    return (
        <AuthContext.Provider value={{
            user,
            session,
            profile,
            loading,
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
