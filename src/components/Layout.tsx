'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { ToastContainer } from './Toast'
import NotificationBell from './NotificationBell'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { toasts, removeToast } = useToastStore()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const isActive = (path: string) => pathname === path

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex min-h-screen old-paper-texture">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Sidebar */}
      {isAuthenticated && (
        <>
          {/* Overlay for mobile */}
          {isMobile && sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside className={`
            fixed lg:sticky top-0 left-0 h-screen z-50
            bg-white border-r-4 border-old-ink shadow-lg
            transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'w-64' : 'w-16'}
            ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          `}>
            <div className="flex flex-col h-full">
              {/* Logo & Toggle */}
              <div className="p-4 border-b-4 border-old-ink bg-gradient-to-br from-old-paper to-amber-50">
                <div className="flex items-center justify-between">
                  {sidebarOpen ? (
                    <Link href="/dashboard" className="flex items-center gap-2" onClick={closeSidebarOnMobile}>
                      <span className="text-3xl">📚</span>
                      <div>
                        <h1 className="text-lg font-bold uppercase tracking-wider text-old-ink">
                          Amar Pathagar
                        </h1>
                        <p className="text-xs text-old-grey uppercase">Library</p>
                      </div>
                    </Link>
                  ) : (
                    <Link href="/dashboard" className="mx-auto">
                      <span className="text-3xl">📚</span>
                    </Link>
                  )}
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1 hover:bg-old-ink hover:text-old-paper transition-colors border-2 border-old-ink"
                    title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {sidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* User Info */}
              {user && (
                <div className="p-4 border-b-2 border-old-border bg-gradient-to-br from-white to-gray-50">
                  {sidebarOpen ? (
                    <button
                      onClick={() => { router.push('/profile/edit'); closeSidebarOnMobile(); }}
                      className="w-full text-left hover:opacity-75 transition-opacity"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 border-2 border-old-ink bg-old-paper flex items-center justify-center text-xl">
                          👤
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{user.full_name || user.username}</div>
                          <div className="text-xs text-old-grey uppercase">Score: {user.success_score}</div>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => { router.push('/profile/edit'); closeSidebarOnMobile(); }}
                      className="w-full flex justify-center"
                      title={user.full_name || user.username}
                    >
                      <div className="w-10 h-10 border-2 border-old-ink bg-old-paper flex items-center justify-center text-xl">
                        👤
                      </div>
                    </button>
                  )}
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-2">
                <SidebarLink 
                  href="/dashboard" 
                  icon="🏠" 
                  label="Dashboard" 
                  active={isActive('/dashboard')}
                  collapsed={!sidebarOpen}
                  onClick={closeSidebarOnMobile}
                />
                <SidebarLink 
                  href="/books" 
                  icon="📚" 
                  label="Books" 
                  active={isActive('/books')}
                  collapsed={!sidebarOpen}
                  onClick={closeSidebarOnMobile}
                />
                <SidebarLink 
                  href="/my-library" 
                  icon="📖" 
                  label="My Library" 
                  active={isActive('/my-library')}
                  collapsed={!sidebarOpen}
                  onClick={closeSidebarOnMobile}
                />
                <SidebarLink 
                  href="/reading-history" 
                  icon="📜" 
                  label="History" 
                  active={isActive('/reading-history')}
                  collapsed={!sidebarOpen}
                  onClick={closeSidebarOnMobile}
                />
                <SidebarLink 
                  href="/reviews" 
                  icon="⭐" 
                  label="Reviews" 
                  active={isActive('/reviews')}
                  collapsed={!sidebarOpen}
                  onClick={closeSidebarOnMobile}
                />
                <SidebarLink 
                  href="/leaderboard" 
                  icon="🏆" 
                  label="Leaderboard" 
                  active={isActive('/leaderboard')}
                  collapsed={!sidebarOpen}
                  onClick={closeSidebarOnMobile}
                />
                <SidebarLink 
                  href="/donations" 
                  icon="🎁" 
                  label="Donations" 
                  active={isActive('/donations')}
                  collapsed={!sidebarOpen}
                  onClick={closeSidebarOnMobile}
                />
                
                {user?.role === 'admin' && (
                  <>
                    <div className={`my-2 border-t-2 border-old-border ${!sidebarOpen && 'mx-2'}`} />
                    <SidebarLink 
                      href="/admin" 
                      icon="⚙️" 
                      label="Admin" 
                      active={isActive('/admin')}
                      collapsed={!sidebarOpen}
                      onClick={closeSidebarOnMobile}
                    />
                  </>
                )}
              </nav>

              {/* Notifications & Logout */}
              <div className="p-2 border-t-2 border-old-border bg-gradient-to-br from-white to-gray-50">
                {sidebarOpen ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <NotificationBell />
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 border-2 border-old-ink text-old-ink font-bold uppercase text-xs
                               hover:bg-old-ink hover:text-old-paper transition-colors flex items-center gap-2"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <NotificationBell />
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full p-2 border-2 border-old-ink text-old-ink hover:bg-old-ink hover:text-old-paper transition-colors flex justify-center"
                      title="Logout"
                    >
                      <span className="text-xl">🚪</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar (Mobile) */}
        {isAuthenticated && (
          <header className="lg:hidden bg-white border-b-4 border-old-ink shadow-md sticky top-0 z-30">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 border-2 border-old-ink text-old-ink hover:bg-old-ink hover:text-old-paper transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <h1 className="text-lg font-bold uppercase tracking-wider text-old-ink">
                  Amar Pathagar
                </h1>
              </Link>
              <div className="w-10" /> {/* Spacer for centering */}
            </div>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8 max-w-7xl mx-auto">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-old-ink text-old-paper border-t-4 border-black mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Main Footer Content */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
              {/* Brand */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <div className="text-left">
                  <p className="font-bold uppercase tracking-wider text-base">Amar Pathagar</p>
                  <p className="text-xs opacity-75">Est. 2026</p>
                </div>
              </div>

              {/* Philosophy - Inline */}
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs">
                <span className="uppercase tracking-wider opacity-75 hover:opacity-100 transition-opacity">Trust-Based</span>
                <span className="opacity-30">|</span>
                <span className="uppercase tracking-wider opacity-75 hover:opacity-100 transition-opacity">Knowledge Over Hoarding</span>
                <span className="opacity-30">|</span>
                <span className="uppercase tracking-wider opacity-75 hover:opacity-100 transition-opacity">Reputation Through Contribution</span>
              </div>

              {/* Developer Credits */}
              <div className="text-xs text-center md:text-right">
                <p className="opacity-75 mb-1">
                  by{' '}
                  <a 
                    href="https://github.com/NesoHQ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-bold hover:underline hover:opacity-100 transition-opacity"
                  >
                    NesoHQ
                  </a>
                </p>
                <a 
                  href="https://github.com/NesoHQ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:opacity-100 opacity-60 transition-opacity"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center pt-4 border-t border-old-paper border-opacity-10">
              <p className="text-xs opacity-50">
                © 2026 Amar Pathagar. A Trust-Based Reading Network.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function SidebarLink({ 
  href, 
  icon, 
  label, 
  active, 
  collapsed,
  onClick 
}: { 
  href: string
  icon: string
  label: string
  active: boolean
  collapsed: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 mb-1 font-bold uppercase text-xs tracking-wider transition-all
        ${active 
          ? 'bg-old-ink text-old-paper border-2 border-old-ink' 
          : 'text-old-ink hover:bg-old-grey hover:text-old-paper border-2 border-transparent'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
      title={collapsed ? label : undefined}
    >
      <span className="text-xl">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  )
}
