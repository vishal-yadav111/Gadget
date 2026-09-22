"use client";

import React from "react";
import {
  Laptop,
  Smartphone,
  Tablet,
  Eye,
  FileCheck2,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { DeviceRecord } from "../_lib/devices-data";

interface DeviceDataTableProps {
  devices: DeviceRecord[];
  onSelectDevice: (device: DeviceRecord) => void;
}

export default function DeviceDataTable({
  devices,
  onSelectDevice,
}: DeviceDataTableProps) {
  const getDeviceIcon = (type: DeviceRecord["type"]) => {
    switch (type) {
      case "Smartphone":
        return <Smartphone className="w-4 h-4 text-[#0052CC]" />;
      case "Tablet":
        return <Tablet className="w-4 h-4 text-[#0052CC]" />;
      default:
        return <Laptop className="w-4 h-4 text-[#0052CC]" />;
    }
  };

  const getGradeBadge = (grade: DeviceRecord["grade"]) => {
    switch (grade) {
      case "Grade A":
        return <Badge tone="success" dot size="sm">Grade A</Badge>;
      case "Grade B":
        return <Badge tone="brand" dot size="sm">Grade B</Badge>;
      case "Grade C":
        return <Badge tone="warning" dot size="sm">Grade C</Badge>;
      case "Failed":
        return <Badge tone="danger" dot size="sm">Quarantine</Badge>;
    }
  };

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F6FB] border-b border-[#DDE4F3] text-[11px] font-bold text-[#5F6A86] uppercase tracking-wider">
              <th className="py-3 px-4">Device / Model</th>
              <th className="py-3 px-4">Identifiers</th>
              <th className="py-3 px-4">Grade & Health</th>
              <th className="py-3 px-4">Core Specifications</th>
              <th className="py-3 px-4">Battery Wear</th>
              <th className="py-3 px-4">Auditor / Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE4F3] text-xs font-sans">
            {devices.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#5F6A86]">
                  No matching devices found in inventory.
                </td>
              </tr>
            ) : (
              devices.map((dev) => (
                <tr
                  key={dev.id}
                  className="hover:bg-[#F4F6FB] transition-colors cursor-pointer group"
                  onClick={() => onSelectDevice(dev)}
                >
                  {/* Device Model */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2.5 min-w-[200px]">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                        {getDeviceIcon(dev.type)}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-[#17284D] block truncate">
                          {dev.model}
                        </span>
                        <span className="text-[10px] text-[#5F6A86]">
                          {dev.brand} • {dev.type}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Identifiers */}
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <span className="font-bold text-[#17284D] block">
                      {dev.serial}
                    </span>
                    {dev.imei && (
                      <span className="text-[10px] text-[#5F6A86]">
                        IMEI: {dev.imei}
                      </span>
                    )}
                  </td>

                  {/* Grade & Health */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      {getGradeBadge(dev.grade)}
                      <span className="font-mono font-bold text-xs text-[#17284D]">
                        {dev.healthScore}%
                      </span>
                    </div>
                    <span className="text-[10px] text-[#5F6A86] block mt-0.5">
                      {dev.checksPassed}/{dev.totalChecks} Checks Passed
                    </span>
                  </td>

                  {/* Specifications */}
                  <td className="py-3.5 px-4 max-w-[220px]">
                    <span className="text-xs text-[#17284D] block truncate font-medium">
                      {dev.cpu}
                    </span>
                    <span className="text-[10px] text-[#5F6A86] block truncate">
                      {dev.ram} • {dev.storage}
                    </span>
                  </td>

                  {/* Battery Health */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            dev.batteryHealth >= 85
                              ? "bg-emerald-500"
                              : dev.batteryHealth >= 75
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${dev.batteryHealth}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[11px]">
                        {dev.batteryHealth}%
                      </span>
                    </div>
                    <span className="text-[10px] text-[#5F6A86] block mt-0.5">
                      {dev.cycleCount} Cycles
                    </span>
                  </td>

                  {/* Auditor & Date */}
                  <td className="py-3.5 px-4 text-[11px]">
                    <span className="font-semibold text-[#17284D] block">
                      {dev.technician}
                    </span>
                    <span className="text-[10px] text-[#5F6A86]">
                      {dev.evaluatedAt}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDevice(dev);
                      }}
                      className="p-1.5 rounded-lg text-[#5F6A86] group-hover:text-[#0052CC] group-hover:bg-blue-50 transition-colors cursor-pointer inline-flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-xs font-semibold hidden sm:inline">Inspect</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
