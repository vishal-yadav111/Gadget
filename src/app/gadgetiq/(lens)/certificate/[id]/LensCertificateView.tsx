"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Check,
  X,
  Printer,
  Smartphone,
  Calendar,
  Sparkles,
  AlertCircle,
  Tv,
  Box,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { certificateService } from "../services";
import { reportsService } from "../../reports/services";

export default function LensCertificatePage() {
  const params = useParams();
  const id = params?.id as string;

  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    // Try public certificate endpoint first, fallback to getById
    certificateService
      .getPublicCertificate(id)
      .then((data) => {
        let rep = (data as any)?.data || (data as any)?.report || data;
        if (Array.isArray(rep)) rep = rep[0];
        if (rep && (rep.deviceModel || rep.id || rep.answers)) {
          setReport(rep);
        } else {
          return reportsService.getById(id).then((rData) => {
            let rRep =
              (rData as any)?.data || (rData as any)?.report || rData;
            if (Array.isArray(rRep)) rRep = rRep[0];
            setReport(rRep);
          });
        }
      })
      .catch(() => {
        return reportsService
          .getById(id)
          .then((rData) => {
            let rRep =
              (rData as any)?.data || (rData as any)?.report || rData;
            if (Array.isArray(rRep)) rRep = rRep[0];
            setReport(rRep);
          })
          .catch((err) => {
            console.error("Failed to load certificate:", err);
            setError("Certificate not found or currently unavailable.");
          });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const formatCertificateDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      const datePart = d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const timePart = d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      return `${datePart} at ${timePart}`;
    } catch {
      return dateStr;
    }
  };

  const formatTitleCase = (val: any) => {
    if (val === null || val === undefined) return "";
    const str = typeof val === "string" ? val : String(val);
    return str
      .split(" ")
      .map((w) => {
        if (!w) return "";
        if (
          w.startsWith('"') ||
          w.startsWith("(") ||
          w.startsWith("—") ||
          w.includes("/") ||
          w.includes('"')
        ) {
          return w;
        }
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(" ");
  };

  const getScreenHealth = (rep: any) => {
    if (rep.screenHealth) return rep.screenHealth;
    if (typeof rep.screenScore === "number") {
      const max = rep.screenMaxScore || 105;
      const pct = Math.min(100, Math.round((rep.screenScore / max) * 100));
      return `${pct}%`;
    }
    return "100%";
  };

  const getBodyHealth = (rep: any) => {
    if (rep.bodyHealth) return rep.bodyHealth;
    if (typeof rep.bodyScore === "number") {
      const max = rep.bodyMaxScore || 75;
      const pct = Math.min(100, Math.round((rep.bodyScore / max) * 100));
      return `${pct}%`;
    }
    return "100%";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#0052CC] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-[#17284D]">
          Verifying certificate authenticity...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center p-4">
        <div className="p-8 rounded-[16px] bg-white border border-[#DDE4F3] text-center max-w-md shadow-xs">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold font-display text-[#17284D]">
            Certificate Not Found
          </h2>
          <p className="text-xs text-[#5F6A86] mt-1 mb-5">
            {error || "The requested verification certificate does not exist."}
          </p>
          <Link
            href="/gadgetiq/reports"
            className="px-4 py-2 rounded-[8px] bg-[#0052CC] text-white text-xs font-bold"
          >
            ← Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  // Parse answers JSON and diagnostics
  let parsedAnswers: Record<string, any> = {};
  let diagnosticsList: any[] = [];

  if (typeof report.answers === "string") {
    try {
      parsedAnswers = JSON.parse(report.answers);
    } catch (e) {
      parsedAnswers = {};
    }
  } else if (report.answers && typeof report.answers === "object") {
    parsedAnswers = report.answers;
  }

  if (parsedAnswers._diagnostics && Array.isArray(parsedAnswers._diagnostics)) {
    diagnosticsList = parsedAnswers._diagnostics;
  } else if (report.functionalTests && Array.isArray(report.functionalTests)) {
    diagnosticsList = report.functionalTests;
  } else if (
    report.diagnosticResults &&
    Array.isArray(report.diagnosticResults)
  ) {
    diagnosticsList = report.diagnosticResults;
  }

  // Extract cosmetic checklist items (exclude _diagnostics)
  const cosmeticQuestions = Object.entries(parsedAnswers).filter(
    ([key]) => key !== "_diagnostics"
  );

  const fg =
    report.functionalGrade ||
    (report.grade ? report.grade.match(/^[0-9]+/)?.[0] : null) ||
    "5";
  const cg =
    report.cosmeticGrade ||
    (report.grade ? report.grade.replace(/^[0-9]+/, "") : null) ||
    "A";
  const overallGrade = report.grade || `${fg}${cg}`;

  const screenHealthVal = getScreenHealth(report);
  const bodyHealthVal = getBodyHealth(report);

  return (
    <div className="min-h-screen bg-[#F4F6FB] py-6 sm:py-10 px-3 sm:px-6 print:py-0 print:px-0 print:min-h-0 print:bg-white">
      {/* Top Floating Print & Back Controls (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print">
        <Link
          href="/gadgetiq/reports"
          className="px-3.5 py-1.5 rounded-[8px] bg-white border border-[#DDE4F3] text-xs font-bold text-[#17284D] hover:bg-slate-50 shadow-xs inline-flex items-center space-x-1.5 transition-colors self-start cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Reports</span>
        </Link>
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-[8px] bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs cursor-pointer transition-colors"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save PDF Certificate</span>
        </button>
      </div>

      {/* Official Certificate Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-[20px] border border-[#DDE4F3] shadow-lg overflow-hidden printable-certificate-area print:rounded-[6px] print:border print:border-[#C3CEE6] print:shadow-none">
        {/* Certificate Header Banner */}
        <div className="cert-header-banner bg-gradient-to-r from-[#DFF7F0] via-[#E8F8F5] to-[#F2FAFA] p-5 sm:p-7 print:p-5 print:py-4 border-b border-[#D8EFEA] relative flex flex-row items-center justify-between gap-4 print:gap-3">
          {/* Left: Brand & Report Title */}
          <div className="space-y-2 print:space-y-1">
            <div className="flex items-center space-x-3">
              {/* GadgetIQ Official Logo from /images/ */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logoblack.png"
                alt="GadgetIQ"
                className="h-8 sm:h-9 print:h-8 w-auto object-contain shrink-0"
              />
              <div className="pl-3 border-l border-slate-300">
                <span className="text-xs sm:text-sm font-bold text-[#17284D] block leading-tight print:text-[11px]">
                  Gadget Lens
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 block print:text-[9.5px]">
                  Official Device Quality Certificate
                </span>
              </div>
            </div>

            <div className="pt-0.5">
              <h1 className="text-xl sm:text-2xl font-extrabold font-display text-[#17284D] tracking-tight print:text-xl print:leading-tight">
                Device Inspection Report
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 print:text-[10.5px]">
                This certificate confirms the quality evaluation of the following device.
              </p>
            </div>
          </div>

          {/* Right: Certified Stamp & Overall Grade Badge */}
          <div className="flex flex-row items-center space-x-4 print:space-x-3.5 shrink-0">
            {/* Authentic Stamp Image: stamp1.png (Prominent, High-Visibility) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/stamp1.png"
              alt="Quality Certified XtraCover Approved"
              className="w-20 h-20 sm:w-24 sm:h-24 print:w-[76px] print:h-[76px] object-contain select-none shrink-0 drop-shadow-xs"
            />

            {/* Solid Green Overall Grade Card */}
            <div className="p-4 sm:p-5 print:p-2.5 print:px-4 rounded-[16px] print:rounded-[10px] bg-[#00B074] text-white text-center min-w-[115px] sm:min-w-[135px] print:min-w-[100px] shadow-sm">
              <div className="text-3xl sm:text-4xl print:text-3xl font-black font-display leading-none tracking-tight">
                {overallGrade}
              </div>
              <div className="text-[9px] sm:text-[10px] print:text-[8.5px] font-bold uppercase tracking-wider mt-1 text-white/95">
                GRADE {overallGrade}
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Body Container */}
        <div className="p-5 sm:p-7 print:p-5 print:px-6 space-y-4 sm:space-y-6 print:space-y-4">
          {/* 3 Device Info Cards (Locked 3-Column Grid) */}
          <div className="cert-info-grid grid grid-cols-3 gap-3 sm:gap-4 print:gap-3">
            {/* 1. Device Model */}
            <div className="p-3.5 sm:p-4 print:p-3 rounded-[12px] print:rounded-[8px] bg-white border border-[#DDE4F3] flex items-center space-x-3 print:space-x-2.5 shadow-xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 print:w-7 print:h-7 rounded-[8px] print:rounded-[6px] bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 print:w-3.5 print:h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] print:text-[8.5px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                  DEVICE MODEL
                </span>
                <span className="text-xs sm:text-[13.5px] print:text-[11.5px] font-bold text-[#17284D] block truncate">
                  {report.deviceModel || "HP 240 G7 Notebook PC"}
                </span>
              </div>
            </div>

            {/* 2. IMEI / Serial Number */}
            <div className="p-3.5 sm:p-4 print:p-3 rounded-[12px] print:rounded-[8px] bg-white border border-[#DDE4F3] flex items-center space-x-3 print:space-x-2.5 shadow-xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 print:w-7 print:h-7 rounded-[8px] print:rounded-[6px] bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 print:w-3.5 print:h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] print:text-[8.5px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                  IMEI / SERIAL NUMBER
                </span>
                <span className="text-xs sm:text-[13.5px] print:text-[11.5px] font-mono font-bold text-[#17284D] block truncate">
                  {report.deviceImei || report.serialNumber || report.id}
                </span>
              </div>
            </div>

            {/* 3. Inspection Date */}
            <div className="p-3.5 sm:p-4 print:p-3 rounded-[12px] print:rounded-[8px] bg-white border border-[#DDE4F3] flex items-center space-x-3 print:space-x-2.5 shadow-xs">
              <div className="w-8 h-8 sm:w-10 sm:h-10 print:w-7 print:h-7 rounded-[8px] print:rounded-[6px] bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 print:w-3.5 print:h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] sm:text-[10px] print:text-[8.5px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                  INSPECTION DATE
                </span>
                <span className="text-xs sm:text-[13.5px] print:text-[11.5px] font-bold text-[#17284D] block truncate">
                  {formatCertificateDate(report.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Metric Health Cards Row (Locked 4-Column Grid) */}
          <div className="cert-metrics-grid grid grid-cols-4 gap-3 sm:gap-4 print:gap-3">
            {/* Functional Grade */}
            <div className="p-3.5 sm:p-4 print:p-3 rounded-[12px] print:rounded-[8px] bg-white border border-[#DDE4F3] text-center shadow-xs">
              <ShieldCheck className="w-5 h-5 print:w-4 print:h-4 text-[#0052CC] mx-auto mb-1" />
              <span className="text-[9px] sm:text-[10px] print:text-[8.5px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                FUNCTIONAL GRADE
              </span>
              <div className="text-xl sm:text-2xl print:text-lg font-black text-[#17284D] tracking-tight">
                Grade {fg}
              </div>
            </div>

            {/* Cosmetic Grade */}
            <div className="p-3.5 sm:p-4 print:p-3 rounded-[12px] print:rounded-[8px] bg-white border border-[#DDE4F3] text-center shadow-xs">
              <Sparkles className="w-5 h-5 print:w-4 print:h-4 text-[#00B074] mx-auto mb-1" />
              <span className="text-[9px] sm:text-[10px] print:text-[8.5px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                COSMETIC GRADE
              </span>
              <div className="text-xl sm:text-2xl print:text-lg font-black text-[#17284D] tracking-tight">
                Grade {cg}
              </div>
            </div>

            {/* Screen Health */}
            <div className="p-3.5 sm:p-4 print:p-3 rounded-[12px] print:rounded-[8px] bg-white border border-[#DDE4F3] text-center shadow-xs">
              <Tv className="w-5 h-5 print:w-4 print:h-4 text-purple-600 mx-auto mb-1" />
              <span className="text-[9px] sm:text-[10px] print:text-[8.5px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                SCREEN HEALTH
              </span>
              <div className="text-xl sm:text-2xl print:text-lg font-black text-[#17284D] tracking-tight">
                {screenHealthVal}
              </div>
            </div>

            {/* Body Health */}
            <div className="p-3.5 sm:p-4 print:p-3 rounded-[12px] print:rounded-[8px] bg-white border border-[#DDE4F3] text-center shadow-xs">
              <Box className="w-5 h-5 print:w-4 print:h-4 text-amber-500 mx-auto mb-1" />
              <span className="text-[9px] sm:text-[10px] print:text-[8.5px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                BODY HEALTH
              </span>
              <div className="text-xl sm:text-2xl print:text-lg font-black text-[#17284D] tracking-tight">
                {bodyHealthVal}
              </div>
            </div>
          </div>

          {/* 2-Column Detailed Audit Checklist (Locked 2-Column Grid) */}
          <div className="cert-eval-grid grid grid-cols-2 gap-6 sm:gap-8 print:gap-6 pt-3 print:pt-3 border-t border-[#DDE4F3]">
            {/* Left Column: Cosmetic Evaluation */}
            <div>
              <div className="flex items-center space-x-2 pb-2 print:pb-1.5 mb-1.5 print:mb-1 border-b border-[#E9EEF9]">
                <span className="w-2 h-2 rounded-full bg-[#0052CC]" />
                <h2 className="text-[11px] sm:text-xs print:text-[10px] font-bold text-[#17284D] tracking-wider uppercase">
                  COSMETIC EVALUATION
                </h2>
              </div>

              {cosmeticQuestions.length === 0 ? (
                <div className="py-4 text-xs print:text-[9.5px] text-slate-400">
                  No cosmetic data recorded.
                </div>
              ) : (
                <div className="divide-y divide-[#F1F4F9]">
                  {cosmeticQuestions.map(([q, a], idx) => (
                    <div
                      key={idx}
                      className="py-1.5 sm:py-2 print:py-[3px] flex items-center justify-between text-xs print:text-[9.5px]"
                    >
                      <span className="text-slate-700 font-medium pr-2 leading-tight">
                        {formatTitleCase(q)}
                      </span>
                      <span className="font-bold text-[#17284D] shrink-0 text-right">
                        {formatTitleCase(String(a))}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Hardware Diagnostics */}
            <div>
              <div className="flex items-center space-x-2 pb-2 print:pb-1.5 mb-1.5 print:mb-1 border-b border-[#E9EEF9]">
                <span className="w-2 h-2 rounded-full bg-[#00B074]" />
                <h2 className="text-[11px] sm:text-xs print:text-[10px] font-bold text-[#17284D] tracking-wider uppercase">
                  HARDWARE DIAGNOSTICS
                </h2>
              </div>

              {diagnosticsList.length === 0 ? (
                <div className="py-4 text-xs print:text-[9.5px] text-slate-400">
                  No hardware diagnostics recorded.
                </div>
              ) : (
                <div className="divide-y divide-[#F1F4F9]">
                  {diagnosticsList.map((d, idx) => {
                    const isPass =
                      d.isPass === true ||
                      d.passed === true ||
                      d.status === "PASS" ||
                      d.result === "PASS" ||
                      String(d.result || "").includes("%");
                    const isFail =
                      d.status === "FAIL" ||
                      d.result === "FAIL" ||
                      (d.isPass === false && d.result !== "N/A");

                    return (
                      <div
                        key={idx}
                        className="py-1.5 sm:py-2 print:py-[3px] flex items-center justify-between text-xs print:text-[9.5px]"
                      >
                        <span className="text-slate-700 font-medium pr-2 leading-tight">
                          {d.label || d.name || d.testName || d.key}
                        </span>
                        <span className="shrink-0 font-bold">
                          {isPass ? (
                            <span className="text-[#00B074] inline-flex items-center space-x-1 font-bold">
                              <Check className="w-3.5 h-3.5 print:w-3 print:h-3 stroke-[2.5]" />
                              <span>{d.result || d.value || "PASS"}</span>
                            </span>
                          ) : isFail ? (
                            <span className="text-rose-600 inline-flex items-center space-x-1 font-bold">
                              <X className="w-3.5 h-3.5 print:w-3 print:h-3 stroke-[2.5]" />
                              <span>{d.result || d.value || "FAIL"}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold">
                              {d.result || d.value || "N/A"}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Certificate Footer Section (Locked Horizontal Row) */}
          <div className="cert-footer-row pt-4 sm:pt-5 print:pt-3 border-t border-[#DDE4F3] flex flex-row items-center justify-between gap-3 print:gap-2">
            <div className="space-y-0.5 text-left">
              <div className="text-[11px] sm:text-xs print:text-[9.5px] font-bold text-[#17284D]">
                Certificate ID:{" "}
                <span className="font-mono text-slate-700">
                  {report.id || "feecd12b-35e2-479d-b8ab-65f272ad402e"}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] print:text-[8.5px] text-slate-500 max-w-lg leading-tight">
                This certificate is automatically generated by Gadget Lens and
                represents an accurate assessment of the device condition at the
                time of inspection.
              </p>
            </div>

            {/* Circular Green Verified Stamp */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 print:w-12 print:h-12 rounded-full border-3 print:border-2 border-[#00B074] flex flex-col items-center justify-center p-0.5 text-center shrink-0 select-none">
              <span className="text-xl sm:text-2xl print:text-sm font-black font-display text-[#00B074] leading-none">
                {overallGrade}
              </span>
              <span className="text-[7px] print:text-[5px] font-black text-[#00B074] uppercase tracking-widest mt-0.5">
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



