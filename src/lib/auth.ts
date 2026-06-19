const COOKIE_NAME = "auth_token";
const COOKIE_DOMAIN = ".francegems.com";
const COOKIE_PATH = "/";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 30): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=${COOKIE_PATH}; domain=${COOKIE_DOMAIN}; secure; samesite=lax`;
}

function removeCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${COOKIE_PATH}; domain=${COOKIE_DOMAIN}; secure`;
}

export function getToken(): string | null {
  const fromCookie = getCookie(COOKIE_NAME);
  if (fromCookie) return fromCookie;
  return localStorage.getItem(COOKIE_NAME);
}

export function saveToken(token: string): void {
  setCookie(COOKIE_NAME, token);
  localStorage.setItem(COOKIE_NAME, token);
}

export function clearToken(): void {
  removeCookie(COOKIE_NAME);
  localStorage.removeItem(COOKIE_NAME);
}
