"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { companiesService } from "./services";
import { TenantCompany, CompanyItem, CreateCompanyPayload } from "./types";
import { getFriendlyErrorMessage } from "../core";

const EMPTY_FORM: CreateCompanyPayload = { name: "", code: "", description: "" };

export default function LensCompaniesPage() {
  const [companies, setCompanies] = useState<TenantCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TenantCompany | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = () => {
    setLoading(true);
    companiesService
      .list()
      .then((data) => setCompanies(data || []))
      .catch((err) => console.error("Failed to load companies:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData(EMPTY_FORM);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (c: TenantCompany) => {
    setEditing(c);
    setFormData({
      name: c.name,
      code: c.code,
      description: c.description || "",
    });
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      if (editing) {
        await companiesService.update(editing.id, formData);
      } else {
        await companiesService.create(formData);
      }
      closeModal();
      fetchCompanies();
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, "Failed to save company details. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (company: TenantCompany) => {
    if (!window.confirm(`Delete "${company.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await companiesService.delete(company.id);
      fetchCompanies();
    } catch (err: any) {
      alert(getFriendlyErrorMessage(err, "Failed to delete company. Please try again."));
    }
  };

  const filtered = companies.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.code || "").toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="text-xs font-bold text-[#17284D] px-3 py-1.5 rounded-[8px] bg-white border border-[#DDE4F3] shadow-xs">
            {filtered.length} Tenant Companies
          </span>
          <button
            onClick={openCreate}
            className="px-3.5 sm:px-4 py-2 rounded-[8px] bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Company</span>
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#5F6A86] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] placeholder-[#5F6A86]/60 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
          />
        </div>
      </div>

      {/* Companies Table with Horizontal Scroll */}
      <div className="rounded-[12px] bg-white border border-[#DDE4F3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[560px]">
            <thead>
              <tr className="bg-[#F4F6FB] border-b border-[#DDE4F3] text-[#5F6A86] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">Tenant Code</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE4F3]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#5F6A86]">
                    <div className="w-6 h-6 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading companies...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#5F6A86]">
                    No companies found. Click &quot;New Company&quot; to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-[6px] bg-emerald-100 text-[#00875A] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {company.name?.charAt(0) || "C"}
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-[#17284D] block truncate">
                            {company.name}
                          </span>
                          {company.description && (
                            <span className="text-[11px] text-[#5F6A86] block truncate max-w-xs">
                              {company.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0052CC]">
                      <span className="px-2 py-0.5 rounded-[4px] bg-blue-50 border border-blue-200">
                        {company.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          company.isActive !== false
                            ? "bg-emerald-50 text-[#00875A] border border-emerald-200"
                            : "bg-rose-50 text-rose-600 border border-rose-200"
                        }`}
                      >
                        {company.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5F6A86]">
                      {company.createdAt
                        ? new Date(company.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => openEdit(company)}
                          className="p-1.5 rounded-[6px] text-[#0052CC] hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(company)}
                          className="p-1.5 rounded-[6px] text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Create / Edit Company Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-[16px] border border-[#DDE4F3] shadow-xl p-5 sm:p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#DDE4F3]">
              <h3 className="text-sm sm:text-base font-bold font-display text-[#17284D]">
                {editing ? "Edit Company" : "New Tenant Company"}
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

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Refurbishments"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                  Tenant Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ACME"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs font-mono uppercase bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Notes or warehouse location..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
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
                    : editing
                    ? "Save Changes"
                    : "Create Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
