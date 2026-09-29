"use client";

import { Button } from "../ui";
import { Ico } from "../icons";
import * as D from "../data";
import QrCode from "../QrCode";
import type { DemoState } from "../types";
import type { GadgetIqDemo } from "../useGadgetIqDemo";

const EYEBROW = "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]";
const MERGE_CARD = "box-content w-[220px] max-w-[46%] rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3.5 shadow-[var(--shadow-md)]";

export function CertificateStage({ state, demo, tcert, sw }: { state: DemoState; demo: GadgetIqDemo; tcert: number; sw: number }) {
  const sc = demo.sc();
  const fr = D.functionalResults(sc);
  const T = D.TIMINGS;
  const rm = state.reduced;
  const narrow = sw < 760;

  const defects = state.checklist ? D.defectsFromChecklist(D.checklistFromDefects(sc.defects), sc) : sc.defects;
  const gradeRes = D.gradeFromDefects(defects);
  const serial = sc.specs["Serial No."];
  const certId = D.makeCertId(serial);
  const today = D.fmtDate();

  const mergeP = rm ? 1 : D.ease(tcert / T.certificate.merge);
  const showMerge = !rm && tcert < T.certificate.merge;
  const certP = rm ? 1 : D.clamp((tcert - T.certificate.merge * 0.8) / 400);

  const vStart = state.verifyStart != null ? state.verifyStart : state.mode !== "try" ? T.certificate.verifyAt : null;
  const vState = vStart == null || tcert < vStart ? "idle" : tcert < vStart + T.certificate.verifyDur ? "checking" : "done";

  const evalShort = `${fr.passed} of ${fr.total} passed`;
  const lensShort = state.checklist ? `Grade ${gradeRes.letter}, checklist` : `Grade ${gradeRes.letter}, ${sc.confidence}% sure`;
  const why = D.explainGrade(defects);

  const certFields = [
    { k: "Device", v: sc.name },
    { k: "Serial No.", v: serial, mono: true },
    { k: "Test date", v: today },
    { k: "Battery health", v: `${sc.batteryHealth}% (limit ${D.BATTERY_LIMIT}%)` },
    { k: "Marks found", v: why.items.join(", ") },
  ];

  return (
    <div className="relative flex min-h-[480px] items-start justify-center px-4 py-5">
      {showMerge && (
        <div className="pointer-events-none absolute inset-x-0 top-[150px] z-[2] flex items-center justify-center px-4">
          <div className={MERGE_CARD} style={{ transform: `translateX(${((1 - mergeP) * -200 + 60).toFixed(1)}px)`, opacity: (1 - D.clamp((mergeP - 0.6) / 0.3)).toFixed(2) }}>
            <span className="text-xs text-[var(--text-secondary)]">Gadget Evaluate</span>
            <div className="font-display text-lg font-bold">{evalShort}</div>
          </div>
          <div className={MERGE_CARD} style={{ transform: `translateX(${((1 - mergeP) * 200 - 60).toFixed(1)}px)`, opacity: (1 - D.clamp((mergeP - 0.6) / 0.3)).toFixed(2) }}>
            <span className="text-xs text-[var(--text-secondary)]">Gadget Lens</span>
            <div className="font-display text-lg font-bold" style={{ color: gradeRes.color }}>{lensShort}</div>
          </div>
        </div>
      )}
      <div className="flex w-full max-w-[760px] flex-col gap-3" style={{ opacity: certP.toFixed(2), transform: `scale(${(0.97 + 0.03 * certP).toFixed(3)})` }}>
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-md)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] grid place-items-center overflow-hidden">
            <span className="whitespace-nowrap font-display text-[120px] font-extrabold tracking-[0.08em] text-[var(--text-primary)] opacity-[.06]" style={{ transform: "rotate(-24deg)" }}>SAMPLE</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[var(--surface-inverse)] px-5 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <Ico name="shield" size={22} />
              <span className="font-display text-lg font-bold">Gadget IQ Certificate</span>
            </div>
            <span className="font-mono text-[13px] text-white/80">{certId}</span>
          </div>
          <div className="grid gap-px border-b border-[var(--border-subtle)] bg-[var(--border-subtle)]" style={{ gridTemplateColumns: sw < 520 ? "minmax(0,1fr)" : "repeat(2,minmax(0,1fr))" }}>
            <div className="flex flex-col gap-0.5 bg-[var(--surface-card)] px-5 py-3.5">
              <span className={EYEBROW}>Gadget Evaluate</span>
              <span className="font-display text-lg font-bold">{evalShort}</span>
              <span className="text-[13px] text-[var(--status-danger)]">{fr.failed.length} need attention</span>
            </div>
            <div className="flex flex-col gap-0.5 bg-[var(--surface-card)] px-5 py-3.5">
              <span className={EYEBROW}>Gadget Lens</span>
              <span className="font-display text-lg font-bold" style={{ color: gradeRes.color }}>{lensShort}</span>
              <span className="text-[13px] text-[var(--text-secondary)]">{gradeRes.letter} · {gradeRes.name}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 p-5">
            <div className="grid min-w-0 flex-1 basis-[260px] content-start gap-x-3 gap-y-2.5 text-sm" style={{ gridTemplateColumns: "120px minmax(0,1fr)" }}>
              {certFields.map((f) => (
                <div className="contents" key={f.k}>
                  <span className="text-[var(--text-secondary)]">{f.k}</span>
                  <span className={`font-medium ${f.mono ? "font-mono" : ""}`}>{f.v}</span>
                </div>
              ))}
            </div>
            <div className="mx-auto flex flex-none items-center gap-3" style={{ flexDirection: sw < 420 ? "column" : "row" }}>
              <div className="box-border w-[120px] rounded-[var(--radius-md)] border border-[var(--border-subtle)] p-2.5 text-center">
                <span className="text-xs text-[var(--text-secondary)]">Overall grade</span>
                <div className="font-display text-[44px] font-extrabold leading-[1.1]" style={{ color: gradeRes.color }}>{gradeRes.letter}</div>
                <span className="text-xs font-semibold">{gradeRes.name}</span>
              </div>
              <div className="box-border grid h-[120px] w-[120px] place-items-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-white">
                <QrCode size={106} />
              </div>
            </div>
          </div>
          <div className="mx-5 mb-4 flex flex-col gap-1.5 rounded-[var(--radius-md)] bg-[rgba(199,48,10,.06)] px-3.5 py-3">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--status-danger)]"><Ico name="warn" />Needs attention</span>
            {fr.failed.map((f) => (
              <span key={f.id} className="text-sm"><strong className="font-semibold">{f.testName}:</strong> {f.reason}</span>
            ))}
          </div>
          <div className="relative z-[2] flex flex-wrap items-center gap-2.5 border-t border-[var(--border-subtle)] bg-[var(--surface-page)] px-5 py-3.5">
            <Button variant="primary" loading={vState === "checking"} onClick={demo.verify} full={narrow} icon={<Ico name="shield" />}>Verify</Button>
            {vState === "done" && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--status-success)]">
                <Ico name="checkCircle" size={18} />
                Verified. This certificate matches our records.
              </span>
            )}
            {vState === "checking" && <span className="text-sm text-[var(--text-secondary)]">Checking our records…</span>}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)]"><Ico name="qr" size={18} />Buyers can scan the QR code to check this report.</span>
          <Button variant="secondary" size="sm" onClick={demo.next} iconAfter={<Ico name="arrowRight" />}>Next: admin view</Button>
        </div>
      </div>
    </div>
  );
}
