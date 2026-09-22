import React from "react";
import { Laptop, CheckCircle2, Timer, AlertOctagon, TrendingUp, TrendingDown } from "lucide-react";
import Card from "@/components/ui/Card";
import { DashboardStats } from "../_lib/dashboard-data";

interface StatCardsProps {
  stats: DashboardStats;
}

export default function StatCards({ stats }: StatCardsProps) {
  const cards = [
    {
      title: "Total Devices Evaluated",
      value: stats.totalScanned.toLocaleString(),
      delta: stats.scannedDelta,
      isPositive: true,
      icon: <Laptop className="w-5 h-5 text-[#0052CC]" />,
      bgIcon: "bg-blue-50 border-blue-100",
    },
    {
      title: "64-Point Pass Rate",
      value: `${stats.passRate}%`,
      delta: stats.passRateDelta,
      isPositive: true,
      icon: <CheckCircle2 className="w-5 h-5 text-[#00875A]" />,
      bgIcon: "bg-emerald-50 border-emerald-100",
    },
    {
      title: "Avg. Diagnostic Speed",
      value: `${stats.avgDurationSec}s`,
      delta: stats.avgDurationDelta,
      isPositive: true,
      icon: <Timer className="w-5 h-5 text-amber-700" />,
      bgIcon: "bg-amber-50 border-amber-100",
    },
    {
      title: "Defect / Quarantined",
      value: stats.quarantinedCount.toString(),
      delta: stats.quarantinedDelta,
      isPositive: false,
      icon: <AlertOctagon className="w-5 h-5 text-[#C7300A]" />,
      bgIcon: "bg-rose-50 border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <Card key={idx} padding="md" hoverEffect className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-[#5F6A86] uppercase tracking-wider">
                {card.title}
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-[#17284D] mt-1 tracking-tight">
                {card.value}
              </h3>
            </div>
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${card.bgIcon}`}
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#DDE4F3] flex items-center space-x-1.5 text-xs">
            {card.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            )}
            <span
              className={`font-semibold ${
                card.isPositive ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {card.delta}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
