"use client";

import { motion } from "framer-motion";
import { Laptop, Smartphone, ArrowRight } from "lucide-react";
import DarkCard from "./DarkCard";
import { fadeRight, fadeUp, stagger } from "./animations";

const heroStats = [
  ["Devices Checked", "28,420"],
  ["Pass Yield", "91.4%"],
  ["Avg Grade", "A / B+"],
  ["Live Channels", "12"],
];

export default function Hero() {
  return (
    <section
      id="top"
      className="hero-texture relative z-10 overflow-hidden px-5 pb-20 pt-28 lg:px-8 lg:pb-28 lg:pt-36"
    >
      <div className="hero-noise pointer-events-none absolute inset-0" />
      <motion.div
        animate={{ x: ["-10%", "10%", "-10%"], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-16 left-1/4 h-80 w-80 rounded-full bg-[#0052CC]/12 blur-3xl"
      />
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.p
            variants={fadeUp}
            className="mb-3 text-xs uppercase tracking-[0.25em] text-[#0052CC] font-bold font-display"
          >
            global device intelligence
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="max-w-3xl text-[38px] font-bold leading-[1.08] tracking-tight text-[#17284D] sm:text-[54px] lg:text-[66px] font-display"
          >
            Test your device before you
            <span className="font-bold italic text-[#0052CC]">
              {" "}
              Trust It.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-sm leading-7 text-[#4A5875] sm:text-base font-normal font-sans"
          >
            Functional device diagnostics for smarter buy, sell, repair, and refurbishment decisions.
            <br />
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-4 items-center"
          >
            {/* Orange CTA Button */}
            <a
              href="#contact"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-brand-btn-orange/25 hover:shadow-brand-btn-orange/45 flex items-center space-x-2 border border-brand-btn-orange/30 group transition-all duration-300 btn-shimmer cursor-pointer"
            >
              <span>Book a Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#workflow"
              className="rounded-full border border-[#DDE4F3] bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#17284D] hover:text-[#0052CC] hover:border-[#0052CC]/40 transition shadow-xs"
            >
              see how it flows
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeRight}
          className="relative mx-auto w-full max-w-[560px]"
        >
          <div className="absolute -left-8 top-8 h-44 w-44 rounded-full bg-[#0052CC]/10 blur-3xl" />
          <div className="absolute -right-4 bottom-4 h-40 w-40 rounded-full bg-[#0052CC]/10 blur-3xl" />

          <DarkCard className="glow-border relative overflow-hidden p-6 shadow-2xl border-[#DDE4F3] bg-white">
            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-[22px] border border-[#0052CC]/25 bg-gradient-to-b from-[#0052CC]/5 to-white p-5 shadow-xs">
                {/* Animated diagnostic scan */}
                <motion.div
                  animate={{ y: ["-20%", "520%"] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="pointer-events-none absolute left-0 right-0 top-0 h-16 bg-gradient-to-b from-[#0052CC]/15 to-transparent"
                />

                {/* Laptop visual */}
                <div className="relative flex flex-1 items-center justify-center">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 rounded-full bg-[#0052CC]/10 blur-2xl" />

                    <Laptop
                      size={112}
                      className="relative text-[#0052CC]"
                      strokeWidth={1.25}
                    />

                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -right-2 top-1 h-3 w-3 rounded-full bg-[#0052CC]"
                    />
                  </motion.div>
                </div>

                {/* Laptop details */}
                <div className="relative">
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0052CC] font-display">
                      device diagnostics
                    </p>

                    <p className="mt-1 text-lg font-bold text-[#17284D] font-display">
                      Laptop flow
                    </p>

                    <p className="mt-1 text-xs font-medium leading-5 text-[#4A5875]">
                      Windows • Mac OS
                    </p>
                  </div>

                  {/* Diagnostic indicators */}
                  <div className="space-y-2">
                    {[
                      ["Hardware", "Checked"],
                      ["Battery", "Healthy"],
                      ["System", "Ready"],
                    ].map(([label, status]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between rounded-xl border border-[#DDE4F3] bg-white/90 px-3 py-2"
                      >
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5F6A86]">
                          {label}
                        </span>

                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#0052CC]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#0052CC]" />
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-[#DDE4F3] bg-[#F4F6FB] p-5 shadow-inner">
                <div className="flex items-center justify-between border-b border-[#DDE4F3] pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[#0052CC] font-bold font-display">
                      device record
                    </p>
                    <p className="mt-1 text-base font-bold text-[#17284D] font-display">
                      Live snapshot
                    </p>
                  </div>
                  <span className="rounded-full bg-[#0052CC]/10 text-[#0052CC] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-bold border border-[#0052CC]/25">
                    synced
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {heroStats.map(([label, value]) => (
                    <div
                      key={label}
                      className={`hero-stat-card relative overflow-hidden rounded-xl border border-[#DDE4F3] bg-white p-3 shadow-xs ${
                        label === "Devices Checked" ? "is-live" : ""
                      }`}
                    >
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#5F6A86] font-semibold">
                        {label}
                      </p>
                      {label === "Devices Checked" ? (
                        <motion.p
                          animate={{
                            scale: [1, 1.03, 1],
                          }}
                          transition={{
                            duration: 2.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="mt-1.5 text-base font-bold text-[#0052CC] font-display"
                        >
                          {value}
                        </motion.p>
                      ) : (
                        <p className="mt-1.5 text-base font-bold text-[#17284D] font-display">
                          {value}
                        </p>
                      )}
                      {label === "Devices Checked" && (
                        <motion.div
                          animate={{ x: ["-120%", "120%"] }}
                          transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute bottom-0 left-0 h-0.5 w-2/3 bg-[#0052CC]"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#5F6A86] font-semibold">
                    <span>workflow completion</span>
                    <span className="font-bold text-[#17284D]">84%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#DDE4F3] overflow-hidden">
                    <motion.div
                      initial={{ width: "10%" }}
                      animate={{ width: ["15%", "84%", "62%", "84%"] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="h-full rounded-full bg-[#0052CC]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </DarkCard>
        </motion.div>
      </div>
    </section>
  );
}
