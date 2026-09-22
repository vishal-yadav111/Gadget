"use client";

import React, { useState, useMemo } from "react";
import DeviceFilterToolbar from "./_components/DeviceFilterToolbar";
import DeviceDataTable from "./_components/DeviceDataTable";
import DeviceDetailDrawer from "./_components/DeviceDetailDrawer";
import BatchIntakeModal from "./_components/BatchIntakeModal";
import { initialDevices, DeviceRecord } from "./_lib/devices-data";
import { Smartphone, Laptop, CheckCircle2, ShieldCheck } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceRecord[]>(initialDevices);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [selectedDevice, setSelectedDevice] = useState<DeviceRecord | null>(null);
  const [batchModalOpen, setBatchModalOpen] = useState(false);

  // Filter computation
  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      // Search matching
      const query = search.toLowerCase();
      const matchSearch =
        !query ||
        d.model.toLowerCase().includes(query) ||
        d.serial.toLowerCase().includes(query) ||
        (d.imei && d.imei.includes(query)) ||
        d.brand.toLowerCase().includes(query) ||
        d.technician.toLowerCase().includes(query);

      // Brand matching
      const matchBrand = brandFilter === "ALL" || d.brand === brandFilter;

      // Grade matching
      const matchGrade = gradeFilter === "ALL" || d.grade === gradeFilter;

      // Type matching
      const matchType = typeFilter === "ALL" || d.type === typeFilter;

      return matchSearch && matchBrand && matchGrade && matchType;
    });
  }, [devices, search, brandFilter, gradeFilter, typeFilter]);

  const handleBatchSuccess = (count: number) => {
    // Simulated batch addition notification
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE4F3] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-[#17284D] tracking-tight">
            Device Fleet & Evaluation Inventory
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6A86] mt-0.5">
            Central ledger of tested hardware, S.M.A.R.T. records, and grading certifications
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#F4F6FB] border border-[#DDE4F3] text-[#17284D]">
            {filteredDevices.length} Devices Displayed
          </span>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <DeviceFilterToolbar
        search={search}
        onSearchChange={setSearch}
        brandFilter={brandFilter}
        onBrandChange={setBrandFilter}
        gradeFilter={gradeFilter}
        onGradeChange={setGradeFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        onOpenBatchModal={() => setBatchModalOpen(true)}
      />

      {/* Device Table */}
      <DeviceDataTable
        devices={filteredDevices}
        onSelectDevice={setSelectedDevice}
      />

      {/* Deep Inspection Drawer */}
      <DeviceDetailDrawer
        device={selectedDevice}
        onClose={() => setSelectedDevice(null)}
      />

      {/* Batch Intake Modal */}
      <BatchIntakeModal
        open={batchModalOpen}
        onClose={() => setBatchModalOpen(false)}
        onSuccess={handleBatchSuccess}
      />
    </div>
  );
}
