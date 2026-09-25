"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Activity, BadgeCheck, BrainCircuit, ChevronLeft, ChevronRight, Settings2 } from "lucide-react";

import SectionHeading from "./SectionHeading";
import PageShell from "./PageShell";
import GadgetIQLiveDemo from "./GadgetIQLiveDemo";
import { fadeUp, stagger } from "./animations";

const AUTOPLAY_MS = 4500;

const steps = [
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
    image: "/images/workflow/02-ai-grading.jpg",
    icon: BrainCircuit,
  },
  {
    title: "Certification",
    text: "A verified pass/fail certificate is issued with the final condition grade.",
    image: "/images/workflow/03-certification.jpg",
    icon: BadgeCheck,
  },
  {
    title: "Admin Control",
    text: "Get a complete overview and control of your inspection operations.",
    image: "/images/workflow/04-admin-control.jpg",
    icon: Settings2,
  },
];

export default function GadgetIQWorkflow() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % steps.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, active]);

  const goTo = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  const goPrev = () => goTo((active - 1 + steps.length) % steps.length);
  const goNext = () => goTo((active + 1) % steps.length);

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
          title="Experience the Complete"
          highlight="GadgetIQ Workflow"
          text="From login to final report — explore the full inspection and grading journey before you buy."
        />

        <motion.div
          variants={fadeUp}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-10 flex flex-col gap-6"
        >
          {/* Top: horizontal step tabs with icons */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {steps.map((step, index) => {
              const isActive = index === active;
              const Icon = step.icon;
              return (
                <button
                  key={step.title}
                  onClick={() => goTo(index)}
                  className={`group relative flex shrink-0 items-center gap-2.5 overflow-hidden rounded-full border py-2 pl-2 pr-4 transition-colors ${
                    isActive
                      ? "border-brand-accent bg-brand-accent/5"
                      : "border-[#DDE4F3] bg-white hover:border-brand-accent/40"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                      isActive
                        ? "bg-brand-accent text-white"
                        : "bg-[#F4F6FB] text-[#4A5875]"
                    }`}
                  >
                    <Icon size={15} />
                  </span>

                  <span
                    className={`whitespace-nowrap text-xs font-bold sm:text-sm ${
                      isActive ? "text-brand-accent" : "text-[#4A5875]"
                    }`}
                  >
                    {step.title}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] overflow-hidden rounded-full bg-brand-accent/15">
                      <span
                        key={active}
                        className="block h-full bg-brand-accent"
                        style={{
                          animation: `gadgetiq-fill ${AUTOPLAY_MS}ms linear forwards`,
                          animationPlayState: isPaused ? "paused" : "running",
                        }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Carousel panel */}
          <div className="relative overflow-hidden rounded-[28px] border border-[#DDE4F3] bg-[#F4F6FB] shadow-sm">
            <div
              className={`relative w-full overflow-hidden ${
                current.interactive
                  ? "h-[760px] sm:h-[700px] lg:h-full lg:min-h-[700px]"
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
                  ) : failedImages.has(active) ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-accent/5 to-transparent text-center">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-accent">
                        Step {active + 1}
                      </span>
                      <span className="text-sm font-bold text-[#17284D]">
                        {current.title}
                      </span>
                    </div>
                  ) : (
                    <Image
                      src={current.image}
                      alt={current.title}
                      fill
                      className="object-contain p-4 sm:p-8"
                      onError={() =>
                        setFailedImages((prev) => new Set(prev).add(active))
                      }
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next controls */}
              <button
                onClick={goPrev}
                aria-label="Previous step"
                className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#DDE4F3] bg-white/90 text-[#17284D] shadow-md transition-colors hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goNext}
                aria-label="Next step"
                className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#DDE4F3] bg-white/90 text-[#17284D] shadow-md transition-colors hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes gadgetiq-fill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </PageShell>
  );
}
