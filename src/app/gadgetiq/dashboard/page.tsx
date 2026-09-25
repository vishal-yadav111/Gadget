"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Sparkles,
  Camera,
  Layers,
  ShoppingBag,
  Building2,
  User,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Activity,
  Cpu,
  RefreshCw,
} from "lucide-react";
import {
  getGadgetIqSession,
  getGadgetIqUser,
  getGadgetIqProjects,
  gadgetIqAuth,
  GadgetIqUser,
  ProjectAccess,
} from "@/lib/services/gadgetiq-api";
import { getFriendlyErrorMessage } from "@/app/gadgetiq/(lens)/core";
import LensAdminLayout from "@/app/gadgetiq/(lens)/layout";
import LensDashboardPage from "@/app/gadgetiq/(lens)/dashboard/LensDashboardView";
import GadgetEvaluateLayout from "@/app/gadgetiq/(evaluate)/layout";
import GadgetEvaluateDashboardPage from "@/app/gadgetiq/(evaluate)/dashboard/EvaluateDashboardView";
import { LogoutConfirmModal } from "@/components/ui/LogoutConfirmModal";

function GadgetIqDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showHubExplicitly = searchParams.get("view") === "hub";

  const [user, setUser] = useState<GadgetIqUser | null>(null);
  const [projectAccess, setProjectAccess] = useState<ProjectAccess | null>(null);
  const [switching, setSwitching] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const currentUser = getGadgetIqUser();
    const currentProjects = getGadgetIqProjects();

    if (!currentUser) {
      router.push("/gadgetiq/login");
      return;
    }

    setUser(currentUser);
    setProjectAccess(currentProjects);
  }, [router]);

  const handleSwitchProject = async (projectCode: string) => {
    if (projectAccess?.activeProject === projectCode) return;
    setSwitching(projectCode);
    try {
      await gadgetIqAuth.switchProject(projectCode);
      const updatedProjects = getGadgetIqProjects();
      setProjectAccess(updatedProjects);
    } catch (err: any) {
      alert(getFriendlyErrorMessage(err, "Failed to switch active project. Please try again."));
    } finally {
      setSwitching(null);
    }
  };

  const handleLogout = () => {
    gadgetIqAuth.logout();
  };

  if (!user || !projectAccess) {
    return (
      <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-slate-400 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Loading GadgetIQ Session...</span>
        </div>
      </div>
    );
  }

  // If user has an active project and is not explicitly requesting the hub view, render the active dashboard
  if (!showHubExplicitly) {
    if (projectAccess.activeProject === "GADGET_LENS") {
      return (
        <LensAdminLayout>
          <LensDashboardPage />
        </LensAdminLayout>
      );
    }

    if (projectAccess.activeProject === "GADGET_EVALUATE") {
      return (
        <GadgetEvaluateLayout>
          <GadgetEvaluateDashboardPage />
        </GadgetEvaluateLayout>
      );
    }
  }

  const allowedCodes = (projectAccess.allowedProjects || []).map((p) => p.projectCode);

  const availableProjects = [
    {
      code: "GADGET_LENS",
      name: "Gadget Lens AI",
      category: "AI Visual Inspection",
      description: "Automated scratch, dent, and screen defect detection using computer vision.",
      icon: Camera,
      badgeColor: "from-cyan-500 to-blue-600",
      accent: "cyan",
      href: "/gadgetiq/dashboard",
    },
    {
      code: "GADGET_EVALUATE",
      name: "Gadget Evaluate",
      category: "Hardware Diagnostics & QC",
      description: "Diagnostic workflows, functional testing, and multi-tier QC certification.",
      icon: Layers,
      badgeColor: "from-indigo-500 to-purple-600",
      accent: "indigo",
      href: "/gadgetiq/dashboard",
    },
    {
      code: "GADGET_VALUEMAX",
      name: "Gadget ValueMax",
      category: "Pricing & Valuation Engine",
      description: "Automated residual value calculation and buyback price estimation.",
      icon: TrendingUp,
      badgeColor: "from-emerald-500 to-teal-600",
      accent: "emerald",
      href: "#",
    },
    {
      code: "SHOP_XTRACOVER",
      name: "Shop XtraCover",
      category: "E-Commerce & Store Portal",
      description: "Inventory allocation, B2B store sales, and warranty activation.",
      icon: ShoppingBag,
      badgeColor: "from-amber-500 to-orange-600",
      accent: "amber",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                GadgetIQ
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                Enterprise Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Multi-Project Centralized Management
            </p>
          </div>
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white">
              {user.fullName || user.username}
            </span>
            <span className="text-[11px] text-slate-400">
              Role: <span className="text-cyan-400 font-semibold">{user.role || "Operator"}</span>
            </span>
          </div>

          <div className="h-8 w-[1px] bg-slate-800 hidden sm:block" />

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 border border-slate-700/80 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-medium transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-6 sm:p-8"
        >
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Single Sign-On Active Session</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {user.fullName || user.username}!
              </h2>
              <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
                Your credentials have been authenticated across the unified database. Below are
                the enterprise projects and services assigned to your role.
              </p>
            </div>

            {/* Current Active Project Scope Box */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1 min-w-[220px]">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Current Active Scope
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-sm text-cyan-300">
                  {projectAccess.activeProject}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                {projectAccess.totalProjects} project(s) accessible
              </span>
            </div>
          </div>
        </motion.div>

        {/* Project Launchpad Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Your Enterprise Project Launchpad</h3>
              <p className="text-xs text-slate-400">
                Click any unlocked project to switch context or launch the portal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {availableProjects.map((proj, idx) => {
              const hasAccess = allowedCodes.includes(proj.code);
              const isActive = projectAccess.activeProject === proj.code;
              const Icon = proj.icon;

              return (
                <motion.div
                  key={proj.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 ${
                    hasAccess
                      ? isActive
                        ? "bg-slate-900/90 border-cyan-500/60 shadow-lg shadow-cyan-950/30"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      : "bg-slate-950/40 border-slate-900 opacity-60"
                  }`}
                >
                  {/* Status Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-2.5 rounded-xl bg-gradient-to-tr ${proj.badgeColor} text-white shadow-md`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {hasAccess ? (
                      isActive ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          Active Context
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Unlocked
                        </span>
                      )
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-800 text-slate-500 border border-slate-700/50 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {proj.category}
                    </span>
                    <h4 className="text-base font-bold text-white mt-1">{proj.name}</h4>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80">
                    {hasAccess ? (
                      <div className="flex items-center gap-2">
                        {!isActive && (
                          <button
                            onClick={() => handleSwitchProject(proj.code)}
                            disabled={switching === proj.code}
                            className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {switching === proj.code ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                            ) : (
                              <span>Set Active</span>
                            )}
                          </button>
                        )}

                        <button
                          onClick={async () => {
                            if (!isActive) {
                              await handleSwitchProject(proj.code);
                            }
                            router.push("/gadgetiq/dashboard");
                          }}
                          className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                        >
                          <span>Launch</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-2 text-center text-xs text-slate-600 font-medium">
                        Contact Admin for Access
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Live Telemetry & Diagnostics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">User Identity Details</span>
              <User className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-sm font-bold text-white">{user.username}</div>
            <div className="text-xs text-slate-400 mt-1">Email: {user.email || "N/A"}</div>
            <div className="text-xs text-slate-400">Mobile: {user.mobile || "N/A"}</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Organization & Company</span>
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-sm font-bold text-white">{user.companyId || "XCQC Global Default"}</div>
            <div className="text-xs text-slate-400 mt-1">Store ID: {user.storeId || "None"}</div>
            <div className="text-xs text-slate-400">Store Type: {user.storeType || "Standard"}</div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold">Security & Token Engine</span>
              <Activity className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-emerald-400">Universal Scoped JWT</div>
            <div className="text-xs text-slate-400 mt-1">Status: Active & Valid</div>
            <div className="text-xs text-slate-400">Bridge: XCQC + Store Compatible</div>
          </div>
        </div>
      </main>

      {/* Double confirmation modal for logout */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        userName={user?.fullName || user?.username}
        userRole={user?.role || "Operator"}
      />
    </div>
  );
}

export default function GadgetIqDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07090E] flex items-center justify-center text-slate-400 font-sans">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span>Loading GadgetIQ Workspace...</span>
          </div>
        </div>
      }
    >
      <GadgetIqDashboardContent />
    </Suspense>
  );
}