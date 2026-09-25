"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import StickyQuoteForm from "../_components/StickyQuoteForm";
import BookDemo from "../_components/BookDemo";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Cpu,
  ArrowRight,
  Eye,
  Check,
  RectangleHorizontal,
  Slash,
  Asterisk,
  Waves,
  FileCheck,
  BatteryFull,
  AlertTriangle,
  X,
  Shield,
  Clock,
  FileText,
  TrendingUp,
  Download,
  ChevronDown,
  ScanSearch,
  Image as ImageIcon,
  ShieldCheck,
  Info,
  CheckCircle2,
  Laptop,
} from "lucide-react";

const HERO_DEFECTS = [
  {
    label: "Scratch",
    score: 0.94,
    color: "#F59E0B",
    location: "Top Left Panel",
  },
  {
    label: "Dent",
    score: 0.87,
    color: "#10B981",
    location: "Center Right Panel",
  },
  {
    label: "Crack",
    score: 0.91,
    color: "#EF4444",
    location: "Bottom Left / Hinge",
  },
  {
    label: "Scuff",
    score: 0.89,
    color: "#3B82F6",
    location: "Bottom Right Panel",
  },
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

function LensHeroFlowDiagram() {
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

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Upload Photos",
    desc: "Capture images of your device from different angles",
    image: "/images/upload-photos.jpg",
  },
  {
    step: 2,
    title: "AI Analysis",
    desc: "Our AI inspects and detects visible cosmetic issues",
    image: "/images/ai-analysis.jpg",
  },
  {
    step: 3,
    title: "Get Grade",
    desc: "Receive a clear device grade (A+ to H)",
    image: "/images/get-grade.jpg",
  },
  {
    step: 4,
    title: "View Report",
    desc: "Access a detailed report with images and issue highlights",
    image: "/images/view-report.jpg",
  },
];

const PROOF_FEATURES = [
  {
    title: "AI-powered detection",
    desc: "Automatically identifies scratches, dents, scuffs and visible wear.",
    icon: ScanSearch,
  },
  {
    title: "Image evidence",
    desc: "View highlighted areas with close-up images for transparency.",
    icon: ImageIcon,
  },
  {
    title: "Consistent grading",
    desc: "Standardised grades based on visible condition.",
    icon: ShieldCheck,
  },
];

const BUSINESS_BENEFITS = [
  { title: "Build Trust", desc: "Give buyers clearer device condition information.", icon: Shield },
  { title: "Improve Valuation", desc: "Make informed resale decisions.", icon: TrendingUp },
  { title: "Save Time", desc: "Reduce repetitive manual inspection.", icon: Clock },
  { title: "Reduce Disputes", desc: "Share clear condition reports.", icon: FileCheck },
];

const FAQ_ITEMS = [
  {
    question: "How can I start a free trial?",
    answer: "Click \"Book a Free Trial\" and our team will help you get started, with no commitment required.",
  },
  {
    question: "Does Lens check functional issues?",
    answer:
      "No. Gadget Lens focuses on cosmetic condition, including scratches, dents, and wear. Functional testing is handled separately by Gadget Evaluate.",
  },
  {
    question: "Can I download and share reports?",
    answer:
      "Yes. Every inspection generates a report you can download and share with buyers, sellers, or your team.",
  },
  {
    question: "What does the confidence score mean?",
    answer: "It reflects how certain the AI is about its cosmetic assessment for a given photo set.",
  },
  {
    question: "How does laptop grading work?",
    answer:
      "Upload photos from 6 angles, and our AI analyses them to detect visible issues and assign a cosmetic grade.",
  },
  {
    question: "Which devices does Lens support?",
    answer: "Gadget Lens currently supports laptop grading.",
  },
];

const GRADE_SCALE = [
  { grade: "A+", color: "#16A34A", title: "Like New", desc: "No visible issues" },
  { grade: "A", color: "#34D399", title: "Excellent", desc: "Minimal signs of use" },
  { grade: "B", color: "#3B82F6", title: "Good", desc: "Light wear" },
  { grade: "C", color: "#FBBF24", title: "Fair", desc: "Noticeable wear" },
  { grade: "D", color: "#F97316", title: "Used", desc: "Visible marks" },
  { grade: "E", color: "#EA580C", title: "Heavy Wear", desc: "Multiple issues" },
  { grade: "F", color: "#DC2626", title: "Poor", desc: "Significant damage" },
  { grade: "H", color: "#7F1D1D", title: "For Parts", desc: "Major cosmetic issues" },
];

export default function GadgetIQLensPage() {
  const mounted = typeof window !== "undefined";
  const [showFullGrading, setShowFullGrading] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="relative min-h-screen bg-[#F4F6FB] text-[#17284D] overflow-hidden selection:bg-blue-600/20 selection:text-[#17284D] font-sans">
      <StickyQuoteForm />

      {/* Background ambient mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,82,204,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.06),transparent_35%),radial-gradient(circle_at_50%_75%,rgba(0,82,204,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,82,204,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,82,204,0.025)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
      </div>

      {/* Header */}
      <Navbar />

      <main className="relative z-10 pt-28 flex flex-col items-center">
        {/* Top Hero Section */}
        <section className="flex w-full max-w-7xl min-h-[calc(100svh-112px)] items-center px-4 pt-2 pb-6 sm:px-6 sm:pt-4 sm:pb-10 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-[40%_60%] gap-8 lg:gap-12 items-center w-full">
            {/* Left Column: Hero Text */}
            <div className="space-y-6">
              <div className="inline-flex rounded-full bg-[#E9F1FC] px-4 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0068E8]">
                  Global Device Intelligence
                </span>
              </div>

              <h1 className="mt-4 text-left text-[33.6px] font-bold leading-[0.98] tracking-[-0.045em] text-[#12264D] sm:text-[38.4px] lg:text-[43.2px] xl:text-[48px]">
                AI-Powered Laptop
                <br />
                <span className="whitespace-nowrap italic text-[#0868E9]">Grading Made Simple.</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[#5F6A86] leading-relaxed max-w-2xl">
                Upload 6 photos. Get a cosmetic grade, confidence score and detailed report.
                Make faster, more consistent decisions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#contact"
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight hover:shadow-brand-btn-orange/45 text-white font-bold text-sm shadow-lg shadow-brand-btn-orange/25 flex items-center space-x-2 transition-all group btn-shimmer"
                >
                  <span>Book a Free Trial</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </a>

                <Link
                  href="/gadgetiq/lens/login"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#17284D] border border-[#DDE4F3] font-bold text-sm shadow-xs flex items-center space-x-2 transition-all hover:border-blue-300"
                >
                  <span>Sign In</span>
                </Link>
              </div>

              {/* Proof Strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-[#DDE4F3] text-xs sm:text-sm font-semibold text-[#5F6A86]">
                <span>Capture 6 Angles</span>
                <span className="text-[#B8C2D9]">•</span>
                <span>AI Issue Detection</span>
                <span className="text-[#B8C2D9]">•</span>
                <span>Final Grade Report</span>
              </div>
            </div>

            {/* Right Column: Sample Laptop Grading Visual */}
            <div>
              <LensHeroFlowDiagram />
            </div>
          </div>
        </section>

        {/* Proof & Credibility Section */}
        <div className="w-full bg-white">
          <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
              {/* Left: copy + features */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5">
                  <Eye className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600">
                    Gadget Lens
                  </span>
                </div>

                <h2 className="mt-4 text-[15px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[21px] lg:text-[25px] font-display">
                  Grading you can{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                    trust.
                  </span>
                </h2>

                <p className="mt-2 text-sm font-semibold text-[#5F6A86] sm:text-base">
                  Show real evidence.
                </p>

                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5F6A86]">
                  Our AI identifies visible scratches, dents and other cosmetic issues and
                  provides a clear grade with image evidence.
                </p>

                <div className="mt-8 space-y-4 sm:space-y-6">
                  {PROOF_FEATURES.map((feature) => (
                    <div key={feature.title} className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 sm:h-11 sm:w-11">
                        <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#17284D]">{feature.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-[#5F6A86] sm:text-sm">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: annotated laptop + grade card + thumbnails */}
              <div className="w-full">
                <div className="relative aspect-[550/370] w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/images/hp-laptop.jpg"
                    alt="Laptop with AI-annotated scratch, dent, crack, and scuff defects"
                    fill
                    sizes="(min-width: 1024px) 500px, 90vw"
                    className="rounded-2xl object-contain"
                  />

                  {/* Desktop/tablet: grade card floats over the image */}
                  <div className="absolute right-2 top-2 hidden w-[200px] rounded-2xl border border-[#DDE4F3] bg-white p-4 shadow-xl sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F6A86]">
                      Cosmetic Grade
                    </p>
                    <p className="mt-1 text-3xl font-extrabold leading-none text-blue-600">B</p>
                    <p className="mt-1 text-sm font-bold leading-tight text-[#17284D]">Good Condition</p>
                    <p className="text-xs leading-tight text-[#5F6A86]">Light visible wear</p>

                    <div className="mt-3 border-t border-[#DDE4F3] pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F6A86]">
                        Confidence Score
                      </p>
                      <p className="mt-1 text-xl font-extrabold leading-none text-blue-600">87%</p>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E4EAF5]">
                        <motion.div
                          className="h-full rounded-full bg-blue-500"
                          initial={{ width: 0 }}
                          whileInView={{ width: "87%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile: grade card sits below the image instead of overlaying it */}
                <div className="mt-3 w-full rounded-xl border border-[#DDE4F3] bg-white p-3 shadow-lg sm:hidden">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#5F6A86]">
                    Cosmetic Grade
                  </p>
                  <p className="mt-1 text-2xl font-extrabold leading-none text-blue-600">B</p>
                  <p className="mt-1 text-xs font-bold leading-tight text-[#17284D]">Good Condition</p>
                  <p className="text-[10px] leading-tight text-[#5F6A86]">Light visible wear</p>

                  <div className="mt-2 border-t border-[#DDE4F3] pt-2">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#5F6A86]">
                      Confidence Score
                    </p>
                    <p className="mt-1 text-lg font-extrabold leading-none text-blue-600">87%</p>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E4EAF5]">
                      <motion.div
                        className="h-full rounded-full bg-blue-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: "87%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl bg-[#F4F6FB] px-4 py-3 text-xs sm:flex-row sm:items-center sm:text-sm">
                  <div className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#5F6A86]" />
                    <span className="text-[#5F6A86] sm:whitespace-nowrap">
                      Grading is based on visible external condition only.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowFullGrading(true)}
                    className="flex shrink-0 items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <span>View full grading criteria</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Business Benefits Section */}
        <div
          className="w-full"
          style={{
            backgroundImage: "url('/images/blue-bg-img.png')",
            backgroundSize: "cover",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-6 lg:px-8">
            <div className="max-w-sm shrink-0 text-left lg:pl-[2%]">
              <h2 className="text-[15px] font-bold leading-tight tracking-tight text-white sm:text-[21px] lg:text-[25px] font-display">
                Better grading.{" "}
                <span className="text-white">Better decisions.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
              {BUSINESS_BENEFITS.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center gap-3 text-center lg:px-6 lg:first:pl-0 lg:last:pr-0"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-indigo-400 text-indigo-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* How It Works Section */}
        <div className="w-full bg-white">
          <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-[15px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[21px] lg:text-[25px] font-display">
                From photos to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  a clear grade.
                </span>
              </h2>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
            >
              {HOW_IT_WORKS.map((item, idx) => (
                <motion.div
                  key={item.step}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  className="relative"
                >
                  <div className="relative h-full rounded-2xl border border-[#DDE4F3] bg-white p-7 shadow-xs transition-shadow duration-300 hover:shadow-lg">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.12 * idx + 0.2, ease: "backOut" }}
                      className="absolute -top-3 -left-1 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-md"
                    >
                      {item.step}
                    </motion.div>
                    <div className="relative mt-2 aspect-[660/500] w-full overflow-hidden rounded-xl bg-indigo-50">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
                        className="object-contain"
                      />
                    </div>
                    <h3 className="mt-5 text-sm font-bold text-[#17284D]">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#5F6A86]">{item.desc}</p>
                  </div>

                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div className="absolute top-1/2 left-full z-10 hidden w-8 -translate-y-1/2 items-center lg:flex">
                      <div className="h-px flex-1 bg-[#DDE4F3]" />
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#DDE4F3] bg-white text-indigo-500 shadow-xs">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>

        {/* Sample Grading Report Section */}
        <div className="w-full bg-[#F4F6FB]">
          <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5">
                <FileText className="h-3.5 w-3.5 text-indigo-600" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-600">
                  Sample Report
                </span>
              </div>

              <h2 className="mt-4 text-[15px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[21px] lg:text-[25px] font-display">
                See exactly{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  what you get.
                </span>
              </h2>

              <p className="mt-3 text-sm sm:text-base text-[#5F6A86]">
                Explore a sample laptop inspection report.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 items-center gap-10 rounded-[32px] border border-[#DDE4F3] bg-white p-6 shadow-xl sm:p-10 lg:grid-cols-2 lg:gap-14">
              {/* Laptop visual */}
              <div className="relative aspect-[1021/623] w-full">
                <Image
                  src="/images/gadget-lens-laptop.png"
                  alt="Sample laptop inspection report showing annotated scratches and dents"
                  fill
                  sizes="(min-width: 1024px) 500px, 90vw"
                  className="object-contain"
                />
                <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900/80 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white shadow sm:px-3 sm:text-[10px]">
                  Illustrative sample
                </span>
              </div>

              {/* Report detail panel */}
              <div className="space-y-5">
                <div className="flex items-center justify-between rounded-2xl border border-[#DDE4F3] bg-[#F7FAFE] p-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F6A86]">
                      Cosmetic Grade
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-base font-extrabold text-white">
                        B
                      </span>
                      <span className="text-base font-bold text-[#17284D]">Good</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F6A86]">
                      Confidence Score
                    </p>
                    <p className="mt-1.5 text-2xl font-extrabold text-emerald-600">94%</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#DDE4F3] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F6A86]">
                    Detected Defects &amp; Severity
                  </p>
                  <div className="mt-3 space-y-2.5">
                    {[
                      { name: "Scratches", severity: "Minor", count: 2 },
                      { name: "Dents", severity: "Minor", count: 1 },
                      { name: "Wear & Tear", severity: "Minor", count: 1 },
                    ].map((row) => (
                      <div
                        key={row.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="font-semibold text-[#17284D]">{row.name}</span>
                        </div>
                        <span className="text-xs font-medium text-[#5F6A86]">
                          {row.severity} · {row.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="/images/device-report.PDF"
                  download="Gadget-Lens-Sample-Report.pdf"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-btn-orange/25 transition-all hover:shadow-brand-btn-orange/45 btn-shimmer cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Sample Report</span>
                </a>

                <p className="text-center text-[11px] text-[#8896AC] sm:text-left">
                  Sample data for illustration. Your report will reflect your device&apos;s actual
                  condition.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* FAQ Section */}
        <div className="w-full bg-[#F4F6FB]">
          <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <h2 className="text-left text-[15px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[21px] lg:text-[25px] font-display">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5F6A86] sm:text-base">
                Short answers to common questions about grading, reports and getting started.
              </p>
            </div>

            <div className="rounded-2xl border border-[#DDE4F3] bg-white p-3 shadow-md">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={item.question} className="border-b border-[#DDE4F3]/60 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:text-[#0052CC]"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`font-display text-sm font-bold transition-colors ${
                          isOpen ? "text-[#0052CC]" : "text-[#17284D]"
                        }`}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#0052CC]" : "text-slate-400"
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm font-normal leading-relaxed text-[#4A5875]">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Book a Demo Form */}
        <BookDemo ctaLabel="Book a Free Trial" />
      </main>

      {/* Footer */}
      <Footer />
      <ScrollToTop />


      {mounted &&
        createPortal(
          <AnimatePresence>
            {showFullGrading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 p-6 backdrop-blur-sm"
                onClick={() => setShowFullGrading(false)}
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.92, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={(event) => event.stopPropagation()}
                  className="relative w-full max-w-2xl rounded-3xl border border-[#DDE4F3] bg-white p-6 shadow-2xl sm:p-8"
                >
                  <button
                    type="button"
                    onClick={() => setShowFullGrading(false)}
                    className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#DDE4F3] bg-white text-[#17284D] shadow-xs transition hover:bg-slate-50"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <h3 className="text-base font-bold text-[#17284D] sm:text-lg">
                    Full Grading Criteria
                  </h3>
                  <p className="mt-1 text-xs text-[#5F6A86] sm:text-sm">
                    Every laptop is assigned one of the grades below, based on its visible
                    cosmetic condition.
                  </p>

                  <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
                    {GRADE_SCALE.map((g) => (
                      <div key={g.grade} className="text-center">
                        <div
                          className="flex h-10 items-center justify-center rounded-lg text-sm font-extrabold text-white shadow-xs"
                          style={{ backgroundColor: g.color }}
                        >
                          {g.grade}
                        </div>
                        <p className="mt-1.5 text-[10px] font-bold leading-tight text-[#17284D]">
                          {g.title}
                        </p>
                        <p className="text-[9px] leading-tight text-[#5F6A86]">{g.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div
                    className="mt-4 h-2 rounded-full"
                    style={{
                      background:
                        "linear-gradient(to right, #16A34A, #34D399, #3B82F6, #FBBF24, #F97316, #EA580C, #DC2626, #7F1D1D)",
                    }}
                  />
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold text-[#17284D] sm:text-[11px]">
                    <span>Best Condition</span>
                    <span>Most Issues Detected</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}
