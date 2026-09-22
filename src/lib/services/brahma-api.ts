/**
 * Brahma API Client (Re-export / Compatibility Layer)
 * ====================================================
 * All modular Lens APIs and types have been structured cleanly under:
 * `@/app/gadgetiq/lens/` colocated inside their respective feature folders:
 * - `@/app/gadgetiq/lens/core/`
 * - `@/app/gadgetiq/lens/companies/`
 * - `@/app/gadgetiq/lens/users/`
 * - `@/app/gadgetiq/lens/dashboard/`
 * - `@/app/gadgetiq/lens/workflows/`
 * - `@/app/gadgetiq/lens/diagnostic-configs/`
 * - `@/app/gadgetiq/lens/contact-entries/`
 * - `@/app/gadgetiq/lens/reports/`
 * - `@/app/gadgetiq/lens/certificate/`
 */

export * from "@/app/gadgetiq/(lens)";

import {
  authService,
  dashboardService,
  companiesService,
  usersService,
  workflowsService,
  configsService,
  contactEntriesService,
  reportsService,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getAuthUser,
  setAuthUser,
  getBrahmaServerUrl,
  getBrahmaApiBase,
  STORAGE_KEYS,
} from "@/app/gadgetiq/(lens)";

// Aliases for legacy naming compatibility
export const BRAHMA_SERVER_URL = getBrahmaServerUrl();
export const BRAHMA_API_BASE = getBrahmaApiBase();

export const TOKEN_STORAGE_KEY = STORAGE_KEYS.TOKEN;
export const USER_STORAGE_KEY = STORAGE_KEYS.USER;

export const getStoredToken = getAuthToken;
export const setStoredToken = setAuthToken;
export const removeStoredToken = removeAuthToken;
export const getStoredUser = getAuthUser;
export const setStoredUser = setAuthUser;

export const brahmaAuth = authService;
export const brahmaDashboard = dashboardService;
export const brahmaCompanies = companiesService;
export const brahmaUsers = usersService;
export const brahmaWorkflows = workflowsService;
export const brahmaConfigs = configsService;
export const brahmaDemoRequests = contactEntriesService;
export const brahmaReports = reportsService;
