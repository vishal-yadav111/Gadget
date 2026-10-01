"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Mail, Loader2 } from "lucide-react";

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

const fadeLeft = {
  hidden: { opacity: 0, x: -30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function BookDemo() {
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

  const updateDemoForm = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setDemoForm((current) => ({
      ...current,
      [name]: name === "phone" ? sanitizePhoneInput(value) : value,
    }));

    // Clear field-specific error as user types/interacts
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

    // Validate form inputs
    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://xcqcbackend.xtracover.com";
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
    "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-text-primary outline-none transition placeholder:text-brand-text-muted/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 shadow-sm";
  const errorFieldClass = "border-red-500 bg-red-50/10 focus:border-red-500 focus:ring-red-500/50";
  const labelClass = "text-[10px] uppercase tracking-wider font-bold text-brand-text-secondary";

  return (
    <section id="contact" className="relative py-8 sm:py-12 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-brand-bg-light overflow-hidden z-10">
      {/* Decorative side lighting glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="relative rounded-[32px] border border-brand-border bg-brand-bg-deep/40 p-8 lg:p-12 shadow-xl overflow-hidden"
        >
          {/* Subtle Accent Radial Glow */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,204,0.03),transparent_50%)]" />

          <div className="relative grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center z-10">
            {/* Left Info Column */}
            <motion.div variants={fadeLeft} className="flex flex-col space-y-6">
              <span className="text-xs font-bold tracking-[0.25em] uppercase text-[#0052CC] font-display">
                BOOK A FREE TRIAL
              </span>
              <h2 className="text-[16px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[22px] lg:text-[26px] font-display">
                See how Gadget Evaluate can fit your <span className="font-bold italic text-[#0052CC]">device workflow.</span>
              </h2>
              <p className="text-sm leading-7 text-[#4A5875] sm:text-base font-normal font-sans">
                Connect with our team to explore optimized quality check criteria, customized grading rule outputs, and flexible pricing structures designed for scale.
              </p>

              {/* <div className="pt-6 grid gap-4 grid-cols-1 sm:grid-cols-3">
                {["QC Workflow", "Grading Rules", "Pricing Outputs"].map((item) => (
                  <div key={item} className="rounded-2xl text-center border border-brand-border bg-white px-4 py-3.5 text-sm font-semibold text-brand-text-primary shadow-sm hover:shadow-md transition-shadow">
                    {item}
                  </div>
                ))}
              </div> */}

              {/* <div className="flex items-center gap-3.5 rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-4 text-xs md:text-sm text-brand-text-secondary leading-relaxed shadow-sm">
                <CalendarCheck size={20} className="shrink-0 text-brand-primary" />
                <span>Demo includes product walkthrough, sample report view and integration discussion.</span>
              </div> */}
            </motion.div>

            {/* Right Form Column */}
            <motion.div variants={fadeRight}>
              <form onSubmit={submitDemoRequest} className="rounded-3xl border border-brand-border bg-white p-6 lg:p-8 shadow-lg">
                {apiError && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 font-medium">
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
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.name}</p>
                    )}
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
                      <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.company}</p>
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
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.email}</p>
                    )}
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
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.phone}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className={labelClass}>Select devices</span>
                    <select
                      name="device"
                      value={demoForm.device}
                      onChange={updateDemoForm}
                      className={fieldClass}
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
                      <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.volume}</p>
                    )}
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className={labelClass}>message</span>
                  <textarea
                    name="message"
                    value={demoForm.message}
                    onChange={updateDemoForm}
                    className={`${fieldClass} ${errors.message ? errorFieldClass : ""} min-h-[118px] resize-none leading-6`}
                    placeholder="Tell us your current QC, grading or pricing workflow."
                    maxLength={1000}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.message}</p>
                  )}
                </label>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-white font-bold text-sm shadow-lg shadow-brand-btn-orange/20 hover:shadow-brand-btn-orange/45 flex items-center justify-center space-x-2 border border-brand-btn-orange/30 group transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        <span className="uppercase tracking-wider">Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={16} className="shrink-0" />
                        <span className="uppercase tracking-wider">book a demo</span>
                      </>
                    )}
                  </button>
                </div>

                {success && (
                  <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 font-medium">
                    Demo Request submitted successfully! Our team will contact you soon.
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
