"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Sparkles } from "lucide-react";

export default function DeviceLifecycle() {
  const steps = [
    { name: "BUY", desc: "Purchase asset", highlight: false },
    { name: "USE", desc: "Everyday operations", highlight: false },
    { name: "EVALUATE", desc: "Diagnostic intelligence", highlight: true },
    { name: "REPAIR / PROTECT", desc: "Extend lifespan", highlight: false },
    { name: "SELL / TRADE-IN", desc: "Secure residual value", highlight: false },
    { name: "REFURBISH", desc: "Standardized QA", highlight: false },
    { name: "REUSE", desc: "Enter new lifecycle", highlight: false },
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 bg-brand-bg-mid overflow-hidden z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="CIRCULAR ECONOMY"
          title="Built for the device lifecycle."
          subtitle="Transparent device diagnostics connect every phase of ownership, extending hardware lifespan and minimizing environmental waste."
        />

        {/* Horizontal Node Track */}
        <div className="relative mt-16 py-8 overflow-x-auto scrollbar-none flex justify-between min-w-[900px] lg:min-w-0 px-8">
          
          {/* Connector Line */}
          <div className="absolute top-1/2 left-12 right-12 h-[1px] bg-white/5 -translate-y-1/2 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
              className="h-full bg-gradient-to-r from-brand-accent/10 via-brand-accent to-brand-accent/10 origin-left"
            />
          </div>

          {/* Staggered Nodes */}
          {steps.map((step, idx) => {
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                key={step.name}
                className="relative flex flex-col items-center z-10 select-none w-32 text-center"
              >
                {/* Node circle badge */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 shadow-xl ${
                    step.highlight
                      ? "bg-brand-bg-deep border-brand-accent shadow-[0_0_15px_rgba(255,90,31,0.4)] scale-110"
                      : "bg-brand-bg-light border-white/10"
                  }`}
                >
                  {step.highlight ? (
                    <Sparkles className="w-5 h-5 text-brand-accent animate-pulse" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-brand-text-secondary">
                      0{idx + 1}
                    </span>
                  )}
                </div>

                {/* Node details */}
                <div className="mt-6 space-y-1">
                  <h4
                    className={`text-xs font-bold tracking-wider ${
                      step.highlight ? "text-brand-accent-highlight" : "text-brand-text-primary"
                    }`}
                  >
                    {step.name}
                  </h4>
                  <p className="text-[10px] text-brand-text-muted font-medium max-w-[100px] mx-auto leading-tight">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Circular Ecosystem Message */}
        <div className="mt-16 text-center max-w-2xl mx-auto">
          <p className="text-brand-text-secondary text-sm md:text-base font-light italic leading-relaxed">
            "Better information creates better decisions—and longer device lifecycles."
          </p>
          <p className="text-brand-[11px] text-brand-text-muted font-semibold uppercase tracking-widest mt-3">
            A Circular Economy Initiative by XtraCover
          </p>
        </div>
      </div>
    </section>
  );
}
