"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  full,
  size = "md",
}: {
  options: T[] | { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  full?: boolean;
  size?: "sm" | "md";
}) {
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-[#DDE4F3] bg-[#E9EEF9] p-1",
        full && "flex w-full"
      )}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            onClick={() => onChange(it.value)}
            className={cn(
              "rounded-md font-semibold transition-colors cursor-pointer",
              full && "flex-1",
              size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
              active ? "bg-white text-brand-primary shadow-sm" : "text-[#4A5875] hover:text-[#17284D]"
            )}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-[#4A5875]">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-10 shrink-0 rounded-full border transition-colors",
          checked ? "border-brand-primary bg-brand-primary" : "border-[#C3CEE6] bg-[#E9EEF9]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[19px]" : "translate-x-0.5"
          )}
        />
      </button>
    </label>
  );
}

export function Select({ options, value, onChange, ariaLabel }: { options: string[]; value: string; onChange: (v: string) => void; ariaLabel: string }) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded-md border border-[#DDE4F3] bg-white px-3 text-sm font-medium text-[#17284D]"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={cn("animate-spin text-brand-primary", className)} />;
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-primary/10 font-display font-bold text-brand-primary"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </span>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded border border-[#C3CEE6] bg-white px-1.5 font-mono text-[11px] font-semibold text-[#4A5875]">
      {children}
    </kbd>
  );
}
