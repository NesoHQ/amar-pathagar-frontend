import { axiosInstance } from '../axios.instance';

export const ideasService = {
  create: (data: { 
    book_id: string; 
    title: string; 
    content: string 
  }) => axiosInstance.post('/ideas', data),
  
  getByBook: (bookId: string) => axiosInstance.get(`/ideas/book/${bookId}`),
  
  vote: (ideaId: string, voteType: 'upvote' | 'downvote') => 
    axiosInstance.post(`/ideas/${ideaId}/vote?type=${voteType === 'downvote' ? 'down' : 'up'}`),
};
