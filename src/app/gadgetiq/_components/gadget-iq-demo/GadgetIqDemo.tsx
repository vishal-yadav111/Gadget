"use client";

import { useMemo, type CSSProperties } from "react";
import * as D from "./data";
import { useGadgetIqDemo, type DemoOptions } from "./useGadgetIqDemo";
import { STAGES, type Stage } from "./types";
import { Segmented } from "./ui";
import { StepRail, NarrowStepRail } from "./chrome/StepRail";
import { NarrationBar } from "./chrome/NarrationBar";
import { AppHeaderBar } from "./chrome/AppHeaderBar";
import { LiveSummarySidebar, type PinnedFail, type SummaryRow } from "./chrome/Sidebar";
import { PlaybackControls } from "./chrome/PlaybackControls";
import { MobileDock } from "./chrome/MobileDock";
import { EnterChip, NextPill, Toast, PlayOverlay, FlightCard } from "./chrome/Transients";
import { LicenceWalletPopover, TopupModal, ZoomModal, DeviceDrawer, MoreOptionsSheet } from "./chrome/Overlays";
import { markPaths } from "./renders";
import { currentTest, narrateTest } from "./stages/spotlightLogic";
import { IntakeStage } from "./stages/IntakeStage";
import { FunctionalStage } from "./stages/FunctionalStage";
import { CosmeticStage } from "./stages/CosmeticStage";
import { CertificateStage } from "./stages/CertificateStage";
import { AdminStage } from "./stages/AdminStage";
import { EndStage } from "./stages/EndStage";

const APP_TITLE: Record<Stage, (checklist: boolean) => string> = {
  intake: () => "Gadget IQ · New check",
  functional: () => "Gadget Evaluate",
  cosmetic: (cl) => (cl ? "Gadget Lens · Checklist" : "Gadget Lens"),
  certificate: () => "Gadget IQ · Certificate",
  admin: () => "Gadget IQ · Admin view",
  end: () => "Gadget IQ",
};
const STAGE_LABEL_MAP: Record<(typeof STAGES)[number], string> = {
  intake: "Device", functional: "Evaluate: Functional test", cosmetic: "Lens: AI grading", certificate: "Certificate", admin: "Admin view",
};

/* Design-system tokens the demo is built from, scoped to the section so the rest of the site is unaffected. */
const DS_TOKENS = {
  background: "var(--surface-page)",
  fontSize: 16,
  lineHeight: 1.55,
  textWrap: "pretty",
  "--shadow-sm": "0 1px 2px rgba(23,40,77,.07)",
  "--shadow-md": "0 6px 18px rgba(0,82,204,.10)",
  "--shadow-lg": "0 18px 44px rgba(0,82,204,.16)",
  "--shadow-focus": "0 0 0 4px rgba(0,82,204,.24)",
  "--text-on-accent": "#2A0A00",
  "--accent-ink": "#B93A08",
  /* the reference lets every text size inherit the body's 1.55 leading */
  "--text-xs--line-height": 1.55,
  "--text-sm--line-height": 1.55,
  "--text-base--line-height": 1.55,
  "--text-lg--line-height": 1.55,
  "--text-xl--line-height": 1.55,
  "--text-2xl--line-height": 1.55,
  "--text-3xl--line-height": 1.55,
  "--text-4xl--line-height": 1.55,
  "--text-5xl--line-height": 1.55,
  "--text-6xl--line-height": 1.55,
} as CSSProperties;

export default function GadgetIqDemo({ compact = false, ...options }: { compact?: boolean } & DemoOptions) {
  const demo = useGadgetIqDemo(options);
  const { state, refs, tlc } = demo;
  const sc = demo.sc();
  const fr = useMemo(() => D.functionalResults(sc), [sc]);

  const narrow = state.width < 760;
  const wide = !narrow;
  const st = state.stage;
  const si = st === "end" ? 5 : STAGES.indexOf(st as (typeof STAGES)[number]);
  const tryM = state.mode === "try";
  const at = (k: (typeof STAGES)[number]) => (st === k ? state.t : si > STAGES.indexOf(k) ? Infinity : -1);
  const ti = at("intake"), tf = at("functional"), tc = at("cosmetic"), tcert = at("certificate"), ta = at("admin");

  const evalUsed = !!state.deviceId && si >= 1;
  const lensUsed = !!state.deviceId && (si > 2 ? state.lensUsed : st === "cosmetic" && !state.checklist && tc >= tlc.capEnd);
  const evalLeft = D.licencesLeft("evaluate", evalUsed);
  const lensLeft = D.licencesLeft("lens", lensUsed);
  const licenceRows = D.LICENCE_TYPES.map((x) => ({
    name: x.name,
    left: x.id === "evaluate" ? evalLeft : lensLeft,
    usedToday: D.ADMIN_DEVICES.length + ((x.id === "evaluate" ? evalUsed : lensUsed) ? 1 : 0),
    use: x.use,
  }));

  const defects = state.checklist ? D.defectsFromChecklist(D.checklistFromDefects(sc.defects), sc) : sc.defects;
  const gradeRes = D.gradeFromDefects(defects);
  const gAt = state.checklist ? tlc.clGradeAt : tlc.gradeAt;
  const gradeShown = tc >= gAt;
  const certId = D.makeCertId(sc.specs["Serial No."]);
  const T = D.TIMINGS;
  const vStart = state.verifyStart != null ? state.verifyStart : state.mode !== "try" ? T.certificate.verifyAt : null;
  const vState = vStart == null || tcert < vStart ? "idle" : tcert < vStart + T.certificate.verifyDur ? "checking" : "done";

  const doneTests = tlc.sched.filter((x) => tf >= x.end);
  const fnFailedNow: PinnedFail[] = doneTests.filter((x) => !fr.res[x.id].pass).map((x) => ({ testName: x.testName, reason: fr.res[x.id].reason }));
  const fnDone = doneTests.length;
  const nT = D.TESTS.length;
  const evalNow = `${doneTests.length - fnFailedNow.length} passed · ${fnFailedNow.length} failed`;

  const summaryRows: SummaryRow[] = [
    { k: "Device", v: state.deviceId ? sc.name : "Not picked yet", sub: state.deviceId && (si > 0 || ti >= T.intake.slideIn + 2 * T.intake.field + T.intake.field * 0.75) ? sc.specs["Serial No."] : "", subFont: "var(--font-mono)" },
    { k: "Licences left", v: `Evaluate ${evalLeft} · Lens ${lensLeft}`, sub: evalUsed || lensUsed ? `Used for this check: ${[evalUsed && "Evaluate", lensUsed && "Lens"].filter(Boolean).join(" and ")}` : "Each check uses 1 of each" },
    { k: "Gadget Evaluate", v: si >= 1 ? evalNow : "Pending", color: fnFailedNow.length && si >= 1 ? "var(--status-danger)" : "var(--text-primary)", sub: si >= 1 ? `${fnDone} of ${nT} tests` : "", bar: si >= 1 ? D.pct(fnDone / nT) : "" },
    { k: "Gadget Lens grade", v: gradeShown ? `${gradeRes.letter} · ${gradeRes.name}` : "Pending", color: gradeShown ? gradeRes.color : "var(--text-primary)", sub: gradeShown ? (state.checklist ? "Checklist grade" : `${sc.confidence}% sure`) : "" },
    { k: "Certificate", v: tcert >= T.certificate.merge ? certId : "Pending", font: "var(--font-mono)", sub: vState === "done" ? "Verified" : "" },
  ];

  // Narration bar text. Mirrors the reference demo's wording for every stage and gate.
  let narration = "";
  const w = state.waiting;
  const T2 = D.TIMINGS;
  const revealAt = (d: D.Defect) => {
    const ai = D.ANGLES.indexOf(d.angle);
    const k = sc.defects.filter((x) => x.angle === d.angle).indexOf(d);
    return tlc.capEnd + (ai + 1) * T2.cosmetic.scan - 150 + k * 220;
  };
  const why = D.explainGrade(defects);
  if (st === "intake") {
    if (!state.deviceId) narration = tryM ? "Pick a laptop to check. Each one tells a different story." : "Press Start the demo to watch a full check, or pick a laptop yourself.";
    else if (ti < T.intake.slideIn) narration = "Connecting the laptop to Gadget IQ.";
    else if (ti < tlc.fieldsEnd) narration = "Reading the laptop's details. No typing needed.";
    else narration = w === "start" ? "All details found. Press Start check to begin. It uses 1 Gadget Evaluate licence." : "All details found. Starting the check uses 1 Gadget Evaluate licence.";
  } else if (st === "functional") {
    const cur = currentTest(tlc.sched, tlc, tf, fr);
    narration = tf >= tlc.testsEnd ? `Gadget Evaluate is done: ${fr.passed} passed, ${fr.failed.length} failed.` : narrateTest(cur.curT, fr, w, cur.cstat);
  } else if (st === "cosmetic") {
    const recent = state.checklist ? undefined : sc.defects.filter((d) => tc >= revealAt(d) && tc - revealAt(d) < 1800).pop();
    if (state.checklist) narration = w === "checklist" ? "Your turn: answer 6 quick questions about the laptop." : gradeShown ? `Grade ${gradeRes.letter} from the checklist, because of ${why.sentence}.` : "Answering 6 quick questions instead of using AI. Same grade rules.";
    else if (w === "photos") narration = "Your turn: tap each slot to take the photo.";
    else if (tc < tlc.capEnd) narration = "Taking 6 photos: front, back, both sides, top and bottom.";
    else if (gradeShown) narration = `Grade ${gradeRes.letter}. The AI is ${sc.confidence}% sure about this grade.`;
    else if (recent) narration = `Found a ${recent.severity.toLowerCase()} ${recent.type.toLowerCase()} on the ${recent.area}. The AI is ${recent.confidence}% sure.`;
    else narration = "Gadget Lens is looking at 6 photos for scratches, dents and cracks.";
  } else if (st === "certificate") {
    if (tcert < T.certificate.merge) narration = "Joining the Gadget Evaluate result and the Gadget Lens grade into one certificate.";
    else if (vState === "checking") narration = "Checking this certificate against our records.";
    else if (vState === "done") narration = "Verified. This certificate matches our records.";
    else if (w === "verify") narration = "Your turn: press Verify to check the certificate.";
    else narration = "The certificate is ready. Buyers can scan the QR code to check it.";
  } else if (st === "admin") {
    const tips = D.ADMIN_TIPS;
    const tipI = D.clamp(state.tipTouched ? state.tipIdx : tryM ? state.tipIdx : Math.max(0, T.admin.tips.filter((x) => ta >= x).length - 1), 0, tips.length - 1);
    narration = ta < T.admin.flight
      ? "The report goes straight into your admin view."
      : tryM
        ? `Your turn: follow the quick tour, then try the filters yourself. Tip ${tipI + 1} of ${tips.length}.`
        : `Quick tour of the admin view. Tip ${tipI + 1} of ${tips.length}: ${tips[tipI].title.toLowerCase()}.`;
  } else narration = "One laptop, fully checked.";

  const GATE_LABEL: Record<string, string> = { start: "Start check", verify: "Verify", explore: "Finish tour", next: st === "functional" ? "Next: Gadget Lens" : st === "cosmetic" ? "Next: certificate" : "Next: admin view" };
  const gateAction = tryM && w && GATE_LABEL[w] ? GATE_LABEL[w] : "";

  const playing = state.playing && state.started;
  const durOf = demo.durOf(st);
  const remain = st !== "end" && state.deviceId ? (durOf - state.t) / state.speed : Infinity;
  const PILL = 2800, CP = 2 * Math.PI * 9, CC = 2 * Math.PI * 10;
  const showNextPill = !tryM && playing && remain < PILL && !state.waiting && !state.overlay;
  const clock = state.clock;
  const ep = state.enterAt ? (clock - state.enterAt) / 1400 : 2;
  const stageP = state.reduced ? 1 : D.ease(ep * 3.5);
  const chipIn = D.clamp(ep / 0.12), chipOut = 1 - D.clamp((ep - 0.72) / 0.28);
  const stageO = state.reduced ? D.clamp(ep * 4) : stageP;
  const stageY = (1 - stageP) * 10;

  const showPlayOverlay = !state.started && st !== "intake" && st !== "end";
  const dockOn = narrow && state.inView;

  const zd = state.zoom != null ? sc.defects[state.zoom] : null;
  const dRow = state.drawerId ? [{ id: "demo", model: sc.name, serial: sc.specs["Serial No."], site: D.DEMO_SITE, tech: D.DEMO_TECH, at: new Date(), fails: Object.keys(sc.fails), defects, grade: gradeRes.letter, certId, batteryHealth: sc.batteryHealth }, ...D.ADMIN_DEVICES].find((r) => r.id === state.drawerId) : null;
  const gColor = (l: string) => D.GRADE_SCALE.find((g) => g.letter === l)?.color || "var(--text-primary)";

  return (
    <section
      ref={refs.rootRef}
      id="giq-demo"
      aria-label="Gadget IQ interactive demo"
      className="box-border max-w-full overflow-x-clip px-4 pb-10 pt-12 font-sans text-[var(--text-primary)] antialiased [&_button:focus-visible]:shadow-[var(--shadow-focus)] [&_button:focus-visible]:outline-none"
      style={DS_TOKENS}
    >
      <div className="mx-auto flex min-w-0 max-w-[1240px] flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          {!compact && (
            <div className="flex max-w-[720px] min-w-0 flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-ink)]">Interactive demo</span>
              <h2 className="m-0 font-display text-[clamp(26px,3.2vw,34px)] font-bold leading-[1.18] tracking-[-0.012em] [text-wrap:balance]">See Gadget IQ check a laptop, from first test to final certificate</h2>
              <p className="m-0 text-[clamp(15px,1.3vw,16px)] leading-[1.55] text-[var(--text-secondary)]">Gadget Evaluate tests how it works. Gadget Lens grades how it looks. Watch it run, or try each step yourself.</p>
            </div>
          )}
          {wide && (
            <Segmented
              options={[{ value: "watch" as const, label: "Watch it run" }, { value: "try" as const, label: "Try it yourself" }]}
              value={state.mode}
              onChange={demo.setMode}
              ariaLabel="Demo mode"
            />
          )}
        </div>

        {wide && (
          <StepRail
            stageIndex={si}
            width={state.width}
            deviceId={state.deviceId}
            onGo={(k) => demo.enter(k, { playing: true, started: true })}
            onPicker={demo.toPicker}
          />
        )}
        {narrow && <NarrowStepRail stage={st} stageIndex={si} />}

        <NarrationBar
          narration={narration}
          gateAction={gateAction}
          gateGo={() => demo.doGate(state.waiting, false)}
          showDoIt={tryM && st !== "end" && !!state.deviceId}
          doItDisabled={!state.waiting}
          doItForMe={() => demo.doGate(state.waiting, true)}
        />

        <div className="flex min-w-0 flex-wrap items-start gap-4">
          <div className="flex min-w-0 max-w-full flex-[999_1_622px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-md)]">
            <AppHeaderBar
              appTitle={APP_TITLE[st](state.checklist)}
              showBeta={st === "cosmetic" && !state.checklist && D.AI_GRADING_BETA}
              walletText={state.sw < 900 ? `${evalLeft} · ${lensLeft}` : `Evaluate ${evalLeft} · Lens ${lensLeft}`}
              walletAria={`Licence wallet: ${evalLeft} Gadget Evaluate and ${lensLeft} Gadget Lens licences left`}
              onOpenLicence={() => demo.update({ overlay: state.overlay === "licence" ? null : "licence" })}
            />
            <div ref={refs.bodyRef} className="relative bg-[var(--surface-card)]" style={{ minHeight: 520 }}>
              <div style={{ opacity: stageO.toFixed(2), transform: `translateY(${stageY.toFixed(1)}px)` }}>
                {st === "intake" && <IntakeStage state={state} demo={demo} tryMode={tryM} ti={ti} />}
                {st === "functional" && <FunctionalStage state={state} demo={demo} tf={tf} />}
                {st === "cosmetic" && <CosmeticStage state={state} demo={demo} tc={tc} sw={state.sw} />}
                {st === "certificate" && <CertificateStage state={state} demo={demo} tcert={tcert} sw={state.sw} />}
                {st === "admin" && <AdminStage state={state} demo={demo} ta={ta} sw={state.sw} narrow={narrow} />}
                {st === "end" && <EndStage state={state} demo={demo} />}
              </div>

              <EnterChip
                show={ep < 1 && !!state.deviceId}
                opacity={Math.min(chipIn, chipOut)}
                y={state.reduced ? "0px" : `${((1 - D.ease(chipIn)) * -8).toFixed(1)}px`}
                dash={`${(CC * (state.reduced ? 1 : D.ease(ep * 1.6))).toFixed(1)} ${CC.toFixed(1)}`}
                n={st === "end" ? "5" : String(si + 1)}
                label={st === "end" ? "All 5 steps done" : `Step ${si + 1} of 5 · ${STAGE_LABEL_MAP[st as (typeof STAGES)[number]] || ""}`}
              />
              <NextPill
                show={showNextPill}
                dash={`${(CP * D.clamp(1 - remain / PILL)).toFixed(1)} ${CP.toFixed(1)}`}
                label={st === "admin" ? "Summary" : STAGE_LABEL_MAP[STAGES[si + 1]] || ""}
                onStayHere={() => demo.update({ playing: false })}
              />
              <PlayOverlay show={showPlayOverlay} onTogglePlay={demo.togglePlay} />
              <FlightCard
                show={st === "admin" && !narrow && !state.reduced && !!state.flight && ta < T.admin.flight}
                x={state.flight ? `${(state.flight.sx + (state.flight.ex - state.flight.sx) * D.ease(ta / T.admin.flight)).toFixed(1)}px` : "0px"}
                y={state.flight ? `${(state.flight.sy + (state.flight.ey - state.flight.sy) * D.ease(ta / T.admin.flight)).toFixed(1)}px` : "0px"}
                scale={state.flight ? 1 + (state.flight.es - 1) * D.ease(ta / T.admin.flight) : 1}
                opacity={1 - D.clamp((D.ease(ta / T.admin.flight) - 0.8) / 0.2)}
                devName={sc.name}
                grade={gradeRes}
                certId={certId}
              />

              {state.overlay === "licence" && (
                <LicenceWalletPopover dialogRef={refs.dialogRef} rows={licenceRows} rule={D.LICENCE_WALLET.rule} onTopup={() => demo.openOverlay("topup")} onClose={demo.closeOverlay} />
              )}
              <Toast text={state.toast && clock < state.toast.until ? state.toast.text : ""} icon={state.toast?.icon || "info"} opacity={state.toast ? D.clamp((state.toast.until - clock) / 200) : 0} />
            </div>
          </div>

          {wide && <LiveSummarySidebar pinnedFails={fnFailedNow} summaryRows={summaryRows} />}
        </div>

        {wide && (
          <PlaybackControls
            playing={playing}
            playLabel={playing ? "Pause" : st === "end" ? "Replay" : "Play"}
            onTogglePlay={demo.togglePlay}
            speedVal={state.speed === 2 ? "2x" : "1x"}
            onSetSpeed={(v) => demo.update({ speed: v === "2x" ? 2 : 1 })}
            onPrev={demo.prev}
            onNext={demo.next}
            onRestart={demo.restart}
            showKbd={!state.touch}
          />
        )}
        <p className="m-0 text-xs text-[var(--text-secondary)]">This is a demo with sample laptops and sample test results.</p>
        {dockOn && <div aria-hidden="true" style={{ height: 112 }} />}
      </div>

      {dockOn && (
        <MobileDock
          summaryOpen={state.summaryOpen}
          toggleSummary={demo.toggleSummary}
          pinnedFails={fnFailedNow}
          summaryRows={summaryRows}
          dockSummary={!state.deviceId ? "Pick a laptop to start" : [sc.name, si >= 1 ? `${doneTests.length - fnFailedNow.length}/${nT}` : null, gradeShown ? `Grade ${gradeRes.letter}` : null].filter(Boolean).join(" · ")}
          playing={playing}
          playLabel={playing ? "Pause" : "Play"}
          onPrev={demo.prev}
          onTogglePlay={demo.togglePlay}
          onNext={demo.next}
          onOpenMore={() => demo.openOverlay("more")}
        />
      )}

      {state.overlay === "more" && (
        <MoreOptionsSheet
          dialogRef={refs.dialogRef}
          mode={state.mode}
          setMode={demo.setMode}
          speedVal={state.speed === 2 ? "2x" : "1x"}
          setSpeed={(v) => demo.update({ speed: v === "2x" ? 2 : 1 })}
          onRestartClose={() => { demo.closeOverlay(); demo.restart(); }}
          onClose={demo.closeOverlay}
        />
      )}
      {state.overlay === "topup" && (
        <TopupModal
          dialogRef={refs.dialogRef}
          groups={licenceRows.map((l) => ({ name: l.name, left: l.left, packs: D.LICENCE_WALLET.packs }))}
          onChoose={() => { demo.closeOverlay(); demo.showToast("Demo only. No payment taken.", "info"); }}
          onClose={demo.closeOverlay}
        />
      )}
      {state.overlay === "zoom" && zd && (
        <ZoomModal
          dialogRef={refs.dialogRef}
          narrow={narrow}
          zoom={{
            title: `${zd.type} · ${zd.where}`,
            imgBg: `url("${demo.imgFor(sc.id, zd.angle)}")`,
            marks: markPaths(zd),
            x: `${zd.box!.x}%`, y: `${zd.box!.y}%`, w: `${zd.box!.w}%`, h: `${zd.box!.h}%`,
            color: zd.severity === "Severe" ? "var(--status-danger)" : zd.severity === "Medium" ? "var(--brand-accent)" : "oklch(0.8 0.15 80)",
            origin: `${zd.box!.x + zd.box!.w / 2}% ${zd.box!.y + zd.box!.h / 2}%`,
            text: `${zd.angle} photo · ${zd.severity}`,
            conf: `${zd.confidence}% sure`,
          }}
          onClose={demo.closeOverlay}
        />
      )}
      {state.overlay === "drawer" && dRow && (
        <DeviceDrawer
          dialogRef={refs.dialogRef}
          drawer={{
            model: dRow.model,
            grade: dRow.grade,
            gradeColor: gColor(dRow.grade),
            certId: dRow.certId,
            fields: [
              { k: "Serial No.", v: dRow.serial, font: "var(--font-mono)" },
              { k: "Site", v: dRow.site },
              { k: "Technician", v: dRow.tech },
              { k: "Checked", v: `Today, ${D.fmtTime(dRow.at)}` },
              { k: "Gadget Evaluate", v: dRow.fails.length ? `${nT - dRow.fails.length}/${nT} passed · ${dRow.fails.map((f) => D.failureLabel(f)).join(", ")} failed` : `${nT}/${nT} passed` },
              { k: "Battery health", v: `${dRow.batteryHealth}% (limit ${D.BATTERY_LIMIT}%)` },
              { k: "Gadget Lens", v: `Grade ${dRow.grade} · ${D.explainGrade(dRow.defects).items.join(", ")}` },
            ],
          }}
          onClose={demo.closeOverlay}
        />
      )}
    </section>
  );
}
