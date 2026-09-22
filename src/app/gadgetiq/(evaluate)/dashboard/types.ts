/**
 * Gadget Evaluate Dashboard Types
 * ===============================
 * Matching the multi-tier license counters from qc.xtracover.com.
 */

export interface LicenceCountItem {
  Device_Qty: number;   // Total Licence Purchased
  PendingQty: number;   // Total Licence Pending
  UplodedQty: number;   // Total Licence Used
}

export interface WorkOrderHistoryItem {
  MstID?: number;
  MstRWid?: number;
  Work_Order_no: string;
  Device_Qty: number;
  CreatedOn?: string;
  UplodedQty?: number;
  PendingQty?: number;
  PassQty?: number;
  FailQty?: number;
  QCStatus?: string;
  MobileType?: string;
  DeviceType?: string;
}

export interface EvaluateDashboardStats {
  mobile: LicenceCountItem;
  laptop: LicenceCountItem;
  motherboard: LicenceCountItem;
  desktop: LicenceCountItem;
  desktopMotherboard: LicenceCountItem;
  partnerName?: string;
  partnerCode?: string;
  recentWorkOrders: WorkOrderHistoryItem[];
  totalEvaluationsCount: number;
  overallPassRate: number;
}
