import { axiosInstance } from '../axios.instance';

export const adminService = {
  // Statistics
  getStats: () => axiosInstance.get('/admin/stats'),
  getAuditLogs: () => axiosInstance.get('/admin/audit-logs'),
  
  // Book Request Management
  getPendingRequests: () => axiosInstance.get('/admin/requests/pending'),
  approveRequest: (requestId: string, dueDate: string) =>
    axiosInstance.post(`/admin/requests/${requestId}/approve`, { due_date: dueDate }),
  rejectRequest: (requestId: string, reason: string) =>
    axiosInstance.post(`/admin/requests/${requestId}/reject`, { reason }),
  getBookRequests: (bookId: string) => axiosInstance.get(`/admin/books/${bookId}/requests`),
  
  // User Management
  getAllUsers: () => axiosInstance.get('/admin/users'),
  adjustSuccessScore: (userId: string, amount: number, reason: string) =>
    axiosInstance.post(`/admin/users/${userId}/score`, { amount, reason }),
  updateUserRole: (userId: string, role: string) =>
    axiosInstance.put(`/admin/users/${userId}/role`, { role }),
  
  // Book Management
  getAllBooks: (params?: { search?: string; category?: string; status?: string }) =>
    axiosInstance.get('/admin/books', { params }),
  updateBookStatus: (bookId: string, status: string) =>
    axiosInstance.put(`/admin/books/${bookId}/status`, { status }),
};
