"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Smartphone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Activity,
  Ribbon,
  Maximize2,
  X,
  ShieldCheck,
} from "lucide-react";
import { reportsService } from "../services";
import { getFriendlyErrorMessage } from "../../core";

export default function LensReportDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    reportsService
      .getById(id)
      .then((data) => {
        let rep = (data as any)?.data || (data as any)?.report || data;
        if (Array.isArray(rep)) rep = rep[0];
        setReport(rep);
      })
      .catch((err) => {
        console.error("Failed to load report detail:", err);
        setError(
          getFriendlyErrorMessage(
            err,
            "Report not found or currently unavailable."
          )
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/gadgetiq/certificate/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const getImageUrl = (path?: string | null) => {
    if (!path) return "";
    return reportsService.getImageUrl(path);
  };

  const formatSessionDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      const day = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const time = d
        .toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase();
      return `${day}, ${time}`;
    } catch {
      return dateStr;
    }
  };

  const formatGradedDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
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
      <div className="py-24 text-center text-xs text-[#5F6A86]">
        <div className="w-8 h-8 border-3 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading complete device inspection telemetry...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-8 rounded-[16px] bg-white border border-[#DDE4F3] text-center max-w-md mx-auto my-12 shadow-xs">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-2" />
        <h3 className="text-base font-bold text-[#17284D]">Report Unavailable</h3>
        <p className="text-xs text-[#5F6A86] mt-1 mb-4">
          {error || "Report does not exist."}
        </p>
        <Link
          href="/gadgetiq/reports"
          className="px-4 py-2 rounded-[8px] bg-[#0052CC] text-white text-xs font-bold inline-block"
        >
          ← Back to Reports
        </Link>
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

  // Visual evidence 6 angle photos
  const evidencePhotos = [
    { key: "front", label: "Front", url: report.photoFront },
    { key: "back", label: "Back", url: report.photoBack },
    { key: "left", label: "Left", url: report.photoLeft },
    { key: "right", label: "Right", url: report.photoRight },
    { key: "top", label: "Top", url: report.photoTop },
    { key: "bottom", label: "Bottom", url: report.photoBottom },
  ].filter((p) => Boolean(p.url));

  // Fallback to report.images if angle photos are empty
  if (evidencePhotos.length === 0 && Array.isArray(report.images)) {
    report.images.forEach((img: any, idx: number) => {
      evidencePhotos.push({
        key: `img_${idx}`,
        label: img.type || `Angle ${idx + 1}`,
        url: img.url || img.path || img,
      });
    });
  }

  const fg =
    report.functionalGrade ||
    (report.grade ? report.grade.match(/^[0-9]+/)?.[0] : null) ||
    "5";
  const cg =
    report.cosmeticGrade ||
    (report.grade ? report.grade.replace(/^[0-9]+/, "") : null) ||
    "A";
  const overallGrade = report.grade || `${fg}${cg}`;

  const deviceOsName = (report.deviceOs || "WINDOWS").toUpperCase();
  const screenHealthVal = getScreenHealth(report);
  const bodyHealthVal = getBodyHealth(report);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Link
          href="/gadgetiq/reports"
          className="px-4 py-2 rounded-[10px] bg-white border border-[#DDE4F3] text-xs font-bold text-[#17284D] hover:bg-slate-50 shadow-xs inline-flex items-center space-x-2 transition-colors self-start cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Reports</span>
        </Link>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-[10px] bg-white border border-[#C3CEE6] text-xs font-bold text-[#17284D] hover:bg-slate-50 flex items-center space-x-2 shadow-xs cursor-pointer transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#00875A]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#5F6A86]" />
            )}
            <span>{copied ? "Link Copied!" : "Copy Share Link"}</span>
          </button>

          <Link
            href={`/gadgetiq/certificate/${id}`}
            target="_blank"
            className="px-4 py-2 rounded-[10px] bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
          >
            <Ribbon className="w-3.5 h-3.5" />
            <span>View Certificate</span>
          </Link>
        </div>
      </div>

      {/* Hero Card: Device Title, Watermark Seal & Overall Grade */}
      <div className="p-6 sm:p-8 rounded-[20px] bg-white border border-[#DDE4F3] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Device Model Info */}
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[6px] bg-[#EBF3FF] text-[#0052CC] border border-[#CCE0FF] text-[11px] font-bold uppercase tracking-wider">
              <Smartphone className="w-3 h-3" />
              <span>{deviceOsName}</span>
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#17284D] tracking-tight">
              {report.deviceModel || "HP 240 G7 Notebook PC"}
            </h1>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#5F6A86]">
              <span>
                IMEI / SN:{" "}
                <strong className="text-[#17284D] font-mono font-bold">
                  {report.deviceImei || report.serialNumber || report.id}
                </strong>
              </span>
              <span>•</span>
              <span>Graded on {formatGradedDate(report.createdAt)}</span>
            </div>
          </div>

          {/* Right: Circular Certified Stamp & Overall Grade Box */}
          <div className="flex items-center space-x-5 shrink-0">
            {/* Authentic Stamp Image: stamp1.png */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/stamp1.png"
              alt="Quality Certified XtraCover Approved"
              className="w-18 h-18 sm:w-20 sm:h-20 object-contain select-none shrink-0"
            />

            {/* Overall Grade Card */}
            <div className="p-4 sm:p-5 rounded-[18px] bg-[#EAFBF3] border border-[#8CE3B8] text-center min-w-[130px] sm:min-w-[155px] shadow-xs">
              <div className="text-4xl sm:text-5xl font-black font-display text-[#00875A] leading-none tracking-tight">
                {overallGrade}
              </div>
              <div className="text-[10px] font-black text-[#00875A] uppercase tracking-wider mt-2">
                OVERALL GRADE
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Score Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* 1. FUNCTIONAL GRADE */}
        <div className="p-5 sm:p-6 rounded-[16px] bg-[#F0F5FF] border border-[#D0E2FF] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-extrabold text-[#0052CC] uppercase tracking-wider block mb-1.5">
            FUNCTIONAL GRADE
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#0052CC] tracking-tight">
            Grade {fg}
          </div>
        </div>

        {/* 2. COSMETIC GRADE */}
        <div className="p-5 sm:p-6 rounded-[16px] bg-[#F0FDF4] border border-[#BCECCB] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-extrabold text-[#00875A] uppercase tracking-wider block mb-1.5">
            COSMETIC GRADE
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#00875A] tracking-tight">
            Grade {cg}
          </div>
        </div>

        {/* 3. SCREEN HEALTH */}
        <div className="p-5 sm:p-6 rounded-[16px] bg-white border border-[#DDE4F3] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-extrabold text-[#5F6A86] uppercase tracking-wider block mb-1.5">
            SCREEN HEALTH
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#17284D] tracking-tight">
            {screenHealthVal}
          </div>
        </div>

        {/* 4. BODY HEALTH */}
        <div className="p-5 sm:p-6 rounded-[16px] bg-white border border-[#DDE4F3] shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-extrabold text-[#5F6A86] uppercase tracking-wider block mb-1.5">
            BODY HEALTH
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#17284D] tracking-tight">
            {bodyHealthVal}
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cosmetic Results & Diagnostic Telemetry */}
        <div className="lg:col-span-8 space-y-6">
          {/* Cosmetic Results Table */}
          <div className="p-5 sm:p-6 rounded-[16px] bg-white border border-[#DDE4F3] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
              <h2 className="text-base sm:text-lg font-bold text-[#17284D]">
                Cosmetic Results
              </h2>
              <span className="text-xs font-semibold text-[#5F6A86]">
                {cosmeticQuestions.length} Items Checked
              </span>
            </div>

            {cosmeticQuestions.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#5F6A86]">
                No cosmetic checklist responses recorded.
              </div>
            ) : (
              <div className="divide-y divide-[#E9EEF9]">
                {cosmeticQuestions.map(([question, answer], idx) => (
                  <div
                    key={idx}
                    className="py-3 px-2 sm:px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 hover:bg-[#F4F6FB] transition-colors rounded-[8px]"
                  >
                    <span className="text-xs sm:text-[13px] font-medium text-[#17284D] pr-4 leading-relaxed">
                      {question}
                    </span>
                    <span className="text-xs sm:text-[13px] font-bold text-[#0052CC] shrink-0 sm:text-right">
                      {String(answer)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Diagnostic Telemetry Results (Hardware Tests) */}
          {diagnosticsList.length > 0 && (
            <div className="p-5 sm:p-6 rounded-[16px] bg-white border border-[#DDE4F3] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#0052CC]" />
                  <h2 className="text-base sm:text-lg font-bold text-[#17284D]">
                    Diagnostic Results
                  </h2>
                </div>
                <span className="text-xs font-bold text-[#00875A]">
                  {
                    diagnosticsList.filter(
                      (d) =>
                        d.isPass === true ||
                        d.passed === true ||
                        d.status === "PASS" ||
                        d.result === "PASS" ||
                        String(d.result || "").includes("%")
                    ).length
                  }{" "}
                  / {diagnosticsList.length} Tests Passed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {diagnosticsList.map((diag, idx) => {
                  const isPass =
                    diag.isPass === true ||
                    diag.passed === true ||
                    diag.status === "PASS" ||
                    diag.result === "PASS" ||
                    String(diag.result || "").includes("%");
                  const isFail =
                    diag.status === "FAIL" ||
                    diag.result === "FAIL" ||
                    (diag.isPass === false && diag.result !== "N/A");

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-[10px] bg-[#F8FAFD] border border-[#DDE4F3] flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-[#17284D] block truncate">
                          {diag.label || diag.name || diag.testName || diag.key}
                        </span>
                        {diag.score !== undefined &&
                          diag.maxScore !== undefined && (
                            <span className="text-[10px] text-[#5F6A86] font-mono">
                              Score: {diag.score}/{diag.maxScore} pts
                            </span>
                          )}
                      </div>

                      <div className="shrink-0">
                        {isPass ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-[4px] bg-emerald-50 text-[#00875A] border border-emerald-200 text-[11px] font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{diag.result || diag.value || "PASS"}</span>
                          </span>
                        ) : isFail ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-[4px] bg-rose-50 text-[#C7300A] border border-rose-200 text-[11px] font-bold">
                            <XCircle className="w-3 h-3" />
                            <span>{diag.result || diag.value || "FAIL"}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold">
                            <span>{diag.result || diag.value || "N/A"}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Visual Evidence & Session Details Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Visual Evidence Photos Card */}
          <div className="p-5 sm:p-6 rounded-[16px] bg-white border border-[#DDE4F3] shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#17284D]">
              Visual Evidence
            </h2>

            {evidencePhotos.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#5F6A86]">
                No evidence photos attached.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {evidencePhotos.map((photo, idx) => {
                  const src = getImageUrl(photo.url);
                  return (
                    <div
                      key={idx}
                      onClick={() => setPreviewImage(src)}
                      className="relative aspect-square rounded-[10px] overflow-hidden border border-[#DDE4F3] bg-slate-100 cursor-pointer group shadow-xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`${photo.label} Evidence`}
                        onError={(e) => {
                          // Fallback placeholder if image load fails
                          (e.target as any).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23EEF2F6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2394A3B8' font-size='11' font-family='sans-serif'%3EPhoto%3C/text%3E%3C/svg%3E";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-black/75 py-1 text-center text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                        {photo.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Session Details Card */}
          <div className="p-5 sm:p-6 rounded-[16px] bg-white border border-[#DDE4F3] shadow-xs space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-[#17284D]">
              Session Details
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                  INSPECTED BY
                </span>
                <span className="font-bold text-[#17284D] text-sm">
                  {report.user?.name || report.user?.email || "Admin"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                  INSPECTION DATE
                </span>
                <span className="font-bold text-[#17284D]">
                  {formatSessionDate(report.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                  COMPLIANCE
                </span>
                <span className="font-bold text-[#00875A] text-xs">
                  Verified
                </span>
              </div>

              {report.deviceImei && (
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#5F6A86] block tracking-wider mb-0.5">
                    DEVICE IMEI / SN
                  </span>
                  <span className="font-mono font-bold text-[#17284D]">
                    {report.deviceImei}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Preview Lightbox */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-xs"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-[14px]">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImage}
              alt="Evidence Zoom"
              className="max-w-full max-h-[85vh] object-contain rounded-[14px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}


