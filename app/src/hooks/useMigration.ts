import { useState, useCallback } from 'react'
import { migrateToSupabase, hasLocalDataToMigrate, clearLocalData } from '../services/migration'
import { useAuth } from './useAuth'

export interface MigrationResult {
    success: boolean
    migrated: {
        sessions: number
        achievements: number
        profile: boolean
    }
    error?: string
}

export function useMigration() {
    const { user } = useAuth()
    const [migrating, setMigrating] = useState(false)
    const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null)

    const hasLocalData = useCallback(() => {
        return hasLocalDataToMigrate()
    }, [])

    const migrate = useCallback(async () => {
        if (!user) {
            setMigrationResult({
                success: false,
                migrated: { sessions: 0, achievements: 0, profile: false },
                error: 'User not authenticated'
            })
            return
        }

        setMigrating(true)
        const result = await migrateToSupabase(user.id)
        setMigrationResult(result)
        setMigrating(false)

        if (result.success) {
            clearLocalData()
        }
    }, [user])

    const dismissMigration = useCallback(() => {
        clearLocalData()
        setMigrationResult(null)
    }, [])

    return {
        hasLocalData,
        migrate,
        migrating,
        migrationResult,
        dismissMigration
    }
}
