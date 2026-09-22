"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Cpu,
  Volume2,
  Monitor,
  BatteryCharging,
  Wifi,
  Keyboard,
} from "lucide-react";
import { FormattedLaptopCertificateData } from "../laptopCertAdapter";

interface Props {
  data: FormattedLaptopCertificateData;
}

export default function LaptopCertPage2({ data }: Props) {
  const isPass = data.overallResult === "PASS";
  const passRate = data.totalApplicableTests > 0 
    ? Math.round((data.passedTestsCount / data.totalApplicableTests) * 100) 
    : 100;

  const getCategoryIcon = (name: string) => {
    if (name.includes("Hardware") || name.includes("Core") || name.includes("Storage")) {
      return <Cpu className="w-3.5 h-3.5 text-[#0052CC]" />;
    }
    if (name.includes("Multimedia") || name.includes("Audio") || name.includes("Camera")) {
      return <Volume2 className="w-3.5 h-3.5 text-[#0052CC]" />;
    }
    if (name.includes("Display") || name.includes("Software")) {
      return <Monitor className="w-3.5 h-3.5 text-[#0052CC]" />;
    }
    if (name.includes("Power") || name.includes("Thermal") || name.includes("Battery")) {
      return <BatteryCharging className="w-3.5 h-3.5 text-[#0052CC]" />;
    }
    if (name.includes("Connectivity") || name.includes("Network")) {
      return <Wifi className="w-3.5 h-3.5 text-[#0052CC]" />;
    }
    return <Keyboard className="w-3.5 h-3.5 text-[#0052CC]" />;
  };

  return (
    <div className="cert-page rounded-2xl border border-[#DDE4F3] p-5 sm:p-7 shadow-lg relative bg-white flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logoblack.png"
              alt="GadgetIQ"
              className="h-6 w-auto object-contain max-w-[120px]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = document.getElementById("giq-fallback-logo-p2");
                if (fallback) fallback.style.display = "inline";
              }}
            />
            <span id="giq-fallback-logo-p2" className="hidden text-base font-black tracking-tight text-[#17284D]">
              GADGET<span className="text-[#0052CC]">IQ</span>
            </span>
            <span className="text-xs text-[#8C98A9]">·</span>
            <span className="text-xs font-bold text-[#5F6A86]">Hardware Diagnostics</span>
          </div>
          <span className="text-[11px] font-mono text-[#5F6A86]">
            {data.certificateNumber} · {data.deviceBrand} {data.deviceModel}
          </span>
        </div>

        {/* Title */}
        <div className="my-3">
          <h2 className="text-xl font-black text-[#17284D] tracking-tight">
            Diagnostic test results
          </h2>
          <p className="text-[11px] text-[#5F6A86]">
            {data.totalTestsExecuted} tests executed · engine {data.diagnosticEngine}
          </p>
        </div>

        {/* Summary Stats Banner */}
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] mb-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 sm:space-x-8">
              <div>
                <span className="text-2xl font-black text-emerald-700 block leading-none">
                  {data.passedTestsCount}
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-800">
                  Passed
                </span>
              </div>
              <div className="border-l border-[#DDE4F3] pl-6 sm:pl-8">
                <span className="text-2xl font-black text-rose-700 block leading-none">
                  {data.failedTestsCount}
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-rose-800">
                  Failed
                </span>
              </div>
              <div className="border-l border-[#DDE4F3] pl-6 sm:pl-8">
                <span className="text-2xl font-black text-[#5F6A86] block leading-none">
                  {data.naTestsCount}
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                  Not Applicable
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[8.5px] uppercase font-extrabold tracking-wider text-[#5F6A86] block">
                Overall Result
              </span>
              <span
                className={`text-2xl font-black tracking-tight ${
                  isPass ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                {data.overallResult}
              </span>
            </div>
          </div>

          {/* Status Progress Line */}
          <div className="mt-2.5">
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${isPass ? "bg-emerald-600" : "bg-rose-600"}`}
                style={{ width: `${passRate}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-[#5F6A86] mt-1">
              <span>{passRate}% of applicable tests passed</span>
              <span>{data.failedTestsCount} defects recorded</span>
            </div>
          </div>
        </div>

        {/* 6 Diagnostic Test Category Cards (2 Columns x 3 Rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
          {data.diagnosticCategories.map((cat, idx) => {
            const catPassed = cat.tests.filter((t) => t.status === "PASS").length;
            const catFailed = cat.tests.filter((t) => t.status === "FAIL").length;
            const catNa = cat.tests.filter((t) => t.status === "N/A").length;

            return (
              <div
                key={`cat-${idx}`}
                className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#EEF2F6] mb-1.5">
                  <div className="flex items-center space-x-1.5 font-bold text-[#17284D] text-[11px]">
                    {getCategoryIcon(cat.categoryName)}
                    <span>{cat.categoryName}</span>
                  </div>
                  <span className="text-[8.5px] font-mono text-[#5F6A86]">
                    {catPassed} pass · {catFailed} fail · {catNa} n/a
                  </span>
                </div>

                <div className="space-y-1">
                  {cat.tests.map((test, tIdx) => (
                    <div
                      key={`test-${tIdx}`}
                      className="flex items-center justify-between py-0.5 text-[10px]"
                    >
                      <span className="text-[#17284D] font-medium">{test.name}</span>
                      <div className="flex items-center space-x-1.5">
                        {test.note && (
                          <span className="text-[8.5px] text-[#8C98A9] italic">
                            {test.note}
                          </span>
                        )}
                        {test.status === "PASS" && (
                          <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-extrabold text-[8.5px]">
                            <span>✓</span>
                            <span>PASS</span>
                          </span>
                        )}
                        {test.status === "FAIL" && (
                          <span className="inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 font-extrabold text-[8.5px]">
                            <span>✕</span>
                            <span>FAIL</span>
                          </span>
                        )}
                        {test.status === "N/A" && (
                          <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 font-bold text-[8.5px]">
                            <span>N/A</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend Box */}
        <div className="p-2 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] mb-3 text-[9px]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-extrabold uppercase text-[#5F6A86] text-[8.5px]">
              Legend
            </span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 font-extrabold text-[8px]">
                  ✓ PASS
                </span>
                <span className="text-[#5F6A86] text-[8.5px]">meets pass criteria</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="px-1 py-0.2 rounded bg-rose-50 text-rose-700 font-extrabold text-[8px]">
                  ✕ FAIL
                </span>
                <span className="text-[#5F6A86] text-[8.5px]">outside tolerance</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="px-1 py-0.2 rounded bg-gray-100 text-gray-500 font-extrabold text-[8px]">
                  N/A
                </span>
                <span className="text-[#5F6A86] text-[8.5px]">hardware not fitted or out of scope</span>
              </div>
            </div>
          </div>
          <p className="text-[7.5px] text-[#8C98A9] mt-1">
            Status is conveyed by label, shape and colour; this document remains legible in greyscale and when photocopied.
          </p>
        </div>

        {/* Testing Standard & Pass Criteria Table */}
        <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-[9.5px]">
          <span className="font-extrabold uppercase text-[#17284D] block text-[9px] mb-1.5">
            Testing Standard & Pass Criteria
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[#5F6A86]">
            <div className="flex justify-between border-b border-[#EEF2F6] py-0.5">
              <span>Work Order ID</span>
              <strong className="text-[#17284D] font-mono">{data.workOrderId}</strong>
            </div>
            <div className="flex justify-between border-b border-[#EEF2F6] py-0.5">
              <span>Pass criteria</span>
              <span className="text-[#17284D] font-medium text-right">
                All mandatory criteria met · {data.passedTestsCount} Passed
              </span>
            </div>
            <div className="flex justify-between border-b border-[#EEF2F6] py-0.5">
              <span>Diagnostic Engine</span>
              <strong className="font-mono text-[#17284D] text-[9px] truncate max-w-[200px]">{data.diagnosticEngine}</strong>
            </div>
            <div className="flex justify-between border-b border-[#EEF2F6] py-0.5">
              <span>Inspector Auth</span>
              <strong className="font-mono text-[#17284D]">{data.technicianAuth}</strong>
            </div>
            <div className="flex justify-between py-0.5 col-span-1 sm:col-span-2">
              <span>Assessment Timestamp</span>
              <span className="text-[#17284D] font-mono font-medium">{data.assessedDateTime}</span>
            </div>
          </div>
        </div>

        <p className="text-[8px] text-[#8C98A9] mt-2 italic leading-tight">
          A device is certified only when every applicable mandatory test passes. Tests marked N/A relate to hardware not fitted to this configuration and are excluded from the denominator; they are not failures and do not reduce the result.
        </p>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#DDE4F3] mt-3 flex items-center justify-between text-[8px] text-[#8C98A9]">
        <span>
          XtraCover Technologies Pvt Ltd · Facility IN-DEL-04, New Delhi · CIN U72900DL2019PTC356104 · support@xtracover.com
        </span>
        <span className="font-mono">
          Certificate {data.certificateNumber} · Page 2 of 3
        </span>
      </div>
    </div>
  );
}
