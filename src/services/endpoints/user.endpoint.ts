import { axiosInstance } from '../axios.instance';

export const userService = {
  getProfile: (id: string) => axiosInstance.get(`/users/${id}/profile`),
  
  updateProfile: (data: any) => axiosInstance.put('/users/profile', data),
  
  addInterests: (interests: string[]) => 
    axiosInstance.post('/users/interests', { interests }),
  
  getLeaderboard: () => axiosInstance.get('/leaderboard'),
};
