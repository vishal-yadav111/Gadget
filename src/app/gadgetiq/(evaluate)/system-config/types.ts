/**
 * System Config Upload Types
 * ==========================
 */

export interface SystemConfigUploadResult {
  success: boolean;
  message: string;
  totalParsedRows?: number;
  validConfigurations?: number;
  errors?: string[];
  filename?: string;
  uploadedAt?: string;
}
