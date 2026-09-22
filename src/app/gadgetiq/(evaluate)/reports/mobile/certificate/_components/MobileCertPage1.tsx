"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  QrCode,
  Cpu,
  Layers,
  HardDrive,
  Monitor,
  ShieldCheck,
  Smartphone,
  Camera,
  BatteryCharging,
  AlertTriangle,
} from "lucide-react";
import { FormattedMobileCertificateData } from "../mobileCertAdapter";

interface Props {
  data: FormattedMobileCertificateData;
}

export default function MobileCertPage1({ data }: Props) {
  const isPass = data.isPass;
  const passRate =
    data.totalApplicableTests > 0
      ? Math.round((data.passedTestsCount / data.totalApplicableTests) * 100)
      : 100;
  console.log("data is ", data)

  return (
    <div className="cert-page rounded-2xl border border-[#DDE4F3] p-5 sm:p-7 shadow-lg relative bg-white flex flex-col justify-between">
      <div>
        {/* Header Bar with GadgetIQ Logo */}
        <div className="flex items-start justify-between pb-3.5 border-b border-[#DDE4F3]">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-36 sm:w-44 flex items-center">
              <img
                src="/images/logoblack.png"
                alt="GadgetIQ"
                className="h-8 w-auto object-contain max-w-[150px]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = document.getElementById("giq-fallback-logo-mb1");
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <div id="giq-fallback-logo-mb1" className="hidden">
                <span className="text-xl font-black tracking-tight text-[#17284D]">
                  GADGET<span className="text-[#0052CC]">IQ</span>
                </span>
                <span className="text-[8px] uppercase font-bold tracking-widest text-[#5F6A86] block">
                  Hardware Diagnostic Suite
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-1 pl-2 border-l border-[#DDE4F3]">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0052CC] font-mono text-[9px] font-bold">
                QC Certificate
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block">
                Certificate Number
              </span>
              <span className="text-sm font-black font-mono text-[#0052CC] block tracking-tight">
                {data.certificateNumber}
              </span>
              <span className="text-[9px] text-[#5F6A86] block font-medium">
                Issued {data.issueDate}
              </span>
            </div>

            <div className="w-12 h-12 p-0.5 bg-white border border-[#DDE4F3] rounded-lg flex flex-col items-center justify-center shrink-0 shadow-2xs">
              <QrCode className="w-8 h-8 text-[#17284D]" />
              <span className="text-[6px] text-[#5F6A86] font-bold uppercase leading-none mt-0.5">
                Scan to verify
              </span>
            </div>
          </div>
        </div>

        {/* Device Identity Banner */}
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-[#DDE4F3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#DDE4F3] text-[#0052CC] flex items-center justify-center shrink-0 shadow-2xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0052CC]">
                  {data.deviceBrand}
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600 font-mono">
                  {data.deviceCategory}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-[#17284D] leading-tight mt-0.5">
                {data.productName}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#5F6A86] font-mono mt-1">
                <span>IMEI 1: <strong className="text-[#17284D]">{data.imei1}</strong></span>
                {data.imei2 && <span>IMEI 2: <strong className="text-[#17284D]">{data.imei2}</strong></span>}
                <span>Serial: <strong className="text-[#17284D]">{data.serialNumber}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end text-xs space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#5F6A86]">Cosmetic Grade</span>
            <span className="text-xl font-black text-[#0052CC]">
              {data.cosmeticGrade}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {data.cosmeticGradeLabel}
            </span>
          </div>
        </div>

        {/* 4 Summary Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5">
          {/* Card 1: Overall Result */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs shadow-2xs">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-0.5">
              Evaluation Verdict
            </span>
            <span className={`text-lg font-black block ${isPass ? "text-emerald-700" : "text-rose-700"}`}>
              {data.overallResult}
            </span>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden my-1">
              <div
                className={`h-full ${isPass ? "bg-emerald-600" : "bg-rose-500"}`}
                style={{ width: isPass ? "100%" : "35%" }}
              />
            </div>
            <span className="text-[9px] text-[#5F6A86] block truncate">
              {isPass ? "Certified QC Standard" : "Quarantine / Advisory"}
            </span>
          </div>

          {/* Card 2: Battery Health */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs shadow-2xs">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-0.5">
              Battery Health
            </span>
            <span className="text-lg font-black text-[#17284D] block">
              {data.batteryHealthPercentage !== undefined ? `${data.batteryHealthPercentage}%` : "—"}
            </span>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden my-1">
              <div
                className={`h-full ${(data.batteryHealthPercentage || 0) >= 80 ? "bg-emerald-600" : "bg-amber-500"}`}
                style={{ width: `${Math.min(data.batteryHealthPercentage || 0, 100)}%` }}
              />
            </div>
            <span className="text-[9px] text-[#5F6A86] block truncate">
              {data.batteryCapacity}
            </span>
          </div>

          {/* Card 3: Tests Completed */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs shadow-2xs">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-0.5">
              Tests Completed
            </span>
            <span className="text-lg font-black text-[#17284D] block">
              {data.passedTestsCount}/{data.totalApplicableTests}
            </span>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden my-1">
              <div
                className={`h-full ${isPass ? "bg-emerald-600" : "bg-rose-500"}`}
                style={{ width: `${passRate}%` }}
              />
            </div>
            <span className="text-[9px] text-[#5F6A86] block">
              {passRate}% of applicable ({data.naTestsCount} N/A)
            </span>
          </div>

          {/* Card 4: Quality Grade */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs shadow-2xs">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-0.5">
              Quality Grade
            </span>
            <span className="text-lg font-black text-[#17284D] block">
              Grade {data.functionalGrade}
            </span>
            <div className="w-full bg-blue-600 h-1 rounded-full my-1" />
            <span className="text-[9px] text-[#5F6A86] block">
              {data.cosmeticGradeLabel}
            </span>
          </div>
        </div>

        {/* Key Specifications */}
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] mb-3.5">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-2">
            Device Specifications (From System Telemetry)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="flex items-start space-x-2">
              <Cpu className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Processor</span>
                <span className="font-bold text-[#17284D] text-[11px] line-clamp-1">
                  {data.specs.processor.cores} ({data.deviceBrand})
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Monitor className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Screen Size</span>
                <span className="font-bold text-[#17284D] text-[11px] line-clamp-1">
                  {data.specs.display.size}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <HardDrive className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Storage / RAM</span>
                <span className="font-bold text-[#17284D] text-[11px] line-clamp-1">
                  {data.specs.memory.storage} · {data.specs.memory.ram}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Camera className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Cameras</span>
                <span className="font-bold text-[#17284D] text-[11px] line-clamp-1">
                  Rear: {data.specs.cameras.rearCamera} · Front: {data.specs.cameras.frontCamera}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <BatteryCharging className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Battery</span>
                <span className="font-bold text-[#17284D] text-[11px]">
                  {data.batteryCapacity} ({data.batteryHealthPercentage}%)
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Smartphone className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Operating System</span>
                <span className="font-bold text-[#17284D] text-[11px]">
                  {data.specs.operatingSystem.name} {data.specs.operatingSystem.version}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Condition & Data Assurance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5 text-xs">
          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] space-y-2">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block">
              Device Condition & Grade
            </span>
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052CC] font-black text-sm flex items-center justify-center shrink-0 border border-blue-200">
                {data.functionalGrade}
              </span>
              <div>
                <span className="text-[11px] font-bold text-[#17284D] block">
                  Assigned Grade: {data.functionalGrade}
                </span>
                <span className="text-[10px] text-[#5F6A86]">
                  {data.cosmeticGradeLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] space-y-2">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block">
              Data Sanitisation & Warranty
            </span>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px] font-bold text-[#17284D]">Data Sanitisation</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[9px]">
                  ✓ NIST SP 800-88 Verified
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0052CC]" />
                  <span className="text-[10px] font-bold text-[#17284D]">Warranty Status</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-[#0052CC] font-bold text-[9px]">
                  ✓ 12 Months Standard
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Certification Text */}
        <p className="text-[9.5px] text-[#5F6A86] leading-relaxed mb-3">
          We certify that the mobile device identified above has been assessed under the GadgetIQ
          Quality Assurance Standard and verified on the basis of the hardware diagnostic telemetry recorded on pages 2 and 3.
        </p>

        {/* Signatures (Technician Only, No QA Manager) */}
        <div className="flex items-center justify-between pt-2 border-t border-[#DDE4F3] mb-3">
          <div>
            <span className="text-xs font-bold text-[#17284D] block border-b border-slate-300 pb-1 min-w-[150px]">
              {data.technicianName}
            </span>
            <span className="text-[9px] text-[#5F6A86] block mt-0.5">
              <strong>Test Technician / Operator</strong>
            </span>
            <span className="text-[8px] text-[#8C98A9] block font-mono">
              Authorisation {data.technicianAuth}
            </span>
          </div>

          {/* Official Stamp */}
          <div className="shrink-0 relative">
            <img
              src="/images/stamp1.png"
              alt="GadgetIQ Certified"
              className="w-20 h-20 object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = document.getElementById("stamp-fallback-giq");
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              id="stamp-fallback-giq"
              className="hidden w-16 h-16 rounded-full border-2 border-[#0052CC] flex-col items-center justify-center text-center p-1"
            >
              <span className="text-[6.5px] uppercase font-extrabold text-[#0052CC] leading-none">
                GADGETIQ
              </span>
              <span className="text-[8px] font-black text-[#17284D] leading-tight">
                CERTIFIED
              </span>
              <span className="text-[6px] text-[#5F6A86]">v3.4</span>
            </div>
          </div>
        </div>

        {/* Verification Box */}
        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] flex items-center justify-between text-[9px] text-[#5F6A86]">
          <div className="flex items-center space-x-3">
            <QrCode className="w-8 h-8 text-[#17284D] shrink-0" />
            <div>
              <span className="font-extrabold uppercase text-[#17284D] block text-[9.5px]">
                How to verify this certificate
              </span>
              <p className="text-[8.5px] text-[#5F6A86] mt-0.5">
                Scan QR code or search certificate <strong className="font-mono text-[#0052CC]">{data.certificateNumber}</strong> to verify authenticity.
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[7.5px] uppercase font-extrabold text-[#5F6A86] block">
              Digital signature (SHA-256)
            </span>
            <span className="font-mono text-[8.5px] text-[#17284D] font-bold block max-w-[180px] break-all">
              {data.digitalSignature}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#DDE4F3] mt-3 flex items-center justify-between text-[8px] text-[#8C98A9]">
        <span>
          GadgetIQ Enterprise Hardware Diagnostics · QC Audit System
        </span>
        <span className="font-mono">
          Certificate {data.certificateNumber} · Page 1 of 3
        </span>
      </div>
    </div>
  );
}
