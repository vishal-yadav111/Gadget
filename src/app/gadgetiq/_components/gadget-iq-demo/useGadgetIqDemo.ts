"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import * as D from "./data";
import { renderSrc } from "./renders";
import type { IconKey } from "./icons";
import { STAGES, createInitialState, type DemoState, type Mode, type Stage } from "./types";

const KEYMAP: Record<string, string> = { Backspace: "⌫", Enter: "↵", Shift: "⇧", " ": "Space", Escape: "Esc", Control: "Ctrl", Alt: "Alt", Meta: "Fn" };

function circlePts(p: number): [number, number][] {
  const n = Math.max(2, Math.round(64 * p));
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / 64) * Math.PI * 2 - Math.PI / 2;
    pts.push([50 + 30 * Math.cos(a), 50 + 34 * Math.sin(a)]);
  }
  return pts;
}

export interface DemoRefs {
  rootRef: React.RefObject<HTMLDivElement | null>;
  bodyRef: React.RefObject<HTMLDivElement | null>;
  listRef: React.RefObject<HTMLDivElement | null>;
  dialogRef: React.RefObject<HTMLDivElement | null>;
}

export function useGadgetIqDemo() {
  const stateRef = useRef<DemoState>(createInitialState());
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  const update = useCallback((partial: Partial<DemoState> | ((s: DemoState) => Partial<DemoState>)) => {
    const p = typeof partial === "function" ? partial(stateRef.current) : partial;
    stateRef.current = { ...stateRef.current, ...p };
    forceRender();
  }, []);

  const tlc = useMemo(() => D.stageTimeline(), []);

  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Mutable, non-reactive fields (mirrors of the original class's instance fields).
  // Deliberately a ref, not state: these are imperative bookkeeping values (rAF
  // handles, audio nodes, dedupe sets) that must never trigger a re-render themselves.
  const mut = useRef({
    animUntil: 0,
    scrolled: false,
    lastCur: null as string | null,
    curId: "" as string,
    curPan: 0,
    curFail: false,
    wave: null as number[] | null,
    analyser: null as AnalyserNode | null,
    soundUntil: 0,
    ac: null as AudioContext | null,
    seenCodes: new Set<string>(),
    tipTarget: null as string | null,
    lastTip: null as string | null,
    obsRoot: null as Element | null,
    obsBody: null as Element | null,
    raf: 0,
    last: null as number | null,
    flashUntil: 0,
    certId: "",
  }).current;

  const sc = useCallback((): D.Scenario => D.SCENARIOS[stateRef.current.deviceId || D.DEFAULT_DEVICE], []);

  const durOf = useCallback((st: Stage) => (st === "cosmetic" && stateRef.current.checklist ? tlc.dur.cosmeticChecklist : tlc.dur[st as keyof typeof tlc.dur]), [tlc]);
  const gradeAt = useCallback(() => (stateRef.current.checklist ? tlc.clGradeAt : tlc.gradeAt), [tlc]);

  const gatesFor = useCallback(
    (st: Stage) => {
      const T = D.TIMINGS;
      if (st === "intake") return [{ id: "start", t: tlc.fieldsEnd }];
      if (st === "functional")
        return [
          ...tlc.sched.filter((x) => x.gate).map((x) => ({ id: x.gate as string, t: x.start + T.functional.gateLead })),
          { id: "next", t: tlc.testsEnd + 600 },
        ];
      if (st === "cosmetic") return [{ id: stateRef.current.checklist ? "checklist" : "photos", t: 0 }, { id: "next", t: gradeAt() + 1600 }];
      if (st === "certificate") return [{ id: "verify", t: 2600 }, { id: "next", t: T.certificate.total - 500 }];
      if (st === "admin") return [{ id: "explore", t: 2500 }];
      return [];
    },
    [tlc, gradeAt]
  );

  const showToast = useCallback(
    (text: string, icon: IconKey = "check") => {
      const until = performance.now() + D.TIMINGS.toast;
      mut.animUntil = Math.max(mut.animUntil, until + 300);
      update({ toast: { text, icon, until } });
    },
    [update, mut]
  );

  const enter = useCallback(
    (stage: Stage, extra: Partial<DemoState> = {}) => {
      const s = stateRef.current;
      const idx = STAGES.indexOf(stage as (typeof STAGES)[number]);
      const gates: Record<string, boolean> = {};
      Object.keys(s.gates).forEach((k) => {
        if (STAGES.indexOf(k.split(":")[0] as (typeof STAGES)[number]) < idx) gates[k] = true;
      });
      const now = performance.now();
      mut.animUntil = Math.max(mut.animUntil, now + 1500);
      const reset: Partial<DemoState> = { stage, t: 0, waiting: null, gates, overlay: null, hoverKey: null, enterAt: now };
      if (stage === "functional") Object.assign(reset, { keys: {}, keyCount: 0, pad: [], padSec: {}, padDone: false });
      if (stage === "cosmetic") Object.assign(reset, { photos: {}, answers: {} });
      if (stage === "certificate") reset.verifyStart = null;
      if (stage === "admin") Object.assign(reset, { adminTouched: false, site: "All sites", role: "Admin", fnFilter: "All", flight: null, tipIdx: 0, tipTouched: false });
      mut.seenCodes = new Set();
      update({ ...reset, ...extra });
    },
    [update, mut]
  );

  const startDemo = useCallback(
    (id?: string) => {
      const s = stateRef.current;
      const deviceId = id || s.deviceId || D.DEFAULT_DEVICE;
      enter("intake", { deviceId, started: true, playing: true, runMs: 0, lensUsed: false, checklist: false });
      const root = rootRef.current;
      if (!mut.scrolled && root) {
        mut.scrolled = true;
        const top = root.getBoundingClientRect().top;
        if (Math.abs(top) > 40) window.scrollTo({ top: top + window.scrollY - 8, behavior: s.reduced ? "auto" : "smooth" });
      }
    },
    [enter, mut]
  );

  const advance = useCallback(() => {
    const s = stateRef.current;
    if (!s.deviceId) return startDemo();
    if (s.stage === "end") return;
    const go: Partial<DemoState> = { playing: true, started: true };
    if (s.stage === "intake") {
      showToast("1 Gadget Evaluate licence used", "wallet");
      enter("functional", go);
      return;
    }
    const i = STAGES.indexOf(s.stage as (typeof STAGES)[number]);
    if (i === STAGES.length - 1) {
      const now = performance.now();
      mut.animUntil = now + 1500;
      update({ stage: "end", waiting: null, overlay: null, enterAt: now });
      return;
    }
    if (s.stage === "cosmetic") go.lensUsed = !s.checklist;
    enter(STAGES[i + 1], go);
  }, [enter, startDemo, showToast, update, mut]);

  const doGate = useCallback(
    (id: string | null, auto?: boolean) => {
      const s = stateRef.current;
      if (!id) return;
      const gates = { ...s.gates, [s.stage + ":" + id]: true };
      const upd: Partial<DemoState> = { gates, waiting: s.waiting === id ? null : s.waiting };
      if (id === "start" || id === "next" || id === "explore") {
        update({ gates, waiting: null });
        advance();
        return;
      }
      if (id === "keys") {
        upd.keys = { ...s.keys };
        ["G", "A", "D", "E", "T"].forEach((k) => { upd.keys![k] = true; });
        upd.keyCount = Math.max(5, s.keyCount);
      }
      if (id === "pad") {
        upd.padDone = true;
        if (auto || !s.pad.length) upd.pad = circlePts(1);
      }
      if (id === "photos") {
        upd.photos = {};
        D.ANGLES.forEach((_a, i) => { upd.photos![i] = s.photos[i] ?? -1; });
        upd.t = Math.max(s.t, tlc.capEnd);
      }
      if (id === "checklist") {
        upd.answers = { ...D.checklistFromDefects(sc().defects), ...s.answers };
        upd.t = Math.max(s.t, tlc.clGradeAt - 400);
      }
      if (id === "verify") upd.verifyStart = s.t;
      update(upd);
    },
    [update, advance, tlc, sc]
  );

  const registerKey = useCallback(
    (label: string | null, code: string) => {
      if (mut.seenCodes.has(code)) return;
      mut.seenCodes.add(code);
      const s = stateRef.current;
      const keys = { ...s.keys };
      if (label) keys[label] = true;
      const keyCount = s.keyCount + 1;
      update({ keys, keyCount });
      if (keyCount >= 5) setTimeout(() => doGate("keys"), 300);
    },
    [update, doGate, mut]
  );

  const togglePlay = useCallback(() => {
    const s = stateRef.current;
    if (s.stage === "end" || !s.deviceId) return startDemo();
    if (!s.started) { update({ started: true, playing: true }); return; }
    update({ playing: !s.playing });
  }, [update, startDemo]);

  const next = useCallback(() => {
    const s = stateRef.current;
    if (!s.deviceId) return startDemo();
    update({ started: true, playing: true, waiting: null });
    advance();
  }, [update, startDemo, advance]);

  const toPicker = useCallback(() => {
    enter("intake", { deviceId: null, playing: false, started: false, runMs: 0, lensUsed: false, checklist: false });
  }, [enter]);

  const prev = useCallback(() => {
    const s = stateRef.current;
    if (!s.deviceId) return;
    if (s.stage === "intake") return toPicker();
    const i = s.stage === "end" ? STAGES.length : STAGES.indexOf(s.stage as (typeof STAGES)[number]);
    enter(STAGES[Math.max(0, i - 1)], { playing: true, started: true });
  }, [enter, toPicker]);

  const restart = toPicker;
  const replay = useCallback(() => startDemo(stateRef.current.deviceId || undefined), [startDemo]);
  const tryAnother = toPicker;

  const setMode = useCallback(
    (v: Mode) => {
      const s = stateRef.current;
      if (v === s.mode) return;
      if (v === "watch" && s.waiting) doGate(s.waiting, true);
      update({ mode: v });
    },
    [update, doGate]
  );

  const padMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const s = stateRef.current;
      if (s.waiting !== "pad" || s.padDone) return;
      const r = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100, y = ((e.clientY - r.top) / r.height) * 100;
      const pad = [...s.pad, [x, y] as [number, number]].slice(-240);
      const padSec = { ...s.padSec };
      if (Math.hypot(x - 50, y - 50) > 14) padSec[Math.floor(((Math.atan2(y - 50, x - 50) + Math.PI) / (2 * Math.PI)) * 8) % 8] = true;
      update({ pad, padSec });
      if (Object.keys(padSec).length >= 8 && pad.length > 16) doGate("pad");
    },
    [update, doGate]
  );

  const playTone = useCallback(() => {
    try {
      const ctx = mut.ac || (mut.ac = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)());
      const now = ctx.currentTime, osc = ctx.createOscillator(), g = ctx.createGain(), an = ctx.createAnalyser();
      an.fftSize = 64;
      osc.type = mut.curFail ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.setValueAtTime(784, now + 0.25);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.16, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      let node: AudioNode = osc.connect(g);
      if (ctx.createStereoPanner) {
        const p = ctx.createStereoPanner();
        p.pan.value = mut.curPan || 0;
        node = node.connect(p);
      }
      node.connect(an);
      an.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);
      mut.analyser = an;
      mut.soundUntil = performance.now() + 700;
      mut.animUntil = Math.max(mut.animUntil, mut.soundUntil);
    } catch {
      // audio unavailable
    }
  }, [mut]);

  const takePhoto = useCallback(
    (i: number) => {
      const s = stateRef.current;
      if (s.stage !== "cosmetic" || s.waiting !== "photos" || s.photos[i]) return;
      const photos = { ...s.photos, [i]: performance.now() };
      mut.animUntil = performance.now() + 320;
      update({ photos });
      if (Object.keys(photos).length >= 6) setTimeout(() => doGate("photos"), 250);
    },
    [update, doGate, mut]
  );

  const answer = useCallback(
    (qid: D.ChecklistQuestion["id"], opt: string) => {
      const s = stateRef.current;
      if (s.stage !== "cosmetic" || s.waiting !== "checklist") return;
      const answers = { ...s.answers, [qid]: opt };
      update({ answers });
      if (Object.keys(answers).length >= D.CHECKLIST.length) setTimeout(() => doGate("checklist"), 250);
    },
    [update, doGate]
  );

  const toggleChecklist = useCallback(
    (v: boolean) => {
      const s = stateRef.current;
      const gates = { ...s.gates };
      Object.keys(gates).forEach((k) => { if (k.startsWith("cosmetic:")) delete gates[k]; });
      update({ checklist: v, photos: {}, answers: {}, t: 0, gates, waiting: null });
    },
    [update]
  );

  const verify = useCallback(() => {
    const s = stateRef.current;
    if (s.stage !== "certificate") return;
    if (s.waiting === "verify") return doGate("verify");
    update({ verifyStart: s.t, gates: { ...s.gates, "certificate:verify": true }, started: true });
  }, [update, doGate]);

  const touchAdmin = useCallback(
    <K extends keyof DemoState>(k: K, v: DemoState[K]) => {
      update({ [k]: v, adminTouched: true } as Partial<DemoState>);
    },
    [update]
  );

  const imgFor = useCallback((scId: string, angle: D.Angle) => renderSrc(angle, scId), []);

  const closeOverlay = useCallback(() => update({ overlay: null }), [update]);
  const openOverlay = useCallback((o: DemoState["overlay"]) => update({ overlay: o }), [update]);
  const openZoomFor = useCallback((index: number) => update({ overlay: "zoom", zoom: index }), [update]);
  const openDrawerFor = useCallback((id: string) => update({ overlay: "drawer", drawerId: id }), [update]);
  const setHoverKey = useCallback((k: number | null) => update({ hoverKey: k }), [update]);
  const toggleSummary = useCallback(() => update({ summaryOpen: !stateRef.current.summaryOpen }), [update]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === "Escape" && s.overlay) { update({ overlay: null }); return; }
      if (s.overlay && e.key === "Tab" && dialogRef.current) {
        const f = [...dialogRef.current.querySelectorAll<HTMLElement>('button,[href],[tabindex]:not([tabindex="-1"])')];
        if (f.length) {
          const i = f.indexOf(document.activeElement as HTMLElement);
          if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
          else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        }
        return;
      }
      const act = document.activeElement, root = rootRef.current;
      const focusOk = !act || act === document.body || (root && root.contains(act));
      if (!s.inView || !focusOk) return;
      if (s.waiting === "keys") {
        e.preventDefault();
        const label = KEYMAP[e.key] || (e.key.length === 1 ? e.key.toUpperCase() : null);
        const code = e.code || e.key;
        registerKey(label, code);
        return;
      }
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (/INPUT|TEXTAREA|SELECT/.test(tag)) return;
      if (e.key === " " && !/BUTTON/.test(tag)) { e.preventDefault(); togglePlay(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    },
    [update, registerKey, togglePlay, next, prev]
  );

  // --- lifecycle -----------------------------------------------------
  useEffect(() => {
    update({
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      touch: window.matchMedia("(hover: none)").matches,
    });

    const ro = new ResizeObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === rootRef.current) update({ width: e.contentRect.width });
        else update({ sw: e.contentRect.width });
      });
    });
    const observeRefs = () => {
      const r = rootRef.current, b = bodyRef.current;
      if (r && r !== mut.obsRoot) { ro.observe(r); mut.obsRoot = r; measure(); }
      if (b && b !== mut.obsBody) { ro.observe(b); mut.obsBody = b; measure(); }
    };
    const measure = () => {
      const r = rootRef.current, b = bodyRef.current;
      const width = r ? r.getBoundingClientRect().width : window.innerWidth;
      const sw = b ? b.getBoundingClientRect().width : Math.min(width, 900);
      const s = stateRef.current;
      if (Math.abs(width - s.width) > 0.5 || Math.abs(sw - s.sw) > 0.5) update({ width, sw });
    };
    observeRefs();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([e]) => {
        const inView = e.isIntersecting && e.intersectionRatio > 0.15;
        if (inView !== stateRef.current.inView) update({ inView });
      },
      { threshold: [0, 0.15, 0.5] }
    );
    if (rootRef.current) io.observe(rootRef.current);

    const onKey = (e: KeyboardEvent) => handleKey(e);
    window.addEventListener("keydown", onKey);

    const loop = (now: number) => {
      mut.raf = requestAnimationFrame(loop);
      const last = mut.last == null ? now : mut.last;
      const dt = Math.min(80, now - last);
      mut.last = now;
      const s = stateRef.current;
      if (mut.analyser && now < mut.soundUntil) {
        const buf = new Uint8Array(32);
        mut.analyser.getByteTimeDomainData(buf);
        mut.wave = Array.from(buf, (v) => Math.abs(v - 128) / 128);
      } else mut.wave = null;
      const animating = now < mut.animUntil || (!!s.toast && now < s.toast.until + 300);
      const moving = s.playing && !s.waiting && s.stage !== "end" && !!s.deviceId && !s.overlay && s.inView !== false;
      if (!moving) {
        if (animating || (s.waiting && s.stage === "functional")) update({ clock: now });
        return;
      }
      const t = s.t + dt * s.speed, runMs = s.runMs + dt * s.speed;
      if (s.mode === "try") {
        const g = gatesFor(s.stage)
          .filter((g) => !s.gates[s.stage + ":" + g.id] && g.t <= t)
          .sort((a, b) => a.t - b.t)[0];
        if (g) { update({ t: Math.max(s.t, g.t), waiting: g.id, runMs, clock: now }); return; }
      }
      if (t >= durOf(s.stage)) { update({ runMs, clock: now }); advance(); return; }
      update({ t, runMs, clock: now });
    };
    mut.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(mut.raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus the dialog's first focusable element whenever an overlay opens.
  const prevOverlay = useRef(stateRef.current.overlay);
  useEffect(() => {
    if (stateRef.current.overlay && stateRef.current.overlay !== prevOverlay.current && dialogRef.current) {
      const f = dialogRef.current.querySelector<HTMLElement>("button,[tabindex]");
      f?.focus();
    }
    prevOverlay.current = stateRef.current.overlay;
  });

  // Track the currently-running functional test (for the auto-scroll below and
  // for playTone()'s pass/fail tone). Derived here, inside the hook that owns
  // `mut`, rather than by a consumer mutating a ref it only receives as a prop.
  useEffect(() => {
    const s = stateRef.current;
    if (s.stage !== "functional") return;
    const scenario = sc();
    const fr = D.functionalResults(scenario);
    const stat = (x: D.ScheduledTest) => (s.t < x.start ? "wait" : s.t < x.end ? "run" : fr.res[x.id].pass ? "pass" : "fail");
    const curT = tlc.sched.find((x) => stat(x) === "run") || (s.t >= tlc.testsEnd ? tlc.sched[tlc.sched.length - 1] : tlc.sched[0]);
    mut.curId = curT.id;
    mut.curPan = 0;
    mut.curFail = !fr.res[curT.id].pass;
  });

  // Auto-scroll the current functional test row into view.
  useEffect(() => {
    const s = stateRef.current;
    if (s.stage === "functional" && mut.curId !== mut.lastCur && listRef.current) {
      mut.lastCur = mut.curId;
      const el = listRef.current, row = el.querySelector(`[data-row="${mut.curId}"]`);
      if (row instanceof HTMLElement) el.scrollTo({ top: Math.max(0, row.offsetTop - el.clientHeight / 3), behavior: s.reduced ? "auto" : "smooth" });
    }
  });

  // Track which admin-view tour target is active, for the highlight outline.
  useEffect(() => {
    const s = stateRef.current;
    if (s.stage !== "admin") return;
    const tryM = s.mode === "try";
    let tipI = s.tipTouched ? s.tipIdx : tryM ? s.tipIdx : Math.max(0, D.TIMINGS.admin.tips.filter((x) => s.t >= x).length - 1);
    tipI = Math.max(0, Math.min(D.ADMIN_TIPS.length - 1, tipI));
    mut.tipTarget = D.ADMIN_TIPS[tipI].target;
  });

  const scrollToRow = useCallback(
    (id: string) => {
      const el = listRef.current, row = el && el.querySelector(`[data-row="${id}"]`);
      if (row instanceof HTMLElement && el) el.scrollTo({ top: Math.max(0, row.offsetTop - el.clientHeight / 3), behavior: stateRef.current.reduced ? "auto" : "smooth" });
    },
    []
  );

  const refs: DemoRefs = { rootRef, bodyRef, listRef, dialogRef };

  return {
    state: stateRef.current,
    tlc,
    refs,
    mut,
    sc,
    durOf,
    gradeAt,
    gatesFor,
    circlePts,
    showToast,
    enter,
    advance,
    startDemo,
    doGate,
    registerKey,
    togglePlay,
    next,
    prev,
    toPicker,
    restart,
    replay,
    tryAnother,
    setMode,
    padMove,
    playTone,
    takePhoto,
    answer,
    toggleChecklist,
    verify,
    touchAdmin,
    imgFor,
    closeOverlay,
    openOverlay,
    openZoomFor,
    openDrawerFor,
    setHoverKey,
    toggleSummary,
    scrollToRow,
    update,
  };
}

export type GadgetIqDemo = ReturnType<typeof useGadgetIqDemo>;
