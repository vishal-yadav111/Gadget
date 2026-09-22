/**
 * Dynamic Environment Configuration for Gadget Lens & Brahma Backend
 * ===================================================================
 * Resolves the active backend API URL dynamically from environment variables.
 * Never hardcodes any specific URL so it adapts seamlessly from local dev to production.
 */

export const getBrahmaServerUrl = (): string => {
  const envUrl =
    process.env.NEXT_PUBLIC_BRAHMA_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_GADGETIQ_API_URL;

  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // If in browser and no env is set, use current origin
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "";
};

export const getBrahmaApiBase = (): string => {
  const server = getBrahmaServerUrl();
  return server ? `${server}/api/v1` : "/api/v1";
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "gadgetiq_token",
  LEGACY_TOKEN: "xc_admin_token",
  USER: "gadgetiq_user",
  LEGACY_USER: "xc_admin_user",
  PROJECTS: "gadgetiq_project_access",
} as const;
