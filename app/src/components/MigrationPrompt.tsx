import { useState } from 'react'
import { useMigration } from '../hooks/useMigration'

export function MigrationPrompt() {
    const { hasLocalData, migrate, migrating, migrationResult, dismissMigration } = useMigration()
    const [dismissed, setDismissed] = useState(false)

    // Don't show if no local data, already dismissed, or migration was successful
    if (!hasLocalData() || dismissed || migrationResult?.success) {
        return null
    }

    return (
        <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start gap-3">
                <div className="text-2xl">📦</div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                        Dados Locais Encontrados
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        Encontramos dados salvos localmente. Deseja migrá-los para sua conta na nuvem?
                    </p>

                    {migrationResult && !migrationResult.success && (
                        <p className="text-sm text-red-600 mb-2">
                            Erro: {migrationResult.error}
                        </p>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={migrate}
                            disabled={migrating}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                            {migrating ? 'Migrando...' : 'Migrar Dados'}
                        </button>
                        <button
                            onClick={() => {
                                setDismissed(true)
                                dismissMigration()
                            }}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                        >
                            Ignorar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
