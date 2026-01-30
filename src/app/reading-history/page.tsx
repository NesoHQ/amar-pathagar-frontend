'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { booksAPI } from '@/lib/api'

export default function ReadingHistoryPage() {
  const router = useRouter()
  const { isAuthenticated, user, _hasHydrated } = useAuthStore()
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'completed' | 'reading'>('all')

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login')
    } else if (isAuthenticated) {
      loadHistory()
    }
  }, [isAuthenticated, _hasHydrated, router])

  const loadHistory = async () => {
    try {
      const response = await booksAPI.getMyReadingHistory()
      const historyData = response.data.data || response.data || []
      setHistory(Array.isArray(historyData) ? historyData : [])
    } catch (error) {
      console.error('Failed to load reading history:', error)
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  const filteredHistory = history.filter(h => {
    if (filter === 'completed') return h.end_date
    if (filter === 'reading') return !h.end_date
    return true
  })

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  if (!_hasHydrated || !isAuthenticated || !user) {
    return null
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-4 border-old-ink bg-gradient-to-br from-old-paper to-amber-50 p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 text-9xl opacity-5">📚</div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">📖</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">Reading History</h1>
                <p className="text-old-grey text-sm uppercase tracking-wider">Your Literary Journey</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border-2 border-old-ink bg-white p-4 text-center">
                <p className="text-3xl md:text-4xl font-bold">{history.length}</p>
                <p className="text-xs uppercase text-old-grey mt-1">Total Books</p>
              </div>
              <div className="border-2 border-old-ink bg-white p-4 text-center">
                <p className="text-3xl md:text-4xl font-bold">
                  {history.filter(h => h.end_date).length}
                </p>
                <p className="text-xs uppercase text-old-grey mt-1">Completed</p>
              </div>
              <div className="border-2 border-old-ink bg-white p-4 text-center">
                <p className="text-3xl md:text-4xl font-bold">
                  {history.filter(h => !h.end_date).length}
                </p>
                <p className="text-xs uppercase text-old-grey mt-1">Reading</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="border-4 border-old-ink bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          <div className="p-4 flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Books', icon: '📚' },
              { key: 'completed', label: 'Completed', icon: '✓' },
              { key: 'reading', label: 'Currently Reading', icon: '📖' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 border-2 font-bold uppercase text-xs tracking-wider transition-all
                  ${filter === tab.key
                    ? 'bg-old-ink text-old-paper border-old-ink'
                    : 'bg-white text-old-ink border-old-border hover:border-old-ink'
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="bg-gradient-to-r from-old-ink to-gray-800 text-old-paper p-4 border-b-4 border-old-ink flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wider">
              {filter === 'all' ? 'All Books' : filter === 'completed' ? 'Completed Books' : 'Currently Reading'}
            </h2>
            <span className="px-2 py-1 bg-old-paper text-old-ink text-xs font-bold">
              {filteredHistory.length}
            </span>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-old-grey uppercase tracking-wider">Loading...</p>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-old-border">
                <span className="text-5xl mb-3 block">📚</span>
                <p className="text-old-grey text-sm uppercase tracking-wider mb-2">No books in this category</p>
                <p className="text-old-grey text-xs mb-6">Start your reading journey!</p>
                <button
                  onClick={() => router.push('/books')}
                  className="px-6 py-3 border-4 border-old-ink bg-old-ink text-old-paper hover:bg-gray-800 
                           font-bold uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                >
                  Browse Books
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((item: any) => {
                  const duration = calculateDuration(item.start_date, item.end_date)
                  const isCompleted = !!item.end_date

                  return (
                    <div
                      key={item.id}
                      className={`border-2 p-4 transition-all cursor-pointer hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
                        ${isCompleted 
                          ? 'border-green-200 bg-gradient-to-r from-green-50 to-white hover:border-green-600' 
                          : 'border-blue-200 bg-gradient-to-r from-blue-50 to-white hover:border-blue-600'
                        }`}
                      onClick={() => router.push(`/books/${item.book_id}`)}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{isCompleted ? '✓' : '📖'}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold uppercase text-lg mb-1 truncate">
                            {item.book?.title || 'Unknown Book'}
                          </h3>
                          <p className="text-sm text-old-grey mb-3">
                            {item.book?.author || 'Unknown Author'}
                          </p>

                          {/* Timeline */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div className="border-l-4 border-old-ink pl-3">
                              <p className="text-old-grey uppercase font-bold mb-1">Started</p>
                              <p className="font-mono">
                                {new Date(item.start_date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>

                            {isCompleted && (
                              <div className="border-l-4 border-green-600 pl-3">
                                <p className="text-old-grey uppercase font-bold mb-1">Completed</p>
                                <p className="font-mono">
                                  {new Date(item.end_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                            )}

                            <div className={`border-l-4 pl-3 ${isCompleted ? 'border-green-600' : 'border-blue-600'}`}>
                              <p className="text-old-grey uppercase font-bold mb-1">Duration</p>
                              <p className="font-mono">
                                {duration} {duration === 1 ? 'day' : 'days'}
                                {!isCompleted && ' (ongoing)'}
                              </p>
                            </div>
                          </div>

                          {/* Rating & Notes */}
                          {item.rating && (
                            <div className="mt-3 pt-3 border-t-2 border-old-border">
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-500">{'⭐'.repeat(item.rating)}</span>
                                <span className="text-xs text-old-grey uppercase">
                                  {item.rating}/5 Rating
                                </span>
                              </div>
                            </div>
                          )}

                          {item.notes && (
                            <div className="mt-2 p-3 bg-old-paper border-2 border-old-border">
                              <p className="text-xs text-old-grey uppercase font-bold mb-1">Notes</p>
                              <p className="text-sm">{item.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
