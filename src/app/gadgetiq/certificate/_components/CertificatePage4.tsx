import React from "react";
import {
  ShieldCheck,
  Shield,
  Leaf,
  Recycle,
} from "lucide-react";
import { QCCertificateData } from "@/lib/qc-api/types";

interface Props {
  data: QCCertificateData;
}

export default function CertificatePage4({ data }: Props) {
  const sanitisation = data.dataSanitisation;
  const warranty = data.warranty;
  const refurb = data.refurbRecord;

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
                const fallback = document.getElementById("giq-fallback-logo-gen4");
                if (fallback) fallback.style.display = "inline";
              }}
            />
            <span id="giq-fallback-logo-gen4" className="hidden text-base font-black tracking-tight text-[#17284D]">
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
            Compliance, warranty & chain of custody
          </h2>
        </div>

        {/* 2 Top Cards: Data Sanitisation & Warranty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {/* Data Sanitisation */}
          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#EEF2F6]">
              <div className="flex items-center space-x-1.5 text-[#0052CC]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <strong className="text-[11px] text-[#17284D]">Data sanitisation</strong>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                ✓ PASS
              </span>
            </div>
            <div className="space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Method</span>
                <span className="text-[#17284D] font-bold">{sanitisation.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Tool</span>
                <span className="text-[#17284D] font-medium">{sanitisation.tool}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Technique</span>
                <span className="text-[#17284D] font-medium">{sanitisation.technique}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Verification</span>
                <span className="text-[#17284D] font-medium">{sanitisation.verification}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Certificate ID</span>
                <span className="font-mono text-[#0052CC] font-bold">{sanitisation.certificateId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Completed</span>
                <span className="text-[#17284D] font-medium">{sanitisation.completedAt}</span>
              </div>
            </div>
          </div>

          {/* Warranty */}
          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center justify-between pb-1 border-b border-[#EEF2F6]">
              <div className="flex items-center space-x-1.5 text-[#0052CC]">
                <Shield className="w-3.5 h-3.5" />
                <strong className="text-[11px] text-[#17284D]">Warranty</strong>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                ✓ PASS
              </span>
            </div>
            <div className="space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Term</span>
                <span className="text-[#17284D] font-bold">{warranty.term}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Start date</span>
                <span className="text-[#17284D] font-medium">{warranty.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Expiry date</span>
                <span className="text-[#17284D] font-bold text-emerald-700">{warranty.expiryDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Covers</span>
                <span className="text-[#17284D] font-medium">{warranty.covers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Excludes</span>
                <span className="text-[#17284D] font-medium">{warranty.excludes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Claims</span>
                <span className="text-[#0052CC] font-medium underline">{warranty.claimsUrl}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Refurbishment Record */}
        <div className="mb-3 p-3 rounded-xl bg-white border border-[#DDE4F3] text-xs">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-1.5">
            Refurbishment Record
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
            <div className="flex justify-between py-0.5 border-b border-[#EEF2F6]">
              <span className="text-[#5F6A86]">Internal QC ID</span>
              <span className="font-mono text-[#17284D] font-bold">{refurb.internalQcId}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-[#EEF2F6]">
              <span className="text-[#5F6A86]">Refurbishment centre</span>
              <span className="text-[#17284D] font-medium">{refurb.facility}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-[#EEF2F6]">
              <span className="text-[#5F6A86]">Intake date</span>
              <span className="text-[#17284D] font-medium">{refurb.intakeDate}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-[#EEF2F6]">
              <span className="text-[#5F6A86]">Release date</span>
              <span className="text-[#17284D] font-medium">{refurb.releaseDate}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-[#EEF2F6]">
              <span className="text-[#5F6A86]">Parts replaced</span>
              <span className="text-[#17284D] font-medium">{refurb.partsReplaced}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-[#EEF2F6]">
              <span className="text-[#5F6A86]">Prior repair history</span>
              <span className="text-[#17284D] font-medium">{refurb.priorRepairHistory}</span>
            </div>
          </div>
          <div className="mt-1.5 pt-1.5 border-t border-[#EEF2F6] flex items-baseline justify-between text-[10px]">
            <span className="text-[#5F6A86] font-medium shrink-0 mr-2">Work performed:</span>
            <span className="text-[#17284D] font-semibold text-right">{refurb.workPerformed}</span>
          </div>
        </div>

        {/* Chain of Custody Table */}
        <div className="mb-3 p-3 rounded-xl bg-white border border-[#DDE4F3] text-xs">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-1.5">
            Chain of Custody
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b border-[#DDE4F3] text-[8.5px] uppercase font-bold text-[#5F6A86]">
                  <th className="pb-1">Timestamp</th>
                  <th className="pb-1">Stage</th>
                  <th className="pb-1">Location</th>
                  <th className="pb-1 text-right">Operator ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF2F6]">
                {data.chainOfCustody.map((log, idx) => (
                  <tr key={idx} className="py-1">
                    <td className="py-1 font-mono text-[#5F6A86] text-[9.5px]">{log.timestamp}</td>
                    <td className="py-1 font-bold text-[#17284D]">{log.stage}</td>
                    <td className="py-1 text-[#5F6A86]">{log.location}</td>
                    <td className="py-1 font-mono text-right text-[#0052CC] font-bold">{log.operatorId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Auditor Notes & Exceptions */}
        <div className="mb-3 p-2.5 rounded-xl bg-[#F8FAFC] border-l-4 border-[#0052CC] border-t border-r border-b border-[#DDE4F3] text-xs">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#17284D] block mb-0.5">
            Auditor Notes & Exceptions
          </span>
          <p className="font-bold text-[#17284D] text-[10px] mb-0.5">
            No exceptions recorded.
          </p>
          <p className="text-[9.5px] text-[#5F6A86] leading-tight">
            {data.auditorNotes}
          </p>
        </div>

        {/* Regulatory & Environmental Compliance (3 Cards) */}
        <div className="mb-3">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-1.5">
            Regulatory & Environmental Compliance
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {/* Card 1 */}
            <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] space-y-0.5">
              <div className="flex items-center space-x-1.5 text-[#0052CC]">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[8.5px] uppercase font-bold text-[#5F6A86]">Standard</span>
              </div>
              <strong className="text-[#17284D] text-[11px] block">R2v3 aligned</strong>
              <p className="text-[9px] text-[#5F6A86] leading-tight">
                Facility operates to R2v3 Appendix C.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] space-y-0.5">
              <div className="flex items-center space-x-1.5 text-[#0052CC]">
                <Recycle className="w-3 h-3" />
                <span className="text-[8.5px] uppercase font-bold text-[#5F6A86]">WEEE / EPR</span>
              </div>
              <strong className="text-[#17284D] text-[11px] block">Registered producer</strong>
              <p className="text-[9px] text-[#5F6A86] leading-tight">
                IN-EPR-2024-88213 compliant.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] space-y-0.5">
              <div className="flex items-center space-x-1.5 text-emerald-700">
                <Leaf className="w-3 h-3" />
                <span className="text-[8.5px] uppercase font-bold text-[#5F6A86]">Environmental Saving</span>
              </div>
              <strong className="text-emerald-700 text-[11px] block">≈ {data.environmentalSaving.co2eAvoidedKg} kg CO2e</strong>
              <p className="text-[9px] text-[#5F6A86] leading-tight">
                Avoided versus new manufacturing.
              </p>
            </div>
          </div>
        </div>

        {/* Document Control & Authenticity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] space-y-0.5 text-[9.5px]">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#17284D] block mb-0.5">
              Document Control
            </span>
            <div className="flex justify-between">
              <span className="text-[#5F6A86]">Revision / Standard</span>
              <span className="font-bold text-[#17284D]">{data.documentControl.revision} · {data.documentControl.standard}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F6A86]">Issued Date</span>
              <span className="text-[#17284D]">{data.documentControl.issuedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5F6A86]">Calibration set</span>
              <span className="font-mono text-[#17284D]">{data.documentControl.calibrationSet}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] space-y-0.5 text-[9px] text-[#5F6A86]">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#17284D] block mb-0.5">
              Authenticity
            </span>
            <p className="leading-tight text-[8.5px]">
              Scan QR on page 1, or enter certificate number at xtracover.com/verify to confirm authenticity.
            </p>
            <div className="pt-0.5">
              <span className="font-bold text-[#17284D] block text-[8px]">SIGNATURE (SHA-256)</span>
              <span className="font-mono text-[8px] text-[#0052CC] block font-bold mt-0.5">
                {data.digitalSignatureHash}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Page 4 Footer */}
      <div className="mt-3 pt-2 border-t border-[#EEF2F6] flex items-center justify-between text-[8px] text-[#8C98A9]">
        <span>
          XtraCover Technologies Pvt Ltd · Facility IN-DEL-04, New Delhi · CIN U72900DL2019PTC356104 · support@xtracover.com
        </span>
        <span>
          Certificate {data.certificateNumber} · Page 4 of 4 · Verify at xtracover.com/verify
        </span>
      </div>
    </div>
  );
}
