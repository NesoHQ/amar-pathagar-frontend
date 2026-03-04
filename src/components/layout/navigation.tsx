'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from './logo';
import { Menu, X, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavLink {
  href: string;
  label: string;
  protected?: boolean;
}

interface User {
  username: string;
  full_name?: string;
  success_score?: number;
  role?: string;
}

interface NavigationProps {
  isAuthenticated?: boolean;
  user?: User | null;
  onLogout?: () => void;
}

const publicLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/books', label: 'Books' },
  { href: '/blog', label: 'Blog' },
  { href: '/leaderboard', label: 'Leaderboard' },
];

const protectedLinks: NavLink[] = [
  { href: '/dashboard', label: 'Dashboard', protected: true },
  { href: '/my-library', label: 'My Library', protected: true },
  { href: '/reading-history', label: 'History', protected: true },
  { href: '/profile/edit', label: 'Profile', protected: true },
];

export function Navigation({ isAuthenticated = false, user = null, onLogout }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const visibleLinks = isAuthenticated 
    ? [...publicLinks, ...protectedLinks]
    : publicLinks;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const getUserInitial = () => {
    if (user?.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    return user?.full_name || user?.username || 'User';
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav 
      className="border-b-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.3)] sticky top-0 z-40"
      style={{ 
        borderColor: 'hsl(var(--border))',
        backgroundColor: 'hsl(var(--card))'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo size="nav" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  font-bold uppercase text-sm tracking-wider transition-colors
                  ${isActive(link.href)
                    ? 'border-b-2'
                    : 'hover:opacity-70'
                  }
                `}
                style={{
                  color: isActive(link.href) 
                    ? 'hsl(var(--primary))' 
                    : 'hsl(var(--foreground))',
                  borderColor: isActive(link.href) 
                    ? 'hsl(var(--primary))' 
                    : 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Auth Section - Desktop */}
            <div className="flex items-center gap-2 ml-2">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 h-9">
                      <Badge 
                        variant="default" 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      >
                        {getUserInitial()}
                      </Badge>
                      <span className="font-semibold">{getUserDisplayName()}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{getUserDisplayName()}</p>
                        {user.success_score !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            Score: {user.success_score}
                          </p>
                        )}
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/profile/edit')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => router.push('/register')}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border-2 transition-all"
            style={{
              borderColor: 'hsl(var(--border))',
              color: 'hsl(var(--foreground))'
            }}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div 
            className="fixed top-[73px] left-0 right-0 bottom-0 z-50 md:hidden overflow-y-auto"
            style={{ backgroundColor: 'hsl(var(--card))' }}
          >
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      block px-4 py-3 font-bold uppercase text-sm tracking-wider
                      border-l-4 transition-all
                      ${isActive(link.href)
                        ? 'shadow-md'
                        : 'hover:shadow-sm'
                      }
                    `}
                    style={{
                      backgroundColor: isActive(link.href)
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--background))',
                      color: isActive(link.href)
                        ? 'hsl(var(--primary-foreground))'
                        : 'hsl(var(--foreground))',
                      borderColor: isActive(link.href)
                        ? 'hsl(var(--primary))'
                        : 'hsl(var(--border))'
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Auth Section - Mobile */}
              <div className="pt-4 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div 
                      className="flex items-center gap-3 px-4 py-3 rounded-md"
                      style={{ backgroundColor: 'hsl(var(--muted))' }}
                    >
                      <Badge 
                        variant="default" 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold"
                      >
                        {getUserInitial()}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{getUserDisplayName()}</p>
                        {user.success_score !== undefined && (
                          <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                            Score: {user.success_score}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    {/* User Actions */}
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          router.push('/profile/edit');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => {
                          router.push('/dashboard');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        router.push('/login');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => {
                        router.push('/register');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
