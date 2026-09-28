"use client";

import { Wallet } from "lucide-react";

export function AppHeaderBar({
  appTitle,
  showBeta,
  walletText,
  walletAria,
  onOpenLicence,
}: {
  appTitle: string;
  showBeta: boolean;
  walletText: string;
  walletAria: string;
  onOpenLicence: () => void;
}) {
  return (
    <div className="relative flex h-[52px] shrink-0 items-center justify-between gap-3 bg-[#17284D] px-4 pl-4 text-white">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-display text-[15px] font-bold tracking-tight">{appTitle}</span>
        {showBeta && (
          <span className="shrink-0 rounded border border-white/40 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">Beta</span>
        )}
      </div>
      <button
        type="button"
        onClick={onOpenLicence}
        aria-haspopup="dialog"
        aria-label={walletAria}
        title={walletAria}
        className="flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-white/25 bg-white/10 px-2.5 text-[13px] text-white transition-colors hover:bg-white/20"
      >
        <Wallet size={16} aria-hidden="true" />
        <span className="font-mono font-semibold">{walletText}</span>
      </button>
    </div>
  );
}
