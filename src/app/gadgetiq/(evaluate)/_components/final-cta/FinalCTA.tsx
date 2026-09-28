"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function FinalCTA() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    const generated = Array.from({ length: 12 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 8 + 6,
    }));
    setParticles(generated);
  }, []);

  return (
    <section id="free-trial" className="relative min-h-0 sm:min-h-[60vh] lg:min-h-[75vh] flex items-center justify-center bg-brand-bg-mid overflow-hidden z-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-10 sm:py-16 md:py-20">

      {/* Immersive radial glow core */}
      <div className="absolute w-[600px] h-[600px] bg-brand-accent/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:50px_50px]"
        style={{
          maskImage: "radial-gradient(circle at 50% 50%, #000 50%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, #000 50%, transparent 100%)"
        }}
      />

      {/* Floating particles */}
      {mounted && particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
          className="absolute bg-brand-accent rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            filter: "drop-shadow(0 0 4px #0052CC)",
          }}
        />
      ))}

      <div className="max-w-5xl mx-auto text-center flex flex-col items-center space-y-5 sm:space-y-8 md:space-y-10 relative z-10">

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-[16px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[22px] lg:text-[26px] max-w-4xl font-display"
        >
          Know the device.
          <br />
          Make the <span className="font-bold italic text-[#0052CC]">decision.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-sm leading-7 text-[#4A5875] sm:text-base max-w-2xl px-1 sm:px-0 font-normal font-sans"
        >
          Whether you're buying, refurbishing, repairing, returning or reselling a device, start with a clear understanding of its functional condition. See Gadget Evaluate in action.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center justify-center space-y-4 w-full sm:w-auto"
        >
          <MagneticButton
            href="#contact"
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-white font-bold text-sm sm:text-base shadow-lg sm:shadow-xl shadow-brand-btn-orange/25 hover:shadow-brand-btn-orange/55 flex items-center justify-center space-x-2 border border-brand-btn-orange/30 group transition-all duration-300 btn-shimmer"
          >
            <span>Book a Demo</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>

        </motion.div>
      </div>
    </section>
  );
}
