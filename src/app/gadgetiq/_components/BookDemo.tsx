"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2 } from "lucide-react";
import DarkCard from "./DarkCard";
import PageShell from "./PageShell";
import { fadeLeft, fadeRight, stagger } from "./animations";

import { getPhoneError, sanitizePhoneInput } from "@/lib/phone";

interface DemoFormState {
  name: string;
  company: string;
  email: string;
  phone: string;
  device: string;
  volume: string;
  message: string;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  volume?: string;
  message?: string;
}

interface BookDemoProps {
  ctaLabel?: string;
}

export default function BookDemo({ ctaLabel = "Book a Demo" }: BookDemoProps) {
  const [demoForm, setDemoForm] = useState<DemoFormState>({
    name: "",
    company: "",
    email: "",
    phone: "",
    device: "Windows",
    volume: "",
    message: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const updateDemoForm = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setDemoForm((current) => ({
      ...current,
      [name]: name === "phone" ? sanitizePhoneInput(value) : value,
    }));
    if (errors[name as keyof ValidationErrors]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name as keyof ValidationErrors];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const fieldErrors: ValidationErrors = {};

    if (!demoForm.name.trim()) {
      fieldErrors.name = "Name is required";
    } else if (demoForm.name.length > 80) {
      fieldErrors.name = "Name cannot exceed 80 characters";
    }

    if (!demoForm.email.trim()) {
      fieldErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(demoForm.email)) {
      fieldErrors.email = "Invalid email address";
    }

    const phoneError = getPhoneError(demoForm.phone);
    if (phoneError) fieldErrors.phone = phoneError;

    if (!demoForm.company.trim()) {
      fieldErrors.company = "Company is required";
    } else if (demoForm.company.length > 80) {
      fieldErrors.company = "Company name cannot exceed 80 characters";
    }

    if (demoForm.volume && demoForm.volume.length > 80) {
      fieldErrors.volume = "Monthly volume cannot exceed 80 characters";
    }

    if (demoForm.message && demoForm.message.length > 1000) {
      fieldErrors.message = "Message cannot exceed 1000 characters";
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const submitDemoRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    setApiError(null);
    setSuccess(false);

    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://xcqcbackend.xtracover.com";
      const url = `${baseUrl}/api/v1/demo-requests`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "default_demo_api_key_secret_123",
        },
        body: JSON.stringify(demoForm),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error (${response.status})`);
      }

      setSuccess(true);
      setDemoForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        device: "Windows",
        volume: "",
        message: "",
      });
    } catch (err: any) {
      setApiError(err.message || "Failed to submit demo request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "mt-1.5 w-full rounded-2xl border border-[#DDE4F3] bg-[#F4F6FB] px-4 py-3 text-sm text-[#17284D] placeholder-slate-400 outline-none transition focus:border-[#0052CC] focus:bg-white focus:ring-1 focus:ring-[#0052CC]/30 shadow-xs";
  const errorFieldClass = "border-red-500 bg-red-50/50 focus:border-red-500 focus:ring-red-500/40";
  const labelClass = "text-[10px] uppercase tracking-wider font-bold text-[#5F6A86] font-display";

  return (
    <PageShell id="contact" className="bg-white">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <DarkCard className="relative overflow-hidden border-[#DDE4F3] bg-[#F4F6FB] p-6 lg:p-10 shadow-xl">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0052CC]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 left-10 h-64 w-64 rounded-full bg-[#0052CC]/5 blur-3xl pointer-events-none" />

          <div className="relative grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div variants={fadeLeft}>
              <p className="text-xs uppercase tracking-[0.25em] text-[#0052CC] font-bold font-display">
                book a demo
              </p>
              <h2 className="mt-3 max-w-2xl text-[16px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[22px] lg:text-[26px] font-display">
                See how Gadget IQ can fit your{" "}
                <span className="font-bold italic text-[#0052CC]">device workflow.</span>
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-[#4A5875] font-sans">
                Connect with our team to explore automated diagnostics criteria, AI cosmetic grading rules, and flexible recovery pricing structures designed for scale.
              </p>

              <div className="mt-7 pt-2 grid gap-3 sm:grid-cols-2">
                {["QC Workflow", "Grading Rules"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl text-center border border-[#DDE4F3] bg-white px-4 py-3.5 text-sm text-[#17284D] font-bold font-display shadow-xs"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeRight}>
              <form
                onSubmit={submitDemoRequest}
                className="rounded-[28px] border border-[#DDE4F3] bg-white p-6 lg:p-8 shadow-md"
              >
                {apiError && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-semibold">
                    {apiError}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelClass}>name *</span>
                    <input
                      name="name"
                      value={demoForm.name}
                      onChange={updateDemoForm}
                      className={`${fieldClass} ${errors.name ? errorFieldClass : ""}`}
                      placeholder="Your name"
                      maxLength={80}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.name}</p>}
                  </label>

                  <label className="block">
                    <span className={labelClass}>company *</span>
                    <input
                      name="company"
                      value={demoForm.company}
                      onChange={updateDemoForm}
                      className={`${fieldClass} ${errors.company ? errorFieldClass : ""}`}
                      placeholder="Company name"
                      maxLength={80}
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{errors.company}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className={labelClass}>email *</span>
                    <input
                      name="email"
                      value={demoForm.email}
                      onChange={updateDemoForm}
                      className={`${fieldClass} ${errors.email ? errorFieldClass : ""}`}
                      placeholder="john@email.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.email}</p>}
                  </label>

                  <label className="block">
                    <span className={labelClass}>phone *</span>
                    <input
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      maxLength={20}
                      value={demoForm.phone}
                      onChange={updateDemoForm}
                      className={`${fieldClass} ${errors.phone ? errorFieldClass : ""}`}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.phone}</p>}
                  </label>

                  <label className="block">
                    <span className={labelClass}>Select devices</span>
                    <select
                      name="device"
                      value={demoForm.device}
                      onChange={updateDemoForm}
                      className={`${fieldClass} cursor-pointer font-medium`}
                    >
                      <option value="Windows">Windows laptop</option>
                      <option value="MacBook">MacBook</option>
                      <option value="Mobile" disabled>Mobile (coming soon)</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className={labelClass}>monthly volume</span>
                    <input
                      name="volume"
                      value={demoForm.volume}
                      onChange={updateDemoForm}
                      className={`${fieldClass} ${errors.volume ? errorFieldClass : ""}`}
                      placeholder="Example: 500 devices"
                      maxLength={80}
                    />
                    {errors.volume && (
                      <p className="mt-1 text-xs text-red-500 font-semibold">{errors.volume}</p>
                    )}
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className={labelClass}>message</span>
                  <textarea
                    name="message"
                    value={demoForm.message}
                    onChange={updateDemoForm}
                    className={`${fieldClass} ${
                      errors.message ? errorFieldClass : ""
                    } min-h-[110px] resize-none leading-relaxed`}
                    placeholder="Tell us your current QC, grading or pricing workflow."
                    maxLength={1000}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500 font-semibold">{errors.message}</p>
                  )}
                </label>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-white font-bold text-xs uppercase tracking-[0.16em] shadow-lg shadow-brand-btn-orange/25 hover:shadow-brand-btn-orange/45 flex items-center justify-center space-x-2 border border-brand-btn-orange/30 group transition-all duration-300 btn-shimmer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={16} />
                        <span>{ctaLabel}</span>
                      </>
                    )}
                  </button>
                </div>

                {success && (
                  <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 font-semibold">
                    Demo Request submitted successfully! Our team will contact you soon.
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </DarkCard>
      </motion.div>
    </PageShell>
  );
}
