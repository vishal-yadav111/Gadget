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
            <h1 className="font-display text-[2.65rem] xs:text-[3rem] sm:text-[3.5rem] md:text-[3.25rem] lg:text-[3.75rem] xl:text-[4.5rem] 2xl:text-[5rem] font-extrabold tracking-tight text-brand-text-primary leading-[1.03] sm:leading-[1.04]">
              <span className="block whitespace-nowrap">Test your device</span>
              <span className="block whitespace-nowrap">before you</span>
              <span className="block whitespace-nowrap text-gradient-accent">trust it.</span>
            </h1>
          </motion.div>

          {/* 3. SUBHEADING / DESCRIPTION: Order 3 on mobile & tablet */}
          <motion.div variants={itemVariants} className="order-3 lg:order-none">
            <p className="text-sm xs:text-base sm:text-lg md:text-base lg:text-xl xl:text-2xl font-bold text-brand-accent-ink leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
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
                <span>Get a Free Trial</span>
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
