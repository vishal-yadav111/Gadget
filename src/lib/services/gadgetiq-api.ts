/**
 * GadgetIQ Enterprise API Service Client
 * =====================================
 * Handles zero-parameter multi-project authentication,
 * dynamic project resolution, project switching, and session persistence.
 */

export const GADGETIQ_SERVER_URL = (
  process.env.NEXT_PUBLIC_GADGETIQ_API_URL ||
  process.env.NEXT_PUBLIC_BRAHMA_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "")
)
  .trim()
  .replace(/\/+$/, "");

export const GADGETIQ_API_BASE = `${GADGETIQ_SERVER_URL}/api/v1/gadgetiq`;

// --- Storage Keys ---
export const GADGETIQ_TOKEN_KEY = "gadgetiq_token";
export const GADGETIQ_USER_KEY = "gadgetiq_user";
export const GADGETIQ_PROJECTS_KEY = "gadgetiq_project_access";

// --- Types & Interfaces ---
export interface GadgetIqUser {
  id: number;
  fullName: string | null;
  username: string;
  email: string | null;
  mobile: string | null;
  role: string | null;
  companyId: string | null;
  storeId: number | null;
  storeType: string | null;
  webUserId: number | null;
}

export interface ProjectItem {
  projectId: number;
  projectCode: string;
  projectName: string;
  description: string;
}

export interface ProjectAccess {
  hasMultipleProjects: boolean;
  activeProject: string;
  totalProjects: number;
  allowedProjects: ProjectItem[];
}

export interface GadgetIqLoginData {
  token: string;
  user: GadgetIqUser;
  projectAccess: ProjectAccess;
}

export interface GadgetIqSignUpPayload {
  company: string;
  address: string;
  name: string;
  email: string;
  phone: string;
  gst: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface GadgetIqApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  errors?: any;
}

// --- Session Helpers ---
export function getGadgetIqToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(GADGETIQ_TOKEN_KEY)?.trim() || null;
  } catch {
    return null;
  }
}

export function setGadgetIqSession(data: GadgetIqLoginData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GADGETIQ_TOKEN_KEY, data.token.trim());
    localStorage.setItem(GADGETIQ_USER_KEY, JSON.stringify(data.user));
    localStorage.setItem(GADGETIQ_PROJECTS_KEY, JSON.stringify(data.projectAccess));
  } catch (err) {
    console.warn("Failed to persist GadgetIQ session:", err);
  }
}

export function getGadgetIqUser(): GadgetIqUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GADGETIQ_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getGadgetIqProjects(): ProjectAccess | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(GADGETIQ_PROJECTS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getGadgetIqSession(): GadgetIqLoginData | null {
  const token = getGadgetIqToken();
  const user = getGadgetIqUser();
  const projectAccess = getGadgetIqProjects();
  if (token && user && projectAccess) {
    return { token, user, projectAccess };
  }
  return null;
}

export function clearGadgetIqSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GADGETIQ_TOKEN_KEY);
    localStorage.removeItem(GADGETIQ_USER_KEY);
    localStorage.removeItem(GADGETIQ_PROJECTS_KEY);
  } catch (err) {
    console.warn("Failed to clear GadgetIQ session:", err);
  }
}

// --- Generic Request Wrapper ---
async function gadgetIqFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<GadgetIqApiResponse<T>> {
  const url = endpoint.startsWith("http") ? endpoint : `${GADGETIQ_API_BASE}${endpoint}`;
  const token = getGadgetIqToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({
      success: false,
      code: response.status,
      message: `HTTP error ${response.status}`,
    }));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err: any) {
    throw new Error(err.message || "Network request failed");
  }
}

// ==========================================
// Authentication Service Endpoints
// ==========================================
export const gadgetIqAuth = {
  /**
   * Zero-parameter Multi-Project Login
   * Accepts username (or email/mobile) and password.
   * DB automatically resolves project memberships and roles.
   */
  login: async (username: string, password: string): Promise<GadgetIqLoginData> => {
    const res = await gadgetIqFetch<GadgetIqLoginData>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: username.trim(), password }),
    });

    if (res.data) {
      setGadgetIqSession(res.data);
      return res.data;
    }
    throw new Error(res.message || "Login failed to return session data.");
  },

  /**
   * User Onboarding Sign-Up (Secure Next.js Proxy Route to Port 5009)
   */
  signup: async (payload: GadgetIqSignUpPayload): Promise<any> => {
    const res = await fetch("/api/gadgetiq/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({
      success: false,
      message: `Server returned HTTP ${res.status}`,
    }));

    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || `Registration failed with status ${res.status}`);
    }

    return data;
  },

  /**
   * Register New Operator / User
   */
  register: async (payload: {
    fullName: string;
    username: string;
    email: string;
    password: string;
    mobile?: string;
    companyName?: string;
  }): Promise<GadgetIqLoginData> => {
    try {
      const res = await gadgetIqFetch<GadgetIqLoginData>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.data) {
        setGadgetIqSession(res.data);
        return res.data;
      }
    } catch {
      // Fallback: try logging in or creating mock session if offline
    }
    return await gadgetIqAuth.login(payload.username || payload.email, payload.password);
  },

  /**
   * Switch Active Project Context for multi-project users
   */
  switchProject: async (projectCode: string): Promise<{ token: string; activeProject: string }> => {
    const res = await gadgetIqFetch<{ token: string; activeProject: string }>("/auth/switch-project", {
      method: "POST",
      body: JSON.stringify({ projectCode }),
    });

    if (res.data) {
      // Update local storage token and active project
      localStorage.setItem(GADGETIQ_TOKEN_KEY, res.data.token.trim());
      const projects = getGadgetIqProjects();
      if (projects) {
        projects.activeProject = res.data.activeProject;
        localStorage.setItem(GADGETIQ_PROJECTS_KEY, JSON.stringify(projects));
      }
      return res.data;
    }
    throw new Error(res.message || "Failed to switch project.");
  },

  /**
   * Get Current Authenticated Profile
   */
  getProfile: async () => {
    const res = await gadgetIqFetch<any>("/auth/me");
    return res.data;
  },

  /**
   * Get User Menu Rights
   */
  getMenus: async (projectCode?: string) => {
    const qs = projectCode ? `?projectCode=${encodeURIComponent(projectCode)}` : "";
    const res = await gadgetIqFetch<{ menus: any[] }>(`/auth/menus${qs}`);
    return res.data?.menus || [];
  },

  /**
   * Test Project Access Authorization
   */
  testEvaluateAccess: async () => {
    return await gadgetIqFetch("/auth/test-evaluate-access");
  },

  testLensAccess: async () => {
    return await gadgetIqFetch("/auth/test-lens-access");
  },

  /**
   * Logout user
   */
  logout: () => {
    clearGadgetIqSession();
    if (typeof window !== "undefined") {
      window.location.href = "/gadgetiq/login";
    }
  },
};