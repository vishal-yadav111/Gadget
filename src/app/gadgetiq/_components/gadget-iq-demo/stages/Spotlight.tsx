"use client";

import { Button } from "../ui";
import { Ico } from "../icons";
import type { SpotlightView } from "./spotlightLogic";

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
        <div className="relative box-border aspect-[16/10] w-full max-w-[340px] overflow-hidden rounded-[var(--radius-md)] border-[6px] border-[var(--surface-inverse)] bg-[var(--surface-inverse)]">
          {sp.showSweep && (
            <>
              <div className="absolute inset-0 flex" style={{ transform: `translateX(${sp.sweepX})` }}>
                {sp.bands!.map((b, i) => (
                  <div key={i} className="flex-1" style={{ background: b }} />
                ))}
              </div>
              <div className="absolute inset-0 bg-black" style={{ opacity: sp.dim }} />
            </>
          )}
          {sp.showGrid && (
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-7 gap-px" style={{ gridTemplateColumns: "repeat(12,1fr)", gridTemplateRows: "repeat(7,1fr)" }}>
              {sp.cells!.map((c, i) => (
                <div key={i} style={{ background: c }} />
              ))}
            </div>
          )}
        </div>
        <span className="text-[13px] text-[var(--text-secondary)]">{sp.displayNote}</span>
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
            <div key={i} className="flex-1 rounded-[2px]" style={{ height: b.h, background: b.bg }} />
          ))}
        </div>
        {!!sp.audioNote && <span className="text-[13px] font-semibold text-[var(--status-danger)]">{sp.audioNote}</span>}
        <Button variant="secondary" size="sm" onClick={onPlayTone} icon={<Ico name="speaker" />}>Tap to hear</Button>
        <span className="text-xs text-[var(--text-tertiary)]">Sound stays off until you tap.</span>
      </div>
    );
  }

  if (sp.isBattery) {
    return (
      <div className="flex w-full max-w-[360px] flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-[52px] font-bold leading-none tracking-[-0.022em]" style={{ color: sp.batColor }}>{sp.batVal}</span>
          <span className="text-sm text-[var(--text-secondary)]">battery health</span>
        </div>
        <div className="relative box-content h-5 rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-[var(--surface-sunken)]">
          <div className="h-full rounded-[3px]" style={{ width: sp.batFill, background: sp.batColor }} />
          <div className="absolute -bottom-2 -top-2 w-0.5 bg-[var(--text-primary)]" style={{ left: sp.limitLeft }} />
          <span className="absolute top-7 -translate-x-1/2 whitespace-nowrap text-xs font-semibold" style={{ left: sp.limitLeft }}>Limit {sp.limitLabel}</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[var(--text-secondary)]">
          <span>Charge cycles <strong className="font-mono text-[var(--text-primary)]">{sp.cycles}</strong></span>
          <span>Charging <strong className="text-[var(--text-primary)]">{sp.charging}</strong></span>
        </div>
      </div>
    );
  }

  if (sp.isKeyboard) {
    return (
      <div className="flex w-full max-w-[420px] flex-col gap-3">
        {sp.kbPrompt && (
          <div className="flex items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[var(--brand-primary)] bg-[var(--surface-card)] px-3 py-2">
            <span className="text-sm font-semibold">Press any 5 keys on your keyboard</span>
            <span className="font-mono text-[13px] text-[var(--brand-primary)]">{sp.kbCount} of 5</span>
          </div>
        )}
        <div className="flex flex-col gap-1 rounded-[var(--radius-md)] bg-[var(--surface-inverse)] p-2.5">
          {sp.kbRows!.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.keys.map((k, ki) => (
                <button
                  key={`${k.label}-${ki}`}
                  type="button"
                  aria-label={`${k.label} key`}
                  aria-pressed={k.pressed}
                  disabled={k.disabled}
                  onClick={k.press}
                  className="grid h-[26px] min-w-0 place-items-center rounded-[var(--radius-xs)] font-mono text-[10px] transition-[background] duration-[120ms] ease-[cubic-bezier(.2,.7,.3,1)]"
                  style={{ flex: k.flex, background: k.bg, color: k.fg, cursor: k.cursor }}
                >
                  {k.label}
                </button>
              ))}
            </div>
          ))}
        </div>
        {!!sp.kbNote && <span className="text-[13px] font-semibold text-[var(--status-danger)]">{sp.kbNote}</span>}
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
          className="relative box-content aspect-[16/10] w-full touch-none cursor-crosshair rounded-[var(--radius-md)] border bg-[var(--surface-sunken)]"
          style={{ borderColor: sp.padBorder }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <ellipse cx="50" cy="50" rx="30" ry="34" fill="none" stroke="var(--border-default)" strokeWidth="1.5" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <polyline points={sp.padPts} fill="none" stroke="var(--brand-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
          {sp.padDone && (
            <div className="absolute right-2 top-2 flex items-center gap-1 text-[13px] font-semibold text-[var(--status-success)]">
              <Ico name="checkCircle" size={18} />
              Circle done
            </div>
          )}
        </div>
      </div>
    );
  }

  if (sp.isPorts) {
    return (
      <div className="flex w-full max-w-[440px] flex-col gap-3">
        <div className="h-4 rounded-b-[var(--radius-md)] rounded-t-[var(--radius-xs)] bg-[var(--border-default)]" />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-2">
          {sp.ports!.map((p) => (
            <div key={p.name} className="flex flex-col items-center gap-1.5 rounded-[var(--radius-sm)] border bg-[var(--surface-card)] px-1.5 py-2.5" style={{ borderColor: p.color, color: p.color }}>
              <Ico d={p.icon} size={22} />
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">{p.name}</span>
              <span className="text-xs">{p.state}</span>
            </div>
          ))}
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
                <div key={i} className="w-4 rounded-[3px]" style={{ height: b.h, background: b.bg }} />
              ))}
            </div>
            <span className="text-xs font-semibold" style={{ color: sp.signalColor }}>{sp.signalLabel}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-display text-[40px] font-bold leading-none tracking-[-0.022em]">
              {sp.speed}
              <span className="font-sans text-base font-medium text-[var(--text-secondary)]"> Mbps</span>
            </span>
            <span className="text-[13px] text-[var(--text-secondary)]">Wi-Fi speed · Bluetooth: {sp.bt}</span>
          </div>
        </div>
        {!!sp.wifiNote && <span className="text-[13px] font-semibold text-[var(--status-danger)]">{sp.wifiNote}</span>}
      </div>
    );
  }

  if (sp.isCamera) {
    return (
      <div className="flex w-full max-w-[340px] flex-col gap-3">
        <div className="relative grid aspect-[16/10] place-items-center rounded-[var(--radius-md)] bg-[var(--surface-inverse)] text-white/45">
          {sp.camPic && <Ico name="person" size={56} sw={1.6} />}
          {sp.camNoPic && <span className="text-sm font-semibold text-white">No picture</span>}
          <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 text-xs text-white">
            <span className="h-2 w-2 rounded-full bg-[var(--brand-accent)]" style={{ opacity: sp.recO }} />
            Camera on
          </span>
          <div className="absolute inset-[18%] rounded-[var(--radius-xs)] border-2 border-white/35" />
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
          <span className="min-w-[74px]">{sp.camLabel}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-[var(--radius-xs)] bg-[var(--surface-sunken)]">
            <div className="h-full bg-[var(--status-success)]" style={{ width: sp.mic }} />
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
              <span className="text-[var(--text-secondary)]">{m.label}</span>
              <span className="font-mono font-semibold">{m.value}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-[var(--radius-xs)] bg-[var(--surface-sunken)]">
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
          <div key={y.label} className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] border bg-[var(--surface-card)] px-3 py-2.5" style={{ borderColor: y.border }}>
            <span className="text-sm font-medium">{y.label}</span>
            <span className="text-[13px] font-semibold" style={{ color: y.color }}>{y.state}</span>
          </div>
        ))}
      </div>
    );
  }

  if (sp.isStorage) {
    return (
      <div className="grid w-full max-w-[440px] grid-cols-3 gap-2.5" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))" }}>
        {sp.drive!.map((m) => (
          <div key={m.label} className="flex min-w-0 flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-3">
            <span className="text-xs text-[var(--text-secondary)]">{m.label}</span>
            <span className="whitespace-nowrap font-display text-[22px] font-bold tracking-[-0.012em]">{m.value}</span>
            <span className="text-xs text-[var(--text-tertiary)]">{m.unit}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
