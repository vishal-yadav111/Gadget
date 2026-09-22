"use client";

import { motion } from "framer-motion";
import { Globe, Store, Wrench, Recycle, ChevronRight, ChevronLeft } from "lucide-react";
import SectionHeading from "./SectionHeading";
import PageShell from "./PageShell";
import { fadeUp, stagger } from "./animations";

const mainSteps = [
  {
    title: "Gadget Evaluate",
    text: "67-point automated and assisted testing",
    duration: "~ 5 mins",
  },
  {
    title: "Gadget Lens",
    text: "AI-powered image-based condition assessment",
    duration: "~ 2 mins",
  },
  {
    title: "Gadget ValueMax",
    text: "Global Marketplaces insights and recovery options",
    duration: "~ 1-2 mins",
  },
];

const channels = [
  { id: "marketplaces", title: "Global Marketplaces", icon: Globe },
  { id: "resale", title: "Resale & Retail Channels", icon: Store },
  { id: "repair", title: "Repair & Refurbish", icon: Wrench },
  { id: "recycle", title: "Recycle / Responsible Disposition", icon: Recycle },
];

export default function WorkflowRow() {
  return (
    <PageShell id="workflow" className="bg-[#F4F6FB]/80">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <SectionHeading
          eyebrow="Connected Records"
          title="Every device that flows through your operation."
          highlight="One workflow."
          text="No handoff gap between test, grade, price and routing. Everything writes to the same record."
        />

        {/* Desktop Workflow Container */}
        <div className="hidden lg:grid grid-cols-4 gap-8 items-center mt-16 pb-12">
          {/* Main 3 Blocks Layout */}
          <div className="relative grid grid-cols-3 gap-8 xl:gap-12 lg:col-span-3">
            {mainSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                whileHover={{
                  y: -6,
                  boxShadow: "0 20px 30px -8px rgba(0, 82, 204, 0.25)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative flex flex-col justify-between rounded-2xl bg-[#0052CC] p-6 text-center min-h-[220px] shadow-xl border border-[#0052CC]/20"
              >
                <div>
                  <p className="text-xl font-bold tracking-tight mb-3 text-white font-display">
                    {step.title}
                  </p>
                  <p className="text-sm text-white/85 font-normal leading-relaxed px-2 font-sans">
                    {step.text}
                  </p>
                </div>

                <div className="mt-6">
                  <span className="inline-block rounded-full bg-white px-6 py-1.5 text-xs font-bold text-[#0052CC] shadow-sm uppercase tracking-wider">
                    {step.duration}
                  </span>
                </div>

                {/* Connector Arrow for Desktop between main blocks */}
                {index < 2 && (
                  <div className="absolute top-1/2 left-full w-8 xl:w-12 h-6 -translate-y-1/2 z-10 flex items-center justify-center pointer-events-none">
                    <div className="absolute left-0 right-0 h-0.5 border-t-2 border-dashed border-[#0052CC]/50" />
                    <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#0052CC]/30 bg-white text-[#0052CC] shadow-md">
                      <ChevronRight size={14} strokeWidth={3} />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Data & Insights Feedback Loop */}
            <div className="absolute -bottom-12 left-[16.67%] right-[16.67%] h-10 border-b-2 border-x-2 border-dashed border-[#0052CC]/40 rounded-b-2xl">
              <div className="absolute -top-2.5 -left-[7px] w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#0052CC]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white px-4 py-0.5 text-xs font-bold uppercase tracking-wider text-[#0052CC] rounded-full border border-[#0052CC]/30 shadow-xs font-display">
                Data & Insights Loop
              </div>
            </div>
          </div>

          {/* Right Column Branching Channels */}
          <motion.div
            variants={stagger}
            className="flex flex-col gap-3 lg:col-span-1 relative pl-0 ml-3"
          >
            {/* SVG Connecting Branch Line */}
            <div className="absolute left-[-48px] top-0 bottom-0 w-12 block pointer-events-none overflow-visible">
              <svg
                className="w-full h-full stroke-[#0052CC]/50 fill-none"
                viewBox="0 0 48 100"
                preserveAspectRatio="none"
              >
                <path d="M 0 50 L 16 50" strokeWidth="2" />
                <path d="M 16 12.5 L 16 87.5" strokeWidth="2" />
                <path d="M 16 12.5 L 48 12.5" strokeWidth="2" />
                <path d="M 16 37.5 L 48 37.5" strokeWidth="2" />
                <path d="M 16 62.5 L 48 62.5" strokeWidth="2" />
                <path d="M 16 87.5 L 48 87.5" strokeWidth="2" />
                <path d="M 44 10 L 48 12.5 L 44 15 Z" className="fill-[#0052CC] stroke-none" />
                <path d="M 44 35 L 48 37.5 L 44 40 Z" className="fill-[#0052CC] stroke-none" />
                <path d="M 44 60 L 48 62.5 L 44 65 Z" className="fill-[#0052CC] stroke-none" />
                <path d="M 44 85 L 48 87.5 L 44 90 Z" className="fill-[#0052CC] stroke-none" />
              </svg>
            </div>

            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.id}
                  className="flex items-center gap-3.5 rounded-2xl border border-[#DDE4F3] bg-white p-4 text-[#17284D] shadow-xs transition-transform hover:scale-[1.02] hover:shadow-md hover:border-[#0052CC]/30 min-h-[64px]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0052CC]/10 text-[#0052CC] border border-[#0052CC]/20 shadow-xs">
                    <Icon size={18} />
                  </div>
                  <span className="text-xs xl:text-sm font-bold tracking-tight text-[#17284D] leading-snug font-display">
                    {channel.title}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile/Tablet view workflow */}
        <div className="block lg:hidden relative mt-16 px-4 max-w-md mx-auto">
          <div className="flex flex-col items-center">
            {mainSteps.map((step, index) => (
              <div key={step.title} className="w-full flex flex-col items-center">
                <div className="w-full rounded-2xl bg-[#0052CC] p-5 text-center shadow-md border border-[#0052CC]/20 relative">
                  <p className="text-lg font-bold tracking-tight mb-2 text-white font-display">
                    {step.title}
                  </p>
                  <p className="text-xs text-white/85 font-normal leading-relaxed mb-4">
                    {step.text}
                  </p>
                  <div>
                    <span className="inline-block rounded-full bg-white px-5 py-1 text-xs font-bold text-[#0052CC] shadow-xs">
                      {step.duration}
                    </span>
                  </div>
                </div>

                {index < 2 && (
                  <div className="my-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#0052CC]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 20l-8-8h6V4h4v8h6z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-8 relative">
            <div className="absolute left-1/2 top-[-24px] bottom-[28px] w-[2px] bg-[#0052CC]/30 -translate-x-1/2 pointer-events-none" />

            {channels.map((channel, idx) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.id}
                  className="relative flex items-center gap-2 rounded-2xl border border-[#DDE4F3] bg-white p-3 text-[#17284D] shadow-xs min-h-[60px]"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0052CC]/10 text-[#0052CC] border border-[#0052CC]/20">
                    <Icon size={14} />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight text-[#17284D] leading-snug">
                    {channel.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </PageShell>
  );
}
