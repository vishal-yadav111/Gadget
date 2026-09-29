"use client";

import { Ico } from "../icons";

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
    <div className="relative flex h-[52px] flex-none items-center justify-between gap-3 bg-[var(--surface-inverse)] pl-4 pr-3 text-white">
      <div className="flex min-w-0 flex-auto items-center gap-2">
        <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-display text-[15px] font-bold tracking-[-0.012em]">{appTitle}</span>
        {showBeta && (
          <span className="flex-none rounded-[var(--radius-xs)] border border-white/40 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white">Beta</span>
        )}
      </div>
      <button
        type="button"
        onClick={onOpenLicence}
        aria-haspopup="dialog"
        aria-label={walletAria}
        title={walletAria}
        className="flex h-9 min-w-11 flex-none cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-[var(--radius-sm)] border border-white/[.24] bg-white/[.08] px-2.5 text-[13px] text-white hover:bg-white/[.16]"
      >
        <Ico name="wallet" />
        <span className="font-mono font-semibold">{walletText}</span>
      </button>
    </div>
  );
}
