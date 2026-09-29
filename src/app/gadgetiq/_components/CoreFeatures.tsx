"use client";

import Link from "next/link";
import {
  ChevronRight,
  Eye,
  Stethoscope,
  Cpu,
  CheckCircle2,
  Sparkles,
  ScanLine,
  BarChart3,
} from "lucide-react";

export default function CoreFeatures() {
  return (
    <section id="what-we-check" className="relative overflow-hidden bg-[#F8FAFD] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[350px] w-[350px] rounded-full bg-blue-100/30 blur-3xl" />

      <div
        className="pointer-events-none absolute right-[12%] top-10 h-[120px] w-[150px] opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0052CC 1.5px, transparent 1.5px)",
          backgroundSize: "15px 15px",
        }}
      />

      <div className="relative mx-auto max-w-[1450px]">
        {/* =====================================================
            SECTION HEADING
        ===================================================== */}

        <div className="max-w-[850px]">
          <span className="inline-flex rounded-full bg-[#EAF2FF] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#0052CC]">
            Our Core Features
          </span>

          <h2 className="mt-4 text-[16px] font-bold leading-[1.1] tracking-[-0.03em] text-[#10244A] sm:text-[20px] lg:text-[24px]">
            Two smarter ways to understand{" "}
            <span className="text-[#126BEE]">every device</span>
          </h2>

          <p className="mt-4 max-w-[720px] text-[15px] leading-7 text-[#65728D]">
            Evaluate device performance. Inspect physical condition. Make
            better decisions with Gadget IQ.
          </p>
        </div>

        {/* =====================================================
            FEATURE CARDS
        ===================================================== */}

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          {/* ===================================================
              GADGET EVALUATE
          =================================================== */}

          <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#DCE6F4] bg-white p-6 shadow-[0_18px_50px_rgba(30,70,120,0.06)] sm:p-8">
            {/* Decorative Circle */}
            <div className="pointer-events-none absolute -right-14 -top-14 h-[310px] w-[310px] rounded-full border-[38px] border-[#EEF5FF]" />

            <div className="relative z-10 flex h-full flex-col">
              {/* TOP CONTENT + IMAGE */}
              <div className="grid items-center gap-7 md:grid-cols-[0.9fr_1.1fr]">
                {/* LEFT CONTENT */}
                <div>
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#1681FF] to-[#0052E8] text-white shadow-[0_10px_25px_rgba(0,82,232,0.22)]">
                    <Stethoscope size={27} strokeWidth={2.2} />
                  </div>

                  {/* Eyebrow */}
                  <p className="mt-5 text-[11px] font-bold uppercase leading-[1.5] tracking-[0.18em] text-[#0876F9]">
                    Functional Device
                    <br />
                    Diagnostics
                  </p>

                  {/* Title */}
                  <h3 className="mt-3 text-[21px] font-bold tracking-tight text-[#10244A] sm:text-[23px]">
                    Gadget{" "}
                    <span className="text-[#0876F9]">Evaluate</span>
                  </h3>

                  {/* Description */}
                  <p className="mt-3 max-w-[390px] text-[14px] leading-6 text-[#65728D]">
                    Run comprehensive diagnostic checks to assess a
                    device&apos;s hardware, performance, and overall
                    functionality.
                  </p>
                </div>

                {/* RIGHT IMAGE */}
                <div className="relative flex min-h-[220px] items-center justify-center">
                  <div className="pointer-events-none absolute h-[230px] w-[230px] rounded-full bg-blue-100/50 blur-3xl" />

                  <img
                    src="/images/gadget-evaluate-laptop.png"
                    alt="Gadget Evaluate laptop diagnostics"
                    className="relative z-10 h-auto w-full max-w-[390px] object-contain transition-transform duration-500 group-hover:-translate-y-1"
                  />
                </div>
              </div>

              {/* =================================================
                  FULL WIDTH EVALUATE HIGHLIGHTS
              ================================================= */}

              <div className="mt-7 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                {/* 35 Tests */}
                <div className="flex min-h-[84px] items-center gap-3 rounded-[16px] border border-[#DCE8F8] bg-[#F7FAFE] px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0876F9]/30 hover:bg-[#EEF6FF]">
                  <div className="shrink-0">
                    <span className="text-[27px] font-bold leading-none text-[#0876F9]">
                      35
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold leading-tight text-[#17284D]">
                      Diagnostic
                    </p>

                    <p className="mt-1 text-[10px] leading-tight text-[#65728D]">
                      Tests
                    </p>
                  </div>
                </div>

                {/* Multiple Components */}
                <div className="flex min-h-[84px] items-center gap-3 rounded-[16px] border border-[#DCE8F8] bg-[#F7FAFE] px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0876F9]/30 hover:bg-[#EEF6FF]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E2F0FF] text-[#0876F9]">
                    <Cpu size={20} strokeWidth={2.3} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold leading-tight text-[#17284D]">
                      Multiple
                    </p>

                    <p className="mt-1 text-[10px] leading-tight text-[#65728D]">
                      Components
                    </p>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="flex min-h-[84px] items-center gap-3 rounded-[16px] border border-[#DCE8F8] bg-[#F7FAFE] px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0876F9]/30 hover:bg-[#EEF6FF]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#DFF3FF] text-[#0876F9]">
                    <CheckCircle2 size={21} strokeWidth={2.3} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold leading-tight text-[#17284D]">
                      Detailed
                    </p>

                    <p className="mt-1 text-[10px] leading-tight text-[#65728D]">
                      Results
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-auto pt-7">
                <KnowMoreButton href="/gadgetiq/evaluate" />
              </div>
            </div>
          </article>

          {/* ===================================================
              GADGET LENS
          =================================================== */}

          <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#E2DDF5] bg-white p-6 shadow-[0_18px_50px_rgba(80,50,150,0.06)] sm:p-8">
            {/* Decorative Circles */}
            <div className="pointer-events-none absolute -right-14 -top-14 h-[310px] w-[310px] rounded-full border-[38px] border-[#F5F0FF]" />

            <div className="pointer-events-none absolute right-[60px] top-[28px] h-[170px] w-[170px] rounded-full border border-purple-100" />

            <div className="relative z-10 flex h-full flex-col">
              {/* TOP CONTENT + IMAGE */}
              <div className="grid items-center gap-7 md:grid-cols-[0.9fr_1.1fr]">
                {/* LEFT CONTENT */}
                <div>
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-[17px] bg-gradient-to-br from-[#9B5CFF] to-[#6726EF] text-white shadow-[0_10px_25px_rgba(110,45,240,0.20)]">
                    <Eye size={29} strokeWidth={2.2} />
                  </div>

                  {/* Eyebrow */}
                  <p className="mt-5 text-[11px] font-bold uppercase leading-[1.5] tracking-[0.18em] text-[#7638F0]">
                    AI-Powered Cosmetic
                    <br />
                    Grading
                  </p>

                  {/* Title */}
                  <h3 className="mt-3 text-[21px] font-bold tracking-tight text-[#10244A] sm:text-[23px]">
                    Gadget <span className="text-[#7638F0]">Lens</span>
                  </h3>

                  {/* Description */}
                  <p className="mt-3 max-w-[390px] text-[14px] leading-6 text-[#65728D]">
                    Use AI-powered visual inspection to detect physical
                    imperfections and determine the device&apos;s cosmetic
                    grade.
                  </p>
                </div>

                {/* RIGHT IMAGE */}
                <div className="relative flex min-h-[220px] items-center justify-center">
                  <div className="pointer-events-none absolute h-[230px] w-[230px] rounded-full bg-purple-100/60 blur-3xl" />

                  <img
                    src="/images/gadget-lens-laptop.png"
                    alt="Gadget Lens cosmetic inspection"
                    className="relative z-10 h-auto w-full max-w-[390px] object-contain transition-transform duration-500 group-hover:-translate-y-1"
                  />
                </div>
              </div>

              {/* =================================================
                  FULL WIDTH LENS HIGHLIGHTS
              ================================================= */}

              <div className="mt-7 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
                {/* AI-Powered */}
                <div className="flex min-h-[84px] items-center gap-3 rounded-[16px] border border-[#E8DDFB] bg-[#FBF9FF] px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7638F0]/30 hover:bg-[#F6F0FF]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0E7FF] text-[#7638F0]">
                    <Sparkles size={20} strokeWidth={2.3} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold leading-tight text-[#17284D]">
                      AI-Powered
                    </p>

                    <p className="mt-1 text-[10px] leading-tight text-[#65728D]">
                      Inspection
                    </p>
                  </div>
                </div>

                {/* Detects */}
                <div className="flex min-h-[84px] items-center gap-3 rounded-[16px] border border-[#E8DDFB] bg-[#FBF9FF] px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7638F0]/30 hover:bg-[#F6F0FF]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0E7FF] text-[#7638F0]">
                    <ScanLine size={20} strokeWidth={2.3} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold leading-tight text-[#17284D]">
                      Detects
                    </p>

                    <p className="mt-1 text-[10px] leading-tight text-[#65728D]">
                      Visible Issues
                    </p>
                  </div>
                </div>

                {/* Assigns Grade */}
                <div className="flex min-h-[84px] items-center gap-3 rounded-[16px] border border-[#E8DDFB] bg-[#FBF9FF] px-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7638F0]/30 hover:bg-[#F6F0FF]">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F0E7FF] text-[#7638F0]">
                    <BarChart3 size={20} strokeWidth={2.3} />
                  </div>

                  <div>
                    <p className="text-[11px] font-bold leading-tight text-[#17284D]">
                      Assigns
                    </p>

                    <p className="mt-1 text-[10px] leading-tight text-[#65728D]">
                      Device Grade
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-auto pt-7">
                <KnowMoreButton href="/gadgetiq/lens" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================
   KNOW MORE BUTTON
========================================================== */

function KnowMoreButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="
        group/button
        inline-flex
        items-center
        justify-center
        gap-3
        rounded-full
        bg-gradient-to-r
        from-[#FF5535]
        to-[#F23B1D]
        px-7
        py-3.5
        text-[11px]
        font-bold
        uppercase
        tracking-[0.12em]
        text-white
        shadow-[0_8px_20px_rgba(245,65,35,0.20)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_12px_25px_rgba(245,65,35,0.30)]
      "
    >
      Know More

      <ChevronRight
        size={16}
        strokeWidth={2.5}
        className="transition-transform duration-300 group-hover/button:translate-x-1"
      />
    </Link>
  );
}