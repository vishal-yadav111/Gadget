import { lensFetch, setAuthToken, setAuthUser, removeAuthToken } from "./client";
import { LensLoginResult, LensAuthUser } from "./auth.types";
import { getBrahmaApiBase } from "./config";

export const authService = {
  /**
   * Universal Login (works for Brahma QC & Multi-project GadgetIQ)
   */
  login: async (username: string, password: string): Promise<LensLoginResult> => {
    // Attempt unified multi-project endpoint first, fallback to standard auth/login
    try {
      const res = await lensFetch<LensLoginResult>("/gadgetiq/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password }),
      });
      if (res.data?.token) {
        setAuthToken(res.data.token);
        setAuthUser(res.data.user);
        return res.data;
      }
    } catch {
      // Fallback
    }

    const res = await lensFetch<{ user: LensAuthUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: username.trim(), password }),
    });

    if (res.data?.token) {
      setAuthToken(res.data.token);
      setAuthUser(res.data.user);
      return {
        token: res.data.token,
        user: res.data.user,
        projectAccess: {
          hasMultipleProjects: false,
          activeProject: "GADGET_LENS",
          totalProjects: 1,
          allowedProjects: [
            {
              projectId: 2,
              projectCode: "GADGET_LENS",
              projectName: "Gadget Lens",
              description: "AI Visual Inspection & Optical Lens Suite",
            },
          ],
        },
      };
    }

    throw new Error(res.message || "Failed to authenticate session.");
  },

  /**
   * Get Active Logged-in Profile
   */
  getMe: async (): Promise<LensAuthUser | null> => {
    try {
      const res = await lensFetch<{ user: LensAuthUser }>("/auth/me");
      if (res.data?.user) {
        setAuthUser(res.data.user);
        return res.data.user;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Health Ping Check (Dynamic latency & online status)
   */
  checkHealth: async () => {
    const startTime = performance.now();
    try {
      const apiBase = getBrahmaApiBase();
      const res = await fetch(`${apiBase}/health`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      const data = await res.json().catch(() => ({}));
      const duration = Math.round(performance.now() - startTime);
      return {
        online: res.ok,
        latencyMs: duration > 0 ? duration : 20,
        data,
      };
    } catch {
      return {
        online: false,
        latencyMs: 0,
      };
    }
  },

  /**
   * Terminate active session
   */
  logout: () => {
    removeAuthToken();
    if (typeof window !== "undefined") {
      window.location.href = "/gadgetiq/login";
    }
  },
};
