"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Award,
  BadgeCheck,
  Equal,
  Eye,
  Plus,
  Search,
  Stethoscope,
  Usb,
} from "lucide-react";

import SectionHeading from "./SectionHeading";
import PageShell from "./PageShell";
import { fadeUp, stagger } from "./animations";

const steps = [
  {
    icon: Usb,
    step: "01",
    title: "Connect & Identify",
    text: "Device is connected and its model, serial number and specs are auto-detected.",
  },
  {
    icon: Activity,
    step: "02",
    title: "Run Diagnostics",
    text: "37 automated functional tests validate hardware, battery, display and ports.",
  },
  {
    icon: Search,
    step: "03",
    title: "Inspect & Grade",
    text: "AI-powered surface scan detects scratches and wear to assign a cosmetic grade.",
  },
  {
    icon: BadgeCheck,
    step: "04",
    title: "Certify",
    text: "A verified pass/fail certificate is issued with the final condition grade.",
  },
];

const gradeTiers = [
  {
    grade: "A",
    label: "Excellent",
    text: "Like new, no visible wear or marks.",
    color: "#0F9D58",
  },
  {
    grade: "B",
    label: "Good",
    text: "Light wear only, fully functional.",
    color: "#0052CC",
  },
  {
    grade: "C",
    label: "Fair",
    text: "Visible wear, still fully functional.",
    color: "#D97706",
  },
  {
    grade: "D",
    label: "Poor",
    text: "Heavy wear or damage; needs repair.",
    color: "#DC2626",
  },
];

const GRADE_CYCLE_MS = 1800;

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
          className="relative mt-11 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Connector line (desktop only) */}
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden h-px bg-gradient-to-r from-transparent via-[#DDE4F3] to-transparent lg:block" />

          {steps.map((item) => (
            <motion.div
              key={item.step}
              variants={fadeUp}
              className="relative rounded-[22px] border border-[#DDE4F3] bg-white p-6 text-center shadow-xs"
            >
              <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0052CC] text-white shadow-md shadow-[#0052CC]/20">
                <item.icon size={22} />
              </div>

              <span className="mt-3 block text-[11px] font-bold uppercase tracking-[0.18em] text-[#0052CC]">
                Step {item.step}
              </span>

              <h4 className="mt-1 text-sm font-bold text-[#17284D] font-display">
                {item.title}
              </h4>

              <p className="mt-2 text-xs leading-relaxed text-[#4A5875]">
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-14">
          <GradingFormula />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6">
          <GradingScale />
        </motion.div>
      </motion.div>
    </PageShell>
  );
}

/* =========================================================
   GRADING FORMULA

   Explains that the final device grade is a combination of
   the functional evaluation (Gadget Evaluate) and the
   cosmetic assessment (Gadget Lens) - the "why" behind the
   grading scale shown right below it.
========================================================= */

function GradingFormula() {
  return (
    <div className="rounded-[28px] border border-[#DDE4F3] bg-white p-6 sm:p-8">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0052CC] font-display">
        Grading Methodology
      </p>

      <h3 className="mt-1 text-xl font-bold tracking-tight text-[#17284D] font-display">
        How Device Grading Works
      </h3>

      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#4A5875]">
        Our device grade is determined by combining two key assessments.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[18px] border border-[#DDE4F3] bg-[#F7FAFF] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052CC] text-white shadow-md shadow-[#0052CC]/20">
            <Stethoscope size={20} />
          </div>

          <p className="mt-3 text-sm font-bold text-[#17284D] font-display">
            Functional Evaluation{" "}
            <span className="text-[#0052CC]">(Gadget Evaluate)</span>
          </p>

          <p className="mt-1.5 text-xs leading-relaxed text-[#4A5875]">
            Checks the device&apos;s functional parameters and hardware
            components to verify how well the device performs.
          </p>
        </div>

        <div className="rounded-[18px] border border-[#DDE4F3] bg-[#FBF7FF] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7638F0] text-white shadow-md shadow-[#7638F0]/20">
            <Eye size={20} />
          </div>

          <p className="mt-3 text-sm font-bold text-[#17284D] font-display">
            Cosmetic Assessment{" "}
            <span className="text-[#7638F0]">(Gadget Lens)</span>
          </p>

          <p className="mt-1.5 text-xs leading-relaxed text-[#4A5875]">
            Analyzes the device&apos;s physical condition, including
            scratches, dents, marks, and other visible signs of wear.
          </p>
        </div>
      </div>

      {/* FORMULA ROW */}
      <div className="mt-6 flex flex-col items-center gap-3 rounded-[18px] border border-[#DDE4F3] bg-[#F4F6FB] p-5 sm:flex-row sm:justify-center sm:gap-4">
        <FormulaChip
          icon={Stethoscope}
          label="Gadget Evaluate"
          sub="Functional Condition"
          color="#0052CC"
          bg="#EAF2FF"
        />

        <Plus size={16} className="shrink-0 text-[#8896AC]" />

        <FormulaChip
          icon={Eye}
          label="Gadget Lens"
          sub="Cosmetic Condition"
          color="#7638F0"
          bg="#F4EBFF"
        />

        <Equal size={16} className="shrink-0 text-[#8896AC]" />

        <FormulaChip
          icon={Award}
          label="Final Device Grade"
          sub="Combined Result"
          color="#fff"
          bg="linear-gradient(135deg, #0052CC, #7638F0)"
        />
      </div>
    </div>
  );
}

function FormulaChip({
  icon: Icon,
  label,
  sub,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div
      className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3 sm:w-auto"
      style={{ background: bg }}
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: color === "#fff" ? "rgba(255,255,255,0.25)" : "#fff",
          color: color === "#fff" ? "#fff" : color,
        }}
      >
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <p
          className="truncate text-xs font-bold font-display"
          style={{ color: color === "#fff" ? "#fff" : "#17284D" }}
        >
          {label}
        </p>

        <p
          className="truncate text-[10px] font-medium"
          style={{ color: color === "#fff" ? "rgba(255,255,255,0.85)" : "#4A5875" }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   GRADING SCALE

   Live indicator sweeps across the four condition tiers
   on a loop, pausing briefly on each to highlight it -
   illustrating the automated grading step in action.
========================================================= */

function GradingScale() {
  const lastIndex = gradeTiers.length - 1;

  // Continuous 0-100 handle position. Dragging always reads/writes
  // this directly from the pointer's exact location - it never gets
  // rounded to a tier stop, so the handle stays exactly where the
  // user drops it instead of snapping elsewhere.
  const [progress, setProgress] = useState(0);
  const [autoIndex, setAutoIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const paused = hovered || dragging;

  // Which tier card reads as "active" right now, purely for
  // highlighting - this never moves the handle itself.
  const nearestIndex = Math.min(
    lastIndex,
    Math.max(0, Math.round((progress / 100) * lastIndex))
  );

  useEffect(() => {
    if (paused) return;

    // Resync the auto-cycle to wherever the handle currently sits
    // before resuming, so it continues smoothly from there.
    setAutoIndex(nearestIndex);

    const timer = setInterval(() => {
      setAutoIndex((value) => {
        const next = (value + 1) % gradeTiers.length;
        setProgress((next / lastIndex) * 100);
        return next;
      });
    }, GRADE_CYCLE_MS);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  const progressFromClientX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return progress;

    const rect = track.getBoundingClientRect();
    const ratio = rect.width === 0 ? 0 : (clientX - rect.left) / rect.width;

    return Math.min(100, Math.max(0, ratio * 100));
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (event: PointerEvent) =>
      setProgress(progressFromClientX(event.clientX));
    const handleUp = () => setDragging(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  const goToIndex = (index: number) => setProgress((index / lastIndex) * 100);

  return (
    <div
      className="rounded-[28px] border border-[#DDE4F3] bg-[#F4F6FB] p-6 sm:p-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0052CC] font-display">
            Grading Standard
          </p>

          <h3 className="mt-1 text-xl font-bold tracking-tight text-[#17284D] font-display">
            How Condition Grades Are Assigned
          </h3>
        </div>

        <div className="max-w-sm sm:text-right">
          <p className="text-xs leading-relaxed text-[#4A5875]">
            Every device receives a functional pass/fail result plus a
            cosmetic grade based on surface wear detected during inspection.
          </p>

          <p className="mt-1.5 text-[11px] font-medium text-[#8896AC]">
            Hover to pause &middot; click a grade to preview it
          </p>
        </div>
      </div>

      {/* Draggable grading indicator track */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Condition grade preview"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-valuetext={gradeTiers[nearestIndex].label}
        onPointerDown={(event) => {
          // Clicking the bare track (not the handle) jumps exactly
          // to that spot and starts dragging from there.
          setDragging(true);
          setProgress(progressFromClientX(event.clientX));
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goToIndex(Math.min(nearestIndex + 1, lastIndex));
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            goToIndex(Math.max(nearestIndex - 1, 0));
          }
        }}
        className="relative mx-1 mt-8 hidden cursor-pointer touch-none select-none py-3 sm:block"
      >
        <div className="h-[3px] rounded-full bg-[#DDE4F3]">
          <div
            className="h-full rounded-full bg-[#0052CC]/25"
            style={{ width: `${progress}%` }}
          />
        </div>

        {gradeTiers.map((tier, index) => (
          <span
            key={tier.grade}
            className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white ring-2 ring-[#DDE4F3]"
            style={{ left: `${(index / lastIndex) * 100}%` }}
          />
        ))}

        <motion.span
          data-handle="true"
          onPointerDown={(event) => {
            // Grabbing the handle itself never jumps first - it
            // only starts tracking the pointer from here on.
            event.stopPropagation();
            setDragging(true);
          }}
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,1)] ${
            dragging ? "h-4 w-4 cursor-grabbing" : "h-3 w-3 cursor-grab"
          }`}
          animate={{
            left: `${progress}%`,
            backgroundColor: gradeTiers[nearestIndex].color,
          }}
          transition={{
            left: { duration: dragging ? 0 : 0.6, ease: "easeInOut" },
            backgroundColor: { duration: 0.3 },
          }}
        />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {gradeTiers.map((tier, index) => {
          const isActive = index === nearestIndex;

          return (
            <motion.button
              key={tier.grade}
              type="button"
              onClick={() => goToIndex(index)}
              animate={{ scale: isActive ? 1.04 : 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative flex items-start gap-3 rounded-[18px] border bg-white p-4 text-left transition-colors duration-200 hover:border-[#0052CC]/40"
              style={{
                borderColor: isActive ? tier.color : "#DDE4F3",
                boxShadow: isActive
                  ? `0 10px 24px ${tier.color}26`
                  : undefined,
              }}
            >
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white">
                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: tier.color }}
                    animate={{ scale: [1, 1.7, 1.7], opacity: [0.55, 0, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                  />
                )}

                <span
                  className="relative flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: tier.color }}
                >
                  {tier.grade}
                </span>
              </span>

              <div>
                <p className="text-sm font-bold text-[#17284D] font-display">
                  {tier.label}
                </p>

                <p className="mt-0.5 text-xs leading-snug text-[#4A5875]">
                  {tier.text}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
