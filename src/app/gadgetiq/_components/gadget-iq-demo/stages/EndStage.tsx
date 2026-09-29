"use client";

import { Button } from "../ui";
import { Ico, PATHS } from "../icons";
import * as D from "../data";
import type { DemoState } from "../types";
import type { GadgetIqDemo } from "../useGadgetIqDemo";

const EYEBROW = "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]";
const CARD = "flex min-w-0 flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-sm)]";
const ITEM = "flex items-start gap-2 text-sm leading-[1.45]";

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
    <div className="flex justify-center bg-[var(--surface-page)] px-4 py-[clamp(20px,4vw,40px)]">
      <div className="flex w-full max-w-[880px] flex-col gap-5">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <Ico name="checkCircle" size={40} sw={1.8} color="var(--status-success)" />
          <h3 className="m-0 font-display text-[clamp(26px,3vw,34px)] font-bold leading-[1.15] tracking-[-0.012em] [text-wrap:balance]">One laptop, fully checked.</h3>
          <p className="m-0 max-w-[580px] text-[clamp(15px,1.6vw,18px)] leading-[1.5] text-[var(--text-secondary)]">{lead} {tail}</p>
        </div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          <div className={CARD}>
            <span className={EYEBROW}>Gadget Evaluate</span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-display text-[44px] font-bold leading-none tracking-[-0.022em]">{fr.passed}/{fr.total}</span>
              <span className="text-sm text-[var(--text-secondary)]">tests passed</span>
            </div>
            <div className="flex h-2 gap-0.5 overflow-hidden rounded-[var(--radius-xs)] bg-[var(--surface-sunken)]">
              <div className="bg-[var(--status-success)]" style={{ width: D.pct(fr.passed / fr.total) }} />
              <div className="flex-1 bg-[var(--status-danger)]" />
            </div>
            {fr.failed.map((x) => (
              <div key={x.id} className={ITEM}>
                <Ico d={PATHS.warn} size={18} color="var(--status-danger)" className="mt-px flex-none" />
                <span><strong className="font-semibold">{x.testName}:</strong> {x.reason}</span>
              </div>
            ))}
            <div className={ITEM}>
              <Ico d={PATHS.checkCircle} size={18} color="var(--status-success)" className="mt-px flex-none" />
              <span>The other {fr.passed} tests passed.</span>
            </div>
          </div>
          <div className={CARD}>
            <span className={EYEBROW}>Gadget Lens</span>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-display text-[44px] font-extrabold leading-none tracking-[-0.022em]" style={{ color: gradeRes.color }}>{gradeRes.letter}</span>
              <span className="text-sm text-[var(--text-secondary)]">{gradeRes.name} · {state.checklist ? "Checklist grade" : `${sc.confidence}% sure`}</span>
            </div>
            <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(7,minmax(0,1fr))" }}>
              {D.GRADE_SCALE.map((g) => (
                <div key={g.letter} className="h-2 rounded-[2px]" style={{ background: g.letter === gradeRes.letter ? g.color : "var(--surface-sunken)" }} />
              ))}
            </div>
            {why.items.map((x, i) => (
              <div key={i} className={ITEM}>
                <Ico d={defects.length ? PATHS.warn : PATHS.checkCircle} size={18} color={defects.length ? "var(--status-warning)" : "var(--status-success)"} className="mt-px flex-none" />
                <span>{x.charAt(0).toUpperCase() + x.slice(1)}</span>
              </div>
            ))}
            {!state.checklist && (
              <div className={ITEM}>
                <Ico d={PATHS.checkCircle} size={18} color="var(--status-success)" className="mt-px flex-none" />
                <span>{lc.text}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3.5">
          <Ico name="shield" size={22} color="var(--brand-primary)" />
          <div className="flex min-w-0 flex-1 basis-[220px] flex-col gap-0.5">
            <span className="text-sm font-semibold">Certificate <span className="font-mono font-medium">{certId}</span></span>
            <span className="text-[13px] text-[var(--text-secondary)]">Buyers can scan the QR code to check this report.</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { n: D.TESTS.length, label: "tests" },
              { n: D.ANGLES.length, label: "photos" },
              { n: fr.failed.length, label: "issues found", color: "var(--status-danger)" },
              { n: 1, label: "certificate" },
            ].map((e) => (
              <span key={e.label} className="whitespace-nowrap rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] px-2.5 py-1 text-[13px]" style={{ color: e.color || "var(--text-primary)" }}>
                <strong className="font-mono">{e.n}</strong> {e.label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => {
              demo.track("demo_cta_clicked");
              demo.showToast(`${D.CTA_LABEL}: link goes here`, "info");
            }}
          >
            {D.CTA_LABEL}
          </Button>
          <Button variant="secondary" size="lg" onClick={demo.tryAnother} icon={<Ico name="laptop" size={18} />}>Try another laptop</Button>
          <Button variant="ghost" size="lg" onClick={demo.replay} icon={<Ico name="restart" size={18} />}>Replay</Button>
        </div>
      </div>
    </div>
  );
}
