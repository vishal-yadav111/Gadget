"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

interface HealthGaugeProps {
  score: number;
}

export default function HealthGauge({ score }: HealthGaugeProps) {
  const [count, setCount] = useState(0);
  const gaugeRef = useRef(null);
  const isInView = useInView(gaugeRef, { once: true, margin: "-100px" });

  const radius = 80;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (count / 100) * circumference;

  useEffect(() => {
    if (isInView) {
      // Animate the counter
      const controls = animate(0, score, {
        duration: 2.0,
        ease: "easeOut",
        onUpdate: (value) => {
          setCount(Math.round(value));
        },
      });

      return () => controls.stop();
    }
  }, [isInView, score]);

  return (
    <div
      ref={gaugeRef}
      className="relative flex items-center justify-center w-[220px] h-[220px]"
    >
      {/* Glow Ring behind the SVG */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-4 rounded-full bg-brand-accent/20 blur-[24px] pointer-events-none"
        style={{
          boxShadow: `0 0 40px rgba(0, 82, 204, ${0.1 + (count / 100) * 0.2})`,
        }}
      />

      <svg className="w-full h-full transform -rotate-90">
        {/* Track Circle */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          className="stroke-white/5 fill-transparent"
          strokeWidth={strokeWidth}
        />

        {/* Glowing Progress Circle */}
        <motion.circle
          cx="110"
          cy="110"
          r={radius}
          className="fill-transparent"
          stroke="url(#accentGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 0 6px rgba(0, 82, 204, 0.6))",
          }}
        />

        {/* Definitions for Gradient */}
        <defs>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0052CC" />
            <stop offset="100%" stopColor="#6FA6FF" />
          </linearGradient>
        </defs>
      </svg>

      {/* Internal Score Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          className="text-6xl font-extrabold text-brand-text-primary tracking-tight"
          style={{ fontVariantNumeric: "normal" }}
        >
          {count}
        </motion.span>
        <span className="text-[10px] tracking-[0.2em] text-brand-text-muted font-bold uppercase mt-1">
          DEVICE HEALTH
        </span>
      </div>
    </div>
  );
}
