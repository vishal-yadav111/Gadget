"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { 
  Check, 
  X, 
  Minus, 
  Award, 
  ListTodo, 
  Cpu, 
  History,
  ShieldCheck
} from "lucide-react";

export default function WhatWeDo() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-scroll slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { label: "Check", desc: "Test supported device functions through a guided diagnostic process." },
    { label: "Identify", desc: "See exactly which tests passed and where an issue was found." },
    { label: "Understand", desc: "Get a clear view of the device's functional condition." },
    { label: "Record", desc: "Create a digital assessment and certificate for the completed test." },
  ];

  const pageTabs = [
    { num: 0, label: "Certificate", icon: Award },
    { num: 1, label: "Diagnostics", icon: ListTodo },
    { num: 2, label: "Tech Specs", icon: Cpu },
    { num: 3, label: "Compliance", icon: History },
  ];

  const certDetails = [
    { label: "Description Of the Product", value: "Notebook" },
    { label: "Product Brand", value: "HP" },
    { label: "Product Model Number", value: "HP Laptop 14s-ef1xxx" },
    { label: "Serial Number", value: "5CG2371HH3" },
    { label: "Product Name", value: "8915" },
    { label: "Bios Version", value: "F.23" },
    { label: "Profile ID", value: "somnath" },
    { label: "System SKU", value: "6Q122PA#ACJ" },
    { label: "Date-Time", value: "31-08-2026 18:05:57 PM" },
    { label: "Tested By", value: "gourav3728" },
    { label: "Application Name & Version", value: "XCQC AZ LP.W7sp1x64p3112.19.2502.01LND" },
  ];

  const mandatoryTests = [
    { name: "Audio Playback", status: "passed" },
    { name: "Battery Health", status: "passed" },
    { name: "Internet Test", status: "passed" },
    { name: "Wireless Interface", status: "passed" },
    { name: "Bluetooth Chip", status: "passed" },
    { name: "Camera Photo Test", status: "failed" },
    { name: "Camera Video Test", status: "blocked" },
    { name: "Fan cooling", status: "blocked" },
    { name: "CPU Test", status: "passed" },
    { name: "RAM Test", status: "passed" },
    { name: "Motherboard", status: "passed" },
    { name: "PCI Express slots", status: "blocked" },
    { name: "Storage speed", status: "passed" },
    { name: "Discrete GPU", status: "blocked" },
    { name: "GPU Test", status: "passed" },
    { name: "Charger Test", status: "blocked" },
    { name: "Speaker output", status: "failed" },
    { name: "Microphone", status: "failed" },
    { name: "Touchpad matrix", status: "failed" },
    { name: "Keyboard keys", status: "failed" },
    { name: "Wired Ethernet", status: "blocked" },
    { name: "USB Port Test", status: "failed" },
    { name: "Optical Disk Drive", status: "blocked" },
    { name: "SD Card Slot", status: "blocked" },
    { name: "Display Panel", status: "failed" },
    { name: "Display Brightness", status: "blocked" },
    { name: "Win Activation", status: "passed" },
  ];

  return (
    <section id="what-it-does" className="relative py-16 px-6 md:px-12 bg-brand-bg-mid overflow-hidden z-10">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-accent/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column (Editorial & Refined Step Cards) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <SectionHeading
            eyebrow="WHAT GADGET EVALUATE DOES"
            title="One device. One assessment. A clearer picture."
            align="left"
          />

          <div className="space-y-3">
            {steps.map((st, index) => (
              <div 
                key={st.label} 
                className="flex items-start space-x-3.5 p-3 rounded-2xl border border-transparent bg-white/[0.02] hover:bg-white/[0.06] hover:border-brand-border/40 hover:shadow-xs transition-all duration-150 group cursor-default"
              >
                <span className="w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center text-[10px] font-bold text-brand-accent shrink-0 mt-0.5 group-hover:scale-110 group-hover:bg-brand-accent group-hover:text-white transition-all duration-150">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-brand-text-primary group-hover:text-brand-accent transition-colors duration-150">
                    {st.label}
                  </h4>
                  <p className="text-brand-text-secondary text-xs font-light leading-relaxed mt-0.5">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-brand-text-primary font-bold text-sm border-t border-brand-border pt-4">
            Less guesswork. More clarity. Better decisions.
          </p>
        </div>

        {/* Right Column (Horizontal Auto-Scrolling Dashboard Carousel) */}
        <div className="lg:col-span-7 space-y-4 w-full">
          
          <div className="glass-panel rounded-3xl p-5 md:p-6 space-y-4 shadow-xl border border-white/5 bg-brand-bg-deep/40 relative w-full overflow-hidden">
            
            {/* Top Interactive Tabs bar (Syncs with Auto-Scroll index) */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse shrink-0" />
                <span className="text-[10px] font-black text-brand-text-primary tracking-wider uppercase">
                  LIVE AUDIT ASSESSMENT RECORD
                </span>
              </div>
              
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 text-[9px] font-semibold text-slate-650">
                {pageTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button 
                      key={tab.num}
                      onClick={() => setActiveIndex(tab.num)}
                      className={`px-2 py-1 rounded-md transition-all flex items-center space-x-1 ${
                        activeIndex === tab.num ? "bg-white text-brand-primary shadow-xs font-bold" : "hover:text-slate-900"
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HORIZONTAL CAROUSEL MASK */}
            <div className="relative w-full overflow-hidden rounded-2xl min-h-[380px] flex flex-col justify-between">
              
              <motion.div 
                className="flex w-full"
                animate={{ x: `-${activeIndex * 100}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
              >

                {/* SLIDE 01: QUALITY CHECK TEST CERTIFICATE PANEL */}
                <div className="w-full shrink-0 px-1 text-slate-800">
                  <div className="bg-[#FFFFFF] border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between min-h-[370px]">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between pb-3 border-b border-[#0052CC]/15">
                      <div className="text-left">
                        <span className="text-[6.5px] font-black text-green-600 tracking-wider uppercase font-mono">
                          Reuse. Extend. Save.
                        </span>
                        <h2 className="text-[11.5px] font-black text-[#0052CC] leading-none tracking-tight mt-0.5">
                          Quality Check Test Certificate
                        </h2>
                      </div>
                      
                      {/* Logo badge */}
                      <div className="flex items-center space-x-0.5 shrink-0 text-[9.5px] font-black tracking-tight leading-none text-[#0052CC]">
                        <span>XC</span>
                        <span className="bg-[#0052CC] text-white px-1 py-0.5 rounded text-[7.5px] font-extrabold ml-0.5">QC</span>
                      </div>
                    </div>

                    {/* QR Code and Meta Details */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 py-2 border-b border-slate-100 pb-3">
                      {/* Stylized QR Code SVG */}
                      <div className="w-16 h-16 bg-white border border-slate-200/80 rounded-xl p-1 shrink-0 flex items-center justify-center shadow-2xs">
                        <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                          <path d="M0 0h30v30H0zm10 10h10v10H10zm60-10h30v30H70zm10 10h10v10H70zm-70 70h30v30H0zm10 10h10v10H10z" />
                          <path d="M35 5h10v10H35zm15 0h10v10H50zm0 15h10v10H50zm15 0h5v5h-5zM35 35h10v10H35zm15 15h15v5H50zm25-15h10v15H75zm-15 25h10v10H60zm15 15h15v10H75zM35 60h10v10H35zm0 15h10v10H35zm15 15h10v10H50zm15-15h10v10H65zm15-20h15v5H80zm5 15h5v5h-5z" />
                        </svg>
                      </div>

                      {/* Header Declare Text */}
                      <div className="space-y-1.5 text-center sm:text-left">
                        <h4 className="text-[10px] font-bold text-slate-950">
                          Certificate Number : <span className="text-[#0052CC] font-mono font-black">XC2C45920E</span>
                        </h4>
                        <p className="text-[7.5px] text-slate-500 font-light leading-relaxed">
                          We herewith declare that the following described laptop/notebook has been accessed by XCQC and was found to be in compliance with the XCQC standards as per the following report of test specifications.
                        </p>
                      </div>
                    </div>

                    {/* Specifications Grid list */}
                    <div className="flex-grow flex flex-col justify-center space-y-0.75 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      {certDetails.slice(0, 5).map((det) => (
                        <div key={det.label} className="flex justify-between items-center py-0.5 border-b border-slate-100/50 last:border-b-0 text-[8.5px]">
                          <span className="text-slate-500 font-light">{det.label}</span>
                          <span className="text-slate-800 font-semibold font-mono text-right truncate max-w-[170px]">{det.value}</span>
                        </div>
                      ))}
                      
                      {/* FAIL result box */}
                      <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-200">
                        <span className="text-slate-700 font-bold uppercase text-[9px]">Tested Result</span>
                        <span className="bg-red-50 text-red-600 border border-red-200 font-black font-mono tracking-wider px-2 py-0.5 rounded text-[9px]">
                          FAIL / REPAIR REQ.
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* SLIDE 02: DIAGNOSTIC TEST CHECKLIST PANEL */}
                <div className="w-full shrink-0 px-1 text-slate-800">
                  <div className="bg-[#FFFFFF] border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between min-h-[370px]">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
                      <div>
                        <h2 className="text-[11px] font-black text-slate-950 leading-none">
                          Detailed Assessment Report
                        </h2>
                        <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5 font-mono">
                          HP Laptop 14s-ef1xxx · S/N: 5CG2371HH3
                        </span>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className="bg-amber-50 text-amber-600 border border-amber-200 font-mono font-bold px-1.5 py-0.5 rounded text-[8px]">
                          7 FAILED CHECKS
                        </span>
                      </div>
                    </div>

                    {/* Scrollable checklist items grid */}
                    <div className="flex-grow overflow-y-auto max-h-[220px] pr-1.5 space-y-1 scrollbar-thin my-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[8.5px]">
                        {mandatoryTests.map((t) => (
                          <div 
                            key={t.name} 
                            className="flex items-center justify-between py-1 border-b border-slate-100/50"
                          >
                            <span className="text-slate-600 font-light truncate max-w-[120px]">{t.name}</span>
                            <div className="shrink-0 flex items-center">
                              {t.status === "passed" && (
                                <span className="w-3.5 h-3.5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                                  <Check className="w-2 h-2 stroke-[4.5]" />
                                </span>
                              )}
                              {t.status === "failed" && (
                                <span className="w-3.5 h-3.5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                                  <X className="w-2.5 h-2.5 stroke-[4.5]" />
                                </span>
                              )}
                              {t.status === "blocked" && (
                                <span className="w-3.5 h-3.5 rounded-full bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400">
                                  <Minus className="w-2 h-2 stroke-[3]" />
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Legend details */}
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-1.5 text-[7px] text-slate-400 font-medium shrink-0 mt-1">
                      <span>Legend: ✔ PASS meets criteria</span>
                      <span>✖ FAIL outside tolerance</span>
                      <span>N/A: not fitted</span>
                    </div>

                  </div>
                </div>

                {/* SLIDE 03: TECHNICAL SPECIFICATIONS PANEL */}
                <div className="w-full shrink-0 px-1 text-slate-800">
                  <div className="bg-[#FFFFFF] border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between min-h-[370px]">
                    
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[8px] sm:text-[9px]">
                      <div>
                        <h2 className="text-[10px] font-black text-slate-900 leading-none">Technical Specifications</h2>
                        <span className="text-[6px] text-slate-450 font-mono mt-0.5 block">Resolved from device firmware audit engine</span>
                      </div>
                      <span className="text-[#0052CC] font-mono font-extrabold text-[8px]">CORE DATA</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[8px] my-2">
                      <div className="border border-slate-100 bg-[#FAFAFC] rounded-xl p-2">
                        <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Processor</span>
                        <span className="font-extrabold text-slate-900 block mt-1">Intel Core i5-1135G7</span>
                        <div className="space-y-0.5 mt-1 text-slate-500">
                          <div className="flex justify-between"><span>Architecture</span><span className="font-semibold text-slate-850">11th Gen</span></div>
                          <div className="flex justify-between"><span>Max Clock</span><span className="font-semibold text-slate-850">2.40 GHz</span></div>
                        </div>
                      </div>

                      <div className="border border-slate-100 bg-[#FAFAFC] rounded-xl p-2">
                        <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Display</span>
                        <span className="font-extrabold text-slate-900 block mt-1">14" OLED Screen</span>
                        <div className="space-y-0.5 mt-1 text-slate-500">
                          <div className="flex justify-between"><span>Resolution</span><span className="font-semibold text-slate-850">2880 x 1800</span></div>
                          <div className="flex justify-between"><span>Aspect Ratio</span><span className="font-semibold text-slate-850">16:10</span></div>
                        </div>
                      </div>

                      <div className="border border-slate-100 bg-[#FAFAFC] rounded-xl p-2">
                        <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Memory</span>
                        <span className="font-extrabold text-slate-900 block mt-1">8 GB DDR4 RAM</span>
                        <div className="space-y-0.5 mt-1 text-slate-500">
                          <div className="flex justify-between"><span>Module</span><span className="font-semibold text-slate-850">Micron 8GB</span></div>
                          <div className="flex justify-between"><span>Slot details</span><span className="font-semibold text-slate-850">1 Active stick</span></div>
                        </div>
                      </div>

                      <div className="border border-slate-100 bg-[#FAFAFC] rounded-xl p-2">
                        <span className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Storage</span>
                        <span className="font-extrabold text-slate-900 block mt-1">512 GB NVMe SSD</span>
                        <div className="space-y-0.5 mt-1 text-slate-500">
                          <div className="flex justify-between"><span>Model</span><span className="font-semibold text-slate-850 truncate max-w-[80px]">SAMSUNG</span></div>
                          <div className="flex justify-between"><span>Interface</span><span className="font-semibold text-slate-850">PCIe 4.0 x4</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Component health gauges */}
                    <div className="border border-slate-100 rounded-xl p-2 bg-[#FAFAFC] text-[8px] space-y-1.5 mt-1">
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span>Battery Health: <strong>100% capacity</strong> (608 cycles completed)</span>
                          <span className="text-emerald-600 font-bold">Excellent</span>
                        </div>
                        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-[100%] h-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-0.5">
                          <span>Storage Wear: <strong>0% bad sectors</strong> (512 GB SSD)</span>
                          <span className="text-emerald-600 font-bold">Nominal</span>
                        </div>
                        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-[100%] h-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* SLIDE 04: COMPLIANCE, WARRANTY & CUSTODY TIMELINE */}
                <div className="w-full shrink-0 px-1 text-slate-800">
                  <div className="bg-[#FFFFFF] border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between min-h-[370px]">
                    
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[8px] sm:text-[9px]">
                      <div>
                        <h2 className="text-[10px] font-black text-slate-900 leading-none">Compliance & Custody</h2>
                        <span className="text-[6px] text-slate-450 font-mono mt-0.5 block">Audit registry references & logs</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[7px]">SECURE RECORD</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-2 text-[7.5px] leading-tight">
                      <div className="border border-slate-100 rounded-xl p-2 bg-[#FAFAFC] space-y-0.5 text-slate-500">
                        <span className="text-[6.5px] font-bold text-slate-400 uppercase block font-mono mb-1 text-left">Data sanitisation</span>
                        <div>Method: <span className="font-semibold text-slate-800">NIST SP 800-88 Rev.1</span></div>
                        <div>Tool: <span className="font-semibold text-slate-800">XC-Wipe 4.2.1</span></div>
                      </div>

                      <div className="border border-slate-100 rounded-xl p-2 bg-[#FAFAFC] space-y-0.5 text-slate-500">
                        <span className="text-[6.5px] font-bold text-slate-400 uppercase block font-mono mb-1 text-left">Warranty Protection</span>
                        <div>Term: <span className="font-semibold text-slate-800">12 months limited</span></div>
                        <div>Expiry: <span className="font-semibold text-slate-800">27 Jul 2027</span></div>
                      </div>
                    </div>

                    {/* Chain of Custody tracking */}
                    <div className="border border-slate-100 rounded-xl p-2 bg-[#FAFAFC] space-y-1 flex-grow">
                      <span className="text-[6.5px] font-bold text-slate-400 uppercase block font-mono mb-1 text-left">Chain of Custody Timeline</span>
                      <div className="space-y-1.5 text-[7px] text-slate-600">
                        <div className="flex justify-between border-b border-slate-100/55 pb-0.5">
                          <span>24 Jul 2026 ➔ Intake & inspection</span>
                          <span className="font-mono text-slate-850">XC-R-1188</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100/55 pb-0.5">
                          <span>25 Jul 2026 ➔ Secure data erasure</span>
                          <span className="font-mono text-slate-850">XC-S-0042</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100/55 pb-0.5">
                          <span>28 Jul 2026 ➔ QC diagnostic testing</span>
                          <span className="font-mono text-slate-850">XC-T-3728</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-500/[0.04] border border-emerald-500/15 rounded-xl p-1.5 text-center text-slate-750 font-semibold flex items-center justify-between text-[7px] shrink-0 mt-1.5">
                      <span>🌱 Environmental savings:</span>
                      <span className="text-emerald-600 font-bold font-mono">≈ 316 kg CO2e avoided</span>
                    </div>

                  </div>
                </div>

              </motion.div>

            </div>

            {/* Carousel navigation indicators */}
            <div className="flex justify-center space-x-2 pt-2">
              {pageTabs.map((tab) => (
                <button
                  key={tab.num}
                  onClick={() => setActiveIndex(tab.num)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeIndex === tab.num 
                      ? "bg-brand-primary w-5" 
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
