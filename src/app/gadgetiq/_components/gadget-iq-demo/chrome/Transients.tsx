"use client";

import { Button } from "../ui";
import { DemoIcon, Ico, type IconKey } from "../icons";
import type { GradeInfo } from "../data";

export function EnterChip({ show, opacity, y, dash, n, label }: { show: boolean; opacity: number; y: string; dash: string; n: string; label: string }) {
  if (!show) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-3 z-[8] flex items-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] py-1.5 pl-2 pr-3 shadow-[var(--shadow-md)]"
      style={{ transform: `translate(-50%, ${y})`, opacity }}
    >
      <span className="relative grid h-6 w-6 flex-none place-items-center">
        <svg width={24} height={24} viewBox="0 0 24 24" className="absolute inset-0 -rotate-90">
          <circle cx="12" cy="12" r="10" fill="none" stroke="var(--surface-sunken)" strokeWidth="2" />
          <circle cx="12" cy="12" r="10" fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeDasharray={dash} />
        </svg>
        <span className="font-mono text-[11px] font-semibold text-[var(--brand-primary)]">{n}</span>
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
      className="absolute bottom-4 left-1/2 z-[8] box-border flex max-w-[calc(100%-24px)] -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-[var(--radius-md)] bg-[var(--surface-inverse)] py-1.5 pl-2.5 pr-1.5 text-white shadow-[var(--shadow-lg)]"
    >
      <svg width={22} height={22} viewBox="0 0 24 24" className="flex-none -rotate-90" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="2.5" />
        <circle cx="12" cy="12" r="9" fill="none" stroke="var(--brand-accent)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={dash} />
      </svg>
      <span className="overflow-hidden text-ellipsis text-[13px]">
        Next: <strong className="font-semibold">{label}</strong>
      </span>
      <button
        type="button"
        onClick={onStayHere}
        className="h-8 flex-none cursor-pointer rounded-[var(--radius-sm)] border border-white/30 bg-transparent px-2.5 text-[13px] text-white hover:bg-white/[.12]"
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
      className="absolute bottom-3 right-3 z-30 flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--surface-inverse)] px-3.5 py-2.5 text-sm text-white shadow-[var(--shadow-lg)]"
      style={{ opacity }}
    >
      <DemoIcon icon={icon} size={18} className="text-[var(--brand-accent)]" />
      {text}
    </div>
  );
}

export function PlayOverlay({ show, onTogglePlay }: { show: boolean; onTogglePlay: () => void }) {
  if (!show) return null;
  return (
    <div className="absolute inset-0 z-[6] grid place-items-center bg-[rgba(244,246,251,.7)]">
      <Button variant="primary" size="lg" onClick={onTogglePlay} icon={<Ico name="play" size={18} fill />}>
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
      className="pointer-events-none absolute left-0 top-0 z-[5] flex w-80 origin-top-left flex-col gap-1.5 rounded-[var(--radius-md)] border border-[var(--brand-primary)] bg-[var(--surface-card)] px-4 py-3.5 shadow-[var(--shadow-lg)]"
      style={{ transform: `translate(${x}, ${y}) scale(${scale})`, opacity }}
    >
      <div className="flex items-center gap-1.5 font-display font-bold text-[var(--brand-primary)]">
        <Ico name="shield" size={18} />
        <span className="text-[var(--text-primary)]">Gadget IQ Certificate</span>
      </div>
      <span className="text-sm">
        {devName} · Grade {grade.letter}
      </span>
      <span className="font-mono text-xs text-[var(--text-secondary)]">{certId}</span>
    </div>
  );
}
