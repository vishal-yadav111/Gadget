"use client";

import { useMemo } from "react";
import * as D from "../data";
import type { DemoState } from "../types";
import type { GadgetIqDemo } from "../useGadgetIqDemo";
import { Badge, Button } from "../ui";
import { Ico } from "../icons";
import { computeSpotlight, currentTest, testStatus, type TestStatus } from "./spotlightLogic";
import { Spotlight } from "./Spotlight";

const CHIP: Record<TestStatus, [string, "neutral" | "brand" | "success" | "danger"]> = {
  wait: ["Waiting", "neutral"],
  run: ["Running…", "brand"],
  pass: ["Passed", "success"],
  fail: ["Failed", "danger"],
};

export function FunctionalStage({ state, demo, tf }: { state: DemoState; demo: GadgetIqDemo; tf: number }) {
  const sc = demo.sc();
  const fr = useMemo(() => D.functionalResults(sc), [sc]);
  const tlc = demo.tlc;
  const sched = tlc.sched;
  const wide = state.sw >= 640;

  const { curT, cstat, p } = currentTest(sched, tlc, tf, fr);
  const doneTests = sched.filter((x) => tf >= x.end);
  const fnFailedNow = doneTests.filter((x) => !fr.res[x.id].pass);
  const fnDone = doneTests.length;
  const nT = D.TESTS.length;
  const C = 2 * Math.PI * 42;
  const tryM = state.mode === "try";
  const clock = state.clock;
  const flashOn = !!state.flashId && clock < demo.mut.flashUntil;

  const sp = useMemo(
    () => computeSpotlight({ x: curT, p, cstat, sc, fr, clock, tryM, state, tlc, wave: demo.mut.wave, registerKey: demo.registerKey }),
    [curT, p, cstat, sc, fr, clock, state, tlc, tryM, demo]
  );

  const curIdx = sched.indexOf(curT);
  const nextUp = tf >= tlc.testsEnd ? [] : sched.slice(curIdx + 1, curIdx + 4);
  const sumP = state.reduced ? 1 : D.ease((tf - tlc.testsEnd - 300) / 400);
  const showFnSummary = tf >= tlc.testsEnd + 300;

  return (
    <div className="grid items-start gap-4 p-4" style={{ gridTemplateColumns: wide ? "260px minmax(0,1fr)" : "minmax(0,1fr)" }}>
      <div className="flex min-w-0 flex-col gap-3" style={{ order: wide ? 0 : 2 }}>
        {fnFailedNow.length > 0 && (
          <div className="flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--status-danger)] bg-[rgba(199,48,10,.06)] px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--status-danger)]">
              <Ico name="warn" size={18} />
              {fnFailedNow.length} need{fnFailedNow.length === 1 ? "s" : ""} attention
            </div>
            {fnFailedNow.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => demo.jumpToFailed(x.id)}
                className="flex min-h-9 cursor-pointer flex-col justify-center gap-px border-none bg-transparent py-1 text-left text-[13px] text-[var(--text-primary)]"
              >
                <strong className="font-semibold">{x.testName}</strong>
                <span className="text-[var(--status-danger)]">{fr.res[x.id].reason}</span>
              </button>
            ))}
          </div>
        )}
        <div
          ref={demo.refs.listRef}
          aria-label="Test list"
          className="relative overflow-auto rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)]"
          style={{ maxHeight: wide ? 470 : 340 }}
        >
          {D.TEST_GROUPS.map((g) => {
            const items = sched.filter((x) => x.group === g);
            return (
              <div key={g}>
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-sunken)] px-3 pb-1.5 pt-2.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">{g}</span>
                  <span className="font-mono text-xs text-[var(--text-tertiary)]">{items.filter((x) => tf >= x.end).length}/{items.length}</span>
                </div>
                {items.map((x) => {
                  const stt = testStatus(x, tf, fr);
                  const [chip, tone] = CHIP[stt];
                  return (
                    <div
                      key={x.id}
                      data-row={x.id}
                      className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-3 py-2 transition-[background] duration-200 ease-[cubic-bezier(.2,.7,.3,1)]"
                      style={{
                        background: stt === "run" ? "var(--surface-sunken)" : stt === "fail" ? "rgba(199,48,10,.07)" : "transparent",
                        boxShadow: flashOn && state.flashId === x.id ? "inset 0 0 0 2px var(--status-danger)" : "none",
                      }}
                    >
                      {stt === "fail" && <Ico name="warn" sw={2.2} color="var(--status-danger)" className="flex-none" />}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="text-xs font-semibold" style={{ color: stt === "fail" ? "var(--status-danger)" : "var(--text-secondary)" }}>{x.type}</span>
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">{x.testName}</span>
                        {stt === "fail" && <span className="text-xs leading-[1.4] text-[var(--status-danger)]">{fr.res[x.id].reason}</span>}
                      </div>
                      <Badge tone={tone}>{chip}</Badge>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div aria-hidden="true" className="pointer-events-none sticky bottom-0 -mt-7 h-7 bg-[linear-gradient(rgba(255,255,255,0),var(--surface-card))]" />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] px-3.5 py-2.5">
          <div className="relative h-14 w-14 flex-none">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-sunken)" strokeWidth="11" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--brand-primary)" strokeWidth="11" strokeDasharray={`${((C * fnDone) / nT).toFixed(1)} ${C.toFixed(1)}`} />
            </svg>
            <span className="absolute inset-0 grid place-items-center font-display text-[15px] font-bold">{fnDone}</span>
          </div>
          <div className="flex min-w-0 flex-1 basis-[120px] flex-col">
            <span className="text-sm font-semibold">{fnDone} of {nT} tests</span>
            <span className="text-xs text-[var(--text-secondary)]">Gadget Evaluate</span>
          </div>
          <div className="flex gap-3.5 text-[13px]">
            <span className="flex flex-col items-center"><strong className="font-display text-lg text-[var(--status-success)]">{doneTests.length - fnFailedNow.length}</strong><span className="text-[var(--text-secondary)]">Passed</span></span>
            <span className="flex flex-col items-center"><strong className="font-display text-lg text-[var(--status-danger)]">{fnFailedNow.length}</strong><span className="text-[var(--status-danger)]">Failed</span></span>
            <span className="flex flex-col items-center"><strong className="font-display text-lg">{nT - fnDone}</strong><span className="text-[var(--text-secondary)]">To go</span></span>
          </div>
        </div>

        <div
          className="flex min-w-0 flex-col gap-3 rounded-[var(--radius-md)] border bg-[var(--surface-page)] p-4"
          style={{ borderColor: cstat === "fail" ? "var(--status-danger)" : "var(--border-subtle)" }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-ink)]">Now testing</span>
              <span className="font-display text-xl font-bold tracking-[-0.012em]">{curT.testName}</span>
              <span className="text-sm text-[var(--text-secondary)]">{curT.type} · {curT.group}</span>
            </div>
            <Badge tone={CHIP[cstat][1]}>{CHIP[cstat][0]}</Badge>
          </div>
          <div className="flex min-h-[210px] items-center justify-center">
            <Spotlight sp={sp} onPlayTone={demo.playTone} onPadMove={demo.padMove} />
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">Next up</span>
          {nextUp.map((n) => (
            <div key={n.id} className="flex min-w-0 items-center justify-between gap-2 text-[13px]">
              <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"><strong className="font-semibold">{n.testName}</strong> · {n.type}</span>
              <span className="flex-none text-[var(--text-tertiary)]">{n.group}</span>
            </div>
          ))}
          {!nextUp.length && <span className="text-[13px] text-[var(--text-secondary)]">All tests done.</span>}
        </div>
      </div>

      {showFnSummary && (
        <div className="absolute inset-0 z-[4] grid place-items-center bg-[rgba(244,246,251,.84)] p-4">
          <div
            role="dialog"
            aria-label="Gadget Evaluate summary"
            className="flex w-full max-w-[440px] flex-col gap-3.5 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-lg)]"
            style={{ opacity: sumP.toFixed(2), transform: `translateY(${((1 - sumP) * 12).toFixed(1)}px)` }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-ink)]">Gadget Evaluate</span>
            <span className="font-display text-[26px] font-bold tracking-[-0.012em]">{fr.passed} passed, {fr.failed.length} failed</span>
            {fr.failed.map((f) => (
              <div key={f.id} className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-[rgba(199,48,10,.06)] p-2.5 text-sm text-[var(--status-danger)]">
                <Ico name="warn" size={18} className="mt-px flex-none" />
                <span><strong>{f.testName}:</strong> {f.reason}</span>
              </div>
            ))}
            <Button variant="primary" onClick={demo.next} iconAfter={<Ico name="arrowRight" />}>
              Next: Gadget Lens grade
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
