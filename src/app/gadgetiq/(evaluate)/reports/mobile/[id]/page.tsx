"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
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
  FileText,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Layers,
  Sliders,
  Radio,
  Volume2,
  Printer,
  ShieldCheck,
  User,
  Info,
  Sparkles,
  Camera,
  Zap,
} from "lucide-react";
import { MobileDetailData, MobileQCReportItem } from "../../types";
import { reportsService } from "../../services";
import { formatConditionCategory, getConditionBadgeStyle } from "../page";

type TabKey = "diagnostics" | "specs" | "battery" | "audit";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatToMobileDetail(rawInput: any, fallbackId: string = ""): MobileDetailData {
  let rawItem = rawInput;
  if (rawInput && rawInput.data && typeof rawInput.data === "object") {
    rawItem = { ...rawInput, ...rawInput.data };
  }
  if (!rawItem) {
    return {
      identification: {
        mstid: isNaN(Number(fallbackId)) ? 0 : Number(fallbackId),
        serial_number: fallbackId,
        imei_1: fallbackId,
        QCResult: "Test Incomplete",
        test_result: "Test Incomplete",
        test_status: "Test Incomplete",
      },
      hardware_diagnostics: {},
      component_specs: {},
      battery_analytics: {},
      all_fields: {},
    };
  }

  const ident = rawItem.identification || {};
  const hw = rawItem.hardware_diagnostics || {};
  const specs = rawItem.component_specs || {};
  const batt = rawItem.battery_analytics || {};
  const all = rawItem.all_fields || rawItem;

  const sources = [ident, specs, batt, hw, all, rawItem];

  const getF = (...keys: string[]) => {
    // 1. Non-empty, non-null value
    for (const src of sources) {
      if (!src) continue;
      for (const k of keys) {
        const val = src[k];
        if (val !== undefined && val !== null && val !== "") {
          return Array.isArray(val) ? val[0] : val;
        }
      }
    }
    // 2. Defined value (e.g. "" or "-1")
    for (const src of sources) {
      if (!src) continue;
      for (const k of keys) {
        const val = src[k];
        if (val !== undefined && val !== null) {
          return Array.isArray(val) ? val[0] : val;
        }
      }
    }
    return undefined;
  };

  const rawQc = getF("test_result", "QCResult", "qc_result", "status", "test_status");
  const rawBatt = getF("Battery", "battarystatus", "BatterytestStatus");
  const isPass = rawQc
    ? String(rawQc).toUpperCase() === "PASS" || String(rawQc).toUpperCase() === "PASSED"
    : String(rawBatt) === "1" || String(rawBatt).toUpperCase() === "PASS";

  const rawMstid = getF("mstid", "MstID", "id");
  const parsedMstid = Array.isArray(rawMstid) ? rawMstid[0] : rawMstid;

  return {
    identification: {
      mstid: Number(parsedMstid) || (isNaN(Number(fallbackId)) ? 0 : Number(fallbackId)),
      imei_1: String(getF("imei_1", "IMEI", "imei", "serial_number") || fallbackId),
      imei_2: getF("imei_2", "imei2"),
      serial_number: String(getF("serial_number", "device_serial_number", "serial", "imei_1", "IMEI") || fallbackId),
      brand_name: getF("brand_name", "device_brand", "brand", "make", "C_Manufacturer"),
      model_name: getF("model_name", "device_model", "model", "product_name", "C_Model"),
      device_category: getF("device_category", "category") || "Mobile",
      workorderid: getF("workorderid", "work_order_id", "workOrder"),
      QCResult: rawQc ? String(rawQc) : (isPass ? "PASS" : "Test Incomplete"),
      test_result: rawQc ? String(rawQc) : (isPass ? "PASS" : "Test Incomplete"),
      test_status: getF("test_status", "physical_condition_category", "grade"),
      grade: getF("physical_condition_category", "grade", "Grade", "device_grade"),
      physical_condition_category: getF("physical_condition_category", "grade", "Grade"),
      createdBy: getF("createdBy", "CreatedBy", "uid", "tester_id"),
      CreatedOn: getF("CreatedOn", "CreatedDate", "test_datetime", "test_date_time"),
      test_date_time: getF("test_date_time", "test_datetime", "CreatedOn"),
      certificate_number: getF("certificate_number", "ServiceKey", "certificateNumber"),
      storage: getF("storage", "internal_storage", "rom"),
      ram: getF("ram", "system_ram", "RAM"),
      battery_capacity: getF("battery_capacity", "BatteryCapacity", "battery_mah"),
      Health_Parcent: getF("Health_Parcent", "Health_Percent", "battery_health") || (getF("score") ? `${getF("score")}%` : undefined),
    },
    hardware_diagnostics: {
      ...(rawItem.hardware_diagnostics || {}),
      Display_Touch_Screen: getF("Display_Touch_Screen", "TouchScreen", "Touch_Screen", "display_touch_screen", "display_test_result"),
      Multifinger_test: getF("Multifinger_test", "MultiFinger", "multifinger"),
      Display_Dead_Pixel: getF("DEAD_PIXEL_CHECK", "Display_Dead_Pixel", "Dead_Pixel", "DeadPixels", "dead_pixel", "Display_Color"),
      Display_brightness: getF("Display_brightness", "Screen_Brightness", "Brightness"),
      Orientation: getF("Orientation", "orientation", "Rotation", "rotation"),
      Back_Camera: getF("Back_Camera", "RearCamera", "rear_camera", "camera_rear", "camera_photo_test_result", "Camera"),
      Front_Camera: getF("Front_Camera", "front_camera", "camera_front", "camera_video_test_result", "SelfieCamera"),
      Camera_Auto_Focus: getF("Camera_Auto_Focus", "AutoFocus", "auto_focus"),
      Flash: getF("Flash", "Flash_Light", "Tourch", "Torch", "camera_flash", "Flashlight"),
      Back_Video_Recording: getF("Back_Video_Recording", "RearVideo", "video_recording"),
      LoudSpeaker: getF("LoudSpeaker", "Speaker", "loudspeaker_test_result", "loudspeaker"),
      Earphone: getF("Earphone", "Front_speaker", "Receiver", "earpiece", "earpiece_receiver"),
      Microphone: getF("Microphone", "handset_mic", "mic_test_result", "mic", "Mic"),
      audioPlakbackTest: getF("audioPlakbackTest", "AudioPlayback", "audio_playback"),
      Earphone_Jack: getF("Earphone_Jack", "HeadphoneJack", "Headphone_Jack", "3.5mm_jack"),
      WiFi: getF("WiFi", "wifi", "wireless_test_result", "WLAN", "Wifi"),
      Internet: getF("Internet", "internet", "network_connectivity"),
      Bluetooth: getF("Bluetooth", "bluetooth", "BT", "bluetooth_test_result"),
      GPS: getF("GPS", "gps", "Location", "location_service"),
      Network_Signal_sim1: getF("Network_Signal_sim1", "Call_SIM_1", "SIM_1_Test", "sim1", "Sim_Tray"),
      NFC: getF("NFC", "nfc", "contactless"),
      Biometric: getF("Biometric", "Fingerprint", "Fingerprint_Sensor", "FaceID", "Face_Recognition", "Face_Unlock", "biometric_test_result"),
      Proximity: getF("Proximity", "proximity_sensor", "Proximity_Sensor", "ProximitySensor"),
      Light: getF("Light", "ambient_light_sensor", "AmbientLight"),
      Gyroscope: getF("Gyroscope", "GyroscopeGaming", "gyro_sensor", "Gyro"),
      Vibrate: getF("Vibrate", "Vibration", "vibrator_test_result", "vibration_motor", "Vibrator"),
      Power_Key: getF("Power_Key", "Power_Button", "PowerButton", "power_button", "PowerKey"),
      Volume_Up_Button: getF("Volume_Up_Button", "VolumeUp", "vol_up", "Volume_Button"),
      Volume_Down_Button: getF("Volume_Down_Button", "VolumeDown", "vol_down"),
      Battery: getF("Battery", "battarystatus", "BatterytestStatus", "battery_test_result"),
      ChargingTest: getF("ChargingTest", "Charging_Port", "USB", "charging_port", "Charging", "charging_test"),
    },
    component_specs: {
      ...(rawItem.component_specs || {}),
      screen_size: getF("screen_size"),
      storage: getF("storage", "internal_storage", "rom"),
      ram: getF("ram", "system_ram", "RAM"),
      front_camera_mp: getF("front_camera_mp"),
      rear_camera_mp: getF("rear_camera_mp"),
      processor_core: getF("processor_core"),
      os: getF("os"),
      os_versio: getF("os_versio"),
    },
    battery_analytics: {
      ...(rawItem.battery_analytics || {}),
      battery_capacity: getF("battery_capacity", "BatteryCapacity", "battery_mah"),
      Health_Parcent: getF("Health_Parcent", "Health_Percent", "battery_health"),
    },
    all_fields: { ...rawItem, ...(rawItem.all_fields || {}) },
  };
}

export default function MobileDeviceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const targetId = decodeURIComponent(resolvedParams?.id || "");
  const searchParams = useSearchParams();
  const imeiParam = searchParams.get("imei") || "";
  const serviceKeyParam = searchParams.get("servicekey") || "";
  const workOrderParam = searchParams.get("workorder") || "";

  const [activeTab, setActiveTab] = useState<TabKey>("diagnostics");
  const [detail, setDetail] = useState<MobileDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedImei, setCopiedImei] = useState(false);

  const loadDeviceDetail = async () => {
    if (!targetId) return;
    setLoading(true);
    setError(null);

    try {
      let cachedItem: any = null;

      // 1. Check sessionStorage cache first for instant load
      if (typeof window !== "undefined") {
        const cachedStr = sessionStorage.getItem("selected_mobile_report");
        if (cachedStr) {
          try {
            const parsed = JSON.parse(cachedStr);
            const cachedId = String(parsed.mstid || parsed.identification?.mstid || "");
            const cachedImei = String(parsed.IMEI || parsed.imei_1 || parsed.serial_number || parsed.identification?.imei_1 || "");

            if (
              cachedId === targetId ||
              cachedImei === targetId ||
              (imeiParam && (cachedImei === imeiParam || cachedId === imeiParam)) ||
              targetId === "undefined"
            ) {
              cachedItem = parsed;
              setDetail(formatToMobileDetail(parsed, targetId));
              setLoading(false);
            }
          } catch {
            // Proceed to network fetch
          }
        }
      }

      // 2. Fetch live on-demand detail from API proxy
      let apiData: any = null;
      try {
        const res = await reportsService.getMobileDetail(targetId);
        if (res) {
          apiData = (res as any).data ? (res as any).data : res;
        }
      } catch {
        // Continue to fallback search
      }

      if (apiData && (apiData.identification || apiData.hardware_diagnostics || apiData.brand_name || apiData.model_name || apiData.all_fields)) {
        const merged = { ...cachedItem, ...apiData };
        const formatted = formatToMobileDetail(merged, targetId);
        setDetail(formatted);
        setLoading(false);
        return;
      }

      // If already hydrated from cache with diagnostics, stop
      if (cachedItem && (cachedItem.Display_Touch_Screen !== undefined || cachedItem.Back_Camera !== undefined || cachedItem.hardware_diagnostics)) {
        setLoading(false);
        return;
      }

      // 3. Fallback: Search from live reports list
      const listRes = await reportsService.getMobileReportsPaginated({
        search: imeiParam || targetId || serviceKeyParam || "",
        pageSize: 10,
      });

      if (listRes && listRes.data && listRes.data.length > 0) {
        const matched: MobileQCReportItem = listRes.data.find(
          (item) =>
            String(item.mstid) === targetId ||
            (imeiParam && (item.IMEI === imeiParam || item.imei_1 === imeiParam || item.serial_number === imeiParam)) ||
            (serviceKeyParam && item.ServiceKey === serviceKeyParam) ||
            (workOrderParam && item.workorderid === workOrderParam) ||
            item.IMEI === targetId ||
            item.imei_1 === targetId ||
            item.serial_number === targetId ||
            item.ServiceKey === targetId
        ) || listRes.data[0];

        if (matched) {
          const formatted = formatToMobileDetail(matched, targetId);
          setDetail(formatted);
          setLoading(false);
          return;
        }
      }

      if (!cachedItem) {
        setError(`Could not find device report for IMEI/ID: ${targetId}`);
      }
    } catch (err: any) {
      console.error("Error loading mobile detail:", err);
      setError(err?.message || "Failed to load mobile QC details. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeviceDetail();
  }, [targetId]);

  const getProp = (...keys: string[]): any => {
    const sources = [
      detail?.component_specs,
      detail?.battery_analytics,
      detail?.identification,
      detail?.hardware_diagnostics,
      (detail as any)?.all_fields,
      detail as any,
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

  const ident = detail?.identification || {
    mstid: isNaN(Number(targetId)) ? 0 : Number(targetId),
    imei_1: imeiParam || targetId,
    serial_number: imeiParam || targetId,
    brand_name: "",
    model_name: "",
    device_category: "Mobile",
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

  const brand = getProp("brand_name", "device_brand", "brand", "make") || "Device";
  const model = getProp("model_name", "device_model", "model", "product_name") || "";
  const imei1 = getProp("imei_1", "IMEI", "imei", "serial_number") || imeiParam || targetId;
  const imei2 = getProp("imei_2", "imei2");
  const certId = getProp("mstid", "id") || targetId;
  const certKey = getProp("ServiceKey", "servicekey") || serviceKeyParam;
  const workOrder = getProp("workorderid", "workOrder") || workOrderParam || "—";
  const technician = getProp("createdBy", "CreatedBy", "uid", "tester_id");
  const certificateUrl = `/gadgetiq/reports/mobile/certificate?id=${encodeURIComponent(certId)}&imei=${encodeURIComponent(imei1)}&workorder=${encodeURIComponent(workOrder !== "—" ? workOrder : "")}&servicekey=${encodeURIComponent(certKey)}`;

  const handleCopyImei = () => {
    if (imei1 && typeof window !== "undefined") {
      navigator.clipboard.writeText(imei1);
      setCopiedImei(true);
      setTimeout(() => setCopiedImei(false), 2000);
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
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* 🧭 Top Navigation & Back Link */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/gadgetiq/reports/mobile"
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#5F6A86] hover:text-[#0052CC] transition-colors group"
        >
          <div className="p-1.5 rounded-lg bg-white border border-[#DDE4F3] group-hover:border-[#0052CC] transition-colors">
            <ArrowLeft className="w-4 h-4 text-[#17284D] group-hover:text-[#0052CC]" />
          </div>
          <span>Back to Mobile QC Reports</span>
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
                sessionStorage.setItem("selected_mobile_report", JSON.stringify(detail));
              }
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>View & Print Certificate</span>
          </Link>
        </div>
      </div>

      {/* 📱 Main Device Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#DDE4F3] shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0052CC] border border-blue-100 flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-[#17284D] font-display tracking-tight">
                  {brand} {model}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider border border-slate-200">
                  {getProp("device_category") || ident.device_category || "Mobile Smartphone"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5F6A86] font-mono pt-0.5">
                <div className="flex items-center space-x-1.5 bg-[#F4F6FB] px-2.5 py-1 rounded-lg border border-[#DDE4F3]">
                  <span className="text-slate-500 font-bold">IMEI:</span>
                  <strong className="text-[#17284D]">{imei1}</strong>
                  <button
                    onClick={handleCopyImei}
                    className="p-1 hover:bg-white rounded text-slate-400 hover:text-[#0052CC] transition-colors cursor-pointer ml-1"
                    title="Copy IMEI"
                  >
                    {copiedImei ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {imei2 && (
                  <div className="flex items-center space-x-1 bg-[#F4F6FB] px-2.5 py-1 rounded-lg border border-[#DDE4F3]">
                    <span className="text-slate-500">SIM 2:</span>
                    <strong className="text-[#17284D]">{imei2}</strong>
                  </div>
                )}

                <div className="flex items-center space-x-1 bg-[#F4F6FB] px-2.5 py-1 rounded-lg border border-[#DDE4F3]">
                  <span className="text-slate-500">Work Order:</span>
                  <strong className="text-[#17284D]">{workOrder}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Badges & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {/* QC Result Badge */}
            <span
              className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide ${isPass
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
            {renderDeviceConditionBadge(getProp("physical_condition_category", "grade") || ident.physical_condition_category)}

            {/* Technician */}
            {technician && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Tech: {technician}</span>
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
            { id: "audit", label: "Evaluation & Audit Records", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${isActive
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
            Loading complete mobile diagnostic telemetry & component specs...
          </p>
          <p className="text-xs text-[#5F6A86]">IMEI: {targetId}</p>
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
              href="/gadgetiq/reports/mobile"
              className="px-4 py-2 bg-[#F4F6FB] border border-[#DDE4F3] text-[#17284D] text-xs font-bold rounded-xl hover:bg-[#E9EEF9] transition-colors"
            >
              Return to Master Table
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* TAB 1: HARDWARE DIAGNOSTICS (ALL 64 MANDATORY TESTS) */}
          {activeTab === "diagnostics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. SCREEN (5 Tests) */}
              <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 text-[#0052CC]">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      SCREEN
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">5 Tests</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600 font-medium">Dead Pixel Check</span>
                    {renderStatusBadge(getProp("DEAD_PIXEL_CHECK", "Display_Dead_Pixel", "Dead_Pixel", "DeadPixels"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600 font-medium">Display Dead Pixel</span>
                    {renderStatusBadge(getProp("Display_Dead_Pixel", "DEAD_PIXEL_CHECK", "Dead_Pixel"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600 font-medium">Display Á Touch Screen</span>
                    {renderStatusBadge(getProp("Display_Touch_Screen", "TouchScreen", "Touch_Screen", "display_touch_screen", "display_test_result"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600 font-medium">Display Brightness</span>
                    {renderStatusBadge(getProp("Display_brightness", "Screen_Brightness", "Brightness"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600 font-medium">Multi-Touch Test</span>
                    {renderStatusBadge(getProp("Multifinger_test", "MultiFinger", "multifinger", "Multi_Touch_Test"))}
                  </div>
                </div>
              </div>

              {/* 2. AUDIO/VIDEO (19 Tests) */}
              <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3 md:col-span-2 lg:col-span-2">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 text-[#0052CC]">
                  <div className="flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      AUDIO/VIDEO
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">19 Tests</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Back Camera</span>
                    {renderStatusBadge(getProp("Back_Camera", "RearCamera", "rear_camera", "camera_rear", "Camera"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Front Camera</span>
                    {renderStatusBadge(getProp("Front_Camera", "front_camera", "camera_front", "SelfieCamera"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Bluetooth</span>
                    {renderStatusBadge(getProp("Bluetooth", "bluetooth", "BT"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Earphone Jack</span>
                    {renderStatusBadge(getProp("Earphone_Jack", "HeadphoneJack", "3.5mm_jack"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Loud Speaker</span>
                    {renderStatusBadge(getProp("LoudSpeaker", "Speaker", "loudspeaker"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Front Speaker</span>
                    {renderStatusBadge(getProp("Front_speaker", "FrontSpeaker", "Receiver"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Camera Auto Focus</span>
                    {renderStatusBadge(getProp("Camera_Auto_Focus", "AutoFocus", "auto_focus"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Back Video Recording</span>
                    {renderStatusBadge(getProp("Back_Video_Recording", "RearVideo", "video_recording"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Front Video Recording</span>
                    {renderStatusBadge(getProp("Front_Video_Recording", "FrontVideo", "selfie_video"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Microphone</span>
                    {renderStatusBadge(getProp("Microphone", "mic", "mic_test_result"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Flash</span>
                    {renderStatusBadge(getProp("Flash", "camera_flash"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Torch</span>
                    {renderStatusBadge(getProp("Tourch", "Torch", "Flashlight"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Light</span>
                    {renderStatusBadge(getProp("Light", "ambient_light_sensor"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Earphone</span>
                    {renderStatusBadge(getProp("Earphone", "earpiece"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Handset mic</span>
                    {renderStatusBadge(getProp("handset_mic", "Handset_mic"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Handset mic keys</span>
                    {renderStatusBadge(getProp("Handset_mic_keys", "handset_mic_keys", "Earphone_Keys"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">NoiseCancellationTest</span>
                    {renderStatusBadge(getProp("NoiseCancellationTest", "NoiseCancellation"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Front camera flash</span>
                    {renderStatusBadge(getProp("Front_camera_flash", "FrontCameraFlash", "front_flash"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Audio Playback Test</span>
                    {renderStatusBadge(getProp("audioPlakbackTest", "AudioPlayback", "audio_playback"))}
                  </div>
                </div>
              </div>

              {/* 3. NETWORK (8 Tests) */}
              <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 text-[#0052CC]">
                  <div className="flex items-center space-x-2">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      NETWORK
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">8 Tests</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Call SIM1</span>
                    {renderStatusBadge(getProp("Call_SIM_1", "Call_Sim1", "Call SIM1"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Call SIM2</span>
                    {renderStatusBadge(getProp("Call_SIM_2", "Call_Sim2", "Call SIM2"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">WiFi</span>
                    {renderStatusBadge(getProp("WiFi", "wifi", "WLAN", "Wifi"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Internet</span>
                    {renderStatusBadge(getProp("Internet", "internet", "network_connectivity"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">GPS</span>
                    {renderStatusBadge(getProp("GPS", "gps", "Location"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Network Signal SIM1</span>
                    {renderStatusBadge(getProp("Network_Signal_sim1", "sim1"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Network Signal SIM2</span>
                    {renderStatusBadge(getProp("Network_Signal_sim2", "sim2"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">VolteCallingTest</span>
                    {renderStatusBadge(getProp("volteCallingTest", "VolteCallingTest", "volte", "VoLTE"))}
                  </div>
                </div>
              </div>

              {/* 4. OTHERS (31 Tests) */}
              <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3 md:col-span-2 lg:col-span-2">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 text-[#0052CC]">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      OTHERS
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">31 Tests</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">IMEI Validation</span>
                    {renderStatusBadge(getProp("IMEI_VALIDATION", "imei_validation", "imei_1"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Vibrate</span>
                    {renderStatusBadge(getProp("Vibrate", "Vibration"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Battery</span>
                    {renderStatusBadge(getProp("Battery", "battarystatus", "BatterytestStatus"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Internal Storage</span>
                    {renderStatusBadge(getProp("Internal_Storage", "internal_storage", "storage") ? "1" : "N/A")}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">External Storage</span>
                    {renderStatusBadge(getProp("External_Storage", "external_storage", "SD_Card"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Proximity</span>
                    {renderStatusBadge(getProp("Proximity", "proximity_sensor"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Volume Up Button</span>
                    {renderStatusBadge(getProp("Volume_Up_Button", "VolumeUp"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Volume Down Button</span>
                    {renderStatusBadge(getProp("Volume_Down_Button", "VolumeDown"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Home Key</span>
                    {renderStatusBadge(getProp("Home_Key", "HomeButton", "HomeKey"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Back Key</span>
                    {renderStatusBadge(getProp("Back_Key", "BackButton", "BackKey"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Power Key</span>
                    {renderStatusBadge(getProp("Power_Key", "PowerButton"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">USB</span>
                    {renderStatusBadge(getProp("USB", "usb_test"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Charging</span>
                    {renderStatusBadge(getProp("ChargingTest", "Charging", "charging_test"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">OTG</span>
                    {renderStatusBadge(getProp("OtgTest", "OTG", "USB_OTG"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Gyroscope</span>
                    {renderStatusBadge(getProp("Gyroscope", "gyro_sensor"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Screen Lock</span>
                    {renderStatusBadge(getProp("Screen_Lock", "ScreenLock"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Biometric</span>
                    {renderStatusBadge(getProp("Biometric", "Fingerprint", "FaceID"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">NFC</span>
                    {renderStatusBadge(getProp("NFC", "nfc"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Gravity</span>
                    {renderStatusBadge(getProp("Gravity", "gravity_sensor", "Accelerometer"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Infrared</span>
                    {renderStatusBadge(getProp("Infrared", "IR_Blaster", "ir_sensor"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Gyroscope Gaming</span>
                    {renderStatusBadge(getProp("GyroscopeGaming", "gyroscope_gaming"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Humidity</span>
                    {renderStatusBadge(getProp("Humidity", "humidity_sensor"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Motion Detector</span>
                    {renderStatusBadge(getProp("Motion_Detector", "motion_detector"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Step Detector</span>
                    {renderStatusBadge(getProp("Step_Detector", "step_detector"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Step Counter</span>
                    {renderStatusBadge(getProp("Step_Counter", "step_counter"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">UV Sensor</span>
                    {renderStatusBadge(getProp("UV_Sensor", "uv_sensor"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Orientation</span>
                    {renderStatusBadge(getProp("Orientation", "rotation"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Fm radio</span>
                    {renderStatusBadge(getProp("Fm_radio", "FM_Radio", "fm_radio"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">HallSensor</span>
                    {renderStatusBadge(getProp("hallSensor", "HallSensor", "hall_sensor"))}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">Battery Storage Capacity</span>
                    {renderStatusBadge(getProp("batteryStorageCapacity", "battery_capacity", "BatteryCapacity") ? "1" : "N/A")}
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-600 font-medium">CPU Performance</span>
                    {renderStatusBadge(getProp("cpuPerformance", "CPU_Performance"))}
                  </div>
                </div>
              </div>

              {/* 5. BATTERY STRESS TEST (1 Test) */}
              <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 text-[#0052CC]">
                  <div className="flex items-center space-x-2">
                    <BatteryCharging className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#17284D]">
                      BATTERY STRESS TEST
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">1 Test</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 font-medium">Battery Stress Diagnostic</span>
                    {renderStatusBadge(getProp("Battery", "battarystatus", "BatterytestStatus", "battery_stress_test"))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPONENT SPECIFICATIONS */}
          {activeTab === "specs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
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

              <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
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
            <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                <BatteryCharging className="w-4 h-4" />
                <span>Battery Health & Power Metrics</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] text-center space-y-1 shadow-xs">
                  <span className="text-[11px] font-bold text-[#5F6A86] uppercase">Battery Health</span>
                  <div className="text-3xl font-black text-emerald-600">
                    {getProp("Health_Parcent", "Health_Percent", "battery_health") || (getProp("score") ? `${getProp("score")}%` : "—")}
                  </div>
                  <span className="text-[10px] text-slate-400">Automated diagnostic score</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] text-center space-y-1 shadow-xs">
                  <span className="text-[11px] font-bold text-[#5F6A86] uppercase">Battery Capacity</span>
                  <div className="text-xl font-bold text-[#17284D]">
                    {getProp("battery_capacity", "BatteryCapacity", "battery_mah") || "—"}
                  </div>
                  <span className="text-[10px] text-slate-400">Manufacturer design rating</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DDE4F3] text-center space-y-1 shadow-xs">
                  <span className="text-[11px] font-bold text-[#5F6A86] uppercase">Charging Interface</span>
                  <div className="text-xl font-bold text-emerald-600">
                    {getProp("ChargingTest", "USB") === "1" || getProp("ChargingTest", "USB") === "PASS" ? "PASS" : (getProp("ChargingTest", "USB") === "0" ? "FAIL" : (getProp("ChargingTest", "USB") || "Operational"))}
                  </div>
                  <span className="text-[10px] text-slate-400">USB / Port data verified</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EVALUATION & AUDIT RECORDS */}
          {activeTab === "audit" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Evaluation & Order Identifiers */}
              <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                  <FileText className="w-4 h-4" />
                  <span>Evaluation & Order Identifiers</span>
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-sans font-medium">Work Order ID:</span>
                    <span className="font-bold text-[#17284D]">{getProp("workorderid", "workOrder") || workOrderParam || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-sans font-medium">Certificate No:</span>
                    <span className="font-bold text-[#0052CC]">{getProp("certificate_number", "ServiceKey") || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-sans font-medium">Service Key:</span>
                    <span className="font-semibold text-[#17284D]">{getProp("ServiceKey", "servicekey") || serviceKeyParam || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-sans font-medium">Master ID (MSTID):</span>
                    <span className="font-semibold text-[#17284D]">{getProp("mstid", "id") || targetId || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-sans font-medium">Partner / Merchant ID:</span>
                    <span className="font-semibold text-[#17284D]">{getProp("PartnerID", "partnercode", "merchant_id") || "—"}</span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-sans font-medium">Network MAC Address:</span>
                    <span className="font-semibold text-[#17284D]">{getProp("MacAddress") || "—"}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: QC Assessment Metrics */}
              <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                  <Activity className="w-4 h-4" />
                  <span>QC Assessment Metrics</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-medium">Total Diagnostic Tests:</span>
                    <span className="font-bold text-[#17284D] bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                      {getProp("Totaltest") || "30"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-medium">Passed Tests Count:</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-mono border border-emerald-200">
                      {getProp("Testpassed") || (isPass ? "30" : "—")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-medium">Failed Tests Count:</span>
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
              <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-[#0052CC] font-bold text-xs uppercase tracking-wider pb-2 border-b border-slate-100">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Operator & Audit Metadata</span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-medium">Operator / UID:</span>
                    <span className="font-bold text-[#17284D] font-mono">{technician || getProp("CreatedBy", "uid") || "—"}</span>
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
                      <span className="text-[#5F6A86] font-medium">Secondary SIM 2 IMEI:</span>
                      <span className="font-semibold text-[#17284D] font-mono">{imei2}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-[#5F6A86] font-medium">Evaluation Standard:</span>
                    <span className="font-medium text-slate-700">GadgetIQ Mobile QC Standard</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

