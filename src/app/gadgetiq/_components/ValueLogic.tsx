"use client";

import { motion } from "framer-motion";
import DarkCard from "./DarkCard";
import SectionHeading from "./SectionHeading";
import PageShell from "./PageShell";
import { fadeUp, stagger } from "./animations";

export default function ValueLogic() {
  return (
    <PageShell className="bg-[#F4F6FB]/80">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <SectionHeading
          eyebrow="Pricing Intelligence"
          title="Different plays, same source of truth."
          highlight="fixed value."
          text="Use one device record to produce values for multiple commercial contexts without rewriting the condition story."
        />
        <motion.div variants={stagger} className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Retail Value", "$297"],
            ["Trade-In BuyBack Value", "$263"],
            ["Wholesale Value", "$231"],
          ].map(([title, value], idx) => (
            <motion.div key={title} variants={fadeUp}>
              <DarkCard
                className={`value-card relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 bg-white border-[#DDE4F3] shadow-md ${
                  idx === 0 ? "border-[#0052CC]/40 ring-1 ring-[#0052CC]/25 shadow-lg shadow-[#0052CC]/10" : ""
                }`}
              >
                <motion.div
                  initial={{ x: "-120%" }}
                  animate={{ x: "120%" }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: idx * 0.1 }}
                  className="absolute inset-y-0 w-20 rotate-12 bg-[#0052CC]/10 blur-xl pointer-events-none"
                />

                <p className="text-[10px] uppercase tracking-[0.22em] text-[#0052CC] font-bold font-display">{title}</p>
                <p className="mt-3 text-3xl font-bold text-[#17284D] tracking-tight font-display">{value}</p>
                <p className="mt-2 text-xs text-[#5F6A86] font-medium">Condition-led commercial output</p>

                <div className="mt-6 space-y-3.5">
                  {[
                    ["Supply", 68],
                    ["Demand", 84],
                    ["Margin", 52],
                  ].map(([label, width], barIndex) => (
                    <div key={label}>
                      <div className="h-2 overflow-hidden rounded-full bg-[#E9EEF9]">
                        <motion.div
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${width}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 2.5,
                            ease: "easeOut",
                            delay: barIndex * 0.15,
                          }}
                          className="h-full rounded-full bg-[#0052CC]"
                        />
                      </div>
                      <div className="mt-1.5 flex justify-between items-center text-[10px] uppercase tracking-[0.16em] text-[#4A5875] font-semibold">
                        <span>{label}</span>
                        <span className="font-bold text-[#17284D]">{width}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DarkCard>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </PageShell>
  );
}
