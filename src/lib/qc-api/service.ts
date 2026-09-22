import { normalizeLaptopQCData, normalizeMobileQCData, parseXmlToJson } from "./parser";
import { QCCertificateData, RawLaptopQCItem, RawMobileQCItem } from "./types";

const LAPTOP_API_URL = "https://store.xtracover.com/api/StoreApi/GetQCTestListByserviceKeylp";
const MOBILE_API_URL = "https://store.xtracover.com/api/StoreApi/GetBatteryTestListByserviceKey";

// Sample verified records for instant reference / demo testing
const SAMPLE_LAPTOP_RAW: RawLaptopQCItem = {
  mstChildid: 0,
  mstid: 549446,
  uid: "nazim37",
  certificate_number: "XCF9235895",
  certificate_image: "qr-img-XCF9235895.png",
  device_brand: "Dell Inc.",
  device_model: "Latitude 5540",
  device_serial_number: "G8FRLX3",
  product_name: "031CD3",
  bios_version: "1.27.1",
  audioplayback_test_result: "1",
  battery_test_result: "0",
  internet_test_result: "1",
  wireless_test_result: "1",
  bluetooth_test_result: "1",
  camera_photo_test_result: "1",
  camera_video_test_result: "-1",
  fan_test_result: "-1",
  cpu_test_result: "1",
  ram_test_result: "1",
  motherboard_test_result: "1",
  pciexpress_test_result: "-1",
  storage_test_result: "1",
  gpu_card_test_result: "-1",
  gpu_test_result: "1",
  charger_test_result: "-1",
  speaker_test_result: "1",
  mic_test_result: "1",
  touchpad_test_result: "1",
  keyboard_test_result: "1",
  wired_ethernet_test_result: "0",
  usb_test_result: "1",
  optical_disk_drive_test_result: "-1",
  sd_card_slot_test_result: "-1",
  display_test_result: "1",
  display_brightness_test_result: "-1",
  B_BatteryHealth: "73 %",
  B_DesignedCapacity: "75.1 Wh",
  Processor_Family: "13th Gen Intel(R) Core(TM) i7-1365U",
  Generation: "13th Generation",
  RAM: "16.0 GB",
  HDD_SSD: "512.11 GB (Storage-1: NVMe SSD 512.11 GB 95%)",
  Graphics_Card: "No",
  profile_id: "suraj",
  system_sku: "0C05",
  mbd_serial_number: "/G8FRLX3/CNWSC003CB01PW/",
  startDate: "11-05-2026 14:22:18 PM",
  endDate: "10-06-2026 14:22:18 PM",
  test_date_time: "12-05-2026 12:58:24 PM",
  test_result: "FAIL",
  test_status: "Very Good (Category B – Very Good)",
};

const SAMPLE_MOBILE_RAW: RawMobileQCItem = {
  id: 69716,
  IMEI: "XC92C9E265",
  imei_1: "351696727346207",
  imei_2: "351696727641557",
  brand_name: "Apple",
  model_name: "iPhone 12",
  device_category: "Mobile",
  device_id: "29B58565-648A-4F12-8C8E-EDFC578FA4D5",
  serial_number: "29B58565-648A-4F12-8C8E-EDFC578FA4D5",
  screen_size: "6.1 inch",
  storage: "128 GB",
  front_camera_mp: "12 MP",
  rear_camera_mp: "12 MP",
  processor_core: "6",
  battery_capacity: "2815.0 mAh",
  Battery_Design_Capacity: "2815.0 mAh",
  Health_Parcent: "83%",
  BatterytestStatus: "1",
  TestDuration: "5 Min",
  os: "iOS",
  os_versio: "26.3.1",
  CreatedOn: "2026-03-23T05:57:21.087",
  workorderid: "WO232411",
  uid: "cgdev",
  createdBy: "cgdev",
  MacAddress: "NA",
};

/**
 * Fetch QC Certificate data from external API and normalize.
 * Returns null if the device is not found.
 */
export async function fetchQCCertificate(
  serviceKey: string,
  deviceType: "laptop" | "mobile" = "laptop"
): Promise<QCCertificateData | null> {
  const cleanKey = serviceKey.trim();
  if (!cleanKey) return null;

  if (deviceType === "mobile") {
    try {
      const url = `${MOBILE_API_URL}?servicekey=${encodeURIComponent(cleanKey)}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json, text/xml, */*",
        },
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const text = await res.text();
        let mobileItem: RawMobileQCItem | null = null;

        if (text.trim().startsWith("<")) {
          // XML Response
          const parsedObj = parseXmlToJson(text);
          if (parsedObj.brand_name || parsedObj.model_name || parsedObj.IMEI || parsedObj.imei_1) {
            mobileItem = parsedObj as unknown as RawMobileQCItem;
          }
        } else {
          // JSON Response
          const json = JSON.parse(text);
          if (json.DATA && Array.isArray(json.DATA) && json.DATA.length > 0) {
            const item = json.DATA[0];
            if (item && (item.brand_name || item.model_name || item.IMEI || item.imei_1)) {
              mobileItem = item;
            }
          } else if (json.DATA && typeof json.DATA === "object") {
            const item = json.DATA;
            if (item && (item.brand_name || item.model_name || item.IMEI || item.imei_1)) {
              mobileItem = item;
            }
          }
        }

        if (mobileItem) {
          return normalizeMobileQCData(mobileItem, cleanKey);
        }
      }
    } catch (err) {
      console.warn("Mobile API live fetch error:", err);
    }

    // Fallback only if querying the official sample key
    if (cleanKey.toUpperCase() === "XC92C9E265") {
      return normalizeMobileQCData(SAMPLE_MOBILE_RAW, cleanKey);
    }

    return null;
  }

  // Default: Laptop
  try {
    const url = `${LAPTOP_API_URL}?servicekey=${encodeURIComponent(cleanKey)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, text/xml, */*",
      },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const text = await res.text();
      let laptopItem: RawLaptopQCItem | null = null;

      if (text.trim().startsWith("<")) {
        // XML Response
        const parsedObj = parseXmlToJson(text);
        if (parsedObj.device_brand || parsedObj.device_model || parsedObj.certificate_number || parsedObj.device_serial_number) {
          laptopItem = parsedObj as unknown as RawLaptopQCItem;
        }
      } else {
        // JSON Response
        const json = JSON.parse(text);
        if (json.DATA && Array.isArray(json.DATA) && json.DATA.length > 0) {
          const item = json.DATA[0];
          if (item && (item.device_brand || item.device_model || item.certificate_number || item.device_serial_number)) {
            laptopItem = item;
          }
        } else if (json.DATA && typeof json.DATA === "object") {
          const item = json.DATA;
          if (item && (item.device_brand || item.device_model || item.certificate_number || item.device_serial_number)) {
            laptopItem = item;
          }
        }
      }

      if (laptopItem) {
        return normalizeLaptopQCData(laptopItem, cleanKey);
      }
    }
  } catch (err) {
    console.warn("Laptop API live fetch error:", err);
  }

  // Fallback only if querying the official sample key
  if (cleanKey.toUpperCase() === "XCF9235895") {
    return normalizeLaptopQCData(SAMPLE_LAPTOP_RAW, cleanKey);
  }

  return null;
}
