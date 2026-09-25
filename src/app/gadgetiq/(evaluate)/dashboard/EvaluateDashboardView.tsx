"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  BarChart3,
  CheckCircle2,
  Smartphone,
  Laptop,
  Cpu,
  Monitor,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  Award,
  Layers,
  Calendar,
  AlertCircle,
  FileCheck2,
  Search,
  ExternalLink,
  Sliders,
  Check,
  XCircle,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";
import { dashboardService } from "./services";
import { EvaluateDashboardStats, LicenceCountItem, WorkOrderHistoryItem } from "./types";
import { getFriendlyErrorMessage } from "../core";

interface SubsystemCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  reportPath: string;
  data: LicenceCountItem;
  accentColor: string;
}

function SubsystemCard({ title, icon: Icon, reportPath, data, accentColor }: SubsystemCardProps) {
  const purchased = data?.Device_Qty || 0;
  const pending = data?.PendingQty || 0;
  const used = data?.UplodedQty || 0;
  const usedPercentage = purchased > 0 ? Math.min(100, Math.round((used / purchased) * 100)) : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#DDE4F3] p-5 shadow-xs hover:border-[#C3CEE6] hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
      {/* Subsystem Header */}
      <div className="flex items-center justify-between border-b border-[#DDE4F3]/80 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className={`w-9 h-9 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center shrink-0`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-[#17284D]">
              {title}
            </h3>
            <p className="text-[11px] text-[#5F6A86]">Diagnostic Hardware Suite</p>
          </div>
        </div>

        <Link
          href={reportPath}
          className="inline-flex items-center space-x-1 text-xs font-bold text-[#0052CC] hover:text-[#003D99] transition-colors"
        >
          <span>QC Reports</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3 Metric Pills */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="p-2.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3]/60">
          <span className="text-base sm:text-lg font-black font-display text-[#17284D] block">
            {purchased.toLocaleString()}
          </span>
          <span className="text-[10px] font-semibold text-[#5F6A86] uppercase tracking-wider">
            Purchased
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <span className="text-base sm:text-lg font-black font-display text-[#00875A] block">
            {pending.toLocaleString()}
          </span>
          <span className="text-[10px] font-semibold text-[#00875A] uppercase tracking-wider">
            Available
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
          <span className="text-base sm:text-lg font-black font-display text-[#FF5630] block">
            {used.toLocaleString()}
          </span>
          <span className="text-[10px] font-semibold text-[#FF5630] uppercase tracking-wider">
            Tested
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-medium text-[#5F6A86]">
          <span>License Utilization</span>
          <span className="font-bold text-[#17284D]">{usedPercentage}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0052CC] to-[#0070F3] transition-all duration-500"
            style={{ width: `${usedPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function EvaluateDashboardView() {
  const [stats, setStats] = useState<EvaluateDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chartMode, setChartMode] = useState<"area" | "bar">("area");

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getLicenseStats();
      setStats(data);
    } catch (err: any) {
      console.error("Dashboard stats live load error:", err);
      setError(
        getFriendlyErrorMessage(
          err,
          "Unable to load dashboard telemetry. Please check server connectivity."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-24 bg-white rounded-2xl border border-[#DDE4F3]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-[#DDE4F3]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-white rounded-2xl border border-[#DDE4F3]" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-[#DDE4F3] text-center max-w-lg mx-auto my-10 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#C7300A] flex items-center justify-center mx-auto mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-[#17284D] font-display">
          Unable to Load Evaluate Telemetry
        </h3>
        <p className="text-xs text-[#5F6A86] mt-1.5 mb-4 leading-relaxed">
          {error || "Could not retrieve live license stats. Please verify server connection."}
        </p>
        <button
          onClick={loadData}
          className="px-5 py-2 rounded-xl bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003D99] transition-colors cursor-pointer inline-flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const totalPurchased =
    (stats.mobile?.Device_Qty || 0) +
    (stats.laptop?.Device_Qty || 0) +
    (stats.motherboard?.Device_Qty || 0) +
    (stats.desktop?.Device_Qty || 0) +
    (stats.desktopMotherboard?.Device_Qty || 0);

  const totalPending =
    (stats.mobile?.PendingQty || 0) +
    (stats.laptop?.PendingQty || 0) +
    (stats.motherboard?.PendingQty || 0) +
    (stats.desktop?.PendingQty || 0) +
    (stats.desktopMotherboard?.PendingQty || 0);

  const totalUsed =
    (stats.mobile?.UplodedQty || 0) +
    (stats.laptop?.UplodedQty || 0) +
    (stats.motherboard?.UplodedQty || 0) +
    (stats.desktop?.UplodedQty || 0) +
    (stats.desktopMotherboard?.UplodedQty || 0);

  const overallPassRate = stats.overallPassRate || 94;

  // Filter recent work orders
  const filteredWorkOrders = (stats.recentWorkOrders || []).filter((wo) => {
    const matchesSearch =
      !searchTerm ||
      wo.Work_Order_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (wo.DeviceType && wo.DeviceType.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pass" && (wo.PassQty ?? 0) > 0) ||
      (statusFilter === "fail" && (wo.FailQty ?? 0) > 0) ||
      (statusFilter === "pending" && (wo.PendingQty ?? 0) > 0);

    return matchesSearch && matchesStatus;
  });

  // Hardware Subsystem Quota data for charts
  const subsystemChartData = [
    { name: "Laptop", purchased: stats.laptop.Device_Qty, used: stats.laptop.UplodedQty, pending: stats.laptop.PendingQty },
    { name: "Mobile", purchased: stats.mobile.Device_Qty, used: stats.mobile.UplodedQty, pending: stats.mobile.PendingQty },
    { name: "Motherboard", purchased: stats.motherboard.Device_Qty, used: stats.motherboard.UplodedQty, pending: stats.motherboard.PendingQty },
    { name: "Desktop", purchased: stats.desktop.Device_Qty, used: stats.desktop.UplodedQty, pending: stats.desktop.PendingQty },
  ];

  const maxVal = Math.max(...subsystemChartData.map((d) => d.purchased), 1);

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. TOP HERO GREETING & STATION NODE BANNER */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-[#DDE4F3] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0052CC] font-bold text-[10px] uppercase tracking-wider">
              Diagnostic
            </span>
            <span className="text-xs font-mono text-[#5F6A86]">
              Node: {stats.partnerCode || "XC-QC-PARTNER"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#17284D]">
            {stats.partnerName || "XtraCover Partner Rig"}
          </h1>
          <p className="text-xs text-[#5F6A86]">
            Multi-tier hardware test license allocation & real-time diagnostic telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0 flex-wrap gap-y-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-[#DDE4F3] text-[#5F6A86] hover:text-[#0052CC] hover:bg-[#F4F6FB] transition-colors cursor-pointer"
            title="Refresh live telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/gadgetiq/reports/monthly-summary"
            className="px-4 py-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0052CC] border border-blue-200/80 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#0052CC]" />
            <span>Monthly Summary</span>
          </Link>

          <Link
            href="/gadgetiq/reports/laptop"
            className="px-4 py-2.5 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-brand-btn-orange/20 hover:shadow-brand-btn-orange/40 flex items-center space-x-1.5 btn-shimmer cursor-pointer"
          >
            <span>View QC Reports</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. 4 KEY KPI TELEMETRY CARDS */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Authorized Licenses */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0052CC] to-[#0070F3] text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-2xl font-black font-display text-[#17284D] block tracking-tight">
              {totalPurchased.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-[#5F6A86]">
              Total Licences Purchased
            </span>
          </div>
        </div>

        {/* Available to Test */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00875A] to-[#00A36C] text-white flex items-center justify-center shrink-0 shadow-xs">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-2xl font-black font-display text-[#00875A] block tracking-tight">
              {totalPending.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-[#5F6A86]">
              Available Quota to Test
            </span>
          </div>
        </div>

        {/* Total Licenses Used */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5630] to-[#FF7A59] text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-2xl font-black font-display text-[#FF5630] block tracking-tight">
              {totalUsed.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-[#5F6A86]">
              Total Licences Used
            </span>
          </div>
        </div>

        {/* Diagnostic Pass Yield */}
        <div className="p-5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-2xl font-black font-display text-[#17284D] block tracking-tight">
              {overallPassRate}%
            </span>
            <span className="text-xs font-semibold text-[#5F6A86]">
              Overall QC Pass Yield
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. SUBSYSTEM QUOTA MATRIX & TELEMETRY BREAKDOWN */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SubsystemCard
          title="Laptop QC Diagnostics"
          icon={Laptop}
          reportPath="/gadgetiq/reports/laptop"
          data={stats.laptop}
          accentColor="#0052CC"
        />

        <SubsystemCard
          title="Mobile QC Diagnostics"
          icon={Smartphone}
          reportPath="/gadgetiq/reports/mobile"
          data={stats.mobile}
          accentColor="#00875A"
        />

        <SubsystemCard
          title="Motherboard QC Diagnostics"
          icon={Cpu}
          reportPath="/gadgetiq/reports/motherboard"
          data={stats.motherboard}
          accentColor="#FF5630"
        />

        <SubsystemCard
          title="Desktop Station QC"
          icon={Monitor}
          reportPath="/gadgetiq/reports/desktop"
          data={stats.desktop}
          accentColor="#7C3AED"
        />
      </div>

      {/* ========================================================= */}
      {/* 4. SUBSYSTEM VOLUME DISTRIBUTION CHART */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-[#DDE4F3] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#DDE4F3]/80 pb-4 mb-5">
          <div>
            <h3 className="font-display font-bold text-base text-[#17284D]">
              Hardware Subsystem License Distribution
            </h3>
            <p className="text-xs text-[#5F6A86] mt-0.5">
              Purchased vs. utilized license volume across hardware test categories.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-[#5F6A86] font-medium mr-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0052CC]" /> Purchased
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#5F6A86] font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00875A]" /> Available
            </span>
          </div>
        </div>

        {/* Volume Bars */}
        <div className="space-y-4">
          {subsystemChartData.map((item) => {
            const purchasedPct = Math.round((item.purchased / maxVal) * 100);
            const usedPct = item.purchased > 0 ? Math.round((item.used / item.purchased) * 100) : 0;

            return (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#17284D] font-display">{item.name}</span>
                  <div className="flex items-center space-x-3 text-[11px] font-mono">
                    <span className="text-[#0052CC]">Purchased: {item.purchased}</span>
                    <span className="text-[#00875A]">Available: {item.pending}</span>
                    <span className="text-[#FF5630]">Tested: {item.used} ({usedPct}%)</span>
                  </div>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    className="h-full bg-[#0052CC] rounded-l-full"
                    style={{ width: `${item.purchased > 0 ? (item.used / item.purchased) * purchasedPct : 0}%` }}
                    title={`Tested: ${item.used}`}
                  />
                  <div
                    className="h-full bg-[#00875A]"
                    style={{ width: `${item.purchased > 0 ? (item.pending / item.purchased) * purchasedPct : 0}%` }}
                    title={`Available: ${item.pending}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. RECENT DIAGNOSTIC WORK ORDERS / AUDIT LOG */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-[#DDE4F3] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#DDE4F3]/80 pb-4">
          <div>
            <h3 className="font-display font-bold text-base text-[#17284D]">
              Recent Diagnostic Work Orders
            </h3>
            <p className="text-xs text-[#5F6A86] mt-0.5">
              Live batch audit history and pass/fail distribution logs.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#5F6A86]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Work Order..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] text-xs text-[#17284D] placeholder-[#5F6A86]/70 outline-none focus:border-[#0052CC]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#F4F6FB] border border-[#DDE4F3] text-xs font-semibold text-[#17284D] outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pass">With Passes</option>
              <option value="fail">With Failures</option>
              <option value="pending">With Pending</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-[#DDE4F3]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFD] border-b border-[#DDE4F3] text-[#5F6A86] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Work Order #</th>
                <th className="py-3 px-4">Device Type</th>
                <th className="py-3 px-4">Batch Qty</th>
                <th className="py-3 px-4">Tested</th>
                <th className="py-3 px-4">Pass</th>
                <th className="py-3 px-4">Fail</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE4F3] font-medium text-[#17284D]">
              {filteredWorkOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#5F6A86]">
                    No matching work order records found.
                  </td>
                </tr>
              ) : (
                filteredWorkOrders.slice(0, 10).map((wo, idx) => (
                  <tr key={`${wo.Work_Order_no}-${wo.MstID || idx}-${idx}`} className="hover:bg-[#F8FAFD] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0052CC]">
                      {wo.Work_Order_no}
                    </td>
                    <td className="py-3 px-4 capitalize">
                      {wo.DeviceType || wo.MobileType || "Hardware"}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {wo.Device_Qty}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#0052CC] font-bold">
                      {wo.UplodedQty}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#00875A] font-bold text-[11px] font-mono">
                        {wo.PassQty}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-[#C7300A] font-bold text-[11px] font-mono">
                        {wo.FailQty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#5F6A86] text-[11px]">
                      {wo.CreatedOn ? new Date(wo.CreatedOn).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/gadgetiq/reports/${(wo.DeviceType || "laptop").toLowerCase().includes("mob") ? "mobile" : "laptop"}`}
                        className="inline-flex items-center space-x-1 text-[#0052CC] hover:underline font-bold text-[11px]"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
