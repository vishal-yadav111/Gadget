"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  FileText,
  Star,
  TrendingUp,
  Trophy,
  Medal,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  BarChart3,
  LineChart,
} from "lucide-react";
import { dashboardService } from "./services";
import { DashboardStats } from "./types";
import { getFriendlyErrorMessage } from "../core";

export default function LensDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [hoveredDayIdx, setHoveredDayIdx] = useState<number | null>(null);

  useEffect(() => {
    dashboardService
      .getStats()
      .then((data) => setStats(data))
      .catch((err) => {
        console.error("Failed to load dashboard stats:", err);
        setError(
          getFriendlyErrorMessage(
            err,
            "Unable to load dashboard statistics. Please check server status."
          )
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 sm:h-28 rounded-[12px] bg-white border border-[#DDE4F3]"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-7 h-80 sm:h-96 rounded-[12px] bg-white border border-[#DDE4F3]" />
          <div className="lg:col-span-5 h-80 sm:h-96 rounded-[12px] bg-white border border-[#DDE4F3]" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 sm:p-8 rounded-[12px] bg-white border border-[#DDE4F3] text-center max-w-lg mx-auto my-8 sm:my-12 shadow-xs">
        <div className="w-12 h-12 rounded-[8px] bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm sm:text-base font-bold text-[#17284D]">
          Unable to Load Dashboard Data
        </h3>
        <p className="text-xs text-[#5F6A86] mt-1 mb-4">
          {error || "Could not retrieve stats. Please verify server connection."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-[8px] bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003D99] transition-colors cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Parse Reports Trend Data
  const rawReportsPerDay = stats.reportsPerDay || [];
  // Sort chronologically
  const reportsPerDay = [...rawReportsPerDay].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalTrendReports = reportsPerDay.reduce(
    (acc, curr) => acc + (Number(curr.count) || 0),
    0
  );
  const maxDayCount = Math.max(
    ...reportsPerDay.map((d) => Number(d.count) || 0),
    1
  );

  // Parse Grade Distribution Data
  const gradeDist = stats.gradeDistribution || {};
  const totalGradedUnits = Object.values(gradeDist).reduce(
    (sum, v) => sum + (Number(v) || 0),
    0
  );

  // Get active grades sorted by count descending, then other common grades
  const activeGrades = Object.keys(gradeDist).filter(
    (g) => Number(gradeDist[g]) > 0
  );
  const fallbackGrades = ["5E", "5A", "4A", "3A", "2A", "1A"];
  const allGrades = Array.from(
    new Set([...activeGrades, ...fallbackGrades, ...Object.keys(gradeDist)])
  ).filter((g) => g && g !== "null" && g !== "undefined");

  // Sort: active grades with counts > 0 first (descending), then remaining
  allGrades.sort((a, b) => {
    const countA = Number(gradeDist[a]) || 0;
    const countB = Number(gradeDist[b]) || 0;
    if (countA > 0 || countB > 0) return countB - countA;
    return a.localeCompare(b);
  });

  const maxGradeCount = Math.max(
    ...allGrades.map((g) => Number(gradeDist[g]) || 0),
    1
  );

  const getGradeColor = (g: string) => {
    if (g.startsWith("1")) return "#00875A";
    if (g.startsWith("2")) return "#10B981";
    if (g.startsWith("3")) return "#8A5600";
    if (g.startsWith("4")) return "#F97316";
    if (g.startsWith("5")) return "#0052CC";
    return "#0052CC";
  };

  const topGraders = stats.topGraders || [];

  // SVG Trend Chart Coordinate Generator
  const svgWidth = 560;
  const svgHeight = 200;
  const padLeft = 40;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 35;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  // Y-axis Ticks (e.g. 0, max/2, max)
  const yTickMax = maxDayCount <= 4 ? maxDayCount : Math.ceil(maxDayCount * 1.2);
  const yTicks = [
    yTickMax,
    Math.round(yTickMax * 0.66) || Math.ceil(yTickMax / 2),
    Math.round(yTickMax * 0.33) || 1,
    0,
  ].filter((v, i, arr) => arr.indexOf(v) === i);

  // Compute (x, y) coordinates for each report data point
  const chartPoints = reportsPerDay.map((d, i) => {
    const count = Number(d.count) || 0;
    const x =
      reportsPerDay.length === 1
        ? padLeft + plotW / 2
        : padLeft + (i / (reportsPerDay.length - 1)) * plotW;
    const y = padTop + plotH - (count / (yTickMax || 1)) * plotH;
    return { x, y, count, date: d.date };
  });

  // Smooth Bezier Curve Path Builder
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    if (pts.length === 2) {
      return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
    }

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 5;
      const cp1y = p1.y + (p2.y - p0.y) / 5;
      const cp2x = p2.x - (p3.x - p1.x) / 5;
      const cp2y = p2.y - (p3.y - p1.y) / 5;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const linePathD = generateSmoothPath(chartPoints);
  const areaPathD =
    chartPoints.length > 0
      ? `${linePathD} L ${chartPoints[chartPoints.length - 1].x} ${padTop + plotH} L ${chartPoints[0].x} ${padTop + plotH} Z`
      : "";

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* 4 Responsive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Users */}
        <div className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#DDE4F3] shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-[#5F6A86] uppercase tracking-wider block truncate">
              Total Users
            </span>
            <span className="text-xl sm:text-2xl font-bold font-display text-[#17284D] leading-tight block">
              {stats.totalUsers ?? 0}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#5F6A86] block truncate">
              Registered staff & admins
            </span>
          </div>
        </div>

        {/* Total Reports */}
        <div className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#DDE4F3] shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] bg-emerald-50 text-[#00875A] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-[#5F6A86] uppercase tracking-wider block truncate">
              Total Reports
            </span>
            <span className="text-xl sm:text-2xl font-bold font-display text-[#17284D] leading-tight block">
              {stats.totalReports ?? 0}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#5F6A86] block truncate">
              Complete QC inspections
            </span>
          </div>
        </div>

        {/* Avg Score */}
        <div className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#DDE4F3] shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] bg-amber-50 text-[#8A5600] flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-[#5F6A86] uppercase tracking-wider block truncate">
              Avg. Score
            </span>
            <span className="text-xl sm:text-2xl font-bold font-display text-[#17284D] leading-tight block">
              {typeof stats.avgScore === "number"
                ? stats.avgScore.toFixed(1)
                : stats.avgScore || "—"}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#5F6A86] block truncate">
              Across all evaluated units
            </span>
          </div>
        </div>

        {/* Reports Today */}
        <div className="p-4 sm:p-5 rounded-[14px] bg-white border border-[#DDE4F3] shadow-xs flex items-center space-x-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[10px] bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] sm:text-xs font-bold text-[#5F6A86] uppercase tracking-wider block truncate">
              Reports Today
            </span>
            <span className="text-xl sm:text-2xl font-bold font-display text-[#17284D] leading-tight block">
              {stats.reportsToday ?? 0}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#5F6A86] block truncate">
              Submitted in past 24h
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Inspections Volume Trend High-Fidelity Chart */}
        <div className="lg:col-span-7 p-4 sm:p-6 rounded-[14px] bg-white border border-[#DDE4F3] shadow-xs flex flex-col justify-between">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 border-b border-[#DDE4F3] gap-2.5">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold font-display text-[#17284D]">
                  Inspections Volume Trend
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0052CC] text-[10px] font-bold">
                  {totalTrendReports} Reports
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-[#5F6A86] block mt-0.5">
                Daily inspection throughput ({reportsPerDay.length} recorded dates)
              </span>
            </div>

            <div className="flex items-center space-x-2 self-start sm:self-auto">
              {/* Area / Bar Chart Mode Toggle */}
              <div className="flex items-center bg-[#F4F6FB] p-0.5 rounded-[8px] border border-[#DDE4F3]">
                <button
                  type="button"
                  onClick={() => setChartType("area")}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                    chartType === "area"
                      ? "bg-white text-[#0052CC] shadow-xs"
                      : "text-[#5F6A86] hover:text-[#17284D]"
                  }`}
                  title="Smooth Area Trendline"
                >
                  <LineChart className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Trend</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartType("bar")}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                    chartType === "bar"
                      ? "bg-white text-[#0052CC] shadow-xs"
                      : "text-[#5F6A86] hover:text-[#17284D]"
                  }`}
                  title="Column Bar Chart"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Bars</span>
                </button>
              </div>

              <Link
                href="/gadgetiq/reports"
                className="px-2.5 py-1 rounded-[8px] bg-white border border-[#DDE4F3] text-xs font-bold text-[#0052CC] hover:bg-blue-50 transition-colors flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="mt-4 sm:mt-5">
            {reportsPerDay.length === 0 ? (
              <div className="h-52 sm:h-64 flex flex-col items-center justify-center text-xs text-[#5F6A86] space-y-2">
                <FileText className="w-8 h-8 text-slate-300" />
                <span>No inspection activity recorded yet.</span>
              </div>
            ) : chartType === "area" ? (
              /* --- SVG Area & Line Spline Chart --- */
              <div className="relative w-full overflow-hidden">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-52 sm:h-64 overflow-visible select-none"
                >
                  <defs>
                    <linearGradient
                      id="lensTrendGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#0052CC" stopOpacity="0.32" />
                      <stop offset="60%" stopColor="#0052CC" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#0052CC" stopOpacity="0.00" />
                    </linearGradient>
                    <filter
                      id="pointShadow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="2"
                        stdDeviation="2"
                        floodColor="#0052CC"
                        floodOpacity="0.25"
                      />
                    </filter>
                  </defs>

                  {/* Horizontal Gridlines & Y-Axis Scale Labels */}
                  {yTicks.map((val, idx) => {
                    const yPos =
                      padTop + plotH - (val / (yTickMax || 1)) * plotH;
                    return (
                      <g key={idx}>
                        <line
                          x1={padLeft}
                          y1={yPos}
                          x2={svgWidth - padRight}
                          y2={yPos}
                          stroke="#E9EEF9"
                          strokeWidth="1"
                          strokeDasharray={val === 0 ? "none" : "3,3"}
                        />
                        <text
                          x={padLeft - 10}
                          y={yPos + 3.5}
                          textAnchor="end"
                          className="fill-[#5F6A86] text-[10px] font-mono font-bold"
                        >
                          {val}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area Fill Gradient */}
                  {areaPathD && (
                    <path
                      d={areaPathD}
                      fill="url(#lensTrendGradient)"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Smooth Line Curve */}
                  {linePathD && (
                    <path
                      d={linePathD}
                      fill="none"
                      stroke="#0052CC"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Interactive Nodes, Hover Triggers & Badges */}
                  {chartPoints.map((pt, i) => {
                    const dateObj = new Date(pt.date);
                    const formattedDate = dateObj.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    });
                    const isHovered = hoveredDayIdx === i;

                    return (
                      <g
                        key={i}
                        className="cursor-pointer group"
                        onMouseEnter={() => setHoveredDayIdx(i)}
                        onMouseLeave={() => setHoveredDayIdx(null)}
                      >
                        {/* Hover vertical guide line */}
                        {isHovered && (
                          <line
                            x1={pt.x}
                            y1={padTop}
                            x2={pt.x}
                            y2={padTop + plotH}
                            stroke="#0052CC"
                            strokeWidth="1.5"
                            strokeDasharray="2,2"
                            opacity="0.6"
                          />
                        )}

                        {/* Outer Glow Halo */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 11 : 7}
                          className="fill-[#0052CC]/20 transition-all duration-200"
                        />

                        {/* Core Data Point */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isHovered ? 5.5 : 4}
                          className="fill-[#0052CC] stroke-white stroke-2 transition-all duration-200"
                          filter="url(#pointShadow)"
                        />

                        {/* Count Pill Badge above Node */}
                        <g transform={`translate(${pt.x}, ${pt.y - 14})`}>
                          <rect
                            x="-11"
                            y="-11"
                            width="22"
                            height="15"
                            rx="4"
                            className={`${
                              isHovered
                                ? "fill-[#0052CC]"
                                : "fill-[#17284D]"
                            } transition-colors shadow-xs`}
                          />
                          <text
                            x="0"
                            y="0"
                            textAnchor="middle"
                            className="fill-white text-[9.5px] font-bold font-mono"
                          >
                            {pt.count}
                          </text>
                        </g>

                        {/* X-Axis Date Label */}
                        <text
                          x={pt.x}
                          y={svgHeight - 10}
                          textAnchor="middle"
                          className={`text-[10px] font-mono transition-colors ${
                            isHovered
                              ? "fill-[#0052CC] font-bold"
                              : "fill-[#5F6A86] font-medium"
                          }`}
                        >
                          {formattedDate}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              /* --- Column Bar Chart View --- */
              <div className="h-52 sm:h-64 flex items-end justify-around gap-2 sm:gap-4 px-4 pb-6 pt-8 border-b border-[#E9EEF9] bg-gradient-to-t from-[#F8FAFD] to-transparent rounded-[8px]">
                {reportsPerDay.map((d, i) => {
                  const count = Number(d.count) || 0;
                  const heightPercent = Math.max(
                    Math.round((count / maxDayCount) * 100),
                    12
                  );
                  const dateObj = new Date(d.date);
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  });
                  const isHovered = hoveredDayIdx === i;

                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-2 group relative max-w-[70px] cursor-pointer"
                      onMouseEnter={() => setHoveredDayIdx(i)}
                      onMouseLeave={() => setHoveredDayIdx(null)}
                    >
                      {/* Floating Count Badge */}
                      <span
                        className={`text-[11px] font-mono font-black transition-all ${
                          isHovered ? "text-[#0052CC] scale-110" : "text-[#17284D]"
                        }`}
                      >
                        {count}
                      </span>

                      {/* Bar Pillar */}
                      <div className="w-full h-36 flex items-end bg-[#E9EEF9]/60 rounded-t-[8px] p-1">
                        <div
                          className={`w-full rounded-t-[6px] transition-all duration-300 ${
                            isHovered
                              ? "bg-[#0052CC] shadow-md shadow-blue-500/20"
                              : "bg-gradient-to-t from-[#003D99] to-[#0052CC]"
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      {/* Date Badge */}
                      <span
                        className={`text-[10px] font-mono transition-colors whitespace-nowrap ${
                          isHovered
                            ? "text-[#0052CC] font-bold"
                            : "text-[#5F6A86]"
                        }`}
                      >
                        {formattedDate}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Footer Summary Metrics */}
          <div className="pt-3.5 border-t border-[#DDE4F3] mt-2 flex flex-wrap items-center justify-between text-xs text-[#5F6A86] gap-2">
            <div className="flex items-center space-x-3">
              <span>
                Peak:{" "}
                <strong className="text-[#17284D] font-mono">
                  {maxDayCount} reports/day
                </strong>
              </span>
              <span>•</span>
              <span>
                Avg:{" "}
                <strong className="text-[#17284D] font-mono">
                  {(totalTrendReports / (reportsPerDay.length || 1)).toFixed(1)}{" "}
                  reports/day
                </strong>
              </span>
            </div>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Live Telemetry Connected</span>
            </span>
          </div>
        </div>

        {/* Grade Distribution Chart */}
        <div className="lg:col-span-5 p-4 sm:p-6 rounded-[14px] bg-white border border-[#DDE4F3] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#DDE4F3]">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold font-display text-[#17284D]">
                  Grade Distribution
                </h2>
                {totalGradedUnits > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#00875A] text-[10px] font-bold">
                    {totalGradedUnits} Units
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs text-[#5F6A86]">
                Overall device grades evaluated
              </span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-[#00875A] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#00875A]" />
              <span className="hidden sm:inline">Certified QC</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {allGrades.map((grade) => {
              const count = Number(gradeDist[grade]) || 0;
              const percent =
                totalGradedUnits > 0
                  ? Math.round((count / totalGradedUnits) * 100)
                  : Math.round((count / maxGradeCount) * 100);
              const color = getGradeColor(grade);
              const isActive = count > 0;

              return (
                <div
                  key={grade}
                  className={`p-2 rounded-[8px] transition-colors ${
                    isActive
                      ? "bg-blue-50/40 border border-blue-100"
                      : "opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-extrabold text-[#17284D] text-xs">
                        Grade {grade}
                      </span>
                      {isActive && (
                        <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#0052CC] text-white">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <span className="font-bold text-[#17284D]">
                        {count} {count === 1 ? "unit" : "units"}
                      </span>
                      <span className="text-[#5F6A86] text-[10px]">
                        ({percent}%)
                      </span>
                    </div>
                  </div>

                  <div className="h-2 sm:h-2.5 rounded-full bg-[#E9EEF9] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(percent, count > 0 ? 8 : 0)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Graders Leaderboard */}
      <div className="p-4 sm:p-6 rounded-[14px] bg-white border border-[#DDE4F3] shadow-xs">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#DDE4F3]">
          <div>
            <h2 className="text-sm sm:text-base font-bold font-display text-[#17284D]">
              Technician Leaderboard
            </h2>
            <span className="text-[11px] sm:text-xs text-[#5F6A86]">
              Top grading technicians by verified volume
            </span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-[6px] bg-blue-50 border border-blue-200 text-[11px] sm:text-xs font-bold text-[#0052CC]">
            <Sparkles className="w-3.5 h-3.5 text-[#0052CC]" />
            <span>Station Metrics</span>
          </div>
        </div>

        <div className="mt-4">
          {topGraders.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#5F6A86]">
              No grading activity recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topGraders.map((grader, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-[10px] bg-[#F4F6FB] border border-[#DDE4F3] flex items-center justify-between gap-2"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-[8px] bg-white border border-[#DDE4F3] flex items-center justify-center font-bold text-xs shrink-0">
                      {idx === 0 ? (
                        <Trophy className="w-4 h-4 text-amber-500" />
                      ) : idx === 1 ? (
                        <Medal className="w-4 h-4 text-slate-400" />
                      ) : idx === 2 ? (
                        <Medal className="w-4 h-4 text-amber-700" />
                      ) : (
                        `#${idx + 1}`
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#17284D] truncate">
                        {grader.user?.name ||
                          grader.user?.username ||
                          "Technician"}
                      </div>
                      <div className="text-[10px] font-mono text-[#5F6A86] truncate">
                        @{grader.user?.username || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#0052CC] block">
                      {grader.reportCount} reports
                    </span>
                    <span className="text-[10px] text-[#5F6A86]">
                      Avg:{" "}
                      {typeof grader.avgScore === "number"
                        ? grader.avgScore.toFixed(1)
                        : grader.avgScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

