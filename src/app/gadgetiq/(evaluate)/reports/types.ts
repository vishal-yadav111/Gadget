/**
 * QC Reports Types
 * ================
 * Complete data structures for Mobile, Laptop, MB, MH, DT, DTMB, and Monthly Summaries
 * matching the legacy StoreApi QCWorkOrderResult schema.
 */

export interface MobileQCReportItem {
  mstid: number;
  workorderid: string;
  IMEI: string;
  imei_1?: string;
  imei_2?: string;
  brand_name: string;
  model_name: string;
  device_brand?: string;
  device_model?: string;
  device_category?: string;
  serial_number?: string;
  device_serial_number?: string;
  storage?: string;
  ram?: string;
  battery_capacity?: string;
  Health_Parcent?: string;
  BatterytestStatus?: string;
  score?: string;
  test_result?: string;
  QCResult?: string;
  CreatedOn?: string;
  test_date_time?: string;
  test_datetime?: string;
  uid?: string;
  ServiceKey?: string;
  certificate_number?: string | null;
  physical_condition_category?: string;
  grade?: string;
  test_status?: string;
  Totaltest?: string;
  Testpassed?: string;
  Testfailed?: string;
  PartnerID?: string;
  partnercode?: string;
  MacAddress?: string;
  // Specific hardware tests
  Battery?: string;
  Display_Touch_Screen?: string;
  Display_Dead_Pixel?: string;
  Back_Camera?: string;
  Front_Camera?: string;
  Biometric?: string;
  WiFi?: string;
  Bluetooth?: string;
  LoudSpeaker?: string;
  Microphone?: string;
  Flash?: string;
  [key: string]: any;
}

export interface DataTablesRequest {
  draw?: number;
  start?: number;
  length?: number;
  search?: {
    value?: string;
  };
  FromDate?: string;
  ToDate?: string;
  uid?: string;
  status?: string;
}

export interface DataTablesResponse<T> {
  draw: string | number;
  recordsTotal: number;
  recordsFiltered: number;
  data: T[];
}

export interface LaptopQCReportItem {
  mstid: number;
  act?: string;
  uid?: string;
  imei_1?: string;
  imei_2?: string;
  MacAddress?: string;
  device_category?: string;
  brand_name?: string;
  model_name?: string;
  device_id?: string;
  screen_size?: string;
  storage?: string;
  front_camera_mp?: string;
  rear_camera_mp?: string;
  processor_core?: string;
  battery_capacity?: string;
  os?: string;
  os_versio?: string;
  serial_number?: string;
  score?: string;
  merchant_id?: string;
  physical_condition_category?: string;
  workorderid?: string;
  CreatedBy?: string;
  CreatedOn?: string;
  QCResult?: string;
  ServiceKey?: string;
  certificate_number?: string | null;
  Totaltest?: number | string | null;
  Testpassed?: number | string | null;
  Testfailed?: number | string | null;
  Testnotperformed?: number | string | null;
  TestnotApplicable?: number | string | null;
  deviceType?: string | null;
  PlanType?: string | null;
  partnercode?: string | null;
  IsUpload?: string;
  mstChildid?: string;
  device_brand?: string;
  device_model?: string;
  device_serial_number?: string;
  product_name?: string;
  bios_version?: string;

  // Diagnostic Test Results (-1 = N/A, 0 = Fail, 1 = Pass)
  audioplayback_test_result?: string;
  battery_test_result?: string;
  internet_test_result?: string;
  wireless_test_result?: string;
  bluetooth_test_result?: string;
  camera_photo_test_result?: string;
  camera_video_test_result?: string;
  fan_test_result?: string;
  cpu_test_result?: string;
  ram_test_result?: string;
  motherboard_test_result?: string;
  pciexpress_test_result?: string;
  storage_test_result?: string;
  gpu_card_test_result?: string;
  gpu_test_result?: string;
  charger_test_result?: string;
  speaker_test_result?: string;
  mic_test_result?: string;
  touchpad_test_result?: string;
  keyboard_test_result?: string;
  wired_ethernet_test_result?: string;
  usb_test_result?: string;
  optical_disk_drive_test_result?: string;
  sd_card_slot_test_result?: string;
  display_test_result?: string;
  display_brightness_test_result?: string;
  mouse_test_result?: string;
  earphone_jack_test_result?: string;
  earphone_test_result?: string;
  earphone_mic_test_result?: string;
  battery_stress_test_result?: string;
  battery_stress_test?: string;
  cpu_stress_test_result?: string;
  ram_stress_test_result?: string;
  gpu_stress_test_result?: string;
  ssdhdd_stress_test_result?: string;
  win_activation_test_result?: string;

  // Final Test & Hardware Status
  test_result: string;
  test_date_time?: string;
  test_status?: string;
  startDate?: string;
  endDate?: string;
  chassis_number?: string;
  Processor_Family?: string;
  Generation?: string;
  RAM?: string;
  HDD_SSD?: string;
  Graphics_Card?: string;
  // Additional legacy & flat fields
  Display?: string;
  WiFi?: string;
  Bluetooth?: string;
  Battery?: string;
  Front_Camera?: string;
  Health_Parcent?: string;
  battery_cycle_count?: string | number;
  [key: string]: any;
}

export interface MotherboardQCReportItem {
  mstid: number;
  workorderid?: string;
  ServiceKey?: string;
  certificate_number?: string | null;
  uid?: string;
  serial_number?: string;
  imei_1?: string;
  brand_name?: string;
  model_name?: string;
  Processor_Family?: string;
  Generation?: string;
  RAM_Slots?: string;
  PCIe_Slots?: string;
  BIOS_Version?: string;
  Power_Delivery?: string;
  VRM_Health?: string;
  Chipset_Temp?: string;
  Audio_Chip?: string;
  LAN_Port?: string;
  score?: string | number;
  QCResult?: string;
  test_result?: string;
  test_status?: string;
  CreatedBy?: string;
  CreatedOn?: string;
  UpdatedOn?: string;
  test_date_time?: string;
}

export interface MotherboardHousingQCReportItem {
  mstid: number;
  workorderid?: string;
  ServiceKey?: string;
  certificate_number?: string | null;
  uid?: string;
  serial_number?: string;
  imei_1?: string;
  brand_name?: string;
  model_name?: string;
  Hinge_Condition?: string;
  Screw_Threads?: string;
  Chassis_Alignment?: string;
  Ports_Bezel?: string;
  Palmrest_Condition?: string;
  Top_Cover_Condition?: string;
  Bottom_Cover_Condition?: string;
  score?: string | number;
  QCResult?: string;
  test_result?: string;
  test_status?: string;
  physical_condition_category?: string;
  CreatedBy?: string;
  CreatedOn?: string;
  UpdatedOn?: string;
  test_date_time?: string;
}

export interface DesktopQCReportItem {
  mstid: number;
  workorderid?: string;
  ServiceKey?: string;
  certificate_number?: string | null;
  uid?: string;
  serial_number?: string;
  imei_1?: string;
  brand_name?: string;
  model_name?: string;
  Form_Factor?: string;
  Processor_Family?: string;
  Generation?: string;
  RAM?: string;
  HDD_SSD?: string;
  GPU_Model?: string;
  Power_Supply_Wattage?: string;
  Cooling_Fan_RPM?: string;
  Front_IO_Ports?: string;
  Rear_IO_Ports?: string;
  score?: string | number;
  QCResult?: string;
  test_result?: string;
  test_status?: string;
  physical_condition_category?: string;
  CreatedBy?: string;
  CreatedOn?: string;
  UpdatedOn?: string;
  test_date_time?: string;
}

export interface DesktopMotherboardQCReportItem {
  mstid: number;
  workorderid?: string;
  ServiceKey?: string;
  certificate_number?: string | null;
  uid?: string;
  serial_number?: string;
  imei_1?: string;
  brand_name?: string;
  model_name?: string;
  Socket_Type?: string;
  Chipset?: string;
  RAM_Slots?: string;
  SATA_Ports?: string;
  M2_Slots?: string;
  Front_Panel_Headers?: string;
  score?: string | number;
  QCResult?: string;
  test_result?: string;
  test_status?: string;
  CreatedBy?: string;
  CreatedOn?: string;
  UpdatedOn?: string;
  test_date_time?: string;
}

export interface GenericQCReportItem {
  mstid: number | string;
  workorderid: string;
  serialNumber: string;
  brand: string;
  model: string;
  category: string;
  grade?: string;
  testResult: "Pass" | "Fail" | string;
  score?: string;
  technician: string;
  testedAt: string;
  serviceKey?: string;
}

export interface MonthlySummaryItem {
  month: string;
  mobileEvaluations: number;
  mobilePassed?: number;
  mobileFailed?: number;
  mobileAvgScore?: number;
  laptopEvaluations: number;
  laptopPassed?: number;
  laptopFailed?: number;
  laptopAvgScore?: number;
  desktopEvaluations: number;
  desktopPassed?: number;
  desktopFailed?: number;
  totalPassed: number;
  totalFailed: number;
  licensesConsumed: number;
  avgScore: number;
}

// ----------------------------------------------------
// On-Demand Laptop QC Detail Data Contracts
// ----------------------------------------------------

export interface LaptopIdentification {
  mstid?: number | string;
  serial_number?: string;
  imei_1?: string;
  imei_2?: string;
  MacAddress?: string;
  brand_name?: string;
  model_name?: string;
  device_category?: string;
  workorderid?: string;
  QCResult?: string;
  test_result?: string;
  test_status?: string;
  grade?: string;
  physical_condition_category?: string;
  createdBy?: string;
  CreatedOn?: string;
  test_date_time?: string;
  profile_id?: string;
  ServiceKey?: string;
  certificate_number?: string;
  processor_core?: string | number;
  product_name?: string;
  mbd_serial_number?: string;
  uid?: string;
  os_versio?: string;
  [key: string]: any;
}

export interface LaptopHardwareDiagnostics {
  audioplayback_test_result?: string;
  battery_test_result?: string;
  internet_test_result?: string;
  wireless_test_result?: string;
  bluetooth_test_result?: string;
  camera_photo_test_result?: string;
  camera_video_test_result?: string;
  fan_test_result?: string;
  cpu_test_result?: string;
  ram_test_result?: string;
  motherboard_test_result?: string;
  pciexpress_test_result?: string;
  storage_test_result?: string;
  gpu_card_test_result?: string;
  gpu_test_result?: string;
  charger_test_result?: string;
  speaker_test_result?: string;
  mic_test_result?: string;
  touchpad_test_result?: string;
  keyboard_test_result?: string;
  wired_ethernet_test_result?: string;
  usb_test_result?: string;
  optical_disk_drive_test_result?: string;
  sd_card_slot_test_result?: string;
  display_test_result?: string;
  display_brightness_test_result?: string;
  battery_stress_test_result?: string;
  battery_stress_test?: string;
  win_activation_test_result?: string;
  [key: string]: any;
}

export interface LaptopMemorySlot {
  manufacturer?: string;
  capacity?: string;
  serial?: string;
  type?: string;
  speed?: string;
  partNumber?: string;
}

export interface LaptopStorageDisk {
  model?: string;
  size?: string;
  serial?: string;
  type?: string;
  health?: string;
}

export interface LaptopComponentSpecs {
  Processor_Family?: string;
  Generation?: string;
  RAM?: string;
  HDD_SSD?: string;
  Graphics_Card?: string;
  bios_version?: string;
  system_sku?: string;
  mbd_serial_number?: string;
  chassis?: {
    manufacturer?: string;
    model?: string;
    serial?: string;
    assetTag?: string;
  };
  os_details?: {
    name?: string;
    manufacturer?: string;
    version?: string;
    build?: string;
    license?: string;
  };
  motherboard?: {
    manufacturer?: string;
    product?: string;
    serial?: string;
    version?: string;
  };
  cpu?: {
    manufacturer?: string;
    name?: string;
    max_speed?: string;
    generation?: string;
    cores?: string | number;
    threads?: string | number;
  };
  memory?: {
    total?: string;
    sticks?: string | number;
    slot1?: LaptopMemorySlot;
    slot2?: LaptopMemorySlot;
    slot3?: LaptopMemorySlot;
    slot4?: LaptopMemorySlot;

  };
  storage_devices?: {
    total?: string;
    disk1?: LaptopStorageDisk;
    disk2?: LaptopStorageDisk;
  };
  network?: {
    wifi?: { name?: string; mac?: string };
    bluetooth?: { name?: string; mac?: string };
    ethernet?: { name?: string; mac?: string };
  };
  [key: string]: any;
}

export interface LaptopBatteryAnalytics {
  designed_capacity?: string;
  remaining_capacity?: string;
  battery_health?: string;
  cycle_count?: string | number;
  estimated_charge_remaining?: string;
  number_of_cells?: string | number;
  voltage?: string;
  temperature?: string;
  [key: string]: any;
}

export interface LaptopQcDetailData {
  identification: LaptopIdentification;
  hardware_diagnostics: LaptopHardwareDiagnostics;
  component_specs: LaptopComponentSpecs;
  battery_analytics: LaptopBatteryAnalytics;
  raw?: any;
}

export interface LaptopQcDetailResponse {
  RespCode: number;
  RespMsg: string;
  data: LaptopQcDetailData;
}

// ----------------------------------------------------
// Unified Hardware (Motherboard, Desktop, DTMB, Housing) Data Contracts
// ----------------------------------------------------

/**
 * Common Summary Item for Motherboard, Desktop, Desktop Motherboard, and Housing
 */
export interface HardwareSummaryItem {
  PartnerID?: string;
  mstid: number | string;
  act?: string;
  uid: string;
  imei_1: string;
  imei_2?: string;
  serial_number: string;
  MacAddress?: string;
  device_category: 'Motherboard' | 'Desktop' | 'Desktop Motherboard' | 'Motherboard Housing' | string;
  brand_name: string;
  model_name: string;
  storage?: string;
  QCResult: 'PASS' | 'FAIL' | 'Not Tested' | string;
  test_result?: string;
  grade?: string;
  test_status?: string;
  physical_condition_category?: string;
  workorderid?: string;
  CreatedBy?: string;
  CreatedOn: string;
  test_date_time?: string;
  test_date_timen?: string;
  ServiceKey?: string;
  certificate_number?: string | null;
  score?: string | number;
  [key: string]: any;
}

/**
 * Filter & Pagination Payload
 */
export interface ReportFilterParams {
  draw?: number | string;
  start?: number;
  length?: number;
  page?: number;
  limit?: number;
  pageSize?: number;
  searchValue?: string;
  search?: { value: string } | string;
  fromDate?: string;
  toDate?: string;
  FromDate?: string;
  ToDate?: string;
  uid?: string;
  status?: string;
  partnerId?: string;
}

/**
 * Dual Paginated API Response
 */
export interface PaginatedReportResponse<T = HardwareSummaryItem> {
  RespCode?: number;
  RespMsg?: string;
  draw?: string | number;
  recordsTotal: number;
  recordsFiltered: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  data: T[];
  DATA?: T[];
}

/**
 * Categorized Detail View for Single Hardware Inspection
 */
export interface HardwareDetailData {
  identification: {
    mstid: number | string;
    mstChildid?: number | string;
    act?: string;
    uid?: string;
    imei_1: string;
    imei_2?: string;
    serial_number: string;
    MacAddress?: string;
    device_id?: string;
    device_category: string;
    brand_name: string;
    model_name: string;
    workorderid?: string;
    PartnerID?: string;
    ServiceKey?: string;
    QCResult: string;
    test_result?: string;
    test_status?: string;
    grade?: string;
    score?: string;
    createdBy?: string;
    CreatedOn?: string;
    test_date_time?: string;
    project_name?: string;
    [key: string]: any;
  };
  hardware_diagnostics: {
    // Core Hardware
    cpu_test_result?: string;
    ram_test_result?: string;
    motherboard_test_result?: string;
    storage_test_result?: string;
    pciexpress_test_result?: string;
    gpu_test_result?: string;
    gpu_card_test_result?: string;
    fan_test_result?: string;

    // Ports & I/O
    front_audio_port_test_result?: string;
    back_audio_port_test_result?: string;
    front_microphone_port_test_result?: string;
    back_microphone_port_test_result?: string;
    dvi_port_test_result?: string;
    display_port_test_result?: string;
    usb_test_result?: string;
    wired_ethernet_test_result?: string;
    optical_disk_drive_test_result?: string;
    sd_card_slot_test_result?: string;
    earphone_jack_test_result?: string;
    earphone_test_result?: string;
    earphone_mic_test_result?: string;

    // Multimedia & Peripherals
    audioplayback_test_result?: string;
    speaker_test_result?: string;
    mic_test_result?: string;
    display_test_result?: string;
    display_brightness_test_result?: string;
    keyboard_test_result?: string;
    mouse_test_result?: string;
    touchpad_test_result?: string;
    camera_photo_test_result?: string;
    camera_video_test_result?: string;

    // Connectivity
    wireless_test_result?: string;
    bluetooth_test_result?: string;
    internet_test_result?: string;

    // Stress & Firmware
    cpu_stress_test_result?: string;
    ram_stress_test_result?: string;
    gpu_stress_test_result?: string;
    ssdhdd_stress_test_result?: string;
    battery_stress_test_result?: string;
    battery_test_result?: string;
    charger_test_result?: string;
    win_activation_test_result?: string;
    me_version_test_result?: string;
    me_version?: string;
    [key: string]: any;
  };
  component_specs: {
    Processor_Family?: string;
    Generation?: string;
    RAM?: string;
    HDD_SSD?: string;
    Graphics_Card?: string;
    bios_version?: string;
    system_sku?: string;
    mbd_serial_number?: string;
    chassis_number?: string;
    [key: string]: any;
  };
  all_fields?: Record<string, any>;
  [key: string]: any;
}

export interface SingleDetailResponse {
  RespCode: number;
  RespMsg: string;
  data: HardwareDetailData;
}

export interface MobileDetailData {
  identification?: {
    mstid?: number | string;
    workorderid?: string;
    imei_1?: string;
    imei_2?: string;
    serial_number?: string;
    brand_name?: string;
    model_name?: string;
    device_category?: string;
    QCResult?: string;
    test_result?: string;
    test_status?: string;
    grade?: string;
    physical_condition_category?: string;
    score?: string | number;
    createdBy?: string;
    CreatedOn?: string;
    test_date_time?: string;
    ServiceKey?: string;
    certificate_number?: string;
    storage?: string;
    ram?: string;
    battery_capacity?: string;
    Health_Parcent?: string;
    [key: string]: any;
  };
  hardware_diagnostics?: {
    Battery?: string;
    Display_Touch_Screen?: string;
    Display_Dead_Pixel?: string;
    Back_Camera?: string;
    Front_Camera?: string;
    Biometric?: string;
    WiFi?: string;
    Bluetooth?: string;
    LoudSpeaker?: string;
    Microphone?: string;
    Flash?: string;
    [key: string]: any;
  };
  cosmetic_grading?: Record<string, any>;
  accessories?: Record<string, any>;
  security_locks?: Record<string, any>;
  component_specs?: Record<string, any>;
  battery_analytics?: Record<string, any>;
  all_fields?: Record<string, any>;
  [key: string]: any;
}

export interface MobileQcDetailResponse {
  RespCode: number;
  RespMsg: string;
  data: MobileDetailData;
}

