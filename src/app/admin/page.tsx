'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { useAuthStore } from '@/store/authStore'
import { useToastStore } from '@/store/toastStore'
import { booksAPI } from '@/lib/api'
import { adminAPI } from '@/lib/adminApi'

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, user, _hasHydrated } = useAuthStore()
  const { success, error } = useToastStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'users' | 'books'>('overview')
  const [stats, setStats] = useState<any>(null)
  const [pendingRequests, setPendingRequests] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])
  const [showAddBook, setShowAddBook] = useState(false)
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    category: '',
    physical_code: '',
  })

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/login')
    } else if (_hasHydrated && isAuthenticated && user?.role !== 'admin') {
      router.push('/dashboard')
    } else if (_hasHydrated && isAuthenticated && user?.role === 'admin') {
      loadData()
    }
  }, [isAuthenticated, user, _hasHydrated, router])

  const loadData = async () => {
    try {
      const [statsRes, requestsRes, usersRes, booksRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getPendingRequests(),
        adminAPI.getAllUsers(),
        adminAPI.getAllBooks(),
      ])
      setStats(statsRes.data.data || statsRes.data)
      setPendingRequests(requestsRes.data.data || requestsRes.data || [])
      setUsers(usersRes.data.data || usersRes.data || [])
      setBooks(booksRes.data.data || booksRes.data || [])
    } catch (err: any) {
      console.error('Failed to load admin data:', err)
      error('Failed to load admin data')
    }
  }

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await booksAPI.create(bookForm)
      setBookForm({
        title: '',
        author: '',
        isbn: '',
        description: '',
        category: '',
        physical_code: '',
      })
      setShowAddBook(false)
      success('Book added successfully!')
      loadData()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to add book')
    }
  }

  const handleApproveRequest = async (requestId: string) => {
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // 14 days from now
    try {
      await adminAPI.approveRequest(requestId, dueDate.toISOString())
      success('Request approved successfully!')
      loadData()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to approve request')
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    const reason = prompt('Enter rejection reason:')
    if (!reason) return
    try {
      await adminAPI.rejectRequest(requestId, reason)
      success('Request rejected')
      loadData()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to reject request')
    }
  }

  const handleAdjustScore = async (userId: string, username: string) => {
    const amountStr = prompt(`Adjust success score for ${username}:\nEnter amount (positive or negative):`)
    if (!amountStr) return
    const amount = parseInt(amountStr)
    if (isNaN(amount)) {
      error('Invalid amount')
      return
    }
    const reason = prompt('Enter reason for adjustment:')
    if (!reason) return
    try {
      await adminAPI.adjustSuccessScore(userId, amount, reason)
      success('Success score adjusted')
      loadData()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to adjust score')
    }
  }

  const handleUpdateRole = async (userId: string, username: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin'
    if (!confirm(`Change ${username}'s role to ${newRole}?`)) return
    try {
      await adminAPI.updateUserRole(userId, newRole)
      success('User role updated')
      loadData()
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to update role')
    }
  }

  if (!_hasHydrated || !isAuthenticated || user?.role !== 'admin') {
    return null
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-4 border-old-ink bg-gradient-to-r from-old-ink to-gray-800 text-old-paper p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3">
            <span className="text-5xl">⚙️</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">Admin Panel</h1>
              <p className="text-old-paper opacity-75 text-sm uppercase tracking-wider">System Management & Control</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon="👥" label="Total Users" value={stats.total_users || 0} color="blue" />
            <StatCard icon="📚" label="Total Books" value={stats.total_books || 0} color="green" />
            <StatCard icon="📬" label="Pending Requests" value={stats.pending_requests || 0} color="orange" />
            <StatCard icon="📖" label="In Circulation" value={stats.books_in_circulation || 0} color="purple" />
          </div>
        )}

        {/* Tabs */}
        <div className="border-4 border-old-ink bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]">
          <div className="flex border-b-4 border-old-ink overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Overview" />
            <TabButton active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} label={`Requests (${pendingRequests.length})`} />
            <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="Users" />
            <TabButton active={activeTab === 'books'} onClick={() => setActiveTab('books')} label="Books" />
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab stats={stats} />
            )}

            {activeTab === 'requests' && (
              <RequestsTab 
                requests={pendingRequests} 
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            )}

            {activeTab === 'users' && (
              <UsersTab 
                users={users}
                onAdjustScore={handleAdjustScore}
                onUpdateRole={handleUpdateRole}
              />
            )}

            {activeTab === 'books' && (
              <BooksTab 
                books={books}
                showAddBook={showAddBook}
                setShowAddBook={setShowAddBook}
                bookForm={bookForm}
                setBookForm={setBookForm}
                onAddBook={handleAddBook}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

function StatCard({ icon, label, value, color }: any) {
  const colors = {
    blue: 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100',
    green: 'border-green-600 bg-gradient-to-br from-green-50 to-green-100',
    orange: 'border-orange-600 bg-gradient-to-br from-orange-50 to-orange-100',
    purple: 'border-purple-600 bg-gradient-to-br from-purple-50 to-purple-100',
  }
  return (
    <div className={`border-4 ${colors[color as keyof typeof colors]} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]`}>
      <div className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <p className="text-3xl font-bold mb-1">{value}</p>
        <p className="text-xs uppercase tracking-wider text-old-grey">{label}</p>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-bold uppercase text-sm tracking-wider transition-all whitespace-nowrap ${
        active
          ? 'bg-old-ink text-old-paper'
          : 'bg-white text-old-grey hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )
}

function OverviewTab({ stats }: any) {
  if (!stats) return <p className="text-center text-old-grey">Loading...</p>
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-old-border p-4">
          <h3 className="font-bold uppercase tracking-wider mb-4 text-lg">📊 System Health</h3>
          <div className="space-y-3">
            <MetricRow label="Available Books" value={stats.available_books || 0} total={stats.total_books || 0} />
            <MetricRow label="Avg Success Score" value={Math.round(stats.avg_success_score || 0)} total={100} />
            <MetricRow label="Total Donations" value={stats.total_donations || 0} />
            <MetricRow label="Total Ideas" value={stats.total_ideas || 0} />
            <MetricRow label="Total Reviews" value={stats.total_reviews || 0} />
          </div>
        </div>

        <div className="border-2 border-old-border p-4">
          <h3 className="font-bold uppercase tracking-wider mb-4 text-lg">🎯 Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 border-2 border-old-ink bg-white hover:bg-old-ink hover:text-old-paper transition-all font-bold uppercase text-sm">
              Export Data
            </button>
            <button className="w-full px-4 py-2 border-2 border-old-ink bg-white hover:bg-old-ink hover:text-old-paper transition-all font-bold uppercase text-sm">
              View Audit Logs
            </button>
            <button className="w-full px-4 py-2 border-2 border-old-ink bg-white hover:bg-old-ink hover:text-old-paper transition-all font-bold uppercase text-sm">
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricRow({ label, value, total }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-old-grey uppercase tracking-wider">{label}</span>
      <span className="font-bold">
        {value}{total && ` / ${total}`}
      </span>
    </div>
  )
}

function RequestsTab({ requests, onApprove, onReject }: any) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-old-grey uppercase tracking-wider">No pending requests</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((req: any) => (
        <div key={req.id} className="border-2 border-old-border p-4 hover:border-old-ink transition-all">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold uppercase text-lg mb-1">{req.book?.title || 'Unknown Book'}</h3>
              <p className="text-sm text-old-grey mb-2">by {req.book?.author || 'Unknown'}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <strong>User:</strong> {req.user?.username || req.user?.full_name}
                </span>
                <span className="flex items-center gap-1">
                  <strong>Score:</strong> {req.user?.success_score || 0}
                </span>
                <span className="flex items-center gap-1">
                  <strong>Priority:</strong> {req.priority_score?.toFixed(1) || 0}
                </span>
                <span className="flex items-center gap-1">
                  <strong>Requested:</strong> {new Date(req.requested_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onApprove(req.id)}
                className="px-4 py-2 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold uppercase text-xs transition-all"
              >
                ✓ Approve
              </button>
              <button
                onClick={() => onReject(req.id)}
                className="px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold uppercase text-xs transition-all"
              >
                ✗ Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function UsersTab({ users, onAdjustScore, onUpdateRole }: any) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-2 border-old-border">
          <thead className="bg-old-ink text-old-paper">
            <tr>
              <th className="px-4 py-2 text-left uppercase text-xs">Username</th>
              <th className="px-4 py-2 text-left uppercase text-xs">Email</th>
              <th className="px-4 py-2 text-center uppercase text-xs">Role</th>
              <th className="px-4 py-2 text-center uppercase text-xs">Score</th>
              <th className="px-4 py-2 text-center uppercase text-xs">Books</th>
              <th className="px-4 py-2 text-center uppercase text-xs">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id} className="border-t-2 border-old-border hover:bg-gray-50">
                <td className="px-4 py-3 font-bold">{user.username}</td>
                <td className="px-4 py-3 text-sm text-old-grey">{user.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 text-xs font-bold uppercase ${
                    user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-center font-bold">{user.success_score}</td>
                <td className="px-4 py-3 text-center text-sm">{user.books_shared}/{user.books_received}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onAdjustScore(user.id, user.username)}
                      className="px-2 py-1 border border-old-ink text-xs font-bold hover:bg-old-ink hover:text-old-paper transition-all"
                      title="Adjust score"
                    >
                      ±
                    </button>
                    <button
                      onClick={() => onUpdateRole(user.id, user.username, user.role)}
                      className="px-2 py-1 border border-old-ink text-xs font-bold hover:bg-old-ink hover:text-old-paper transition-all"
                      title="Toggle role"
                    >
                      ⚡
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BooksTab({ books, showAddBook, setShowAddBook, bookForm, setBookForm, onAddBook }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold uppercase tracking-wider text-lg">Book Management</h3>
        <button
          onClick={() => setShowAddBook(!showAddBook)}
          className="px-4 py-2 border-2 border-old-ink bg-old-ink text-old-paper hover:bg-white hover:text-old-ink font-bold uppercase text-sm transition-all"
        >
          {showAddBook ? 'Cancel' : '+ Add Book'}
        </button>
      </div>

      {showAddBook && (
        <form onSubmit={onAddBook} className="border-4 border-old-ink p-6 bg-gray-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Title *</label>
              <input
                type="text"
                value={bookForm.title}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Author *</label>
              <input
                type="text"
                value={bookForm.author}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-2">ISBN</label>
              <input
                type="text"
                value={bookForm.isbn}
                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Physical Code *</label>
              <input
                type="text"
                value={bookForm.physical_code}
                onChange={(e) => setBookForm({ ...bookForm, physical_code: e.target.value })}
                className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none"
                required
                placeholder="Unique identifier"
              />
            </div>
            <div>
              <label className="block text-sm font-bold uppercase mb-2">Category</label>
              <input
                type="text"
                value={bookForm.category}
                onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold uppercase mb-2">Description</label>
            <textarea
              value={bookForm.description}
              onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
              className="w-full px-3 py-2 border-2 border-old-border focus:border-old-ink outline-none"
              rows={3}
            />
          </div>
          <button type="submit" className="px-6 py-3 border-2 border-old-ink bg-old-ink text-old-paper hover:bg-white hover:text-old-ink font-bold uppercase transition-all">
            Add Book to Library
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.slice(0, 12).map((book: any) => (
          <div key={book.id} className="border-2 border-old-border p-4 hover:border-old-ink transition-all">
            <h4 className="font-bold uppercase text-sm mb-1 truncate">{book.title}</h4>
            <p className="text-xs text-old-grey mb-2">{book.author}</p>
            <div className="flex justify-between items-center text-xs">
              <span className={`px-2 py-1 font-bold uppercase ${
                book.status === 'available' ? 'bg-green-100 text-green-700' :
                book.status === 'reading' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {book.status}
              </span>
              <span className="text-old-grey">Reads: {book.total_reads}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
