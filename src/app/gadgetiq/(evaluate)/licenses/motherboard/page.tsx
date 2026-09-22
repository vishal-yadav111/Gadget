"use client";

import React, { useEffect, useState } from "react";
import { FileKey, Search, RefreshCw, FileSpreadsheet, AlertCircle } from "lucide-react";
import { licensesService } from "../services";
import { LicenseBatchItem } from "../types";
import { getFriendlyErrorMessage } from "../../core";

export default function MotherboardLicenseReportPage() {
  const [batches, setBatches] = useState<LicenseBatchItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await licensesService.getLicenseBatches("Motherboard");
      setBatches(data);
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err, "Unable to load live motherboard license batches. Please check server connection."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = batches.filter(
    (b) =>
      !search ||
      (b.batchCode && b.batchCode.toLowerCase().includes(search.toLowerCase())) ||
      (b.companyName && b.companyName.toLowerCase().includes(search.toLowerCase()))
  );

  const exportCSV = () => {
    const headers = "WorkOrderID,Company,Purchased,Utilised,Balance,AllocatedDate,ExpiryDate,Status\n";
    const rows = filtered
      .map(
        (b) =>
          `"${b.batchCode}","${b.companyName}","${b.totalPurchased}","${b.consumed}","${b.remaining}","${b.allocatedDate}","${b.expiryDate}","${b.status}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MB_License_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
            <FileKey className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-display text-[#17284D]">Licence Report (Motherboard)</h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052CC] font-mono text-[11px] font-bold">
                {filtered.length} Live Batches
              </span>
            </div>
            <p className="text-xs text-[#5F6A86]">
              Motherboard hardware testing quota provisioning and consumption ledger.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0052CC]" : ""}`} />
          </button>
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-[#DDE4F3] shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search Motherboard License Batch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#DDE4F3] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Querying live MB license ledger...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-[#17284D]">Unable to Load Motherboard License Batches</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-1.5 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003D99] transition-colors cursor-pointer"
            >
              Retry Fetch
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#DDE4F3] text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Batch Code</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Allocated</th>
                  <th className="py-3 px-4">Used</th>
                  <th className="py-3 px-4">Remaining</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE4F3]/70 font-medium">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-slate-300" />
                        <h3 className="text-sm font-bold text-[#17284D]">No Motherboard License Batches</h3>
                        <p className="text-xs text-slate-500 max-w-sm">
                          No motherboard license allocations found for this partner station.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={String(item.id || item.batchCode)} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0052CC]">{item.batchCode}</td>
                      <td className="py-3.5 px-4 font-bold text-[#17284D]">{item.companyName}</td>
                      <td className="py-3.5 px-4 font-mono font-bold">{item.totalPurchased}</td>
                      <td className="py-3.5 px-4 font-mono text-amber-600 font-bold">{item.consumed}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-600 font-bold">{item.remaining}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
