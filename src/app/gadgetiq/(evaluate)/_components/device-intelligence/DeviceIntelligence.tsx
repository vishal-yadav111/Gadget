"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";
import { 
  Battery, 
  Smartphone, 
  Camera, 
  Cpu, 
  Wifi, 
  Volume2, 
  Usb, 
  Keyboard, 
  ShieldCheck, 
  ArrowRight
} from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

interface CategoryDetail {
  key: string;
  label: string;
  desc: string;
  icon: any;
  status: string;
  score: string;
  details: { label: string; value: string }[];
}

export default function DeviceIntelligence() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const categories: CategoryDetail[] = [
    {
      key: "display",
      label: "Display & Touch",
      desc: "Check screen and touch functionality.",
      icon: Smartphone,
      status: "Verified",
      score: "100%",
      details: [
        { label: "Pixel Calibration", value: "100% nominal" },
        { label: "Touch Latency", value: "4ms (verified)" },
        { label: "Multi-Touch Test", value: "Passed" },
        { label: "Refresh Rate", value: "Stable" },
      ],
    },
    {
      key: "battery",
      label: "Battery",
      desc: "Review battery health and relevant battery information.",
      icon: Battery,
      status: "Optimal",
      score: "94%",
      details: [
        { label: "Health Score", value: "94% (Max)" },
        { label: "Charging Speed", value: "Optimal" },
        { label: "Temperature", value: "31°C (Normal)" },
        { label: "Cycle Count", value: "184 cycles" },
      ],
    },
    {
      key: "camera",
      label: "Camera",
      desc: "Check supported front and rear camera functions.",
      icon: Camera,
      status: "Calibrated",
      score: "98%",
      details: [
        { label: "Rear Lenses", value: "Checked" },
        { label: "Front Sensor", value: "Passed" },
        { label: "OIS Status", value: "Nominal" },
        { label: "Autofocus Speed", value: "0.15s (passed)" },
      ],
    },
    {
      key: "audio",
      label: "Audio",
      desc: "Test speakers, microphone and supported audio functions.",
      icon: Volume2,
      status: "Verified",
      score: "100%",
      details: [
        { label: "Stereo Speakers", value: "Balanced" },
        { label: "Microphone Array", value: "Clear" },
        { label: "Audio Latency", value: "Low (nominal)" },
        { label: "Frequency Range", value: "Passed" },
      ],
    },
    {
      key: "connectivity",
      label: "Connectivity",
      desc: "Check Wi-Fi, Bluetooth and supported network functions.",
      icon: Wifi,
      status: "Stable",
      score: "97%",
      details: [
        { label: "Wi-Fi Module", value: "Passed" },
        { label: "Bluetooth 5.3", value: "Stable" },
        { label: "Cellular Baseband", value: "Nominal" },
        { label: "GPS / Location", value: "Aligned" },
      ],
    },
    {
      key: "ports",
      label: "Ports & Charging",
      desc: "Test supported ports, USB and charging functions.",
      icon: Usb,
      status: "Nominal",
      score: "96%",
      details: [
        { label: "USB-C Port State", value: "Clean" },
        { label: "Data Pin Transfer", value: "480MB/s (passed)" },
        { label: "PD Charging", value: "Verified (20W)" },
        { label: "Headphone Jack", value: "Passed" },
      ],
    },
    {
      key: "keyboard",
      label: "Keyboard & Touchpad",
      desc: "Check essential input functions on supported laptops.",
      icon: Keyboard,
      status: "Verified",
      score: "100%",
      details: [
        { label: "Key Matrix Map", value: "No stuck keys" },
        { label: "Backlight LED", value: "Functional" },
        { label: "Touchpad Gestures", value: "Passed" },
        { label: "Click Resistance", value: "Nominal" },
      ],
    },
    {
      key: "hardware",
      label: "Hardware",
      desc: "Capture relevant processor, RAM, storage and system information.",
      icon: Cpu,
      status: "Optimized",
      score: "99%",
      details: [
        { label: "Silicon Health", value: "No throttling" },
        { label: "RAM Cache Level", value: "100% verified" },
        { label: "Storage Sectors", value: "0 bad blocks" },
        { label: "PCIe Bus Lanes", value: "Nominal" },
      ],
    },
    {
      key: "sensors",
      label: "Sensors & Device Functions",
      desc: "Check supported sensors, buttons, biometrics and other functions.",
      icon: ShieldCheck,
      status: "Secure",
      score: "99%",
      details: [
        { label: "Biometric ID", value: "Enrolled & Passed" },
        { label: "IMU / Gyroscope", value: "Passed" },
        { label: "Volume Buttons", value: "Functional" },
        { label: "Lid Sensor", value: "Passed" },
      ],
    },
  ];

  return (
    <section id="what-we-check" className="relative py-24 px-6 md:px-12 bg-brand-bg-light overflow-hidden z-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,90,31,0.03),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <SectionHeading
          eyebrow="WHAT WE CHECK"
          title="Check more than whether the device turns on."
          subtitle="Gadget Evaluate can assess supported functional areas across laptops, mobile devices and other supported electronics."
        />

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">
          {categories.map((cat, index) => {
            const isHovered = hoveredIndex === index;
            const Icon = cat.icon;

            return (
              <TiltCard
                key={cat.key}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative rounded-2xl border border-brand-border/60 bg-brand-bg-deep p-6 h-[240px] flex flex-col justify-between overflow-hidden group cursor-pointer transition-colors duration-500 hover:border-brand-accent/40 shadow-xl hover:shadow-2xl"
              >
                {/* Animated diagnostic vector path */}
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden opacity-10 pointer-events-none z-0">
                  <svg className="w-full h-full text-brand-accent" viewBox="0 0 100 100">
                    <line x1="100" y1="0" x2="30" y2="70" stroke="currentColor" strokeWidth="1" />
                    <circle cx="30" cy="70" r="3" fill="currentColor" />
                    <line x1="30" y1="70" x2="0" y2="70" stroke="currentColor" strokeWidth="1" />
                    {isHovered && (
                      <motion.circle
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                        r="2"
                        fill="#0052CC"
                        style={{
                          offsetPath: "path('M 100 0 L 30 70 L 0 70')",
                        }}
                      />
                    )}
                  </svg>
                </div>

                {/* Static Layout: Icon & Label */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="p-3 rounded-xl bg-brand-bg-light border border-white/10 group-hover:border-brand-accent/50 group-hover:bg-brand-accent/5 transition-all duration-300">
                    <Icon className="w-5 h-5 text-brand-text-secondary group-hover:text-brand-accent transition-colors" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-brand-text-muted font-bold tracking-widest uppercase">
                      STATUS
                    </span>
                    <p className="text-xs font-semibold text-brand-success mt-0.5">{cat.status}</p>
                  </div>
                </div>

                {/* Bottom section: Dynamic Detail Shift */}
                <div className="relative z-10 overflow-hidden flex-1 flex flex-col justify-end mt-4">
                  {/* Default State Content */}
                  <motion.div
                    animate={{
                      y: isHovered ? -80 : 0,
                      opacity: isHovered ? 0 : 1,
                    }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="flex justify-between items-end w-full"
                  >
                    <div className="pr-4">
                      <h4 className="text-base font-bold text-brand-text-primary tracking-tight">
                        {cat.label}
                      </h4>
                      <p className="text-[11px] text-brand-text-secondary mt-1 font-light leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>
                    <span className="text-2xl font-extrabold font-mono text-brand-text-muted/20 group-hover:text-brand-accent/30 transition-colors">
                      {cat.score}
                    </span>
                  </motion.div>

                  {/* Expanded Hover State Details */}
                  <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{
                      y: isHovered ? 0 : 80,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-2 text-[11px]"
                  >
                    {cat.details.map((detail) => (
                      <div key={detail.label} className="flex flex-col border-l border-white/10 pl-2">
                        <span className="text-[9px] uppercase tracking-wider text-brand-text-muted">
                          {detail.label}
                        </span>
                        <span className="font-semibold text-brand-text-primary mt-0.5 font-mono truncate">
                          {detail.value}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </TiltCard>
            );
          })}
        </div>

        {/* Note / Disclaimer */}
        <p className="text-xs text-brand-text-muted italic mt-8 text-center">
          Available tests vary by device and diagnostic profile.
        </p>

        {/* Bottom CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12 relative z-10">
          <MagneticButton
            href="#results"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-white font-bold text-sm shadow-xl shadow-brand-btn-orange/25 hover:shadow-brand-btn-orange/55 flex items-center justify-center space-x-2 border border-brand-btn-orange/30 group transition-all duration-300 btn-shimmer"
          >
            <span>View Sample Certificate</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>

          <MagneticButton
            href="#how-it-works"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/[0.02] hover:bg-white/[0.06] text-brand-text-primary border border-white/10 hover:border-white/20 font-bold text-sm transition-colors duration-200"
          >
            Test List
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

