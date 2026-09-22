"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  ShieldCheck,
  Award,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Download,
  QrCode,
  Laptop,
  Smartphone,
  Cpu,
  Layers,
  HardDrive,
  BatteryCharging,
  Calendar,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { DeviceRecord } from "../_lib/devices-data";

interface DeviceDetailDrawerProps {
  device: DeviceRecord | null;
  onClose: () => void;
}

export default function DeviceDetailDrawer({
  device,
  onClose,
}: DeviceDetailDrawerProps) {
  if (!device) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-screen max-w-xl bg-white shadow-2xl border-l border-[#DDE4F3] flex flex-col justify-between"
          >
            {/* Header */}
            <div className="p-5 border-b border-[#DDE4F3] flex items-center justify-between bg-[#F4F6FB]">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5F6A86]">
                    Audit Record
                  </span>
                  <Badge
                    tone={
                      device.grade === "Grade A"
                        ? "success"
                        : device.grade === "Grade B"
                        ? "brand"
                        : device.grade === "Grade C"
                        ? "warning"
                        : "danger"
                    }
                    dot
                    size="sm"
                  >
                    {device.grade}
                  </Badge>
                </div>
                <h3 className="text-base font-bold font-display text-[#17284D] mt-1 truncate max-w-md">
                  {device.model}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#5F6A86] hover:text-[#17284D] hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Score & Certificate Stamp */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-14 h-14 rounded-full bg-white border-2 border-[#0052CC] flex flex-col items-center justify-center font-bold shadow-xs">
                    <span className="text-lg font-black font-mono text-[#17284D]">
                      {device.healthScore}
                    </span>
                    <span className="text-[8px] uppercase text-[#5F6A86]">
                      Health
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#17284D]">
                      64-Point Quality Certified
                    </h4>
                    <p className="text-xs text-[#5F6A86] mt-0.5">
                      Passed {device.checksPassed} of {device.totalChecks} tests
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#5F6A86] block">
                    Cryptographic ID
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0052CC]">
                    {device.serial}
                  </span>
                </div>
              </div>

              {/* Hardware Specifications */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                  Hardware Specification Matrix
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#F4F6FB] border border-[#DDE4F3]">
                    <span className="text-[#5F6A86] text-[10px] uppercase font-bold block">
                      Processor (CPU)
                    </span>
                    <span className="font-semibold text-[#17284D] mt-0.5 block">
                      {device.cpu}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F4F6FB] border border-[#DDE4F3]">
                    <span className="text-[#5F6A86] text-[10px] uppercase font-bold block">
                      Memory (RAM)
                    </span>
                    <span className="font-semibold text-[#17284D] mt-0.5 block">
                      {device.ram}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F4F6FB] border border-[#DDE4F3]">
                    <span className="text-[#5F6A86] text-[10px] uppercase font-bold block">
                      Storage Drive
                    </span>
                    <span className="font-semibold text-[#17284D] mt-0.5 block">
                      {device.storage}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F4F6FB] border border-[#DDE4F3]">
                    <span className="text-[#5F6A86] text-[10px] uppercase font-bold block">
                      Battery Chemistry
                    </span>
                    <span className="font-semibold text-[#17284D] mt-0.5 block">
                      {device.batteryHealth}% ({device.cycleCount} Cycles)
                    </span>
                  </div>
                </div>
              </div>

              {/* 64-Point Subsystem Checklist Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                  Diagnostic Checks Breakdown
                </h4>
                <div className="p-3 rounded-lg border border-[#DDE4F3] divide-y divide-[#DDE4F3] text-xs">
                  <div className="py-1.5 flex items-center justify-between">
                    <span className="text-[#4A5875]">Motherboard & PCIe Bus</span>
                    <Badge tone="success" size="sm">Passed (4/4)</Badge>
                  </div>
                  <div className="py-1.5 flex items-center justify-between">
                    <span className="text-[#4A5875]">Display Panel & Dead Pixels</span>
                    <Badge tone="success" size="sm">Passed (4/4)</Badge>
                  </div>
                  <div className="py-1.5 flex items-center justify-between">
                    <span className="text-[#4A5875]">Battery Cycle & Thermal</span>
                    <Badge
                      tone={device.batteryHealth >= 80 ? "success" : "warning"}
                      size="sm"
                    >
                      {device.batteryHealth >= 80 ? "Passed (4/4)" : "Degraded (3/4)"}
                    </Badge>
                  </div>
                  <div className="py-1.5 flex items-center justify-between">
                    <span className="text-[#4A5875]">Keyboard & Trackpad Matrix</span>
                    <Badge tone="success" size="sm">Passed (4/4)</Badge>
                  </div>
                  <div className="py-1.5 flex items-center justify-between">
                    <span className="text-[#4A5875]">Wi-Fi 6E, BT 5.3 & LAN</span>
                    <Badge tone="success" size="sm">Passed (4/4)</Badge>
                  </div>
                  <div className="py-1.5 flex items-center justify-between">
                    <span className="text-[#4A5875]">Biometrics & Security TPM</span>
                    <Badge tone="success" size="sm">Passed (4/4)</Badge>
                  </div>
                </div>
              </div>

              {/* Auditor Metadata */}
              <div className="p-3 rounded-lg bg-slate-50 border border-[#DDE4F3] text-xs space-y-1 text-[#5F6A86]">
                <div className="flex justify-between">
                  <span>Batch Container:</span>
                  <strong className="text-[#17284D]">{device.batchId}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Certified Auditor:</span>
                  <strong className="text-[#17284D]">{device.technician}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Evaluation Date:</span>
                  <strong className="text-[#17284D]">{device.evaluatedAt}</strong>
                </div>
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="p-4 border-t border-[#DDE4F3] bg-[#F4F6FB] flex items-center justify-between gap-3">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>

              <Link href={`/portal/reports`}>
                <Button
                  variant="accent"
                  size="sm"
                  icon={<FileCheck2 className="w-3.5 h-3.5 text-white" />}
                >
                  View Digital Certificate
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
