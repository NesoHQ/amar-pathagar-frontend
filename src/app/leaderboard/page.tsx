'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { userAPI } from '@/lib/api'

export default function LeaderboardPage() {
  const router = useRouter()
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const [leaders, setLeaders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login')
    } else if (isAuthenticated) {
      loadLeaderboard()
    }
  }, [isAuthenticated, _hasHydrated, router])

  const loadLeaderboard = async () => {
    try {
      const response = await userAPI.getLeaderboard()
      const data = response.data.data || response.data || []
      setLeaders(Array.isArray(data) ? data : [])
    } catch (err: any) {
      console.error('Failed to load leaderboard:', err)
      setLeaders([])
    } finally {
      setLoading(false)
    }
  }

  if (!_hasHydrated || !isAuthenticated) {
    return null
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-4 border-old-ink bg-gradient-to-r from-yellow-600 to-orange-600 text-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <span className="text-5xl">🏆</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">Leaderboard</h1>
              <p className="text-white opacity-90 text-sm uppercase tracking-wider">Top Contributors</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-old-grey uppercase tracking-wider text-sm">Loading leaderboard...</p>
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-old-grey uppercase tracking-wider text-sm">No data available</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-old-border">
              {leaders.map((user: any, index: number) => (
                <LeaderCard key={user.id} user={user} rank={index + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="border-4 border-old-ink bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          <h3 className="font-bold uppercase tracking-wider mb-3 text-lg">📊 How Success Score Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-bold uppercase text-xs text-green-700 mb-2">Earn Points:</h4>
              <ul className="space-y-1 text-old-grey">
                <li>• Return book on time: +10</li>
                <li>• Positive review: +5</li>
                <li>• Post reading idea: +3</li>
                <li>• Idea upvoted: +1</li>
                <li>• Donate book: +20</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold uppercase text-xs text-red-700 mb-2">Lose Points:</h4>
              <ul className="space-y-1 text-old-grey">
                <li>• Return book late: -15</li>
                <li>• Negative review: -10</li>
                <li>• Idea downvoted: -1</li>
                <li>• Lost book: -50</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function LeaderCard({ user, rank }: any) {
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
    return 'bg-white'
  }

  return (
    <div className={`p-6 hover:bg-gray-50 transition-all ${getRankColor(rank)}`}>
      <div className="flex items-center gap-6">
        {/* Rank */}
        <div className="flex-shrink-0 w-16 text-center">
          <div className="text-4xl font-bold">
            {getMedalIcon(rank)}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold uppercase tracking-wider mb-1 truncate">
            {user.full_name || user.username}
          </h3>
          <p className="text-sm opacity-75 truncate">@{user.username}</p>
        </div>

        {/* Stats */}
        <div className="hidden md:flex gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold">{user.books_shared || 0}</p>
            <p className="text-xs uppercase opacity-75">Shared</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{user.books_received || 0}</p>
            <p className="text-xs uppercase opacity-75">Received</p>
          </div>
        </div>

        {/* Success Score */}
        <div className="flex-shrink-0 text-center">
          <div className={`px-6 py-3 border-4 ${
            rank <= 3 ? 'border-white bg-white/20' : 'border-old-ink bg-old-ink text-old-paper'
          } shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}>
            <p className="text-3xl font-bold">{user.success_score}</p>
            <p className="text-xs uppercase tracking-wider opacity-75">Score</p>
          </div>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="md:hidden flex gap-6 mt-4 pt-4 border-t-2 border-white/20">
        <div className="text-center flex-1">
          <p className="text-xl font-bold">{user.books_shared || 0}</p>
          <p className="text-xs uppercase opacity-75">Shared</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-xl font-bold">{user.books_received || 0}</p>
          <p className="text-xs uppercase opacity-75">Received</p>
        </div>
      </div>
    </div>
  )
}
