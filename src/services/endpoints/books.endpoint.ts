import { axiosInstance } from '../axios.instance';

export const booksService = {
  getAll: (params?: { 
    page?: number; 
    search?: string; 
    category?: string; 
    status?: string 
  }) => axiosInstance.get('/books', { params }),
  
  getById: (id: string) => axiosInstance.get(`/books/${id}`),
  
  create: (data: any) => axiosInstance.post('/books', data),
  
  update: (id: string, data: any) => axiosInstance.patch(`/books/${id}`, data),
  
  delete: (id: string) => axiosInstance.delete(`/books/${id}`),
  
  request: (id: string) => axiosInstance.post(`/books/${id}/request`),
  
  cancelRequest: (id: string) => axiosInstance.delete(`/books/${id}/request`),
  
  checkRequested: (id: string) => axiosInstance.get(`/books/${id}/requested`),
  
  getMyRequests: () => axiosInstance.get('/my-requests'),
  
  returnBook: (id: string) => axiosInstance.post(`/books/${id}/return`),
  
  getMyReadingHistory: () => axiosInstance.get('/my-reading-history'),
  
  getMyBooksOnHold: () => axiosInstance.get('/my-books-on-hold'),
};
