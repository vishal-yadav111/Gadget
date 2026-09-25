"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileSpreadsheet,
  Calendar,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { exportToExcel, ExcelColumn } from "@/lib/excel-export";
import {
  getLocalToday,
  getLocalDaysAgo,
  getLocalStartOfMonth,
  getLocalStartOfYear,
} from "@/components/ui/DateRangeFilter";

export interface DateRangePreset {
  label: string;
  getFromDate: () => string;
  getToDate: () => string;
}

export interface DateRangeExcelExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  reportTitle?: string;
  filenamePrefix: string;
  columns?: ExcelColumn[];
  defaultFromDate?: string;
  defaultToDate?: string;
  fetchData?: (fromDate: string, toDate: string) => Promise<Record<string, any>[]>;
  onFetchData?: (fromDate: string, toDate: string) => Promise<Record<string, any>[]>;
}

export default function DateRangeExcelExportModal({
  isOpen,
  onClose,
  title,
  reportTitle = "Diagnostic Records",
  filenamePrefix,
  columns,
  defaultFromDate = "",
  defaultToDate = "",
  fetchData,
  onFetchData,
}: DateRangeExcelExportModalProps) {
  const [fromDate, setFromDate] = useState(defaultFromDate || "2021-01-01");
  const [toDate, setToDate] = useState(defaultToDate || getLocalToday());
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setRecordCount] = useState<number | null>(null);

  // Sync state whenever modal opens or defaults change
  useEffect(() => {
    if (isOpen) {
      setFromDate(defaultFromDate || "2021-01-01");
      setToDate(defaultToDate || getLocalToday());
      setError(null);
      setStatusMessage(null);
      setRecordCount(null);
    }
  }, [isOpen, defaultFromDate, defaultToDate]);

  const displayTitle = title || `Export Data - ${reportTitle}`;
  const getDataFn = fetchData || onFetchData;

  const presets: DateRangePreset[] = [
    {
      label: "Today",
      getFromDate: getLocalToday,
      getToDate: getLocalToday,
    },
    {
      label: "Yesterday",
      getFromDate: () => getLocalDaysAgo(1),
      getToDate: () => getLocalDaysAgo(1),
    },
    {
      label: "Last 7 Days",
      getFromDate: () => getLocalDaysAgo(7),
      getToDate: getLocalToday,
    },
    {
      label: "Last 30 Days",
      getFromDate: () => getLocalDaysAgo(30),
      getToDate: getLocalToday,
    },
    {
      label: "Year to Date",
      getFromDate: getLocalStartOfYear,
      getToDate: getLocalToday,
    },
    {
      label: "Full Lifetime Data",
      getFromDate: () => "2021-01-01",
      getToDate: getLocalToday,
    },
  ];

  if (!isOpen) return null;

  const handleExport = async () => {
    if (!getDataFn) return;
    setLoading(true);
    setError(null);
    setStatusMessage("Querying diagnostic records for export...");
    setRecordCount(null);

    try {
      const data = await getDataFn(fromDate, toDate);

      if (!data || data.length === 0) {
        setStatusMessage(null);
        setError("No records found for the specified criteria.");
        setLoading(false);
        return;
      }

      setRecordCount(data.length);
      setStatusMessage(`Formatting ${data.length.toLocaleString()} records into Excel workbook...`);

      const dateSuffix = fromDate && toDate ? `_${fromDate}_to_${toDate}` : `_${getLocalToday()}`;
      const filename = `${filenamePrefix}${dateSuffix}.xlsx`;

      exportToExcel({
        filename,
        sheetName: (reportTitle || "Report").substring(0, 31),
        columns,
        data,
        title: `${reportTitle} ${fromDate && toDate ? `(${fromDate} to ${toDate})` : ""}`,
      });

      setStatusMessage("Excel workbook generated and downloaded!");
      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1400);
    } catch (err: any) {
      console.error("Failed to generate Excel export:", err);
      setError(err?.message || "Failed to retrieve records for export.");
      setLoading(false);
      setStatusMessage(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-lg bg-white rounded-3xl border border-[#DDE4F3] shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#DDE4F3] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#17284D]">
                  {displayTitle}
                </h3>
                <p className="text-xs text-[#5F6A86]">{reportTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-[#E9EEF9] transition-colors cursor-pointer disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Quick Presets */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#17284D]">
                <Clock className="w-3.5 h-3.5 text-[#0052CC]" />
                <span>Quick Date Presets</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {presets.map((preset) => {
                  const isActive =
                    fromDate === preset.getFromDate() && toDate === preset.getToDate();
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setFromDate(preset.getFromDate());
                        setToDate(preset.getToDate());
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                        isActive
                          ? "bg-blue-50 border-[#0052CC] text-[#0052CC] font-bold shadow-xs"
                          : "bg-[#F4F6FB] border-[#DDE4F3] text-[#5F6A86] hover:bg-white hover:text-[#17284D]"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Date Pickers */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#17284D]">
                <Calendar className="w-3.5 h-3.5 text-[#0052CC]" />
                <span>Custom Date Window</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F4F6FB] p-2.5 rounded-2xl border border-[#DDE4F3]">
                  <label className="text-[11px] font-semibold text-[#5F6A86] block mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full bg-white border border-[#DDE4F3] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#17284D] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 cursor-pointer"
                  />
                </div>
                <div className="bg-[#F4F6FB] p-2.5 rounded-2xl border border-[#DDE4F3]">
                  <label className="text-[11px] font-semibold text-[#5F6A86] block mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full bg-white border border-[#DDE4F3] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#17284D] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Export Info Box */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
              <div className="flex items-center justify-between font-bold">
                <span>Output Format:</span>
                <span className="font-mono text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                  Microsoft Excel (.xlsx)
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-800">
                <span>Selected Interval:</span>
                <span className="font-mono font-bold">
                  {fromDate || "Lifetime"} → {toDate || getLocalToday()}
                </span>
              </div>
              <p className="text-[10px] text-emerald-700 pt-0.5">
                Includes full diagnostic test categories, serial numbers, hardware condition grades, and timestamps.
              </p>
            </div>

            {/* Status / Feedback */}
            {statusMessage && (
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs font-medium text-[#0052CC] flex items-center space-x-2">
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#0052CC] shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#DDE4F3] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-[#5F6A86] hover:text-[#17284D] transition-colors cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleExport}
              disabled={loading || (!fromDate && !toDate)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Preparing Excel...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Excel Report</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
