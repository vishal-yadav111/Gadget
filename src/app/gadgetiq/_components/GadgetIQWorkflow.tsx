"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Activity, BadgeCheck, BrainCircuit, Settings2 } from "lucide-react";

import SectionHeading from "./SectionHeading";
import PageShell from "./PageShell";
import GadgetIQLiveDemo from "./GadgetIQLiveDemo";
import LensFlowDiagram from "./LensFlowDiagram";
import AdminControlDemo from "./AdminControlDemo";
import CertificationDemo from "./CertificationDemo";
import { fadeUp, stagger } from "./animations";

type WorkflowStep = {
  title: string;
  text: string;
  icon: React.ElementType;
  image?: string;
  interactive?: boolean;
  render?: boolean;
  admin?: boolean;
  certification?: boolean;
};

const steps: WorkflowStep[] = [
  {
    title: "Functional Test",
    text: "37+ automated functional tests validate hardware, battery, display and ports.",
    image: "/images/workflow/01-functional-test.png",
    icon: Activity,
    interactive: true,
  },
  {
    title: "AI Grading",
    text: "AI processes test data, detects issues and calculates the final condition grade.",
    icon: BrainCircuit,
    render: true,
  },
  {
    title: "Admin Control",
    text: "Get a complete overview and control of your inspection operations.",
    icon: Settings2,
    admin: true,
  },
  {
    title: "Certification",
    text: "A verified pass/fail certificate is issued with the final condition grade.",
    icon: BadgeCheck,
    certification: true,
  },
];

export default function GadgetIQWorkflow() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const goTo = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  const current = steps[active];

  return (
    <PageShell id="gadgetiq-workflow" className="bg-white">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
      >
        <SectionHeading
          eyebrow="product walkthrough"
          title="Try Out Our"
          highlight="Interactive Demo"
          text="From login to final report — explore the full inspection and grading journey before you buy."
        />

        <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-6">
          {/* Top: horizontal step tabs with icons */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {steps.map((step, index) => {
              const isActive = index === active;
              const Icon = step.icon;
              return (
                <button
                  key={step.title}
                  onClick={() => goTo(index)}
                  className={`group relative flex shrink-0 cursor-pointer items-center gap-1.5 overflow-hidden rounded-full border py-1 pl-1 pr-3 transition-colors ${
                    isActive
                      ? "border-brand-accent bg-brand-accent/5"
                      : "border-[#DDE4F3] bg-white hover:border-brand-accent/40"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isActive
                        ? "bg-brand-accent text-white"
                        : "bg-[#F4F6FB] text-[#4A5875]"
                    }`}
                  >
                    <Icon size={12} />
                  </span>

                  <span
                    className={`whitespace-nowrap text-[11px] font-bold sm:text-xs ${
                      isActive ? "text-brand-accent" : "text-[#4A5875]"
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Carousel panel */}
          <div className="relative overflow-hidden rounded-[28px] border border-[#DDE4F3] bg-[#F4F6FB] shadow-sm">
            <div
              className={`relative w-full overflow-hidden ${
                current.interactive || current.admin
                  ? "h-[760px] sm:h-[700px] lg:h-full lg:min-h-[700px]"
                  : current.render || current.certification
                  ? "h-[520px] sm:h-[560px] lg:h-full lg:min-h-[560px]"
                  : "h-[320px] sm:h-[420px] lg:h-full lg:min-h-[420px]"
              }`}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={active}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  {current.interactive ? (
                    <GadgetIQLiveDemo />
                  ) : current.admin ? (
                    <AdminControlDemo />
                  ) : current.certification ? (
                    <CertificationDemo />
                  ) : current.render ? (
                    <div className="flex h-full w-full items-start justify-center overflow-y-auto px-4 pb-4 pt-[30px] sm:px-6 sm:pb-6">
                      <LensFlowDiagram />
                    </div>
                  ) : failedImages.has(active) ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-accent/5 to-transparent text-center">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent">
                        Step {active + 1}
                      </span>
                      <span className="text-sm font-bold text-[#17284D]">
                        {current.title}
                      </span>
                    </div>
                  ) : current.image ? (
                    <Image
                      src={current.image}
                      alt={current.title}
                      fill
                      className="object-contain p-4 sm:p-8"
                      onError={() =>
                        setFailedImages((prev) => new Set(prev).add(active))
                      }
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </PageShell>
  );
}
