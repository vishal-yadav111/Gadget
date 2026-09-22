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
} from "lucide-react";
import { QCCertificateData } from "@/lib/qc-api/types";

interface Props {
  data: QCCertificateData;
}

export default function CertificatePage3({ data }: Props) {
  const specs = data.specs;

  return (
    <div className="cert-page rounded-2xl border border-[#DDE4F3] p-5 sm:p-7 shadow-lg relative bg-white">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logoblack.png"
              alt="GadgetIQ"
              className="h-6 w-auto object-contain max-w-[120px]"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = document.getElementById("giq-fallback-logo-gen3");
                if (fallback) fallback.style.display = "inline";
              }}
            />
            <span id="giq-fallback-logo-gen3" className="hidden text-base font-black tracking-tight text-[#17284D]">
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
            Technical specification
          </h2>
          <p className="text-[11px] text-[#5F6A86]">
            Values resolved from device firmware and verified against manufacturer reference data.
          </p>
        </div>

        {/* 9 Spec Cards (3x3 Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-3.5">
          {/* 1. Processor */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Cpu className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Processor
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {specs.processor.name}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Architecture</span>
                <span className="text-[#17284D] font-medium">{specs.processor.architecture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Cores / threads</span>
                <span className="text-[#17284D] font-medium">{specs.processor.cores}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Max clock</span>
                <span className="text-[#17284D] font-medium">{specs.processor.maxClock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Vendor</span>
                <span className="text-[#17284D] font-medium">{specs.processor.vendor}</span>
              </div>
            </div>
          </div>

          {/* 2. Graphics */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Graphics
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs line-clamp-1">
              {specs.graphics.name}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Type</span>
                <span className="text-[#17284D] font-medium">{specs.graphics.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Allocated memory</span>
                <span className="text-[#17284D] font-medium">{specs.graphics.allocatedMemory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Discrete GPU</span>
                <span className="text-[#17284D] font-medium">{specs.graphics.discreteGpu}</span>
              </div>
            </div>
          </div>

          {/* 3. Memory */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Memory
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs">
              {specs.memory.capacity} {specs.memory.type}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Speed</span>
                <span className="text-[#17284D] font-medium">{specs.memory.speed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Module vendor</span>
                <span className="text-[#17284D] font-medium">{specs.memory.vendor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Part number</span>
                <span className="text-[#17284D] font-mono text-[9px]">{specs.memory.partNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Upgradeable</span>
                <span className="text-[#17284D] font-medium">{specs.memory.upgradeable}</span>
              </div>
            </div>
          </div>

          {/* 4. Storage */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <HardDrive className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Storage
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs">
              {specs.storage.capacity} {specs.storage.type}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Model</span>
                <span className="text-[#17284D] font-medium">{specs.storage.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Interface</span>
                <span className="text-[#17284D] font-medium">{specs.storage.interface}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">SMART status</span>
                <span className="text-emerald-700 font-bold">{specs.storage.smartStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Wear level</span>
                <span className="text-emerald-700 font-bold">{specs.storage.wearLevel}</span>
              </div>
            </div>
          </div>

          {/* 5. Display */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Display
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs">
              {specs.display.size} {specs.display.panel}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Resolution</span>
                <span className="text-[#17284D] font-medium">{specs.display.resolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Refresh rate</span>
                <span className="text-[#17284D] font-medium">{specs.display.refreshRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Aspect ratio</span>
                <span className="text-[#17284D] font-medium">{specs.display.aspectRatio}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Touchscreen</span>
                <span className="text-[#17284D] font-medium">{specs.display.touchscreen}</span>
              </div>
            </div>
          </div>

          {/* 6. Battery */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <BatteryCharging className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Battery
              </span>
            </div>
            <p className="font-bold text-emerald-700 text-xs">
              {specs.battery.health}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Capacity</span>
                <span className="text-[#17284D] font-medium">{specs.battery.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Cycle count</span>
                <span className="text-[#17284D] font-medium">{specs.battery.cycleCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Cells</span>
                <span className="text-[#17284D] font-medium">{specs.battery.cells}</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, data.batteryHealthPercentage)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* 7. Network */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Network
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs">
              {specs.network.wifi}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Wi-Fi MAC</span>
                <span className="font-mono text-[9px] text-[#17284D]">{specs.network.wifiMac}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Bluetooth MAC</span>
                <span className="font-mono text-[9px] text-[#17284D]">{specs.network.bluetoothMac}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Wired Ethernet</span>
                <span className="text-[#17284D] font-medium">{specs.network.wiredEthernet}</span>
              </div>
            </div>
          </div>

          {/* 8. Operating System */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <FileCheck className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Operating System
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs">
              {specs.operatingSystem.name}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Publisher</span>
                <span className="text-[#17284D] font-medium">{specs.operatingSystem.publisher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Licence status</span>
                <span className="text-emerald-700 font-bold">{specs.operatingSystem.licenceStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Install type</span>
                <span className="text-[#17284D] font-medium">{specs.operatingSystem.installType}</span>
              </div>
            </div>
          </div>

          {/* 9. Firmware */}
          <div className="p-2.5 rounded-xl bg-white border border-[#DDE4F3] text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-[#0052CC]">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86]">
                Firmware
              </span>
            </div>
            <p className="font-bold text-[#17284D] text-xs">
              {specs.firmware.biosVersion}
            </p>
            <div className="space-y-0.5 text-[9.5px] pt-1 border-t border-[#EEF2F6]">
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Board</span>
                <span className="text-[#17284D] font-medium">{specs.firmware.board}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">Secure Boot</span>
                <span className="text-emerald-700 font-bold">{specs.firmware.secureBoot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F6A86]">TPM</span>
                <span className="text-[#17284D] font-medium">{specs.firmware.tpm}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Consumable Component Health */}
        <div className="mb-3">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#5F6A86] block mb-2">
            Consumable Component Health
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Battery Health */}
            <div className="p-3 rounded-xl bg-white border border-[#DDE4F3]">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-1.5">
                  <BatteryCharging className="w-3.5 h-3.5 text-[#0052CC]" />
                  <span className="text-[9.5px] font-bold uppercase text-[#5F6A86]">Battery</span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                  Good
                </span>
              </div>
              <div className="flex items-baseline space-x-2 my-0.5">
                <span className="text-xl font-black text-[#17284D]">
                  {data.batteryHealthPercentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden my-1.5">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, data.batteryHealthPercentage)}%` }}
                ></div>
              </div>
              <p className="text-[9.5px] text-[#5F6A86]">
                Retains {data.batteryRemainingCapacity} of {data.batteryDesignCapacity} design capacity after {data.batteryCycleCount} cycles. (Pass threshold 80%)
              </p>
            </div>

            {/* SSD / Flash Storage Endurance */}
            <div className="p-3 rounded-xl bg-white border border-[#DDE4F3]">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center space-x-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#0052CC]" />
                  <span className="text-[9.5px] font-bold uppercase text-[#5F6A86]">
                    {data.deviceType === "laptop" ? "SSD Endurance" : "NAND Flash Health"}
                  </span>
                </div>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                  Healthy
                </span>
              </div>
              <div className="flex items-baseline space-x-2 my-0.5">
                <span className="text-xl font-black text-[#17284D]">
                  {data.ssdEnduranceUsedPercentage}% used
                </span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden my-1.5">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${100 - data.ssdEnduranceUsedPercentage}%` }}
                ></div>
              </div>
              <p className="text-[9.5px] text-[#5F6A86]">
                {100 - data.ssdEnduranceUsedPercentage}% of rated write endurance remains. No reallocated sectors. (Pass threshold 90% remaining)
              </p>
            </div>
          </div>
        </div>

        {/* Not Fitted on this configuration */}
        <div className="p-3 rounded-xl bg-[#F8FAFC] border-l-4 border-[#0052CC] border-t border-r border-b border-[#DDE4F3] text-xs">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-[#17284D] block mb-0.5">
            Not Fitted On This Configuration
          </span>
          <p className="font-bold text-[#334155] text-[10px] mb-0.5">
            {data.notFittedList.join(" · ")}
          </p>
          <p className="text-[9px] text-[#5F6A86] leading-tight">
            Absent hardware is reported once here rather than as repeated specification rows. Tests for these components are marked N/A, not failed.
          </p>
        </div>

        <p className="text-[8px] text-[#8C98A9] mt-2 leading-tight">
          Component serial numbers, unmasked network identifiers and per-module memory detail are recorded in Appendix A, available on the audit copy of this certificate.
        </p>
      </div>

      {/* Page 3 Footer */}
      <div className="mt-3 pt-2 border-t border-[#EEF2F6] flex items-center justify-between text-[8px] text-[#8C98A9]">
        <span>
          XtraCover Technologies Pvt Ltd · Facility IN-DEL-04, New Delhi · CIN U72900DL2019PTC356104 · support@xtracover.com
        </span>
        <span>
          Certificate {data.certificateNumber} · Page 3 of 4 · Verify at xtracover.com/verify
        </span>
      </div>
    </div>
  );
}
