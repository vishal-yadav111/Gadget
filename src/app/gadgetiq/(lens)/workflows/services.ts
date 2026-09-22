import { lensFetch } from "../core/client";
import { DiagnosticWorkflow } from "./types";

export const workflowsService = {
  list: async (osType?: string): Promise<DiagnosticWorkflow[]> => {
    const query = osType ? `?osType=${encodeURIComponent(osType)}` : "";
    const res = await lensFetch<DiagnosticWorkflow[]>(`/admin/workflows${query}`);
    return res.data || [];
  },

  getById: async (id: string | number): Promise<DiagnosticWorkflow> => {
    const res = await lensFetch<DiagnosticWorkflow>(`/admin/workflows/${id}`);
    return res.data || (res as unknown as DiagnosticWorkflow);
  },

  create: async (data: { name: string; osType: string }) => {
    return lensFetch("/admin/workflows", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string | number, data: { name?: string; osType?: string }) => {
    return lensFetch(`/admin/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string | number) => {
    return lensFetch(`/admin/workflows/${id}`, {
      method: "DELETE",
    });
  },

  setDefault: async (id: string | number) => {
    return lensFetch(`/admin/workflows/${id}/set-default`, {
      method: "PUT",
    });
  },

  // Sections
  addSection: async (workflowId: string | number, data: { title: string; orderIdx?: number }) => {
    return lensFetch(`/admin/workflows/${workflowId}/sections`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateSection: async (sectionId: string | number, data: { title: string; orderIdx?: number }) => {
    return lensFetch(`/admin/workflows/sections/${sectionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteSection: async (sectionId: string | number) => {
    return lensFetch(`/admin/workflows/sections/${sectionId}`, {
      method: "DELETE",
    });
  },

  // Questions
  addQuestion: async (
    sectionId: string | number,
    data: { title: string; multiSelect?: boolean; orderIdx?: number }
  ) => {
    return lensFetch(`/admin/workflows/sections/${sectionId}/questions`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateQuestion: async (questionId: string | number, data: any) => {
    return lensFetch(`/admin/workflows/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteQuestion: async (questionId: string | number) => {
    return lensFetch(`/admin/workflows/questions/${questionId}`, {
      method: "DELETE",
    });
  },

  // Options
  addOption: async (
    questionId: string | number,
    data: { label: string; score: number; orderIdx?: number }
  ) => {
    return lensFetch(`/admin/workflows/questions/${questionId}/options`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateOption: async (optionId: string | number, data: any) => {
    return lensFetch(`/admin/workflows/options/${optionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteOption: async (optionId: string | number) => {
    return lensFetch(`/admin/workflows/options/${optionId}`, {
      method: "DELETE",
    });
  },
};
