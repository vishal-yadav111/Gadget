"use client";

import React from "react";
import { usePathname } from "next/navigation";
import PortalSidebar from "./PortalSidebar";
import PortalHeader from "./PortalHeader";

export default function PortalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/portal/auth");

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full bg-[#F4F6FB] text-[#17284D] font-sans antialiased">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F4F6FB] text-[#17284D] font-sans antialiased overflow-hidden selection:bg-[#0052CC]/15 selection:text-[#0052CC]">
      {/* Collapsible Brand Sidebar */}
      <PortalSidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <PortalHeader />

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F4F6FB]">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
