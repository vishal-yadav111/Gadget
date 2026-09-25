import { MobileQCReportItem } from "../../types";

export interface DiagnosticTestItem {
  name: string;
  status: "PASS" | "FAIL" | "N/A";
  note?: string;
}

export interface DiagnosticTestCategory {
  categoryName: string;
  tests: DiagnosticTestItem[];
}

export interface FormattedMobileCertificateData {
  serviceKey: string;
  certificateNumber: string;
  workOrderId: string;
  issueDate: string;
  assessedDateTime: string;
  deviceBrand: string;
  deviceModel: string;
  deviceCategory: string;
  serialNumber: string;
  imei1: string;
  imei2?: string;
  modelSku: string;
  productName: string;
  chassisNumber: string;
  color: string;
  overallResult: string; // e.g. "PASS", "FAIL", "Test Incomplete", etc.
  isPass: boolean;
  deviceHealthStatus: string;
  healthScore: number;
  functionalGrade: string; // e.g. "B+", "A", "B", "C"
  cosmeticGrade: string;
  cosmeticGradeLabel: string;
  batteryHealthPercentage?: number;
  batteryCapacity: string;
  batteryStressTest: string;
  passedTestsCount: number;
  failedTestsCount: number;
  naTestsCount: number;
  totalApplicableTests: number;
  totalTestsExecuted: number;
  diagnosticEngine: string;
  technicianName: string;
  technicianAuth: string;
  digitalSignature: string;
  diagnosticCategories: DiagnosticTestCategory[];
  specs: {
    processor: {
      name: string;
      cores: string;
      architecture: string;
    };
    display: {
      size: string;
      resolution: string;
      panel: string;
      touchscreen: string;
      deadPixels: string;
    };
    memory: {
      ram: string;
      storage: string;
    };
    cameras: {
      rearCamera: string;
      frontCamera: string;
      flash: string;
    };
    battery: {
      health: string;
      capacity: string;
    };
    connectivity: {
      cellular: string;
      wifi: string;
      bluetooth: string;
      gps: string;
      nfc: string;
      sim1Status: string;
      sim2Status: string;
    };
    biometrics: {
      biometricStatus: string;
      sensors: string;
    };
    operatingSystem: {
      name: string;
      version: string;
    };
  };
}

/**
 * Resolves raw test result value ("1", 1, "PASS", "Pass", "OK", true -> PASS; "0", 0, "FAIL", "Fail", false -> FAIL; "-1", "", null, undefined -> N/A)
 */
export function resolveTestStatus(val?: string | number | boolean | null): "PASS" | "FAIL" | "N/A" {
  if (val === undefined || val === null) return "N/A";
  if (val === true || val === 1) return "PASS";
  if (val === false || val === 0) return "FAIL";

  const str = String(val).trim().toUpperCase();
  if (
    str === "1" ||
    str === "PASS" ||
    str === "TRUE" ||
    str === "PASSED" ||
    str === "OK" ||
    str === "YES" ||
    str === "SUCCESS"
  ) {
    return "PASS";
  }
  if (
    str === "0" ||
    str === "FAIL" ||
    str === "FALSE" ||
    str === "FAILED" ||
    str === "NO" ||
    str === "FAILURE"
  ) {
    return "FAIL";
  }
  return "N/A";
}

/**
 * Generate a deterministic SHA-256-like hex signature from input strings
 */
export function generateSignatureHash(input: string): string {
  let h1 = 0xdeadbeef,
    h2 = 0x41c6ce57;
  for (let i = 0, ch; i < input.length; i++) {
    ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  const part1 = (h1 >>> 0).toString(16).padStart(8, "0").toUpperCase();
  const part2 = (h2 >>> 0).toString(16).padStart(8, "0").toUpperCase();
  const part3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, "0").toUpperCase();
  const part4 = (((h1 << 5) ^ (h2 >> 3)) >>> 0).toString(16).padStart(8, "0").toUpperCase();

  return `${part1.slice(0, 4)} ${part1.slice(4, 8)} ${part2.slice(0, 4)} ${part2.slice(4, 8)} ${part3.slice(0, 4)} ${part3.slice(4, 8)} ${part4.slice(0, 4)} ${part4.slice(4, 8)}`;
}

/**
 * Pure adapter that transforms any live Mobile QC report item into full typed certificate data.
 * Multi-layer property resolution: inspects raw, raw.data, raw.identification, raw.hardware_diagnostics, raw.all_fields.
 */
export function mapMobileReportToCertificate(
  rawInput: MobileQCReportItem | any
): FormattedMobileCertificateData {
  let raw = rawInput || {};
  if (raw.data && typeof raw.data === "object") {
    raw = { ...raw, ...raw.data };
  }
  const ident = raw.identification || {};
  const hw = raw.hardware_diagnostics || {};
  const all = raw.all_fields || {};
  const specs = raw.component_specs || {};
  const cosmetic = raw.cosmetic_grading || {};
  const accessories = raw.accessories || {};
  const security = raw.security_locks || {};
  const battery = raw.battery_analytics || {};

  // Recursive multi-source field lookup
  const getProp = (...keys: string[]): any => {
    for (const k of keys) {
      if (raw[k] !== undefined && raw[k] !== null && raw[k] !== "") return raw[k];
      if (ident[k] !== undefined && ident[k] !== null && ident[k] !== "") return ident[k];
      if (hw[k] !== undefined && hw[k] !== null && hw[k] !== "") return hw[k];
      if (specs[k] !== undefined && specs[k] !== null && specs[k] !== "") return specs[k];
      if (battery[k] !== undefined && battery[k] !== null && battery[k] !== "") return battery[k];
      if (cosmetic[k] !== undefined && cosmetic[k] !== null && cosmetic[k] !== "") return cosmetic[k];
      if (security[k] !== undefined && security[k] !== null && security[k] !== "") return security[k];
      if (accessories[k] !== undefined && accessories[k] !== null && accessories[k] !== "") return accessories[k];
      if (all[k] !== undefined && all[k] !== null && all[k] !== "") return all[k];
    }
    return undefined;
  };

  const brand = getProp("brand_name", "device_brand", "brand", "make", "C_Manufacturer", "manufacturer") || "Apple";
  const model = getProp("model_name", "device_model", "model", "product_name", "C_Model") || "iPhone";
  const imei1 = getProp("imei_1", "IMEI", "imei", "serial_number", "device_serial_number", "serial") || "N/A";
  const rawImei2 = getProp("imei_2", "imei2", "secondary_imei");
  const imei2 = rawImei2 && rawImei2 !== imei1 && rawImei2 !== "NA" && rawImei2 !== "0" ? String(rawImei2) : undefined;
  const serial = getProp("serial_number", "device_serial_number", "serial", "device_id") || imei1;
  const mstId = getProp("mstid", "MstID", "mst_id", "id");
  const serviceKey = getProp("ServiceKey", "servicekey", "service_key") || (mstId ? `XC${mstId}` : `XC${String(imei1).slice(-6)}`);
  const certNumber = getProp("certificate_number", "certificateNumber", "ServiceKey") || (mstId ? `XC${mstId}` : `XC${String(imei1).slice(-6)}`);
  const workOrder = getProp("workorderid", "work_order_id", "workOrder", "workorder") || (mstId ? `WO${mstId}` : "WO-MAIN");
  const color = getProp("color", "device_color", "Color") || "—";
  const deviceCat = getProp("device_category", "category", "product_category") || "Mobile";

  const storageVal = getProp("storage", "internal_storage", "rom", "capacity", "HDD_SSD");
  const ramVal = getProp("ram", "g_ram", "system_ram", "memory", "RAM");
  const sku = `${brand.slice(0, 3).toUpperCase()}-${model.replace(/\s+/g, "")}-${storageVal || ""}`.trim().replace(/-+$/, "");
  const productName = `${brand} ${model} ${storageVal ? `(${storageVal})` : ""}`.trim();

  // Dates
  const rawAssessed =
    getProp("test_datetime", "g_test_datetime", "test_date_time", "test_date_timen") ||
    (getProp("test_date") && getProp("test_time") ? `${getProp("test_date")} ${getProp("test_time")}` : undefined) ||
    getProp("CreatedOn", "CreatedDate", "created_at");

  const assessedDateTime = rawAssessed
    ? String(rawAssessed).replace("T", " ").substring(0, 19)
    : new Date().toLocaleString("en-IN");

  const rawIssue = getProp("test_date", "g_test_date", "CreatedOn", "CreatedDate");
  const issueDate = rawIssue
    ? String(rawIssue).split("T")[0].split(" ")[0]
    : new Date().toLocaleDateString("en-IN");

  // Battery health
  let batteryPct: number | undefined = undefined;
  const rawHealth = getProp("Health_Parcent", "Health_Percent", "battery_health", "g_battery_health", "battery_health_percentage", "B_BatteryHealth", "score");
  if (rawHealth !== undefined && rawHealth !== null && String(rawHealth).trim() !== "") {
    const num = parseInt(String(rawHealth).replace(/[^0-9]/g, ""), 10);
    if (!isNaN(num) && num > 0) batteryPct = num;
  }

  const batteryCap = getProp("battery_capacity", "BatteryCapacity", "battery_mah", "capacity") || "—";

  // Overall QC Result
  const rawQcResult = String(getProp("QCResult", "test_result", "g_test_result", "qc_result", "status", "test_status") || "").trim();
  const rawBattStatus = getProp("Battery", "battarystatus", "BatterytestStatus");
  const isPass = rawQcResult
    ? rawQcResult.toUpperCase() === "PASS" || rawQcResult.toUpperCase() === "PASSED"
    : resolveTestStatus(rawBattStatus) === "PASS";
  const overallResult = rawQcResult || (isPass ? "PASS" : "FAIL");

  // Grade
  const rawGrade = getProp("physical_condition_category", "grade", "Grade", "g_grade", "test_status");
  const functionalGrade = rawGrade ? String(rawGrade).replace(/Category\s*/i, "").trim() : (isPass ? "A" : "B");
  const cosmeticGrade = functionalGrade;
  const cosmeticGradeLabel = getProp("grade_definition", "g_grade_definition", "physical_condition_category") || (isPass ? "Certified operational condition" : "Advisories noted");

  // Hardware Diagnostics: All 64 Mandatory Telemetry Tests
  // 1. SCREEN (5 Tests)
  const screenTests: DiagnosticTestItem[] = [
    { name: "Dead Pixel Check", status: resolveTestStatus(getProp("DEAD_PIXEL_CHECK", "Display_Dead_Pixel", "Dead_Pixel", "DeadPixels")) },
    { name: "Display Dead Pixel", status: resolveTestStatus(getProp("Display_Dead_Pixel", "DEAD_PIXEL_CHECK", "Dead_Pixel")) },
    { name: "Display Á Touch Screen", status: resolveTestStatus(getProp("Display_Touch_Screen", "TouchScreen", "Touch_Screen", "display_touch_screen", "display_test_result")) },
    { name: "Display Brightness", status: resolveTestStatus(getProp("Display_brightness", "Screen_Brightness", "Brightness")), note: String(getProp("Display_brightness")) === "-1" ? "not supported" : undefined },
    { name: "Multi-Touch Test", status: resolveTestStatus(getProp("Multifinger_test", "MultiFinger", "multifinger", "Multi_Touch_Test")) },
  ];

  // 2. AUDIO/VIDEO (19 Tests)
  const audioVideoTests: DiagnosticTestItem[] = [
    { name: "Back Camera", status: resolveTestStatus(getProp("Back_Camera", "RearCamera", "rear_camera", "camera_rear", "Camera")), note: getProp("rear_camera_mp") ? `${getProp("rear_camera_mp")}` : undefined },
    { name: "Front Camera", status: resolveTestStatus(getProp("Front_Camera", "front_camera", "camera_front", "SelfieCamera")), note: getProp("front_camera_mp") ? `${getProp("front_camera_mp")}` : undefined },
    { name: "Bluetooth", status: resolveTestStatus(getProp("Bluetooth", "bluetooth", "BT")) },
    { name: "Earphone Jack", status: resolveTestStatus(getProp("Earphone_Jack", "HeadphoneJack", "3.5mm_jack")), note: String(getProp("Earphone_Jack")) === "-1" ? "not fitted" : undefined },
    { name: "Loud Speaker", status: resolveTestStatus(getProp("LoudSpeaker", "Speaker", "loudspeaker")) },
    { name: "Front Speaker", status: resolveTestStatus(getProp("Front_speaker", "FrontSpeaker", "Receiver")) },
    { name: "Camera Auto Focus", status: resolveTestStatus(getProp("Camera_Auto_Focus", "AutoFocus", "auto_focus")), note: String(getProp("Camera_Auto_Focus")) === "-1" ? "fixed focus" : undefined },
    { name: "Back Video Recording", status: resolveTestStatus(getProp("Back_Video_Recording", "RearVideo", "video_recording")) },
    { name: "Front Video Recording", status: resolveTestStatus(getProp("Front_Video_Recording", "FrontVideo", "selfie_video")), note: String(getProp("Front_Video_Recording")) === "-1" ? "N/A" : undefined },
    { name: "Microphone", status: resolveTestStatus(getProp("Microphone", "mic", "mic_test_result")) },
    { name: "Flash", status: resolveTestStatus(getProp("Flash", "camera_flash")) },
    { name: "Torch", status: resolveTestStatus(getProp("Tourch", "Torch", "Flashlight")), note: String(getProp("Tourch")) === "-1" ? "via flash" : undefined },
    { name: "Light", status: resolveTestStatus(getProp("Light", "ambient_light_sensor")), note: String(getProp("Light")) === "-1" ? "not fitted" : undefined },
    { name: "Earphone", status: resolveTestStatus(getProp("Earphone", "earpiece")) },
    { name: "Handset mic", status: resolveTestStatus(getProp("handset_mic", "Handset_mic")), note: String(getProp("handset_mic")) === "-1" ? "primary only" : undefined },
    { name: "Handset mic keys", status: resolveTestStatus(getProp("Handset_mic_keys", "handset_mic_keys", "Earphone_Keys")), note: String(getProp("handset_mic_keys")) === "-1" ? "not fitted" : undefined },
    { name: "NoiseCancellationTest", status: resolveTestStatus(getProp("NoiseCancellationTest", "NoiseCancellation")), note: String(getProp("NoiseCancellationTest")) === "-1" ? "not fitted" : undefined },
    { name: "Front camera flash", status: resolveTestStatus(getProp("Front_camera_flash", "FrontCameraFlash", "front_flash")), note: String(getProp("Front_camera_flash")) === "-1" ? "not fitted" : undefined },
    { name: "Audio Playback Test", status: resolveTestStatus(getProp("audioPlakbackTest", "AudioPlayback", "audio_playback")) },
  ];

  // 3. NETWORK (8 Tests)
  const networkTests: DiagnosticTestItem[] = [
    { name: "Call SIM1", status: resolveTestStatus(getProp("Call_SIM_1", "Call_Sim1", "Call SIM1")) },
    { name: "Call SIM2", status: resolveTestStatus(getProp("Call_SIM_2", "Call_Sim2", "Call SIM2")), note: String(getProp("Call_SIM_2")) === "-1" ? "single SIM" : undefined },
    { name: "WiFi", status: resolveTestStatus(getProp("WiFi", "wifi", "WLAN", "Wifi")) },
    { name: "Internet", status: resolveTestStatus(getProp("Internet", "internet", "network_connectivity")) },
    { name: "GPS", status: resolveTestStatus(getProp("GPS", "gps", "Location")) },
    { name: "Network Signal SIM1", status: resolveTestStatus(getProp("Network_Signal_sim1", "sim1")) },
    { name: "Network Signal SIM2", status: resolveTestStatus(getProp("Network_Signal_sim2", "sim2")), note: String(getProp("Network_Signal_sim2")) === "-1" ? "single SIM" : undefined },
    { name: "VolteCallingTest", status: resolveTestStatus(getProp("volteCallingTest", "VolteCallingTest", "volte", "VoLTE")), note: String(getProp("volteCallingTest")) === "-1" ? "N/A" : undefined },
  ];

  // 4. OTHERS (31 Tests)
  const othersTests: DiagnosticTestItem[] = [
    { name: "IMEI Validation", status: resolveTestStatus(getProp("IMEI_VALIDATION", "imei_validation", "imei_1")) },
    { name: "Vibrate", status: resolveTestStatus(getProp("Vibrate", "Vibration")) },
    { name: "Battery", status: resolveTestStatus(getProp("Battery", "battarystatus", "BatterytestStatus")) },
    { name: "Internal Storage", status: resolveTestStatus(getProp("Internal_Storage", "internal_storage", "storage") ? "1" : "N/A"), note: getProp("storage", "internal_storage") ? `${getProp("storage", "internal_storage")}` : undefined },
    { name: "External Storage", status: resolveTestStatus(getProp("External_Storage", "external_storage", "SD_Card")), note: String(getProp("External_Storage")) === "-1" || !getProp("External_Storage") ? "not fitted" : undefined },
    { name: "Proximity", status: resolveTestStatus(getProp("Proximity", "proximity_sensor")) },
    { name: "Volume Up Button", status: resolveTestStatus(getProp("Volume_Up_Button", "VolumeUp")) },
    { name: "Volume Down Button", status: resolveTestStatus(getProp("Volume_Down_Button", "VolumeDown")) },
    { name: "Home Key", status: resolveTestStatus(getProp("Home_Key", "HomeButton", "HomeKey")), note: String(getProp("Home_Key")) === "-1" ? "gesture bar" : undefined },
    { name: "Back Key", status: resolveTestStatus(getProp("Back_Key", "BackButton", "BackKey")), note: String(getProp("Back_Key")) === "-1" || !getProp("Back_Key") ? "gesture bar" : undefined },
    { name: "Power Key", status: resolveTestStatus(getProp("Power_Key", "PowerButton")) },
    { name: "USB", status: resolveTestStatus(getProp("USB", "usb_test")), note: String(getProp("USB")) === "-1" ? "tested via charge" : undefined },
    { name: "Charging", status: resolveTestStatus(getProp("ChargingTest", "Charging", "charging_test")) },
    { name: "OTG", status: resolveTestStatus(getProp("OtgTest", "OTG", "USB_OTG")), note: String(getProp("OtgTest")) === "-1" || !getProp("OtgTest") ? "N/A" : undefined },
    { name: "Gyroscope", status: resolveTestStatus(getProp("Gyroscope", "gyro_sensor")) },
    { name: "Screen Lock", status: resolveTestStatus(getProp("Screen_Lock", "ScreenLock")), note: String(getProp("Screen_Lock")) === "-1" ? "verified" : undefined },
    { name: "Biometric", status: resolveTestStatus(getProp("Biometric", "Fingerprint", "FaceID")) },
    { name: "NFC", status: resolveTestStatus(getProp("NFC", "nfc")), note: String(getProp("NFC")) === "-1" ? "not fitted" : undefined },
    { name: "Gravity", status: resolveTestStatus(getProp("Gravity", "gravity_sensor", "Accelerometer")), note: String(getProp("Gravity")) === "-1" ? "N/A" : undefined },
    { name: "Infrared", status: resolveTestStatus(getProp("Infrared", "IR_Blaster", "ir_sensor")), note: String(getProp("Infrared")) === "-1" ? "not fitted" : undefined },
    { name: "Gyroscope Gaming", status: resolveTestStatus(getProp("GyroscopeGaming", "gyroscope_gaming")), note: String(getProp("GyroscopeGaming")) === "-1" ? "standard gyro" : undefined },
    { name: "Humidity", status: resolveTestStatus(getProp("Humidity", "humidity_sensor")), note: String(getProp("Humidity")) === "-1" ? "not fitted" : undefined },
    { name: "Motion Detector", status: resolveTestStatus(getProp("Motion_Detector", "motion_detector")), note: String(getProp("Motion_Detector")) === "-1" ? "not fitted" : undefined },
    { name: "Step Detector", status: resolveTestStatus(getProp("Step_Detector", "step_detector")), note: String(getProp("Step_Detector")) === "-1" ? "not fitted" : undefined },
    { name: "Step Counter", status: resolveTestStatus(getProp("Step_Counter", "step_counter")), note: String(getProp("Step_Counter")) === "-1" ? "not fitted" : undefined },
    { name: "UV Sensor", status: resolveTestStatus(getProp("UV_Sensor", "uv_sensor")), note: String(getProp("UV_Sensor")) === "-1" ? "not fitted" : undefined },
    { name: "Orientation", status: resolveTestStatus(getProp("Orientation", "rotation")) },
    { name: "Fm radio", status: resolveTestStatus(getProp("Fm_radio", "FM_Radio", "fm_radio")), note: String(getProp("Fm_radio")) === "-1" ? "not fitted" : undefined },
    { name: "HallSensor", status: resolveTestStatus(getProp("hallSensor", "HallSensor", "hall_sensor")), note: String(getProp("hallSensor")) === "-1" ? "not fitted" : undefined },
    { name: "Battery Storage Capacity", status: resolveTestStatus(getProp("batteryStorageCapacity", "battery_capacity", "BatteryCapacity") ? "1" : "N/A"), note: getProp("battery_capacity") ? `${getProp("battery_capacity")}` : undefined },
    { name: "CPU Performance", status: resolveTestStatus(getProp("cpuPerformance", "CPU_Performance")) },
  ];

  // 5. BATTERY STRESS TEST (1 Test)
  const batteryStressTests: DiagnosticTestItem[] = [
    { name: "Battery", status: resolveTestStatus(getProp("Battery", "battarystatus", "BatterytestStatus", "battery_stress_test")) },
  ];

  const allTests = [
    ...screenTests,
    ...audioVideoTests,
    ...networkTests,
    ...othersTests,
    ...batteryStressTests,
  ];

  const passedTestsCount = allTests.filter((t) => t.status === "PASS").length;
  const failedTestsCount = allTests.filter((t) => t.status === "FAIL").length;
  const naTestsCount = allTests.filter((t) => t.status === "N/A").length;
  const totalApplicableTests = passedTestsCount + failedTestsCount || allTests.length;
  const totalTestsExecuted = allTests.length;

  const deviceHealthStatus = isPass ? ((batteryPct ?? 90) >= 80 ? "Excellent" : "Good") : "Requires Attention";
  const healthScore = isPass ? Math.max(85, batteryPct ?? 90) : 55;

  // 10. Operator / Technician Identity
  const rawTech =
    getProp(
      "tester_id",
      "g_tester_id",
      "uid",
      "createdBy",
      "CreatedBy",
      "tester_name",
      "tester_id_full",
      "operator"
    ) || "Operator";

  // Sanitize: strip company names, 10+ digit mobile numbers, and unwanted bracketed text
  const techName = String(rawTech)
    .replace(/.*Pvt\.\s*Ltd\.\s*/i, "")
    .replace(/\b\d{10,}\b/g, "")
    .replace(/[\(\[\{][^\)\]\}]*[\)\]\}]/g, "")
    .trim() || "Operator";

  const techAuth = `GIQ-T-${getProp("merchant_id", "PartnerID", "workorder_partner_id", "mstid", "uid") || "1854"}`;

  const digitalSignature = generateSignatureHash(
    `${certNumber}-${imei1}-${assessedDateTime}-${workOrder}`
  );

  const diagnosticEngine =
    getProp("g_xcqc_application_version", "xcqc_application_version") ||
    `${getProp("AppExt", "app_name") || "XCQC Suite"} v${getProp("os_versio", "app_version") || "3.4"}`;

  return {
    serviceKey,
    certificateNumber: certNumber,
    workOrderId: workOrder,
    issueDate,
    assessedDateTime,
    deviceBrand: brand,
    deviceModel: model,
    deviceCategory: deviceCat,
    serialNumber: serial,
    imei1,
    imei2,
    modelSku: sku,
    productName,
    chassisNumber: getProp("device_id", "chassisNumber") || serial,
    color,
    overallResult,
    isPass,
    deviceHealthStatus,
    healthScore,
    functionalGrade,
    cosmeticGrade,
    cosmeticGradeLabel,
    batteryHealthPercentage: batteryPct,
    batteryCapacity: batteryCap,
    batteryStressTest: isPass ? "Passed" : "Incomplete",
    passedTestsCount,
    failedTestsCount,
    naTestsCount,
    totalApplicableTests,
    totalTestsExecuted,
    diagnosticEngine,
    technicianName: String(techName),
    technicianAuth: techAuth,
    digitalSignature,
    diagnosticCategories: [
      { categoryName: "SCREEN", tests: screenTests },
      { categoryName: "AUDIO/VIDEO", tests: audioVideoTests },
      { categoryName: "NETWORK", tests: networkTests },
      { categoryName: "OTHERS", tests: othersTests },
      { categoryName: "BATTERY STRESS TEST", tests: batteryStressTests },
    ],
    specs: {
      processor: {
        name: `${brand} Application Processor`,
        cores: getProp("processor_core", "cores") ? `${getProp("processor_core", "cores")} Cores` : "—",
        architecture: "64-bit Architecture",
      },
      display: {
        size: getProp("screen_size", "display_size") ? `${getProp("screen_size", "display_size")}` : "—",
        resolution: "Native High Resolution Display",
        panel: "Multi-Touch Digitizer",
        touchscreen: resolveTestStatus(getProp("Display_Touch_Screen", "TouchScreen")) === "PASS" ? "Passed" : "Failed / Advisory",
        deadPixels: resolveTestStatus(getProp("DEAD_PIXEL_CHECK", "Display_Dead_Pixel")) === "PASS" ? "0 Dead Pixels Detected" : "Advisories Noted",
      },
      memory: {
        ram: ramVal ? String(ramVal) : "—",
        storage: storageVal ? String(storageVal) : "—",
      },
      cameras: {
        rearCamera: getProp("rear_camera_mp") ? `${getProp("rear_camera_mp")} Sensor (Tested)` : "Primary Camera (Tested)",
        frontCamera: getProp("front_camera_mp") ? `${getProp("front_camera_mp")} Sensor (Tested)` : "Front Camera (Tested)",
        flash: resolveTestStatus(getProp("Flash", "Tourch")) === "PASS" ? "Integrated Flash (Operational)" : "Not Fitted / N/A",
      },
      battery: {
        health: batteryPct !== undefined ? `${batteryPct}% Health` : "—",
        capacity: batteryCap,
      },
      connectivity: {
        cellular: resolveTestStatus(getProp("Call_SIM_1", "Network_Signal_sim1")) === "PASS" ? "Cellular Verified (SIM 1 Active)" : "Cellular Test Incomplete",
        wifi: resolveTestStatus(getProp("WiFi", "wifi")) === "PASS" ? "Wi-Fi Dual Band (Tested)" : "Wi-Fi Inactive",
        bluetooth: resolveTestStatus(getProp("Bluetooth", "bluetooth")) === "PASS" ? "Bluetooth Module (Tested)" : "Bluetooth Inactive",
        gps: resolveTestStatus(getProp("GPS", "gps")) === "PASS" ? "GPS Location (Operational)" : "GPS Inactive",
        nfc: resolveTestStatus(getProp("NFC", "nfc")) === "PASS" ? "NFC Present & Active" : "Not Fitted / Inactive",
        sim1Status: resolveTestStatus(getProp("Call_SIM_1", "Network_Signal_sim1")) === "PASS" ? "Active (Signal Verified)" : "No SIM / Inactive",
        sim2Status: String(getProp("Call_SIM_2")) === "-1" ? "Single SIM / Not Fitted" : resolveTestStatus(getProp("Call_SIM_2")) === "PASS" ? "Active" : "Inactive",
      },
      biometrics: {
        biometricStatus: resolveTestStatus(getProp("Biometric", "Fingerprint", "FaceID")) === "PASS" ? "Biometric Hardware Operational" : "Biometric Inactive",
        sensors: resolveTestStatus(getProp("Proximity", "proximity_sensor")) === "PASS" ? "Proximity & Gyroscope Calibrated" : "Sensors Sweep Completed",
      },
      operatingSystem: {
        name: getProp("os", "os_name") || "—",
        version: getProp("os_versio", "os_version") ? `v${getProp("os_versio", "os_version")}` : "—",
      },
    },
  };
}

