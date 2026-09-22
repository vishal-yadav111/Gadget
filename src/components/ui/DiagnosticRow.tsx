"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

interface DiagnosticRowProps {
  label: string;
  finalValue: string;
  finalSubValue: string;
  delayIndex: number;
}

type ScanStatus = "scanning" | "analyzing" | "verified";

export default function DiagnosticRow({
  label,
  finalValue,
  finalSubValue,
  delayIndex,
}: DiagnosticRowProps) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [status, setStatus] = useState<ScanStatus>("scanning");

  useEffect(() => {
    if (isInView) {
      // 1. Initial State: scanning
      // 2. Transition to analyzing
      const analyzeTimer = setTimeout(() => {
        setStatus("analyzing");
      }, 1000 + delayIndex * 400);

      // 3. Transition to verified
      const verifyTimer = setTimeout(() => {
        setStatus("verified");
      }, 2400 + delayIndex * 500);

      return () => {
        clearTimeout(analyzeTimer);
        clearTimeout(verifyTimer);
      };
    }
  }, [isInView, delayIndex]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-300 relative overflow-hidden group"
    >
      {/* Background glow hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/0 via-brand-accent/[0.02] to-brand-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

      {/* Label and Status */}
      <div className="flex items-center space-x-4 relative z-10">
        <div className="flex flex-col">
          <span className="text-xs font-semibold tracking-wider text-brand-text-muted uppercase">
            {label}
          </span>
          <span className="text-sm font-medium mt-1">
            {status === "scanning" && (
              <span className="text-brand-accent-highlight flex items-center space-x-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="text-xs">Scanning...</span>
              </span>
            )}
            {status === "analyzing" && (
              <span className="text-brand-accent flex items-center space-x-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="text-xs">Analyzing endpoints...</span>
              </span>
            )}
            {status === "verified" && (
              <span className="text-brand-success flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Verified</span>
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Diagnostic Values */}
      <div className="text-right relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: status === "verified" ? 1 : 0.4 }}
          className="text-base font-bold font-mono text-brand-text-primary"
        >
          {status === "verified" ? finalValue : "---"}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: status === "verified" ? 1 : 0.4 }}
          className="text-[10px] text-brand-text-muted uppercase tracking-wider font-semibold"
        >
          {status === "verified" ? finalSubValue : "Awaiting scan"}
        </motion.div>
      </div>
    </div>
  );
}
