"use client";

import { Ico } from "../icons";
import { SummaryRows, type PinnedFail, type SummaryRow } from "./Sidebar";

const dockBtn = "grid h-11 w-11 cursor-pointer place-items-center rounded-[var(--radius-md)] bg-transparent text-[var(--text-primary)]";

export function MobileDock({
  summaryOpen,
  toggleSummary,
  pinnedFails,
  summaryRows,
  dockSummary,
  playing,
  playLabel,
  onPrev,
  onTogglePlay,
  onNext,
  onOpenMore,
}: {
  summaryOpen: boolean;
  toggleSummary: () => void;
  pinnedFails: PinnedFail[];
  summaryRows: SummaryRow[];
  dockSummary: string;
  playing: boolean;
  playLabel: string;
  onPrev: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onOpenMore: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[900] border-t border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-lg)] [padding-bottom:env(safe-area-inset-bottom)]">
      {summaryOpen && (
        <div className="flex max-h-[40vh] flex-col gap-2.5 overflow-auto border-b border-[var(--border-subtle)] px-4 py-3">
          <SummaryRows compact pinnedFails={pinnedFails} summaryRows={summaryRows} />
        </div>
      )}
      <button
        type="button"
        onClick={toggleSummary}
        aria-expanded={summaryOpen}
        className="flex h-10 w-full cursor-pointer items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-page)] px-4 text-[13px] font-medium text-[var(--text-primary)]"
      >
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">{dockSummary}</span>
        <Ico name={summaryOpen ? "down" : "up"} />
      </button>
      <div className="flex h-14 items-center justify-around px-3">
        <button type="button" onClick={onPrev} aria-label="Previous step" className={dockBtn}>
          <Ico name="skipPrev" size={22} fill />
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playLabel}
          className="grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-[var(--brand-primary)] text-white shadow-[var(--shadow-md)]"
        >
          <Ico name={playing ? "pause" : "play"} size={22} fill />
        </button>
        <button type="button" onClick={onNext} aria-label="Next step" className={dockBtn}>
          <Ico name="skipNext" size={22} fill />
        </button>
        <button type="button" onClick={onOpenMore} aria-label="More options" aria-haspopup="dialog" className={dockBtn}>
          <Ico name="more" size={22} sw={3} />
        </button>
      </div>
    </div>
  );
}
