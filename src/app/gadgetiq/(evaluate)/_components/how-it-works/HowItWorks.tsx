"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Play, Cpu, Award, ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function HowItWorks() {
  const steps = [
    {
      title: "Start",
      desc: "Open Gadget Evaluate and begin the assessment.",
      icon: Play,
    },
    {
      title: "Test",
      desc: "Run the relevant functional checks.",
      icon: Cpu,
    },
    {
      title: "Report",
      desc: "Get the results as a certified digital report.",
      icon: Award,
    },
  ];

  return (
    <section id="how-it-works" className="relative py-16 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-brand-bg-deep overflow-hidden z-10">
      {/* Background glow overlay */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-accent-highlight/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="From device to clear result."
          subtitle="A simple journey showing how Gadget Evaluate assessments go from intake to final certification."
        />

        {/* Desktop Horizontal Timeline (Hidden on Mobile) */}
        <div className="hidden lg:grid grid-cols-3 gap-8 relative mt-10 w-full">
          {/* Continuous Full-Width Connecting Line passing directly behind the center of the icons */}
          <div className="absolute top-10 -left-[50vw] -right-[50vw] h-[2px] bg-slate-300 z-0 -translate-y-1/2 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-transparent via-brand-accent to-transparent w-full"
            />
          </div>

          {steps.map((step, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ scale: 1.04 }}
              key={step.title}
              className="relative flex flex-col items-center text-center px-4 group z-10 cursor-pointer"
            >
              {/* Outer icon badge sitting directly over the continuous line */}
              <div className="w-20 h-20 rounded-full bg-white border-2 border-brand-border group-hover:border-brand-accent flex items-center justify-center relative z-10 transition-all duration-300 shadow-sm group-hover:shadow-md">
                <div className="absolute inset-1.5 rounded-full bg-brand-accent/0 group-hover:bg-brand-accent/5 transition-all duration-300" />
                <step.icon className="w-8 h-8 text-brand-text-secondary group-hover:text-brand-accent transition-all duration-300 group-hover:scale-110" />
              </div>

              <div className="mt-6 space-y-2">
                <h4 className="text-lg font-bold text-brand-text-primary group-hover:text-brand-accent transition-colors font-display">
                  {step.title}
                </h4>
                <p className="text-brand-text-secondary text-sm font-light leading-relaxed max-w-[220px]">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Vertical Journey (Hidden on Desktop) */}
        <div className="lg:hidden mt-8 space-y-10 relative pl-8 w-full">
          {/* Vertical Vector Timeline Line */}
          <div className="absolute top-4 bottom-4 left-3.5 w-[2px] bg-slate-300">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="w-full bg-gradient-to-b from-brand-accent/40 via-brand-accent to-brand-accent/40"
            />
          </div>

          {steps.map((step, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              key={step.title}
              className="relative flex items-start space-x-4"
            >
              {/* Step indicator circle directly on the vertical line */}
              <div className="absolute -left-[27px] w-5 h-5 rounded-full bg-white border-2 border-brand-accent/60 flex items-center justify-center z-10 shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-accent/80" />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-bold text-brand-text-primary font-display">
                  {step.title}
                </h4>
                <p className="text-brand-text-secondary text-xs sm:text-sm font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 relative z-10"
        >
          <MagneticButton
            href="#contact"
            className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-white font-bold text-base shadow-xl shadow-brand-btn-orange/25 hover:shadow-brand-btn-orange/55 flex items-center justify-center space-x-2 border border-brand-btn-orange/30 group transition-all duration-300"
          >
            <span>Book a Demo</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
