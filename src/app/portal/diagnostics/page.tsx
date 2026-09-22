"use client";

import React from "react";
import DeviceIntakeBar from "./_components/DeviceIntakeBar";
import DiagnosticSuiteRunner from "./_components/DiagnosticSuiteRunner";
import TelemetryStream from "./_components/TelemetryStream";
import HealthScoreModal from "./_components/HealthScoreModal";
import { useDiagnosticRunner } from "./_hooks/useDiagnosticRunner";
import { ShieldCheck, Cpu, Activity, Award } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function DiagnosticsPage() {
  const runner = useDiagnosticRunner();

  return (
    <div className="space-y-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE4F3] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold font-display text-[#17284D] tracking-tight">
              Automated 64-Point Diagnostic Engine
            </h2>
            <Badge tone="accent" size="sm">
              Live v3.4
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6A86] mt-0.5">
            Hardware probe telemetry, stress benchmarks, and cryptographic health verification
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge tone="brand" dot size="md">
            16 Subsystems Online
          </Badge>
        </div>
      </div>

      {/* 1. Device Intake & Scan Controller */}
      <DeviceIntakeBar
        selectedDevice={runner.selectedDevice}
        onSelectDevice={runner.setSelectedDevice}
        status={runner.status}
        onStart={() => runner.startScan()}
        onPause={runner.pauseScan}
        onResume={runner.resumeScan}
        onReset={runner.resetScan}
        elapsedSec={runner.elapsedSec}
        progress={runner.currentTotalProgress}
      />

      {/* 2. Diagnostic Module Suite (16 Modules, 64 checks) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6A86]">
            Hardware Test Matrix (64 Automated Checkpoints)
          </h3>
          <span className="text-xs text-[#0052CC] font-semibold">
            {runner.passedCount} Passed • {runner.failedCount} Issues
          </span>
        </div>

        <DiagnosticSuiteRunner
          modules={runner.modules}
          activeModuleIndex={runner.activeModuleIndex}
          status={runner.status}
        />
      </div>

      {/* 3. Live Hardware Telemetry Log Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5F6A86]">
            Real-time Kernel & Sensor Telemetry
          </h3>
          <span className="text-[11px] text-[#5F6A86]">
            Sampling rate: 50Hz • Buffer: 1024KB
          </span>
        </div>

        <TelemetryStream
          logs={runner.logs}
          passedCount={runner.passedCount}
          failedCount={runner.failedCount}
          totalChecks={runner.totalChecksCount}
        />
      </div>

      {/* 4. Completion Modal */}
      <HealthScoreModal
        open={runner.showCompletionModal}
        onClose={() => runner.setShowCompletionModal(false)}
        device={runner.selectedDevice}
        score={runner.healthScore}
        grade={runner.finalGrade}
        passedChecks={runner.passedCount}
        failedChecks={runner.failedCount}
        totalChecks={runner.totalChecksCount}
        elapsedSec={runner.elapsedSec}
      />
    </div>
  );
}
