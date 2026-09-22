"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import {
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Copy,
  SlidersHorizontal,
  FileCheck2,
  User,
  ExternalLink,
} from "lucide-react";
import { onboardingService } from "./services";
import {
  OnboardingUserRecord,
  OnboardingPagination,
  OnboardingStatus,
} from "./types";
import { getAuthUser } from "../core";

interface UserOnboardingViewProps {
  embedded?: boolean;
}

export default function UserOnboardingPage({ embedded = false }: UserOnboardingViewProps) {
  // Data State
  const [users, setUsers] = useState<OnboardingUserRecord[]>([]);
  const [pagination, setPagination] = useState<OnboardingPagination>({
    totalRecords: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter & Search State
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // UI Status State
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [copiedGstId, setCopiedGstId] = useState<string | number | null>(null);
  const [, startTransition] = useTransition();

  // Modal / Drawer State for Detailed Review
  const [selectedUser, setSelectedUser] = useState<OnboardingUserRecord | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [decisionStatus, setDecisionStatus] = useState<string>("APPROVED");
  const [decisionActive, setDecisionActive] = useState<boolean>(true);
  const [decisionNotes, setDecisionNotes] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Quick Reject Dialog State
  const [rejectDialogUser, setRejectDialogUser] = useState<OnboardingUserRecord | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [rejectLoading, setRejectLoading] = useState<boolean>(false);

  // Current logged in admin
  const currentUser = getAuthUser();
  const isSuperAdmin = currentUser?.role === "admin" || !currentUser?.role;

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Show toast notification helper
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Fetch Users List
  const fetchUsers = useCallback(
    async (isManualRefresh = false) => {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const data = await onboardingService.list({
          page: currentPage,
          limit: pageSize,
          status: statusFilter === "ALL" ? undefined : statusFilter,
          isActive:
            activeFilter === "ALL"
              ? undefined
              : activeFilter === "ACTIVE"
              ? true
              : false,
          search: debouncedSearch.trim() || undefined,
        });

        startTransition(() => {
          setUsers(data.records || []);
          if (data.pagination) {
            setPagination(data.pagination);
          } else {
            setPagination({
              totalRecords: data.records?.length || 0,
              currentPage,
              totalPages: Math.max(1, Math.ceil((data.records?.length || 0) / pageSize)),
              limit: pageSize,
              hasNextPage: false,
              hasPrevPage: false,
            });
          }
        });
      } catch (err: any) {
        showToast(err.message || "Failed to load onboarding users", "error");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [currentPage, pageSize, statusFilter, activeFilter, debouncedSearch]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Open Full Detail Modal (Endpoint 2: GET /api/v1/user-onboard/:id)
  const openDetailModal = async (user: OnboardingUserRecord) => {
    setSelectedUser(user);
    setDecisionStatus(user.status || "APPROVED");
    setDecisionActive(user.isActive ?? true);
    setDecisionNotes(user.notes || "");
    setDetailLoading(true);

    try {
      const freshUser = await onboardingService.getById(user.id);
      setSelectedUser(freshUser);
      setDecisionStatus(freshUser.status || "APPROVED");
      setDecisionActive(freshUser.isActive ?? true);
      setDecisionNotes(freshUser.notes || "");
    } catch {
      // Keep optimistic user data
    } finally {
      setDetailLoading(false);
    }
  };

  // Close Detail Modal
  const closeDetailModal = () => {
    setSelectedUser(null);
    setDecisionNotes("");
    setActionLoading(false);
  };

  // Handle Status Update (Endpoint 3: PATCH /api/v1/user-onboard/:id/status)
  const handleSaveDecision = async () => {
    if (!selectedUser) return;
    setActionLoading(true);

    try {
      const updated = await onboardingService.updateStatus(selectedUser.id, {
        status: decisionStatus,
        isActive: decisionActive,
        notes: decisionNotes.trim() || undefined,
      });

      showToast(`User ${updated.name || updated.username} updated to ${updated.status}`, "success");
      closeDetailModal();
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || "Failed to update user status", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Quick One-Click Approve
  const handleQuickApprove = async (u: OnboardingUserRecord, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await onboardingService.quickApprove(u.id, "Approved via Super Admin One-Click");
      showToast(`Account for "${u.name || u.company}" approved & activated!`, "success");
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || "Approval failed", "error");
    }
  };

  // Quick Reject Dialog Open
  const openRejectDialog = (u: OnboardingUserRecord, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setRejectDialogUser(u);
    setRejectReason("Invalid or incomplete business registration details.");
  };

  // Confirm Quick Reject
  const handleConfirmReject = async () => {
    if (!rejectDialogUser) return;
    setRejectLoading(true);

    try {
      await onboardingService.quickReject(
        rejectDialogUser.id,
        rejectReason.trim() || "Rejected by Super Admin"
      );
      showToast(`Application for "${rejectDialogUser.company}" was rejected.`, "info");
      setRejectDialogUser(null);
      setRejectReason("");
      fetchUsers();
    } catch (err: any) {
      showToast(err.message || "Rejection failed", "error");
    } finally {
      setRejectLoading(false);
    }
  };

  // Copy GST to clipboard
  const handleCopyGst = (gst: string, id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(gst);
    setCopiedGstId(id);
    showToast(`GST "${gst}" copied to clipboard`, "info");
    setTimeout(() => setCopiedGstId(null), 2000);
  };

  // Status Badge Rendering
  const renderStatusBadge = (status: string | OnboardingStatus) => {
    const norm = String(status || "PENDING").toUpperCase();
    switch (norm) {
      case "APPROVED":
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
            <XCircle className="w-3 h-3 text-rose-600" />
            Rejected
          </span>
        );
      case "INACTIVE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 shrink-0">
            <AlertTriangle className="w-3 h-3 text-slate-500" />
            Inactive
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse shrink-0">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending Approval
          </span>
        );
    }
  };

  // Calculate Metrics from current list
  const pendingCount = users.filter((u) => String(u.status).toUpperCase() === "PENDING").length;
  const approvedCount = users.filter((u) => String(u.status).toUpperCase() === "APPROVED" || u.isActive).length;
  const rejectedCount = users.filter((u) => String(u.status).toUpperCase() === "REJECTED").length;

  return (
    <div className={`space-y-6 ${embedded ? "" : "pb-12"}`}>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold text-white transition-all transform animate-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "bg-[#00875A]"
              : toast.type === "error"
              ? "bg-[#DE350B]"
              : "bg-[#0052CC]"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {toast.type === "error" && <XCircle className="w-4 h-4 shrink-0" />}
          {toast.type === "info" && <ShieldCheck className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      {!embedded && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DDE4F3] shadow-xs">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0052CC] to-[#2684FF] text-white flex items-center justify-center shadow-xs">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#17284D] tracking-tight">
                  User Onboarding & Approvals
                </h1>
                <p className="text-xs text-[#5F6A86] mt-0.5">
                  Verify applicant credentials, review company GST details, and approve signups.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => fetchUsers(true)}
              disabled={refreshing || loading}
              className="px-3.5 py-2 rounded-xl bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-xs font-semibold text-[#17284D] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#0052CC]" : "text-[#5F6A86]"}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Signups */}
        <div className="bg-white p-4 rounded-xl border border-[#DDE4F3] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-[#5F6A86] uppercase tracking-wider">
              Total Signups
            </p>
            <p className="text-2xl font-black text-[#17284D] mt-1 font-display">
              {pagination.totalRecords}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div
          onClick={() => setStatusFilter("PENDING")}
          className="bg-white p-4 rounded-xl border border-amber-200 bg-gradient-to-br from-white to-amber-50/40 shadow-xs flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all"
        >
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                Pending Approval
              </p>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <p className="text-2xl font-black text-amber-700 mt-1 font-display">
              {pendingCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Approved & Active */}
        <div
          onClick={() => setStatusFilter("APPROVED")}
          className="bg-white p-4 rounded-xl border border-[#DDE4F3] shadow-xs flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all"
        >
          <div>
            <p className="text-[11px] font-bold text-[#5F6A86] uppercase tracking-wider">
              Approved Accounts
            </p>
            <p className="text-2xl font-black text-emerald-600 mt-1 font-display">
              {approvedCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Rejected */}
        <div
          onClick={() => setStatusFilter("REJECTED")}
          className="bg-white p-4 rounded-xl border border-[#DDE4F3] shadow-xs flex items-center justify-between cursor-pointer hover:border-rose-300 transition-all"
        >
          <div>
            <p className="text-[11px] font-bold text-[#5F6A86] uppercase tracking-wider">
              Rejected / Revoked
            </p>
            <p className="text-2xl font-black text-rose-600 mt-1 font-display">
              {rejectedCount}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DDE4F3] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {["ALL", "PENDING", "APPROVED", "REJECTED", "ACTIVE", "INACTIVE"].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-[#0052CC] text-white shadow-xs"
                    : "bg-[#F4F6FB] text-[#5F6A86] hover:bg-[#E9EEF9] hover:text-[#17284D]"
                }`}
              >
                {st === "ALL" ? "All Applications" : st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#5F6A86] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, email, company, GST..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-xl text-[#17284D] placeholder-[#5F6A86]/60 focus:bg-white focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/15 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#5F6A86] hover:text-[#17284D]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Active Toggle Filter */}
            <select
              value={activeFilter}
              onChange={(e) => {
                setActiveFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-xl px-3 py-2 text-[#17284D] font-semibold outline-none cursor-pointer hover:bg-[#E9EEF9]"
            >
              <option value="ALL">All Active States</option>
              <option value="ACTIVE">Active (Enabled)</option>
              <option value="INACTIVE">Inactive (Disabled)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Applicants Table */}
      <div className="bg-white rounded-2xl border border-[#DDE4F3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead>
              <tr className="bg-[#F4F6FB] border-b border-[#DDE4F3] text-[#5F6A86] font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Applicant & Company</th>
                <th className="py-3 px-4">GST / Tax Identification</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Username & Role</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Active Access</th>
                <th className="py-3 px-4">Signup Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE4F3]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#5F6A86]">
                    <div className="w-7 h-7 border-3 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="font-semibold text-xs text-[#17284D]">
                      Fetching onboarding records...
                    </p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#5F6A86]">
                    <div className="w-12 h-12 rounded-full bg-[#F4F6FB] flex items-center justify-center mx-auto mb-2 text-[#5F6A86]">
                      <UserX className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-sm text-[#17284D]">No applicants found</p>
                    <p className="text-xs text-[#5F6A86] mt-0.5">
                      No onboarding registrations matching current search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isPending = String(u.status).toUpperCase() === "PENDING";
                  const initial = (u.name || u.company || u.username || "U").charAt(0).toUpperCase();

                  return (
                    <tr
                      key={u.id}
                      onClick={() => openDetailModal(u)}
                      className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                    >
                      {/* Applicant & Company */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0052CC] to-[#4C9AFF] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                            {initial}
                          </div>
                          <div>
                            <span className="font-bold text-[#17284D] group-hover:text-[#0052CC] transition-colors block">
                              {u.name || "Unnamed Applicant"}
                            </span>
                            <span className="text-[11px] text-[#5F6A86] flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-[#5F6A86]/70" />
                              {u.company || "No Company Specified"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* GST / Tax Identification */}
                      <td className="py-3.5 px-4">
                        {u.gst ? (
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[11px] font-semibold text-[#17284D] bg-[#F4F6FB] px-2 py-0.5 rounded border border-[#DDE4F3]">
                              {u.gst}
                            </span>
                            <button
                              onClick={(e) => handleCopyGst(u.gst!, u.id, e)}
                              title="Copy GST"
                              className="p-1 rounded hover:bg-slate-200 text-[#5F6A86] hover:text-[#17284D] transition-colors"
                            >
                              {copiedGstId === u.id ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#5F6A86]/60 italic">N/A</span>
                        )}
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <a
                            href={`mailto:${u.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] text-[#0052CC] hover:underline flex items-center gap-1 font-medium"
                          >
                            <Mail className="w-3 h-3 text-[#5F6A86]" />
                            {u.email}
                          </a>
                          {u.phone && (
                            <a
                              href={`tel:${u.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] text-[#5F6A86] flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-[#5F6A86]/70" />
                              {u.phone}
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Username & Role */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[11px] text-[#17284D] block">
                          @{u.username}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#5F6A86] tracking-wider">
                          {u.role || "User"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {renderStatusBadge(u.status)}
                      </td>

                      {/* Active Access */}
                      <td className="py-3.5 px-4 text-center">
                        {u.isActive ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Enabled
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                            Disabled
                          </span>
                        )}
                      </td>

                      {/* Signup Date */}
                      <td className="py-3.5 px-4 text-[11px] text-[#5F6A86]">
                        {u.createdAt ? (
                          <>
                            <span className="font-semibold text-[#17284D] block">
                              {new Date(u.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="text-[10px] text-[#5F6A86]">
                              {new Date(u.createdAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </>
                        ) : (
                          "Recent"
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {isPending && isSuperAdmin && (
                            <>
                              <button
                                onClick={(e) => handleQuickApprove(u, e)}
                                title="One-Click Approve"
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={(e) => openRejectDialog(u, e)}
                                title="Reject Applicant"
                                className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openDetailModal(u)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-[#5F6A86]" />
                            <span>Review</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="py-3.5 px-4 border-t border-[#DDE4F3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F6A86] bg-[#F4F6FB]/50">
          <div className="flex items-center gap-2">
            <span>
              Showing{" "}
              <strong className="text-[#17284D]">
                {users.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
              </strong>{" "}
              to{" "}
              <strong className="text-[#17284D]">
                {Math.min(currentPage * pageSize, pagination.totalRecords)}
              </strong>{" "}
              of <strong className="text-[#17284D]">{pagination.totalRecords}</strong> applicants
            </span>

            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 bg-white border border-[#DDE4F3] rounded-lg px-2 py-1 text-xs text-[#17284D] font-semibold outline-none"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1 || loading}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#DDE4F3] text-xs font-semibold text-[#17284D] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4F6FB] transition-colors cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="px-2 font-semibold text-[#17284D]">
              Page {currentPage} of {pagination.totalPages || 1}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages || 1, p + 1))}
              disabled={currentPage >= (pagination.totalPages || 1) || loading}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#DDE4F3] text-xs font-semibold text-[#17284D] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F4F6FB] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: APPLICANT REVIEW & DECISION DRAWER */}
      {/* ========================================================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#DDE4F3] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-[#DDE4F3] flex items-center justify-between bg-[#F4F6FB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0052CC] to-[#0065FF] text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {(selectedUser.name || selectedUser.company || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#17284D]">
                      {selectedUser.name || "Applicant Profile"}
                    </h2>
                    {renderStatusBadge(selectedUser.status)}
                  </div>
                  <p className="text-xs text-[#5F6A86] mt-0.5">
                    Application ID: #{selectedUser.id} • Registered {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString("en-IN") : "Recently"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeDetailModal}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 border border-[#DDE4F3] flex items-center justify-center text-[#5F6A86] hover:text-[#17284D] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {detailLoading && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-[#0052CC] flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin" />
                  <span>Synchronizing latest applicant details from server...</span>
                </div>
              )}

              {/* Grid 1: Company & Business Verification */}
              <div className="bg-[#F4F6FB]/70 p-4 rounded-xl border border-[#DDE4F3] space-y-3">
                <h3 className="text-xs font-bold text-[#17284D] uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0052CC]" />
                  <span>Business & Enterprise Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#5F6A86] block text-[11px]">Company / Organization Name:</span>
                    <span className="font-bold text-[#17284D] text-sm">{selectedUser.company || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6A86] block text-[11px]">GST / Tax Identification Number:</span>
                    {selectedUser.gst ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono font-bold text-[#17284D] bg-white px-2 py-0.5 rounded border border-[#DDE4F3]">
                          {selectedUser.gst}
                        </span>
                        <button
                          onClick={(e) => handleCopyGst(selectedUser.gst!, selectedUser.id, e)}
                          className="text-[11px] text-[#0052CC] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[#5F6A86] italic">Not provided</span>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#5F6A86] block text-[11px]">Registered Business Address:</span>
                    <div className="flex items-start gap-1.5 mt-0.5 text-[#17284D] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{selectedUser.address || "No address entered"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid 2: Primary Applicant Details */}
              <div className="bg-[#F4F6FB]/70 p-4 rounded-xl border border-[#DDE4F3] space-y-3">
                <h3 className="text-xs font-bold text-[#17284D] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0052CC]" />
                  <span>Applicant Contact & Credentials</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#5F6A86] block text-[11px]">Full Name:</span>
                    <span className="font-bold text-[#17284D]">{selectedUser.name || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[#5F6A86] block text-[11px]">Assigned Login Username:</span>
                    <span className="font-mono font-bold text-[#0052CC] bg-white px-2 py-0.5 rounded border border-[#DDE4F3] inline-block mt-0.5">
                      @{selectedUser.username}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#5F6A86] block text-[11px]">Email Address:</span>
                    <a
                      href={`mailto:${selectedUser.email}`}
                      className="font-semibold text-[#0052CC] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Mail className="w-3 h-3" />
                      {selectedUser.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[#5F6A86] block text-[11px]">Mobile / Phone:</span>
                    <a
                      href={`tel:${selectedUser.phone}`}
                      className="font-semibold text-[#17284D] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Phone className="w-3 h-3" />
                      {selectedUser.phone || "—"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Section 3: Super Admin Decision & Status Control */}
              <div className="bg-gradient-to-br from-blue-50/60 to-indigo-50/40 p-4.5 rounded-xl border border-blue-200 space-y-3.5">
                <h3 className="text-xs font-bold text-[#0052CC] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Super Admin Approval Decision</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Status Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#17284D] mb-1">
                      Account Status:
                    </label>
                    <select
                      value={decisionStatus}
                      onChange={(e) => setDecisionStatus(e.target.value)}
                      className="w-full text-xs bg-white border border-[#C3CEE6] rounded-xl px-3 py-2 text-[#17284D] font-bold outline-none focus:border-[#0052CC]"
                    >
                      <option value="APPROVED">APPROVED (Authorized)</option>
                      <option value="PENDING">PENDING (Under Review)</option>
                      <option value="REJECTED">REJECTED (Declined)</option>
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>

                  {/* Active Toggle */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#17284D] mb-1">
                      Platform Access (isActive):
                    </label>
                    <div className="flex items-center gap-3 h-[38px]">
                      <button
                        type="button"
                        onClick={() => setDecisionActive(!decisionActive)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          decisionActive
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-300"
                        }`}
                      >
                        {decisionActive ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Enabled (Active)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Disabled (Inactive)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Admin Audit Notes */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#17284D] mb-1">
                      Verification Notes & Audit Remarks:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter verification notes (e.g. Verified business registration documents, GST verified, etc.)..."
                      value={decisionNotes}
                      onChange={(e) => setDecisionNotes(e.target.value)}
                      className="w-full text-xs bg-white border border-[#C3CEE6] rounded-xl p-2.5 text-[#17284D] outline-none focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/15"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-[#5F6A86] uppercase">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDecisionStatus("APPROVED");
                      setDecisionActive(true);
                      setDecisionNotes("Approved by Super Admin. Verified business registration documents.");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    ✓ Quick Approve & Activate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDecisionStatus("REJECTED");
                      setDecisionActive(false);
                      setDecisionNotes("Invalid GST certificate or business registration submitted.");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    ✕ Quick Reject
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 border-t border-[#DDE4F3] flex items-center justify-between bg-[#F4F6FB]">
              <button
                type="button"
                onClick={closeDetailModal}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-200 border border-[#DDE4F3] text-xs font-bold text-[#17284D] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveDecision}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>Save Decision & Update Status</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: QUICK REJECT DIALOG */}
      {/* ========================================================= */}
      {rejectDialogUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-[#DDE4F3] overflow-hidden p-6 space-y-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17284D]">Reject Application</h3>
                <p className="text-xs text-[#5F6A86]">
                  {rejectDialogUser.company} ({rejectDialogUser.name})
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5F6A86]">
              Please provide a reason for rejecting this onboarding application. This will be recorded in the audit logs.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-[#17284D] mb-1">
                Rejection Reason / Notes:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full text-xs bg-[#F4F6FB] border border-[#C3CEE6] rounded-xl p-2.5 text-[#17284D] outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectDialogUser(null)}
                className="px-4 py-2 rounded-xl bg-[#F4F6FB] hover:bg-slate-200 border border-[#DDE4F3] text-xs font-bold text-[#17284D] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={rejectLoading}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {rejectLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>Confirm Rejection</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
