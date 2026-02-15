import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

    const { signIn, signUp, user } = useAuth()
    const navigate = useNavigate()

    // Reactive redirect: When user state updates, navigate to Dashboard
    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true })
        }
    }, [user, navigate])

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
                setSuccess('Email de recuperação enviado!')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ocorreu um erro')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8 bg-[#f8fafc] font-['Plus_Jakarta_Sans'] selection:bg-[#2bee79]/30">
            {/* Background Decorations - Elite Command Center Vibes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#2bee79]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#3b82f6]/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-dot-pattern opacity-[0.08]"></div>
                {/* Subtle Grid Lines */}
                <div className="absolute inset-0 z-0" style={{
                    backgroundImage: 'linear-gradient(#00000005 1px, transparent 1px), linear-gradient(90deg, #00000005 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }}></div>
            </div>

            <main className="w-full max-w-5xl z-10 relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Hero Section - Left Column (Hidden on mobile or stacked) */}
                <div className="hidden lg:flex flex-col items-start space-y-8 animate-fade-in animate-slide-in-left">
                    <div className="inline-flex items-center space-x-4 bg-white/60 p-4 pr-8 rounded-[2rem] shadow-sm border border-white/80 backdrop-blur-md">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#2bee79]/20 rounded-full blur-md animate-pulse"></div>
                            <img src="/mascot.png" alt="Mascote" className="w-16 h-16 relative z-10" />
                        </div>
                        <div>
                            <span className="text-xs font-bold tracking-[0.2em] text-[#2bee79] uppercase">Status: Online</span>
                            <h2 className="text-2xl font-[900] text-slate-800 tracking-tight leading-none">COMMAND CENTER</h2>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-6xl font-[900] text-slate-900 leading-[1.1] tracking-tight">
                            Your mission <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2bee79] to-[#3b82f6]">
                                to excellence
                            </span> <br />
                            starts here.
                        </h1>
                        <p className="text-slate-500 text-xl font-medium max-w-md leading-relaxed">
                            Acompanhe seu progresso, conquiste novos marcos e domine seus estudos com estilo.
                        </p>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <span className="text-slate-400 font-semibold text-sm">+500 alunos hoje</span>
                    </div>
                </div>

                {/* Form Section - Right Column */}
                <div className="flex flex-col items-center lg:items-end w-full max-w-md mx-auto">
                    {/* Compact Logo for Mobile */}
                    <div className="lg:hidden flex flex-col items-center mb-10">
                        <img src="/mascot.png" alt="Mascote" className="w-20 h-20 mb-4" />
                        <h1 className="text-3xl font-[900] tracking-tight text-slate-800">Estudos Tracker</h1>
                    </div>

                    <div className="relative w-full">
                        {/* Gamified Decor */}
                        <div className="absolute -top-4 -right-4 z-20">
                            <div className="bg-[#2bee79] text-slate-900 text-[10px] font-[900] px-3 py-1 rounded-full shadow-lg transform rotate-12 border-2 border-white tracking-widest uppercase">
                                Elite Member
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="w-full rounded-[2.5rem] p-8 md:p-10 bg-white/95 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-white backdrop-blur-3xl transition-all duration-500 relative z-10">
                            {/* Subtle Inner Glow */}
                            <div className="absolute inset-0 rounded-[2.5rem] border border-[#2bee79]/10 pointer-events-none"></div>
                            <div className="mb-8">
                                <h2 className="text-2xl font-[900] text-slate-800">
                                    {mode === 'login' ? 'Identificação Necessária' : mode === 'register' ? 'Criar Novo Registro' : 'Recuperar Acesso'}
                                </h2>
                                <p className="text-slate-400 font-semibold text-sm">Insira seus dados de comando abaixo.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {mode === 'register' && (
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-icons-round text-gray-300 group-focus-within:text-[#2bee79] transition-colors duration-300">person</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            placeholder="Nome de Exibição"
                                            className="block w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-slate-100 focus:border-[#2bee79] focus:ring-[6px] focus:ring-[#2bee79]/10 rounded-2xl text-slate-800 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none font-semibold"
                                        />
                                    </div>
                                )}

                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-icons-round text-gray-300 group-focus-within:text-[#2bee79] transition-colors duration-300">alternate_email</span>
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="seu@email.com"
                                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-[#2bee79] focus:ring-[6px] focus:ring-[#2bee79]/10 rounded-2xl text-slate-800 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none font-semibold"
                                    />
                                </div>

                                {mode !== 'reset' && (
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-icons-round text-gray-300 group-focus-within:text-[#2bee79] transition-colors duration-300">fingerprint</span>
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="block w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-slate-100 focus:border-[#2bee79] focus:ring-[6px] focus:ring-[#2bee79]/10 rounded-2xl text-slate-800 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none font-semibold list-none"
                                        />
                                    </div>
                                )}

                                {mode === 'register' && (
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-icons-round text-gray-300 group-focus-within:text-[#2bee79] transition-colors duration-300">verified_user</span>
                                        </div>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            placeholder="Confirmar Senha"
                                            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-[#2bee79] focus:ring-[6px] focus:ring-[#2bee79]/10 rounded-2xl text-slate-800 placeholder-gray-400 shadow-sm transition-all duration-300 outline-none font-semibold"
                                        />
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-bold flex items-center gap-2 animate-fade-in animate-scale-in">
                                        <span className="material-icons-round text-lg">error_outline</span>
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="p-4 rounded-2xl bg-[#2bee79]/10 border border-[#2bee79]/20 text-[#10b981] text-[13px] font-bold flex items-center gap-2 animate-fade-in animate-scale-in">
                                        <span className="material-icons-round text-lg">check_circle_outline</span>
                                        {success}
                                    </div>
                                )}

                                {mode === 'login' && (
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setMode('reset')}
                                            className="text-xs font-black text-slate-400 hover:text-[#3b82f6] transition-colors uppercase tracking-widest"
                                        >
                                            Perdeu a chave?
                                        </button>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full relative bg-[#2bee79] hover:bg-[#2bee79]/90 text-slate-900 font-[900] text-sm py-5 rounded-2xl btn-3d uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none disabled:box-shadow-none transition-all duration-300 active:scale-95"
                                >
                                    {loading ? 'Processando...' : (
                                        <>
                                            {mode === 'login' ? 'Executar Login' : mode === 'register' ? 'Registrar Comando' : 'Sincronizar'}
                                            <span className="material-icons-round text-xl">play_arrow</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {mode === 'login' && (
                                <>
                                    <div className="relative my-10">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-slate-100"></div>
                                        </div>
                                        <div className="relative flex justify-center text-[10px]">
                                            <span className="px-5 bg-white text-slate-400 rounded-full font-[900] uppercase tracking-[0.34em]">
                                                Protocolos Externos
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="flex items-center justify-center gap-3 py-3 px-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-[#2bee79]/30 hover:shadow-md transition-all duration-300 group">
                                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAve0UVazEdG-l4YxuPH490Nem3bVc0yM-Ru7OSp3UnHLWLQXZAyTMhl1cvhIKhunqNsUDcD5_inhsHNVkxBEls0qxpnlBJz2gDRB8LVmDXhxlI7dUakcP4NGTxz9jmpSDJzX_prws9zG4-DoTluGLDLE3OEPrtdg2Nd6MAecWEl5CDpfnh5nTRvaRtLc3_xdQDhy6TL0mwoa4_z6k0-afnDjPUfERm8cLHhKKyWm63ZKn1gju0YBhVnWqB2aEyCYuasz-puan7hfs" alt="Google" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Google</span>
                                        </button>
                                        <button className="flex items-center justify-center gap-3 py-3 px-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-[#2bee79]/30 hover:shadow-md transition-all duration-300 group">
                                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw7bLinxxqBSWAr8y27AIGRcEGN_N8vW2-HVRiBx0i97R94Jp_ga_0Sheww0LbFHqdb3HbZBwRTSyiqO3cXlpPocCxF6Mv7gGHQUkN_hJd2kk33_v4WvDJVVY3gWfC4VkBtEzkRcXiOCpIGm4rqzX3KwTrlra3NemQg5zDEmuqIeGWG-kqb6pjdec0XbBmCnMnvrxEpgacgpyXYiYBAMMoNzFrqXly2NZxGLCy4_FUJixH4XWeMnGauK-Wm-swZQGJZocxBg4wo9M" alt="Github" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Github</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Card Shadow Gradient Accent */}
                        <div className="absolute -bottom-6 left-10 right-10 h-10 bg-gradient-to-r from-[#2bee79]/20 to-[#3b82f6]/20 blur-2xl z-0 pointer-events-none rounded-full"></div>
                    </div>

                    {/* Footer Toggle */}
                    <div className="mt-12 text-center w-full">
                        <div className="inline-flex items-center bg-white/40 p-1 px-1 rounded-full border border-white/60 backdrop-blur-sm shadow-sm">
                            <button
                                onClick={() => setMode('login')}
                                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === 'login' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setMode('register')}
                                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === 'register' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Cadastro
                            </button>
                        </div>

                        {mode === 'reset' && (
                            <button
                                onClick={() => setMode('login')}
                                className="mt-6 flex items-center justify-center gap-2 mx-auto text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-slate-600 transition-colors"
                            >
                                <span className="material-icons-round text-sm">arrow_back</span>
                                Voltar para a base
                            </button>
                        )}
                    </div>
                </div>
            </main>

            {/* Bottom Credits / System Version */}
            <div className="absolute bottom-6 left-0 w-full flex justify-center z-10 pointer-events-none">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">SYSTEM v2.0 • COMMAND CENTER • ELITE</span>
            </div>
        </div>
    )
}


