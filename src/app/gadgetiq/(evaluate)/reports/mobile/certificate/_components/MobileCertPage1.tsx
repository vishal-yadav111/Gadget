"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  QrCode,
  Cpu,
  Layers,
  HardDrive,
  Monitor,
  Camera,
  FileCheck,
} from "lucide-react";
import { FormattedMobileCertificateData } from "../mobileCertAdapter";

interface Props {
  data: FormattedMobileCertificateData;
}

export default function MobileCertPage1({ data }: Props) {
  const normalizedResult = (data.overallResult || "").toUpperCase();
  const isPass = normalizedResult === "PASS" || normalizedResult === "PASSED" || normalizedResult === "SUCCESS" || normalizedResult === "OK";
  const isFail = normalizedResult === "FAIL" || normalizedResult === "FAILED" || normalizedResult === "TEST INCOMPLETE" || normalizedResult.includes("FAIL");
  const passRate = data.totalApplicableTests > 0
    ? Math.round((data.passedTestsCount / data.totalApplicableTests) * 100)
    : 100;

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

        {/* Title & Device Identification */}
        <div className="mt-3.5 mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0052CC] block">
            Certificate of Quality Assurance
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#17284D] tracking-tight">
            {data.deviceBrand} {data.deviceModel}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#5F6A86] mt-0.5 font-medium">
            <span>{data.deviceCategory} · {data.deviceBrand}</span>
            <span>•</span>
            <span>
              Serial: <strong className="font-mono text-[#17284D]">{data.serialNumber}</strong>
            </span>
            {data.imei1 && (
              <>
                <span>•</span>
                <span>
                  IMEI: <strong className="font-mono text-[#17284D]">{data.imei1}</strong>
                </span>
              </>
            )}
            {data.imei2 && data.imei2 !== data.imei1 && (
              <>
                <span>•</span>
                <span>
                  IMEI 2: <strong className="font-mono text-[#17284D]">{data.imei2}</strong>
                </span>
              </>
            )}
            <span>•</span>
            <span>
              Model SKU: <strong className="text-[#17284D]">{data.modelSku}</strong>
            </span>
          </div>
        </div>

        {/* Large Result Banner */}
        <div
          className={`p-3 rounded-xl border-2 mb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isPass
              ? "bg-emerald-50/70 border-emerald-500/40 text-emerald-950"
              : isFail
              ? "bg-rose-50/70 border-rose-500/40 text-rose-950"
              : "bg-slate-50/70 border-slate-300 text-slate-900"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                isPass ? "bg-emerald-600 text-white" : isFail ? "bg-rose-600 text-white" : "bg-slate-500 text-white"
              }`}
            >
              {isPass ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : isFail ? (
                <XCircle className="w-6 h-6" />
              ) : (
                <MinusCircle className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-black tracking-tight ${isPass ? "text-emerald-800" : isFail ? "text-rose-700" : "text-slate-800"}`}>
                  {data.overallResult}
                </span>
                <span className="text-xs font-bold opacity-90">
                  {data.passedTestsCount} of {data.totalApplicableTests} applicable tests passed
                </span>
              </div>
              <p className="text-[10px] opacity-75 font-medium">
                Assessed {data.assessedDateTime}
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-[10px] font-bold block">
              GadgetIQ Quality Assurance Standard
            </span>
            <span className={`text-[9px] font-bold block ${isPass ? "text-emerald-700 opacity-90" : isFail ? "text-rose-700" : "text-slate-600"}`}>
              {isPass ? "All mandatory criteria met" : isFail ? "Audit advisory or remediation noted" : "Inspection in progress"}
            </span>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
          {/* Card 1: Device Health */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs shadow-2xs">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-0.5">
              Device Health
            </span>
            <span className="text-lg font-black text-[#17284D] block">
              {data.deviceHealthStatus}
            </span>
            <div className={`w-full h-1 rounded-full my-1 ${isPass ? "bg-emerald-500" : "bg-rose-500"}`} />
            <span className="text-[9px] text-[#5F6A86] block">
              {data.failedTestsCount === 0 ? "No faults detected" : `${data.failedTestsCount} fault(s) detected`}
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
              {data.batteryCapacity !== "—" ? `${data.batteryCapacity} (Threshold 80%)` : "Diagnostic Verified"}
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
                className="h-full bg-emerald-600"
                style={{ width: `${passRate}%` }}
              />
            </div>
            <span className="text-[9px] text-[#5F6A86] block">
              {passRate}% of applicable ({data.naTestsCount} N/A)
            </span>
          </div>

          {/* Card 4: Refurbishment Grade */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs shadow-2xs">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-0.5">
              Refurbishment Grade
            </span>
            <span className="text-lg font-black text-[#17284D] block">
              {data.functionalGrade} / {data.cosmeticGrade}
            </span>
            <div className="w-full bg-blue-600 h-1 rounded-full my-1" />
            <span className="text-[9px] text-[#5F6A86] block">
              Functional / Cosmetic
            </span>
          </div>
        </div>

        {/* Key Specifications (2 Columns / 6 items) */}
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] mb-3.5">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-2">
            Key Specifications
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
              <Layers className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Memory / RAM</span>
                <span className="font-bold text-[#17284D] text-[11px]">
                  {data.specs.memory.ram}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <HardDrive className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Flash Storage</span>
                <span className="font-bold text-[#17284D] text-[11px] line-clamp-1">
                  {data.specs.memory.storage}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Camera className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Cameras & Optics</span>
                <span className="font-bold text-[#17284D] text-[11px] line-clamp-1">
                  {data.specs.cameras.rearCamera} · {data.specs.cameras.frontCamera}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Monitor className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Display & Panel</span>
                <span className="font-bold text-[#17284D] text-[11px]">
                  {data.specs.display.size || "Standard Display"}
                </span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <FileCheck className="w-4 h-4 text-[#0052CC] shrink-0 mt-0.5" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Operating System</span>
                <span className="font-bold text-[#17284D] text-[11px]">
                  {data.specs.operatingSystem.name} {data.specs.operatingSystem.version}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Condition, Grading & Assurance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5 text-xs">
          {/* Functional & Cosmetic Grade Card */}
          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] space-y-2">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block">
              Condition & Grading
            </span>
            <div className="space-y-1.5">
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-md bg-blue-50 text-[#0052CC] font-bold text-xs flex items-center justify-center shrink-0">
                  {data.functionalGrade}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#17284D] block">Functional Grade</span>
                  <span className="text-[9.5px] text-[#5F6A86]">
                    {data.functionalGrade === "A" ? "Fully functional, no hardware defects found" : "Functional with minor noted advisories"}
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-md bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {data.cosmeticGrade}
                </span>
                <div>
                  <span className="text-[10px] font-bold text-[#17284D] block">Cosmetic Grade</span>
                  <span className="text-[9.5px] text-[#5F6A86]">{data.cosmeticGradeLabel}</span>
                </div>
              </div>
            </div>
            <span className="text-[8px] text-slate-400 block pt-1 border-t border-[#EEF2F6]">
              Scale: A excellent · B light wear · C visible wear · D heavy cosmetic wear
            </span>
          </div>

          {/* System & Subsystems Audit Card */}
          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] space-y-2">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block">
              System Board & Subsystems Audit
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#5F6A86]">Primary IMEI:</span>
                <span className="text-[10px] font-bold text-[#17284D] font-mono">
                  {data.imei1}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#5F6A86]">Serial Number:</span>
                <span className="text-[10px] font-bold text-[#17284D] font-mono">
                  {data.serialNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#5F6A86]">Operating System:</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[9px]">
                  {data.specs.operatingSystem.name} {data.specs.operatingSystem.version} (Verified)
                </span>
              </div>
            </div>
            <span className="text-[8px] text-slate-400 block pt-1 border-t border-[#EEF2F6]">
              Work Order: {data.workOrderId} · Evaluated by {data.technicianName}
            </span>
          </div>
        </div>

        {/* Certification Text */}
        <p className="text-[9.5px] text-[#5F6A86] leading-relaxed mb-3">
          We certify that the device identified above has been assessed under the GadgetIQ Quality
          Assurance Standard and meets all applicable criteria for certified evaluated equipment.
          This certificate is issued on the basis of the diagnostic results recorded on pages 2 to 3.
        </p>

        {/* Signatures and Stamp */}
        <div className="flex items-center justify-between pt-2 border-t border-[#DDE4F3] mb-3">
          <div className="flex items-center space-x-8">
            <div>
              <span className="text-xs font-bold text-[#17284D] block border-b border-slate-300 pb-1 min-w-[120px]">
                {data.technicianName}
              </span>
              <span className="text-[9px] text-[#5F6A86] block mt-0.5">
                <strong>Test Technician</strong>
              </span>
              <span className="text-[8px] text-[#8C98A9] block">
                Authorisation {data.technicianAuth}
              </span>
            </div>

            <div className="border-l border-[#DDE4F3] pl-8">
              <span className="text-xs font-bold text-[#17284D] block border-b border-slate-300 pb-1 min-w-[120px]">
                Quality Assurance
              </span>
              <span className="text-[9px] text-[#5F6A86] block mt-0.5">
                <strong>Automated Audit</strong>
              </span>
              <span className="text-[8px] text-[#8C98A9] block">
                Engine {data.diagnosticEngine || "GadgetIQ Engine"}
              </span>
            </div>
          </div>

          {/* Official Stamp */}
          <div className="shrink-0 relative">
            <img
              src="/images/stamp1.png"
              alt="GadgetIQ Certified Stamp"
              className="w-20 h-20 object-contain drop-shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = document.getElementById("stamp-fallback-mb1");
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div
              id="stamp-fallback-mb1"
              className="hidden w-16 h-16 rounded-full border-2 border-[#0052CC] flex-col items-center justify-center text-center p-1"
            >
              <span className="text-[6.5px] uppercase font-extrabold text-[#0052CC] leading-none">
                GADGETIQ
              </span>
              <span className="text-[8px] font-black text-[#17284D] leading-tight">
                CERTIFIED
              </span>
              <span className="text-[6px] text-[#5F6A86]">EVALUATE</span>
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
              <ol className="list-decimal list-inside space-y-0.2 mt-0.5 text-[8.5px]">
                <li>Scan the QR code, or go to xtracover.com/verify</li>
                <li>Enter certificate number <strong className="font-mono text-[#0052CC]">{data.certificateNumber}</strong></li>
                <li>Confirm the device serial/IMEI and signature hash match this document</li>
              </ol>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[7.5px] uppercase font-extrabold text-[#5F6A86] block">
              Digital signature (SHA-256)
            </span>
            <span className="font-mono text-[8.5px] text-[#17284D] font-bold block max-w-[180px] break-all">
              {data.digitalSignature}
            </span>
            <span className="text-[7px] text-[#8C98A9] block">
              Any alteration invalidates this signature.
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#DDE4F3] mt-3 flex items-center justify-between text-[8px] text-[#8C98A9]">
        <span>
          XtraCover Technologies Pvt Ltd · Facility IN-DEL-04, New Delhi · CIN U72900DL2019PTC356104 · support@xtracover.com
        </span>
        <span className="font-mono">
          Certificate {data.certificateNumber} · Page 1 of 3
        </span>
      </div>
    </div>
  );
}
