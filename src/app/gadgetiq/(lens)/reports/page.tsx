"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Eye,
  Smartphone,
  ExternalLink,
  Layers,
} from "lucide-react";
import { reportsService } from "./services";
import { ReportListItem } from "./types";
import { getAuthUser } from "../core";

const LIMIT = 20;

export default function LensReportsPage() {
  const router = useRouter();
  const user = getAuthUser();

  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [gradeFilter, setGradeFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchReports = () => {
    setLoading(true);
    const params: any = {
      limit: LIMIT,
      offset: page * LIMIT,
    };
    if (gradeFilter) params.grade = gradeFilter;
    if (search) params.search = search;
    if (user?.role === "company_admin" && user?.companyId) {
      params.companyId = user.companyId;
    }

    reportsService
      .list(params)
      .then((data: any) => {
        setReports(data.reports || []);
        setTotal(data.total || 0);
      })
      .catch((err) => console.error("Failed to load reports:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, [page, gradeFilter, search]);

  const totalPages = Math.ceil(total / LIMIT);

  const getScreenScore = (r: any): number | string => {
    if (r.screenScore !== undefined && r.screenScore !== null) return r.screenScore;
    if (r.screen_score !== undefined && r.screen_score !== null) return r.screen_score;
    if (r.screen !== undefined && r.screen !== null) return r.screen;
    if (r.cosmeticDetails?.screenScore !== undefined && r.cosmeticDetails?.screenScore !== null) return r.cosmeticDetails.screenScore;
    if (r.cosmetic?.screenScore !== undefined && r.cosmetic?.screenScore !== null) return r.cosmetic.screenScore;
    if (r.cosmetic?.screen !== undefined && r.cosmetic?.screen !== null) return r.cosmetic.screen;
    if (r.metadata?.screenScore !== undefined && r.metadata?.screenScore !== null) return r.metadata.screenScore;
    return "—";
  };

  const getBodyScore = (r: any): number | string => {
    if (r.bodyScore !== undefined && r.bodyScore !== null) return r.bodyScore;
    if (r.body_score !== undefined && r.body_score !== null) return r.body_score;
    if (r.body !== undefined && r.body !== null) return r.body;
    if (r.cosmeticDetails?.bodyScore !== undefined && r.cosmeticDetails?.bodyScore !== null) return r.cosmeticDetails.bodyScore;
    if (r.cosmetic?.bodyScore !== undefined && r.cosmetic?.bodyScore !== null) return r.cosmetic.bodyScore;
    if (r.cosmetic?.body !== undefined && r.cosmetic?.body !== null) return r.cosmetic.body;
    if (r.metadata?.bodyScore !== undefined && r.metadata?.bodyScore !== null) return r.metadata.bodyScore;
    return "—";
  };

  const getGradeBadge = (grade: string) => {
    if (!grade) return <span className="text-[#5F6A86] font-medium">—</span>;
    const g = String(grade).toUpperCase();

    let colorClasses = "bg-blue-50 text-[#0052CC] border-blue-200";
    if (g.startsWith("1") || g.startsWith("A")) {
      colorClasses = "bg-emerald-50 text-[#00875A] border-emerald-200";
    } else if (g.startsWith("2")) {
      colorClasses = "bg-teal-50 text-teal-700 border-teal-200";
    } else if (g.startsWith("3") || g.startsWith("B")) {
      colorClasses = "bg-amber-50 text-[#8A5600] border-amber-200";
    } else if (g.startsWith("4")) {
      colorClasses = "bg-orange-50 text-orange-700 border-orange-200";
    } else if (g.startsWith("5") || g.startsWith("F")) {
      colorClasses = "bg-rose-50 text-[#C7300A] border-rose-200";
    }

    return (
      <span
        className={`px-2.5 py-0.5 rounded-[4px] font-mono font-bold text-xs border ${colorClasses}`}
      >
        Grade {grade}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-[#17284D] px-3 py-2 rounded-[8px] bg-white border border-[#DDE4F3] shadow-xs shrink-0">
            {total} Verified QC Reports
          </span>

          {/* Grade Filter */}
          <select
            value={gradeFilter}
            onChange={(e) => {
              setGradeFilter(e.target.value);
              setPage(0);
            }}
            className="text-xs bg-white border border-[#C3CEE6] rounded-[8px] px-3 py-2 text-[#17284D] outline-none cursor-pointer"
          >
            <option value="">All Grades</option>
            <option value="1A">Grade 1A (Like New)</option>
            <option value="2A">Grade 2A (Very Good)</option>
            <option value="3A">Grade 3A (Good)</option>
            <option value="4A">Grade 4A (Fair)</option>
            <option value="5A">Grade 5A (Poor)</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#5F6A86] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by IMEI, Serial, Model..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] placeholder-[#5F6A86]/60 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="rounded-[12px] bg-white border border-[#DDE4F3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[860px]">
            <thead>
              <tr className="bg-[#F4F6FB] border-b border-[#DDE4F3] text-[#5F6A86] font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                <th className="py-3 px-4 whitespace-nowrap">Device Model & IMEI</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Final Grade</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Screen Score</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Body Score</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Functional Score</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Cosmetic Score</th>
                <th className="py-3 px-4 whitespace-nowrap">Technician</th>
                <th className="py-3 px-4 whitespace-nowrap">Inspected Date</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE4F3]">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#5F6A86]">
                    <div className="w-6 h-6 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading QC inspection reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#5F6A86] space-y-1">
                    <Layers className="w-7 h-7 text-slate-300 mx-auto mb-1" />
                    <p className="font-bold text-[#17284D]">No grading reports found</p>
                    <p className="text-xs text-slate-500">
                      {search ? `No reports matching "${search}"` : "No inspection reports available."}
                    </p>
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const fg =
                    report.functionalGrade ||
                    (report.grade ? report.grade.match(/^[0-9]+/)?.[0] : null);
                  const cg =
                    report.cosmeticGrade ||
                    (report.grade ? report.grade.replace(/^[0-9]+/, "") : null);
                  const overallGrade =
                    fg && cg ? `${fg}${cg}` : report.grade || "—";

                  const screenScore = getScreenScore(report);
                  const bodyScore = getBodyScore(report);

                  return (
                    <tr
                      key={report.id}
                      onClick={() =>
                        router.push(`/gadgetiq/certificate/${report.id}`)
                      }
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                      title="Click anywhere to view full Quality Assurance Certificate"
                    >
                      {/* Device Model & IMEI */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>
                          <span className="font-bold text-[#17284D] block group-hover:text-[#0052CC] transition-colors">
                            {report.deviceModel || "Generic Device"}
                          </span>
                          <span className="font-mono text-[11px] text-[#5F6A86] block">
                            {report.deviceImei ||
                              report.serialNumber ||
                              `ID: ${report.id}`}
                          </span>
                        </div>
                      </td>

                      {/* Final Grade */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {getGradeBadge(overallGrade)}
                      </td>

                      {/* Screen Score */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-mono font-bold text-[#0052CC] bg-blue-50/80 px-2 py-0.5 rounded-[4px] border border-blue-200 text-xs">
                          {screenScore !== "—" ? `${screenScore} pts` : "—"}
                        </span>
                      </td>

                      {/* Body Score */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-mono font-bold text-[#00875A] bg-emerald-50/80 px-2 py-0.5 rounded-[4px] border border-emerald-200 text-xs">
                          {bodyScore !== "—" ? `${bodyScore} pts` : "—"}
                        </span>
                      </td>

                      {/* Functional Score */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-mono font-bold text-[#17284D]">
                          {report.functionalScore !== undefined && report.functionalScore !== null
                            ? `${report.functionalScore} pts`
                            : "—"}
                        </span>
                      </td>

                      {/* Cosmetic Score */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="font-mono font-bold text-[#17284D]">
                          {report.cosmeticScore !== undefined && report.cosmeticScore !== null
                            ? `${report.cosmeticScore} pts`
                            : "—"}
                        </span>
                      </td>

                      {/* Technician */}
                      <td className="py-3.5 px-4 text-[#4A5875] whitespace-nowrap">
                        {report.user?.name ||
                          report.user?.username ||
                          "Technician"}
                      </td>

                      {/* Inspected Date */}
                      <td className="py-3.5 px-4 text-[#5F6A86] whitespace-nowrap">
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleString("en-IN")
                          : "—"}
                      </td>

                      {/* Certificate CTA */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link
                            href={`/gadgetiq/certificate/${report.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-1.5 rounded-[6px] bg-[#0052CC] text-white hover:bg-[#003D99] text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Certificate</span>
                          </Link>
                          <Link
                            href={`/gadgetiq/reports/${report.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-[6px] bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#5F6A86] hover:text-[#17284D] text-xs transition-colors cursor-pointer"
                            title="Inspect Complete QC Telemetry & Images"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (20 per page) */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#DDE4F3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F6A86]">
            <span>
              Showing {page * LIMIT + 1} -{" "}
              {Math.min((page + 1) * LIMIT, total)} of {total} reports (20 per page)
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-[6px] border border-[#DDE4F3] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[#17284D]"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-[#17284D] px-2 py-0.5 rounded bg-slate-100 font-mono text-xs">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-[6px] border border-[#DDE4F3] hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[#17284D]"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


