"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Cpu,
  Smartphone,
  FileCheck2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  HelpCircle,
  LogOut,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  tone?: "brand" | "success" | "accent";
}

export default function PortalSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const mainNav: NavItem[] = [
    {
      label: "Dashboard",
      href: "/portal/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: "Live Diagnostics",
      href: "/portal/diagnostics",
      icon: <Cpu className="w-4 h-4" />,
      badge: "64-Point",
      tone: "accent",
    },
    {
      label: "Device Fleet",
      href: "/portal/devices",
      icon: <Smartphone className="w-4 h-4" />,
      badge: "1,420",
    },
    {
      label: "Audit Reports",
      href: "/portal/reports",
      icon: <FileCheck2 className="w-4 h-4" />,
    },
    {
      label: "Quality Analytics",
      href: "/portal/analytics",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      label: "Settings & API",
      href: "/portal/settings",
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col justify-between border-r border-[#DDE4F3] bg-white transition-all duration-300 ease-in-out shrink-0 z-30 select-none",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 border-b border-[#DDE4F3] px-4 flex items-center justify-between">
        {!collapsed ? (
          <Link href="/portal/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0052CC] to-[#003D99] flex items-center justify-center font-bold text-white text-sm shadow-sm">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-base tracking-tight text-[#17284D] leading-none">
                Gadget<span className="text-[#0052CC]">Evaluate</span>
              </span>
              <span className="text-[10px] font-semibold text-[#5F6A86] tracking-wider uppercase mt-0.5">
                Enterprise Portal
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/portal/dashboard"
            className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#0052CC] to-[#003D99] flex items-center justify-center font-bold text-white text-sm shadow-sm mx-auto"
          >
            <ShieldCheck className="w-5 h-5 text-white" />
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-lg text-[#5F6A86] hover:text-[#17284D] hover:bg-[#E9EEF9] transition-colors cursor-pointer",
            collapsed && "hidden"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Organization Switcher Badge */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="p-2.5 rounded-lg bg-[#F4F6FB] border border-[#DDE4F3] flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-[#0052CC] shrink-0 font-bold text-xs">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#17284D] truncate">
                  XtraCover Central Hub
                </p>
                <p className="text-[10px] text-[#5F6A86] truncate">
                  Tech Ops • Station 04
                </p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Station Online" />
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/portal/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group cursor-pointer",
                isActive
                  ? "bg-[#0052CC] text-white shadow-xs font-bold"
                  : "text-[#4A5875] hover:text-[#17284D] hover:bg-[#F4F6FB]"
              )}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <span
                  className={cn(
                    "shrink-0",
                    isActive ? "text-white" : "text-[#5F6A86] group-hover:text-[#0052CC]"
                  )}
                >
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!collapsed && item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider",
                    isActive
                      ? "bg-white/20 text-white"
                      : item.tone === "accent"
                      ? "bg-orange-100 text-[#FF5630]"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle when Collapsed */}
      {collapsed && (
        <div className="px-3 py-2 flex justify-center border-t border-[#DDE4F3]">
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-lg text-[#5F6A86] hover:text-[#17284D] hover:bg-[#E9EEF9] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Status / Help / Footer */}
      <div className="p-3 border-t border-[#DDE4F3] space-y-2">
        {!collapsed ? (
          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-100/80">
            <div className="flex items-center space-x-2 text-[#0052CC] mb-1">
              <Zap className="w-3.5 h-3.5 fill-[#0052CC]" />
              <span className="text-[11px] font-bold">Audit Engine v3.4</span>
            </div>
            <p className="text-[10px] text-[#5F6A86] leading-tight">
              64-point automated test pipeline running at 99.98% accuracy.
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between pt-1">
          <Link
            href="/"
            className={cn(
              "flex items-center text-xs text-[#5F6A86] hover:text-[#0052CC] transition-colors py-1",
              collapsed ? "justify-center w-full" : "space-x-1.5"
            )}
            title="Return to Public Website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {!collapsed && <span>Website</span>}
          </Link>

          {!collapsed && (
            <Link
              href="/"
              className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-rose-700 transition-colors py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
