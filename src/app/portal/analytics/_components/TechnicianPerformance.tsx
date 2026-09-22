import React from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { technicianMetrics } from "../_lib/analytics-data";

export default function TechnicianPerformance() {
  return (
    <Card padding="md" className="h-full">
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3] mb-4">
        <div>
          <h3 className="font-bold font-display text-sm sm:text-base text-[#17284D]">
            Technician & Bay Throughput Velocity
          </h3>
          <p className="text-xs text-[#5F6A86] mt-0.5">
            Audit pace, accuracy benchmarks, and station efficiency
          </p>
        </div>
        <Badge tone="brand" size="sm" dot>
          4 Active Operators
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F6FB] border-b border-[#DDE4F3] text-[10px] font-bold text-[#5F6A86] uppercase tracking-wider">
              <th className="py-2.5 px-3">Technician / Rig</th>
              <th className="py-2.5 px-3">Evaluated Units</th>
              <th className="py-2.5 px-3">Avg. Test Speed</th>
              <th className="py-2.5 px-3">Pass Efficiency</th>
              <th className="py-2.5 px-3 text-right">Accuracy Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE4F3] text-xs font-sans">
            {technicianMetrics.map((tech, idx) => (
              <tr key={idx} className="hover:bg-[#F4F6FB] transition-colors">
                <td className="py-3 px-3">
                  <span className="font-bold text-[#17284D] block">
                    {tech.name}
                  </span>
                  <span className="text-[10px] text-[#5F6A86]">
                    {tech.station}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-[#17284D]">
                  {tech.devicesScanned}
                </td>
                <td className="py-3 px-3 font-mono text-[#0052CC] font-semibold">
                  {tech.avgDurationSec}s
                </td>
                <td className="py-3 px-3 font-mono text-emerald-700 font-bold">
                  {tech.passRate}%
                </td>
                <td className="py-3 px-3 text-right font-mono font-extrabold text-emerald-700">
                  {tech.accuracyRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
