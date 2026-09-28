import { CheckCircle2, AlertTriangle, Info, Wallet, type LucideIcon } from "lucide-react";

export type IconKey = "check" | "warn" | "info" | "wallet";

export const ICONS: Record<IconKey, LucideIcon> = {
  check: CheckCircle2,
  warn: AlertTriangle,
  info: Info,
  wallet: Wallet,
};

export function DemoIcon({ icon, size = 16, className }: { icon: IconKey; size?: number; className?: string }) {
  const Cmp = ICONS[icon];
  return <Cmp size={size} className={className} aria-hidden="true" />;
}
