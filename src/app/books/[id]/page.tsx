'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { booksAPI, ideasAPI } from '@/lib/api'
import { handoverAPI } from '@/lib/handoverApi'

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user, _hasHydrated } = useAuthStore()
  const { success, error, warning } = useToastStore()
  const [book, setBook] = useState<any>(null)
  const [ideas, setIdeas] = useState<any[]>([])
  const [showIdeaForm, setShowIdeaForm] = useState(false)
  const [ideaForm, setIdeaForm] = useState({ title: '', content: '' })
  const [isRequested, setIsRequested] = useState(false)
  const [readingStatus, setReadingStatus] = useState<any>(null)
  const [handoverThread, setHandoverThread] = useState<any>(null)

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login')
    } else if (isAuthenticated && params.id) {
      loadBook()
      loadIdeas()
      checkIfRequested()
      loadReadingStatus()
      loadHandoverThread()
    }
  }, [isAuthenticated, _hasHydrated, params.id, router])

  const loadBook = async () => {
    try {
      const response = await booksAPI.getById(params.id as string)
      setBook(response.data.data || response.data)
    } catch (error) {
      console.error('Failed to load book:', error)
    }
  }

  const checkIfRequested = async () => {
    try {
      const response = await booksAPI.checkRequested(params.id as string)
      setIsRequested(response.data.data?.requested || response.data.requested || false)
    } catch (error) {
      console.error('Failed to check request status:', error)
    }
  }

  const loadReadingStatus = async () => {
    try {
      const response = await handoverAPI.getReadingStatus(params.id as string)
      setReadingStatus(response.data.data || response.data)
    } catch (error) {
      // Not the current holder, ignore
      setReadingStatus(null)
    }
  }

  const loadHandoverThread = async () => {
    try {
      const response = await handoverAPI.getActiveHandoverThread(params.id as string)
      setHandoverThread(response.data.data || response.data)
    } catch (error) {
      setHandoverThread(null)
    }
  }

  const handleMarkCompleted = async () => {
    if (!confirm('Mark this book as reading completed? This will prepare it for handover.')) return
    
    try {
      await handoverAPI.markBookCompleted(params.id as string)
      success('Book marked as completed!')
      loadReadingStatus()
      loadHandoverThread()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to mark book as completed')
    }
  }

  const handleMarkDelivered = async () => {
    if (!confirm('Confirm that you have received this book?')) return
    
    try {
      await handoverAPI.markBookDelivered(params.id as string)
      success('Book marked as delivered!')
      loadReadingStatus()
      loadHandoverThread()
      loadBook()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to mark book as delivered')
    }
  }

  const loadIdeas = async () => {
    try {
      const response = await ideasAPI.getByBook(params.id as string)
      const ideasData = response.data.data || response.data || []
      setIdeas(Array.isArray(ideasData) ? ideasData : [])
    } catch (error) {
      console.error('Failed to load ideas:', error)
      setIdeas([])
    }
  }

  const handleRequest = async () => {
    if (!user || user.success_score < 20) {
      warning('Your success score must be at least 20 to request books.')
      return
    }
    try {
      await booksAPI.request(params.id as string)
      success('Book requested successfully!')
      setIsRequested(true)
      loadBook()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to request book')
    }
  }

  const handleCancelRequest = async () => {
    try {
      await booksAPI.cancelRequest(params.id as string)
      success('Request cancelled successfully!')
      setIsRequested(false)
      loadBook()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to cancel request')
    }
  }

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await ideasAPI.create({
        book_id: params.id as string,
        ...ideaForm,
      })
      setIdeaForm({ title: '', content: '' })
      setShowIdeaForm(false)
      loadIdeas()
      success('Idea posted! +3 points')
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to post idea')
    }
  }

  const handleVote = async (ideaId: string, voteType: 'upvote' | 'downvote') => {
    try {
      await ideasAPI.vote(ideaId, voteType)
      success('Vote recorded!')
      loadIdeas()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to vote')
    }
  }

  if (!_hasHydrated || !isAuthenticated || !book) {
    return null
  }

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-600',
      reading: 'bg-blue-600',
      requested: 'bg-orange-600',
    }
    return colors[status as keyof typeof colors] || colors.available
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.push('/books')}
          className="flex items-center gap-2 px-4 py-2 border-2 border-old-ink hover:bg-old-ink hover:text-old-paper transition-all text-sm font-bold uppercase"
        >
          ← Back to Collection
        </button>

        {/* Book Card - Retro Library Card Style */}
        <div className="border-4 border-old-ink bg-gradient-to-br from-old-paper to-amber-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] relative overflow-hidden">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
            <div className="text-9xl">📚</div>
          </div>

          <div className="relative z-10 p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Book Cover - Compact */}
              <div className="md:col-span-3">
                <div className="border-4 border-old-ink shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] bg-white relative">
                  <div className="aspect-[3/4] bg-old-border flex items-center justify-center">
                    {book.cover_url ? (
                      <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-7xl">📖</span>
                    )}
                  </div>
                  {/* Status Badge */}
                  <div className={`${getStatusColor(book.status)} text-white text-center py-2 font-bold uppercase text-sm tracking-wider`}>
                    {book.status}
                  </div>
                </div>
              </div>

              {/* Book Information - Library Card Style */}
              <div className="md:col-span-9 space-y-4">
                {/* Title Section */}
                <div className="border-b-4 border-old-ink pb-4">
                  <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-2 leading-tight">
                    {book.title}
                  </h1>
                  <p className="text-lg md:text-xl text-old-grey uppercase tracking-wider">
                    by {book.author}
                  </p>
                </div>

                {/* Metadata Grid - Retro Style */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border-2 border-old-ink p-3 bg-white">
                    <p className="text-xs uppercase text-old-grey mb-1">Total Reads</p>
                    <p className="text-2xl font-bold">{book.total_reads}</p>
                  </div>
                  <div className="border-2 border-old-ink p-3 bg-white">
                    <p className="text-xs uppercase text-old-grey mb-1">Rating</p>
                    <p className="text-2xl font-bold">
                      {book.average_rating > 0 ? `★ ${book.average_rating.toFixed(1)}` : 'N/A'}
                    </p>
                  </div>
                  <div className="border-2 border-old-ink p-3 bg-white">
                    <p className="text-xs uppercase text-old-grey mb-1">Category</p>
                    <p className="text-sm font-bold uppercase truncate">{book.category || 'General'}</p>
                  </div>
                  <div className="border-2 border-old-ink p-3 bg-white">
                    <p className="text-xs uppercase text-old-grey mb-1">Reading Period</p>
                    <p className="text-2xl font-bold">{book.max_reading_days || 14}</p>
                    <p className="text-xs text-old-grey">days</p>
                  </div>
                </div>

                {/* ISBN Row */}
                {book.isbn && (
                  <div className="border-2 border-old-ink p-3 bg-white">
                    <p className="text-xs uppercase text-old-grey mb-1 font-bold">ISBN</p>
                    <p className="text-sm font-bold">{book.isbn}</p>
                  </div>
                )}

                {/* Description */}
                {book.description && (
                  <div className="border-2 border-old-ink p-4 bg-white">
                    <p className="text-xs uppercase text-old-grey mb-2 font-bold">Description</p>
                    <p className="text-sm text-old-grey leading-relaxed">{book.description}</p>
                  </div>
                )}

                {/* Tags */}
                {book.tags && book.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 border-2 border-old-ink text-xs uppercase font-bold bg-white">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {isRequested ? (
                    <>
                      <div className="flex-1 p-3 border-4 border-green-600 bg-green-50 text-center">
                        <p className="text-lg font-bold uppercase text-green-700 tracking-wider">
                          ✓ Requested
                        </p>
                      </div>
                      <button 
                        onClick={handleCancelRequest}
                        className="px-6 py-3 border-2 border-red-600 text-red-600 font-bold uppercase text-sm
                                 hover:bg-red-600 hover:text-white transition-all"
                      >
                        Cancel Request
                      </button>
                    </>
                  ) : book.status === 'available' ? (
                    <button 
                      onClick={handleRequest} 
                      className="flex-1 px-6 py-3 border-2 border-old-ink bg-old-ink text-old-paper font-bold uppercase text-sm
                               hover:bg-white hover:text-old-ink transition-all"
                    >
                      Request This Book
                    </button>
                  ) : null}
                </div>

                {/* Current Holder */}
                {book.current_holder && (
                  <div className="border-2 border-old-ink p-3 bg-white">
                    <p className="text-xs uppercase text-old-grey mb-1 font-bold">Currently With</p>
                    <p className="text-sm font-bold">{book.current_holder.full_name || book.current_holder.username}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Handover Status Section */}
        {(readingStatus || handoverThread) && (
          <div className="border-4 border-blue-600 bg-white shadow-[6px_6px_0px_0px_rgba(37,99,235,0.3)]">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 border-b-4 border-blue-600 flex items-center gap-2">
              <span className="text-xl">🔄</span>
              <h2 className="text-xl font-bold uppercase tracking-wider">Book Handover Status</h2>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Reading Status for Current Holder */}
              {readingStatus && (
                <div className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white p-4">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold uppercase text-sm mb-2 flex items-center gap-2">
                        <span className="text-xl">📖</span>
                        Your Reading Status
                      </h3>
                      <div className="space-y-2 text-sm">
                        {readingStatus.due_date && (
                          <div className="flex items-center gap-2">
                            <span className="text-old-grey">Due Date:</span>
                            <span className="font-bold">
                              {new Date(readingStatus.due_date).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                            {new Date(readingStatus.due_date) < new Date() && (
                              <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold uppercase">
                                Overdue
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-old-grey">Status:</span>
                          <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                            readingStatus.is_completed 
                              ? 'bg-green-600 text-white' 
                              : 'bg-blue-600 text-white'
                          }`}>
                            {readingStatus.is_completed ? 'Completed' : 'Reading'}
                          </span>
                        </div>
                        {readingStatus.delivery_status && (
                          <div className="flex items-center gap-2">
                            <span className="text-old-grey">Delivery:</span>
                            <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                              readingStatus.delivery_status === 'delivered' 
                                ? 'bg-green-600 text-white'
                                : readingStatus.delivery_status === 'in_transit'
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-600 text-white'
                            }`}>
                              {readingStatus.delivery_status.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                        {readingStatus.next_reader && (
                          <div className="flex items-center gap-2">
                            <span className="text-old-grey">Next Reader:</span>
                            <span className="font-bold">
                              {readingStatus.next_reader.full_name || readingStatus.next_reader.username}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {!readingStatus.is_completed && (
                      <button
                        onClick={handleMarkCompleted}
                        className="px-4 py-2 border-2 border-green-600 bg-green-600 text-white 
                                 hover:bg-green-700 font-bold uppercase text-xs tracking-wider transition-all"
                      >
                        ✓ Mark as Completed
                      </button>
                    )}
                    {readingStatus.is_completed && readingStatus.delivery_status === 'not_started' && (
                      <div className="px-4 py-2 border-2 border-orange-600 bg-orange-50 text-orange-700 
                                    font-bold uppercase text-xs tracking-wider">
                        ⏳ Waiting for handover coordination
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Next Reader Status */}
              {!readingStatus && handoverThread && handoverThread.current_holder_id !== user?.id && (
                <div className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-white p-4">
                  <h3 className="font-bold uppercase text-sm mb-3 flex items-center gap-2">
                    <span className="text-xl">📬</span>
                    You're Next in Line!
                  </h3>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-old-grey">Current Holder:</span>
                      <span className="font-bold">
                        {handoverThread.current_holder?.full_name || handoverThread.current_holder?.username}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-old-grey">Delivery Status:</span>
                      <span className={`px-2 py-0.5 text-xs font-bold uppercase ${
                        handoverThread.delivery_status === 'in_transit'
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-600 text-white'
                      }`}>
                        {handoverThread.delivery_status?.replace('_', ' ') || 'Not Started'}
                      </span>
                    </div>
                  </div>

                  {handoverThread.delivery_status === 'in_transit' && (
                    <button
                      onClick={handleMarkDelivered}
                      className="px-4 py-2 border-2 border-green-600 bg-green-600 text-white 
                               hover:bg-green-700 font-bold uppercase text-xs tracking-wider transition-all"
                    >
                      ✓ Confirm Delivery Received
                    </button>
                  )}
                </div>
              )}

              {/* Handover Thread Link */}
              {handoverThread && handoverThread.id && (
                <div className="border-2 border-old-ink bg-old-paper p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold uppercase text-sm mb-1 flex items-center gap-2">
                        <span className="text-xl">💬</span>
                        Handover Coordination Thread
                      </h3>
                      <p className="text-xs text-old-grey">
                        Coordinate the book handover with the other party
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/handover/${handoverThread.id}`)}
                      className="px-4 py-2 border-2 border-old-ink bg-old-ink text-old-paper 
                               hover:bg-white hover:text-old-ink font-bold uppercase text-xs tracking-wider transition-all"
                    >
                      Open Thread →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reading Ideas Section - Thread View */}
        <div className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="bg-gradient-to-r from-old-ink to-gray-800 text-old-paper p-4 border-b-4 border-old-ink flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">💬</span>
              <h2 className="text-xl font-bold uppercase tracking-wider">Discussion Thread</h2>
              <span className="px-2 py-0.5 bg-old-paper text-old-ink text-xs font-bold">
                {ideas.length} {ideas.length === 1 ? 'Post' : 'Posts'}
              </span>
            </div>
            <button
              onClick={() => setShowIdeaForm(!showIdeaForm)}
              className="px-4 py-2 border-2 border-old-paper text-old-paper font-bold uppercase text-xs
                       hover:bg-old-paper hover:text-old-ink transition-all"
            >
              {showIdeaForm ? 'Cancel' : '+ New Post'}
            </button>
          </div>

          <div className="p-4 md:p-6">
            {showIdeaForm && (
              <div className="mb-6 border-2 border-old-ink bg-old-paper p-4">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-old-border">
                  <span className="text-2xl">✍️</span>
                  <p className="font-bold uppercase text-sm">New Discussion Post</p>
                </div>
                <form onSubmit={handleSubmitIdea} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-old-grey">Subject</label>
                    <input
                      type="text"
                      value={ideaForm.title}
                      onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none text-sm"
                      placeholder="Enter discussion topic..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-old-grey">Message</label>
                    <textarea
                      value={ideaForm.content}
                      onChange={(e) => setIdeaForm({ ...ideaForm, content: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none text-sm"
                      rows={4}
                      placeholder="Share your thoughts about this book..."
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="px-6 py-2 border-2 border-old-ink bg-old-ink text-old-paper font-bold uppercase text-xs
                             hover:bg-white hover:text-old-ink transition-all"
                  >
                    Post Message (+3 Points)
                  </button>
                </form>
              </div>
            )}

            {ideas.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-old-border">
                <span className="text-5xl mb-3 block">💭</span>
                <p className="text-old-grey text-sm uppercase tracking-wider">No posts yet</p>
                <p className="text-old-grey text-xs mt-1">Be the first to start the discussion!</p>
              </div>
            ) : (
              <div className="space-y-0">
                {ideas.map((idea, index) => (
                  <div 
                    key={idea.id} 
                    className={`border-2 border-old-border hover:bg-old-paper transition-all ${
                      index !== 0 ? '-mt-0.5' : ''
                    }`}
                  >
                    {/* Thread Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-white p-3 border-b border-old-border">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Avatar */}
                          <div className="w-10 h-10 border-2 border-old-ink bg-old-paper flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">👤</span>
                          </div>
                          
                          {/* Post Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold uppercase text-sm mb-1 leading-tight">
                              {idea.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-old-grey">
                              <span className="font-bold">
                                {idea.user?.username || 'Anonymous'}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(idea.created_at || Date.now()).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                              <span>•</span>
                              <span className="text-xs">
                                Post #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Vote Buttons - Compact */}
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleVote(idea.id, 'upvote')}
                            className="px-2 py-1 border border-old-border hover:bg-green-50 hover:border-green-600 transition-all text-xs"
                            title="Upvote"
                          >
                            👍 {idea.upvotes}
                          </button>
                          <button
                            onClick={() => handleVote(idea.id, 'downvote')}
                            className="px-2 py-1 border border-old-border hover:bg-red-50 hover:border-red-600 transition-all text-xs"
                            title="Downvote"
                          >
                            👎 {idea.downvotes}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Thread Content */}
                    <div className="p-4">
                      <p className="text-sm text-old-grey leading-relaxed whitespace-pre-wrap">
                        {idea.content}
                      </p>
                    </div>

                    {/* Thread Footer */}
                    <div className="px-4 py-2 bg-gray-50 border-t border-old-border flex items-center justify-between text-xs text-old-grey">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          <span>0 replies</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>👁️</span>
                          <span>0 views</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 border ${
                          idea.upvotes - idea.downvotes > 0 
                            ? 'border-green-600 text-green-600' 
                            : idea.upvotes - idea.downvotes < 0 
                            ? 'border-red-600 text-red-600' 
                            : 'border-old-border text-old-grey'
                        }`}>
                          Score: {idea.upvotes - idea.downvotes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
