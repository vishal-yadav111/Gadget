/**
 * User Onboarding & Approval Types
 * =================================
 * Type definitions for Super Admin applicant review, status updates,
 * and paginated onboarding data.
 */

export type OnboardingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "INACTIVE";

export interface OnboardingUserRecord {
  id: number | string;
  company: string;
  address?: string | null;
  name: string;
  email: string;
  phone: string;
  gst?: string | null;
  username: string;
  isActive: boolean;
  status: OnboardingStatus | string;
  role?: string;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OnboardingPagination {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface OnboardingListData {
  records: OnboardingUserRecord[];
  pagination: OnboardingPagination;
}

export interface UpdateOnboardingStatusPayload {
  status: OnboardingStatus | string;
  isActive: boolean;
  notes?: string | null;
}

export interface OnboardingQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  isActive?: boolean | string;
  search?: string;
}

export interface OnboardingApiResponse<T = any> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
