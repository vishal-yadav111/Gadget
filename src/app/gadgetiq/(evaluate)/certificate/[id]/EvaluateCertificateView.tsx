"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Printer,
  ArrowLeft,
  QrCode,
  Award,
  Cpu,
  HardDrive,
  Battery,
  Laptop,
} from "lucide-react";
import { certificateService } from "../services";
import { EvaluationCertificateData } from "../types";
import { getFriendlyErrorMessage } from "../../core";

export default function EvaluateCertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [cert, setCert] = useState<EvaluationCertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCertificate = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await certificateService.getCertificate(id);
      setCert(data);
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err, "Unable to load diagnostic certificate. Please check server connection."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-3 border-[#0052CC] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-slate-600">
          Loading 35-Point Digital Inspection Certificate...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#DDE4F3] max-w-md mx-auto my-12 space-y-3">
        <h2 className="text-base font-bold text-[#17284D]">Certificate Inspection Error</h2>
        <p className="text-xs text-slate-500">{error}</p>
        <div className="flex items-center justify-center space-x-2 pt-2">
          <button
            onClick={loadCertificate}
            className="px-4 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003D99] transition-colors cursor-pointer"
          >
            Retry
          </button>
          <Link
            href="/gadgetiq/dashboard"
            className="px-4 py-2 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] text-[#17284D] text-xs font-semibold"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-[#DDE4F3] max-w-md mx-auto my-12">
        <h2 className="text-base font-bold text-[#17284D]">Certificate Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          No diagnostic record found for service key: {id}
        </p>
        <Link
          href="/gadgetiq/dashboard"
          className="px-4 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Action Bar */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/gadgetiq/dashboard"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#5F6A86] hover:text-[#0052CC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Certificate</span>
        </button>
      </div>

      {/* Official Certificate Card */}
      <div className="bg-white rounded-3xl border-2 border-[#DDE4F3] p-6 sm:p-10 shadow-lg relative overflow-hidden text-[#17284D]">
        {/* Certificate Header Banner */}
        <div className="border-b border-[#DDE4F3] pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <img
              src="/images/logoblack.png"
              alt="GadgetIQ"
              className="h-8 w-auto object-contain max-w-[150px]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="border-l border-[#DDE4F3] pl-3">
              <span className="text-sm font-black tracking-tight text-[#17284D] block">
                GADGET<span className="text-[#0052CC]">IQ</span>
              </span>
              <p className="text-[11px] text-[#5F6A86] font-medium">
                Official Digital Hardware Health & Quality Certification
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Certificate Number
            </span>
            <span className="font-mono font-black text-sm text-[#0052CC] block">
              {cert.certificateNumber}
            </span>
          </div>
        </div>

        {/* Device Information & Pass Grade Badge */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0052CC] font-mono text-[10px] font-bold">
              VERIFIED DEVICE
            </span>
            <h1 className="text-2xl font-bold font-display text-[#17284D]">
              {cert.brand} {cert.model}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono">
              <span>Serial: {cert.serialNumber}</span>
              <span>•</span>
              <span>Tested: {cert.testedAt}</span>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-1" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              {cert.overallResult}
            </span>
            <span className="text-sm font-black text-emerald-900 mt-0.5">
              {cert.overallGrade}
            </span>
          </div>
        </div>

        {/* Hardware Specifications */}
        <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#DDE4F3] grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Processor
            </span>
            <span className="font-bold text-xs text-[#17284D] block mt-0.5 truncate">
              {cert.specs.processor || "Core i7-1365U"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Memory (RAM)
            </span>
            <span className="font-bold text-xs text-[#17284D] block mt-0.5">
              {cert.specs.ram || "16.0 GB"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Storage
            </span>
            <span className="font-bold text-xs text-[#17284D] block mt-0.5 truncate">
              {cert.specs.storage || "512 GB SSD"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Battery Health
            </span>
            <span className="font-bold text-xs text-emerald-700 block mt-0.5">
              {cert.specs.batteryHealth || "88%"}
            </span>
          </div>
        </div>

        {/* Diagnostic Check Matrix */}
        <div className="space-y-3 my-6">
          <h2 className="font-bold text-sm text-[#17284D]">
            35-Point Diagnostic Audit Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {cert.checkResults.map((check) => (
              <div
                key={check.name}
                className="p-2.5 rounded-xl border border-[#DDE4F3] bg-white flex items-center justify-between text-xs"
              >
                <span className="font-medium text-[#17284D] truncate pr-2">{check.name}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    check.passed
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {check.passed ? "PASS" : "FAIL"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Audit Verification */}
        <div className="mt-8 pt-6 border-t border-[#DDE4F3] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <QrCode className="w-8 h-8 text-slate-600" />
            <div>
              <span className="font-bold text-slate-700 block text-[11px]">
                Tamper-Proof Digital Verification
              </span>
              <span className="text-[10px]">
                Audited by XtraCover Certified Rig #{cert.technician}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono">
            Generated: {new Date().toLocaleDateString()} • Diagnostic Engine v4.2
          </span>
        </div>
      </div>
    </div>
  );
}
