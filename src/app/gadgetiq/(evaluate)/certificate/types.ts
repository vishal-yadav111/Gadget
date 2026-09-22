/**
 * Evaluate Certificate Types
 * ==========================
 */

export interface EvaluationCertificateData {
  serviceKey: string;
  certificateNumber: string;
  deviceType: "laptop" | "mobile" | "motherboard" | "desktop";
  brand: string;
  model: string;
  serialNumber: string;
  imei?: string;
  overallResult: "PASS" | "FAIL";
  overallGrade: string;
  testedAt: string;
  technician: string;
  qrCodeUrl?: string;
  specs: {
    processor?: string;
    ram?: string;
    storage?: string;
    batteryHealth?: string;
    screenSize?: string;
  };
  checkResults: {
    name: string;
    passed: boolean;
    category: string;
  }[];
}
