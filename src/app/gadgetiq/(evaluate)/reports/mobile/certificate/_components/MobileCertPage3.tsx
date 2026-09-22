"use client";

import React from "react";
import {
  Cpu,
  Monitor,
  HardDrive,
  Camera,
  BatteryCharging,
  Wifi,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { FormattedMobileCertificateData } from "../mobileCertAdapter";

interface Props {
  data: FormattedMobileCertificateData;
}

export default function MobileCertPage3({ data }: Props) {
  return (
    <div className="cert-page rounded-2xl border border-[#DDE4F3] p-5 sm:p-7 shadow-lg relative bg-white flex flex-col justify-between">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logoblack.png"
              alt="GadgetIQ"
              className="h-6 w-auto object-contain max-w-[120px]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = document.getElementById("giq-fallback-logo-mb3");
                if (fallback) fallback.style.display = "inline";
              }}
            />
            <span id="giq-fallback-logo-mb3" className="hidden text-base font-black tracking-tight text-[#17284D]">
              GADGET<span className="text-[#0052CC]">IQ</span>
            </span>
            <span className="text-xs text-[#8C98A9]">·</span>
            <span className="text-xs font-bold text-[#5F6A86]">Hardware Diagnostics</span>
          </div>
          <span className="text-[11px] font-mono text-[#5F6A86]">
            {data.certificateNumber} · {data.deviceBrand} {data.deviceModel}
          </span>
        </div>

        {/* Title */}
        <div className="my-3">
          <h2 className="text-xl font-black text-[#17284D] tracking-tight">
            Technical Subsystems & Specifications
          </h2>
          <p className="text-[11px] text-[#5F6A86]">
            Hardware diagnostic specifications extracted directly from device firmware
          </p>
        </div>

        {/* Specifications Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
          {/* 1. Processor & SoC */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC] font-bold text-[10.5px] uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>Processor & SoC</span>
            </div>
            <div className="pt-1 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Core Count:</span>
                <span className="font-bold text-[#17284D]">{data.specs.processor.cores}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Device Category:</span>
                <span className="font-semibold text-[#17284D]">{data.deviceCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Architecture:</span>
                <span className="font-semibold text-[#17284D]">{data.specs.processor.architecture}</span>
              </div>
            </div>
          </div>

          {/* 2. Display */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC] font-bold text-[10.5px] uppercase tracking-wider">
              <Monitor className="w-3.5 h-3.5" />
              <span>Display & Digitizer</span>
            </div>
            <div className="pt-1 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Screen Size:</span>
                <span className="font-bold text-[#17284D]">{data.specs.display.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Touch Digitizer:</span>
                <span className="font-semibold text-[#17284D]">{data.specs.display.touchscreen}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Pixel Test:</span>
                <span className="font-semibold text-[#17284D]">{data.specs.display.deadPixels}</span>
              </div>
            </div>
          </div>

          {/* 3. Memory & Storage */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC] font-bold text-[10.5px] uppercase tracking-wider">
              <HardDrive className="w-3.5 h-3.5" />
              <span>Memory & Flash Storage</span>
            </div>
            <div className="pt-1 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">RAM Capacity:</span>
                <span className="font-bold text-[#17284D]">{data.specs.memory.ram}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Storage Capacity:</span>
                <span className="font-bold text-[#17284D]">{data.specs.memory.storage}</span>
              </div>
            </div>
          </div>

          {/* 4. Cameras */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC] font-bold text-[10.5px] uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Sensors</span>
            </div>
            <div className="pt-1 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Rear Primary Camera:</span>
                <span className="font-bold text-[#17284D]">{data.specs.cameras.rearCamera}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Front Camera:</span>
                <span className="font-semibold text-[#17284D]">{data.specs.cameras.frontCamera}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Flash Module:</span>
                <span className="font-semibold text-[#17284D]">{data.specs.cameras.flash}</span>
              </div>
            </div>
          </div>

          {/* 5. Battery Telemetry */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC] font-bold text-[10.5px] uppercase tracking-wider">
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>Battery & Charging Telemetry</span>
            </div>
            <div className="pt-1 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Health Percentage:</span>
                <span className="font-bold text-emerald-700">{data.batteryHealthPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Battery Capacity:</span>
                <span className="font-semibold text-[#17284D]">{data.batteryCapacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Stress Test:</span>
                <span className="font-semibold text-[#17284D]">{data.batteryStressTest}</span>
              </div>
            </div>
          </div>

          {/* 6. Wireless & Cellular */}
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] space-y-1 text-xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC] font-bold text-[10.5px] uppercase tracking-wider">
              <Wifi className="w-3.5 h-3.5" />
              <span>Wireless & Baseband</span>
            </div>
            <div className="pt-1 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Wi-Fi & Bluetooth:</span>
                <span className="font-semibold text-[#17284D]">{data.specs.connectivity.wifi} · {data.specs.connectivity.bluetooth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">SIM 1 Status:</span>
                <span className="font-semibold text-[#17284D]">{data.specs.connectivity.sim1Status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">SIM 2 Status:</span>
                <span className="font-semibold text-[#17284D]">{data.specs.connectivity.sim2Status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Erasure & Compliance Box */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50/70 to-blue-50/70 border border-emerald-300/60 mb-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
                NIST SP 800-88 Rev. 1 Cryptographic Data Sanitisation
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[9px] font-bold">
              VERIFIED CLEAN
            </span>
          </div>
          <p className="text-[9px] text-slate-600 leading-relaxed">
            This certifies that user account locks, biometric profiles, and private storage have been sanitized according to NIST SP 800-88 Rev. 1 standards.
            The device has been reset and verified on the GadgetIQ Diagnostic Platform.
          </p>
        </div>

        {/* Warranty Terms & Conditions */}
        <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] space-y-1 text-[9px] text-[#5F6A86]">
          <span className="font-bold uppercase text-[#17284D] block text-[9.5px]">
            Warranty Coverage & Terms
          </span>
          <p className="leading-relaxed">
            This certificate confirms the diagnostic state of the hardware as tested by the diagnostic engine. Quote certificate number <strong className="font-mono text-[#0052CC]">{data.certificateNumber}</strong> for verification or warranty claims.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#DDE4F3] mt-3 flex items-center justify-between text-[8px] text-[#8C98A9]">
        <span>
          GadgetIQ Enterprise Hardware Diagnostics · QC Audit System
        </span>
        <span className="font-mono">
          Certificate {data.certificateNumber} · Page 3 of 3
        </span>
      </div>
    </div>
  );
}
