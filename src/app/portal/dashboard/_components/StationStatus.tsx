import React from "react";
import { Wrench, CheckCircle2, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { StationData } from "../_lib/dashboard-data";

interface StationStatusProps {
  stations: StationData[];
}

export default function StationStatus({ stations }: StationStatusProps) {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3] mb-4">
        <div>
          <h3 className="font-bold font-display text-sm sm:text-base text-[#17284D]">
            Active Testing Rigs & Diagnostics Bays
          </h3>
          <p className="text-xs text-[#5F6A86] mt-0.5">
            Hardware probe telemetry & bay throughput
          </p>
        </div>
        <Badge tone="brand" size="sm" dot>
          4 Active Bays
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stations.map((st) => (
          <div
            key={st.id}
            className="p-3.5 rounded-xl border border-[#DDE4F3] bg-[#F4F6FB] flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17284D]">
                  {st.name}
                </span>
                {st.status === "evaluating" ? (
                  <Badge tone="accent" size="sm" dot>
                    Testing
                  </Badge>
                ) : st.status === "active" ? (
                  <Badge tone="success" size="sm" dot>
                    Ready
                  </Badge>
                ) : (
                  <Badge tone="neutral" size="sm">
                    Idle
                  </Badge>
                )}
              </div>

              <p className="text-[11px] text-[#5F6A86] mt-1 font-medium">
                Tech: <strong className="text-[#17284D]">{st.technician}</strong>
              </p>

              <div className="mt-2.5 p-2 rounded-lg bg-white border border-[#DDE4F3] text-xs">
                <span className="text-[10px] text-[#5F6A86] uppercase font-bold block">
                  Current Target
                </span>
                <span className="font-semibold text-[#17284D] truncate block">
                  {st.currentDevice}
                </span>
              </div>
            </div>

            <div>
              {st.status === "evaluating" && (
                <div className="space-y-1 mb-2">
                  <div className="flex justify-between text-[10px] font-mono text-[#5F6A86]">
                    <span>Scan Progress</span>
                    <span>{st.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0052CC] rounded-full transition-all duration-300"
                      style={{ width: `${st.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-[#5F6A86] pt-1 border-t border-slate-200">
                <span>Completed today:</span>
                <strong className="text-[#17284D] font-mono">
                  {st.devicesCompletedToday} units
                </strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
