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
import { DiagnosticTestCategory, QCCertificateData } from "@/lib/qc-api/types";

interface Props {
  data: QCCertificateData;
}

export default function CertificatePage2({ data }: Props) {
  const isPass = data.overallResult === "PASS";

  const getCategoryIcon = (name: string) => {
    if (name.includes("Hardware") || name.includes("Core")) return <Cpu className="w-3.5 h-3.5 text-[#0052CC]" />;
    if (name.includes("Multimedia") || name.includes("Audio") || name.includes("Camera")) return <Volume2 className="w-3.5 h-3.5 text-[#0052CC]" />;
    if (name.includes("Display") || name.includes("Touch")) return <Monitor className="w-3.5 h-3.5 text-[#0052CC]" />;
    if (name.includes("Power") || name.includes("Thermal") || name.includes("Battery")) return <BatteryCharging className="w-3.5 h-3.5 text-[#0052CC]" />;
    if (name.includes("Connectivity") || name.includes("Wireless")) return <Wifi className="w-3.5 h-3.5 text-[#0052CC]" />;
    return <Keyboard className="w-3.5 h-3.5 text-[#0052CC]" />;
  };

  return (
    <div className="cert-page rounded-2xl border border-[#DDE4F3] p-5 sm:p-7 shadow-lg relative bg-white">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logoblack.png"
              alt="GadgetIQ"
              className="h-6 w-auto object-contain max-w-[120px]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = document.getElementById("giq-fallback-logo-gen2");
                if (fallback) fallback.style.display = "inline";
              }}
            />
            <span id="giq-fallback-logo-gen2" className="hidden text-base font-black tracking-tight text-[#17284D]">
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
            {data.totalApplicableTests + data.naTestsCount} tests executed · engine GIQ LP.W7sp1x64p3112.25.2607.01LAD
          </p>
        </div>

        {/* Summary Stats Banner */}
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] mb-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 sm:space-x-8">
              <div>
                <span className="text-xl font-black text-emerald-700 block leading-none">
                  {data.passedTestsCount}
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-800">
                  Passed
                </span>
              </div>
              <div className="border-l border-[#DDE4F3] pl-6 sm:pl-8">
                <span className="text-xl font-black text-rose-700 block leading-none">
                  {data.failedTestsCount}
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-rose-800">
                  Failed
                </span>
              </div>
              <div className="border-l border-[#DDE4F3] pl-6 sm:pl-8">
                <span className="text-xl font-black text-[#5F6A86] block leading-none">
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
              <span className={`text-xl font-black tracking-tight ${isPass ? "text-emerald-700" : "text-rose-700"}`}>
                {data.overallResult}
              </span>
            </div>
          </div>

          {/* Status Line */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full ${isPass ? "bg-emerald-600" : "bg-rose-600"}`}
                style={{ width: "100%" }}
              ></div>
            </div>
            <p className="text-[9px] text-[#5F6A86] mt-1 font-medium">
              {data.passedTestsCount} of {data.totalApplicableTests} applicable tests passed · {data.failedTestsCount} defects recorded
            </p>
          </div>
        </div>

        {/* 6 Category Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-3">
          {data.diagnosticCategories.map((category: DiagnosticTestCategory, idx: number) => {
            const passInCat = category.tests.filter((t) => t.status === "PASS").length;
            const failInCat = category.tests.filter((t) => t.status === "FAIL").length;
            const naInCat = category.tests.filter((t) => t.status === "N/A").length;

            return (
              <div key={idx} className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[#EEF2F6]">
                  <div className="flex items-center space-x-1.5">
                    {getCategoryIcon(category.categoryName)}
                    <strong className="text-[#17284D] font-bold text-[11px]">
                      {category.categoryName}
                    </strong>
                  </div>
                  <span className="text-[8.5px] font-mono text-[#5F6A86]">
                    {passInCat} pass · {failInCat} fail · {naInCat} n/a
                  </span>
                </div>

                <div className="space-y-1">
                  {category.tests.map((test, tIdx) => (
                    <div key={tIdx} className="flex items-center justify-between text-[10px]">
                      <span className="text-[#334155]">{test.name}</span>
                      <div className="flex items-center space-x-1 shrink-0">
                        {test.status === "PASS" && (
                          <span className="inline-flex items-center space-x-1 px-1 py-0.2 rounded text-[8.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>PASS</span>
                          </span>
                        )}
                        {test.status === "FAIL" && (
                          <span className="inline-flex items-center space-x-1 px-1 py-0.2 rounded text-[8.5px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-2.5 h-2.5" />
                            <span>FAIL</span>
                          </span>
                        )}
                        {test.status === "N/A" && (
                          <span className="inline-flex items-center space-x-1 text-[8.5px] text-[#8C98A9]">
                            {test.note ? <span className="italic">{test.note}</span> : null}
                            <span className="font-mono">N/A</span>
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

        {/* Legend */}
        <div className="p-2 rounded-lg bg-[#F8FAFC] border border-[#EEF2F6] flex flex-wrap items-center justify-between gap-2 text-[9px] text-[#5F6A86] mb-3">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-[#17284D] uppercase text-[8.5px]">Legend:</span>
            <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>✓ PASS meets criteria</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-rose-700 font-semibold">
              <XCircle className="w-2.5 h-2.5" />
              <span>✕ FAIL outside tolerance</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-[#5F6A86]">
              <span>N/A: hardware not fitted</span>
            </span>
          </div>
        </div>

        {/* Testing Standard & Pass Criteria Table */}
        <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] text-xs">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-1.5">
            Testing Standard & Pass Criteria
          </span>
          <div className="space-y-1 text-[10px]">
            <div className="flex justify-between py-0.5 border-b border-[#EEF2F6]">
              <span className="text-[#5F6A86] w-1/3">Testing standard</span>
              <span className="text-[#17284D] font-bold w-2/3">XC-QC Quality Assurance Standard v2.4</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-[#EEF2F6]">
              <span className="text-[#5F6A86] w-1/3">Pass criteria</span>
              <span className="text-[#17284D] font-medium w-2/3">
                All applicable tests pass · battery ≥ 80% · storage wear ≤ 10% · no SMART flags
              </span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-[#EEF2F6]">
              <span className="text-[#5F6A86] w-1/3">Diagnostic engine</span>
              <span className="font-mono text-[#17284D] w-2/3">GIQ LP.W7sp1x64p3112.25.2607.01LAD</span>
            </div>
            <div className="flex justify-between py-0.5">
              <span className="text-[#5F6A86] w-1/3">Calibration set</span>
              <span className="font-mono text-[#17284D] w-2/3">{data.documentControl.calibrationSet} · {data.assessedDateTime}</span>
            </div>
          </div>
        </div>

        <p className="text-[8.5px] text-[#8C98A9] mt-2 leading-tight">
          A device is certified only when every applicable mandatory test passes. Tests marked N/A relate to hardware not fitted and are excluded from the denominator.
        </p>
      </div>

      {/* Page 2 Footer */}
      <div className="mt-3 pt-2 border-t border-[#EEF2F6] flex items-center justify-between text-[8px] text-[#8C98A9]">
        <span>
          XtraCover Technologies Pvt Ltd · Facility IN-DEL-04, New Delhi · CIN U72900DL2019PTC356104 · support@xtracover.com
        </span>
        <span>
          Certificate {data.certificateNumber} · Page 2 of 4 · Verify at xtracover.com/verify
        </span>
      </div>
    </div>
  );
}
