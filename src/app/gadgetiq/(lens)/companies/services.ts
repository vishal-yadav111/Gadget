import { lensFetch } from "../core/client";
import {
  TenantCompany,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "./types";

export const companiesService = {
  list: async (): Promise<TenantCompany[]> => {
    const res = await lensFetch<TenantCompany[]>("/admin/companies");
    return res.data || [];
  },

  getById: async (id: string | number): Promise<TenantCompany> => {
    const res = await lensFetch<TenantCompany>(`/admin/companies/${id}`);
    return res.data || (res as unknown as TenantCompany);
  },

  create: async (data: CreateCompanyPayload) => {
    return lensFetch("/admin/companies", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string | number, data: UpdateCompanyPayload) => {
    return lensFetch(`/admin/companies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string | number) => {
    return lensFetch(`/admin/companies/${id}`, {
      method: "DELETE",
    });
  },
};
