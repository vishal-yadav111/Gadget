"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { ShieldCheck, Calendar, Check, X, ShieldAlert } from "lucide-react";

export default function DigitalTrust() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    // Calculate tilt angles (-10 to 10 degrees)
    const rx = ((y - height / 2) / (height / 2)) * -6;
    const ry = ((x - width / 2) / (width / 2)) * 6;
    setRotateX(rx);
    setRotateY(ry);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const checks = [
    { name: "Display", passed: true },
    { name: "Keyboard", passed: true },
    { name: "Touchpad", passed: true },
    { name: "Camera", passed: true },
    { name: "Audio", passed: true },
    { name: "Wi-Fi", passed: true },
    { name: "USB", passed: false },
  ];

  return (
    <section id="results" className="relative py-24 px-6 md:px-12 bg-brand-bg-deep overflow-hidden z-10">
      {/* Glow highlight behind certificate */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <SectionHeading
          eyebrow="THE RESULT"
          title="Know what was tested. Know what passed. Know what needs attention."
          subtitle="Every completed assessment can give your team a structured record of the device and its results."
        />

        {/* 3D Floating Certificate Wrapper */}
        <div className="w-full max-w-2xl mt-8 flex flex-col items-center">
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            animate={{
              rotateX: rotateX,
              rotateY: rotateY,
              scale: isHovered ? 1.02 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
            className="w-full max-w-xl rounded-2xl glass-panel p-8 md:p-10 shadow-2xl border border-white/10 relative overflow-hidden bg-gradient-to-br from-brand-bg-light/90 to-brand-bg-deep/95 select-none"
          >
            {/* Holographic Sheen Layer */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 40%, rgba(255,90,31,0.05) 50%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0) 100%)",
                transform: `translateX(${rotateY * 10 - 50}px) translateY(${rotateX * 10}px)`,
                mixBlendMode: "overlay",
              }}
            />

            {/* Certificate Header */}
            <div className="flex justify-between items-start border-b border-white/10 pb-6 relative z-10">
              <div className="flex flex-col">
                <span className="text-[10px] tracking-[0.25em] font-extrabold text-brand-accent uppercase">
                  GADGET EVALUATE
                </span>
                <h3 className="text-xl font-bold text-brand-text-primary mt-1">
                  Device Assessment Certificate
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-brand-success bg-brand-success/10 border border-brand-success/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Passed</span>
              </div>
            </div>

            {/* Device Info Summary */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-white/5 text-xs relative z-10">
              <div>
                <span className="text-brand-text-muted">Device:</span>
                <span className="font-semibold text-brand-text-primary ml-1.5">Dell Latitude</span>
              </div>
              <div>
                <span className="text-brand-text-muted">Serial No.:</span>
                <span className="font-semibold text-brand-text-primary font-mono ml-1.5">XXXXXXXX</span>
              </div>
              <div>
                <span className="text-brand-text-muted">Assessment:</span>
                <span className="font-semibold text-brand-text-primary ml-1.5">Completed</span>
              </div>
              <div>
                <span className="text-brand-text-muted">Overall Result:</span>
                <span className="font-semibold text-brand-success ml-1.5">Passed</span>
              </div>
            </div>

            {/* Functional Checks list */}
            <div className="py-6 relative z-10">
              <h4 className="text-xs font-bold text-brand-text-primary uppercase tracking-wider mb-3">
                Functional Checks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {checks.map((chk) => (
                  <div
                    key={chk.name}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-medium"
                  >
                    <span className="text-brand-text-secondary">{chk.name}</span>
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full ${
                        chk.passed
                          ? "bg-brand-success/10 text-brand-success"
                          : "bg-brand-critical/10 text-brand-critical"
                      }`}
                    >
                      {chk.passed ? (
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      ) : (
                        <X className="w-3 h-3 stroke-[2.5]" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Footer with metadata and QR/seal */}
            <div className="flex justify-between items-center border-t border-white/10 pt-6 relative z-10">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px] text-brand-text-secondary">
                <div>
                  <span className="block text-brand-text-muted uppercase tracking-wide">Assessment Date</span>
                  <span className="font-semibold font-mono">2026.08.29</span>
                </div>
                <div>
                  <span className="block text-brand-text-muted uppercase tracking-wide">Tester</span>
                  <span className="font-semibold">Audit Engine v2.0</span>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="block text-brand-text-muted uppercase tracking-wide">Certificate ID</span>
                  <span className="font-semibold font-mono">GE-DLL-5420X</span>
                </div>
              </div>

              {/* Security Seal */}
              <div className="p-2.5 rounded-xl bg-brand-accent/5 border border-brand-accent/25 text-brand-accent shadow-[0_0_15px_rgba(255,90,31,0.1)] shrink-0 flex items-center justify-center">
                <ShieldAlert className="w-8 h-8" />
              </div>
            </div>
          </motion.div>

          <p className="text-xs text-brand-text-secondary mt-6 italic text-center max-w-sm">
            Turn the Laptops test into a record you can trust and refer back to.
          </p>
        </div>
      </div>
    </section>
  );
}
