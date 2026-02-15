/**
 * Supabase Database Types for Estudos Tracker
 * Auto-generated from Supabase schema
 * Project ID: kuzwnxjlvibwzajhlxom
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
            achievements: {
                Row: {
                    category: string
                    created_at: string | null
                    description: string
                    icon: string
                    id: string
                    is_hidden: boolean | null
                    name: string
                    rarity: string | null
                    trigger_type: string | null
                    trigger_value: Json | null
                    xp_reward: number | null
                }
                Insert: {
                    category: string
                    created_at?: string | null
                    description: string
                    icon: string
                    id: string
                    is_hidden?: boolean | null
                    name: string
                    rarity?: string | null
                    trigger_type?: string | null
                    trigger_value?: Json | null
                    xp_reward?: number | null
                }
                Update: {
                    category?: string
                    created_at?: string | null
                    description?: string
                    icon?: string
                    id?: string
                    is_hidden?: boolean | null
                    name?: string
                    rarity?: string | null
                    trigger_type?: string | null
                    trigger_value?: Json | null
                    xp_reward?: number | null
                }
                Relationships: []
            }
            leaderboard_entries: {
                Row: {
                    category: string
                    id: string
                    period: string
                    period_end_date: string
                    period_start_date: string
                    rank: number | null
                    score: number | null
                    updated_at: string | null
                    user_id: string
                }
                Insert: {
                    category: string
                    id?: string
                    period: string
                    period_end_date: string
                    period_start_date: string
                    rank?: number | null
                    score?: number | null
                    updated_at?: string | null
                    user_id: string
                }
                Update: {
                    category?: string
                    id?: string
                    period?: string
                    period_end_date?: string
                    period_start_date?: string
                    rank?: number | null
                    score?: number | null
                    updated_at?: string | null
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "leaderboard_entries_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    display_name: string | null
                    id: string
                    last_activity_date: string | null
                    level: number | null
                    streak: number | null
                    updated_at: string | null
                    username: string | null
                    xp: number | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    display_name?: string | null
                    id: string
                    last_activity_date?: string | null
                    level?: number | null
                    streak?: number | null
                    updated_at?: string | null
                    username?: string | null
                    xp?: number | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    display_name?: string | null
                    id?: string
                    last_activity_date?: string | null
                    level?: number | null
                    streak?: number | null
                    updated_at?: string | null
                    username?: string | null
                    xp?: number | null
                }
                Relationships: []
            }
            study_sessions: {
                Row: {
                    assessments_taken: number | null
                    created_at: string | null
                    duration_minutes: number
                    ended_at: string | null
                    id: string
                    objectives_completed: number | null
                    session_date: string
                    started_at: string
                    topic_id: string
                    topic_name: string
                    user_id: string
                    xp_earned: number | null
                }
                Insert: {
                    assessments_taken?: number | null
                    created_at?: string | null
                    duration_minutes: number
                    ended_at?: string | null
                    id?: string
                    objectives_completed?: number | null
                    session_date: string
                    started_at: string
                    topic_id: string
                    topic_name: string
                    user_id: string
                    xp_earned?: number | null
                }
                Update: {
                    assessments_taken?: number | null
                    created_at?: string | null
                    duration_minutes?: number
                    ended_at?: string | null
                    id?: string
                    objectives_completed?: number | null
                    session_date?: string
                    started_at?: string
                    topic_id?: string
                    topic_name?: string
                    user_id?: string
                    xp_earned?: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "study_sessions_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            user_achievements: {
                Row: {
                    achievement_id: string
                    discovered_at: string | null
                    id: string
                    user_id: string
                }
                Insert: {
                    achievement_id: string
                    discovered_at?: string | null
                    id?: string
                    user_id: string
                }
                Update: {
                    achievement_id?: string
                    discovered_at?: string | null
                    id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "user_achievements_achievement_id_fkey"
                        columns: ["achievement_id"]
                        isOneToOne: false
                        referencedRelation: "achievements"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "user_achievements_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
    DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
    TableName extends DefaultSchemaTableNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
    EnumName extends DefaultSchemaEnumNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof DatabaseWithoutInternals
    }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
}
    ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {},
    },
} as const

// Convenience type exports for each table
export type Profile = Tables<'profiles'>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>

export type StudySession = Tables<'study_sessions'>
export type StudySessionInsert = TablesInsert<'study_sessions'>
export type StudySessionUpdate = TablesUpdate<'study_sessions'>

export type Achievement = Tables<'achievements'>
export type AchievementInsert = TablesInsert<'achievements'>
export type AchievementUpdate = TablesUpdate<'achievements'>

export type UserAchievement = Tables<'user_achievements'>
export type UserAchievementInsert = TablesInsert<'user_achievements'>
export type UserAchievementUpdate = TablesUpdate<'user_achievements'>

export type LeaderboardEntry = Tables<'leaderboard_entries'>
export type LeaderboardEntryInsert = TablesInsert<'leaderboard_entries'>
export type LeaderboardEntryUpdate = TablesUpdate<'leaderboard_entries'>
