export interface StoredUser {
  [key: string]: unknown;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function notifySessionChanged(): void {
  window.dispatchEvent(new Event('pos-session-changed'));
}

function readLegacyStorageValue(storage: Storage, key: string): string | null {
  return storage.getItem(key);
}

export const sessionService = {
  getToken(): string | null {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) return token;

    const legacyToken = readLegacyStorageValue(localStorage, TOKEN_KEY);
    if (legacyToken) {
      sessionStorage.setItem(TOKEN_KEY, legacyToken);
      localStorage.removeItem(TOKEN_KEY);
    }

    return legacyToken;
  },

  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
    notifySessionChanged();
  },

  getUser<T extends StoredUser = StoredUser>(): T | null {
    const rawUser = sessionStorage.getItem(USER_KEY) ?? localStorage.getItem(USER_KEY);
    if (!rawUser) return null;

    try {
      const parsed = JSON.parse(rawUser) as T;
      if (sessionStorage.getItem(USER_KEY) !== rawUser) {
        sessionStorage.setItem(USER_KEY, rawUser);
        localStorage.removeItem(USER_KEY);
      }
      return parsed;
    } catch {
      sessionStorage.removeItem(USER_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },

  setUser(user: StoredUser): void {
    const value = JSON.stringify(user);
    sessionStorage.setItem(USER_KEY, value);
    localStorage.removeItem(USER_KEY);
    notifySessionChanged();
  },

  clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    notifySessionChanged();
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};

export default sessionService;
