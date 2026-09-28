"use client";

import { Play } from "lucide-react";
import Button from "@/components/ui/Button";
import { DemoIcon, type IconKey } from "../icons";
import type { GradeInfo } from "../data";

export function EnterChip({ show, opacity, y, dash, n, label }: { show: boolean; opacity: number; y: string; dash: string; n: string; label: string }) {
  if (!show) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-3 z-[8] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-lg border border-[#DDE4F3] bg-white py-1.5 pl-2 pr-3 shadow-md"
      style={{ transform: `translate(-50%, ${y})`, opacity }}
    >
      <span className="relative grid h-6 w-6 shrink-0 place-items-center">
        <svg width={24} height={24} viewBox="0 0 24 24" className="absolute inset-0 -rotate-90">
          <circle cx="12" cy="12" r="10" fill="none" stroke="var(--surface-sunken)" strokeWidth="2" />
          <circle cx="12" cy="12" r="10" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeDasharray={dash} />
        </svg>
        <span className="font-mono text-[11px] font-semibold text-brand-primary">{n}</span>
      </span>
      <span className="text-[13px] font-semibold">{label}</span>
    </div>
  );
}

export function NextPill({ show, dash, label, onStayHere }: { show: boolean; dash: string; label: string; onStayHere: () => void }) {
  if (!show) return null;
  return (
    <div
      role="status"
      className="absolute bottom-4 left-1/2 z-[8] flex max-w-[calc(100%-24px)] -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-lg bg-[#17284D] py-1.5 pl-2.5 pr-1.5 text-white shadow-lg"
    >
      <svg width={22} height={22} viewBox="0 0 24 24" className="shrink-0 -rotate-90" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="2.5" />
        <circle cx="12" cy="12" r="9" fill="none" stroke="var(--brand-accent)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={dash} />
      </svg>
      <span className="overflow-hidden text-ellipsis text-[13px]">
        Next: <strong className="font-semibold">{label}</strong>
      </span>
      <button
        type="button"
        onClick={onStayHere}
        className="h-8 shrink-0 rounded-md border border-white/30 bg-transparent px-2.5 text-[13px] text-white hover:bg-white/10"
      >
        Stay here
      </button>
    </div>
  );
}

export function Toast({ text, icon, opacity }: { text: string; icon: IconKey; opacity: number }) {
  if (!text) return null;
  return (
    <div
      role="status"
      className="absolute bottom-3 right-3 z-30 flex items-center gap-2 rounded-lg bg-[#17284D] px-3.5 py-2.5 text-sm text-white shadow-lg"
      style={{ opacity }}
    >
      <DemoIcon icon={icon} size={18} className="text-brand-accent" />
      {text}
    </div>
  );
}

export function PlayOverlay({ show, onTogglePlay }: { show: boolean; onTogglePlay: () => void }) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 z-[6] grid place-items-center bg-[#F4F6FB]/70">
      <Button variant="primary" size="lg" onClick={onTogglePlay} icon={<Play size={18} fill="currentColor" />}>
        Play this step
      </Button>
    </div>
  );
}

export function FlightCard({
  show,
  x,
  y,
  scale,
  opacity,
  devName,
  grade,
  certId,
}: {
  show: boolean;
  x: string;
  y: string;
  scale: number;
  opacity: number;
  devName: string;
  grade: GradeInfo;
  certId: string;
}) {
  if (!show) return null;
  return (
    <div
      className="pointer-events-none absolute left-0 top-0 z-[5] flex w-80 origin-top-left flex-col gap-1.5 rounded-lg border border-brand-primary bg-white p-3.5 shadow-lg"
      style={{ transform: `translate(${x}, ${y}) scale(${scale})`, opacity }}
    >
      <div className="flex items-center gap-1.5 font-display font-bold text-brand-primary">
        <span className="text-[#17284D]">Gadget IQ Certificate</span>
      </div>
      <span className="text-sm">
        {devName} · Grade {grade.letter}
      </span>
      <span className="font-mono text-xs text-[#4A5875]">{certId}</span>
    </div>
  );
}
