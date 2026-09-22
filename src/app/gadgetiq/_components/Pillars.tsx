"use client";

import { motion } from "framer-motion";
import { Stethoscope, Eye, Gauge } from "lucide-react";
import DarkCard from "./DarkCard";
import SectionHeading from "./SectionHeading";
import PageShell from "./PageShell";
import { fadeUp, stagger } from "./animations";

const pillars = [
  {
    title: "Gadget Evaluate",
    icon: Stethoscope,
    image: "/images/quality-check1.png",
    chips: ["IMEI / SN", "Battery Health", "CPU / GPU"],
  },
  {
    title: "Gadget Lens",
    icon: Eye,
    image: "/images/grade4.png",
    chips: ["Vision AI", "Body Health", "Screen Health"],
  },
  {
    title: "Gadget ValueMax",
    icon: Gauge,
    image: "/images/pricing1.png",
    chips: ["Retail", "Wholesale", "Trade-in / BuyBack"],
  },
];

export default function Pillars() {
  return (
    <PageShell id="platform">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <SectionHeading
          eyebrow="The Platform"
          title="Three pillars."
          highlight="One connected workflow."
          text="Gadget Evaluate, Gadget Lens & Gadget ValueMax share one device record so your downstream decisions stay aligned."
        />
        <motion.div variants={stagger} className="mt-10 grid gap-6 lg:grid-cols-3">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} variants={fadeUp}>
                <DarkCard className="pillar-card group h-full p-6 transition duration-300 hover:-translate-y-1.5 hover:border-[#0052CC]/40 hover:shadow-xl bg-white border-[#DDE4F3]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052CC]/10 text-[#0052CC] border border-[#0052CC]/25 shadow-xs">
                      <Icon className="h-5 w-5 shrink-0" />
                    </div>
                    <h3 className="text-xl font-bold text-[#17284D] font-display">{item.title}</h3>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] p-3 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.chips.map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-[#DDE4F3] bg-[#F4F6FB] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4A5875] hover:border-[#0052CC]/30 hover:text-[#0052CC] transition-colors"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </DarkCard>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </PageShell>
  );
}
