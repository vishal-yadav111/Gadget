"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import HealthGauge from "@/components/ui/HealthGauge";
import TiltCard from "@/components/ui/TiltCard";
import CountUp from "@/components/ui/CountUp";
import { Sparkles, Battery, Cpu, ShieldCheck, Smartphone } from "lucide-react";

export default function HealthScoreSection() {
  const indicators = [
    { label: "Battery Cells", score: 96, desc: "Nominal cell resistance", icon: Battery },
    { label: "Silicon Engine", score: 92, desc: "Optimized throttling index", icon: Cpu },
    { label: "Hardware Nodes", score: 98, desc: "All system buses nominal", icon: ShieldCheck },
    { label: "Display Response", score: 100, desc: "Pixel map completely verified", icon: Smartphone },
  ];

  return (
    <section className="relative py-24 px-6 md:px-12 bg-brand-bg-mid overflow-hidden z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,90,31,0.04),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <SectionHeading
          eyebrow="OBJECTIVE METRICS"
          title="A score is just the beginning."
          subtitle="Gadget Evaluate condenses hundreds of distinct diagnostic checks into a single cryptographic health score, contextualized by component metrics."
        />

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mt-8">
          {/* Left Floating Indicators (Desktop - col-span-4) */}
          <div className="lg:col-span-4 flex flex-col space-y-6 order-2 lg:order-1">
            {indicators.slice(0, 2).map((item, idx) => (
              <TiltCard
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                key={item.label}
                className="glass-panel p-5 rounded-2xl border border-brand-border bg-brand-bg-light/60 hover:border-brand-accent/20 transition-all duration-300 shadow-lg flex items-center space-x-4 group"
              >
                <div className="p-2.5 rounded-xl bg-brand-bg-light border border-white/10 text-brand-accent-ink">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                  <p className="text-xs text-brand-text-secondary mt-0.5 truncate">{item.desc}</p>
                </div>
                <span className="text-2xl font-black text-brand-text-primary font-mono shrink-0">
                  <CountUp to={item.score} suffix="%" />
                </span>
              </TiltCard>
            ))}
          </div>

          {/* Central Circular Score Wheel (col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2">
            <HealthGauge score={94} />
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-xs font-semibold text-brand-text-secondary tracking-widest uppercase flex items-center space-x-1.5 mt-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-accent-ink" />
              <span>Weighted Index</span>
            </motion.p>
          </div>

          {/* Right Floating Indicators (Desktop - col-span-4) */}
          <div className="lg:col-span-4 flex flex-col space-y-6 order-3">
            {indicators.slice(2, 4).map((item, idx) => (
              <TiltCard
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                key={item.label}
                className="glass-panel p-5 rounded-2xl border border-brand-border bg-brand-bg-light/60 hover:border-brand-accent/20 transition-all duration-300 shadow-lg flex items-center space-x-4 group"
              >
                <div className="p-2.5 rounded-xl bg-brand-bg-light border border-white/10 text-brand-accent-ink">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">
                    {item.label}
                  </span>
                  <p className="text-xs text-brand-text-secondary mt-0.5 truncate">{item.desc}</p>
                </div>
                <span className="text-2xl font-black text-brand-text-primary font-mono shrink-0">
                  <CountUp to={item.score} suffix="%" />
                </span>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

