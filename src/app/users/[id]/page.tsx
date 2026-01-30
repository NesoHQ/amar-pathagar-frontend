'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { userAPI } from '@/lib/api'

export default function UserProfilePage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string
  const { isAuthenticated, _hasHydrated } = useAuthStore()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login')
    } else if (isAuthenticated && userId) {
      loadUserProfile()
    }
  }, [isAuthenticated, _hasHydrated, userId, router])

  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getProfile(userId)
      setUser(response.data.data || response.data)
    } catch (err: any) {
      console.error('Failed to load user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!_hasHydrated || !isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-old-grey uppercase tracking-wider">Loading profile...</p>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-old-grey uppercase tracking-wider">User not found</p>
        </div>
      </Layout>
    )
  }

  const getScoreStatus = (score: number) => {
    if (score >= 100) return { label: 'Excellent', color: 'text-green-700 bg-green-100' }
    if (score >= 50) return { label: 'Good', color: 'text-blue-700 bg-blue-100' }
    if (score >= 20) return { label: 'Fair', color: 'text-yellow-700 bg-yellow-100' }
    return { label: 'Low', color: 'text-red-700 bg-red-100' }
  }

  const scoreStatus = getScoreStatus(user.success_score)

  return (
    <Layout>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-old-ink bg-old-border flex items-center justify-center">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl md:text-6xl">👤</span>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider mb-2">
                  {user.full_name || user.username}
                </h1>
                <p className="text-old-grey text-base md:text-lg mb-4">@{user.username}</p>

                {user.bio && (
                  <p className="text-old-grey mb-4 border-l-4 border-old-ink pl-4 text-sm md:text-base">{user.bio}</p>
                )}

                <div className="flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start">
                  <div className={`px-3 md:px-4 py-2 border-2 border-old-ink ${scoreStatus.color} font-bold uppercase text-xs md:text-sm`}>
                    {scoreStatus.label} Standing
                  </div>
                  {user.is_donor && (
                    <div className="px-3 md:px-4 py-2 border-2 border-green-600 bg-green-100 text-green-700 font-bold uppercase text-xs md:text-sm">
                      🎁 Donor
                    </div>
                  )}
                  {user.role === 'admin' && (
                    <div className="px-3 md:px-4 py-2 border-2 border-red-600 bg-red-100 text-red-700 font-bold uppercase text-xs md:text-sm">
                      ⚙️ Admin
                    </div>
                  )}
                </div>
              </div>

              {/* Success Score */}
              <div className="flex-shrink-0 w-full md:w-auto text-center border-4 border-old-ink bg-gradient-to-br from-old-ink to-gray-800 text-old-paper p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <p className="text-xs uppercase tracking-widest opacity-75 mb-2">Success Score</p>
                <p className="text-4xl md:text-5xl font-bold">{user.success_score}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon="📚" label="Books Shared" value={user.books_shared || 0} />
          <StatCard icon="📖" label="Books Received" value={user.books_received || 0} />
          <StatCard icon="💡" label="Ideas Posted" value={user.ideas_posted || 0} />
          <StatCard icon="⭐" label="Total Upvotes" value={user.total_upvotes || 0} />
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="border-4 border-old-ink bg-white p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider mb-4">📊 Activity</h2>
            <div className="space-y-3">
              <InfoRow label="Reviews Received" value={user.reviews_received || 0} />
              <InfoRow label="Total Downvotes" value={user.total_downvotes || 0} />
              <InfoRow label="Member Since" value={new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} />
            </div>
          </div>

          {user.location_address && (
            <div className="border-4 border-old-ink bg-white p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold uppercase tracking-wider mb-4">📍 Location</h2>
              <p className="text-old-grey text-sm md:text-base">{user.location_address}</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <div className="border-2 border-old-border p-3 md:p-4 hover:border-old-ink transition-all">
      <div className="text-center">
        <div className="text-3xl md:text-4xl mb-2">{icon}</div>
        <p className="text-2xl md:text-3xl font-bold mb-1">{value}</p>
        <p className="text-xs uppercase tracking-wider text-old-grey">{label}</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-old-border pb-2">
      <span className="text-old-grey uppercase tracking-wider">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  )
}
