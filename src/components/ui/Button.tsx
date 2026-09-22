import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "accent" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
  full?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      icon,
      iconAfter,
      full = false,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        "bg-[#0052CC] hover:bg-[#003D99] text-white shadow-sm border border-[#0052CC]/20 active:translate-y-[1px]",
      secondary:
        "bg-white hover:bg-slate-50 text-[#17284D] border border-slate-200 shadow-xs active:translate-y-[1px]",
      ghost:
        "bg-transparent hover:bg-slate-100 text-[#17284D] border border-transparent shadow-none",
      accent:
        "bg-gradient-to-r from-[#FF5630] to-[#FF7A52] hover:from-[#DE3E1B] hover:to-[#FF5630] text-white shadow-sm shadow-[#FF5630]/25 border border-[#FF5630]/20 active:translate-y-[1px]",
      outline:
        "bg-transparent hover:bg-blue-50/50 text-[#0052CC] border border-[#0052CC]/40 shadow-none",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-rose-600/30 active:translate-y-[1px]",
    };

    const sizeClasses = {
      sm: "text-xs px-2.5 py-1.5 rounded-md gap-1.5 font-medium",
      md: "text-sm px-4 py-2 rounded-lg gap-2 font-semibold",
      lg: "text-base px-5 py-2.5 rounded-lg gap-2.5 font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center transition-all duration-150 cursor-pointer font-sans select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          full && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        <span>{children}</span>
        {!loading && iconAfter && <span className="shrink-0">{iconAfter}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
