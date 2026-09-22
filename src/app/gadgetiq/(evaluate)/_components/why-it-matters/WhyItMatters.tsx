"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { XCircle, CheckCircle2, ArrowRight, X, Check } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";

const cardLeftVariants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const cardRightVariants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const,
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 14 }
  }
};

export default function WhyItMatters() {
  const comparisons = [
    { manual: "Manual checks", system: "Structured testing" },
    { manual: "Different testing methods", system: "Consistent process" },
    { manual: "Issues discovered later", system: "Issues identified earlier" },
    { manual: "Scattered results", system: "Clear test results" },
    { manual: "Limited proof of condition", system: "Digital assessment record" },
    { manual: "More uncertainty", system: "More confidence in buying / selling / repair" },
  ];

  return (
    <section id="why-it-matters" className="relative py-16 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-[#F4F6FB] overflow-hidden z-10">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-brand-accent-highlight/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="WHY IT MATTERS"
          title="Better testing changes what happens next."
          subtitle="Gadget Evaluate is not just about running tests. It helps teams make better decisions at important points in the device lifecycle."
        />

        {/* Comparison Grid */}
        <div className="mt-0 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative">

          {/* Pulsing Connector Arrow */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-14 h-14 rounded-full bg-white border border-brand-border shadow-xl z-20 hover:scale-110 transition-transform duration-300 cursor-pointer">
            <div className="absolute inset-0.5 rounded-full bg-brand-primary/5 animate-pulse" />
            <ArrowRight className="w-5 h-5 text-brand-primary relative z-10" />
          </div>

          {/* Left Column: Without clear assessment */}
          <TiltCard
            variants={cardLeftVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="rounded-[32px] border border-brand-border bg-white p-6 md:p-8 space-y-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between pb-4 border-b border-brand-border/40">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-sm shrink-0">
                  <XCircle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 uppercase tracking-wider font-display leading-tight">
                    Without clear assessment
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase mt-0.5">Uncertainty & manual bottlenecks</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {comparisons.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex items-center space-x-3 text-sm text-slate-600 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 transition-all duration-300 hover:bg-red-50/30 hover:border-red-100 hover:translate-x-[-2px]"
                >
                  <div className="w-5 h-5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="font-light text-slate-700">{item.manual}</span>
                </motion.div>
              ))}
            </div>
          </TiltCard>

          {/* Right Column: With Gadget Evaluate */}
          <TiltCard
            variants={cardRightVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="rounded-[32px] border border-brand-primary/20 bg-white p-6 md:p-8 space-y-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group border-l-brand-primary/40"
          >
            {/* Subtle Gradient Glow Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,204,0.04),transparent_50%)] pointer-events-none" />

            <div className="flex items-start justify-between pb-4 border-b border-brand-accent/15 relative z-10">
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 shadow-sm shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 uppercase tracking-wider font-display leading-tight">
                    With Gadget Evaluate
                  </h4>
                  <p className="text-[10px] text-brand-primary font-black tracking-wide uppercase mt-0.5">
                    Engineered confidence
                  </p>
                </div>
              </div>
              <div className="bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-sm border border-brand-primary/20 shrink-0 self-center">
                the standard
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              {comparisons.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex items-center space-x-3 text-sm text-slate-800 bg-brand-primary/5 p-3.5 rounded-2xl border border-brand-primary/10 transition-all duration-300 hover:bg-brand-primary/10 hover:border-brand-primary/25 hover:translate-x-2 shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 shadow-sm">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="font-semibold text-slate-800">{item.system}</span>
                </motion.div>
              ))}
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
