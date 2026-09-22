"use client";

import React from "react";

interface InfiniteMarqueeProps {
  items: string[];
  speed?: number;
}

export default function InfiniteMarquee({ items, speed = 30 }: InfiniteMarqueeProps) {
  // Triple the items to ensure complete coverage for the continuous scroll
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="marquee-container relative w-full overflow-hidden bg-brand-bg-mid/50 border-y border-brand-border/60 py-5 z-20">
      {/* Side gradient masks for smooth fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Global CSS injection for hardware-accelerated marquee */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        .marquee-inner {
          display: flex;
          width: max-content;
          animation: marquee-scroll ${speed}s linear infinite;
        }
        .marquee-container:hover .marquee-inner {
          animation-play-state: paused;
        }
      `}} />

      <div className="marquee-inner flex items-center">
        {duplicatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-6 px-10 shrink-0">
            {/* Pulsing Accent Dot */}
            <span className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_var(--brand-accent)] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-brand-text-primary font-sans">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
