// Gadget IQ interactive demo: single source of truth.
// Every number, grade, test, licence count and date shown in the demo comes from here.
// Ported 1:1 from the original demo's demo/demoData.js so behaviour stays identical.

export const CTA_LABEL = "Book a Free Trial";
export const AI_GRADING_BETA = true;
export const NAMES = { suite: "Gadget IQ", evaluate: "Gadget Evaluate", lens: "Gadget Lens" };
export const BATTERY_LIMIT = 70;
export const WIFI_SIGNAL_LIMIT = 40;
export const DEMO_SITE = "Delhi";
export const DEMO_TECH = "Priya Sharma";
export const CERT_PREFIX = "DEMO";
export const SAMPLE_NOTE = "This is a demo with sample laptops and sample test results.";

export type Severity = "Light" | "Medium" | "Severe";
export type DefectType = "Scratch" | "Dent" | "Crack" | "Broken";
export type Angle = "Front" | "Back" | "Left" | "Right" | "Top" | "Bottom";

export interface DefectBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Defect {
  angle: Angle;
  type: DefectType;
  severity: Severity;
  area: string;
  where?: string;
  confidence?: number;
  box?: DefectBox;
}

export interface GradeInfo {
  letter: string;
  name: string;
  meaning: string;
  tone: "success" | "brand" | "warning" | "danger";
  color: string;
}

export const GRADE_SCALE: GradeInfo[] = [
  { letter: "A+", name: "Like new", meaning: "No marks at all.", tone: "success", color: "var(--status-success)" },
  { letter: "A", name: "Excellent", meaning: "One or two tiny marks, hard to see.", tone: "success", color: "var(--status-success)" },
  { letter: "B", name: "Good", meaning: "A few light marks from normal use.", tone: "brand", color: "var(--brand-primary)" },
  { letter: "C", name: "Fair", meaning: "Clear marks or a small dent.", tone: "warning", color: "var(--status-warning)" },
  { letter: "D", name: "Used", meaning: "Many marks or several dents.", tone: "warning", color: "var(--status-warning)" },
  { letter: "E", name: "Heavy wear", meaning: "Cracks or deep damage to the body.", tone: "danger", color: "var(--status-danger)" },
  { letter: "F", name: "For parts", meaning: "Broken parts. Sold for repair or spares.", tone: "danger", color: "var(--status-danger)" },
];

export const LENS_CONFIDENCE = [
  { min: 90, text: "High confidence. Grade approved automatically.", tone: "success" as const },
  { min: 75, text: "Good confidence. A quick check by a technician is suggested.", tone: "warning" as const },
  { min: 0, text: "Low confidence. Sent for a manual check.", tone: "danger" as const },
];
export const lensConfidence = (pct: number) => LENS_CONFIDENCE.find((c) => pct >= c.min)!;

export const SEVERITY_POINTS: Record<Severity, number> = { Light: 1, Medium: 3, Severe: 8 };
const BANDS: [number, string][] = [
  [0, "A+"],
  [2, "A"],
  [4, "B"],
  [7, "C"],
  [10, "D"],
  [Infinity, "E"],
];
const gIndex = (l: string) => GRADE_SCALE.findIndex((g) => g.letter === l);

export const ANGLES: Angle[] = ["Front", "Back", "Left", "Right", "Top", "Bottom"];

export function gradeFromDefects(defects: Defect[]) {
  const points = defects.reduce((s, d) => s + (SEVERITY_POINTS[d.severity] || 0), 0);
  let idx = gIndex(BANDS.find(([max]) => points <= max)![1]);
  if (defects.some((d) => d.type === "Crack" && d.severity === "Severe")) idx = Math.max(idx, gIndex("E"));
  if (defects.some((d) => d.type === "Broken")) idx = gIndex("F");
  return { ...GRADE_SCALE[idx], index: idx, points };
}

const NOUN: Record<DefectType, [string, string]> = {
  Scratch: ["scratch", "scratches"],
  Dent: ["dent", "dents"],
  Crack: ["crack", "cracks"],
  Broken: ["broken part", "broken parts"],
};
export function explainGrade(defects: Defect[]) {
  if (!defects.length) return { items: ["No marks found"], sentence: "no marks were found" };
  const groups: { key: string; n: number; d: Defect }[] = [];
  defects.forEach((d) => {
    const key = d.type + d.severity + d.area;
    const g = groups.find((x) => x.key === key);
    if (g) g.n++;
    else groups.push({ key, n: 1, d });
  });
  const items = groups.map(({ n, d }) => `${n} ${d.severity.toLowerCase()} ${NOUN[d.type][n > 1 ? 1 : 0]} on the ${d.area}`);
  return { items, sentence: items.join(" and ") };
}
export const findingText = (d: Defect) => `${d.type} · ${d.where} · ${d.severity} · ${d.confidence}% sure`;

export type TestGroup =
  | "Display"
  | "Audio"
  | "Battery & Power"
  | "Keyboard & Touchpad"
  | "Ports & Slots"
  | "Network"
  | "Camera"
  | "Performance"
  | "Storage"
  | "System & Security";

export type Spotlight =
  | "display"
  | "audio"
  | "battery"
  | "keyboard"
  | "touchpad"
  | "ports"
  | "wireless"
  | "camera"
  | "performance"
  | "storage"
  | "system";

export interface TestDef {
  id: string;
  group: TestGroup;
  spotlight: Spotlight;
  testName: string;
  type: "Automatic" | "Assisted";
  partName: string;
  durationMs: number;
  gate?: "keys" | "pad";
  port?: string;
}

const t = (
  id: string,
  group: TestGroup,
  spotlight: Spotlight,
  testName: string,
  type: "Automatic" | "Assisted",
  partName: string,
  durationMs: number,
  extra: Partial<TestDef> = {}
): TestDef => ({ id, group, spotlight, testName, type, partName, durationMs, ...extra });

export const TESTS: TestDef[] = [
  t("dsp-display", "Display", "display", "Display Test", "Assisted", "Screen", 1400),
  t("dsp-bright", "Display", "display", "Display Brightness Test", "Assisted", "Screen", 800),
  t("aud-play", "Audio", "audio", "Audio Playback Test", "Automatic", "Audio", 800),
  t("aud-speaker", "Audio", "audio", "Inbuild Speaker Test", "Assisted", "Speakers", 1000),
  t("aud-mic", "Audio", "audio", "Inbuild Microphone Test", "Assisted", "Microphone", 800),
  t("bat-health", "Battery & Power", "battery", "Battery Health Test", "Automatic", "Battery", 1200),
  t("bat-charger", "Battery & Power", "battery", "Charger Test", "Assisted", "Charger", 600),
  t("bat-charge", "Battery & Power", "battery", "Battery Charging Test", "Assisted", "Battery", 600),
  t("bat-discharge", "Battery & Power", "battery", "Battery Discharging Test", "Assisted", "Battery", 600),
  t("bat-stress", "Battery & Power", "battery", "Battery Stress Test", "Automatic", "Battery", 900),
  t("kb", "Keyboard & Touchpad", "keyboard", "Keyboard Test", "Assisted", "Keyboard", 1800, { gate: "keys" }),
  t("tp", "Keyboard & Touchpad", "touchpad", "Touchpad Test", "Assisted", "Touchpad", 1600, { gate: "pad" }),
  t("prt-usb", "Ports & Slots", "ports", "USB Port Test", "Assisted", "USB ports", 450, { port: "USB" }),
  t("prt-hdmi", "Ports & Slots", "ports", "HDMI Port Test", "Assisted", "HDMI port", 450, { port: "HDMI" }),
  t("prt-vga", "Ports & Slots", "ports", "VGA Port Test", "Assisted", "VGA port", 450, { port: "VGA" }),
  t("prt-eth", "Ports & Slots", "ports", "Wired Ethernet Test", "Assisted", "Ethernet port", 450, { port: "Ethernet" }),
  t("prt-sd", "Ports & Slots", "ports", "SD Card Slot Test", "Assisted", "SD card slot", 450, { port: "SD card" }),
  t("prt-odd", "Ports & Slots", "ports", "Optical Disk Drive Test", "Assisted", "Disc drive", 450, { port: "Disc drive" }),
  t("wl-net", "Network", "wireless", "Internet Test", "Automatic", "Internet", 1000),
  t("wl-wifi", "Network", "wireless", "Wireless Test", "Automatic", "Wi-Fi", 900),
  t("wl-bt", "Network", "wireless", "Bluetooth Test", "Automatic", "Bluetooth", 600),
  t("cam-photo", "Camera", "camera", "Camera Photo Test", "Automatic", "Camera", 800),
  t("cam-video", "Camera", "camera", "Camera Video Test", "Automatic", "Camera", 800),
  t("perf-cpu", "Performance", "performance", "CPU Test", "Automatic", "Processor", 1300),
  t("perf-ram", "Performance", "performance", "RAM Test", "Automatic", "Memory", 700),
  t("perf-gpu", "Performance", "performance", "GPU Test", "Automatic", "Graphics", 800),
  t("perf-gfx", "Performance", "performance", "Graphic Card Test", "Automatic", "Graphics card", 500),
  t("perf-mb", "Performance", "performance", "Motherboard Test", "Automatic", "Motherboard", 500),
  t("perf-pcie", "Performance", "performance", "PCI Express Test", "Automatic", "PCI Express", 400),
  t("perf-fan", "Performance", "performance", "Fan Test", "Automatic", "Fan", 600),
  t("sto", "Storage", "storage", "Storage Test", "Automatic", "Drive", 1500),
  t("sys-tpm", "System & Security", "system", "TPM Test", "Automatic", "Security chip", 400),
  t("sys-fp", "System & Security", "system", "Fingerprint Test", "Assisted", "Fingerprint reader", 700),
  t("sys-rtc", "System & Security", "system", "Realtime Clock Test", "Automatic", "Clock", 400),
  t("sys-win", "System & Security", "system", "Win Activation Test", "Automatic", "OS licence", 500),
];
export const TEST_GROUPS: TestGroup[] = [...new Set(TESTS.map((x) => x.group))];

export const SPEC_FIELDS = ["Brand", "Model", "Serial No.", "Processor", "Memory", "Storage", "Battery cycles", "Operating system"];

export interface Scenario {
  id: string;
  name: string;
  os: string;
  story: string;
  specs: Record<string, string>;
  batteryHealth: number;
  wifiSignal: number;
  wifiMbps: number;
  cpuPeak: number;
  driveHealth: number;
  readMBs: number;
  writeMBs: number;
  fails: Record<string, string>;
  deadKeys: string[];
  defects: Defect[];
  confidence: number;
}

export const SCENARIOS: Record<string, Scenario> = {
  dell: {
    id: "dell",
    name: "Dell Latitude 5420",
    os: "Windows 11",
    story: "Office laptop, 2 years old",
    specs: { Brand: "Dell", Model: "Latitude 5420", "Serial No.": "7HQK2M3", Processor: "Intel Core i5-1145G7", Memory: "16 GB", Storage: "256 GB SSD", "Battery cycles": "212", "Operating system": "Windows 11 Pro" },
    batteryHealth: 92, wifiSignal: 31, wifiMbps: 96, cpuPeak: 94, driveHealth: 98, readMBs: 2140, writeMBs: 1320,
    fails: {
      kb: "2 keys did not respond (F and J).",
      "wl-wifi": `Signal too weak, below the ${WIFI_SIGNAL_LIMIT}% limit.`,
    },
    deadKeys: ["F", "J"],
    defects: [
      { angle: "Bottom", type: "Scratch", severity: "Light", area: "base", where: "Base, left of centre", confidence: 92, box: { x: 30, y: 38, w: 24, h: 12 } },
    ],
    confidence: 97,
  },
  mac: {
    id: "mac",
    name: "MacBook Air M2",
    os: "macOS Sonoma",
    story: "Personal laptop, used daily",
    specs: { Brand: "Apple", Model: "MacBook Air (M2, 2022)", "Serial No.": "C02HF3K9Q6L4", Processor: "Apple M2, 8-core", Memory: "8 GB", Storage: "256 GB SSD", "Battery cycles": "684", "Operating system": "macOS Sonoma" },
    batteryHealth: 61, wifiSignal: 82, wifiMbps: 486, cpuPeak: 88, driveHealth: 96, readMBs: 2890, writeMBs: 2410,
    fails: {
      "bat-health": `61%, below the ${BATTERY_LIMIT}% limit.`,
      "aud-speaker": "Sound is distorted.",
    },
    deadKeys: [],
    defects: [
      { angle: "Bottom", type: "Dent", severity: "Medium", area: "bottom corner", where: "Bottom corner", confidence: 88, box: { x: 66, y: 66, w: 14, h: 16 } },
      { angle: "Back", type: "Scratch", severity: "Light", area: "lid", where: "Lid, top left", confidence: 92, box: { x: 24, y: 22, w: 22, h: 10 } },
      { angle: "Back", type: "Scratch", severity: "Light", area: "lid", where: "Lid, centre", confidence: 90, box: { x: 42, y: 56, w: 24, h: 10 } },
      { angle: "Back", type: "Scratch", severity: "Light", area: "lid", where: "Lid, lower right", confidence: 86, box: { x: 58, y: 69, w: 20, h: 10 } },
    ],
    confidence: 94,
  },
  hp: {
    id: "hp",
    name: "HP EliteBook 840 G8",
    os: "Windows 11",
    story: "Returned from a company fleet",
    specs: { Brand: "HP", Model: "EliteBook 840 G8", "Serial No.": "5CG1348ZTR", Processor: "Intel Core i7-1165G7", Memory: "16 GB", Storage: "512 GB SSD", "Battery cycles": "341", "Operating system": "Windows 11 Pro" },
    batteryHealth: 84, wifiSignal: 74, wifiMbps: 377, cpuPeak: 97, driveHealth: 91, readMBs: 1980, writeMBs: 1170,
    fails: {
      "prt-usb": "USB-C port 1: No device detected.",
      "cam-photo": "No picture.",
    },
    deadKeys: [],
    defects: [
      { angle: "Back", type: "Crack", severity: "Severe", area: "lid corner", where: "Lid, right corner", confidence: 95, box: { x: 66, y: 14, w: 16, h: 22 } },
      { angle: "Left", type: "Scratch", severity: "Light", area: "left side", where: "Left side, near the ports", confidence: 91, box: { x: 30, y: 40, w: 24, h: 18 } },
    ],
    confidence: 96,
  },
};
export const DEVICE_ORDER = ["dell", "mac", "hp"];
export const DEFAULT_DEVICE = "dell";

export function functionalResults(sc: Scenario) {
  const res: Record<string, { pass: boolean; reason: string }> = {};
  TESTS.forEach((x) => {
    res[x.id] = { pass: !sc.fails[x.id], reason: sc.fails[x.id] || "" };
  });
  const failed = TESTS.filter((x) => !res[x.id].pass).map((x) => ({ ...x, reason: res[x.id].reason }));
  return { res, failed, passed: TESTS.length - failed.length, total: TESTS.length };
}

export interface ChecklistQuestion {
  id: "crack" | "dent" | "deep" | "light" | "screen" | "hinge";
  q: string;
  options: string[];
}
export const CHECKLIST: ChecklistQuestion[] = [
  { id: "crack", q: "Any cracks on the screen or case?", options: ["No", "Yes"] },
  { id: "dent", q: "Any dents on the lid or base?", options: ["No", "Yes"] },
  { id: "deep", q: "Any deep scratches you can feel?", options: ["No", "Yes"] },
  { id: "light", q: "Light scratches?", options: ["None", "1 to 2", "3 or more"] },
  { id: "screen", q: "Any marks or spots on the screen?", options: ["No", "Yes"] },
  { id: "hinge", q: "Is the hinge loose or broken?", options: ["No", "Yes"] },
];
export type ChecklistAnswers = Partial<Record<ChecklistQuestion["id"], string>>;

export function checklistFromDefects(defects: Defect[]): ChecklistAnswers {
  const light = defects.filter((d) => d.type === "Scratch" && d.severity === "Light").length;
  return {
    crack: defects.some((d) => d.type === "Crack") ? "Yes" : "No",
    dent: defects.some((d) => d.type === "Dent") ? "Yes" : "No",
    deep: defects.some((d) => d.type === "Scratch" && d.severity !== "Light" && d.angle !== "Front") ? "Yes" : "No",
    light: light === 0 ? "None" : light <= 2 ? "1 to 2" : "3 or more",
    screen: defects.some((d) => d.angle === "Front") ? "Yes" : "No",
    hinge: defects.some((d) => d.type === "Broken") ? "Yes" : "No",
  };
}
export function defectsFromChecklist(a: ChecklistAnswers, sc: Scenario | null): Defect[] {
  const out: Defect[] = [];
  const src = (fn: (d: Defect) => boolean) => (sc ? sc.defects.find(fn) : null);
  const lightSrc = sc ? sc.defects.filter((d) => d.type === "Scratch" && d.severity === "Light") : [];
  if (a.crack === "Yes") out.push({ angle: "Back", type: "Crack", severity: "Severe", area: src((d) => d.type === "Crack")?.area || "lid" });
  if (a.dent === "Yes") out.push({ angle: "Bottom", type: "Dent", severity: "Medium", area: src((d) => d.type === "Dent")?.area || "base" });
  if (a.deep === "Yes") out.push({ angle: "Bottom", type: "Scratch", severity: "Medium", area: "base" });
  const n = a.light === "1 to 2" ? Math.max(1, Math.min(2, lightSrc.length || 1)) : a.light === "3 or more" ? Math.max(3, lightSrc.length) : 0;
  for (let i = 0; i < n; i++) out.push({ angle: lightSrc[i]?.angle || "Bottom", type: "Scratch", severity: "Light", area: lightSrc[i]?.area || "base" });
  if (a.screen === "Yes") out.push({ angle: "Front", type: "Scratch", severity: "Medium", area: "screen" });
  if (a.hinge === "Yes") out.push({ angle: "Front", type: "Broken", severity: "Severe", area: "hinge" });
  return out;
}

export const TIMINGS = {
  intake: { slideIn: 800, field: 650, afterFields: 1500 },
  functional: { summaryHold: 3800, gateLead: 300 },
  cosmetic: { capture: 700, scan: 900, gradeGap: 500, gradeAnim: 700, ringAnim: 900, hold: 6200, checklistGap: 900 },
  certificate: { merge: 1600, verifyAt: 4800, verifyDur: 1500, total: 13000 },
  admin: { flight: 1600, siteAt: 7000, roleAt: 11500, roleEnd: 14500, total: 19000, tips: [0, 4000, 7000, 11500, 14500] },
  toast: 1800,
};
export const LENS_STEPS = ["Finding the laptop edges", "Checking the screen", "Checking the lid and corners", "Checking the base and ports"];

export interface AdminTip {
  target: "row" | "kpi" | "site" | "role" | "wallet";
  title: string;
  text: string;
}
export const ADMIN_TIPS: AdminTip[] = [
  { target: "row", title: "The laptop you just checked", text: "It lands at the top of Recent devices with its grade and test result. Tap any row to open its certificate." },
  { target: "kpi", title: "Today at a glance", text: "These cards add up every check across your sites. They update as each laptop is done." },
  { target: "site", title: "Filter by site", text: "Pick a site to see only its devices. Every card and chart follows the filter." },
  { target: "role", title: "Admin and Technician views", text: "Technicians see only their own queue. Admins see every site." },
  { target: "wallet", title: "Licence wallet", text: "See how many Gadget Evaluate and Gadget Lens licences are left, and top up when you need more." },
];

export interface ScheduledTest extends TestDef {
  start: number;
  end: number;
}
export function scheduleTests(): ScheduledTest[] {
  let at = 0;
  return TESTS.map((x) => {
    const s = { ...x, start: at, end: at + x.durationMs };
    at += x.durationMs;
    return s;
  });
}
export function stageTimeline() {
  const T = TIMINGS;
  const fieldsEnd = T.intake.slideIn + SPEC_FIELDS.length * T.intake.field;
  const sched = scheduleTests();
  const testsEnd = sched[sched.length - 1].end;
  const capEnd = ANGLES.length * T.cosmetic.capture;
  const scanEnd = capEnd + ANGLES.length * T.cosmetic.scan;
  const gradeAt = scanEnd + T.cosmetic.gradeGap;
  const clGradeAt = CHECKLIST.length * T.cosmetic.capture + T.cosmetic.checklistGap;
  return {
    sched, fieldsEnd, testsEnd, capEnd, scanEnd, gradeAt, clGradeAt,
    dur: {
      intake: fieldsEnd + T.intake.afterFields,
      functional: testsEnd + T.functional.summaryHold,
      cosmetic: gradeAt + T.cosmetic.hold,
      cosmeticChecklist: clGradeAt + T.cosmetic.hold,
      certificate: T.certificate.total,
      admin: T.admin.total,
    },
  };
}
export type StageTimeline = ReturnType<typeof stageTimeline>;

export const LICENCE_TYPES = [
  { id: "evaluate", name: "Gadget Evaluate", short: "Evaluate", balance: 108, use: "Used when the functional test starts." },
  { id: "lens", name: "Gadget Lens", short: "Lens", balance: 96, use: "Used when the AI grading starts. The checklist does not use one." },
];
export const LICENCE_WALLET = {
  perCheck: 1,
  rule: "Gadget Evaluate and Gadget Lens use separate licences. Each check uses 1 of each. Grading with the checklist does not use a Lens licence.",
  packs: [100, 500, 1000].map((n) => ({ licences: n, price: "₹XXX" })),
};
export const licencesLeft = (type: string, used: boolean) => LICENCE_TYPES.find((x) => x.id === type)!.balance - (used ? LICENCE_WALLET.perCheck : 0);

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let r = Math.imul(a ^ (a >>> 15), 1 | a);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(str: string) {
  let h = 2166136261;
  for (const c of str) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
export function makeCertId(serial: string, date = new Date()) {
  const n = hash(serial + date.toDateString()).toString(36).toUpperCase().padStart(6, "0").slice(-6);
  return `${CERT_PREFIX}-${date.getFullYear()}-${n}`;
}

export const SITES = ["Delhi", "Mumbai", "Bengaluru"];
export const TECHNICIANS: Record<string, string[]> = { Delhi: ["Priya Sharma", "Rahul Verma"], Mumbai: ["Anita Desai", "Karan Mehta"], Bengaluru: ["Suresh Rao", "Divya Nair"] };
const MODELS = ["Dell Latitude 5420", "Dell Latitude 7410", "HP EliteBook 840 G8", "HP ProBook 440 G9", "Lenovo ThinkPad T14", "Lenovo ThinkPad E14", "MacBook Air M1", "MacBook Air M2", "MacBook Pro 13 M1", "Asus ExpertBook B5"];
const FAILURES: [string, number][] = [["bat-health", 0.4], ["prt-usb", 0.2], ["kb", 0.14], ["wl-wifi", 0.12], ["cam-photo", 0.08], ["aud-speaker", 0.06]];
const DEFECT_POOL: [DefectType, Severity, number][] = [["Scratch", "Light", 0.55], ["Scratch", "Medium", 0.15], ["Dent", "Medium", 0.22], ["Crack", "Severe", 0.08]];
const AREAS = ["lid", "base", "left side", "right side", "screen", "bottom corner"];

function pick<T extends readonly unknown[]>(r: () => number, pool: T[], wi: number): T {
  const x = r();
  let acc = 0;
  for (const p of pool) {
    acc += p[wi] as number;
    if (x <= acc) return p;
  }
  return pool[pool.length - 1];
}

export interface AdminRow {
  id: string;
  model: string;
  serial: string;
  site: string;
  tech: string;
  at: Date;
  fails: string[];
  defects: Defect[];
  grade: string;
  durationSec: number;
  certId: string;
  batteryHealth: number;
  isNew?: boolean;
}

function seedAdminDevices(count = 40, seed = 20260926): AdminRow[] {
  const r = mulberry32(seed);
  const today = new Date();
  const rows: AdminRow[] = [];
  for (let i = 0; i < count; i++) {
    const site = SITES[Math.floor(r() * 3)];
    const tech = TECHNICIANS[site][Math.floor(r() * 2)];
    const model = MODELS[Math.floor(r() * MODELS.length)];
    const serial = Array.from({ length: 8 }, () => "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ"[Math.floor(r() * 34)]).join("");
    const fails = r() < (site === "Delhi" ? 0.3 : 0.2) ? [pick(r, FAILURES, 1)[0]] : [];
    const nDef = Math.floor(r() * 4);
    const defects: Defect[] = Array.from({ length: nDef }, () => {
      const p = pick(r, DEFECT_POOL, 2);
      return { angle: ANGLES[Math.floor(r() * 6)], type: p[0], severity: p[1], area: AREAS[Math.floor(r() * AREAS.length)] };
    });
    const minutes = 9 * 60 + 5 + Math.floor((i / count) * 470 + r() * 10);
    const at = new Date(today);
    at.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
    rows.push({
      id: "row" + i, model, serial, site, tech, at, fails, defects,
      grade: gradeFromDefects(defects).letter,
      durationSec: 240 + Math.floor(r() * 180),
      certId: makeCertId(serial, today),
      batteryHealth: fails.includes("bat-health") ? 52 + Math.floor(r() * 17) : 72 + Math.floor(r() * 26),
    });
  }
  return rows.sort((a, b) => b.at.getTime() - a.at.getTime());
}
export const ADMIN_DEVICES = seedAdminDevices();

export const FAILURE_LABEL: Record<string, string> = { "bat-health": "Battery", "prt-usb": "USB port", kb: "Keyboard", "wl-wifi": "Wi-Fi", "cam-photo": "Camera", "aud-speaker": "Speaker" };
export const failureLabel = (id: string) => FAILURE_LABEL[id] || TESTS.find((x) => x.id === id)?.partName || id;

export function percentages(counts: number[]) {
  const total = counts.reduce((a, b) => a + b, 0);
  if (!total) return counts.map(() => 0);
  const raw = counts.map((c) => (c / total) * 100);
  const out = raw.map(Math.floor);
  let left = 100 - out.reduce((a, b) => a + b, 0);
  raw
    .map((v, i): [number, number] => [v - Math.floor(v), i])
    .sort((a, b) => b[0] - a[0])
    .forEach(([, i]) => {
      if (left > 0) {
        out[i]++;
        left--;
      }
    });
  return out;
}

export function adminSummary(rows: AdminRow[]) {
  const count = rows.length;
  const passed = rows.filter((r) => !r.fails.length).length;
  const passPct = count ? Math.round((passed / count) * 100) : 0;
  const avgIdx = count ? Math.round(rows.reduce((s, r) => s + gIndex(r.grade), 0) / count) : 0;
  const avgSec = count ? Math.round(rows.reduce((s, r) => s + r.durationSec, 0) / count) : 0;
  const mixCounts = GRADE_SCALE.map((g) => rows.filter((r) => r.grade === g.letter).length);
  const mixPct = percentages(mixCounts);
  const gradeMix = GRADE_SCALE.map((g, i) => ({ ...g, count: mixCounts[i], pct: mixPct[i] }));
  const perHour: { hour: number; count: number }[] = [];
  for (let h = 9; h <= 17; h++) perHour.push({ hour: h, count: rows.filter((r) => r.at.getHours() === h).length });
  const failMap: Record<string, number> = {};
  rows.forEach((r) => r.fails.forEach((f) => { const l = failureLabel(f); failMap[l] = (failMap[l] || 0) + 1; }));
  const failures = Object.entries(failMap).map(([label, n]) => ({ label, n })).sort((a, b) => b.n - a.n);
  const combo: Record<string, number> = {};
  rows.forEach((r) => r.fails.forEach((f) => { const k = r.site + "|" + failureLabel(f); combo[k] = (combo[k] || 0) + 1; }));
  const top = Object.entries(combo).sort((a, b) => b[1] - a[1])[0];
  const alert = top && top[1] >= 2 ? { site: top[0].split("|")[0], label: top[0].split("|")[1], n: top[1] } : null;
  return { count, passed, passPct, avgGrade: count ? GRADE_SCALE[avgIdx].letter : "None", avgSec, gradeMix, perHour, failures, alert };
}

export function fmtDuration(sec: number) {
  return `${Math.floor(sec / 60)} min ${sec % 60} s`;
}
export function fmtDate(d = new Date()) {
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
export function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const ease = (p: number) => 1 - Math.pow(1 - clamp(p), 3);
export const pct = (v: number) => (v * 100).toFixed(1) + "%";
