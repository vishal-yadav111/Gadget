/**
 * Grade Reports Types
 * ===================
 */

export interface GradeDistributionItem {
  grade: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
  description: string;
}

export interface GradedDeviceItem {
  mstid: number | string;
  workorderid: string;
  imei: string;
  serialNumber: string;
  brand: string;
  model: string;
  device_category?: string;
  storage?: string;
  score: number | string;
  grade: string;
  rawGrade: string;
  categoryBucket: string;
  physicalConditionCategory?: string;
  qcResult: string;
  test_result?: string;
  QCResult?: string;
  testedAt: string;
  testedAtN?: string;
  uid?: string;
  act?: string;
  serviceKey?: string;
  certificateNumber?: string | null;
  Processor_Family?: string;
  RAM?: string;
  HDD_SSD?: string;
  [key: string]: any;
}

export interface GradeReportResponse {
  distribution: GradeDistributionItem[];
  devices: GradedDeviceItem[];
  totalEvaluated: number;
}

export interface LaptopGradeReportParams {
  fromDate?: string;
  toDate?: string;
  search?: string;
  grade?: string;
  brand?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  start?: number;
  length?: number;
  uid?: string;
  forceRefresh?: boolean;
}

export type MobileGradeReportParams = LaptopGradeReportParams;

export interface PaginatedGradeReportResponse {
  distribution: GradeDistributionItem[];
  devices: GradedDeviceItem[];
  totalEvaluated: number;
  recordsFiltered: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
