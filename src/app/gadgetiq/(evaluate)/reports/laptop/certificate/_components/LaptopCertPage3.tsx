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
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { FormattedLaptopCertificateData } from "../laptopCertAdapter";

interface Props {
  data: FormattedLaptopCertificateData;
}

export default function LaptopCertPage3({ data }: Props) {
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
                const fallback = document.getElementById("giq-fallback-logo-p3");
                if (fallback) fallback.style.display = "inline";
              }}
            />
            <span id="giq-fallback-logo-p3" className="hidden text-base font-black tracking-tight text-[#17284D]">
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
                CPU Processor
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {specs.processor.name}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Manufacturer</span>
                <span className="text-[#17284D] font-medium">{specs.processor.vendor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Generation</span>
                <span className="text-[#17284D] font-medium">{specs.processor.architecture || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Cores</span>
                <span className="text-[#17284D] font-medium">{specs.processor.cores || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Max Clock</span>
                <span className="text-[#17284D] font-medium">{specs.processor.maxClock || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* 2. Motherboard & Firmware */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Motherboard & BIOS
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {specs.motherboard.manufacturer} {specs.motherboard.product}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Product Model</span>
                <span className="text-[#17284D] font-medium">{specs.motherboard.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Board Serial</span>
                <span className="font-mono text-[9px] text-[#17284D]">{specs.motherboard.serial}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">BIOS Version</span>
                <span className="font-mono text-[9px] text-[#17284D]">{specs.motherboard.bios}</span>
              </div>
            </div>
          </div>

          {/* 3. Graphics (GPU) */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                GPU Graphics
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {specs.graphics.name}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Video Processor</span>
                <span className="text-[#17284D] font-medium">{specs.graphics.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Adapter RAM</span>
                <span className="text-[#17284D] font-medium">{specs.graphics.allocatedMemory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Discrete GPU</span>
                <span className="text-[#17284D] font-medium">{specs.graphics.discreteGpu}</span>
              </div>
            </div>
          </div>

          {/* 4. Memory Modules */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Memory ({specs.memory.capacity} · {specs.memory.sticks})
              </span>
            </div>
            {specs.memory.modules.length > 0 ? (
              <div className="space-y-1 pt-0.5 border-t border-[#EEF2F6] text-[9.5px]">
                {specs.memory.modules.map((mod, idx) => (
                  <div key={idx} className="bg-[#F8FAFC] p-1.5 rounded-lg border border-slate-200 space-y-0.5">
                    <div className="flex justify-between font-bold text-[#17284D]">
                      <span>{mod.slot}: {mod.manufacturer} {mod.capacity}</span>
                      <span>{mod.speed}</span>
                    </div>
                    <div className="flex justify-between text-[#5F6A86] text-[8.5px]">
                      <span>Type: {mod.type}</span>
                      <span>Part: <strong className="font-mono text-[#17284D]">{mod.partNumber}</strong></span>
                    </div>
                    <div className="text-[#5F6A86] text-[8.5px]">
                      Serial: <strong className="font-mono text-[#17284D]">{mod.serial}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-[#5F6A86]">{specs.memory.capacity}</p>
            )}
          </div>

          {/* 5. Storage Devices */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <HardDrive className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Storage ({specs.storage.diskCount})
              </span>
            </div>
            {specs.storage.disks.length > 0 ? (
              <div className="space-y-1 pt-0.5 border-t border-[#EEF2F6] text-[9.5px]">
                {specs.storage.disks.map((d, idx) => (
                  <div key={idx} className="bg-[#F8FAFC] p-1.5 rounded-lg border border-slate-200 space-y-0.5">
                    <div className="font-bold text-[#17284D] truncate">
                      {d.diskIndex}: {d.model}
                    </div>
                    <div className="flex justify-between text-[#5F6A86] text-[8.5px]">
                      <span>Capacity: <strong className="text-[#17284D]">{d.size}</strong></span>
                    </div>
                    <div className="text-[#5F6A86] text-[8.5px] truncate">
                      Serial: <strong className="font-mono text-[#17284D]">{d.serial}</strong>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-[#17284D]">{specs.storage.capacity}</p>
            )}
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
              {specs.operatingSystem.name}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Publisher</span>
                <span className="text-[#17284D] font-medium">{specs.operatingSystem.publisher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">License Status</span>
                <span className="text-emerald-700 font-bold">{specs.operatingSystem.licenceStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Engine Version</span>
                <span className="font-mono text-[8.5px] text-[#17284D] truncate max-w-[150px]">{specs.operatingSystem.version}</span>
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
                {specs.battery.batteryHealth}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div>
                <span className="text-[#5F6A86] block text-[8.5px]">Manufacturer:</span>
                <span className="font-bold text-[#17284D]">{specs.battery.manufacturer}</span>
              </div>
              <div>
                <span className="text-[#5F6A86] block text-[8.5px]">Serial Number:</span>
                <span className="font-mono text-[#17284D] text-[9px]">{specs.battery.serialNumber}</span>
              </div>
              <div>
                <span className="text-[#5F6A86] block text-[8.5px]">Designed Capacity:</span>
                <span className="font-bold text-[#17284D]">{specs.battery.designedCapacity}</span>
              </div>
              <div>
                <span className="text-[#5F6A86] block text-[8.5px]">Remaining Capacity:</span>
                <span className="font-bold text-[#17284D]">{specs.battery.remainingCapacity}</span>
              </div>
              <div>
                <span className="text-[#5F6A86] block text-[8.5px]">Cycle Count:</span>
                <span className="font-bold text-[#17284D]">{specs.battery.cycleCount} cycles</span>
              </div>
              <div>
                <span className="text-[#5F6A86] block text-[8.5px]">Cells & Est. Charge:</span>
                <span className="font-bold text-[#17284D]">{specs.battery.numberOfCells} Cells ({specs.battery.estimatedChargeRemaining})</span>
              </div>
            </div>
          </div>

          {/* Peripherals: Keyboard, Camera, Audio */}
          <div className="p-3 rounded-xl bg-white border border-[#DDE4F3] space-y-1.5 shadow-2xs">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Keyboard className="w-4 h-4" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Peripherals & Input Devices
              </span>
            </div>
            <div className="space-y-1 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Keyboard:</span>
                <span className="font-semibold text-[#17284D] text-right max-w-[220px] truncate">
                  {specs.peripherals.keyboard.name} ({specs.peripherals.keyboard.functionKeys} Fn Keys)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Camera:</span>
                <span className="font-semibold text-[#17284D] text-right truncate">
                  {specs.peripherals.camera.name} ({specs.peripherals.camera.manufacturer})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Audio Device:</span>
                <span className="font-semibold text-[#17284D] text-right truncate">
                  {specs.peripherals.audio.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Display Size:</span>
                <span className="font-semibold text-[#17284D]">{specs.display.size || "Standard"}</span>
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
              <span className="font-bold text-[#17284D] block truncate">{specs.network.wifi.name}</span>
              <span className="font-mono text-[#0052CC] text-[9px] block mt-0.5">{specs.network.wifi.mac}</span>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-lg border border-slate-200">
              <span className="text-[8.5px] text-[#5F6A86] block font-bold uppercase">Bluetooth Adapter</span>
              <span className="font-bold text-[#17284D] block truncate">{specs.network.bluetooth.name}</span>
              <span className="font-mono text-[#0052CC] text-[9px] block mt-0.5">{specs.network.bluetooth.mac}</span>
            </div>
            <div className="bg-[#F8FAFC] p-2 rounded-lg border border-slate-200">
              <span className="text-[8.5px] text-[#5F6A86] block font-bold uppercase">Wired Ethernet</span>
              <span className="font-bold text-[#17284D] block truncate">{specs.network.ethernet.name}</span>
              <span className="font-mono text-[#5F6A86] text-[9px] block mt-0.5">{specs.network.ethernet.mac}</span>
            </div>
          </div>
        </div>

        {/* Absent / Unfitted Hardware dynamically generated from JSON */}
        {specs.absentHardware && specs.absentHardware.length > 0 && (
          <div className="p-2 rounded-xl bg-[#F8FAFC] border-l-3 border-[#0052CC] border border-[#DDE4F3] mb-3 text-[9px]">
            <span className="font-extrabold uppercase text-[#17284D] block text-[8px]">
              Not Fitted / Not Applicable on this Configuration
            </span>
            <p className="font-bold text-[#17284D] text-[9px] mt-0.5">
              {specs.absentHardware.join(" · ")}
            </p>
          </div>
        )}
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
