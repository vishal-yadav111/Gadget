"use client";

import { useMemo, type CSSProperties } from "react";
import { Avatar, Segmented, Select, Button, Badge } from "../ui";
import { Ico, PATHS, type IconName } from "../icons";
import * as D from "../data";
import type { AdminRow } from "../data";
import type { DemoState, Role } from "../types";
import type { GadgetIqDemo } from "../useGadgetIqDemo";

const EYEBROW = "text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]";
const PANEL = "flex min-w-0 flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-sm)]";
const TOUR_TARGET = "outline-2 outline-offset-4 transition-[outline-color] duration-200 ease-[cubic-bezier(.2,.7,.3,1)]";
const TABLE_COLS = "minmax(0,1.5fr) minmax(0,1fr) minmax(0,1.3fr) 76px minmax(0,1fr) 48px";

export function AdminStage({ state, demo, ta, sw, narrow }: { state: DemoState; demo: GadgetIqDemo; ta: number; sw: number; narrow: boolean }) {
  const sc = demo.sc();
  const T = D.TIMINGS;
  const rm = state.reduced;
  const tryM = state.mode === "try";
  const defects = state.checklist ? D.defectsFromChecklist(D.checklistFromDefects(sc.defects), sc) : sc.defects;
  const gradeRes = D.gradeFromDefects(defects);
  const serial = sc.specs["Serial No."];
  const certId = D.makeCertId(serial);
  const nT = D.TESTS.length;
  const failIds = Object.keys(sc.fails);

  const demoRow: AdminRow = useMemo(
    () => ({ id: "demo", model: sc.name, serial, site: D.DEMO_SITE, tech: D.DEMO_TECH, at: new Date(), fails: failIds, defects, grade: gradeRes.letter, durationSec: 272, certId, batteryHealth: sc.batteryHealth, isNew: true }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sc.id]
  );
  const allRows = useMemo(() => [demoRow, ...D.ADMIN_DEVICES], [demoRow]);

  const autoAdmin = !tryM && !state.adminTouched;
  const site = autoAdmin ? (ta >= T.admin.siteAt && ta < T.admin.roleAt ? "Delhi" : "All sites") : state.site;
  const role: Role = autoAdmin ? (ta >= T.admin.roleAt && ta < T.admin.roleEnd ? "Technician" : "Admin") : state.role;

  const scoped = allRows.filter((r) => (site === "All sites" || r.site === site) && (role === "Admin" || r.tech === D.DEMO_TECH));
  const listed = scoped.filter((r) => state.fnFilter === "All" || (state.fnFilter === "Passed" ? !r.fails.length : r.fails.length));
  const sum = D.adminSummary(scoped);
  const allSum = D.adminSummary(allRows);
  const maxMix = Math.max(1, ...sum.gradeMix.map((g) => g.pct));
  const maxHour = Math.max(1, ...sum.perHour.map((h) => h.count));
  const hourDots = sum.perHour.map((h, i) => ({ x: 12 + i * 27, y: 74 - (h.count / maxHour) * 60, label: String(h.hour) }));
  const maxFail = Math.max(1, ...sum.failures.map((f) => f.n));
  const gColor = (l: string) => D.GRADE_SCALE.find((g) => g.letter === l)?.color;

  const fl = state.flight;
  const useFlight = !narrow && !rm && !!fl;
  const rowShown = rm || ta < 0 || (useFlight ? ta >= T.admin.flight * 0.85 : true);
  const slideP2 = narrow && !rm ? D.ease(ta / 500) : 1;
  const pulse = ta >= 0 && ta < 6000 && !rm ? 0.06 + 0.06 * Math.abs(Math.sin(ta / 400)) : 0.06;

  const tableRows = listed.slice(0, 14).map((r) => ({
    r,
    gradeColor: gColor(r.grade),
    time: D.fmtTime(r.at),
    fnLabel: r.fails.length ? `${nT - r.fails.length}/${nT} · ${D.failureLabel(r.fails[0])}` : `${nT}/${nT} passed`,
    fnTone: r.fails.length ? ("danger" as const) : ("success" as const),
    fnCard: `Evaluate: ${nT - r.fails.length}/${nT} passed`,
    fnColor: r.fails.length ? "var(--status-danger)" : "var(--status-success)",
    bg: r.isNew ? `rgba(0,82,204,${pulse.toFixed(3)})` : "var(--surface-card)",
    o: r.isNew ? (rowShown ? slideP2 : 0) : 1,
    ty: r.isNew ? (1 - slideP2) * 16 : 0,
  }));

  const evalLeft = D.licencesLeft("evaluate", true);
  const lensLeft = D.licencesLeft("lens", true);
  const licenceRows = D.LICENCE_TYPES.map((x) => ({ name: x.name, left: x.id === "evaluate" ? evalLeft : lensLeft, usedToday: D.ADMIN_DEVICES.length + 1, use: x.use }));

  const alertSum = D.adminSummary(allRows.filter((r) => site === "All sites" || r.site === site));
  const alertText = alertSum.alert ? `${alertSum.alert.n} laptops failed the ${alertSum.alert.label.toLowerCase()} test at ${alertSum.alert.site} today.` : "";
  const kpiCols = sw >= 1060 ? "repeat(6,minmax(0,1fr))" : sw >= 480 ? "repeat(3,minmax(0,1fr))" : "repeat(2,minmax(0,1fr))";
  const kpis: { label: string; value: string; icon: IconName }[] = [
    { label: "Checked today", value: String(sum.count), icon: "laptop" },
    { label: "Passed all tests", value: sum.passPct + "%", icon: "checkCircle" },
    { label: "Average grade", value: sum.avgGrade, icon: "star" },
    { label: "Average check time", value: D.fmtDuration(sum.avgSec), icon: "timer" },
    { label: "Evaluate licences", value: String(evalLeft), icon: "wallet" },
    { label: "Lens licences", value: String(lensLeft), icon: "wallet" },
  ];

  const TIPS = D.ADMIN_TIPS, tipAt = T.admin.tips;
  let tipI = state.tipTouched ? state.tipIdx : tryM ? state.tipIdx : Math.max(0, tipAt.filter((x) => ta >= x).length - 1);
  tipI = D.clamp(tipI, 0, TIPS.length - 1);
  const tipObj = TIPS[tipI];
  const hl = (k: string): CSSProperties => ({ outlineColor: tipObj.target === k ? "var(--brand-primary)" : "transparent" });
  const tipDone = () => {
    if (tipI < TIPS.length - 1) { demo.update({ tipIdx: tipI + 1, tipTouched: true }); return; }
    if (state.waiting) demo.doGate(state.waiting, false);
    else { demo.update({ started: true, playing: true }); demo.advance(); }
  };
  const usageBars = allSum.perHour.map((h) => Math.max(0.06, h.count / Math.max(1, ...allSum.perHour.map((x) => x.count))));

  return (
    <div className="flex flex-col gap-4 bg-[var(--surface-page)] p-4">
      <div role="region" aria-label="Admin view tour" aria-live="polite" className="flex flex-wrap items-center gap-3 rounded-[var(--radius-md)] bg-[var(--surface-inverse)] px-3.5 py-3 text-white shadow-[var(--shadow-md)]">
        <span className="box-content grid h-7 w-7 flex-none place-items-center rounded-full bg-[var(--brand-primary)] font-mono text-xs font-semibold">{tipI + 1}</span>
        <div className="flex min-w-0 flex-1 basis-[220px] flex-col gap-0.5">
          <span className="text-xs text-white/[.72]">Quick tour · {tipI + 1} of {TIPS.length}</span>
          <span className="text-sm font-semibold">{tipObj.title}</span>
          <span className="text-[13px] leading-[1.45] text-white/[.82] [text-wrap:pretty]">{tipObj.text}</span>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <div className="flex gap-[5px]" aria-hidden="true">
            {TIPS.map((_, i) => <span key={i} className="box-content h-1.5 w-1.5 rounded-full" style={{ background: i === tipI ? "#fff" : "rgba(255,255,255,.3)" }} />)}
          </div>
          <button
            type="button"
            disabled={tipI === 0}
            onClick={() => demo.update({ tipIdx: Math.max(0, tipI - 1), tipTouched: true })}
            className="h-9 cursor-pointer rounded-[var(--radius-sm)] border border-white/30 bg-transparent px-3 text-[13px] text-white"
            style={{ opacity: tipI === 0 ? 0.4 : 1 }}
          >
            Back
          </button>
          <button type="button" onClick={tipDone} className="h-9 cursor-pointer rounded-[var(--radius-sm)] border-none bg-white px-3 text-[13px] font-semibold text-[var(--text-primary)]">
            {tipI === TIPS.length - 1 ? "Finish tour" : "Next tip"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
        <div data-tour="site" className={`flex min-w-0 rounded-[var(--radius-md)] ${TOUR_TARGET}`} style={{ flex: sw >= 700 ? "0 1 auto" : "1 1 150px", ...hl("site") }}>
          {sw >= 700 ? (
            <Segmented options={["All sites", ...D.SITES]} value={site} onChange={(v) => demo.touchAdmin("site", v)} ariaLabel="Site" size="sm" />
          ) : (
            <div className="min-w-0 flex-1 basis-[150px]">
              <Select options={["All sites", ...D.SITES]} value={site} onChange={(v) => demo.touchAdmin("site", v)} ariaLabel="Site" />
            </div>
          )}
        </div>
        <div data-tour="role" className={`rounded-[var(--radius-md)] ${TOUR_TARGET}`} style={hl("role")}>
          <Segmented options={["Admin", "Technician"] as const} value={role} onChange={(v) => demo.touchAdmin("role", v)} ariaLabel="Role" size="sm" />
        </div>
        <span className="flex-1" />
        <span className="flex h-[26px] items-center whitespace-nowrap rounded-[var(--radius-xs)] bg-[var(--surface-sunken)] px-2 text-xs text-[var(--text-secondary)]">Sample data</span>
        <span className="box-content flex h-9 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-2.5 text-[13px]">
          <Ico name="calendar" /><span>Today ·</span><span>{D.fmtDate()}</span>
        </span>
      </div>

      {role === "Admin" && (
        <>
          <div data-tour="kpi" className={`grid gap-3 rounded-[var(--radius-md)] ${TOUR_TARGET}`} style={{ gridTemplateColumns: kpiCols, ...hl("kpi") }}>
            {kpis.map((k) => (
              <div key={k.label} className="flex min-w-0 flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3.5 shadow-[var(--shadow-sm)]">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[rgba(0,82,204,.1)] text-[var(--brand-primary)]"><Ico name={k.icon} size={18} /></span>
                <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-[var(--text-secondary)]">{k.label}</span>
                <span className="whitespace-nowrap font-display font-bold leading-[1.1] tracking-[-0.012em]" style={{ fontSize: sw < 420 ? 22 : 26 }}>{k.value}</span>
              </div>
            ))}
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: sw >= 900 ? "repeat(3,minmax(0,1fr))" : sw >= 560 ? "repeat(2,minmax(0,1fr))" : "minmax(0,1fr)" }}>
            <div className={PANEL}>
              <div className="flex justify-between gap-2 text-[13px]"><span className="font-semibold">Grade mix</span><span className="whitespace-nowrap font-mono text-[var(--text-tertiary)]">{sum.gradeMix.reduce((a, g) => a + g.pct, 0)}% · {sum.count}</span></div>
              {sum.gradeMix.map((g) => (
                <div key={g.letter} className="grid items-center gap-2 text-xs" style={{ gridTemplateColumns: "24px minmax(0,1fr) 40px" }}>
                  <span className="font-bold">{g.letter}</span>
                  <div className="h-2 overflow-hidden rounded-[3px] bg-[var(--surface-sunken)]"><div className="h-full transition-[width] duration-200 ease-[cubic-bezier(.2,.7,.3,1)]" style={{ width: D.pct(g.pct / maxMix), background: g.color }} /></div>
                  <span className="text-right font-mono text-[var(--text-secondary)]">{g.pct}%</span>
                </div>
              ))}
            </div>
            <div className={PANEL}>
              <span className="text-[13px] font-semibold">Devices checked per hour</span>
              <svg viewBox="0 0 240 92" className="w-full" style={{ height: 130 }} aria-label="Devices checked per hour">
                <line x1="0" y1="78" x2="240" y2="78" stroke="var(--border-subtle)" />
                <polyline points={hourDots.map((h) => `${h.x},${h.y.toFixed(1)}`).join(" ")} fill="none" stroke="var(--brand-primary)" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                {hourDots.map((h) => (
                  <g key={h.label}>
                    <circle cx={h.x} cy={h.y.toFixed(1)} r={3} fill="var(--surface-card)" stroke="var(--brand-primary)" strokeWidth={2} />
                    <text x={h.x} y={90} textAnchor="middle" fontSize={8} fill="var(--text-tertiary)" fontFamily="JetBrains Mono, monospace">{h.label}</text>
                  </g>
                ))}
              </svg>
            </div>
            <div className={PANEL} style={{ gridColumn: sw >= 560 && sw < 900 ? "1 / -1" : "auto" }}>
              <span className="text-[13px] font-semibold">Most common failures</span>
              {sum.failures.slice(0, 6).map((f) => (
                <div key={f.label} className="grid items-center gap-2 text-xs" style={{ gridTemplateColumns: "76px minmax(0,1fr) 28px" }}>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">{f.label}</span>
                  <div className="h-2 overflow-hidden rounded-[3px] bg-[var(--surface-sunken)]"><div className="h-full bg-[var(--status-danger)]" style={{ width: D.pct(f.n / maxFail) }} /></div>
                  <span className="text-right font-mono">{f.n}</span>
                </div>
              ))}
              {!sum.failures.length && <span className="text-[13px] text-[var(--text-secondary)]">No failures for this filter.</span>}
            </div>
          </div>
        </>
      )}

      {role === "Technician" && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar size={36} />
            <div className="flex min-w-0 flex-col"><span className="font-semibold">{D.DEMO_TECH} · {D.DEMO_SITE}</span><span className="text-[13px] text-[var(--text-secondary)]">Technicians see only their own queue.</span></div>
          </div>
          <div className="flex flex-col items-end"><span className="font-display text-[26px] font-bold">{allRows.filter((r) => r.tech === D.DEMO_TECH).length}</span><span className="text-xs text-[var(--text-secondary)]">checked by you today</span></div>
        </div>
      )}

      <div className="flex flex-wrap items-start gap-3">
        <div
          data-tour="row"
          className={`min-w-0 max-w-full flex-[3_1_522px] overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-sm)] ${TOUR_TARGET}`}
          style={hl("row")}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-4 py-3">
            <span className="text-sm font-semibold">Recent devices <span className="font-mono font-normal text-[var(--text-tertiary)]">{listed.length}</span></span>
            <Segmented options={["All", "Passed", "Failed"] as const} value={state.fnFilter} onChange={(v) => demo.touchAdmin("fnFilter", v)} ariaLabel="Gadget Evaluate result filter" size="sm" />
          </div>
          {sw >= 900 && (
            <div className="grid gap-2 bg-[var(--surface-sunken)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]" style={{ gridTemplateColumns: TABLE_COLS }}>
              <span>Device</span><span>Serial No.</span><span>Evaluate</span><span>Lens grade</span><span>Technician</span><span>Time</span>
            </div>
          )}
          <div className="relative max-h-[440px] overflow-auto">
            {tableRows.map(({ r, gradeColor, time, fnLabel, fnTone, fnCard, fnColor, bg, o, ty }) =>
              sw >= 900 ? (
                <button
                  key={r.id}
                  type="button"
                  data-demo-row={r.isNew ? "new" : undefined}
                  onClick={() => demo.openDrawerFor(r.id)}
                  className="grid w-full cursor-pointer items-center gap-2 border-0 bg-[var(--row-bg)] px-4 py-2.5 text-left text-[13px] hover:bg-[var(--surface-sunken)]"
                  style={{ gridTemplateColumns: TABLE_COLS, "--row-bg": bg, opacity: o, transform: `translateY(${ty.toFixed(1)}px)`, borderBottom: "1px solid var(--border-subtle)" } as CSSProperties}
                >
                  <span title={r.model} className="overflow-hidden text-ellipsis whitespace-nowrap font-medium">{r.model}</span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs">{r.serial}</span>
                  <span className="min-w-0 overflow-hidden"><Badge tone={fnTone}>{fnLabel}</Badge></span>
                  <span className="font-display font-bold" style={{ color: gradeColor }}>{r.grade}</span>
                  <span title={r.tech} className="overflow-hidden text-ellipsis whitespace-nowrap">{r.tech}</span>
                  <span className="font-mono text-xs">{time}</span>
                </button>
              ) : (
                <button
                  key={r.id}
                  type="button"
                  data-demo-row={r.isNew ? "new" : undefined}
                  onClick={() => demo.openDrawerFor(r.id)}
                  title={r.model}
                  className="grid min-h-14 w-full cursor-pointer gap-x-3 gap-y-1 border-0 px-4 py-3 text-left text-[13px]"
                  style={{ gridTemplateColumns: "minmax(0,1fr) auto", background: bg, opacity: o, transform: `translateY(${ty.toFixed(1)}px)`, borderBottom: "1px solid var(--border-subtle)" }}
                >
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-semibold">{r.model}</span>
                    <span className="flex-none font-display font-bold" style={{ color: gradeColor }}>{r.grade}</span>
                  </span>
                  <span className="text-right font-mono text-xs text-[var(--text-secondary)]">{time}</span>
                  <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[var(--text-secondary)]"><span style={{ color: fnColor }}>{fnCard}</span> · {r.tech}</span>
                </button>
              )
            )}
            <div aria-hidden="true" className="pointer-events-none sticky bottom-0 -mt-8 h-8 bg-[linear-gradient(rgba(255,255,255,0),var(--surface-card))]" />
          </div>
        </div>

        {role === "Admin" && (
          <div className="flex min-w-0 flex-1 basis-[240px] flex-col gap-3">
            <div data-tour="wallet" className={`flex flex-col gap-2.5 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-sm)] ${TOUR_TARGET}`} style={hl("wallet")}>
              <span className={EYEBROW}>Licence wallet</span>
              {licenceRows.map((l) => (
                <div key={l.name} className="flex items-end justify-between gap-2 border-b border-[var(--border-subtle)] pb-2">
                  <div className="flex min-w-0 flex-col gap-0.5"><span className="text-[13px] font-semibold">{l.name}</span><span className="text-xs text-[var(--text-secondary)]">{l.usedToday} used today</span></div>
                  <span className="whitespace-nowrap font-display text-[26px] font-bold leading-[1.1]">{l.left}</span>
                </div>
              ))}
              <div className="flex h-10 items-end gap-[3px]">
                {usageBars.map((h, i) => <div key={i} className="flex-1 rounded-t-[2px] bg-[var(--brand-primary)] opacity-70" style={{ height: D.pct(h) }} />)}
              </div>
              <Button variant="secondary" size="sm" full onClick={() => demo.openOverlay("topup")} icon={<Ico d={PATHS.plus} />}>Top up</Button>
            </div>
            {!!alertText && (
              <div role="status" className="flex items-start gap-2.5 rounded-[var(--radius-md)] bg-[rgba(138,86,0,.1)] px-3.5 py-3 text-[var(--status-warning)]">
                <Ico name="warn" size={18} className="mt-px flex-none" />
                <div className="flex flex-col gap-0.5"><strong className="text-sm">Alert</strong><span className="text-[13px] leading-[1.45] text-[var(--text-primary)]">{alertText}</span></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
