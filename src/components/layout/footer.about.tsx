'use client';

import { Logo } from '@/components/common/logo';

export function FooterAbout() {
  return (
    <div>
      <Logo size="footer" className="mb-4" />
      <p 
        className="text-sm leading-relaxed"
        style={{ color: 'var(--muted-foreground)' }}
      >
        A trust-based community library where knowledge flows freely and
        reputation matters.
      </p>
    </div>
  );
}
