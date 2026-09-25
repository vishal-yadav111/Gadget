"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cpu,
  Activity,
  ShieldCheck,
  FileCheck2,
  ArrowRight,
  Sparkles,
  Layers,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Smartphone,
  Server,
  Zap,
  Award,
} from "lucide-react";

export default function LandingHomePage() {
  const platforms = [
    {
      title: "GadgetIQ Core Platform",
      badge: "Primary Hub",
      badgeColor: "bg-blue-50 text-[#0052CC] border-blue-200",
      description:
        "The automated diagnostic engine designed for high-throughput testing, multi-point hardware verification, and circular lifecycle grading.",
      href: "/gadgetiq",
      routeBadge: "localhost/gadgetiq",
      icon: Cpu,
      gradient: "from-[#0052CC]/10 to-[#0052CC]/5",
      borderColor: "border-[#0052CC]/30 hover:border-[#0052CC]",
      btnBg: "bg-[#0052CC] hover:bg-[#003D99] text-white",
      features: [
        "40+ Automated System Checks",
        "Hardware Component Health Pass",
        "Refurbishment & Resale Logic",
        "OEM Lifecycle Verification",
      ],
      cta: "Launch GadgetIQ",
    },
    {
      title: "Gadget Evaluate Suite",
      badge: "Deep Diagnostics",
      badgeColor: "bg-orange-50 text-[#FF5630] border-orange-200",
      description:
        "Advanced algorithmic device evaluation suite with deep sensor benchmarks, dynamic health scores, and enterprise grading intelligence.",
      href: "/gadgetiq/dashboard",
      routeBadge: "localhost/gadgetiq/dashboard",
      icon: Activity,
      gradient: "from-[#FF5630]/10 to-[#FF5630]/5",
      borderColor: "border-[#FF5630]/30 hover:border-[#FF5630]",
      btnBg: "bg-gradient-to-r from-[#FF5630] to-[#FF7A00] text-white hover:opacity-95 shadow-md shadow-[#FF5630]/20",
      features: [
        "Dynamic Health Score Algorithm",
        "Subsystem Deep Scans",
        "Interactive Video Demos",
        "Enterprise Quality Matrices",
      ],
      cta: "Explore Gadget Evaluate",
    },
    {
      title: "QC Reports & Grade Intelligence",
      badge: "Quality Audit",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      description:
        "Multi-station QC diagnostic ledgers, cosmetic grading classification, Excel (.xlsx) data exports, and batch throughput tracking.",
      href: "/gadgetiq/reports/laptop",
      routeBadge: "localhost/gadgetiq/reports",
      icon: Award,
      gradient: "from-emerald-500/10 to-emerald-500/5",
      borderColor: "border-emerald-500/30 hover:border-emerald-500",
      btnBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
      features: [
        "Laptop & Mobile Diagnostic Reports",
        "52/64-Point Hardware Inspections",
        "Native .xlsx Excel Data Export",
        "Granular Cosmetic Grade Tiers",
      ],
      cta: "View QC Reports",
    },
    {
      title: "Certificate Authenticator",
      badge: "Digital Trust",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      description:
        "Public and enterprise certificate validation tool for instant IMEI & Serial inspection, verification certificates, and downloadable PDF reports.",
      href: "/gadgetiq/certificate",
      routeBadge: "localhost/gadgetiq/certificate",
      icon: FileCheck2,
      gradient: "from-purple-500/10 to-purple-500/5",
      borderColor: "border-purple-500/30 hover:border-purple-500",
      btnBg: "bg-purple-600 hover:bg-purple-700 text-white",
      features: [
        "Instant IMEI / Serial Lookup",
        "Tamper-Proof Grade Proofs",
        "One-Click PDF Certificate Download",
        "QR Code Authenticity Check",
      ],
      cta: "Verify Certificate",
    },
  ];

  const quickStats = [
    { label: "Hardware Subsystems Tested", value: "48+" },
    { label: "Evaluation Accuracy", value: "99.4%" },
    { label: "Average Diagnostic Cycle", value: "120s" },
    { label: "Audit-Ready Pass Rate", value: "100%" },
  ];

  return (
    <div className="relative min-h-screen bg-[#F4F6FB] text-[#17284D] font-sans overflow-x-hidden selection:bg-[#FF5630]/20">
      {/* Background ambient lighting mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(255,86,48,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(0,82,204,0.08),transparent_40%),radial-gradient(circle_at_50%_85%,rgba(0,82,204,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,82,204,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,82,204,0.025)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
      </div>

      {/* Top Header */}
      <header className="relative z-20 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md sticky top-0 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logoblack.png"
              alt="Gadget IQ"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <div className="hidden sm:flex items-center space-x-1.5 pl-3 border-l border-slate-200">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#626F86]">
                powered by
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/xtracover-logo1.png"
                alt="XtraCover"
                className="h-4 w-auto object-contain opacity-75"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/gadgetiq"
              className="text-xs sm:text-sm font-semibold text-[#626F86] hover:text-[#0052CC] transition-colors"
            >
              GadgetIQ
            </Link>
            <Link
              href="/gadgetiq/dashboard"
              className="text-xs sm:text-sm font-semibold text-[#626F86] hover:text-[#FF5630] transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/gadgetiq/reports/laptop"
              className="text-xs sm:text-sm font-semibold text-[#626F86] hover:text-emerald-600 transition-colors hidden md:inline-block"
            >
              QC Reports
            </Link>
            <Link
              href="/gadgetiq/certificate"
              className="text-xs sm:text-sm font-semibold text-[#626F86] hover:text-purple-600 transition-colors hidden sm:inline-block"
            >
              Certificate
            </Link>
            <Link
              href="/gadgetiq/login"
              className="px-3.5 py-1.5 rounded-full bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003D99] transition-all shadow-xs cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-[#626F86]">
              Gadget Ecosystem • Navigation Launchpad
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#17284D] tracking-tight leading-tight"
          >
            Intelligent Device Diagnostics &{" "}
            <span className="bg-gradient-to-r from-[#0052CC] via-[#FF5630] to-[#FF7A00] bg-clip-text text-transparent">
              Evaluation Ecosystem
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-[#626F86] font-normal leading-relaxed"
          >
            Select a suite below to explore the core diagnostics platform, deep algorithmic evaluation tools, quality audit reports, or certificate validation.
          </motion.p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {platforms.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className={`bg-white rounded-3xl p-6 border ${p.borderColor} shadow-xs hover:shadow-lg transition-all flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-50 border border-slate-200/80 flex items-center justify-center text-[#17284D] shadow-xs">
                      <Icon className="w-6 h-6 text-[#0052CC]" />
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${p.badgeColor}`}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold font-display text-[#17284D]">
                      {p.title}
                    </h2>
                    <p className="text-xs text-[#626F86] mt-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-[#17284D]">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="font-medium text-[11px] text-slate-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Link
                    href={p.href}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${p.btnBg}`}
                  >
                    <span>{p.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats Banner */}
        <div className="bg-white rounded-3xl p-6 border border-[#DDE4F3] shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {quickStats.map((st) => (
            <div key={st.label} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black font-display text-[#0052CC]">
                {st.value}
              </div>
              <div className="text-xs font-semibold text-[#626F86]">{st.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
