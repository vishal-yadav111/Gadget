"use client";

import React, { useState } from "react";
import ReportListTable from "./_components/ReportListTable";
import CertificateView from "./_components/CertificateView";
import { initialCertificates, CertificateReport } from "./_lib/reports-data";
import { Award, ShieldCheck, FileCheck2 } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function ReportsPage() {
  const [certificates, setCertificates] = useState<CertificateReport[]>(initialCertificates);
  const [selectedCert, setSelectedCert] = useState<CertificateReport>(initialCertificates[0]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE4F3] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-[#17284D] tracking-tight">
            Audit Reports & Quality Certificates
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6A86] mt-0.5">
            Cryptographically sealed diagnostic certificates with 12-month XtraCover warranty stamps
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge tone="success" dot size="md">
            SHA-256 Ledger Active
          </Badge>
        </div>
      </div>

      {/* Two Column Layout: Certificate Viewer & Table */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Certificate Display (7 cols) */}
        <div className="xl:col-span-7">
          <CertificateView certificate={selectedCert} />
        </div>

        {/* Certificate Registry Table (5 cols) */}
        <div className="xl:col-span-5 space-y-4">
          <ReportListTable
            certificates={certificates}
            selectedCertificate={selectedCert}
            onSelectCertificate={setSelectedCert}
          />
        </div>
      </div>
    </div>
  );
}
