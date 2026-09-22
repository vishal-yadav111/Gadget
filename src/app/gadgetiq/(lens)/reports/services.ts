import { lensFetch } from "../core/client";
import { getBrahmaServerUrl } from "../core/config";
import {
  ReportFilterCriteria,
  ReportsListResponse,
  FullQCReportDetail,
} from "./types";

export const reportsService = {
  list: async (params: ReportFilterCriteria = {}): Promise<ReportsListResponse> => {
    const query = new URLSearchParams();
    if (params.limit !== undefined) query.set("limit", String(params.limit));
    if (params.offset !== undefined) query.set("offset", String(params.offset));
    if (params.grade) query.set("grade", params.grade);
    if (params.search) query.set("search", params.search);
    if (params.companyId) query.set("companyId", String(params.companyId));
    if (params.userId) query.set("userId", String(params.userId));

    const res = await lensFetch<ReportsListResponse>(
      `/admin/reports?${query.toString()}`
    );
    return res.data || { reports: [], total: 0 };
  },

  getById: async (id: string | number): Promise<FullQCReportDetail> => {
    // Try multiple endpoint shapes gracefully: /admin/reports/:id, /grading/:id, /grading/public/:id, /reports/:id
    try {
      const res = await lensFetch<any>(`/admin/reports/${id}`);
      const data = res.data?.report || res.data || res;
      if (data && (data.id || data.deviceModel || data.answers)) return data;
    } catch {}

    try {
      const res = await lensFetch<any>(`/grading/${id}`);
      const data = res.data?.report || res.data || res;
      if (data && (data.id || data.deviceModel || data.answers)) return data;
    } catch {}

    try {
      const res = await lensFetch<any>(`/grading/public/${id}`);
      const data = res.data?.report || res.data || res;
      if (data && (data.id || data.deviceModel || data.answers)) return data;
    } catch {}

    try {
      const res = await lensFetch<any>(`/reports/${id}`);
      const data = res.data?.report || res.data || res;
      if (data && (data.id || data.deviceModel || data.answers)) return data;
    } catch {}

    throw new Error(`QC Report #${id} could not be retrieved from the server.`);
  },

  getPublicCertificate: async (id: string | number) => {
    try {
      const res = await lensFetch<any>(`/grading/public/${id}`);
      const data = res.data?.report || res.data || res;
      if (data && (data.id || data.deviceModel || data.answers)) return data;
    } catch {}

    try {
      const res = await lensFetch<any>(`/admin/reports/${id}`);
      const data = res.data?.report || res.data || res;
      if (data && (data.id || data.deviceModel || data.answers)) return data;
    } catch {}

    try {
      const res = await lensFetch<any>(`/grading/${id}`);
      const data = res.data?.report || res.data || res;
      if (data && (data.id || data.deviceModel || data.answers)) return data;
    } catch {}

    throw new Error(`Certificate #${id} could not be retrieved from the server.`);
  },

  getImageUrl: (path?: string | null): string => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const serverUrl = getBrahmaServerUrl();
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return serverUrl ? `${serverUrl}${cleanPath}` : cleanPath;
  },
};
