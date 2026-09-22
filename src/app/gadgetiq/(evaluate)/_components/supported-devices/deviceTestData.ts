export const laptopTests = [
  { name: "Audio Playback Test", type: "Automatic" },
  { name: "Battery Health Test", type: "Automatic" },
  { name: "Internet Test", type: "Automatic" },
  { name: "Wireless Test", type: "Automatic" },
  { name: "Bluetooth Test", type: "Automatic" },
  { name: "Camera Photo Test", type: "Automatic" },
  { name: "Camera Video Test", type: "Automatic" },
  { name: "Fan Test", type: "Automatic" },
  { name: "CPU Test", type: "Automatic" },
  { name: "RAM Test", type: "Automatic" },
  { name: "Motherboard Test", type: "Automatic" },
  { name: "PCI Express Test", type: "Automatic" },
  { name: "Storage Test", type: "Automatic" },
  { name: "Graphic Card Test", type: "Automatic" },
  { name: "GPU Test", type: "Automatic" },
  { name: "Charger Test", type: "Assisted" },
  { name: "Inbuild Speaker Test", type: "Assisted" },
  { name: "Inbuild Microphone Test", type: "Assisted" },
  { name: "Touchpad Test", type: "Assisted" },
  { name: "Keyboard Test", type: "Assisted" },
  { name: "Wired Ethernet Test", type: "Assisted" },
  { name: "USB Port Test", type: "Assisted" },
  { name: "Optical Disk Drive Test", type: "Assisted" },
  { name: "SD Card Slot Test", type: "Assisted" },
  { name: "Display Test", type: "Assisted" },
  { name: "Display Brightness Test", type: "Assisted" },
  { name: "Fingerprint Test", type: "Assisted" },
  { name: "TPM Test", type: "Automatic" },
  { name: "VGA Port Test", type: "Assisted" },
  { name: "HDMI Port Test", type: "Assisted" },
  { name: "Battery Charging Test", type: "Assisted" },
  { name: "Battery Discharging Test", type: "Assisted" },
  { name: "UUID Test", type: "Automatic" },
  { name: "S4 State Test", type: "Assisted" },
  { name: "Realtime Clock Test", type: "Automatic" },
  { name: "Win Activation Test", type: "Automatic" },
  { name: "Battery Stress Test", type: "Automatic" }
];

export const laptopSystemInfo = {
  "Device": [
    "Description Of the Product",
    "Brand",
    "Model Name / Number",
    "Serial No",
    "Product Name",
    "Bios Version",
    "System SKU"
  ],
  "Operating System": [
    "Manufacturer Name",
    "Version",
    "License Status"
  ],
  "Motherboard": [
    "Manufacturer",
    "Product ID",
    "Serial No"
  ],
  "Battery": [
    "Manufacturer",
    "Capacity",
    "Serial No",
    "Remaining Capacity",
    "Health",
    "Cycle Count",
    "Estimated Charge remaining at the beginning of the test",
    "Number of cells"
  ],
  "Memory": [
    "Count of memory sticks present",
    "Manufacturer ID",
    "Total Physical Memory",
    "Serial No",
    "Type",
    "Capacity",
    "S/l No.",
    "Part No",
    "Speed"
  ],
  "CPU": [
    "Generation",
    "Manufacturer Name",
    "CPU Name",
    "Max Clock Speed"
  ],
  "GPU": [
    "Video Processor Name",
    "Manufacturer",
    "Adapter RAM"
  ],
  "Storage": [
    "Count of Physical Disc Drives",
    "Total Storage",
    "Model Name / Number",
    "Capacity",
    "Serial No"
  ],
  "Wireless": [
    "Manufacturer Name",
    "Wireless Name",
    "MAC Address"
  ],
  "Bluetooth": [
    "Manufacturer Name",
    "Bluetooth Name",
    "MAC Address"
  ],
  "Wired Ethernet": [
    "Manufacturer Name",
    "Wired Ethernet Name",
    "MAC Address"
  ],
  "Keyboard": [
    "Name",
    "Description",
    "Number of Function keys",
    "Layout"
  ],
  "Camera": [
    "Manufacturer Name",
    "Camera Name",
    "Description"
  ],
  "Audio": [
    "Manufacturer Name",
    "Audio Driver Name"
  ],
  "Optical Disc Drive": [
    "Manufacturer Name",
    "Optical Disc Drive Name"
  ],
  "SD Card": [
    "Media Type",
    "Model",
    "Size",
    "Serial No"
  ]
};

export const mobileTestsByCategory = {
  "Battery": [
    "Battery Test",
    "Battery Stress Test",
    "Battery Charging Capacity Test"
  ],
  "Display": [
    "Dead Pixel Check",
    "Display & Touch Screen Test",
    "Multi-Touch Test",
    "Display Brightness Test"
  ],
  "Audio": [
    "Earphone Test",
    "Earphone Jack Test",
    "Earphone Mic Test",
    "Earphone Keys Test",
    "LoudSpeaker Test",
    "Receiver Test",
    "Audio Playback Test",
    "Noise Cancellation Test",
    "Microphone Test"
  ],
  "Camera": [
    "Main Camera Test",
    "Selfie Camera Test",
    "Camera Auto Focus Test",
    "Flash Test",
    "Front Flash Test"
  ],
  "Video": [
    "Back Video Recording Test",
    "Front Video Recording Test"
  ],
  "Connectivity": [
    "Bluetooth Test",
    "NFC Test"
  ],
  "Network": [
    "Call SIM 1 Test",
    "Call SIM 2 Test",
    "VoLTE Calling Test",
    "WiFi Test",
    "Internet Test",
    "Network Signal SIM 1 Test",
    "Network Signal SIM 2 Test"
  ],
  "Location": [
    "GPS Test"
  ],
  "Storage": [
    "Internal Storage Test",
    "External Storage Test"
  ],
  "Sensor": [
    "Proximity Test",
    "Gyroscope Test",
    "Gyroscope Gaming Test",
    "Gravity Test",
    "Humidity Test",
    "Motion Detector Test",
    "Step Detector Test",
    "Step Counter Test",
    "UV Sensor Test",
    "Light Sensor Test",
    "InfraRed Sensor Test",
    "Hall Sensor Test",
    "Orientation Test"
  ],
  "Button": [
    "Volume Up Button Test",
    "Volume Down Button Test",
    "Home Key Test",
    "Back Key Test",
    "Power Key Test"
  ],
  "Connector": [
    "USB Test",
    "OTG Test"
  ],
  "Power": [
    "Charging Test"
  ],
  "Multimedia": [
    "FM/Radio Test"
  ],
  "Performance": [
    "CPU Performance Test"
  ],
  "Temperature": [
    "Device Temperature Test"
  ],
  "Security": [
    "Screen Lock Test",
    "Fingerprint Test"
  ],
  "Other": [
    "Vibrate Test",
    "Torch Test",
    "IMEI Validation Test"
  ]
};
