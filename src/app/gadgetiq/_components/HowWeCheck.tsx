"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import SectionHeading from "./SectionHeading";
import PageShell from "./PageShell";
import { fadeUp, stagger } from "./animations";

const steps = [
  {
    image: "/images/connect-identify.jpg",
    step: "01",
    title: "Connect & Identify",
    text: "Device is connected and its model, serial number and specs are auto-detected.",
  },
  {
    image: "/images/certify.jpg",
    step: "02",
    title: "Run Diagnostics",
    text: "35 automated functional tests validate hardware, battery, display and ports.",
  },
  {
    image: "/images/inspect-grade.jpg",
    step: "03",
    title: "Inspect & Grade",
    text: "AI-powered surface scan detects scratches and wear to assign a cosmetic grade.",
  },
  {
    image: "/images/run-diagnostics.jpg",
    step: "04",
    title: "Certify",
    text: "A verified pass/fail certificate is issued with the final condition grade.",
  },
];

export default function HowWeCheck() {
  return (
    <PageShell id="how-we-check" className="bg-white">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        variants={stagger}
      >
        <SectionHeading
          eyebrow="our process"
          title="Simple Steps,"
          highlight="Start to Finish"
          text="A consistent four-step process behind every diagnostic run, from connection to the final certified grade."
        />

        <motion.div
          variants={stagger}
          className="mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((item) => (
            <motion.div
              key={item.step}
              variants={fadeUp}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(0,82,204,0.25)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group relative overflow-hidden rounded-[22px] border border-[#DDE4F3] bg-white text-center shadow-xs"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-[#0052CC]">
                  Step {item.step}
                </span>

                <h4 className="mt-1 text-sm font-bold text-[#17284D] font-display">
                  {item.title}
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-[#4A5875]">
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </PageShell>
  );
}
