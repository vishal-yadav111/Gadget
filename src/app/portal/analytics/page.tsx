"use client";

import React from "react";
import FailureParetoChart from "./_components/FailureParetoChart";
import TechnicianPerformance from "./_components/TechnicianPerformance";
import BrandBreakdown from "./_components/BrandBreakdown";
import { BarChart3, TrendingUp, ShieldCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE4F3] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-[#17284D] tracking-tight">
            Quality Telemetry & Defect Analytics
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6A86] mt-0.5">
            Statistical breakdown of 64-point checkpoints, failure modes, and auditor velocity
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge tone="brand" dot size="md">
            Continuous Telemetry Sync
          </Badge>
        </div>
      </div>

      {/* Grid: Defect Pareto & Technician Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FailureParetoChart />
        <TechnicianPerformance />
      </div>

      {/* Brand Benchmarking */}
      <BrandBreakdown />
    </div>
  );
}
