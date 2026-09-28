import type { ChecklistAnswers } from "./data";
import type { IconKey } from "./icons";

export const STAGES = ["intake", "functional", "cosmetic", "certificate", "admin"] as const;
export type Stage = (typeof STAGES)[number] | "end";

export const STAGE_LABELS: Record<(typeof STAGES)[number], string> = {
  intake: "Device",
  functional: "Evaluate: Functional test",
  cosmetic: "Lens: AI grading",
  certificate: "Certificate",
  admin: "Admin view",
};
export const STAGE_SHORT: Record<(typeof STAGES)[number], string> = {
  intake: "Device",
  functional: "Evaluate",
  cosmetic: "Lens",
  certificate: "Certificate",
  admin: "Admin",
};

export type Mode = "watch" | "try";
export type Role = "Admin" | "Technician";
export type FnFilter = "All" | "Passed" | "Failed";
export type OverlayKind = "licence" | "topup" | "zoom" | "drawer" | "more" | null;

export interface Toast {
  text: string;
  icon: IconKey;
  until: number;
}

export interface Flight {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  es: number;
}

export interface DemoState {
  stage: Stage;
  t: number;
  playing: boolean;
  started: boolean;
  speed: 1 | 2;
  mode: Mode;
  deviceId: string | null;

  gates: Record<string, boolean>;
  waiting: string | null;

  keys: Record<string, boolean>;
  keyCount: number;
  pad: [number, number][];
  padSec: Record<number, boolean>;
  padDone: boolean;

  photos: Record<number, number>;
  checklist: boolean;
  answers: ChecklistAnswers;

  verifyStart: number | null;

  overlay: OverlayKind;
  zoom: number | null;
  drawerId: string | null;
  toast: Toast | null;

  site: string;
  role: Role;
  fnFilter: FnFilter;
  adminTouched: boolean;

  width: number;
  sw: number;
  reduced: boolean;
  touch: boolean;

  runMs: number;
  clock: number;
  flight: Flight | null;
  hoverKey: number | null;
  summaryOpen: boolean;
  inView: boolean;
  flashId: string | null;
  lensUsed: boolean;
  enterAt: number;
  tipIdx: number;
  tipTouched: boolean;
}

export function createInitialState(): DemoState {
  return {
    stage: "intake", t: 0, playing: false, started: false, speed: 1, mode: "watch", deviceId: null,
    gates: {}, waiting: null,
    keys: {}, keyCount: 0, pad: [], padSec: {}, padDone: false,
    photos: {}, checklist: false, answers: {},
    verifyStart: null,
    overlay: null, zoom: null, drawerId: null, toast: null,
    site: "All sites", role: "Admin", fnFilter: "All", adminTouched: false,
    width: 1200, sw: 900, reduced: false, touch: false,
    runMs: 0, clock: 0, flight: null, hoverKey: null,
    summaryOpen: false, inView: false, flashId: null, lensUsed: true, enterAt: 0,
    tipIdx: 0, tipTouched: false,
  };
}
