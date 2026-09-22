"use client";

import React, { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

interface CountUpProps {
  to: number;
  duration?: number; // seconds
  className?: string;
  prefix?: string;
  suffix?: string;
}

export default function CountUp({
  to,
  duration = 1.8,
  className = "",
  prefix = "",
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const node = ref.current;
      const controls = animate(0, to, {
        duration: duration,
        ease: [0.2, 0.7, 0.3, 1], // v3.0 standard ease-standard curve
        onUpdate(value) {
          node.textContent = Math.round(value).toLocaleString();
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to, duration]);

  return (
    <span className={className}>
      {prefix}
      <span ref={ref}>0</span>
      {suffix}
    </span>
  );
}
