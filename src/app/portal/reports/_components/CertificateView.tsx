"use client";

import React from "react";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  QrCode,
  Printer,
  Download,
  Share2,
  Lock,
  Calendar,
  UserCheck,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CertificateReport } from "../_lib/reports-data";

interface CertificateViewProps {
  certificate: CertificateReport;
}

export default function CertificateView({ certificate }: CertificateViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Action Ribbon */}
      <div className="flex items-center justify-between bg-white p-3 sm:p-4 rounded-xl border border-[#DDE4F3] shadow-xs">
        <div className="flex items-center space-x-2">
          <Badge tone="success" dot size="md">
            Cryptographically Verified
          </Badge>
          <span className="text-xs font-mono text-[#5F6A86] hidden sm:inline">
            Hash: {certificate.cryptoHash.substring(0, 16)}...
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={`/gadgetiq/certificate?imei=${encodeURIComponent(certificate.serial || certificate.certificateNumber)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-[#0052CC] border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Certificate Registry</span>
          </a>
          <Button
            variant="primary"
            size="sm"
            icon={<Printer className="w-3.5 h-3.5 text-white" />}
            onClick={handlePrint}
          >
            Print Certificate
          </Button>
        </div>
      </div>

      {/* Official Certificate Canvas */}
      <div className="relative bg-white rounded-2xl border-2 border-[#0052CC]/40 p-6 sm:p-10 shadow-xl overflow-hidden font-sans text-[#17284D]">
        {/* Subtle Watermark BG */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <ShieldCheck className="w-[500px] h-[500px] text-[#0052CC]" />
        </div>

        {/* Certificate Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-[#0052CC]/20 gap-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0052CC] to-[#003D99] flex items-center justify-center font-bold text-white shadow-md">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0052CC] block">
                XtraCover Technologies • Official Audit Record
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display text-[#17284D] tracking-tight">
                Certificate of Diagnostic Evaluation
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-[#5F6A86] uppercase font-bold block">
              Certificate No.
            </span>
            <span className="text-sm font-mono font-extrabold text-[#0052CC]">
              {certificate.certificateNumber}
            </span>
          </div>
        </div>

        {/* Device Information & Scoring Banner */}
        <div className="my-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Left: Device Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6A86] block">
                Target Hardware Unit
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display text-[#17284D] mt-0.5">
                {certificate.deviceModel}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-[#F4F6FB] border border-[#DDE4F3]">
                <span className="text-[10px] text-[#5F6A86] uppercase font-bold block">
                  Serial Number
                </span>
                <span className="font-mono font-bold text-[#17284D] mt-0.5 block">
                  {certificate.serial}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F4F6FB] border border-[#DDE4F3]">
                <span className="text-[10px] text-[#5F6A86] uppercase font-bold block">
                  Battery Wear %
                </span>
                <span className="font-mono font-bold text-emerald-700 mt-0.5 block">
                  {certificate.batteryHealth}% ({certificate.cycleCount} Cycles)
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#F4F6FB] border border-[#DDE4F3]">
                <span className="text-[10px] text-[#5F6A86] uppercase font-bold block">
                  Warranty Coverage
                </span>
                <span className="font-bold text-[#0052CC] mt-0.5 block">
                  {certificate.warrantyPeriodMonths} Months Certified
                </span>
              </div>
            </div>
          </div>

          {/* Right: Certified Seal */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 flex flex-col items-center justify-center text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-[#0052CC] flex flex-col items-center justify-center shadow-md mb-2">
              <span className="text-2xl font-black font-mono text-[#17284D] leading-none">
                {certificate.healthScore}
              </span>
              <span className="text-[8px] uppercase font-bold text-[#5F6A86]">
                Score
              </span>
            </div>
            <span className="text-xs px-3 py-1 rounded-md font-extrabold uppercase tracking-wide bg-emerald-600 text-white shadow-xs">
              {certificate.grade} Verified
            </span>
            <span className="text-[10px] text-[#5F6A86] mt-2 font-medium">
              Passed 64 of 64 Diagnostic Checkpoints
            </span>
          </div>
        </div>

        {/* 64-Point Quality Guarantee Proof Grid */}
        <div className="my-6 p-4 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] relative z-10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#17284D] mb-3 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>XtraCover 64-Point Quality Assurance Breakdown</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>CPU Stress & Thermal</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>RAM Read/Write Bus</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>NVMe S.M.A.R.T. Health</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Display Color & Pixels</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Battery Chemistry & PD</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Motherboard PCIe Lanes</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Wi-Fi 6E / BT 5.3 RF</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Biometric Security Enclave</span>
            </div>
          </div>
        </div>

        {/* Certificate Signatures & QR Block */}
        <div className="mt-8 pt-6 border-t border-[#DDE4F3] flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-xs">
          <div className="flex items-center space-x-3">
            {/* Mock QR */}
            <div className="w-16 h-16 bg-white border border-[#DDE4F3] rounded-lg p-1 shadow-xs flex items-center justify-center shrink-0">
              <QrCode className="w-14 h-14 text-[#17284D]" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#5F6A86] block">
                Tamper-Proof Verification
              </span>
              <p className="font-mono text-[10px] text-[#5F6A86] break-all max-w-xs">
                SHA256: {certificate.cryptoHash.substring(0, 32)}...
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold block">
                Status: Official & Immutable
              </span>
            </div>
          </div>

          <div className="text-right sm:border-l border-[#DDE4F3] sm:pl-6 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#5F6A86] block">
              Certified Diagnostician
            </span>
            <p className="text-sm font-bold text-[#17284D]">
              {certificate.auditorName}
            </p>
            <p className="text-[11px] text-[#5F6A86]">
              {certificate.auditorTitle}
            </p>
            <p className="text-[10px] text-[#5F6A86]">
              Issued on: {certificate.issuedAt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
