import * as D from "../data";
import type { ScheduledTest, Scenario, StageTimeline } from "../data";
import type { DemoState } from "../types";
import { PATHS } from "../icons";

export type TestStatus = "wait" | "run" | "pass" | "fail";

const STATUS_COLOR: Record<TestStatus, string> = {
  wait: "var(--border-default)",
  run: "var(--brand-primary)",
  pass: "var(--status-success)",
  fail: "var(--status-danger)",
};

export function testStatus(x: ScheduledTest, tf: number, fr: ReturnType<typeof D.functionalResults>): TestStatus {
  return tf < x.start ? "wait" : tf < x.end ? "run" : fr.res[x.id].pass ? "pass" : "fail";
}

/** The test the spotlight is showing: the running one, else the last (finished) or first (not started). */
export function currentTest(sched: ScheduledTest[], tlc: StageTimeline, tf: number, fr: ReturnType<typeof D.functionalResults>) {
  const curT = sched.find((x) => testStatus(x, tf, fr) === "run") || (tf >= tlc.testsEnd ? sched[sched.length - 1] : sched[0]);
  return { curT, cstat: testStatus(curT, tf, fr), p: D.clamp((tf - curT.start) / curT.durationMs) };
}

export interface SpotlightView {
  isDisplay?: boolean; isAudio?: boolean; isBattery?: boolean; isKeyboard?: boolean; isTouchpad?: boolean;
  isPorts?: boolean; isWireless?: boolean; isCamera?: boolean; isPerformance?: boolean; isStorage?: boolean; isSystem?: boolean;

  showGrid?: boolean; showSweep?: boolean; bands?: string[]; sweepX?: string; dim?: string; cells?: string[]; displayNote?: string;
  bars?: { h: string; bg: string }[]; lColor?: string; rColor?: string; audioNote?: string;
  batVal?: string; batFill?: string; batColor?: string; limitLeft?: string; limitLabel?: string; cycles?: string; charging?: string;
  kbRows?: { keys: { label: string; flex: number; press: () => void; disabled: boolean; pressed: boolean; cursor: string; bg: string; fg: string }[] }[];
  kbPrompt?: boolean; kbCount?: number; kbNote?: string;
  padPts?: string; padDone?: boolean; padPrompt?: string; padBorder?: string;
  ports?: { name: string; icon: string; state: string; color: string }[];
  signal?: { h: string; bg: string }[]; signalLabel?: string; signalColor?: string; speed?: number; bt?: string; wifiNote?: string;
  camNoPic?: boolean; camPic?: boolean; camLabel?: string; recO?: string; mic?: string;
  meters?: { label: string; value: string; w: string; bg: string }[];
  drive?: { label: string; value: string; unit: string }[];
  sys?: { label: string; state: string; color: string; border: string }[];
}

const KB: string[][] = [
  ["Esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "↵"],
  ["⇧", "Z", "X", "C", "V", "B", "N", "M", ",", "."],
  ["Ctrl", "Alt", "Space", "Alt", "Fn"],
];
const KB_FLAT = KB.flat();
const PORT_ICON: Record<string, string> = { USB: PATHS.usb, HDMI: PATHS.tv, VGA: PATHS.tv, Ethernet: PATHS.eth, "SD card": PATHS.sd, "Disc drive": PATHS.disc };

export function computeSpotlight(params: {
  x: ScheduledTest;
  p: number;
  cstat: TestStatus;
  sc: Scenario;
  fr: ReturnType<typeof D.functionalResults>;
  clock: number;
  tryM: boolean;
  state: DemoState;
  tlc: StageTimeline;
  wave: number[] | null;
  registerKey: (label: string | null, code: string) => void;
}): SpotlightView {
  const { x, p, cstat, sc, fr, clock, tryM, state: s, tlc, wave, registerKey } = params;
  const rm = s.reduced;
  const k = x.spotlight;
  const L = D.BATTERY_LIMIT;
  const sp: SpotlightView = {
    isDisplay: k === "display", isAudio: k === "audio", isBattery: k === "battery", isKeyboard: k === "keyboard",
    isTouchpad: k === "touchpad", isPorts: k === "ports", isWireless: k === "wireless", isCamera: k === "camera",
    isPerformance: k === "performance", isStorage: k === "storage", isSystem: k === "system",
  };
  const done = cstat === "pass" || cstat === "fail";
  const running = cstat === "run";
  const past = (id: string) => tlc.sched.find((y) => y.id === id)!.end <= s.t;
  const stOf = (y: ScheduledTest): TestStatus => (s.t < y.start ? "wait" : s.t < y.end ? "run" : fr.res[y.id].pass ? "pass" : "fail");

  if (k === "display") {
    const grid = x.id === "dsp-display";
    sp.showGrid = grid;
    sp.showSweep = !grid;
    sp.bands = ["var(--surface-card)", "var(--brand-accent)", "var(--status-success)", "var(--brand-primary)", "var(--text-secondary)"];
    sp.sweepX = "0%";
    sp.dim = (done ? 0 : 0.75 * (1 - p)).toFixed(2);
    const n = Math.floor(p * 84);
    sp.cells = Array.from({ length: 84 }, (_, i) => (done || i < n ? "rgba(0,82,204,.55)" : i === n ? "var(--brand-accent)" : "rgba(255,255,255,.05)"));
    sp.displayNote = grid ? `${done ? 100 : Math.floor(p * 100)}% of the screen checked · 0 dead pixels` : `Brightness ${done ? 100 : Math.round(25 + 75 * p)}%`;
  }
  if (k === "audio") {
    const bad = !fr.res[x.id].pass, mic = x.id === "aud-mic";
    sp.bars = Array.from({ length: 32 }, (_, i) => {
      let v = 0.08;
      if (wave && !mic) v = 0.1 + wave[i] * 2.4;
      else if (running && !rm)
        v = bad
          ? 0.1 + 0.85 * Math.abs(Math.sin(i * 2.7 + clock / 37) * Math.cos(i * 1.3 - clock / 23))
          : 0.15 + 0.7 * Math.abs(Math.sin(i * 0.55 + clock / 110) * Math.cos(i * 0.21 - clock / 260));
      return { h: D.pct(D.clamp(v, 0.04, 1)), bg: bad && (running || done) ? "var(--status-danger)" : mic ? "var(--status-success)" : wave ? "var(--brand-accent)" : "var(--brand-primary)" };
    });
    const on = mic ? "var(--text-tertiary)" : "var(--brand-primary)";
    sp.lColor = on;
    sp.rColor = bad ? "var(--status-danger)" : on;
    sp.audioNote = bad && done ? `${x.testName}: ${fr.res[x.id].reason}` : "";
  }
  if (k === "battery") {
    const h = sc.batteryHealth, fill = x.id === "bat-health" && !done ? h * D.ease(p * 1.3) : h;
    sp.batVal = Math.round(fill) + "%";
    sp.batFill = fill.toFixed(1) + "%";
    sp.batColor = x.id === "bat-health" && !done ? "var(--brand-primary)" : h < L ? "var(--status-danger)" : "var(--status-success)";
    sp.limitLeft = L + "%";
    sp.limitLabel = L + "%";
    sp.cycles = sc.specs["Battery cycles"];
    sp.charging = past("bat-charge") ? "Works" : x.id === "bat-charge" ? "Checking" : "Waiting";
  }
  if (k === "keyboard") {
    const waitingKeys = s.waiting === "keys", userMode = tryM && (waitingKeys || s.gates["functional:keys"]);
    const dead = sc.deadKeys || [], kbDone = past("kb");
    let idx = 0;
    sp.kbRows = KB.map((row) => ({
      keys: row.map((label) => {
        const i = idx++;
        const reached = running ? i / KB_FLAT.length < p * 1.05 : kbDone;
        const flex = label === "Space" ? 5 : label.length > 2 ? 1.5 : 1;
        const press = () => registerKey(label, "virtual:" + label);
        const disabled = !waitingKeys;
        const pressed = userMode && !!s.keys[label];
        const cursor = waitingKeys ? "pointer" : "default";
        if (dead.includes(label) && reached) return { label, flex, press, disabled, pressed, cursor, bg: "var(--status-danger)", fg: "#fff" };
        const on = userMode ? !!s.keys[label] : reached;
        const wavehit = !userMode && running && Math.abs(i / KB_FLAT.length - p) < 0.04;
        return { label, flex, press, disabled, pressed, cursor, bg: wavehit ? "var(--brand-accent)" : on ? "var(--brand-primary)" : "rgba(255,255,255,.08)", fg: on || wavehit ? "#fff" : "rgba(255,255,255,.6)" };
      }),
    }));
    sp.kbPrompt = waitingKeys;
    sp.kbCount = Math.min(5, s.keyCount);
    sp.kbNote = kbDone && !fr.res.kb.pass ? `Keyboard Test: ${fr.res.kb.reason}` : "";
  }
  if (k === "touchpad") {
    const waitingPad = s.waiting === "pad", userMode = tryM && (waitingPad || s.gates["functional:pad"]);
    const pts = userMode ? s.pad : circlePts(running ? p : 1);
    sp.padPts = pts.map((q) => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");
    sp.padDone = userMode ? s.padDone : done || p > 0.98;
    sp.padPrompt = waitingPad ? "Draw a circle in the box" : "Following the pointer";
    sp.padBorder = waitingPad ? "var(--brand-primary)" : "var(--border-subtle)";
  }
  if (k === "ports") {
    sp.ports = tlc.sched
      .filter((y) => y.spotlight === "ports")
      .map((y) => {
        const stt = stOf(y);
        return { name: y.port!, icon: PORT_ICON[y.port!], state: { wait: "Waiting", run: "Checking…", pass: "Works", fail: "Not working" }[stt], color: STATUS_COLOR[stt] };
      });
  }
  if (k === "wireless") {
    const sig = sc.wifiSignal, bad = !fr.res["wl-wifi"].pass;
    const sigNow = x.id === "wl-wifi" && running ? Math.round(sig * D.ease(p)) : past("wl-wifi") ? sig : null;
    const lit = sigNow == null ? (x.id === "wl-net" && running ? Math.ceil(p * 4) : 3) : Math.max(1, Math.round((sigNow / 100) * 4));
    const red = sigNow != null && bad && (past("wl-wifi") || cstat === "fail");
    sp.signal = [0.25, 0.5, 0.75, 1].map((h, i) => ({ h: D.pct(h), bg: i < lit ? (red ? "var(--status-danger)" : "var(--brand-primary)") : "var(--surface-sunken)" }));
    sp.signalLabel = sigNow == null ? "Signal" : `Signal ${sigNow}%`;
    sp.signalColor = red ? "var(--status-danger)" : "var(--text-secondary)";
    sp.speed = x.id === "wl-net" && running ? Math.round(sc.wifiMbps * D.ease(p)) : past("wl-net") ? sc.wifiMbps : 0;
    sp.bt = past("wl-bt") ? "3 devices found" : x.id === "wl-bt" ? "searching…" : "waiting";
    sp.wifiNote = red ? `Wireless Test: ${fr.res["wl-wifi"].reason}` : "";
  }
  if (k === "camera") {
    const noPic = !fr.res["cam-photo"].pass && (past("cam-photo") || x.id === "cam-photo");
    sp.camNoPic = noPic;
    sp.camPic = !noPic;
    sp.camLabel = "Video signal";
    sp.recO = rm ? "1" : (0.5 + 0.5 * Math.abs(Math.sin(clock / 300))).toFixed(2);
    sp.mic = x.id === "cam-video" && running && !rm ? D.pct(0.3 + 0.5 * Math.abs(Math.sin(clock / 140))) : past("cam-video") ? "80%" : "8%";
  }
  if (k === "performance") {
    const wave2 = (id: string) => (x.id === id && running ? Math.sin(p * Math.PI) : 0);
    const cpu = Math.round(18 + (sc.cpuPeak - 18) * wave2("perf-cpu"));
    const ram = Math.round(34 + 50 * wave2("perf-ram"));
    const gpu = Math.round(12 + 78 * Math.max(wave2("perf-gpu"), wave2("perf-gfx")));
    const fan = Math.round(1800 + 3200 * Math.max(wave2("perf-fan"), wave2("perf-cpu") * 0.7));
    sp.meters = [
      { label: "Processor load", value: cpu + "%", w: cpu + "%", bg: "var(--brand-primary)" },
      { label: "Memory in use", value: ram + "%", w: ram + "%", bg: "var(--brand-primary)" },
      { label: "Graphics load", value: gpu + "%", w: gpu + "%", bg: "var(--brand-primary)" },
      { label: "Fan speed", value: fan.toLocaleString("en-IN") + " rpm", w: Math.round((fan / 5200) * 100) + "%", bg: "var(--status-success)" },
    ];
  }
  if (k === "storage") {
    const seg = (i: number) => (done ? 1 : D.ease(p * 3 - i));
    sp.drive = [
      { label: "Drive health", value: Math.round(sc.driveHealth * seg(0)) + "%", unit: "Good condition" },
      { label: "Read speed", value: Math.round(sc.readMBs * seg(1)).toLocaleString("en-IN"), unit: "MB/s" },
      { label: "Write speed", value: Math.round(sc.writeMBs * seg(2)).toLocaleString("en-IN"), unit: "MB/s" },
    ];
  }
  if (k === "system") {
    sp.sys = tlc.sched
      .filter((y) => y.spotlight === "system")
      .map((y) => {
        const stt = stOf(y);
        return { label: y.testName, state: { wait: "Waiting", run: "Checking…", pass: "Passed", fail: "Failed" }[stt], color: STATUS_COLOR[stt], border: stt === "run" ? "var(--brand-primary)" : "var(--border-subtle)" };
      });
  }
  return sp;
}

function circlePts(p: number): [number, number][] {
  const n = Math.max(2, Math.round(64 * p));
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / 64) * Math.PI * 2 - Math.PI / 2;
    pts.push([50 + 30 * Math.cos(a), 50 + 34 * Math.sin(a)]);
  }
  return pts;
}

export function narrateTest(x: ScheduledTest, fr: ReturnType<typeof D.functionalResults>, w: string | null, cstat: TestStatus) {
  if (!fr.res[x.id].pass && cstat === "fail") return `${x.testName} failed: ${fr.res[x.id].reason}`;
  if (x.gate === "keys" && w === "keys") return "Your turn: press any 5 keys on your keyboard.";
  if (x.gate === "pad" && w === "pad") return "Your turn: draw a circle in the touchpad box.";
  const M: Record<string, string> = {
    display: x.id === "dsp-bright" ? "Stepping the screen through every brightness level." : "Checking the screen for dead pixels and colour problems.",
    audio: x.id === "aud-mic" ? "Recording a short sound to check the microphone." : "Playing a test sound through the speakers. Tap to hear it.",
    battery: x.id === "bat-health" ? `Measuring battery health. The limit is ${D.BATTERY_LIMIT}%.` : "Checking the charger, charging, drain and battery under load.",
    keyboard: "Checking every key on the keyboard.",
    touchpad: "Checking the touchpad follows every movement.",
    ports: "Checking each port and slot one by one.",
    wireless: x.id === "wl-wifi" ? `Measuring Wi-Fi signal strength. The limit is ${D.WIFI_SIGNAL_LIMIT}%.` : "Checking the internet connection and Bluetooth.",
    camera: "Taking a test photo and a short video with the camera.",
    performance: "Stress testing the processor, memory, graphics and fan.",
    storage: "Checking the drive's health and speed.",
    system: "Checking the security chip, fingerprint reader, clock and licence.",
  };
  return M[x.spotlight];
}
