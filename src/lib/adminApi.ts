import { api } from './api'

// Admin API endpoints
export const adminAPI = {
  // Statistics
  getStats: () => api.get('/admin/stats'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  
  // Book Request Management
  getPendingRequests: () => api.get('/admin/requests/pending'),
  approveRequest: (requestId: string, dueDate: string) =>
    api.post(`/admin/requests/${requestId}/approve`, { due_date: dueDate }),
  rejectRequest: (requestId: string, reason: string) =>
    api.post(`/admin/requests/${requestId}/reject`, { reason }),
  getBookRequests: (bookId: string) => api.get(`/admin/books/${bookId}/requests`),
  
  // User Management
  getAllUsers: () => api.get('/admin/users'),
  adjustSuccessScore: (userId: string, amount: number, reason: string) =>
    api.post(`/admin/users/${userId}/score`, { amount, reason }),
  updateUserRole: (userId: string, role: string) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  
  // Book Management
  getAllBooks: (params?: { search?: string; category?: string; status?: string }) =>
    api.get('/admin/books', { params }),
  updateBookStatus: (bookId: string, status: string) =>
    api.put(`/admin/books/${bookId}/status`, { status }),
}
