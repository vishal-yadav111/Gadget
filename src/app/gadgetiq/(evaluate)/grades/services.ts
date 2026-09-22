/**
 * Grade Reports Service
 * =====================
 * Computes live hardware cosmetic & functional grade distributions directly from StoreApi QC evaluations.
 */

import { evaluateApi } from "../core/client";
import { EVALUATE_ENDPOINTS } from "../core/config";
import { authService } from "../core/auth.service";
import {
  GradeDistributionItem,
  GradedDeviceItem,
  GradeReportResponse,
  LaptopGradeReportParams,
  MobileGradeReportParams,
  PaginatedGradeReportResponse,
} from "./types";

/**
 * Format any date string or Date object to dd/MM/yyyy (Day/Month/Year)
 * strictly required by ASP.NET Web API.
 */
function formatToApiDate(d?: string | Date, fallback: string = "01/01/2021"): string {
  if (!d) return fallback;
  if (d instanceof Date) {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const clean = String(d).trim();
  if (!clean) return fallback;

  if (clean.includes("-") || clean.includes("/")) {
    const sep = clean.includes("-") ? "-" : "/";
    const parts = clean.split(sep);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const year = parts[0];
        const month = parts[1].padStart(2, "0");
        const day = parts[2].padStart(2, "0");
        return `${day}/${month}/${year}`;
      } else if (parts[2].length === 4) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2];
        return `${day}/${month}/${year}`;
      }
    }
  }

  try {
    const parsed = new Date(clean);
    if (!isNaN(parsed.getTime())) {
      const day = String(parsed.getDate()).padStart(2, "0");
      const month = String(parsed.getMonth() + 1).padStart(2, "0");
      const year = parsed.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch {
    // Ignore and fallback
  }

  return fallback;
}

/**
 * Parse any date string or timestamp into a numeric millisecond timestamp.
 * Reliably handles ISO 8601, DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD with 12h/24h timestamps.
 */
export function parseEvaluationDateToTime(raw?: any): number {
  if (!raw) return 0;
  if (typeof raw === "number") return isNaN(raw) ? 0 : raw;
  const str = String(raw).trim();
  if (
    !str ||
    str === "Recent" ||
    str === "—" ||
    str === "null" ||
    str === "undefined" ||
    str === "N/A"
  ) {
    return 0;
  }

  // 1. Direct Date parse (standard ISO 8601 strings like "2026-09-18T13:25:59.160Z")
  const direct = new Date(str).getTime();
  if (!isNaN(direct) && direct > 0) {
    return direct;
  }

  // 2. Handle DD-MM-YYYY or DD/MM/YYYY with optional time e.g. "18-09-2026 19:00:58 PM"
  const matchDmy = str.match(
    /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?(?:\s*([AP]M))?)?/i
  );
  if (matchDmy) {
    const day = parseInt(matchDmy[1], 10);
    const month = parseInt(matchDmy[2], 10) - 1;
    const year = parseInt(matchDmy[3], 10);
    let hour = matchDmy[4] ? parseInt(matchDmy[4], 10) : 0;
    const minute = matchDmy[5] ? parseInt(matchDmy[5], 10) : 0;
    const second = matchDmy[6] ? parseInt(matchDmy[6], 10) : 0;
    const ampm = matchDmy[7]?.toUpperCase();

    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    const parsed = new Date(year, month, day, hour, minute, second).getTime();
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // 3. Handle YYYY-MM-DD or YYYY/MM/DD with optional time
  const matchYmd = str.match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?(?:\s*([AP]M))?)?/i
  );
  if (matchYmd) {
    const year = parseInt(matchYmd[1], 10);
    const month = parseInt(matchYmd[2], 10) - 1;
    const day = parseInt(matchYmd[3], 10);
    let hour = matchYmd[4] ? parseInt(matchYmd[4], 10) : 0;
    const minute = matchYmd[5] ? parseInt(matchYmd[5], 10) : 0;
    const second = matchYmd[6] ? parseInt(matchYmd[6], 10) : 0;
    const ampm = matchYmd[7]?.toUpperCase();

    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    const parsed = new Date(year, month, day, hour, minute, second).getTime();
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  return 0;
}

/**
 * Accurately and unambiguously resolves the exact 5-tier grade classification of any device.
 * Tiers:
 * - "1a": Tier A (Category A / Superb / Like New / 1A / A+ / A / A-)
 * - "2a": Tier B (Category B / Very Good / 2A / B+ / B / B-)
 * - "3a": Tier C (Category C / Good / 3A / C+ / C / C-)  [Excludes "Very Good"]
 * - "4a": Tier D (Category D / Fair / 4A / D+ / D / D-)
 * - "5e": Tier E / Quarantine (Category E / Poor / Quarantine / Defect / N/A / 5E / E)
 */
export function resolveGradeTier(
  raw?: string | null,
  isPass: boolean = true
): "1a" | "2a" | "3a" | "4a" | "5e" {
  if (!raw) return isPass ? "3a" : "5e";
  const str = String(raw).trim();
  const lower = str.toLowerCase();

  if (
    !str ||
    lower === "—" ||
    lower === "-1" ||
    lower === "none" ||
    lower === "null" ||
    lower === "undefined" ||
    lower === "false"
  ) {
    return isPass ? "3a" : "5e";
  }

  // 1. Tier E / Quarantine / Defect / N/A / Damage / Poor / Category E / 5E
  if (
    lower === "n/a" ||
    lower === "na" ||
    lower.startsWith("n/a") ||
    lower.includes("category e") ||
    lower.includes("grade e") ||
    lower.includes("poor") ||
    lower.includes("quarantine") ||
    lower.includes("defect") ||
    lower.includes("damage") ||
    lower === "5e" ||
    lower.includes("5e") ||
    /(?:^|\s|\()(e[+-]?)(?:\s|\)|\.|$)/i.test(lower)
  ) {
    return "5e";
  }

  // 2. Tier A: Category A, Grade A, Superb, Like New, Pristine, Excellent, 1A, A+, A, A-
  if (
    lower.includes("category a") ||
    lower.includes("grade a") ||
    lower.includes("superb") ||
    lower.includes("like new") ||
    lower.includes("pristine") ||
    lower.includes("excellent") ||
    lower === "1a" ||
    lower.includes("1a") ||
    /(?:^|\s|\()(a[+-]?)(?:\s|\)|\.|$)/i.test(lower)
  ) {
    return "1a";
  }

  // 3. Tier B: Category B, Grade B, Very Good, VeryGood, 2A, B+, B, B-
  // (Tested BEFORE Tier C to ensure "Very Good" is never treated as "Good")
  if (
    lower.includes("category b") ||
    lower.includes("grade b") ||
    lower.includes("very good") ||
    lower.includes("verygood") ||
    lower === "2a" ||
    lower.includes("2a") ||
    /(?:^|\s|\()(b[+-]?)(?:\s|\)|\.|$)/i.test(lower)
  ) {
    return "2a";
  }

  // 4. Tier C: Category C, Grade C, Good, 3A, C+, C, C- (explicitly exclude 'very good')
  if (
    lower.includes("category c") ||
    lower.includes("grade c") ||
    (/\bgood\b/i.test(lower) && !lower.includes("very good")) ||
    lower === "3a" ||
    lower.includes("3a") ||
    /(?:^|\s|\()(c[+-]?)(?:\s|\)|\.|$)/i.test(lower)
  ) {
    return "3a";
  }

  // 5. Tier D: Category D, Grade D, Fair, 4A, D+, D, D-
  if (
    lower.includes("category d") ||
    lower.includes("grade d") ||
    lower.includes("fair") ||
    lower === "4a" ||
    lower.includes("4a") ||
    /(?:^|\s|\()(d[+-]?)(?:\s|\)|\.|$)/i.test(lower)
  ) {
    return "4a";
  }

  return isPass ? "3a" : "5e";
}

interface GradesCacheEntry {
  timestamp: number;
  data: GradedDeviceItem[];
  count1A: number;
  count2A: number;
  count3A: number;
  count4A: number;
  count5E: number;
}

const gradesMemoryCache: Record<string, GradesCacheEntry> = {};
const GRADES_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes TTL

export const gradesService = {
  /**
   * Laptop QC Grade Report with Server-Side / Live Data from /Report/Get_AddOnViewQcResultlp
   */
  getLaptopGradeReportPaginated: async (
    params?: LaptopGradeReportParams
  ): Promise<PaginatedGradeReportResponse> => {
    const user = authService.getUser();
    const userId = user?.id || 1;
    const userUid = params?.uid || user?.username || (user?.id ? String(user.id) : undefined) || "0";

    let mstRegId = 214;
    try {
      const partner = await authService.getPartnerDetail(userId);
      if (partner?.MstRegID && partner.MstRegID > 0) {
        mstRegId = partner.MstRegID;
      }
    } catch (err) {
      console.warn("Could not resolve partner registration ID for grades:", err);
    }

    try {
      const fromDateFormatted = formatToApiDate(params?.fromDate, "01/01/2021");
      const toDateFormatted = formatToApiDate(params?.toDate, "01/01/2050");
      const pageSize = params?.pageSize ?? params?.length ?? 10;
      const page = params?.page ?? (params?.start !== undefined ? Math.floor(params.start / pageSize) + 1 : 1);
      const start = params?.start ?? (page - 1) * pageSize;

      const cacheKey = `laptop_${fromDateFormatted}_${toDateFormatted}_${userUid}_${mstRegId}`;
      const cached = gradesMemoryCache[cacheKey];
      const now = Date.now();

      let allMapped: GradedDeviceItem[] = [];
      let count1A = 0;
      let count2A = 0;
      let count3A = 0;
      let count4A = 0;
      let count5E = 0;

      if (!params?.forceRefresh && cached && now - cached.timestamp < GRADES_CACHE_TTL_MS) {
        allMapped = cached.data;
        count1A = cached.count1A;
        count2A = cached.count2A;
        count3A = cached.count3A;
        count4A = cached.count4A;
        count5E = cached.count5E;
      } else {
        // Query /Report/Get_AddOnViewQcResultlp
        const res = await evaluateApi.post<{
          data?: any[];
          DATA?: any[];
          recordsTotal?: number;
          recordsFiltered?: number;
        }>(
          EVALUATE_ENDPOINTS.QC_REPORT_LAPTOP,
          {
            draw: 1,
            start: 0,
            length: 5000,
            search: { value: "" },
            FromDate: fromDateFormatted,
            ToDate: toDateFormatted,
            uid: userUid,
            status: "ALL",
            MstRWid: mstRegId.toString(),
            sfromdate: fromDateFormatted,
            stodate: toDateFormatted,
          }
        );

        const rawList = res?.DATA || res?.data || (Array.isArray(res) ? res : []);

        if (Array.isArray(rawList)) {
          rawList.forEach((item: any, idx: number) => {
            // 1. Primary QC Result comes from test_result (with fallback to QCResult)
            const rawQc = String(item.test_result || item.QCResult || "PASS").trim();
            const isPass = rawQc.toUpperCase() === "PASS" || rawQc.toUpperCase() === "PASSED" || rawQc === "1";
            const qcResult = rawQc || (isPass ? "PASS" : "FAIL");

            // 2. Grade text from API (e.g. "Good (Category C – Good)")
            const rawGrade = String(
              item.grade || item.physical_condition_category || item.test_status || ""
            ).trim();

            // 3. Resolve exact tier deterministically
            const itemTier = resolveGradeTier(rawGrade, isPass);

            // 4. Score calculation / extraction
            const rawScore = item.score !== undefined && item.score !== null ? Number(item.score) : undefined;
            let score = rawScore !== undefined && !isNaN(rawScore) ? rawScore : 0;
            if (!score) {
              if (itemTier === "1a") score = 95;
              else if (itemTier === "2a") score = 82;
              else if (itemTier === "3a") score = 68;
              else if (itemTier === "4a") score = 55;
              else score = isPass ? 60 : 42;
            }

            // 5. Determine Distribution Category Bucket
            let categoryBucket = "Grade 3A / Category C";
            if (itemTier === "1a") {
              categoryBucket = "Grade 1A / Category A";
              count1A += 1;
            } else if (itemTier === "2a") {
              categoryBucket = "Grade 2A / Category B";
              count2A += 1;
            } else if (itemTier === "3a") {
              categoryBucket = "Grade 3A / Category C";
              count3A += 1;
            } else if (itemTier === "4a") {
              categoryBucket = "Grade 4A / Category D";
              count4A += 1;
            } else {
              categoryBucket = "Grade 5E / Quarantine";
              count5E += 1;
            }

            const serial = String(item.serial_number || item.imei_1 || item.device_serial_number || item.imei || `SN-LP-${item.mstid || idx + 1}`);
            const workorderid = String(item.workorderid || `WO-LP-0${item.mstid || idx + 1}`);
            const brand = String(item.brand_name || item.device_brand || "LENOVO");
            const model = String(item.model_name || item.device_model || "Notebook PC");
            const testedAt = item.test_date_time || item.test_date_timen || (item.CreatedOn ? String(item.CreatedOn).replace("T", " ").substring(0, 19) : "Recent");

            allMapped.push({
              mstid: item.mstid || idx + 1,
              workorderid,
              imei: serial,
              serialNumber: serial,
              brand,
              model,
              device_category: item.device_category || "Notebook",
              storage: item.storage,
              score,
              grade: rawGrade,
              rawGrade,
              categoryBucket,
              physicalConditionCategory: item.physical_condition_category || rawGrade,
              qcResult,
              test_result: item.test_result,
              QCResult: item.QCResult,
              testedAt,
              testedAtN: item.test_date_timen,
              uid: item.uid || item.CreatedBy,
              act: item.act,
              serviceKey: item.ServiceKey ? String(item.ServiceKey) : undefined,
              certificateNumber: item.certificate_number ? String(item.certificate_number) : (item.ServiceKey ? String(item.ServiceKey) : `XC-LP-${item.mstid || idx + 1}`),
              Processor_Family: item.Processor_Family,
              RAM: item.RAM,
              HDD_SSD: item.HDD_SSD || item.storage,
            });
          });
        }

        // Cache the raw mapped data
        gradesMemoryCache[cacheKey] = {
          timestamp: now,
          data: allMapped,
          count1A,
          count2A,
          count3A,
          count4A,
          count5E,
        };
      }

      // Strictly sort by evaluation timestamp DESC by default (newest first)
      const sorted = allMapped.sort((a, b) => {
        const timeA = parseEvaluationDateToTime(a.testedAtN || a.testedAt || a.CreatedOn) || (Number(a.mstid) || 0);
        const timeB = parseEvaluationDateToTime(b.testedAtN || b.testedAt || b.CreatedOn) || (Number(b.mstid) || 0);
        if (timeA !== timeB) {
          return timeB - timeA;
        }
        return (Number(b.mstid) || 0) - (Number(a.mstid) || 0);
      });

      // Filter by search, grade, brand, and status
      const searchTerm = (params?.search || "").toLowerCase().trim();
      const gradeFilter = (params?.grade || "all").toLowerCase().trim();
      const brandFilter = (params?.brand || "all").toLowerCase().trim();
      const statusFilter = (params?.status || "all").toUpperCase().trim();

      const filtered = sorted.filter((d) => {
        const matchesSearch =
          !searchTerm ||
          d.serialNumber.toLowerCase().includes(searchTerm) ||
          d.imei.toLowerCase().includes(searchTerm) ||
          d.brand.toLowerCase().includes(searchTerm) ||
          d.model.toLowerCase().includes(searchTerm) ||
          d.workorderid.toLowerCase().includes(searchTerm) ||
          (d.storage && d.storage.toLowerCase().includes(searchTerm)) ||
          (d.certificateNumber && d.certificateNumber.toLowerCase().includes(searchTerm));

        let matchesBrand = true;
        if (brandFilter !== "all") {
          matchesBrand = d.brand.toLowerCase().includes(brandFilter);
        }

        const isItemPass = d.qcResult.toUpperCase() === "PASS" || d.qcResult.toUpperCase() === "PASSED";
        const itemTier = resolveGradeTier(d.rawGrade, isItemPass);

        let matchesGrade = true;
        if (gradeFilter !== "all") {
          if (gradeFilter === "1a" || gradeFilter === "a" || gradeFilter === "category a" || gradeFilter === "superb") {
            matchesGrade = itemTier === "1a";
          } else if (gradeFilter === "2a" || gradeFilter === "b" || gradeFilter === "category b" || gradeFilter === "very good") {
            matchesGrade = itemTier === "2a";
          } else if (gradeFilter === "3a" || gradeFilter === "c" || gradeFilter === "category c" || gradeFilter === "good") {
            matchesGrade = itemTier === "3a";
          } else if (gradeFilter === "4a" || gradeFilter === "d" || gradeFilter === "category d" || gradeFilter === "fair") {
            matchesGrade = itemTier === "4a";
          } else if (gradeFilter === "5e" || gradeFilter === "e" || gradeFilter === "quarantine" || gradeFilter === "category e" || gradeFilter === "poor" || gradeFilter === "fail" || gradeFilter === "na") {
            matchesGrade = itemTier === "5e";
          } else {
            matchesGrade = itemTier === gradeFilter;
          }
        }

        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter === "PASS" && isItemPass) ||
          (statusFilter === "FAIL" && !isItemPass);

        return matchesSearch && matchesBrand && matchesGrade && matchesStatus;
      });

      const totalEvaluated = allMapped.length;
      const recordsFiltered = filtered.length;
      const totalPages = Math.ceil(recordsFiltered / (pageSize || 1)) || 1;
      const paginatedSlice = filtered.slice(start, start + pageSize);

      const distribution: GradeDistributionItem[] = [
        {
          grade: "Grade 1A / Category A",
          label: "Like New / Superb",
          count: count1A,
          percentage: totalEvaluated > 0 ? Math.round((count1A / totalEvaluated) * 100) : 0,
          color: "#10B981",
          description: "Flawless screen & housing, 100% test pass, certified pristine condition",
        },
        {
          grade: "Grade 2A / Category B",
          label: "Very Good Condition",
          count: count2A,
          percentage: totalEvaluated > 0 ? Math.round((count2A / totalEvaluated) * 100) : 0,
          color: "#059669",
          description: "Minor hairline micro-scratches, 100% functional test pass",
        },
        {
          grade: "Grade 3A / Category C",
          label: "Good / Standard Condition",
          count: count3A,
          percentage: totalEvaluated > 0 ? Math.round((count3A / totalEvaluated) * 100) : 0,
          color: "#0052CC",
          description: "Visible normal commercial wear on chassis, 100% functional components",
        },
        {
          grade: "Grade 4A / Category D",
          label: "Fair / Moderate Wear",
          count: count4A,
          percentage: totalEvaluated > 0 ? Math.round((count4A / totalEvaluated) * 100) : 0,
          color: "#D97706",
          description: "Noticeable cosmetic dings or keyboard wear without hardware failure",
        },
        {
          grade: "Grade 5E / Quarantine",
          label: "Quarantined / Defect / Fail",
          count: count5E,
          percentage: totalEvaluated > 0 ? Math.round((count5E / totalEvaluated) * 100) : 0,
          color: "#E11D48",
          description: "Component fault, battery replacement, failed QC or quarantined for repair",
        },
      ];

      return {
        distribution,
        devices: paginatedSlice,
        totalEvaluated,
        recordsFiltered,
        page,
        pageSize,
        totalPages,
      };
    } catch (err: any) {
      console.warn("Live laptop grade report error:", err);
      throw err;
    }
  },

  /**
   * Mobile QC Grade Report with Server-Side / Live Data from /Report/Get_AddOnViewQcResult
   * Strictly uses Mobile QC condition evaluation logic (physical_condition_category || grade || test_status)
   */
  getMobileGradeReportPaginated: async (
    params?: MobileGradeReportParams
  ): Promise<PaginatedGradeReportResponse> => {
    const user = authService.getUser();
    const userId = user?.id || 1;
    const userUid = params?.uid || user?.username || (user?.id ? String(user.id) : undefined) || "0";

    let mstRegId = 214;
    try {
      const partner = await authService.getPartnerDetail(userId);
      if (partner?.MstRegID && partner.MstRegID > 0) {
        mstRegId = partner.MstRegID;
      }
    } catch (err) {
      console.warn("Could not resolve partner registration ID for mobile grades:", err);
    }

    try {
      const fromDateFormatted = formatToApiDate(params?.fromDate, "01/01/2021");
      const toDateFormatted = formatToApiDate(params?.toDate, "01/01/2050");
      const pageSize = params?.pageSize ?? params?.length ?? 10;
      const page = params?.page ?? (params?.start !== undefined ? Math.floor(params.start / pageSize) + 1 : 1);
      const start = params?.start ?? (page - 1) * pageSize;

      const cacheKey = `mobile_${fromDateFormatted}_${toDateFormatted}_${userUid}_${mstRegId}`;
      const cached = gradesMemoryCache[cacheKey];
      const now = Date.now();

      let allMapped: GradedDeviceItem[] = [];
      let count1A = 0;
      let count2A = 0;
      let count3A = 0;
      let count4A = 0;
      let count5E = 0;

      if (!params?.forceRefresh && cached && now - cached.timestamp < GRADES_CACHE_TTL_MS) {
        allMapped = cached.data;
        count1A = cached.count1A;
        count2A = cached.count2A;
        count3A = cached.count3A;
        count4A = cached.count4A;
        count5E = cached.count5E;
      } else {
        // Query /Report/Get_AddOnViewQcResult via local API proxy
        const res = await evaluateApi.post<{
          data?: any[];
          DATA?: any[];
          recordsTotal?: number;
          recordsFiltered?: number;
        }>(
          EVALUATE_ENDPOINTS.QC_REPORT_MOBILE,
          {
            draw: 1,
            start: 0,
            length: 5000,
            search: { value: "" },
            FromDate: fromDateFormatted,
            ToDate: toDateFormatted,
            uid: userUid,
            status: "ALL",
            MstRWid: mstRegId.toString(),
            sfromdate: fromDateFormatted,
            stodate: toDateFormatted,
          }
        );

        const rawList = res?.data || res?.DATA || (Array.isArray(res) ? res : []);

        if (Array.isArray(rawList)) {
          rawList.forEach((item: any, idx: number) => {
            // 1. Primary QC Result comes from test_result (with fallback to QCResult / Battery)
            const rawQc = String(item.test_result || item.QCResult || item.test_status || "").trim();
            const normalized = rawQc.toUpperCase();
            const isPass =
              normalized === "PASS" ||
              normalized === "PASSED" ||
              normalized === "SUCCESS" ||
              normalized === "OK" ||
              String(item.Battery) === "1" ||
              item.BatterytestStatus === "1" ||
              item.BatterytestStatus === "PASS";
            const qcResult = rawQc || (isPass ? "PASS" : "FAIL");

            // 2. Condition / Grade resolution strictly matching Mobile QC report
            const rawCondition = String(
              item.physical_condition_category || item.grade || item.Grade || item.test_status || ""
            ).trim();
            const rawGrade = rawCondition;

            // 3. Resolve exact tier deterministically
            const itemTier = resolveGradeTier(rawGrade, isPass);

            // 4. Category Bucketing
            let categoryBucket = "Grade 3A / Category C";
            if (itemTier === "1a") {
              categoryBucket = "Grade 1A / Category A";
              count1A += 1;
            } else if (itemTier === "2a") {
              categoryBucket = "Grade 2A / Category B";
              count2A += 1;
            } else if (itemTier === "3a") {
              categoryBucket = "Grade 3A / Category C";
              count3A += 1;
            } else if (itemTier === "4a") {
              categoryBucket = "Grade 4A / Category D";
              count4A += 1;
            } else {
              categoryBucket = "Grade 5E / Quarantine";
              count5E += 1;
            }

            // 5. Score calculation
            const rawScore = Number(item.score || String(item.Health_Parcent || "").replace(/[^0-9]/g, ""));
            const score = !isNaN(rawScore) && rawScore > 0 ? rawScore : (isPass ? 90 : 45);

            const serial = String(
              item.imei_1 ||
                item.IMEI ||
                item.serial_number ||
                item.device_serial_number ||
                item.imei ||
                `IMEI-${item.mstid || idx + 1}`
            );
            const workorderid = String(item.workorderid || `WO-MB-0${item.mstid || idx + 1}`);
            const brand = String(item.brand_name || item.device_brand || "Mobile");
            const model = String(item.model_name || item.device_model || "");
            const testedAt =
              item.test_date_time ||
              item.test_datetime ||
              item.test_date_timen ||
              (item.CreatedOn ? String(item.CreatedOn).replace("T", " ").substring(0, 19) : "Recent");

            allMapped.push({
              mstid: item.mstid || idx + 1,
              workorderid,
              imei: serial,
              serialNumber: serial,
              brand,
              model,
              device_category: item.device_category || "Mobile",
              storage: item.storage,
              score,
              grade: rawGrade,
              rawGrade,
              categoryBucket,
              physicalConditionCategory: item.physical_condition_category || rawGrade,
              qcResult,
              test_result: item.test_result,
              QCResult: item.QCResult,
              testedAt,
              testedAtN: item.test_date_timen || item.CreatedOn,
              uid: item.uid || item.CreatedBy || item.createdBy,
              serviceKey: item.ServiceKey ? String(item.ServiceKey) : undefined,
              certificateNumber: item.certificate_number
                ? String(item.certificate_number)
                : item.ServiceKey
                ? String(item.ServiceKey)
                : `XC-MB-${item.mstid || idx + 1}`,
              battery_capacity: item.battery_capacity,
              Health_Parcent: item.Health_Parcent,
            });
          });
        }

        // Cache the raw mapped data
        gradesMemoryCache[cacheKey] = {
          timestamp: now,
          data: allMapped,
          count1A,
          count2A,
          count3A,
          count4A,
          count5E,
        };
      }

      // Strictly sort by evaluation timestamp DESC by default (newest first)
      const sorted = allMapped.sort((a, b) => {
        const timeA = parseEvaluationDateToTime(a.testedAtN || a.testedAt || a.CreatedOn) || (Number(a.mstid) || 0);
        const timeB = parseEvaluationDateToTime(b.testedAtN || b.testedAt || b.CreatedOn) || (Number(b.mstid) || 0);
        if (timeA !== timeB) {
          return timeB - timeA;
        }
        return (Number(b.mstid) || 0) - (Number(a.mstid) || 0);
      });

      // Filter by search, grade, brand, and status
      const searchTerm = (params?.search || "").toLowerCase().trim();
      const gradeFilter = (params?.grade || "all").toLowerCase().trim();
      const brandFilter = (params?.brand || "all").toLowerCase().trim();
      const statusFilter = (params?.status || "all").toUpperCase().trim();

      const filtered = sorted.filter((d) => {
        const matchesSearch =
          !searchTerm ||
          d.serialNumber.toLowerCase().includes(searchTerm) ||
          d.imei.toLowerCase().includes(searchTerm) ||
          d.brand.toLowerCase().includes(searchTerm) ||
          d.model.toLowerCase().includes(searchTerm) ||
          d.workorderid.toLowerCase().includes(searchTerm) ||
          (d.storage && d.storage.toLowerCase().includes(searchTerm)) ||
          (d.certificateNumber && d.certificateNumber.toLowerCase().includes(searchTerm));

        let matchesBrand = true;
        if (brandFilter !== "all") {
          matchesBrand = d.brand.toLowerCase().includes(brandFilter);
        }

        const isItemPass = d.qcResult.toUpperCase() === "PASS" || d.qcResult.toUpperCase() === "PASSED";
        const itemTier = resolveGradeTier(d.rawGrade, isItemPass);

        let matchesGrade = true;
        if (gradeFilter !== "all") {
          if (gradeFilter === "1a" || gradeFilter === "a" || gradeFilter === "category a" || gradeFilter === "superb") {
            matchesGrade = itemTier === "1a";
          } else if (gradeFilter === "2a" || gradeFilter === "b" || gradeFilter === "category b" || gradeFilter === "very good") {
            matchesGrade = itemTier === "2a";
          } else if (gradeFilter === "3a" || gradeFilter === "c" || gradeFilter === "category c" || gradeFilter === "good") {
            matchesGrade = itemTier === "3a";
          } else if (gradeFilter === "4a" || gradeFilter === "d" || gradeFilter === "category d" || gradeFilter === "fair") {
            matchesGrade = itemTier === "4a";
          } else if (gradeFilter === "5e" || gradeFilter === "e" || gradeFilter === "quarantine" || gradeFilter === "category e" || gradeFilter === "poor" || gradeFilter === "fail" || gradeFilter === "na") {
            matchesGrade = itemTier === "5e";
          } else {
            matchesGrade = itemTier === gradeFilter;
          }
        }

        const matchesStatus =
          statusFilter === "ALL" ||
          (statusFilter === "PASS" && isItemPass) ||
          (statusFilter === "FAIL" && !isItemPass);

        return matchesSearch && matchesBrand && matchesGrade && matchesStatus;
      });

      const totalEvaluated = allMapped.length;
      const recordsFiltered = filtered.length;
      const totalPages = Math.ceil(recordsFiltered / (pageSize || 1)) || 1;
      const paginatedSlice = filtered.slice(start, start + pageSize);

      const distribution: GradeDistributionItem[] = [
        {
          grade: "Grade 1A / Category A",
          label: "Like New / Superb",
          count: count1A,
          percentage: totalEvaluated > 0 ? Math.round((count1A / totalEvaluated) * 100) : 0,
          color: "#10B981",
          description: "Pristine cosmetic condition, 100% test pass, zero flaws",
        },
        {
          grade: "Grade 2A / Category B",
          label: "Very Good Condition",
          count: count2A,
          percentage: totalEvaluated > 0 ? Math.round((count2A / totalEvaluated) * 100) : 0,
          color: "#059669",
          description: "Minor hairline micro-scratches on casing, pristine screen, 100% test pass",
        },
        {
          grade: "Grade 3A / Category C",
          label: "Good / Standard Condition",
          count: count3A,
          percentage: totalEvaluated > 0 ? Math.round((count3A / totalEvaluated) * 100) : 0,
          color: "#0052CC",
          description: "Visible standard commercial wear, fully operational hardware & sensors",
        },
        {
          grade: "Grade 4A / Category D",
          label: "Fair / Cosmetic Wear",
          count: count4A,
          percentage: totalEvaluated > 0 ? Math.round((count4A / totalEvaluated) * 100) : 0,
          color: "#D97706",
          description: "Moderate body scuffs or dings, passed primary device diagnostics",
        },
        {
          grade: "Grade 5E / Quarantine",
          label: "Quarantined / Defect / Fail",
          count: count5E,
          percentage: totalEvaluated > 0 ? Math.round((count5E / totalEvaluated) * 100) : 0,
          color: "#E11D48",
          description: "Hardware defect, battery failure, or quarantined for board rework",
        },
      ];

      return {
        distribution,
        devices: paginatedSlice,
        totalEvaluated,
        recordsFiltered,
        page,
        pageSize,
        totalPages,
      };
    } catch (err: any) {
      console.warn("Live mobile grade report error:", err);
      throw err;
    }
  },

  /**
   * Generic Grade Report (Dispatches to category-specific live paginated handlers)
   */
  getGradeReport: async (category: "Accessories" | "Laptop" | "Mobile"): Promise<GradeReportResponse> => {
    if (category === "Laptop") {
      const res = await gradesService.getLaptopGradeReportPaginated({ pageSize: 50 });
      return {
        distribution: res.distribution,
        devices: res.devices,
        totalEvaluated: res.totalEvaluated,
      };
    }

    if (category === "Mobile") {
      const res = await gradesService.getMobileGradeReportPaginated({ pageSize: 50 });
      return {
        distribution: res.distribution,
        devices: res.devices,
        totalEvaluated: res.totalEvaluated,
      };
    }

    const user = authService.getUser();
    const userId = user?.id || 1;

    let mstRegId = 214;
    try {
      const partner = await authService.getPartnerDetail(userId);
      if (partner?.MstRegID) {
        mstRegId = partner.MstRegID;
      }
    } catch (err) {
      console.warn("Could not resolve partner registration ID for grades:", err);
    }

    try {
      const res = await evaluateApi.post<{ DATA?: any[] }>(
        EVALUATE_ENDPOINTS.QC_REPORT_LIST,
        {
          MstRWid: mstRegId.toString(),
          sfromdate: "01/01/2021",
          stodate: "01/01/2050",
        }
      );

      const rawList = res?.DATA || (Array.isArray(res) ? res : []);
      if (Array.isArray(rawList) && rawList.length > 0) {
        const gradedDevices: GradedDeviceItem[] = [];
        let count1A = 0;
        let count2A = 0;
        let count3A = 0;
        let count5E = 0;

        rawList.forEach((item: any) => {
          const score = Number(item.score) || (item.Battery === "1" ? 85 : 45);
          const isPass = item.QCResult === "PASS" || item.Battery === "1";

          let grade = "Grade 1A";
          if (!isPass || score < 50) {
            grade = "Grade 5E / Quarantine";
            count5E += 1;
          } else if (score >= 80) {
            grade = "Grade 1A";
            count1A += 1;
          } else if (score >= 65) {
            grade = "Grade 2A";
            count2A += 1;
          } else {
            grade = "Grade 3A";
            count3A += 1;
          }

          const serial = String(item.imei_1 || item.serial_number || item.ServiceKey || item.mstid);

          gradedDevices.push({
            mstid: Number(item.mstid) || 0,
            workorderid: String(item.workorderid || "WO-QC-MAIN"),
            imei: serial,
            serialNumber: serial,
            brand: String(item.brand_name || item.device_brand || "Generic"),
            model: String(item.model_name || item.device_model || "Device Model"),
            score,
            grade,
            rawGrade: grade,
            categoryBucket: grade,
            qcResult: isPass ? "Pass" : "Fail",
            testedAt: item.CreatedOn ? String(item.CreatedOn).replace("T", " ").substring(0, 16) : "Recent",
            serviceKey: item.ServiceKey || undefined,
          });
        });

        const total = rawList.length;
        const distribution: GradeDistributionItem[] = [
          {
            grade: "Grade 1A",
            label: "Like New / Pristine",
            count: count1A,
            percentage: total > 0 ? Math.round((count1A / total) * 100) : 0,
            color: "#00875A",
            description: "Zero micro-scratches, 100% test pass, factory battery health (>80%)",
          },
          {
            grade: "Grade 2A",
            label: "Very Good Condition",
            count: count2A,
            percentage: total > 0 ? Math.round((count2A / total) * 100) : 0,
            color: "#0052CC",
            description: "Minor cosmetic hairline, 100% functional sensor & circuit pass",
          },
          {
            grade: "Grade 3A",
            label: "Good / Standard Refurbished",
            count: count3A,
            percentage: total > 0 ? Math.round((count3A / total) * 100) : 0,
            color: "#8A5600",
            description: "Visible minor wear on bezel, full functional reliability certified",
          },
          {
            grade: "Grade 5E / Quarantine",
            label: "Defect Identified / Rework",
            count: count5E,
            percentage: total > 0 ? Math.round((count5E / total) * 100) : 0,
            color: "#C7300A",
            description: "Hardware component replacement required",
          },
        ];

        return {
          distribution,
          devices: gradedDevices,
          totalEvaluated: total,
        };
      }
    } catch (err: any) {
      console.warn(`Live grade report error for ${category}:`, err);
      throw err;
    }

    return {
      distribution: [
        { grade: "Grade 1A", label: "Like New / Pristine", count: 0, percentage: 0, color: "#00875A", description: "Zero micro-scratches" },
        { grade: "Grade 2A", label: "Very Good Condition", count: 0, percentage: 0, color: "#0052CC", description: "Minor cosmetic hairline" },
        { grade: "Grade 3A", label: "Good / Standard Refurbished", count: 0, percentage: 0, color: "#8A5600", description: "Visible minor wear on bezel" },
        { grade: "Grade 5E / Quarantine", label: "Defect Identified / Rework", count: 0, percentage: 0, color: "#C7300A", description: "Hardware component replacement required" },
      ],
      devices: [],
      totalEvaluated: 0,
    };
  },

  getGradeDistribution: async (category: "Accessories" | "Laptop" | "Mobile"): Promise<GradeDistributionItem[]> => {
    const res = await gradesService.getGradeReport(category);
    return res.distribution;
  },
};
