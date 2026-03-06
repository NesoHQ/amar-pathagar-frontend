import { HeroSlide } from '@/types/hero';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Share Books, Build Community',
    subtitle: 'Trust-Based Library',
    description: 'Join thousands of readers sharing knowledge through our community-driven library. No fees, no bureaucracy—just books and trust.',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80',
    cta: {
      primary: {
        text: 'Get Started Free',
        href: '/register'
      },
      secondary: {
        text: 'Browse Books',
        href: '/books'
      }
    },
    stats: [
      {
        icon: '👥',
        value: '5,000+',
        label: 'Active Members'
      },
      {
        icon: '🌍',
        value: '50+',
        label: 'Cities'
      },
      {
        icon: '🤝',
        value: '25,000+',
        label: 'Connections'
      },
      {
        icon: '💬',
        value: '15,000+',
        label: 'Conversations'
      }
    ],
    trustIndicators: [
      {
        icon: '✓',
        text: 'Join 5,000+ book lovers'
      },
      {
        icon: '✓',
        text: 'Community-driven & trusted'
      },
      {
        icon: '✓',
        text: 'Free to join, always'
      }
    ]
  },
  {
    id: 2,
    title: 'Your Reading Journey Starts Here',
    subtitle: 'Discover & Connect',
    description: 'Explore our vast collection of books shared by community members. Request, read, and return—building your reputation along the way.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
    cta: {
      primary: {
        text: 'Explore Collection',
        href: '/books'
      },
      secondary: {
        text: 'How It Works',
        href: '#how-it-works'
      }
    },
    stats: [
      {
        icon: '📚',
        value: '10,000+',
        label: 'Books Available'
      },
      {
        icon: '📖',
        value: '50+',
        label: 'Categories'
      },
      {
        icon: '🔄',
        value: '25,000+',
        label: 'Exchanges'
      },
      {
        icon: '⏱️',
        value: '2.5 days',
        label: 'Avg. Wait Time'
      }
    ],
    trustIndicators: [
      {
        icon: '✓',
        text: 'Browse 10,000+ books'
      },
      {
        icon: '✓',
        text: 'Request instantly'
      },
      {
        icon: '✓',
        text: 'No waiting lists'
      }
    ]
  },
  {
    id: 3,
    title: 'Build Trust Through Reading',
    subtitle: 'Reputation System',
    description: 'Return books on time, contribute to the community, and watch your success score grow. Higher reputation unlocks more opportunities.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&q=80',
    cta: {
      primary: {
        text: 'Join Community',
        href: '/register'
      },
      secondary: {
        text: 'Learn More',
        href: '#how-it-works'
      }
    },
    stats: [
      {
        icon: '⭐',
        value: '98%',
        label: 'Trust Score'
      },
      {
        icon: '✅',
        value: '95%',
        label: 'On-Time Returns'
      },
      {
        icon: '🏆',
        value: '500+',
        label: 'Top Contributors'
      },
      {
        icon: '💯',
        value: '4.8/5',
        label: 'Avg. Rating'
      }
    ],
    trustIndicators: [
      {
        icon: '✓',
        text: 'Build your reputation'
      },
      {
        icon: '✓',
        text: 'Unlock more books'
      },
      {
        icon: '✓',
        text: 'Earn community badges'
      }
    ]
  },
  {
    id: 4,
    title: 'Knowledge Over Hoarding',
    subtitle: 'Share & Discover',
    description: 'Books are meant to be read, not collected. Share your books with the community and discover new reads from fellow book lovers.',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=80',
    cta: {
      primary: {
        text: 'Donate Books',
        href: '/donations'
      },
      secondary: {
        text: 'View Leaderboard',
        href: '/leaderboard'
      }
    },
    stats: [
      {
        icon: '🎁',
        value: '3,500+',
        label: 'Books Donated'
      },
      {
        icon: '📦',
        value: '1,200+',
        label: 'Donors'
      },
      {
        icon: '♻️',
        value: '8,000+',
        label: 'Books Recycled'
      },
      {
        icon: '🌱',
        value: '500kg',
        label: 'CO₂ Saved'
      }
    ],
    trustIndicators: [
      {
        icon: '✓',
        text: 'Donate your books easily'
      },
      {
        icon: '✓',
        text: 'Earn reputation points'
      },
      {
        icon: '✓',
        text: 'Help the community grow'
      }
    ]
  }
];

export const HERO_CONFIG = {
  autoplayDelay: 5000, // 5 seconds
  transitionDuration: 600, // 600ms
  loop: true,
  dragFree: false,
};
