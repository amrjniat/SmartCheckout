export interface StoredUser {
  [key: string]: unknown;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const sessionService = {
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
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
  },

  clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  },
};

export default sessionService;
