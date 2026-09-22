/**
 * License Reports Services
 * ========================
 * Real-time license batch & purchase transaction service from live StoreApi.
 */

import { evaluateApi } from "../core/client";
import { EVALUATE_ENDPOINTS } from "../core/config";
import { authService } from "../core/auth.service";
import { LicenseBatchItem } from "./types";

export const licensesService = {
  getLicenseBatches: async (category: "Mobile" | "Laptop" | "Motherboard" | "Desktop"): Promise<LicenseBatchItem[]> => {
    const user = authService.getUser();
    const userId = user?.id || 1;

    let mstRegId = 214;
    let companyName = "XtraCover Partner Rig";

    try {
      const partner = await authService.getPartnerDetail(userId);
      if (partner?.MstRegID) {
        mstRegId = partner.MstRegID;
        companyName = partner.Company_Name || partner.Contact_person_name || companyName;
      }
    } catch (err) {
      console.warn("Could not resolve partner registration ID for licenses:", err);
    }

    try {
      let endpoint: string = EVALUATE_ENDPOINTS.WORKORDER_DETAIL_MOBILE;
      if (category === "Laptop") {
        endpoint = EVALUATE_ENDPOINTS.WORKORDER_DETAIL_LAPTOP;
      } else if (category === "Motherboard") {
        endpoint = EVALUATE_ENDPOINTS.WORKORDER_DETAIL_MB;
      } else if (category === "Desktop") {
        endpoint = EVALUATE_ENDPOINTS.WORKORDER_DETAIL_NEW;
      }

      const res = await evaluateApi.get<{ DATA?: any[] }>(endpoint, {
        params: { MstRWid: mstRegId },
      });

      const rawList = res?.DATA || (Array.isArray(res) ? res : []);
      if (Array.isArray(rawList) && rawList.length > 0) {
        return rawList.map((item: any, idx: number) => {
          const purchased = Number(item.Device_Qty) || 0;
          const consumed = Number(item.UplodedQty) || 0;
          const pending = Number(item.PendingQty) || 0;
          const status = pending <= 0 ? "Exhausted" : pending < 5 ? "Near Expiry" : "Active";

          return {
            id: item.MstID || idx + 1,
            batchCode: String(item.Work_Order_no || `WO-${category.toUpperCase()}-${idx + 1}`),
            companyName: companyName,
            category: category,
            totalPurchased: purchased,
            consumed: consumed,
            remaining: pending,
            assignedStore: item.MobileType || "Central Station",
            allocatedDate: item.CreatedOn ? new Date(item.CreatedOn).toLocaleDateString("en-GB") : "N/A",
            expiryDate: item.CreatedOn
              ? new Date(new Date(item.CreatedOn).setFullYear(new Date(item.CreatedOn).getFullYear() + 1)).toLocaleDateString("en-GB")
              : "N/A",
            status: status as any,
          };
        });
      }
    } catch (err: any) {
      console.warn(`Live ${category} license batches API error:`, err);
      throw err;
    }

    return [];
  },
};
