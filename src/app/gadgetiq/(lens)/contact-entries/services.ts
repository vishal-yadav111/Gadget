import { lensFetch } from "../core/client";
import { ContactInquiry } from "./types";

export const contactEntriesService = {
  list: async (limit = 200, offset = 0): Promise<ContactInquiry[]> => {
    const res = await lensFetch<any>(`/demo-requests?limit=${limit}&offset=${offset}`);
    const results = res.data?.results || res.data || [];
    return Array.isArray(results) ? results : [];
  },

  submit: async (data: {
    name: string;
    email: string;
    phone: string;
    company?: string;
    device?: string;
    volume?: string;
    message?: string;
  }) => {
    return lensFetch("/demo-requests", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
