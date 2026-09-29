"use client";

import { useMemo } from "react";
import { Switch, Button, Badge, Spinner } from "../ui";
import { Ico } from "../icons";
import * as D from "../data";
import type { Defect } from "../data";
import { markPaths } from "../renders";
import type { DemoState } from "../types";
import type { GadgetIqDemo } from "../useGadgetIqDemo";

const TONE_COLOR: Record<string, string> = { success: "var(--status-success)", warning: "var(--status-warning)", danger: "var(--status-danger)" };
const SEV_COLOR: Record<Defect["severity"], { box: string; label: string }> = {
  Light: { box: "oklch(0.8 0.15 80)", label: "var(--status-warning)" },
  Medium: { box: "var(--brand-accent)", label: "var(--accent-ink)" },
  Severe: { box: "var(--status-danger)", label: "var(--status-danger)" },
};

const EYEBROW = "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]";

export function CosmeticStage({ state, demo, tc, sw }: { state: DemoState; demo: GadgetIqDemo; tc: number; sw: number }) {
  const sc = demo.sc();
  const tlc = demo.tlc;
  const T = D.TIMINGS;
  const cap = T.cosmetic.capture, scan = T.cosmetic.scan;
  const rm = state.reduced;

  const auto = useMemo(() => D.checklistFromDefects(sc.defects), [sc]);
  const answersEff = useMemo(() => {
    const out: D.ChecklistAnswers = {};
    D.CHECKLIST.forEach((q, i) => {
      if (state.answers[q.id]) out[q.id] = state.answers[q.id];
      else if ((state.mode !== "try" || state.gates["cosmetic:checklist"]) && tc >= i * cap + 350) out[q.id] = auto[q.id];
    });
    return out;
  }, [state.answers, state.mode, state.gates, tc, cap, auto]);

  const defects = state.checklist ? D.defectsFromChecklist({ ...auto, ...answersEff }, sc) : sc.defects;
  const gradeRes = D.gradeFromDefects(defects);
  const why = D.explainGrade(defects);
  const gAt = state.checklist ? tlc.clGradeAt : tlc.gradeAt;
  const gradeShown = tc >= gAt;
  const gp = rm ? 1 : D.ease((tc - gAt) / T.cosmetic.gradeAnim);
  const rp = rm ? 1 : D.ease((tc - gAt - 200) / T.cosmetic.ringAnim);

  const revealAt = (d: Defect) => {
    const ai = D.ANGLES.indexOf(d.angle);
    const k = sc.defects.filter((x) => x.angle === d.angle).indexOf(d);
    return tlc.capEnd + (ai + 1) * scan - 150 + k * 220;
  };
  const keyOf = (d: Defect) => sc.defects.indexOf(d);

  const slotCols = sw < 560 ? 2 : 3;
  const clock = state.clock;

  const photosTaken = D.ANGLES.filter((_a, i) => state.photos[i] || tc >= i * cap + 350).length;

  let cosStatus: string;
  if (state.checklist) cosStatus = `${Object.keys(answersEff).length} of ${D.CHECKLIST.length} answered`;
  else if (tc < tlc.capEnd) cosStatus = `${photosTaken} of 6 photos taken`;
  else if (tc < tlc.scanEnd) cosStatus = `Gadget Lens is checking photo ${Math.min(6, Math.floor((tc - tlc.capEnd) / scan) + 1)} of 6`;
  else cosStatus = `${sc.defects.length} ${sc.defects.length === 1 ? "mark" : "marks"} found on 6 photos`;

  const visibleFindings = state.checklist ? [] : sc.defects.filter((d) => tc >= revealAt(d));
  const scanSpan = tlc.scanEnd - tlc.capEnd;
  const lensSteps = D.LENS_STEPS.map((label, i) => {
    const a = tlc.capEnd + (i * scanSpan) / 4, b = tlc.capEnd + ((i + 1) * scanSpan) / 4;
    const done = tc >= b, running = tc >= a && !done;
    return { label, done, running, pending: !done && !running };
  });
  const lc = D.lensConfidence(sc.confidence);
  const C = 2 * Math.PI * 42;

  return (
    <div className="grid items-start gap-4 p-4" style={{ gridTemplateColumns: sw >= 820 ? "minmax(0,1.2fr) minmax(0,1fr)" : "minmax(0,1fr)" }}>
      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-display text-lg font-bold">{state.checklist ? "Checklist" : "6 photos"}</span>
            <span className="text-[13px] text-[var(--text-secondary)]">{cosStatus}</span>
          </div>
          <Switch label="Grade with a checklist instead (no AI)" checked={state.checklist} onChange={demo.toggleChecklist} />
        </div>

        {!state.checklist && (
          <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${slotCols},minmax(0,1fr))` }}>
            {D.ANGLES.map((a, i) => {
              const taken = !!state.photos[i] || tc >= i * cap + 350;
              const flashT = state.photos[i] > 0 ? clock - state.photos[i] : tc - (i * cap + 350);
              const scanS = tlc.capEnd + i * scan, scanning = !rm && tc >= scanS && tc < scanS + scan, scanned = tc >= scanS + scan - 150;
              const found = sc.defects.filter((d) => d.angle === a);
              const waitingPhotos = state.waiting === "photos" && !taken;
              const severe = found.some((d) => d.severity === "Severe");
              const flash = !rm && taken && flashT >= 0 && flashT < 250 ? (0.9 * (1 - flashT / 250)).toFixed(2) : 0;
              const note = !taken ? "" : !scanned ? (scanning ? "Scanning…" : "Taken") : found.length ? `${found.length} ${found.length === 1 ? "mark" : "marks"} found` : "No marks found";
              const noteColor = !scanned ? "var(--text-tertiary)" : !found.length ? "var(--status-success)" : severe ? "var(--status-danger)" : "var(--status-warning)";
              return (
                <div key={a} className="flex min-w-0 flex-col gap-1.5">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`${a} photo`}
                    onClick={() => demo.takePhoto(i)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); demo.takePhoto(i); } }}
                    className="relative box-content aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] border bg-[var(--surface-sunken)]"
                    style={{ borderColor: waitingPhotos ? "var(--brand-primary)" : "var(--border-subtle)", cursor: waitingPhotos ? "pointer" : "default" }}
                  >
                    {taken && (
                      <>
                        <div role="img" aria-label={`${sc.name}, ${a.toLowerCase()} view`} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${demo.imgFor(sc.id, a)}")` }} />
                        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" aria-hidden="true">
                          {found.flatMap((d) => markPaths(d)).map((m, mi) => (
                            <path key={mi} d={m.d} stroke={m.stroke} strokeWidth={m.sw} fill={m.fill} opacity={m.o} strokeLinecap="round" strokeLinejoin="round" />
                          ))}
                        </svg>
                        {found.map((d) => {
                          const shown = scanned && tc >= revealAt(d);
                          const hot = state.hoverKey === keyOf(d);
                          const col = SEV_COLOR[d.severity];
                          return (
                            <div key={keyOf(d)} className="absolute transition-[opacity] duration-200 ease-[cubic-bezier(.2,.7,.3,1)]" style={{ left: `${d.box!.x}%`, top: `${d.box!.y}%`, width: `${d.box!.w}%`, height: `${d.box!.h}%`, opacity: shown ? 1 : 0 }}>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); demo.openZoomFor(keyOf(d)); }}
                                onMouseEnter={() => demo.setHoverKey(keyOf(d))}
                                onMouseLeave={() => demo.setHoverKey(null)}
                                aria-label={D.findingText(d)}
                                className="absolute -inset-[3px] cursor-zoom-in rounded-[var(--radius-xs)] p-0"
                                style={{ border: `${hot ? 3 : 2}px solid ${col.box}`, background: hot ? "rgba(255,255,255,.12)" : "transparent", boxShadow: hot ? "0 0 0 3px rgba(0,82,204,.35)" : "none" }}
                              />
                              <span className="pointer-events-none absolute -left-[3px] bottom-full mb-[3px] whitespace-nowrap rounded-[3px] px-1 py-px text-[10px] font-semibold text-white" style={{ background: col.label }}>{d.type}</span>
                            </div>
                          );
                        })}
                      </>
                    )}
                    {!taken && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1" style={{ color: waitingPhotos ? "var(--brand-primary)" : "var(--text-tertiary)" }}>
                        <Ico name="camera" size={22} />
                        <span className="text-xs font-medium">{waitingPhotos ? "Tap to take" : "Waiting"}</span>
                      </div>
                    )}
                    {scanning && (
                      <>
                        <div className="pointer-events-none absolute inset-x-0 top-0" style={{ height: D.pct(D.clamp((tc - scanS) / scan)), background: "rgba(0,82,204,.08)" }} />
                        <div className="pointer-events-none absolute inset-x-0" style={{ top: D.pct(D.clamp((tc - scanS) / scan)), height: 2, background: "var(--brand-accent)", boxShadow: "0 0 0 3px rgba(255,86,48,.2)" }} />
                      </>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: flash }} />
                  </div>
                  <div className="flex min-w-0 justify-between gap-1.5 text-xs">
                    <span className="font-semibold">{a}</span>
                    <span className="overflow-hidden text-ellipsis whitespace-nowrap" style={{ color: noteColor, fontWeight: scanned ? 600 : 400 }}>{note}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {state.checklist && (
          <div className="flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)]">
            {D.CHECKLIST.map((q) => (
              <div key={q.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-3 py-2.5">
                <span className="text-sm">{q.q}</span>
                <div role="radiogroup" aria-label={q.q} className="flex flex-wrap gap-1.5">
                  {q.options.map((o) => {
                    const on = answersEff[q.id] === o;
                    return (
                      <button
                        key={o}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => demo.answer(q.id, o)}
                        className="min-h-9 cursor-pointer rounded-[var(--radius-sm)] border px-3 text-[13px] font-medium"
                        style={{ borderColor: on ? "var(--brand-primary)" : "var(--border-default)", background: on ? "var(--brand-primary)" : "var(--surface-card)", color: on ? "var(--text-on-brand)" : "var(--text-primary)" }}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div aria-label="Gadget Lens analysis" className="flex min-w-0 flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-page)] p-4">
        {!state.checklist && (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Ico name="sparkle" color="var(--brand-primary)" />
                <span className={EYEBROW}>AI is looking at each photo</span>
              </div>
              {lensSteps.map((st) => (
                <div key={st.label} className="flex min-h-6 items-center gap-2 text-sm" style={{ color: st.done || st.running ? "var(--text-primary)" : "var(--text-tertiary)" }}>
                  {st.done && <Ico name="checkCircle" size={18} color="var(--status-success)" />}
                  {st.running && <Spinner size={16} />}
                  {st.pending && <Ico name="circle" size={18} color="var(--border-default)" />}
                  <span>{st.label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={EYEBROW}>What the AI found</span>
                <span className="font-mono text-xs text-[var(--text-tertiary)]">{visibleFindings.length}</span>
              </div>
              {visibleFindings.map((d) => {
                const fp = rm ? 1 : D.ease((tc - revealAt(d)) / 300);
                const hot = state.hoverKey === keyOf(d);
                const enter = () => demo.setHoverKey(keyOf(d));
                const leave = () => demo.setHoverKey(null);
                return (
                  <button
                    key={keyOf(d)}
                    type="button"
                    onClick={() => demo.openZoomFor(keyOf(d))}
                    onMouseEnter={enter}
                    onMouseLeave={leave}
                    onFocus={enter}
                    onBlur={leave}
                    className="flex min-h-11 w-full cursor-zoom-in items-center gap-2.5 rounded-[var(--radius-sm)] border bg-[var(--surface-card)] px-2.5 py-2 text-left"
                    style={{ borderColor: hot ? "var(--brand-primary)" : "var(--border-subtle)", opacity: fp.toFixed(2), transform: `translateY(${((1 - fp) * 6).toFixed(1)}px)` }}
                  >
                    <span className="h-2.5 w-2.5 flex-none rounded-[2px]" style={{ background: SEV_COLOR[d.severity].box }} />
                    <span className="flex min-w-0 flex-1 flex-col gap-px">
                      <span className="text-sm font-semibold">{d.type} · {d.where}</span>
                      <span className="text-xs text-[var(--text-secondary)]">{d.severity}</span>
                    </span>
                    <span className="flex-none font-mono text-[13px] font-semibold">{d.confidence}% sure</span>
                    <Ico name="zoom" color="var(--text-tertiary)" className="flex-none" />
                  </button>
                );
              })}
              {!visibleFindings.length && <span className="text-[13px] text-[var(--text-tertiary)]">{tc >= tlc.scanEnd ? "No marks found." : "Findings appear here as each photo is checked."}</span>}
            </div>
          </>
        )}

        <div className="flex flex-col gap-3" style={{ paddingTop: state.checklist ? 0 : 16, borderTop: state.checklist ? "none" : "1px solid var(--border-subtle)" }}>
          <span className={EYEBROW}>{state.checklist ? "Checklist grade" : "Grade and confidence"}</span>
          <div className="flex min-h-24 flex-wrap items-center justify-between gap-4">
            {gradeShown && (
              <>
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="origin-left font-display text-[64px] font-extrabold leading-none tracking-[-0.022em]" style={{ color: gradeRes.color, transform: `scale(${(0.7 + 0.3 * gp).toFixed(3)})`, opacity: gp.toFixed(2) }}>{gradeRes.letter}</span>
                  <div className="flex min-w-0 flex-col gap-0.5" style={{ opacity: gp.toFixed(2) }}>
                    <span className="font-display text-xl font-bold">{gradeRes.letter} · {gradeRes.name}</span>
                    <span className="text-[13px] text-[var(--text-secondary)]">{gradeRes.meaning}</span>
                  </div>
                </div>
                {!state.checklist && (
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-[76px] w-[76px] flex-none">
                      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-sunken)" strokeWidth="10" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke={TONE_COLOR[lc.tone]} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${((C * sc.confidence * rp) / 100).toFixed(1)} ${C.toFixed(1)}`} />
                      </svg>
                      <span className="absolute inset-0 grid place-items-center font-display text-lg font-bold">{Math.round(sc.confidence * rp)}%</span>
                    </div>
                    <span className="max-w-[110px] text-xs leading-[1.4] text-[var(--text-secondary)]">How sure the AI is about this grade</span>
                  </div>
                )}
                {state.checklist && <Badge tone="neutral">Checklist grade</Badge>}
              </>
            )}
            {!gradeShown && (
              <div className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                <Ico name="sigma" size={20} />
                <span>{state.checklist ? "Grade appears after the answers." : "Grade appears after the scan."}</span>
              </div>
            )}
          </div>
          {gradeShown && !state.checklist && rp >= 1 && (
            <div className="flex items-start gap-2 text-[13px] font-medium" style={{ color: TONE_COLOR[lc.tone] }}>
              <Ico name="shield" className="mt-px flex-none" />
              <span>{lc.text}</span>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Why this grade</span>
            {gradeShown ? (
              why.items.map((x, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                  <Ico name={defects.length ? "warn" : "check"} color={defects.length ? "var(--status-warning)" : "var(--status-success)"} className="mt-0.5 flex-none" />
                  <span>{x}</span>
                </div>
              ))
            ) : (
              <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <Ico name="sigma" color="var(--text-tertiary)" className="mt-0.5 flex-none" />
                <span>Shown once the grade is ready.</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(7,minmax(0,1fr))" }}>
              {D.GRADE_SCALE.map((g) => {
                const on = gradeShown && g.letter === gradeRes.letter;
                return (
                  <div
                    key={g.letter}
                    title={`${g.letter} · ${g.name}: ${g.meaning}`}
                    className="grid h-7 place-items-center rounded-[var(--radius-xs)] text-xs font-bold transition-[background] duration-200 ease-[cubic-bezier(.2,.7,.3,1)]"
                    style={{ background: on ? g.color : "var(--surface-sunken)", color: on ? "var(--text-on-brand)" : "var(--text-tertiary)" }}
                  >
                    {g.letter}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-tertiary)]"><span>Like new</span><span>For parts</span></div>
          </div>
          {gradeShown && <Button variant="primary" full onClick={demo.next} iconAfter={<Ico name="arrowRight" />}>Next: certificate</Button>}
          {!state.checklist && <span className="text-xs text-[var(--text-tertiary)]">Gadget Lens AI grading is in Beta.</span>}
        </div>
      </div>
    </div>
  );
}
