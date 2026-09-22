"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ListFilter,
} from "lucide-react";

export interface ReportsPaginationProps {
  currentPage?: number;
  page?: number;
  totalPages: number;
  pageSize: number;
  totalRecords: number;
  currentCount?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
  disabled?: boolean;
}

export const ReportsPagination: React.FC<ReportsPaginationProps> = ({
  currentPage,
  page,
  totalPages,
  pageSize,
  totalRecords,
  currentCount = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100, 250],
  disabled = false,
}) => {
  const [jumpInput, setJumpInput] = useState("");
  const activePage = currentPage ?? page ?? 1;

  const effectiveTotalPages = Math.max(1, totalPages);
  const startRecord =
    totalRecords > 0 ? (activePage - 1) * pageSize + 1 : 0;
  const endRecord =
    totalRecords > 0
      ? Math.min(
          startRecord + (currentCount > 0 ? currentCount - 1 : pageSize - 1),
          totalRecords
        )
      : 0;

  // Smart page numbers pagination algorithm
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (effectiveTotalPages <= 7) {
      for (let i = 1; i <= effectiveTotalPages; i++) {
        pages.push(i);
      }
    } else {
      if (activePage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", effectiveTotalPages);
      } else if (activePage >= effectiveTotalPages - 3) {
        pages.push(
          1,
          "...",
          effectiveTotalPages - 4,
          effectiveTotalPages - 3,
          effectiveTotalPages - 2,
          effectiveTotalPages - 1,
          effectiveTotalPages
        );
      } else {
        pages.push(
          1,
          "...",
          activePage - 1,
          activePage,
          activePage + 1,
          "...",
          effectiveTotalPages
        );
      }
    }
    return pages;
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetPage = parseInt(jumpInput, 10);
    if (!isNaN(targetPage) && targetPage >= 1 && targetPage <= effectiveTotalPages) {
      onPageChange(targetPage);
      setJumpInput("");
    }
  };

  return (
    <div className="p-4 border-t border-[#DDE4F3] bg-[#F8FAFC] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#5F6A86]">
      {/* Left: Entries Info & Rows Per Page */}
      <div className="flex flex-wrap items-center gap-3.5">
        <div className="flex items-center space-x-1.5 font-medium">
          <span>Showing</span>
          <span className="font-bold text-[#17284D]">{startRecord}</span>
          <span>to</span>
          <span className="font-bold text-[#17284D]">{endRecord}</span>
          <span>of</span>
          <span className="font-bold text-[#17284D]">{totalRecords.toLocaleString()}</span>
          <span>entries</span>
        </div>

        <div className="h-4 w-[1px] bg-slate-300 hidden sm:block" />

        <div className="flex items-center space-x-2">
          <ListFilter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-500">Rows per page:</span>
          <select
            value={pageSize}
            disabled={disabled}
            onChange={(e) => {
              const newSize = parseInt(e.target.value, 10);
              onPageSizeChange(newSize);
            }}
            className="px-2.5 py-1 bg-white border border-[#DDE4F3] rounded-lg text-xs font-bold text-[#17284D] focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20 cursor-pointer disabled:opacity-50"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Pagination Controls & Jump Input */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-1">
          {/* First Page */}
          <button
            type="button"
            title="First Page"
            disabled={disabled || activePage <= 1}
            onClick={() => onPageChange(1)}
            className="p-1.5 rounded-lg border border-[#DDE4F3] bg-white text-[#17284D] font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F4F6FB] transition-colors cursor-pointer"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Page */}
          <button
            type="button"
            title="Previous Page"
            disabled={disabled || activePage <= 1}
            onClick={() => onPageChange(activePage - 1)}
            className="px-2.5 py-1.5 rounded-lg border border-[#DDE4F3] bg-white text-[#17284D] font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F4F6FB] transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1 px-1">
            {getPageNumbers().map((p, idx) => {
              if (p === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 font-bold text-xs select-none"
                  >
                    ...
                  </span>
                );
              }

              const pageNum = Number(p);
              const isActive = activePage === pageNum;

              return (
                <button
                  key={`page-${pageNum}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-[30px] h-7 px-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0052CC] text-white shadow-xs"
                      : "bg-white border border-[#DDE4F3] text-[#17284D] hover:bg-[#F4F6FB]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Page */}
          <button
            type="button"
            title="Next Page"
            disabled={disabled || activePage >= effectiveTotalPages}
            onClick={() => onPageChange(activePage + 1)}
            className="px-2.5 py-1.5 rounded-lg border border-[#DDE4F3] bg-white text-[#17284D] font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F4F6FB] transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Last Page */}
          <button
            type="button"
            title="Last Page"
            disabled={disabled || activePage >= effectiveTotalPages}
            onClick={() => onPageChange(effectiveTotalPages)}
            className="p-1.5 rounded-lg border border-[#DDE4F3] bg-white text-[#17284D] font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#F4F6FB] transition-colors cursor-pointer"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Jump */}
        {effectiveTotalPages > 5 && (
          <form
            onSubmit={handleJumpSubmit}
            className="flex items-center space-x-1.5 pl-1.5 border-l border-slate-200"
          >
            <span className="text-[11px] text-slate-400 hidden lg:inline">Go to:</span>
            <input
              type="number"
              min={1}
              max={effectiveTotalPages}
              value={jumpInput}
              disabled={disabled}
              placeholder={`${activePage}`}
              onChange={(e) => setJumpInput(e.target.value)}
              className="w-12 px-1.5 py-1 text-center bg-white border border-[#DDE4F3] rounded-lg text-xs font-bold text-[#17284D] focus:outline-none focus:ring-1 focus:ring-[#0052CC]"
            />
            <button
              type="submit"
              disabled={disabled || !jumpInput}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-[#0052CC] hover:text-white disabled:opacity-40 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Go
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
