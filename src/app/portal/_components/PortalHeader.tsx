"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Plus,
  Play,
  CheckCircle2,
  User,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function PortalHeader() {
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Compute readable breadcrumb title
  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return "Operations Overview";
    if (pathname.includes("/diagnostics")) return "Live Diagnostic Runner";
    if (pathname.includes("/devices")) return "Device Fleet & Inventory";
    if (pathname.includes("/reports")) return "Audit Reports & Certificates";
    if (pathname.includes("/analytics")) return "Quality & Telemetry Analytics";
    if (pathname.includes("/settings")) return "Settings & API Integration";
    return "Enterprise Portal";
  };

  return (
    <header className="h-16 border-b border-[#DDE4F3] bg-white px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
      {/* Page Title & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-base sm:text-lg font-bold font-display text-[#17284D] leading-none">
            {getPageTitle()}
          </h1>
          <div className="flex items-center space-x-1.5 text-[11px] text-[#5F6A86] mt-1 font-medium">
            <span>Portal</span>
            <span>/</span>
            <span className="text-[#0052CC] font-semibold capitalize">
              {pathname.split("/")[2] || "Dashboard"}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center pl-4 border-l border-[#DDE4F3]">
          <Badge tone="success" dot size="sm">
            Live Engine Online
          </Badge>
        </div>
      </div>

      {/* Center / Right Tools */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Search Bar */}
        <div className="relative hidden lg:block w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6A86]" />
          <input
            type="text"
            placeholder="Search IMEI, Serial, Model... (⌘K)"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] placeholder-[#5F6A86] focus:outline-none focus:border-[#0052CC] focus:bg-white transition-all font-sans"
          />
        </div>

        {/* Quick Diagnostic Run Button */}
        <Link href="/portal/diagnostics">
          <Button
            variant="accent"
            size="sm"
            icon={<Play className="w-3.5 h-3.5 fill-white" />}
            className="shadow-xs font-semibold"
          >
            <span className="hidden sm:inline">Run Live Diagnostic</span>
            <span className="sm:hidden">Run Scan</span>
          </Button>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-lg text-[#5F6A86] hover:text-[#17284D] hover:bg-[#F4F6FB] border border-transparent hover:border-[#DDE4F3] transition-all relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5630]" />
          </button>

          {/* Simple Dropdown simulation */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#DDE4F3] p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#DDE4F3]">
                <span className="text-xs font-bold text-[#17284D]">Notifications</span>
                <span className="text-[10px] text-[#0052CC] font-semibold cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100 text-xs">
                  <p className="font-semibold text-[#17284D]">Batch #XC-849 Completed</p>
                  <p className="text-[10px] text-[#5F6A86] mt-0.5">
                    48 laptops evaluated • 96% Grade A pass rate
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <p className="font-semibold text-[#17284D]">Firmware Update Available</p>
                  <p className="text-[10px] text-[#5F6A86] mt-0.5">
                    Diagnostic Suite v3.4.2 ready for deployment
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-[#DDE4F3]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0052CC] to-[#00875A] flex items-center justify-center font-bold text-white text-xs shadow-xs">
            AG
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-[#17284D] leading-none">
              Akhil Gupta
            </span>
            <span className="text-[10px] text-[#5F6A86] mt-0.5">
              Lead QC Engineer
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
