"use client";

import React, { useState } from "react";
import {
  Printer,
  Laptop,
  Smartphone,
  Search,
  RefreshCw,
  Share2,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { QCCertificateData } from "@/lib/qc-api/types";
import CertificatePage1 from "./CertificatePage1";
import CertificatePage2 from "./CertificatePage2";
import CertificatePage3 from "./CertificatePage3";
import CertificatePage4 from "./CertificatePage4";

interface CertificateViewerProps {
  initialData: QCCertificateData | null;
  initialKey?: string;
  initialType?: "laptop" | "mobile";
}

export default function CertificateViewer({
  initialData,
  initialKey = "",
  initialType = "laptop",
}: CertificateViewerProps) {
  const [deviceType, setDeviceType] = useState<"laptop" | "mobile">(initialType);
  const [serviceKey, setServiceKey] = useState<string>(initialKey);
  const [data, setData] = useState<QCCertificateData | null>(initialData);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"all" | "page1" | "page2" | "page3" | "page4">("all");
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(!!initialData || !!initialKey);

  const fetchCertificate = async (keyToFetch: string, typeToFetch: "laptop" | "mobile") => {
    const clean = keyToFetch.trim();
    if (!clean) {
      setErrorMsg("Please enter a valid IMEI or Service Key.");
      setData(null);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setHasSearched(true);

    try {
      const res = await fetch(
        `/api/gadgetiq/certificate?servicekey=${encodeURIComponent(clean)}&type=${typeToFetch}`
      );
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setErrorMsg(null);
      } else {
        setData(null);
        setErrorMsg(
          json.error || `No QC record found for ${typeToFetch === "mobile" ? "IMEI" : "Service Key"}: "${clean}"`
        );
      }
    } catch (err: any) {
      setData(null);
      setErrorMsg(err.message || "Network error occurred while fetching certificate");
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceTypeChange = (type: "laptop" | "mobile") => {
    setDeviceType(type);
    setErrorMsg(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (!serviceKey) return;
    const url = `${window.location.origin}/gadgetiq/certificate?servicekey=${encodeURIComponent(serviceKey)}&type=${deviceType}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="cert-viewer-root min-h-screen bg-[#F4F6FB] py-6 px-3 sm:px-6 print:min-h-0 print:p-0 print:m-0 print:bg-white">
      <div className="cert-viewer-inner max-w-5xl mx-auto space-y-6 print:max-w-none print:w-full print:m-0 print:p-0 print:space-y-0">
        {/* Top Search & Lookup Banner (Hidden on Print) */}
        <div className="no-print bg-white rounded-2xl border border-[#DDE4F3] p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EEF2F6]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-[#17284D]">
                  XTRA<span className="text-[#0052CC]">COVER</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-[#0052CC]">
                  QC Audit Registry
                </span>
              </div>
              <p className="text-xs text-[#5F6A86] mt-1">
                Verify and download official 64-point Quality Assurance Certificates
              </p>
            </div>

            {/* Print & Download Options - Only Available if data is populated */}
            {data && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#F4F6FB] text-[#17284D] border border-[#DDE4F3] hover:bg-[#E9EEF9] transition-all cursor-pointer"
                  title="Copy Direct Link"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#5F6A86]" />
                  <span>{copied ? "Link Copied!" : "Share Link"}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#0052CC] text-white shadow-md hover:bg-[#003D99] transition-all cursor-pointer hover:shadow-lg"
                >
                  <Printer className="w-4 h-4 text-white" />
                  <span>Download / Print PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Toggle & Query Search Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            {/* Device Toggle (Laptop / Mobile) */}
            <div className="lg:col-span-4 bg-[#F4F6FB] p-1 rounded-xl border border-[#DDE4F3] flex items-center">
              <button
                type="button"
                onClick={() => handleDeviceTypeChange("laptop")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deviceType === "laptop"
                    ? "bg-white text-[#0052CC] shadow-xs border border-[#DDE4F3]"
                    : "text-[#5F6A86] hover:text-[#17284D]"
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>Laptop QC</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeviceTypeChange("mobile")}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  deviceType === "mobile"
                    ? "bg-white text-[#0052CC] shadow-xs border border-[#DDE4F3]"
                    : "text-[#5F6A86] hover:text-[#17284D]"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile QC</span>
              </button>
            </div>

            {/* Service Key Input & Submit */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchCertificate(serviceKey, deviceType);
              }}
              className="lg:col-span-8 flex items-center space-x-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={serviceKey}
                  onChange={(e) => setServiceKey(e.target.value)}
                  placeholder={
                    deviceType === "laptop"
                      ? "Enter Laptop Service Key (e.g. XCF9235895)"
                      : "Enter Mobile IMEI / Service Key (e.g. XC92C9E265)"
                  }
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-mono rounded-xl bg-white border border-[#DDE4F3] text-[#17284D] placeholder-[#8C98A9] focus:outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100"
                />
                <Search className="w-4 h-4 text-[#8C98A9] absolute left-3 top-3" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#17284D] text-white hover:bg-[#0052CC] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
              >
                {loading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{loading ? "Searching..." : "Lookup Certificate"}</span>
              </button>
            </form>
          </div>

          {/* Page Tabs - Only shown when Certificate Data is available */}
          {data && (
            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <div className="flex items-center bg-[#F4F6FB] p-1 rounded-lg border border-[#DDE4F3] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("all")}
                  className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                    activeTab === "all" ? "bg-white text-[#0052CC] shadow-xs" : "text-[#5F6A86]"
                  }`}
                >
                  All 4 Pages
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("page1")}
                  className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                    activeTab === "page1" ? "bg-white text-[#0052CC] shadow-xs" : "text-[#5F6A86]"
                  }`}
                >
                  Page 1
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("page2")}
                  className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                    activeTab === "page2" ? "bg-white text-[#0052CC] shadow-xs" : "text-[#5F6A86]"
                  }`}
                >
                  Page 2
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("page3")}
                  className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                    activeTab === "page3" ? "bg-white text-[#0052CC] shadow-xs" : "text-[#5F6A86]"
                  }`}
                >
                  Page 3
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("page4")}
                  className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                    activeTab === "page4" ? "bg-white text-[#0052CC] shadow-xs" : "text-[#5F6A86]"
                  }`}
                >
                  Page 4
                </button>
              </div>
            </div>
          )}
        </div>

        {/* State 1: Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl border border-[#DDE4F3] p-12 text-center shadow-sm space-y-4">
            <div className="w-10 h-10 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div>
              <h3 className="text-base font-bold text-[#17284D]">
                Connecting to Secure QC Audit Ledger...
              </h3>
              <p className="text-xs text-[#5F6A86] mt-1">
                Resolving 64 diagnostic checkpoints, battery health, and cryptographic signatures for{" "}
                <span className="font-mono font-bold text-[#0052CC]">{serviceKey}</span>
              </p>
            </div>
          </div>
        )}

        {/* State 2: Not Found / Error Screen */}
        {!loading && errorMsg && (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 sm:p-12 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center mx-auto text-rose-600">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-black text-[#17284D]">
                Certificate Record Not Found
              </h3>
              <p className="text-xs text-[#5F6A86] leading-relaxed">
                {errorMsg}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setServiceKey("");
                  setErrorMsg(null);
                  setHasSearched(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F4F6FB] text-[#17284D] border border-[#DDE4F3] hover:bg-[#E9EEF9] transition-all cursor-pointer"
              >
                Clear Search
              </button>
              <button
                type="button"
                onClick={() => fetchCertificate(serviceKey, deviceType)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0052CC] text-white hover:bg-[#003D99] transition-all cursor-pointer"
              >
                Retry Lookup
              </button>
            </div>
          </div>
        )}

        {/* State 3: Clean Empty Search Prompt (When user lands on page without query) */}
        {!loading && !data && !errorMsg && !hasSearched && (
          <div className="bg-white rounded-2xl border border-[#DDE4F3] p-10 sm:p-16 text-center shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-center mx-auto text-[#0052CC] shadow-xs">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="max-w-lg mx-auto space-y-2">
              <h3 className="text-xl font-black text-[#17284D] tracking-tight">
                Quality Assurance Certificate Registry
              </h3>
              <p className="text-xs text-[#5F6A86] leading-relaxed">
                Enter your device <strong>IMEI</strong> or <strong>Service Key</strong> above to query the diagnostic database. Once verified, the official 4-page certificate will load automatically with instant PDF download and print options.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2 text-left">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#EEF2F6] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#0052CC] block">1. Toggle Device</span>
                <p className="text-[11px] text-[#5F6A86]">Select Laptop or Mobile QC format.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#EEF2F6] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#0052CC] block">2. Input IMEI / Key</span>
                <p className="text-[11px] text-[#5F6A86]">Provide your device identifier.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#EEF2F6] space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">3. Download PDF</span>
                <p className="text-[11px] text-[#5F6A86]">Inspect & export 4-page sealed cert.</p>
              </div>
            </div>
          </div>
        )}

        {/* State 4: Certificate Rendered - Full 4-page Document */}
        {!loading && data && (
          <div className="cert-document-container flex flex-col items-center space-y-8 print:block print:space-y-0 print:w-full print:m-0 print:p-0">
            {(activeTab === "all" || activeTab === "page1") && <CertificatePage1 data={data} />}
            {(activeTab === "all" || activeTab === "page2") && <CertificatePage2 data={data} />}
            {(activeTab === "all" || activeTab === "page3") && <CertificatePage3 data={data} />}
            {(activeTab === "all" || activeTab === "page4") && <CertificatePage4 data={data} />}
          </div>
        )}
      </div>
    </div>
  );
}
