import { usePresence } from '../hooks/usePresence'

export function OnlineUsers() {
    const { onlineUsers, onlineCount } = usePresence()

    if (onlineCount === 0) {
        return (
            <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="w-2 h-2 bg-gray-300 rounded-full" />
                <span>Nenhum usuário online</span>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
                {onlineUsers.slice(0, 5).map((user) => (
                    <div
                        key={user.user_id}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white cursor-pointer hover:scale-110 transition-transform"
                        title={`${user.display_name} - online desde ${new Date(user.online_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}`}
                    >
                        {user.display_name.charAt(0).toUpperCase()}
                    </div>
                ))}
                {onlineCount > 5 && (
                    <div
                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium border-2 border-white"
                        title={`+${onlineCount - 5} outros usuários online`}
                    >
                        +{onlineCount - 5}
                    </div>
                )}
            </div>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">
                    {onlineCount} {onlineCount === 1 ? 'online' : 'online'}
                </span>
            </div>
        </div>
    )
}

// Compact version for smaller spaces
export function OnlineUsersCompact() {
    const { onlineCount } = usePresence()

    return (
        <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">
                {onlineCount} online
            </span>
        </div>
    )
}

// Badge version for headers
export function OnlineUsersBadge() {
    const { onlineCount } = usePresence()

    if (onlineCount === 0) return null

    return (
        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            {onlineCount} online
        </div>
    )
}
