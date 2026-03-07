import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from '@/constants/routes';

export const setAuthCookie = (token: string): void => {
  if (typeof document === 'undefined') return;
  
  // Remove Secure flag for local development compatibility
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
};

export const removeAuthCookie = (): void => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; path=/`;
};
