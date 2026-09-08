/**
 * Allow only same-origin relative paths for post-auth redirects.
 */
export function safeInternalPath(raw: string | null | undefined, fallback = '/user-dashboard'): string {
  if (!raw) return fallback;
  const path = raw.trim();
  if (!path.startsWith('/')) return fallback;
  if (path.startsWith('//') || path.startsWith('/\\')) return fallback;
  if (path.includes('://') || path.includes('\\')) return fallback;
  return path;
}
