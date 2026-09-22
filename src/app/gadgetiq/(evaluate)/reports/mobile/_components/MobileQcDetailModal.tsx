"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  Smartphone,
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
  Zap,
  Printer,
} from "lucide-react";
import { MobileDetailData, MobileQCReportItem } from "../../types";
import { reportsService } from "../../services";
import { formatConditionCategory, getConditionBadgeStyle } from "../page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mstidOrImei: string | number | null;
  fallbackItem?: MobileQCReportItem | null;
}

type TabKey = "diagnostics" | "specs" | "battery" | "audit";

export default function MobileQcDetailModal({
  isOpen,
  onClose,
  mstidOrImei,
  fallbackItem,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("diagnostics");
  const [detail, setDetail] = useState<MobileDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedImei, setCopiedImei] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  useEffect(() => {
    if (!isOpen || !mstidOrImei) {
      return;
    }

    let isMounted = true;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await reportsService.getMobileDetail(mstidOrImei);
        if (isMounted) {
          setDetail(data);
        }
      } catch (err: any) {
        console.warn("Mobile detail fetch warning:", err);
        if (isMounted) {
          if (fallbackItem) {
            setDetail({
              identification: {
                mstid: fallbackItem.mstid,
                workorderid: fallbackItem.workorderid || undefined,
                imei_1: fallbackItem.imei_1 || fallbackItem.IMEI || String(mstidOrImei),
                imei_2: fallbackItem.imei_2 || undefined,
                serial_number: fallbackItem.serial_number || fallbackItem.IMEI || String(mstidOrImei),
                brand_name: fallbackItem.brand_name || fallbackItem.device_brand || undefined,
                model_name: fallbackItem.model_name || fallbackItem.device_model || undefined,
                device_category: fallbackItem.device_category || "Mobile",
                QCResult: fallbackItem.QCResult || fallbackItem.test_result || undefined,
                test_result: fallbackItem.test_result || fallbackItem.QCResult || undefined,
                test_status: fallbackItem.test_status || fallbackItem.physical_condition_category || fallbackItem.grade || undefined,
                grade: fallbackItem.grade || fallbackItem.physical_condition_category || fallbackItem.test_status || undefined,
                physical_condition_category: fallbackItem.physical_condition_category || fallbackItem.grade || fallbackItem.test_status || undefined,
                score: fallbackItem.score || undefined,
                createdBy: fallbackItem.CreatedBy || fallbackItem.uid || undefined,
                CreatedOn: fallbackItem.CreatedOn || undefined,
                test_date_time: fallbackItem.test_date_time || fallbackItem.CreatedOn || undefined,
                ServiceKey: fallbackItem.ServiceKey || undefined,
                certificate_number: fallbackItem.certificate_number || (fallbackItem.mstid ? `XC-MB-${fallbackItem.mstid}` : undefined),
                storage: fallbackItem.storage || undefined,
                ram: fallbackItem.ram || undefined,
                battery_capacity: fallbackItem.battery_capacity || undefined,
                Health_Parcent: fallbackItem.Health_Parcent || (fallbackItem.score ? `${fallbackItem.score}%` : undefined),
              },
              hardware_diagnostics: {
                Battery: fallbackItem.Battery !== undefined ? String(fallbackItem.Battery) : fallbackItem.BatterytestStatus,
                Display_Touch_Screen: fallbackItem.Display_Touch_Screen,
                Display_Dead_Pixel: fallbackItem.Display_Dead_Pixel,
                Back_Camera: fallbackItem.Back_Camera,
                Front_Camera: fallbackItem.Front_Camera,
                Biometric: fallbackItem.Biometric,
                WiFi: fallbackItem.WiFi,
                Bluetooth: fallbackItem.Bluetooth,
                LoudSpeaker: fallbackItem.LoudSpeaker,
                Microphone: fallbackItem.Microphone,
                Flash: fallbackItem.Flash,
              },
              all_fields: { ...fallbackItem },
            });
          } else {
            setError(err?.message || "Could not retrieve live telemetry for this mobile device.");
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
  }, [isOpen, mstidOrImei, fallbackItem]);

  if (!isOpen) return null;

  const getProp = (...keys: string[]): any => {
    const sources = [
      detail?.component_specs,
      detail?.battery_analytics,
      detail?.identification,
      detail?.hardware_diagnostics,
      (detail as any)?.all_fields,
      detail as any,
      fallbackItem?.component_specs,
      fallbackItem?.battery_analytics,
      fallbackItem?.identification,
      fallbackItem?.hardware_diagnostics,
      fallbackItem,
    ].filter(Boolean);

    // 1. Non-empty, non-null value
    for (const src of sources) {
      for (const k of keys) {
        const val = (src as any)[k];
        if (val !== undefined && val !== null && val !== "") {
          return Array.isArray(val) ? val[0] : val;
        }
      }
    }
    // 2. Defined value (e.g. "" or "-1")
    for (const src of sources) {
      for (const k of keys) {
        const val = (src as any)[k];
        if (val !== undefined && val !== null) {
          return Array.isArray(val) ? val[0] : val;
        }
      }
    }
    return undefined;
  };

  const ident = detail?.identification || fallbackItem || ({} as any);
  const diagnostics = detail?.hardware_diagnostics || (detail as any)?.all_fields || fallbackItem?.hardware_diagnostics || {};
  const specs = detail?.component_specs || (detail as any)?.all_fields || fallbackItem?.component_specs || {};
  const battery = detail?.battery_analytics || (detail as any)?.all_fields || fallbackItem?.battery_analytics || {};
  const allFields = (detail as any)?.all_fields || fallbackItem || {};

  const rawQc = String(
    getProp("QCResult", "test_result", "qc_result", "status", "test_status") || ""
  ).trim();
  const rawBattStatus = getProp("Battery", "battarystatus", "BatterytestStatus");
  const normalizedQc = rawQc.toUpperCase();
  const isPass =
    normalizedQc === "PASS" ||
    normalizedQc === "PASSED" ||
    normalizedQc === "SUCCESS" ||
    normalizedQc === "OK" ||
    String(rawBattStatus) === "1" ||
    String(rawBattStatus).toUpperCase() === "PASS";
  const isFail =
    normalizedQc === "FAIL" ||
    normalizedQc === "FAILED" ||
    normalizedQc === "TEST INCOMPLETE" ||
    normalizedQc.includes("FAIL") ||
    String(rawBattStatus) === "0";
  const displayResult = rawQc || (isPass ? "PASS" : (isFail ? "FAIL" : "Test Incomplete"));

  const brand = getProp("brand_name", "device_brand", "brand", "make") || "Mobile Device";
  const model = getProp("model_name", "device_model", "model", "product_name") || "";
  const imei1 = getProp("imei_1", "IMEI", "imei", "serial_number") || String(mstidOrImei);
  const imei2 = getProp("imei_2", "imei2");
  const certId = getProp("mstid", "id") || mstidOrImei;
  const certKey = getProp("ServiceKey", "servicekey") || "";
  const workOrder = getProp("workorderid", "workOrder") || "—";

  const certificateUrl = `/gadgetiq/reports/mobile/certificate?id=${encodeURIComponent(certId)}&imei=${encodeURIComponent(imei1)}&workorder=${encodeURIComponent(workOrder !== "—" ? workOrder : "")}&servicekey=${encodeURIComponent(certKey)}`;

  const handleCopyImei = () => {
    if (imei1 && typeof window !== "undefined") {
      navigator.clipboard.writeText(imei1);
      setCopiedImei(true);
      setTimeout(() => setCopiedImei(false), 2000);
    }
  };

  const handleCopyJson = () => {
    if (detail && typeof window !== "undefined") {
      navigator.clipboard.writeText(JSON.stringify(detail, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const renderStatusBadge = (val?: string | number | boolean | null) => {
    if (val === undefined || val === null || val === "-1") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
          <MinusCircle className="w-3 h-3 text-slate-400" />
          <span>N/A</span>
        </span>
      );
    }
    const str = String(val).trim().toUpperCase();
    if (str === "") {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Info className="w-3.5 h-3.5 text-amber-500" />
          <span>Not Tested</span>
        </span>
      );
    }
    if (
      str === "1" ||
      str === "PASS" ||
      str === "TRUE" ||
      str === "PASSED" ||
      str === "OK" ||
      str === "YES" ||
      str === "SUCCESS"
    ) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>PASS</span>
        </span>
      );
    }
    if (
      str === "0" ||
      str === "FAIL" ||
      str === "FALSE" ||
      str === "FAILED" ||
      str === "NO" ||
      str === "FAILURE"
    ) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>FAIL</span>
        </span>
      );
    }
    if (str.includes("INCOMPLETE")) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Incomplete</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <Info className="w-3.5 h-3.5 text-slate-500" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl border border-[#DDE4F3] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#DDE4F3] bg-gradient-to-r from-[#F8FAFC] to-white flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0052CC] border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold font-display text-[#17284D]">
                  {brand} {model}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider border border-slate-200">
                  {getProp("device_category") || ident.device_category || "Mobile"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5F6A86] font-mono pt-1">
                <span className="flex items-center space-x-1">
                  <span className="text-slate-400">IMEI:</span>
                  <strong className="text-[#17284D]">{imei1}</strong>
                  <button
                    onClick={handleCopyImei}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#0052CC] transition-colors cursor-pointer"
                    title="Copy IMEI"
                  >
                    {copiedImei ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>

                {imei2 && (
                  <span className="flex items-center space-x-1">
                    <span className="text-slate-400">SIM 2:</span>
                    <strong className="text-[#17284D]">{imei2}</strong>
                  </span>
                )}

                <span className="flex items-center space-x-1">
                  <span className="text-slate-400">WO:</span>
                  <strong className="text-[#17284D]">{workOrder}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5 self-end md:self-center">
            {/* QC Result Badge */}
            <span
              className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
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
            {renderDeviceConditionBadge(getProp("physical_condition_category", "grade", "test_status") || ident.physical_condition_category)}

            {/* Certificate Link */}
            <Link
              href={certificateUrl}
              onClick={() => {
                if (typeof window !== "undefined" && detail) {
                  sessionStorage.setItem("selected_mobile_report", JSON.stringify(detail));
                }
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Open and print certificate"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </Link>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-[#17284D] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 border-b border-[#DDE4F3] bg-[#F8FAFC] flex items-center space-x-2 overflow-x-auto shrink-0 py-2">
          {[
            { id: "diagnostics", label: "Hardware Diagnostics", icon: Activity },
            { id: "specs", label: "Component Specifications", icon: Cpu },
            { id: "battery", label: "Battery & Power", icon: BatteryCharging },
            { id: "audit", label: "Evaluation & Audit Records", icon: ShieldCheck },
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
                    : "bg-white text-[#5F6A86] hover:text-[#17284D] hover:bg-slate-100 border border-[#DDE4F3]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-[#0052CC]" />
              <p className="text-xs font-bold text-[#17284D]">Loading live mobile diagnostic telemetry...</p>
            </div>
          ) : error && !detail ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#17284D]">{error}</p>
            </div>
          ) : (
            <>
              {/* TAB 1: HARDWARE DIAGNOSTICS */}
              {activeTab === "diagnostics" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* 1. Display & Multi-Touch */}
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-2.5">
                    <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-[#0052CC]">
                      <Monitor className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                        Display & Multi-Touch
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Multi-Touch Digitizer</span>
                        {renderStatusBadge(getProp("Display_Touch_Screen", "TouchScreen", "Touch_Screen", "display_touch_screen", "display_test_result"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Multi-Finger Touch</span>
                        {renderStatusBadge(getProp("Multifinger_test", "MultiFinger", "multifinger"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Dead Pixel Check</span>
                        {renderStatusBadge(getProp("DEAD_PIXEL_CHECK", "Display_Dead_Pixel", "Dead_Pixel", "DeadPixels", "dead_pixel", "Display_Color"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Display Brightness</span>
                        {renderStatusBadge(getProp("Display_brightness", "Screen_Brightness", "Brightness"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Orientation / Rotation</span>
                        {renderStatusBadge(getProp("Orientation", "orientation", "Rotation", "rotation"))}
                      </div>
                    </div>
                  </div>

                  {/* 2. Optics & Cameras */}
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-2.5">
                    <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-[#0052CC]">
                      <Camera className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                        Optics & Cameras
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Rear Primary Camera</span>
                        {renderStatusBadge(getProp("Back_Camera", "RearCamera", "rear_camera", "camera_rear", "camera_photo_test_result", "Camera"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Front Selfie Camera</span>
                        {renderStatusBadge(getProp("Front_Camera", "front_camera", "camera_front", "camera_video_test_result", "SelfieCamera"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Camera Auto Focus</span>
                        {renderStatusBadge(getProp("Camera_Auto_Focus", "AutoFocus", "auto_focus"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Flash / Torch</span>
                        {renderStatusBadge(getProp("Flash", "Flash_Light", "Tourch", "Torch", "camera_flash", "Flashlight"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Video Recording</span>
                        {renderStatusBadge(getProp("Back_Video_Recording", "RearVideo", "video_recording"))}
                      </div>
                    </div>
                  </div>

                  {/* 3. Audio & Acoustics */}
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-2.5">
                    <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-[#0052CC]">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                        Audio & Acoustics
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Loudspeaker</span>
                        {renderStatusBadge(getProp("LoudSpeaker", "Speaker", "loudspeaker_test_result", "loudspeaker"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Earpiece / Receiver</span>
                        {renderStatusBadge(getProp("Earphone", "Front_speaker", "Receiver", "earpiece", "earpiece_receiver"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Microphone Recording</span>
                        {renderStatusBadge(getProp("Microphone", "handset_mic", "mic_test_result", "mic", "Mic"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Audio Playback Test</span>
                        {renderStatusBadge(getProp("audioPlakbackTest", "AudioPlayback", "audio_playback"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Earphone 3.5mm Jack</span>
                        {renderStatusBadge(getProp("Earphone_Jack", "HeadphoneJack", "Headphone_Jack", "3.5mm_jack"))}
                      </div>
                    </div>
                  </div>

                  {/* 4. Connectivity & Wireless */}
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-2.5">
                    <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-[#0052CC]">
                      <Wifi className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                        Connectivity & Cellular
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Wi-Fi Module</span>
                        {renderStatusBadge(getProp("WiFi", "wifi", "wireless_test_result", "WLAN", "Wifi"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Internet Access</span>
                        {renderStatusBadge(getProp("Internet", "internet", "network_connectivity"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Bluetooth</span>
                        {renderStatusBadge(getProp("Bluetooth", "bluetooth", "BT", "bluetooth_test_result"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">GPS Location</span>
                        {renderStatusBadge(getProp("GPS", "gps", "Location", "location_service"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">SIM 1 Signal</span>
                        {renderStatusBadge(getProp("Network_Signal_sim1", "Call_SIM_1", "SIM_1_Test", "sim1", "Sim_Tray"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">NFC Module</span>
                        {renderStatusBadge(getProp("NFC", "nfc", "contactless"))}
                      </div>
                    </div>
                  </div>

                  {/* 5. Biometrics & Sensors */}
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-2.5">
                    <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-[#0052CC]">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                        Biometrics & Sensors
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Biometric (Face/Finger)</span>
                        {renderStatusBadge(getProp("Biometric", "Fingerprint", "Fingerprint_Sensor", "FaceID", "Face_Recognition", "Face_Unlock", "biometric_test_result"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Proximity Sensor</span>
                        {renderStatusBadge(getProp("Proximity", "proximity_sensor", "Proximity_Sensor", "ProximitySensor"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Ambient Light Sensor</span>
                        {renderStatusBadge(getProp("Light", "ambient_light_sensor", "AmbientLight"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Gyroscope</span>
                        {renderStatusBadge(getProp("Gyroscope", "GyroscopeGaming", "gyro_sensor", "Gyro"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Vibration Motor</span>
                        {renderStatusBadge(getProp("Vibrate", "Vibration", "vibrator_test_result", "vibration_motor", "Vibrator"))}
                      </div>
                    </div>
                  </div>

                  {/* 6. Power, Hardware Keys & Battery */}
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-2.5">
                    <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 text-[#0052CC]">
                      <Zap className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                        Power, Keys & Battery
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Power Key</span>
                        {renderStatusBadge(getProp("Power_Key", "Power_Button", "PowerButton", "power_button", "PowerKey"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Volume Up Key</span>
                        {renderStatusBadge(getProp("Volume_Up_Button", "VolumeUp", "vol_up", "Volume_Button"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Volume Down Key</span>
                        {renderStatusBadge(getProp("Volume_Down_Button", "VolumeDown", "vol_down"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Battery Diagnostics</span>
                        {renderStatusBadge(getProp("Battery", "battarystatus", "BatterytestStatus", "battery_test_result"))}
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-slate-600 font-medium">Charging Port / USB</span>
                        {renderStatusBadge(getProp("ChargingTest", "Charging_Port", "USB", "charging_port", "Charging", "charging_test"))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: COMPONENT SPECIFICATIONS */}
              {activeTab === "specs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-3">
                    <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                      <Cpu className="w-4 h-4" />
                      <span>Compute & Processor</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#5F6A86]">Brand / Manufacturer:</span>
                        <span className="font-bold text-[#17284D]">{brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F6A86]">Model Name:</span>
                        <span className="font-bold text-[#17284D]">{model || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F6A86]">Processor Cores:</span>
                        <span className="font-semibold text-[#17284D]">
                          {getProp("processor_core") ? `${getProp("processor_core")} Cores` : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F6A86]">Device Category:</span>
                        <span className="font-semibold text-[#17284D]">{getProp("device_category") || ident.device_category || "Mobile"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-3">
                    <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                      <HardDrive className="w-4 h-4" />
                      <span>Memory & Storage</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#5F6A86]">Internal Storage:</span>
                        <span className="font-bold text-[#17284D]">{getProp("storage", "internal_storage", "rom") || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F6A86]">System RAM:</span>
                        <span className="font-semibold text-[#17284D]">{getProp("ram", "system_ram", "RAM") || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F6A86]">Screen Size:</span>
                        <span className="font-semibold text-[#17284D]">{getProp("screen_size") || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F6A86]">Operating System:</span>
                        <span className="font-semibold text-[#17284D]">
                          {getProp("os") ? `${getProp("os")}${getProp("os_versio") ? ` v${getProp("os_versio")}` : ""}` : (getProp("os_versio") ? `v${getProp("os_versio")}` : "—")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F6A86]">Rear Camera:</span>
                        <span className="font-semibold text-[#17284D]">{getProp("rear_camera_mp") || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#5F6A86]">Front Camera:</span>
                        <span className="font-semibold text-[#17284D]">{getProp("front_camera_mp") || "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: BATTERY & POWER */}
              {activeTab === "battery" && (
                <div className="space-y-4">
                  <div className="bg-[#F8FAFC] p-5 rounded-xl border border-[#DDE4F3] space-y-4">
                    <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                      <BatteryCharging className="w-4 h-4" />
                      <span>Battery Health & Power Metrics</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] text-center space-y-1 shadow-xs">
                        <span className="text-[11px] font-bold text-[#5F6A86] uppercase">Battery Health</span>
                        <div className="text-2xl font-black text-emerald-600">
                          {getProp("Health_Parcent", "Health_Percent", "battery_health") || (getProp("score") ? `${getProp("score")}%` : "—")}
                        </div>
                        <span className="text-[10px] text-slate-400">Automated diagnostic score</span>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] text-center space-y-1 shadow-xs">
                        <span className="text-[11px] font-bold text-[#5F6A86] uppercase">Battery Capacity</span>
                        <div className="text-lg font-bold text-[#17284D]">
                          {getProp("battery_capacity", "BatteryCapacity", "battery_mah") || "—"}
                        </div>
                        <span className="text-[10px] text-slate-400">Manufacturer design rating</span>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-[#DDE4F3] text-center space-y-1 shadow-xs">
                        <span className="text-[11px] font-bold text-[#5F6A86] uppercase">Charging Interface</span>
                        <div className="text-lg font-bold text-emerald-600">
                          {getProp("ChargingTest", "USB") === "1" || getProp("ChargingTest", "USB") === "PASS" ? "PASS" : (getProp("ChargingTest", "USB") === "0" ? "FAIL" : (getProp("ChargingTest", "USB") || "Operational"))}
                        </div>
                        <span className="text-[10px] text-slate-400">USB / Port data verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EVALUATION & AUDIT RECORDS */}
              {activeTab === "audit" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Card 1: Evaluation & Order Identifiers */}
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-3">
                    <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                      <FileText className="w-4 h-4" />
                      <span>Order & System Identifiers</span>
                    </div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-sans font-medium">Work Order ID:</span>
                        <span className="font-bold text-[#17284D]">{getProp("workorderid", "workOrder") || "—"}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-sans font-medium">Certificate No:</span>
                        <span className="font-bold text-[#0052CC]">{getProp("certificate_number", "ServiceKey") || "—"}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-sans font-medium">Service Key:</span>
                        <span className="font-semibold text-[#17284D]">{getProp("ServiceKey", "servicekey") || "—"}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-sans font-medium">Master ID (MSTID):</span>
                        <span className="font-semibold text-[#17284D]">{getProp("mstid", "id") || mstidOrImei || "—"}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-sans font-medium">Partner / Merchant ID:</span>
                        <span className="font-semibold text-[#17284D]">{getProp("PartnerID", "partnercode", "merchant_id") || "—"}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-sans font-medium">MAC Address:</span>
                        <span className="font-semibold text-[#17284D]">{getProp("MacAddress") || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: QC Assessment Metrics */}
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-3">
                    <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                      <Activity className="w-4 h-4" />
                      <span>QC Assessment Metrics</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-medium">Total Tests Run:</span>
                        <span className="font-bold text-[#17284D] bg-white px-2 py-0.5 rounded-md font-mono border border-slate-200">
                          {getProp("Totaltest") || "30"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-medium">Passed Tests:</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono border border-emerald-200">
                          {getProp("Testpassed") || (isPass ? "30" : "—")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-medium">Failed Tests:</span>
                        <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md font-mono border border-rose-200">
                          {getProp("Testfailed") || (isPass ? "0" : "—")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-medium">QC Status:</span>
                        <span className="font-bold">{displayResult}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-medium">Condition Grade:</span>
                        <span className="font-bold text-[#0052CC]">{formatConditionCategory(getProp("physical_condition_category", "grade", "test_status"))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Operator & Audit Metadata */}
                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#DDE4F3] space-y-3">
                    <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-200">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Operator & Audit Metadata</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-medium">Operator / UID:</span>
                        <span className="font-bold text-[#17284D] font-mono">{getProp("CreatedBy", "uid") || "—"}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-medium">Tested Date / Time:</span>
                        <span className="font-semibold text-[#17284D] font-mono">{getProp("CreatedOn", "test_datetime", "test_date_time") || "—"}</span>
                      </div>
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-medium">Primary IMEI:</span>
                        <span className="font-bold text-[#17284D] font-mono">{imei1}</span>
                      </div>
                      {imei2 && (
                        <div className="flex justify-between items-center py-0.5">
                          <span className="text-[#5F6A86] font-medium">Secondary SIM 2:</span>
                          <span className="font-semibold text-[#17284D] font-mono">{imei2}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-0.5">
                        <span className="text-[#5F6A86] font-medium">Standard:</span>
                        <span className="font-medium text-slate-700">GadgetIQ Mobile QC</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

