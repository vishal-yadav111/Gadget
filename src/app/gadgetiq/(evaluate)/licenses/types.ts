/**
 * License Reports Types
 * =====================
 */

export interface LicenseBatchItem {
  id: number | string;
  batchCode: string;
  companyName: string;
  category: "Mobile" | "Laptop" | "Motherboard" | "Desktop";
  totalPurchased: number;
  consumed: number;
  remaining: number;
  assignedStore: string;
  allocatedDate: string;
  expiryDate: string;
  status: "Active" | "Near Expiry" | "Exhausted";
}
