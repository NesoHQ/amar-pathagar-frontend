'use client';

import { Button } from '@/components/ui/button';
import { AuthButtonsProps } from '@/types/navigation';

export function AuthButtons({ onLogin, onSignUp, variant = 'desktop' }: AuthButtonsProps) {
  const isFullWidth = variant === 'mobile';
  const isMobileHeader = variant === 'mobile';

  return (
    <div className={`${variant === 'desktop' ? 'flex gap-2 space-y-0' : variant === 'mobile' ? 'space-y-2' : 'flex gap-1.5 space-y-0'}`}>
      <Button 
        variant="outline" 
        size="sm"
        className={`rounded-lg font-medium transition-all duration-200 text-xs md:text-sm px-2.5 md:px-4 py-1.5 md:py-2 h-7 md:h-9 whitespace-nowrap ${isFullWidth ? 'w-full' : ''}`}
        onClick={onLogin}
      >
        Login
      </Button>
      <Button 
        size="sm"
        className={`rounded-lg font-medium transition-all duration-200 text-xs md:text-sm px-2.5 md:px-4 py-1.5 md:py-2 h-7 md:h-9 whitespace-nowrap ${isFullWidth ? 'w-full' : ''}`}
        onClick={onSignUp}
      >
        Sign Up
      </Button>
    </div>
  );
}
