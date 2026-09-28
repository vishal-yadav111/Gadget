"use client";

import { motion } from "framer-motion";
import SectionHeading from "../../../_components/SectionHeading";
import { ArrowRight, Server, Smartphone, Laptop, Monitor, Database, Sliders, Search, Award, Cpu } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function BusinessSolutions() {
  const points = [
    {
      title: "Standardized Operations",
      desc: "Unified testing workflows across all refurbishment yards, retail desks, and fleet returns for absolute consistency.",
      icon: Sliders
    },
    {
      title: "Early Defect Detection",
      desc: "Identify critical hardware and component defects early, drastically reducing No-Fault-Found (NFF) returns.",
      icon: Search
    },
    {
      title: "Certified Device Records",
      desc: "Every completed diagnostic generates a digital assessment record, boosting transaction trust and confidence.",
      icon: Award
    },
    {
      title: "Enterprise-Grade Solution",
      desc: "Built to support high-volume, automated testing runs across multiple team locations with 99%+ accuracy.",
      icon: Cpu
    },
  ];

  return (
    <section id="solutions" className="relative py-16 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-brand-bg-light overflow-hidden z-10">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left Column: Business Copy & Grid of 4 points */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
          <SectionHeading
            eyebrow="WHY CHOOSE US"
            title="Faster, clearer, consistent device assessment"
            align="left"
          />

          {/* 4 Benefit Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {points.map((pt) => {
              const Icon = pt.icon;
              return (
                <div
                  key={pt.title}
                  className="flex items-start space-x-4 p-5 rounded-2xl border border-brand-border bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors duration-200 font-display leading-tight">
                      {pt.title}
                    </h4>
                    <p className="text-brand-text-secondary text-[11px] font-light leading-relaxed mt-1">
                      {pt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>


        </div>

        {/* Right Column: Animated Network Grid (Bigger & Cleaner) */}
        <div className="lg:col-span-5 flex justify-center items-center h-[420px] md:h-[480px] relative">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {/* Animated SVG Network Diagram */}
            <svg className="w-full h-full text-brand-primary/10 absolute inset-0 pointer-events-none" viewBox="0 0 400 400">
              {/* Connection Lines from satellites to central server */}
              <line x1="100" y1="100" x2="200" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
              <line x1="300" y1="100" x2="200" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
              <line x1="100" y1="300" x2="200" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />
              <line x1="300" y1="300" x2="200" y2="200" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5" />

              {/* Pulsing signal dots on connection lines */}
              <motion.circle
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                r="3.5"
                fill="#0052CC"
                style={{ offsetPath: "path('M 100 100 L 200 200')" }}
              />
              <motion.circle
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                r="3.5"
                fill="#6FA6FF"
                style={{ offsetPath: "path('M 300 100 L 200 200')" }}
              />
              <motion.circle
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                r="3.5"
                fill="#0052CC"
                style={{ offsetPath: "path('M 100 300 L 200 200')" }}
              />
              <motion.circle
                initial={{ offsetDistance: "0%" }}
                animate={{ offsetDistance: "100%" }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                r="3.5"
                fill="#6FA6FF"
                style={{ offsetPath: "path('M 300 300 L 200 200')" }}
              />
            </svg>

            {/* Central Node - Server Core (Bigger) */}
            <motion.div
              animate={{
                scale: [1, 1.04, 1],
                boxShadow: ["0 0 20px rgba(0,82,204,0.15)", "0 0 35px rgba(0,82,204,0.3)", "0 0 20px rgba(0,82,204,0.15)"],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-28 h-28 rounded-full border border-brand-primary bg-white flex flex-col items-center justify-center z-20 shadow-2xl"
            >
              <Database className="w-9 h-9 text-brand-primary" />
              <span className="text-[10px] font-bold tracking-widest text-brand-text-primary uppercase mt-1.5 font-display">
                GADGET IQ
              </span>
            </motion.div>

            {/* Satellite Nodes (Devices - Bigger & Positioned Responsively) */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-brand-border bg-white flex items-center justify-center shadow-lg hover:border-brand-primary hover:scale-110 transition-all duration-300 cursor-pointer group">
                <Smartphone className="w-6 h-6 text-brand-text-secondary group-hover:text-brand-primary transition-colors" />
              </div>
              <span className="text-[9px] font-bold text-brand-text-secondary mt-1.5 uppercase tracking-wider">Refurb Yard</span>
            </div>

            <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-brand-border bg-white flex items-center justify-center shadow-lg hover:border-brand-primary hover:scale-110 transition-all duration-300 cursor-pointer group">
                <Laptop className="w-6 h-6 text-brand-text-secondary group-hover:text-brand-primary transition-colors" />
              </div>
              <span className="text-[9px] font-bold text-brand-text-secondary mt-1.5 uppercase tracking-wider">Retail Desk</span>
            </div>

            <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-brand-border bg-white flex items-center justify-center shadow-lg hover:border-brand-primary hover:scale-110 transition-all duration-300 cursor-pointer group">
                <Monitor className="w-6 h-6 text-brand-text-secondary group-hover:text-brand-primary transition-colors" />
              </div>
              <span className="text-[9px] font-bold text-brand-text-secondary mt-1.5 uppercase tracking-wider">Return Hub</span>
            </div>

            <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-brand-border bg-white flex items-center justify-center shadow-lg hover:border-brand-primary hover:scale-110 transition-all duration-300 cursor-pointer group">
                <Server className="w-6 h-6 text-brand-text-secondary group-hover:text-brand-primary transition-colors" />
              </div>
              <span className="text-[9px] font-bold text-brand-text-secondary mt-1.5 uppercase tracking-wider">IT Fleet</span>
            </div>
          </div>
        </div>
      </div>
    </section >
  );
}
