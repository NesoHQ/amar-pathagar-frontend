import { AUTH_COOKIE_NAME, AUTH_COOKIE_MAX_AGE } from '@/constants/routes';

export const setAuthCookie = (token: string): void => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax; Secure`;
};

export const removeAuthCookie = (): void => {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};
