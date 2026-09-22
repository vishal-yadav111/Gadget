"use client";

import React from "react";
import {
  CheckCircle2,
  XCircle,
  Smartphone,
  Camera,
  Volume2,
  Wifi,
  ShieldCheck,
  BatteryCharging,
} from "lucide-react";
import { FormattedMobileCertificateData } from "../mobileCertAdapter";

interface Props {
  data: FormattedMobileCertificateData;
}

export default function MobileCertPage2({ data }: Props) {
  const isPass = data.isPass;
  const passRate =
    data.totalApplicableTests > 0
      ? Math.round((data.passedTestsCount / data.totalApplicableTests) * 100)
      : (isPass ? 100 : 0);

  const getCategoryIcon = (name: string) => {
    if (name.includes("Display") || name.includes("Touch")) {
      return <Smartphone className="w-3.5 h-3.5 text-[#0052CC]" />;
    }
    if (name.includes("Camera") || name.includes("Optics")) {
      return <Camera className="w-3.5 h-3.5 text-[#0052CC]" />;
    }
    if (name.includes("Audio") || name.includes("Speaker")) {
      return <Volume2 className="w-3.5 h-3.5 text-[#0052CC]" />;
    }
    if (name.includes("Wireless") || name.includes("Connectivity")) {
      return <Wifi className="w-3.5 h-3.5 text-[#0052CC]" />;
    }
    if (name.includes("Biometrics") || name.includes("Sensor")) {
      return <ShieldCheck className="w-3.5 h-3.5 text-[#0052CC]" />;
    }
    return <BatteryCharging className="w-3.5 h-3.5 text-[#0052CC]" />;
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
                const fallback = document.getElementById("giq-fallback-logo-mb2");
                if (fallback) fallback.style.display = "inline";
              }}
            />
            <span id="giq-fallback-logo-mb2" className="hidden text-base font-black tracking-tight text-[#17284D]">
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
            Diagnostic Test Telemetry
          </h2>
          <p className="text-[11px] text-[#5F6A86]">
            {data.totalTestsExecuted} tests evaluated · {data.diagnosticEngine}
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
                <span className={`text-2xl font-black block leading-none ${data.failedTestsCount > 0 ? "text-rose-700" : "text-slate-400"}`}>
                  {data.failedTestsCount}
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-rose-800">
                  Failed
                </span>
              </div>
              <div className="border-l border-[#DDE4F3] pl-6 sm:pl-8">
                <span className="text-2xl font-black text-slate-500 block leading-none">
                  {data.naTestsCount}
                </span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-600">
                  N/A
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-sm font-black text-[#17284D] block">
                {passRate}% pass rate
              </span>
              <span className="text-[9px] text-[#5F6A86]">
                Applicable: {data.totalApplicableTests} / {data.totalTestsExecuted} tests
              </span>
            </div>
          </div>
        </div>

        {/* 6 Category Grid of Diagnostic Tests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {data.diagnosticCategories.map((category) => (
            <div
              key={category.categoryName}
              className="p-3 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs space-y-2"
            >
              <div className="flex items-center space-x-1.5 pb-1.5 border-b border-[#EEF2F6]">
                {getCategoryIcon(category.categoryName)}
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#17284D]">
                  {category.categoryName}
                </span>
              </div>

              <div className="space-y-1">
                {category.tests.map((t) => {
                  const isTestPass = t.status === "PASS";
                  const isTestFail = t.status === "FAIL";

                  return (
                    <div
                      key={t.name}
                      className="flex items-center justify-between text-xs py-0.5"
                    >
                      <span className="text-[10.5px] text-[#17284D] font-medium truncate pr-2">
                        {t.name}
                      </span>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {t.note && (
                          <span className="text-[8.5px] text-slate-400 italic">
                            {t.note}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            isTestPass
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : isTestFail
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {isTestPass ? (
                            <CheckCircle2 className="w-2.5 h-2.5" />
                          ) : isTestFail ? (
                            <XCircle className="w-2.5 h-2.5" />
                          ) : null}
                          <span>{t.status}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#DDE4F3] mt-3 flex items-center justify-between text-[8px] text-[#8C98A9]">
        <span>
          GadgetIQ Enterprise Hardware Diagnostics · QC Audit System
        </span>
        <span className="font-mono">
          Certificate {data.certificateNumber} · Page 2 of 3
        </span>
      </div>
    </div>
  );
}
