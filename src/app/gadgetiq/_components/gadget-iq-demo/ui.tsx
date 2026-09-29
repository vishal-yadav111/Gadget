"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Tailwind ports of the XtraCover design-system primitives the reference demo is built from. */

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_SIZE: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};
const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-[var(--brand-primary)] text-white border-transparent shadow-[var(--shadow-sm)] hover:bg-[var(--brand-primary-hover)] hover:shadow-[var(--shadow-md)]",
  accent: "bg-[var(--brand-accent)] text-[var(--text-on-accent)] border-transparent shadow-[var(--shadow-sm)] hover:bg-[var(--brand-accent-hover)] hover:shadow-[var(--shadow-md)]",
  secondary: "bg-[var(--surface-card)] text-[var(--text-primary)] border-[var(--border-default)] hover:shadow-[var(--shadow-sm)]",
  ghost: "bg-transparent text-[var(--brand-primary)] border-transparent hover:bg-[var(--surface-sunken)]",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconAfter,
  loading = false,
  full = false,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  loading?: boolean;
  full?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & { type?: "button" | "submit" }) {
  const off = disabled || loading;
  return (
    <button
      type={type}
      disabled={off}
      className={cn(
        "items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] border font-semibold tracking-[-0.005em]",
        "transition-[background,transform,box-shadow] duration-[120ms] ease-[cubic-bezier(.2,.7,.3,1)]",
        full ? "flex w-full" : "inline-flex",
        BUTTON_SIZE[size],
        BUTTON_VARIANT[variant],
        off
          ? "cursor-not-allowed opacity-50 hover:!translate-y-0"
          : "cursor-pointer hover:[transform:translateY(-2px)] active:[transform:scale(.97)]",
        className
      )}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="box-border shrink-0 animate-[spin_700ms_linear_infinite] rounded-full border-2 border-current border-t-transparent"
          style={{ width: size === "lg" ? 20 : size === "md" ? 18 : 16, height: size === "lg" ? 20 : size === "md" ? 18 : 16 }}
        />
      )}
      {!loading && icon}
      {children}
      {iconAfter}
    </button>
  );
}

type BadgeTone = "success" | "warning" | "danger" | "brand" | "neutral";
const BADGE_TONE: Record<BadgeTone, string> = {
  success: "bg-[rgba(0,135,90,.10)] text-[var(--status-success)]",
  warning: "bg-[rgba(138,86,0,.12)] text-[var(--status-warning)]",
  danger: "bg-[rgba(199,48,10,.10)] text-[var(--status-danger)]",
  brand: "bg-[rgba(0,82,204,.10)] text-[var(--brand-primary)]",
  neutral: "bg-[var(--surface-sunken)] text-[var(--text-secondary)]",
};

export function Badge({ tone = "neutral", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string; size?: "sm" }) {
  return (
    <span
      className={cn(
        "box-content inline-flex h-[22px] items-center gap-1 whitespace-nowrap rounded-[var(--radius-xs)] border border-current px-2 text-xs font-semibold tracking-[0.01em]",
        BADGE_TONE[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

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
  const active = Math.max(0, items.findIndex((o) => o.value === value));
  const h = size === "sm" ? "h-[30px]" : "h-9";
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "relative box-content gap-0 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-sunken)] p-[3px]",
        full ? "grid" : "inline-grid",
        h
      )}
      style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-[3px] left-[3px] top-[3px] rounded-[var(--radius-sm)] border border-[var(--border-subtle)] bg-[var(--surface-card)] shadow-[var(--shadow-sm)] transition-transform duration-200 ease-[cubic-bezier(.34,1.56,.64,1)]"
        style={{ width: `calc((100% - 6px) / ${items.length})`, transform: `translateX(${active * 100}%)` }}
      />
      {items.map((it) => {
        const on = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(it.value)}
            className={cn(
              "relative cursor-pointer whitespace-nowrap bg-transparent px-[14px] text-sm transition-colors duration-[120ms] ease-[cubic-bezier(.2,.7,.3,1)]",
              h,
              on ? "font-semibold text-[var(--brand-primary)]" : "font-medium text-[var(--text-secondary)]"
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
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-[var(--text-primary)]">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-[22px] w-10 flex-none cursor-pointer rounded-[var(--radius-pill)] border-none p-0 transition-[background] duration-[120ms] ease-[cubic-bezier(.2,.7,.3,1)]",
          checked ? "bg-[var(--brand-primary)]" : "bg-[var(--border-default)]"
        )}
      >
        <span
          className="absolute top-[3px] h-4 w-4 rounded-[var(--radius-xs)] bg-[var(--surface-card)] shadow-[var(--shadow-sm)] transition-[left] duration-200 ease-[cubic-bezier(.34,1.56,.64,1)]"
          style={{ left: checked ? 21 : 3 }}
        />
      </button>
      {label}
    </label>
  );
}

export function Select({ options, value, onChange, ariaLabel }: { options: string[]; value: string; onChange: (v: string) => void; ariaLabel: string }) {
  return (
    <div className="relative flex items-center">
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="box-border h-10 w-full cursor-pointer appearance-none rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-card)] pl-3 pr-9 text-sm text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] duration-[120ms] ease-[cubic-bezier(.2,.7,.3,1)] focus:border-[var(--brand-primary)] focus:shadow-[var(--shadow-focus)]"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 flex text-[var(--text-tertiary)]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </div>
  );
}

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("box-content inline-block animate-[spin_700ms_linear_infinite] rounded-full border-current border-t-transparent text-[var(--brand-primary)]", className)}
      style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 10)) }}
    />
  );
}

/** The design system's initials avatar: a 6px-radius coloured square. */
export function Avatar({ initials = "", size = 32 }: { initials?: string; size?: number }) {
  return (
    <span
      className="inline-flex flex-none items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[var(--brand-primary)] font-semibold tracking-[0.01em] text-white"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38) }}
    >
      {initials}
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="box-content inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[var(--radius-xs)] border border-b-2 border-[var(--border-default)] bg-[var(--surface-sunken)] px-1.5 font-mono text-xs font-medium leading-none text-[var(--text-secondary)]">
      {children}
    </kbd>
  );
}
