"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Cpu,
  Eye,
  Check,
  RectangleHorizontal,
  Slash,
  Asterisk,
  Waves,
  BatteryFull,
  Shield,
  ScanSearch,
  CheckCircle2,
  Laptop,
} from "lucide-react";

/* =========================================================
   LENS FLOW DIAGRAM

   The full 4-step GadgetIQ Lens journey — Capture, AI
   Detects Issues, Admin Dashboard, Final Report — shared
   between the Lens landing page hero and any other section
   that wants to showcase the complete flow.
========================================================= */

const HERO_DEFECTS = [
  { label: "Scratch", score: 0.94, color: "#F59E0B", location: "Top Left Panel" },
  { label: "Dent", score: 0.87, color: "#10B981", location: "Center Right Panel" },
  { label: "Crack", score: 0.91, color: "#EF4444", location: "Bottom Left / Hinge" },
  { label: "Scuff", score: 0.89, color: "#3B82F6", location: "Bottom Right Panel" },
];

const CAPTURE_ORDER = ["Front", "Back", "Left", "Right", "Top", "Bottom"];
const CAPTURE_LEFT = ["Front", "Left", "Top"];
const CAPTURE_RIGHT = ["Back", "Right", "Bottom"];

const REPORT_SUMMARY_ROWS = [
  { label: "Overall Condition", value: "Good", className: "text-emerald-600" },
  { label: "Issues Detected", value: String(HERO_DEFECTS.length), className: "text-[#17284D]" },
  { label: "Inspection Status", value: "Completed", className: "text-indigo-600" },
  { label: "Quality Report", value: "Generated", className: "text-indigo-600" },
];

const REPORT_DETAIL_ROWS = [
  { label: "Physical Condition", status: "Good", icon: Shield, good: true },
  { label: "Display", status: "Fair", icon: Eye, good: false },
  { label: "Battery Health", status: "Good", icon: BatteryFull, good: true },
  { label: "Functionality", status: "Good", icon: Cpu, good: true },
];

function HeroStepCard({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-[360px] flex-col gap-3 rounded-3xl border border-[#E4EAF5] bg-white p-3 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:min-h-[430px] sm:gap-4 sm:p-5 md:min-h-[460px] md:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-extrabold text-white shadow-[0_10px_20px_rgba(79,70,229,0.35)] sm:h-11 sm:w-11 sm:text-base">
          {number}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[#17284D] sm:text-lg md:text-xl">{title}</h3>
          <p className="mt-1 text-[11px] leading-relaxed text-[#5F6A86] sm:text-sm md:text-base">{description}</p>
        </div>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-2xl bg-[#EDF0F6] p-2.5 sm:p-5 md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(79,70,229,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(79,70,229,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <motion.span
          className="pointer-events-none absolute h-56 w-56 rounded-full bg-indigo-300/25 blur-3xl"
          animate={{ x: [-40, 40, -40], y: [-20, 20, -20] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="pointer-events-none absolute h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl"
          animate={{ x: [30, -30, 30], y: [24, -24, 24] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex w-full items-center justify-center">{children}</div>
      </div>
    </div>
  );
}

const CAPTURE_ANGLE_META: Record<string, { Icon: typeof Laptop; rotate?: string }> = {
  Front: { Icon: Laptop },
  Back: { Icon: Laptop },
  Left: { Icon: Laptop, rotate: "rotate-90" },
  Right: { Icon: Laptop, rotate: "-rotate-90" },
  Top: { Icon: RectangleHorizontal },
  Bottom: { Icon: RectangleHorizontal },
};

function CaptureRow({ angle, active, done }: { angle: string; active: boolean; done: boolean }) {
  const { Icon, rotate } = CAPTURE_ANGLE_META[angle];

  return (
    <div
      className={`flex w-full items-center gap-2.5 rounded-xl border-2 px-2.5 py-2 transition-colors duration-300 sm:gap-3 sm:px-3.5 sm:py-2.5 ${
        active
          ? "border-indigo-300 bg-indigo-50"
          : done
            ? "border-emerald-200 bg-emerald-50"
            : "border-[#E4EAF5] bg-white"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
          active ? "bg-indigo-100" : done ? "bg-emerald-100" : "bg-slate-100"
        }`}
      >
        <motion.span
          animate={active ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center"
        >
          <Icon
            className={`h-4 w-4 sm:h-5 sm:w-5 ${rotate ?? ""} ${
              active ? "text-indigo-600" : done ? "text-emerald-600" : "text-[#8896AC]"
            }`}
            strokeWidth={1.75}
          />
        </motion.span>
      </span>

      <span className="flex-1 text-xs font-extrabold uppercase tracking-wide text-[#17284D] sm:text-sm">
        {angle}
      </span>

      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full sm:h-6 sm:w-6 ${
          done ? "bg-emerald-500 text-white" : active ? "border-2 border-indigo-400" : "border-2 border-[#E4EAF5]"
        }`}
      >
        {done && <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" strokeWidth={3} />}
      </span>
    </div>
  );
}

function CaptureVisual() {
  const [count, setCount] = useState(0);
  const isComplete = count >= CAPTURE_ORDER.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((value) => {
        if (value >= CAPTURE_ORDER.length) {
          clearInterval(interval);
          return value;
        }
        return value + 1;
      });
    }, 650);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col items-center gap-3 sm:gap-5">
      <div className="grid w-full grid-cols-1 items-center gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-4 md:gap-6">
        <div className="order-2 flex flex-col gap-2 sm:order-1 sm:gap-2.5">
          {CAPTURE_LEFT.map((angle) => (
            <CaptureRow
              key={angle}
              angle={angle}
              active={CAPTURE_ORDER.indexOf(angle) === count}
              done={CAPTURE_ORDER.indexOf(angle) < count}
            />
          ))}
        </div>

        <div className="order-1 flex items-center justify-center sm:order-2">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-indigo-200 sm:h-24 sm:w-24 md:h-28 md:w-28">
            <motion.span
              className="absolute h-14 w-14 rounded-full border-2 border-indigo-300 sm:h-16 sm:w-16 md:h-20 md:w-20"
              animate={isComplete ? { scale: 1, opacity: 0 } : { scale: [1, 1.4], opacity: [0.55, 0] }}
              transition={{ duration: 1.6, repeat: isComplete ? 0 : Infinity, ease: "easeOut" }}
            />
            <Laptop className="relative h-8 w-8 text-indigo-600 sm:h-9 sm:w-9 md:h-11 md:w-11" strokeWidth={1.5} />
            <motion.span
              key={isComplete ? "done" : "capturing"}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`absolute -bottom-2 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-md sm:-bottom-2.5 sm:h-6 sm:w-6 md:h-7 md:w-7 ${
                isComplete ? "bg-emerald-500" : "bg-indigo-600"
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
              ) : (
                <Camera className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
              )}
            </motion.span>
          </div>
        </div>

        <div className="order-3 flex flex-col gap-2 sm:order-3 sm:gap-2.5">
          {CAPTURE_RIGHT.map((angle) => (
            <CaptureRow
              key={angle}
              angle={angle}
              active={CAPTURE_ORDER.indexOf(angle) === count}
              done={CAPTURE_ORDER.indexOf(angle) < count}
            />
          ))}
        </div>
      </div>

      <div>
        {isComplete ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 sm:text-base">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            All 6 Angles Captured
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 sm:text-base">
            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
            Capturing {CAPTURE_ORDER[count]}... ({count + 1}/{CAPTURE_ORDER.length})
          </span>
        )}
      </div>
    </div>
  );
}

const DETECT_MARKERS = [
  { marker: { x: 30, y: 33 }, tag: { x: 22, y: 26 }, tagStyle: { left: "2%", top: "18%" }, Icon: Slash },
  { marker: { x: 68, y: 30 }, tag: { x: 78, y: 25 }, tagStyle: { right: "2%", top: "18%" }, Icon: Asterisk },
  { marker: { x: 28, y: 56 }, tag: { x: 21, y: 63 }, tagStyle: { left: "2%", top: "62%" }, Icon: Asterisk },
  { marker: { x: 70, y: 72 }, tag: { x: 78, y: 76 }, tagStyle: { right: "2%", top: "72%" }, Icon: Waves },
];

function DetectVisual() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((value) => {
        if (value >= HERO_DEFECTS.length) {
          clearInterval(interval);
          return value;
        }
        return value + 1;
      });
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative aspect-[550/370] w-full max-w-[440px]">
      <span className="absolute left-1 top-1 flex items-center gap-1.5 rounded-md bg-[#0B1220]/85 px-2 py-1 text-xs font-bold text-white">
        {count >= HERO_DEFECTS.length ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Complete
          </>
        ) : (
          <>
            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
            Scanning
          </>
        )}
      </span>
      <span className="absolute right-1 top-1 rounded-md bg-[#0B1220]/85 px-2 py-1 text-xs font-bold text-white">
        {count} Found
      </span>

      {/* Laptop image */}
      <div className="absolute overflow-hidden" style={{ left: "15%", top: "19%", width: "70%", height: "62%" }}>
        <Image src="/images/dent-laptop.png" alt="Laptop with detected cosmetic issues" fill sizes="310px" className="object-contain" />
        {count < HERO_DEFECTS.length && (
          <motion.span
            className="pointer-events-none absolute left-0 h-[3px] w-full bg-indigo-400 shadow-[0_0_10px_2px_rgba(129,140,248,0.7)]"
            initial={{ top: "8%" }}
            animate={{ top: ["8%", "92%", "8%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full">
        {HERO_DEFECTS.map((defect, idx) => {
          const { marker, tag } = DETECT_MARKERS[idx];
          return (
            <g key={defect.label}>
              <motion.line
                x1={marker.x}
                y1={marker.y}
                x2={tag.x}
                y2={tag.y}
                stroke={defect.color}
                strokeWidth={1.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={idx < count ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <motion.circle
                cx={marker.x}
                cy={marker.y}
                r={1.4}
                fill={defect.color}
                vectorEffect="non-scaling-stroke"
                initial={{ opacity: 0, scale: 0 }}
                animate={idx < count ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </g>
          );
        })}
      </svg>

      {HERO_DEFECTS.map((defect, idx) => {
        const { marker, Icon } = DETECT_MARKERS[idx];
        return (
          <motion.div
            key={defect.label}
            className="pointer-events-none absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white/85"
            style={{ left: `${marker.x}%`, top: `${marker.y}%`, borderColor: defect.color }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={idx < count ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Icon className="h-4 w-4" style={{ color: defect.color }} strokeWidth={2} />
          </motion.div>
        );
      })}

      {HERO_DEFECTS.map((defect, idx) => {
        const { tagStyle } = DETECT_MARKERS[idx];
        return (
          <motion.div
            key={defect.label}
            className="pointer-events-none absolute -translate-y-1/2"
            style={tagStyle}
            initial={{ opacity: 0, y: 6 }}
            animate={idx < count ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
          >
            <span
              className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold text-white shadow-md"
              style={{ backgroundColor: defect.color }}
            >
              {defect.label} detected
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function DashboardVisual() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((value) => {
        if (value >= HERO_DEFECTS.length) {
          clearInterval(interval);
          return value;
        }
        return value + 1;
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-xl border border-[#E4EAF5] bg-white p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Laptop className="h-4 w-4" />
          </span>
          <span className="truncate text-sm font-bold text-[#17284D]">Laptop Inspection #LC-2048</span>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">
          {Math.min(count, HERO_DEFECTS.length)} issues
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-1 pb-1 text-[10px] font-bold uppercase tracking-wide text-[#8896AC]">
        <span>Issue</span>
        <span>Severity</span>
        <span>Status</span>
      </div>

      <div className="space-y-1">
        {HERO_DEFECTS.map((defect, idx) => (
          <motion.div
            key={defect.label}
            initial={{ opacity: 0, x: -6 }}
            animate={idx < count ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border border-[#E4EAF5] bg-[#FBFCFE] px-3 py-1.5"
          >
            <span className="flex items-center gap-2 text-sm font-bold text-[#17284D]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: defect.color }} />
              {defect.label}
            </span>
            <span className="text-xs font-semibold text-[#8896AC]">{idx % 2 === 0 ? "Minor" : "Moderate"}</span>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Detected
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {HERO_DEFECTS.map((defect, idx) => (
          <motion.div
            key={defect.label}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={idx < count ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="flex h-12 flex-col items-center justify-center rounded-lg border sm:h-14"
            style={{ borderColor: `${defect.color}55`, backgroundColor: `${defect.color}0D` }}
          >
            <ScanSearch className="h-5 w-5" style={{ color: defect.color }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReportVisual() {
  const targetOffset = 2 * Math.PI * 32 * (1 - 0.82);

  return (
    <div className="flex w-full flex-col gap-2.5">
      <div className="flex items-center gap-3 rounded-xl border border-[#E4EAF5] bg-[#FBFCFE] p-3">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <motion.span
            className="absolute h-16 w-16 rounded-full bg-emerald-400/10"
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0.15, 0.6] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <svg viewBox="0 0 80 80" className="relative h-16 w-16 -rotate-90">
            <circle cx="40" cy="40" r="32" strokeWidth="8" fill="none" className="stroke-[#E4EAF5]" />
            <motion.circle
              cx="40"
              cy="40"
              r="32"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="stroke-emerald-500"
              strokeDasharray={2 * Math.PI * 32}
              initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
              animate={{ strokeDashoffset: targetOffset }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-lg font-extrabold leading-none text-emerald-600">B</span>
            <span className="mt-0.5 text-[8px] font-bold uppercase tracking-wide text-[#8896AC]">Grade</span>
          </div>
        </div>

        <div className="h-11 w-px shrink-0 bg-[#E4EAF5]" />

        <div className="min-w-0 flex-1 space-y-1.5">
          {REPORT_SUMMARY_ROWS.map((row, idx) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * idx, duration: 0.3 }}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <span className="font-semibold text-[#8896AC]">{row.label}</span>
              <span className={`font-bold ${row.className}`}>{row.value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[#E4EAF5] bg-white p-3">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[#8896AC]">Detailed Report</p>
        <div className="divide-y divide-[#E4EAF5]">
          {REPORT_DETAIL_ROWS.map((row, idx) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 * idx + 0.4, duration: 0.3 }}
              className="flex items-center justify-between py-1.5 text-xs"
            >
              <span className="flex items-center gap-2 font-semibold text-[#17284D]">
                <row.icon className="h-4 w-4 text-[#8896AC]" strokeWidth={1.75} />
                {row.label}
              </span>
              <span className={`font-bold ${row.good ? "text-emerald-600" : "text-amber-500"}`}>{row.status}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const HERO_FLOW_STEPS = [
  {
    title: "Capture 6 Images",
    description: "Take photos from 6 different angles of the laptop.",
    duration: 5000,
    Visual: CaptureVisual,
  },
  {
    title: "AI Detects Issues",
    description: "AI-powered image recognition identifies visible defects.",
    duration: 10000,
    Visual: DetectVisual,
  },
  {
    title: "Issues Highlighted on Admin Dashboard",
    description: "All detected issues are shown with images for easy review.",
    duration: 4800,
    Visual: DashboardVisual,
  },
  {
    title: "Final Grade & Quality Report",
    description: "Get a complete condition grade and detailed quality report.",
    duration: 5600,
    Visual: ReportVisual,
  },
];

export default function LensFlowDiagram() {
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep((current) => {
        const next = current + 1;
        if (next >= HERO_FLOW_STEPS.length) {
          setCycle((value) => value + 1);
          return 0;
        }
        return next;
      });
    }, HERO_FLOW_STEPS[step].duration);
    return () => clearTimeout(timer);
  }, [step]);

  const active = HERO_FLOW_STEPS[step];
  const ActiveVisual = active.Visual;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${step}-${cycle}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <HeroStepCard number={step + 1} title={active.title} description={active.description}>
            <ActiveVisual />
          </HeroStepCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
