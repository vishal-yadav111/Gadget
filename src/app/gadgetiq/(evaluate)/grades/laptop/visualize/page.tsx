"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import {
  Award,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Laptop,
  ArrowLeft,
  Calendar,
  BarChart3,
  TrendingUp,
  HardDrive,
  ShieldCheck,
  Layers,
} from "lucide-react";
import { gradesService } from "../../services";
import { GradeDistributionItem, GradedDeviceItem } from "../../types";
import { getFriendlyErrorMessage } from "../../../core";

export default function LaptopGradeVisualizePage() {
  const [grades, setGrades] = useState<GradeDistributionItem[]>([]);
  const [devices, setDevices] = useState<GradedDeviceItem[]>([]);
  const [totalEvaluated, setTotalEvaluated] = useState(0);

  // Selected Grade Filter (Interactive from Fleet Composition bar)
  const [selectedGrade, setSelectedGrade] = useState("all");

  // Date Range State
  const [fromDate, setFromDate] = useState("2021-01-01");
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [datePreset, setDatePreset] = useState<string>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);

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
  };

  const loadData = async (forceRefresh: boolean = false) => {
    const currentReqId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const res = await gradesService.getLaptopGradeReportPaginated({
        fromDate,
        toDate,
        grade: selectedGrade,
        pageSize: 5000,
        page: 1,
        forceRefresh,
      });

      if (currentReqId === requestIdRef.current) {
        setGrades(res.distribution);
        setDevices(res.devices);
        setTotalEvaluated(res.totalEvaluated);
      }
    } catch (err: any) {
      if (currentReqId === requestIdRef.current) {
        console.error("Failed to load laptop visualization data:", err);
        setError(getFriendlyErrorMessage(err, "Unable to load visualization analytics. Please try again."));
      }
    } finally {
      if (currentReqId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData(false);
  }, [selectedGrade, fromDate, toDate]);

  // Analytics Computation for Visualizer
  const analytics = useMemo(() => {
    let passCount = 0;
    let failCount = 0;
    const brandCounts: Record<string, number> = {};
    const storageCounts: Record<string, number> = {
      "128 GB": 0,
      "256 GB": 0,
      "512 GB": 0,
      "1 TB+": 0,
      "Other": 0,
    };

    devices.forEach((d) => {
      const isPass = (d.qcResult || "").toUpperCase() === "PASS";
      if (isPass) passCount++;
      else failCount++;

      const b = (d.brand || "Other").trim();
      brandCounts[b] = (brandCounts[b] || 0) + 1;

      const s = (d.storage || "").toUpperCase();
      if (s.includes("120") || s.includes("128")) storageCounts["128 GB"]++;
      else if (s.includes("240") || s.includes("256")) storageCounts["256 GB"]++;
      else if (s.includes("500") || s.includes("512")) storageCounts["512 GB"]++;
      else if (s.includes("1.0") || s.includes("1TB") || s.includes("1 TB")) storageCounts["1 TB+"]++;
      else if (s) storageCounts["Other"]++;
    });

    const passRate = devices.length > 0 ? Math.round((passCount / devices.length) * 100) : 100;
    const sortedBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    const topBrand = sortedBrands.length > 0 ? sortedBrands[0] : ["None", 0];
    const dominantGrade = grades.reduce(
      (max, curr) => (curr.count > (max?.count || 0) ? curr : max),
      grades[0]
    );

    return {
      passCount,
      failCount,
      passRate,
      sortedBrands,
      storageCounts,
      topBrand,
      dominantGrade,
    };
  }, [devices, grades]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with Breadcrumb & Navigation */}
      <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <Link
            href="/gadgetiq/grades/laptop"
            className="w-10 h-10 rounded-xl bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-slate-700 flex items-center justify-center transition-all cursor-pointer group"
            title="Back to Laptop Grade Ledger"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div>
            <div className="flex items-center space-x-2.5 flex-wrap">
              <h1 className="text-xl font-bold font-display text-[#17284D]">Laptop Grade Visualizer & Analytics</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0052CC] font-mono text-[11px] font-bold">
                {totalEvaluated.toLocaleString()} Total Evaluated
              </span>
            </div>
            <p className="text-xs text-[#5F6A86] mt-0.5">
              Live telemetry charts, cosmetic composition breakdown, brand distribution, and diagnostic health.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 flex-wrap">
          {/* Quick Date Presets */}
          <div className="flex items-center bg-[#F4F6FB] p-1 rounded-xl border border-[#DDE4F3] text-[11px] font-semibold text-slate-600">
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

          {/* Custom Date Range Picker */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-[#F4F6FB] px-2.5 py-1.5 rounded-xl border border-[#DDE4F3] text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setDatePreset("custom");
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
              }}
              className="bg-transparent text-[11px] font-semibold text-slate-700 outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => loadData(true)}
            className="p-2 rounded-xl bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] transition-colors cursor-pointer"
            title="Refresh Analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#0052CC]" : ""}`} />
          </button>

          <Link
            href="/gadgetiq/grades/laptop"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Ledger</span>
          </Link>
        </div>
      </div>

      {/* 2. High-Level KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Volume */}
        <div className="bg-white rounded-2xl p-4 border border-[#DDE4F3] shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Laptops In Scope</div>
            <div className="text-2xl font-black font-display text-[#17284D]">{devices.length.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500">Out of {totalEvaluated.toLocaleString()} evaluated</div>
          </div>
        </div>

        {/* Diagnostic Pass Rate */}
        <div className="bg-white rounded-2xl p-4 border border-[#DDE4F3] shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">QC Pass Rate</div>
            <div className="text-2xl font-black font-display text-emerald-600">{analytics.passRate}%</div>
            <div className="text-[11px] text-slate-500">{analytics.passCount} passed / {analytics.failCount} failed</div>
          </div>
        </div>

        {/* Dominant Grade */}
        <div className="bg-white rounded-2xl p-4 border border-[#DDE4F3] shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Dominant Grade Tier</div>
            <div className="text-base font-bold font-display text-[#17284D] truncate">
              {analytics.dominantGrade?.label?.split("/")[0]?.trim() || "Good (C)"}
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {analytics.dominantGrade?.count || 0} units ({analytics.dominantGrade?.percentage || 0}%)
            </div>
          </div>
        </div>

        {/* Top Brand */}
        <div className="bg-white rounded-2xl p-4 border border-[#DDE4F3] shadow-xs flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Laptop className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Leading Brand Share</div>
            <div className="text-xl font-black font-display text-[#17284D] truncate">{analytics.topBrand[0]}</div>
            <div className="text-[11px] text-slate-500">
              {analytics.topBrand[1]} units (
              {devices.length > 0 ? Math.round(((analytics.topBrand[1] as number) / devices.length) * 100) : 0}%)
            </div>
          </div>
        </div>
      </div>

      {/* 3. Fleet Cosmetic Composition Multi-Segment Bar */}
      {totalEvaluated > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 font-bold text-[#17284D]">
              <BarChart3 className="w-4 h-4 text-[#0052CC]" />
              <span className="text-sm">Fleet Cosmetic Distribution Composition</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Click any grade segment to filter analytics</span>
          </div>

          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            {grades.map((item) => {
              const gradeKey = item.grade.toLowerCase().includes("1a")
                ? "1a"
                : item.grade.toLowerCase().includes("2a")
                ? "2a"
                : item.grade.toLowerCase().includes("3a")
                ? "3a"
                : item.grade.toLowerCase().includes("4a")
                ? "4a"
                : "5e";

              const isSelected = selectedGrade === gradeKey;

              return (
                <div
                  key={item.grade}
                  onClick={() => setSelectedGrade(isSelected ? "all" : gradeKey)}
                  className={`h-full transition-all duration-300 cursor-pointer hover:opacity-85 ${
                    isSelected ? "ring-2 ring-white ring-inset" : ""
                  }`}
                  style={{
                    width: `${Math.max(item.percentage, item.count > 0 ? 3 : 0)}%`,
                    backgroundColor: item.color,
                  }}
                  title={`${item.label}: ${item.count} Laptops (${item.percentage}%) - Click to filter`}
                />
              );
            })}
          </div>

          {/* Legend Badges */}
          <div className="flex items-center gap-2.5 flex-wrap pt-1 text-[11px]">
            {grades.map((item) => {
              const gradeKey = item.grade.toLowerCase().includes("1a")
                ? "1a"
                : item.grade.toLowerCase().includes("2a")
                ? "2a"
                : item.grade.toLowerCase().includes("3a")
                ? "3a"
                : item.grade.toLowerCase().includes("4a")
                ? "4a"
                : "5e";

              const isSelected = selectedGrade === gradeKey;

              return (
                <button
                  key={item.grade}
                  onClick={() => setSelectedGrade(isSelected ? "all" : gradeKey)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 font-bold shadow-xs"
                      : "bg-[#F8FAFC] border-[#DDE4F3] text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.label.split("/")[0].trim()}</span>
                  <span className="font-mono font-bold opacity-80">
                    ({item.count} · {item.percentage}%)
                  </span>
                </button>
              );
            })}

            {selectedGrade !== "all" && (
              <button
                onClick={() => setSelectedGrade("all")}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer ml-auto"
              >
                Reset Grade Filter
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. 5-Tier Grade Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {grades.map((item) => {
          const isA = item.grade.toLowerCase().includes("1a") || item.grade.toLowerCase().includes("category a");
          const isB = item.grade.toLowerCase().includes("2a") || item.grade.toLowerCase().includes("category b");
          const isC = item.grade.toLowerCase().includes("3a") || item.grade.toLowerCase().includes("category c");
          const isD = item.grade.toLowerCase().includes("4a") || item.grade.toLowerCase().includes("category d");

          const gradeKey = isA ? "1a" : isB ? "2a" : isC ? "3a" : isD ? "4a" : "5e";
          const isSelected = selectedGrade === gradeKey;

          const bgActive = isA
            ? "bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-500/20"
            : isB
            ? "bg-emerald-50/30 border-emerald-600 ring-2 ring-emerald-600/20"
            : isC
            ? "bg-blue-50/40 border-[#0052CC] ring-2 ring-[#0052CC]/20"
            : isD
            ? "bg-amber-50/40 border-amber-500 ring-2 ring-amber-500/20"
            : "bg-rose-50/40 border-rose-500 ring-2 ring-rose-500/20";

          return (
            <div
              key={item.grade}
              onClick={() => setSelectedGrade(isSelected ? "all" : gradeKey)}
              className={`bg-white rounded-2xl p-4 border shadow-xs space-y-2.5 cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md ${
                isSelected ? bgActive : "border-[#DDE4F3] hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-1 rounded-lg text-white font-bold text-[10px] tracking-wide uppercase shadow-xs"
                  style={{ backgroundColor: item.color }}
                >
                  {isA ? "Tier A" : isB ? "Tier B" : isC ? "Tier C" : isD ? "Tier D" : "Tier E / Defect"}
                </span>
                <span className="text-lg font-black font-display text-[#17284D]">
                  {item.count.toLocaleString()}{" "}
                  <span className="text-[11px] font-semibold text-slate-400 font-mono">({item.percentage}%)</span>
                </span>
              </div>

              <div>
                <h2 className="font-bold text-xs text-[#17284D] flex items-center justify-between">
                  <span>{item.label}</span>
                  {isSelected && <span className="text-[10px] font-bold text-[#0052CC]">Active</span>}
                </h2>
                <p className="text-[11px] text-[#5F6A86] line-clamp-2 leading-relaxed mt-0.5">{item.description}</p>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Visual Breakdown Dashboards (Brand Share, Diagnostic Health, Storage) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* A. Diagnostic Pass vs Fail Health Ratio */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#17284D] flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>QC Diagnostic Health</span>
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {analytics.passRate}% Pass Rate
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">Passed Hardware Tests</span>
                </span>
                <span className="font-bold text-[#17284D] font-mono">{analytics.passCount} Units ({analytics.passRate}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${analytics.passRate}%` }}
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center space-x-1.5">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span className="font-semibold">Failed / Quarantined</span>
                </span>
                <span className="font-bold text-[#17284D] font-mono">{analytics.failCount} Units ({100 - analytics.passRate}%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${100 - analytics.passRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* B. Top Laptop Brands Share Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#17284D] flex items-center space-x-1.5">
              <Laptop className="w-4 h-4 text-[#0052CC]" />
              <span>Top Laptop Brands</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">By Volume</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {analytics.sortedBrands.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6">No brand data available</div>
            ) : (
              analytics.sortedBrands.map(([brand, count]) => {
                const pct = devices.length > 0 ? Math.round((count / devices.length) * 100) : 0;
                return (
                  <div key={brand} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{brand}</span>
                      <span className="font-mono text-slate-500 font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#0052CC] h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* C. Storage Capacities Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-[#DDE4F3] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#17284D] flex items-center space-x-1.5">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              <span>Storage Tier Breakdown</span>
            </span>
            <span className="text-xs text-slate-400 font-medium">SSD/HDD</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {Object.entries(analytics.storageCounts).map(([tier, count]) => {
              const pct = devices.length > 0 ? Math.round((count / devices.length) * 100) : 0;
              return (
                <div key={tier} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{tier}</span>
                    <span className="font-mono text-slate-500 font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
