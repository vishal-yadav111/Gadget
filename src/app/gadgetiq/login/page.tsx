"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Sparkles,
  TrendingUp,
  FileCheck2,
  Check,
  UserPlus,
} from "lucide-react";
import {
  gadgetIqAuth,
  GadgetIqLoginData,
} from "@/lib/services/gadgetiq-api";
import { getFriendlyErrorMessage } from "@/app/gadgetiq/(lens)/core";
import "../_components/home.css";

const platformBullets = [
  {
    icon: Cpu,
    title: "64-Point Subsystem Sweep",
    desc: "Automated hardware diagnostics for mobile and laptop devices.",
  },
  {
    icon: TrendingUp,
    title: "Circular Value Maximization",
    desc: "Algorithmic grade mapping and real-time resale channel valuation.",
  },
  {
    icon: FileCheck2,
    title: "Instant QR Condition Reports",
    desc: "Cryptographically verified digital condition passports.",
  },
];

export default function GadgetIqLoginPage() {
  const router = useRouter();

  // Sign In Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<GadgetIqLoginData | null>(null);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Please enter both your username/email and password.");
      return;
    }

    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const data = await gadgetIqAuth.login(username, password);
      setLoginData(data);

      setTimeout(() => {
        router.push("/gadgetiq/dashboard");
      }, 700);
    } catch (err: any) {
      const errMsg = (err?.message || "").toLowerCase();
      const isUnregistered =
        errMsg.includes("not found") ||
        errMsg.includes("not registered") ||
        errMsg.includes("does not exist") ||
        errMsg.includes("invalid user") ||
        errMsg.includes("unregistered") ||
        errMsg.includes("no account");

      if (isUnregistered) {
        setInfoMessage(
          "No registered account found with these credentials. Please sign up to create your enterprise account."
        );
      } else {
        setError(
          getFriendlyErrorMessage(
            err,
            "Invalid credentials. If you do not have an account, please sign up."
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#17284D] font-sans flex flex-col justify-between selection:bg-[#0052CC]/15 selection:text-[#0052CC] relative overflow-x-hidden hero-texture">
      {/* Background Ambient Glow */}
      <div className="hero-noise pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[#0052CC]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-[-5%] h-[400px] w-[400px] rounded-full bg-[#FF5630]/8 blur-3xl" />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <Link
            href="/gadgetiq"
            className="flex items-center space-x-3 group cursor-pointer transition-transform hover:scale-[1.01]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logoblack.png"
              alt="GadgetIQ"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <div className="hidden sm:flex items-center space-x-1.5 pl-3 border-l border-[#DDE4F3]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#5F6A86]">
                Powered by
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/xtracover-logo1.png"
                alt="XtraCover"
                className="h-4 w-auto object-contain opacity-85"
              />
            </div>
          </Link>

          <div className="flex items-center space-x-3 text-xs">
            <span className="hidden sm:inline text-[#5F6A86] font-medium">
              New to GadgetIQ?
            </span>
            <Link
              href="/gadgetiq/signup"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE4F3] text-xs font-bold text-[#0052CC] hover:bg-[#E9EEF9] hover:border-[#0052CC]/30 transition-all shadow-2xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ========================================================= */}
          {/* LEFT SIDE: Promotional Section */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#0052CC] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Device Intelligence Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#17284D] font-display leading-[1.15]">
                Diagnose. Grade.{" "}
                <span className="italic text-[#0052CC]">Maximize Value.</span>
              </h1>

              <p className="text-sm text-[#4A5875] leading-relaxed max-w-lg font-sans">
                Automated hardware diagnostic testing and AI optical inspection for ITAD and recommerce operations.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4 pt-2">
              {platformBullets.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3.5 group">
                    <div className="p-2 rounded-xl bg-[#0052CC]/10 text-[#0052CC] shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#17284D] font-display">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#5F6A86] mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick trust metrics */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#DDE4F3] text-xs text-[#5F6A86]">
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-[#00875A]" />
                <span className="font-semibold text-[#17284D]">99.4% Defect Accuracy</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-[#00875A]" />
                <span className="font-semibold text-[#17284D]">&lt; 45s Diagnostic Cycle</span>
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: Sign In Form */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="lg:col-span-6"
          >
            <div className="glow-border relative overflow-hidden rounded-[24px] border border-[#DDE4F3] bg-white p-7 sm:p-9 shadow-xl">
              {/* Success Overlay Animation */}
              <AnimatePresence>
                {loginData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/98 z-30 rounded-[24px] flex flex-col items-center justify-center p-6 text-center"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#00875A] flex items-center justify-center mb-4 shadow-xs">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold font-display text-[#17284D]">
                      Authentication Successful
                    </h2>
                    <p className="text-xs text-[#5F6A86] mt-1.5">
                      Welcome, <span className="font-bold text-[#17284D]">{loginData.user.fullName || loginData.user.username}</span>
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-xs text-[#0052CC] font-semibold">
                      <div className="w-4 h-4 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin" />
                      <span>Opening Dashboard...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Title & Description */}
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#17284D] tracking-tight">
                  Sign In
                </h2>
                <p className="text-xs sm:text-sm text-[#5F6A86] mt-1">
                  Enter your credentials to access the GadgetIQ workspace.
                </p>
              </div>

              {/* Informational Notice */}
              <AnimatePresence>
                {infoMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-5 p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0052CC] text-xs flex items-start gap-2.5 shadow-2xs"
                  >
                    <UserPlus className="w-4 h-4 shrink-0 text-[#0052CC] mt-0.5" />
                    <div className="flex-1 font-medium leading-relaxed">
                      {infoMessage}{" "}
                      <Link href="/gadgetiq/signup" className="font-bold underline ml-1">
                        Sign up now
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Notice */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-5 p-3 rounded-xl bg-[#FFF2F0] border border-[#FFCCC7] text-[#C7300A] text-xs flex items-start gap-2.5 shadow-2xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#C7300A] mt-0.5" />
                    <div className="flex-1 font-medium leading-relaxed">{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ========================================================= */}
              {/* SIGN IN FORM */}
              {/* ========================================================= */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Username / Email Input */}
                <div>
                  <label
                    htmlFor="login-username"
                    className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1.5"
                  >
                    Username or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="login-username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username or email"
                      disabled={loading}
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15 text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      disabled={loading}
                      autoComplete="current-password"
                      className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15 text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5F6A86] hover:text-[#17284D] transition-colors cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Sign Up Link & Help */}
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-[#5F6A86]">
                    <span>Don&apos;t have an account? </span>
                    <Link
                      href="/gadgetiq/signup"
                      className="font-bold text-[#0052CC] hover:underline cursor-pointer ml-1"
                    >
                      Sign Up
                    </Link>
                  </div>

                  <a
                    href="mailto:support@xtracover.com?subject=GadgetIQ%20Account%20Help"
                    className="text-xs font-semibold text-[#0052CC] hover:text-[#003D99] transition-colors"
                  >
                    Need help?
                  </a>
                </div>

                {/* Log In Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-brand-btn-orange/25 hover:shadow-brand-btn-orange/45 flex items-center justify-center space-x-2 border border-brand-btn-orange/30 group transition-all duration-300 btn-shimmer cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Logging In...</span>
                    </>
                  ) : (
                    <>
                      <span>Log In</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Card Footer Security */}
              <div className="pt-5 mt-6 border-t border-[#DDE4F3] flex items-center justify-between text-[11px] text-[#5F6A86]">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" />
                  <span>256-bit Encrypted Connection</span>
                </div>
                <span>v2.4 Core</span>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-5 sm:px-8 py-5 border-t border-[#DDE4F3] text-xs text-[#5F6A86] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Xtracover Technologies Private Limited. All rights reserved.</span>
        <span>GadgetIQ Intelligent Diagnostics</span>
      </footer>
    </div>
  );
}
