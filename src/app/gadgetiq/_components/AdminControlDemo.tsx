"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  BarChart3,
  Boxes,
  CalendarCheck,
  CheckCircle2,
  Download,
  Eye,
  Filter,
  KeyRound,
  Laptop,
  LayoutDashboard,
  Percent,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  XCircle,
  type LucideIcon,
} from "lucide-react";

/* =========================================================
   ADMIN CONTROL DEMO

   A simplified, click-through recreation of the GadgetIQ
   admin console - Dashboard, Grade Analytics, Licence
   Report, QC Report and Monthly Summary - so visitors can
   explore what the back-office experience looks like
   without logging in. Auto-cycles for passive viewers, and
   stops the moment someone clicks a nav item themselves.
========================================================= */

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function StatCard({
  icon: Icon,
  value,
  suffix,
  sub,
  color,
}: {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  sub: string;
  color: string;
}) {
  const count = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 rounded-xl border border-[#DDE4F3] bg-white p-3"
    >
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
        <Icon size={15} />
      </span>
      <p className="mt-2 text-lg font-black leading-none text-[#17284D]">
        {count}
        {suffix}
      </p>
      <p className="mt-1 text-[9px] font-medium text-[#8A93A6]">{sub}</p>
    </motion.div>
  );
}

function UtilizationBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[9px] font-semibold text-[#4A5875]">
        <span>{label}</span>
        <span className="font-bold text-[#17284D]">{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF1F8]">
        <motion.div
          className="h-full rounded-full bg-[#0052CC]"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SCREEN 1 - DASHBOARD
--------------------------------------------------------- */

function DashboardScreen() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-[#DDE4F3] bg-[#FBFCFE] p-3">
        <span className="inline-flex rounded-full bg-[#0052CC]/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#0052CC]">
          Diagnostic
        </span>
        <h5 className="mt-1.5 text-sm font-bold text-[#17284D]">Xtracover Technologies Pvt. Ltd.</h5>
        <p className="mt-0.5 text-[10px] text-[#8A93A6]">Multi-tier hardware test license allocation & real-time diagnostic telemetry.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard icon={Boxes} value={1500} sub="Total Purchased" color="bg-[#0052CC]/10 text-[#0052CC]" />
        <StatCard icon={BarChart3} value={700} sub="Available to Test" color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={CheckCircle2} value={800} sub="Total Licences Used" color="bg-orange-100 text-orange-600" />
        <StatCard icon={Award} value={53} suffix="%" sub="Overall QC Pass Yield" color="bg-violet-100 text-violet-600" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-[#DDE4F3] bg-white p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#17284D]">
            <Laptop size={14} className="text-[#0052CC]" /> Laptop QC Diagnostics
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
            <div className="rounded-lg bg-[#F4F6FB] py-1.5"><p className="text-sm font-black text-[#17284D]">500</p>Purchased</div>
            <div className="rounded-lg bg-emerald-50 py-1.5"><p className="text-sm font-black text-emerald-600">45</p>Available</div>
            <div className="rounded-lg bg-orange-50 py-1.5"><p className="text-sm font-black text-orange-600">455</p>Tested</div>
          </div>
          <div className="mt-2.5">
            <UtilizationBar label="License Utilization" pct={91} />
          </div>
        </div>

        <div className="rounded-xl border border-[#DDE4F3] bg-white p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#17284D]">
            <Smartphone size={14} className="text-[#0052CC]" /> Mobile QC Diagnostics
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
            <div className="rounded-lg bg-[#F4F6FB] py-1.5"><p className="text-sm font-black text-[#17284D]">1,000</p>Purchased</div>
            <div className="rounded-lg bg-emerald-50 py-1.5"><p className="text-sm font-black text-emerald-600">655</p>Available</div>
            <div className="rounded-lg bg-orange-50 py-1.5"><p className="text-sm font-black text-orange-600">345</p>Tested</div>
          </div>
          <div className="mt-2.5">
            <UtilizationBar label="License Utilization" pct={35} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SCREEN 2 - LAPTOP GRADE VISUALIZER & ANALYTICS
--------------------------------------------------------- */

const GRADE_TIERS = [
  { key: "A", label: "Like New", pct: 25, color: "#10B981" },
  { key: "B", label: "Very Good", pct: 10, color: "#34D399" },
  { key: "C", label: "Good", pct: 58, color: "#0052CC" },
  { key: "D", label: "Fair", pct: 5, color: "#F59E0B" },
  { key: "E", label: "Quarantined", pct: 2, color: "#EF4444" },
];

function AnalyticsScreen() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-sm font-bold text-[#17284D]">Laptop Grade Visualizer</h5>
          <p className="text-[10px] text-[#8A93A6]">Cosmetic composition breakdown & diagnostic health</p>
        </div>
        <span className="rounded-full bg-[#0052CC]/10 px-2 py-1 text-[9px] font-bold text-[#0052CC]">455 Total</span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard icon={Boxes} value={455} sub="Laptops in Scope" color="bg-[#0052CC]/10 text-[#0052CC]" />
        <StatCard icon={ShieldCheck} value={71} suffix="%" sub="QC Pass Rate" color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={Award} value={58} suffix="%" sub="Dominant: Good" color="bg-violet-100 text-violet-600" />
        <StatCard icon={Laptop} value={48} suffix="%" sub="Leading: Dell Inc." color="bg-amber-100 text-amber-600" />
      </div>

      <div className="rounded-xl border border-[#DDE4F3] bg-white p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#17284D]">
          <BarChart3 size={14} className="text-[#0052CC]" /> Fleet Cosmetic Distribution
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#EEF1F8]">
          {GRADE_TIERS.map((tier, idx) => (
            <motion.span
              key={tier.key}
              style={{ backgroundColor: tier.color }}
              initial={{ width: 0 }}
              animate={{ width: `${tier.pct}%` }}
              transition={{ duration: 0.7, delay: idx * 0.08, ease: "easeOut" }}
            />
          ))}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {GRADE_TIERS.map((tier) => (
            <span
              key={tier.key}
              className="flex items-center gap-1 rounded-full border border-[#DDE4F3] px-2 py-0.5 text-[8.5px] font-semibold text-[#4A5875]"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tier.color }} />
              {tier.label} ({tier.pct}%)
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SCREEN 3 - LICENCE REPORT (LAPTOP)
--------------------------------------------------------- */

function LicenceReportScreen() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 rounded-xl border border-[#DDE4F3] bg-[#FBFCFE] p-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0052CC]/10 text-[#0052CC]">
            <KeyRound size={15} />
          </span>
          <div className="min-w-0">
            <h5 className="truncate text-sm font-bold text-[#17284D]">Licence Report (Laptop)</h5>
            <p className="truncate text-[9px] text-[#8A93A6]">Diagnostic license batch tracking & usage records</p>
          </div>
        </div>
        <button className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1.5 text-[9px] font-bold text-white transition-colors hover:bg-emerald-700">
          <Download size={10} /> Export
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DDE4F3]">
        <div className="grid grid-cols-[1fr_72px_72px_60px] gap-2 bg-[#F4F6FB] px-3 py-2 text-[8px] font-bold uppercase tracking-wide text-[#8A93A6]">
          <span>Work Order / Company</span>
          <span className="text-right">Total</span>
          <span className="text-right">Used</span>
          <span className="text-right">Status</span>
        </div>
        {[
          { wo: "WO252895", company: "Xtracover Technologies Â· Central Station", total: 500, used: 455 },
        ].map((row, idx) => (
          <motion.div
            key={row.wo}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="grid grid-cols-[1fr_72px_72px_60px] items-center gap-2 border-t border-[#EEF1F8] px-3 py-2.5 text-[10px]"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-[#0052CC]">{row.wo}</p>
              <p className="truncate text-[9px] text-[#8A93A6]">{row.company}</p>
            </div>
            <span className="text-right font-semibold text-[#17284D]">{row.total}</span>
            <span className="text-right font-semibold text-orange-600">{row.used}</span>
            <span className="text-right">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-bold text-emerald-700">Active</span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SCREEN 4 - QC REPORT (LAPTOP)
--------------------------------------------------------- */

const LAPTOP_QC_ROWS = [
  { serial: "XC-90210-A1", device: "Precision X-11", grade: "A-", result: "PASS" as const, date: "17 Sep" },
  { serial: "XC-90233-B4", device: "Dell Latitude 5420", grade: "B", result: "PASS" as const, date: "12 Sep" },
  { serial: "XC-90258-C2", device: "HP EliteBook 840", grade: "E", result: "FAIL" as const, date: "05 Sep" },
  { serial: "XC-90271-A9", device: "Lenovo ThinkPad T14", grade: "D", result: "FAIL" as const, date: "26 Aug" },
];

function LaptopQcScreen() {
  const [filter, setFilter] = useState<"all" | "pass" | "fail">("all");
  const rows = LAPTOP_QC_ROWS.filter((r) => filter === "all" || r.result.toLowerCase() === filter);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 rounded-xl border border-[#DDE4F3] bg-[#FBFCFE] p-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0052CC]/10 text-[#0052CC]">
            <Laptop size={15} />
          </span>
          <div className="min-w-0">
            <h5 className="truncate text-sm font-bold text-[#17284D]">QC Report (Laptop)</h5>
            <p className="truncate text-[9px] text-[#8A93A6]">455 verified hardware & cosmetic test records</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1 rounded-full bg-[#F4F6FB] p-0.5">
          {(["all", "pass", "fail"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-[8.5px] font-bold uppercase transition-colors ${
                filter === f ? "bg-[#0052CC] text-white" : "text-[#8A93A6] hover:text-[#4A5875]"
              }`}
            >
              {f === "all" && <Filter size={9} />}
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DDE4F3]">
        <div className="grid grid-cols-[1fr_44px_54px_28px] gap-2 bg-[#F4F6FB] px-3 py-2 text-[8px] font-bold uppercase tracking-wide text-[#8A93A6]">
          <span>Device / Serial</span>
          <span className="text-center">Grade</span>
          <span className="text-center">Result</span>
          <span></span>
        </div>
        <AnimatePresence mode="popLayout">
          {rows.map((row, idx) => (
            <motion.div
              key={row.serial}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ delay: idx * 0.05 }}
              className="grid grid-cols-[1fr_44px_54px_28px] items-center gap-2 border-t border-[#EEF1F8] px-3 py-2 text-[10px]"
            >
              <div className="min-w-0">
                <p className="truncate font-bold text-[#17284D]">{row.device}</p>
                <p className="truncate text-[9px] text-[#8A93A6]">{row.serial}</p>
              </div>
              <span className="text-center">
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                    row.grade === "E" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {row.grade}
                </span>
              </span>
              <span className="text-center">
                <span
                  className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                    row.result === "PASS" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                  }`}
                >
                  {row.result === "PASS" ? <CheckCircle2 size={8} /> : <XCircle size={8} />}
                  {row.result}
                </span>
              </span>
              <button className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[#0052CC] hover:bg-[#0052CC]/10">
                <Eye size={11} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SCREEN 5 - QC MONTHLY SUMMARY REPORT
--------------------------------------------------------- */

const MONTHLY_LEDGER = [
  { month: "Sep 2026", passed: 16, defects: 24, rate: 40 },
  { month: "Aug 2026", passed: 27, defects: 31, rate: 46.6 },
  { month: "Jul 2026", passed: 28, defects: 20, rate: 58.3 },
  { month: "Jun 2026", passed: 40, defects: 17, rate: 70.2 },
];

function MonthlySummaryScreen() {
  const [category, setCategory] = useState<"all" | "mobile" | "laptop">("all");
  const totals = { all: 798, mobile: 343, laptop: 455 };
  const passRates = { all: 58.6, mobile: 71, laptop: 91 };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h5 className="text-sm font-bold text-[#17284D]">QC Monthly Summary Report</h5>
        <p className="text-[10px] text-[#8A93A6]">Aggregated monthly testing throughput & pass ratios</p>
      </div>

      <div className="flex gap-1 rounded-full bg-[#F4F6FB] p-0.5 w-fit">
        {(["all", "mobile", "laptop"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-bold capitalize transition-colors ${
              category === c ? "bg-[#0052CC] text-white" : "text-[#8A93A6] hover:text-[#4A5875]"
            }`}
          >
            {c === "all" ? <Boxes size={10} /> : c === "mobile" ? <Smartphone size={10} /> : <Laptop size={10} />}
            {c === "all" ? "All Evaluations" : `${c} QC`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard icon={TrendingUp} value={totals[category]} sub="Total Evaluations" color="bg-[#0052CC]/10 text-[#0052CC]" />
        <StatCard icon={Percent} value={passRates[category]} suffix="%" sub="Pass Efficiency" color="bg-emerald-100 text-emerald-600" />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DDE4F3]">
        <div className="grid grid-cols-[1fr_60px_60px_50px] gap-2 bg-[#F4F6FB] px-3 py-2 text-[8px] font-bold uppercase tracking-wide text-[#8A93A6]">
          <span>Billing Month</span>
          <span className="text-right">Passed</span>
          <span className="text-right">Defects</span>
          <span className="text-right">Rate</span>
        </div>
        {MONTHLY_LEDGER.map((row, idx) => (
          <motion.div
            key={row.month}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="grid grid-cols-[1fr_60px_60px_50px] items-center gap-2 border-t border-[#EEF1F8] px-3 py-2 text-[10px]"
          >
            <span className="font-bold text-[#17284D]">{row.month}</span>
            <span className="text-right font-semibold text-emerald-600">{row.passed}</span>
            <span className="text-right font-semibold text-red-600">{row.defects}</span>
            <span className="text-right font-bold text-[#0052CC]">{row.rate}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SHELL - SIDEBAR + HEADER + SCREEN SWITCH
--------------------------------------------------------- */

const SCREENS = [
  { key: "dashboard", label: "Dashboard", navGroup: "OVERVIEW", navIcon: LayoutDashboard, Screen: DashboardScreen },
  { key: "analytics", label: "Laptop Grades", navGroup: "GRADING TELEMETRY", navIcon: Award, Screen: AnalyticsScreen },
  { key: "licence", label: "Laptop Licences", navGroup: "LICENSE QUOTA", navIcon: KeyRound, Screen: LicenceReportScreen },
  { key: "laptop-qc", label: "Laptop QC", navGroup: "QC DIAGNOSTICS", navIcon: Laptop, Screen: LaptopQcScreen },
  { key: "summary", label: "Monthly Summary", navGroup: "OVERVIEW", navIcon: CalendarCheck, Screen: MonthlySummaryScreen },
];

const SIDEBAR_ORDER = ["OVERVIEW", "QC DIAGNOSTICS", "LICENSE QUOTA", "GRADING TELEMETRY"];

export default function AdminControlDemo() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const interactedRef = useRef(false);

  const goTo = (index: number, userDriven = false) => {
    if (userDriven) interactedRef.current = true;
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  useEffect(() => {
    if (interactedRef.current) return;
    const timer = setTimeout(() => {
      goTo((active + 1) % SCREENS.length);
    }, 5500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const current = SCREENS[active];
  const CurrentScreen = current.Screen;

  const navItems = SCREENS.map((s, idx) => ({ group: s.navGroup, label: s.label, icon: s.navIcon, goToIndex: idx }));

  return (
    <div className="flex h-full w-full overflow-hidden rounded-[22px] bg-white">
      {/* Sidebar */}
      <div className="hidden w-40 shrink-0 flex-col border-r border-[#DDE4F3] bg-[#FBFCFE] p-2.5 sm:flex">
        <div className="mb-3 flex items-center gap-1 px-1">
          <span className="text-sm font-extrabold tracking-tight text-[#17284D] font-display">
            Gadget<span className="text-[#0052CC]">IQ</span>
          </span>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto">
          {SIDEBAR_ORDER.map((group) => (
            <div key={group}>
              <p className="mb-1 px-1 text-[7.5px] font-bold uppercase tracking-wide text-[#B7C0D4]">{group}</p>
              <div className="space-y-0.5">
                {navItems
                  .filter((item) => item.group === group)
                  .map((item) => {
                    const Icon = item.icon;
                    const isActive = item.goToIndex === active;
                    return (
                      <button
                        key={item.label}
                        onClick={() => goTo(item.goToIndex, true)}
                        className={`flex w-full cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-[10px] font-semibold transition-colors ${
                          isActive ? "bg-[#0052CC]/10 text-[#0052CC]" : "text-[#4A5875] hover:bg-[#F4F6FB]"
                        }`}
                      >
                        <Icon size={12} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5 rounded-lg border border-[#DDE4F3] bg-white px-2 py-1.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0052CC] text-[8px] font-bold text-white">X</span>
          <div className="min-w-0">
            <p className="truncate text-[9px] font-bold text-[#17284D]">Xtracover</p>
            <p className="text-[7px] text-[#8A93A6]">Operator</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile tab strip (sidebar hidden below sm) */}
        <div className="flex gap-1.5 overflow-x-auto border-b border-[#DDE4F3] px-3 py-2 scrollbar-none sm:hidden">
          {SCREENS.map((s, idx) => {
            const Icon = s.navIcon;
            return (
              <button
                key={s.key}
                onClick={() => goTo(idx, true)}
                className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold transition-colors ${
                  idx === active ? "border-[#0052CC] bg-[#0052CC] text-white" : "border-[#DDE4F3] bg-white text-[#4A5875]"
                }`}
              >
                <Icon size={11} /> {s.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 border-b border-[#DDE4F3] px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#8A93A6]">
            <span className="hidden sm:inline">Welcome Back</span>
            <span className="font-bold text-[#17284D]">Xtracover Technologies</span>
          </div>
          <button className="flex cursor-pointer items-center justify-center rounded-full border border-[#DDE4F3] p-1.5 text-[#4A5875] transition-colors hover:bg-[#F4F6FB]">
            <RefreshCw size={11} />
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto p-3 sm:p-4">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current.key}
              custom={direction}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <CurrentScreen />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
