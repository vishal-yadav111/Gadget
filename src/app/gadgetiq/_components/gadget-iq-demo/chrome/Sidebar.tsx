"use client";

import { AlertTriangle } from "lucide-react";

export interface SummaryRow {
  k: string;
  v: string;
  sub?: string;
  subFont?: string;
  color?: string;
  font?: string;
  bar?: string;
}
export interface PinnedFail {
  testName: string;
  reason: string;
}

function SummaryRows({ pinnedFails, summaryRows }: { pinnedFails: PinnedFail[]; summaryRows: SummaryRow[] }) {
  return (
    <>
      {pinnedFails.map((f, i) => (
        <div key={i} className="flex items-start gap-2 rounded-md p-2.5 text-[13px] leading-snug" style={{ background: "rgba(199,48,10,.08)", color: "var(--status-danger)" }}>
          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            <strong>{f.testName} failed.</strong> {f.reason}
          </span>
        </div>
      ))}
      {summaryRows.map((r, i) => (
        <div key={i} className="flex flex-col gap-1 border-b border-[#DDE4F3] pb-3">
          <span className="text-xs text-[#4A5875]">{r.k}</span>
          <span className="text-[15px] font-semibold" style={{ fontFamily: r.font, color: r.color || "var(--text-primary)" }}>{r.v}</span>
          {!!r.sub && <span className="text-xs text-[#5F6A86]" style={{ fontFamily: r.subFont }}>{r.sub}</span>}
          {!!r.bar && (
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#E9EEF9]">
              <div className="h-full rounded-full bg-brand-primary" style={{ width: r.bar }} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export function LiveSummarySidebar({ pinnedFails, summaryRows }: { pinnedFails: PinnedFail[]; summaryRows: SummaryRow[] }) {
  return (
    <aside aria-label="Live summary" className="flex min-w-0 flex-1 basis-[250px] flex-col gap-3 rounded-xl border border-[#DDE4F3] bg-white p-4 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4A5875]">Live summary</span>
      <SummaryRows pinnedFails={pinnedFails} summaryRows={summaryRows} />
    </aside>
  );
}

export { SummaryRows };
