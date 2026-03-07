import { axiosInstance } from '../axios.instance';

export const authService = {
  register: (data: { 
    username: string; 
    email: string; 
    password: string; 
    full_name?: string 
  }) => axiosInstance.post('/auth/register', data),
  
  login: (data: { 
    username: string; 
    password: string 
  }) => axiosInstance.post('/auth/login', data),
  
  me: () => axiosInstance.get('/me'),
};
