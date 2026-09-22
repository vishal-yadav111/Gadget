"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  GitBranch,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronRight,
  Check,
  CheckCircle2,
  Sliders,
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Smartphone,
  Laptop,
  Layers,
  X,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
} from "lucide-react";
import { workflowsService } from "./services";
import {
  WorkflowItem,
  SectionItem,
  QuestionItem,
  OptionItem,
} from "./types";
import { getFriendlyErrorMessage } from "../core";

const OS_TABS = [
  { key: "android", label: "Android", icon: Smartphone },
  { key: "ios", label: "iOS", icon: Smartphone },
  { key: "windows", label: "Windows", icon: Laptop },
  { key: "macos", label: "MacBook", icon: Laptop },
];

interface DeleteTarget {
  type: "workflow" | "section" | "question" | "option";
  id: number;
  title: string;
  parentId?: number;
}

export default function LensWorkflowsPage() {
  const [activeOs, setActiveOs] = useState("android");
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingDefault, setSavingDefault] = useState(false);

  // New Workflow Modal State
  const [showCreateWorkflowModal, setShowCreateWorkflowModal] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowOs, setNewWorkflowOs] = useState("android");
  const [creatingWorkflow, setCreatingWorkflow] = useState(false);
  const [workflowModalError, setWorkflowModalError] = useState<string | null>(null);

  // New Section State
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addingSection, setAddingSection] = useState(false);

  // New Question State (per sectionId)
  const [newQTitle, setNewQTitle] = useState<{ [secId: number]: string }>({});
  const [newQMultiSelect, setNewQMultiSelect] = useState<{ [secId: number]: boolean }>({});
  const [addingQ, setAddingQ] = useState<{ [secId: number]: boolean }>({});

  // 2-Step Verification Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggling Multi-Select State
  const [togglingMulti, setTogglingMulti] = useState<{ [qId: number]: boolean }>({});

  const fetchWorkflows = useCallback(async () => {
    setLoading(true);
    try {
      const list = await workflowsService.list(activeOs);
      setWorkflows(list || []);

      if (list && list.length > 0) {
        // Keep currently selected workflow if still present, else select default/first
        const currentStillExists = selectedWorkflow ? list.find((w) => w.id === selectedWorkflow.id) : null;
        const target = currentStillExists || list.find((w: WorkflowItem) => w.isDefault) || list[0];
        const detail = await workflowsService.getById(target.id);
        setSelectedWorkflow((detail as any)?.workflow || detail || target);
      } else {
        setSelectedWorkflow(null);
      }
    } catch (err) {
      console.error("Failed to load workflows:", err);
    } finally {
      setLoading(false);
    }
  }, [activeOs]);

  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  const selectWorkflow = async (wf: WorkflowItem) => {
    setLoading(true);
    try {
      const detail = await workflowsService.getById(wf.id);
      setSelectedWorkflow((detail as any)?.workflow || detail || wf);
    } catch (err) {
      console.error("Failed to load workflow details:", err);
    } finally {
      setLoading(false);
    }
  };

  const reloadCurrentWorkflow = async () => {
    if (!selectedWorkflow) return;
    try {
      const detail = await workflowsService.getById(selectedWorkflow.id);
      setSelectedWorkflow((detail as any)?.workflow || detail || selectedWorkflow);
    } catch (err) {
      console.error("Failed to reload workflow:", err);
    }
  };

  // --- Create Workflow ---
  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflowName.trim()) return;
    setCreatingWorkflow(true);
    setWorkflowModalError(null);

    try {
      const res = await workflowsService.create({
        name: newWorkflowName.trim(),
        osType: newWorkflowOs,
      });

      setShowCreateWorkflowModal(false);
      setNewWorkflowName("");
      setActiveOs(newWorkflowOs);

      // Refresh list
      const list = await workflowsService.list(newWorkflowOs);
      setWorkflows(list || []);
      const created = (res as any)?.data?.workflow || (res as any)?.workflow || (list && list[list.length - 1]);
      if (created) {
        await selectWorkflow(created);
      }
    } catch (err: any) {
      setWorkflowModalError(getFriendlyErrorMessage(err, "Failed to create new workflow."));
    } finally {
      setCreatingWorkflow(false);
    }
  };

  // --- Set Default ---
  const handleSetDefault = async () => {
    if (!selectedWorkflow) return;
    setSavingDefault(true);
    try {
      await workflowsService.setDefault(selectedWorkflow.id);
      await fetchWorkflows();
    } catch (err: any) {
      alert(getFriendlyErrorMessage(err, "Failed to set default workflow. Please try again."));
    } finally {
      setSavingDefault(false);
    }
  };

  // --- Add Section ---
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorkflow || !newSectionTitle.trim()) return;
    setAddingSection(true);
    try {
      await workflowsService.addSection(selectedWorkflow.id, {
        title: newSectionTitle.trim(),
        orderIdx: (selectedWorkflow.sections?.length || 0) + 1,
      });
      setNewSectionTitle("");
      await reloadCurrentWorkflow();
    } catch (err: any) {
      alert(getFriendlyErrorMessage(err, "Failed to add section. Please try again."));
    } finally {
      setAddingSection(false);
    }
  };

  // --- Add Question ---
  const handleAddQuestion = async (secId: number) => {
    const title = newQTitle[secId]?.trim();
    if (!title || !selectedWorkflow) return;
    const isMulti = !!newQMultiSelect[secId];
    setAddingQ((prev) => ({ ...prev, [secId]: true }));
    try {
      await workflowsService.addQuestion(secId, {
        title,
        multiSelect: isMulti,
        orderIdx: 999,
      });
      setNewQTitle((prev) => ({ ...prev, [secId]: "" }));
      setNewQMultiSelect((prev) => ({ ...prev, [secId]: false }));
      await reloadCurrentWorkflow();
    } catch (err: any) {
      alert(getFriendlyErrorMessage(err, "Failed to add question. Please try again."));
    } finally {
      setAddingQ((prev) => ({ ...prev, [secId]: false }));
    }
  };

  // --- Toggle Multi-Select on Question ---
  const handleToggleMultiSelect = async (q: QuestionItem) => {
    setTogglingMulti((prev) => ({ ...prev, [q.id]: true }));
    try {
      await workflowsService.updateQuestion(q.id, {
        title: q.title,
        multiSelect: !q.multiSelect,
      });
      await reloadCurrentWorkflow();
    } catch (err: any) {
      alert(getFriendlyErrorMessage(err, "Failed to update question selection mode."));
    } finally {
      setTogglingMulti((prev) => ({ ...prev, [q.id]: false }));
    }
  };

  // --- Add Option ---
  const handleAddOption = async (qId: number, label: string, score: number) => {
    if (!label.trim()) return;
    try {
      await workflowsService.addOption(qId, {
        label: label.trim(),
        score: Number(score) || 0,
        orderIdx: 999,
      });
      await reloadCurrentWorkflow();
    } catch (err: any) {
      alert(getFriendlyErrorMessage(err, "Failed to add option. Please try again."));
    }
  };

  // --- 2-Step Verification Execution ---
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      switch (deleteTarget.type) {
        case "workflow":
          await workflowsService.delete(deleteTarget.id);
          setDeleteTarget(null);
          await fetchWorkflows();
          break;

        case "section":
          await workflowsService.deleteSection(deleteTarget.id);
          setDeleteTarget(null);
          await reloadCurrentWorkflow();
          break;

        case "question":
          await workflowsService.deleteQuestion(deleteTarget.id);
          setDeleteTarget(null);
          await reloadCurrentWorkflow();
          break;

        case "option":
          await workflowsService.deleteOption(deleteTarget.id);
          setDeleteTarget(null);
          await reloadCurrentWorkflow();
          break;
      }
    } catch (err: any) {
      alert(getFriendlyErrorMessage(err, `Failed to delete ${deleteTarget.type}. Please try again.`));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* OS & Platform Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#DDE4F3]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {OS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeOs === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveOs(tab.key)}
                className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-[8px] text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#0052CC] text-white shadow-xs"
                    : "bg-white text-[#5F6A86] border border-[#DDE4F3] hover:text-[#17284D]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setNewWorkflowOs(activeOs);
            setNewWorkflowName("");
            setWorkflowModalError(null);
            setShowCreateWorkflowModal(true);
          }}
          className="px-3.5 py-2 rounded-[8px] bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Main Workflow View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workflows List Column */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-[12px] bg-white border border-[#DDE4F3] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#5F6A86] uppercase tracking-wider">
                {activeOs.toUpperCase()} Workflows ({workflows.length})
              </h3>
              <button
                onClick={() => {
                  setNewWorkflowOs(activeOs);
                  setNewWorkflowName("");
                  setWorkflowModalError(null);
                  setShowCreateWorkflowModal(true);
                }}
                className="p-1 rounded text-[#0052CC] hover:bg-blue-50 transition-colors cursor-pointer"
                title="Create workflow"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-[#5F6A86]">
                <div className="w-5 h-5 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading workflows...
              </div>
            ) : workflows.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <GitBranch className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-[#5F6A86]">
                  No workflows found for {activeOs.toUpperCase()}.
                </p>
                <button
                  onClick={() => {
                    setNewWorkflowOs(activeOs);
                    setNewWorkflowName("");
                    setShowCreateWorkflowModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0052CC] text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  Create First Workflow
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {workflows.map((wf) => {
                  const isSelected = selectedWorkflow?.id === wf.id;
                  return (
                    <div
                      key={wf.id}
                      onClick={() => selectWorkflow(wf)}
                      className={`p-3 rounded-[8px] border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-[#E9EEF9] border-[#0052CC] shadow-xs"
                          : "bg-[#F4F6FB] border-[#DDE4F3] hover:border-[#C3CEE6]"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <span className="text-xs font-bold text-[#17284D] block truncate">
                          {wf.name}
                        </span>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-[#5F6A86] uppercase">
                            {wf.osType}
                          </span>
                          {wf.isDefault && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-[#00875A] border border-emerald-200 text-[9px] font-bold">
                              Default
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget({
                            type: "workflow",
                            id: wf.id,
                            title: wf.name,
                          });
                        }}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Delete Workflow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Selected Workflow Builder Column */}
        <div className="lg:col-span-8 space-y-4">
          {selectedWorkflow ? (
            <div className="p-4 sm:p-6 rounded-[12px] bg-white border border-[#DDE4F3] shadow-xs space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#DDE4F3]">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold font-display text-[#17284D]">
                      {selectedWorkflow.name}
                    </h2>
                    {selectedWorkflow.isDefault ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#00875A] border border-emerald-200 text-[10px] font-bold">
                        Active Default
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                        Secondary
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#5F6A86]">
                    Grading Platform: {selectedWorkflow.osType.toUpperCase()} •{" "}
                    {selectedWorkflow.sections?.length || 0} Sections Configured
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {!selectedWorkflow.isDefault && (
                    <button
                      onClick={handleSetDefault}
                      disabled={savingDefault}
                      className="px-3.5 py-1.5 rounded-[8px] bg-emerald-50 hover:bg-emerald-100 text-[#00875A] border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {savingDefault ? "Updating..." : "Set as Default"}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setDeleteTarget({
                        type: "workflow",
                        id: selectedWorkflow.id,
                        title: selectedWorkflow.name,
                      })
                    }
                    className="p-2 rounded-[8px] text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1"
                    title="Delete Workflow"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>

              {/* Sections List */}
              <div className="space-y-4">
                {(selectedWorkflow.sections || []).length === 0 && (
                  <div className="p-8 text-center bg-[#F4F6FB] rounded-xl border border-dashed border-[#C3CEE6] space-y-2">
                    <Layers className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-[#17284D]">No Sections Added Yet</p>
                    <p className="text-xs text-[#5F6A86] max-w-sm mx-auto">
                      Add your first grading section below (e.g. "Cosmetic Inspection", "Display & Touch", "Battery Health").
                    </p>
                  </div>
                )}

                {(selectedWorkflow.sections || []).map((sec, secIdx) => (
                  <div
                    key={sec.id}
                    className="rounded-[10px] bg-[#F4F6FB] border border-[#DDE4F3] p-3 sm:p-4 space-y-4 shadow-xs"
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between border-b border-[#DDE4F3]/60 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-[4px] bg-[#0052CC] text-white text-[11px] font-bold flex items-center justify-center">
                          {secIdx + 1}
                        </span>
                        <h3 className="text-sm font-bold text-[#17284D]">
                          {sec.title}
                        </h3>
                        <span className="text-[11px] font-mono text-slate-500">
                          ({sec.questions?.length || 0} Questions)
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          setDeleteTarget({
                            type: "section",
                            id: sec.id,
                            title: sec.title,
                          })
                        }
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[4px] transition-colors cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Questions in Section */}
                    <div className="space-y-3 pl-0 sm:pl-7">
                      {(sec.questions || []).map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="p-3.5 rounded-[8px] bg-white border border-[#DDE4F3] space-y-3 shadow-xs"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-[#17284D]">
                                {qIdx + 1}. {q.title}
                              </span>
                            </div>

                            {/* Allow Multiple Answers Toggle */}
                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                onClick={() => handleToggleMultiSelect(q)}
                                disabled={togglingMulti[q.id]}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center space-x-1 transition-all cursor-pointer ${
                                  q.multiSelect
                                    ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                }`}
                                title="Click to toggle between Single-Select and Multi-Select"
                              >
                                <span>{q.multiSelect ? "Multi-Select (Checkbox)" : "Single Select (Radio)"}</span>
                              </button>

                              <button
                                onClick={() =>
                                  setDeleteTarget({
                                    type: "question",
                                    id: q.id,
                                    title: q.title,
                                  })
                                }
                                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                                title="Delete Question"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Options List */}
                          <div className="space-y-1.5">
                            {(q.options || []).map((opt) => (
                              <div
                                key={opt.id}
                                className="flex items-center justify-between text-xs py-1 px-2.5 rounded-[6px] bg-[#F4F6FB] border border-[#DDE4F3]"
                              >
                                <span className="text-[#17284D] font-medium">
                                  {opt.label}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono font-bold text-[#0052CC] bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                                    {opt.score} pts
                                  </span>
                                  <button
                                    onClick={() =>
                                      setDeleteTarget({
                                        type: "option",
                                        id: opt.id,
                                        title: opt.label,
                                      })
                                    }
                                    className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                                    title="Delete Option"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* Add Option Mini Form */}
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const labelInput = form.elements.namedItem(
                                  "label"
                                ) as HTMLInputElement;
                                const scoreInput = form.elements.namedItem(
                                  "score"
                                ) as HTMLInputElement;
                                handleAddOption(
                                  q.id,
                                  labelInput.value,
                                  Number(scoreInput.value) || 0
                                );
                                form.reset();
                              }}
                              className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-1.5"
                            >
                              <input
                                name="label"
                                required
                                placeholder="New option (e.g. Pristine / Heavy Scratch)"
                                className="flex-1 min-w-[140px] px-2.5 py-1 text-xs bg-white border border-[#C3CEE6] rounded-[6px] outline-none focus:border-[#0052CC]"
                              />
                              <input
                                name="score"
                                type="number"
                                placeholder="Pts"
                                defaultValue={0}
                                className="w-16 px-2 py-1 text-xs font-mono bg-white border border-[#C3CEE6] rounded-[6px] outline-none focus:border-[#0052CC]"
                              />
                              <button
                                type="submit"
                                className="px-2.5 py-1 bg-[#0052CC] text-white text-xs font-bold rounded-[6px] hover:bg-[#003D99] cursor-pointer"
                              >
                                + Add Option
                              </button>
                            </form>
                          </div>
                        </div>
                      ))}

                      {/* Add Question Input Box with Allow Multiple Answers Toggle */}
                      <div className="p-3 bg-white rounded-[8px] border border-dashed border-[#C3CEE6] space-y-2.5">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="text"
                            placeholder="New question title (e.g. Screen Cosmetic Flaws)..."
                            value={newQTitle[sec.id] || ""}
                            onChange={(e) =>
                              setNewQTitle({
                                ...newQTitle,
                                [sec.id]: e.target.value,
                              })
                            }
                            className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] outline-none focus:border-[#0052CC]"
                          />
                          <button
                            onClick={() => handleAddQuestion(sec.id)}
                            disabled={addingQ[sec.id]}
                            className="px-3.5 py-1.5 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold rounded-[8px] cursor-pointer shrink-0 disabled:opacity-60"
                          >
                            {addingQ[sec.id] ? "Adding..." : "+ Add Question"}
                          </button>
                        </div>

                        {/* Allow Multiple Answers Toggle Checkbox */}
                        <label className="flex items-center space-x-2 text-xs text-[#5F6A86] cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={!!newQMultiSelect[sec.id]}
                            onChange={(e) =>
                              setNewQMultiSelect({
                                ...newQMultiSelect,
                                [sec.id]: e.target.checked,
                              })
                            }
                            className="w-3.5 h-3.5 rounded text-[#0052CC] focus:ring-[#0052CC]/20"
                          />
                          <span className="font-medium text-[#17284D]">
                            Allow multiple answers (Multi-Select checkboxes)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Section Input */}
                <form
                  onSubmit={handleAddSection}
                  className="p-4 rounded-[10px] bg-white border border-dashed border-[#C3CEE6] flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
                >
                  <input
                    type="text"
                    required
                    placeholder="New Section Title (e.g. Battery & Power Diagnostics)..."
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-[8px] text-[#17284D] outline-none focus:border-[#0052CC]"
                  />
                  <button
                    type="submit"
                    disabled={addingSection}
                    className="px-4 py-2 bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold rounded-[8px] shadow-xs cursor-pointer shrink-0 disabled:opacity-60"
                  >
                    {addingSection ? "Adding..." : "+ Add Section"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-[12px] bg-white border border-[#DDE4F3] text-center text-xs text-[#5F6A86] space-y-3">
              <GitBranch className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#17284D]">No Workflow Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a workflow from the left sidebar or create a new one to start configuring sections and grading questions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- CREATE WORKFLOW MODAL --- */}
      {showCreateWorkflowModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-[16px] border border-[#DDE4F3] shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDE4F3]">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052CC] flex items-center justify-center font-bold text-sm">
                  <GitBranch className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold font-display text-[#17284D]">
                  Create Diagnostic Workflow
                </h3>
              </div>
              <button
                onClick={() => setShowCreateWorkflowModal(false)}
                className="p-1 rounded-[6px] text-[#5F6A86] hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {workflowModalError && (
              <div className="mt-4 p-3 rounded-[8px] bg-rose-50 border border-rose-200 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{workflowModalError}</span>
              </div>
            )}

            <form onSubmit={handleCreateWorkflow} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                  Workflow Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Cosmetic Evaluation 64-Point"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17284D] uppercase tracking-wider mb-1">
                  Grading Type / OS Platform
                </label>
                <select
                  value={newWorkflowOs}
                  onChange={(e) => setNewWorkflowOs(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-[#C3CEE6] rounded-[8px] text-[#17284D] focus:border-[#0052CC] outline-none"
                >
                  <option value="android">Android (Mobile & Tablets)</option>
                  <option value="ios">iOS (iPhone & iPad)</option>
                  <option value="windows">Windows (Laptops & Desktops)</option>
                  <option value="macos">macOS (MacBook & Mac Studio)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#DDE4F3]">
                <button
                  type="button"
                  onClick={() => setShowCreateWorkflowModal(false)}
                  className="px-4 py-2 rounded-[8px] text-xs font-semibold text-[#5F6A86] hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingWorkflow}
                  className="px-4 py-2 rounded-[8px] bg-[#0052CC] hover:bg-[#003D99] text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-60"
                >
                  {creatingWorkflow ? "Creating..." : "Create Workflow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 2-STEP VERIFICATION DELETE CONFIRMATION MODAL --- */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl border border-rose-200 shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-[#17284D]">
                  Confirm Deletion (Step 2 of 2)
                </h3>
                <span className="text-xs text-rose-600 font-semibold uppercase tracking-wider">
                  Permanent Action
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              Are you sure you want to permanently delete this {deleteTarget.type}:
              <span className="font-bold text-[#17284D] block mt-1">
                "{deleteTarget.title}"
              </span>
              {deleteTarget.type === "workflow" && (
                <span className="text-slate-500 block mt-1">
                  All associated sections, questions, and scoring options within this workflow will also be removed.
                </span>
              )}
              {deleteTarget.type === "section" && (
                <span className="text-slate-500 block mt-1">
                  All questions and options in this section will be removed.
                </span>
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#5F6A86] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center space-x-1.5"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
