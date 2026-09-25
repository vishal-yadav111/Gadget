"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Calendar, ChevronDown, Check, Filter, RotateCcw, Clock } from "lucide-react";

export interface DateRangeValue {
  fromDate: string;
  toDate: string;
}

export interface DateRangeFilterProps {
  fromDate?: string;
  toDate?: string;
  onChange?: (range: DateRangeValue) => void;
  onDateChange?: (fromDate: string, toDate: string) => void;
  className?: string;
}

/**
 * Robust local calendar date helpers without UTC offset shift bugs
 */
export function getLocalToday(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLocalDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getLocalStartOfMonth(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

export function getLocalStartOfYear(): string {
  const year = new Date().getFullYear();
  return `${year}-01-01`;
}

export const DATE_PRESETS = [
  {
    id: "all",
    label: "All Time",
    getFrom: () => "",
    getTo: () => "",
  },
  {
    id: "today",
    label: "Today",
    getFrom: getLocalToday,
    getTo: getLocalToday,
  },
  {
    id: "yesterday",
    label: "Yesterday",
    getFrom: () => getLocalDaysAgo(1),
    getTo: () => getLocalDaysAgo(1),
  },
  {
    id: "7d",
    label: "Last 7 Days",
    getFrom: () => getLocalDaysAgo(7),
    getTo: getLocalToday,
  },
  {
    id: "30d",
    label: "Last 30 Days",
    getFrom: () => getLocalDaysAgo(30),
    getTo: getLocalToday,
  },
  {
    id: "ytd",
    label: "Year to Date",
    getFrom: getLocalStartOfYear,
    getTo: getLocalToday,
  },
];

export function isAllTimeRange(f?: string, t?: string): boolean {
  if (!f && !t) return true;
  const today = getLocalToday();
  if (f === "2021-01-01" || f === "2024-01-01" || f === "01/01/2021") {
    if (!t || t === today || t === "2050-01-01" || t === "01/01/2050") return true;
  }
  return false;
}

export default function DateRangeFilter({
  fromDate = "",
  toDate = "",
  onChange,
  onDateChange,
  className = "",
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(fromDate);
  const [tempToDate, setTempToDate] = useState(toDate);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Sync temp dates when props change
  useEffect(() => {
    setTempFromDate(fromDate);
    setTempToDate(toDate);
  }, [fromDate, toDate]);

  const activePresetId = useMemo(() => {
    if (isAllTimeRange(fromDate, toDate)) {
      return "all";
    }
    const matched = DATE_PRESETS.find(
      (p) => p.id !== "all" && fromDate === p.getFrom() && toDate === p.getTo()
    );
    if (matched) {
      return matched.id;
    }
    return "custom";
  }, [fromDate, toDate]);

  const emitDateChange = (newFrom: string, newTo: string) => {
    if (onChange) {
      onChange({ fromDate: newFrom, toDate: newTo });
    }
    if (onDateChange) {
      onDateChange(newFrom, newTo);
    }
  };

  const handleSelectPreset = (preset: (typeof DATE_PRESETS)[0]) => {
    const f = preset.getFrom();
    const t = preset.getTo();
    setTempFromDate(f);
    setTempToDate(t);
    emitDateChange(f, t);
    setIsOpen(false);
  };

  const handleApplyCustom = () => {
    emitDateChange(tempFromDate, tempToDate);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempFromDate("");
    setTempToDate("");
    emitDateChange("", "");
    setIsOpen(false);
  };

  // Human readable trigger label
  const buttonLabel = useMemo(() => {
    if (isAllTimeRange(fromDate, toDate)) {
      return "All Time";
    }
    const matched = DATE_PRESETS.find(
      (p) => p.id !== "all" && fromDate === p.getFrom() && toDate === p.getTo()
    );
    if (matched) {
      return matched.label;
    }
    if (fromDate && toDate) {
      return `${fromDate} → ${toDate}`;
    }
    if (fromDate) {
      return `From ${fromDate}`;
    }
    if (toDate) {
      return `Until ${toDate}`;
    }
    return "Custom Date";
  }, [fromDate, toDate]);

  const isFiltered = !isAllTimeRange(fromDate, toDate) && Boolean(fromDate || toDate);

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 cursor-pointer shadow-2xs ${isFiltered
            ? "bg-blue-50 border-[#0052CC] text-[#0052CC] ring-1 ring-[#0052CC]/20"
            : "bg-white hover:bg-slate-50 border-[#DDE4F3] text-[#17284D]"
          }`}
      >
        <Calendar className={`w-3.5 h-3.5 ${isFiltered ? "text-[#0052CC]" : "text-slate-500"}`} />
        <span>Date: {buttonLabel}</span>
        {isFiltered && (
          <span className="w-2 h-2 rounded-full bg-[#0052CC] inline-block ml-0.5" />
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Floating Popover */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-84 bg-white rounded-2xl border border-[#DDE4F3] shadow-xl z-50 p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-100">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE4F3]">
            <div className="flex items-center space-x-1.5 font-bold text-xs text-[#17284D]">
              <Filter className="w-3.5 h-3.5 text-[#0052CC]" />
              <span>Filter by Date Window</span>
            </div>
            {isFiltered && (
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Quick Presets Grid */}
          <div>
            <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 mb-1.5">
              <Clock className="w-3 h-3 text-[#0052CC]" />
              <span>Quick Presets</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {DATE_PRESETS.map((preset) => {
                const isCurrent = activePresetId === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer border ${isCurrent
                        ? "bg-[#0052CC] text-white border-[#0052CC] shadow-2xs"
                        : "bg-[#F4F6FB] hover:bg-slate-100 text-[#17284D] border-[#DDE4F3]"
                      }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Date Inputs with Explicit Apply */}
          <div className="pt-2 border-t border-[#DDE4F3] space-y-2">
            <div className="text-[11px] font-bold text-slate-500">Custom Date Range</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                  From Date
                </label>
                <input
                  type="date"
                  value={tempFromDate}
                  onChange={(e) => setTempFromDate(e.target.value)}
                  className="w-full bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg px-2 py-1.5 text-xs font-bold text-[#17284D] focus:outline-none focus:bg-white focus:border-[#0052CC] cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-0.5">
                  To Date
                </label>
                <input
                  type="date"
                  value={tempToDate}
                  onChange={(e) => setTempToDate(e.target.value)}
                  className="w-full bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg px-2 py-1.5 text-xs font-bold text-[#17284D] focus:outline-none focus:bg-white focus:border-[#0052CC] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCustom}
                disabled={!tempFromDate && !tempToDate}
                className="px-3.5 py-1.5 rounded-lg bg-[#0052CC] hover:bg-[#003D99] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Date</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
