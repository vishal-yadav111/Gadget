"use client";

import { CreditCard, Disc3, Loader2, Network, Tv, Usb } from "lucide-react";
import Button from "@/components/ui/Button";
import type { SpotlightView } from "./spotlightLogic";

const PORT_ICON: Record<string, React.ElementType> = { USB: Usb, HDMI: Tv, VGA: Tv, Ethernet: Network, "SD card": CreditCard, "Disc drive": Disc3 };

export function Spotlight({
  sp,
  onPlayTone,
  onPadMove,
}: {
  sp: SpotlightView;
  onPlayTone: () => void;
  onPadMove: (e: React.PointerEvent<HTMLDivElement>) => void;
}) {
  if (sp.isDisplay) {
    return (
      <div className="flex w-full flex-col items-center gap-3">
        <div className="relative box-border w-full max-w-[340px] overflow-hidden rounded-lg border-[6px] border-[#17284D] bg-[#17284D]" style={{ aspectRatio: "16/10" }}>
          {sp.showSweep && (
            <>
              <div className="absolute inset-0 flex">
                {["#fff", "var(--brand-accent)", "var(--status-success)", "var(--brand-primary)", "var(--text-secondary)"].map((b, i) => (
                  <div key={i} className="flex-1" style={{ background: b }} />
                ))}
              </div>
              <div className="absolute inset-0 bg-black" style={{ opacity: sp.dim }} />
            </>
          )}
          {sp.showGrid && (
            <div className="absolute inset-0 grid gap-px" style={{ gridTemplateColumns: "repeat(12,1fr)", gridTemplateRows: "repeat(7,1fr)" }}>
              {sp.cells!.map((c, i) => (
                <div key={i} style={{ background: c }} />
              ))}
            </div>
          )}
        </div>
        <span className="text-[13px] text-[#4A5875]">{sp.displayNote}</span>
      </div>
    );
  }

  if (sp.isAudio) {
    return (
      <div className="flex w-full max-w-[360px] flex-col items-center gap-3.5">
        <div className="flex w-full justify-between text-[13px] font-semibold">
          <span style={{ color: sp.lColor }}>Left speaker</span>
          <span style={{ color: sp.rColor }}>Right speaker</span>
        </div>
        <div className="flex h-[100px] w-full items-center gap-[3px]">
          {sp.bars!.map((b, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{ height: b.h, background: b.bg }} />
          ))}
        </div>
        {!!sp.audioNote && <span className="text-[13px] font-semibold text-brand-critical">{sp.audioNote}</span>}
        <Button variant="secondary" size="sm" onClick={onPlayTone}>Tap to hear</Button>
        <span className="text-xs text-[#5F6A86]">Sound stays off until you tap.</span>
      </div>
    );
  }

  if (sp.isBattery) {
    return (
      <div className="flex w-full max-w-[360px] flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-5xl font-bold leading-none tracking-tight" style={{ color: sp.batColor }}>{sp.batVal}</span>
          <span className="text-sm text-[#4A5875]">battery health</span>
        </div>
        <div className="relative h-5 rounded border border-[#DDE4F3] bg-[#E9EEF9]">
          <div className="h-full rounded-[3px]" style={{ width: sp.batFill, background: sp.batColor }} />
          <div className="absolute -top-2 -bottom-2 w-0.5 bg-[#17284D]" style={{ left: sp.limitLeft }} />
          <span className="absolute top-7 -translate-x-1/2 whitespace-nowrap text-xs font-semibold" style={{ left: sp.limitLeft }}>Limit {sp.limitLabel}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#4A5875]">
          <span>Charge cycles <strong className="font-mono text-[#17284D]">{sp.cycles}</strong></span>
          <span>Charging <strong className="text-[#17284D]">{sp.charging}</strong></span>
        </div>
      </div>
    );
  }

  if (sp.isKeyboard) {
    return (
      <div className="flex w-full max-w-[420px] flex-col gap-3">
        {sp.kbPrompt && (
          <div className="flex items-center justify-between gap-2 rounded-md border border-brand-primary bg-white px-3 py-2">
            <span className="text-sm font-semibold">Press any 5 keys on your keyboard</span>
            <span className="font-mono text-[13px] text-brand-primary">{sp.kbCount} of 5</span>
          </div>
        )}
        <div className="flex flex-col gap-1 rounded-lg bg-[#17284D] p-2.5">
          {sp.kbRows!.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.keys.map((k) => (
                <button
                  key={k.label}
                  type="button"
                  aria-label={`${k.label} key`}
                  aria-pressed={k.pressed}
                  disabled={k.disabled}
                  onClick={k.press}
                  className="grid h-[26px] place-items-center rounded font-mono text-[10px] transition-colors"
                  style={{ flex: k.flex, background: k.bg, color: k.fg, cursor: k.cursor }}
                >
                  {k.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        {!!sp.kbNote && <span className="text-[13px] font-semibold text-brand-critical">{sp.kbNote}</span>}
      </div>
    );
  }

  if (sp.isTouchpad) {
    return (
      <div className="flex w-full max-w-[340px] flex-col items-center gap-3">
        <span className="text-sm font-semibold">{sp.padPrompt}</span>
        <div
          onPointerMove={onPadMove}
          onPointerDown={onPadMove}
          className="relative w-full touch-none rounded-lg border bg-[#E9EEF9]"
          style={{ aspectRatio: "16/10", borderColor: sp.padBorder, cursor: "crosshair" }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <ellipse cx="50" cy="50" rx="30" ry="34" fill="none" stroke="var(--border-default)" strokeWidth="1.5" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <polyline points={sp.padPts} fill="none" stroke="var(--brand-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {sp.padDone && (
            <div className="absolute right-2 top-2 flex items-center gap-1 text-[13px] font-semibold text-brand-success">Circle done</div>
          )}
        </div>
      </div>
    );
  }

  if (sp.isPorts) {
    return (
      <div className="flex w-full max-w-[440px] flex-col gap-3">
        <div className="h-4 rounded-t-lg rounded-b-2xl bg-[#C3CEE6]" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-2">
          {sp.ports!.map((p) => {
            const Icon = PORT_ICON[p.name] || Usb;
            return (
              <div key={p.name} className="flex flex-col items-center gap-1.5 rounded-md border bg-white px-1.5 py-2.5" style={{ borderColor: p.color, color: p.color }}>
                <Icon size={22} />
                <span className="text-[13px] font-semibold text-[#17284D]">{p.name}</span>
                <span className="text-xs">{p.state}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (sp.isWireless) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-end justify-center gap-8">
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex h-[72px] items-end gap-1.5">
              {sp.signal!.map((b, i) => (
                <div key={i} className="w-4 rounded" style={{ height: b.h, background: b.bg }} />
              ))}
            </div>
            <span className="text-xs font-semibold" style={{ color: sp.signalColor }}>{sp.signalLabel}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-4xl font-bold leading-none tracking-tight">
              {sp.speed}
              <span className="font-sans text-base font-medium text-[#4A5875]"> Mbps</span>
            </span>
            <span className="text-[13px] text-[#4A5875]">Wi-Fi speed · Bluetooth: {sp.bt}</span>
          </div>
        </div>
        {!!sp.wifiNote && <span className="text-[13px] font-semibold text-brand-critical">{sp.wifiNote}</span>}
      </div>
    );
  }

  if (sp.isCamera) {
    return (
      <div className="flex w-full max-w-[340px] flex-col gap-3">
        <div className="relative grid place-items-center rounded-lg bg-[#17284D] text-white/45" style={{ aspectRatio: "16/10" }}>
          {sp.camPic && (
            <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 4a4 4 0 1 1 0 8a4 4 0 1 1 0-8zM4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6" />
            </svg>
          )}
          {sp.camNoPic && <span className="text-sm font-semibold text-white">No picture</span>}
          <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 text-xs text-white">
            <span className="h-2 w-2 rounded-full bg-brand-accent" style={{ opacity: sp.recO }} /> Camera on
          </span>
          <div className="absolute inset-[18%] rounded border-2 border-white/35" />
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[#4A5875]">
          <span className="min-w-[74px]">{sp.camLabel}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#E9EEF9]">
            <div className="h-full bg-brand-success" style={{ width: sp.mic }} />
          </div>
        </div>
      </div>
    );
  }

  if (sp.isPerformance) {
    return (
      <div className="flex w-full max-w-[360px] flex-col gap-4">
        {sp.meters!.map((m) => (
          <div key={m.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#4A5875]">{m.label}</span>
              <span className="font-mono font-semibold">{m.value}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded bg-[#E9EEF9]">
              <div className="h-full" style={{ width: m.w, background: m.bg }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sp.isSystem) {
    return (
      <div className="flex w-full max-w-[400px] flex-col gap-2">
        {sp.sys!.map((y) => (
          <div key={y.label} className="flex items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2.5" style={{ borderColor: y.border }}>
            <span className="text-sm font-medium">{y.label}</span>
            <span className="text-[13px] font-semibold" style={{ color: y.color }}>{y.state}</span>
          </div>
        ))}
      </div>
    );
  }

  if (sp.isStorage) {
    return (
      <div className="grid w-full max-w-[440px] grid-cols-3 gap-2.5">
        {sp.drive!.map((m) => (
          <div key={m.label} className="flex min-w-0 flex-col gap-1 rounded-lg border border-[#DDE4F3] bg-white p-3">
            <span className="text-xs text-[#4A5875]">{m.label}</span>
            <span className="whitespace-nowrap font-display text-[22px] font-bold tracking-tight">{m.value}</span>
            <span className="text-xs text-[#5F6A86]">{m.unit}</span>
          </div>
        ))}
      </div>
    );
  }

  return <Loader2 className="animate-spin text-brand-primary" />;
}
