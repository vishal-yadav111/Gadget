"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarCheck,
  Smartphone,
  Laptop,
  Layers,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { reportsService } from "../services";
import { MonthlySummaryItem } from "../types";
import { getFriendlyErrorMessage } from "../../core";
import { exportToExcel, ExcelColumn } from "@/lib/excel-export";

type CategoryTab = "all" | "mobile" | "laptop";

export default function MonthlySummaryReportPage() {
  const [summaries, setSummaries] = useState<MonthlySummaryItem[]>([]);
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsService.getMonthlySummaries();
      setSummaries(data);
    } catch (err: any) {
      console.error("Failed to load monthly summary:", err);
      setError(
        getFriendlyErrorMessage(
          err,
          "Unable to aggregate monthly telemetry. Please check server connection."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute stats dynamically based on the active category tab
  const totalEvaluations =
    activeTab === "mobile"
      ? summaries.reduce((acc, curr) => acc + curr.mobileEvaluations, 0)
      : activeTab === "laptop"
        ? summaries.reduce((acc, curr) => acc + curr.laptopEvaluations, 0)
        : summaries.reduce((acc, curr) => acc + curr.licensesConsumed, 0);

  const totalPassed =
    activeTab === "mobile"
      ? summaries.reduce((acc, curr) => acc + (curr.mobilePassed ?? 0), 0)
      : activeTab === "laptop"
        ? summaries.reduce((acc, curr) => acc + (curr.laptopPassed ?? 0), 0)
        : summaries.reduce((acc, curr) => acc + curr.totalPassed, 0);

  const totalFailed =
    activeTab === "mobile"
      ? summaries.reduce((acc, curr) => acc + (curr.mobileFailed ?? 0), 0)
      : activeTab === "laptop"
        ? summaries.reduce((acc, curr) => acc + (curr.laptopFailed ?? 0), 0)
        : summaries.reduce((acc, curr) => acc + curr.totalFailed, 0);

  const passEfficiency =
    totalEvaluations > 0 ? Math.round((totalPassed / totalEvaluations) * 100 * 10) / 10 : 0;

  const defectRate =
    totalEvaluations > 0 ? Math.round((totalFailed / totalEvaluations) * 100 * 10) / 10 : 0;

  const handleExportExcel = () => {
    let columns: ExcelColumn[] = [];
    let rows: Record<string, any>[] = [];

    if (activeTab === "mobile") {
      columns = [
        { key: "month", header: "Billing Month" },
        { key: "mobileEvaluations", header: "Mobile Evaluations" },
        { key: "mobilePassed", header: "Passed Checks" },
        { key: "mobileFailed", header: "Defects Quarantined" },
        { key: "passRate", header: "Pass Rate" },
        { key: "defectRate", header: "Defect Rate" },
      ];
      rows = summaries.map((item) => {
        const pass = item.mobilePassRate ?? (item.mobileEvaluations > 0 ? Math.round(((item.mobilePassed ?? 0) / item.mobileEvaluations) * 1000) / 10 : 0);
        const defect = item.mobileDefectRate ?? (item.mobileEvaluations > 0 ? Math.round(((item.mobileFailed ?? 0) / item.mobileEvaluations) * 1000) / 10 : 0);
        return {
          month: item.month,
          mobileEvaluations: item.mobileEvaluations,
          mobilePassed: item.mobilePassed ?? 0,
          mobileFailed: item.mobileFailed ?? 0,
          passRate: `${pass}%`,
          defectRate: `${defect}%`,
        };
      });
    } else if (activeTab === "laptop") {
      columns = [
        { key: "month", header: "Billing Month" },
        { key: "laptopEvaluations", header: "Laptop Evaluations" },
        { key: "laptopPassed", header: "Passed Checks" },
        { key: "laptopFailed", header: "Defects Quarantined" },
        { key: "passRate", header: "Pass Rate" },
        { key: "defectRate", header: "Defect Rate" },
      ];
      rows = summaries.map((item) => {
        const pass = item.laptopPassRate ?? (item.laptopEvaluations > 0 ? Math.round(((item.laptopPassed ?? 0) / item.laptopEvaluations) * 1000) / 10 : 0);
        const defect = item.laptopDefectRate ?? (item.laptopEvaluations > 0 ? Math.round(((item.laptopFailed ?? 0) / item.laptopEvaluations) * 1000) / 10 : 0);
        return {
          month: item.month,
          laptopEvaluations: item.laptopEvaluations,
          laptopPassed: item.laptopPassed ?? 0,
          laptopFailed: item.laptopFailed ?? 0,
          passRate: `${pass}%`,
          defectRate: `${defect}%`,
        };
      });
    } else {
      columns = [
        { key: "month", header: "Billing Month" },
        { key: "mobileEvaluations", header: "Mobile QC" },
        { key: "laptopEvaluations", header: "Laptop QC" },
        { key: "desktopEvaluations", header: "Desktop QC" },
        { key: "totalPassed", header: "Passed Checks" },
        { key: "totalFailed", header: "Defects Quarantined" },
        { key: "licensesConsumed", header: "Licenses Used" },
        { key: "passRate", header: "Pass Rate" },
        { key: "defectRate", header: "Defect Rate" },
      ];
      rows = summaries.map((item) => ({
        month: item.month,
        mobileEvaluations: item.mobileEvaluations,
        laptopEvaluations: item.laptopEvaluations,
        desktopEvaluations: item.desktopEvaluations,
        totalPassed: item.totalPassed,
        totalFailed: item.totalFailed,
        licensesConsumed: item.licensesConsumed,
        passRate: `${item.passRate}%`,
        defectRate: `${item.defectRate}%`,
      }));
    }

    exportToExcel({
      filename: `Monthly_QC_Summary_${activeTab.toUpperCase()}_${new Date().toISOString().split("T")[0]}.xlsx`,
      sheetName: `QC Summary (${activeTab.toUpperCase()})`,
      columns,
      rows,
      title: `QC Monthly Summary Report - ${activeTab.toUpperCase()}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-display text-[#17284D]">QC Monthly Summary Report</h1>
            </div>
            <p className="text-xs text-[#5F6A86]">
              Monthly multi-category evaluation throughput, pass rates, and defect quarantine ledger.
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
            onClick={handleExportExcel}
            disabled={summaries.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
            title="Export summary data to Microsoft Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Category Toggle Tabs */}
      <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-[#DDE4F3] shadow-xs w-fit">
        <button
          onClick={() => setActiveTab("all")}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-[#0052CC] text-white shadow-xs"
              : "text-[#5F6A86] hover:text-[#17284D] hover:bg-[#F4F6FB]"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Evaluations</span>
        </button>
        <button
          onClick={() => setActiveTab("mobile")}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "mobile"
              ? "bg-[#0052CC] text-white shadow-xs"
              : "text-[#5F6A86] hover:text-[#17284D] hover:bg-[#F4F6FB]"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Mobile QC</span>
        </button>
        <button
          onClick={() => setActiveTab("laptop")}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "laptop"
              ? "bg-[#0052CC] text-white shadow-xs"
              : "text-[#5F6A86] hover:text-[#17284D] hover:bg-[#F4F6FB]"
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Laptop QC</span>
        </button>
      </div>

      {/* Aggregate KPI Overview - Computed Dynamically for Selected Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            {activeTab === "mobile" ? "Mobile Evaluations" : activeTab === "laptop" ? "Laptop Evaluations" : "Total Evaluations"}
          </span>
          <span className="text-2xl font-black font-display text-[#17284D] mt-1 block">
            {totalEvaluations.toLocaleString()}
          </span>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
            {activeTab === "mobile" ? "Mobile Station Ledger" : activeTab === "laptop" ? "Laptop Station Ledger" : "Multi-Station Ledger"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Pass Efficiency
          </span>
          <span className="text-2xl font-black font-display text-[#00875A] mt-1 block">
            {passEfficiency}%
          </span>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
            {totalPassed.toLocaleString()} Passed Audits
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Quarantined Defects
          </span>
          <span className="text-2xl font-black font-display text-rose-600 mt-1 block">
            {totalFailed.toLocaleString()}
          </span>
          <span className="text-[11px] font-semibold text-rose-500 mt-1 block">
            Failed Diagnostic Checks
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Quarantine / Defect Rate
          </span>
          <span className="text-2xl font-black font-display text-amber-600 mt-1 block">
            {defectRate}%
          </span>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
            Remediation Burden
          </span>
        </div>
      </div>

      {/* Monthly Summary Breakdown Table */}
      <div className="bg-white rounded-2xl border border-[#DDE4F3] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#DDE4F3] flex items-center justify-between">
          <div className="font-bold text-sm text-[#17284D]">
            Month-by-Month Diagnostic Ledger ({activeTab === "mobile" ? "Mobile QC" : activeTab === "laptop" ? "Laptop QC" : "All Devices"})
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {summaries.length} Billing Periods
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Aggregating monthly summary telemetry...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-[#17284D]">Unable to Load Summaries</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-1.5 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003D99] transition-colors cursor-pointer"
            >
              Retry Fetch
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#DDE4F3] text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              {activeTab === "all" ? (
                <tr>
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4">Mobile QC</th>
                  <th className="py-3 px-4">Laptop QC</th>
                  <th className="py-3 px-4">Desktop QC</th>
                  <th className="py-3 px-4">Passed Checks</th>
                  <th className="py-3 px-4">Defects Quarantined</th>
                  <th className="py-3 px-4">Licenses Used</th>
                  <th className="py-3 px-4 text-center">Pass Rate</th>
                  <th className="py-3 px-4 text-right">Defect Rate</th>
                </tr>
              ) : activeTab === "mobile" ? (
                <tr>
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4">Mobile Evaluated</th>
                  <th className="py-3 px-4">Passed Checks</th>
                  <th className="py-3 px-4">Defects Quarantined</th>
                  <th className="py-3 px-4 text-center">Pass Rate</th>
                  <th className="py-3 px-4 text-right">Defect Rate</th>
                </tr>
              ) : (
                <tr>
                  <th className="py-3 px-4">Billing Month</th>
                  <th className="py-3 px-4">Laptops Evaluated</th>
                  <th className="py-3 px-4">Passed Checks</th>
                  <th className="py-3 px-4">Defects Quarantined</th>
                  <th className="py-3 px-4 text-center">Pass Rate</th>
                  <th className="py-3 px-4 text-right">Defect Rate</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-[#DDE4F3]/70 font-medium">
              {summaries.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "all" ? 9 : 6}
                    className="p-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-300" />
                      <h3 className="text-sm font-bold text-[#17284D]">No Monthly Summaries Found</h3>
                      <p className="text-xs text-slate-500 max-w-sm">
                        No evaluation history available yet.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                summaries.map((item) => {
                  if (activeTab === "mobile") {
                    const passed = item.mobilePassed ?? 0;
                    const failed = item.mobileFailed ?? 0;
                    const total = item.mobileEvaluations;
                    const passRate = item.mobilePassRate ?? (total > 0 ? Math.round((passed / total) * 1000) / 10 : 0);
                    const defectRate = item.mobileDefectRate ?? (total > 0 ? Math.round((failed / total) * 1000) / 10 : 0);
                    return (
                      <tr key={item.month} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#17284D]">{item.month}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0052CC]">{total}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{passed}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-rose-600">{failed}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                          {passRate}%
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">
                          {defectRate}%
                        </td>
                      </tr>
                    );
                  }

                  if (activeTab === "laptop") {
                    const passed = item.laptopPassed ?? 0;
                    const failed = item.laptopFailed ?? 0;
                    const total = item.laptopEvaluations;
                    const passRate = item.laptopPassRate ?? (total > 0 ? Math.round((passed / total) * 1000) / 10 : 0);
                    const defectRate = item.laptopDefectRate ?? (total > 0 ? Math.round((failed / total) * 1000) / 10 : 0);
                    return (
                      <tr key={item.month} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#17284D]">{item.month}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#0052CC]">{total}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">{passed}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-rose-600">{failed}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                          {passRate}%
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">
                          {defectRate}%
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={item.month} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#17284D]">{item.month}</td>
                      <td className="py-3.5 px-4 font-mono">{item.mobileEvaluations}</td>
                      <td className="py-3.5 px-4 font-mono">{item.laptopEvaluations}</td>
                      <td className="py-3.5 px-4 font-mono">{item.desktopEvaluations}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                        {item.totalPassed}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-600">
                        {item.totalFailed}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0052CC]">
                        {item.licensesConsumed}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600">
                        {item.passRate}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600">
                        {item.defectRate}%
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
