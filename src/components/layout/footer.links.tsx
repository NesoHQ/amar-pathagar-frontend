'use client';

import { useRouter } from 'next/navigation';
import { FooterLink } from '@/types/footer';
import { handleFooterLinkClick } from '@/utils/footer';

interface FooterLinksProps {
  links: FooterLink[];
}

export function FooterLinks({ links }: FooterLinksProps) {
  const router = useRouter();

  return (
    <div>
      <h5 
        className="font-bold uppercase tracking-wider mb-4 text-sm"
        style={{ color: 'var(--foreground)' }}
      >
        Quick Links
      </h5>
      <ul className="space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <button
              onClick={() => handleFooterLinkClick(link.href, router)}
              className="hover:translate-x-1 inline-block transition-all"
              style={{ color: 'var(--muted-foreground)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--foreground)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--muted-foreground)';
              }}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
