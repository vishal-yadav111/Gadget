import React from "react";
import Link from "next/link";
import { Play, PlusCircle, FileText, BarChart2, ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";

export default function QuickActionGrid() {
  const actions = [
    {
      title: "Launch 64-Point Diagnostic",
      description: "Initialize automated sensor and hardware stress test suite",
      href: "/portal/diagnostics",
      icon: <Play className="w-5 h-5 text-white" />,
      color: "from-[#FF5630] to-[#FF7A52]",
      btnText: "Start Diagnostic Scan",
      primary: true,
    },
    {
      title: "Batch Fleet Intake",
      description: "Scan bulk serial numbers / CSV barcode queue",
      href: "/portal/devices",
      icon: <PlusCircle className="w-5 h-5 text-[#0052CC]" />,
      color: "from-blue-500 to-indigo-600",
      btnText: "Batch Ingest",
      primary: false,
    },
    {
      title: "Verify Audit Certificate",
      description: "Generate cryptographic PDF & QR verification certificate",
      href: "/portal/reports",
      icon: <FileText className="w-5 h-5 text-[#0052CC]" />,
      color: "from-emerald-500 to-teal-600",
      btnText: "Open Certificates",
      primary: false,
    },
    {
      title: "Defect Analysis",
      description: "Inspect component failure Pareto and QC degradation",
      href: "/portal/analytics",
      icon: <BarChart2 className="w-5 h-5 text-[#0052CC]" />,
      color: "from-purple-500 to-violet-600",
      btnText: "View Telemetry",
      primary: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act, idx) => (
        <Link key={idx} href={act.href} className="group block">
          <Card
            hoverEffect
            padding="md"
            className={`h-full flex flex-col justify-between border transition-all ${
              act.primary
                ? "bg-gradient-to-br from-blue-900 via-[#0052CC] to-[#003D99] text-white border-[#0052CC]/50 shadow-md shadow-blue-900/15"
                : "bg-white hover:border-[#0052CC]/40"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    act.primary
                      ? "bg-white/20 text-white"
                      : "bg-blue-50 text-[#0052CC] border border-blue-100"
                  }`}
                >
                  {act.icon}
                </div>
                {act.primary && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FF5630] text-white uppercase tracking-wider animate-pulse">
                    Live Engine
                  </span>
                )}
              </div>
              <h4
                className={`font-bold font-display text-sm ${
                  act.primary ? "text-white" : "text-[#17284D]"
                }`}
              >
                {act.title}
              </h4>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  act.primary ? "text-blue-100" : "text-[#5F6A86]"
                }`}
              >
                {act.description}
              </p>
            </div>

            <div
              className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-semibold ${
                act.primary
                  ? "border-white/20 text-white"
                  : "border-[#DDE4F3] text-[#0052CC] group-hover:text-[#003D99]"
              }`}
            >
              <span>{act.btnText}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
