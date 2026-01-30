'use client'

import { useEffect, useState } from 'react'
import { notificationAPI } from '@/lib/notificationApi'
import { useAuthStore } from '@/store/authStore'

export default function NotificationBell() {
  const { isAuthenticated } = useAuthStore()
  const [notifications, setNotifications] = useState<any[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications()
      const interval = setInterval(loadNotifications, 30000) // Refresh every 30s
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getAll()
      const data = response.data.data || response.data || []
      const notifList = Array.isArray(data) ? data : []
      setNotifications(notifList)
      setUnreadCount(notifList.filter((n: any) => !n.is_read).length)
    } catch (err) {
      console.error('Failed to load notifications:', err)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id)
      loadNotifications()
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      loadNotifications()
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative px-3 py-2 border-2 border-old-ink hover:bg-old-ink hover:text-old-paper transition-all"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-80 md:w-96 border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] z-20 max-h-96 overflow-y-auto">
            <div className="bg-old-ink text-old-paper p-3 flex items-center justify-between sticky top-0">
              <h3 className="font-bold uppercase text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs underline hover:opacity-75"
                >
                  Mark all read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="p-6 text-center text-old-grey text-sm">
                No notifications
              </div>
            ) : (
              <div className="divide-y-2 divide-old-border">
                {notifications.map((notif: any) => (
                  <div
                    key={notif.id}
                    className={`p-3 hover:bg-gray-50 transition-all cursor-pointer ${
                      !notif.is_read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      if (!notif.is_read) handleMarkAsRead(notif.id)
                      if (notif.link) window.location.href = notif.link
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl flex-shrink-0">
                        {notif.type === 'request_approved' ? '✅' :
                         notif.type === 'book_available' ? '📚' :
                         notif.type === 'return_due' ? '⏰' :
                         notif.type === 'review_received' ? '⭐' :
                         notif.type === 'idea_vote' ? '💡' : '🔔'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm mb-1">{notif.title}</p>
                        <p className="text-xs text-old-grey mb-1">{notif.message}</p>
                        <p className="text-xs text-old-grey">
                          {new Date(notif.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
