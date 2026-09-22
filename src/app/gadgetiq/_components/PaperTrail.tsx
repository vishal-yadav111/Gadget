"use client";

import { motion } from "framer-motion";
import { ReceiptText } from "lucide-react";
import DarkCard from "./DarkCard";
import SectionHeading from "./SectionHeading";
import PageShell from "./PageShell";
import { fadeLeft, fadeRight, stagger } from "./animations";

export default function PaperTrail() {
  return (
    <PageShell id="reports" className="bg-[#F4F6FB]/80">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <SectionHeading
          eyebrow="Reports and Dashboard"
          title="Every device has a"
          highlight="paper trail."
          text="Every batch also has a dashboard, so teams can move from the individual record to the operational view without context loss."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.div variants={fadeLeft}>
            <DarkCard className="p-6 bg-white border-[#DDE4F3] shadow-md">
              <div className="flex items-center justify-between border-b border-[#DDE4F3] pb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#0052CC] font-bold font-display">
                    dashboard view
                  </p>
                  <p className="mt-1 text-xl font-bold text-[#17284D] font-display">Delhi Warehouse</p>
                </div>
                <span className="rounded-full bg-[#0052CC]/10 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#0052CC] border border-[#0052CC]/25 font-bold">
                  live
                </span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {[
                  ["pass yield", "688", "+8.4%"],
                  ["avg grade score", "91.2%", "+3.1%"],
                ].map(([a, b, c]) => (
                  <div key={a} className="rounded-xl border border-[#DDE4F3] bg-[#F4F6FB] p-4 shadow-xs">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#5F6A86] font-semibold">{a}</p>
                    <p className="mt-2 text-2xl font-bold text-[#17284D] font-display">{b}</p>
                    <p className="mt-1 text-xs font-bold text-emerald-600">{c}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-2xl border border-[#DDE4F3] bg-[#F4F6FB] p-5 shadow-xs">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#0052CC] font-bold font-display">
                    grade mix
                  </p>
                  <div className="mt-5 space-y-3.5">
                    {[
                      ["A grade", "82%"],
                      ["B grade", "61%"],
                      ["C grade", "26%"],
                      ["reject", "9%"],
                    ].map(([label, width]) => (
                      <div key={label}>
                        <div className="mb-1.5 flex justify-between text-xs text-[#4A5875] font-semibold">
                          <span>{label}</span>
                          <span className="text-[#17284D] font-bold">{width}</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#DDE4F3] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="h-full rounded-full bg-[#0052CC]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-[#DDE4F3] bg-[#F4F6FB] p-5 shadow-xs">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#0052CC] font-bold font-display">
                    pricing movement
                  </p>
                  <div className="mt-8 flex h-[160px] items-end gap-2">
                    {[30, 45, 42, 56, 63, 58, 72, 67, 80, 88].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.04 }}
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#0052CC] to-[#003D99] hover:opacity-90 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </DarkCard>
          </motion.div>

          <motion.div variants={fadeRight}>
            <DarkCard className="h-full p-6 flex flex-col justify-between bg-white border-[#DDE4F3] shadow-md">
              <div>
                <div className="flex items-center justify-between border-b border-[#DDE4F3] pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#0052CC] font-bold font-display">
                      Device Report
                    </p>
                    <p className="mt-1 text-xl font-bold text-[#17284D] font-display">HP Laptop</p>
                  </div>
                  <div className="h-9 w-9 rounded-xl bg-[#0052CC]/10 text-[#0052CC] flex items-center justify-center border border-[#0052CC]/25 shadow-xs">
                    <ReceiptText size={20} />
                  </div>
                </div>
                <div className="mt-5 space-y-2.5">
                  {[
                    ["IMEI / SN", "35099232086XXXX"],
                    ["Battery Health", "94%"],
                    ["CPU / GPU", "Pass"],
                    ["Cosmetics (Body / Screen)", "No Scratches or Dents"],
                  ].map(([a, b]) => (
                    <div
                      key={a}
                      className="flex items-center justify-between rounded-xl border border-[#DDE4F3] bg-[#F4F6FB] px-4 py-3 shadow-xs"
                    >
                      <span className="text-xs text-[#5F6A86] font-medium">{a}</span>
                      <span className="text-xs font-bold text-[#17284D]">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-[#0052CC]/25 bg-[#0052CC]/5 p-4">
                <p className="text-sm font-bold text-[#17284D] font-display">QR-verified record ready</p>
                <p className="mt-1 text-xs leading-relaxed text-[#4A5875] font-normal">
                  Device status, grade and pricing output tied to one report.
                </p>
              </div>
            </DarkCard>
          </motion.div>
        </div>
      </motion.div>
    </PageShell>
  );
}
