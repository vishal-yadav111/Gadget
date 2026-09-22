"use client";

import React from "react";
import {
  FileCheck2,
  Award,
  Download,
  Eye,
  CheckCircle2,
  QrCode,
  Printer,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { CertificateReport } from "../_lib/reports-data";

interface ReportListTableProps {
  certificates: CertificateReport[];
  selectedCertificate: CertificateReport;
  onSelectCertificate: (cert: CertificateReport) => void;
}

export default function ReportListTable({
  certificates,
  selectedCertificate,
  onSelectCertificate,
}: ReportListTableProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="p-4 border-b border-[#DDE4F3] bg-slate-50/50 flex items-center justify-between">
        <div>
          <h3 className="font-bold font-display text-sm text-[#17284D]">
            Official Certificate Records
          </h3>
          <p className="text-xs text-[#5F6A86] mt-0.5">
            Select a certificate to inspect full audit details
          </p>
        </div>
        <Badge tone="brand" size="sm">
          {certificates.length} Issued Records
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F4F6FB] border-b border-[#DDE4F3] text-[11px] font-bold text-[#5F6A86] uppercase tracking-wider">
              <th className="py-3 px-4">Certificate ID</th>
              <th className="py-3 px-4">Device Unit</th>
              <th className="py-3 px-4">Grade & Score</th>
              <th className="py-3 px-4">Battery Health</th>
              <th className="py-3 px-4">Auditor</th>
              <th className="py-3 px-4">Issue Date</th>
              <th className="py-3 px-4 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE4F3] text-xs font-sans">
            {certificates.map((cert) => {
              const isSelected = selectedCertificate.id === cert.id;
              return (
                <tr
                  key={cert.id}
                  onClick={() => onSelectCertificate(cert)}
                  className={`transition-colors cursor-pointer ${
                    isSelected ? "bg-blue-50/70" : "hover:bg-[#F4F6FB]"
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#0052CC]">
                    {cert.certificateNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#17284D]">
                    {cert.deviceModel}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1.5">
                      <Badge tone="success" size="sm">
                        {cert.grade}
                      </Badge>
                      <span className="font-mono font-bold text-xs">
                        {cert.healthScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-bold">
                    {cert.batteryHealth}%
                  </td>
                  <td className="py-3 px-4 text-[#5F6A86]">
                    {cert.auditorName}
                  </td>
                  <td className="py-3 px-4 text-[#5F6A86]">
                    {cert.issuedAt}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCertificate(cert);
                      }}
                      className="p-1.5 rounded-lg text-[#0052CC] hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
