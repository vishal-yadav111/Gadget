"use client";

import React from "react";
import { Laptop, Smartphone, Play, RotateCcw, Pause, PlayCircle } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { PresetDevice, presetDevices } from "../_lib/diagnostic-suite";

interface DeviceIntakeBarProps {
  selectedDevice: PresetDevice;
  onSelectDevice: (device: PresetDevice) => void;
  status: "idle" | "running" | "paused" | "completed";
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  elapsedSec: string;
  progress: number;
}

export default function DeviceIntakeBar({
  selectedDevice,
  onSelectDevice,
  status,
  onStart,
  onPause,
  onResume,
  onReset,
  elapsedSec,
  progress,
}: DeviceIntakeBarProps) {
  return (
    <Card padding="md" className="border-[#0052CC]/30 shadow-sm bg-white">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Device Preset Selector */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5F6A86] uppercase tracking-wider">
              1. Select Device Preset or Scan Barcode
            </span>
            <span className="text-[11px] font-mono text-[#0052CC] font-semibold">
              Serial: {selectedDevice.serial}
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {presetDevices.map((dev) => {
              const isSelected = selectedDevice.id === dev.id;
              return (
                <button
                  key={dev.id}
                  disabled={status === "running"}
                  onClick={() => onSelectDevice(dev)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-blue-50 text-[#0052CC] border-[#0052CC] shadow-xs"
                      : "bg-[#F4F6FB] text-[#4A5875] border-[#DDE4F3] hover:border-slate-300"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {dev.type === "Smartphone" ? (
                    <Smartphone className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Laptop className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span className="truncate max-w-[150px]">{dev.name}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-[#5F6A86] truncate">
            <strong>Specs:</strong> {selectedDevice.specs}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 shrink-0 pt-2 lg:pt-0 lg:border-l lg:border-[#DDE4F3] lg:pl-6">
          <div className="flex flex-col text-right pr-2">
            <span className="text-[10px] uppercase font-bold text-[#5F6A86]">
              Execution Time
            </span>
            <span className="text-lg font-bold font-mono text-[#17284D]">
              {elapsedSec}s
            </span>
          </div>

          {status === "idle" && (
            <Button
              variant="accent"
              size="md"
              icon={<Play className="w-4 h-4 fill-white" />}
              onClick={onStart}
            >
              Start 64-Pt Test
            </Button>
          )}

          {status === "running" && (
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                size="md"
                icon={<Pause className="w-4 h-4" />}
                onClick={onPause}
              >
                Pause
              </Button>
              <Button
                variant="danger"
                size="md"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={onReset}
              >
                Abort
              </Button>
            </div>
          )}

          {status === "paused" && (
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="md"
                icon={<PlayCircle className="w-4 h-4" />}
                onClick={onResume}
              >
                Resume
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={<RotateCcw className="w-4 h-4" />}
                onClick={onReset}
              >
                Reset
              </Button>
            </div>
          )}

          {status === "completed" && (
            <Button
              variant="primary"
              size="md"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={onStart}
            >
              Re-Scan Device
            </Button>
          )}
        </div>
      </div>

      {/* Global Progress Line */}
      {(status === "running" || status === "paused" || status === "completed") && (
        <div className="mt-4 pt-3 border-t border-[#DDE4F3]">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-[#17284D]">
              {status === "completed"
                ? "Diagnostic Evaluation Complete"
                : `Scanning Hardware Matrix (${progress}% Completed)`}
            </span>
            <span className="font-mono text-[#0052CC]">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                status === "completed" ? "bg-emerald-500" : "bg-[#0052CC]"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
