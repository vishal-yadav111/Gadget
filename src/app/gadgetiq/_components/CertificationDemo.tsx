"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Battery,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  FileCheck,
  HardDrive,
  Keyboard,
  Leaf,
  MemoryStick,
  Monitor,
  Recycle,
  ShieldCheck,
  Volume2,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* =========================================================
   CERTIFICATION DEMO

   A simplified, click-through recreation of the XC-QC
   Certificate of Quality Assurance (proposed 4-page format)
   so visitors can page through what a certification looks
   like before they buy — no login required. Auto-advances
   for passive viewers, stops once someone clicks a page tab.
========================================================= */

const CERT = {
  number: "XCFB589177",
  issued: "28 Jul 2026",
  device: "ASUS Zenbook 14 UX3405MA",
  type: "Notebook · ASUSTeK Computer Inc.",
  serial: "S4N0CX010214143",
  sku: "UX3405MA",
};

/* ---------------------------------------------------------
   PAGE 1 — CERTIFICATE
--------------------------------------------------------- */

function CertStat({ icon: Icon, label, value, sub, color }: { icon: LucideIcon; label: string; value: string; sub: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-[#DDE4F3] bg-white p-2.5"
    >
      <div className="flex items-center gap-1.5">
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${color}`}>
          <Icon size={12} />
        </span>
        <span className="text-[8px] font-bold uppercase tracking-wide text-[#8A93A6]">{label}</span>
      </div>
      <p className="mt-1.5 text-base font-black leading-none text-[#17284D]">{value}</p>
      <p className="mt-1 text-[8.5px] text-[#8A93A6]">{sub}</p>
    </motion.div>
  );
}

function CertificatePage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3 rounded-xl border border-[#DDE4F3] bg-[#FBFCFE] p-3">
        <div className="min-w-0">
          <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#0052CC]">Certificate of Quality Assurance</span>
          <h5 className="mt-0.5 truncate text-sm font-black text-[#17284D]">{CERT.device}</h5>
          <p className="text-[9px] text-[#8A93A6]">{CERT.type}</p>
          <p className="mt-1 text-[8.5px] text-[#4A5875]">
            Serial <span className="font-bold text-[#17284D]">{CERT.serial}</span>
          </p>
        </div>
        <div className="shrink-0 rounded-lg bg-white p-1 shadow-sm ring-1 ring-[#DDE4F3]">
          <Image src="/images/barcode.jpg" alt="Certificate QR code" width={44} height={44} className="h-11 w-11" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
          <CheckCircle2 size={16} strokeWidth={2.5} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-black leading-none text-emerald-700">PASS</p>
          <p className="mt-0.5 text-[9px] font-semibold text-emerald-700">18 of 18 applicable tests passed</p>
        </div>
        <span className="ml-auto shrink-0 text-right text-[8px] font-semibold text-emerald-700">
          XC-QC v2.4
          <br />
          Assessed {CERT.issued}
        </span>
      </motion.div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <CertStat icon={ShieldCheck} label="Device Health" value="Excellent" sub="No faults detected" color="bg-emerald-100 text-emerald-600" />
        <CertStat icon={Battery} label="Battery Health" value="81%" sub="Good · 315 cycles" color="bg-[#0052CC]/10 text-[#0052CC]" />
        <CertStat icon={CheckCircle2} label="Tests Completed" value="18/18" sub="100% of applicable" color="bg-violet-100 text-violet-600" />
        <CertStat icon={Award} label="Refurb. Grade" value="A / B" sub="Functional / Cosmetic" color="bg-amber-100 text-amber-600" />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-[#DDE4F3] bg-white p-3">
          <p className="mb-1.5 text-[8px] font-bold uppercase tracking-wide text-[#8A93A6]">Condition, Grading &amp; Assurance</p>
          <div className="flex items-start gap-2">
            <span className="text-sm font-black leading-none text-emerald-600">A</span>
            <p className="text-[9px] text-[#4A5875]">
              <span className="font-bold text-[#17284D]">Functional grade</span>
              <br />
              Fully functional, no defects found
            </p>
          </div>
          <div className="mt-2 flex items-start gap-2">
            <span className="text-sm font-black leading-none text-[#0052CC]">B</span>
            <p className="text-[9px] text-[#4A5875]">
              <span className="font-bold text-[#17284D]">Cosmetic grade</span>
              <br />
              Light wear; no cracks, dents or marks
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#DDE4F3] bg-white p-3">
          <p className="mb-1.5 text-[8px] font-bold uppercase tracking-wide text-[#8A93A6]">Key Specifications</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-[#4A5875]">
            <p>Core Ultra 5 125H</p>
            <p>16 GB LPDDR5X</p>
            <p>1.02 TB NVMe SSD</p>
            <p>14&quot; OLED 2.8K 120Hz</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   PAGE 2 — DIAGNOSTIC TEST RESULTS
--------------------------------------------------------- */

const TEST_CATEGORIES = [
  { label: "Core Hardware & Storage", icon: Cpu, pass: 5, fail: 0, na: 3 },
  { label: "Multimedia", icon: Volume2, pass: 4, fail: 0, na: 1 },
  { label: "Display & Software", icon: Monitor, pass: 2, fail: 0, na: 1 },
  { label: "Power & Thermal", icon: Zap, pass: 1, fail: 0, na: 2 },
  { label: "Connectivity", icon: Wifi, pass: 3, fail: 0, na: 1 },
  { label: "Input & Ports", icon: Keyboard, pass: 3, fail: 0, na: 1 },
];

function TestResultsPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-[#DDE4F3] bg-white p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#17284D]">Diagnostic Test Results</p>
            <p className="text-[9px] text-[#8A93A6]">27 tests executed · 100% of applicable tests passed</p>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-700">PASS</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-[9px] font-bold">
          <span className="text-emerald-600">18 Passed</span>
          <span className="text-[#8A93A6]">0 Failed</span>
          <span className="text-[#8A93A6]">9 N/A</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EEF1F8]">
          <motion.div
            className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {TEST_CATEGORIES.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border border-[#DDE4F3] bg-white p-2.5"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0052CC]/10 text-[#0052CC]">
                <Icon size={12} />
              </span>
              <p className="mt-1.5 truncate text-[10px] font-bold text-[#17284D]">{cat.label}</p>
              <p className="mt-0.5 text-[8.5px] font-semibold">
                <span className="text-emerald-600">{cat.pass} pass</span>
                <span className="text-[#8A93A6]"> · {cat.fail} fail · {cat.na} n/a</span>
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   PAGE 3 — TECHNICAL SPECIFICATION
--------------------------------------------------------- */

const SPEC_CARDS = [
  { icon: Cpu, label: "Processor", value: "Core Ultra 5 125H", sub: "Meteor Lake · 14 cores / 18 threads" },
  { icon: MemoryStick, label: "Memory", value: "16 GB LPDDR5X", sub: "7467 MT/s · soldered" },
  { icon: HardDrive, label: "Storage", value: "1.02 TB NVMe SSD", sub: "PCIe 4.0 x4 · Healthy" },
  { icon: Monitor, label: "Display", value: '14" OLED 2.8K', sub: "120 Hz · 2880 x 1800" },
  { icon: Battery, label: "Battery", value: "81% Health", sub: "59.5 / 75.1 Wh · 315 cycles" },
  { icon: Wifi, label: "Network", value: "Wi-Fi 6E + BT 5.3", sub: "No wired Ethernet fitted" },
];

function SpecificationPage() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-sm font-bold text-[#17284D]">Technical Specification</p>
        <p className="text-[9px] text-[#8A93A6]">Resolved from device firmware &amp; verified against manufacturer data</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SPEC_CARDS.map((spec, idx) => {
          const Icon = spec.icon;
          return (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-xl border border-[#DDE4F3] bg-white p-2.5"
            >
              <div className="flex items-center gap-1.5">
                <Icon size={12} className="text-[#0052CC]" />
                <span className="text-[8px] font-bold uppercase tracking-wide text-[#8A93A6]">{spec.label}</span>
              </div>
              <p className="mt-1 truncate text-[11px] font-bold text-[#17284D]">{spec.value}</p>
              <p className="mt-0.5 truncate text-[8.5px] text-[#8A93A6]">{spec.sub}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-xl border border-[#DDE4F3] bg-white p-3">
        <p className="mb-2 text-[8px] font-bold uppercase tracking-wide text-[#8A93A6]">Consumable Component Health</p>
        <div className="space-y-2.5">
          <div>
            <div className="mb-1 flex items-center justify-between text-[9px] font-semibold text-[#4A5875]">
              <span>Battery — 81% Good</span>
              <span className="text-[#8A93A6]">Pass threshold 80%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF1F8]">
              <motion.div className="h-full rounded-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: "81%" }} transition={{ duration: 0.8, ease: "easeOut" }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-[9px] font-semibold text-[#4A5875]">
              <span>SSD Endurance — 4% used, Healthy</span>
              <span className="text-[#8A93A6]">96% remaining</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EEF1F8]">
              <motion.div className="h-full rounded-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: "96%" }} transition={{ duration: 0.8, ease: "easeOut" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   PAGE 4 — COMPLIANCE & CHAIN OF CUSTODY
--------------------------------------------------------- */

const CUSTODY_STEPS = [
  { stage: "Intake & inspection", location: "Receiving", op: "XC-R-1180" },
  { stage: "Secure data erasure", location: "Secure Erase Bay", op: "XC-S-0042" },
  { stage: "Refurbishment", location: "Workshop", op: "XC-W-2291" },
  { stage: "QC diagnostic testing", location: "Test Bench 04", op: "XC-T-3728" },
  { stage: "QA review & release", location: "Quality", op: "XC-Q-0114" },
];

function CompliancePage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-[#DDE4F3] bg-white p-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#17284D]">
              <ShieldCheck size={13} className="text-emerald-600" /> Data Sanitisation
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-bold text-emerald-700">PASS</span>
          </div>
          <p className="mt-1.5 text-[9px] text-[#4A5875]">NIST SP 800-88 Rev.1 (Purge) · XC-Wipe 4.2.1</p>
          <p className="text-[8.5px] text-[#8A93A6]">Full read-back verified · 25 Jul 2026</p>
        </div>

        <div className="rounded-xl border border-[#DDE4F3] bg-white p-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#17284D]">
              <FileCheck size={13} className="text-emerald-600" /> Warranty
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-bold text-emerald-700">PASS</span>
          </div>
          <p className="mt-1.5 text-[9px] text-[#4A5875]">12 months limited · expires 27 Jul 2027</p>
          <p className="text-[8.5px] text-[#8A93A6]">Covers hardware faults; excludes accidental damage</p>
        </div>
      </div>

      <div className="rounded-xl border border-[#DDE4F3] bg-white p-3">
        <p className="mb-2 text-[8px] font-bold uppercase tracking-wide text-[#8A93A6]">Chain of Custody</p>
        <div className="space-y-2">
          {CUSTODY_STEPS.map((step, idx) => (
            <motion.div
              key={step.stage}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="flex items-center gap-2 text-[9px]"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <CheckCircle2 size={9} strokeWidth={3} />
              </span>
              <span className="flex-1 truncate font-semibold text-[#17284D]">{step.stage}</span>
              <span className="hidden shrink-0 text-[#8A93A6] sm:inline">{step.location}</span>
              <span className="shrink-0 font-mono text-[#8A93A6]">{step.op}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-[#DDE4F3] bg-white p-2.5 text-center">
          <Recycle size={14} className="mx-auto text-[#0052CC]" />
          <p className="mt-1 text-[9px] font-bold text-[#17284D]">R2v3 Aligned</p>
        </div>
        <div className="rounded-xl border border-[#DDE4F3] bg-white p-2.5 text-center">
          <ShieldCheck size={14} className="mx-auto text-[#0052CC]" />
          <p className="mt-1 text-[9px] font-bold text-[#17284D]">WEEE / EPR</p>
        </div>
        <div className="rounded-xl border border-[#DDE4F3] bg-white p-2.5 text-center">
          <Leaf size={14} className="mx-auto text-emerald-600" />
          <p className="mt-1 text-[9px] font-bold text-[#17284D]">≈316 kg CO2e</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   SHELL — PAGE TABS + NAV
--------------------------------------------------------- */

const PAGES = [
  { key: "certificate", label: "Certificate", Page: CertificatePage },
  { key: "results", label: "Test Results", Page: TestResultsPage },
  { key: "specs", label: "Specifications", Page: SpecificationPage },
  { key: "compliance", label: "Compliance", Page: CompliancePage },
];

export default function CertificationDemo() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const interactedRef = useRef(false);

  const goTo = (index: number, userDriven = false) => {
    if (userDriven) interactedRef.current = true;
    const next = (index + PAGES.length) % PAGES.length;
    setDirection(next > active ? 1 : -1);
    setActive(next);
  };

  useEffect(() => {
    if (interactedRef.current) return;
    const timer = setTimeout(() => goTo(active + 1), 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const current = PAGES[active];
  const CurrentPage = current.Page;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-white">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#DDE4F3] px-3 py-2.5 sm:px-4">
        <div className="min-w-0">
          <span className="text-sm font-extrabold tracking-tight text-[#17284D] font-display">
            XTRA<span className="text-[#0052CC]">COVER</span>
          </span>
          <p className="hidden text-[9px] text-[#8A93A6] sm:block">Certificate {CERT.number} · Issued {CERT.issued}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => goTo(active - 1, true)}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#DDE4F3] text-[#4A5875] transition-colors hover:bg-[#F4F6FB]"
            aria-label="Previous page"
          >
            <ChevronLeft size={12} />
          </button>
          <span className="text-[9px] font-bold text-[#8A93A6]">
            {active + 1} / {PAGES.length}
          </span>
          <button
            onClick={() => goTo(active + 1, true)}
            className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#DDE4F3] text-[#4A5875] transition-colors hover:bg-[#F4F6FB]"
            aria-label="Next page"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Page tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 overflow-x-auto border-b border-[#DDE4F3] px-3 py-2.5 scrollbar-none sm:px-4">
        {PAGES.map((p, idx) => (
          <button
            key={p.key}
            onClick={() => goTo(idx, true)}
            className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-md border px-3 py-1.5 text-[15px] font-bold transition-colors ${
              idx === active ? "border-[#0052CC] bg-[#0052CC] text-white" : "border-[#DDE4F3] bg-white text-[#4A5875] hover:border-[#0052CC]/40"
            }`}
          >
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${idx === active ? "bg-white/25" : "bg-[#F4F6FB] text-[#8A93A6]"}`}>
              {idx + 1}
            </span>
            {p.label}
          </button>
        ))}
      </div>

      {/* Page content */}
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
            <CurrentPage />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
