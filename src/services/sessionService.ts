export interface StoredUser {
  [key: string]: unknown;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function notifySessionChanged(): void {
  window.dispatchEvent(new Event('pos-session-changed'));
}

export const sessionService = {
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    notifySessionChanged();
  },

  getUser<T extends StoredUser = StoredUser>(): T | null {
    const rawUser = sessionStorage.getItem(USER_KEY);
    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser) as T;
    } catch {
      return null;
    }
  },

  setUser(user: StoredUser): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
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
