export interface ReportSummaryItem {
  id: number | string;
  deviceModel?: string | null;
  deviceImei?: string | null;
  serialNumber?: string | null;
  grade?: string | null;
  functionalGrade?: string | null;
  cosmeticGrade?: string | null;
  functionalScore?: number | null;
  cosmeticScore?: number | null;
  screenScore?: number | null;
  bodyScore?: number | null;
  screen_score?: number | null;
  body_score?: number | null;
  overallScore?: number | null;
  userId?: number | string | null;
  user?: {
    id: number | string;
    name?: string;
    username: string;
  } | null;
  companyId?: number | string | null;
  createdAt?: string;
  [key: string]: any;
}

export interface ReportsListResponse {
  reports: ReportSummaryItem[];
  total: number;
}

export interface ReportFilterCriteria {
  limit?: number;
  offset?: number;
  grade?: string;
  search?: string;
  companyId?: string | number;
  userId?: string | number;
}

export interface HardwareTestDetail {
  key?: string;
  name?: string;
  testName?: string;
  status?: boolean | string;
  passed?: boolean;
  score?: number;
  message?: string;
}

export interface InspectionImageItem {
  url?: string;
  path?: string;
  type?: string;
}

export interface FullQCReportDetail extends ReportSummaryItem {
  workflowId?: number;
  functionalTests?: HardwareTestDetail[];
  diagnosticResults?: HardwareTestDetail[];
  images?: InspectionImageItem[];
  deviceImages?: InspectionImageItem[];
  metadata?: Record<string, any>;
}

// Aliases
export type ReportListItem = ReportSummaryItem;
export type ReportItem = FullQCReportDetail;
