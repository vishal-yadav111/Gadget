import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { defectDistribution } from "../_lib/analytics-data";

export default function FailureParetoChart() {
  return (
    <Card padding="md" className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3] mb-4">
          <div>
            <h3 className="font-bold font-display text-sm sm:text-base text-[#17284D]">
              Component Failure Pareto Analysis
            </h3>
            <p className="text-xs text-[#5F6A86] mt-0.5">
              Top root-cause breakdown of degraded hardware checkpoints
            </p>
          </div>
          <Badge tone="warning" size="sm">
            372 Total Defect Signals
          </Badge>
        </div>

        {/* Pareto Horizontal Bars */}
        <div className="space-y-3.5">
          {defectDistribution.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#17284D] truncate max-w-[280px]">
                  {item.component}
                </span>
                <span className="font-mono text-[#0052CC]">
                  {item.failureCount} units ({item.percentage}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.severity === "Critical"
                      ? "bg-rose-500"
                      : item.severity === "Moderate"
                      ? "bg-amber-500"
                      : "bg-[#0052CC]"
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#DDE4F3] flex items-center justify-between text-xs text-[#5F6A86]">
        <span>Primary Intervention Area:</span>
        <strong className="text-amber-800">Battery Cell Refurbishment (38.2%)</strong>
      </div>
    </Card>
  );
}
