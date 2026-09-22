"use client";

import React, { useState } from "react";
import { Sliders, Save, CheckCircle2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function QCThresholdEditor() {
  const [minBatteryGradeA, setMinBatteryGradeA] = useState(85);
  const [minBatteryGradeB, setMinBatteryGradeB] = useState(75);
  const [maxDeadPixels, setMaxDeadPixels] = useState(0);
  const [stressDurationSec, setStressDurationSec] = useState(10);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Card padding="md" className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
        <div>
          <h3 className="font-bold font-display text-sm sm:text-base text-[#17284D]">
            Quality Control Grading Tolerances & Profile
          </h3>
          <p className="text-xs text-[#5F6A86] mt-0.5">
            Configure automated pass/fail thresholds for Grade A, B, and C classifications
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          onClick={handleSave}
        >
          {saved ? "Thresholds Saved" : "Save Profile Rules"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Battery Grade A */}
        <div className="p-3 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] space-y-2">
          <div className="flex justify-between font-bold text-[#17284D]">
            <span>Minimum Battery Health for Grade A</span>
            <span className="font-mono text-[#0052CC]">{minBatteryGradeA}%</span>
          </div>
          <input
            type="range"
            min={80}
            max={95}
            value={minBatteryGradeA}
            onChange={(e) => setMinBatteryGradeA(Number(e.target.value))}
            className="w-full cursor-pointer accent-[#0052CC]"
          />
          <span className="text-[10px] text-[#5F6A86] block">
            Devices with health capacity below this will be downgraded to Grade B.
          </span>
        </div>

        {/* Battery Grade B */}
        <div className="p-3 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] space-y-2">
          <div className="flex justify-between font-bold text-[#17284D]">
            <span>Minimum Battery Health for Grade B</span>
            <span className="font-mono text-[#0052CC]">{minBatteryGradeB}%</span>
          </div>
          <input
            type="range"
            min={65}
            max={85}
            value={minBatteryGradeB}
            onChange={(e) => setMinBatteryGradeB(Number(e.target.value))}
            className="w-full cursor-pointer accent-[#0052CC]"
          />
          <span className="text-[10px] text-[#5F6A86] block">
            Devices below this threshold are marked as Grade C or Battery Replace.
          </span>
        </div>

        {/* Display Dead Pixels */}
        <div className="p-3 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] space-y-2">
          <div className="flex justify-between font-bold text-[#17284D]">
            <span>Allowable Dead Sub-pixels (Grade A)</span>
            <span className="font-mono text-[#0052CC]">{maxDeadPixels} Pixels</span>
          </div>
          <select
            value={maxDeadPixels}
            onChange={(e) => setMaxDeadPixels(Number(e.target.value))}
            className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE4F3] rounded-lg text-[#17284D]"
          >
            <option value={0}>0 Dead Pixels (Strict Pristine Policy)</option>
            <option value={1}>Max 1 Sub-pixel permitted</option>
            <option value={2}>Max 2 Sub-pixels permitted</option>
          </select>
          <span className="text-[10px] text-[#5F6A86] block">
            Automated matrix scan triggers instant defect flag on breach.
          </span>
        </div>

        {/* CPU Benchmark Stress Duration */}
        <div className="p-3 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] space-y-2">
          <div className="flex justify-between font-bold text-[#17284D]">
            <span>CPU/GPU Stress Loop Duration</span>
            <span className="font-mono text-[#0052CC]">{stressDurationSec} Seconds</span>
          </div>
          <select
            value={stressDurationSec}
            onChange={(e) => setStressDurationSec(Number(e.target.value))}
            className="w-full px-3 py-1.5 text-xs bg-white border border-[#DDE4F3] rounded-lg text-[#17284D]"
          >
            <option value={5}>5 Seconds (Fast Triage)</option>
            <option value={10}>10 Seconds (Standard 64-Point Suite)</option>
            <option value={30}>30 Seconds (Deep Burn-In Stress)</option>
          </select>
          <span className="text-[10px] text-[#5F6A86] block">
            Full thermal saturation and clock throttling benchmark duration.
          </span>
        </div>
      </div>
    </Card>
  );
}
