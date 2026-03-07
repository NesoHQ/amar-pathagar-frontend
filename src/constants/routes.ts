// Route configuration for proxy
export const ROUTES = {
  // Protected routes - require authentication
  PROTECTED: [
    '/dashboard',
    '/my-library',
    '/reading-history',
    '/profile',
    '/handover',
    '/donations',
    '/reviews',
  ],
  
  // Auth routes - redirect to dashboard if authenticated
  AUTH: [
    '/login',
    '/register',
  ],
  
  // Public routes - accessible to everyone
  PUBLIC: [
    '/',
    '/books',
    '/leaderboard',
    '/hello',
  ],
} as const;

export const AUTH_COOKIE_NAME = 'auth-token';
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
