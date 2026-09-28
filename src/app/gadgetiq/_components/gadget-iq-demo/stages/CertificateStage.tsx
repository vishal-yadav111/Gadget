"use client";

import { AlertTriangle, QrCode as QrIcon, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import * as D from "../data";
import QrCode from "../QrCode";
import type { DemoState } from "../types";
import type { GadgetIqDemo } from "../useGadgetIqDemo";

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
    <div className="relative flex min-h-[480px] justify-center px-4 py-5">
      {showMerge && (
        <div className="pointer-events-none absolute inset-x-0 top-[150px] z-[2] flex items-center justify-center px-4">
          <div className="w-[220px] max-w-[46%] rounded-lg border border-[#DDE4F3] bg-white p-3.5 shadow-md" style={{ transform: `translateX(${((1 - mergeP) * -200 + 60).toFixed(1)}px)`, opacity: (1 - D.clamp((mergeP - 0.6) / 0.3)).toFixed(2) }}>
            <span className="text-xs text-[#4A5875]">Gadget Evaluate</span>
            <div className="font-display text-lg font-bold">{evalShort}</div>
          </div>
          <div className="w-[220px] max-w-[46%] rounded-lg border border-[#DDE4F3] bg-white p-3.5 shadow-md" style={{ transform: `translateX(${((1 - mergeP) * 200 - 60).toFixed(1)}px)`, opacity: (1 - D.clamp((mergeP - 0.6) / 0.3)).toFixed(2) }}>
            <span className="text-xs text-[#4A5875]">Gadget Lens</span>
            <div className="font-display text-lg font-bold" style={{ color: gradeRes.color }}>{lensShort}</div>
          </div>
        </div>
      )}
      <div className="flex w-full max-w-[760px] flex-col gap-3" style={{ opacity: certP.toFixed(2), transform: `scale(${(0.97 + 0.03 * certP).toFixed(3)})` }}>
        <div className="relative overflow-hidden rounded-xl border border-[#DDE4F3] bg-white shadow-md">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] grid place-items-center overflow-hidden">
            <span className="whitespace-nowrap font-display text-[120px] font-extrabold tracking-[0.08em] text-[#17284D] opacity-[.06]" style={{ transform: "rotate(-24deg)" }}>SAMPLE</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#17284D] px-5 py-3.5 text-white">
            <div className="flex items-center gap-2">
              <ShieldCheck size={22} />
              <span className="font-display text-lg font-bold">Gadget IQ Certificate</span>
            </div>
            <span className="font-mono text-[13px] text-white/80">{certId}</span>
          </div>
          <div className="grid gap-px bg-[#DDE4F3] border-b border-[#DDE4F3]" style={{ gridTemplateColumns: sw < 520 ? "minmax(0,1fr)" : "repeat(2,minmax(0,1fr))" }}>
            <div className="flex flex-col gap-0.5 bg-white px-5 py-3.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4A5875]">Gadget Evaluate</span>
              <span className="font-display text-lg font-bold">{evalShort}</span>
              <span className="text-[13px] text-brand-critical">{fr.failed.length} need attention</span>
            </div>
            <div className="flex flex-col gap-0.5 bg-white px-5 py-3.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4A5875]">Gadget Lens</span>
              <span className="font-display text-lg font-bold" style={{ color: gradeRes.color }}>{lensShort}</span>
              <span className="text-[13px] text-[#4A5875]">{gradeRes.letter} · {gradeRes.name}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 p-5">
            <div className="grid min-w-0 flex-1 basis-[260px] content-start gap-x-3 gap-y-2.5 text-sm" style={{ gridTemplateColumns: "120px minmax(0,1fr)" }}>
              {certFields.map((f) => (
                <div className="contents" key={f.k}>
                  <span className="text-[#4A5875]">{f.k}</span>
                  <span className={`font-medium ${f.mono ? "font-mono" : ""}`}>{f.v}</span>
                </div>
              ))}
            </div>
            <div className="mx-auto flex flex-none items-center gap-3" style={{ flexDirection: sw < 420 ? "column" : "row" }}>
              <div className="box-border w-[120px] rounded-lg border border-[#DDE4F3] p-2.5 text-center">
                <span className="text-xs text-[#4A5875]">Overall grade</span>
                <div className="font-display text-[44px] font-extrabold leading-tight" style={{ color: gradeRes.color }}>{gradeRes.letter}</div>
                <span className="text-xs font-semibold">{gradeRes.name}</span>
              </div>
              <div className="box-border grid h-[120px] w-[120px] place-items-center overflow-hidden rounded-lg border border-[#DDE4F3] bg-white">
                <QrCode value={`gadgetiq-demo-certificate:${certId}`} size={106} />
              </div>
            </div>
          </div>
          {fr.failed.length > 0 && (
            <div className="mx-5 mb-4 flex flex-col gap-1.5 rounded-lg p-3.5" style={{ background: "rgba(199,48,10,.06)" }}>
              <span className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-critical"><AlertTriangle size={16} />Needs attention</span>
              {fr.failed.map((f) => (
                <span key={f.id} className="text-sm"><strong className="font-semibold">{f.testName}:</strong> {f.reason}</span>
              ))}
            </div>
          )}
          <div className="relative z-[2] flex flex-wrap items-center gap-2.5 border-t border-[#DDE4F3] bg-[#F4F6FB] px-5 py-3.5">
            <Button variant="primary" loading={vState === "checking"} onClick={demo.verify} full={narrow} icon={<ShieldCheck size={16} />}>Verify</Button>
            {vState === "done" && <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-success">Verified. This certificate matches our records.</span>}
            {vState === "checking" && <span className="text-sm text-[#4A5875]">Checking our records…</span>}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 text-[13px] text-[#4A5875]"><QrIcon size={18} />Buyers can scan the QR code to check this report.</span>
          <Button variant="secondary" size="sm" onClick={demo.next} iconAfter={<span aria-hidden>→</span>}>Next: admin view</Button>
        </div>
      </div>
    </div>
  );
}
