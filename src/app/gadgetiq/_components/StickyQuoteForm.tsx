"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, X } from "lucide-react";

const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;

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

const INITIAL_FORM: DemoFormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  device: "Windows",
  volume: "",
  message: "",
};

export default function StickyQuoteForm() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [demoForm, setDemoForm] = useState<DemoFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateDemoForm = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setDemoForm((current) => ({ ...current, [name]: value }));
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

    if (!demoForm.phone.trim()) {
      fieldErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(demoForm.phone)) {
      fieldErrors.phone = "Invalid phone number";
    }

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
      setDemoForm(INITIAL_FORM);
    } catch (err: any) {
      setApiError(err.message || "Failed to submit demo request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "mt-1 w-full rounded-xl border border-[#DDE4F3] bg-[#F4F6FB] px-3 py-2 text-xs text-[#17284D] placeholder-slate-400 outline-none transition focus:border-[#0052CC] focus:bg-white focus:ring-1 focus:ring-[#0052CC]/30 shadow-xs";
  const errorFieldClass = "border-red-500 bg-red-50/50 focus:border-red-500 focus:ring-red-500/40";
  const labelClass = "text-[9px] uppercase tracking-wider font-bold text-[#5F6A86] font-display";

  const modal = (
    <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <div className="pointer-events-none fixed inset-y-4 right-0 z-[151] flex items-center justify-end">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="pointer-events-auto relative flex h-[85%] w-full max-w-[340px] flex-col overflow-hidden rounded-l-[20px] border border-[#DDE4F3] bg-white shadow-2xl"
              >
                {/* HEADER */}
                <div className="relative z-10 flex shrink-0 items-start justify-between border-b border-[#DDE4F3] px-4 py-3">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-[#17284D] font-display">
                      Book a Demo
                    </h3>

                    <p className="mt-0.5 text-[10px] text-[#5F6A86]">
                      Request a customized walkthrough for your team.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#DDE4F3] bg-white text-[#4A5875] shadow-xs transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-[#17284D] cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* FORM (same fields/logic as the Book a Demo section) */}
                <div className="grow overflow-y-auto px-4 py-3">
                  <form onSubmit={submitDemoRequest}>
                    {apiError && (
                      <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 font-semibold">
                        {apiError}
                      </div>
                    )}

                    <div className="grid gap-2.5">
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
                        {errors.name && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errors.name}</p>}
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
                          <p className="mt-1 text-[10px] text-red-500 font-semibold">{errors.company}</p>
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
                        {errors.email && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errors.email}</p>}
                      </label>

                      <label className="block">
                        <span className={labelClass}>phone *</span>
                        <input
                          name="phone"
                          value={demoForm.phone}
                          onChange={updateDemoForm}
                          className={`${fieldClass} ${errors.phone ? errorFieldClass : ""}`}
                          placeholder="Phone number"
                        />
                        {errors.phone && <p className="mt-1 text-[10px] text-red-500 font-semibold">{errors.phone}</p>}
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
                          <p className="mt-1 text-[10px] text-red-500 font-semibold">{errors.volume}</p>
                        )}
                      </label>
                    </div>

                    <label className="mt-3 block">
                      <span className={labelClass}>message</span>
                      <textarea
                        name="message"
                        value={demoForm.message}
                        onChange={updateDemoForm}
                        className={`${fieldClass} ${
                          errors.message ? errorFieldClass : ""
                        } min-h-[60px] resize-none leading-relaxed`}
                        placeholder="Tell us your current QC, grading or pricing workflow."
                        maxLength={1000}
                      />
                      {errors.message && (
                        <p className="mt-1 text-[10px] text-red-500 font-semibold">{errors.message}</p>
                      )}
                    </label>

                    <div className="mt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-white font-bold text-[11px] uppercase tracking-[0.16em] shadow-lg shadow-brand-btn-orange/25 hover:shadow-brand-btn-orange/45 flex items-center justify-center space-x-2 border border-brand-btn-orange/30 group transition-all duration-300 btn-shimmer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Mail size={14} />
                            <span>Book a Demo</span>
                          </>
                        )}
                      </button>
                    </div>

                    {success && (
                      <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 font-semibold">
                        Demo Request submitted successfully! Our team will contact you soon.
                      </div>
                    )}

                    <p className="mt-3 text-center text-[10px] text-[#8896AC]">
                      By submitting, you agree to be contacted regarding your business inquiry.
                    </p>
                  </form>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
  );

  return (
    <>
      {/* ================= STICKY TAB ================= */}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-2 rounded-l-2xl border border-r-0 border-brand-btn-orange/30 bg-gradient-to-b from-brand-btn-orange to-brand-btn-orange-highlight px-3 py-5 text-white shadow-lg shadow-brand-btn-orange/25 transition-transform duration-300 hover:-translate-x-1 cursor-pointer sm:flex"
        aria-label="Book a demo"
      >
        <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] font-bold uppercase tracking-[0.18em]">
          Book a Demo
        </span>
      </button>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
