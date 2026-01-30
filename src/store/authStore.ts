import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  username: string
  email: string
  full_name: string
  role: string
  avatar_url?: string
  bio?: string
  location_lat?: number
  location_lng?: number
  location_address?: string
  success_score: number
  books_shared: number
  books_received: number
  total_upvotes?: number
  total_downvotes?: number
  created_at?: string
  updated_at?: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  setAuth: (user: User, accessToken: string) => void
  setUser: (user: User) => void
  logout: () => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      _hasHydrated: false,
      
      setAuth: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true })
      },
      
      setUser: (user) => {
        set({ user })
      },
      
      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false })
      },

      setHasHydrated: (state) => {
        set({ _hasHydrated: state })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
