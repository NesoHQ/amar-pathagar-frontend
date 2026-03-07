import { axiosInstance } from '../axios.instance';

export const handoverService = {
  // Mark book as reading completed
  markBookCompleted: (bookId: string) =>
    axiosInstance.post(`/books/${bookId}/complete`),
  
  // Mark book as delivered
  markBookDelivered: (bookId: string) =>
    axiosInstance.post(`/books/${bookId}/delivered`),
  
  // Get active handover thread for a book
  getActiveHandoverThread: (bookId: string) =>
    axiosInstance.get(`/books/${bookId}/handover`),
  
  // Get reading status for current holder
  getReadingStatus: (bookId: string) =>
    axiosInstance.get(`/books/${bookId}/reading-status`),
  
  // Get all handover threads for current user
  getUserHandoverThreads: () =>
    axiosInstance.get('/handover/threads'),
  
  // Post message to handover thread
  postHandoverMessage: (threadId: string, message: string) =>
    axiosInstance.post(`/handover/threads/${threadId}/messages`, { message }),
  
  // Get messages for a handover thread
  getHandoverMessages: (threadId: string) =>
    axiosInstance.get(`/handover/threads/${threadId}/messages`),
};
