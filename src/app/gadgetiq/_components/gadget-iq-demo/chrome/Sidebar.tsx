"use client";

import { Ico } from "../icons";

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

/** `compact` is the phone dock's condensed list; the default is the desktop sidebar card. */
function SummaryRows({ pinnedFails, summaryRows, compact = false }: { pinnedFails: PinnedFail[]; summaryRows: SummaryRow[]; compact?: boolean }) {
  if (compact) {
    return (
      <>
        {pinnedFails.map((f, i) => (
          <div key={i} className="text-[13px] text-[var(--status-danger)]">
            <strong>{f.testName} failed.</strong> {f.reason}
          </div>
        ))}
        {summaryRows.map((r, i) => (
          <div key={i} className="flex justify-between gap-3 text-[13px]">
            <span className="text-[var(--text-secondary)]">{r.k}</span>
            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-right font-semibold" style={{ fontFamily: r.font, color: r.color || "var(--text-primary)" }}>{r.v}</span>
          </div>
        ))}
      </>
    );
  }
  return (
    <>
      {pinnedFails.map((f, i) => (
        <div key={i} className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-[rgba(199,48,10,.08)] p-2.5 text-[13px] leading-[1.45] text-[var(--status-danger)]">
          <Ico name="warn" className="mt-0.5 flex-none" />
          <span>
            <strong>{f.testName} failed.</strong> {f.reason}
          </span>
        </div>
      ))}
      {summaryRows.map((r, i) => (
        <div key={i} className="flex flex-col gap-1 border-b border-[var(--border-subtle)] pb-3">
          <span className="text-xs text-[var(--text-secondary)]">{r.k}</span>
          <span className="text-[15px] font-semibold" style={{ fontFamily: r.font, color: r.color || "var(--text-primary)" }}>{r.v}</span>
          {!!r.sub && <span className="text-xs text-[var(--text-tertiary)]" style={{ fontFamily: r.subFont }}>{r.sub}</span>}
          {!!r.bar && (
            <div className="mt-1 h-1 overflow-hidden rounded-[2px] bg-[var(--surface-sunken)]">
              <div className="h-full bg-[var(--brand-primary)]" style={{ width: r.bar }} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}

export function LiveSummarySidebar({ pinnedFails, summaryRows }: { pinnedFails: PinnedFail[]; summaryRows: SummaryRow[] }) {
  return (
    <aside aria-label="Live summary" className="flex min-w-0 flex-1 basis-[284px] flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-sm)]">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">Live summary</span>
      <SummaryRows pinnedFails={pinnedFails} summaryRows={summaryRows} />
    </aside>
  );
}

export { SummaryRows };
