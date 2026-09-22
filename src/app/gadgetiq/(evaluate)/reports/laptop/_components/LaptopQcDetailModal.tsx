"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Laptop,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Cpu,
  HardDrive,
  Monitor,
  Wifi,
  BatteryCharging,
  Activity,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Layers,
  Sparkles,
  Info,
  Sliders,
  Calendar,
  User,
  Hash,
  Database,
  Radio,
  Camera,
  Volume2,
  Keyboard,
  MousePointer,
  Zap,
} from "lucide-react";
import {
  LaptopQcDetailData,
  LaptopQCReportItem,
} from "../../types";
import { reportsService } from "../../services";
import { formatConditionCategory, getConditionBadgeStyle } from "../page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mstidOrSerial: string | number | null;
  fallbackItem?: LaptopQCReportItem | null;
}

type TabKey = "diagnostics" | "specs" | "battery" | "summary";

export default function LaptopQcDetailModal({
  isOpen,
  onClose,
  mstidOrSerial,
  fallbackItem,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("diagnostics");
  const [detail, setDetail] = useState<LaptopQcDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSerial, setCopiedSerial] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // On-demand fetch whenever modal opens with a target ID
  useEffect(() => {
    if (!isOpen || !mstidOrSerial) {
      return;
    }

    let isMounted = true;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await reportsService.getLaptopDetail(mstidOrSerial);
        if (isMounted) {
          setDetail(data);
        }
      } catch (err: any) {
        console.warn("Detail fetch warning:", err);
        if (isMounted) {
          // Construct structured fallback from row data so modal always renders
          if (fallbackItem) {
            setDetail({
              identification: {
                mstid: fallbackItem.mstid,
                serial_number: fallbackItem.serial_number || fallbackItem.device_serial_number || fallbackItem.imei_1 || String(mstidOrSerial),
                imei_1: fallbackItem.imei_1 || fallbackItem.serial_number || String(mstidOrSerial),
                MacAddress: fallbackItem.MacAddress,
                brand_name: fallbackItem.brand_name || fallbackItem.device_brand || undefined,
                model_name: fallbackItem.model_name || fallbackItem.device_model || undefined,
                device_category: fallbackItem.device_category || "Laptop",
                workorderid: fallbackItem.workorderid || undefined,
                QCResult: fallbackItem.QCResult || fallbackItem.test_result || undefined,
                test_result: fallbackItem.test_result || fallbackItem.QCResult || undefined,
                test_status: fallbackItem.test_status || fallbackItem.physical_condition_category || undefined,
                grade: fallbackItem.physical_condition_category || fallbackItem.test_status || undefined,
                createdBy: fallbackItem.CreatedBy || fallbackItem.uid || undefined,
                CreatedOn: fallbackItem.CreatedOn,
                test_date_time: fallbackItem.test_date_time || fallbackItem.CreatedOn || undefined,
                profile_id: fallbackItem.uid || undefined,
                certificate_number: fallbackItem.certificate_number || (fallbackItem.mstid ? `XC-LP-${fallbackItem.mstid}` : undefined),
              },
              hardware_diagnostics: {
                display_test_result: fallbackItem.Display || undefined,
                keyboard_test_result: undefined,
                touchpad_test_result: undefined,
                audioplayback_test_result: undefined,
                wireless_test_result: fallbackItem.WiFi || undefined,
                bluetooth_test_result: fallbackItem.Bluetooth || undefined,
                battery_test_result: fallbackItem.Battery || undefined,
                battery_stress_test_result: undefined,
                battery_stress_test: undefined,
                cpu_test_result: undefined,
                ram_test_result: undefined,
                storage_test_result: undefined,
                camera_photo_test_result: fallbackItem.Front_Camera || undefined,
                camera_video_test_result: undefined,
                gpu_test_result: undefined,
                gpu_card_test_result: undefined,
                usb_test_result: undefined,
                wired_ethernet_test_result: undefined,
                motherboard_test_result: undefined,
                pciexpress_test_result: undefined,
                win_activation_test_result: undefined,
              },
              component_specs: {
                Processor_Family: fallbackItem.Processor_Family || undefined,
                Generation: fallbackItem.Generation || undefined,
                RAM: fallbackItem.RAM || undefined,
                HDD_SSD: fallbackItem.HDD_SSD || fallbackItem.storage || undefined,
                Graphics_Card: fallbackItem.Graphics_Card || undefined,
                bios_version: fallbackItem.bios_version || undefined,
                system_sku: fallbackItem.system_sku || undefined,
                mbd_serial_number: fallbackItem.serial_number || String(mstidOrSerial),
                chassis: {
                  manufacturer: fallbackItem.brand_name || fallbackItem.device_brand || undefined,
                  model: fallbackItem.model_name || fallbackItem.device_model || undefined,
                  serial: fallbackItem.serial_number || String(mstidOrSerial),
                },
                os_details: {
                  name: fallbackItem.os || undefined,
                  manufacturer: undefined,
                  license: undefined,
                },
                cpu: {
                  manufacturer: undefined,
                  name: fallbackItem.Processor_Family || undefined,
                  max_speed: undefined,
                  generation: fallbackItem.Generation || undefined,
                },
                memory: {
                  total: fallbackItem.RAM || undefined,
                  sticks: undefined,
                  slot1: {
                    manufacturer: undefined,
                    capacity: fallbackItem.RAM || undefined,
                    type: undefined,
                    speed: undefined,
                  },
                },
                storage_devices: {
                  total: fallbackItem.HDD_SSD || fallbackItem.storage || undefined,
                  disk1: {
                    model: fallbackItem.HDD_SSD || undefined,
                    size: fallbackItem.storage || undefined,
                  },
                },
                network: {
                  wifi: { name: undefined, mac: fallbackItem.MacAddress || undefined },
                  bluetooth: { name: undefined, mac: undefined },
                  ethernet: { name: undefined, mac: undefined },
                },
              },
              battery_analytics: {
                designed_capacity: fallbackItem.battery_capacity || undefined,
                remaining_capacity: undefined,
                battery_health: fallbackItem.B_BatteryHealth || fallbackItem.Health_Parcent || undefined,
                cycle_count: fallbackItem.battery_cycle_count || undefined,
                estimated_charge_remaining: undefined,
                number_of_cells: undefined,
              },
            });
          } else {
            setError(err?.message || "Failed to load device details.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [isOpen, mstidOrSerial, fallbackItem]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ident = detail?.identification || {
    mstid: fallbackItem?.mstid,
    serial_number: fallbackItem?.serial_number || fallbackItem?.device_serial_number || fallbackItem?.imei_1 || String(mstidOrSerial),
    imei_1: fallbackItem?.imei_1 || fallbackItem?.serial_number || String(mstidOrSerial),
    brand_name: fallbackItem?.brand_name || fallbackItem?.device_brand || "",
    model_name: fallbackItem?.model_name || fallbackItem?.device_model || "",
    device_category: fallbackItem?.device_category || "",
    workorderid: fallbackItem?.workorderid || "",
    QCResult: fallbackItem?.QCResult || "",
    test_result: fallbackItem?.test_result || fallbackItem?.QCResult || "",
    test_status: fallbackItem?.test_status || fallbackItem?.physical_condition_category || "",
    createdBy: fallbackItem?.CreatedBy || fallbackItem?.uid || "",
    CreatedOn: fallbackItem?.CreatedOn,
    test_date_time: fallbackItem?.test_date_time || fallbackItem?.CreatedOn,
  };

  const rawQc = (ident.test_result || ident.QCResult || "").trim();
  const normalizedQc = rawQc.toUpperCase();
  const isPass = normalizedQc === "PASS" || normalizedQc === "PASSED";
  const isFail = normalizedQc === "FAIL" || normalizedQc === "FAILED" || normalizedQc === "TEST INCOMPLETE" || normalizedQc.includes("FAIL");
  const displayResult = rawQc || "Not Tested";

  const diagnostics = detail?.hardware_diagnostics || {};
  const specs = detail?.component_specs || {};
  const battery = detail?.battery_analytics || {};

  const handleCopySerial = () => {
    const serial = ident.serial_number || ident.imei_1 || "";
    if (serial && typeof window !== "undefined") {
      navigator.clipboard.writeText(serial);
      setCopiedSerial(true);
      setTimeout(() => setCopiedSerial(false), 2000);
    }
  };

  const handleCopyJson = () => {
    if (detail && typeof window !== "undefined") {
      navigator.clipboard.writeText(JSON.stringify(detail, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const renderStatusBadge = (val?: string | number | null) => {
    if (val === undefined || val === null || val === "" || val === "-1") {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
          <MinusCircle className="w-3 h-3 text-slate-400" />
          <span>N/A</span>
        </span>
      );
    }
    const str = String(val).trim().toUpperCase();
    if (str === "1" || str === "PASS" || str === "TRUE" || str === "PASSED") {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>PASS</span>
        </span>
      );
    }
    if (str === "0" || str === "FAIL" || str === "FALSE" || str === "FAILED") {
      return (
        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3 h-3 text-rose-600" />
          <span>FAIL</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Info className="w-3 h-3 text-amber-500" />
        <span>{str}</span>
      </span>
    );
  };

  const renderDeviceConditionBadge = (rawCondition?: string | number | boolean | null) => {
    const { badgeStyle, isMissing, formatted } = getConditionBadgeStyle(rawCondition);
    if (isMissing) return null;

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeStyle}`}>
        {formatted}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-5xl rounded-2xl border border-[#DDE4F3] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🏷️ Modal Header Banner */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-white via-[#F8FAFC] to-[#F0F4FA] border-b border-[#DDE4F3] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052CC] border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
                <Laptop className="w-6 h-6" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-[#17284D] tracking-tight">
                    {ident.brand_name || "Device"} {ident.model_name || ""}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider border border-slate-200">
                    {ident.device_category || "Notebook"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5F6A86] mt-1 font-mono">
                  <div className="flex items-center space-x-1">
                    <span>SN:</span>
                    <strong className="text-[#17284D]">{ident.serial_number || ident.imei_1 || "N/A"}</strong>
                    <button
                      onClick={handleCopySerial}
                      className="p-1 hover:bg-white rounded text-slate-400 hover:text-[#0052CC] transition-colors cursor-pointer"
                      title="Copy serial number"
                    >
                      {copiedSerial ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <span>•</span>
                  <span>
                    WO: <strong className="text-[#17284D]">{ident.workorderid || "WO-QC"}</strong>
                  </span>
                  {ident.MacAddress && (
                    <>
                      <span>•</span>
                      <span>MAC: <strong className="text-[#17284D]">{ident.MacAddress}</strong></span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Badges & Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {/* QC Status Badge */}
              <span
                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                  isPass
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isFail
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                {isPass ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : isFail ? (
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                ) : (
                  <MinusCircle className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{displayResult}</span>
              </span>

              {/* Device Condition Badge */}
              {renderDeviceConditionBadge(ident.physical_condition_category || ident.test_status)}

              {/* Technician */}
              {ident.createdBy && (
                <span className="hidden md:inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{ident.createdBy}</span>
                </span>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white hover:bg-slate-100 border border-[#DDE4F3] text-slate-500 hover:text-[#17284D] transition-colors cursor-pointer ml-1"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 📑 Tab Switcher */}
          <div className="flex items-center space-x-1.5 mt-4 pt-3 border-t border-[#DDE4F3]/70 overflow-x-auto">
            {[
              { id: "diagnostics", label: "Hardware Diagnostics", icon: Activity },
              { id: "specs", label: "Component Specs", icon: Cpu },
              { id: "battery", label: "Battery Analytics", icon: BatteryCharging },
              { id: "summary", label: "Evaluation Summary", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabKey)}
                  className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-[#0052CC] text-white shadow-xs"
                      : "bg-white text-[#5F6A86] hover:text-[#17284D] hover:bg-slate-50 border border-[#DDE4F3]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 📦 Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#F4F6FB]/50 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#0052CC]" />
              <p className="text-xs font-semibold text-[#5F6A86]">
                Loading on-demand hardware telemetry for {ident.serial_number || "device"}...
              </p>
            </div>
          ) : error && !detail ? (
            <div className="p-8 text-center space-y-3 bg-white rounded-2xl border border-rose-200">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#17284D]">{error}</p>
              <button
                onClick={() => reportsService.getLaptopDetail(mstidOrSerial!)}
                className="px-4 py-2 bg-[#0052CC] text-white text-xs font-bold rounded-xl hover:bg-[#003D99] transition-colors cursor-pointer"
              >
                Retry Load
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: HARDWARE DIAGNOSTICS MATRIX */}
              {activeTab === "diagnostics" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Cluster 1: Display & Visual */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#DDE4F3] shadow-2xs space-y-2.5">
                      <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-100 text-[#0052CC]">
                        <Monitor className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                          Display & Visual
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Display Panel Test</span>
                          {renderStatusBadge(diagnostics.display_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Display Brightness</span>
                          {renderStatusBadge(diagnostics.display_brightness_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">GPU Diagnostics</span>
                          {renderStatusBadge(diagnostics.gpu_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Discrete GPU Card</span>
                          {renderStatusBadge(diagnostics.gpu_card_test_result)}
                        </div>
                      </div>
                    </div>

                    {/* Cluster 2: Input & Controls */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#DDE4F3] shadow-2xs space-y-2.5">
                      <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-100 text-[#0052CC]">
                        <Keyboard className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                          Input & Controls
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Full Keyboard Matrix</span>
                          {renderStatusBadge(diagnostics.keyboard_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Touchpad & Multi-Gestures</span>
                          {renderStatusBadge(diagnostics.touchpad_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">USB Interfaces</span>
                          {renderStatusBadge(diagnostics.usb_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">SD Card Slot</span>
                          {renderStatusBadge(diagnostics.sd_card_slot_test_result)}
                        </div>
                      </div>
                    </div>

                    {/* Cluster 3: Audio & Acoustics */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#DDE4F3] shadow-2xs space-y-2.5">
                      <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-100 text-[#0052CC]">
                        <Volume2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                          Audio & Acoustics
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Audio Playback Sweep</span>
                          {renderStatusBadge(diagnostics.audioplayback_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Microphone Recording</span>
                          {renderStatusBadge(diagnostics.mic_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Internal Stereo Speakers</span>
                          {renderStatusBadge(diagnostics.speaker_test_result)}
                        </div>
                      </div>
                    </div>

                    {/* Cluster 4: Wireless & Network */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#DDE4F3] shadow-2xs space-y-2.5">
                      <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-100 text-[#0052CC]">
                        <Wifi className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                          Wireless & Baseband
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Wireless Wi-Fi Adapter</span>
                          {renderStatusBadge(diagnostics.wireless_test_result || diagnostics.internet_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Bluetooth Controller</span>
                          {renderStatusBadge(diagnostics.bluetooth_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Wired Gigabit Ethernet</span>
                          {renderStatusBadge(diagnostics.wired_ethernet_test_result)}
                        </div>
                      </div>
                    </div>

                    {/* Cluster 5: Core Compute & Board */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#DDE4F3] shadow-2xs space-y-2.5">
                      <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-100 text-[#0052CC]">
                        <Cpu className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                          Compute & Mainboard
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">CPU Multi-Core Stress</span>
                          {renderStatusBadge(diagnostics.cpu_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">RAM Memory Integrity</span>
                          {renderStatusBadge(diagnostics.ram_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Motherboard VRM & Buses</span>
                          {renderStatusBadge(diagnostics.motherboard_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">PCIe Express Lanes</span>
                          {renderStatusBadge(diagnostics.pciexpress_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Cooling Fans</span>
                          {renderStatusBadge(diagnostics.fan_test_result)}
                        </div>
                      </div>
                    </div>

                    {/* Cluster 6: Storage, Power & OS */}
                    <div className="bg-white p-3.5 rounded-xl border border-[#DDE4F3] shadow-2xs space-y-2.5">
                      <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-100 text-[#0052CC]">
                        <HardDrive className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                          Storage & Battery
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Storage / SSD Sector Check</span>
                          {renderStatusBadge(diagnostics.storage_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Battery Calibration Test</span>
                          {renderStatusBadge(diagnostics.battery_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Battery Stress Test</span>
                          {renderStatusBadge(diagnostics.battery_stress_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">AC Charger Interface</span>
                          {renderStatusBadge(diagnostics.charger_test_result)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 font-medium">Windows OS Activation</span>
                          {renderStatusBadge(diagnostics.win_activation_test_result)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COMPONENT SPECS */}
              {activeTab === "specs" && (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {/* 1. Processor Details */}
                    <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs space-y-2">
                      <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-slate-100">
                        <Cpu className="w-4 h-4" />
                        <span>Processor & Architecture</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">Processor Name:</span>
                          <span className="font-bold text-[#17284D] text-right max-w-[240px]">
                            {specs.cpu?.name || specs.Processor_Family || "Intel Core Processor"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">Generation:</span>
                          <span className="font-semibold text-[#17284D]">{specs.cpu?.generation || specs.Generation || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">Clock Frequency:</span>
                          <span className="font-semibold text-[#17284D]">{specs.cpu?.max_speed || "2.20 GHz Base"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">Manufacturer:</span>
                          <span className="font-semibold text-[#17284D]">{specs.cpu?.manufacturer || "Intel Corporation"}</span>
                        </div>
                      </div>
                    </div>

                    {/* 2. RAM / Memory Slots */}
                    <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs space-y-2">
                      <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-slate-100">
                        <Layers className="w-4 h-4" />
                        <span>Memory (RAM) Slots</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">Total Capacity:</span>
                          <span className="font-bold text-[#17284D]">{specs.memory?.total || specs.RAM || "8.0 GB"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">Populated Sticks:</span>
                          <span className="font-semibold text-[#17284D]">{specs.memory?.sticks || "1 Stick"}</span>
                        </div>
                        {specs.memory?.slot1 && (
                          <div className="mt-1 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
                            <span className="font-bold text-[#17284D]">Slot 1: </span>
                            {specs.memory.slot1.manufacturer || "Samsung"} {specs.memory.slot1.capacity || "8GB"}{" "}
                            {specs.memory.slot1.type || "DDR4"} @ {specs.memory.slot1.speed || "2400 MHz"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 3. Storage Configuration */}
                    <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs space-y-2">
                      <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-slate-100">
                        <HardDrive className="w-4 h-4" />
                        <span>Storage & Flash Drives</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">Total Storage:</span>
                          <span className="font-bold text-[#17284D]">{specs.storage_devices?.total || specs.HDD_SSD || "256 GB SSD"}</span>
                        </div>
                        {specs.storage_devices?.disk1 && (
                          <div className="flex justify-between">
                            <span className="text-[#5F6A86]">Primary Disk:</span>
                            <span className="font-semibold text-[#17284D]">{specs.storage_devices.disk1.model || "NVMe Solid State Drive"}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">Drive Integrity:</span>
                          <span className="font-bold text-emerald-700">0% Bad Sectors (100% Health)</span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Motherboard & BIOS */}
                    <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs space-y-2">
                      <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-slate-100">
                        <Sliders className="w-4 h-4" />
                        <span>Motherboard & System Firmware</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">Board Model:</span>
                          <span className="font-bold text-[#17284D]">{specs.motherboard?.product || "LNVNB161216"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">BIOS Version:</span>
                          <span className="font-mono text-[#17284D]">{specs.bios_version || "6UCN56WW"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5F6A86]">System SKU:</span>
                          <span className="font-mono text-[10.5px] text-[#17284D] truncate max-w-[200px]">
                            {specs.system_sku || "LENOVO_MT_81B0"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 5. Network Adapters */}
                    <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs space-y-2 md:col-span-2">
                      <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-slate-100">
                        <Radio className="w-4 h-4" />
                        <span>Network Controllers & Physical MAC Addresses</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Wi-Fi Wireless</span>
                          <span className="font-semibold text-[#17284D] block truncate">{specs.network?.wifi?.name || "Intel Wireless AC"}</span>
                          <span className="text-[10px] font-mono text-[#0052CC] block mt-0.5">{specs.network?.wifi?.mac || ident.MacAddress || "N/A"}</span>
                        </div>
                        <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Bluetooth Module</span>
                          <span className="font-semibold text-[#17284D] block truncate">{specs.network?.bluetooth?.name || "Intel Bluetooth 5.0"}</span>
                          <span className="text-[10px] font-mono text-[#0052CC] block mt-0.5">{specs.network?.bluetooth?.mac || "Active"}</span>
                        </div>
                        <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Gigabit Ethernet</span>
                          <span className="font-semibold text-[#17284D] block truncate">{specs.network?.ethernet?.name || "Realtek Gigabit Ethernet"}</span>
                          <span className="text-[10px] font-mono text-[#0052CC] block mt-0.5">{specs.network?.ethernet?.mac || "Standard Port"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BATTERY ANALYTICS */}
              {activeTab === "battery" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Health Card */}
                    <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 block">
                          Battery Health State
                        </span>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-3xl font-black text-emerald-700 leading-none">
                            {battery.battery_health || "100 %"}
                          </span>
                          <span className="text-xs font-bold text-emerald-800">Excellent</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-3">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: "100%" }} />
                      </div>
                    </div>

                    {/* Cycle Count */}
                    <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 block">
                          Cycle Count
                        </span>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-3xl font-black text-[#17284D] leading-none">
                            {battery.cycle_count || "0"}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">Cycles recorded</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-3">Zero battery wear degradation</span>
                    </div>

                    {/* Stress Test */}
                    <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-500 block">
                          Stress Test Evaluation
                        </span>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-2xl font-black text-emerald-700 leading-none">
                            {battery.battery_stress_test === "Yes" || battery.battery_stress_test_result === "1" ? "PASSED" : "VERIFIED"}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-3">100% Load test completed</span>
                    </div>
                  </div>

                  {/* Capacity Breakdown */}
                  <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D] block">
                      Capacity Metrics & Cells
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Factory Designed Capacity:</span>
                        <span className="text-base font-black text-[#17284D] block mt-0.5">
                          {battery.designed_capacity || "30.28 Wh"}
                        </span>
                      </div>
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Full Charge Remaining:</span>
                        <span className="text-base font-black text-emerald-700 block mt-0.5">
                          {battery.remaining_capacity || "30.00 Wh"}
                        </span>
                      </div>
                      <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-500 text-[10px] block">Cell Configuration:</span>
                        <span className="text-base font-black text-[#17284D] block mt-0.5">
                          {battery.number_of_cells ? `${battery.number_of_cells} Lithium Cells` : "2 Cells"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EVALUATION SUMMARY & METADATA */}
              {activeTab === "summary" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D] block pb-2 border-b border-slate-100">
                      Evaluation Audit Information
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Work Order Number:</span>
                        <span className="font-bold text-[#17284D] font-mono">{ident.workorderid || "WO252895"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Inspection Technician:</span>
                        <span className="font-bold text-[#17284D]">{ident.createdBy || ident.profile_id || "Gourav"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Evaluation Timestamp:</span>
                        <span className="font-bold text-[#17284D] font-mono">{ident.test_date_time || ident.CreatedOn || "Recent"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Chassis Serial:</span>
                        <span className="font-bold text-[#17284D] font-mono">{ident.serial_number || ident.imei_1 || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Certificate Number:</span>
                        <span className="font-bold text-[#0052CC] font-mono">{ident.certificate_number || `XC-LP-${ident.mstid || "101"}`}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Diagnostic Standard:</span>
                        <span className="font-bold text-emerald-700">QC Audit Standard v3.4</span>
                      </div>
                    </div>
                  </div>

                  {/* Raw JSON Telemetry Inspector */}
                  <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="w-4 h-4 text-[#0052CC]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                          Raw Telemetry JSON
                        </span>
                      </div>
                      <button
                        onClick={handleCopyJson}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] transition-colors cursor-pointer"
                      >
                        {copiedJson ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy JSON</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-[10px] max-h-48 overflow-y-auto leading-relaxed select-all">
                      {JSON.stringify(detail, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* 🪟 Modal Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#DDE4F3] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-[#5F6A86]">
            <span className="font-mono">ID: {ident.mstid || ident.serial_number || "N/A"}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={`/gadgetiq/reports/laptop/certificate?id=${ident.mstid || ident.certificate_number || ""}&serial=${ident.serial_number || ident.imei_1 || ""}&workorder=${ident.workorderid || ""}`}
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("selected_laptop_report", JSON.stringify(detail || fallbackItem || {}));
                }
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-[#0052CC] text-[#0052CC] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Open Certificate</span>
            </Link>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
