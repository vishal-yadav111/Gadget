export interface RawLaptopQCItem {
  mstChildid?: number;
  mstid?: number;
  uid?: string;
  device_category?: string | null;
  certificate_number?: string | null;
  certificate_image?: string | null;
  brand_name?: string | null;
  model_name?: string | null;
  device_id?: string | null;
  device_brand?: string | null;
  os?: string | null;
  os_versio?: string | null;
  serial_number?: string | null;
  device_model?: string | null;
  device_serial_number?: string | null;
  product_name?: string | null;
  bios_version?: string | null;
  Processor_Family?: string | null;
  Generation?: string | null;
  RAM?: string | null;
  HDD_SSD?: string | null;
  Graphics_Card?: string | null;
  B_BatteryHealth?: string | null;
  B_CycleCount?: string | number | null;
  B_DesignedCapacity?: string | null;
  B_RemainingCapacity?: string | null;
  system_sku?: string | null;
  mbd_serial_number?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  test_date_time?: string | null;
  test_result?: string | null;
  test_status?: string | null;
  profile_id?: string | null;
  // Test Results
  cpu_test_result?: string | null;
  ram_test_result?: string | null;
  motherboard_test_result?: string | null;
  storage_test_result?: string | null;
  battery_test_result?: string | null;
  battery_stress_test_result?: string | null;
  battery_stress_test?: string | null;
  speaker_test_result?: string | null;
  mic_test_result?: string | null;
  audioplayback_test_result?: string | null;
  camera_photo_test_result?: string | null;
  camera_video_test_result?: string | null;
  display_test_result?: string | null;
  display_brightness_test_result?: string | null;
  touchpad_test_result?: string | null;
  keyboard_test_result?: string | null;
  usb_test_result?: string | null;
  wireless_test_result?: string | null;
  bluetooth_test_result?: string | null;
  internet_test_result?: string | null;
  wired_ethernet_test_result?: string | null;
  fan_test_result?: string | null;
  gpu_test_result?: string | null;
  gpu_card_test_result?: string | null;
  charger_test_result?: string | null;
  optical_disk_drive_test_result?: string | null;
  sd_card_slot_test_result?: string | null;
  win_activation_test_result?: string | null;
  pciexpress_test_result?: string | null;
  mouse_test_result?: string | null;
  earphone_jack_test_result?: string | null;
  earphone_mic_test_result?: string | null;
  earphone_test_result?: string | null;
  lid_close_test_result?: string | null;
  hibernet_test_result?: string | null;
  s4_state_test_result?: string | null;
  external_mic_test_result?: string | null;
  external_speaker_test_result?: string | null;
}

export interface RawMobileQCItem {
  id?: number;
  IMEI?: string | null;
  imei_1?: string | null;
  imei_2?: string | null;
  MacAddress?: string | null;
  device_category?: string | null;
  brand_name?: string | null;
  model_name?: string | null;
  device_id?: string | null;
  serial_number?: string | null;
  screen_size?: string | null;
  storage?: string | null;
  front_camera_mp?: string | null;
  rear_camera_mp?: string | null;
  processor_core?: string | null;
  battery_capacity?: string | null;
  Battery_Design_Capacity?: string | null;
  Health_Parcent?: string | null;
  Health?: string | null;
  BatterytestStatus?: string | null;
  Battery_Test_Result?: string | null;
  Battery_Test_Status?: string | null;
  TestDuration?: string | null;
  os?: string | null;
  os_versio?: string | null;
  CreatedOn?: string | null;
  workorderid?: string | null;
  uid?: string | null;
  createdBy?: string | null;
  score?: string | null;
  physical_condition_category?: string | null;
  QCResult?: string | null;
  ServiceKey?: string | null;
}

export type TestStatus = "PASS" | "FAIL" | "N/A";

export interface DiagnosticTestItem {
  name: string;
  status: TestStatus;
  note?: string;
}

export interface DiagnosticTestCategory {
  categoryName: string;
  tests: DiagnosticTestItem[];
}

export interface QCCertificateData {
  serviceKey: string;
  deviceType: "laptop" | "mobile";
  certificateNumber: string;
  certificateImage?: string;
  issueDate: string;
  assessedDateTime: string;
  
  // Device Identification
  deviceBrand: string;
  deviceModel: string;
  deviceCategory: string;
  serialNumber: string;
  imei1?: string;
  imei2?: string;
  modelSku?: string;
  productName?: string;
  workOrderId?: string;
  
  // Overall Health & Grading
  overallResult: "PASS" | "FAIL";
  deviceHealthStatus: "Excellent" | "Very Good" | "Good" | "Fair" | "Failed";
  healthScore: number;
  functionalGrade: string;
  cosmeticGrade: string;
  
  // Battery & Endurance
  batteryHealthPercentage: number;
  batteryCycleCount: number;
  batteryDesignCapacity: string;
  batteryRemainingCapacity: string;
  ssdEnduranceUsedPercentage: number;
  
  // Test Counts
  passedTestsCount: number;
  failedTestsCount: number;
  naTestsCount: number;
  totalApplicableTests: number;
  
  // 6 Diagnostic Categories
  diagnosticCategories: DiagnosticTestCategory[];
  
  // Detailed Hardware Specs (Page 3)
  specs: {
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
      type: string;
      speed: string;
      vendor: string;
      partNumber: string;
      upgradeable: string;
    };
    storage: {
      capacity: string;
      type: string;
      model: string;
      interface: string;
      smartStatus: string;
      wearLevel: string;
    };
    display: {
      size: string;
      panel: string;
      resolution: string;
      refreshRate: string;
      aspectRatio: string;
      touchscreen: string;
    };
    battery: {
      health: string;
      capacity: string;
      cycleCount: string;
      cells: string;
    };
    network: {
      wifi: string;
      bluetooth: string;
      wifiMac: string;
      bluetoothMac: string;
      wiredEthernet: string;
    };
    operatingSystem: {
      name: string;
      publisher: string;
      licenceStatus: string;
      installType: string;
      version: string;
    };
    firmware: {
      biosVersion: string;
      board: string;
      secureBoot: string;
      tpm: string;
    };
  };
  
  notFittedList: string[];
  
  // Compliance & Custody (Page 4)
  dataSanitisation: {
    method: string;
    tool: string;
    technique: string;
    verification: string;
    certificateId: string;
    completedAt: string;
  };
  warranty: {
    term: string;
    startDate: string;
    expiryDate: string;
    covers: string;
    excludes: string;
    claimsUrl: string;
  };
  refurbRecord: {
    internalQcId: string;
    intakeDate: string;
    releaseDate: string;
    partsReplaced: string;
    assetTag: string;
    workPerformed: string;
    facility: string;
    priorRepairHistory: string;
    customerRef: string;
  };
  chainOfCustody: Array<{
    timestamp: string;
    stage: string;
    location: string;
    operatorId: string;
  }>;
  auditorNotes: string;
  environmentalSaving: {
    standard: string;
    weeeRegistration: string;
    co2eAvoidedKg: number;
  };
  documentControl: {
    revision: string;
    issuedDate: string;
    supersedes: string;
    calibrationSet: string;
    standard: string;
  };
  signatures: {
    technicianName: string;
    technicianAuth: string;
    qaManagerName: string;
    qaManagerAuth: string;
  };
  digitalSignatureHash: string;
}
