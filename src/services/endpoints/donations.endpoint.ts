import { axiosInstance } from '../axios.instance';

export const donationsService = {
  create: (data: any) => axiosInstance.post('/donations', data),
  
  getAll: () => axiosInstance.get('/donations'),
};
