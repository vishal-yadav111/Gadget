"use client";

import { ChevronDown, ChevronUp, MoreHorizontal, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { SummaryRows, type PinnedFail, type SummaryRow } from "./Sidebar";

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
    <div className="fixed inset-x-0 bottom-0 z-[900] border-t border-[#DDE4F3] bg-white shadow-lg [padding-bottom:env(safe-area-inset-bottom)]">
      {summaryOpen && (
        <div className="flex max-h-[40vh] flex-col gap-2.5 overflow-auto border-b border-[#DDE4F3] px-4 py-3">
          <SummaryRows pinnedFails={pinnedFails} summaryRows={summaryRows} />
        </div>
      )}
      <button
        type="button"
        onClick={toggleSummary}
        aria-expanded={summaryOpen}
        className="flex h-10 w-full items-center gap-2 border-b border-[#DDE4F3] bg-[#F4F6FB] px-4 text-[13px] font-medium text-[#17284D]"
      >
        <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">{dockSummary}</span>
        {summaryOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
      <div className="flex h-14 items-center justify-around px-3">
        <button type="button" onClick={onPrev} aria-label="Previous step" className="grid h-11 w-11 place-items-center rounded-lg text-[#17284D]">
          <SkipBack size={22} />
        </button>
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playLabel}
          className="grid h-12 w-12 place-items-center rounded-full bg-brand-primary text-white shadow-md"
        >
          {playing ? <Pause size={22} /> : <Play size={22} />}
        </button>
        <button type="button" onClick={onNext} aria-label="Next step" className="grid h-11 w-11 place-items-center rounded-lg text-[#17284D]">
          <SkipForward size={22} />
        </button>
        <button type="button" onClick={onOpenMore} aria-label="More options" aria-haspopup="dialog" className="grid h-11 w-11 place-items-center rounded-lg text-[#17284D]">
          <MoreHorizontal size={22} />
        </button>
      </div>
    </div>
  );
}
