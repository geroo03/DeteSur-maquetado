/**
 * localStorage wrappers that never throw. Storage is unavailable in private
 * windows and when site data is blocked, so every call is guarded and the
 * caller just gets the fallback.
 */

export const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key: string, value: unknown): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded or storage blocked — the UI keeps working in memory */
  }
};

export const removeKey = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
};

export const STORAGE_KEYS = {
  cart: 'detersur:cart:v1',
  wishlist: 'detersur:wishlist:v1',
  recentSearches: 'detersur:searches:v1',
  address: 'detersur:address:v1',
  lastOrder: 'detersur:order:v1',
} as const;
