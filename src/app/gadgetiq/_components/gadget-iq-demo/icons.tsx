import type { CSSProperties } from "react";

/** Inline SVG paths copied from the reference demo (24x24 grid, 2px round stroke). */
export const PATHS = {
  play: "M8 5.5v13l10.5-6.5z",
  pause: "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z",
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  check: "M5 12.5l4.5 4.5L19 7",
  checkCircle: "M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18zM8 12.5l3 3 5-6",
  circle: "M12 5a7 7 0 1 1 0 14a7 7 0 1 1 0-14z",
  wave: "M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4",
  wallet: "M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4zM4 7l11-3v3M15.5 13.5h1.5",
  robot: "M12 3.5v3M6 6.5h12a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 16V8A1.5 1.5 0 0 1 6 6.5zM9.5 11.5v1M14.5 11.5v1",
  warn: "M12 3.5L2.5 20h19zM12 10v4.5M12 17.5v.5",
  shield: "M12 3l7 3v5c0 4.5-3 8-7 10c-4-2-7-5.5-7-10V6zM9 12l2 2 4-4",
  plus: "M12 5v14M5 12h14",
  calendar: "M5 5.5h14v14H5zM5 10h14M9 3.5v4M15 3.5v4",
  speaker: "M4 9.5v5h3.5l4.5 4v-13l-4.5 4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11",
  sparkle: "M12 3.5l1.8 5.2 5.2 1.8-5.2 1.8L12 17.5l-1.8-5.2L5 10.5l5.2-1.8z",
  zoom: "M10.5 4a6.5 6.5 0 1 1 0 13a6.5 6.5 0 1 1 0-13zM15.5 15.5L20 20M10.5 8v5M8 10.5h5",
  skipNext: "M18 6v12M6 6v12l9-6z",
  skipPrev: "M6 6v12M18 6v12L9 12z",
  qr: "M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M8 9h3v3H8zM13 12h3v3h-3z",
  restart: "M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4.5v4h4",
  laptop: "M5.5 6h13v9h-13zM3 18.5h18",
  close: "M6 6l12 12M18 6L6 18",
  sigma: "M7 3.5h10M7 20.5h10M8 3.5c0 5 8 4.5 8 8.5s-8 3.5-8 8.5M16 3.5c0 5-8 4.5-8 8.5s8 3.5 8 8.5",
  camera: "M4 8h3.5l1.8-2.5h5.4L16.5 8H20v11H4zM12 10a3.5 3.5 0 1 1 0 7a3.5 3.5 0 1 1 0-7z",
  more: "M5 12h.5M12 12h.5M19 12h.5",
  star: "M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.8l-5.4 2.9 1.2-5.9-4.4-4.1 6-.7z",
  timer: "M12 7.5a6.5 6.5 0 1 1 0 13a6.5 6.5 0 1 1 0-13zM12 11v3l2 1.5M9.5 3h5",
  usb: "M6 8.5h12v7H6zM9 11.5h2M13 11.5h2",
  power: "M12 3.5v8M7.2 6.5a7 7 0 1 0 9.6 0",
  tv: "M3.5 5.5h17v11h-17zM8 20h8",
  disc: "M12 4a8 8 0 1 1 0 16a8 8 0 1 1 0-16zM12 10a2 2 0 1 1 0 4a2 2 0 1 1 0-4z",
  eth: "M5 7h14v9H5zM9 16v-3M12 16v-3M15 16v-3M10 20h4",
  sd: "M7 3.5h7l4 4v13H7zM10 6.5v2M12.5 6.5v2",
  finger: "M8 20c-1-2-1.5-4.5-1.5-7a5.5 5.5 0 0 1 11 0M12 13c0 3 .5 5 1.5 7M9.5 13a2.5 2.5 0 0 1 5 0c0 1.5.3 3 1 4.5",
  up: "M6 15l6-6 6 6",
  down: "M6 9l6 6 6-6",
  person: "M12 4a4 4 0 1 1 0 8a4 4 0 1 1 0-8zM4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6",
} as const;

export type IconName = keyof typeof PATHS;

/** Renders one of the reference demo's inline SVG icons. `fill` renders it solid (play/skip). */
export function Ico({
  name,
  d,
  size = 16,
  sw = 2,
  fill = false,
  color,
  className,
  style,
}: {
  name?: IconName;
  d?: string;
  size?: number;
  sw?: number;
  fill?: boolean;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const solid = fill && (name === "play" || name === "pause");
  const path = d ?? (name ? PATHS[name] : "");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={solid ? undefined : color ?? "currentColor"}
      strokeWidth={solid ? undefined : sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={color && fill ? { color, ...style } : style}
    >
      <path d={path} />
    </svg>
  );
}

export type IconKey = "check" | "warn" | "info" | "wallet";

const TOAST_PATH: Record<IconKey, string> = {
  check: PATHS.checkCircle,
  warn: PATHS.warn,
  info: "M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18zM12 11v5M12 8v.5",
  wallet: PATHS.wallet,
};

export function DemoIcon({ icon, size = 16, className }: { icon: IconKey; size?: number; className?: string }) {
  return <Ico d={TOAST_PATH[icon]} size={size} className={className} />;
}
