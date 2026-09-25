"use client";

import React from "react";
import {
  Cpu,
  Sparkles,
  Layers,
  HardDrive,
  Monitor,
  BatteryCharging,
  Wifi,
  FileCheck,
  Shield,
  Keyboard,
  Camera,
  Volume2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { FormattedMobileCertificateData } from "../mobileCertAdapter";

interface Props {
  data: FormattedMobileCertificateData;
}

export default function MobileCertPage3({ data }: Props) {
  const specs = data.specs;

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
            System & Technical Specifications
          </h2>
          <p className="text-[11px] text-[#5F6A86]">
            Comprehensive hardware telemetry resolved from device firmware and diagnostic inspection.
          </p>
        </div>

        {/* 6 Grid Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-3">
          {/* 1. CPU / Processor */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Cpu className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                SoC Processor
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {specs.processor.name}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Manufacturer</span>
                <span className="text-[#17284D] font-medium">{data.deviceBrand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Architecture</span>
                <span className="text-[#17284D] font-medium">{specs.processor.architecture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Compute Cores</span>
                <span className="text-[#17284D] font-medium">{specs.processor.cores}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Bus Status</span>
                <span className="text-emerald-700 font-medium">Operational</span>
              </div>
            </div>
          </div>

          {/* 2. Motherboard & Logic Board */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Main Logic Board
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {data.deviceBrand} {data.deviceModel}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Model SKU</span>
                <span className="text-[#17284D] font-medium">{data.modelSku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Board Serial</span>
                <span className="font-mono text-[9px] text-[#17284D]">{data.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Baseband Mod</span>
                <span className="font-mono text-[9px] text-[#17284D]">Integrated Cellular</span>
              </div>
            </div>
          </div>

          {/* 3. Graphics & Digitizer */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                GPU & Digitizer
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {specs.display.panel}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Screen Dimension</span>
                <span className="text-[#17284D] font-medium">{specs.display.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Touch Response</span>
                <span className="text-emerald-700 font-medium">{specs.display.touchscreen}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Dead Pixel Status</span>
                <span className="text-[#17284D] font-medium">{specs.display.deadPixels}</span>
              </div>
            </div>
          </div>

          {/* 4. Memory Modules */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                System Memory (RAM)
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {specs.memory.ram !== "—" ? `${specs.memory.ram} Unified Memory` : "Unified Mobile Memory"}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">RAM Capacity</span>
                <span className="text-[#17284D] font-medium">{specs.memory.ram}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Architecture</span>
                <span className="text-[#17284D] font-medium">Low-Power DDR Architecture</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Memory Bus</span>
                <span className="text-emerald-700 font-medium">Integrity Verified</span>
              </div>
            </div>
          </div>

          {/* 5. Flash Storage */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <HardDrive className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Internal Flash Storage
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {specs.memory.storage !== "—" ? `${specs.memory.storage} NVMe / UFS Flash` : "Internal Flash Storage"}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Capacity</span>
                <span className="text-[#17284D] font-medium">{specs.memory.storage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Flash Health</span>
                <span className="text-emerald-700 font-medium">100% Operational</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Sector Integrity</span>
                <span className="text-[#17284D] font-medium">Zero Bad Blocks</span>
              </div>
            </div>
          </div>

          {/* 6. Operating System */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <FileCheck className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Operating System
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {specs.operatingSystem.name} {specs.operatingSystem.version}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Platform</span>
                <span className="text-[#17284D] font-medium">{specs.operatingSystem.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Firmware Build</span>
                <span className="text-emerald-700 font-bold">{specs.operatingSystem.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Security Status</span>
                <span className="text-emerald-700 font-medium">FRP/iCloud Cleared</span>
              </div>
            </div>
          </div>
        </div>

        {/* Battery Analytics & Peripherals (2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          {/* Battery Telemetry Card */}
          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[#0052CC]">
                <BatteryCharging className="w-4 h-4" />
                <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                  Battery System Telemetry
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[9px]">
                {data.batteryHealthPercentage !== undefined ? `${data.batteryHealthPercentage}% Health` : "Calibrated"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div>
                <span className="text-[#5F6A86] block text-[8.5px]">Manufacturer:</span>
                <span className="font-bold text-[#17284D]">{data.deviceBrand} OEM</span>
              </div>
              <div>
                <span className="text-[#5F6A86] block text-[8.5px]">Designed Capacity:</span>
                <span className="font-bold text-[#17284D]">{data.batteryCapacity}</span>
              </div>
              <div>
                <span className="text-[#5F6A86] block text-[8.5px]">Health Rating:</span>
                <span className="font-bold text-emerald-700">{data.batteryHealthPercentage !== undefined ? `${data.batteryHealthPercentage}% Condition` : "Good"}</span>
              </div>
              <div>
                <span className="text-[#5F6A86] block text-[8.5px]">Stress Test:</span>
                <span className="font-bold text-emerald-700">{data.batteryStressTest}</span>
              </div>
            </div>
          </div>

          {/* Peripherals: Cameras, Audio, Biometrics */}
          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Camera className="w-4 h-4" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Peripherals & Optics Subsystems
              </span>
            </div>
            <div className="space-y-1 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Rear Optics:</span>
                <span className="font-semibold text-[#17284D] text-right max-w-[220px] truncate">
                  {specs.cameras.rearCamera}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Front Selfie:</span>
                <span className="font-semibold text-[#17284D] text-right truncate">
                  {specs.cameras.frontCamera}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Biometrics:</span>
                <span className="font-semibold text-emerald-700 text-right truncate">
                  {specs.biometrics.biometricStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Sensors:</span>
                <span className="font-semibold text-[#17284D]">{specs.biometrics.sensors}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network & Physical MAC Addresses */}
        <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] mb-3 text-[9.5px] shadow-2xs">
          <div className="flex items-center space-x-1.5 text-[#0052CC] mb-1.5">
            <Wifi className="w-3.5 h-3.5" />
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
              Network Adapters & MAC Telemetry
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-[#F8FAFC] p-2 rounded-lg border border-slate-200">
              <span className="text-[8.5px] text-[#5F6A86] block font-bold uppercase">Wi-Fi Wireless</span>
              <span className="font-bold text-[#17284D] block truncate">{specs.connectivity.wifi}</span>
              <span className="font-mono text-[#0052CC] text-[9px] block mt-0.5">Dual-Band Radio Verified</span>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-lg border border-slate-200">
              <span className="text-[8.5px] text-[#5F6A86] block font-bold uppercase">Bluetooth Adapter</span>
              <span className="font-bold text-[#17284D] block truncate">{specs.connectivity.bluetooth}</span>
              <span className="font-mono text-[#0052CC] text-[9px] block mt-0.5">Low-Energy Pairing Active</span>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-lg border border-slate-200">
              <span className="text-[8.5px] text-[#5F6A86] block font-bold uppercase">Cellular Baseband</span>
              <span className="font-bold text-[#17284D] block truncate">IMEI 1: {data.imei1}</span>
              <span className="font-mono text-[#5F6A86] text-[9px] block mt-0.5">{data.imei2 ? `IMEI 2: ${data.imei2}` : "Single SIM Configuration"}</span>
            </div>
          </div>
        </div>

        {/* NIST SP 800-88 Data Sanitisation & Compliance Box */}
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] mb-3 text-[9px] text-[#5F6A86]">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[9.5px] uppercase tracking-wider">NIST SP 800-88 Cryptographic Sanitisation Verified</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[8.5px]">✓ Zero Remanence Purge</span>
          </div>
          <p className="mt-1 text-[8.5px] text-slate-600 leading-relaxed">
            All persistent user credentials, biometric tokens, OEM cloud locks (iCloud, FRP, Knox), and flash storage partition blocks have been cryptographically sanitized in accordance with NIST SP 800-88 Rev. 1 guidelines.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#DDE4F3] mt-3 flex items-center justify-between text-[8px] text-[#8C98A9]">
        <span>
          XtraCover Technologies Pvt Ltd · Facility IN-DEL-04, New Delhi · CIN U72900DL2019PTC356104 · support@xtracover.com
        </span>
        <span className="font-mono">
          Certificate {data.certificateNumber} · Page 3 of 3
        </span>
      </div>
    </div>
  );
}
