export interface DefectItem {
  component: string;
  category: string;
  failureCount: number;
  percentage: number;
  severity: "Critical" | "Moderate" | "Minor";
}

export interface TechnicianMetric {
  name: string;
  station: string;
  devicesScanned: number;
  avgDurationSec: number;
  passRate: number;
  accuracyRate: number;
}

export interface BrandStats {
  brand: string;
  scanned: number;
  passRate: number;
  avgScore: number;
  topIssue: string;
}

export const defectDistribution: DefectItem[] = [
  { component: "Battery Capacity (<80%)", category: "Power", failureCount: 142, percentage: 38.2, severity: "Moderate" },
  { component: "Display Sub-pixel / Backlight Bleed", category: "Visuals", failureCount: 88, percentage: 23.6, severity: "Moderate" },
  { component: "NVMe Storage Bad Blocks / S.M.A.R.T.", category: "Storage", failureCount: 46, percentage: 12.4, severity: "Critical" },
  { component: "Keyboard Key Switch Actuation", category: "Peripherals", failureCount: 39, percentage: 10.5, severity: "Minor" },
  { component: "Motherboard Thermal VRM Throttling", category: "Board", failureCount: 32, percentage: 8.6, severity: "Critical" },
  { component: "Camera / Microphone Array Noise", category: "Multimedia", failureCount: 25, percentage: 6.7, severity: "Minor" },
];

export const technicianMetrics: TechnicianMetric[] = [
  { name: "Akhil Gupta", station: "Rig 01 (Thunderbolt 4)", devicesScanned: 482, avgDurationSec: 10.8, passRate: 96.4, accuracyRate: 99.8 },
  { name: "Rohan Sharma", station: "Rig 03 (Automated Rig)", devicesScanned: 440, avgDurationSec: 11.2, passRate: 94.8, accuracyRate: 99.4 },
  { name: "Priya Malhotra", station: "Rig 02 (PCIe / CPU)", devicesScanned: 380, avgDurationSec: 12.6, passRate: 93.2, accuracyRate: 99.1 },
  { name: "Vikram Nair", station: "Mobile Dock Bay 04", devicesScanned: 310, avgDurationSec: 13.4, passRate: 91.8, accuracyRate: 98.7 },
];

export const brandBreakdowns: BrandStats[] = [
  { brand: "Apple", scanned: 540, passRate: 97.2, avgScore: 96.8, topIssue: "Battery Cycle Aging" },
  { brand: "Lenovo", scanned: 380, passRate: 94.8, avgScore: 93.4, topIssue: "Trackpad Micro-switch" },
  { brand: "Dell", scanned: 290, passRate: 92.4, avgScore: 89.2, topIssue: "Display Backlight Bleed" },
  { brand: "Samsung", scanned: 160, passRate: 96.0, avgScore: 95.1, topIssue: "USB-PD Port Resistance" },
  { brand: "HP", scanned: 140, passRate: 88.5, avgScore: 84.6, topIssue: "NVMe Thermal Throttling" },
];
