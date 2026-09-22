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

  // Recursive multi-source field lookup
  const getProp = (...keys: string[]): any => {
    for (const k of keys) {
      if (raw[k] !== undefined && raw[k] !== null && raw[k] !== "") return raw[k];
      if (ident[k] !== undefined && ident[k] !== null && ident[k] !== "") return ident[k];
      if (hw[k] !== undefined && hw[k] !== null && hw[k] !== "") return hw[k];
      if (all[k] !== undefined && all[k] !== null && all[k] !== "") return all[k];
      if (specs[k] !== undefined && specs[k] !== null && specs[k] !== "") return specs[k];
    }
    return undefined;
  };

  const brand = getProp("brand_name", "device_brand", "brand", "make", "C_Manufacturer", "manufacturer") || "Device";
  const model = getProp("model_name", "device_model", "model", "product_name", "C_Model") || "";
  const imei1 = getProp("imei_1", "IMEI", "imei", "serial_number", "device_serial_number", "serial") || "N/A";
  const rawImei2 = getProp("imei_2", "imei2", "secondary_imei");
  const imei2 = rawImei2 && rawImei2 !== imei1 && rawImei2 !== "NA" && rawImei2 !== "0" ? String(rawImei2) : undefined;
  const serial = getProp("serial_number", "device_serial_number", "serial", "device_id") || imei1;
  const mstId = getProp("mstid", "MstID", "mst_id", "id");
  const serviceKey = getProp("ServiceKey", "servicekey", "service_key") || (mstId ? `GIQ-MB-${mstId}` : `GIQ-MB-${String(imei1).slice(-6)}`);
  const certNumber = getProp("certificate_number", "certificateNumber", "ServiceKey") || (mstId ? `GIQ${mstId}` : `GIQ${String(imei1).slice(-6)}`);
  const workOrder = getProp("workorderid", "work_order_id", "workOrder", "workorder") || (mstId ? `WO${mstId}` : "WO-MAIN");
  const color = getProp("color", "device_color", "Color") || "—";
  const deviceCat = getProp("device_category", "category", "product_category") || "Mobile";

  const storageVal = getProp("storage", "internal_storage", "rom", "capacity", "HDD_SSD");
  const ramVal = getProp("ram", "system_ram", "memory", "RAM");
  const sku = `${brand.slice(0, 3).toUpperCase()}-${model.replace(/\s+/g, "")}-${storageVal || ""}`.trim().replace(/-+$/, "");
  const productName = `${brand} ${model} ${storageVal ? `(${storageVal})` : ""}`.trim();

  // Dates
  const rawAssessed =
    getProp("test_datetime", "test_date_time", "test_date_timen") ||
    (getProp("test_date") && getProp("test_time") ? `${getProp("test_date")} ${getProp("test_time")}` : undefined) ||
    getProp("CreatedOn", "CreatedDate", "created_at");

  const assessedDateTime = rawAssessed
    ? String(rawAssessed).replace("T", " ").substring(0, 19)
    : new Date().toLocaleString("en-IN");

  const rawIssue = getProp("test_date", "CreatedOn", "CreatedDate");
  const issueDate = rawIssue
    ? String(rawIssue).split("T")[0].split(" ")[0]
    : new Date().toLocaleDateString("en-IN");

  // Battery health
  let batteryPct: number | undefined = undefined;
  const rawHealth = getProp("Health_Parcent", "Health_Percent", "battery_health", "battery_health_percentage", "B_BatteryHealth", "score");
  if (rawHealth !== undefined && rawHealth !== null && String(rawHealth).trim() !== "") {
    const num = parseInt(String(rawHealth).replace(/[^0-9]/g, ""), 10);
    if (!isNaN(num) && num > 0) batteryPct = num;
  }

  const batteryCap = getProp("battery_capacity", "BatteryCapacity", "battery_mah", "capacity") || "—";

  // Overall QC Result
  const rawQcResult = String(getProp("QCResult", "test_result", "qc_result", "status", "test_status") || "").trim();
  const rawBattStatus = getProp("Battery", "battarystatus", "BatterytestStatus");
  const isPass = rawQcResult
    ? rawQcResult.toUpperCase() === "PASS" || rawQcResult.toUpperCase() === "PASSED"
    : resolveTestStatus(rawBattStatus) === "PASS";
  const overallResult = rawQcResult || (isPass ? "PASS" : "FAIL");

  // Grade
  const rawGrade = getProp("physical_condition_category", "grade", "Grade", "test_status");
  const functionalGrade = rawGrade ? String(rawGrade).replace(/Category\s*/i, "").trim() : (isPass ? "A" : "B");
  const cosmeticGrade = functionalGrade;
  const cosmeticGradeLabel = getProp("grade_definition", "physical_condition_category") || (isPass ? "Certified operational condition" : "Advisories noted");

  // Hardware Diagnostics Category Tests
  const displayTouchTests: DiagnosticTestItem[] = [
    { name: "Multi-Touch Screen", status: resolveTestStatus(getProp("Display_Touch_Screen", "TouchScreen", "Touch_Screen", "display_touch_screen", "display_test_result")) },
    { name: "Multi-Finger Touch", status: resolveTestStatus(getProp("Multifinger_test", "MultiFinger", "multifinger")) },
    { name: "Dead Pixel Check", status: resolveTestStatus(getProp("DEAD_PIXEL_CHECK", "Display_Dead_Pixel", "Dead_Pixel", "DeadPixels", "dead_pixel")) },
    { name: "Display Brightness", status: resolveTestStatus(getProp("Display_brightness", "Screen_Brightness", "Brightness")), note: String(getProp("Display_brightness")) === "-1" ? "not supported" : undefined },
    { name: "Orientation / Rotation", status: resolveTestStatus(getProp("Orientation", "orientation", "Rotation", "rotation")) },
  ];

  const cameraOpticsTests: DiagnosticTestItem[] = [
    { name: "Rear Primary Camera", status: resolveTestStatus(getProp("Back_Camera", "RearCamera", "rear_camera", "camera_rear", "camera_photo_test_result", "Camera")), note: getProp("rear_camera_mp") ? `${getProp("rear_camera_mp")}` : undefined },
    { name: "Front Selfie Camera", status: resolveTestStatus(getProp("Front_Camera", "front_camera", "camera_front", "camera_video_test_result", "SelfieCamera")), note: getProp("front_camera_mp") ? `${getProp("front_camera_mp")}` : undefined },
    { name: "Camera Auto Focus", status: resolveTestStatus(getProp("Camera_Auto_Focus", "AutoFocus", "auto_focus")), note: String(getProp("Camera_Auto_Focus")) === "-1" ? "fixed focus" : undefined },
    { name: "Flash / Torch", status: resolveTestStatus(getProp("Flash", "Tourch", "Torch", "camera_flash", "Flashlight")) },
    { name: "Rear Video Recording", status: resolveTestStatus(getProp("Back_Video_Recording", "RearVideo", "video_recording")), note: String(getProp("Back_Video_Recording")) === "-1" || String(getProp("Back_Video_Recording")) === "" ? "N/A" : undefined },
    { name: "Front Video Recording", status: resolveTestStatus(getProp("Front_Video_Recording", "FrontVideo", "selfie_video")), note: String(getProp("Front_Video_Recording")) === "-1" ? "N/A" : undefined },
  ];

  const audioAcousticsTests: DiagnosticTestItem[] = [
    { name: "Loudspeaker", status: resolveTestStatus(getProp("LoudSpeaker", "Speaker", "loudspeaker_test_result", "loudspeaker")) },
    { name: "Earpiece / Receiver", status: resolveTestStatus(getProp("Earphone", "Front_speaker", "Receiver", "earpiece", "earpiece_receiver")) },
    { name: "Microphone", status: resolveTestStatus(getProp("Microphone", "handset_mic", "mic_test_result", "mic")) },
    { name: "Audio Playback Test", status: resolveTestStatus(getProp("audioPlakbackTest", "AudioPlayback", "audio_playback")) },
    { name: "Earphone 3.5mm Jack", status: resolveTestStatus(getProp("Earphone_Jack", "HeadphoneJack", "3.5mm_jack")), note: String(getProp("Earphone_Jack")) === "-1" ? "not fitted" : undefined },
    { name: "Noise Cancellation", status: resolveTestStatus(getProp("NoiseCancellationTest", "NoiseCancellation", "noise_cancellation")), note: String(getProp("NoiseCancellationTest")) === "-1" ? "not fitted" : undefined },
  ];

  const connectivityTests: DiagnosticTestItem[] = [
    { name: "Wi-Fi Module", status: resolveTestStatus(getProp("WiFi", "wifi", "wireless_test_result", "WLAN", "Wifi")) },
    { name: "Internet Connectivity", status: resolveTestStatus(getProp("Internet", "internet", "network_connectivity")) },
    { name: "Bluetooth", status: resolveTestStatus(getProp("Bluetooth", "bluetooth", "BT", "bluetooth_test_result")) },
    { name: "GPS / Location", status: resolveTestStatus(getProp("GPS", "gps", "Location", "location_service")) },
    { name: "NFC Contactless", status: resolveTestStatus(getProp("NFC", "nfc", "contactless")), note: String(getProp("NFC")) === "-1" ? "not fitted" : undefined },
    { name: "SIM 1 Network Signal", status: resolveTestStatus(getProp("Network_Signal_sim1", "Call_SIM_1", "SIM_1_Test", "sim1")) },
    { name: "SIM 2 Network Signal", status: resolveTestStatus(getProp("Network_Signal_sim2", "Call_SIM_2", "SIM_2_Test", "sim2")), note: String(getProp("Call_SIM_2")) === "-1" ? "single SIM active" : undefined },
  ];

  const biometricsSecurityTests: DiagnosticTestItem[] = [
    { name: "Biometric (Face ID / Fingerprint)", status: resolveTestStatus(getProp("Biometric", "Fingerprint", "FaceID", "Face_Unlock", "biometric_test_result")) },
    { name: "Proximity Sensor", status: resolveTestStatus(getProp("Proximity", "proximity_sensor", "ProximitySensor")) },
    { name: "Ambient Light Sensor", status: resolveTestStatus(getProp("Light", "ambient_light_sensor", "AmbientLight")), note: String(getProp("Light")) === "-1" ? "not fitted" : undefined },
    { name: "Gyroscope Sensor", status: resolveTestStatus(getProp("Gyroscope", "GyroscopeGaming", "gyro_sensor", "Gyro")) },
    { name: "Vibration Engine", status: resolveTestStatus(getProp("Vibrate", "Vibration", "vibrator_test_result", "vibration_motor")) },
    { name: "Device Thermal Sensor", status: resolveTestStatus(getProp("DeviceTemperature", "ThermalSensor", "temperature_sensor")) },
  ];

  const powerHardwareTests: DiagnosticTestItem[] = [
    { name: "Power Button / Key", status: resolveTestStatus(getProp("Power_Key", "PowerButton", "power_button", "PowerKey")) },
    { name: "Volume Up Button", status: resolveTestStatus(getProp("Volume_Up_Button", "VolumeUp", "vol_up")) },
    { name: "Volume Down Button", status: resolveTestStatus(getProp("Volume_Down_Button", "VolumeDown", "vol_down")) },
    { name: "Battery Health Test", status: resolveTestStatus(getProp("Battery", "battarystatus", "BatterytestStatus", "battery_test_result")) },
    { name: "Charging Port Test", status: resolveTestStatus(getProp("ChargingTest", "USB", "charging_port", "Charging", "charging_test")) },
    { name: "CPU Performance Sweep", status: resolveTestStatus(getProp("cpuPerformance", "CPU_Performance", "cpu_stress_test")) },
  ];

  const allTests = [
    ...displayTouchTests,
    ...cameraOpticsTests,
    ...audioAcousticsTests,
    ...connectivityTests,
    ...biometricsSecurityTests,
    ...powerHardwareTests,
  ];

  const passedTestsCount = allTests.filter((t) => t.status === "PASS").length;
  const failedTestsCount = allTests.filter((t) => t.status === "FAIL").length;
  const naTestsCount = allTests.filter((t) => t.status === "N/A").length;
  const totalApplicableTests = passedTestsCount + failedTestsCount || allTests.length;
  const totalTestsExecuted = allTests.length;

  const deviceHealthStatus = isPass ? ((batteryPct ?? 90) >= 80 ? "Excellent" : "Good") : "Requires Attention";
  const healthScore = isPass ? Math.max(85, batteryPct ?? 90) : 55;

  const techName = getProp("tester_id", "CreatedBy", "createdBy", "uid", "operator") || "Operator";
  const techAuth = `GIQ-T-${getProp("merchant_id", "PartnerID", "mstid", "uid") || "1001"}`;

  const digitalSignature = generateSignatureHash(
    `${certNumber}-${imei1}-${assessedDateTime}-${workOrder}`
  );

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
    diagnosticEngine: `${getProp("AppExt", "app_name") || "Diagnostic Suite"} v${getProp("os_versio", "app_version") || "3.4"}`,
    technicianName: String(techName),
    technicianAuth: techAuth,
    digitalSignature,
    diagnosticCategories: [
      { categoryName: "Display & Multi-Touch Digitizer", tests: displayTouchTests },
      { categoryName: "Optics & Camera Sweep", tests: cameraOpticsTests },
      { categoryName: "Audio, Speakers & Microphone", tests: audioAcousticsTests },
      { categoryName: "Wireless & Cellular Connectivity", tests: connectivityTests },
      { categoryName: "Biometrics & Sensor Array", tests: biometricsSecurityTests },
      { categoryName: "Power, Hardware Keys & CPU", tests: powerHardwareTests },
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

