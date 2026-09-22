"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Award, FileCheck2, Download, CheckCircle2, ArrowRight } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { PresetDevice } from "../_lib/diagnostic-suite";

interface HealthScoreModalProps {
  open: boolean;
  onClose: () => void;
  device: PresetDevice;
  score: number;
  grade: "Grade A" | "Grade B" | "Grade C" | "Failed";
  passedChecks: number;
  failedChecks: number;
  totalChecks: number;
  elapsedSec: string;
}

export default function HealthScoreModal({
  open,
  onClose,
  device,
  score,
  grade,
  passedChecks,
  failedChecks,
  totalChecks,
  elapsedSec,
}: HealthScoreModalProps) {
  const getGradeColor = () => {
    switch (grade) {
      case "Grade A":
        return "text-emerald-700 bg-emerald-50 border-emerald-300";
      case "Grade B":
        return "text-[#0052CC] bg-blue-50 border-blue-300";
      case "Grade C":
        return "text-amber-800 bg-amber-50 border-amber-300";
      default:
        return "text-rose-700 bg-rose-50 border-rose-300";
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="2xl"
      title="Audit Record Finalized"
      description={`Device: ${device.name} • Serial: ${device.serial}`}
    >
      <div className="space-y-6">
        {/* Top Score Banner */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#F4F6FB] via-white to-blue-50/50 border border-[#DDE4F3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Score Radial Circle */}
            <div className="relative w-20 h-20 rounded-full bg-white border-4 border-[#0052CC] shadow-md flex flex-col items-center justify-center shrink-0">
              <span className="text-2xl font-black font-mono text-[#17284D] leading-none">
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#5F6A86] mt-0.5">
                / 100
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wide border ${getGradeColor()}`}
                >
                  {grade}
                </span>
                <Badge tone="success" size="sm" dot>
                  64/64 Checked
                </Badge>
              </div>
              <h4 className="text-base font-bold font-display text-[#17284D] mt-1.5">
                Certified Hardware Health
              </h4>
              <p className="text-xs text-[#5F6A86]">
                Eligible for 12-Month XtraCover Warranty Protection
              </p>
            </div>
          </div>

          <div className="sm:text-right text-xs text-[#5F6A86] border-t sm:border-t-0 sm:border-l border-[#DDE4F3] pt-3 sm:pt-0 sm:pl-4">
            <p>
              Duration: <strong className="text-[#17284D]">{elapsedSec}s</strong>
            </p>
            <p className="mt-1">
              Passed: <strong className="text-emerald-700">{passedChecks}</strong>
            </p>
            <p className="mt-1">
              Issues: <strong className="text-amber-800">{failedChecks}</strong>
            </p>
          </div>
        </div>

        {/* 64-Point Assurance Grid */}
        <div className="p-4 rounded-xl bg-slate-50 border border-[#DDE4F3] space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#17284D] flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>XtraCover 64-Point Cryptographic Proof</span>
          </h5>
          <p className="text-xs text-[#5F6A86]">
            All subsystems including CPU AVX stress, GPU ray-trace mesh, NVMe S.M.A.R.T. wear, battery chemistry mV balance, and biometric sensors verified against OEM standards.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close Inspection
          </Button>

          <Link href="/portal/reports" className="w-full sm:w-auto">
            <Button
              variant="accent"
              size="md"
              icon={<FileCheck2 className="w-4 h-4 text-white" />}
              iconAfter={<ArrowRight className="w-4 h-4 text-white" />}
              className="w-full"
            >
              Generate Official Certificate
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
}
