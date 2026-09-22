"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import laptopProductAnatomy from "@/../public/images/laptop-product-anatomy.jpg";

export default function WhyGadgetEvaluate() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Track scroll position gently as user scrolls down
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "center 45%"],
  });

  // Gentle scroll-driven pop-up transformations
  const imageScale = useTransform(scrollYProgress, [0, 0.75], [0.88, 1]);
  const imageY = useTransform(scrollYProgress, [0, 0.75], [50, 0]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.35], [0.3, 1]);
  const imageRotateX = useTransform(scrollYProgress, [0, 0.75], [6, 0]);
  const glowScale = useTransform(scrollYProgress, [0, 0.75], [0.8, 1.15]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5], [0.1, 0.6]);

  const pillars = [
    "Reliability",
    "Instant Feedback",
    "Intelligent Diagnostics",
  ];

  return (
    <section 
      ref={sectionRef} 
      id="why" 
      className="relative py-14 md:py-20 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-brand-bg-deep overflow-hidden z-10"
    >
      {/* Decorative linear glow */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-brand-border to-transparent pointer-events-none" />

      {/* Ambient Radial Lighting Bloom */}
      <motion.div 
        style={{
          scale: glowScale,
          opacity: glowOpacity,
        }}
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(0,82,204,0.18),transparent_70%)] blur-[80px] pointer-events-none -z-10" 
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">

        {/* LEFT COLUMN: Large Laptop Product Anatomy Visual with Gentle Scroll Pop-Up (Order 2 on mobile, Order 1 on lg) */}
        <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col items-center justify-center w-full relative">

          <motion.div
            style={{
              scale: imageScale,
              y: imageY,
              opacity: imageOpacity,
              rotateX: imageRotateX,
              transformPerspective: 1000,
            }}
            className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35),0_0_30px_rgba(0,82,204,0.1)] border border-brand-border/80 bg-slate-950/20 backdrop-blur-sm"
          >
            <Image
              src={laptopProductAnatomy}
              alt="Gadget Evaluate Laptop Product Anatomy Visualization"
              fill
              quality={100}
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              className="object-contain object-center scale-102 transition-transform duration-700 ease-out hover:scale-105 contrast-[1.1] saturate-[1.2] brightness-[1.03] filter"
              priority
            />
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Bold Editorial copy (Order 1 on mobile, Order 2 on lg) */}
        <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col space-y-4 md:space-y-5 self-center">

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold tracking-[0.25em] text-brand-accent uppercase"
          >
            WHY GADGET EVALUATE
          </motion.span>

          <div className="space-y-1.5">
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl xl:text-[40px] font-extrabold tracking-tight text-brand-text-primary leading-[1.14]"
            >
              A device can look fine and still have a problem.
            </motion.h3>
            <motion.h4
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-lg sm:text-xl font-bold text-brand-accent"
            >
              Turning on is only the first check.
            </motion.h4>
          </div>

          {/* Bullet points summarizing difficult to identify issues */}
          <div className="w-full space-y-2.5 pt-3 border-t border-brand-border/60">
            <p className="text-brand-text-primary text-[10.5px] font-bold uppercase tracking-wider text-left font-mono">
              MANUAL INSPECTION EASILY MISSES:
            </p>
            <ul className="space-y-2 text-slate-800 text-xs sm:text-[13px] font-medium text-left leading-normal">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                <span><strong className="text-slate-950 font-bold">Battery & Display:</strong> Hidden touch dead-zones and battery capacity degradation.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                <span><strong className="text-slate-950 font-bold">Camera & Audio:</strong> Muffled speaker outputs and camera sensor anomalies.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                <span><strong className="text-slate-950 font-bold">Ports & Connectivity:</strong> Charging pins and wireless signal not working.</span>
              </li>
            </ul>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-brand-text-primary font-semibold text-[13.5px] leading-snug"
          >
            Gadget Evaluate helps you check what really matters before the device moves forward.
          </motion.p>

          {/* Horizontal row for Pillars inside the right column without numbers */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3.5 border-t border-brand-border/60 w-full">
            {pillars.map((label, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={label}
                className="flex items-center space-x-1.5 text-xs sm:text-[13px] font-bold text-brand-text-primary uppercase tracking-wider"
              >
                <span className="text-brand-accent text-xs">✦</span>
                <span className="hover:text-brand-accent transition-colors duration-200">{label}</span>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

