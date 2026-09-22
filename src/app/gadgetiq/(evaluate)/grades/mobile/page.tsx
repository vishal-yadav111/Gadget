"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Smartphone,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Award,
  BarChart3,
} from "lucide-react";
import { gradesService, parseEvaluationDateToTime } from "../services";
import { GradeDistributionItem, GradedDeviceItem } from "../types";
import { getFriendlyErrorMessage } from "../../core";
import { ReportsPagination } from "../../reports/ReportsPagination";
import {
  renderDeviceConditionBadge,
  formatConditionCategory,
  getGradeRank,
} from "../../reports/mobile/page";

type SortField = "workorder" | "imei" | "brand" | "grade" | "storage" | "status" | "date";
type SortOrder = "asc" | "desc";

export function formatTesterName(raw?: string | null): string {
  if (!raw || raw === "—" || raw.toLowerCase() === "none" || raw.toLowerCase() === "null") return "—";
  const str = String(raw).trim();
  const match = str.match(/^([a-zA-Z]+)(\d*)$/);
  if (match) {
    const name = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
    return match[2] ? `${name} (#${match[2]})` : name;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatStorageClean(raw?: string | null): string {
  if (!raw || raw === "—" || raw.toLowerCase() === "none" || raw.toLowerCase() === "null") return "—";
  const str = String(raw).trim();
  const sizeMatch = str.match(/^([\d.]+)\s*(GB|TB)/i);
  if (sizeMatch) {
    const size = Math.round(parseFloat(sizeMatch[1]));
    const unit = sizeMatch[2].toUpperCase();
    return `${size} ${unit}`;
  }
  return str;
}

export default function GradeReportMobilePage() {
  const [grades, setGrades] = useState<GradeDistributionItem[]>([]);
  const [devices, setDevices] = useState<GradedDeviceItem[]>([]);
  const [totalEvaluated, setTotalEvaluated] = useState(0);
  const [recordsFiltered, setRecordsFiltered] = useState(0);

  // Filters State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("2021-01-01");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [datePreset, setDatePreset] = useState<string>("all");

  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting State - default by evaluation date DESC
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

  // Debounced search (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Quick Date Presets Handler
  const applyDatePreset = (preset: string) => {
    setDatePreset(preset);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    if (preset === "today") {
      setFromDate(todayStr);
      setToDate(todayStr);
    } else if (preset === "7d") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      setFromDate(d.toISOString().split("T")[0]);
      setToDate(todayStr);
    } else if (preset === "30d") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setFromDate(d.toISOString().split("T")[0]);
      setToDate(todayStr);
    } else if (preset === "year") {
      const d = new Date(today.getFullYear(), 0, 1);
      setFromDate(d.toISOString().split("T")[0]);
      setToDate(todayStr);
    } else if (preset === "all") {
      setFromDate("2021-01-01");
      setToDate(todayStr);
    }
    setPage(1);
  };

  const loadData = async (forceRefresh: boolean = false) => {
    const currentReqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const res = await gradesService.getMobileGradeReportPaginated({
        fromDate,
        toDate,
        search: debouncedSearch,
        grade: selectedGrade,
        brand: selectedBrand,
        status: statusFilter,
        page,
        pageSize,
        forceRefresh,
      });

      if (currentReqId === requestIdRef.current) {
        setGrades(res.distribution);
        setDevices(res.devices);
        setTotalEvaluated(res.totalEvaluated);
        setRecordsFiltered(res.recordsFiltered);
        setTotalPages(res.totalPages || Math.ceil(res.recordsFiltered / pageSize) || 1);
      }
    } catch (err: any) {
      if (currentReqId === requestIdRef.current) {
        console.error("Failed to load mobile grade report:", err);
        setError(getFriendlyErrorMessage(err, "Unable to load evaluation records. Please try again."));
      }
    } finally {
      if (currentReqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [page, pageSize, selectedGrade, selectedBrand, statusFilter, fromDate, toDate, debouncedSearch]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "date" ? "desc" : "asc");
    }
  };

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

  const sortedDevices = useMemo(() => {
    const items = [...devices];
    return items.sort((a, b) => {
      let comparison = 0;
      if (sortField === "grade") {
        const rankA = getGradeRank(a.rawGrade || a.grade);
        const rankB = getGradeRank(b.rawGrade || b.grade);
        if (rankA !== rankB) {
          comparison = rankA - rankB;
        } else {
          comparison = (a.rawGrade || a.grade || "").localeCompare(b.rawGrade || b.grade || "");
        }
      } else if (sortField === "workorder") {
        comparison = (a.workorderid || "").localeCompare(b.workorderid || "");
      } else if (sortField === "imei") {
        comparison = (a.imei || a.serialNumber || "").localeCompare(b.imei || b.serialNumber || "");
      } else if (sortField === "brand") {
        comparison = `${a.brand || ""} ${a.model || ""}`.localeCompare(`${b.brand || ""} ${b.model || ""}`);
      } else if (sortField === "storage") {
        comparison = (a.storage || "").localeCompare(b.storage || "");
      } else if (sortField === "status") {
        const isPassA = (a.qcResult || "").toUpperCase() === "PASS";
        const isPassB = (b.qcResult || "").toUpperCase() === "PASS";
        comparison = isPassA === isPassB ? 0 : isPassA ? 1 : -1;
      } else if (sortField === "date") {
        const dateA = parseEvaluationDateToTime(a.testedAtN || a.testedAt);
        const dateB = parseEvaluationDateToTime(b.testedAtN || b.testedAt);
        comparison = dateA - dateB;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [devices, sortField, sortOrder]);

  const clearAllFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedGrade("all");
    setSelectedBrand("all");
    setStatusFilter("all");
    setDatePreset("all");
    setFromDate("2021-01-01");
    setToDate(new Date().toISOString().split("T")[0]);
    setPage(1);
  };

  const hasActiveFilters =
    debouncedSearch.length > 0 ||
    selectedGrade !== "all" ||
    selectedBrand !== "all" ||
    statusFilter !== "all" ||
    fromDate !== "2021-01-01";

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap">
              <h1 className="text-xl font-bold font-display text-[#17284D]">Mobile Grade Intelligence</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono text-[11px] font-bold">
                {totalEvaluated.toLocaleString()} Total Evaluated Mobiles
              </span>
            </div>
            <p className="text-xs text-[#5F6A86] mt-0.5">
              52-Point mobile diagnostic evaluation & cosmetic grade classification.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 flex-wrap">
          {/* Quick Date Presets */}
          <div className="hidden sm:flex items-center bg-[#F4F6FB] p-1 rounded-xl border border-[#DDE4F3] text-[11px] font-semibold text-slate-600">
            {[
              { id: "all", label: "All Time" },
              { id: "30d", label: "30 Days" },
              { id: "7d", label: "7 Days" },
              { id: "today", label: "Today" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => applyDatePreset(p.id)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  datePreset === p.id
                    ? "bg-white text-[#0052CC] font-bold shadow-xs border border-[#DDE4F3]"
                    : "hover:text-[#17284D]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => loadData(true)}
            className="p-2 rounded-xl bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0052CC]" : ""}`} />
          </button>
          <Link
            href="/gadgetiq/grades/mobile/visualize"
            className="px-3.5 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Visualize</span>
          </Link>
        </div>
      </div>

      {/* 2. Graded Mobiles Ledger Table */}
      <div className="bg-white rounded-2xl border border-[#DDE4F3] shadow-xs overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-4 border-b border-[#DDE4F3] space-y-3 bg-[#F8FAFC]/70">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="font-bold text-sm text-[#17284D] flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#0052CC]" />
              <span>Mobile Grading Ledger</span>
              <span className="text-xs font-mono font-normal text-slate-400">
                ({recordsFiltered.toLocaleString()} matching records)
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
              {/* Search with Clear Button */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search IMEI, Model, WO..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white border border-[#DDE4F3] focus:border-[#0052CC] outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Grade Filter Dropdown */}
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setPage(1);
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-white border border-[#DDE4F3] outline-none cursor-pointer font-medium text-slate-700"
              >
                <option value="all">All Cosmetic Grades</option>
                <option value="1a">Tier A (Category A / Superb / Like New)</option>
                <option value="2a">Tier B (Category B / Very Good)</option>
                <option value="3a">Tier C (Category C / Good)</option>
                <option value="4a">Tier D (Category D / Fair)</option>
                <option value="5e">Tier E & Defect (Category E / Quarantine / Fail)</option>
              </select>

              {/* QC Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-white border border-[#DDE4F3] outline-none cursor-pointer font-medium text-slate-700"
              >
                <option value="all">All QC Results</option>
                <option value="PASS">PASS Only</option>
                <option value="FAIL">FAIL Only</option>
              </select>

              {/* Custom Date Range */}
              <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1 rounded-xl border border-[#DDE4F3] text-xs">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setDatePreset("custom");
                    setPage(1);
                  }}
                  className="bg-transparent text-[11px] font-semibold text-slate-700 outline-none cursor-pointer"
                />
                <span className="text-slate-300">-</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setDatePreset("custom");
                    setPage(1);
                  }}
                  className="bg-transparent text-[11px] font-semibold text-slate-700 outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs border-t border-slate-200/60">
              <span className="text-slate-500 font-medium text-[11px]">Active Filters:</span>

              {debouncedSearch && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#0052CC] border border-blue-200 text-[11px] font-medium">
                  <span>Search: &quot;{debouncedSearch}&quot;</span>
                  <button onClick={() => setSearch("")} className="hover:text-blue-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedGrade !== "all" && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium">
                  <span>Grade: {selectedGrade.toUpperCase()}</span>
                  <button onClick={() => setSelectedGrade("all")} className="hover:text-indigo-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBrand !== "all" && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-medium">
                  <span>Brand: {selectedBrand.toUpperCase()}</span>
                  <button onClick={() => setSelectedBrand("all")} className="hover:text-slate-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {statusFilter !== "all" && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                  <span>Status: {statusFilter}</span>
                  <button onClick={() => setStatusFilter("all")} className="hover:text-emerald-900 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer ml-auto"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#0052CC]" />
            <p className="text-xs font-medium text-[#5F6A86]">Loading evaluation records...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-[#17284D]">Unable to Load Evaluation Records</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{error}</p>
            <button
              onClick={() => loadData(true)}
              className="px-4 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003D99] transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#DDE4F3] text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-[#E9EEF9] transition-colors select-none"
                      onClick={() => handleSort("workorder")}
                    >
                      Work Order {renderSortIcon("workorder")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-[#E9EEF9] transition-colors select-none"
                      onClick={() => handleSort("imei")}
                    >
                      IMEI / Identifier {renderSortIcon("imei")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-[#E9EEF9] transition-colors select-none"
                      onClick={() => handleSort("brand")}
                    >
                      Device Make & Model {renderSortIcon("brand")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-[#E9EEF9] transition-colors select-none"
                      onClick={() => handleSort("storage")}
                    >
                      Storage {renderSortIcon("storage")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-[#E9EEF9] transition-colors select-none"
                      onClick={() => handleSort("grade")}
                    >
                      Cosmetic Grade {renderSortIcon("grade")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-[#E9EEF9] transition-colors select-none"
                      onClick={() => handleSort("status")}
                    >
                      QC Result {renderSortIcon("status")}
                    </th>
                    <th
                      className="py-3 px-4 cursor-pointer hover:bg-[#E9EEF9] transition-colors select-none"
                      onClick={() => handleSort("date")}
                    >
                      Evaluation Date {renderSortIcon("date")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDE4F3]/70 font-medium">
                  {sortedDevices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <AlertCircle className="w-8 h-8 text-slate-300" />
                          <h3 className="text-sm font-bold text-[#17284D]">No Graded Mobile Devices Found</h3>
                          <p className="text-xs text-slate-500 max-w-sm">
                            No evaluation records match your search or filter parameters.
                          </p>
                          <button
                            onClick={clearAllFilters}
                            className="mt-2 px-3 py-1.5 rounded-xl bg-blue-50 text-[#0052CC] font-bold text-xs hover:bg-blue-100 transition-colors"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    sortedDevices.map((item, idx) => {
                      const isPass = (item.qcResult || "").toUpperCase() === "PASS";

                      return (
                        <tr
                          key={item.mstid ? `${item.mstid}-${idx}` : idx}
                          className="hover:bg-[#F8FAFC] transition-colors group"
                        >
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#0052CC] font-bold">
                            {item.workorderid || `WO-MB-${item.mstid || idx + 1}`}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            {item.imei || item.serialNumber || "—"}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#17284D]">{item.brand}</div>
                            <div className="text-[11px] text-[#5F6A86] line-clamp-1">{item.model}</div>
                          </td>
                          <td className="py-3.5 px-4 text-[#17284D] text-xs font-semibold">
                            {formatStorageClean(item.storage)}
                          </td>
                          <td className="py-3.5 px-4">
                            {renderDeviceConditionBadge(item.rawGrade || item.grade)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                isPass
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {isPass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              <span>{item.qcResult}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-[#5F6A86] text-[11px]">
                            {item.testedAt || "Recent"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-[#DDE4F3] bg-[#F8FAFC]/50">
              <ReportsPagination
                page={page}
                pageSize={pageSize}
                totalRecords={recordsFiltered}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
                onPageSizeChange={(sz) => {
                  setPageSize(sz);
                  setPage(1);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
