export interface CertificateReport {
  id: string;
  certificateNumber: string;
  cryptoHash: string;
  deviceModel: string;
  brand: string;
  serial: string;
  imei?: string;
  grade: "Grade A" | "Grade B" | "Grade C" | "Failed";
  healthScore: number;
  checksPassed: number;
  totalChecks: number;
  batteryHealth: number;
  cycleCount: number;
  issuedAt: string;
  auditorName: string;
  auditorTitle: string;
  warrantyPeriodMonths: number;
  status: "Certified" | "Revoked" | "Pending Review";
}

export const initialCertificates: CertificateReport[] = [
  {
    id: "CERT-9021",
    certificateNumber: "XC-CERT-2026-9021",
    cryptoHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    deviceModel: "MacBook Pro 16\" (M3 Max, 64GB)",
    brand: "Apple",
    serial: "XC-AP-994821",
    grade: "Grade A",
    healthScore: 98,
    checksPassed: 64,
    totalChecks: 64,
    batteryHealth: 99,
    cycleCount: 28,
    issuedAt: "2026-09-02",
    auditorName: "Akhil Gupta",
    auditorTitle: "Lead QC Engineer, XtraCover Tech",
    warrantyPeriodMonths: 12,
    status: "Certified",
  },
  {
    id: "CERT-9020",
    certificateNumber: "XC-CERT-2026-9020",
    cryptoHash: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    deviceModel: "ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    serial: "XC-LN-772019",
    grade: "Grade A",
    healthScore: 94,
    checksPassed: 63,
    totalChecks: 64,
    batteryHealth: 94,
    cycleCount: 65,
    issuedAt: "2026-09-02",
    auditorName: "Rohan Sharma",
    auditorTitle: "Senior Systems Diagnostician",
    warrantyPeriodMonths: 12,
    status: "Certified",
  },
  {
    id: "CERT-9019",
    certificateNumber: "XC-CERT-2026-9019",
    cryptoHash: "d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
    deviceModel: "Samsung Galaxy S24 Ultra 512GB",
    brand: "Samsung",
    serial: "XC-SM-104928",
    imei: "869402019284710",
    grade: "Grade A",
    healthScore: 97,
    checksPassed: 64,
    totalChecks: 64,
    batteryHealth: 98,
    cycleCount: 42,
    issuedAt: "2026-09-02",
    auditorName: "Akhil Gupta",
    auditorTitle: "Lead QC Engineer, XtraCover Tech",
    warrantyPeriodMonths: 12,
    status: "Certified",
  },
  {
    id: "CERT-9018",
    certificateNumber: "XC-CERT-2026-9018",
    cryptoHash: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    deviceModel: "Dell Latitude 5440 Enterprise",
    brand: "Dell",
    serial: "XC-DL-388204",
    grade: "Grade B",
    healthScore: 88,
    checksPassed: 60,
    totalChecks: 64,
    batteryHealth: 86,
    cycleCount: 142,
    issuedAt: "2026-09-01",
    auditorName: "Priya Malhotra",
    auditorTitle: "QC Hardware Auditor",
    warrantyPeriodMonths: 12,
    status: "Certified",
  },
  {
    id: "CERT-9017",
    certificateNumber: "XC-CERT-2026-9017",
    cryptoHash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    deviceModel: "iPhone 15 Pro 256GB (Natural Ti)",
    brand: "Apple",
    serial: "XC-AP-552194",
    imei: "354091029384712",
    grade: "Grade A",
    healthScore: 96,
    checksPassed: 64,
    totalChecks: 64,
    batteryHealth: 96,
    cycleCount: 88,
    issuedAt: "2026-09-01",
    auditorName: "Akhil Gupta",
    auditorTitle: "Lead QC Engineer, XtraCover Tech",
    warrantyPeriodMonths: 12,
    status: "Certified",
  },
];
