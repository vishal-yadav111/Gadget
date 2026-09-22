import React from "react";
import Card from "@/components/ui/Card";
import { brandBreakdowns } from "../_lib/analytics-data";

export default function BrandBreakdown() {
  return (
    <Card padding="md">
      <div className="pb-3 border-b border-[#DDE4F3] mb-4">
        <h3 className="font-bold font-display text-sm sm:text-base text-[#17284D]">
          OEM Brand Quality & Pass Benchmarks
        </h3>
        <p className="text-xs text-[#5F6A86] mt-0.5">
          Comparative reliability across tested device manufacturers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {brandBreakdowns.map((b, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#17284D]">
                  {b.brand}
                </span>
                <span className="text-[10px] font-mono text-[#5F6A86]">
                  {b.scanned} units
                </span>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#5F6A86]">Pass Rate</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {b.passRate}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5F6A86]">Avg Health Score</span>
                  <span className="font-mono font-bold text-[#0052CC]">
                    {b.avgScore}/100
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] uppercase font-bold text-[#5F6A86] block">
                Top Failure Mode
              </span>
              <span className="text-xs text-[#17284D] truncate block font-medium">
                {b.topIssue}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
