import { axiosInstance } from '../axios.instance';

export const reviewsService = {
  create: (data: any) => axiosInstance.post('/reviews', data),
  
  getByUser: (userId: string) => axiosInstance.get(`/users/${userId}/reviews`),
  
  getByBook: (bookId: string) => axiosInstance.get(`/books/${bookId}/reviews`),
};
