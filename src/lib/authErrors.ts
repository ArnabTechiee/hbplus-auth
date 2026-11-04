export function friendlyAuthError(e: unknown): string {
  const code = (e as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled in Firebase.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized in Firebase settings.';
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked. Allow popups and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again in a few minutes.';
    default:
      return 'Something went wrong. Please try again.';
  }
}