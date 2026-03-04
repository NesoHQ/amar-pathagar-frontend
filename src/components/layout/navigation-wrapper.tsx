'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Navigation } from './navigation';

export function NavigationWrapper() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <Navigation 
      isAuthenticated={isAuthenticated}
      user={user}
      onLogout={handleLogout}
    />
  );
}
