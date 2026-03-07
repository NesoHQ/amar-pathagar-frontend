import { axiosInstance } from '../axios.instance';

export const bookmarksService = {
  create: (data: { 
    book_id: string; 
    bookmark_type: string; 
    priority_level?: number 
  }) => axiosInstance.post('/bookmarks', data),
  
  delete: (bookId: string, type: string) => 
    axiosInstance.delete(`/bookmarks/${bookId}?type=${type}`),
  
  getAll: (type?: string) => axiosInstance.get('/bookmarks', { params: { type } }),
};
