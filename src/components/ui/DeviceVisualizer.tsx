"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert, Cpu, Battery, Smartphone, Wifi, Camera } from "lucide-react";

export default function DeviceVisualizer() {
  const diagnosticNodes = [
    { name: "Battery Health", value: "94% (Excellent)", icon: Battery, status: "healthy" },
    { name: "CPU Performance", value: "Optimized", icon: Cpu, status: "healthy" },
    { name: "Display Calibration", value: "Verified", icon: Smartphone, status: "healthy" },
    { name: "Camera Matrix", value: "Calibrated", icon: Camera, status: "healthy" },
    { name: "Wireless Signal", value: "5G Nominal", icon: Wifi, status: "healthy" },
  ];

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] flex items-center justify-center p-4">
      {/* Background soft lighting glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/10 to-brand-accent-highlight/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Outer Floating Framework (Depth Layer 1) */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotateX: [12, 10, 12],
          rotateY: [-15, -12, -15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformStyle: "preserve-3d", perspective: 1000 }}
        className="relative w-[280px] h-[520px] rounded-[40px] border border-white/10 bg-black/40 backdrop-blur-md shadow-2xl p-3 flex flex-col justify-between"
      >
        {/* Dynamic Scanning Line */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent shadow-[0_0_15px_var(--brand-primary)] animate-scan-line pointer-events-none z-10" />

        {/* Dynamic Scan Overlay */}
        <div className="absolute inset-0 overflow-hidden rounded-[38px] pointer-events-none z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,82,204,0.05)_50%,transparent_50%)] bg-[size:100%_4px] opacity-40" />
        </div>

        {/* Top Camera Notch */}
        <div className="w-24 h-4 bg-brand-bg-deep rounded-full mx-auto border border-white/5 flex items-center justify-center relative z-20">
          <div className="w-2 h-2 rounded-full bg-blue-500/50" />
        </div>

        {/* Screen Content (Depth Layer 2) */}
        <div className="flex-1 flex flex-col justify-between py-6 px-4 relative z-10">
          {/* Header Stats */}
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <div>
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider">Device ID</span>
              <p className="text-xs text-brand-text-primary font-mono">IPH-15PRO-87X</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-brand-text-muted uppercase tracking-wider">Status</span>
              <p className="text-xs text-brand-success font-medium flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse" />
                <span>Scanning</span>
              </p>
            </div>
          </div>

          {/* Central Scoring Wheel */}
          <div className="my-auto flex flex-col items-center justify-center relative">
            {/* Pulsing radar lines */}
            <div className="absolute w-36 h-36 rounded-full border border-brand-accent/20 animate-radar pointer-events-none" />
            <div className="absolute w-36 h-36 rounded-full border border-brand-accent-highlight/10 animate-radar [animation-delay:1.5s] pointer-events-none" />

            <div className="w-28 h-28 rounded-full border border-white/5 bg-brand-bg-deep/80 flex flex-col items-center justify-center relative shadow-lg shadow-black/50">
              <span className="text-4xl font-extrabold tracking-tight text-gradient-accent">94</span>
              <span className="text-[9px] uppercase tracking-widest text-brand-text-muted font-semibold mt-1">
                HEALTH SCORE
              </span>
            </div>
            <span className="text-xs font-semibold text-brand-success mt-4 bg-brand-success/10 px-3 py-1 rounded-full border border-brand-success/20">
              EXCELLENT CONDITION
            </span>
          </div>

          {/* Diagnostics Log Output */}
          <div className="space-y-2.5">
            {diagnosticNodes.slice(0, 3).map((node, i) => (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.4 }}
                key={node.name}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center space-x-2">
                  <node.icon className="w-3.5 h-3.5 text-brand-accent" />
                  <span className="text-[11px] text-brand-text-secondary">{node.name}</span>
                </div>
                <span className="text-[11px] text-brand-text-primary font-mono font-medium">
                  {node.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom indicator bar */}
        <div className="w-20 h-1 bg-white/20 rounded-full mx-auto mb-1 relative z-20" />
      </motion.div>

      {/* Floating Info Panels (Depth Layer 3 - Offset in Z/X) */}
      <motion.div
        animate={{
          y: [0, 8, 0],
          x: [0, -4, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute top-1/2 -right-4 translate-y-[-120%] w-44 p-3 rounded-2xl glass-panel shadow-2xl border border-white/10 z-20 pointer-events-none"
      >
        <div className="flex items-center space-x-2 text-brand-success">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-semibold text-brand-text-primary">Display Calibrated</span>
        </div>
        <p className="text-[10px] text-brand-text-muted mt-1">
          Pixel mapping: 100% nominal. Touch response latency: 4ms.
        </p>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -8, 0],
          x: [0, 4, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute bottom-10 -left-6 w-44 p-3 rounded-2xl glass-panel shadow-2xl border border-white/10 z-20 pointer-events-none"
      >
        <div className="flex items-center space-x-2 text-brand-accent-highlight">
          <Cpu className="w-4 h-4" />
          <span className="text-xs font-semibold text-brand-text-primary">Diag Complete</span>
        </div>
        <p className="text-[10px] text-brand-text-muted mt-1">
          Smart scan verified 182 distinct hardware endpoints.
        </p>
      </motion.div>
    </div>
  );
}
