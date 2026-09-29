"use client";

import { Ico } from "../icons";
import { STAGES, STAGE_LABELS, STAGE_SHORT, type Stage } from "../types";

export function StepRail({
  stageIndex,
  width,
  deviceId,
  onGo,
  onPicker,
}: {
  stageIndex: number;
  width: number;
  deviceId: string | null;
  onGo: (s: (typeof STAGES)[number]) => void;
  onPicker: () => void;
}) {
  return (
    <nav aria-label="Demo steps" className="flex min-w-0 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3 py-1.5 shadow-[var(--shadow-sm)]">
      {STAGES.map((k, i) => {
        const done = i < stageIndex;
        const active = i === stageIndex;
        const label = width >= 1100 ? STAGE_LABELS[k] : STAGE_SHORT[k];
        const disabled = !(done || active) || !deviceId;
        const lit = done || active;
        return (
          <div key={k} className="flex min-w-0 items-center gap-2" style={{ flex: i < 4 ? "1 1 0" : "0 0 auto" }}>
            <button
              type="button"
              onClick={() => { if (!done || !deviceId) return; if (k === "intake") onPicker(); else onGo(k); }}
              aria-current={active ? "step" : undefined}
              disabled={disabled}
              className={`flex min-h-10 min-w-0 flex-initial items-center gap-2 rounded-[var(--radius-sm)] bg-transparent px-1 py-1.5 ${done ? "cursor-pointer" : "cursor-default"}`}
            >
              <span
                className={`box-content grid h-[26px] w-[26px] shrink-0 basis-[26px] place-items-center rounded-[var(--radius-sm)] border font-mono text-xs font-semibold transition-[background] duration-200 ease-[cubic-bezier(.2,.7,.3,1)] ${
                  lit ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white" : "border-[var(--border-default)] bg-white text-[var(--text-tertiary)]"
                }`}
              >
                {done ? <Ico name="check" sw={2.4} /> : i + 1}
              </span>
              <span
                title={label}
                className={`min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium ${
                  active ? "text-[var(--text-primary)]" : done ? "text-[var(--text-secondary)]" : "text-[var(--text-tertiary)]"
                }`}
              >
                {label}
              </span>
            </button>
            {i < 4 && <span className={`h-0.5 min-w-0 flex-1 rounded-[1px] ${done ? "bg-[var(--brand-primary)]" : "bg-[var(--border-subtle)]"}`} />}
          </div>
        );
      })}
    </nav>
  );
}

export function NarrowStepRail({ stage, stageIndex }: { stage: Stage; stageIndex: number }) {
  const text = stage === "end" ? "Done · 5 of 5" : `Step ${stageIndex + 1} of 5 · ${STAGE_SHORT[stage as (typeof STAGES)[number]]}`;
  const pct = Math.min(1, (stageIndex + (stage === "end" ? 0 : 0.5)) / 5) * 100;
  return (
    <div className="sticky top-0 z-[6] flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-3.5 py-2.5 shadow-[var(--shadow-sm)]">
      <div className="text-sm font-semibold">{text}</div>
      <div className="h-1 overflow-hidden rounded-[2px] bg-[var(--surface-sunken)]">
        <div className="h-full bg-[var(--brand-primary)] transition-[width] duration-200 ease-[cubic-bezier(.2,.7,.3,1)]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
