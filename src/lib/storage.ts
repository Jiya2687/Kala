/**
 * Safe localStorage utilities for KalaKriti
 * Protects against QuotaExceededError, malformed JSON, and unexpected nulls.
 */

export const safeStorage = {
  getItem<T>(key: string, fallback: T): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return fallback;
      }
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === undefined) {
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[SafeStorage] Failed to read or parse key "${key}":`, err);
      return fallback;
    }
  },

  setItem(key: string, value: unknown): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
      return true;
    } catch (err) {
      console.warn(`[SafeStorage] Quota exceeded or failed to write key "${key}":`, err);
      return false;
    }
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (err) {
      console.warn(`[SafeStorage] Failed to remove key "${key}":`, err);
    }
  },
};
