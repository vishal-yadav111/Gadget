"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, Loader2 } from "lucide-react";

interface TestItem {
  name: string;
  status: "idle" | "testing" | "passed";
}

export default function LaptopMockup() {
  const [tests, setTests] = useState<TestItem[]>([
    // Page 1 (0 to 5)
    { name: "Operating System", status: "idle" },
    { name: "CPU Processor", status: "idle" },
    { name: "Memory (RAM)", status: "idle" },
    { name: "Storage Drive", status: "idle" },
    { name: "Graphics (GPU)", status: "idle" },
    { name: "Battery Health", status: "idle" },
    // Page 2 (6 to 11)
    { name: "Display Panel", status: "idle" },
    { name: "Wireless Interface", status: "idle" },
    { name: "Bluetooth Radio", status: "idle" },
    { name: "Keyboard Matrix", status: "idle" },
    { name: "Camera Array", status: "idle" },
    { name: "Audio System", status: "idle" },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [scanPulse, setScanPulse] = useState(true);

  useEffect(() => {
    if (assessmentComplete) {
      const restartTimeout = setTimeout(() => {
        // Reset and restart the loop
        setTests([
          // Page 1 (0 to 5)
          { name: "Operating System", status: "idle" },
          { name: "CPU Processor", status: "idle" },
          { name: "Memory (RAM)", status: "idle" },
          { name: "Storage Drive", status: "idle" },
          { name: "Graphics (GPU)", status: "idle" },
          { name: "Battery Health", status: "idle" },
          // Page 2 (6 to 11)
          { name: "Display Panel", status: "idle" },
          { name: "Wireless Interface", status: "idle" },
          { name: "Bluetooth Radio", status: "idle" },
          { name: "Keyboard Matrix", status: "idle" },
          { name: "Camera Array", status: "idle" },
          { name: "Audio System", status: "idle" },
        ]);
        setCurrentStep(0);
        setAssessmentComplete(false);
        setScanPulse(true);
      }, 6000); // Display the certificate for 6s before restarting
      return () => clearTimeout(restartTimeout);
    }

    if (currentStep < tests.length) {
      // Set current test status to testing
      setTests((prev) =>
        prev.map((t, idx) => (idx === currentStep ? { ...t, status: "testing" } : t))
      );

      const timer = setTimeout(() => {
        setTests((prev) =>
          prev.map((t, idx) => {
            if (idx === currentStep) {
              return { ...t, status: "passed" };
            }
            return t;
          })
        );
        setCurrentStep((prev) => prev + 1);
      }, 550); // 550ms per test (6.6s total scan time)

      return () => clearTimeout(timer);
    } else {
      setAssessmentComplete(true);
      setScanPulse(false);
    }
  }, [currentStep, assessmentComplete, tests.length]);

  const isPage2 = currentStep >= 6;
  const currentPageTests = isPage2 ? tests.slice(6, 12) : tests.slice(0, 6);

  return (
    <div className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-none mx-auto flex flex-col items-center justify-center px-1 sm:px-2 py-0.5 lg:py-0">
      {/* Background soft lighting glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/8 to-brand-accent-highlight/8 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* 3D Container with perspective */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center"
      >
        {/* MODERN LAPTOP SCREEN (Lid) */}
        <div className="relative w-full aspect-[16/10.5] rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-[#E2E8F0] p-1.5 sm:p-2 lg:p-2.5 border border-[#CBD5E1] shadow-[0_25px_60px_-12px_rgba(0,82,204,0.18),0_12px_24px_-6px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden">

          {/* Outer edge gloss border */}
          <div className="absolute inset-0 rounded-[15px] sm:rounded-[19px] lg:rounded-[22px] border border-white/40 pointer-events-none z-30" />

          {/* Webcam & Ambient Sensor notch at the top */}
          <div className="absolute top-0.5 sm:top-1 left-1/2 -translate-x-1/2 flex items-center space-x-1 sm:space-x-1.5 z-45 bg-[#E2E8F0] px-2 sm:px-3 py-0.5 rounded-b-md border-x border-b border-[#CBD5E1]/30">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#1e293b]" />
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-500/60" />
          </div>

          {/* Inner Display Bezel */}
          <div className="relative w-full h-full bg-[#0F172A] rounded-[12px] sm:rounded-[15px] lg:rounded-[18px] p-1 sm:p-1.5 lg:p-2 flex flex-col overflow-hidden border border-[#94A3B8]/40 shadow-inner">

            {/* Screen Inner Display Area */}
            <div className="relative w-full h-full bg-[#FAFAFC] rounded-[8px] sm:rounded-[11px] lg:rounded-[14px] overflow-hidden flex flex-col select-none text-slate-800 font-sans shadow-md border border-white/80">

              {/* Header of Gadget Evaluate Portal */}
              <header className="h-7 sm:h-8 lg:h-9 border-b border-slate-100 bg-[#FFFFFF] px-2 sm:px-3 lg:px-4 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-1 sm:space-x-1.5">
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 rounded-md bg-gradient-to-tr from-brand-accent to-brand-accent-highlight flex items-center justify-center font-bold text-white text-[6.5px] sm:text-[8px] lg:text-[9px] shadow-sm">
                    GE
                  </div>
                  <span className="font-display font-bold text-slate-900 text-[8px] sm:text-[10px] lg:text-[12px] tracking-tight">
                    Gadget<span className="text-gradient-accent ml-0.5">Evaluate</span>
                  </span>
                  {!assessmentComplete && (
                    <span className="px-1 sm:px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[6px] sm:text-[7px] lg:text-[8px] font-bold flex items-center space-x-1">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Audit</span>
                    </span>
                  )}
                  {assessmentComplete && (
                    <span className="px-1 sm:px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[6px] sm:text-[7px] lg:text-[8px] font-bold flex items-center space-x-1">
                      <span className="w-1 h-1 rounded-full bg-blue-500" />
                      <span>Audit Complete</span>
                    </span>
                  )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-1.5">
                  <div className="h-3 sm:h-3.5 w-px bg-slate-200" />
                  <div className="flex items-center space-x-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    <span className="text-slate-700 text-[6px] sm:text-[7px] lg:text-[8px] font-semibold uppercase tracking-wider">
                      {assessmentComplete ? "Audit Report" : `Scanning P${isPage2 ? "2" : "1"}`}
                    </span>
                  </div>
                </div>
              </header>

              {/* Main Content Space */}
              <div className="flex-1 flex p-2 sm:p-3 lg:p-4 overflow-hidden bg-gradient-to-b from-[#FAFAFC] to-[#F1F5F9] relative">

                {/* Scanning laser sweep effect */}
                <AnimatePresence>
                  {scanPulse && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 overflow-hidden pointer-events-none z-20"
                    >
                      <div className="w-full h-full border-b-2 border-brand-accent/40 bg-gradient-to-t from-brand-accent/12 to-transparent animate-[laser-sweep_3s_linear_infinite]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {!assessmentComplete ? (
                  /* Split layout displaying live diagnostics checks */
                  <div className="w-full h-full flex space-x-2 sm:space-x-3 lg:space-x-4 overflow-hidden">
                    {/* LEFT COLUMN: System status and circular scanning radar */}
                    <div className="w-[42%] flex flex-col justify-between border-r border-slate-200/60 pr-1.5 sm:pr-2.5 lg:pr-3">
                      <div className="space-y-0.5">
                        <span className="text-[5.5px] sm:text-[7px] lg:text-[8px] font-bold text-slate-400 uppercase tracking-wider">Device Under Test</span>
                        <h3 className="text-slate-950 font-extrabold text-[9px] sm:text-[11px] lg:text-sm leading-tight">ASUS Zenbook 14</h3>
                        <p className="text-[6.5px] sm:text-[8px] lg:text-[9.5px] font-mono text-slate-400 truncate">S/N: S4N0CX01D214143</p>
                      </div>

                      {/* Circular radar graph visualizer */}
                      <div className="my-auto flex flex-col items-center justify-center relative py-1 sm:py-2">
                        <div className="absolute w-12 h-12 sm:w-16 sm:h-16 lg:w-22 lg:h-22 rounded-full border border-brand-accent/15 animate-radar pointer-events-none" />
                        <div className="absolute w-12 h-12 sm:w-16 sm:h-16 lg:w-22 lg:h-22 rounded-full border border-brand-accent-highlight/5 animate-radar [animation-delay:1.5s] pointer-events-none" />
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-16 lg:h-16 rounded-full border border-slate-200 bg-white flex flex-col items-center justify-center shadow-inner relative z-10">
                          <div className="text-center">
                            <Loader2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 animate-spin text-brand-accent mx-auto" />
                            <span className="text-[5px] sm:text-[6px] lg:text-[7.5px] font-extrabold uppercase text-brand-accent tracking-wider block mt-0.5 animate-pulse">Scanning</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom alert index */}
                      <div className="bg-slate-100/80 rounded-md p-1 sm:p-1.5 text-[5.5px] sm:text-[7px] lg:text-[8px] text-slate-500 font-medium border border-slate-200/50 leading-tight">
                        <span>Checking your device…</span>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Interactive diagnostic checklist (6 tests per page) */}
                    <div className="w-[58%] flex flex-col justify-between pl-1 sm:pl-2 z-10">
                      <div className="space-y-0.5 flex items-center justify-between shrink-0">
                        <span className="text-[5.5px] sm:text-[7px] lg:text-[8px] font-bold text-slate-400 uppercase tracking-wider">Diagnostic Sequence</span>
                        <span className="text-[5px] sm:text-[6.5px] lg:text-[7.5px] font-bold text-brand-primary uppercase tracking-wider bg-brand-primary/5 px-1 sm:px-1.5 py-0.5 rounded border border-brand-primary/10">
                          Page {isPage2 ? "2" : "1"} of 2
                        </span>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isPage2 ? "page2" : "page1"}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="flex-1 flex flex-col justify-around py-0.5"
                        >
                          {currentPageTests.map((t) => (
                            <div key={t.name} className="flex items-center justify-between text-[7px] sm:text-[8.5px] lg:text-[10.5px] xl:text-[11.5px] font-medium py-0.5 border-b border-slate-100 last:border-b-0 leading-tight">
                              <span className="text-slate-700 font-normal truncate mr-1">{t.name}</span>
                              <div className="flex items-center justify-end min-w-[32px] sm:min-w-[40px] shrink-0">
                                {t.status === "idle" && (
                                  <span className="text-[6px] sm:text-[7px] lg:text-[8px] text-slate-400 font-mono">queued</span>
                                )}
                                {t.status === "testing" && (
                                  <Loader2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 animate-spin text-brand-accent shrink-0" />
                                )}
                                {t.status === "passed" && (
                                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-scale-in shrink-0">
                                    <Check className="w-1.5 h-1.5 sm:w-2 sm:h-2 stroke-[3.5]" />
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  /* Certificate Generation Screen */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full h-full flex flex-col justify-between overflow-hidden text-slate-800"
                  >
                    {/* Top Certificate Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-0.5 sm:pb-1 shrink-0">
                      <div>
                        <span className="text-[5.5px] sm:text-[6.5px] lg:text-[7.5px] font-black uppercase text-slate-400 tracking-wider">
                          CERTIFICATE OF QUALITY ASSURANCE
                        </span>
                        <h3 className="text-[8.5px] sm:text-[10.5px] lg:text-xs xl:text-[14px] font-black text-slate-900 leading-tight tracking-tight mt-0.5 font-display">
                          ASUS Zenbook 14 UX3405MA
                        </h3>
                        <p className="text-[5.5px] sm:text-[6.5px] lg:text-[7.5px] text-slate-400 mt-0.5 leading-none truncate">
                          Notebook · ASUSTeK · Serial: <span className="font-mono font-bold text-slate-600">S4N0CX01D214143</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0 pl-1">
                        <span className="text-[5px] sm:text-[6px] lg:text-[7px] font-bold text-slate-400 block leading-none">CERTIFICATE ID</span>
                        <span className="text-[5.5px] sm:text-[7px] lg:text-[8.5px] font-mono font-bold text-brand-primary bg-brand-primary/5 px-1 py-0.5 rounded border border-brand-primary/10 block mt-0.5">
                          XCW-2026-0728-441
                        </span>
                      </div>
                    </div>

                    {/* Main Banner Bar */}
                    <div className="my-0.5 sm:my-1 flex items-center justify-between bg-emerald-500/[0.04] border border-emerald-500/15 rounded-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 shrink-0">
                      <div className="flex items-center space-x-1 sm:space-x-1.5">
                        <div className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow shadow-emerald-500/25 shrink-0">
                          <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 stroke-[3.5]" />
                        </div>
                        <div>
                          <span className="text-[8px] sm:text-[9.5px] lg:text-xs font-black text-emerald-600 tracking-wider">PASS</span>
                        </div>
                      </div>
                      <div className="text-center sm:text-left shrink-0">
                        <span className="text-[6.5px] sm:text-[8px] lg:text-[9.5px] font-bold text-slate-800 block leading-tight">37 Of 37 tests passed</span>
                        <span className="text-[5px] sm:text-[6px] lg:text-[7.5px] text-slate-400 block leading-none mt-0.5">Assessed 28 Jul 2026, 14:56 IST</span>
                      </div>
                      <div className="text-right hidden sm:block shrink-0">
                        <span className="text-[6px] sm:text-[7.5px] lg:text-[8.5px] font-bold text-slate-500 block">Gadget Evaluate v2.4</span>
                        <span className="text-[5px] sm:text-[6px] lg:text-[7px] text-emerald-600 font-semibold block leading-none mt-0.5">All criteria met</span>
                      </div>
                    </div>

                    {/* 4 Health Stats Boxes */}
                    <div className="grid grid-cols-4 gap-0.5 sm:gap-1 my-0.5 shrink-0">
                      <div className="bg-white border border-slate-100 rounded p-0.5 sm:p-1 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <span className="text-[4.5px] sm:text-[6px] lg:text-[7px] font-bold uppercase text-slate-400 block tracking-wider leading-none">Device Health</span>
                        <span className="text-[7px] sm:text-[8.5px] lg:text-xs font-black text-emerald-600 block mt-0.5 leading-none">Excellent</span>
                      </div>
                      <div className="bg-white border border-slate-100 rounded p-0.5 sm:p-1 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <span className="text-[4.5px] sm:text-[6px] lg:text-[7px] font-bold uppercase text-slate-400 block tracking-wider leading-none">Battery Health</span>
                        <span className="text-[7px] sm:text-[8.5px] lg:text-xs font-black text-slate-800 block mt-0.5 leading-none">81%</span>
                      </div>
                      <div className="bg-white border border-slate-100 rounded p-0.5 sm:p-1 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <span className="text-[4.5px] sm:text-[6px] lg:text-[7px] font-bold uppercase text-slate-400 block tracking-wider leading-none">Tests Run</span>
                        <span className="text-[7px] sm:text-[8.5px] lg:text-xs font-black text-slate-800 block mt-0.5 leading-none">37 / 37</span>
                      </div>
                      <div className="bg-white border border-slate-100 rounded p-0.5 sm:p-1 text-center shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                        <span className="text-[4.5px] sm:text-[6px] lg:text-[7px] font-bold uppercase text-slate-400 block tracking-wider leading-none">Assurance</span>
                        <span className="text-[7px] sm:text-[8.5px] lg:text-xs font-black text-brand-primary block mt-0.5 leading-none">A / B</span>
                      </div>
                    </div>

                    {/* Specifications Grid */}
                    <div className="bg-white border border-slate-100 rounded p-1 sm:p-1.5 my-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex-1 flex flex-col justify-center">
                      <span className="text-[5px] sm:text-[6.5px] lg:text-[7.5px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5 leading-none">
                        Key Hardware Specifications
                      </span>
                      <div className="grid grid-cols-3 gap-y-0.5 sm:gap-y-1 gap-x-1.5 text-[6px] sm:text-[7.5px] lg:text-[9.5px] leading-tight">
                        <div>
                          <span className="text-slate-400 block text-[4.5px] sm:text-[5.5px] leading-none uppercase">Processor</span>
                          <span className="text-slate-700 font-bold truncate block">Core Ultra 5</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[4.5px] sm:text-[5.5px] leading-none uppercase">Memory</span>
                          <span className="text-slate-700 font-bold truncate block">16 GB RAM</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[4.5px] sm:text-[5.5px] leading-none uppercase">Storage</span>
                          <span className="text-slate-700 font-bold truncate block">1 TB SSD</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[4.5px] sm:text-[5.5px] leading-none uppercase">Graphics</span>
                          <span className="text-slate-700 font-bold truncate block">Intel Arc</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[4.5px] sm:text-[5.5px] leading-none uppercase">Display</span>
                          <span className="text-slate-700 font-bold truncate block">14" OLED 2.8K</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[4.5px] sm:text-[5.5px] leading-none uppercase">OS</span>
                          <span className="text-slate-700 font-bold truncate block">Win 11</span>
                        </div>
                      </div>
                    </div>

                    {/* Conditions & Assurance Section */}
                    <div className="grid grid-cols-2 gap-0.5 sm:gap-1 mt-0.5 shrink-0">
                      <div className="bg-slate-50 border border-slate-100 rounded p-0.5 sm:p-1 flex items-center justify-between text-[5.5px] sm:text-[7px] lg:text-[8px] leading-none">
                        <div className="flex items-center space-x-1">
                          <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[5.5px] sm:text-[7px]">A</span>
                          <span className="text-slate-700 font-bold">Grade A</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[5.5px] sm:text-[7px]">B</span>
                          <span className="text-slate-700 font-bold">Grade B</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded p-0.5 sm:p-1 flex items-center justify-between text-[5.5px] sm:text-[7px] lg:text-[8px] leading-none">
                        <div className="flex items-center space-x-1 shrink-0">
                          <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
                          <span className="text-slate-700 font-bold">Purge NIST</span>
                        </div>
                        <span className="text-[6px] sm:text-[7px] font-bold text-emerald-600 shrink-0">✓ PASS</span>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </div>

          </div>
        </div>

        {/* MODERN LAPTOP KEYBOARD BASE */}
        <div className="relative w-[104%] h-3.5 sm:h-4 lg:h-5 bg-gradient-to-b from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8] border-t border-white/60 rounded-b-2xl shadow-[0_20px_40px_rgba(0,0,0,0.12),0_5px_15px_rgba(0,0,0,0.08)] z-20 flex justify-center">

          {/* Screen hinge connector area */}
          <div className="absolute -top-0.5 sm:-top-1 w-24 sm:w-32 lg:w-44 h-1 sm:h-1.5 bg-[#475569] rounded-b-sm border-t border-[#1E293B]" />

          {/* Indentation track */}
          <div className="absolute inset-x-0 top-0.5 h-0.5 bg-[#94A3B8]/30" />

          {/* Glass trackpad */}
          <div className="w-16 sm:w-24 lg:w-36 h-1.5 sm:h-2 lg:h-2.5 bg-[#E2E8F0]/80 border-x border-b border-[#94A3B8]/60 rounded-b-md shadow-inner -mt-0.5 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
          </div>
        </div>

        {/* drop shadow under base */}
        <div className="w-[98%] h-4 bg-[#94A3B8]/25 blur-[16px] rounded-full -mt-2 -z-10" />
      </motion.div>
    </div>
  );
}

