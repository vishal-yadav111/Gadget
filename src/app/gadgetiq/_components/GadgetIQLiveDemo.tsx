"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Award,
  Bluetooth,
  Battery,
  BrainCircuit,
  Camera,
  Check,
  ChevronRight,
  CircuitBoard,
  CreditCard,
  Disc3,
  Download,
  FileText,
  Hammer,
  HardDrive,
  Cpu,
  Info,
  Keyboard,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  MemoryStick,
  Mic,
  MousePointer2,
  MousePointerClick,
  Network,
  Play,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  SignalHigh,
  Sparkles,
  Usb,
  Volume2,
  Wifi,
  X,
  type LucideIcon,
} from "lucide-react";

type Status = "idle" | "running" | "pass" | "fail";
type Step = "scan" | "analysis" | "grade" | "report-gen" | "report";

interface TestDef {
  id: string;
  device: string;
  testName: string;
  icon: LucideIcon;
  durationMs: number;
}

const TESTS: TestDef[] = [
  { id: "speaker", device: "Speaker", testName: "Audio Playback Test", icon: Volume2, durationMs: 700 },
  { id: "battery-health", device: "Battery", testName: "Battery Health Test", icon: Battery, durationMs: 700 },
  { id: "internet", device: "Internet Connectivity", testName: "Internet Test", icon: SignalHigh, durationMs: 600 },
  { id: "wireless", device: "Wireless", testName: "Wireless Test", icon: Wifi, durationMs: 600 },
  { id: "bluetooth", device: "Bluetooth", testName: "Bluetooth Test", icon: Bluetooth, durationMs: 600 },
  { id: "ethernet", device: "Wired Ethernet", testName: "Wired Ethernet Test", icon: Network, durationMs: 600 },
  { id: "optical", device: "Optical Disk Drive", testName: "Optical Drive Test", icon: Disc3, durationMs: 600 },
  { id: "cpu", device: "Processor", testName: "Processor Test", icon: Cpu, durationMs: 700 },
  { id: "ram", device: "Memory", testName: "Memory Test", icon: MemoryStick, durationMs: 700 },
  { id: "motherboard", device: "Motherboard", testName: "Motherboard Test", icon: CircuitBoard, durationMs: 600 },
  { id: "storage", device: "Storage", testName: "HDD / SSD Test", icon: HardDrive, durationMs: 700 },
  { id: "gpu", device: "GPU", testName: "Graphics Test", icon: Cpu, durationMs: 700 },
  { id: "sdcard", device: "SD Card Slot", testName: "SD Card Slot Test", icon: CreditCard, durationMs: 600 },
  { id: "mic", device: "Microphone", testName: "Audio Recording Test", icon: Mic, durationMs: 700 },
  { id: "touchpad", device: "Touchpad", testName: "Touchpad Test", icon: MousePointer2, durationMs: 600 },
  { id: "keyboard", device: "Keyboard", testName: "Keyboard Test", icon: Keyboard, durationMs: 700 },
  { id: "camera", device: "Camera", testName: "Camera Photo Test", icon: Camera, durationMs: 600 },
  { id: "usb", device: "USB Ports", testName: "USB Port Test", icon: Usb, durationMs: 600 },
  { id: "display", device: "Display", testName: "Display Test", icon: LayoutDashboard, durationMs: 700 },
  { id: "physical", device: "Physical Condition", testName: "Cosmetic Inspection", icon: Hammer, durationMs: 700 },
  { id: "battery", device: "Battery Stress", testName: "Battery Stress Test", icon: Battery, durationMs: 2200 },
  { id: "winactivation", device: "Windows Activation", testName: "Windows Activation Test", icon: KeyRound, durationMs: 600 },
];

const ANALYSIS_ITEMS = [
  "Combining test results...",
  "Checking test results...",
  "Analyzing detected issues...",
  "Calculating device condition...",
  "Generating final grade...",
];

const REPORT_PHASES = [
  "Compiling device information...",
  "Adding test results...",
  "Including images and evidence...",
  "Finalizing report...",
];

const JOURNEY: { key: Step; label: string; icon: LucideIcon }[] = [
  { key: "scan", label: "Scan", icon: ScanLine },
  { key: "analysis", label: "Software Analysis", icon: BrainCircuit },
  { key: "grade", label: "Evaluate Grading", icon: Award },
  { key: "report-gen", label: "Evaluate Report", icon: FileText },
];

function stepIndex(step: Step) {
  if (step === "report") return JOURNEY.length - 1;
  return JOURNEY.findIndex((j) => j.key === step);
}

function getGradeInfo(failed: number) {
  if (failed === 0) return { letter: "A", desc: "Excellent Condition", text: "text-emerald-600", stroke: "stroke-emerald-500", glow: "bg-emerald-400/15" };
  if (failed === 1) return { letter: "A-", desc: "Excellent Condition", text: "text-emerald-600", stroke: "stroke-emerald-500", glow: "bg-emerald-400/15" };
  if (failed === 2) return { letter: "B+", desc: "Good Condition", text: "text-[#0052CC]", stroke: "stroke-[#0052CC]", glow: "bg-[#0052CC]/15" };
  if (failed <= 4) return { letter: "B", desc: "Fair Condition", text: "text-amber-600", stroke: "stroke-amber-500", glow: "bg-amber-400/15" };
  return { letter: "C", desc: "Needs Attention", text: "text-red-600", stroke: "stroke-red-500", glow: "bg-red-400/15" };
}

const CONFETTI_BURST = [
  { x: -60, y: -40, color: "#10B981" },
  { x: 55, y: -50, color: "#0052CC" },
  { x: -80, y: 10, color: "#F59E0B" },
  { x: 75, y: 5, color: "#EF4444" },
  { x: -35, y: -70, color: "#3B82F6" },
  { x: 40, y: -75, color: "#10B981" },
  { x: -65, y: 45, color: "#0052CC" },
  { x: 65, y: 50, color: "#F59E0B" },
];

function initialStatus(): Record<string, Status> {
  const initial: Record<string, Status> = {};
  TESTS.forEach((t) => {
    initial[t.id] = "idle";
  });
  return initial;
}

function initialTestedOn(): Record<string, string | null> {
  const initial: Record<string, string | null> = {};
  TESTS.forEach((t) => {
    initial[t.id] = null;
  });
  return initial;
}

const screenVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 24 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -24 }),
};

const DEVICE_INFO = {
  systemType: "Desktop",
  manufacturer: "Precision",
  model: "X-11",
  serial: "XC-90210",
  bios: "v2.4.1",
};

const SESSION_INFO = {
  user: "demo_technician",
  date: "07-Aug-2026",
  licenses: "108",
  licenceValidTill: "05-09-2026",
};

export default function GadgetIQLiveDemo() {
  const [step, setStep] = useState<Step>("scan");
  const [maxIndex, setMaxIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [infoTab, setInfoTab] = useState<"diagnostics" | "system">("diagnostics");
  const [clock, setClock] = useState("--:--:-- --");

  const [status, setStatus] = useState<Record<string, Status>>(initialStatus);
  const [testedOn, setTestedOn] = useState<Record<string, string | null>>(initialTestedOn);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [batterySecondsLeft, setBatterySecondsLeft] = useState<number | null>(null);

  const [analysisStepIdx, setAnalysisStepIdx] = useState(0);
  const [reportProgress, setReportProgress] = useState(0);
  const [reportPhaseIdx, setReportPhaseIdx] = useState(0);

  const goto = (s: Step) => {
    setDirection(stepIndex(s) >= stepIndex(step) ? 1 : -1);
    setStep(s);
    setMaxIndex((m) => Math.max(m, stepIndex(s)));
  };

  const autoAdvancedRef = useRef(false);
  const gradeAutoAdvancedRef = useRef(false);

  const restart = () => {
    setStep("scan");
    setMaxIndex(0);
    setStatus(initialStatus());
    setTestedOn(initialTestedOn());
    setIsRunningAll(false);
    setBatterySecondsLeft(null);
    setAnalysisStepIdx(0);
    setReportProgress(0);
    setReportPhaseIdx(0);
    autoAdvancedRef.current = false;
    gradeAutoAdvancedRef.current = false;
  };

  function formatNow() {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    let hours = d.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${pad(hours)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`;
  }

  useEffect(() => {
    setClock(formatNow());
    const id = setInterval(() => setClock(formatNow()), 1000);
    return () => clearInterval(id);
  }, []);

  async function runOne(test: TestDef) {
    setStatus((prev) => ({ ...prev, [test.id]: "running" }));

    if (test.id === "battery") {
      const totalSeconds = Math.round(test.durationMs / 1000);
      setBatterySecondsLeft(totalSeconds);
      for (let s = totalSeconds - 1; s >= 0; s--) {
        await new Promise((r) => setTimeout(r, 1000));
        setBatterySecondsLeft(s);
      }
      setBatterySecondsLeft(null);
    } else {
      await new Promise((r) => setTimeout(r, test.durationMs));
    }

    const outcome: Status = test.id === "display" ? "fail" : "pass";
    setStatus((prev) => ({ ...prev, [test.id]: outcome }));
    setTestedOn((prev) => ({ ...prev, [test.id]: formatNow() }));
  }

  async function runAll() {
    if (isRunningAll) return;
    setIsRunningAll(true);
    for (const test of TESTS) {
      await runOne(test);
    }
    setIsRunningAll(false);
  }

  const applicableCount = TESTS.length;
  const passedCount = TESTS.filter((t) => status[t.id] === "pass").length;
  const failedCount = TESTS.filter((t) => status[t.id] === "fail").length;
  const attemptedCount = passedCount + failedCount;
  const allAttempted = attemptedCount === applicableCount;
  const anyRunning = Object.values(status).some((s) => s === "running");

  // Auto-advance to Analysis once every test has been run
  useEffect(() => {
    if (step !== "scan" || !allAttempted || autoAdvancedRef.current) return;
    autoAdvancedRef.current = true;
    const timer = setTimeout(() => goto("analysis"), 900);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, allAttempted]);

  // Analysis auto-run
  useEffect(() => {
    if (step !== "analysis") return;
    setAnalysisStepIdx(0);
    let cancelled = false;
    (async () => {
      for (let i = 0; i < ANALYSIS_ITEMS.length; i++) {
        await new Promise((r) => setTimeout(r, 600));
        if (cancelled) return;
        setAnalysisStepIdx(i + 1);
      }
      await new Promise((r) => setTimeout(r, 500));
      if (!cancelled) goto("grade");
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Auto-advance from Grade reveal to Report generation
  useEffect(() => {
    if (step !== "grade" || gradeAutoAdvancedRef.current) return;
    gradeAutoAdvancedRef.current = true;
    const timer = setTimeout(() => goto("report-gen"), 2600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Report generation auto-run
  useEffect(() => {
    if (step !== "report-gen") return;
    setReportProgress(0);
    setReportPhaseIdx(0);
    let cancelled = false;
    (async () => {
      const totalMs = 2200;
      const tickMs = 80;
      let elapsed = 0;
      while (elapsed < totalMs) {
        await new Promise((r) => setTimeout(r, tickMs));
        if (cancelled) return;
        elapsed += tickMs;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        setReportProgress(pct);
        setReportPhaseIdx(Math.min(REPORT_PHASES.length - 1, Math.floor((pct / 100) * REPORT_PHASES.length)));
      }
      await new Promise((r) => setTimeout(r, 300));
      if (!cancelled) goto("report");
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const currentIndex = stepIndex(step);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-white">
      {/* App header */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-[#DDE4F3] px-4 py-2.5 text-[10px] font-semibold text-[#4A5875] sm:px-6">
        <span className="text-sm font-extrabold tracking-tight text-[#17284D] font-display">
          Gadget<span className="text-[#0052CC]">IQ</span>
        </span>
        <span className="hidden sm:inline">
          Welcome <strong className="text-[#17284D]">{SESSION_INFO.user}</strong>
        </span>
        <span className="hidden md:inline">Date: {SESSION_INFO.date}</span>
        <span className="hidden md:inline">Time: {clock}</span>
        <span className="hidden lg:inline">Licenses: {SESSION_INFO.licenses}</span>
        <span className="hidden lg:inline">Licence Valid Till: {SESSION_INFO.licenceValidTill}</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Internet Status: <span className="text-emerald-600">Online</span>
        </span>
      </div>

      {/* Device info bar */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-[#DDE4F3] bg-[#FBFCFE] px-4 py-2 text-[10px] font-medium text-[#4A5875] sm:px-6">
        <span>System Type: <strong className="text-[#17284D]">{DEVICE_INFO.systemType}</strong></span>
        <span>Manufacturer: <strong className="text-[#17284D]">{DEVICE_INFO.manufacturer}</strong></span>
        <span>Model: <strong className="text-[#17284D]">{DEVICE_INFO.model}</strong></span>
        <span>Serial Number: <strong className="text-[#17284D]">{DEVICE_INFO.serial}</strong></span>
        <span>Bios Version: <strong className="text-[#17284D]">{DEVICE_INFO.bios}</strong></span>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-6">
      {/* Journey breadcrumb */}
      <div className="flex flex-wrap items-center justify-center gap-y-1.5 gap-x-1 pb-1">
        {JOURNEY.map((item, idx) => {
          const reachable = idx <= maxIndex;
          const isCurrent = idx === currentIndex;
          const isDone = idx < currentIndex;
          const Icon = item.icon;
          return (
            <div key={item.key} className="flex shrink-0 items-center">
              <button
                onClick={() => reachable && goto(item.key)}
                disabled={!reachable}
                className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-[15px] font-bold transition-colors ${
                  isCurrent
                    ? "border-[#0052CC] bg-[#0052CC] text-white"
                    : isDone
                    ? "border-[#0052CC]/20 bg-[#0052CC]/10 text-[#0052CC]"
                    : "border-[#DDE4F3] bg-white text-[#4A5875]"
                } ${reachable && !isCurrent ? "cursor-pointer hover:bg-[#0052CC]/10" : ""} ${
                  !reachable ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isCurrent
                      ? "bg-white text-[#0052CC]"
                      : isDone
                      ? "bg-[#0052CC] text-white"
                      : "bg-[#F4F6FB] text-[#8A93A6]"
                  }`}
                >
                  {isDone ? <Check size={12} strokeWidth={3} /> : idx + 1}
                </span>
                <Icon size={17} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
              {idx < JOURNEY.length - 1 && (
                <ChevronRight size={15} className="mx-0.5 shrink-0 text-[#DDE4F3]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Screens */}
      <div className="relative flex-1">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === "scan" && (
              <div className="flex flex-col gap-3">
                {/* Diagnostics / System Information tabs */}
                <div className="flex gap-1 border-b border-[#DDE4F3]">
                  <button
                    onClick={() => setInfoTab("diagnostics")}
                    className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition-colors ${
                      infoTab === "diagnostics"
                        ? "border-[#0052CC] text-[#0052CC]"
                        : "border-transparent text-[#8A93A6] hover:text-[#4A5875]"
                    }`}
                  >
                    <Activity size={13} /> Diagnostics
                  </button>
                  <button
                    onClick={() => setInfoTab("system")}
                    className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-bold transition-colors ${
                      infoTab === "system"
                        ? "border-[#0052CC] text-[#0052CC]"
                        : "border-transparent text-[#8A93A6] hover:text-[#4A5875]"
                    }`}
                  >
                    <Info size={13} /> System Information
                  </button>
                </div>

                {infoTab === "system" ? (
                  <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#DDE4F3] p-4 text-left sm:grid-cols-3">
                    {Object.entries({
                      "System Type": DEVICE_INFO.systemType,
                      Manufacturer: DEVICE_INFO.manufacturer,
                      Model: DEVICE_INFO.model,
                      "Serial Number": DEVICE_INFO.serial,
                      "Bios Version": DEVICE_INFO.bios,
                    }).map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#8A93A6]">{label}</p>
                        <p className="mt-0.5 text-xs font-bold text-[#17284D]">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
                    <div className="overflow-hidden rounded-2xl border border-[#DDE4F3]">
                      <div className="grid grid-cols-[24px_1fr_1.3fr_72px_84px_36px] items-center gap-3 border-b border-[#DDE4F3] bg-[#F4F6FB] px-4 py-2 text-[9px] font-bold uppercase tracking-wide text-[#8A93A6]">
                        <span>#</span>
                        <span>Device</span>
                        <span>Test Name</span>
                        <span className="hidden sm:block">Tested On</span>
                        <span>Result</span>
                        <span>Run</span>
                      </div>
                      <div className="max-h-[380px] divide-y divide-[#EEF1F8] overflow-y-auto">
                        {TESTS.map((test, idx) => {
                          const s = status[test.id];
                          const Icon = test.icon;
                          return (
                            <div key={test.id} className="grid grid-cols-[24px_1fr_1.3fr_72px_84px_36px] items-center gap-3 px-4 py-2.5">
                              <span className="text-[10px] font-bold text-[#8A93A6]">{idx + 1}</span>
                              <div className="min-w-0 flex items-center gap-2">
                                <Icon size={14} className="shrink-0 text-[#0052CC]" />
                                <p className="truncate text-xs font-bold text-[#17284D]">{test.device}</p>
                              </div>
                              <p className="truncate text-[10px] text-[#4A5875]">{test.testName}</p>
                              <span className="hidden truncate text-[10px] text-[#4A5875] sm:block">
                                {testedOn[test.id] ?? "—"}
                              </span>

                              <AnimatePresence mode="wait">
                                {s === "idle" && (
                                  <motion.span
                                    key="idle"
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    className="w-20 shrink-0 rounded-full bg-[#F4F6FB] px-2 py-1 text-center text-[10px] font-bold text-[#4A5875]"
                                  >
                                    Not Tested
                                  </motion.span>
                                )}
                                {s === "running" && (
                                  <motion.span
                                    key="running"
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    className="flex w-20 shrink-0 items-center justify-center gap-1 rounded-full bg-[#0052CC]/10 px-2 py-1 text-center text-[10px] font-bold text-[#0052CC]"
                                  >
                                    <Loader2 size={11} className="animate-spin" /> Running
                                  </motion.span>
                                )}
                                {s === "pass" && (
                                  <motion.span
                                    key="pass"
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                    className="w-20 shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-center text-[10px] font-bold text-emerald-700"
                                  >
                                    PASS
                                  </motion.span>
                                )}
                                {s === "fail" && (
                                  <motion.span
                                    key="fail"
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                    className="w-20 shrink-0 rounded-full bg-red-100 px-2 py-1 text-center text-[10px] font-bold text-red-600"
                                  >
                                    FAIL
                                  </motion.span>
                                )}
                              </AnimatePresence>

                              <motion.button
                                onClick={() => runOne(test)}
                                disabled={s === "running" || isRunningAll}
                                aria-label={`Run ${test.device} test`}
                                whileHover={s !== "running" && !isRunningAll ? { scale: 1.15 } : undefined}
                                whileTap={s !== "running" && !isRunningAll ? { scale: 0.9 } : undefined}
                                animate={
                                  s !== "running" && !isRunningAll
                                    ? {
                                        boxShadow: [
                                          "0 0 0 0 rgba(0,82,204,0.35)",
                                          "0 0 0 5px rgba(0,82,204,0)",
                                          "0 0 0 0 rgba(0,82,204,0)",
                                        ],
                                      }
                                    : { boxShadow: "0 0 0 0 rgba(0,82,204,0)" }
                                }
                                transition={
                                  s !== "running" && !isRunningAll
                                    ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                    : { duration: 0.2 }
                                }
                                className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#0052CC]/30 text-[#0052CC] transition-colors hover:bg-[#0052CC]/10 disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <Play size={11} fill="currentColor" />
                              </motion.button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-[#DDE4F3] p-4 text-center">
                      <div className="rounded-md bg-white p-1.5 shadow-sm ring-1 ring-[#DDE4F3]">
                        <Image src="/images/barcode.jpg" alt="Certificate QR code" width={104} height={104} className="h-[104px] w-[104px]" />
                      </div>
                      <p className="text-[10px] text-[#4A5875]">
                        Certificate Number: <span className="font-bold text-[#17284D]">XC2C45920E</span>
                      </p>

                      <div className="w-full border-t border-[#EEF1F8] pt-2 text-left">
                        <p className="text-[10px] font-semibold text-[#4A5875]">Test Result:</p>
                        <p
                          className={`text-sm font-black ${
                            allAttempted ? (failedCount > 0 ? "text-red-600" : "text-emerald-600") : "text-[#17284D]"
                          }`}
                        >
                          {allAttempted ? (failedCount > 0 ? "Completed — Issues Found" : "All Tests Passed") : "Test Incomplete"}
                        </p>
                      </div>

                      {batterySecondsLeft !== null && (
                        <div className="w-full rounded-lg bg-[#0052CC]/5 px-2 py-1.5 text-left">
                          <p className="text-[10px] font-semibold text-[#4A5875]">Battery Stress Test Result:</p>
                          <p className="text-xs font-bold text-[#0052CC]">
                            Running, Time Left: 00:{batterySecondsLeft.toString().padStart(2, "0")}
                          </p>
                        </div>
                      )}

                      <p className="text-[10px] text-[#4A5875]">
                        {passedCount} passed · {failedCount} failed
                      </p>

                      <div className="relative w-full">
                        <AnimatePresence>
                          {attemptedCount === 0 && !isRunningAll && !anyRunning && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: [0, -4, 0] }}
                              exit={{ opacity: 0, y: 4 }}
                              transition={{
                                opacity: { duration: 0.25 },
                                y: { duration: 1.3, repeat: Infinity, ease: "easeInOut" },
                              }}
                              className="absolute -top-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-[#17284D] px-2.5 py-1 text-[10px] font-bold text-white shadow-lg"
                            >
                              <MousePointerClick size={11} /> Click here to run tests
                              <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#17284D]" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.button
                          onClick={runAll}
                          disabled={isRunningAll}
                          whileHover={!isRunningAll ? { scale: 1.03 } : undefined}
                          whileTap={!isRunningAll ? { scale: 0.97 } : undefined}
                          animate={
                            !isRunningAll && !anyRunning
                              ? {
                                  boxShadow: [
                                    "0 0 0 0 rgba(0,82,204,0.45)",
                                    "0 0 0 8px rgba(0,82,204,0)",
                                    "0 0 0 0 rgba(0,82,204,0)",
                                  ],
                                }
                              : { boxShadow: "0 0 0 0 rgba(0,82,204,0)" }
                          }
                          transition={
                            !isRunningAll && !anyRunning
                              ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                              : { duration: 0.2 }
                          }
                          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#0052CC] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-[#0052CC]/25 transition-colors hover:bg-[#0047B3] disabled:cursor-not-allowed disabled:opacity-70 ${
                            attemptedCount === 0 && !isRunningAll && !anyRunning
                              ? "outline outline-2 outline-offset-2 outline-[#0052CC]/40"
                              : ""
                          }`}
                        >
                          {isRunningAll || anyRunning ? (
                            <>
                              <Loader2 size={13} className="animate-spin" /> Running Tests…
                            </>
                          ) : (
                            <>
                              <Play size={12} fill="currentColor" /> Run All Tests Again
                            </>
                          )}
                        </motion.button>
                      </div>
                      <button
                        onClick={() => goto("analysis")}
                        disabled={!allAttempted}
                        className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[#0052CC] px-4 py-2 text-xs font-bold text-[#0052CC] transition-colors hover:bg-[#0052CC]/5 disabled:cursor-not-allowed disabled:border-[#DDE4F3] disabled:text-[#B7C0D4]"
                      >
                        Continue to Analysis <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === "analysis" && (
              <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-[#DDE4F3] bg-gradient-to-b from-white to-[#F4F6FB] p-4 text-center shadow-[0_16px_40px_-24px_rgba(15,23,42,0.2)]">
                <div
                  className="pointer-events-none absolute inset-0 opacity-60"
                  style={{
                    backgroundImage: "radial-gradient(circle, rgba(0,82,204,0.06) 1px, transparent 1px)",
                    backgroundSize: "14px 14px",
                  }}
                />

                <div className="relative flex flex-col items-center gap-3">
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                    className="relative flex h-10 w-10 items-center justify-center"
                  >
                    <motion.span
                      className="absolute h-10 w-10 rounded-xl bg-[#0052CC]/15"
                      animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052CC]/10 text-[#0052CC]">
                      <motion.span
                        animate={{ rotate: [0, 8, -8, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <BrainCircuit size={19} />
                      </motion.span>
                    </span>
                  </motion.div>

                  <div>
                    <h4 className="text-sm font-bold text-[#17284D] font-display">Analyzing Inspection Data…</h4>
                    <p className="mt-0.5 text-[11px] text-[#8A93A6]">AI is reviewing results and calculating the final grade</p>
                  </div>

                  <div className="w-full">
                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#E4EAF5]">
                      <motion.div
                        className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#0052CC] to-[#3B82F6]"
                        animate={{ width: `${(Math.min(analysisStepIdx, ANALYSIS_ITEMS.length) / ANALYSIS_ITEMS.length) * 100}%` }}
                        transition={{ ease: "easeOut", duration: 0.3 }}
                      >
                        <motion.span
                          className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                          animate={{ x: ["-32px", "120px"] }}
                          transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    </div>
                    <p className="mt-1 text-right text-[9px] font-bold text-[#0052CC]">
                      {Math.round((Math.min(analysisStepIdx, ANALYSIS_ITEMS.length) / ANALYSIS_ITEMS.length) * 100)}%
                    </p>
                  </div>

                  <div className="w-full space-y-2.5 text-left">
                    {ANALYSIS_ITEMS.map((item, idx) => {
                      const done = idx < analysisStepIdx;
                      const current = idx === analysisStepIdx;
                      return (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, x: -8, scale: 0.96 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          transition={{ delay: idx * 0.05, type: "spring", stiffness: 300, damping: 22 }}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-medium transition-colors ${
                            done
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : current
                              ? "border-[#0052CC]/30 bg-[#0052CC]/5 text-[#0052CC] shadow-sm"
                              : "border-[#EEF1F8] bg-white text-[#B7C0D4]"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
                              done
                                ? "bg-emerald-500 text-white"
                                : current
                                ? "bg-[#0052CC] text-white"
                                : "border border-current"
                            }`}
                          >
                            {done ? (
                              <Check size={9} strokeWidth={3} />
                            ) : current ? (
                              <Loader2 size={9} className="animate-spin" />
                            ) : (
                              idx + 1
                            )}
                          </span>
                          {item}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {step === "grade" && (() => {
              const grade = getGradeInfo(failedCount);
              const scorePct = applicableCount > 0 ? Math.round((passedCount / applicableCount) * 100) : 100;
              const circumference = 2 * Math.PI * 42;
              return (
                <div className="relative mx-auto w-full max-w-xs overflow-hidden rounded-3xl border border-[#DDE4F3] bg-gradient-to-b from-white to-[#F4F6FB] p-5 text-center shadow-[0_20px_50px_-24px_rgba(15,23,42,0.2)]">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(0,82,204,0.06) 1px, transparent 1px)",
                      backgroundSize: "14px 14px",
                    }}
                  />

                  {CONFETTI_BURST.map((p, i) => (
                    <motion.span
                      key={i}
                      className="pointer-events-none absolute left-1/2 top-16 h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: p.color }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4 }}
                      transition={{ duration: 1.1, delay: 0.15 + i * 0.02, ease: "easeOut" }}
                    />
                  ))}

                  <Sparkles className="pointer-events-none absolute left-5 top-3 h-4 w-4 text-amber-300" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                    className="pointer-events-none absolute right-6 top-4"
                  >
                    <Sparkles className="h-3 w-3 text-[#0052CC]/40" />
                  </motion.div>

                  <div className="relative flex flex-col items-center gap-4">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14 }}
                      className="relative flex h-28 w-28 items-center justify-center"
                    >
                      <motion.span
                        className={`absolute h-28 w-28 rounded-full ${grade.glow}`}
                        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.15, 0.5] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <svg viewBox="0 0 100 100" className="relative h-28 w-28 -rotate-90">
                        <circle cx="50" cy="50" r="42" strokeWidth="8" fill="none" className="stroke-[#E4EAF5]" />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="42"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          className={grade.stroke}
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset: circumference * (1 - scorePct / 100) }}
                          transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                        />
                      </svg>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 16 }}
                        className={`absolute text-3xl font-black ${grade.text}`}
                      >
                        {grade.letter}
                      </motion.span>
                    </motion.div>

                    <div>
                      <h4 className="text-sm font-bold text-[#17284D] font-display">Overall Grade</h4>
                      <p className={`mt-1 text-xs font-bold ${grade.text}`}>{grade.desc}</p>
                      <p className="mt-0.5 text-[10px] font-semibold text-[#8A93A6]">Confidence Score: {scorePct}%</p>
                      <p className="mt-1 flex items-center justify-center gap-1 text-[10px] font-semibold text-[#8A93A6]">
                        <ShieldCheck size={11} className={grade.text} /> Certified by GadgetIQ AI
                      </p>
                    </div>

                    <div className="grid w-full max-w-[220px] grid-cols-2 gap-2">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 18 }}
                      >
                        <StatChip icon={Check} label="Passed" value={passedCount} color="emerald" />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.68, type: "spring", stiffness: 260, damping: 18 }}
                      >
                        <StatChip icon={X} label="Failed" value={failedCount} color="red" />
                      </motion.div>
                    </div>

                    <button
                      onClick={() => goto("report-gen")}
                      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#0052CC] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#0052CC]/25 transition-colors hover:bg-[#0047B3]"
                    >
                      Generate Report <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })()}

            {step === "report-gen" && (
              <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-10 text-center">
                <FileText size={32} className="text-[#0052CC]" />
                <h4 className="text-base font-bold text-[#17284D] font-display">Generating Report…</h4>
                <p className="text-xs text-[#4A5875]">{REPORT_PHASES[reportPhaseIdx]}</p>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#F4F6FB]">
                  <motion.div
                    className="h-full bg-[#0052CC]"
                    animate={{ width: `${reportProgress}%` }}
                    transition={{ ease: "linear", duration: 0.08 }}
                  />
                </div>
                <p className="text-[10px] font-bold text-[#0052CC]">{reportProgress}%</p>
              </div>
            )}

            {step === "report" && (
              <ReportCertificate
                passedCount={passedCount}
                failedCount={failedCount}
                onRestart={restart}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      </div>
      {/* App footer */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 border-t border-[#DDE4F3] bg-[#FBFCFE] px-4 py-2.5 text-[9px] font-medium text-[#8A93A6] sm:px-6">
        <span>
          Powered By - <strong className="font-black text-[#17284D]">XTRA<span className="text-[#0052CC]">C</span>OVER</strong>
        </span>
        <span className="hidden font-bold text-[#4A5875] sm:inline">GadgetIQ for Laptop and Notebook</span>
        <span className="hidden font-mono lg:inline">GIQ LP.W7sp1x64p3112.25.2607.01LAD</span>
        <span className="hidden md:inline">© 2026 Xtracover. All Rights Reserved.</span>
        <button
          type="button"
          title="Demo only"
          className="flex items-center gap-1 rounded-full bg-[#FF5436] px-3 py-1.5 text-[10px] font-bold text-white transition-colors hover:bg-[#F13B20]"
        >
          <LogOut size={11} /> Logout
        </button>
      </div>
    </div>
  );
}

function ReportCertificate({
  passedCount,
  failedCount,
  onRestart,
}: {
  passedCount: number;
  failedCount: number;
  onRestart: () => void;
}) {
  const grade = getGradeInfo(failedCount);
  const applicable = passedCount + failedCount;
  const scorePct = applicable > 0 ? Math.round((passedCount / applicable) * 100) : 100;
  const circumference = 2 * Math.PI * 34;
  const offset = circumference * (1 - scorePct / 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-[#DDE4F3] bg-white shadow-[0_16px_42px_-20px_rgba(15,23,42,0.28)]"
    >
      {/* Decorative header band */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0052CC] to-[#3B82F6] px-4 py-3.5 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <motion.span
          className="pointer-events-none absolute -right-6 -top-7 h-24 w-24 rounded-full bg-white/10 blur-2xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/70">Quality Assurance</span>
            <h4 className="mt-0.5 text-sm font-black font-display">Evaluate Certificate</h4>
            <p className="mt-0.5 text-[9px] text-white/70">Generated {SESSION_INFO.date}</p>
          </div>
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur"
          >
            <ShieldCheck size={15} />
          </motion.span>
        </div>
      </div>

      <div className="space-y-3.5 p-3.5 sm:p-4">
        {/* Grade ring + QR + certificate number */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
            <svg viewBox="0 0 80 80" className="h-14 w-14 -rotate-90">
              <circle cx="40" cy="40" r="34" strokeWidth="7" fill="none" className="stroke-[#E4EAF5]" />
              <motion.circle
                cx="40"
                cy="40"
                r="34"
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                className={grade.stroke}
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-sm font-black leading-none ${grade.text}`}>{grade.letter}</span>
              <span className="mt-0.5 text-[5.5px] font-bold uppercase tracking-wide text-[#8A93A6]">Grade</span>
            </div>
          </div>

          <div className="h-10 w-px shrink-0 bg-[#E4EAF5]" />

          <div className="shrink-0 rounded-lg bg-white p-1 shadow-sm ring-1 ring-[#DDE4F3]">
            <Image src="/images/barcode.jpg" alt="Certificate QR code" width={48} height={48} className="h-12 w-12" />
          </div>

          <div className="min-w-0 flex-1 text-left">
            <p className="text-[8px] font-semibold text-[#8A93A6]">Certificate Number</p>
            <p className="truncate text-xs font-bold text-[#17284D]">XC2C45920E</p>
            <p className={`mt-1 flex items-center gap-1 text-[8px] font-semibold ${grade.text}`}>
              <Check size={9} /> Verified &amp; Signed
            </p>
          </div>
        </div>

        {/* Result stat chips */}
        <div className="grid grid-cols-2 gap-1.5">
          <StatChip compact icon={Check} label="Passed" value={passedCount} color="emerald" />
          <StatChip compact icon={X} label="Failed" value={failedCount} color="red" />
        </div>

        {/* Device info */}
        <div className="rounded-xl border border-[#DDE4F3] bg-[#FBFCFE] p-2.5 text-left text-[11px]">
          <p className="mb-0.5 text-[8px] font-bold uppercase tracking-wide text-[#8A93A6]">Device</p>
          <p className="font-bold text-[#17284D]">Precision X-11</p>
          <p className="text-[#4A5875]">Serial XC-90210</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
          <button
            title="Demo only"
            disabled
            className="flex cursor-not-allowed items-center gap-1 rounded-full border border-[#DDE4F3] px-3.5 py-1.5 text-[10px] font-bold text-[#B7C0D4]"
          >
            <Download size={10} /> Download PDF
          </button>
          <button
            onClick={onRestart}
            className="flex items-center gap-1 rounded-full bg-[#0052CC] px-3.5 py-1.5 text-[10px] font-bold text-white shadow-md shadow-[#0052CC]/25 transition-colors hover:bg-[#0047B3]"
          >
            <RotateCcw size={10} /> Restart Demo
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  color,
  compact,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  color: "emerald" | "red" | "slate";
  compact?: boolean;
}) {
  const styles = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    red: "border-red-200 bg-red-50 text-red-600",
    slate: "border-[#E4EAF5] bg-[#F4F6FB] text-[#8A93A6]",
  };
  return (
    <div className={`flex flex-col items-center gap-0.5 rounded-xl border ${compact ? "p-1.5" : "p-2.5 gap-1"} ${styles[color]}`}>
      <Icon size={compact ? 11 : 14} />
      <span className={`font-black leading-none ${compact ? "text-xs" : "text-base"}`}>{value}</span>
      <span className={`font-bold uppercase tracking-wide ${compact ? "text-[7px]" : "text-[9px]"}`}>{label}</span>
    </div>
  );
}
