"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Laptop,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ExternalLink,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  FileText,
  Eye,
  Printer,
  Calendar,
} from "lucide-react";
import { reportsService } from "../services";
import { LaptopQCReportItem } from "../types";
import { getFriendlyErrorMessage } from "../../core";
import { ReportsPagination } from "../ReportsPagination";
import LaptopQcDetailModal from "./_components/LaptopQcDetailModal";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { exportToExcel, ExcelColumn } from "@/lib/excel-export";
import DateRangeExcelExportModal from "@/components/ui/DateRangeExcelExportModal";
import DateRangeFilter from "@/components/ui/DateRangeFilter";

type SortField = "date" | "brand" | "model" | "serial" | "workorder" | "condition" | "status";
type SortOrder = "asc" | "desc";

export function formatConditionCategory(raw?: string | number | boolean | null): string {
  if (raw === undefined || raw === null || raw === false) return "—";
  let str = String(raw).trim();
  const lower = str.toLowerCase();
  if (
    !str ||
    str === "—" ||
    str === "-1" ||
    lower === "false" ||
    lower === "null" ||
    lower === "undefined" ||
    lower === "none"
  ) {
    return "—";
  }

  // Format: "Good (Category C – Good)" / "Good (Category C)" -> "Good(C)"
  str = str.replace(/\s*\(\s*Category\s+([A-Za-z0-9+\-]+)(?:\s*[\u2013\u2014\-–—]\s*[^)]*)?\s*\)/gi, "($1)");
  str = str.replace(/\s+\(([A-Za-z0-9+\-]+)\)/g, "($1)");

  return str;
}

export function formatStorageClean(raw?: string | null): string {
  if (!raw || raw === "—" || raw.toLowerCase() === "none" || raw.toLowerCase() === "null") return "—";
  const str = String(raw).trim();
  const sizeMatch = str.match(/^([\d.]+)\s*(GB|TB)/i);
  const typeMatch = str.match(/(NVMe|SATA|RAID|ATA|SSD|HDD)/i);
  if (sizeMatch) {
    const size = Math.round(parseFloat(sizeMatch[1]));
    const unit = sizeMatch[2].toUpperCase();
    const type = typeMatch ? typeMatch[1].toUpperCase() : "SSD";
    return `${size} ${unit} ${type}`;
  }
  return str;
}

export function getConditionBadgeStyle(rawCondition?: string | number | boolean | null): {
  badgeStyle: string;
  isMissing: boolean;
  formatted: string;
} {
  if (rawCondition === undefined || rawCondition === null || rawCondition === false) {
    return { badgeStyle: "", isMissing: true, formatted: "—" };
  }

  const str = String(rawCondition).trim();
  const lower = str.toLowerCase();

  if (
    !str ||
    str === "—" ||
    str === "-1" ||
    lower === "false" ||
    lower === "null" ||
    lower === "undefined" ||
    lower === "none"
  ) {
    return { badgeStyle: "", isMissing: true, formatted: "—" };
  }

  const formatted = formatConditionCategory(str);
  const cleanLower = formatted.toLowerCase();

  // Red for N/A and E (+ / -)
  const isRed =
    cleanLower === "n/a" ||
    cleanLower === "na" ||
    cleanLower === "n / a" ||
    cleanLower.startsWith("n/a") ||
    /\b(category\s*e|grade\s*e|poor|damage|quarantine|5e)\b/i.test(cleanLower) ||
    /(?:^|\s|\()(e\s*[+-]?)(?:\s|\)|\.|$)/i.test(cleanLower);

  if (isRed) {
    return {
      badgeStyle: "bg-rose-50 text-rose-700 border border-rose-200",
      isMissing: false,
      formatted,
    };
  }

  // Green for A and B (+ / -)
  const isGreen =
    /\b(category\s*[ab]|grade\s*[ab]|superb|excellent|very\s*good|1a|2a)\b/i.test(cleanLower) ||
    /(?:^|\s|\()([ab]\s*[+-]?)(?:\s|\)|\.|$)/i.test(cleanLower);

  if (isGreen) {
    return {
      badgeStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      isMissing: false,
      formatted,
    };
  }

  // Blue for C (+ / -)
  const isBlue =
    /\b(category\s*c|grade\s*c|good|3a)\b/i.test(cleanLower) ||
    /(?:^|\s|\()(c\s*[+-]?)(?:\s|\)|\.|$)/i.test(cleanLower);

  if (isBlue) {
    return {
      badgeStyle: "bg-blue-50 text-[#0052CC] border border-blue-200",
      isMissing: false,
      formatted,
    };
  }

  // Yellow for D (+ / -)
  const isYellow =
    /\b(category\s*d|grade\s*d|fair|4a)\b/i.test(cleanLower) ||
    /(?:^|\s|\()(d\s*[+-]?)(?:\s|\)|\.|$)/i.test(cleanLower);

  if (isYellow) {
    return {
      badgeStyle: "bg-amber-50 text-amber-700 border border-amber-200",
      isMissing: false,
      formatted,
    };
  }

  return {
    badgeStyle: "bg-slate-100 text-slate-700 border border-slate-200",
    isMissing: false,
    formatted,
  };
}

export function getGradeRank(raw?: string | number | boolean | null): number {
  if (raw === undefined || raw === null || raw === false) return 999;
  const str = String(raw).trim().toLowerCase();
  if (
    !str ||
    str === "—" ||
    str === "-1" ||
    str === "none" ||
    str === "null" ||
    str === "undefined" ||
    str === "false"
  ) {
    return 999;
  }
  if (str === "n/a" || str === "na" || str.startsWith("n/a")) return 990;

  // Grade A (+, regular, -)
  if (str === "a+" || str === "a +" || str.includes("like new") || str.includes("pristine")) return 10;
  if (str === "a" || str.includes("category a") || str.includes("grade a") || str.includes("superb") || str.includes("excellent") || str.includes("1a")) return 11;
  if (str === "a-" || str === "a -") return 12;

  // Grade B (+, regular, -)
  if (str === "b+" || str === "b +") return 20;
  if (str === "b" || str.includes("category b") || str.includes("grade b") || str.includes("very good") || str.includes("2a")) return 21;
  if (str === "b-" || str === "b -") return 22;

  // Grade C (+, regular, -)
  if (str === "c+" || str === "c +") return 30;
  if (str === "c" || str.includes("category c") || str.includes("grade c") || str.includes("good") || str.includes("3a")) return 31;
  if (str === "c-" || str === "c -") return 32;

  // Grade D (+, regular, -)
  if (str === "d+" || str === "d +") return 40;
  if (str === "d" || str.includes("category d") || str.includes("grade d") || str.includes("fair") || str.includes("4a")) return 41;
  if (str === "d-" || str === "d -") return 42;

  // Grade E (+, regular, -)
  if (str === "e+" || str === "e +") return 50;
  if (str === "e" || str.includes("category e") || str.includes("grade e") || str.includes("poor") || str.includes("damage") || str.includes("quarantine") || str.includes("5e")) return 51;
  if (str === "e-" || str === "e -") return 52;

  return 100;
}

export function renderDeviceConditionBadge(rawCondition?: string | number | boolean | null) {
  const { badgeStyle, isMissing, formatted } = getConditionBadgeStyle(rawCondition);

  if (isMissing) {
    return <span className="text-slate-400 font-mono text-[11px]">—</span>;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[11px] ${badgeStyle}`}>
      {formatted}
    </span>
  );
}

const laptopExcelColumns: ExcelColumn[] = [
  { key: "certificate_number", header: "Certificate Number" },
  { key: "workorderid", header: "Work Order ID" },
  { key: "device_brand", header: "Brand" },
  { key: "device_model", header: "Model" },
  { key: "device_serial_number", header: "Serial Number" },
  { key: "physical_condition_category", header: "Condition Grade" },
  { key: "HDD_SSD", header: "Storage" },
  { key: "RAM", header: "RAM" },
  { key: "Processor_Family", header: "Processor" },
  { key: "B_BatteryHealth", header: "Battery Health" },
  { key: "test_result", header: "QC Result" },
  { key: "test_date_time", header: "Evaluation Date" },
];

export default function LaptopQCReportPage() {
  const [reports, setReports] = useState<LaptopQCReportItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Date Range Excel Export Modal state
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);

  // Debounced filters to prevent spamming API requests
  const debouncedSearch = useDebounce(search, 350);
  const debouncedFromDate = useDebounce(fromDate, 400);
  const debouncedToDate = useDebounce(toDate, 400);

  // On-demand detail modal state
  const [selectedDetailId, setSelectedDetailId] = useState<string | number | null>(null);
  const [selectedDetailItem, setSelectedDetailItem] = useState<LaptopQCReportItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpenDetail = (item: LaptopQCReportItem) => {
    const targetId = item.mstid || item.serial_number || item.imei_1 || item.device_serial_number || item.ServiceKey || null;
    setSelectedDetailId(targetId);
    setSelectedDetailItem(item);
    setIsDetailModalOpen(true);
  };

  // Dynamic Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting State - default sort by date DESC
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Track latest request ID to prevent race conditions
  const requestIdRef = useRef(0);

  const loadReports = async () => {
    const currentReqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const res = await reportsService.getLaptopReportsPaginated({
        fromDate: debouncedFromDate,
        toDate: debouncedToDate,
        search: debouncedSearch,
        page,
        pageSize,
        status: statusFilter === "all" ? "ALL" : statusFilter.toUpperCase(),
      });

      if (currentReqId === requestIdRef.current) {
        setReports(res.data);
        const resolvedTotal = res.recordsFiltered || res.recordsTotal || res.data.length;
        setTotalRecords(resolvedTotal);
        setTotalPages(res.totalPages || Math.ceil(resolvedTotal / (pageSize || 1)) || 1);
      }
    } catch (err: any) {
      if (currentReqId === requestIdRef.current) {
        console.error("Failed to load laptop reports:", err);
        setError(getFriendlyErrorMessage(err, "Unable to load laptop QC reports. Please check your network connection."));
      }
    } finally {
      if (currentReqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadReports();
  }, [page, pageSize, statusFilter, debouncedFromDate, debouncedToDate, debouncedSearch]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "date" ? "desc" : "asc");
    }
  };

  // Sort and filter data (Zero Deduplication: all records preserved)
  const sortedReports = useMemo(() => {
    const items = [...reports];
    return items.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        const dateA = a.test_date_time || a.CreatedOn ? new Date(a.test_date_time || a.CreatedOn || "").getTime() : (a.mstid || 0);
        const dateB = b.test_date_time || b.CreatedOn ? new Date(b.test_date_time || b.CreatedOn || "").getTime() : (b.mstid || 0);
        comparison = dateA - dateB;
      } else if (sortField === "brand") {
        comparison = (a.device_brand || a.brand_name || "").localeCompare(b.device_brand || b.brand_name || "");
      } else if (sortField === "model") {
        comparison = (a.device_model || a.model_name || "").localeCompare(b.device_model || b.model_name || "");
      } else if (sortField === "serial") {
        comparison = (a.device_serial_number || a.serial_number || a.imei_1 || "").localeCompare(b.device_serial_number || b.serial_number || b.imei_1 || "");
      } else if (sortField === "workorder") {
        comparison = (a.workorderid || "").localeCompare(b.workorderid || "");
      } else if (sortField === "condition") {
        const rankA = getGradeRank(a.physical_condition_category || a.test_status);
        const rankB = getGradeRank(b.physical_condition_category || b.test_status);
        if (rankA !== rankB) {
          comparison = rankA - rankB;
        } else {
          comparison = (a.physical_condition_category || a.test_status || "").localeCompare(b.physical_condition_category || b.test_status || "");
        }
      } else if (sortField === "status") {
        const isPassA = (a.test_result || a.QCResult || "").toLowerCase() === "pass";
        const isPassB = (b.test_result || b.QCResult || "").toLowerCase() === "pass";
        comparison = (isPassA === isPassB ? 0 : isPassA ? 1 : -1);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [reports, sortField, sortOrder]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 ml-1 inline" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#0052CC] ml-1 inline" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#0052CC] ml-1 inline" />
    );
  };

  const handleExportCurrentExcel = () => {
    const rows = sortedReports.map((r) => ({
      certificate_number: r.certificate_number || `XC-LP-${r.mstid}`,
      workorderid: r.workorderid || "—",
      device_brand: r.device_brand || r.brand_name || "—",
      device_model: r.device_model || r.model_name || "—",
      device_serial_number: r.device_serial_number || r.serial_number || r.imei_1 || "—",
      physical_condition_category: formatConditionCategory(r.physical_condition_category || r.test_status),
      HDD_SSD: formatStorageClean(r.HDD_SSD || r.storage),
      RAM: r.RAM || "—",
      Processor_Family: r.Processor_Family || "—",
      B_BatteryHealth: r.B_BatteryHealth || "—",
      test_result: r.test_result || r.QCResult || "—",
      test_date_time: r.test_date_time || r.CreatedOn || "—",
    }));

    exportToExcel({
      filename: `Laptop_QC_Report_${fromDate}_to_${toDate}.xlsx`,
      sheetName: "Laptop QC",
      columns: laptopExcelColumns,
      rows,
      title: `Laptop & Notebooks QC Report (${fromDate} to ${toDate})`,
    });
  };

  const handleFetchDateRangeData = async (startD: string, endD: string) => {
    const res = await reportsService.getLaptopReportsPaginated({
      fromDate: startD || undefined,
      toDate: endD || undefined,
      pageSize: 100000,
      search: debouncedSearch,
      status: statusFilter === "all" ? "ALL" : statusFilter.toUpperCase(),
    });

    return res.data.map((r) => ({
      certificate_number: r.certificate_number || `XC-LP-${r.mstid}`,
      workorderid: r.workorderid || "—",
      device_brand: r.device_brand || r.brand_name || "—",
      device_model: r.device_model || r.model_name || "—",
      device_serial_number: r.device_serial_number || r.serial_number || r.imei_1 || "—",
      physical_condition_category: formatConditionCategory(r.physical_condition_category || r.test_status),
      HDD_SSD: formatStorageClean(r.HDD_SSD || r.storage),
      RAM: r.RAM || "—",
      Processor_Family: r.Processor_Family || "—",
      B_BatteryHealth: r.B_BatteryHealth || "—",
      test_result: r.test_result || r.QCResult || "—",
      test_date_time: r.test_date_time || r.CreatedOn || "—",
    }));
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
            <Laptop className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-display text-[#17284D]">
                QC Report (Laptop & Notebooks)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052CC] font-mono text-[11px] font-bold">
                {totalRecords.toLocaleString()} Verified Records
              </span>
            </div>
            <p className="text-xs text-[#5F6A86]">
              34-Point automated hardware diagnostics, stress tests, component verification, and QC certificates.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={loadReports}
            className="p-2 rounded-xl bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] transition-colors cursor-pointer"
            title="Refresh reports"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0052CC]" : ""}`} />
          </button>

          {/* Unified Export Data Button */}
          <button
            onClick={() => setIsDateRangeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
            title="Export diagnostic data to Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Debounced Search, Date Filter Popover, and Status */}
      <div className="bg-white rounded-2xl p-4 border border-[#DDE4F3] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Serial Number, Model, Brand, Certificate..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F6FB] border border-[#DDE4F3] rounded-xl text-xs text-[#17284D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-[#F4F6FB] p-1 rounded-xl border border-[#DDE4F3]">
            {["all", "pass", "fail"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-[#0052CC] text-white shadow-xs"
                    : "text-[#5F6A86] hover:text-[#17284D]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Premium Date Range Filter Popover */}
          <DateRangeFilter
            fromDate={fromDate}
            toDate={toDate}
            onChange={({ fromDate: newFrom, toDate: newTo }) => {
              setFromDate(newFrom);
              setToDate(newTo);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-2xl border border-[#DDE4F3] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#0052CC]" />
            <p className="text-xs font-medium text-[#5F6A86]">Loading Laptop QC diagnostic reports...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-[#17284D]">{error}</p>
            <button
              onClick={loadReports}
              className="px-4 py-2 bg-[#0052CC] text-white text-xs font-bold rounded-xl hover:bg-[#003D99] transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#DDE4F3] text-[#5F6A86] font-semibold select-none">
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("workorder")}
                    >
                      Cert / Work Order {renderSortIcon("workorder")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("serial")}
                    >
                      Serial Number {renderSortIcon("serial")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("brand")}
                    >
                      Device Brand / Model {renderSortIcon("brand")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("condition")}
                    >
                      Device Condition {renderSortIcon("condition")}
                    </th>
                    <th className="py-3 px-4">Storage</th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      QC Result {renderSortIcon("status")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("date")}
                    >
                      Tested Date {renderSortIcon("date")}
                    </th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE4F3]">
                  {sortedReports.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-xs text-[#5F6A86]">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Laptop className="w-8 h-8 text-slate-300" />
                          <p className="font-semibold text-slate-600">No laptop QC records found</p>
                          <p className="text-[11px] text-slate-400">Try adjusting your search or date range filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedReports.map((item, idx) => {
                      const rawResult = (item.test_result || item.QCResult || "").trim();
                      const normalized = rawResult.toUpperCase();
                      const isPass = normalized === "PASS" || normalized === "PASSED";
                      const isFail = normalized === "FAIL" || normalized === "FAILED" || normalized === "TEST INCOMPLETE" || normalized.includes("FAIL");
                      const displayResult = rawResult || "Not Tested";

                      return (
                        <tr
                          key={`row-${item.mstid || "rec"}-${item.ServiceKey || item.certificate_number || idx}-${idx}`}
                          className="hover:bg-[#F4F6FB]/50 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-bold text-[#17284D]">
                            <div>{item.workorderid || item.certificate_number || item.ServiceKey || `XC-LP-${item.mstid || idx}`}</div>
                            {item.certificate_number && item.workorderid && (
                              <div className="text-[10px] text-slate-400 font-mono">{item.certificate_number}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#17284D]">
                            <Link
                              href={`/gadgetiq/reports/laptop/${item.mstid || item.serial_number || item.imei_1}?servicekey=${item.ServiceKey || ""}&serial=${item.device_serial_number || item.serial_number || item.imei_1 || ""}`}
                              onClick={() => {
                                if (typeof window !== "undefined") {
                                  sessionStorage.setItem("selected_laptop_report", JSON.stringify(item));
                                }
                              }}
                              className="font-bold text-[#0052CC] hover:text-[#003D99] hover:underline cursor-pointer text-left block"
                              title="Click to view full hardware telemetry and specs"
                            >
                              {item.serial_number || item.device_serial_number || item.imei_1 || "N/A"}
                            </Link>
                            {item.MacAddress && (
                              <div className="text-[10px] text-slate-400">MAC: {item.MacAddress}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#17284D]">{item.brand_name || item.device_brand || "N/A"}</div>
                            <div className="text-[11px] text-slate-500">{item.model_name || item.device_model || ""}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            {renderDeviceConditionBadge(item.physical_condition_category || item.test_status)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-700 font-semibold text-xs">{formatStorageClean(item.storage || item.HDD_SSD) || "—"}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                                isPass
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : isFail
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {isPass ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : isFail ? (
                                <XCircle className="w-3 h-3 text-rose-600" />
                              ) : (
                                <MinusCircle className="w-3 h-3 text-slate-400" />
                              )}
                              <span>{displayResult}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                            {item.test_date_time || item.CreatedOn || "Recent"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center space-x-1.5 justify-end">
                              <Link
                                href={`/gadgetiq/reports/laptop/${item.mstid || item.serial_number || item.imei_1}?servicekey=${item.ServiceKey || ""}&serial=${item.device_serial_number || item.serial_number || item.imei_1 || ""}`}
                                onClick={() => {
                                  if (typeof window !== "undefined") {
                                    sessionStorage.setItem("selected_laptop_report", JSON.stringify(item));
                                  }
                                }}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#F4F6FB] hover:bg-[#0052CC] text-[#17284D] hover:text-white border border-[#DDE4F3] hover:border-[#0052CC] font-bold text-[11px] transition-colors cursor-pointer"
                                title="View on-demand hardware diagnostics and component specs"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </Link>

                              <Link
                                href={`/gadgetiq/reports/laptop/certificate?id=${item.mstid || item.ServiceKey || item.certificate_number || ""}&servicekey=${item.ServiceKey || ""}&serial=${item.device_serial_number || item.serial_number || item.imei_1 || ""}`}
                                onClick={() => {
                                  if (typeof window !== "undefined") {
                                    sessionStorage.setItem("selected_laptop_report", JSON.stringify(item));
                                  }
                                }}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0052CC] hover:bg-[#0052CC] hover:text-white font-bold text-[11px] transition-colors"
                                title="View and print official certificate"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Certificate</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination */}
            <ReportsPagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalRecords={totalRecords}
              currentCount={sortedReports.length}
              onPageChange={(newPage) => setPage(newPage)}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(1);
              }}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {/* On-Demand Laptop QC Detail Modal */}
      <LaptopQcDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDetailId(null);
          setSelectedDetailItem(null);
        }}
        mstidOrSerial={selectedDetailId}
        fallbackItem={selectedDetailItem}
      />

      {/* Date Range Excel Export Modal */}
      <DateRangeExcelExportModal
        isOpen={isDateRangeModalOpen}
        onClose={() => setIsDateRangeModalOpen(false)}
        reportTitle="Laptop & Notebooks QC Report"
        filenamePrefix="Laptop_QC_Report"
        columns={laptopExcelColumns}
        defaultFromDate={fromDate}
        defaultToDate={toDate}
        onFetchData={handleFetchDateRangeData}
      />
    </div>
  );
}
