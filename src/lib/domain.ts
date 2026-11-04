export const ALLOWED_DOMAIN = 'hbplus.fit';
export const DOMAIN_ERROR = 'Access restricted. Please login using your official domain email.';

export function isAllowedEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase().endsWith('@' + ALLOWED_DOMAIN);
}