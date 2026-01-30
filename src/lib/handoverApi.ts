import { api } from './api'

export const handoverAPI = {
  // Mark book as reading completed
  markBookCompleted: (bookId: string) =>
    api.post(`/books/${bookId}/complete`),
  
  // Mark book as delivered
  markBookDelivered: (bookId: string) =>
    api.post(`/books/${bookId}/delivered`),
  
  // Get active handover thread for a book
  getActiveHandoverThread: (bookId: string) =>
    api.get(`/books/${bookId}/handover`),
  
  // Get reading status for current holder
  getReadingStatus: (bookId: string) =>
    api.get(`/books/${bookId}/reading-status`),
  
  // Get all handover threads for current user
  getUserHandoverThreads: () =>
    api.get('/handover/threads'),
  
  // Post message to handover thread
  postHandoverMessage: (threadId: string, message: string) =>
    api.post(`/handover/threads/${threadId}/messages`, { message }),
  
  // Get messages for a handover thread
  getHandoverMessages: (threadId: string) =>
    api.get(`/handover/threads/${threadId}/messages`),
}
