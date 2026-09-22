"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
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
  FileText,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Layers,
  Sliders,
  Radio,
  Volume2,
  Keyboard,
  Printer,
  ShieldCheck,
  User,
  Info,
  Sparkles,
} from "lucide-react";
import { reportsService } from "../../services";
import { LaptopQcDetailData, LaptopQCReportItem } from "../../types";
import { formatConditionCategory, getConditionBadgeStyle } from "../page";

type TabKey = "diagnostics" | "specs" | "battery" | "overview";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function LaptopDeviceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const targetId = decodeURIComponent(resolvedParams?.id || "");
  const searchParams = useSearchParams();
  const serviceKeyParam = searchParams.get("servicekey") || "";
  const serialParam = searchParams.get("serial") || "";

  const [activeTab, setActiveTab] = useState<TabKey>("diagnostics");
  const [detail, setDetail] = useState<LaptopQcDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedSerial, setCopiedSerial] = useState(false);

  const loadDeviceDetail = async () => {
    if (!targetId) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Check sessionStorage cache first for instant load
      if (typeof window !== "undefined") {
        const cachedStr = sessionStorage.getItem("selected_laptop_report");
        if (cachedStr) {
          try {
            const cachedItem = JSON.parse(cachedStr);
            const cachedId = String(cachedItem.mstid || cachedItem.identification?.mstid || "");
            const cachedSerial = String(cachedItem.serial_number || cachedItem.device_serial_number || cachedItem.imei_1 || cachedItem.identification?.serial_number || "");

            if (cachedId === targetId || cachedSerial === targetId || targetId === "undefined") {
              if (cachedItem.hardware_diagnostics && cachedItem.identification) {
                setDetail(cachedItem as LaptopQcDetailData);
                setLoading(false);
                return;
              }
            }
          } catch {
            // Proceed to network fetch
          }
        }
      }

      // 2. Fetch live on-demand detail from API proxy
      const data = await reportsService.getLaptopDetail(targetId);
      if (data && (data.identification || data.hardware_diagnostics || (data as any).mstid)) {
        setDetail(data);
        setLoading(false);
        return;
      }

      // 3. Fallback: Search from live reports list
      const listRes = await reportsService.getLaptopReportsPaginated({
        search: targetId,
        pageSize: 5,
      });

      if (listRes && listRes.data && listRes.data.length > 0) {
        const matched: LaptopQCReportItem = listRes.data.find(
          (item) =>
            String(item.mstid) === targetId ||
            item.serial_number === targetId ||
            item.device_serial_number === targetId ||
            item.imei_1 === targetId ||
            item.ServiceKey === targetId
        ) || listRes.data[0];

        if (matched) {
          setDetail({
            identification: {
              mstid: matched.mstid,
              serial_number: matched.serial_number || matched.device_serial_number || matched.imei_1 || targetId,
              imei_1: matched.imei_1 || matched.serial_number || targetId,
              MacAddress: matched.MacAddress,
              brand_name: matched.brand_name || matched.device_brand,
              model_name: matched.model_name || matched.device_model,
              device_category: matched.device_category || "Notebook",
              workorderid: matched.workorderid,
              QCResult: matched.QCResult || matched.test_result,
              test_result: matched.test_result || matched.QCResult,
              test_status: matched.test_status || matched.physical_condition_category,
              grade: matched.physical_condition_category || matched.test_status,
              createdBy: matched.CreatedBy || matched.uid,
              CreatedOn: matched.CreatedOn,
              test_date_time: matched.test_date_time || matched.CreatedOn,
              profile_id: matched.uid,
              certificate_number: matched.certificate_number || (matched.mstid ? `XC-LP-${matched.mstid}` : undefined),
            },
            hardware_diagnostics: {
              display_test_result: matched.Display,
              wireless_test_result: matched.WiFi,
              bluetooth_test_result: matched.Bluetooth,
              battery_test_result: matched.Battery,
              camera_photo_test_result: matched.Front_Camera,
            },
            component_specs: {
              Processor_Family: matched.Processor_Family,
              Generation: matched.Generation,
              RAM: matched.RAM,
              HDD_SSD: matched.HDD_SSD || matched.storage,
              Graphics_Card: matched.Graphics_Card,
              bios_version: matched.bios_version,
              system_sku: matched.system_sku,
              mbd_serial_number: matched.serial_number || targetId,
              chassis: {
                manufacturer: matched.brand_name || matched.device_brand,
                model: matched.model_name || matched.device_model,
                serial: matched.serial_number || targetId,
              },
              os_details: {
                name: matched.os,
              },
              cpu: {
                name: matched.Processor_Family,
                generation: matched.Generation,
              },
              memory: {
                total: matched.RAM,
              },
              storage_devices: {
                total: matched.HDD_SSD || matched.storage,
              },
              network: {
                wifi: { mac: matched.MacAddress },
              },
            },
            battery_analytics: {
              designed_capacity: matched.battery_capacity,
              battery_health: matched.B_BatteryHealth || matched.Health_Parcent,
              cycle_count: matched.battery_cycle_count,
            },
          });
          setLoading(false);
          return;
        }
      }

      setError(`Could not find device report for ID/Serial: ${targetId}`);
    } catch (err: any) {
      console.error("Error loading laptop detail:", err);
      setError(err?.message || "Failed to load device QC details. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeviceDetail();
  }, [targetId]);

  const ident = detail?.identification || {
    mstid: isNaN(Number(targetId)) ? 0 : Number(targetId),
    serial_number: serialParam || targetId,
    imei_1: serialParam || targetId,
    brand_name: "",
    model_name: "",
    device_category: "Notebook",
    workorderid: "",
    QCResult: "",
    test_result: "",
    test_status: "",
    createdBy: "",
    CreatedOn: "",
    test_date_time: "",
  };

  const diagnostics = detail?.hardware_diagnostics || (detail as any)?.all_fields || {};
  const specs = detail?.component_specs || (detail as any)?.all_fields || {};
  const battery = detail?.battery_analytics || (detail as any)?.all_fields || {};
  const allFields = (detail as any)?.all_fields || {};

  const rawQc = (ident.test_result || ident.QCResult || allFields.test_result || allFields.QCResult || "").trim();
  const normalizedQc = rawQc.toUpperCase();
  const isPass = normalizedQc === "PASS" || normalizedQc === "PASSED";
  const isFail = normalizedQc === "FAIL" || normalizedQc === "FAILED" || normalizedQc === "TEST INCOMPLETE" || normalizedQc.includes("FAIL");
  const displayResult = rawQc || "Not Tested";

  const certId = ident.mstid || allFields.mstid || targetId;
  const certKey = ident.ServiceKey || allFields.ServiceKey || serviceKeyParam;
  const certSerial = ident.serial_number || ident.imei_1 || allFields.serial_number || serialParam || targetId;
  const certificateUrl = `/gadgetiq/reports/laptop/certificate?id=${encodeURIComponent(certId)}&servicekey=${encodeURIComponent(certKey)}&serial=${encodeURIComponent(certSerial)}`;

  const handleCopySerial = () => {
    const serial = ident.serial_number || ident.imei_1 || allFields.serial_number || targetId;
    if (serial && typeof window !== "undefined") {
      navigator.clipboard.writeText(serial);
      setCopiedSerial(true);
      setTimeout(() => setCopiedSerial(false), 2000);
    }
  };

  const renderStatusBadge = (val?: string | number | null) => {
    if (val === undefined || val === null || val === "" || val === "-1") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
          <MinusCircle className="w-3 h-3 text-slate-400" />
          <span>N/A</span>
        </span>
      );
    }
    const str = String(val).trim().toUpperCase();
    if (str === "1" || str === "PASS" || str === "TRUE" || str === "PASSED") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>PASS</span>
        </span>
      );
    }
    if (str === "0" || str === "FAIL" || str === "FALSE" || str === "FAILED") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>FAIL</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Info className="w-3.5 h-3.5 text-amber-500" />
        <span>{str}</span>
      </span>
    );
  };

  const renderDeviceConditionBadge = (rawCondition?: string | number | boolean | null) => {
    const { badgeStyle, isMissing, formatted } = getConditionBadgeStyle(rawCondition);
    if (isMissing) return null;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeStyle}`}>
        {formatted}
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* 🧭 Top Navigation & Back Link */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/gadgetiq/reports/laptop"
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#5F6A86] hover:text-[#0052CC] transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-white border border-[#DDE4F3] group-hover:border-[#0052CC] transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#17284D] group-hover:text-[#0052CC]" />
          </div>
          <span>Back to Laptop QC Reports</span>
        </Link>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadDeviceDetail}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-[#DDE4F3] text-xs font-bold text-[#17284D] transition-colors cursor-pointer"
            title="Refresh device telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#0052CC]" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href={certificateUrl}
            onClick={() => {
              if (typeof window !== "undefined" && detail) {
                sessionStorage.setItem("selected_laptop_report", JSON.stringify(detail));
              }
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>View & Print Certificate</span>
          </Link>
        </div>
      </div>

      {/* 💻 Main Device Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#DDE4F3] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052CC] border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
              <Laptop className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-[#17284D] font-display tracking-tight">
                  {ident.brand_name || allFields.brand_name || "Device"} {ident.model_name || allFields.model_name || ""}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border border-slate-200">
                  {ident.device_category || allFields.device_category || "Notebook"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5F6A86] font-mono pt-0.5">
                <div className="flex items-center space-x-1.5 bg-[#F4F6FB] px-2.5 py-1 rounded-lg border border-[#DDE4F3]">
                  <span className="text-slate-500 font-bold">Serial Number:</span>
                  <strong className="text-[#17284D]">{ident.serial_number || ident.imei_1 || allFields.serial_number || targetId}</strong>
                  <button
                    onClick={handleCopySerial}
                    className="p-1 hover:bg-white rounded text-slate-400 hover:text-[#0052CC] transition-colors cursor-pointer ml-1"
                    title="Copy serial number"
                  >
                    {copiedSerial ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center space-x-1 bg-[#F4F6FB] px-2.5 py-1 rounded-lg border border-[#DDE4F3]">
                  <span className="text-slate-500">Work Order:</span>
                  <strong className="text-[#17284D]">{ident.workorderid || allFields.workorderid || "N/A"}</strong>
                </div>

                {(ident.MacAddress || allFields.W_MACAddress) && (ident.MacAddress !== "Not Available" || allFields.W_MACAddress) && (
                  <div className="flex items-center space-x-1 bg-[#F4F6FB] px-2.5 py-1 rounded-lg border border-[#DDE4F3]">
                    <span className="text-slate-500">Wi-Fi MAC:</span>
                    <strong className="text-[#17284D]">{allFields.W_MACAddress || ident.MacAddress}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Badges & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {/* QC Result Badge */}
            <span
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide ${
                isPass
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : isFail
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {isPass ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : isFail ? (
                <XCircle className="w-4 h-4 text-rose-600" />
              ) : (
                <MinusCircle className="w-4 h-4 text-slate-400" />
              )}
              <span>QC Result: {displayResult}</span>
            </span>

            {/* Device Condition Badge */}
            {renderDeviceConditionBadge(ident.physical_condition_category || ident.test_status || allFields.physical_condition_category || allFields.test_status)}

            {/* Technician */}
            {(ident.createdBy || ident.profile_id || allFields.CreatedBy) && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Tech: {ident.createdBy || ident.profile_id || allFields.CreatedBy}</span>
              </span>
            )}
          </div>
        </div>

        {/* 📑 Tab Switcher */}
        <div className="flex items-center space-x-2 pt-3 border-t border-[#DDE4F3] overflow-x-auto">
          {[
            { id: "diagnostics", label: "Hardware Diagnostics", icon: Activity },
            { id: "specs", label: "Component Specifications", icon: Cpu },
            { id: "battery", label: "Battery & Power Analytics", icon: BatteryCharging },
            { id: "overview", label: "Device Overview & Audit", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#0052CC] text-white shadow-xs"
                    : "bg-[#F4F6FB] text-[#5F6A86] hover:text-[#17284D] hover:bg-[#E9EEF9] border border-[#DDE4F3]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📦 Tab Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-[#DDE4F3] py-24 flex flex-col items-center justify-center space-y-3 shadow-xs">
          <RefreshCw className="w-9 h-9 animate-spin text-[#0052CC]" />
          <p className="text-sm font-bold text-[#17284D]">
            Loading complete hardware telemetry & component diagnostic specs...
          </p>
          <p className="text-xs text-[#5F6A86]">Serial: {targetId}</p>
        </div>
      ) : error && !detail ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-[#17284D]">{error}</h2>
          <div className="flex items-center justify-center space-x-2 pt-2">
            <button
              onClick={loadDeviceDetail}
              className="px-4 py-2 bg-[#0052CC] text-white text-xs font-bold rounded-xl hover:bg-[#003D99] transition-colors cursor-pointer"
            >
              Retry
            </button>
            <Link
              href="/gadgetiq/reports/laptop"
              className="px-4 py-2 bg-[#F4F6FB] border border-[#DDE4F3] text-[#17284D] text-xs font-bold rounded-xl hover:bg-[#E9EEF9] transition-colors"
            >
              Return to Master Table
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* TAB 1: HARDWARE DIAGNOSTICS */}
          {activeTab === "diagnostics" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Cluster 1: Display & Visual */}
                <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100 text-[#0052CC]">
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      Display & Visual
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Display Panel Test</span>
                      {renderStatusBadge(diagnostics.display_test_result ?? allFields.display_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Display Brightness</span>
                      {renderStatusBadge(diagnostics.display_brightness_test_result ?? allFields.display_brightness_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">GPU Diagnostics</span>
                      {renderStatusBadge(diagnostics.gpu_test_result ?? allFields.gpu_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Discrete GPU Card</span>
                      {renderStatusBadge(diagnostics.gpu_card_test_result ?? allFields.gpu_card_test_result)}
                    </div>
                  </div>
                </div>

                {/* Cluster 2: Input & Controls */}
                <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100 text-[#0052CC]">
                    <Keyboard className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      Input & Controls
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Full Keyboard Matrix</span>
                      {renderStatusBadge(diagnostics.keyboard_test_result ?? allFields.keyboard_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Touchpad & Multi-Gestures</span>
                      {renderStatusBadge(diagnostics.touchpad_test_result ?? allFields.touchpad_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">USB Interfaces</span>
                      {renderStatusBadge(diagnostics.usb_test_result ?? allFields.usb_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">SD Card Slot</span>
                      {renderStatusBadge(diagnostics.sd_card_slot_test_result ?? allFields.sd_card_slot_test_result)}
                    </div>
                  </div>
                </div>

                {/* Cluster 3: Audio & Acoustics */}
                <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100 text-[#0052CC]">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      Audio & Acoustics
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Audio Playback Sweep</span>
                      {renderStatusBadge(diagnostics.audioplayback_test_result ?? allFields.audioplayback_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Microphone Recording</span>
                      {renderStatusBadge(diagnostics.mic_test_result ?? allFields.mic_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Internal Stereo Speakers</span>
                      {renderStatusBadge(diagnostics.speaker_test_result ?? allFields.speaker_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Camera (Still & Video)</span>
                      {renderStatusBadge(diagnostics.camera_photo_test_result ?? allFields.camera_photo_test_result)}
                    </div>
                  </div>
                </div>

                {/* Cluster 4: Wireless & Network */}
                <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100 text-[#0052CC]">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      Wireless & Network
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Wireless Wi-Fi Adapter</span>
                      {renderStatusBadge(diagnostics.wireless_test_result ?? allFields.wireless_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Bluetooth Controller</span>
                      {renderStatusBadge(diagnostics.bluetooth_test_result ?? allFields.bluetooth_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Wired Gigabit Ethernet</span>
                      {renderStatusBadge(diagnostics.wired_ethernet_test_result ?? allFields.wired_ethernet_test_result)}
                    </div>
                  </div>
                </div>

                {/* Cluster 5: Core Compute & Board */}
                <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100 text-[#0052CC]">
                    <Cpu className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      Compute & Mainboard
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">CPU Multi-Core Stress</span>
                      {renderStatusBadge(diagnostics.cpu_test_result ?? allFields.cpu_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">RAM Memory Integrity</span>
                      {renderStatusBadge(diagnostics.ram_test_result ?? allFields.ram_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Motherboard VRM & Buses</span>
                      {renderStatusBadge(diagnostics.motherboard_test_result ?? allFields.motherboard_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">PCIe Express Lanes</span>
                      {renderStatusBadge(diagnostics.pciexpress_test_result ?? allFields.pciexpress_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Cooling Fans</span>
                      {renderStatusBadge(diagnostics.fan_test_result ?? allFields.fan_test_result)}
                    </div>
                  </div>
                </div>

                {/* Cluster 6: Storage, Power & OS */}
                <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 pb-2.5 border-b border-slate-100 text-[#0052CC]">
                    <HardDrive className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      Storage & Power
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Storage / SSD Health</span>
                      {renderStatusBadge(diagnostics.storage_test_result ?? allFields.storage_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Battery Calibration Test</span>
                      {renderStatusBadge(diagnostics.battery_test_result ?? allFields.battery_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Battery Stress Test</span>
                      {renderStatusBadge(diagnostics.battery_stress_test_result ?? allFields.battery_stress_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">AC Charger Interface</span>
                      {renderStatusBadge(diagnostics.charger_test_result ?? allFields.charger_test_result)}
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-medium">Windows OS Activation</span>
                      {renderStatusBadge(diagnostics.win_activation_test_result ?? allFields.win_activation_test_result)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPONENT SPECIFICATIONS */}
          {activeTab === "specs" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Processor Details */}
                <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                    <Cpu className="w-4 h-4" />
                    <span>Processor & Architecture</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Processor Name:</span>
                      <span className="font-bold text-[#17284D] text-right max-w-[280px]">
                        {specs.cpu?.name || specs.Processor_Family || allFields.cp_Name || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Generation:</span>
                      <span className="font-semibold text-[#17284D]">{specs.cpu?.generation || specs.Generation || allFields.cp_CPUGeneration || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Clock Frequency:</span>
                      <span className="font-semibold text-[#17284D]">{specs.cpu?.max_speed || allFields.cp_MaxClockSpeed || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Cores:</span>
                      <span className="font-semibold text-[#17284D]">{ident.processor_core || allFields.processor_core ? `${ident.processor_core || allFields.processor_core} Cores` : "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Manufacturer:</span>
                      <span className="font-semibold text-[#17284D]">{specs.cpu?.manufacturer || allFields.cp_Manufacturer || "N/A"}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Motherboard & BIOS */}
                <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                    <Sliders className="w-4 h-4" />
                    <span>Motherboard & System Firmware</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Board Manufacturer:</span>
                      <span className="font-bold text-[#17284D]">{specs.motherboard?.manufacturer || allFields.M_Manufacturer || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Product Model:</span>
                      <span className="font-bold text-[#17284D]">{specs.motherboard?.product || allFields.M_Product || ident.product_name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Motherboard Serial:</span>
                      <span className="font-mono text-[#17284D]">{specs.motherboard?.serial || allFields.M_SerialNumber || specs.mbd_serial_number || ident.mbd_serial_number || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">BIOS Version:</span>
                      <span className="font-mono text-[#17284D]">{specs.bios_version || allFields.bios_version || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">System SKU:</span>
                      <span className="font-mono text-[11px] text-[#17284D] truncate max-w-[200px]">
                        {specs.system_sku || allFields.system_sku || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. RAM / Memory Modules */}
                <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                    <Layers className="w-4 h-4" />
                    <span>Memory (RAM) Modules</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Total Physical Memory:</span>
                      <span className="font-bold text-[#17284D]">{specs.memory?.total || specs.RAM || allFields.Me_TotalPhysicalMemory || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Physical Sticks:</span>
                      <span className="font-semibold text-[#17284D]">{specs.memory?.sticks || allFields.Me_PhysicalMemorySticks ? `${specs.memory?.sticks || allFields.Me_PhysicalMemorySticks} Stick(s)` : "N/A"}</span>
                    </div>
                    {(specs.memory?.slot1 || allFields.Mem1_Manufacturer) && (
                      <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 text-[11px] bg-[#F8FAFC] p-2 rounded-lg border border-slate-200">
                        <span className="font-bold text-[#17284D] block">
                          Module 1: {specs.memory?.slot1?.manufacturer || allFields.Mem1_Manufacturer} {specs.memory?.slot1?.capacity || allFields.Mem1_Capacity} ({specs.memory?.slot1?.type || allFields.Mem1_MemoryType} @ {specs.memory?.slot1?.speed || allFields.Mem1_Speed})
                        </span>
                        <div className="flex justify-between text-[#5F6A86] text-[10px]">
                          <span>Part: <strong className="font-mono text-[#17284D]">{allFields.Mem1_PartNumber || "N/A"}</strong></span>
                          <span>Serial: <strong className="font-mono text-[#17284D]">{specs.memory?.slot1?.serial || allFields.Mem1_SerialNumber || "N/A"}</strong></span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Storage Devices */}
                <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                    <HardDrive className="w-4 h-4" />
                    <span>Storage Drives</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Total Storage:</span>
                      <span className="font-bold text-[#17284D]">{specs.storage_devices?.total || specs.HDD_SSD || allFields.st_TotalStorage || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Physical Drives:</span>
                      <span className="font-semibold text-[#17284D]">{allFields.st_PhysicalDiskDrives ? `${allFields.st_PhysicalDiskDrives} Drive(s)` : "1 Drive"}</span>
                    </div>
                    {(specs.storage_devices?.disk1 || allFields.st1_Model) && (
                      <div className="mt-2 pt-2 border-t border-slate-100 space-y-1 text-[11px] bg-[#F8FAFC] p-2 rounded-lg border border-slate-200">
                        <span className="font-bold text-[#17284D] block truncate">
                          Drive 1: {specs.storage_devices?.disk1?.model || allFields.st1_Model}
                        </span>
                        <div className="text-[#5F6A86] text-[10px] truncate">
                          Serial: <strong className="font-mono text-[#17284D]">{specs.storage_devices?.disk1?.serial || allFields.st1_SerialNumber || "N/A"}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. GPU & Graphics */}
                <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                    <Sparkles className="w-4 h-4" />
                    <span>GPU & Graphics Adapter</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Graphics Name:</span>
                      <span className="font-bold text-[#17284D]">{specs.gpu?.name || allFields.gp_Name || "Integrated Graphics"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Video Processor:</span>
                      <span className="font-semibold text-[#17284D]">{specs.gpu?.processor || allFields.gp_VideoProcessor || "Integrated"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Adapter RAM:</span>
                      <span className="font-semibold text-[#17284D]">{specs.gpu?.ram || allFields.gp_AdapterRAM || "Dynamic Memory"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Discrete GPU:</span>
                      <span className="font-semibold text-[#17284D]">{specs.Graphics_Card || allFields.Graphics_Card || "No"}</span>
                    </div>
                  </div>
                </div>

                {/* 6. Peripherals: Keyboard, Camera, Audio */}
                <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                  <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                    <Keyboard className="w-4 h-4" />
                    <span>Peripherals & Hardware Devices</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Keyboard:</span>
                      <span className="font-bold text-[#17284D] truncate max-w-[200px]">
                        {allFields.Ky_Name || "Enhanced Keyboard"} ({allFields.ky_NumberOfFunctionKeys || "12"} Fn Keys)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Camera:</span>
                      <span className="font-semibold text-[#17284D]">
                        {allFields.Ca_Name || "HD Camera"} ({allFields.Ca_Manufacturer || "Microsoft"})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#5F6A86]">Audio Device:</span>
                      <span className="font-semibold text-[#17284D]">
                        {allFields.au_Name || "High Definition Audio"} ({allFields.au_Manufacturer || "Realtek"})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 7. Network Adapters */}
                <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3 md:col-span-2">
                  <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                    <Radio className="w-4 h-4" />
                    <span>Network Controllers & Physical MAC Addresses</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Wi-Fi Wireless</span>
                      <span className="font-semibold text-[#17284D] block truncate">{specs.network?.wifi?.name || allFields.W_Name || "N/A"}</span>
                      <span className="text-[11px] font-mono text-[#0052CC] block mt-0.5">{specs.network?.wifi?.mac || allFields.W_MACAddress || ident.MacAddress || "N/A"}</span>
                    </div>
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Bluetooth Module</span>
                      <span className="font-semibold text-[#17284D] block truncate">{specs.network?.bluetooth?.name || allFields.Bl_Name || "N/A"}</span>
                      <span className="text-[11px] font-mono text-[#0052CC] block mt-0.5">{specs.network?.bluetooth?.mac || allFields.Bl_MACAddress || "N/A"}</span>
                    </div>
                    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Gigabit Ethernet</span>
                      <span className="font-semibold text-[#17284D] block truncate">{specs.network?.ethernet?.name || allFields.WE_Name || "Not Available"}</span>
                      <span className="text-[11px] font-mono text-[#5F6A86] block mt-0.5">{specs.network?.ethernet?.mac || allFields.WE_MACAddress || "Not Available"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BATTERY & POWER ANALYTICS */}
          {activeTab === "battery" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Health Card */}
                <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 block">
                      Battery Health State
                    </span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-3xl font-black text-emerald-700 leading-none">
                        {battery.battery_health || allFields.B_BatteryHealth || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-4">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{
                        width: `${Math.min(parseInt(String(battery.battery_health || allFields.B_BatteryHealth || 100).replace(/[^0-9]/g, "") || "100", 10), 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Cycle Count */}
                <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 block">
                      Cycle Count
                    </span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-3xl font-black text-[#17284D] leading-none">
                        {battery.cycle_count !== undefined && battery.cycle_count !== null ? battery.cycle_count : (allFields.B_CycleCount || "N/A")}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Cycles recorded</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 block mt-4">Telemetry cycle count</span>
                </div>

                {/* Stress Test */}
                <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500 block">
                      Stress Test Evaluation
                    </span>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-2xl font-black text-emerald-700 leading-none">
                        {battery.battery_stress_test || allFields.battery_stress_test || (battery.battery_stress_test_result === "1" ? "PASSED" : (battery.battery_stress_test_result === "0" ? "FAILED" : "N/A"))}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 block mt-4">Stress test evaluation</span>
                </div>
              </div>

              {/* Capacity Breakdown */}
              <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#17284D] block">
                  Capacity Metrics & Lithium Cells
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Manufacturer:</span>
                    <span className="text-base font-bold text-[#17284D] block mt-1">
                      {allFields.B_Manufacturer || "N/A"}
                    </span>
                  </div>
                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Serial Number:</span>
                    <span className="text-sm font-mono text-[#17284D] block mt-1 truncate">
                      {allFields.B_SerialNumber || "N/A"}
                    </span>
                  </div>
                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Designed Capacity:</span>
                    <span className="text-base font-black text-[#17284D] block mt-1">
                      {battery.designed_capacity || allFields.B_DesignedCapacity || "N/A"}
                    </span>
                  </div>
                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 text-[11px] block">Remaining Capacity:</span>
                    <span className="text-base font-black text-emerald-700 block mt-1">
                      {battery.remaining_capacity || allFields.B_RemainingCapacity || "N/A"} ({allFields.B_EstimatedChargeRemaining || "89 %"})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEVICE OVERVIEW & AUDIT */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#17284D] block pb-2 border-b border-slate-100">
                  Evaluation Audit & Metadata
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Work Order Number:</span>
                    <span className="font-bold text-[#17284D] font-mono text-sm">{ident.workorderid || allFields.workorderid || "N/A"}</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Inspection Technician:</span>
                    <span className="font-bold text-[#17284D] text-sm">{ident.createdBy || ident.profile_id || ident.uid || allFields.CreatedBy || "N/A"}</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Evaluation Timestamp:</span>
                    <span className="font-bold text-[#17284D] font-mono text-sm">{ident.test_date_time || ident.CreatedOn || allFields.test_date_time || "N/A"}</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Chassis Serial:</span>
                    <span className="font-bold text-[#17284D] font-mono text-sm">{ident.serial_number || ident.imei_1 || allFields.serial_number || targetId}</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Certificate Number:</span>
                    <span className="font-bold text-[#0052CC] font-mono text-sm">{ident.certificate_number || ident.ServiceKey || allFields.certificate_number || "N/A"}</span>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Diagnostic Engine:</span>
                    <span className="font-bold text-emerald-700 text-sm">{ident.os_versio || allFields.os_versio || "GadgetIQ Engine"}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Ready to generate or print the official QC Certificate for this device?
                  </span>
                  <Link
                    href={certificateUrl}
                    onClick={() => {
                      if (typeof window !== "undefined" && detail) {
                        sessionStorage.setItem("selected_laptop_report", JSON.stringify(detail));
                      }
                    }}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>View & Print Certificate</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
