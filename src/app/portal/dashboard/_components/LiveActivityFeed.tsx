"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Laptop,
  Smartphone,
  Tablet,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  SlidersHorizontal,
  FileCheck2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ActivityItem } from "../_lib/dashboard-data";

interface LiveActivityFeedProps {
  activities: ActivityItem[];
}

export default function LiveActivityFeed({ activities }: LiveActivityFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Smartphone":
        return <Smartphone className="w-4 h-4 text-[#0052CC]" />;
      case "Tablet":
        return <Tablet className="w-4 h-4 text-[#0052CC]" />;
      default:
        return <Laptop className="w-4 h-4 text-[#0052CC]" />;
    }
  };

  const getGradeBadge = (grade: ActivityItem["grade"]) => {
    switch (grade) {
      case "Grade A":
        return <Badge tone="success" dot>Grade A (Pristine)</Badge>;
      case "Grade B":
        return <Badge tone="brand" dot>Grade B (Good)</Badge>;
      case "Grade C":
        return <Badge tone="warning" dot>Grade C (Fair)</Badge>;
      case "Failed":
        return <Badge tone="danger" dot>Quarantine Fail</Badge>;
    }
  };

  const filtered = activities.filter((item) => {
    const matchesQuery =
      item.deviceModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.technician.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade =
      gradeFilter === "all" ||
      (gradeFilter === "gradeA" && item.grade === "Grade A") ||
      (gradeFilter === "gradeB" && item.grade === "Grade B") ||
      (gradeFilter === "failed" && (item.grade === "Failed" || item.grade === "Grade C"));

    return matchesQuery && matchesGrade;
  });

  return (
    <Card padding="none" className="h-full flex flex-col shadow-xs">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-[#DDE4F3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold font-display text-sm sm:text-base text-[#17284D]">
              Live Diagnostics Stream
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs text-[#5F6A86] mt-0.5">
            Real-time multi-station hardware audit feed · Showing {filtered.length} units
          </p>
        </div>

        <Link
          href="/portal/devices"
          className="text-xs font-semibold text-[#0052CC] hover:text-[#003D99] flex items-center space-x-1 shrink-0"
        >
          <span>View All Fleet</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 border-b border-[#DDE4F3] bg-white flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#5F6A86] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search model, serial, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] focus:outline-none focus:border-[#0052CC]"
          />
        </div>

        {/* Grade Filter Pills */}
        <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "All Units" },
            { id: "gradeA", label: "Grade A" },
            { id: "gradeB", label: "Grade B" },
            { id: "failed", label: "Defect / Fail" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setGradeFilter(tab.id)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                gradeFilter === tab.id
                  ? "bg-[#0052CC] text-white shadow-xs"
                  : "bg-slate-100 text-[#5F6A86] hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-[#DDE4F3] overflow-y-auto max-h-[420px]">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No diagnostic records found matching "{searchQuery}".
          </div>
        ) : (
          filtered.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.id}
              className="p-3.5 sm:p-4 hover:bg-[#F4F6FB] transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {getDeviceIcon(item.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs sm:text-sm text-[#17284D] truncate">
                      {item.deviceModel}
                    </span>
                    <span className="font-mono text-[10.5px] text-[#5F6A86] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                      {item.serial}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-[#5F6A86] mt-0.5">
                    <span>{item.station}</span>
                    <span>•</span>
                    <span>Tech: {item.technician}</span>
                    <span>•</span>
                    <span className="text-slate-400">{item.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-extrabold font-mono text-[#17284D]">
                    {item.checksPassed}/{item.totalChecks} Checks
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    Score: {item.score}%
                  </span>
                </div>
                <div>{getGradeBadge(item.grade)}</div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
