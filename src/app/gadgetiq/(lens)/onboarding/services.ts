/**
 * User Onboarding & Approval Services
 * =====================================
 * API client methods to list, inspect, and approve/reject signed-up users.
 */

import { lensFetch } from "../core/client";
import {
  OnboardingUserRecord,
  OnboardingListData,
  UpdateOnboardingStatusPayload,
  OnboardingQueryParams,
} from "./types";

export const onboardingService = {
  /**
   * 1. Get All Signed-Up Users (Admin List View with Pagination & Filters)
   * GET /api/v1/user-onboard?page=1&limit=10&status=PENDING&search=...
   */
  list: async (
    params: OnboardingQueryParams = {}
  ): Promise<OnboardingListData> => {
    const query = new URLSearchParams();

    if (params.page !== undefined && params.page !== null) {
      query.set("page", String(params.page));
    }
    if (params.limit !== undefined && params.limit !== null) {
      query.set("limit", String(params.limit));
    }
    if (params.status && params.status !== "ALL") {
      query.set("status", params.status);
    }
    if (params.isActive !== undefined && params.isActive !== "ALL" && params.isActive !== "") {
      query.set("isActive", String(params.isActive));
    }
    if (params.search && params.search.trim()) {
      query.set("search", params.search.trim());
    }

    const queryString = query.toString() ? `?${query.toString()}` : "";

    try {
      // Primary attempt via Brahma backend
      const res = await lensFetch<OnboardingListData>(`/user-onboard${queryString}`);
      if (res.data && Array.isArray(res.data.records)) {
        return res.data;
      }
      // If data is directly an array
      if (Array.isArray(res.data)) {
        return {
          records: res.data,
          pagination: {
            totalRecords: res.data.length,
            currentPage: Number(params.page) || 1,
            totalPages: Math.ceil(res.data.length / (Number(params.limit) || 10)),
            limit: Number(params.limit) || 10,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }
      return {
        records: [],
        pagination: {
          totalRecords: 0,
          currentPage: 1,
          totalPages: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    } catch {
      // Fallback via Next.js internal proxy route
      const proxyRes = await fetch(`/api/gadgetiq/user-onboard${queryString}`, {
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("gadgetiq_token")
            ? { Authorization: `Bearer ${localStorage.getItem("gadgetiq_token")}` }
            : {}),
        },
      });
      const proxyData = await proxyRes.json().catch(() => ({}));
      if (proxyData?.data?.records) {
        return proxyData.data;
      }
      return {
        records: [],
        pagination: {
          totalRecords: 0,
          currentPage: 1,
          totalPages: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }
  },

  /**
   * 2. Get Single User Details (Details Modal)
   * GET /api/v1/user-onboard/:id
   */
  getById: async (id: number | string): Promise<OnboardingUserRecord> => {
    try {
      const res = await lensFetch<OnboardingUserRecord>(`/user-onboard/${id}`);
      if (res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to retrieve onboarding user details");
    } catch {
      // Fallback via Next.js proxy route
      const proxyRes = await fetch(`/api/gadgetiq/user-onboard/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("gadgetiq_token")
            ? { Authorization: `Bearer ${localStorage.getItem("gadgetiq_token")}` }
            : {}),
        },
      });
      const proxyData = await proxyRes.json();
      if (proxyData?.data) {
        return proxyData.data;
      }
      throw new Error(proxyData?.message || "Failed to retrieve user details");
    }
  },

  /**
   * 3. Approve / Reject / Activate User
   * PATCH /api/v1/user-onboard/:id/status
   */
  updateStatus: async (
    id: number | string,
    payload: UpdateOnboardingStatusPayload
  ): Promise<OnboardingUserRecord> => {
    const cleanPayload = {
      status: payload.status,
      isActive: Boolean(payload.isActive),
      notes: payload.notes || null,
    };

    try {
      const res = await lensFetch<OnboardingUserRecord>(`/user-onboard/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(cleanPayload),
      });

      if (res.data) {
        return res.data;
      }
      throw new Error(res.message || "Failed to update onboarding user status");
    } catch (err: any) {
      // Try with proxy route
      const proxyRes = await fetch(`/api/gadgetiq/user-onboard/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(typeof window !== "undefined" && localStorage.getItem("gadgetiq_token")
            ? { Authorization: `Bearer ${localStorage.getItem("gadgetiq_token")}` }
            : {}),
        },
        body: JSON.stringify(cleanPayload),
      });

      const proxyData = await proxyRes.json().catch(() => null);
      if (proxyRes.ok && proxyData?.data) {
        return proxyData.data;
      }

      throw new Error(
        proxyData?.message ||
        err?.message ||
        "Failed to update onboarding status. Please verify permissions."
      );
    }
  },

  /**
   * Helper: Quick Approve & Activate
   */
  quickApprove: async (
    id: number | string,
    notes: string = "Approved by Super Admin"
  ): Promise<OnboardingUserRecord> => {
    return onboardingService.updateStatus(id, {
      status: "APPROVED",
      isActive: true,
      notes,
    });
  },

  /**
   * Helper: Quick Reject
   */
  quickReject: async (
    id: number | string,
    notes: string = "Rejected by Super Admin"
  ): Promise<OnboardingUserRecord> => {
    return onboardingService.updateStatus(id, {
      status: "REJECTED",
      isActive: false,
      notes,
    });
  },
};
