"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPhoneError, sanitizePhoneInput } from "@/lib/phone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  FileCheck2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Sparkles,
  TrendingUp,
  FileText,
  Check,
  UserPlus,
  LogIn,
  XCircle,
} from "lucide-react";
import { gadgetIqAuth, GadgetIqSignUpPayload } from "@/lib/services/gadgetiq-api";
import { getFriendlyErrorMessage } from "@/app/gadgetiq/(lens)/core";
import "../_components/home.css";

const platformBullets = [
  {
    icon: Cpu,
    title: "35-Point Subsystem Sweep",
    desc: "Automated hardware diagnostics for mobile, laptop, and desktop motherboards.",
  },
  {
    icon: TrendingUp,
    title: "Circular Value Maximization",
    desc: "Algorithmic grade mapping and real-time ITAD resale channel valuation.",
  },
  {
    icon: FileText,
    title: "Instant QR Condition Reports",
    desc: "Cryptographically verified digital condition passports for enterprise audit trails.",
  },
];

export default function GadgetIqSignUpPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState<GadgetIqSignUpPayload>({
    company: "",
    address: "",
    name: "",
    email: "",
    phone: "",
    gst: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  const handleChange = (
    field: keyof GadgetIqSignUpPayload,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  // Password matching status
  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;
  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Company validation
    if (!formData.company.trim() || formData.company.trim().length < 2) {
      setError("Please enter a Full COmaapny Name.");
      return;
    }

    // 2. Address validation
    if (!formData.address.trim() || formData.address.trim().length < 5) {
      setError("Please enter a complete Address.");
      return;
    }

    // 3. Name validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError("Please enter your Contact Person / Full Name.");
      return;
    }

    // 4. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid Email Address (e.g. name@domain.com).");
      return;
    }

    // 5. Phone validation (international numbering plans, E.164)
    const phoneError = getPhoneError(formData.phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    // 6. Username validation
    const usernameRegex = /^[a-zA-Z0-9._-]{3,30}$/;
    if (!formData.username.trim() || !usernameRegex.test(formData.username.trim())) {
      setError(
        "Username must be 3-30 characters long and contain only letters, numbers, hyphens, underscores, or dots."
      );
      return;
    }

    // 7. Password length validation
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // 8. Exact Password Match validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please ensure both passwords are identical.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await gadgetIqAuth.signup({
        company: formData.company.trim(),
        address: formData.address.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        gst: formData.gst.trim().toUpperCase(),
        username: formData.username.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccessData(response || { success: true });
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(
        getFriendlyErrorMessage(
          err,
          "Registration failed. Please verify your details or contact system support."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#17284D] font-sans flex flex-col justify-between selection:bg-[#0052CC]/15 selection:text-[#0052CC] relative overflow-x-hidden hero-texture">
      {/* Background Ambient Glow */}
      <div className="hero-noise pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[#0052CC]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-[-5%] h-[450px] w-[450px] rounded-full bg-[#FF5630]/8 blur-3xl" />

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
              Already registered?
            </span>
            <Link
              href="/gadgetiq/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE4F3] text-xs font-bold text-[#0052CC] hover:bg-[#E9EEF9] hover:border-[#0052CC]/30 transition-all shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10 flex-1 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ========================================================= */}
          {/* LEFT SIDE: Platform Benefits Section */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 space-y-6 lg:sticky lg:top-8"
          >
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-[#0052CC] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enterprise Onboarding</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#17284D] font-display leading-[1.15]">
                Register Your{" "}
                <span className="italic text-[#0052CC]">Enterprise Profile.</span>
              </h1>

              <p className="text-sm text-[#4A5875] leading-relaxed max-w-lg font-sans">
                Set up your company workspace to automate 64-point hardware diagnostics, AI grading, and warranty-backed reporting.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4 pt-2">
              {platformBullets.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-start gap-3.5 group">
                    <div className="p-2.5 rounded-xl bg-[#0052CC]/10 text-[#0052CC] shrink-0 mt-0.5 shadow-2xs">
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

            {/* Trust Metrics */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#DDE4F3] text-xs text-[#5F6A86]">
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-[#00875A]" />
                <span className="font-semibold text-[#17284D]">Enterprise ISO 27001 Ready</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-[#00875A]" />
                <span className="font-semibold text-[#17284D]">Instant Account Activation</span>
              </div>
            </div>
          </motion.div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: Dedicated Sign Up Form */}
          {/* ========================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="lg:col-span-7"
          >
            <div className="glow-border relative overflow-hidden rounded-[24px] border border-[#DDE4F3] bg-white p-6 sm:p-8 shadow-xl">

              {/* Success Overlay Animation */}
              <AnimatePresence>
                {successData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/98 z-30 rounded-[24px] flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#00875A] flex items-center justify-center mb-4 shadow-sm">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h2 className="text-2xl font-bold font-display text-[#17284D]">
                      Registration Completed!
                    </h2>
                    <p className="text-sm text-[#5F6A86] mt-2 max-w-sm">
                      Your enterprise account for <span className="font-bold text-[#17284D]">{formData.company}</span> has been created successfully.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
                      <button
                        onClick={() => router.push("/gadgetiq/login")}
                        className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-brand-btn-orange/25 hover:shadow-brand-btn-orange/45 flex items-center justify-center space-x-2 border border-brand-btn-orange/30 transition-all cursor-pointer"
                      >
                        <span>Proceed to Log In</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Title & Description */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold font-display text-[#17284D] tracking-tight flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-[#0052CC]" />
                    <span>Create Enterprise Account</span>
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-[#5F6A86] mt-1">
                  Enter your organization and administrator details to register with GadgetIQ.
                </p>
              </div>

              {/* Error Notice */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mb-5 p-3.5 rounded-xl bg-[#FFF2F0] border border-[#FFCCC7] text-[#C7300A] text-xs flex items-start gap-2.5 shadow-2xs"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#C7300A] mt-0.5" />
                    <div className="flex-1 font-medium leading-relaxed">{error}</div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Company Name & GSTIN (Optional) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="signup-company"
                      className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1"
                    >
                      Company Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-company"
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                        placeholder="e.g. JB Micro Solutions"
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15 text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="signup-gst"
                      className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1 flex items-center justify-between"
                    >
                      <span>GSTIN / Tax ID</span>

                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-gst"
                        type="text"
                        value={formData.gst}
                        onChange={(e) => handleChange("gst", e.target.value.toUpperCase())}

                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15 text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium uppercase"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Address */}
                <div>
                  <label
                    htmlFor="signup-address"
                    className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1"
                  >
                    Corporate Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-address"
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="e.g. 45 Tech Park, Sector 62, Noida, UP 201301"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15 text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium"
                    />
                  </div>
                </div>

                {/* Contact Person Name */}
                <div>
                  <label
                    htmlFor="signup-name"
                    className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1"
                  >
                    Contact Person / Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="e.g. Amarinder Singh"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15 text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium"
                    />
                  </div>
                </div>

                {/* Email Address & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="signup-email"
                      className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1"
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="amarinder@jbmicro.com"
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15 text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="signup-phone"
                      className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1"
                    >
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", sanitizePhoneInput(e.target.value))}
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={20}
                        placeholder="+91 98765 43210"
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15 text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Administrator Username */}
                <div>
                  <label
                    htmlFor="signup-username"
                    className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1"
                  >
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="signup-username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      placeholder="e.g. amarinder_jb"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15 text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Password Input */}
                  <div>
                    <label
                      htmlFor="signup-password"
                      className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1"
                    >
                      Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15 text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F6A86] hover:text-[#17284D] cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="signup-confirm-password"
                        className="block text-xs font-bold text-[#17284D] uppercase tracking-wider"
                      >
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      {/* Live Password Match Status */}
                      {passwordsMatch && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Passwords match
                        </span>
                      )}
                      {passwordsMismatch && (
                        <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5">
                          <XCircle className="w-3 h-3" /> Passwords do not match
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5F6A86]">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        placeholder="••••••••"
                        disabled={loading}
                        className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F4F6FB] border text-sm text-[#17284D] placeholder-[#5F6A86]/60 outline-none transition-all duration-150 font-medium ${passwordsMatch
                          ? "border-emerald-400 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/15"
                          : passwordsMismatch
                            ? "border-rose-300 focus:border-rose-500 focus:ring-3 focus:ring-rose-500/15"
                            : "border-[#DDE4F3] focus:bg-white focus:border-[#0052CC] focus:ring-3 focus:ring-[#0052CC]/15"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F6A86] hover:text-[#17284D] cursor-pointer"
                        aria-label="Toggle confirm password visibility"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Switch back to Log In */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-[#5F6A86]">
                    <span>Already have an account? </span>
                    <Link
                      href="/gadgetiq/login"
                      className="font-bold text-[#0052CC] hover:underline cursor-pointer ml-1"
                    >
                      Log In
                    </Link>
                  </div>

                  <a
                    href="mailto:support@xtracover.com?subject=GadgetIQ%20Sign%20Up%20Assistance"
                    className="text-xs font-semibold text-[#0052CC] hover:text-[#003D99] transition-colors"
                  >
                    Need assistance?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3.5 px-6 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-brand-btn-orange/25 hover:shadow-brand-btn-orange/45 flex items-center justify-center space-x-2 border border-brand-btn-orange/30 group transition-all duration-300 btn-shimmer cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Enterprise Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

              </form>

              {/* Card Footer Security */}
              <div className="pt-5 mt-6 border-t border-[#DDE4F3] flex items-center justify-between text-[11px] text-[#5F6A86]">
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00875A]" />
                  <span>256-bit AES Encrypted</span>
                </div>
                <span>Enterprise Onboarding</span>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full max-w-6xl mx-auto px-5 sm:px-8 py-5 border-t border-[#DDE4F3] text-xs text-[#5F6A86] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Xtracover Technologies Private Limited. All rights reserved.</span>
        <span>GadgetIQ Intelligent Diagnostics Suite</span>
      </footer>
    </div>
  );
}
