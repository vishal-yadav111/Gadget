export interface DiagnosticCheck {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "pending" | "testing" | "passed" | "failed" | "warning";
  reading?: string;
  durationMs: number;
}

export interface DiagnosticModule {
  id: string;
  category: string;
  title: string;
  iconName: string;
  checks: DiagnosticCheck[];
}

export const diagnosticModules: DiagnosticModule[] = [
  {
    id: "mod-os",
    category: "System Core",
    title: "Operating System & Kernel",
    iconName: "Terminal",
    checks: [
      { id: "c-1", name: "Kernel Integrity & Secure Boot", category: "OS", description: "Verifies cryptographic kernel signature", status: "pending", durationMs: 250 },
      { id: "c-2", name: "System File Verification", category: "OS", description: "Scans OS binary tree for corruption", status: "pending", durationMs: 300 },
      { id: "c-3", name: "Driver & Firmware Compatibility", category: "OS", description: "Cross-checks ACPI & UEFI tables", status: "pending", durationMs: 200 },
      { id: "c-4", name: "Cryptographic TPM 2.0 Module", category: "OS", description: "Validates hardware root-of-trust", status: "pending", durationMs: 220 },
    ],
  },
  {
    id: "mod-cpu",
    category: "Compute",
    title: "CPU Processor & Cores",
    iconName: "Cpu",
    checks: [
      { id: "c-5", name: "Multi-Core Stress Benchmark", category: "CPU", description: "100% AVX/NEON instruction load test", status: "pending", durationMs: 450 },
      { id: "c-6", name: "L1/L2/L3 Cache Coherency", category: "CPU", description: "Validates SRAM cache latency and parity", status: "pending", durationMs: 350 },
      { id: "c-7", name: "Dynamic Frequency Scaling", category: "CPU", description: "Tests boost clock and voltage regulation", status: "pending", durationMs: 300 },
      { id: "c-8", name: "Thermal Junction Delta", category: "CPU", description: "Monitors core thermal thresholds under load", status: "pending", durationMs: 400 },
    ],
  },
  {
    id: "mod-ram",
    category: "Compute",
    title: "Memory (RAM) Subsystem",
    iconName: "Layers",
    checks: [
      { id: "c-9", name: "RAM Address Bit-Pattern Scan", category: "RAM", description: "Walking 1s/0s memory pattern check", status: "pending", durationMs: 380 },
      { id: "c-10", name: "Read/Write Bandwidth Peak", category: "RAM", description: "Measures throughput vs OEM specification", status: "pending", durationMs: 320 },
      { id: "c-11", name: "Dual-Channel Symmetry", category: "RAM", description: "Validates channel interleaving", status: "pending", durationMs: 250 },
      { id: "c-12", name: "SPD EEPROM Metadata Scan", category: "RAM", description: "Verifies genuine module serial & timing", status: "pending", durationMs: 200 },
    ],
  },
  {
    id: "mod-storage",
    category: "Storage",
    title: "NVMe / SSD Storage Health",
    iconName: "HardDrive",
    checks: [
      { id: "c-13", name: "S.M.A.R.T. Health Status", category: "Storage", description: "Scans raw reallocated sector counters", status: "pending", durationMs: 300 },
      { id: "c-14", name: "Sequential Read/Write Rate", category: "Storage", description: "High-speed PCIe 4.0/5.0 IOPS stress", status: "pending", durationMs: 400 },
      { id: "c-15", name: "NAND Flash Wear Level %", category: "Storage", description: "Computes remaining life endurance (TBW)", status: "pending", durationMs: 350 },
      { id: "c-16", name: "Bad Block & TRIM Verification", category: "Storage", description: "Verifies block allocation table integrity", status: "pending", durationMs: 280 },
    ],
  },
  {
    id: "mod-gpu",
    category: "Graphics",
    title: "GPU & Video Pipeline",
    iconName: "MonitorPlay",
    checks: [
      { id: "c-17", name: "3D Shader & Ray-tracing Stress", category: "GPU", description: "Renders complex geometric test mesh", status: "pending", durationMs: 420 },
      { id: "c-18", name: "VRAM Memory Parity Check", category: "GPU", description: "Checks dedicated GDDR/Unified memory", status: "pending", durationMs: 350 },
      { id: "c-19", name: "Hardware Video Decode Engine", category: "GPU", description: "Tests AV1, HEVC & ProRes hardware decoders", status: "pending", durationMs: 280 },
      { id: "c-20", name: "Display Interface Clock Sync", category: "GPU", description: "Verifies eDP & HDMI/DP transmitter sync", status: "pending", durationMs: 250 },
    ],
  },
  {
    id: "mod-display",
    category: "Visuals",
    title: "Display Panel & Digitizer",
    iconName: "Tv",
    checks: [
      { id: "c-21", name: "Sub-Pixel Dead/Stuck Matrix", category: "Display", description: "Detects dead pixels across RGBW planes", status: "pending", durationMs: 320 },
      { id: "c-22", name: "Backlight Luminance & Uniformity", category: "Display", description: "Measures candela/m² across 9 matrix points", status: "pending", durationMs: 350 },
      { id: "c-23", name: "Color Accuracy (DCI-P3 / sRGB)", category: "Display", description: "Evaluates gamma curve and delta-E delta", status: "pending", durationMs: 300 },
      { id: "c-24", name: "Touch Panel Multi-Point Grid", category: "Display", description: "Scans capacitive touch digitizer responsiveness", status: "pending", durationMs: 280 },
    ],
  },
  {
    id: "mod-battery",
    category: "Power",
    title: "Battery & Power Management",
    iconName: "BatteryCharging",
    checks: [
      { id: "c-25", name: "Original Full Charge Capacity", category: "Battery", description: "Calculates Design vs Actual mAh capacity", status: "pending", durationMs: 350 },
      { id: "c-26", name: "Cycle Count & Chemistry Wear", category: "Battery", description: "Validates cycle threshold and degradation", status: "pending", durationMs: 300 },
      { id: "c-27", name: "Cell Voltage Balance", category: "Battery", description: "Measures mV variance across lithium cells", status: "pending", durationMs: 280 },
      { id: "c-28", name: "USB-PD / Fast Charge Controller", category: "Battery", description: "Tests 100W PD handshake and thermal safety", status: "pending", durationMs: 320 },
    ],
  },
  {
    id: "mod-motherboard",
    category: "Motherboard",
    title: "Motherboard & System Bus",
    iconName: "CircuitBoard",
    checks: [
      { id: "c-29", name: "PCIe Bus Lane Negotiation", category: "Board", description: "Verifies x16 / x4 PCIe lane width", status: "pending", durationMs: 260 },
      { id: "c-30", name: "I2C / SMBus Sensor Health", category: "Board", description: "Polls motherboard hardware monitor chips", status: "pending", durationMs: 240 },
      { id: "c-31", name: "RTC Real-Time Clock & CMOS", category: "Board", description: "Validates clock oscillator stability", status: "pending", durationMs: 200 },
      { id: "c-32", name: "Thermal Sensor Diode Array", category: "Board", description: "Checks VRM, Chipset, and Ambient sensors", status: "pending", durationMs: 250 },
    ],
  },
  {
    id: "mod-wireless",
    category: "Connectivity",
    title: "Wireless Wi-Fi 6E/7 & MIMO",
    iconName: "Wifi",
    checks: [
      { id: "c-33", name: "2.4GHz / 5GHz / 6GHz Radio Check", category: "Wireless", description: "Tests tri-band RF antenna transmission", status: "pending", durationMs: 320 },
      { id: "c-34", name: "Signal RSSI & Noise Floor", category: "Wireless", description: "Calculates SNR and antenna gain", status: "pending", durationMs: 280 },
      { id: "c-35", name: "MIMO Spatial Stream Sync", category: "Wireless", description: "Verifies 2x2 / 4x4 spatial stream latency", status: "pending", durationMs: 300 },
      { id: "c-36", name: "MAC Address Cryptographic Match", category: "Wireless", description: "Confirms non-spoofed hardware MAC address", status: "pending", durationMs: 220 },
    ],
  },
  {
    id: "mod-bluetooth",
    category: "Connectivity",
    title: "Bluetooth 5.3 Radio",
    iconName: "Bluetooth",
    checks: [
      { id: "c-37", name: "Bluetooth Low Energy (BLE) Beacon", category: "BT", description: "Polls BLE advertising channels", status: "pending", durationMs: 250 },
      { id: "c-38", name: "Audio Codec Support (LDAC/AAC)", category: "BT", description: "Verifies audio streaming bitrate protocols", status: "pending", durationMs: 260 },
      { id: "c-39", name: "Pairing Controller Response", category: "BT", description: "Tests pairing state handshake latency", status: "pending", durationMs: 240 },
      { id: "c-40", name: "RF Interference Shielding", category: "BT", description: "Verifies coexistence with 2.4GHz Wi-Fi", status: "pending", durationMs: 220 },
    ],
  },
  {
    id: "mod-ethernet",
    category: "Connectivity",
    title: "Gigabit Ethernet Controller",
    iconName: "Network",
    checks: [
      { id: "c-41", name: "PHY Link Negotiation (1G/2.5G)", category: "LAN", description: "Tests auto-negotiation and link pulse", status: "pending", durationMs: 250 },
      { id: "c-42", name: "Packet Loopback & CRC Check", category: "LAN", description: "Zero-packet loss hardware loopback test", status: "pending", durationMs: 280 },
      { id: "c-43", name: "Wake-on-LAN (WoL) Packet Filter", category: "LAN", description: "Tests magic packet detection circuitry", status: "pending", durationMs: 200 },
      { id: "c-44", name: "Surge Protection Transformer", category: "LAN", description: "Verifies magnetics isolation impedance", status: "pending", durationMs: 220 },
    ],
  },
  {
    id: "mod-keyboard",
    category: "Peripherals",
    title: "Keyboard Matrix & Trackpad",
    iconName: "Keyboard",
    checks: [
      { id: "c-45", name: "Full Key Matrix Ghosting Scan", category: "Keyboard", description: "Verifies N-key rollover across all keys", status: "pending", durationMs: 350 },
      { id: "c-46", name: "Backlight LED Zone Brightness", category: "Keyboard", description: "Checks uniform keyboard illumination", status: "pending", durationMs: 220 },
      { id: "c-47", name: "Precision Trackpad Gesture Grid", category: "Keyboard", description: "Measures haptic feedback & gesture latency", status: "pending", durationMs: 300 },
      { id: "c-48", name: "Key Switch Actuation Force", category: "Keyboard", description: "Validates travel distance and spring rebound", status: "pending", durationMs: 250 },
    ],
  },
  {
    id: "mod-camera",
    category: "Multimedia",
    title: "Webcam & Ambient Sensors",
    iconName: "Camera",
    checks: [
      { id: "c-49", name: "CMOS Image Sensor Resolution", category: "Camera", description: "Captures test pattern & checks sensor noise", status: "pending", durationMs: 320 },
      { id: "c-50", name: "Autofocus & Lens Clarity", category: "Camera", description: "Evaluates edge sharpness and optical distortion", status: "pending", durationMs: 280 },
      { id: "c-51", name: "Ambient Light Sensor Response", category: "Camera", description: "Tests auto-brightness lux transition curve", status: "pending", durationMs: 220 },
      { id: "c-52", name: "Privacy Shutter / LED Indicator", category: "Camera", description: "Verifies physical or electrical cut-off sensor", status: "pending", durationMs: 200 },
    ],
  },
  {
    id: "mod-audio",
    category: "Multimedia",
    title: "Audio DAC, Speakers & Mic",
    iconName: "Volume2",
    checks: [
      { id: "c-53", name: "Stereo Speaker Frequency Sweep", category: "Audio", description: "Tests 20Hz - 20kHz harmonic distortion (THD)", status: "pending", durationMs: 380 },
      { id: "c-54", name: "Microphone Array Noise Suppression", category: "Audio", description: "Evaluates beamforming and background noise", status: "pending", durationMs: 320 },
      { id: "c-55", name: "3.5mm Headphone Jack DAC Output", category: "Audio", description: "Verifies impedance detection and signal-to-noise", status: "pending", durationMs: 260 },
      { id: "c-56", name: "Speaker Membrane Crackle Test", category: "Audio", description: "Scans for physical coil/cone damage", status: "pending", durationMs: 280 },
    ],
  },
  {
    id: "mod-io",
    category: "Peripherals",
    title: "USB / Thunderbolt I/O Ports",
    iconName: "Usb",
    checks: [
      { id: "c-57", name: "Thunderbolt 4 / USB4 (40Gbps)", category: "Ports", description: "Tests PCIe tunneling & DisplayPort alt-mode", status: "pending", durationMs: 350 },
      { id: "c-58", name: "USB 3.2 Gen 2x2 Port Speed", category: "Ports", description: "Verifies 10Gbps/20Gbps data transmission", status: "pending", durationMs: 280 },
      { id: "c-59", name: "SD / MicroSD Card Reader UHS-II", category: "Ports", description: "Tests high-speed bus pin connectivity", status: "pending", durationMs: 240 },
      { id: "c-60", name: "Port Overcurrent Protection Fuse", category: "Ports", description: "Validates polyfuse auto-recovery safety", status: "pending", durationMs: 220 },
    ],
  },
  {
    id: "mod-security",
    category: "Security",
    title: "Biometrics & Security Enclave",
    iconName: "Fingerprint",
    checks: [
      { id: "c-61", name: "Capacitive Fingerprint Sensor", category: "Security", description: "Tests biometric ridge capture accuracy", status: "pending", durationMs: 300 },
      { id: "c-62", name: "IR Facial Recognition (Windows Hello/FaceID)", category: "Security", description: "Validates structured dot projector and IR camera", status: "pending", durationMs: 320 },
      { id: "c-63", name: "Hardware Security Enclave (SEP)", category: "Security", description: "Verifies isolated cryptographic key storage", status: "pending", durationMs: 260 },
      { id: "c-64", name: "Anti-Tamper Chassis Intrusion Sensor", category: "Security", description: "Checks microswitch and accelerometer status", status: "pending", durationMs: 200 },
    ],
  },
];

export interface PresetDevice {
  id: string;
  name: string;
  brand: string;
  type: "Laptop" | "Smartphone" | "Tablet" | "Desktop";
  serial: string;
  specs: string;
  batteryHealthDefault: number;
}

export const presetDevices: PresetDevice[] = [
  {
    id: "p1",
    name: "MacBook Pro 16\" (M3 Max, 64GB, 2TB)",
    brand: "Apple",
    type: "Laptop",
    serial: "XC-AP-994821",
    specs: "Apple M3 Max (16-Core), 64GB Unified RAM, 2TB PCIe 4.0 SSD, Liquid Retina XDR",
    batteryHealthDefault: 98,
  },
  {
    id: "p2",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    brand: "Lenovo",
    type: "Laptop",
    serial: "XC-LN-772019",
    specs: "Intel Core i7-1370P, 32GB LPDDR5, 1TB NVMe Opal2, 2.8K OLED 120Hz",
    batteryHealthDefault: 94,
  },
  {
    id: "p3",
    name: "Dell Latitude 5440 Enterprise",
    brand: "Dell",
    type: "Laptop",
    serial: "XC-DL-388204",
    specs: "Intel Core i5-1345U vPro, 16GB DDR5, 512GB NVMe, FHD IPS Anti-Glare",
    batteryHealthDefault: 88,
  },
  {
    id: "p4",
    name: "Samsung Galaxy S24 Ultra 512GB",
    brand: "Samsung",
    type: "Smartphone",
    serial: "XC-SM-104928",
    specs: "Snapdragon 8 Gen 3, 12GB RAM, 512GB UFS 4.0, Dynamic AMOLED 2X 120Hz",
    batteryHealthDefault: 97,
  },
  {
    id: "p5",
    name: "HP EliteBook 840 G10 Refurbished",
    brand: "HP",
    type: "Laptop",
    serial: "XC-HP-661902",
    specs: "Intel Core i5-1335U, 16GB RAM, 512GB SSD, FHD IPS (Grade B Candidate)",
    batteryHealthDefault: 76,
  },
];
