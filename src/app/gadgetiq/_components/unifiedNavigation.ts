import {
  LayoutDashboard,
  CalendarCheck,
  Laptop,
  Smartphone,
  Cpu,
  Monitor,
  FileText,
  GitBranch,
  Sliders,
  Key,
  KeyRound,
  FileKey,
  Award,
  Medal,
  Headphones,
  Building2,
  Users,
  UserCheck,
  MessageSquare,
  UploadCloud,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/**
 * Universal Navigation Tree
 * =========================
 * Merges all active menus across Gadget Evaluate, Gadget Lens,
 * hardware diagnostics, AI visual inspection, quotas, grading, and administration.
 */
export const UNIFIED_NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        path: "/gadgetiq/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        description: "Real-time hardware license quotas & operations",
      },
      {
        path: "/gadgetiq/reports/monthly-summary",
        label: "Monthly Summary",
        icon: CalendarCheck,
        description: "Aggregated monthly testing throughput and velocity",
      },
    ],
  },
  {
    title: "QC Diagnostics",
    items: [
      {
        path: "/gadgetiq/reports/laptop",
        label: "Laptop QC",
        icon: Laptop,
        description: "64-point laptop diagnostics and hardware audit",
      },
      {
        path: "/gadgetiq/reports/mobile",
        label: "Mobile QC",
        icon: Smartphone,
        description: "Mobile battery, sensor, and functional testing records",
      },
      {
        path: "/gadgetiq/reports/motherboard",
        label: "Motherboard QC",
        icon: Cpu,
        description: "Motherboard inspection and component integrity verification",
      },
      {
        path: "/gadgetiq/reports/desktop",
        label: "Desktop QC",
        icon: Monitor,
        description: "Desktop diagnostics and performance benchmarks",
      },
      {
        path: "/gadgetiq/reports/desktop-motherboard",
        label: "Desktop MB QC",
        icon: Cpu,
        description: "Desktop motherboard evaluation and PCIe bus test logs",
      },
    ],
  },
  {
    title: "Visual & Lens QC",
    items: [
      {
        path: "/gadgetiq/reports",
        label: "Lens QC Reports",
        icon: FileText,
        description: "Device AI optical scan and cosmetic grading records",
      },
      {
        path: "/gadgetiq/workflows",
        label: "Workflows",
        icon: GitBranch,
        description: "Manage OS-specific device grading questionnaires",
      },
      {
        path: "/gadgetiq/diagnostic-configs",
        label: "Diagnostic Configs",
        icon: Sliders,
        description: "Manage scoring weights, tolerances, and test deducts",
      },
    ],
  },
  {
    title: "License Quota",
    items: [
      {
        path: "/gadgetiq/licenses/laptop",
        label: "Laptop Licences",
        icon: Key,
        description: "Laptop diagnostics license batch tracking",
      },
      {
        path: "/gadgetiq/licenses/mobile",
        label: "Mobile Licences",
        icon: KeyRound,
        description: "Mobile testing license allocation and quota",
      },
      {
        path: "/gadgetiq/licenses/motherboard",
        label: "MB Licences",
        icon: FileKey,
        description: "Motherboard testing license provisioning",
      },
    ],
  },
  {
    title: "Grading Telemetry",
    items: [
      {
        path: "/gadgetiq/grades/laptop",
        label: "Laptop Grades",
        icon: Award,
        description: "Laptop cosmetic and functional grade distributions",
      },
      {
        path: "/gadgetiq/grades/mobile",
        label: "Mobile Grades",
        icon: Medal,
        description: "Smartphone condition distribution and grading telemetry",
      },
      {
        path: "/gadgetiq/grades/accessories",
        label: "Accessory Grades",
        icon: Headphones,
        description: "Peripherals, chargers, and cables grading breakdown",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        path: "/gadgetiq/companies",
        label: "Companies",
        icon: Building2,
        description: "Manage tenant companies and device quotas",
      },
      {
        path: "/gadgetiq/users",
        label: "User Management",
        icon: Users,
        description: "Manage system technicians, operators, and administrators",
      },
      {
        path: "/gadgetiq/onboarding",
        label: "User Approvals",
        icon: UserCheck,
        description: "Review applicant registrations and approve accounts",
      },
      {
        path: "/gadgetiq/contact-entries",
        label: "Contact Entries",
        icon: MessageSquare,
        description: "View and manage incoming demo and client inquiries",
      },
      {
        path: "/gadgetiq/system-config",
        label: "System Config",
        icon: UploadCloud,
        description: "Upload and calibrate diagnostic test specifications",
      },
    ],
  },
];

/**
 * Universal Page Metadata Map
 */
export const UNIFIED_PAGE_METADATA: Record<string, { title: string; subtitle: string }> = {
  "/gadgetiq/dashboard": {
    title: "Dashboard",
    subtitle: "Real-time hardware license quotas & diagnostic operations",
  },
  "/gadgetiq/reports/monthly-summary": {
    title: "QC Monthly Summary Report",
    subtitle: "Aggregated monthly testing throughput, pass ratios, and license velocity",
  },
  "/gadgetiq/reports/laptop": {
    title: "QC Laptop Report",
    subtitle: "Comprehensive 64-point laptop diagnostics and hardware audit",
  },
  "/gadgetiq/reports/laptop/certificate": {
    title: "Laptop Quality Certificate",
    subtitle: "Official 34-point hardware quality and diagnostic certificate",
  },
  "/gadgetiq/reports/mobile": {
    title: "QC Report (Mobile)",
    subtitle: "Complete mobile battery, sensor, and functional testing records",
  },
  "/gadgetiq/reports/mobile/certificate": {
    title: "Mobile Quality Certificate",
    subtitle: "Official 24-point mobile hardware quality and diagnostic certificate",
  },
  "/gadgetiq/reports/motherboard": {
    title: "Motherboard QC Report",
    subtitle: "Motherboard hardware inspection and component integrity verification",
  },
  "/gadgetiq/reports/desktop": {
    title: "Desktop QC Report",
    subtitle: "Desktop diagnostics and performance benchmarks",
  },
  "/gadgetiq/reports/desktop-motherboard": {
    title: "Desktop Motherboard QC Report",
    subtitle: "Desktop motherboard evaluation and PCIe bus test logs",
  },
  "/gadgetiq/reports": {
    title: "Lens QC Reports",
    subtitle: "Browse and inspect all device diagnostic & AI optical records",
  },
  "/gadgetiq/workflows": {
    title: "Workflows",
    subtitle: "Manage OS-specific device grading questionnaires and workflows",
  },
  "/gadgetiq/diagnostic-configs": {
    title: "Diagnostic Configurations",
    subtitle: "Manage scoring weights, tolerances, and test deducts",
  },
  "/gadgetiq/licenses/mobile": {
    title: "Licence Report (Mobile)",
    subtitle: "Mobile testing license allocation, activations, and remaining quota",
  },
  "/gadgetiq/licenses/laptop": {
    title: "Licence Report (Laptop)",
    subtitle: "Laptop diagnostics license batch tracking and usage records",
  },
  "/gadgetiq/licenses/motherboard": {
    title: "Licence Report (Motherboard)",
    subtitle: "Motherboard testing license provisioning and store quotas",
  },
  "/gadgetiq/grades/laptop": {
    title: "Grade Report Laptop",
    subtitle: "Laptop cosmetic and functional grade distributions (Grade A/B/C/D)",
  },
  "/gadgetiq/grades/mobile": {
    title: "Grade Report Mobile",
    subtitle: "Smartphone condition distribution and grading telemetry",
  },
  "/gadgetiq/grades/accessories": {
    title: "Grade Report Accessories",
    subtitle: "Chargers, cables, and peripherals grading and inspection breakdown",
  },
  "/gadgetiq/companies": {
    title: "Companies",
    subtitle: "Manage tenant companies and device quotas",
  },
  "/gadgetiq/users": {
    title: "User Management",
    subtitle: "Manage all system technicians, company operators, and administrators",
  },
  "/gadgetiq/onboarding": {
    title: "User Onboarding & Approvals",
    subtitle: "Review applicant registrations and approve technician accounts",
  },
  "/gadgetiq/contact-entries": {
    title: "GadgetIQ Contact Entries",
    subtitle: "View and manage incoming demo and client inquiries",
  },
  "/gadgetiq/system-config": {
    title: "Upload System Config",
    subtitle: "Upload and calibrate diagnostic XML/Excel test specifications",
  },
};

/**
 * Determine dynamic page metadata based on current pathname
 */
export function getPageMetadata(pathname: string | null): { title: string; subtitle: string } {
  if (!pathname) {
    return {
      title: "GadgetIQ Workstation",
      subtitle: "Universal Hardware Diagnostics & AI Optical Quality Suite",
    };
  }

  const cleanPath = pathname.replace(/\/$/, "");

  if (UNIFIED_PAGE_METADATA[cleanPath]) {
    return UNIFIED_PAGE_METADATA[cleanPath];
  }

  // Dynamic Detail Routes
  if (cleanPath.startsWith("/gadgetiq/reports/laptop/")) {
    return {
      title: "Laptop Diagnostic Detail",
      subtitle: "Detailed 64-Point Laptop Hardware Diagnostics & Component Log",
    };
  }
  if (cleanPath.startsWith("/gadgetiq/reports/mobile/")) {
    return {
      title: "Mobile Diagnostic Detail",
      subtitle: "Detailed 24-Point Mobile Subsystem & Battery Inspection",
    };
  }
  if (
    cleanPath.startsWith("/gadgetiq/reports/") &&
    !cleanPath.startsWith("/gadgetiq/reports/laptop") &&
    !cleanPath.startsWith("/gadgetiq/reports/mobile") &&
    !cleanPath.startsWith("/gadgetiq/reports/motherboard") &&
    !cleanPath.startsWith("/gadgetiq/reports/desktop") &&
    !cleanPath.startsWith("/gadgetiq/reports/monthly-summary")
  ) {
    return {
      title: "Lens Report Detail",
      subtitle: "Detailed AI Optical Surface Inspection & Diagnostic Breakdown",
    };
  }
  if (cleanPath.startsWith("/gadgetiq/grades/laptop/visualize")) {
    return {
      title: "Laptop Grading Visualizer",
      subtitle: "Visual Defect Mapping & 3D Cosmetic Damage Breakdown",
    };
  }
  if (cleanPath.startsWith("/gadgetiq/grades/mobile/visualize")) {
    return {
      title: "Mobile Grading Visualizer",
      subtitle: "Visual Defect Mapping & Screen/Chassis Damage Inspection",
    };
  }

  return {
    title: "GadgetIQ Workstation",
    subtitle: "Universal Hardware Diagnostics & AI Optical Quality Suite",
  };
}

/**
 * Precise route matching for active sidebar indicator
 */
export function isNavItemActive(itemPath: string, currentPathname: string | null): boolean {
  if (!currentPathname) return false;
  const current = currentPathname.replace(/\/$/, "");
  const target = itemPath.replace(/\/$/, "");

  if (target === "/gadgetiq/dashboard") {
    return current === "/gadgetiq/dashboard";
  }

  if (target === "/gadgetiq/reports") {
    if (current === "/gadgetiq/reports") return true;
    const evalReports = [
      "/gadgetiq/reports/laptop",
      "/gadgetiq/reports/mobile",
      "/gadgetiq/reports/motherboard",
      "/gadgetiq/reports/desktop",
      "/gadgetiq/reports/desktop-motherboard",
      "/gadgetiq/reports/monthly-summary",
    ];
    const isEvalReport = evalReports.some((sub) => current.startsWith(sub));
    return current.startsWith("/gadgetiq/reports/") && !isEvalReport;
  }

  if (target === "/gadgetiq/reports/desktop") {
    return current.startsWith("/gadgetiq/reports/desktop") && !current.startsWith("/gadgetiq/reports/desktop-motherboard");
  }

  return current === target || current.startsWith(`${target}/`);
}
