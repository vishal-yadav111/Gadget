"use client";

import { useState, useEffect, useRef } from "react";
import {
  DiagnosticModule,
  DiagnosticCheck,
  diagnosticModules,
  PresetDevice,
  presetDevices,
} from "../_lib/diagnostic-suite";

export interface LogMessage {
  id: string;
  time: string;
  type: "info" | "success" | "warning" | "error";
  text: string;
}

export function useDiagnosticRunner() {
  const [selectedDevice, setSelectedDevice] = useState<PresetDevice>(presetDevices[0]);
  const [customSerial, setCustomSerial] = useState("");
  const [customModel, setCustomModel] = useState("");
  
  const [modules, setModules] = useState<DiagnosticModule[]>(diagnosticModules);
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "completed">("idle");
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeCheckIndex, setActiveCheckIndex] = useState<number>(0);
  
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  
  // Results
  const [healthScore, setHealthScore] = useState<number>(100);
  const [finalGrade, setFinalGrade] = useState<"Grade A" | "Grade B" | "Grade C" | "Failed">("Grade A");
  const [passedCount, setPassedCount] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Flatten all 64 checks for sequential execution
  const allChecks: { moduleIdx: number; checkIdx: number; check: DiagnosticCheck }[] = [];
  modules.forEach((mod, mIdx) => {
    mod.checks.forEach((chk, cIdx) => {
      allChecks.push({ moduleIdx: mIdx, checkIdx: cIdx, check: chk });
    });
  });

  const totalChecksCount = allChecks.length;
  const currentTotalProgress =
    status === "completed"
      ? 100
      : Math.round(
          ((activeModuleIndex * 4 + activeCheckIndex) / totalChecksCount) * 100
        );

  const addLog = (text: string, type: LogMessage["type"] = "info") => {
    const time = new Date().toISOString().substring(11, 19);
    setLogs((prev) => [
      ...prev.slice(-40),
      { id: Math.random().toString(), time, type, text },
    ]);
  };

  const startScan = (deviceOverride?: PresetDevice) => {
    const targetDev = deviceOverride || selectedDevice;
    // Reset state
    const freshModules = diagnosticModules.map((m) => ({
      ...m,
      checks: m.checks.map((c) => ({ ...c, status: "pending" as const })),
    }));

    setModules(freshModules);
    setStatus("running");
    setActiveModuleIndex(0);
    setActiveCheckIndex(0);
    setElapsedMs(0);
    setPassedCount(0);
    setFailedCount(0);
    setShowCompletionModal(false);

    setLogs([
      {
        id: "1",
        time: new Date().toISOString().substring(11, 19),
        type: "info",
        text: `Initializing XtraCover 64-Point Engine v3.4 for ${targetDev.name} [${targetDev.serial}]`,
      },
      {
        id: "2",
        time: new Date().toISOString().substring(11, 19),
        type: "info",
        text: "Connecting to hardware telemetry bus and sensor matrix...",
      },
    ]);
  };

  const pauseScan = () => {
    setStatus("paused");
    addLog("Diagnostic evaluation paused by operator.", "warning");
  };

  const resumeScan = () => {
    setStatus("running");
    addLog("Resuming hardware diagnostic evaluation...", "info");
  };

  const resetScan = () => {
    setStatus("idle");
    setActiveModuleIndex(0);
    setActiveCheckIndex(0);
    setElapsedMs(0);
    setModules(diagnosticModules);
    setLogs([]);
    setShowCompletionModal(false);
  };

  // Execution Step Engine
  useEffect(() => {
    if (status !== "running") return;

    const currentFlatIndex = activeModuleIndex * 4 + activeCheckIndex;

    if (currentFlatIndex >= totalChecksCount) {
      // Evaluation Complete
      setStatus("completed");
      setShowCompletionModal(true);

      // Compute grade
      const finalHealth = selectedDevice.id === "p5" ? 68 : selectedDevice.id === "p3" ? 88 : 98;
      setHealthScore(finalHealth);

      let grade: "Grade A" | "Grade B" | "Grade C" | "Failed" = "Grade A";
      if (finalHealth >= 90) grade = "Grade A";
      else if (finalHealth >= 80) grade = "Grade B";
      else if (finalHealth >= 60) grade = "Grade C";
      else grade = "Failed";

      setFinalGrade(grade);
      addLog(`✓ 64-Point Audit Complete! Final Health Score: ${finalHealth}% (${grade})`, "success");
      return;
    }

    const currentModule = modules[activeModuleIndex];
    const currentCheck = currentModule?.checks[activeCheckIndex];

    if (!currentCheck) return;

    // Set check to testing
    setModules((prev) => {
      const copy = [...prev];
      copy[activeModuleIndex].checks[activeCheckIndex].status = "testing";
      return copy;
    });

    addLog(
      `Testing [${currentModule.title}]: ${currentCheck.name}...`,
      "info"
    );

    const stepDuration = Math.max(120, Math.floor(currentCheck.durationMs * 0.45));

    const timeout = setTimeout(() => {
      // Determine pass vs warning (e.g. for HP degraded candidate)
      const isDegradedCandidate = selectedDevice.id === "p5";
      const shouldFailOrWarn =
        isDegradedCandidate && (currentCheck.category === "Battery" || currentCheck.id === "c-22");

      const finalStatus = shouldFailOrWarn ? "warning" : "passed";

      setModules((prev) => {
        const copy = [...prev];
        copy[activeModuleIndex].checks[activeCheckIndex].status = finalStatus;
        return copy;
      });

      if (finalStatus === "passed") {
        setPassedCount((p) => p + 1);
        addLog(`✓ PASSED: ${currentCheck.name}`, "success");
      } else {
        setFailedCount((f) => f + 1);
        addLog(`⚠ DEGRADATION DETECTED: ${currentCheck.name}`, "warning");
      }

      // Advance indices
      if (activeCheckIndex < 3) {
        setActiveCheckIndex((prev) => prev + 1);
      } else {
        setActiveCheckIndex(0);
        setActiveModuleIndex((prev) => prev + 1);
      }
    }, stepDuration);

    return () => clearTimeout(timeout);
  }, [status, activeModuleIndex, activeCheckIndex, totalChecksCount, modules, selectedDevice]);

  // Elapsed Timer
  useEffect(() => {
    if (status === "running") {
      timerRef.current = setInterval(() => {
        setElapsedMs((prev) => prev + 100);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  return {
    selectedDevice,
    setSelectedDevice,
    customSerial,
    setCustomSerial,
    customModel,
    setCustomModel,
    modules,
    status,
    activeModuleIndex,
    activeCheckIndex,
    elapsedSec: (elapsedMs / 1000).toFixed(1),
    currentTotalProgress,
    totalChecksCount,
    passedCount,
    failedCount,
    healthScore,
    finalGrade,
    logs,
    showCompletionModal,
    setShowCompletionModal,
    startScan,
    pauseScan,
    resumeScan,
    resetScan,
  };
}
