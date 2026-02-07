import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Get token from zustand persist storage
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage)
          if (state?.accessToken) {
            config.headers.Authorization = `Bearer ${state.accessToken}`
          }
        } catch (e) {
          console.error('Failed to parse auth storage')
        }
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
      }
    }
    // Don't show alert, let components handle errors
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string; full_name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/me'),
}

// Books API
export const booksAPI = {
  getAll: (params?: { page?: number; search?: string; category?: string; status?: string }) =>
    api.get('/books', { params }),
  getById: (id: string) => api.get(`/books/${id}`),
  create: (data: any) => api.post('/books', data),
  batchCreate: (data: any[]) => api.post('/books/batch', data),
  update: (id: string, data: any) => api.patch(`/books/${id}`, data),
  delete: (id: string) => api.delete(`/books/${id}`),
  request: (id: string) => api.post(`/books/${id}/request`),
  cancelRequest: (id: string) => api.delete(`/books/${id}/request`),
  checkRequested: (id: string) => api.get(`/books/${id}/requested`),
  getMyRequests: () => api.get('/my-requests'),
  returnBook: (id: string) => api.post(`/books/${id}/return`),
  getMyReadingHistory: () => api.get('/my-reading-history'),
  getMyBooksOnHold: () => api.get('/my-books-on-hold'),
}

// User API
export const userAPI = {
  getProfile: (id: string) => api.get(`/users/${id}/profile`),
  updateProfile: (data: any) => api.put('/users/profile', data),
  addInterests: (interests: string[]) => api.post('/users/interests', { interests }),
  getLeaderboard: () => api.get('/leaderboard'),
}

// Ideas API
export const ideasAPI = {
  create: (data: { book_id: string; title: string; content: string }) =>
    api.post('/ideas', data),
  getByBook: (bookId: string) => api.get(`/ideas/book/${bookId}`),
  vote: (ideaId: string, voteType: 'upvote' | 'downvote') =>
    api.post(`/ideas/${ideaId}/vote?type=${voteType === 'downvote' ? 'down' : 'up'}`),
}

// Reviews API
export const reviewsAPI = {
  create: (data: any) => api.post('/reviews', data),
  getByUser: (userId: string) => api.get(`/users/${userId}/reviews`),
  getByBook: (bookId: string) => api.get(`/books/${bookId}/reviews`),
}

// Donations API
export const donationsAPI = {
  create: (data: any) => api.post('/donations', data),
  getAll: () => api.get('/donations'),
}

// Bookmarks API
export const bookmarksAPI = {
  create: (data: { book_id: string; bookmark_type: string; priority_level?: number }) =>
    api.post('/bookmarks', data),
  delete: (bookId: string, type: string) =>
    api.delete(`/bookmarks/${bookId}?type=${type}`),
  getAll: (type?: string) => api.get('/bookmarks', { params: { type } }),
}
