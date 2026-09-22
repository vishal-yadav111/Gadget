/**
 * Base HTTP Client for Gadget Lens & Brahma Backend
 * =================================================
 * Injects JWT Authorization headers dynamically from storage.
 * Handles unified error normalization across all services.
 */

import { getBrahmaApiBase, STORAGE_KEYS } from "./config";
import { getFriendlyErrorMessage } from "./error.utils";

export interface ApiResponse<T = any> {
  success?: boolean;
  code?: number;
  statusCode?: number;
  message?: string;
  data?: T;
  [key: string]: any;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      localStorage.getItem(STORAGE_KEYS.TOKEN)?.trim() ||
      localStorage.getItem(STORAGE_KEYS.LEGACY_TOKEN)?.trim() ||
      null
    );
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token.trim());
    localStorage.setItem(STORAGE_KEYS.LEGACY_TOKEN, token.trim());
  } catch (err) {
    console.warn("Failed to persist auth token:", err);
  }
}

export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.LEGACY_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LEGACY_USER);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  } catch (err) {
    console.warn("Failed to clear auth session:", err);
  }
}

export function getAuthUser<T = any>(): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      localStorage.getItem(STORAGE_KEYS.USER) ||
      localStorage.getItem(STORAGE_KEYS.LEGACY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthUser(user: any): void {
  if (typeof window === "undefined") return;
  try {
    const str = JSON.stringify(user);
    localStorage.setItem(STORAGE_KEYS.USER, str);
    localStorage.setItem(STORAGE_KEYS.LEGACY_USER, str);
  } catch (err) {
    console.warn("Failed to persist user session:", err);
  }
}

/**
 * Generic Fetch Wrapper
 */
export async function lensFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const apiBase = getBrahmaApiBase();

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Sanitize path and queryString
  const cleanEndpoint = endpoint.startsWith("http")
    ? endpoint
    : `${apiBase}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(cleanEndpoint, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({
      success: false,
      statusCode: res.status,
      message: `HTTP ${res.status}: Failed to parse JSON response.`,
    }));

    if (!res.ok) {
      const errorMsg = getFriendlyErrorMessage(data, `Request failed with status ${res.status}`);
      const err: any = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err: any) {
    throw new Error(getFriendlyErrorMessage(err, "Unable to complete network request. Please check your connection."));
  }
}
