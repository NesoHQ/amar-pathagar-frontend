'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { ToastContainer } from './Toast'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { toasts, removeToast } = useToastStore()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="flex flex-col min-h-screen old-paper-texture">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      {/* Classic Header */}
      <header className="bg-white border-b-4 border-old-ink shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="text-4xl">📚</div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-old-ink">
                  Amar Pathagar
                </h1>
                <p className="text-xs text-old-grey uppercase tracking-widest hidden sm:block">Community Library</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden lg:flex space-x-1">
                <NavLink href="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
                <NavLink href="/books" active={isActive('/books')}>Books</NavLink>
                <NavLink href="/my-library" active={isActive('/my-library')}>My Library</NavLink>
                <NavLink href="/leaderboard" active={isActive('/leaderboard')}>Leaderboard</NavLink>
                <NavLink href="/donations" active={isActive('/donations')}>Donations</NavLink>
                {user?.role === 'admin' && (
                  <NavLink href="/admin" active={isActive('/admin')}>Admin</NavLink>
                )}
              </nav>
            )}

            {/* Desktop User Info */}
            {isAuthenticated && user && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-bold text-old-ink text-sm">{user.full_name || user.username}</div>
                  <div className="text-xs text-old-grey uppercase">
                    Score: {user.success_score}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border-2 border-old-ink text-old-ink font-bold uppercase text-xs
                           hover:bg-old-ink hover:text-old-paper transition-colors"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            {isAuthenticated && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 border-2 border-old-ink text-old-ink hover:bg-old-ink hover:text-old-paper transition-colors"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          {isAuthenticated && mobileMenuOpen && (
            <div className="lg:hidden mt-4 pt-4 border-t-2 border-old-border">
              {/* Mobile User Info */}
              {user && (
                <div className="mb-4 pb-4 border-b-2 border-old-border">
                  <div className="font-bold text-old-ink">{user.full_name || user.username}</div>
                  <div className="text-xs text-old-grey uppercase mt-1">
                    Score: {user.success_score} • {user.role}
                  </div>
                </div>
              )}

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <MobileNavLink href="/dashboard" active={isActive('/dashboard')} onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </MobileNavLink>
                <MobileNavLink href="/books" active={isActive('/books')} onClick={() => setMobileMenuOpen(false)}>
                  Books
                </MobileNavLink>
                <MobileNavLink href="/my-library" active={isActive('/my-library')} onClick={() => setMobileMenuOpen(false)}>
                  My Library
                </MobileNavLink>
                <MobileNavLink href="/leaderboard" active={isActive('/leaderboard')} onClick={() => setMobileMenuOpen(false)}>
                  Leaderboard
                </MobileNavLink>
                <MobileNavLink href="/donations" active={isActive('/donations')} onClick={() => setMobileMenuOpen(false)}>
                  Donations
                </MobileNavLink>
                {user?.role === 'admin' && (
                  <MobileNavLink href="/admin" active={isActive('/admin')} onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </MobileNavLink>
                )}
              </nav>

              {/* Mobile Logout */}
              <button
                onClick={handleLogout}
                className="w-full mt-4 px-4 py-2 border-2 border-old-ink text-old-ink font-bold uppercase text-sm
                         hover:bg-old-ink hover:text-old-paper transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - Flex Grow */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>

      {/* Sticky Footer - Compact and Attractive */}
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
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 font-bold uppercase text-xs tracking-wider transition-colors whitespace-nowrap
        ${active 
          ? 'bg-old-ink text-old-paper' 
          : 'text-old-ink hover:bg-old-grey hover:text-old-paper'
        }`}
    >
      {children}
    </Link>
  )
}

function MobileNavLink({ href, active, children, onClick }: { href: string; active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-4 py-3 font-bold uppercase text-sm tracking-wider transition-colors border-2
        ${active 
          ? 'bg-old-ink text-old-paper border-old-ink' 
          : 'text-old-ink border-old-border hover:bg-old-ink hover:text-old-paper hover:border-old-ink'
        }`}
    >
      {children}
    </Link>
  )
}
