"use client";

import { CheckCircle2, RotateCcw, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import * as D from "../data";
import type { DemoState } from "../types";
import type { GadgetIqDemo } from "../useGadgetIqDemo";

export function EndStage({ state, demo }: { state: DemoState; demo: GadgetIqDemo }) {
  const sc = demo.sc();
  const fr = D.functionalResults(sc);
  const defects = state.checklist ? D.defectsFromChecklist(D.checklistFromDefects(sc.defects), sc) : sc.defects;
  const gradeRes = D.gradeFromDefects(defects);
  const why = D.explainGrade(defects);
  const certId = D.makeCertId(sc.specs["Serial No."]);

  const fixName = (id: string) => { const l = D.failureLabel(id); return /^(USB|Wi-Fi)/.test(l) ? l : l.toLowerCase(); };
  const fixes = fr.failed.map((x) => fixName(x.id));
  const fixList = fixes.length > 1 ? fixes.slice(0, -1).join(", ") + " and " + fixes[fixes.length - 1] : fixes[0] || "";
  const gi = gradeRes.index;
  const lead = gi <= 1 ? "Great condition overall." : gi === 2 ? "Good condition overall." : gi <= 4 ? "Fair condition, with plenty of life left." : "Heavy wear on the body, but most parts work well.";
  const tail = !fixes.length ? "It is ready for its next owner." : gi >= 5 ? `Fix the ${fixList} and it can go out as a budget unit.` : `Fix the ${fixList} and it is ready for its next owner.`;
  const lc = D.lensConfidence(sc.confidence);

  return (
    <div className="flex justify-center bg-[#F4F6FB] px-4 py-8 sm:py-10">
      <div className="flex w-full max-w-[880px] flex-col gap-5">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <CheckCircle2 size={40} className="text-brand-success" />
          <h3 className="m-0 font-display text-3xl font-bold leading-tight tracking-tight">One laptop, fully checked.</h3>
          <p className="m-0 max-w-[580px] text-lg leading-snug text-[#4A5875]">{lead} {tail}</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
          <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-[#DDE4F3] bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4A5875]">Gadget Evaluate</span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-display text-4xl font-bold leading-none tracking-tight">{fr.passed}/{fr.total}</span>
              <span className="text-sm text-[#4A5875]">tests passed</span>
            </div>
            <div className="flex h-2 gap-0.5 overflow-hidden rounded bg-[#E9EEF9]">
              <div className="bg-brand-success" style={{ width: D.pct(fr.passed / fr.total) }} />
              <div className="flex-1 bg-brand-critical" />
            </div>
            {fr.failed.map((x) => (
              <div key={x.id} className="flex items-start gap-2 text-sm leading-snug">
                <span className="mt-0.5 shrink-0 text-brand-critical">⚠</span>
                <span><strong className="font-semibold">{x.testName}:</strong> {x.reason}</span>
              </div>
            ))}
            <div className="flex items-start gap-2 text-sm leading-snug">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-success" />
              <span>The other {fr.passed} tests passed.</span>
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-[#DDE4F3] bg-white p-5 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4A5875]">Gadget Lens</span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold leading-none tracking-tight" style={{ color: gradeRes.color }}>{gradeRes.letter}</span>
              <span className="text-sm text-[#4A5875]">{gradeRes.name} · {state.checklist ? "Checklist grade" : `${sc.confidence}% sure`}</span>
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {D.GRADE_SCALE.map((g) => <div key={g.letter} className="h-2 rounded-sm" style={{ background: g.color }} />)}
            </div>
            {why.items.map((x, i) => (
              <div key={i} className="flex items-start gap-2 text-sm leading-snug">
                {defects.length ? <span className="mt-0.5 shrink-0 text-brand-warning">⚠</span> : <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-success" />}
                <span>{x.charAt(0).toUpperCase() + x.slice(1)}</span>
              </div>
            ))}
            {!state.checklist && (
              <div className="flex items-start gap-2 text-sm leading-snug">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-success" />
                <span>{lc.text}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3.5 rounded-lg border border-[#DDE4F3] bg-white px-4 py-3.5">
          <ShieldCheck size={22} className="text-brand-primary" />
          <div className="flex min-w-0 flex-1 basis-[220px] flex-col gap-0.5">
            <span className="text-sm font-semibold">Certificate <span className="font-mono font-medium">{certId}</span></span>
            <span className="text-[13px] text-[#4A5875]">Buyers can scan the QR code to check this report.</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { n: D.TESTS.length, label: "tests" },
              { n: D.ANGLES.length, label: "photos" },
              { n: fr.failed.length, label: "issues found", color: "var(--status-danger)" },
              { n: 1, label: "certificate" },
            ].map((e) => (
              <span key={e.label} className="whitespace-nowrap rounded-md bg-[#E9EEF9] px-2.5 py-1 text-[13px]" style={{ color: e.color || "var(--text-primary)" }}>
                <strong className="font-mono">{e.n}</strong> {e.label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="primary" size="lg" onClick={() => demo.showToast(`${D.CTA_LABEL}: link goes here`, "info")}>{D.CTA_LABEL}</Button>
          <Button variant="secondary" size="lg" onClick={demo.tryAnother} icon={<ShieldCheck size={18} />}>Try another laptop</Button>
          <Button variant="ghost" size="lg" onClick={demo.replay} icon={<RotateCcw size={18} />}>Replay</Button>
        </div>
      </div>
    </div>
  );
}
