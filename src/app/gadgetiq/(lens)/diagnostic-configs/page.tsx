"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Smartphone,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Save,
  Scale,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Layers,
  Plus,
} from "lucide-react";
import { configsService } from "./services";
import {
  CosmeticConfigPayload,
  DiagnosticTestItemConfig,
  FunctionalGradeThreshold,
  CosmeticGradeRule,
} from "./types";
import { companiesService } from "../companies/services";
import { CompanyItem } from "../companies/types";
import { getAuthUser, getFriendlyErrorMessage } from "../core";

const PAGE_SIZE = 10;

function getTestCategoryBadge(labelOrKey: string) {
  const text = (labelOrKey || "").trim();
  const lower = text.toLowerCase();

  if (lower.startsWith("battery health") || lower.includes("battery health") || lower.includes("batteryhealth")) {
    return {
      label: "⚡ Battery Health Tier",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    };
  }
  if (lower.includes("battery") || lower.includes("charging") || lower.includes("power")) {
    return {
      label: "⚡ Battery & Power System",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    };
  }
  if (lower.includes("camera") || lower.includes("lens") || lower.includes("photo") || lower.includes("flash") || lower.includes("face id")) {
    return {
      label: "⚡ Camera & Optics Module",
      color: "bg-purple-50 text-purple-800 border-purple-200",
    };
  }
  if (lower.includes("screen") || lower.includes("display") || lower.includes("touch") || lower.includes("pixel") || lower.includes("lcd") || lower.includes("oled")) {
    return {
      label: "⚡ Display & Touch Screen",
      color: "bg-blue-50 text-blue-800 border-blue-200",
    };
  }
  if (lower.includes("audio") || lower.includes("speaker") || lower.includes("mic") || lower.includes("sound") || lower.includes("earpiece") || lower.includes("headphone")) {
    return {
      label: "⚡ Audio & Acoustic System",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    };
  }
  if (lower.includes("wifi") || lower.includes("wi-fi") || lower.includes("bluetooth") || lower.includes("cellular") || lower.includes("gps") || lower.includes("nfc") || lower.includes("sim") || lower.includes("network") || lower.includes("esim")) {
    return {
      label: "⚡ Connectivity & Wireless",
      color: "bg-cyan-50 text-cyan-800 border-cyan-200",
    };
  }
  if (lower.includes("fingerprint") || lower.includes("touch id") || lower.includes("biometric") || lower.includes("sensor") || lower.includes("gyro") || lower.includes("proximity") || lower.includes("accelerometer") || lower.includes("compass")) {
    return {
      label: "⚡ Biometric & Sensor Suite",
      color: "bg-indigo-50 text-indigo-800 border-indigo-200",
    };
  }
  if (lower.includes("cpu") || lower.includes("gpu") || lower.includes("ram") || lower.includes("memory") || lower.includes("storage") || lower.includes("disk") || lower.includes("processor") || lower.includes("ssd") || lower.includes("hdd")) {
    return {
      label: "⚡ Performance & Memory Tier",
      color: "bg-violet-50 text-violet-800 border-violet-200",
    };
  }
  if (lower.includes("keyboard") || lower.includes("trackpad") || lower.includes("button") || lower.includes("vibrat") || lower.includes("port") || lower.includes("usb") || lower.includes("hinge") || lower.includes("body")) {
    return {
      label: "⚡ Physical Hardware & Controls",
      color: "bg-slate-100 text-slate-800 border-slate-200",
    };
  }

  // Dynamic extract from the first 2-3 words
  const cleanWords = text.replace(/[^a-zA-Z0-9\s]/g, "").trim().split(/\s+/).slice(0, 3).join(" ");
  return {
    label: cleanWords ? `⚡ ${cleanWords} Tier` : "⚡ Hardware Diagnostic Test",
    color: "bg-slate-100 text-slate-800 border-slate-200",
  };
}

export default function LensDiagnosticConfigsPage() {
  const user = getAuthUser();
  const isAdmin = user?.role === "admin";

  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(
    isAdmin ? "" : String(user?.companyId || "")
  );

  // Tabs: 'phone' | 'laptop' | 'functional' | 'cosmetic'
  const [activeTab, setActiveTab] = useState<
    "phone" | "laptop" | "functional" | "cosmetic"
  >("phone");

  const [configs, setConfigs] = useState<any[]>([]);
  const [serverConfigs, setServerConfigs] = useState<any[]>([]);
  const [cosmeticWeight, setCosmeticWeight] = useState({
    bodyWeightage: 40,
    screenWeightage: 60,
  });
  const [serverWeight, setServerWeight] = useState({
    bodyWeightage: 40,
    screenWeightage: 60,
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isAdmin) {
      companiesService
        .list()
        .then((list) => setCompanies(list || []))
        .catch(() => { });
    }
  }, [isAdmin]);

  const loadConfigs = async () => {
    setLoading(true);
    setStatusMessage(null);
    setSearch("");
    setPage(0);

    try {
      if (activeTab === "cosmetic") {
        const res = await configsService.getCosmetic(
          selectedCompanyId || undefined
        );
        const payload = ((res as any)?.data || res || {}) as Partial<CosmeticConfigPayload>;
        const weight = payload.weightage || { bodyWeightage: 40, screenWeightage: 60 };
        const rules = payload.gradeRules || [];
        setCosmeticWeight(weight);
        setServerWeight(weight);
        setConfigs(rules);
        setServerConfigs(JSON.parse(JSON.stringify(rules)));
      } else if (activeTab === "functional") {
        const res = await configsService.getFunctional(
          selectedCompanyId || undefined
        );
        const list = (res as any)?.data || res || [];
        const validList = Array.isArray(list) ? list : [];
        setConfigs(validList);
        setServerConfigs(JSON.parse(JSON.stringify(validList)));
      } else {
        const res = await configsService.getDiagnostic(
          selectedCompanyId || undefined,
          activeTab
        );
        const list = (res as any)?.data || res || [];
        const sortedList = Array.isArray(list)
          ? [...list].sort((a, b) => {
            const labelA = String(a.label || a.key || a.testKey || "").toLowerCase();
            const labelB = String(b.label || b.key || b.testKey || "").toLowerCase();
            return labelA.localeCompare(labelB);
          })
          : [];
        setConfigs(sortedList);
        setServerConfigs(JSON.parse(JSON.stringify(sortedList)));
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: getFriendlyErrorMessage(err, "Failed to load diagnostic configurations. Please try again."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, [selectedCompanyId, activeTab]);

  // Reset pagination on search
  useEffect(() => {
    setPage(0);
  }, [search]);

  const handleInputChange = (index: number, field: string, value: any) => {
    setConfigs((prev) => {
      const updated = [...prev];
      let formattedVal = value;
      if (field === "minScore" || field === "maxScore" || field === "passScore" || field === "failScore" || field === "naScore") {
        formattedVal = value === "" ? "" : Number(value);
      }
      updated[index] = {
        ...updated[index],
        [field]: formattedVal,
      };
      return updated;
    });
  };

  const handleAddGradeRule = () => {
    const isCosmetic = activeTab === "cosmetic";
    const nextRuleIndex = configs.length + 1;
    const newRule = {
      grade: `Grade ${nextRuleIndex}A`,
      minScore: 0,
      maxScore: 100,
      label: isCosmetic ? "Cosmetic Quality Tier" : "Functional Quality Tier",
      description: isCosmetic ? "Cosmetic Quality Tier" : "Functional Quality Tier",
      isActive: true,
    };
    setConfigs((prev) => [newRule, ...prev]);
    setPage(0);
    setSearch("");
    setStatusMessage({
      type: "success",
      text: `New ${isCosmetic ? "Cosmetic" : "Functional"} grade rule added. Edit values in the row and click 'Save Configs' below.`,
    });
  };

  const handleAddDiagnosticTest = () => {
    const isPhone = activeTab === "phone";
    const nextIdx = configs.length + 1;
    const newTest: DiagnosticTestItemConfig = {
      label: isPhone ? `Battery Health (${nextIdx * 10}%)` : `Hardware Test #${nextIdx}`,
      key: `diagnostic_test_${Date.now()}`,
      keys: [`diagnostic_test_${Date.now()}`],
      deviceType: activeTab,
      passScore: 5,
      failScore: 0,
      naScore: 0,
      maxScore: 5,
      isActive: true,
    };
    setConfigs((prev) => [newTest, ...prev]);
    setPage(0);
    setSearch("");
    setStatusMessage({
      type: "success",
      text: `New ${isPhone ? "Phone" : "Laptop"} diagnostic test added. Configure parameters and click 'Save Configs' below.`,
    });
  };

  const handleRevert = () => {
    setConfigs(JSON.parse(JSON.stringify(serverConfigs)));
    setCosmeticWeight({ ...serverWeight });
    setSearch("");
    setPage(0);
    setStatusMessage({
      type: "success",
      text: "Unsaved changes and newly added rows have been reverted to saved state.",
    });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);

    try {
      const companyParam = selectedCompanyId
        ? Number(selectedCompanyId)
        : null;

      if (activeTab === "cosmetic") {
        await configsService.saveCosmetic(
          {
            weightage: cosmeticWeight,
            gradeRules: configs,
          },
          companyParam
        );
      } else if (activeTab === "functional") {
        await configsService.saveFunctional(configs, companyParam);
      } else {
        await configsService.saveDiagnostic(configs, companyParam);
      }

      setServerConfigs(JSON.parse(JSON.stringify(configs)));
      setServerWeight({ ...cosmeticWeight });

      setStatusMessage({
        type: "success",
        text: "Diagnostic configurations updated successfully.",
      });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: getFriendlyErrorMessage(err, "Failed to save configurations. Please verify values and try again."),
      });
    } finally {
      setSaving(false);
    }
  };

  // Filter items based on search query
  const filteredConfigsWithIndex = useMemo(() => {
    return configs
      .map((item, originalIndex) => ({ item, originalIndex }))
      .filter(({ item, originalIndex }) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        const label = String(item.label || item.description || item.testKey || item.grade || `Rule #${originalIndex + 1}`).toLowerCase();
        const grade = String(item.grade || "").toLowerCase();
        const keyStr = String(item.key || (Array.isArray(item.keys) ? item.keys.join(" ") : "")).toLowerCase();
        return label.includes(q) || grade.includes(q) || keyStr.includes(q);
      });
  }, [configs, search]);

  const totalFiltered = filteredConfigsWithIndex.length;
  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE);
  const paginatedItems = filteredConfigsWithIndex.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Tabs & Company Filter */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-3 border-b border-[#DDE4F3]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveTab("phone")}
            className={`px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${activeTab === "phone"
              ? "bg-[#0052CC] text-white shadow-xs"
              : "bg-white text-[#5F6A86] border border-[#DDE4F3] hover:text-[#17284D]"
              }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone Diagnostics</span>
          </button>

          <button
            onClick={() => setActiveTab("laptop")}
            className={`px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${activeTab === "laptop"
              ? "bg-[#0052CC] text-white shadow-xs"
              : "bg-white text-[#5F6A86] border border-[#DDE4F3] hover:text-[#17284D]"
              }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Laptop Diagnostics</span>
          </button>

          <button
            onClick={() => setActiveTab("functional")}
            className={`px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${activeTab === "functional"
              ? "bg-[#0052CC] text-white shadow-xs"
              : "bg-white text-[#5F6A86] border border-[#DDE4F3] hover:text-[#17284D]"
              }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Functional Thresholds</span>
          </button>

          <button
            onClick={() => setActiveTab("cosmetic")}
            className={`px-3.5 py-2 rounded-[8px] text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shrink-0 ${activeTab === "cosmetic"
              ? "bg-[#0052CC] text-white shadow-xs"
              : "bg-white text-[#5F6A86] border border-[#DDE4F3] hover:text-[#17284D]"
              }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cosmetic Matrix</span>
          </button>
        </div>

        {/* Company Filter, Actions & Save Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {isAdmin && companies.length > 0 && (
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="text-xs bg-white border border-[#C3CEE6] rounded-[8px] px-3 py-2 text-[#17284D] outline-none"
            >
              <option value="">Default Global Rules</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code})
                </option>
              ))}
            </select>
          )}



          {/* <button
            onClick={loadConfigs}
            disabled={loading}
            className="p-2 rounded-[8px] bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] transition-colors cursor-pointer"
            title="Reload configurations"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin text-[#0052CC]" : ""}`} />
          </button> */}

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-4 py-2 rounded-[8px] bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-60 shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Configs"}</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-[8px] border text-xs flex items-center gap-2 ${statusMessage.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-[#00875A]"
            : "bg-rose-50 border-rose-200 text-[#C7300A]"
            }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Cosmetic Weightages Card (Only when on cosmetic tab) */}
      {activeTab === "cosmetic" && (
        <div className="p-4 rounded-[10px] bg-white border border-[#DDE4F3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#17284D]">
                Body Weightage:
              </span>
              <input
                type="number"
                value={cosmeticWeight.bodyWeightage}
                onChange={(e) =>
                  setCosmeticWeight({
                    ...cosmeticWeight,
                    bodyWeightage: Number(e.target.value),
                  })
                }
                className="w-16 px-2.5 py-1 text-xs font-mono font-bold bg-[#F4F6FB] border border-[#C3CEE6] rounded-[6px] text-[#0052CC] focus:border-[#0052CC] focus:bg-white outline-none"
              />
              <span className="text-xs text-[#5F6A86]">%</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#17284D]">
                Screen Weightage:
              </span>
              <input
                type="number"
                value={cosmeticWeight.screenWeightage}
                onChange={(e) =>
                  setCosmeticWeight({
                    ...cosmeticWeight,
                    screenWeightage: Number(e.target.value),
                  })
                }
                className="w-16 px-2.5 py-1 text-xs font-mono font-bold bg-[#F4F6FB] border border-[#C3CEE6] rounded-[6px] text-[#0052CC] focus:border-[#0052CC] focus:bg-white outline-none"
              />
              <span className="text-xs text-[#5F6A86]">%</span>
            </div>
          </div>
          <span className="text-xs text-[#5F6A86]">
            Total weight: {cosmeticWeight.bodyWeightage + cosmeticWeight.screenWeightage}%
          </span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#DDE4F3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0052CC] font-mono text-xs font-bold">
            {totalFiltered} Items Configured
          </span>
          <span className="text-xs text-[#5F6A86] hidden sm:inline">
            {activeTab === "functional"
              ? "Min/Max thresholds and grade tier descriptions"
              : activeTab === "cosmetic"
                ? "Cosmetic point cutoffs and grade tier descriptions"
                : `Tolerances & Score Matrix for ${activeTab.toUpperCase()}`}
          </span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#5F6A86] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search test names, rules, or keys..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-xl text-[#17284D] placeholder-[#5F6A86]/60 focus:border-[#0052CC] focus:bg-white outline-none transition-all"
          />
        </div>
      </div>

      {/* Configs Table */}
      <div className="rounded-[12px] bg-white border border-[#DDE4F3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[780px]">
            <thead>
              <tr className="bg-[#F4F6FB] border-b border-[#DDE4F3] text-[#5F6A86] font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                {activeTab === "functional" ? (
                  <>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Min Score (pts)</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Max Score (pts)</th>
                    <th className="py-3 px-4 whitespace-nowrap">Functional Grade</th>
                    <th className="py-3 px-4 whitespace-nowrap">Label / Description</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                  </>
                ) : activeTab === "cosmetic" ? (
                  <>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Min Score (pts)</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Max Score (pts)</th>
                    <th className="py-3 px-4 whitespace-nowrap">Cosmetic Grade</th>
                    <th className="py-3 px-4 whitespace-nowrap">Label / Description</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap">Status</th>
                  </>
                ) : (
                  <>
                    <th className="py-3 px-4 whitespace-nowrap">Test Label</th>
                    <th className="py-3 px-4 whitespace-nowrap">Identifier / Keys</th>
                    <th className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">Pass Score (pts)</th>
                    <th className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">Fail Score (pts)</th>
                    <th className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">N/A Score (pts)</th>
                    <th className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">Max Score (pts)</th>
                    <th className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDE4F3]">
              {loading ? (
                <tr>
                  <td
                    colSpan={activeTab === "functional" || activeTab === "cosmetic" ? 5 : 7}
                    className="py-12 text-center text-[#5F6A86]"
                  >
                    <div className="w-6 h-6 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading configuration matrix...
                  </td>
                </tr>
              ) : paginatedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={activeTab === "functional" || activeTab === "cosmetic" ? 5 : 7}
                    className="py-12 text-center text-[#5F6A86] space-y-2"
                  >
                    <Layers className="w-7 h-7 text-slate-300 mx-auto mb-1" />
                    <p className="font-bold text-[#17284D]">No configuration records found</p>
                    <p className="text-xs text-slate-500">
                      {search ? `No items match "${search}"` : "No configuration items available for this tab."}
                    </p>
                    {activeTab === "phone" || activeTab === "laptop" ? (
                      <button
                        onClick={handleAddDiagnosticTest}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003D99] transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{activeTab === "phone" ? "Add First Phone Diagnostic Test" : "Add First Laptop Diagnostic Test"}</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleAddGradeRule}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0052CC] text-white text-xs font-bold hover:bg-[#003D99] transition-colors cursor-pointer inline-flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{activeTab === "cosmetic" ? "Add First Cosmetic Grade Rule" : "Add First Functional Grade Rule"}</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedItems.map(({ item, originalIndex }) => {
                  const isItemActive = item.isActive !== false;

                  if (activeTab === "functional" || activeTab === "cosmetic") {
                    return (
                      <tr key={item.id || originalIndex} className="hover:bg-slate-50/80 transition-colors">
                        {/* 1. Min Score (pts) */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <input
                            type="number"
                            value={item.minScore ?? ""}
                            onChange={(e) =>
                              handleInputChange(originalIndex, "minScore", e.target.value)
                            }
                            className="w-20 px-2.5 py-1 text-xs font-mono font-bold bg-[#F4F6FB] border border-[#C3CEE6] rounded-[6px] text-[#17284D] focus:border-[#0052CC] focus:bg-white outline-none text-center"
                          />
                        </td>

                        {/* 2. Max Score (pts) */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <input
                            type="number"
                            value={item.maxScore ?? ""}
                            onChange={(e) =>
                              handleInputChange(originalIndex, "maxScore", e.target.value)
                            }
                            className="w-20 px-2.5 py-1 text-xs font-mono font-bold bg-[#F4F6FB] border border-[#C3CEE6] rounded-[6px] text-[#17284D] focus:border-[#0052CC] focus:bg-white outline-none text-center"
                          />
                        </td>

                        {/* 3. Functional / Cosmetic Grade */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="text"
                              value={item.grade || ""}
                              onChange={(e) =>
                                handleInputChange(originalIndex, "grade", e.target.value)
                              }
                              placeholder="e.g. Grade 1A"
                              className="w-28 px-2.5 py-1 text-xs font-mono font-bold bg-blue-50/60 border border-blue-200 text-[#0052CC] rounded-[6px] focus:border-[#0052CC] focus:bg-white outline-none"
                            />
                          </div>
                        </td>

                        {/* 4. Label / Description */}
                        <td className="py-3.5 px-4">
                          <input
                            type="text"
                            value={item.label || item.description || ""}
                            onChange={(e) => {
                              handleInputChange(originalIndex, "label", e.target.value);
                              handleInputChange(originalIndex, "description", e.target.value);
                            }}
                            placeholder="e.g. Like New / Pristine (Zero Scratches)"
                            className="w-full min-w-[200px] px-2.5 py-1 text-xs bg-[#F4F6FB] border border-[#C3CEE6] rounded-[6px] text-[#17284D] focus:border-[#0052CC] focus:bg-white outline-none font-medium"
                          />
                        </td>

                        {/* 5. Status Toggle CTA */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() =>
                              handleInputChange(originalIndex, "isActive", !isItemActive)
                            }
                            className="inline-flex items-center gap-2 cursor-pointer group focus:outline-none select-none"
                            title={isItemActive ? "Click to set Inactive" : "Click to set Active"}
                          >
                            <div
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isItemActive ? "bg-[#00875A]" : "bg-slate-300"
                                }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isItemActive ? "translate-x-4" : "translate-x-0"
                                  }`}
                              />
                            </div>
                            <span
                              className={`text-[11px] font-bold ${isItemActive ? "text-[#00875A]" : "text-slate-500"
                                }`}
                            >
                              {isItemActive ? "Active" : "Inactive"}
                            </span>
                          </button>
                        </td>
                      </tr>
                    );
                  }

                  // Phone & Laptop Diagnostics Row
                  const keyList: string[] = Array.isArray(item.keys) && item.keys.length > 0
                    ? item.keys
                    : item.key
                      ? [item.key]
                      : item.testKey
                        ? [item.testKey]
                        : [];

                  const categoryBadge = getTestCategoryBadge(item.label || item.testKey || item.key || "");

                  return (
                    <tr key={item.id || originalIndex} className="hover:bg-slate-50/80 transition-colors">
                      {/* Test Label & Category Badge */}
                      <td className="py-3 px-4 font-medium text-[#17284D]">
                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={item.label || item.testKey || ""}
                            onChange={(e) =>
                              handleInputChange(originalIndex, "label", e.target.value)
                            }
                            placeholder="e.g. Battery Health (< 70%)"
                            className="w-full min-w-[210px] px-2.5 py-1 text-xs font-bold text-[#17284D] bg-[#F4F6FB] border border-[#C3CEE6] rounded-[6px] focus:border-[#0052CC] focus:bg-white outline-none transition-all"
                          />
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-bold border tracking-tight ${categoryBadge.color}`}
                            >
                              {categoryBadge.label}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Identifier / Keys */}
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={
                            Array.isArray(item.keys) && item.keys.length > 0
                              ? item.keys.join(", ")
                              : item.key || item.testKey || ""
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            const keysArr = val.split(",").map((k) => k.trim()).filter(Boolean);
                            handleInputChange(originalIndex, "keys", keysArr);
                            handleInputChange(originalIndex, "key", keysArr[0] || val.trim());
                            handleInputChange(originalIndex, "testKey", keysArr[0] || val.trim());
                          }}
                          placeholder="e.g. batteryhealth_lt_70, battery"
                          className="w-full min-w-[160px] px-2.5 py-1 text-[11px] font-mono bg-[#F4F6FB] border border-[#C3CEE6] rounded-[6px] text-[#17284D] focus:border-[#0052CC] focus:bg-white outline-none transition-all"
                        />
                      </td>

                      {/* Pass Score (pts) */}
                      <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                        <input
                          type="number"
                          value={item.passScore ?? 0}
                          onChange={(e) =>
                            handleInputChange(originalIndex, "passScore", e.target.value)
                          }
                          className="w-18 px-2 py-1 text-xs font-mono font-bold bg-emerald-50/60 border border-emerald-200 text-[#00875A] rounded-[6px] focus:border-emerald-500 focus:bg-white outline-none text-center"
                        />
                      </td>

                      {/* Fail Score (pts) */}
                      <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                        <input
                          type="number"
                          value={item.failScore ?? 0}
                          onChange={(e) =>
                            handleInputChange(originalIndex, "failScore", e.target.value)
                          }
                          className="w-18 px-2 py-1 text-xs font-mono font-bold bg-rose-50/60 border border-rose-200 text-[#C7300A] rounded-[6px] focus:border-rose-500 focus:bg-white outline-none text-center"
                        />
                      </td>

                      {/* N/A Score (pts) */}
                      <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                        <input
                          type="number"
                          value={item.naScore ?? 0}
                          onChange={(e) =>
                            handleInputChange(originalIndex, "naScore", e.target.value)
                          }
                          className="w-18 px-2 py-1 text-xs font-mono font-bold bg-slate-100 border border-slate-200 text-[#4A5875] rounded-[6px] focus:border-slate-400 focus:bg-white outline-none text-center"
                        />
                      </td>

                      {/* Max Score (pts) */}
                      <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                        <input
                          type="number"
                          value={item.maxScore ?? item.passScore ?? 0}
                          onChange={(e) =>
                            handleInputChange(originalIndex, "maxScore", e.target.value)
                          }
                          className="w-18 px-2 py-1 text-xs font-mono font-bold bg-blue-50/60 border border-blue-200 text-[#0052CC] rounded-[6px] focus:border-[#0052CC] focus:bg-white outline-none text-center"
                        />
                      </td>

                      {/* Status Toggle CTA */}
                      <td className="py-3 px-3 sm:px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange(originalIndex, "isActive", !isItemActive)
                          }
                          className="inline-flex items-center gap-2 cursor-pointer group focus:outline-none select-none"
                          title={isItemActive ? "Click to set Inactive" : "Click to set Active"}
                        >
                          <div
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${isItemActive ? "bg-[#00875A]" : "bg-slate-300"
                              }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isItemActive ? "translate-x-4" : "translate-x-0"
                                }`}
                            />
                          </div>
                          <span
                            className={`text-[11px] font-bold ${isItemActive ? "text-[#00875A]" : "text-slate-500"
                              }`}
                          >
                            {isItemActive ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls (when > 10 items) */}
        {totalFiltered > PAGE_SIZE && (
          <div className="p-3.5 sm:p-4 border-t border-[#DDE4F3] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5F6A86]">
            <span>
              Showing {page * PAGE_SIZE + 1} -{" "}
              {Math.min((page + 1) * PAGE_SIZE, totalFiltered)} of {totalFiltered} configurations
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

      {/* Bottom Action Controls: Add Rule & Save/Revert/Refresh toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white rounded-[12px] border border-[#DDE4F3] shadow-xs">
        <div>
          {activeTab === "cosmetic" ? (
            <button
              onClick={handleAddGradeRule}
              className="px-4 py-2 rounded-[8px] bg-emerald-50 hover:bg-emerald-100 text-[#00875A] border border-emerald-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Cosmetic Grade Rule</span>
            </button>
          ) : activeTab === "functional" ? (
            <button
              onClick={handleAddGradeRule}
              className="px-4 py-2 rounded-[8px] bg-emerald-50 hover:bg-emerald-100 text-[#00875A] border border-emerald-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Functional Grade Rule</span>
            </button>
          ) : activeTab === "phone" ? (
            <button
              onClick={handleAddDiagnosticTest}
              className="px-4 py-2 rounded-[8px] bg-emerald-50 hover:bg-emerald-100 text-[#00875A] border border-emerald-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Phone Diagnostic Test</span>
            </button>
          ) : (
            <button
              onClick={handleAddDiagnosticTest}
              className="px-4 py-2 rounded-[8px] bg-emerald-50 hover:bg-emerald-100 text-[#00875A] border border-emerald-200 text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Laptop Diagnostic Test</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 justify-end">
          <button
            onClick={handleRevert}
            disabled={loading || saving}
            className="px-4 py-2 rounded-[8px] bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Revert all unsaved modifications and newly added rows"
          >
            <RotateCcw className={`w-3.5 h-3.5`} />
            <span>Revert Changes</span>
          </button>

          {/* <button
            onClick={loadConfigs}
            disabled={loading || saving}
            className="p-2 rounded-[8px] bg-[#F4F6FB] hover:bg-[#E9EEF9] border border-[#DDE4F3] text-[#17284D] transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh configurations from server"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? "animate-spin text-[#0052CC]" : ""}`} />
          </button> */}

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-5 py-2 rounded-[8px] bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-60 shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Configs..." : "Save Configs"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
