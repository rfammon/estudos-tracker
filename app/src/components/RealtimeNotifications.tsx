import { useState, useRef, useEffect } from 'react'
import { useRealtimeNotifications, RealtimeNotification } from '../hooks/useRealtimeNotifications'

const notificationIcons: Record<RealtimeNotification['type'], string> = {
    achievement: '🏆',
    level_up: '⬆️',
    streak: '🔥',
    leaderboard: '📈',
    friend: '👥'
}

interface NotificationItemProps {
    notification: RealtimeNotification
    onMarkRead: (id: string) => void
}

function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
    return (
        <div
            className={`p-4 rounded-lg border transition-all cursor-pointer ${notification.read
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-purple-200 shadow-md hover:shadow-lg'
                }`}
            onClick={() => !notification.read && onMarkRead(notification.id)}
        >
            <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">
                    {notificationIcons[notification.type]}
                </span>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm">
                        {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                        {notification.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                        {new Date(notification.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                </div>
                {!notification.read && (
                    <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-2" />
                )}
            </div>
        </div>
    )
}

export function RealtimeNotifications() {
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications
    } = useRealtimeNotifications()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ''}`}
            >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notificações</h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-purple-600 hover:text-purple-700 font-medium"
                                >
                                    Marcar todas como lidas
                                </button>
                            )}
                            {notifications.length > 0 && (
                                <button
                                    onClick={clearNotifications}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    Limpar
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <span className="text-4xl mb-2 block">📭</span>
                                <p className="text-sm">Nenhuma notificação</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkRead={markAsRead}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
