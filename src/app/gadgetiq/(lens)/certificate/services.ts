import { lensFetch } from "../core/client";
import { CertificateReport } from "./types";

export const certificateService = {
  getPublicCertificate: async (id: string | number): Promise<CertificateReport> => {
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

    try {
      const res = await lensFetch<any>(`/reports/${id}`);
      const data = res.data?.report || res.data || res;
      if (data && (data.id || data.deviceModel || data.answers)) return data;
    } catch {}

    throw new Error(`Certificate #${id} could not be retrieved from the server.`);
  },
};
