"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import LaptopMockup from "@/components/ui/LaptopMockup";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.2, 0.7, 0.3, 1] as const },
    },
  };

  return (
    <section className="relative min-h-0 flex flex-col justify-center pt-20 sm:pt-24 md:pt-20 lg:pt-40 xl:pt-44 2xl:pt-48 pb-8 sm:pb-10 md:pb-10 lg:pb-24 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 overflow-hidden z-10">
      {/* Decorative top lighting glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(0,82,204,0.08),transparent_70%)] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl 2xl:max-w-[1440px] mx-auto w-full flex flex-col gap-y-5 xs:gap-y-6 sm:gap-y-6 md:gap-y-5 lg:gap-y-0 lg:grid lg:grid-cols-12 lg:gap-x-10 xl:gap-x-14 lg:items-center"
      >
        {/* LEFT COLUMN WRAPPER: On mobile & tablet (< lg) this is 'contents' so children order freely (1, 3, 4); on desktop (lg+) this is a 6-col flex container */}
        <div className="contents lg:flex lg:flex-col lg:col-span-6 lg:space-y-6 lg:order-1 text-center lg:text-left z-10">
          {/* 1. HEADING: Order 1 on mobile & tablet */}
          <motion.div variants={itemVariants} className="order-1 lg:order-none">
            <div className="inline-flex rounded-full bg-[#E9F1FC] px-4 py-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0068E8]">
                Global Device Intelligence
              </span>
            </div>

            <h1 className="mt-4 text-[33.6px] font-bold leading-[0.98] tracking-[-0.045em] text-[#12264D] sm:text-[38.4px] lg:text-[43.2px] xl:text-[48px]">
              Check every part of a
              <br />
              laptop in{" "}
              <span className="whitespace-nowrap italic text-[#0868E9]">minutes.</span>
            </h1>
          </motion.div>

          {/* 3. SUBHEADING / DESCRIPTION: Order 3 on mobile & tablet */}
          <motion.div variants={itemVariants} className="order-3 lg:order-none">
            <p className="mt-5 max-w-[560px] text-[14px] leading-6 text-[#647391] lg:text-[15px]">
              Functional device diagnostics for smarter buy, sell, repair, and refurbishment decisions.
            </p>
          </motion.div>

          {/* 4. BUTTONS: Order 4 on mobile & tablet */}
          <motion.div variants={itemVariants} className="order-4 lg:order-none w-full lg:pt-2">
            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full">
              <MagneticButton
                href="#contact"
                className="px-5 py-3 sm:px-6 sm:py-3.5 md:px-6 md:py-3.5 lg:px-8 lg:py-4 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-white font-bold text-xs xs:text-sm sm:text-base md:text-base lg:text-base shadow-lg shadow-brand-btn-orange/25 hover:shadow-brand-btn-orange/55 active:scale-[0.97] flex items-center justify-center space-x-1.5 sm:space-x-2 border border-brand-btn-orange/30 group transition-all duration-200 btn-shimmer cursor-pointer"
              >
                <span>Book a Demo</span>
                <ArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                href="#how-it-works"
                className="px-5 py-3 sm:px-6 sm:py-3.5 md:px-6 md:py-3.5 lg:px-8 lg:py-4 rounded-full bg-white hover:bg-slate-100/80 active:bg-slate-100 text-brand-text-primary border border-brand-border hover:border-brand-border-hover font-semibold text-xs xs:text-sm sm:text-base md:text-base lg:text-base shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-center text-center cursor-pointer"
              >
                See How It Works ↓
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 2. LAPTOP MOCKUP (Order 2 on mobile & tablet, Col 7-12 on desktop) */}
        <motion.div
          variants={itemVariants}
          className="order-2 lg:order-2 lg:col-span-6 w-full flex items-center justify-center z-10"
        >
          <LaptopMockup />
        </motion.div>
      </motion.div>
    </section>
  );
}
