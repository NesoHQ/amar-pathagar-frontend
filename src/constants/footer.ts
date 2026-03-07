import { FooterLink } from '@/types/footer';

export const FOOTER_QUICK_LINKS: FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Books', href: '/books' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Leaderboard', href: '/leaderboard' },
];

export const FOOTER_QUICK_LINKS_AUTH: FooterLink[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'How It Works', href: '/#how-it-works' },
];

export const FOOTER_QUICK_LINKS_GUEST: FooterLink[] = [
  { label: 'Login', href: '/login' },
  { label: 'Sign Up', href: '/register' },
  { label: 'How It Works', href: '/#how-it-works' },
];

export const GITHUB_URL = 'https://github.com/nesohq/amar-pathagar';
export const NESOHQ_URL = 'https://github.com/nesohq';
