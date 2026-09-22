import { lensFetch } from "../core/client";
import {
  DiagnosticTestItemConfig,
  FunctionalGradeThreshold,
  CosmeticConfigPayload,
} from "./types";

export const configsService = {
  getDiagnostic: async (
    companyId?: string | number,
    deviceType?: string
  ): Promise<DiagnosticTestItemConfig[]> => {
    const params = new URLSearchParams();
    if (companyId) params.set("companyId", String(companyId));
    if (deviceType) params.set("deviceType", deviceType);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await lensFetch<DiagnosticTestItemConfig[]>(
      `/diagnostic-configs${qs}`
    );
    return res.data || [];
  },

  saveDiagnostic: async (
    configs: DiagnosticTestItemConfig[],
    companyId?: string | number | null
  ) => {
    return lensFetch("/diagnostic-configs", {
      method: "PUT",
      body: JSON.stringify({ configs, companyId }),
    });
  },

  getFunctional: async (
    companyId?: string | number,
    deviceType?: string
  ): Promise<FunctionalGradeThreshold[]> => {
    const params = new URLSearchParams();
    if (companyId) params.set("companyId", String(companyId));
    if (deviceType) params.set("deviceType", deviceType);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await lensFetch<FunctionalGradeThreshold[]>(
      `/functional-grade-configs${qs}`
    );
    return res.data || [];
  },

  saveFunctional: async (
    configs: FunctionalGradeThreshold[],
    companyId?: string | number | null
  ) => {
    return lensFetch("/functional-grade-configs", {
      method: "PUT",
      body: JSON.stringify({ configs, companyId }),
    });
  },

  getCosmetic: async (
    companyId?: string | number,
    deviceType?: string
  ): Promise<CosmeticConfigPayload> => {
    const params = new URLSearchParams();
    if (companyId) params.set("companyId", String(companyId));
    if (deviceType) params.set("deviceType", deviceType);
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await lensFetch<CosmeticConfigPayload>(
      `/cosmetic-grade-configs${qs}`
    );
    return (
      res.data ||
      (res as unknown as CosmeticConfigPayload) || {
        weightage: { bodyWeightage: 40, screenWeightage: 60 },
        gradeRules: [],
      }
    );
  },

  saveCosmetic: async (
    payload: CosmeticConfigPayload,
    companyId?: string | number | null
  ) => {
    return lensFetch("/cosmetic-grade-configs", {
      method: "PUT",
      body: JSON.stringify({ ...payload, companyId }),
    });
  },
};
