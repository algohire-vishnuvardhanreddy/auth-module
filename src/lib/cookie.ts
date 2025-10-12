import Cookies from "js-cookie";

/**
 * Set a cookie with a specific key and value
 * @param key - Cookie name
 * @param value - Cookie value
 * @param minutes - Expiration time in minutes (default: 10)
 */
export function setCookie(key: string, value: string, minutes = 10) {
  const expires = minutes / (60 * 24); // convert minutes → days
  Cookies.set(key, value, { expires });
}

/**
 * Get a cookie by key
 * @param key - Cookie name
 * @returns Cookie value or undefined
 */
export function getCookie(key: string): string | undefined {
  return Cookies.get(key);
}

/**
 * Delete a cookie by key
 * @param key - Cookie name
 */
export function deleteCookie(key: string) {
  Cookies.remove(key);
}
