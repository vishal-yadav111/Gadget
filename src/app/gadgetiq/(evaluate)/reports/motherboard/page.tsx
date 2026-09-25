"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Cpu,
  Search,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MinusCircle,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Calendar,
} from "lucide-react";
import { reportsService } from "../services";
import { MotherboardQCReportItem } from "../types";
import { getFriendlyErrorMessage } from "../../core";
import { ReportsPagination } from "../ReportsPagination";
import { HardwareDetailModal } from "../_components/HardwareDetailModal";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { exportToExcel, ExcelColumn } from "@/lib/excel-export";
import DateRangeExcelExportModal from "@/components/ui/DateRangeExcelExportModal";
import DateRangeFilter from "@/components/ui/DateRangeFilter";

type SortField = "date" | "brand" | "model" | "serial" | "workorder" | "vrm" | "temp" | "status";
type SortOrder = "asc" | "desc";

const motherboardExcelColumns: ExcelColumn[] = [
  { key: "certificate_number", header: "Certificate Number" },
  { key: "workorderid", header: "Work Order ID" },
  { key: "brand_name", header: "Brand" },
  { key: "model_name", header: "Model" },
  { key: "serial_number", header: "Serial / IMEI" },
  { key: "VRM_Health", header: "VRM Health" },
  { key: "Chipset_Temp", header: "Chipset Temp" },
  { key: "RAM_Slots", header: "RAM Slots" },
  { key: "PCIe_Slots", header: "PCIe Slots" },
  { key: "test_result", header: "QC Result" },
  { key: "test_date_time", header: "Evaluation Date" },
];

export default function MotherboardQCReportPage() {
  const [reports, setReports] = useState<MotherboardQCReportItem[]>([]);
  const [selectedDetailId, setSelectedDetailId] = useState<string | number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Date Range Excel Export Modal state
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);

  // Debounced filters to prevent API spamming
  const debouncedSearch = useDebounce(search, 350);
  const debouncedFromDate = useDebounce(fromDate, 400);
  const debouncedToDate = useDebounce(toDate, 400);

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
      const res = await reportsService.getMotherboardReportsPaginated({
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
        console.error("Failed to load MB reports:", err);
        setError(getFriendlyErrorMessage(err, "Unable to load motherboard QC records. Please check your network connection."));
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

  // Sort and filter data (Zero Deduplication: all duplicate serials/records are preserved)
  const sortedReports = useMemo(() => {
    const items = [...reports];
    return items.sort((a, b) => {
      let comparison = 0;
      if (sortField === "date") {
        const dateA = a.test_date_time || a.CreatedOn ? new Date(a.test_date_time || a.CreatedOn || "").getTime() : (a.mstid || 0);
        const dateB = b.test_date_time || b.CreatedOn ? new Date(b.test_date_time || b.CreatedOn || "").getTime() : (b.mstid || 0);
        comparison = dateA - dateB;
      } else if (sortField === "brand") {
        comparison = (a.brand_name || "").localeCompare(b.brand_name || "");
      } else if (sortField === "model") {
        comparison = (a.model_name || "").localeCompare(b.model_name || "");
      } else if (sortField === "serial") {
        comparison = (a.serial_number || a.imei_1 || "").localeCompare(b.serial_number || b.imei_1 || "");
      } else if (sortField === "workorder") {
        comparison = (a.workorderid || "").localeCompare(b.workorderid || "");
      } else if (sortField === "vrm") {
        comparison = (a.VRM_Health || "").localeCompare(b.VRM_Health || "");
      } else if (sortField === "temp") {
        comparison = (a.Chipset_Temp || "").localeCompare(b.Chipset_Temp || "");
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
      certificate_number: r.certificate_number || `XC-MB-${r.mstid}`,
      workorderid: r.workorderid || "—",
      brand_name: r.brand_name || "—",
      model_name: r.model_name || "—",
      serial_number: r.serial_number || r.imei_1 || "—",
      VRM_Health: r.VRM_Health || "—",
      Chipset_Temp: r.Chipset_Temp || "—",
      RAM_Slots: r.RAM_Slots || "—",
      PCIe_Slots: r.PCIe_Slots || "—",
      test_result: r.test_result || r.QCResult || "—",
      test_date_time: r.test_date_time || r.CreatedOn || "—",
    }));

    exportToExcel({
      filename: `Motherboard_QC_Report_${fromDate}_to_${toDate}.xlsx`,
      sheetName: "Motherboard QC",
      columns: motherboardExcelColumns,
      rows,
      title: `Motherboards QC Diagnostics Report (${fromDate} to ${toDate})`,
    });
  };

  const handleFetchDateRangeData = async (startD: string, endD: string) => {
    const res = await reportsService.getMotherboardReportsPaginated({
      fromDate: startD,
      toDate: endD,
      pageSize: 100000,
      search: debouncedSearch,
      status: statusFilter === "all" ? "ALL" : statusFilter.toUpperCase(),
    });

    return res.data.map((r) => ({
      certificate_number: r.certificate_number || `XC-MB-${r.mstid}`,
      workorderid: r.workorderid || "—",
      brand_name: r.brand_name || "—",
      model_name: r.model_name || "—",
      serial_number: r.serial_number || r.imei_1 || "—",
      VRM_Health: r.VRM_Health || "—",
      Chipset_Temp: r.Chipset_Temp || "—",
      RAM_Slots: r.RAM_Slots || "—",
      PCIe_Slots: r.PCIe_Slots || "—",
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
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-display text-[#17284D]">
                QC Report (Motherboards - MB)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052CC] font-mono text-[11px] font-bold">
                {totalRecords.toLocaleString()} Verified Records
              </span>
            </div>
            <p className="text-xs text-[#5F6A86]">
              VRM power rail diagnostics, BIOS firmware integrity, PCIe trace continuity, and chipset telemetry.
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
            <p className="text-xs font-medium text-[#5F6A86]">Loading Motherboard QC diagnostic reports...</p>
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
                      Serial / IMEI {renderSortIcon("serial")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("brand")}
                    >
                      Board Brand / Model {renderSortIcon("brand")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("vrm")}
                    >
                      VRM Health {renderSortIcon("vrm")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("temp")}
                    >
                      Chipset Temp {renderSortIcon("temp")}
                    </th>
                    <th className="py-3 px-4">Slots & IO</th>
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
                      <td colSpan={9} className="py-16 text-center text-xs text-[#5F6A86]">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Cpu className="w-8 h-8 text-slate-300" />
                          <p className="font-semibold text-slate-600">No motherboard QC records found</p>
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
                          className="hover:bg-[#F4F6FB]/80 transition-colors cursor-pointer"
                          onClick={() => setSelectedDetailId(item.mstid || item.serial_number || item.imei_1 || item.ServiceKey || null)}
                        >
                          <td className="py-3.5 px-4 font-bold text-[#17284D]">
                            <div>{item.certificate_number || item.ServiceKey || `XC-MB-${item.mstid}`}</div>
                            {item.workorderid && (
                              <div className="text-[10px] text-slate-400 font-mono">{item.workorderid}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#17284D]">
                            <div className="font-semibold text-indigo-600 hover:underline">{item.serial_number || item.imei_1 || "N/A"}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#17284D]">{item.brand_name || "—"}</div>
                            <div className="text-[11px] text-slate-500">{item.model_name || ""}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              (item.VRM_Health || "").toUpperCase() === "PASS"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : item.VRM_Health
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}>
                              {item.VRM_Health || "—"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            {item.Chipset_Temp || "—"}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <div>RAM: {item.RAM_Slots || "—"}</div>
                            <div className="text-[10px] text-slate-400">{item.PCIe_Slots ? `PCIe: ${item.PCIe_Slots}` : ""}</div>
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
                            <div className="inline-flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedDetailId(item.mstid || item.serial_number || item.imei_1 || item.ServiceKey || null)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                                title="Inspect Diagnostics"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Inspect</span>
                              </button>
                              <Link
                                href={`/gadgetiq/certificate/${item.mstid || item.ServiceKey || item.certificate_number}`}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0052CC] hover:bg-[#0052CC] hover:text-white font-bold text-[11px] transition-colors cursor-pointer"
                                title="View Certificate"
                              >
                                <span>Audit</span>
                                <ExternalLink className="w-3 h-3" />
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

      {/* Hardware Detail Modal */}
      <HardwareDetailModal
        identifier={selectedDetailId}
        onClose={() => setSelectedDetailId(null)}
      />

      {/* Date Range Excel Export Modal */}
      <DateRangeExcelExportModal
        isOpen={isDateRangeModalOpen}
        onClose={() => setIsDateRangeModalOpen(false)}
        reportTitle="Motherboards QC Diagnostics Report"
        filenamePrefix="Motherboard_QC_Report"
        columns={motherboardExcelColumns}
        defaultFromDate={fromDate}
        defaultToDate={toDate}
        onFetchData={handleFetchDateRangeData}
      />
    </div>
  );
}
