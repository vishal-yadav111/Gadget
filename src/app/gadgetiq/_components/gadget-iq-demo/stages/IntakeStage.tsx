"use client";

import Image from "next/image";
import { useMemo } from "react";
import { ArrowRight, Check, Play } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import * as D from "../data";
import { renderSrc } from "../renders";
import type { DemoState } from "../types";
import type { GadgetIqDemo } from "../useGadgetIqDemo";

export function IntakeStage({ state, demo, tryMode, ti }: { state: DemoState; demo: GadgetIqDemo; tryMode: boolean; ti: number }) {
  const showPicker = !state.deviceId;

  if (showPicker) {
    return (
      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h3 className="m-0 font-display text-xl font-bold tracking-tight">Pick a laptop to check</h3>
            <span className="text-sm text-[#4A5875]">Each one tells a different story.</span>
          </div>
          <Badge tone="neutral">Mobile phones: Coming soon</Badge>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          {D.DEVICE_ORDER.map((id) => {
            const d = D.SCENARIOS[id];
            return (
              <button
                key={id}
                onClick={() => demo.startDemo(id)}
                className="flex flex-col gap-3 rounded-lg border border-[#DDE4F3] bg-white p-3.5 text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative w-full overflow-hidden rounded-md bg-[#E9EEF9]" style={{ aspectRatio: "4/3" }}>
                  <Image src={renderSrc("Front", id)} alt={d.name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-display text-base font-bold">{d.name}</span>
                  <span className="text-[13px] text-[#4A5875]">{d.os} · {d.specs.Memory} · {d.specs.Storage}</span>
                  <span className="text-[13px] text-[#5F6A86]">{d.story}</span>
                </div>
                <span className="flex items-center gap-1 text-sm font-semibold text-brand-primary">
                  Check this laptop <ArrowRight size={16} />
                </span>
              </button>
            );
          })}
        </div>
        {!tryMode && (
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" onClick={() => demo.startDemo(D.DEFAULT_DEVICE)} icon={<Play size={18} fill="currentColor" />}>
              Start the demo
            </Button>
            <span className="text-sm text-[#4A5875]">Starts with the Dell Latitude 5420.</span>
          </div>
        )}
      </div>
    );
  }

  return <DeviceDetailRun state={state} demo={demo} ti={ti} />;
}

function DeviceDetailRun({ state, demo, ti }: { state: DemoState; demo: GadgetIqDemo; ti: number }) {
  const sc = demo.sc();
  const T = D.TIMINGS;
  const slideP = state.reduced ? 1 : D.ease(ti / T.intake.slideIn);

  const fields = useMemo(
    () =>
      D.SPEC_FIELDS.map((f, i) => {
        const start = T.intake.slideIn + i * T.intake.field;
        const p = D.clamp((ti - start) / (T.intake.field * 0.75));
        const v = sc.specs[f];
        return { label: f, value: v.slice(0, Math.ceil(p * v.length)), typing: p > 0 && p < 1, done: p >= 1, mono: f === "Serial No." };
      }),
    [ti, sc, T.intake.slideIn, T.intake.field]
  );
  const nDone = fields.filter((f) => f.done).length;
  const fieldsDone = ti >= demo.tlc.fieldsEnd;

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex flex-wrap items-center justify-center gap-7 py-3">
        <div className="flex max-w-[380px] flex-1 basis-[260px] flex-col items-center gap-3" style={{ transform: `translateX(${((1 - slideP) * -60).toFixed(1)}px)`, opacity: slideP }}>
          <div className="relative w-full">
            <div className="relative w-full overflow-hidden rounded-lg bg-[#E9EEF9]" style={{ aspectRatio: "4/3" }}>
              <Image src={demo.imgFor(sc.id, "Front")} alt={`${sc.name}, front view`} fill className="object-cover" unoptimized />
            </div>
            <div className="absolute flex flex-col items-center justify-center gap-1.5 text-white" style={{ left: "25%", top: "13.3%", width: "50%", height: "44%" }}>
              <span className="font-display text-sm font-extrabold">Gadget IQ</span>
              <span className="text-[11px] text-white/80">{fieldsDone ? "Ready to check" : "Reading details…"}</span>
              <div className="h-1 w-3/5 overflow-hidden rounded-full bg-white/20">
                <div className="h-full bg-brand-accent" style={{ width: D.pct(nDone / fields.length) }} />
              </div>
            </div>
          </div>
          <span className="font-display text-lg font-bold">{sc.name}</span>
          <Badge tone="brand">Connected by USB-C</Badge>
        </div>
        <div className="flex min-w-0 max-w-[440px] flex-1 basis-[300px] flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display text-lg font-bold">Device details</span>
            <Badge tone={fieldsDone ? "success" : "brand"}>{fieldsDone ? "All found" : `${nDone} of ${fields.length} found`}</Badge>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#DDE4F3]">
            {fields.map((f) => (
              <div key={f.label} className="grid min-h-[22px] grid-cols-[120px_minmax(0,1fr)_20px] items-center gap-2 border-b border-[#DDE4F3] px-3 py-2 last:border-b-0">
                <span className="text-[13px] text-[#4A5875]">{f.label}</span>
                <span className={`overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium ${f.mono ? "font-mono" : ""}`}>
                  {f.value}
                  {f.typing && <span className="text-brand-primary">|</span>}
                </span>
                {f.done && <Check size={18} className="text-brand-success" />}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              disabled={!fieldsDone}
              onClick={() => (state.waiting === "start" ? demo.doGate("start") : demo.advance())}
              icon={<Play size={16} fill="currentColor" />}
            >
              Start check
            </Button>
            <span className="text-[13px] text-[#4A5875]">{fieldsDone ? "Uses 1 Gadget Evaluate licence" : "Waiting for details"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
