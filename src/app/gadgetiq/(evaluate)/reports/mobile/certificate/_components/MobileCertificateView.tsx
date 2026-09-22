"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Printer,
  ArrowLeft,
  Share2,
  Check,
  Smartphone,
  ShieldCheck,
  FileText,
  Layers,
  Activity,
  Award,
} from "lucide-react";
import { FormattedMobileCertificateData } from "../mobileCertAdapter";
import MobileCertPage1 from "./MobileCertPage1";
import MobileCertPage2 from "./MobileCertPage2";
import MobileCertPage3 from "./MobileCertPage3";

interface Props {
  data: FormattedMobileCertificateData;
}

export default function MobileCertificateView({ data }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "page1" | "page2" | "page3">("all");
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="cert-viewer-root min-h-screen bg-[#F4F6FB] py-6 px-3 sm:px-6 print:min-h-0 print:p-0 print:m-0 print:bg-white">
      <div className="cert-viewer-inner max-w-5xl mx-auto space-y-6 print:max-w-none print:w-full print:m-0 print:p-0 print:space-y-0">
        {/* Top Navigation & Action Bar (Hidden on Print) */}
        <div className="no-print bg-white rounded-2xl border border-[#DDE4F3] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Link
                href="/gadgetiq/reports/mobile"
                className="p-2.5 rounded-xl bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] transition-colors cursor-pointer flex items-center justify-center shrink-0"
                title="Back to Mobile QC Reports"
              >
                <ArrowLeft className="w-4 h-4 text-[#17284D]" />
              </Link>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black text-[#17284D]">
                    {data.deviceBrand} {data.deviceModel}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[10.5px] font-bold ${
                      data.isPass
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {data.overallResult}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#5F6A86] mt-0.5 font-mono">
                  <span>Cert: <strong className="text-[#0052CC]">{data.certificateNumber}</strong></span>
                  <span>•</span>
                  <span>IMEI: <strong>{data.imei1}</strong></span>
                  <span>•</span>
                  <span>Work Order: <strong>{data.workOrderId}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end md:self-auto">
              <button
                onClick={handleShare}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#F4F6FB] text-[#17284D] border border-[#DDE4F3] hover:bg-[#E9EEF9] transition-all cursor-pointer"
                title="Copy direct share link"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#5F6A86]" />
                    <span>Share</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0052CC] text-white hover:bg-[#003D99] transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>

          {/* Page Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#EEF2F6]">
            {[
              { id: "all", label: "All Pages (Complete 3-Page Doc)", icon: FileText },
              { id: "page1", label: "Page 1: QA Certificate", icon: Award },
              { id: "page2", label: "Page 2: Diagnostic Results", icon: Activity },
              { id: "page3", label: "Page 3: Technical Specifications", icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0052CC] text-white shadow-xs"
                      : "bg-[#F4F6FB] text-[#5F6A86] hover:text-[#17284D] hover:bg-[#E9EEF9] border border-[#DDE4F3]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Render Container */}
        <div className="cert-document-container space-y-6 print:space-y-0">
          {(activeTab === "all" || activeTab === "page1") && (
            <div className="cert-page-wrapper">
              <MobileCertPage1 data={data} />
            </div>
          )}

          {(activeTab === "all" || activeTab === "page2") && (
            <div className="cert-page-wrapper">
              <MobileCertPage2 data={data} />
            </div>
          )}

          {(activeTab === "all" || activeTab === "page3") && (
            <div className="cert-page-wrapper">
              <MobileCertPage3 data={data} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
