"use client";

import React from "react";
import { Search, Filter, Plus, Download, SlidersHorizontal } from "lucide-react";
import Button from "@/components/ui/Button";

interface DeviceFilterToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  brandFilter: string;
  onBrandChange: (v: string) => void;
  gradeFilter: string;
  onGradeChange: (v: string) => void;
  typeFilter: string;
  onTypeChange: (v: string) => void;
  onOpenBatchModal: () => void;
}

export default function DeviceFilterToolbar({
  search,
  onSearchChange,
  brandFilter,
  onBrandChange,
  gradeFilter,
  onGradeChange,
  typeFilter,
  onTypeChange,
  onOpenBatchModal,
}: DeviceFilterToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#DDE4F3] shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6A86]" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by serial, IMEI, model, technician..."
          className="w-full pl-9 pr-3 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] placeholder-[#5F6A86] focus:outline-none focus:border-[#0052CC] focus:bg-white transition-all font-sans"
        />
      </div>

      {/* Filter Selects */}
      <div className="flex items-center flex-wrap gap-2">
        {/* Brand Filter */}
        <select
          value={brandFilter}
          onChange={(e) => onBrandChange(e.target.value)}
          className="px-3 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] font-medium focus:outline-none focus:border-[#0052CC] cursor-pointer"
        >
          <option value="ALL">All Brands</option>
          <option value="Apple">Apple</option>
          <option value="Lenovo">Lenovo</option>
          <option value="Dell">Dell</option>
          <option value="HP">HP</option>
          <option value="Samsung">Samsung</option>
          <option value="Asus">Asus</option>
          <option value="Microsoft">Microsoft</option>
        </select>

        {/* Grade Filter */}
        <select
          value={gradeFilter}
          onChange={(e) => onGradeChange(e.target.value)}
          className="px-3 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] font-medium focus:outline-none focus:border-[#0052CC] cursor-pointer"
        >
          <option value="ALL">All Grades</option>
          <option value="Grade A">Grade A (90-100)</option>
          <option value="Grade B">Grade B (80-89)</option>
          <option value="Grade C">Grade C (60-79)</option>
          <option value="Failed">Quarantine Fail (&lt;60)</option>
        </select>

        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-3 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] font-medium focus:outline-none focus:border-[#0052CC] cursor-pointer"
        >
          <option value="ALL">All Form Factors</option>
          <option value="Laptop">Laptops</option>
          <option value="Smartphone">Smartphones</option>
          <option value="Tablet">Tablets</option>
        </select>

        {/* Ingest CTA */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={onOpenBatchModal}
          className="shrink-0"
        >
          Batch Ingest
        </Button>
      </div>
    </div>
  );
}
