"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatCards from "./_components/StatCards";
import QuickActionGrid from "./_components/QuickActionGrid";
import LiveActivityFeed from "./_components/LiveActivityFeed";
import GradeDistribution from "./_components/GradeDistribution";
import StationStatus from "./_components/StationStatus";
import RunDiagnosticModal from "./_components/RunDiagnosticModal";
import ExportDataModal from "./_components/ExportDataModal";
import {
  initialStats,
  recentActivities as defaultActivities,
  activeStations,
  ActivityItem,
  DashboardStats,
} from "./_lib/dashboard-data";
import {
  RefreshCw,
  Play,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Server,
  Trophy,
  Medal,
  Users,
  FileText,
  Star,
  Activity,
  AlertCircle,
} from "lucide-react";
import { dashboardService } from "@/app/gadgetiq/(lens)/dashboard/services";
import { DashboardStats as DashboardStatsData } from "@/app/gadgetiq/(lens)/dashboard/types";
import { authService } from "@/app/gadgetiq/(lens)/core";
import { Button } from "@/components/ui/Button";

type TimeRange = "today" | "7d" | "30d" | "all";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [activities, setActivities] = useState<ActivityItem[]>(defaultActivities);
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [refreshing, setRefreshing] = useState(false);
  const [diagnosticModalOpen, setDiagnosticModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Live Brahma API Data & Status
  const [liveStats, setLiveStats] = useState<DashboardStatsData | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [telemetryMode, setTelemetryMode] = useState<"live" | "simulated">("live");

  // Fetch live stats from Brahma Backend API (GET /api/v1/admin/stats)
  const fetchLiveTelemetry = async () => {
    setRefreshing(true);
    setLiveError(null);
    try {
      const data = await dashboardService.getStats();
      if (data && (data.totalReports !== undefined || data.totalUsers !== undefined)) {
        setLiveStats(data);
        setIsLiveConnected(true);

        // Update top-level dashboard metrics with live values
        setStats({
          totalScanned: data.totalReports || 0,
          scannedDelta: `+${data.reportsToday || 0} evaluated today`,
          passRate: data.avgScore ? Number(Math.min(100, (data.avgScore / 130) * 100).toFixed(1)) : 94.2,
          passRateDelta: `Avg Score: ${data.avgScore || 0} pts`,
          avgDurationSec: 11.4,
          avgDurationDelta: `${data.totalUsers || 0} registered graders`,
          quarantinedCount: Math.round((data.totalReports || 0) * 0.04),
          quarantinedDelta: "Based on live grade reports",
        });

        showToast("Synchronized live statistics from Brahma Production API.");
      }
    } catch (err: any) {
      console.warn("Brahma live stats fetch note:", err.message);
      setIsLiveConnected(false);
      setLiveError(err.message || "Unauthenticated or API in demo mode");
      // Fallback to simulated stats
      if (telemetryMode === "live") {
        setTelemetryMode("simulated");
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveTelemetry();
  }, []);

  const handleRefresh = () => {
    fetchLiveTelemetry();
  };

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3500);
  };

  const handleDiagnosticComplete = (newActivity: ActivityItem) => {
    setActivities((prev) => [newActivity, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalScanned: prev.totalScanned + 1,
      passRate: Number(
        ((prev.passRate * prev.totalScanned + (newActivity.score >= 90 ? 100 : 0)) /
          (prev.totalScanned + 1)
        ).toFixed(1)
      ),
    }));

    showToast(`Diagnostic finalized: ${newActivity.deviceModel} graded ${newActivity.grade}!`);
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    if (range === "7d") {
      setStats({
        totalScanned: liveStats?.totalReports ? Math.round(liveStats.totalReports * 0.35) : 9840,
        scannedDelta: "+24.2% vs prior week",
        passRate: 95.1,
        passRateDelta: "+1.8% efficiency",
        avgDurationSec: 11.4,
        avgDurationDelta: "-1.8s speed gain",
        quarantinedCount: 284,
        quarantinedDelta: "2.9% defect rate",
      });
    } else if (range === "30d") {
      setStats({
        totalScanned: liveStats?.totalReports ? liveStats.totalReports : 41250,
        scannedDelta: "+31.8% vs prior month",
        passRate: 94.8,
        passRateDelta: "+3.2% quality rate",
        avgDurationSec: 11.2,
        avgDurationDelta: "-2.1s speed gain",
        quarantinedCount: 1190,
        quarantinedDelta: "2.8% defect rate",
      });
    } else {
      if (liveStats) {
        setStats({
          totalScanned: liveStats.totalReports || 0,
          scannedDelta: `+${liveStats.reportsToday || 0} evaluated today`,
          passRate: liveStats.avgScore ? Number(Math.min(100, (liveStats.avgScore / 130) * 100).toFixed(1)) : 94.2,
          passRateDelta: `Avg Score: ${liveStats.avgScore || 0} pts`,
          avgDurationSec: 11.4,
          avgDurationDelta: `${liveStats.totalUsers || 0} registered graders`,
          quarantinedCount: Math.round((liveStats.totalReports || 0) * 0.04),
          quarantinedDelta: "Live telemetry",
        });
      } else {
        setStats(initialStats);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-2xl bg-emerald-600 text-white shadow-lg flex items-center justify-between text-xs font-semibold"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
              <span>{notificationToast}</span>
            </div>
            <button
              onClick={() => setNotificationToast(null)}
              className="text-white/80 hover:text-white text-xs font-bold"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner with Quick Actions & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#DDE4F3] shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#17284D] tracking-tight">
              Central Diagnostics Command
            </h2>
            {isLiveConnected ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Brahma API Live Sync (GET /admin/stats)</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0052CC] border border-blue-200 text-[11px] font-bold flex items-center space-x-1.5">
                <Activity className="w-3 h-3 text-[#0052CC]" />
                <span>Rigs 01-04 Active</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#5F6A86] mt-1">
            Standardized 64-point automated hardware diagnostics, optical lens grading & central telemetry.
          </p>
        </div>

        {/* Action Buttons & Time Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Telemetry Source Switch */}
          <div className="flex items-center p-1 bg-[#F4F6FB] rounded-xl border border-[#DDE4F3]">
            <button
              onClick={() => {
                setTelemetryMode("live");
                fetchLiveTelemetry();
              }}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                telemetryMode === "live"
                  ? "bg-[#0052CC] text-white shadow-xs"
                  : "text-[#5F6A86] hover:text-[#17284D]"
              }`}
            >
              Live API
            </button>
            <button
              onClick={() => setTelemetryMode("simulated")}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                telemetryMode === "simulated"
                  ? "bg-white text-[#17284D] shadow-xs"
                  : "text-[#5F6A86] hover:text-[#17284D]"
              }`}
            >
              Simulated
            </button>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center p-1 bg-[#F4F6FB] rounded-xl border border-[#DDE4F3]">
            {[
              { id: "today", label: "Today" },
              { id: "7d", label: "7 Days" },
              { id: "30d", label: "30 Days" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTimeRangeChange(tab.id as TimeRange)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  timeRange === tab.id
                    ? "bg-white text-[#0052CC] shadow-xs"
                    : "text-[#5F6A86] hover:text-[#17284D]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            loading={refreshing}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setExportModalOpen(true)}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>

          <Button
            variant="accent"
            size="sm"
            onClick={() => setDiagnosticModalOpen(true)}
            icon={<Play className="w-3.5 h-3.5 fill-white" />}
            className="shadow-md shadow-[#0052CC]/25"
          >
            Run Diagnostic
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <StatCards stats={stats} />

      {/* Live Brahma Top Graders & Metrics Highlight if API connected */}
      {liveStats?.topGraders && liveStats.topGraders.length > 0 && (
        <div className="bg-white p-5 rounded-3xl border border-[#DDE4F3] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3] mb-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-[#17284D]">Live Leaderboard (Brahma Graders)</h3>
            </div>
            <span className="text-xs font-semibold text-blue-600">
              {liveStats.totalUsers} Registered Accounts
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {liveStats.topGraders.slice(0, 4).map((grader, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-[#F4F6FB] border border-[#DDE4F3] flex items-center justify-between"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#17284D]">
                      {grader.user?.name || grader.user?.username || "Grader"}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      @{grader.user?.username || "user"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-xs text-blue-600 font-mono block">
                    {grader.reportCount} reports
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Avg: {Math.round(Number(grader.avgScore) * 10) / 10}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Bar */}
      <QuickActionGrid />

      {/* Two Column Grid: Live Feed & Grading Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveActivityFeed activities={activities} />
        </div>
        <div className="lg:col-span-1">
          <GradeDistribution />
        </div>
      </div>

      {/* Station / Rig Fleet Telemetry */}
      <StationStatus stations={activeStations} />

      {/* Modals */}
      <RunDiagnosticModal
        isOpen={diagnosticModalOpen}
        onClose={() => setDiagnosticModalOpen(false)}
        onDiagnosticComplete={handleDiagnosticComplete}
      />

      <ExportDataModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
