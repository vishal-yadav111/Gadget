"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Plus, Minus } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border-b border-brand-border py-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left py-2 group cursor-pointer focus:outline-none"
      >
        <span className="text-base sm:text-lg font-semibold text-brand-text-primary group-hover:text-brand-accent transition-colors duration-200">
          {question}
        </span>
        <div className="ml-4 p-1.5 rounded-lg bg-brand-bg-light border border-white/10 text-brand-text-secondary group-hover:border-brand-accent/30 group-hover:text-brand-accent transition-all duration-300">
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm sm:text-base font-light text-brand-text-secondary pt-2 pb-4 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Gadget Evaluate?",
      answer:
        "Gadget Evaluate is a functional diagnostics solution that helps businesses assess the working condition of used and refurbished electronic devices.",
    },
    {
      question: "What devices can I test?",
      answer:
        "Gadget Evaluate supports diagnostic assessments for supported device categories such as laptops and mobile devices.",
    },
    {
      question: "What does it check?",
      answer:
        "It can check supported functions including display, touch, camera, battery, audio, connectivity, ports, keyboard, touchpad, sensors and other device functions.",
    },
    {
      question: "Does it check cosmetic condition?",
      answer:
        "No. Gadget Evaluate focuses on functional device evaluation, not scratches, dents or cosmetic grading.",
    },
    {
      question: "Can I test multiple devices?",
      answer:
        "Yes. The solution is designed for businesses performing repeated device assessments.",
    },
    {
      question: "Do I get a certificate?",
      answer:
        "Completed assessments can generate a digital certificate and structured assessment record.",
    },
    {
      question: "How can I try it?",
      answer: "Book a demo with our team and see Gadget Evaluate in action.",
    },
    {
      question: "What is a license?",
      answer:
        "A license lets you run one device through Gadget Evaluate's diagnostics and grading. Your plan includes a set number of licenses, and each completed assessment uses one.",
    },
    {
      question: "Do licenses expire?",
      answer:
        "Yes. Licenses are valid for a set period from the date they're issued. You can check your renewal date and remaining balance from your account dashboard.",
    },
    {
      question: "Can one license be used for Evaluate and Lens?",
      answer:
        "No. Gadget Evaluate and Gadget Lens draw from separate license pools, since they run different assessments: functional testing versus cosmetic grading.",
    },
    {
      question: "How do I top up my wallet?",
      answer:
        "Reach out to your account manager or our support team to add funds or purchase more licenses. We'll confirm once your balance is updated.",
    },
  ];

  return (
    <section id="faqs" className="relative py-8 sm:py-12  px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-brand-bg-light overflow-hidden z-10">
      {/* Decorative top lighting glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-[radial-gradient(ellipse_at_top,rgba(255,90,31,0.02),transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="FAQ"
          align="left"
          title="Questions? We've got you covered."
          subtitle="Clear answers to help you get started with functional device evaluation."
        />

        <div>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {[faqs.slice(0, Math.ceil(faqs.length / 2)), faqs.slice(Math.ceil(faqs.length / 2))].map((column, colIndex) => (
              <div key={colIndex} className="glass-panel rounded-3xl p-6 md:p-8 border border-white/5 bg-brand-bg-deep/50 shadow-xl">
                {column.map((faq, i) => {
                  const index = colIndex === 0 ? i : Math.ceil(faqs.length / 2) + i;
                  return (
                    <FAQItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openIndex === index}
                      onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
