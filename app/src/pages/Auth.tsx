import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

type AuthMode = 'login' | 'register' | 'reset'

export function Auth() {
    const [mode, setMode] = useState<AuthMode>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const { signIn, signUp } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setLoading(true)

        try {
            if (mode === 'login') {
                await signIn(email, password)
            } else if (mode === 'register') {
                if (password !== confirmPassword) {
                    throw new Error('As senhas não coincidem')
                }
                if (password.length < 6) {
                    throw new Error('A senha deve ter pelo menos 6 caracteres')
                }
                await signUp(email, password)
                setSuccess('Conta criada! Verifique seu email para confirmar.')
            } else if (mode === 'reset') {
                // Password reset functionality would be implemented here
                // For now, just show a success message
                setSuccess('Email de recuperação enviado!')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">📚 Estudos Tracker</h1>
                    <p className="text-gray-300">Organize seus estudos com gamificação</p>
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setMode('login')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${mode === 'login'
                                    ? 'bg-white text-purple-900'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            Entrar
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${mode === 'register'
                                    ? 'bg-white text-purple-900'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            Criar Conta
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    Nome de Exibição
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Seu nome"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-200 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="seu@email.com"
                            />
                        </div>

                        {mode !== 'reset' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    Senha
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {mode === 'register' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-1">
                                    Confirmar Senha
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {error && (
                            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : mode === 'register' ? 'Criar Conta' : 'Enviar Email'}
                        </button>

                        {mode === 'login' && (
                            <button
                                type="button"
                                onClick={() => setMode('reset')}
                                className="w-full text-center text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Esqueceu sua senha?
                            </button>
                        )}

                        {mode === 'reset' && (
                            <button
                                type="button"
                                onClick={() => setMode('login')}
                                className="w-full text-center text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Voltar ao login
                            </button>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-400 text-sm mt-6">
                    Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade
                </p>
            </div>
        </div>
    )
}
