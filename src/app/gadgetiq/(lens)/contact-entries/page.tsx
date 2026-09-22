"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Search,
  Mail,
  Phone,
  Building2,
  Calendar,
  X,
  User,
  Smartphone,
  AlertCircle,
} from "lucide-react";
import { contactEntriesService } from "./services";
import { ContactEntryItem } from "./types";
import { getFriendlyErrorMessage } from "../core";

export default function LensContactEntriesPage() {
  const [entries, setEntries] = useState<ContactEntryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<ContactEntryItem | null>(null);

  const fetchEntries = () => {
    setLoading(true);
    setError(null);
    contactEntriesService
      .list(200, 0)
      .then((data: any) => {
        const list = data?.results || data || [];
        setEntries(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Failed to load contact entries:", err);
        setError(getFriendlyErrorMessage(err, "Unable to load contact inquiries. Please check server connectivity."));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const filtered = entries.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (item.name || "").toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q) ||
      (item.phone || "").toLowerCase().includes(q) ||
      (item.company || "").toLowerCase().includes(q) ||
      (item.message || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-[#17284D] px-3 py-1.5 rounded-[8px] bg-white border border-[#DDE4F3] shadow-xs">
            {filtered.length} Contact Inquiries
          </span>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#5F6A86] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] placeholder-[#5F6A86]/60 focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
          />
        </div>
      </div>

      {/* Entries Table */}
      <div className="rounded-[12px] bg-white border border-[#DDE4F3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead>
              <tr className="bg-[#F4F6FB] border-b border-[#DDE4F3] text-[#5F6A86] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Interest / Volume</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE4F3]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#5F6A86]">
                    <div className="w-6 h-6 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading contact entries...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center space-y-2">
                    <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-1" />
                    <p className="text-xs font-bold text-[#17284D]">Failed to load inquiries</p>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">{error}</p>
                    <button
                      onClick={fetchEntries}
                      className="mt-2 px-3.5 py-1 rounded-lg bg-[#0052CC] text-white font-bold text-xs hover:bg-[#003D99] transition-colors cursor-pointer"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#5F6A86]">
                    No contact submissions found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedEntry(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {item.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <span className="font-bold text-[#17284D] block">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-[#5F6A86] block">
                            {item.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#4A5875]">
                      {item.phone || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-[#17284D]">
                      {item.company || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-[4px] bg-slate-100 border border-[#DDE4F3] text-[11px] text-[#4A5875]">
                        {item.device || item.volume || "General Demo"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#5F6A86]">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="px-2.5 py-1 text-xs font-bold text-[#0052CC] hover:bg-blue-50 rounded-[4px]">
                        View →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-[16px] border border-[#DDE4F3] shadow-xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE4F3]">
              <div>
                <h3 className="text-base font-bold font-display text-[#17284D]">
                  {selectedEntry.name}
                </h3>
                <span className="text-xs text-[#5F6A86]">
                  Submitted on{" "}
                  {selectedEntry.createdAt
                    ? new Date(selectedEntry.createdAt).toLocaleString("en-IN")
                    : "—"}
                </span>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1 rounded-[6px] text-[#5F6A86] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-[8px] bg-[#F4F6FB] border border-[#DDE4F3]">
                  <span className="text-[10px] uppercase font-bold text-[#5F6A86] block mb-1">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedEntry.email}`}
                    className="font-bold text-[#0052CC] hover:underline break-all"
                  >
                    {selectedEntry.email}
                  </a>
                </div>

                <div className="p-3 rounded-[8px] bg-[#F4F6FB] border border-[#DDE4F3]">
                  <span className="text-[10px] uppercase font-bold text-[#5F6A86] block mb-1">
                    Phone Number
                  </span>
                  <span className="font-bold font-mono text-[#17284D]">
                    {selectedEntry.phone || "Not provided"}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-[8px] bg-[#F4F6FB] border border-[#DDE4F3]">
                <span className="text-[10px] uppercase font-bold text-[#5F6A86] block mb-1">
                  Company / Organization
                </span>
                <span className="font-bold text-[#17284D]">
                  {selectedEntry.company || "Not specified"}
                </span>
              </div>

              <div className="p-3 rounded-[8px] bg-[#F4F6FB] border border-[#DDE4F3]">
                <span className="text-[10px] uppercase font-bold text-[#5F6A86] block mb-1">
                  Message / Requirements
                </span>
                <p className="text-xs text-[#17284D] leading-relaxed whitespace-pre-wrap">
                  {selectedEntry.message || "No message provided."}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#DDE4F3] flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold rounded-[8px] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

