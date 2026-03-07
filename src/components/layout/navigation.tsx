'use client';

import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { DesktopNav } from './desktop.nav';
import { MobileNav } from './mobile.nav';
import { UserMenu } from './user.menu';
import { AuthButtons } from './auth.buttons';
import { useNavigation } from '@/hooks/useNavigation';
import { useAuthStore } from '@/store/authStore';

export function Navigation() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    mounted,
    isActive,
    visibleLinks,
    publicLinks,
  } = useNavigation(isAuthenticated);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav 
      className="sticky top-0 z-40 border-b glass"
      style={{ 
        borderColor: 'var(--border)'
      }}
    >
      <div className="max-w-7xl mx-auto px-3 md:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16 gap-2 md:gap-4">
          {/* Left side: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 md:flex-initial">
            {/* Mobile: Hamburger BEFORE logo */}
            <div className="md:hidden shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 md:p-2 rounded-lg transition-colors hover:opacity-70 cursor-pointer"
                style={{ color: 'var(--foreground)' }}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            
            <div className="min-w-0">
              <Logo size="nav" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <DesktopNav
            visibleLinks={visibleLinks}
            isActive={isActive}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />

          {/* Mobile: User Menu on right */}
          <div className="md:hidden shrink-0">
            {isAuthenticated && user ? (
              <UserMenu 
                user={user} 
                onLogout={handleLogout} 
                variant="mobile-header"
              />
            ) : (
              <AuthButtons
                onLogin={() => handleNavigation('/login')}
                onSignUp={() => handleNavigation('/register')}
                variant="desktop"
              />
            )}
          </div>

          {/* Mobile Sheet for navigation links */}
          <MobileNav
            isOpen={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            publicLinks={publicLinks}
            isActive={isActive}
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
        </div>
      </div>
    </nav>
  );
}
