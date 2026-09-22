"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Terminal,
  Cpu,
  Layers,
  HardDrive,
  Tv,
  BatteryCharging,
  CircuitBoard,
  Wifi,
  Bluetooth,
  Network,
  Keyboard,
  Camera,
  Volume2,
  Usb,
  Fingerprint,
  MonitorPlay,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { DiagnosticModule } from "../_lib/diagnostic-suite";

interface DiagnosticSuiteRunnerProps {
  modules: DiagnosticModule[];
  activeModuleIndex: number;
  status: "idle" | "running" | "paused" | "completed";
}

export default function DiagnosticSuiteRunner({
  modules,
  activeModuleIndex,
  status,
}: DiagnosticSuiteRunnerProps) {
  const getCategoryIcon = (iconName: string) => {
    const props = { className: "w-4 h-4 text-[#0052CC]" };
    switch (iconName) {
      case "Terminal":
        return <Terminal {...props} />;
      case "Cpu":
        return <Cpu {...props} />;
      case "Layers":
        return <Layers {...props} />;
      case "HardDrive":
        return <HardDrive {...props} />;
      case "MonitorPlay":
        return <MonitorPlay {...props} />;
      case "Tv":
        return <Tv {...props} />;
      case "BatteryCharging":
        return <BatteryCharging {...props} />;
      case "CircuitBoard":
        return <CircuitBoard {...props} />;
      case "Wifi":
        return <Wifi {...props} />;
      case "Bluetooth":
        return <Bluetooth {...props} />;
      case "Network":
        return <Network {...props} />;
      case "Keyboard":
        return <Keyboard {...props} />;
      case "Camera":
        return <Camera {...props} />;
      case "Volume2":
        return <Volume2 {...props} />;
      case "Usb":
        return <Usb {...props} />;
      case "Fingerprint":
        return <Fingerprint {...props} />;
      default:
        return <Cpu {...props} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {modules.map((mod, modIdx) => {
        const isCurrentModule = status === "running" && modIdx === activeModuleIndex;
        const allPassed = mod.checks.every((c) => c.status === "passed");
        const hasWarning = mod.checks.some((c) => c.status === "warning");
        const hasFailed = mod.checks.some((c) => c.status === "failed");
        const isPending = mod.checks.every((c) => c.status === "pending");

        return (
          <Card
            key={mod.id}
            padding="sm"
            className={`transition-all duration-200 border ${
              isCurrentModule
                ? "border-[#0052CC] ring-2 ring-[#0052CC]/15 shadow-md bg-white"
                : allPassed
                ? "border-emerald-200 bg-emerald-50/20"
                : hasWarning
                ? "border-amber-200 bg-amber-50/20"
                : hasFailed
                ? "border-rose-200 bg-rose-50/20"
                : "border-[#DDE4F3] bg-white opacity-90"
            }`}
          >
            {/* Module Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#DDE4F3]/70 mb-2">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  {getCategoryIcon(mod.iconName)}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6A86] block">
                    {mod.category}
                  </span>
                  <h4 className="text-xs font-bold text-[#17284D] truncate">
                    {mod.title}
                  </h4>
                </div>
              </div>

              {isCurrentModule ? (
                <Badge tone="brand" size="sm">
                  <Loader2 className="w-3 h-3 animate-spin text-[#0052CC]" />
                  <span>Scanning</span>
                </Badge>
              ) : allPassed ? (
                <Badge tone="success" size="sm">
                  Passed
                </Badge>
              ) : hasWarning ? (
                <Badge tone="warning" size="sm">
                  Warning
                </Badge>
              ) : hasFailed ? (
                <Badge tone="danger" size="sm">
                  Failed
                </Badge>
              ) : (
                <span className="text-[10px] font-mono text-[#5F6A86]">4 Checks</span>
              )}
            </div>

            {/* Individual 4 Sub-Checks per module */}
            <div className="space-y-1.5">
              {mod.checks.map((chk) => (
                <div
                  key={chk.id}
                  className={`p-1.5 rounded-md flex items-center justify-between text-xs transition-colors ${
                    chk.status === "testing"
                      ? "bg-blue-50/80 border border-blue-200 text-[#0052CC]"
                      : chk.status === "passed"
                      ? "text-[#17284D] hover:bg-slate-50"
                      : chk.status === "warning"
                      ? "text-amber-900 bg-amber-50/60"
                      : "text-[#5F6A86]"
                  }`}
                >
                  <div className="flex items-center space-x-1.5 min-w-0">
                    {chk.status === "passed" && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                    {chk.status === "testing" && (
                      <Loader2 className="w-3.5 h-3.5 text-[#0052CC] animate-spin shrink-0" />
                    )}
                    {chk.status === "warning" && (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                    {chk.status === "failed" && (
                      <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    )}
                    {chk.status === "pending" && (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span className="text-[11px] font-medium truncate">
                      {chk.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-[#5F6A86] shrink-0 pl-1">
                    {chk.status === "testing"
                      ? "..."
                      : chk.status === "passed"
                      ? "OK"
                      : chk.status === "warning"
                      ? "WARN"
                      : ""}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
