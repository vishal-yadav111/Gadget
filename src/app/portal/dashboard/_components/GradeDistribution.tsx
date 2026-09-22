import React from "react";
import Card from "@/components/ui/Card";

export default function GradeDistribution() {
  const grades = [
    {
      grade: "Grade A (Flawless)",
      percentage: 68,
      count: 971,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgLight: "bg-emerald-50",
    },
    {
      grade: "Grade B (Minor Wear)",
      percentage: 21,
      count: 300,
      color: "bg-[#0052CC]",
      textColor: "text-[#0052CC]",
      bgLight: "bg-blue-50",
    },
    {
      grade: "Grade C (Functional/Refurb)",
      percentage: 8,
      count: 114,
      color: "bg-amber-500",
      textColor: "text-amber-800",
      bgLight: "bg-amber-50",
    },
    {
      grade: "Quarantine / Defective",
      percentage: 3,
      count: 43,
      color: "bg-rose-500",
      textColor: "text-rose-700",
      bgLight: "bg-rose-50",
    },
  ];

  return (
    <Card padding="md" className="h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
          <div>
            <h3 className="font-bold font-display text-sm sm:text-base text-[#17284D]">
              Fleet Grading Ratio
            </h3>
            <p className="text-xs text-[#5F6A86] mt-0.5">
              XtraCover 64-point classification breakdown
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-1 rounded bg-[#F4F6FB] text-[#17284D] border border-[#DDE4F3]">
            1,428 Evaluated
          </span>
        </div>

        {/* Stacked Multi-Bar */}
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex my-5 p-0.5 border border-slate-200">
          {grades.map((g, i) => (
            <div
              key={i}
              className={`h-full ${g.color} transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
              style={{ width: `${g.percentage}%` }}
              title={`${g.grade}: ${g.percentage}% (${g.count})`}
            />
          ))}
        </div>

        {/* List Breakdown */}
        <div className="space-y-3">
          {grades.map((g, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F4F6FB] transition-colors"
            >
              <div className="flex items-center space-x-2.5">
                <span className={`w-3 h-3 rounded-sm ${g.color} shrink-0`} />
                <span className="text-xs font-semibold text-[#17284D]">
                  {g.grade}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono text-[#5F6A86]">
                  {g.count} devices
                </span>
                <span className={`text-xs font-bold font-mono ${g.textColor}`}>
                  {g.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-2 border-t border-[#DDE4F3] flex items-center justify-between text-xs text-[#5F6A86]">
        <span>Target Pass Accuracy: 95%</span>
        <span className="text-emerald-700 font-bold">Achieved: 97.2%</span>
      </div>
    </Card>
  );
}
