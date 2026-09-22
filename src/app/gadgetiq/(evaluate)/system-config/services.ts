import { evaluateApi } from "../core/client";
import { SystemConfigUploadResult } from "./types";

export const systemConfigService = {
  uploadConfigFile: async (file: File): Promise<SystemConfigUploadResult> => {
    const formData = new FormData();
    formData.append("configFile", file);

    try {
      const res = await evaluateApi.post<any>(
        "/UploadSystemConfiguration",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        message: res?.message || res?.Message || `Configuration ${file.name} successfully uploaded and applied.`,
        totalParsedRows: res?.totalParsedRows || res?.TotalRows || undefined,
        validConfigurations: res?.validConfigurations || res?.ValidRows || undefined,
        filename: file.name,
        uploadedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      console.error("Upload live API error:", err);
      throw new Error(
        err?.response?.data?.message ||
        err?.message ||
        "Upload endpoint currently unreachable on StoreApi. Please check your backend connection."
      );
    }
  },
};

