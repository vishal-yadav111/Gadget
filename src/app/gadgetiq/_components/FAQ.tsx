"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import DarkCard from "./DarkCard";
import SectionHeading from "./SectionHeading";
import { fadeLeft, fadeRight } from "./animations";

const faqs = [
  {
    q: "How do Gadget Evaluate and Gadget Lens connect?",
    a: "Gadget Evaluate runs functional tests and calculates a condition grade, while Gadget Lens captures cosmetic condition through photo-based inspection. Together they give you one combined functional and cosmetic record for every device.",
  },
  {
    q: "Can we start with just one product?",
    a: "Yes. You can start with Gadget Evaluate for functional testing and grading, and add Gadget Lens for cosmetic inspection whenever your workflow needs it.",
  },
  {
    q: "How is Gadget IQ different from a standard diagnostic tool?",
    a: "A regular diagnostic tool stops at testing. Gadget IQ continues into grading, pricing, reporting and operational routing.",
  },
  {
    q: "What kind of teams operate Gadget IQ day to day?",
    a: "Buying teams, refurbishment centers, trade-in teams, repair networks, resellers and enterprise device programs can all use it.",
  },
  {
    q: "Which device families does Gadget IQ support?",
    a: "Gadget IQ supports Windows, MacBook Apple Silicon, MacBook Intel, Android and iOS workflows for quality check, grading and reporting.",
  },
  {
    q: "Can Gadget IQ show different values for different channels?",
    a: "Yes. The same device record can support retail, wholesale, trade-in and BuyBack value outputs based on condition and channel logic.",
  },
  {
    q: "Is Gadget IQ suitable for international recommerce teams?",
    a: "Yes. The page and workflow are positioned for ITAD, refurbishment, wholesale, retail resale and recommerce operations across global markets.",
  },
  {
    q: "What is a license?",
    a: "A license lets you run one device through Gadget IQ's diagnostics and grading. Your plan includes a set number of licenses, and each completed assessment uses one.",
  },
  {
    q: "Do licenses expire?",
    a: "Yes. Licenses are valid for a set period from the date they're issued. You can check your renewal date and remaining balance from your account dashboard.",
  },
  {
    q: "Can one license be used for Evaluate and Lens?",
    a: "No. Gadget Evaluate and Gadget Lens draw from separate license pools, since they run different assessments: functional testing versus cosmetic grading.",
  },
  {
    q: "How do I top up my wallet?",
    a: "Reach out to your account manager or our support team to add funds or purchase more licenses. We'll confirm once your balance is updated.",
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="faqs" className="relative z-10 px-5 py-20 lg:px-8 bg-[#F4F6FB]/80">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeLeft}
        >
          <SectionHeading
            eyebrow="Questions"
            title="Questions we hear"
            highlight="from ops leads, procurement and buyers."
            text="Short answers to the most common rollout and usage questions."
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeRight}
        >
          <DarkCard className="p-3 bg-white border-[#DDE4F3] shadow-md">
            {faqs.map((item, index) => (
              <div key={item.q} className="border-b border-[#DDE4F3]/60 last:border-b-0">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:text-[#0052CC] cursor-pointer"
                >
                  <span className={`text-sm font-bold font-display transition-colors ${openFaq === index ? "text-[#0052CC]" : "text-[#17284D]"}`}>
                    {item.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform duration-300 ${
                      openFaq === index ? "rotate-180 text-[#0052CC]" : "text-slate-400"
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-[#4A5875] font-normal">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </DarkCard>
        </motion.div>
      </div>
    </section>
  );
}
