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
      <div className="space-y-4">
        {/* Header - Compact */}
        <div className="border-4 border-old-ink bg-gradient-to-br from-old-paper to-amber-50 p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2">
            <span className="text-3xl md:text-4xl">🏆</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wider">Leaderboard</h1>
              <p className="text-old-grey text-xs uppercase tracking-wider">Top Contributors</p>
            </div>
          </div>
        </div>

        {/* Top 3 Podium - Compact */}
        {!loading && leaders.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <PodiumCard user={leaders[1]} rank={2} />
            <PodiumCard user={leaders[0]} rank={1} />
            <PodiumCard user={leaders[2]} rank={3} />
          </div>
        )}

        {/* Leaderboard List - Compact */}
        <div className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="bg-gradient-to-r from-old-ink to-gray-800 text-old-paper p-3 border-b-4 border-old-ink">
            <h2 className="text-sm md:text-base font-bold uppercase tracking-wider">All Rankings</h2>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-old-grey uppercase tracking-wider text-xs">Loading...</p>
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-old-border m-3">
              <span className="text-4xl mb-2 block">📊</span>
              <p className="text-old-grey text-xs uppercase tracking-wider">No data</p>
            </div>
          ) : (
            <div className="divide-y-2 divide-old-border">
              {leaders.map((user: any, index: number) => (
                <LeaderRow key={user.id} user={user} rank={index + 1} />
              ))}
            </div>
          )}
        </div>

        {/* Info Box - Compact */}
        <div className="border-4 border-old-ink bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          <div className="bg-old-paper border-b-2 border-old-border p-3">
            <h3 className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
              <span>📊</span>
              <span>Score System</span>
            </h3>
          </div>
          
          <div className="p-3 md:p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border-2 border-green-600 bg-green-50 p-3">
                <h4 className="font-bold uppercase text-xs text-green-700 mb-2 pb-2 border-b-2 border-green-600">
                  ✓ Earn
                </h4>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex justify-between items-center">
                    <span className="text-old-grey">Return on time</span>
                    <span className="font-bold text-green-700 border border-green-600 px-1.5 py-0.5 bg-white">+10</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-old-grey">Donate book</span>
                    <span className="font-bold text-green-700 border border-green-600 px-1.5 py-0.5 bg-white">+20</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-old-grey">Write review</span>
                    <span className="font-bold text-green-700 border border-green-600 px-1.5 py-0.5 bg-white">+5</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-old-grey">Share idea</span>
                    <span className="font-bold text-green-700 border border-green-600 px-1.5 py-0.5 bg-white">+3</span>
                  </li>
                </ul>
              </div>
              
              <div className="border-2 border-red-600 bg-red-50 p-3">
                <h4 className="font-bold uppercase text-xs text-red-700 mb-2 pb-2 border-b-2 border-red-600">
                  ✗ Lose
                </h4>
                <ul className="space-y-1.5 text-xs">
                  <li className="flex justify-between items-center">
                    <span className="text-old-grey">Return late</span>
                    <span className="font-bold text-red-700 border border-red-600 px-1.5 py-0.5 bg-white">-15</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-old-grey">Lost book</span>
                    <span className="font-bold text-red-700 border border-red-600 px-1.5 py-0.5 bg-white">-50</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-old-grey">Negative review</span>
                    <span className="font-bold text-red-700 border border-red-600 px-1.5 py-0.5 bg-white">-10</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="text-old-grey">Idea downvoted</span>
                    <span className="font-bold text-red-700 border border-red-600 px-1.5 py-0.5 bg-white">-1</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function PodiumCard({ user, rank }: any) {
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return ''
  }

  const getHeight = (rank: number) => {
    if (rank === 1) return 'h-20 md:h-28'
    if (rank === 2) return 'h-16 md:h-24'
    if (rank === 3) return 'h-14 md:h-20'
    return 'h-14'
  }

  const getBgColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-orange-400 to-orange-600'
    return 'from-gray-200 to-gray-300'
  }

  const getBorderColor = (rank: number) => {
    if (rank === 1) return 'border-yellow-600'
    if (rank === 2) return 'border-gray-600'
    if (rank === 3) return 'border-orange-600'
    return 'border-old-ink'
  }

  return (
    <div className={`flex flex-col items-center ${rank === 1 ? 'order-2' : rank === 2 ? 'order-1' : 'order-3'}`}>
      {/* User Card - Compact */}
      <div className={`border-2 md:border-4 ${getBorderColor(rank)} bg-white p-1.5 md:p-2 mb-1.5 md:mb-2 w-full shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}>
        <div className="text-center mb-1">
          <div className="text-xl md:text-3xl">{getMedalIcon(rank)}</div>
        </div>
        <p className="font-bold text-xs uppercase tracking-wider truncate text-center mb-0.5">
          {user.full_name || user.username}
        </p>
        <p className="text-xs text-old-grey text-center truncate mb-1.5">@{user.username}</p>
        <div className="border-t border-old-border pt-1.5">
          <p className="text-xl md:text-2xl font-bold text-center">{user.success_score}</p>
          <p className="text-xs text-old-grey uppercase text-center">Pts</p>
        </div>
      </div>
      
      {/* Podium Base - Compact */}
      <div className={`w-full ${getHeight(rank)} bg-gradient-to-b ${getBgColor(rank)} border-2 md:border-4 ${getBorderColor(rank)} border-t-0 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}>
        <span className="text-xl md:text-3xl font-bold text-white opacity-30">#{rank}</span>
      </div>
    </div>
  )
}

function LeaderRow({ user, rank }: any) {
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return null
  }

  const getRowBg = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50'
    if (rank === 2) return 'bg-gray-50'
    if (rank === 3) return 'bg-orange-50'
    return 'hover:bg-old-paper'
  }

  return (
    <div className={`p-2 md:p-3 ${getRowBg(rank)} transition-all`}>
      <div className="flex items-center gap-2 md:gap-3">
        {/* Rank - Compact */}
        <div className="flex-shrink-0 w-10 md:w-12 text-center">
          {getMedalIcon(rank) ? (
            <div className="text-xl md:text-2xl">{getMedalIcon(rank)}</div>
          ) : (
            <div className="border-2 border-old-ink bg-white px-1.5 py-0.5 font-bold text-xs md:text-sm">
              #{rank}
            </div>
          )}
        </div>

        {/* User Info - Compact */}
        <div className="flex-1 min-w-0">
          <p className="font-bold uppercase text-xs md:text-sm tracking-wider truncate">
            {user.full_name || user.username}
          </p>
          <p className="text-xs text-old-grey truncate">@{user.username}</p>
        </div>

        {/* Stats - Compact, Hidden on mobile */}
        <div className="hidden sm:flex gap-2 md:gap-3">
          <div className="text-center border border-old-border bg-white px-2 py-0.5">
            <p className="text-sm md:text-base font-bold">{user.books_shared || 0}</p>
            <p className="text-xs uppercase text-old-grey">Shared</p>
          </div>
          <div className="text-center border border-old-border bg-white px-2 py-0.5">
            <p className="text-sm md:text-base font-bold">{user.books_received || 0}</p>
            <p className="text-xs uppercase text-old-grey">Received</p>
          </div>
        </div>

        {/* Success Score - Compact */}
        <div className="flex-shrink-0">
          <div className="border-2 md:border-4 border-old-ink bg-old-ink text-old-paper px-2 md:px-3 py-1.5 md:py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] text-center">
            <p className="text-lg md:text-xl font-bold">{user.success_score}</p>
            <p className="text-xs uppercase tracking-wider hidden sm:block">Score</p>
          </div>
        </div>
      </div>

      {/* Mobile Stats - Compact */}
      <div className="sm:hidden flex gap-2 mt-2 pt-2 border-t border-old-border">
        <div className="flex-1 text-center border border-old-border bg-white py-0.5">
          <p className="text-xs font-bold">{user.books_shared || 0}</p>
          <p className="text-xs uppercase text-old-grey">Shared</p>
        </div>
        <div className="flex-1 text-center border border-old-border bg-white py-0.5">
          <p className="text-xs font-bold">{user.books_received || 0}</p>
          <p className="text-xs uppercase text-old-grey">Received</p>
        </div>
      </div>
    </div>
  )
}
