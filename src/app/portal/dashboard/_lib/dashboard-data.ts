export interface DashboardStats {
  totalScanned: number;
  scannedDelta: string;
  passRate: number;
  passRateDelta: string;
  avgDurationSec: number;
  avgDurationDelta: string;
  quarantinedCount: number;
  quarantinedDelta: string;
}

export interface ActivityItem {
  id: string;
  deviceModel: string;
  brand: string;
  serial: string;
  type: "Laptop" | "Smartphone" | "Tablet" | "Desktop";
  technician: string;
  score: number;
  grade: "Grade A" | "Grade B" | "Grade C" | "Failed";
  timestamp: string;
  station: string;
  checksPassed: number;
  totalChecks: number;
}

export interface StationData {
  id: string;
  name: string;
  technician: string;
  currentDevice: string;
  status: "active" | "idle" | "evaluating";
  progress: number;
  devicesCompletedToday: number;
}

export const initialStats: DashboardStats = {
  totalScanned: 1428,
  scannedDelta: "+18.4% vs last week",
  passRate: 94.2,
  passRateDelta: "+2.1% pass efficiency",
  avgDurationSec: 11.8,
  avgDurationDelta: "-1.4s speed gain",
  quarantinedCount: 42,
  quarantinedDelta: "3.1% defect rate",
};

export const recentActivities: ActivityItem[] = [
  {
    id: "ACT-9021",
    deviceModel: "MacBook Pro 16\" (M3 Pro, 36GB)",
    brand: "Apple",
    serial: "XC-AP-99210",
    type: "Laptop",
    technician: "Akhil G.",
    score: 98,
    grade: "Grade A",
    timestamp: "2 mins ago",
    station: "Bay 01 (USB-C Bench)",
    checksPassed: 64,
    totalChecks: 64,
  },
  {
    id: "ACT-9020",
    deviceModel: "ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    serial: "XC-LN-44120",
    type: "Laptop",
    technician: "Rohan S.",
    score: 92,
    grade: "Grade A",
    timestamp: "6 mins ago",
    station: "Bay 03 (Automated Rig)",
    checksPassed: 63,
    totalChecks: 64,
  },
  {
    id: "ACT-9019",
    deviceModel: "Dell Latitude 5440 (i7-1365U)",
    brand: "Dell",
    serial: "XC-DL-11029",
    type: "Laptop",
    technician: "Priya M.",
    score: 84,
    grade: "Grade B",
    timestamp: "14 mins ago",
    station: "Bay 02 (Manual Test)",
    checksPassed: 58,
    totalChecks: 64,
  },
  {
    id: "ACT-9018",
    deviceModel: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    serial: "XC-SM-88491",
    type: "Smartphone",
    technician: "Akhil G.",
    score: 96,
    grade: "Grade A",
    timestamp: "21 mins ago",
    station: "Bay 04 (Mobile Dock)",
    checksPassed: 64,
    totalChecks: 64,
  },
  {
    id: "ACT-9017",
    deviceModel: "HP EliteBook 840 G10",
    brand: "HP",
    serial: "XC-HP-77103",
    type: "Laptop",
    technician: "Rohan S.",
    score: 68,
    grade: "Grade C",
    timestamp: "32 mins ago",
    station: "Bay 03 (Automated Rig)",
    checksPassed: 51,
    totalChecks: 64,
  },
  {
    id: "ACT-9016",
    deviceModel: "MacBook Air 13\" (M2)",
    brand: "Apple",
    serial: "XC-AP-33201",
    type: "Laptop",
    technician: "Karan D.",
    score: 42,
    grade: "Failed",
    timestamp: "45 mins ago",
    station: "Bay 01 (USB-C Bench)",
    checksPassed: 38,
    totalChecks: 64,
  },
];

export const activeStations: StationData[] = [
  {
    id: "ST-01",
    name: "Diagnostic Rig 01 (Thunderbolt 4)",
    technician: "Akhil G.",
    currentDevice: "MacBook Pro 14\" (M2 Max)",
    status: "evaluating",
    progress: 78,
    devicesCompletedToday: 54,
  },
  {
    id: "ST-02",
    name: "Diagnostic Rig 02 (PCIe NVMe / CPU)",
    technician: "Priya M.",
    currentDevice: "Dell Precision 5570",
    status: "evaluating",
    progress: 42,
    devicesCompletedToday: 48,
  },
  {
    id: "ST-03",
    name: "Diagnostic Rig 03 (Display / GPU Array)",
    technician: "Rohan S.",
    currentDevice: "Lenovo ThinkPad T14s",
    status: "active",
    progress: 100,
    devicesCompletedToday: 62,
  },
  {
    id: "ST-04",
    name: "Mobile Diagnostic Multi-Dock",
    technician: "Vikram N.",
    currentDevice: "iPhone 15 Pro Max (Batch)",
    status: "idle",
    progress: 0,
    devicesCompletedToday: 39,
  },
];
