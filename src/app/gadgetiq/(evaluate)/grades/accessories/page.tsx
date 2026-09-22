"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Headphones, RefreshCw, Search, CheckCircle2, XCircle, ExternalLink, FileSpreadsheet, AlertCircle } from "lucide-react";
import { gradesService } from "../services";
import { GradeDistributionItem, GradedDeviceItem } from "../types";
import { getFriendlyErrorMessage } from "../../core";
import { renderDeviceConditionBadge } from "../../reports/laptop/page";

export default function GradeReportAccessoriesPage() {
  const [grades, setGrades] = useState<GradeDistributionItem[]>([]);
  const [devices, setDevices] = useState<GradedDeviceItem[]>([]);
  const [totalEvaluated, setTotalEvaluated] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await gradesService.getGradeReport("Accessories");
      setGrades(res.distribution);
      setDevices(res.devices);
      setTotalEvaluated(res.totalEvaluated);
    } catch (err: any) {
      console.error("Failed to load accessories grade report:", err);
      setError(getFriendlyErrorMessage(err, "Unable to load accessories grade distribution. Please check connection."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDevices = devices.filter((d) => {
    const s = search.toLowerCase();
    const matchesSearch =
      !s ||
      d.imei.toLowerCase().includes(s) ||
      d.brand.toLowerCase().includes(s) ||
      d.model.toLowerCase().includes(s) ||
      d.workorderid.toLowerCase().includes(s);

    const matchesGrade = selectedGrade === "all" || d.grade.toLowerCase().includes(selectedGrade.toLowerCase());

    return matchesSearch && matchesGrade;
  });

  const exportCSV = () => {
    const headers = "WorkOrderID,Serial,Brand,Model,Score,Grade,Status,TestedAt\n";
    const rows = filteredDevices
      .map(
        (d) =>
          `"${d.workorderid}","${d.imei}","${d.brand}","${d.model}","${d.score}","${d.grade}","${d.qcResult}","${d.testedAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Accessories_Grade_Report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold font-display text-[#17284D]">Grade Report Accessories</h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0052CC] font-mono text-[11px] font-bold">
                {totalEvaluated} Accessories Graded Live
              </span>
            </div>
            <p className="text-xs text-[#5F6A86]">
              Chargers, adapters, audio peripherals, and accessories grading ledger.
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
            disabled={filteredDevices.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#0052CC] hover:bg-[#003D99] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Grade Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {grades.map((item) => (
          <div key={item.grade} className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span
                className="px-2.5 py-1 rounded-lg text-white font-bold text-[11px]"
                style={{ backgroundColor: item.color }}
              >
                {item.grade}
              </span>
              <span className="text-lg font-black font-display text-[#17284D]">
                {item.count} ({item.percentage}%)
              </span>
            </div>
            <h2 className="font-bold text-xs text-[#17284D]">{item.label}</h2>
            <p className="text-[11px] text-[#5F6A86] line-clamp-2 leading-relaxed">{item.description}</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Graded Accessories Table */}
      <div className="bg-white rounded-2xl border border-[#DDE4F3] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#DDE4F3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="font-bold text-sm text-[#17284D]">
            Peripheral & Accessory Testing Ledger ({filteredDevices.length} items)
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search Serial, Brand, Model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] outline-none"
              />
            </div>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] outline-none cursor-pointer"
            >
              <option value="all">All Grades</option>
              <option value="1A">Grade 1A</option>
              <option value="2A">Grade 2A</option>
              <option value="3A">Grade 3A</option>
              <option value="5E">Grade 5E</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-slate-500">Aggregating live accessories grading...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-sm font-bold text-[#17284D]">Unable to Load Accessories Grade Reports</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-1.5 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003D99] transition-colors cursor-pointer"
            >
              Retry Fetch
            </button>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-[#17284D]">No Graded Accessories Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No accessory evaluation logs match the selected grade filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#DDE4F3] text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Work Order</th>
                  <th className="py-3 px-4">Serial / Tag</th>
                  <th className="py-3 px-4">Peripheral Item</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDE4F3]/70 font-medium">
                {filteredDevices.map((item) => {
                  const isPass = item.qcResult.toLowerCase() === "pass";
                  return (
                    <tr key={item.mstid || item.imei} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0052CC]">{item.workorderid}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#17284D]">{item.imei}</td>
                      <td className="py-3.5 px-4 font-bold text-[#17284D]">
                        {item.brand} {item.model}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#17284D]">{item.score} / 100</td>
                      <td className="py-3.5 px-4">
                        {renderDeviceConditionBadge(item.grade)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                            isPass
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {isPass ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{item.qcResult}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">{item.testedAt}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/gadgetiq/certificate/${item.mstid || item.serviceKey || item.imei}`}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#0052CC] hover:bg-[#0052CC] hover:text-white font-bold text-[11px] transition-colors"
                        >
                          <span>Audit</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
