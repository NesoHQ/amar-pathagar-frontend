'use client';

import { NESOHQ_URL } from '@/constants/footer';

export function FooterCopyright() {
  return (
    <div 
      className="border-t py-2 text-center"
      style={{ 
        borderColor: 'var(--border)'
      }}
    >
      <p 
        className="text-sm"
        style={{ color: 'var(--muted-foreground)' }}
      >
        © {new Date().getFullYear()} Amar Pathagar. A Trust-Based Reading Network by{' '}
        <a
          href={NESOHQ_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors"
          style={{ color: 'var(--muted-foreground)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--foreground)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--muted-foreground)';
          }}
        >
          NesoHQ
        </a>
      </p>
    </div>
  );
}
