/**
 * Gadget Evaluate (XC-QC) API Client
 * ===================================
 * Universal, type-safe fetch wrapper with JWT token injection,
 * dynamic URL resolution, query building, and error normalization.
 */

import { getEvaluateServerUrl, STORAGE_KEYS } from "./config";
import { EvaluateApiResponse } from "./auth.types";
import { getFriendlyErrorMessage } from "./error.utils";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)?.trim() || null;
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token.trim());
  } catch (err) {
    console.warn("Failed to save auth token:", err);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (err) {
    console.warn("Failed to remove auth token:", err);
  }
};

export const getAuthUser = <T = any>(): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setAuthUser = (user: any): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (err) {
    console.warn("Failed to save auth user:", err);
  }
};

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: any;
  params?: Record<string, string | number | boolean | null | undefined>;
  timeoutMs?: number;
  baseUrl?: string;
}

export async function evaluateRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    params,
    body,
    headers = {},
    timeoutMs = 15000,
    baseUrl,
    ...restOptions
  } = options;

  const serverUrl = baseUrl || getEvaluateServerUrl();
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Append query params if provided
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      cleanEndpoint += `${cleanEndpoint.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  const fullUrl = `${serverUrl}${cleanEndpoint}`;
  const token = getAuthToken();

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  if (!isFormData && body && typeof body === "object") {
    requestHeaders["Content-Type"] = "application/json";
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(fullUrl, {
      ...restOptions,
      headers: requestHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get("content-type") || "";
    let data: any;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!res.ok) {
      const errorMsg = getFriendlyErrorMessage(data, `Evaluation service responded with error (${res.status})`);
      throw new Error(errorMsg);
    }

    if (data && typeof data === "object" && data.RespCode && data.RespCode > 299 && !data.DATA) {
      const errorMsg = getFriendlyErrorMessage(data, data.RespMsg || "Request could not be processed");
      throw new Error(errorMsg);
    }

    // Unwrap standard { DATA: ... } or { data: ... } or return directly
    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms. Please try again.`);
    }
    throw new Error(getFriendlyErrorMessage(err, "Unable to complete request. Please check your connection."));
  }
}

export const evaluateApi = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    evaluateRequest<T>(endpoint, { ...options, method: "GET" }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    evaluateRequest<T>(endpoint, { ...options, method: "POST", body }),
  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    evaluateRequest<T>(endpoint, { ...options, method: "PUT", body }),
  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    evaluateRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
