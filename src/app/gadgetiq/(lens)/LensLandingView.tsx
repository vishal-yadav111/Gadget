"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import StickyQuoteForm from "../_components/StickyQuoteForm";
import BookDemo from "../_components/BookDemo";
import LensFlowDiagram from "../_components/LensFlowDiagram";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Eye,
  FileCheck,
  Shield,
  Clock,
  TrendingUp,
  ChevronDown,
  ScanSearch,
  Image as ImageIcon,
  ShieldCheck,
  Info,
} from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Upload Photos",
    desc: "Capture images of your device from different angles",
    image: "/images/upload-photos.jpg",
  },
  {
    step: 2,
    title: "AI Analysis",
    desc: "Our AI inspects and detects visible cosmetic issues",
    image: "/images/ai-analysis.jpg",
  },
  {
    step: 3,
    title: "Get Grade",
    desc: "Receive a clear device grade (A+ to H)",
    image: "/images/get-grade.jpg",
  },
  {
    step: 4,
    title: "View Report",
    desc: "Access a detailed report with images and issue highlights",
    image: "/images/view-report.jpg",
  },
];

const PROOF_FEATURES = [
  {
    title: "AI-powered detection",
    desc: "Automatically identifies scratches, dents, scuffs and visible wear.",
    icon: ScanSearch,
  },
  {
    title: "Image evidence",
    desc: "View highlighted areas with close-up images for transparency.",
    icon: ImageIcon,
  },
  {
    title: "Consistent grading",
    desc: "Standardised grades based on visible condition.",
    icon: ShieldCheck,
  },
];

const BUSINESS_BENEFITS = [
  { title: "Build Trust", desc: "Give buyers clearer device condition information.", icon: Shield },
  { title: "Improve Valuation", desc: "Make informed resale decisions.", icon: TrendingUp },
  { title: "Save Time", desc: "Reduce repetitive manual inspection.", icon: Clock },
  { title: "Reduce Disputes", desc: "Share clear condition reports.", icon: FileCheck },
];

const FAQ_ITEMS = [
  {
    question: "How can I book a demo?",
    answer: "Click \"Book a Demo\" and our team will help you get started, with no commitment required.",
  },
  {
    question: "Does Lens check functional issues?",
    answer:
      "No. Gadget Lens focuses on cosmetic condition, including scratches, dents, and wear. Functional testing is handled separately by Gadget Evaluate.",
  },
  {
    question: "Can I download and share reports?",
    answer:
      "Yes. Every inspection generates a report you can download and share with buyers, sellers, or your team.",
  },
  {
    question: "What does the confidence score mean?",
    answer: "It reflects how certain the AI is about its cosmetic assessment for a given photo set.",
  },
  {
    question: "How does laptop grading work?",
    answer:
      "Upload photos from 6 angles, and our AI analyses them to detect visible issues and assign a cosmetic grade.",
  },
  {
    question: "Which devices does Lens support?",
    answer: "Gadget Lens currently supports laptop grading.",
  },
  {
    question: "What is a license?",
    answer:
      "A license lets you run one device through Gadget Lens's cosmetic grading. Your plan includes a set number of licenses, and each completed inspection uses one.",
  },
  {
    question: "Do licenses expire?",
    answer:
      "Yes. Licenses are valid for a set period from the date they're issued. You can check your renewal date and remaining balance from your account dashboard.",
  },
  {
    question: "Can one license be used for Evaluate and Lens?",
    answer:
      "No. Gadget Evaluate and Gadget Lens draw from separate license pools, since they run different assessments: functional testing versus cosmetic grading.",
  },
  {
    question: "How do I top up my wallet?",
    answer:
      "Reach out to your account manager or our support team to add funds or purchase more licenses. We'll confirm once your balance is updated.",
  },
];

const FAQ_HALF = Math.ceil(FAQ_ITEMS.length / 2);

export default function GadgetIQLensPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="relative min-h-screen bg-[#F4F6FB] text-[#17284D] overflow-hidden selection:bg-blue-600/20 selection:text-[#17284D] font-sans">
      <StickyQuoteForm />

      {/* Background ambient mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,82,204,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.06),transparent_35%),radial-gradient(circle_at_50%_75%,rgba(0,82,204,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,82,204,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,82,204,0.025)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
      </div>

      {/* Header */}
      <Navbar />

      <main className="relative z-10 pt-28 flex flex-col items-center">
        {/* Top Hero Section */}
        <section className="flex w-full max-w-7xl min-h-[calc(100svh-112px)] items-center px-4 pt-2 pb-6 sm:px-6 sm:pt-4 sm:pb-10 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-[40%_60%] gap-8 lg:gap-12 items-center w-full">
            {/* Left Column: Hero Text */}
            <div className="space-y-6">
              <div className="inline-flex rounded-full bg-[#E9F1FC] px-4 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0068E8]">
                  Global Device Intelligence
                </span>
              </div>

              <h1 className="mt-4 text-left text-[33.6px] font-bold leading-[0.98] tracking-[-0.045em] text-[#12264D] sm:text-[38.4px] lg:text-[43.2px] xl:text-[48px]">
                AI-Powered Laptop
                <br />
                <span className="whitespace-nowrap italic text-[#0868E9]">Grading Made Simple.</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[#5F6A86] leading-relaxed max-w-2xl">
                Upload 6 photos. Get a cosmetic grade, confidence score and detailed report.
                Make faster, more consistent decisions.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="#contact"
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight hover:shadow-brand-btn-orange/45 text-white font-bold text-sm shadow-lg shadow-brand-btn-orange/25 flex items-center space-x-2 transition-all group btn-shimmer"
                >
                  <span>Book a Demo</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="#how-it-works"
                  className="px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-[#17284D] border border-[#DDE4F3] font-bold text-sm shadow-xs flex items-center space-x-2 transition-all hover:border-blue-300"
                >
                  <span>See How It Works ↓</span>
                </a>
              </div>

              {/* Proof Strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 border-t border-[#DDE4F3] text-xs sm:text-sm font-semibold text-[#5F6A86]">
                <span>Capture 6 Angles</span>
                <span className="text-[#B8C2D9]">•</span>
                <span>AI Issue Detection</span>
                <span className="text-[#B8C2D9]">•</span>
                <span>Final Grade Report</span>
              </div>
            </div>

            {/* Right Column: Sample Laptop Grading Visual */}
            <div>
              <LensFlowDiagram />
            </div>
          </div>
        </section>

        {/* Proof & Credibility Section */}
        <div className="w-full bg-white">
          <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
              {/* Left: copy + features */}
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#0052CC]/10 px-4 py-1.5">
                  <Eye className="h-3.5 w-3.5 text-[#0052CC]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0052CC]">
                    Gadget Lens
                  </span>
                </div>

                <h2 className="mt-4 text-[15px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[21px] lg:text-[25px] font-display">
                  Grading you can{" "}
                  <span className="font-bold italic text-[#0052CC]">
                    trust.
                  </span>
                </h2>

                <p className="mt-2 text-sm font-semibold text-[#5F6A86] sm:text-base">
                  Show real evidence.
                </p>

                <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5F6A86]">
                  Our AI identifies visible scratches, dents and other cosmetic issues and
                  provides a clear grade with image evidence.
                </p>

                <div className="mt-8 space-y-4 sm:space-y-6">
                  {PROOF_FEATURES.map((feature) => (
                    <div key={feature.title} className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 sm:h-11 sm:w-11">
                        <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#17284D]">{feature.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-[#5F6A86] sm:text-sm">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: annotated laptop + grade card + thumbnails */}
              <div className="w-full">
                <div className="relative aspect-[550/370] w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/images/hp-laptop.jpg"
                    alt="Laptop with AI-annotated scratch, dent, crack, and scuff defects"
                    fill
                    sizes="(min-width: 1024px) 500px, 90vw"
                    className="rounded-2xl object-contain"
                  />

                  {/* Desktop/tablet: grade card floats over the image */}
                  <div className="absolute right-2 top-2 hidden w-[200px] rounded-2xl border border-[#DDE4F3] bg-white p-4 shadow-xl sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F6A86]">
                      Cosmetic Grade
                    </p>
                    <p className="mt-1 text-3xl font-extrabold leading-none text-red-600">E</p>
                    <p className="mt-1 text-sm font-bold leading-tight text-[#17284D]">Poor Condition</p>
                    <p className="text-xs leading-tight text-[#5F6A86]">Visible crack damage</p>

                    <div className="mt-3 border-t border-[#DDE4F3] pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F6A86]">
                        Confidence Score
                      </p>
                      <p className="mt-1 text-xl font-extrabold leading-none text-red-600">91%</p>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E4EAF5]">
                        <motion.div
                          className="h-full rounded-full bg-red-500"
                          initial={{ width: 0 }}
                          whileInView={{ width: "91%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile: grade card sits below the image instead of overlaying it */}
                <div className="mt-3 w-full rounded-xl border border-[#DDE4F3] bg-white p-3 shadow-lg sm:hidden">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#5F6A86]">
                    Cosmetic Grade
                  </p>
                  <p className="mt-1 text-2xl font-extrabold leading-none text-red-600">E</p>
                  <p className="mt-1 text-xs font-bold leading-tight text-[#17284D]">Poor Condition</p>
                  <p className="text-[10px] leading-tight text-[#5F6A86]">Visible crack damage</p>

                  <div className="mt-2 border-t border-[#DDE4F3] pt-2">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#5F6A86]">
                      Confidence Score
                    </p>
                    <p className="mt-1 text-lg font-extrabold leading-none text-red-600">91%</p>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#E4EAF5]">
                      <motion.div
                        className="h-full rounded-full bg-red-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: "91%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-xl bg-[#F4F6FB] px-4 py-3 text-xs sm:flex-row sm:items-center sm:text-sm">
                  <div className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#5F6A86]" />
                    <span className="text-[#5F6A86] sm:whitespace-nowrap">
                      Grading is based on visible external condition only.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Business Benefits Section */}
        <div
          className="w-full"
          style={{
            backgroundImage: "url('/images/blue-bg-img.png')",
            backgroundSize: "cover",
            backgroundPosition: "left center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          }}
        >
          <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-6 lg:px-8">
            <div className="max-w-sm shrink-0 text-left lg:pl-[2%]">
              <h2 className="text-[15px] font-bold leading-tight tracking-tight text-white sm:text-[21px] lg:text-[25px] font-display">
                Better grading.{" "}
                <span className="font-bold italic text-white">Better decisions.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
              {BUSINESS_BENEFITS.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col items-center gap-3 text-center lg:px-6 lg:first:pl-0 lg:last:pr-0"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-indigo-400 text-indigo-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="w-full bg-white">
          <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-[15px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[21px] lg:text-[25px] font-display">
                From photos to{" "}
                <span className="font-bold italic text-[#0052CC]">
                  a clear grade.
                </span>
              </h2>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8"
            >
              {HOW_IT_WORKS.map((item, idx) => (
                <motion.div
                  key={item.step}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  whileHover={{ y: -4 }}
                  className="relative"
                >
                  <div className="relative h-full rounded-2xl border border-[#DDE4F3] bg-white p-7 shadow-xs transition-shadow duration-300 hover:shadow-lg">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: 0.12 * idx + 0.2, ease: "backOut" }}
                      className="absolute -top-3 -left-1 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-md"
                    >
                      {item.step}
                    </motion.div>
                    <div className="relative mt-2 aspect-[660/500] w-full overflow-hidden rounded-xl bg-indigo-50">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 90vw"
                        className="object-contain"
                      />
                    </div>
                    <h3 className="mt-5 text-sm font-bold text-[#17284D]">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#5F6A86]">{item.desc}</p>
                  </div>

                  {idx < HOW_IT_WORKS.length - 1 && (
                    <div className="absolute top-1/2 left-full z-10 hidden w-8 -translate-y-1/2 items-center lg:flex">
                      <div className="h-px flex-1 bg-[#DDE4F3]" />
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#DDE4F3] bg-white text-indigo-500 shadow-xs">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </section>
        </div>

        {/* FAQ Section */}
        <div id="faqs" className="w-full bg-[#F4F6FB]">
          <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div>
              <h2 className="text-left text-[15px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[21px] lg:text-[25px] font-display">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#5F6A86] sm:text-base">
                Short answers to common questions about grading, reports and getting started.
              </p>
            </div>

            <div>
              <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
              {[FAQ_ITEMS.slice(0, FAQ_HALF), FAQ_ITEMS.slice(FAQ_HALF)].map((column, colIndex) => (
              <div key={colIndex} className="rounded-2xl border border-[#DDE4F3] bg-white p-3 shadow-md">
              {column.map((item, i) => {
                const idx = colIndex === 0 ? i : FAQ_HALF + i;
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={item.question} className="border-b border-[#DDE4F3]/60 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:text-[#0052CC]"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`font-display text-sm font-bold transition-colors ${
                          isOpen ? "text-[#0052CC]" : "text-[#17284D]"
                        }`}
                      >
                        {item.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-[#0052CC]" : "text-slate-400"
                        }`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm font-normal leading-relaxed text-[#4A5875]">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              </div>
              ))}
              </div>
            </div>
          </section>
        </div>

        {/* Book a Demo Form */}
        <BookDemo />
      </main>

      {/* Footer */}
      <Footer />
      <ScrollToTop />
    </div>
  );
}
