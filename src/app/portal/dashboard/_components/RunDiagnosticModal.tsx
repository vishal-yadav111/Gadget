"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Cpu,
  Laptop,
  Smartphone,
  Tablet,
  Check,
  ShieldCheck,
  FileCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { ActivityItem } from "../_lib/dashboard-data";

interface RunDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDiagnosticComplete: (newActivity: ActivityItem) => void;
}

const PRESET_DEVICES = [
  {
    model: 'MacBook Pro 14" (M3 Max, 64GB)',
    brand: "Apple",
    type: "Laptop" as const,
    serialPrefix: "XC-AP-",
  },
  {
    model: "Dell XPS 15 9530 (i9-13900H, RTX 4070)",
    brand: "Dell",
    type: "Laptop" as const,
    serialPrefix: "XC-DL-",
  },
  {
    model: "iPhone 15 Pro Max (256GB Natural)",
    brand: "Apple",
    type: "Smartphone" as const,
    serialPrefix: "XC-IP-",
  },
  {
    model: "Samsung Galaxy S24 Ultra (512GB)",
    brand: "Samsung",
    type: "Smartphone" as const,
    serialPrefix: "XC-SM-",
  },
  {
    model: 'iPad Pro 12.9" (M2 Wi-Fi + 5G)',
    brand: "Apple",
    type: "Tablet" as const,
    serialPrefix: "XC-PD-",
  },
];

const TEST_STEPS = [
  "Hardware Bus & Motherboard Initialization",
  "CPU Multi-Core & Instruction Integrity",
  "RAM Latency & Memory Cell Parity",
  "NVMe / Flash Storage SMART Status",
  "GPU Shader Engine & Display Pixel Matrix",
  "Battery Cycle Life & Impedance Check",
  "Wireless 6E & Bluetooth 5.3 Radios",
  "Peripheral Ports & Audio Subsystem",
  "Cryptographic Data Sanitization Verification",
  "Final Quality Assurance Grade Calculation",
];

export default function RunDiagnosticModal({
  isOpen,
  onClose,
  onDiagnosticComplete,
}: RunDiagnosticModalProps) {
  const [selectedDevice, setSelectedDevice] = useState(PRESET_DEVICES[0]);
  const [customSerial, setCustomSerial] = useState("XC-DEV-99410");
  const [stationName, setStationName] = useState("Bay 01 (Automated Rig)");
  const [technician, setTechnician] = useState("Akhil G.");

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [result, setResult] = useState<ActivityItem | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      setCurrentStepIdx(0);
      setCompletedSteps([]);
      setResult(null);
    }
  }, [isOpen]);

  const handleStartScan = () => {
    setIsRunning(true);
    setCurrentStepIdx(0);
    setCompletedSteps([]);
    setResult(null);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < TEST_STEPS.length) {
        setCurrentStepIdx(step);
        setCompletedSteps((prev) => [...prev, TEST_STEPS[step - 1]]);
      } else {
        clearInterval(interval);
        setCompletedSteps(TEST_STEPS);
        setIsRunning(false);

        // Calculate simulated grade
        const randomScore = Math.floor(Math.random() * 8) + 92; // 92 to 99
        const grade: "Grade A" | "Grade B" = randomScore >= 95 ? "Grade A" : "Grade B";
        const newRecord: ActivityItem = {
          id: `ACT-${Math.floor(Math.random() * 8999 + 1000)}`,
          deviceModel: selectedDevice.model,
          brand: selectedDevice.brand,
          serial: customSerial || `${selectedDevice.serialPrefix}${Math.floor(Math.random() * 89999 + 10000)}`,
          type: selectedDevice.type,
          technician: technician,
          score: randomScore,
          grade: grade,
          timestamp: "Just now",
          station: stationName,
          checksPassed: randomScore >= 95 ? 64 : 61,
          totalChecks: 64,
        };

        setResult(newRecord);
        onDiagnosticComplete(newRecord);
      }
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#DDE4F3] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DDE4F3] bg-[#F8FAFC]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#0052CC] flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#17284D]">
                Run 64-Point Live Hardware Diagnostic
              </h3>
              <p className="text-xs text-[#5F6A86]">
                Automated device telemetry and functional audit pipeline
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isRunning && !result && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#17284D] block mb-1.5">
                  Select Device Under Test
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_DEVICES.map((dev) => (
                    <button
                      key={dev.model}
                      type="button"
                      onClick={() => {
                        setSelectedDevice(dev);
                        setCustomSerial(`${dev.serialPrefix}${Math.floor(Math.random() * 89999 + 10000)}`);
                      }}
                      className={`p-3 rounded-xl text-left border transition-all text-xs flex items-center space-x-2.5 cursor-pointer ${
                        selectedDevice.model === dev.model
                          ? "bg-blue-50/60 border-[#0052CC] text-[#0052CC] ring-1 ring-[#0052CC]"
                          : "bg-white border-[#DDE4F3] text-[#17284D] hover:bg-slate-50"
                      }`}
                    >
                      {dev.type === "Laptop" && <Laptop className="w-4 h-4 shrink-0" />}
                      {dev.type === "Smartphone" && <Smartphone className="w-4 h-4 shrink-0" />}
                      {dev.type === "Tablet" && <Tablet className="w-4 h-4 shrink-0" />}
                      <div className="truncate">
                        <span className="font-bold block truncate">{dev.model}</span>
                        <span className="text-[10px] text-slate-500">{dev.brand} · {dev.type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#17284D] block mb-1">
                    Serial / IMEI Number
                  </label>
                  <input
                    type="text"
                    value={customSerial}
                    onChange={(e) => setCustomSerial(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] font-mono focus:outline-none focus:border-[#0052CC]"
                    placeholder="XC-AP-99210"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#17284D] block mb-1">
                    Assigned Testing Bay
                  </label>
                  <select
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] focus:outline-none focus:border-[#0052CC]"
                  >
                    <option value="Bay 01 (Automated Rig)">Bay 01 (Automated Rig)</option>
                    <option value="Bay 02 (Optical & Display)">Bay 02 (Optical & Display)</option>
                    <option value="Bay 03 (Battery & Stress Lab)">Bay 03 (Battery & Stress Lab)</option>
                    <option value="Bay 04 (Peripheral Station)">Bay 04 (Peripheral Station)</option>
                  </select>
                </div>
              </div>

              {/* Ready Status Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-slate-700">Audit Protocol v3.4 Armed</span>
                </div>
                <span className="text-slate-500 text-[11px]">64 Test Checks</span>
              </div>
            </div>
          )}

          {/* Running Diagnostic Visualizer */}
          {isRunning && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 text-[#0052CC] animate-spin" />
                  <div>
                    <span className="text-xs font-bold text-[#17284D] block">
                      Executing Test Protocol: Step {currentStepIdx + 1} of {TEST_STEPS.length}
                    </span>
                    <span className="text-[11px] text-[#0052CC] font-medium">
                      {TEST_STEPS[currentStepIdx]}
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-slate-600">
                  {Math.round(((currentStepIdx + 1) / TEST_STEPS.length) * 100)}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#0052CC] to-[#388BFF]"
                  animate={{ width: `${((currentStepIdx + 1) / TEST_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Checklist Stream */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 max-h-48 overflow-y-auto space-y-1.5">
                {TEST_STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div
                      key={step}
                      className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg ${
                        isCurrent
                          ? "bg-blue-50 text-[#0052CC] font-bold"
                          : isDone
                          ? "text-slate-700 font-medium"
                          : "text-slate-400"
                      }`}
                    >
                      <span className="truncate pr-2">{step}</span>
                      {isDone && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      {isCurrent && <Loader2 className="w-3 h-3 text-[#0052CC] animate-spin shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result View */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                      Audit Complete · {result.grade}
                    </span>
                    <h4 className="font-display font-extrabold text-base text-slate-900">
                      {result.deviceModel}
                    </h4>
                    <span className="text-xs font-mono text-slate-500">
                      Serial: {result.serial} · {result.checksPassed}/64 Passed
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600 font-mono">
                    {result.score}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">Health Score</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Certificate Hash ID: <strong className="font-mono text-slate-800">XC-2026-QA-{Math.floor(Math.random() * 89999 + 10000)}</strong></span>
                <span className="text-emerald-700 font-bold">✓ Added to Dashboard Feed</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#DDE4F3] bg-[#F8FAFC] flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            {result ? "Close Window" : "Cancel"}
          </Button>

          {!isRunning && !result && (
            <Button
              variant="accent"
              size="md"
              onClick={handleStartScan}
              icon={<Play className="w-4 h-4 fill-white" />}
            >
              Start Diagnostic Sequence
            </Button>
          )}

          {result && (
            <Button
              variant="accent"
              size="md"
              onClick={() => {
                setResult(null);
                handleStartScan();
              }}
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Run Another Device
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
