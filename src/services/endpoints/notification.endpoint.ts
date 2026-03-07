import { axiosInstance } from '../axios.instance';

export const notificationService = {
  getAll: () => axiosInstance.get('/notifications'),
  markAsRead: (id: string) => axiosInstance.put(`/notifications/${id}/read`),
  markAllAsRead: () => axiosInstance.put('/notifications/read-all'),
};
