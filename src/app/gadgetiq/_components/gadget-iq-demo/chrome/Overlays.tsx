"use client";

import { X, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Segmented } from "../ui";
import type { Mode } from "../types";

export interface LicenceRow {
  name: string;
  left: number;
  usedToday: number;
  use: string;
}

export function LicenceWalletPopover({
  dialogRef,
  rows,
  rule,
  onTopup,
  onClose,
}: {
  dialogRef: React.RefObject<HTMLDivElement | null>;
  rows: LicenceRow[];
  rule: string;
  onTopup: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div onClick={onClose} className="absolute inset-0 z-20" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-label="Licence wallet"
        className="absolute right-3 top-2 z-[21] flex w-[280px] max-w-[calc(100%-24px)] flex-col gap-2.5 rounded-lg border border-[#DDE4F3] bg-white p-4 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold">Licence wallet</span>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-md text-[#4A5875]">
            <X size={18} />
          </button>
        </div>
        <span className="text-sm leading-relaxed text-[#4A5875]">{rule}</span>
        {rows.map((l) => (
          <div key={l.name} className="flex justify-between gap-2 text-sm">
            <span>{l.name}</span>
            <strong className="font-mono">{l.left} left</strong>
          </div>
        ))}
        <Button variant="secondary" size="sm" onClick={onTopup} icon={<Plus size={16} />}>
          Top up
        </Button>
      </div>
    </>
  );
}

export interface TopupPack {
  licences: number;
  price: string;
}
export interface TopupGroup {
  name: string;
  left: number;
  packs: TopupPack[];
}

export function TopupModal({
  dialogRef,
  groups,
  onChoose,
  onClose,
}: {
  dialogRef: React.RefObject<HTMLDivElement | null>;
  groups: TopupGroup[];
  onChoose: () => void;
  onClose: () => void;
}) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-[1000] grid place-items-center bg-[#0B1220]/52 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Top up licences"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-[440px] flex-col gap-3.5 overflow-auto rounded-xl bg-white p-6 shadow-lg"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-display text-xl font-bold">Top up licences</span>
            <Badge tone="neutral">Sample prices</Badge>
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-md text-[#4A5875]">
            <X size={20} />
          </button>
        </div>
        {groups.map((g) => (
          <div key={g.name} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold">{g.name}</span>
              <span className="text-xs text-[#4A5875]">{g.left} left</span>
            </div>
            {g.packs.map((p) => (
              <div key={p.licences} className="flex items-center justify-between gap-3 rounded-lg border border-[#DDE4F3] py-2 pl-3.5 pr-2">
                <span className="text-sm">{p.licences} licences</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-semibold">{p.price}</span>
                  <Button variant="secondary" size="sm" onClick={onChoose}>Choose</Button>
                </div>
              </div>
            ))}
          </div>
        ))}
        <span className="text-xs text-[#5F6A86]">No payment is taken in this demo.</span>
      </div>
    </div>
  );
}

export interface ZoomView {
  title: string;
  imgBg: string;
  marks: { d: string; stroke: string; sw: number; fill: string; o: number }[];
  x: string;
  y: string;
  w: string;
  h: string;
  color: string;
  origin: string;
  text: string;
  conf: string;
}

export function ZoomModal({
  dialogRef,
  zoom,
  narrow,
  onClose,
}: {
  dialogRef: React.RefObject<HTMLDivElement | null>;
  zoom: ZoomView;
  narrow: boolean;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex justify-center bg-[#0B1220]/52 backdrop-blur-sm"
      style={{ alignItems: narrow ? "flex-end" : "center", padding: narrow ? 0 : 16 }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Close-up of the mark"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-[540px] flex-col gap-3 bg-white p-5 shadow-lg"
        style={{ borderRadius: narrow ? "12px 12px 0 0" : "12px" }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-lg font-bold">{zoom.title}</span>
          <button onClick={onClose} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-md text-[#4A5875]">
            <X size={20} />
          </button>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#E9EEF9]">
          <div className="absolute inset-0" style={{ transform: "scale(2.4)", transformOrigin: zoom.origin }}>
            <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: zoom.imgBg }} />
            <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
              {zoom.marks.map((m, i) => (
                <path key={i} d={m.d} stroke={m.stroke} strokeWidth={m.sw} fill={m.fill} opacity={m.o} strokeLinecap="round" strokeLinejoin="round" />
              ))}
            </svg>
            <div className="absolute rounded-sm outline outline-1 outline-offset-2" style={{ left: zoom.x, top: zoom.y, width: zoom.w, height: zoom.h, outlineColor: zoom.color }} />
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 text-sm">
          <span className="text-[#4A5875]">{zoom.text}</span>
          <strong className="font-mono">{zoom.conf}</strong>
        </div>
      </div>
    </div>
  );
}

export interface DrawerField {
  k: string;
  v: string;
  font?: string;
}
export interface DrawerView {
  model: string;
  grade: string;
  gradeColor: string;
  certId: string;
  fields: DrawerField[];
}

export function DeviceDrawer({ dialogRef, drawer, onClose }: { dialogRef: React.RefObject<HTMLDivElement | null>; drawer: DrawerView; onClose: () => void }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-[1000] bg-[#0B1220]/52 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Device certificate"
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-y-0 right-0 flex w-[380px] max-w-full flex-col gap-4 overflow-auto bg-white p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-bold">Certificate</span>
          <button onClick={onClose} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-md text-[#4A5875]">
            <X size={20} />
          </button>
        </div>
        <div className="flex items-center gap-4 rounded-lg border border-[#DDE4F3] p-4">
          <span className="font-display text-5xl font-extrabold leading-none" style={{ color: drawer.gradeColor }}>{drawer.grade}</span>
          <div className="flex min-w-0 flex-col">
            <span className="font-semibold">{drawer.model}</span>
            <span className="font-mono text-xs text-[#4A5875]">{drawer.certId}</span>
          </div>
        </div>
        <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-3 gap-y-2.5 text-sm">
          {drawer.fields.map((f) => (
            <div className="contents" key={f.k}>
              <span className="text-[#4A5875]">{f.k}</span>
              <span className="font-medium" style={{ fontFamily: f.font }}>{f.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function MoreOptionsSheet({
  dialogRef,
  mode,
  setMode,
  speedVal,
  setSpeed,
  onRestartClose,
  onClose,
}: {
  dialogRef: React.RefObject<HTMLDivElement | null>;
  mode: Mode;
  setMode: (v: Mode) => void;
  speedVal: "1x" | "2x";
  setSpeed: (v: "1x" | "2x") => void;
  onRestartClose: () => void;
  onClose: () => void;
}) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-[1000] flex items-end bg-[#0B1220]/52 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Demo options"
        onClick={(e) => e.stopPropagation()}
        className="flex w-full flex-col gap-4 rounded-t-xl bg-white p-4 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-lg"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold">Demo options</span>
          <button onClick={onClose} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-md text-[#4A5875]">
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-[#4A5875]">Mode</span>
          <Segmented options={[{ value: "watch" as Mode, label: "Watch it run" }, { value: "try" as Mode, label: "Try it yourself" }]} value={mode} onChange={setMode} ariaLabel="Demo mode" full />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-[#4A5875]">Speed</span>
          <Segmented options={["1x", "2x"] as const} value={speedVal} onChange={setSpeed} ariaLabel="Speed" full />
        </div>
        <Button variant="secondary" full onClick={onRestartClose}>Restart</Button>
      </div>
    </div>
  );
}
