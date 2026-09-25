"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Bluetooth,
  Battery,
  BrainCircuit,
  Building2,
  Camera,
  Check,
  ChevronRight,
  CircuitBoard,
  ClipboardList,
  CreditCard,
  Disc3,
  Eye,
  EyeOff,
  FileText,
  Hammer,
  HardDrive,
  Cpu,
  Info,
  Keyboard,
  LayoutDashboard,
  Loader2,
  Lock,
  LogIn,
  MemoryStick,
  Mic,
  MousePointer2,
  Network,
  Play,
  Rocket,
  RotateCcw,
  ScanLine,
  SignalHigh,
  Sparkles,
  Usb,
  User,
  Volume2,
  Wifi,
  type LucideIcon,
} from "lucide-react";

type Status = "idle" | "running" | "pass" | "na";
type Step =
  | "login"
  | "license"
  | "admin"
  | "inspection"
  | "scan"
  | "analysis"
  | "grade"
  | "report-gen"
  | "report";

interface TestDef {
  id: string;
  device: string;
  testName: string;
  icon: LucideIcon;
  applicable: boolean;
  durationMs: number;
}

const TESTS: TestDef[] = [
  { id: "speaker", device: "Speaker", testName: "Audio Playback Test", icon: Volume2, applicable: true, durationMs: 700 },
  { id: "mic", device: "Microphone", testName: "Audio Recording Test", icon: Mic, applicable: true, durationMs: 700 },
  { id: "battery", device: "Battery", testName: "Battery Stress Test", icon: Battery, applicable: true, durationMs: 2200 },
  { id: "internet", device: "Internet Connectivity", testName: "Internet Test", icon: SignalHigh, applicable: true, durationMs: 600 },
  { id: "wireless", device: "Wireless", testName: "Wireless Test", icon: Wifi, applicable: true, durationMs: 600 },
  { id: "bluetooth", device: "Bluetooth", testName: "Bluetooth Test", icon: Bluetooth, applicable: true, durationMs: 600 },
  { id: "ethernet", device: "Wired Ethernet", testName: "Wired Ethernet Test", icon: Network, applicable: false, durationMs: 0 },
  { id: "optical", device: "Optical Disk Drive", testName: "Optical Drive Test", icon: Disc3, applicable: false, durationMs: 0 },
  { id: "cpu", device: "Processor", testName: "Processor Test", icon: Cpu, applicable: true, durationMs: 700 },
  { id: "ram", device: "RAM", testName: "Memory Test", icon: MemoryStick, applicable: true, durationMs: 700 },
  { id: "motherboard", device: "Motherboard", testName: "Motherboard Test", icon: CircuitBoard, applicable: true, durationMs: 600 },
  { id: "storage", device: "Storage", testName: "HDD / SSD Test", icon: HardDrive, applicable: true, durationMs: 700 },
  { id: "gpu", device: "GPU", testName: "Graphics Test", icon: Cpu, applicable: true, durationMs: 700 },
  { id: "sdcard", device: "SD Card Slot", testName: "SD Card Slot Test", icon: CreditCard, applicable: false, durationMs: 0 },
  { id: "touchpad", device: "Touchpad", testName: "Touchpad Test", icon: MousePointer2, applicable: true, durationMs: 600 },
  { id: "keyboard", device: "Keyboard", testName: "Keyboard Test", icon: Keyboard, applicable: true, durationMs: 700 },
  { id: "camera", device: "Camera", testName: "Camera Photo Test", icon: Camera, applicable: true, durationMs: 600 },
  { id: "usb", device: "USB Ports", testName: "USB Port Test", icon: Usb, applicable: true, durationMs: 600 },
  { id: "display", device: "Display", testName: "Display Test", icon: LayoutDashboard, applicable: true, durationMs: 700 },
  { id: "physical", device: "Physical Condition", testName: "Cosmetic Inspection", icon: Hammer, applicable: true, durationMs: 700 },
];

const PLANS = [
  { id: "starter", name: "Starter", price: "$99", icon: Rocket, popular: false, features: ["Up to 50 devices/month", "Basic test suite", "Standard reports"] },
  { id: "professional", name: "Professional", price: "$199", icon: Sparkles, popular: true, features: ["Up to 500 devices/month", "Advanced test suite", "Detailed reports", "Priority support"] },
  { id: "enterprise", name: "Enterprise", price: "$399", icon: Building2, popular: false, features: ["Unlimited devices", "Full test suite", "Custom reports", "Dedicated support"] },
];

const STATS = [
  { label: "Total Devices Inspected", value: "248" },
  { label: "Tests Completed", value: "232" },
  { label: "Devices Passed", value: "198" },
  { label: "Avg. Grade", value: "A-" },
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
  { key: "login", label: "Login", icon: LogIn },
  { key: "license", label: "License", icon: CreditCard },
  { key: "admin", label: "Dashboard", icon: LayoutDashboard },
  { key: "inspection", label: "Device", icon: ClipboardList },
  { key: "scan", label: "Scan", icon: ScanLine },
  { key: "analysis", label: "Analysis", icon: BrainCircuit },
  { key: "grade", label: "Grade", icon: Award },
  { key: "report-gen", label: "Report", icon: FileText },
];

function stepIndex(step: Step) {
  if (step === "report") return JOURNEY.length - 1;
  return JOURNEY.findIndex((j) => j.key === step);
}

const QR_CELLS = Array.from({ length: 121 }, (_, i) => {
  const x = i % 11;
  const y = Math.floor(i / 11);
  const isFinder = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
  if (isFinder) return (x + y) % 3 !== 1;
  return ((x * 13 + y * 7 + x * y) % 5) < 2;
});

function initialStatus(): Record<string, Status> {
  const initial: Record<string, Status> = {};
  TESTS.forEach((t) => {
    initial[t.id] = t.applicable ? "idle" : "na";
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

export default function GadgetIQLiveDemo() {
  const [step, setStep] = useState<Step>("login");
  const [maxIndex, setMaxIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [purchasingPlan, setPurchasingPlan] = useState<string | null>(null);

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

  const restart = () => {
    setStep("login");
    setMaxIndex(0);
    setLoginId("");
    setPassword("");
    setLoginError(false);
    setIsAuthenticating(false);
    setPurchasingPlan(null);
    setStatus(initialStatus());
    setTestedOn(initialTestedOn());
    setIsRunningAll(false);
    setBatterySecondsLeft(null);
    setAnalysisStepIdx(0);
    setReportProgress(0);
    setReportPhaseIdx(0);
  };

  function formatNow() {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    let hours = d.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${pad(hours)}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${ampm}`;
  }

  async function runOne(test: TestDef) {
    if (!test.applicable) return;
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

    setStatus((prev) => ({ ...prev, [test.id]: "pass" }));
    setTestedOn((prev) => ({ ...prev, [test.id]: formatNow() }));
  }

  async function runAll() {
    if (isRunningAll) return;
    setIsRunningAll(true);
    for (const test of TESTS) {
      if (!test.applicable) continue;
      await runOne(test);
    }
    setIsRunningAll(false);
  }

  const applicableCount = TESTS.filter((t) => t.applicable).length;
  const passedCount = TESTS.filter((t) => t.applicable && status[t.id] === "pass").length;
  const naCount = TESTS.length - applicableCount;
  const allPassed = passedCount === applicableCount;
  const anyRunning = Object.values(status).some((s) => s === "running");

  // Login handler
  const handleLogin = () => {
    if (!loginId.trim() || !password.trim()) {
      setLoginError(true);
      return;
    }
    setLoginError(false);
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      goto("license");
    }, 700);
  };

  const handleSelectPlan = (planId: string) => {
    setPurchasingPlan(planId);
    setTimeout(() => {
      setPurchasingPlan(null);
      goto("admin");
    }, 800);
  };

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
    <div className="flex h-full w-full flex-col gap-3 overflow-y-auto rounded-[22px] bg-white p-4 sm:p-6">
      {/* Mini header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DDE4F3] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold tracking-tight text-[#17284D] font-display">
            Gadget<span className="text-[#0052CC]">IQ</span>
          </span>
          <span className="hidden text-[11px] text-[#4A5875] sm:inline">Live Interactive Demo</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#F4F6FB] px-3 py-1 text-[11px] font-semibold text-[#4A5875]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Internet: <span className="text-emerald-600">Online</span>
        </div>
      </div>

      {/* Journey breadcrumb */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
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
                className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold transition-colors ${
                  isCurrent
                    ? "border-[#0052CC] bg-[#0052CC] text-white"
                    : isDone
                    ? "border-[#0052CC]/20 bg-[#0052CC]/10 text-[#0052CC]"
                    : "border-[#DDE4F3] bg-white text-[#4A5875]"
                } ${reachable && !isCurrent ? "cursor-pointer hover:bg-[#0052CC]/10" : ""} ${
                  !reachable ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                <Icon size={11} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
              {idx < JOURNEY.length - 1 && (
                <ChevronRight size={10} className="mx-0.5 shrink-0 text-[#DDE4F3]" />
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
            {step === "login" && (
              <div className="flex justify-center py-4">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-[#DDE4F3] p-6 text-center shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0052CC]/10 text-[#0052CC]">
                    <LogIn size={18} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#17284D] font-display">Technician Access</h4>
                    <p className="mt-1 text-xs text-[#4A5875]">
                      Enter your credentials to access the diagnostic suite.
                    </p>
                  </div>

                  <div className="flex w-full items-center gap-2 rounded-xl border border-[#0052CC]/15 bg-[#0052CC]/5 p-2.5 text-left">
                    <Info size={14} className="shrink-0 text-[#0052CC]" />
                    <p className="text-[11px] text-[#4A5875]">
                      <span className="font-bold text-[#0052CC]">Try the Demo —</span> any text works.
                    </p>
                  </div>

                  <div className="w-full space-y-3 text-left">
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#4A5875]">
                        Login ID
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-[#DDE4F3] bg-[#F4F6FB] px-3 py-2 transition-colors focus-within:border-[#0052CC]">
                        <User size={14} className="text-[#8A93A6]" />
                        <input
                          value={loginId}
                          onChange={(e) => setLoginId(e.target.value)}
                          placeholder="Enter technician ID"
                          className="w-full bg-transparent text-xs text-[#17284D] outline-none placeholder:text-[#B7C0D4]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-[#4A5875]">
                        Password
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border border-[#DDE4F3] bg-[#F4F6FB] px-3 py-2 transition-colors focus-within:border-[#0052CC]">
                        <Lock size={14} className="text-[#8A93A6]" />
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          className="w-full bg-transparent text-xs text-[#17284D] outline-none placeholder:text-[#B7C0D4]"
                        />
                        <button onClick={() => setShowPassword((v) => !v)} className="text-[#8A93A6]">
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    {loginError && (
                      <p className="text-[11px] font-semibold text-red-500">
                        Please enter both a technician ID and password.
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={isAuthenticating}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0052CC] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-[#0052CC]/25 transition-colors hover:bg-[#0047B3] disabled:opacity-70"
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Authenticating…
                      </>
                    ) : (
                      <>
                        Continue <ChevronRight size={13} />
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            )}

            {step === "license" && (
              <div className="py-4">
                <h4 className="mb-1 text-center text-base font-bold text-[#17284D] font-display">
                  Choose Your License Plan
                </h4>
                <p className="mb-6 text-center text-xs text-[#4A5875]">
                  Select a plan to continue the demo (no payment required).
                </p>
                <div className="grid gap-4 sm:grid-cols-3 sm:items-start">
                  {PLANS.map((plan, idx) => {
                    const Icon = plan.icon;
                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -6 }}
                        className={`relative flex flex-col overflow-hidden rounded-2xl border p-5 text-center transition-shadow ${
                          plan.popular
                            ? "border-[#0052CC] bg-gradient-to-b from-[#0052CC]/[0.06] to-white shadow-[0_16px_36px_-12px_rgba(0,82,204,0.35)] sm:-translate-y-2"
                            : "border-[#DDE4F3] bg-white hover:shadow-md"
                        }`}
                      >
                        {plan.popular && (
                          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#0052CC]/10 blur-2xl" />
                        )}

                        {plan.popular && (
                          <span className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#0052CC] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                            <Sparkles size={10} /> Most Popular
                          </span>
                        )}

                        <div
                          className={`relative z-10 mx-auto flex h-11 w-11 items-center justify-center rounded-2xl ${
                            plan.popular
                              ? "mt-4 bg-[#0052CC] text-white shadow-md shadow-[#0052CC]/30"
                              : "bg-[#F4F6FB] text-[#0052CC]"
                          }`}
                        >
                          <Icon size={18} />
                        </div>

                        <p className="relative z-10 mt-3 text-xs font-bold text-[#17284D]">{plan.name}</p>
                        <p className="relative z-10 mt-1 flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-extrabold text-[#0052CC]">{plan.price}</span>
                          <span className="text-[10px] font-semibold text-[#8A93A6]">/mo</span>
                        </p>

                        <ul className="relative z-10 mt-4 flex-1 space-y-1.5 text-left text-[10px] text-[#4A5875]">
                          {plan.features.map((f) => (
                            <li key={f} className="flex items-start gap-1.5">
                              <Check size={12} className="mt-0.5 shrink-0 text-emerald-500" />
                              {f}
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={() => handleSelectPlan(plan.id)}
                          disabled={purchasingPlan !== null}
                          className={`relative z-10 mt-4 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold transition-colors disabled:opacity-60 ${
                            plan.popular
                              ? "bg-[#0052CC] text-white shadow-md shadow-[#0052CC]/25 hover:bg-[#0047B3]"
                              : "border border-[#0052CC]/30 text-[#0052CC] hover:bg-[#0052CC]/5"
                          }`}
                        >
                          {purchasingPlan === plan.id ? (
                            <>
                              <Loader2 size={11} className="animate-spin" /> Processing…
                            </>
                          ) : (
                            "Select Plan"
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === "admin" && (
              <div className="flex flex-col items-center gap-5 py-6">
                <h4 className="text-base font-bold text-[#17284D] font-display">Admin Dashboard</h4>
                <div className="grid w-full max-w-md grid-cols-2 gap-3">
                  {STATS.map((s) => (
                    <div key={s.label} className="rounded-2xl border border-[#DDE4F3] p-3 text-center">
                      <p className="text-lg font-extrabold text-[#0052CC]">{s.value}</p>
                      <p className="mt-0.5 text-[10px] text-[#4A5875]">{s.label}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => goto("inspection")}
                  className="flex items-center gap-1.5 rounded-full bg-[#0052CC] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#0052CC]/25 transition-colors hover:bg-[#0047B3]"
                >
                  Start New Inspection <ChevronRight size={13} />
                </button>
              </div>
            )}

            {step === "inspection" && (
              <div className="flex flex-col items-center gap-5 py-6">
                <h4 className="text-base font-bold text-[#17284D] font-display">Detail Inspection Dashboard</h4>
                <div className="grid w-full max-w-md grid-cols-2 gap-x-6 gap-y-2 rounded-2xl border border-[#DDE4F3] p-4 text-left text-xs">
                  <div><span className="text-[#8A93A6]">Device ID</span><p className="font-bold text-[#17284D]">GQ-1247</p></div>
                  <div><span className="text-[#8A93A6]">Model</span><p className="font-bold text-[#17284D]">Precision X-11</p></div>
                  <div><span className="text-[#8A93A6]">Serial Number</span><p className="font-bold text-[#17284D]">XC-90210</p></div>
                  <div><span className="text-[#8A93A6]">Inspector</span><p className="font-bold text-[#17284D]">Demo Technician</p></div>
                </div>
                <button
                  onClick={() => goto("scan")}
                  className="flex items-center gap-1.5 rounded-full bg-[#0052CC] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#0052CC]/25 transition-colors hover:bg-[#0047B3]"
                >
                  Begin Diagnostics <ChevronRight size={13} />
                </button>
              </div>
            )}

            {step === "scan" && (
              <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                <div className="overflow-hidden rounded-2xl border border-[#DDE4F3]">
                  <div className="flex items-center gap-2 border-b border-[#DDE4F3] bg-[#F4F6FB] px-4 py-2">
                    <span className="rounded-lg border border-[#0052CC] bg-[#0052CC]/5 px-3 py-1 text-xs font-bold text-[#0052CC]">
                      Diagnostics
                    </span>
                  </div>
                  <div className="max-h-[380px] divide-y divide-[#EEF1F8] overflow-y-auto">
                    {TESTS.map((test) => {
                      const s = status[test.id];
                      const Icon = test.icon;
                      return (
                        <div key={test.id} className="flex items-center gap-3 px-4 py-2.5">
                          <Icon size={14} className="shrink-0 text-[#0052CC]" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-[#17284D]">{test.device}</p>
                            <p className="truncate text-[10px] text-[#4A5875]">{test.testName}</p>
                          </div>
                          <span className="hidden w-24 shrink-0 text-[10px] text-[#4A5875] sm:block">
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
                                Not Started
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
                            {s === "na" && (
                              <motion.span
                                key="na"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-20 shrink-0 rounded-full bg-[#F4F6FB] px-2 py-1 text-center text-[10px] font-bold text-[#8A93A6]"
                              >
                                Not Applicable
                              </motion.span>
                            )}
                          </AnimatePresence>

                          <button
                            onClick={() => runOne(test)}
                            disabled={!test.applicable || s === "running" || isRunningAll}
                            aria-label={`Run ${test.device} test`}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#0052CC]/30 text-[#0052CC] transition-colors hover:bg-[#0052CC]/10 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Play size={11} fill="currentColor" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#DDE4F3] p-4 text-center">
                  <div className="grid grid-cols-11 gap-[1px] rounded-md bg-white p-1.5 shadow-sm ring-1 ring-[#DDE4F3]">
                    {QR_CELLS.map((filled, i) => (
                      <span key={i} className={`h-[5px] w-[5px] ${filled ? "bg-[#17284D]" : "bg-white"}`} />
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] text-[#4A5875]">Certificate Number</p>
                    <p className="text-xs font-bold text-[#17284D]">XC2C45920E</p>
                  </div>
                  <div className="w-full border-t border-[#EEF1F8] pt-2">
                    <p className="text-[10px] text-[#4A5875]">
                      {passedCount}/{applicableCount} tests passed
                    </p>
                  </div>
                  {batterySecondsLeft !== null && (
                    <div className="w-full rounded-lg bg-[#0052CC]/5 px-2 py-1.5">
                      <p className="text-[10px] font-semibold text-[#0052CC]">
                        Battery Stress Test — 00:{batterySecondsLeft.toString().padStart(2, "0")}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={runAll}
                    disabled={isRunningAll}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0052CC] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#0052CC]/25 transition-colors hover:bg-[#0047B3] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isRunningAll || anyRunning ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Running Tests…
                      </>
                    ) : (
                      <>
                        <Play size={12} fill="currentColor" /> Run All Tests
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => goto("analysis")}
                    disabled={!allPassed}
                    className="flex w-full items-center justify-center gap-1.5 rounded-full border border-[#0052CC] px-4 py-2 text-xs font-bold text-[#0052CC] transition-colors hover:bg-[#0052CC]/5 disabled:cursor-not-allowed disabled:border-[#DDE4F3] disabled:text-[#B7C0D4]"
                  >
                    Continue to Analysis <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {step === "analysis" && (
              <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-10 text-center">
                <BrainCircuit size={32} className="text-[#0052CC]" />
                <h4 className="text-base font-bold text-[#17284D] font-display">Analyzing Inspection Data…</h4>
                <div className="w-full space-y-2 text-left">
                  {ANALYSIS_ITEMS.map((item, idx) => {
                    const done = idx < analysisStepIdx;
                    const current = idx === analysisStepIdx;
                    return (
                      <div
                        key={item}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-colors ${
                          done
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : current
                            ? "border-[#0052CC]/30 bg-[#0052CC]/5 text-[#0052CC]"
                            : "border-[#EEF1F8] text-[#B7C0D4]"
                        }`}
                      >
                        {done ? (
                          <Award size={13} />
                        ) : current ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <span className="h-3 w-3 rounded-full border border-current" />
                        )}
                        {item}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === "grade" && (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-[6px] border-emerald-400 bg-emerald-50 text-3xl font-extrabold text-emerald-600">
                  A-
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#17284D] font-display">Overall Grade</h4>
                  <p className="mt-1 text-xs text-[#4A5875]">
                    {passedCount} passed · {naCount} not applicable
                  </p>
                </div>
                <button
                  onClick={() => goto("report-gen")}
                  className="flex items-center gap-1.5 rounded-full bg-[#0052CC] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#0052CC]/25 transition-colors hover:bg-[#0047B3]"
                >
                  Generate Report <ChevronRight size={13} />
                </button>
              </div>
            )}

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
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <h4 className="text-base font-bold text-[#17284D] font-display">Quality Inspection Report</h4>
                <div className="grid w-full max-w-md grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#DDE4F3] p-3 text-left text-xs">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#8A93A6]">Device</p>
                    <p className="font-bold text-[#17284D]">Precision X-11</p>
                    <p className="text-[#4A5875]">Serial XC-90210</p>
                  </div>
                  <div className="rounded-2xl border border-[#DDE4F3] p-3 text-left text-xs">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#8A93A6]">Test Results</p>
                    <p className="text-emerald-600">Passed: {passedCount}</p>
                    <p className="text-[#8A93A6]">Not Applicable: {naCount}</p>
                  </div>
                </div>

                <div className="grid grid-cols-11 gap-[1px] rounded-md bg-white p-1.5 shadow-sm ring-1 ring-[#DDE4F3]">
                  {QR_CELLS.map((filled, i) => (
                    <span key={i} className={`h-[4px] w-[4px] ${filled ? "bg-[#17284D]" : "bg-white"}`} />
                  ))}
                </div>
                <p className="text-[10px] text-[#4A5875]">
                  Certificate <span className="font-bold text-[#17284D]">XC2C45920E</span>
                </p>
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-emerald-400 bg-emerald-50 text-sm font-extrabold text-emerald-600">
                  A-
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    title="Demo only"
                    disabled
                    className="cursor-not-allowed rounded-full border border-[#DDE4F3] px-4 py-2 text-xs font-bold text-[#B7C0D4]"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={restart}
                    className="flex items-center gap-1.5 rounded-full bg-[#0052CC] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#0052CC]/25 transition-colors hover:bg-[#0047B3]"
                  >
                    <RotateCcw size={13} /> Restart Demo
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
