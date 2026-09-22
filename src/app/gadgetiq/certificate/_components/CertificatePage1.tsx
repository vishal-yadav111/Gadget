import React from "react";
import {
  CheckCircle2,
  QrCode,
  Cpu,
  Layers,
  HardDrive,
  Monitor,
  FileCheck,
  Sparkles,
} from "lucide-react";
import { QCCertificateData } from "@/lib/qc-api/types";

interface Props {
  data: QCCertificateData;
}

export default function CertificatePage1({ data }: Props) {
  const isPass = data.overallResult === "PASS";

  return (
    <div className="cert-page rounded-2xl border border-[#DDE4F3] p-5 sm:p-7 shadow-lg relative bg-white">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-[#DDE4F3]">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-36 sm:w-44 flex items-center">
              <img
                src="/images/logoblack.png"
                alt="GadgetIQ"
                className="h-8 w-auto object-contain max-w-[150px]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = document.getElementById("giq-fallback-logo-gen1");
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <div id="giq-fallback-logo-gen1" className="hidden">
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

            <div className="w-12 h-12 p-0.5 bg-white border border-[#DDE4F3] rounded-lg flex flex-col items-center justify-center shrink-0">
              <QrCode className="w-8 h-8 text-[#17284D]" />
              <span className="text-[6.5px] text-[#5F6A86] font-bold uppercase leading-none mt-0.5">
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
            <span>•</span>
            <span>
              Model SKU: <strong className="text-[#17284D]">{data.modelSku || data.productName || "Standard"}</strong>
            </span>
          </div>
        </div>

        {/* Large PASS / Status Banner */}
        <div className={`p-3 rounded-xl border-2 mb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isPass
            ? "bg-emerald-50/70 border-emerald-500/40 text-emerald-950"
            : "bg-rose-50/70 border-rose-500/40 text-rose-950"
          }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isPass ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
              }`}>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xl font-black tracking-tight ${isPass ? "text-emerald-700" : "text-rose-700"}`}>
                  {data.overallResult}
                </span>
                <span className="text-xs font-bold text-[#17284D]">
                  {data.passedTestsCount} of {data.totalApplicableTests} applicable tests passed
                </span>
              </div>
              <p className="text-[10px] text-[#5F6A86]">
                Assessed {data.assessedDateTime}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-[#DDE4F3] pt-1.5 sm:pt-0 sm:pl-3">
            <span className="text-[11px] font-extrabold text-[#17284D] block">
              XC-QC Quality Assurance Standard v2.4
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              All mandatory criteria met
            </span>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-3.5">
          {/* Card 1 */}
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] relative overflow-hidden">
            <span className="text-[8.5px] uppercase font-extrabold tracking-wider text-[#5F6A86] block">
              Device Health
            </span>
            <p className="text-base font-black text-[#17284D] mt-0.5">
              {data.deviceHealthStatus}
            </p>
            <span className="text-[9px] text-[#5F6A86] block">
              {isPass ? "No faults detected" : "Requires attention"}
            </span>
            <div className="w-full bg-emerald-600 h-1 rounded-full mt-2"></div>
          </div>

          {/* Card 2 */}
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] relative overflow-hidden">
            <span className="text-[8.5px] uppercase font-extrabold tracking-wider text-[#5F6A86] block">
              Battery Health
            </span>
            <p className="text-base font-black text-emerald-700 mt-0.5">
              {data.batteryHealthPercentage}%
            </p>
            <span className="text-[9px] text-[#5F6A86] block">
              Good · {data.batteryCycleCount} cycles
            </span>
            <div className="w-full bg-gray-200 h-1 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${Math.min(100, data.batteryHealthPercentage)}%` }}
              ></div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] relative overflow-hidden">
            <span className="text-[8.5px] uppercase font-extrabold tracking-wider text-[#5F6A86] block">
              Tests Completed
            </span>
            <p className="text-base font-black text-[#17284D] mt-0.5">
              {data.passedTestsCount}/{data.totalApplicableTests}
            </p>
            <span className="text-[9px] text-[#5F6A86] block">
              100% of applicable ({data.naTestsCount} N/A)
            </span>
            <div className="w-full bg-emerald-600 h-1 rounded-full mt-2"></div>
          </div>

          {/* Card 4 */}
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] relative overflow-hidden">
            <span className="text-[8.5px] uppercase font-extrabold tracking-wider text-[#5F6A86] block">
              Refurbishment Grade
            </span>
            <p className="text-base font-black text-[#0052CC] mt-0.5">
              {data.functionalGrade} / {data.cosmeticGrade}
            </p>
            <span className="text-[9px] text-[#5F6A86] block">
              Functional / Cosmetic
            </span>
            <div className="w-full bg-[#0052CC] h-1 rounded-full mt-2"></div>
          </div>
        </div>

        {/* Key Specifications (6 items) */}
        <div className="mb-3.5 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-2">
            Key Specifications
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-3 text-xs">
            <div className="flex items-start space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#0052CC] mt-0.5 shrink-0" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Processor</span>
                <strong className="text-[#17284D] font-bold line-clamp-1 text-[11px]">
                  {data.specs.processor.name}
                </strong>
              </div>
            </div>

            <div className="flex items-start space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#0052CC] mt-0.5 shrink-0" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Memory</span>
                <strong className="text-[#17284D] font-bold text-[11px]">
                  {data.specs.memory.capacity} {data.specs.memory.type}
                </strong>
              </div>
            </div>

            <div className="flex items-start space-x-1.5">
              <HardDrive className="w-3.5 h-3.5 text-[#0052CC] mt-0.5 shrink-0" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Storage</span>
                <strong className="text-[#17284D] font-bold text-[11px]">
                  {data.specs.storage.capacity} {data.specs.storage.type}
                </strong>
              </div>
            </div>

            <div className="flex items-start space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0052CC] mt-0.5 shrink-0" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Graphics</span>
                <strong className="text-[#17284D] font-bold line-clamp-1 text-[11px]">
                  {data.specs.graphics.name}
                </strong>
              </div>
            </div>

            <div className="flex items-start space-x-1.5">
              <Monitor className="w-3.5 h-3.5 text-[#0052CC] mt-0.5 shrink-0" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Display</span>
                <strong className="text-[#17284D] font-bold text-[11px]">
                  {data.specs.display.size} {data.specs.display.panel}
                </strong>
              </div>
            </div>

            <div className="flex items-start space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#0052CC] mt-0.5 shrink-0" />
              <div>
                <span className="text-[9px] text-[#5F6A86] block">Operating System</span>
                <strong className="text-[#17284D] font-bold line-clamp-1 text-[11px]">
                  {data.specs.operatingSystem.name}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Condition, Grading & Assurance (2 Boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5">
          {/* Left: Grades */}
          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] uppercase font-bold text-[#5F6A86]">Functional Grade</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded bg-blue-100 text-[#0052CC] font-black text-center leading-4 text-[10px]">
                  {data.functionalGrade}
                </span>
                <span className="font-semibold text-[#17284D] text-[10.5px]">Fully functional, no defects found</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#EEF2F6]">
              <span className="text-[9.5px] uppercase font-bold text-[#5F6A86]">Cosmetic Grade</span>
              <div className="flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded bg-blue-100 text-[#0052CC] font-black text-center leading-4 text-[10px]">
                  {data.cosmeticGrade}
                </span>
                <span className="font-semibold text-[#17284D] text-[10.5px]">Light wear; no cracks, dents or marks</span>
              </div>
            </div>
            <p className="text-[8.5px] text-[#8C98A9]">
              Scale: A excellent · B light wear · C visible wear
            </p>
          </div>

          {/* Right: Sanitisation & Warranty */}
          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-[#5F6A86] block">Data sanitisation</span>
                <strong className="text-[#17284D] text-[10.5px]">{data.dataSanitisation.method}</strong>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800">
                ✓ PASS
              </span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#EEF2F6]">
              <div>
                <span className="text-[9px] uppercase font-bold text-[#5F6A86] block">Warranty</span>
                <strong className="text-[#17284D] text-[10.5px]">
                  {data.warranty.term}, expires {data.warranty.expiryDate}
                </strong>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-800">
                ✓ PASS
              </span>
            </div>
            <p className="text-[8.5px] text-[#8C98A9]">
              Erasure certificate {data.dataSanitisation.certificateId} · terms on page 4
            </p>
          </div>
        </div>

        {/* Certification Statement & Signatures */}
        <div className="pt-2.5 border-t border-[#DDE4F3]">
          <p className="text-[9.5px] text-[#5F6A86] leading-relaxed mb-3">
            We certify that the device identified above has been assessed by XtraCover under the{" "}
            <strong className="text-[#17284D]">XC-QC Quality Assurance Standard v2.4</strong> and meets all applicable
            criteria for certified refurbished equipment. This certificate is issued on the basis of the diagnostic
            results recorded on pages 2 to 4.
          </p>

          <div className="flex items-end justify-between gap-4">
            {/* Signatures */}
            <div className="flex items-center space-x-6 text-xs">
              <div>
                <span className="font-bold text-[#17284D] text-xs block">
                  {data.signatures.technicianName}
                </span>
                <span className="text-[9px] font-semibold text-[#5F6A86] block">
                  Test Technician
                </span>
                <span className="text-[8px] text-[#8C98A9] font-mono block">
                  {data.signatures.technicianAuth}
                </span>
              </div>

              <div className="border-l border-[#DDE4F3] pl-6">
                <span className="font-bold text-[#17284D] text-xs block">
                  {data.signatures.qaManagerName}
                </span>
                <span className="text-[9px] font-semibold text-[#5F6A86] block">
                  QA Manager
                </span>
                <span className="text-[8px] text-[#8C98A9] font-mono block">
                  {data.signatures.qaManagerAuth}
                </span>
              </div>
            </div>

            {/* Round Seal Stamp */}
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#0052CC] p-1 flex flex-col items-center justify-center text-center shrink-0">
              <span className="text-[7.5px] uppercase font-black text-[#0052CC] tracking-tighter leading-none">
                XC-QC
              </span>
              <span className="text-[8px] uppercase font-bold text-[#17284D] leading-none my-0.5">
                CERTIFIED
              </span>
              <span className="text-[6.5px] text-[#5F6A86] font-mono">
                v2.4
              </span>
            </div>
          </div>
        </div>

        {/* Verification Box */}
        <div className="mt-3 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-white border border-[#DDE4F3] rounded-lg p-0.5 flex items-center justify-center shrink-0">
              <QrCode className="w-7 h-7 text-[#17284D]" />
            </div>
            <div className="text-[9px] text-[#5F6A86] leading-tight">
              <span className="font-extrabold uppercase text-[#17284D] block">
                How to verify this certificate
              </span>
              <span>1. Scan QR code or visit xtracover.com/verify · 2. Enter <strong>{data.certificateNumber}</strong></span>
            </div>
          </div>

          <div className="text-right text-[8.5px] text-[#5F6A86]">
            <span className="font-bold text-[#17284D] block text-[8.5px]">Digital signature (SHA-256)</span>
            <span className="font-mono text-[8px] text-[#0052CC] block font-bold">
              {data.digitalSignatureHash}
            </span>
          </div>
        </div>
      </div>

      {/* Page 1 Footer */}
      <div className="mt-3 pt-2 border-t border-[#EEF2F6] flex items-center justify-between text-[8px] text-[#8C98A9]">
        <span>
          XtraCover Technologies Pvt Ltd · Facility IN-DEL-04, New Delhi · CIN U72900DL2019PTC356104 · support@xtracover.com
        </span>
        <span>
          Certificate {data.certificateNumber} · Page 1 of 4 · Verify at xtracover.com/verify
        </span>
      </div>
    </div>
  );
}
