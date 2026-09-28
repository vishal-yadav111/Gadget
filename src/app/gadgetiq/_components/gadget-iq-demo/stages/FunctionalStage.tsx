"use client";

import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import * as D from "../data";
import type { ScheduledTest } from "../data";
import type { DemoState } from "../types";
import type { GadgetIqDemo } from "../useGadgetIqDemo";
import { computeSpotlight, narrateTest, type TestStatus } from "./spotlightLogic";
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

  const stat = (x: ScheduledTest): TestStatus => (tf < x.start ? "wait" : tf < x.end ? "run" : fr.res[x.id].pass ? "pass" : "fail");

  const curT = sched.find((x) => stat(x) === "run") || (tf >= tlc.testsEnd ? sched[sched.length - 1] : sched[0]);

  const cstat = stat(curT);
  const p = D.clamp((tf - curT.start) / curT.durationMs);
  const doneTests = sched.filter((x) => tf >= x.end);
  const fnFailedNow = doneTests.filter((x) => !fr.res[x.id].pass);
  const fnDone = doneTests.length;
  const nT = D.TESTS.length;
  const C = 2 * Math.PI * 42;
  const tryM = state.mode === "try";

  const sp = useMemo(
    () => computeSpotlight({ x: curT, p, cstat, sc, fr, clock: state.clock, tryM, state, tlc, wave: demo.mut.wave, registerKey: demo.registerKey }),
    [curT, p, cstat, sc, fr, state, tlc, tryM, demo]
  );

  const curIdx = sched.indexOf(curT);
  const nextUp = tf >= tlc.testsEnd ? [] : sched.slice(curIdx + 1, curIdx + 4);
  const narration = tf >= tlc.testsEnd ? "" : narrateTest(curT, fr, state.waiting, cstat);
  const sumP = state.reduced ? 1 : D.ease((tf - tlc.testsEnd - 300) / 400);
  const showFnSummary = tf >= tlc.testsEnd + 300;
  const spotBorder = cstat === "fail" ? "var(--status-danger)" : "var(--border-subtle)";

  return (
    <div className="grid grid-cols-1 items-start gap-4 p-4 sm:grid-cols-[260px_minmax(0,1fr)]">
      <div className="order-2 flex min-w-0 flex-col gap-3 sm:order-1">
        {fnFailedNow.length > 0 && (
          <div className="flex flex-col gap-1 rounded-lg border border-brand-critical p-2.5" style={{ background: "rgba(199,48,10,.06)" }}>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-brand-critical">
              <AlertTriangle size={18} />
              {fnFailedNow.length} need{fnFailedNow.length === 1 ? "s" : ""} attention
            </div>
            {fnFailedNow.map((x) => (
              <button
                key={x.id}
                onClick={() => demo.scrollToRow(x.id)}
                className="flex min-h-9 flex-col justify-center gap-0.5 border-none bg-none py-1 text-left text-[13px] text-[#17284D]"
              >
                <strong className="font-semibold">{x.testName}</strong>
                <span className="text-brand-critical">{fr.res[x.id].reason}</span>
              </button>
            ))}
          </div>
        )}
        <div ref={demo.refs.listRef} aria-label="Test list" className="relative max-h-[470px] overflow-auto rounded-lg border border-[#DDE4F3] bg-white sm:max-h-[340px]">
          {D.TEST_GROUPS.map((g) => {
            const items = sched.filter((x) => x.group === g);
            return (
              <div key={g}>
                <div className="flex items-center justify-between border-b border-[#DDE4F3] bg-[#E9EEF9] px-3 pb-1.5 pt-2.5">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4A5875]">{g}</span>
                  <span className="font-mono text-xs text-[#5F6A86]">{items.filter((x) => tf >= x.end).length}/{items.length}</span>
                </div>
                {items.map((x) => {
                  const stt = stat(x);
                  const [chip, tone] = CHIP[stt];
                  return (
                    <div
                      key={x.id}
                      data-row={x.id}
                      className="flex items-center gap-2 border-b border-[#DDE4F3] px-3 py-2 transition-colors"
                      style={{ background: stt === "run" ? "var(--surface-sunken)" : stt === "fail" ? "rgba(199,48,10,.07)" : "transparent" }}
                    >
                      {stt === "fail" && <AlertTriangle size={16} className="shrink-0 text-brand-critical" />}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="text-xs font-semibold" style={{ color: stt === "fail" ? "var(--status-danger)" : "var(--text-secondary)" }}>{x.testName}</span>
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">{x.type}</span>
                        {stt === "fail" && <span className="text-xs leading-snug text-brand-critical">{fr.res[x.id].reason}</span>}
                      </div>
                      <Badge tone={tone} size="sm">{chip}</Badge>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="order-1 flex min-w-0 flex-col gap-3 sm:order-2">
        <div className="flex flex-wrap items-center gap-3.5 rounded-lg border border-[#DDE4F3] px-3.5 py-2.5">
          <div className="relative h-14 w-14 shrink-0">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-sunken)" strokeWidth="11" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--brand-primary)" strokeWidth="11" strokeDasharray={`${((C * fnDone) / nT).toFixed(1)} ${C.toFixed(1)}`} />
            </svg>
            <span className="absolute inset-0 grid place-items-center font-display text-[15px] font-bold">{fnDone}</span>
          </div>
          <div className="flex min-w-0 flex-1 basis-[120px] flex-col">
            <span className="text-sm font-semibold">{fnDone} of {nT} tests</span>
            <span className="text-xs text-[#4A5875]">Gadget Evaluate</span>
          </div>
          <div className="flex gap-3.5 text-[13px]">
            <span className="flex flex-col items-center"><strong className="font-display text-lg text-brand-success">{doneTests.length - fnFailedNow.length}</strong><span className="text-[#4A5875]">Passed</span></span>
            <span className="flex flex-col items-center"><strong className="font-display text-lg text-brand-critical">{fnFailedNow.length}</strong><span className="text-brand-critical">Failed</span></span>
            <span className="flex flex-col items-center"><strong className="font-display text-lg">{nT - fnDone}</strong><span className="text-[#4A5875]">To go</span></span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 rounded-lg border bg-[#F4F6FB] p-4" style={{ borderColor: spotBorder }}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B93A08]">Now testing</span>
              <span className="font-display text-xl font-bold tracking-tight">{curT.testName}</span>
              <span className="text-sm text-[#4A5875]">{curT.type} · {curT.group}</span>
            </div>
            <Badge tone={CHIP[cstat][1]}>{CHIP[cstat][0]}</Badge>
          </div>
          <div className="flex min-h-[210px] items-center justify-center">
            <Spotlight sp={sp} onPlayTone={demo.playTone} onPadMove={demo.padMove} />
          </div>
        </div>

        {!!narration && <p className="m-0 text-sm text-[#4A5875]">{narration}</p>}

        <div className="flex flex-col gap-2 rounded-lg border border-[#DDE4F3] px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4A5875]">Next up</span>
          {nextUp.map((n) => (
            <div key={n.id} className="flex min-w-0 items-center justify-between gap-2 text-[13px]">
              <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"><strong className="font-semibold">{n.testName}</strong> · {n.type}</span>
              <span className="shrink-0 text-[#5F6A86]">{n.group}</span>
            </div>
          ))}
          {!nextUp.length && <span className="text-[13px] text-[#4A5875]">All tests done.</span>}
        </div>
      </div>

      {showFnSummary && (
        <div className="absolute inset-0 z-[4] grid place-items-center bg-[#F4F6FB]/84 p-4">
          <div
            role="dialog"
            aria-label="Gadget Evaluate summary"
            className="flex w-full max-w-[440px] flex-col gap-3.5 rounded-xl border border-[#DDE4F3] bg-white p-6 shadow-lg"
            style={{ opacity: sumP.toFixed(2), transform: `translateY(${((1 - sumP) * 12).toFixed(1)}px)` }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B93A08]">Gadget Evaluate</span>
            <span className="font-display text-2xl font-bold tracking-tight">{fr.passed} passed, {fr.failed.length} failed</span>
            {fr.failed.map((f) => (
              <div key={f.id} className="flex items-start gap-2 rounded-md p-2.5 text-sm text-brand-critical" style={{ background: "rgba(199,48,10,.06)" }}>
                <AlertTriangle size={18} className="mt-px shrink-0" />
                <span><strong>{f.testName}:</strong> {f.reason}</span>
              </div>
            ))}
            <button
              onClick={demo.next}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand-primary text-sm font-semibold text-white"
            >
              Next: Gadget Lens grade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
