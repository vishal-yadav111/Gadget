import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "success" | "warning" | "danger" | "brand" | "neutral" | "accent";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = "neutral",
  size = "md",
  dot = false,
  className,
  ...props
}) => {
  const toneClasses = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/60",
    warning: "bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60",
    danger: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/60",
    brand: "bg-blue-50 text-[#0052CC] border-blue-200/80 dark:bg-blue-950/40 dark:text-[#6FA6FF] dark:border-blue-800/60",
    accent: "bg-orange-50 text-[#FF5630] border-orange-200/80 dark:bg-orange-950/40 dark:text-[#FF7A52] dark:border-orange-800/60",
    neutral: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  };

  const dotClasses = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    brand: "bg-[#0052CC]",
    accent: "bg-[#FF5630]",
    neutral: "bg-slate-400",
  };

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 font-medium tracking-tight",
    md: "text-xs px-2.5 py-1 font-semibold",
    lg: "text-sm px-3 py-1.5 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border font-sans select-none",
        toneClasses[tone],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotClasses[tone]
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
