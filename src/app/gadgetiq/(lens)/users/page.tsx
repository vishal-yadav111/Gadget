"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Building2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { usersService } from "./services";
import { UserItem } from "./types";
import { companiesService } from "../companies/services";
import { CompanyItem } from "../companies/types";
import { getAuthUser, getFriendlyErrorMessage } from "../core";
import UserOnboardingPage from "../onboarding/page";

const PAGE_SIZE = 10;

export default function LensUsersPage() {
  const [activeTab, setActiveTab] = useState<"system" | "onboarding">("system");
  const [users, setUsers] = useState<UserItem[]>([]);

  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [page, setPage] = useState(0);

  const currentUser = getAuthUser();
  const isSuper = currentUser?.role === "admin";

  // Create/Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "grader",
    companyId: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    usersService
      .list()
      .then((data) => setUsers(data || []))
      .catch((err) => console.error("Failed to load users:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    companiesService
      .list()
      .then((data) => setCompanies(data || []))
      .catch(() => {});
  }, []);

  // Reset pagination when search or filter changes
  useEffect(() => {
    setPage(0);
  }, [search, companyFilter]);

  const openCreate = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "grader",
      companyId: isSuper ? "" : String(currentUser?.companyId || ""),
    });
    setError(null);
    setShowModal(true);
  };

  const openEdit = (u: UserItem) => {
    setEditingUser(u);
    setFormData({
      name: u.name || "",
      username: u.username || "",
      email: u.email || "",
      password: "",
      role: u.role || "grader",
      companyId: u.companyId ? String(u.companyId) : "",
    });
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payload: any = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        companyId:
          formData.role === "admin"
            ? null
            : formData.companyId
            ? Number(formData.companyId)
            : null,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (editingUser) {
        await usersService.update(editingUser.id, payload);
      } else {
        if (!formData.password) {
          throw new Error("Password is required for new users.");
        }
        await usersService.create(payload);
      }

      closeModal();
      fetchUsers();
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, "Failed to save user account. Please verify input data."));
    } finally {
      setSaving(false);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      !search ||
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.companyName || "").toLowerCase().includes(search.toLowerCase());

    const matchesCompany =
      !companyFilter ||
      String(u.companyId) === String(companyFilter) ||
      (u.company?.id && String(u.company.id) === String(companyFilter));

    return matchesSearch && matchesCompany;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginatedUsers = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
            Super Admin
          </span>
        );
      case "company_admin":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap bg-blue-50 text-[#0052CC] border border-blue-200 shrink-0">
            Company Admin
          </span>
        );
      case "grader":
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold whitespace-nowrap bg-emerald-50 text-[#00875A] border border-emerald-200 shrink-0">
            Technician
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Super Admin Tab Switcher */}
      {isSuper && (
        <div className="flex items-center gap-2 border-b border-[#DDE4F3] pb-3">
          <button
            onClick={() => setActiveTab("system")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "system"
                ? "bg-[#0052CC] text-white shadow-xs"
                : "bg-white text-[#5F6A86] hover:bg-[#F4F6FB] hover:text-[#17284D] border border-[#DDE4F3]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>System Users ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("onboarding")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "onboarding"
                ? "bg-[#0052CC] text-white shadow-xs"
                : "bg-white text-[#5F6A86] hover:bg-[#F4F6FB] hover:text-[#17284D] border border-[#DDE4F3]"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Signup Approvals & Onboarding</span>
          </button>
        </div>
      )}

      {activeTab === "onboarding" ? (
        <UserOnboardingPage embedded={true} />
      ) : (
        <>
          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-[#17284D] px-3 py-1.5 rounded-[8px] bg-white border border-[#DDE4F3] shadow-xs">
                {filtered.length} Registered Accounts
              </span>
              <button
                onClick={openCreate}
                className="px-4 py-2 rounded-[8px] bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New User</span>
              </button>
            </div>


        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {isSuper && companies.length > 0 && (
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="text-xs bg-white border border-[#C3CEE6] rounded-[8px] px-3 py-2 text-[#17284D] outline-none"
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          )}

          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-[#5F6A86] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] placeholder-[#5F6A86]/60 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-[12px] bg-white border border-[#DDE4F3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="bg-[#F4F6FB] border-b border-[#DDE4F3] text-[#5F6A86] font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                <th className="py-3 px-3 sm:px-4 whitespace-nowrap">User Details</th>
                <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Username</th>
                <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Role</th>
                <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Company Assigned</th>
                <th className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">QC Reports</th>
                <th className="py-3 px-3 sm:px-4 whitespace-nowrap">Registered Date</th>
                <th className="py-3 px-3 sm:px-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE4F3]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#5F6A86]">
                    <div className="w-6 h-6 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading user accounts...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#5F6A86]">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => {
                  const companyDisplay =
                    u.companyName ||
                    u.company?.name ||
                    (u.role === "admin" ? "System Wide" : "Unassigned");
                  const count = Number(u.reportCount) || 0;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* User Details */}
                      <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-[#0052CC] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {(u.name || u.username).charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-[#17284D] block">
                              {u.name || u.username}
                            </span>
                            <span className="text-[11px] text-[#5F6A86] block">
                              {u.email || "No email provided"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-3.5 px-3 sm:px-4 font-mono font-bold text-[#17284D] whitespace-nowrap">
                        @{u.username}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                        {getRoleBadge(u.role)}
                      </td>

                      {/* Company */}
                      <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                        {u.companyName || u.company?.name ? (
                          <span className="font-semibold text-[#17284D] flex items-center space-x-1">
                            <Building2 className="w-3.5 h-3.5 text-[#5F6A86] shrink-0" />
                            <span>{companyDisplay}</span>
                          </span>
                        ) : u.role === "admin" ? (
                          <span className="text-[11px] font-mono text-purple-600 font-semibold">
                            System Wide
                          </span>
                        ) : (
                          <span className="text-[#5F6A86]">Unassigned</span>
                        )}
                      </td>

                      {/* Report Count Column */}
                      <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                            count > 0
                              ? "bg-blue-50 text-[#0052CC] border border-blue-200"
                              : "bg-slate-50 text-slate-400 border border-slate-200"
                          }`}
                        >
                          <span>{count} {count === 1 ? "Report" : "Reports"}</span>
                        </span>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-3 sm:px-4 text-[#5F6A86] whitespace-nowrap font-mono text-[11px]">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 sm:px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-1.5 rounded-[6px] text-[#0052CC] hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (when > 10 users) */}
        {filtered.length > PAGE_SIZE && (
          <div className="p-3.5 sm:p-4 border-t border-[#DDE4F3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F6A86]">
            <span>
              Showing {page * PAGE_SIZE + 1} -{" "}
              {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} users
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

      {/* User Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-[16px] border border-[#DDE4F3] shadow-xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE4F3]">
              <h3 className="text-base font-bold font-display text-[#17284D]">
                {editingUser ? `Edit @${editingUser.username}` : "New User Account"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded-[6px] text-[#5F6A86] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-[8px] bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Johnathan King"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. jonathan"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs font-mono bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jjk05b@gmail.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                  {editingUser
                    ? "New Password (leave blank to keep current)"
                    : "Password"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] outline-none"
                  >
                    <option value="grader">Technician</option>
                    <option value="company_admin">Company Admin</option>
                    {isSuper && <option value="admin">Super Admin</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                    Company
                  </label>
                  <select
                    disabled={formData.role === "admin" || !isSuper}
                    value={formData.companyId}
                    onChange={(e) =>
                      setFormData({ ...formData, companyId: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] outline-none disabled:bg-slate-100 disabled:opacity-60"
                  >
                    <option value="">None / Unassigned</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#DDE4F3]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-[8px] text-xs font-semibold text-[#5F6A86] hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-[8px] bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingUser
                    ? "Update User"
                    : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

