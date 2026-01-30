'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { booksAPI, ideasAPI, reviewsAPI } from '@/lib/api'

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

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login')
    } else if (isAuthenticated && params.id) {
      loadBook()
      loadIdeas()
      checkIfRequested()
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
                    <p className="text-xs uppercase text-old-grey mb-1">ISBN</p>
                    <p className="text-sm font-bold">{book.isbn || 'N/A'}</p>
                  </div>
                </div>

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

        {/* Reading Ideas Section - Compact */}
        <div className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="bg-gradient-to-r from-old-ink to-gray-800 text-old-paper p-4 border-b-4 border-old-ink flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              <h2 className="text-xl font-bold uppercase tracking-wider">Reading Ideas</h2>
              <span className="px-2 py-0.5 bg-old-paper text-old-ink text-xs font-bold">
                {ideas.length}
              </span>
            </div>
            <button
              onClick={() => setShowIdeaForm(!showIdeaForm)}
              className="px-4 py-2 border-2 border-old-paper text-old-paper font-bold uppercase text-xs
                       hover:bg-old-paper hover:text-old-ink transition-all"
            >
              {showIdeaForm ? 'Cancel' : '+ Add Idea'}
            </button>
          </div>

          <div className="p-4 md:p-6">
            {showIdeaForm && (
              <form onSubmit={handleSubmitIdea} className="mb-6 p-4 border-2 border-old-border bg-old-paper">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-old-grey">Title</label>
                    <input
                      type="text"
                      value={ideaForm.title}
                      onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase mb-1 text-old-grey">Your Thoughts</label>
                    <textarea
                      value={ideaForm.content}
                      onChange={(e) => setIdeaForm({ ...ideaForm, content: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none text-sm"
                      rows={3}
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="px-6 py-2 border-2 border-old-ink bg-old-ink text-old-paper font-bold uppercase text-xs
                             hover:bg-white hover:text-old-ink transition-all"
                  >
                    Post Idea (+3 Points)
                  </button>
                </div>
              </form>
            )}

            {ideas.length === 0 ? (
              <p className="text-center text-old-grey py-8 text-sm">No ideas yet. Be the first to share!</p>
            ) : (
              <div className="space-y-3">
                {ideas.map((idea) => (
                  <div key={idea.id} className="border-2 border-old-border p-4 bg-gradient-to-r from-white to-gray-50 hover:border-old-ink transition-all">
                    <h3 className="font-bold uppercase text-sm mb-2">{idea.title}</h3>
                    <p className="text-old-grey text-sm mb-3 leading-relaxed">{idea.content}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-old-grey uppercase">
                        by {idea.user?.username || 'Anonymous'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVote(idea.id, 'upvote')}
                          className="px-3 py-1 border border-old-ink hover:bg-green-50 hover:border-green-600 transition-all"
                        >
                          👍 {idea.upvotes}
                        </button>
                        <button
                          onClick={() => handleVote(idea.id, 'downvote')}
                          className="px-3 py-1 border border-old-ink hover:bg-red-50 hover:border-red-600 transition-all"
                        >
                          👎 {idea.downvotes}
                        </button>
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
