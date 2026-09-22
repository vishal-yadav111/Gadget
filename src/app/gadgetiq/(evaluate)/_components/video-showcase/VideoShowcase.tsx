"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function VideoShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause video decoding when out of viewport to save RAM / GPU
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Track scroll position as the section moves across the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 85%", "center 40%"],
  });

  // Dynamic pop-up and full-width expansion during scroll
  const containerWidth = useTransform(scrollYProgress, [0, 0.65], ["85%", "100%"]);
  const containerScale = useTransform(scrollYProgress, [0, 0.65], [0.88, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.65], [36, 16]);
  const contentScale = useTransform(scrollYProgress, [0.1, 0.7], [0.92, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [0.4, 1]);

  const steps = [
    {
      title: "Check",
      desc: "Test supported device functions through a guided diagnostic process.",
    },
    {
      title: "Identify",
      desc: "See exactly which tests passed and where an issue was found.",
    },
    {
      title: "Understand",
      desc: "Get a clear view of the device's functional condition.",
    },
    {
      title: "Record",
      desc: "Create a digital assessment and certificate for the completed test.",
    },
  ];

  return (
    <section 
      ref={containerRef} 
      className="relative py-12 sm:py-16 md:py-20 px-2 sm:px-4 md:px-6 bg-brand-bg-deep overflow-hidden z-10 flex flex-col items-center justify-center"
    >
      {/* Subtle top accent divider line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-border to-transparent pointer-events-none" />

      {/* Main Dynamic Pop-Up Video Capsule */}
      <motion.div
        style={{
          width: containerWidth,
          scale: containerScale,
          borderRadius: borderRadius,
        }}
        className="w-full h-auto min-h-[500px] sm:min-h-[520px] md:min-h-[580px] lg:aspect-[16/9] overflow-hidden relative shadow-[0_25px_80px_-15px_rgba(0,0,0,0.45),0_10px_30px_rgba(0,82,204,0.15)] border border-slate-700/40 bg-slate-950 flex flex-col justify-center items-center mx-auto"
      >
        {/* Looping background video - Auto-pauses off-screen */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center brightness-110 contrast-105 saturate-110"
        >
          <source src="/videos/gadget-evaluate-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Lighter cinematic vignette so the video is clearly seen */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/45 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%] pointer-events-none" />

        {/* Foreground Content Overlay */}
        <motion.div
          style={{
            scale: contentScale,
            opacity: contentOpacity,
          }}
          className="relative z-20 flex flex-col items-center justify-center text-center p-5 sm:p-8 md:p-12 lg:p-14 max-w-5xl mx-auto select-none w-full"
        >
          {/* Top Eyebrow Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase mb-4 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
            <span>WHAT GADGET EVALUATE DOES</span>
          </div>

          {/* Main Headline with enhanced contrast */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.14] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] font-display">
            One device. One assessment. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-white to-blue-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              A clearer picture.
            </span>
          </h2>

          {/* 4 Steps: Clean typography directly on overlay without card borders/backgrounds */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 w-full text-left">
            {steps.map((st) => (
              <div key={st.title} className="space-y-1">
                <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {st.title}
                </h4>
                <p className="text-[11px] sm:text-xs lg:text-[13px] text-slate-200/90 font-light leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Closing Value Statement with Stars */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 mt-6 sm:mt-8 border-t border-white/25 pt-3.5 sm:pt-4 text-xs sm:text-sm md:text-base font-bold text-white uppercase tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] w-full">
            <span className="inline-flex items-center space-x-1.5 shrink-0 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
              <span className="text-brand-accent text-xs sm:text-sm">✦</span>
              <span>Less guesswork</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 shrink-0 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
              <span className="text-brand-accent text-xs sm:text-sm">✦</span>
              <span>More clarity</span>
            </span>
            <span className="inline-flex items-center space-x-1.5 shrink-0 bg-black/40 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10">
              <span className="text-brand-accent text-xs sm:text-sm">✦</span>
              <span>Better decisions</span>
            </span>
          </div>

        </motion.div>
      </motion.div>
    </section>
  );
}
