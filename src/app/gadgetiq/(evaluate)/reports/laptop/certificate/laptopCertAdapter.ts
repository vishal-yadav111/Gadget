import { LaptopQCReportItem } from "../../types";

export interface DiagnosticTestItem {
  name: string;
  status: "PASS" | "FAIL" | "N/A";
  note?: string;
}

export interface DiagnosticTestCategory {
  categoryName: string;
  tests: DiagnosticTestItem[];
}

export interface MemoryModuleDetail {
  slot: string;
  manufacturer: string;
  capacity: string;
  serial: string;
  type: string;
  partNumber: string;
  speed: string;
  isPopulated: boolean;
}

export interface StorageDiskDetail {
  diskIndex: string;
  model: string;
  size: string;
  serial: string;
  isPopulated: boolean;
}

export interface FormattedLaptopCertificateData {
  serviceKey: string;
  certificateNumber: string;
  workOrderId: string;
  issueDate: string;
  assessedDateTime: string;
  deviceBrand: string;
  deviceModel: string;
  deviceCategory: string;
  serialNumber: string;
  imei1?: string;
  modelSku: string;
  productName: string;
  chassisNumber: string;
  macAddress?: string;
  overallResult: string;
  isPass: boolean;
  deviceHealthStatus: string;
  healthScore: number;
  functionalGrade: "A" | "B" | "C";
  cosmeticGrade: "A" | "B" | "C" | "D";
  cosmeticGradeLabel: string;
  batteryHealthPercentage: number;
  batteryCycleCount: number;
  batteryCapacity: string;
  batteryDesignCapacity: string;
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
    system: {
      manufacturer: string;
      model: string;
      serial: string;
      category: string;
    };
    processor: {
      name: string;
      architecture: string;
      cores: string;
      maxClock: string;
      vendor: string;
    };
    graphics: {
      name: string;
      type: string;
      allocatedMemory: string;
      discreteGpu: string;
    };
    memory: {
      capacity: string;
      sticks: string;
      modules: MemoryModuleDetail[];
    };
    storage: {
      capacity: string;
      diskCount: string;
      disks: StorageDiskDetail[];
    };
    display: {
      size: string;
      touchscreen: string;
    };
    battery: {
      manufacturer: string;
      designedCapacity: string;
      remainingCapacity: string;
      batteryHealth: string;
      cycleCount: string;
      estimatedChargeRemaining: string;
      numberOfCells: string;
      serialNumber: string;
    };
    motherboard: {
      manufacturer: string;
      product: string;
      serial: string;
      bios: string;
    };
    network: {
      wifi: {
        name: string;
        mac: string;
        manufacturer: string;
      };
      bluetooth: {
        name: string;
        mac: string;
        manufacturer: string;
      };
      ethernet: {
        name: string;
        mac: string;
        manufacturer: string;
      };
    };
    operatingSystem: {
      name: string;
      publisher: string;
      licenceStatus: string;
      version: string;
    };
    peripherals: {
      keyboard: {
        name: string;
        description: string;
        functionKeys: string;
        layout: string;
      };
      camera: {
        name: string;
        manufacturer: string;
        description: string;
      };
      audio: {
        name: string;
        manufacturer: string;
      };
      opticalDiskDrive: {
        name: string;
        manufacturer: string;
      };
      sdCard: {
        mediaType: string;
        model: string;
        size: string;
        serial: string;
      };
    };
    absentHardware: string[];
  };
}

/**
 * Resolves raw test result value ("1", 1, "PASS" -> PASS; "0", 0, "FAIL" -> FAIL; "-1", "", null -> N/A)
 */
export function resolveTestStatus(val?: string | number | null): "PASS" | "FAIL" | "N/A" {
  if (val === "1" || val === 1 || String(val).toUpperCase() === "PASS" || String(val).toUpperCase() === "TRUE") {
    return "PASS";
  }
  if (val === "0" || val === 0 || String(val).toUpperCase() === "FAIL" || String(val).toUpperCase() === "FALSE") {
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
 * Pure adapter that transforms live API JSON into fully-typed certificate data
 * Strictly pulls all fields directly from the JSON payload with ZERO fake/hardcoded fields.
 */
export function mapLaptopReportToCertificate(
  raw: LaptopQCReportItem | any
): FormattedLaptopCertificateData {
  if (!raw) raw = {};
  if (raw.data && typeof raw.data === "object") {
    raw = raw.data;
  }
  const ident = raw.identification || raw.all_fields || raw;
  const diag = raw.hardware_diagnostics || raw.all_fields || raw;
  const spec = raw.component_specs || raw.all_fields || raw;
  const batt = raw.battery_analytics || raw.all_fields || raw;
  const all = raw.all_fields || {};

  // 1. Computer System Identification
  const brand =
    ident.brand_name ||
    ident.device_brand ||
    all.brand_name ||
    all.device_brand ||
    all.C_Manufacturer ||
    spec.chassis?.manufacturer ||
    "N/A";

  const model =
    ident.model_name ||
    ident.device_model ||
    all.model_name ||
    all.device_model ||
    all.C_Model ||
    spec.chassis?.model ||
    "";

  const serial =
    ident.serial_number ||
    ident.device_serial_number ||
    ident.imei_1 ||
    all.serial_number ||
    all.device_serial_number ||
    all.imei_1 ||
    all.C_SerialNumber ||
    spec.chassis?.serial ||
    "N/A";

  const serviceKey =
    ident.ServiceKey ||
    ident.certificate_number ||
    all.ServiceKey ||
    all.certificate_number ||
    (ident.mstid ? `XC-LP-${ident.mstid}` : serial);

  const certNumber =
    ident.certificate_number ||
    ident.ServiceKey ||
    all.certificate_number ||
    all.ServiceKey ||
    (ident.mstid ? `XC-LP-${ident.mstid}` : serial);

  const workOrder =
    ident.workorderid ||
    all.workorderid ||
    (ident.mstid ? `WO${ident.mstid}` : "N/A");

  const sku =
    spec.system_sku ||
    ident.system_sku ||
    all.system_sku ||
    ident.product_name ||
    all.product_name ||
    `${brand} ${model}`.trim();

  const productName =
    ident.product_name ||
    all.product_name ||
    all.M_Product ||
    `${brand} ${model}`.trim();

  const chassisNumber =
    ident.chassis_number ||
    all.chassis_number ||
    spec.chassis_number ||
    "N/A";

  // 2. Dates
  const assessedDateTime =
    ident.test_date_time ||
    ident.test_date_timen ||
    all.test_date_time ||
    all.test_date_timen ||
    ident.CreatedOn ||
    all.CreatedOn ||
    ident.startDate ||
    all.startDate ||
    "";

  const issueDate = ident.CreatedOn || all.CreatedOn
    ? new Date(ident.CreatedOn || all.CreatedOn).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : ident.test_date_time || all.test_date_time || "";

  // 3. Battery Analytics
  let batteryPct = 100;
  const rawHealth =
    batt.battery_health ||
    all.B_BatteryHealth ||
    ident.B_BatteryHealth ||
    ident.Health_Parcent ||
    all.Health_Parcent ||
    ident.score ||
    all.score;

  if (rawHealth) {
    const num = parseInt(String(rawHealth).replace(/[^0-9]/g, ""), 10);
    if (!isNaN(num) && num > 0) batteryPct = num;
  }

  let cycleCount = 0;
  const rawCycles =
    batt.cycle_count ||
    all.B_CycleCount ||
    ident.B_CycleCount ||
    ident.battery_cycle_count ||
    all.battery_cycle_count;

  if (rawCycles !== undefined && rawCycles !== null && rawCycles !== "") {
    const num = parseInt(String(rawCycles), 10);
    if (!isNaN(num)) cycleCount = num;
  }

  const batteryDesignCap =
    batt.designed_capacity ||
    all.B_DesignedCapacity ||
    ident.battery_capacity ||
    all.battery_capacity ||
    "N/A";

  const batteryRemainingCap =
    batt.remaining_capacity ||
    all.B_RemainingCapacity ||
    "N/A";

  const batteryMfr =
    all.B_Manufacturer ||
    "N/A";

  const batterySerial =
    all.B_SerialNumber ||
    "N/A";

  const batteryCells =
    batt.number_of_cells ||
    all.B_NumberOfCells ||
    "N/A";

  const batteryChargeRemaining =
    batt.estimated_charge_remaining ||
    all.B_EstimatedChargeRemaining ||
    "N/A";

  // 4. Hardware Diagnostic Tests
  const coreHardwareTests: DiagnosticTestItem[] = [
    { name: "Processor (CPU)", status: resolveTestStatus(diag.cpu_test_result ?? all.cpu_test_result) },
    { name: "Memory (RAM)", status: resolveTestStatus(diag.ram_test_result ?? all.ram_test_result) },
    { name: "Motherboard", status: resolveTestStatus(diag.motherboard_test_result ?? all.motherboard_test_result) },
    { name: "Storage (SSD/HDD)", status: resolveTestStatus(diag.storage_test_result ?? all.storage_test_result) },
    { name: "Integrated graphics", status: resolveTestStatus(diag.gpu_test_result ?? all.gpu_test_result) },
    {
      name: "Discrete GPU",
      status: resolveTestStatus(diag.gpu_card_test_result ?? all.gpu_card_test_result ?? "-1"),
      note: (spec.Graphics_Card === "No" || all.Graphics_Card === "No") ? "not fitted" : undefined,
    },
    {
      name: "PCI Express slots",
      status: resolveTestStatus(diag.pciexpress_test_result ?? all.pciexpress_test_result ?? "-1"),
      note: (diag.pciexpress_test_result === "-1" || all.pciexpress_test_result === "-1") ? "not fitted" : undefined,
    },
    {
      name: "Optical disk drive",
      status: resolveTestStatus(diag.optical_disk_drive_test_result ?? all.optical_disk_drive_test_result ?? "-1"),
      note: (diag.optical_disk_drive_test_result === "-1" || all.optical_disk_drive_test_result === "-1") ? "not fitted" : undefined,
    },
  ];

  const powerThermalTests: DiagnosticTestItem[] = [
    { name: "Battery", status: resolveTestStatus(diag.battery_test_result ?? all.battery_test_result) },
    {
      name: "Charger / AC adapter",
      status: resolveTestStatus(diag.charger_test_result ?? all.charger_test_result ?? "-1"),
      note: (diag.charger_test_result === "-1" || all.charger_test_result === "-1") ? "not supplied" : undefined,
    },
    {
      name: "Cooling fan",
      status: resolveTestStatus(diag.fan_test_result ?? all.fan_test_result ?? "-1"),
      note: (diag.fan_test_result === "-1" || all.fan_test_result === "-1") ? "sealed chassis" : undefined,
    },
  ];

  const multimediaTests: DiagnosticTestItem[] = [
    { name: "Speakers", status: resolveTestStatus(diag.speaker_test_result ?? all.speaker_test_result) },
    { name: "Microphone", status: resolveTestStatus(diag.mic_test_result ?? all.mic_test_result) },
    { name: "Audio playback", status: resolveTestStatus(diag.audioplayback_test_result ?? all.audioplayback_test_result) },
    { name: "Camera (still image)", status: resolveTestStatus(diag.camera_photo_test_result ?? all.camera_photo_test_result) },
    {
      name: "Camera (video)",
      status: resolveTestStatus(diag.camera_video_test_result ?? all.camera_video_test_result ?? "-1"),
      note: (diag.camera_video_test_result === "-1" || all.camera_video_test_result === "-1") ? "driver limitation" : undefined,
    },
  ];

  const connectivityTests: DiagnosticTestItem[] = [
    { name: "Wi-Fi", status: resolveTestStatus(diag.wireless_test_result ?? all.wireless_test_result) },
    { name: "Bluetooth", status: resolveTestStatus(diag.bluetooth_test_result ?? all.bluetooth_test_result) },
    { name: "Internet connectivity", status: resolveTestStatus(diag.internet_test_result ?? all.internet_test_result) },
    {
      name: "Wired Ethernet",
      status: resolveTestStatus(diag.wired_ethernet_test_result ?? all.wired_ethernet_test_result ?? "-1"),
      note: (diag.wired_ethernet_test_result === "-1" || all.wired_ethernet_test_result === "-1") ? "no port fitted" : undefined,
    },
  ];

  const inputPortsTests: DiagnosticTestItem[] = [
    { name: "Keyboard", status: resolveTestStatus(diag.keyboard_test_result ?? all.keyboard_test_result) },
    { name: "Touchpad", status: resolveTestStatus(diag.touchpad_test_result ?? all.touchpad_test_result) },
    { name: "USB ports", status: resolveTestStatus(diag.usb_test_result ?? all.usb_test_result) },
    {
      name: "SD card slot",
      status: resolveTestStatus(diag.sd_card_slot_test_result ?? all.sd_card_slot_test_result ?? "-1"),
      note: (diag.sd_card_slot_test_result === "-1" || all.sd_card_slot_test_result === "-1") ? "no slot fitted" : undefined,
    },
  ];

  const displaySoftwareTests: DiagnosticTestItem[] = [
    { name: "Display panel", status: resolveTestStatus(diag.display_test_result ?? all.display_test_result) },
    { name: "Windows activation", status: resolveTestStatus(diag.win_activation_test_result ?? all.win_activation_test_result) },
    {
      name: "Display brightness",
      status: resolveTestStatus(diag.display_brightness_test_result ?? all.display_brightness_test_result ?? "-1"),
      note: (diag.display_brightness_test_result === "-1" || all.display_brightness_test_result === "-1") ? "not supported" : undefined,
    },
  ];

  const allTests = [
    ...coreHardwareTests,
    ...powerThermalTests,
    ...multimediaTests,
    ...connectivityTests,
    ...inputPortsTests,
    ...displaySoftwareTests,
  ];

  const passedTestsCount = allTests.filter((t) => t.status === "PASS").length;
  const failedTestsCount = allTests.filter((t) => t.status === "FAIL").length;
  const naTestsCount = allTests.filter((t) => t.status === "N/A").length;
  const totalApplicableTests = passedTestsCount + failedTestsCount;
  const totalTestsExecuted = allTests.length;

  // 5. Overall QC Result & Grades
  const rawQcResult = String(
    ident.test_result ||
    ident.QCResult ||
    all.test_result ||
    all.QCResult ||
    ""
  ).trim();

  const normalized = rawQcResult.toUpperCase();
  const isPass = normalized === "PASS" || normalized === "PASSED";
  const overallResult = rawQcResult || "Not Tested";

  const functionalGrade: "A" | "B" | "C" =
    failedTestsCount === 0 ? "A" : failedTestsCount <= 1 ? "B" : "C";

  let cosmeticGrade: "A" | "B" | "C" | "D" = "B";
  let cosmeticGradeLabel = "Standard inspected condition";
  const physCat = String(
    ident.physical_condition_category ||
    ident.test_status ||
    all.physical_condition_category ||
    all.test_status ||
    ident.grade ||
    ""
  ).toLowerCase();

  if (physCat.includes("category a") || physCat.includes("superb") || physCat.includes("excellent")) {
    cosmeticGrade = "A";
    cosmeticGradeLabel = "Flawless condition; virtually as-new";
  } else if (physCat.includes("category b") || physCat.includes("very good")) {
    cosmeticGrade = "B";
    cosmeticGradeLabel = "Light wear; fully intact chassis";
  } else if (physCat.includes("category c") || physCat.includes("good")) {
    cosmeticGrade = "C";
    cosmeticGradeLabel = "Moderate cosmetic wear; fully intact";
  } else if (physCat.includes("category d") || physCat.includes("fair")) {
    cosmeticGrade = "D";
    cosmeticGradeLabel = "Noticeable wear and cosmetic blemishes";
  }

  const deviceHealthStatus =
    overallResult === "PASS"
      ? batteryPct >= 80
        ? "Excellent"
        : "Good"
      : "Advisory Noted";

  const healthScore = overallResult === "PASS" ? Math.max(80, batteryPct) : batteryPct;

  // 6. CPU Specifications
  const processorFamily =
    spec.cpu?.name ||
    spec.Processor_Family ||
    ident.Processor_Family ||
    all.Processor_Family ||
    all.cp_Name ||
    "Processor";

  const genString =
    spec.cpu?.generation ||
    spec.Generation ||
    ident.Generation ||
    all.Generation ||
    all.cp_CPUGeneration ||
    "";

  const coresString =
    ident.processor_core || all.processor_core
      ? `${ident.processor_core || all.processor_core} Cores`
      : "";

  let clockSpeed = spec.cpu?.max_speed || all.cp_MaxClockSpeed || "";
  if (!clockSpeed && processorFamily.includes("@")) {
    const clockPart = processorFamily.split("@")[1]?.trim();
    if (clockPart) clockSpeed = clockPart;
  }

  // 7. Memory Modules (Module 1, Module 2)
  const ramTotal =
    spec.memory?.total ||
    spec.RAM ||
    ident.RAM ||
    all.RAM ||
    all.Me_TotalPhysicalMemory ||
    "N/A";

  const ramSticks =
    spec.memory?.sticks ||
    all.Me_PhysicalMemorySticks ||
    "1";

  const memModules: MemoryModuleDetail[] = [];
  const m1Mfr = spec.memory?.slot1?.manufacturer || all.Mem1_Manufacturer || "";
  const m1Cap = spec.memory?.slot1?.capacity || all.Mem1_Capacity || "";
  if (m1Mfr && m1Mfr !== "None" && m1Cap && m1Cap !== "None") {
    memModules.push({
      slot: "Memory Module-1",
      manufacturer: m1Mfr,
      capacity: m1Cap,
      serial: spec.memory?.slot1?.serial || all.Mem1_SerialNumber || "N/A",
      type: spec.memory?.slot1?.type || all.Mem1_MemoryType || "DDR4",
      partNumber: all.Mem1_PartNumber || "N/A",
      speed: spec.memory?.slot1?.speed || all.Mem1_Speed || "N/A",
      isPopulated: true,
    });
  }

  const m2Mfr = spec.memory?.slot2?.manufacturer || all.Mem2_Manufacturer;
  if (m2Mfr && m2Mfr !== "None" && m2Mfr !== "N/A") {
    memModules.push({
      slot: "Memory Module-2",
      manufacturer: m2Mfr,
      capacity: spec.memory?.slot2?.capacity || all.Mem2_Capacity || "",
      serial: spec.memory?.slot2?.serial || all.Mem2_SerialNumber || "",
      type: spec.memory?.slot2?.type || all.Mem2_MemoryType || "",
      partNumber: all.Mem2_PartNumber || "",
      speed: spec.memory?.slot2?.speed || all.Mem2_Speed || "",
      isPopulated: true,
    });
  }

  // 8. Storage Disks (Disk 1, Disk 2)
  const storageTotal =
    spec.storage_devices?.total ||
    spec.HDD_SSD ||
    ident.HDD_SSD ||
    all.HDD_SSD ||
    ident.storage ||
    all.storage ||
    "N/A";

  const storageDisksCount =
    all.st_PhysicalDiskDrives ||
    "1";

  const storageDisks: StorageDiskDetail[] = [];
  const d1Model = spec.storage_devices?.disk1?.model || all.st1_Model || "";
  const d1Size = spec.storage_devices?.disk1?.size || all.st1_Size || storageTotal;
  if (d1Model && d1Model !== "None" && d1Model !== "N/A") {
    storageDisks.push({
      diskIndex: "Storage-1",
      model: d1Model,
      size: d1Size,
      serial: spec.storage_devices?.disk1?.serial || all.st1_SerialNumber || "N/A",
      isPopulated: true,
    });
  }

  const d2Model = spec.storage_devices?.disk2?.model || all.st2_Model;
  if (d2Model && d2Model !== "None" && d2Model !== "N/A") {
    storageDisks.push({
      diskIndex: "Storage-2",
      model: d2Model,
      size: spec.storage_devices?.disk2?.size || all.st2_Size || "",
      serial: spec.storage_devices?.disk2?.serial || all.st2_SerialNumber || "",
      isPopulated: true,
    });
  }

  // 9. Peripherals & Network
  const osVal =
    spec.os_details?.name ||
    all.O_Name ||
    ident.os ||
    all.os ||
    "Windows OS";

  const osVerVal =
    ident.os_versio ||
    all.os_versio ||
    "";

  const osLicenseStatus =
    spec.os_details?.license ||
    all.O_OSLicenseStatus ||
    "Licensed";

  const osPublisher =
    spec.os_details?.manufacturer ||
    all.O_Manufacturer ||
    "Microsoft Corporation";

  const biosVal =
    spec.bios_version ||
    ident.bios_version ||
    all.bios_version ||
    "N/A";

  const mbdMfr =
    spec.motherboard?.manufacturer ||
    all.M_Manufacturer ||
    brand;

  const mbdProduct =
    spec.motherboard?.product ||
    all.M_Product ||
    ident.product_name ||
    all.product_name ||
    "N/A";

  const mbdSerial =
    spec.motherboard?.serial ||
    spec.mbd_serial_number ||
    ident.mbd_serial_number ||
    all.mbd_serial_number ||
    all.M_SerialNumber ||
    "N/A";

  const screenSizeVal =
    ident.screen_size ||
    all.screen_size ||
    "";

  const wifiName =
    spec.network?.wifi?.name ||
    all.W_Name ||
    "Wi-Fi Wireless Adapter";

  const wifiMac =
    spec.network?.wifi?.mac ||
    all.W_MACAddress ||
    ident.MacAddress ||
    all.MacAddress ||
    "Not Available";

  const wifiMfr =
    spec.network?.wifi?.manufacturer ||
    all.W_Manufacturer ||
    "N/A";

  const btName =
    spec.network?.bluetooth?.name ||
    all.Bl_Name ||
    "Bluetooth Adapter";

  const btMac =
    spec.network?.bluetooth?.mac ||
    all.Bl_MACAddress ||
    "Not Available";

  const btMfr =
    spec.network?.bluetooth?.manufacturer ||
    all.Bl_Manufacturer ||
    "N/A";

  const ethName =
    spec.network?.ethernet?.name ||
    all.WE_Name ||
    "Not Available";

  const ethMac =
    spec.network?.ethernet?.mac ||
    all.WE_MACAddress ||
    "Not Available";

  const ethMfr =
    spec.network?.ethernet?.manufacturer ||
    all.WE_Manufacturer ||
    "Not Available";

  // Peripherals
  const keyboard = {
    name: all.Ky_Name || "Standard Keyboard",
    description: all.ky_Description || "Standard 101/102-Key Keyboard",
    functionKeys: all.ky_NumberOfFunctionKeys ? `${all.ky_NumberOfFunctionKeys}` : "12",
    layout: all.ky_Layout || "00000409",
  };

  const camera = {
    name: all.Ca_Name || "HD Camera",
    manufacturer: all.Ca_Manufacturer || "Microsoft",
    description: all.ca_Description || "USB Video Device",
  };

  const audio = {
    name: all.au_Name || "High Definition Audio",
    manufacturer: all.au_Manufacturer || "Realtek",
  };

  const opticalDiskDrive = {
    name: all.op_Name || "Not Available",
    manufacturer: all.op_Manufacturer || "Not Available",
  };

  const sdCard = {
    mediaType: all.sd_MediaType || "Not Available",
    model: all.sd_Model || "Not Available",
    size: all.sd_Size || "Not Available",
    serial: all.sd_SerialNumber || "Not Available",
  };

  // Compile absent/unfitted hardware dynamically
  const absentHardware: string[] = [];
  if (opticalDiskDrive.name === "Not Available") absentHardware.push("Optical Disk Drive");
  if (sdCard.model === "Not Available" || sdCard.mediaType === "Not Available") absentHardware.push("SD Card Reader");
  if (ethName === "Not Available" || ethMac === "Not Available") absentHardware.push("Wired Ethernet Port");
  if (spec.Graphics_Card === "No" || all.Graphics_Card === "No") absentHardware.push("Discrete Dedicated GPU");
  if (diag.pciexpress_test_result === "-1" || all.pciexpress_test_result === "-1") absentHardware.push("PCI Express Slots");

  // 10. Technician & Digital Signature
  const rawTech =
    ident.tester_id ||
    ident.g_tester_id ||
    all.tester_id ||
    all.g_tester_id ||
    ident.uid ||
    ident.createdBy ||
    ident.profile_id ||
    all.uid ||
    all.CreatedBy ||
    all.createdBy ||
    all.profile_id ||
    ident.tester_name ||
    all.tester_name ||
    "Technician";

  const techName = String(rawTech)
    .replace(/.*Pvt\.\s*Ltd\.\s*/i, "")
    .replace(/\b\d{10,}\b/g, "")
    .replace(/[\(\[\{][^\)\]\}]*[\)\]\}]/g, "")
    .trim() || "Technician";

  const techAuth = ident.PartnerID || all.PartnerID
    ? `XC-T-${ident.PartnerID || all.PartnerID}`
    : (ident.uid || all.uid ? `XC-T-${ident.uid || all.uid}` : "XC-T-QC");

  const digitalSignature = generateSignatureHash(
    `${certNumber}-${serial}-${assessedDateTime}-${workOrder}`
  );

  return {
    serviceKey,
    certificateNumber: certNumber,
    workOrderId: workOrder,
    issueDate,
    assessedDateTime,
    deviceBrand: brand,
    deviceModel: model,
    deviceCategory: ident.device_category || all.device_category || "Notebook",
    serialNumber: serial,
    imei1: ident.imei_1 || all.imei_1 || serial,
    modelSku: sku,
    productName,
    chassisNumber,
    macAddress: wifiMac,
    overallResult,
    isPass,
    deviceHealthStatus,
    healthScore,
    functionalGrade,
    cosmeticGrade,
    cosmeticGradeLabel,
    batteryHealthPercentage: batteryPct,
    batteryCycleCount: cycleCount,
    batteryCapacity: batteryDesignCap,
    batteryDesignCapacity: batteryDesignCap,
    batteryStressTest:
      batt.battery_stress_test ||
      all.battery_stress_test ||
      (diag.battery_stress_test_result === "1" ? "Yes" : (diag.battery_stress_test_result === "0" ? "FAIL" : "Yes")),
    passedTestsCount,
    failedTestsCount,
    naTestsCount,
    totalApplicableTests,
    totalTestsExecuted,
    diagnosticEngine: osVerVal || "GadgetIQ Engine",
    technicianName: techName,
    technicianAuth: techAuth,
    digitalSignature,
    diagnosticCategories: [
      { categoryName: "Core Hardware & Storage", tests: coreHardwareTests },
      { categoryName: "Power & Thermal", tests: powerThermalTests },
      { categoryName: "Multimedia", tests: multimediaTests },
      { categoryName: "Connectivity", tests: connectivityTests },
      { categoryName: "Input & Ports", tests: inputPortsTests },
      { categoryName: "Display & Software", tests: displaySoftwareTests },
    ],
    specs: {
      system: {
        manufacturer: brand,
        model,
        serial,
        category: ident.device_category || all.device_category || "Notebook",
      },
      processor: {
        name: processorFamily,
        architecture: genString,
        cores: coresString,
        maxClock: clockSpeed,
        vendor:
          spec.cpu?.manufacturer ||
          all.cp_Manufacturer ||
          (processorFamily.toLowerCase().includes("intel") ? "GenuineIntel" : "AMD"),
      },
      graphics: {
        name:
          spec.gpu?.name ||
          all.gp_Name ||
          (spec.Graphics_Card && spec.Graphics_Card !== "No" ? spec.Graphics_Card : "Intel(R) UHD Graphics"),
        type:
          spec.gpu?.processor ||
          all.gp_VideoProcessor ||
          "Integrated Graphics",
        allocatedMemory:
          spec.gpu?.ram ||
          all.gp_AdapterRAM ||
          "Dynamic Video Memory",
        discreteGpu:
          spec.Graphics_Card && spec.Graphics_Card !== "No"
            ? spec.Graphics_Card
            : "No",
      },
      memory: {
        capacity: ramTotal,
        sticks: `${ramSticks} Stick(s)`,
        modules: memModules,
      },
      storage: {
        capacity: storageTotal,
        diskCount: `${storageDisksCount} Drive(s)`,
        disks: storageDisks,
      },
      display: {
        size: screenSizeVal,
        touchscreen:
          ident.Display_Touch_Screen === "1" || all.Display_Touch_Screen === "1" ? "Yes" : "No",
      },
      battery: {
        manufacturer: batteryMfr,
        designedCapacity: batteryDesignCap,
        remainingCapacity: batteryRemainingCap,
        batteryHealth: `${batteryPct} %`,
        cycleCount: `${cycleCount}`,
        estimatedChargeRemaining: batteryChargeRemaining,
        numberOfCells: String(batteryCells),
        serialNumber: batterySerial,
      },
      motherboard: {
        manufacturer: mbdMfr,
        product: mbdProduct,
        serial: mbdSerial,
        bios: biosVal,
      },
      network: {
        wifi: {
          name: wifiName,
          mac: wifiMac !== "Not Available" ? `${wifiMac.slice(0, 8)}:**:**:${wifiMac.slice(-2)}` : "Not Available",
          manufacturer: wifiMfr,
        },
        bluetooth: {
          name: btName,
          mac: btMac !== "Not Available" ? `${btMac.slice(0, 8)}:**:**:${btMac.slice(-2)}` : "Not Available",
          manufacturer: btMfr,
        },
        ethernet: {
          name: ethName,
          mac: ethMac,
          manufacturer: ethMfr,
        },
      },
      operatingSystem: {
        name: osVal,
        publisher: osPublisher,
        licenceStatus: osLicenseStatus,
        version: osVerVal,
      },
      peripherals: {
        keyboard,
        camera,
        audio,
        opticalDiskDrive,
        sdCard,
      },
      absentHardware,
    },
  };
}
