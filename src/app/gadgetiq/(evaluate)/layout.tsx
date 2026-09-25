"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Smartphone,
  Laptop,
  Cpu,
  Monitor,
  ShieldCheck,
  KeyRound,
  Key,
  FileKey,
  Award,
  Medal,
  UploadCloud,
  CalendarCheck,
  Headphones,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";


import {
  getAuthToken,
  getAuthUser,
  authService,
  STORAGE_KEYS,
  EvaluateAuthUser,
} from "./core";
import { LogoutConfirmModal } from "@/components/ui/LogoutConfirmModal";

const PAGE_METADATA: Record<string, { title: string; subtitle: string }> = {
  "/gadgetiq/dashboard": {
    title: "Dashboard",
    subtitle: "Real-time hardware license quotas & diagnostic operations",
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
  "/gadgetiq/reports/monthly-summary": {
    title: "QC Monthly Summary Report",
    subtitle: "Aggregated monthly testing throughput, pass ratios, and license velocity",
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
  "/gadgetiq/system-config": {
    title: "Upload System Config",
    subtitle: "Upload and calibrate diagnostic XML/Excel test specifications",
  },
  "/gadgetiq/onboarding": {
    title: "User Onboarding & Approvals",
    subtitle: "Review applicant registrations and approve technician accounts",
  },
  "/gadgetiq/users": {
    title: "User Management",
    subtitle: "Manage all system technicians, company operators, and administrators",
  },
};


// Grouped Navigation Structure mirroring Lens standard
const NAV_SECTIONS = [
  {
    title: "Overview",
    items: [
      { path: "/gadgetiq/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/gadgetiq/reports/monthly-summary", label: "Monthly Summary", icon: CalendarCheck },
    ],
  },
  {
    title: "QC Diagnostics",
    items: [
      { path: "/gadgetiq/reports/laptop", label: "Laptop QC", icon: Laptop },
      { path: "/gadgetiq/reports/mobile", label: "Mobile QC", icon: Smartphone },
      { path: "/gadgetiq/reports/motherboard", label: "Motherboard QC", icon: Cpu },
      { path: "/gadgetiq/reports/desktop", label: "Desktop QC", icon: Monitor },
      { path: "/gadgetiq/reports/desktop-motherboard", label: "Desktop Motherboard QC", icon: Cpu },
    ],
  },
  {
    title: "License Quota",
    items: [
      { path: "/gadgetiq/licenses/laptop", label: "Laptop Licences", icon: Key },
      { path: "/gadgetiq/licenses/mobile", label: "Mobile Licences", icon: KeyRound },
      { path: "/gadgetiq/licenses/motherboard", label: "MB Licences", icon: FileKey },
    ],
  },
  {
    title: "Grading Telemetry",
    items: [
      { path: "/gadgetiq/grades/laptop", label: "Laptop Grades", icon: Award },
      { path: "/gadgetiq/grades/mobile", label: "Mobile Grades", icon: Medal },
      { path: "/gadgetiq/grades/accessories", label: "Accessory Grades", icon: Headphones },
    ],
  },
  {
    title: "Configuration",
    items: [
      { path: "/gadgetiq/system-config", label: "System Config", icon: UploadCloud },
    ],
  },
];



export default function GadgetEvaluateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<EvaluateAuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Check if current route is a public page (Landing, Public Certificate, or Login redirect)
  const isLandingPage =
    pathname === "/gadgetiq" ||
    pathname === "/gadgetiq/" ||
    pathname === "/gadgetiq/evaluate" ||
    pathname === "/gadgetiq/evaluate/" ||
    pathname === "/gadgetiq/lens" ||
    pathname === "/gadgetiq/lens/";
  const isCertificate = pathname?.startsWith("/gadgetiq/certificate/");
  const isLogin = pathname === "/gadgetiq/login" || pathname === "/gadgetiq/login/";
  const isSignUp = pathname === "/gadgetiq/signup" || pathname === "/gadgetiq/signup/";
  const isPublicRoute = isLandingPage || isCertificate || isLogin || isSignUp;

  // Restore collapsed state preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
      if (saved === "true") {
        setIsCollapsed(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(next));
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  };

  useEffect(() => {
    if (isPublicRoute) {
      setLoading(false);
      return;
    }

    const token = getAuthToken();
    const storedUser = getAuthUser<EvaluateAuthUser>();

    if (!token) {
      router.replace("/gadgetiq/login");
      return;
    }

    setUser(
      storedUser || {
        id: 0,
        username: "technician",
        fullName: "Technician",
        role: "Operator",
      }
    );
    setLoading(false);
  }, [pathname, router, isPublicRoute]);

  const handleLogout = () => {
    authService.logout();
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex flex-col items-center justify-center p-4">
        <div className="w-9 h-9 border-3 border-[#0052CC] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs sm:text-sm font-semibold text-[#17284D]">
          Verifying Gadget Evaluate session...
        </p>
      </div>
    );
  }

  const currentMeta = PAGE_METADATA[pathname || ""] || {
    title: "Gadget Evaluate",
    subtitle: "Hardware Diagnostics & QC Management Suite",
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#17284D] font-sans flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ========================================================= */}
      {/* SIDEBAR */}
      {/* ========================================================= */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-[#DDE4F3] flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${isCollapsed ? "w-20" : "w-64"
          } ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Header */}
          <div
            className={`py-3.5 border-b border-[#DDE4F3] flex items-center bg-white shrink-0 ${isCollapsed ? "px-2 justify-center flex-col gap-2" : "px-4 justify-between"
              }`}
          >
            <Link
              href="/gadgetiq/dashboard"
              className={`flex flex-col min-w-0 group ${isCollapsed ? "items-center" : "items-start"
                }`}
              title="Gadget Evaluate Workstation"
            >
              {isCollapsed ? (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0052CC] to-[#0065FF] text-white flex flex-col items-center justify-center font-black font-display text-sm shadow-xs">
                  <span>GE</span>
                </div>
              ) : (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logoblack.png"
                    alt="GadgetIQ"
                    className="h-6 sm:h-7 w-auto object-contain max-w-[135px]"
                  />
                  <div className="flex items-center space-x-1.5 mt-1.5 pl-3">
                    <span className="px-2 py-0.5 rounded-[4px] bg-[#0052CC] text-white font-display font-bold text-[10px] tracking-wider uppercase">
                      Evaluate
                    </span>

                  </div>
                </>
              )}
            </Link>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={toggleCollapse}
              className={`hidden lg:flex items-center justify-center p-1.5 rounded-[6px] text-[#5F6A86] hover:text-[#0052CC] hover:bg-slate-100 transition-colors cursor-pointer ${isCollapsed ? "w-8 h-8 mt-1" : ""
                }`}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-[6px] text-[#5F6A86] hover:bg-slate-100 lg:hidden cursor-pointer shrink-0 ml-2"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categorized Navigation Menu */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-1">
                {!isCollapsed && (
                  <div className="px-3 pt-1 pb-1 text-[10px] font-bold text-[#5F6A86] tracking-wider uppercase">
                    {section.title}
                  </div>
                )}
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        title={isCollapsed ? item.label : undefined}
                        className={`flex items-center rounded-[8px] text-xs font-semibold transition-all duration-150 relative ${isCollapsed
                          ? "justify-center p-2.5"
                          : "space-x-3 px-3.5 py-2"
                          } ${isActive
                            ? "bg-[#E9EEF9] text-[#0052CC] shadow-xs font-bold"
                            : "text-[#4A5875] hover:bg-slate-50 hover:text-[#17284D]"
                          }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${isActive ? "text-[#0052CC]" : "text-[#5F6A86]"
                            }`}
                        />
                        {!isCollapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                        {!isCollapsed && isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#0052CC] shrink-0" />
                        )}
                        {isCollapsed && isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-l-full bg-[#0052CC]" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="p-3 border-t border-[#DDE4F3] shrink-0 bg-white space-y-2">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-9 h-9 rounded-full bg-[#0052CC] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ring-2 ring-blue-100"
                title={`${user?.fullName || user?.username || "Technician"} (${user?.role || "Operator"
                  })`}
              >
                {(user?.fullName || user?.username || "T")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                title="Log out"
                className="p-2 rounded-[6px] text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <button
                onClick={toggleCollapse}
                title="Expand Sidebar"
                className="hidden lg:flex items-center justify-center w-full py-1.5 rounded-[6px] text-[#5F6A86] hover:bg-[#E9EEF9] hover:text-[#0052CC] border border-[#DDE4F3] transition-colors cursor-pointer"
                aria-label="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-2.5 rounded-[8px] bg-[#F4F6FB] border border-[#DDE4F3] flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-8 h-8 rounded-[6px] bg-[#0052CC] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {(user?.fullName || user?.username || "T")
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#17284D] truncate">
                    {user?.fullName || user?.username || "Technician"}
                  </div>
                  <div className="text-[10px] font-mono text-[#5F6A86] uppercase truncate">
                    {user?.role || "Operator"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutConfirm(true)}
                title="Log out"
                className="p-1.5 rounded-[6px] text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-[padding-left] duration-300 ease-in-out ${isCollapsed ? "lg:pl-20" : "lg:pl-64"
          }`}
      >
        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-30 h-16 w-full px-4 sm:px-6 lg:px-8 bg-white/95 backdrop-blur-md border-b border-[#DDE4F3] flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-[8px] text-[#17284D] hover:bg-slate-100 lg:hidden cursor-pointer shrink-0"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-bold font-display text-[#17284D] tracking-tight truncate">
                {currentMeta.title}
              </h1>
              {currentMeta.subtitle && (
                <p className="text-[11px] sm:text-xs text-[#5F6A86] hidden md:block truncate">
                  {currentMeta.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Header: Workstation Status & Welcome Back Pill */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-[10px] bg-[#F4F6FB] border border-[#DDE4F3] shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0052CC] to-[#0065FF] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0 ring-2 ring-blue-100">
                {(user?.fullName || user?.username || "T").charAt(0)}
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-[10px] font-medium text-[#5F6A86] leading-none mb-0.5">
                  Welcome Back
                </span>
                <span className="font-bold text-xs text-[#17284D] leading-tight truncate max-w-[120px] sm:max-w-[180px]">
                  {user?.fullName || user?.username || "Technician"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Double confirmation modal for logout */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        userName={user?.fullName || user?.username || "Technician"}
        userRole={user?.role || "Operator"}
      />
    </div>
  );
}
