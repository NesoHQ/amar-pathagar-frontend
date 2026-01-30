'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { booksAPI } from '@/lib/api'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, _hasHydrated } = useAuthStore()
  const { success, error } = useToastStore()
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    booksReading: 0,
  })
  const [myRequests, setMyRequests] = useState<any[]>([])

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, _hasHydrated, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadStats()
      loadMyRequests()
    }
  }, [isAuthenticated])

  const loadStats = async () => {
    try {
      const response = await booksAPI.getAll()
      const books = response.data.data || []
      setStats({
        totalBooks: books.length,
        availableBooks: books.filter((b: any) => b.status === 'available').length,
        booksReading: books.filter((b: any) => b.status === 'reading').length,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const loadMyRequests = async () => {
    try {
      const response = await booksAPI.getMyRequests()
      const requestsData = response.data.data || response.data || []
      setMyRequests(Array.isArray(requestsData) ? requestsData : [])
    } catch (error) {
      console.error('Failed to load requests:', error)
      setMyRequests([])
    }
  }

  const handleCancelRequest = async (bookId: string, bookTitle: string) => {
    try {
      await booksAPI.cancelRequest(bookId)
      success(`Request for "${bookTitle}" cancelled successfully!`)
      loadMyRequests()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to cancel request')
    }
  }

  if (!_hasHydrated || !isAuthenticated || !user) {
    return null
  }

  return (
    <Layout>
      <div className="space-y-6 md:space-y-8">
        {/* Welcome Section */}
        <div className="classic-card">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider mb-2 md:mb-4">
            Welcome, {user.full_name || user.username}
          </h1>
          <p className="text-old-grey text-sm md:text-base lg:text-lg">
            Your personal library dashboard
          </p>
        </div>

        {/* Success Score Card */}
        <div className="classic-card bg-old-ink text-old-paper">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="text-xs md:text-sm uppercase tracking-widest opacity-75 mb-2">Success Score</p>
              <p className="text-5xl md:text-6xl font-bold">{user.success_score}</p>
              <p className="text-xs md:text-sm uppercase tracking-wider mt-2 opacity-75">
                {user.success_score >= 100 ? 'Excellent Standing' : 
                 user.success_score >= 50 ? 'Good Standing' : 
                 user.success_score >= 20 ? 'Fair Standing' : 'Low Priority'}
              </p>
            </div>
            <div className="flex sm:flex-col gap-8 sm:gap-4 text-center sm:text-right">
              <div>
                <p className="text-2xl md:text-3xl font-bold">{user.books_shared}</p>
                <p className="text-xs uppercase tracking-wider opacity-75">Books Shared</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold">{user.books_received}</p>
                <p className="text-xs uppercase tracking-wider opacity-75">Books Read</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            subtitle="In Library"
          />
          <StatCard
            title="Available"
            value={stats.availableBooks}
            subtitle="Ready to Borrow"
          />
          <StatCard
            title="In Circulation"
            value={stats.booksReading}
            subtitle="Currently Reading"
          />
        </div>

        {/* Quick Actions */}
        <div className="classic-card">
          <h2 className="classic-heading text-xl md:text-2xl">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <ActionButton
              title="Browse Books"
              description="Explore available books"
              href="/books"
              icon="📚"
            />
            <ActionButton
              title="My Library"
              description="View your books"
              href="/my-library"
              icon="📖"
            />
            <ActionButton
              title="Leaderboard"
              description="Top contributors"
              href="/leaderboard"
              icon="🏆"
            />
            <ActionButton
              title="Donate"
              description="Support the community"
              href="/donations"
              icon="🎁"
            />
          </div>
        </div>

        {/* My Book Requests */}
        {myRequests.length > 0 && (
          <div className="classic-card">
            <h2 className="classic-heading text-xl md:text-2xl mb-4">📬 My Book Requests</h2>
            <div className="space-y-3">
              {myRequests.map((request: any) => (
                <div 
                  key={request.id} 
                  className="p-3 md:p-4 border-2 border-old-border hover:border-old-ink transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold uppercase text-sm md:text-base">
                        {request.book?.title || 'Unknown Book'}
                      </h3>
                      <p className="text-xs md:text-sm text-old-grey">
                        {request.book?.author || 'Unknown Author'}
                      </p>
                      <p className="text-xs text-old-grey mt-1">
                        Requested: {new Date(request.requested_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center w-full sm:w-auto">
                      <span className="vintage-badge text-xs">{request.status}</span>
                      <button 
                        className="flex-1 sm:flex-none classic-button-secondary text-xs px-3 py-2"
                        onClick={() => router.push(`/books/${request.book_id}`)}
                      >
                        View
                      </button>
                      <button 
                        className="flex-1 sm:flex-none px-3 py-2 border-2 border-red-600 text-red-600 font-bold uppercase text-xs
                                 hover:bg-red-600 hover:text-white transition-all"
                        onClick={() => handleCancelRequest(request.book_id, request.book?.title || 'this book')}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Philosophy Box */}
        <div className="border-2 md:border-4 border-old-ink p-4 md:p-6 bg-white">
          <p className="text-center font-bold uppercase tracking-wider text-base md:text-lg mb-4">
            Core Philosophy
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs md:text-sm">
            <div>
              <p className="font-bold uppercase">Trust-Based</p>
              <p className="text-old-grey">Reading Network</p>
            </div>
            <div>
              <p className="font-bold uppercase">Knowledge &gt; Hoarding</p>
              <p className="text-old-grey">Share Wisdom</p>
            </div>
            <div>
              <p className="font-bold uppercase">Reputation</p>
              <p className="text-old-grey">Through Contribution</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ title, value, subtitle }: { title: string; value: number; subtitle: string }) {
  return (
    <div className="classic-card text-center">
      <p className="text-xs md:text-sm uppercase tracking-widest text-old-grey mb-2">{title}</p>
      <p className="text-4xl md:text-5xl font-bold mb-2">{value}</p>
      <p className="text-xs uppercase tracking-wider text-old-grey">{subtitle}</p>
    </div>
  )
}

function ActionButton({ title, description, href, icon }: { 
  title: string; 
  description: string; 
  href: string; 
  icon: string 
}) {
  return (
    <a
      href={href}
      className="block p-3 md:p-4 border-2 border-old-border hover:border-old-ink hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] transition-all"
    >
      <div className="flex items-center space-x-3">
        <span className="text-2xl md:text-3xl">{icon}</span>
        <div>
          <p className="font-bold uppercase tracking-wider text-sm md:text-base">{title}</p>
          <p className="text-xs md:text-sm text-old-grey">{description}</p>
        </div>
      </div>
    </a>
  )
}
