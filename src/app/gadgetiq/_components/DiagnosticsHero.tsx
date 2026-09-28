"use client";

import { useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import StickyQuoteForm from "./StickyQuoteForm";

import {
  ArrowRight,
  BarChart3,
  Building2,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

/* =========================================================
   The interactive "fake app" mockup shown inside the laptop
   screen is large and purely decorative, so it is loaded
   client-side only, after the hero text/CTA above has
   already painted. This keeps the headline visible
   immediately instead of waiting on that extra bundle.
========================================================= */

const GadgetIQApplication = dynamic(
  () => import("./GadgetIQApplicationMock"),
  {
    ssr: false,
    loading: () => <GadgetIQApplicationSkeleton />,
  }
);

export default function DiagnosticsHero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#F8FAFD]">
      <StickyQuoteForm />

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_28%,rgba(79,145,255,0.14),transparent_30%)]" />

      <div className="pointer-events-none absolute right-[12%] top-[3%] h-[400px] w-[400px] rounded-full border-[45px] border-[#EAF3FF]/80" />

      <div
        className="pointer-events-none absolute right-[4%] top-[3%] h-[100px] w-[130px] opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, #72A9F7 1.5px, transparent 1.5px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* =====================================================
          MAIN HERO
      ===================================================== */}

      <div className="relative mx-auto grid w-full max-w-[1500px] flex-1 items-center gap-5 px-6 pb-5 pt-28 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 xl:px-14">
        {/* LEFT SIDE */}

        <div className="relative z-20 max-w-[620px]">
          <div className="inline-flex rounded-full bg-[#E9F1FC] px-4 py-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0068E8]">
              Global Device Intelligence
            </span>
          </div>

          <h1 className="mt-4 text-[33.6px] font-bold leading-[0.98] tracking-[-0.045em] text-[#12264D] sm:text-[38.4px] lg:text-[43.2px] xl:text-[48px]">
            Test your device
            <br />
            before you{" "}
            <span className="whitespace-nowrap italic text-[#0868E9]">
              Trust It.
            </span>
          </h1>

          <p className="mt-5 max-w-[560px] text-[14px] leading-6 text-[#647391] lg:text-[15px]">
            Functional device diagnostics for smarter buy, sell, report, and
            refurbishment decisions.
          </p>

          {/* CTA */}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="group flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#FF5436] to-[#F13B20] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_22px_rgba(247,69,38,0.25)] transition duration-300 hover:-translate-y-0.5"
            >
              Book a Demo

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              className="group flex items-center justify-center gap-3 rounded-full border border-[#D4DFEF] bg-white/80 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#17294D] shadow-sm transition duration-300 hover:border-[#B8CAE3] hover:bg-white"
            >
              See How It Flows

              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>

          {/* BENEFITS */}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Benefit
              icon={<ShieldCheck size={20} />}
              title="Accurate"
              text="Diagnostics"
              type="blue"
            />

            <Benefit
              icon={<Sparkles size={20} />}
              title="Faster"
              text="Decisions"
              type="purple"
            />

            <Benefit
              icon={<BarChart3 size={20} />}
              title="Trusted"
              text="by Professionals"
              type="green"
            />
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="relative z-10 flex min-w-0 items-center justify-center lg:min-h-[430px] lg:justify-end">
          <div className="pointer-events-none absolute left-[15%] top-[4%] h-[390px] w-[390px] rounded-full bg-[#DCEBFF]/55 blur-[70px]" />

          <div className="relative z-10 flex min-w-0 w-full justify-center lg:justify-end">
            <ScaledMockup referenceWidth={720}>
              <LaptopDiagnosticsMockup />
            </ScaledMockup>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM TRUST BAR
      ===================================================== */}

      <div className="relative z-20 border-t border-[#DDE6F2] bg-white/60 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col justify-between gap-4 px-6 py-4 lg:flex-row lg:items-center lg:px-10 xl:px-14">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#7786A2]">
              Trusted Across the Device Ecosystem
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-7">
              <Metric
                icon={<Users size={22} />}
                value="50K+"
                label="Devices Tested"
              />

              <Metric
                icon={<Building2 size={22} />}
                value="1,200+"
                label="Businesses"
              />

            </div>
          </div>

          <div className="flex items-center gap-3 lg:border-l lg:border-[#DDE6F2] lg:pl-8">
            <Leaf
              size={21}
              className="text-[#23B86B]"
              fill="currentColor"
            />

            <p className="text-[12px] font-medium text-[#6D7D9C]">
              Smarter Devices. A More Sustainable Tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* ANIMATIONS */}

      <style jsx global>{`
        @keyframes diagnosticGlow {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(8, 117, 247, 0);
          }

          50% {
            box-shadow: 0 0 0 4px rgba(8, 117, 247, 0.08);
          }
        }

        @keyframes rowRunning {
          0%,
          100% {
            background: rgba(8, 117, 247, 0.025);
          }

          50% {
            background: rgba(8, 117, 247, 0.07);
          }
        }

        @keyframes progressShine {
          from {
            transform: translateX(-110%);
          }

          to {
            transform: translateX(240%);
          }
        }

        @keyframes certificatePop {
          0% {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }

          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes detectScan {
          0%,
          100% {
            top: 8%;
          }

          50% {
            top: 92%;
          }
        }

        .diagnostic-running-row {
          animation: rowRunning 1.3s ease-in-out infinite;
        }

        .diagnostic-run-button {
          animation: diagnosticGlow 1.7s ease-in-out infinite;
        }

        .diagnostic-progress-shine {
          animation: progressShine 1.5s linear infinite;
        }

        .diagnostic-certificate-pop {
          animation: certificatePop 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .detect-scan-line {
          animation: detectScan 2.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .diagnostic-running-row,
          .diagnostic-run-button,
          .diagnostic-progress-shine,
          .diagnostic-certificate-pop,
          .detect-scan-line,
          .animate-spin,
          .animate-ping {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   SCALED MOCKUP

   The laptop mockup below is built at a fixed reference
   width so its dense table content never has to reflow.
   This wrapper measures the space actually available (any
   viewport, including narrow phones and the tablet widths
   where the hero briefly becomes two columns) and scales
   the mockup down to fit, instead of letting its fixed
   pixel columns clip or force the page to overflow.
========================================================= */

function ScaledMockup({
  referenceWidth,
  children,
}: {
  referenceWidth: number;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const update = () => {
      const availableWidth = container.offsetWidth;
      const nextScale = Math.min(1, availableWidth / referenceWidth);
      setScale(nextScale);
      setHeight(content.offsetHeight * nextScale);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(content);

    return () => observer.disconnect();
  }, [referenceWidth]);

  return (
    <div
      ref={containerRef}
      className="flex w-full min-w-0 items-start justify-center overflow-hidden"
      style={height !== null ? { height } : undefined}
    >
      <div
        ref={contentRef}
        className="shrink-0"
        style={{
          width: referenceWidth,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   LAPTOP DIAGNOSTICS MOCKUP
========================================================= */

function LaptopDiagnosticsMockup() {
  return (
    <div className="relative w-full">
      {/* LAPTOP SCREEN */}
      <div className="relative rounded-t-[20px] rounded-b-[8px] bg-gradient-to-b from-[#273143] to-[#121824] p-[9px]">
        {/* CAMERA */}
        <span className="absolute left-1/2 top-[3px] z-20 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-[#596276]" />

        {/* DISPLAY */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[9px] bg-[#F5F7FB]">
          <GadgetIQApplication />
        </div>
      </div>

      {/* LAPTOP BASE */}
      <div
        className="relative mx-auto h-[15px] w-[108%] -translate-x-1/2 rounded-b-[12px] bg-gradient-to-b from-[#E0E6EE] via-[#C7D0DC] to-[#AEB9C8]"
        style={{ left: "50%" }}
      >
        <span className="absolute left-1/2 top-0 h-[5px] w-[100px] -translate-x-1/2 rounded-b-[7px] bg-[#A4AFBE]" />
      </div>
    </div>
  );
}

/* =========================================================
   GADGET IQ APPLICATION SKELETON

   Static placeholder shown while the interactive app mockup
   chunk streams in, so the laptop screen never looks blank.
========================================================= */

function GadgetIQApplicationSkeleton() {
  return (
    <div className="flex h-full min-h-0 animate-pulse flex-col gap-[10px] bg-[#F5F7FB] p-[10px]">
      <div className="h-[42px] shrink-0 rounded-[6px] bg-white" />
      <div className="h-[32px] shrink-0 rounded-[6px] bg-white/70" />
      <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_190px] gap-[10px]">
        <div className="rounded-[8px] bg-white/70" />
        <div className="rounded-[8px] bg-white/70" />
      </div>
    </div>
  );
}

/* =========================================================
   BENEFIT
========================================================= */

function Benefit({
  icon,
  title,
  text,
  type,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  type: "blue" | "purple" | "green";
}) {
  const styles = {
    blue: "bg-[#EAF3FF] text-[#0875F7]",
    purple: "bg-[#F4EBFF] text-[#8A45F7]",
    green: "bg-[#E8FAF1] text-[#18A85F]",
  };

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-[12px] ${styles[type]}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-[11px] font-bold leading-tight text-[#213454]">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-[#697995]">{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
   METRIC
========================================================= */

function Metric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-w-[135px] items-center gap-3">
      <div className="text-[#71A7F7]">{icon}</div>

      <div>
        <p className="text-[16px] font-bold leading-none text-[#126BEE]">
          {value}
        </p>

        <p className="mt-1 text-[10px] text-[#71809B]">{label}</p>
      </div>
    </div>
  );
}
