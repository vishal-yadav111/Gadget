"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Monitor,
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
} from "lucide-react";
import { reportsService } from "../services";
import { DesktopQCReportItem } from "../types";
import { getFriendlyErrorMessage } from "../../core";
import { ReportsPagination } from "../ReportsPagination";
import { HardwareDetailModal } from "../_components/HardwareDetailModal";

type SortField = "date" | "brand" | "model" | "serial" | "workorder" | "processor" | "gpu" | "status";
type SortOrder = "asc" | "desc";

export default function DesktopQCReportPage() {
  const [reports, setReports] = useState<DesktopQCReportItem[]>([]);
  const [selectedDetailId, setSelectedDetailId] = useState<string | number | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("2024-01-01");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);

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

  // 350ms Debounced search input handler
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadReports = async () => {
    const currentReqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const res = await reportsService.getDesktopReportsPaginated({
        fromDate,
        toDate,
        search: debouncedSearch,
        page,
        pageSize,
        status: statusFilter === "all" ? "ALL" : statusFilter.toUpperCase(),
      });

      if (currentReqId === requestIdRef.current) {
        setReports(res.data);
        setTotalRecords(res.recordsFiltered || res.recordsTotal || res.data.length);
        setTotalPages(res.totalPages || Math.ceil((res.recordsFiltered || res.data.length) / pageSize) || 1);
      }
    } catch (err: any) {
      if (currentReqId === requestIdRef.current) {
        console.error("Failed to load DT reports:", err);
        setError(getFriendlyErrorMessage(err, "Unable to load live Desktop QC records. Please check your network connection."));
      }
    } finally {
      if (currentReqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadReports();
  }, [page, pageSize, statusFilter, fromDate, toDate, debouncedSearch]);

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
      } else if (sortField === "processor") {
        comparison = (a.Processor_Family || "").localeCompare(b.Processor_Family || "");
      } else if (sortField === "gpu") {
        comparison = (a.GPU_Model || "").localeCompare(b.GPU_Model || "");
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

  const exportCSV = () => {
    const headers = "CertNumber,WorkOrderID,Brand,Model,SerialNumber,FormFactor,Processor,RAM,GPU,Status,Date\n";
    const rows = sortedReports
      .map(
        (r) =>
          `"${r.certificate_number || ""}","${r.workorderid || ""}","${r.brand_name || ""}","${r.model_name || ""}","${r.serial_number || r.imei_1 || ""}","${r.Form_Factor || ""}","${r.Processor_Family || ""}","${r.RAM || ""}","${r.GPU_Model || ""}","${r.test_result || r.QCResult || ""}","${r.test_date_time || r.CreatedOn || ""}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Desktop_QC_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-display text-[#17284D]">
                QC Report (Desktop Computers - DT)
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052CC] font-mono text-[11px] font-bold">
                {totalRecords.toLocaleString()} Records Live
              </span>
            </div>
            <p className="text-xs text-[#5F6A86]">
              Workstation & Tower automated stress testing, discrete GPU benchmarks, PSU wattage load, and peripheral audits.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={loadReports}
            className="p-2 rounded-xl bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] transition-colors cursor-pointer"
            title="Refresh reports"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0052CC]" : ""}`} />
          </button>
          <button
            onClick={exportCSV}
            disabled={sortedReports.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Debounced Search, Date Filters, and Status */}
      <div className="bg-white rounded-2xl p-4 border border-[#DDE4F3] shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Serial, Model, Certificate, GPU, Work Order..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F6FB] border border-[#DDE4F3] rounded-xl text-xs text-[#17284D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 focus:border-[#0052CC] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-[#F4F6FB] p-1 rounded-xl border border-[#DDE4F3]">
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

          {/* Date Range Pickers */}
          <div className="flex items-center space-x-2 bg-[#F4F6FB] px-3 py-1.5 rounded-xl border border-[#DDE4F3]">
            <span className="text-[11px] font-semibold text-[#5F6A86]">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-bold text-[#17284D] focus:outline-none cursor-pointer"
            />
            <span className="text-slate-300">|</span>
            <span className="text-[11px] font-semibold text-[#5F6A86]">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className="bg-transparent text-xs font-bold text-[#17284D] focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white rounded-2xl border border-[#DDE4F3] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#0052CC]" />
            <p className="text-xs font-medium text-[#5F6A86]">Loading live Desktop QC diagnostic records...</p>
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
                      Serial / Asset Tag {renderSortIcon("serial")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("brand")}
                    >
                      Brand & Form Factor {renderSortIcon("brand")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("processor")}
                    >
                      CPU & Memory {renderSortIcon("processor")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-[#0052CC] transition-colors"
                      onClick={() => handleSort("gpu")}
                    >
                      GPU & PSU Load {renderSortIcon("gpu")}
                    </th>
                    <th className="py-3 px-4">Cooling & IO</th>
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
                          <Monitor className="w-8 h-8 text-slate-300" />
                          <p className="font-semibold text-slate-600">No desktop QC records found</p>
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
                          <div>{item.certificate_number || item.ServiceKey || `XC-DT-${item.mstid}`}</div>
                          {item.workorderid && (
                            <div className="text-[10px] text-slate-400 font-mono">{item.workorderid}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#17284D]">
                          <div className="font-semibold text-indigo-600 hover:underline">{item.serial_number || item.imei_1 || "N/A"}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#17284D]">{item.brand_name || "—"}</div>
                          <div className="text-[11px] text-slate-500">{item.model_name || item.Form_Factor || ""}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700">
                          <div className="font-semibold text-[#17284D]">{item.Processor_Family || "—"}</div>
                          <div className="text-[10px] text-slate-400">{item.RAM ? `RAM: ${item.RAM}` : ""}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-700">{item.GPU_Model || item.HDD_SSD || "—"}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {item.Power_Supply_Wattage ? `PSU: ${item.Power_Supply_Wattage}` : ""}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div>{item.Cooling_Fan_RPM ? `Fan: ${item.Cooling_Fan_RPM}` : "—"}</div>
                          <div className="text-[10px] text-slate-400">{item.Front_IO_Ports ? `Front IO: ${item.Front_IO_Ports}` : ""}</div>
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
    </div>
  );
}
