import React, { Suspense } from "react";
import { Metadata } from "next";
import { fetchQCCertificate } from "@/lib/qc-api/service";
import CertificateViewer from "./_components/CertificateViewer";
import "./certificate.css";

export const metadata: Metadata = {
  title: "Official Quality Assurance Certificate | XtraCover XC-QC",
  description: "Cryptographically verified 64-point diagnostic test record and refurbishment assurance certificate.",
};

interface PageProps {
  searchParams: Promise<{
    servicekey?: string;
    serviceKey?: string;
    imei?: string;
    serial?: string;
    type?: string;
  }>;
}

export default async function CertificatePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const rawKey =
    resolvedParams.servicekey ||
    resolvedParams.serviceKey ||
    resolvedParams.imei ||
    resolvedParams.serial;

  const rawType = resolvedParams.type?.toLowerCase();

  // Auto-detect type: If key starts with XC92 or user passed type=mobile
  let detectedType: "laptop" | "mobile" = "laptop";
  if (rawType === "mobile" || (rawKey && rawKey.startsWith("XC92"))) {
    detectedType = "mobile";
  } else if (rawType === "laptop" || (rawKey && rawKey.startsWith("XCF"))) {
    detectedType = "laptop";
  }

  // Only fetch if a key is explicitly provided in the URL; otherwise initialData is null
  let initialData = null;
  if (rawKey && rawKey.trim()) {
    initialData = await fetchQCCertificate(rawKey.trim(), detectedType);
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-[#17284D]">Connecting to Certificate Registry...</p>
          </div>
        </div>
      }
    >
      <CertificateViewer
        initialData={initialData}
        initialKey={rawKey || ""}
        initialType={detectedType}
      />
    </Suspense>
  );
}
