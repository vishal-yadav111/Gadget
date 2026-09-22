/**
 * Gadget Evaluate (XC-QC) Configuration
 * =====================================
 * Zero-hardcoding environment configuration for production, UAT, and local development.
 */

export const getEvaluateServerUrl = (): string => {
  // In the browser, ALWAYS use the same-origin Next.js server proxy to prevent CORS errors
  if (typeof window !== "undefined") {
    return "/api/evaluate";
  }
  return (
    process.env.STORETEMP_API_URL ||
    process.env.STORE_API_URL ||
    process.env.NEXT_PUBLIC_EVALUATE_API_URL ||
    "https://storetemp.xtracover.com/api/StoreApi"
  )
    .trim()
    .replace(/\/+$/, "");
};

export const getBrahmaServerUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_BRAHMA_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")
  )
    .trim()
    .replace(/\/+$/, "");
};

export const STORAGE_KEYS = {
  TOKEN: "gadgetiq_token",
  USER: "gadgetiq_user",
  PROJECTS: "gadgetiq_project_access",
  EVALUATE_PARTNER: "gadgetiq_evaluate_partner",
  SIDEBAR_COLLAPSED: "gadgetiq_evaluate_sidebar_collapsed",
} as const;

export const EVALUATE_ENDPOINTS = {
  PARTNER_DETAIL: "/GetSalePartnerRegistrationList",
  PARTNER_CODE_LIST: "/GetSalePartnerCodeList",
  SALES_PERSONS: "/GetSalesPersonList",
  DEVICE_TYPES: "/GetDeviceTypeListRW",

  // License counts for dashboard metric cards
  LICENCE_MOBILE: "/LicenceCountDetail",
  LICENCE_LAPTOP: "/LicenceCountDetaillp",
  LICENCE_MB: "/LicenceCountDetailmb",
  LICENCE_DT: "/LicenceCountDetaildt",
  LICENCE_DTMB: "/LicenceCountDetailmbdt",

  // Work order license details (history & batches)
  WORKORDER_DETAIL_NEW: "/GetWOrkorderDetailnew",
  WORKORDER_DETAIL_MOBILE: "/GetWOrkorderDetail",
  WORKORDER_DETAIL_LAPTOP: "/GetWOrkorderDetaillp",
  WORKORDER_DETAIL_MB: "/GetWOrkorderDetailnew",

  // QC Work Order reports
  QC_REPORT_LIST: "/GetQCWorkOrderList",
  QC_REPORT_MOBILE: "/Report/Get_AddOnViewQcResult",
  QC_REPORT_LAPTOP: "/Report/Get_AddOnViewQcResultlp",
  QC_REPORT_MB: "/Report/Get_AddOnViewQcResultmb",
  QC_REPORT_MH: "/Report/Get_AddOnViewQcResultmh",
  QC_REPORT_DT: "/Report/Get_AddOnViewQcResultdt",
  QC_REPORT_DTMB: "/Report/Get_AddOnViewQcResultdtmb",
  QC_REPORT_BY_SALESPERSON: "/GetQCWorkOrderListBySalesPerson",

  // Certificates
  CERTIFICATE_BY_ID: "/GetQCCertificate",
  CERTIFICATE_BY_KEY: "/GetQCCertificateBykey",
  CERTIFICATE_LAPTOP: "/GetQCCertificatelp",
  CERTIFICATE_CONFIG: "/GetQCCertificateconfg",
  CERTIFICATE_MB: "/GetQCCertificatemb",
  CERTIFICATE_DT: "/GetQCCertificatedt",
  CERTIFICATE_DTMB: "/GetQCCertificateMBDT",

  // Battery stress tests
  BATTERY_STRESS_TEST: "/GetBatteryStressTestResult",
  BATTERY_STRESS_TEST_NEW: "/GetBatteryStressTestResultnew",
} as const;
