// Laptop photo renders for the Gadget Lens demo (400 x 300, 4:3).
// Stand-ins until real photos are used. Marks are drawn separately on top.
// Ported 1:1 from the original demo's demo/renders.js.
import type { Angle, Defect } from "./data";

interface Variant {
  al: [string, string, string];
  alv: [string, string];
  rim: string;
  scr: [string, string];
  wall: string;
  logo: string;
  notch: boolean;
}

const VARIANTS: Record<string, Variant> = {
  dell: {
    al: ["#6A7282", "#4B5262", "#353B48"], alv: ["#5E6676", "#343A46"], rim: "#8C95A5", scr: ["#1E5AA8", "#0B1B38"],
    wall: '<path d="M100 172 L300 64 L300 172z" fill="#3D7BD6" opacity=".38"/><path d="M160 172 L300 104 L300 172z" fill="#7FB0F0" opacity=".25"/>',
    logo: '<circle cx="200" cy="145" r="15" fill="none" stroke="#8C95A5" stroke-width="2"/>', notch: false,
  },
  mac: {
    al: ["#F1F3F7", "#D8DDE5", "#BEC5D0"], alv: ["#E8EBF0", "#AEB6C2"], rim: "#A9B1BE", scr: ["#5B3F94", "#170F33"],
    wall: '<path d="M100 132 Q160 92 220 124 T300 108 L300 172 L100 172z" fill="#C06FD8" opacity=".4"/><path d="M100 152 Q170 122 230 146 T300 138 L300 172 L100 172z" fill="#F29BC4" opacity=".3"/>',
    logo: '<rect x="191" y="136" width="18" height="18" rx="6" fill="#C9CFD8" stroke="#AEB6C2"/>', notch: true,
  },
  hp: {
    al: ["#D3DAE4", "#AEB8C7", "#8E99AB"], alv: ["#C8D0DB", "#8792A4"], rim: "#8E99AB", scr: ["#0E6F7A", "#082129"],
    wall: '<circle cx="252" cy="150" r="62" fill="#2FB5A8" opacity=".32"/><circle cx="150" cy="80" r="34" fill="#6FE0D2" opacity=".18"/>',
    logo: '<circle cx="200" cy="145" r="14" fill="#C2CAD6" stroke="#8E99AB" stroke-width="1.2"/><path d="M194 150l4-10M200 150l4-10" stroke="#8E99AB" stroke-width="1.6" stroke-linecap="round"/>', notch: false,
  },
};

const bg = (v: Variant) => `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1F4FA"/><stop offset="1" stop-color="#DDE3EE"/></linearGradient>
<linearGradient id="al" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${v.al[0]}"/><stop offset=".55" stop-color="${v.al[1]}"/><stop offset="1" stop-color="${v.al[2]}"/></linearGradient>
<linearGradient id="alv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${v.alv[0]}"/><stop offset="1" stop-color="${v.alv[1]}"/></linearGradient>
<linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${v.scr[0]}"/><stop offset="1" stop-color="${v.scr[1]}"/></linearGradient>
<radialGradient id="sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#1B2438" stop-opacity=".28"/><stop offset="1" stop-color="#1B2438" stop-opacity="0"/></radialGradient>
<clipPath id="sc"><rect x="100" y="40" width="200" height="132" rx="2"/></clipPath>
</defs><rect width="400" height="300" fill="url(#bg)"/>`;

function keys(x0: number, y0: number, w: number, h: number, cols: number, rows: number, gap: number, fill: string) {
  let s = "";
  const kw = (w - gap * (cols + 1)) / cols, kh = (h - gap * (rows + 1)) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (x0 + gap + c * (kw + gap)).toFixed(1), y = (y0 + gap + r * (kh + gap)).toFixed(1);
      if (r === rows - 1 && c > 3 && c < cols - 4) {
        if (c === 4) s += `<rect x="${x}" y="${y}" width="${(kw * (cols - 8) + gap * (cols - 9)).toFixed(1)}" height="${kh.toFixed(1)}" rx="1.6" fill="${fill}"/>`;
        continue;
      }
      s += `<rect x="${x}" y="${y}" width="${kw.toFixed(1)}" height="${kh.toFixed(1)}" rx="1.6" fill="${fill}"/>`;
    }
  }
  return s;
}
const dots = (x: number, y: number, cols: number, rows: number, step: number) => {
  let s = "";
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) s += `<circle cx="${x + c * step}" cy="${y + r * step}" r=".9" fill="#8F98A8"/>`;
  return s;
};
const side = (right: boolean) => `<ellipse cx="200" cy="172" rx="175" ry="10" fill="url(#sh)"/>
<rect x="40" y="128" width="320" height="34" rx="7" fill="url(#alv)"/>
<line x1="44" y1="145" x2="356" y2="145" stroke="#8F98A8" stroke-width="1.2"/>
<rect x="40" y="128" width="320" height="4" rx="2" fill="#fff" opacity=".45"/>
${right ? '<rect x="290" y="149" width="17" height="7" rx="1" fill="#283040"/><path d="M254 149h22l-2 7h-18z" fill="#283040"/><circle cx="238" cy="152.5" r="3" fill="none" stroke="#283040" stroke-width="1.6"/>'
    : '<rect x="92" y="149" width="17" height="7" rx="1" fill="#283040"/><rect x="120" y="150" width="13" height="5" rx="2.5" fill="#283040"/><rect x="141" y="150" width="13" height="5" rx="2.5" fill="#283040"/><circle cx="166" cy="152.5" r="2.6" fill="#283040"/>'}
<rect x="62" y="162" width="20" height="3" rx="1.5" fill="#4E5666"/><rect x="318" y="162" width="20" height="3" rx="1.5" fill="#4E5666"/>`;

const VIEWS: Record<Angle, (v: Variant) => string> = {
  Front: (v) => `<ellipse cx="200" cy="232" rx="170" ry="16" fill="url(#sh)"/>
<rect x="92" y="30" width="216" height="152" rx="9" fill="#232A38"/>
<rect x="100" y="40" width="200" height="132" rx="2" fill="url(#scr)"/>
<g clip-path="url(#sc)">${v.wall}</g>
<polygon points="100,40 190,40 120,172 100,172" fill="#fff" opacity=".05"/>
${v.notch ? '<rect x="186" y="40" width="28" height="6" rx="2" fill="#232A38"/>' : '<circle cx="200" cy="35" r="1.6" fill="#4A556A"/>'}
<rect x="98" y="181" width="204" height="6" rx="2" fill="${v.rim}"/>
<polygon points="72,187 328,187 354,217 46,217" fill="url(#alv)"/>
<polygon points="98,190 302,190 314,204 86,204" fill="#2C3443"/>
<polygon points="170,206 230,206 233,214 167,214" fill="#fff" opacity=".35"/>
<rect x="46" y="216" width="308" height="7" rx="3.5" fill="${v.rim}"/>`,
  Back: (v) => `<ellipse cx="200" cy="258" rx="150" ry="14" fill="url(#sh)"/>
<rect x="70" y="40" width="260" height="210" rx="14" fill="url(#al)"/>
<rect x="71.5" y="41.5" width="257" height="207" rx="13" fill="none" stroke="#fff" stroke-opacity=".5"/>
<polygon points="70,40 190,40 90,250 70,250" fill="#fff" opacity=".08"/>
${v.logo}
<rect x="92" y="238" width="216" height="8" rx="3" fill="${v.rim}"/>`,
  Left: () => side(false),
  Right: () => side(true),
  Top: () => `<ellipse cx="200" cy="266" rx="160" ry="12" fill="url(#sh)"/>
<rect x="60" y="44" width="280" height="26" rx="6" fill="#2A3242"/>
<rect x="60" y="66" width="280" height="194" rx="10" fill="url(#al)"/>
<rect x="84" y="84" width="232" height="98" rx="4" fill="#27303E"/>
${keys(84, 84, 232, 98, 14, 6, 2.4, "#3A4456")}
<rect x="160" y="194" width="80" height="54" rx="5" fill="#fff" opacity=".28" stroke="#fff" stroke-opacity=".4"/>
${dots(68, 90, 2, 16, 5)}${dots(327, 90, 2, 16, 5)}`,
  Bottom: (v) => `<ellipse cx="200" cy="266" rx="160" ry="12" fill="url(#sh)"/>
<rect x="60" y="40" width="280" height="220" rx="14" fill="url(#al)"/>
<ellipse cx="86" cy="62" rx="12" ry="6" fill="#3A414E"/><ellipse cx="314" cy="62" rx="12" ry="6" fill="#3A414E"/>
<ellipse cx="86" cy="238" rx="12" ry="6" fill="#3A414E"/><ellipse cx="314" cy="238" rx="12" ry="6" fill="#3A414E"/>
${Array.from({ length: 9 }, (_, i) => `<rect x="${152 + i * 11}" y="84" width="5" height="44" rx="2.5" fill="${v.rim}"/>`).join("")}
${[[74, 150], [326, 150], [200, 50], [200, 250]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#9CA4B2" stroke="#7D8696"/>`).join("")}
<rect x="170" y="196" width="60" height="28" rx="3" fill="#EEF1F6"/>
<rect x="176" y="203" width="36" height="2.5" fill="#B7BECA"/><rect x="176" y="209" width="46" height="2.5" fill="#B7BECA"/><rect x="176" y="215" width="28" height="2.5" fill="#B7BECA"/>`,
};

const cache: Record<string, string> = {};
export function renderSrc(angle: Angle, variant = "hp") {
  const key = angle + "|" + variant;
  if (!cache[key]) {
    const v = VARIANTS[variant] || VARIANTS.hp;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">${bg(v)}${VIEWS[angle](v)}</svg>`;
    cache[key] = "data:image/svg+xml," + encodeURIComponent(svg);
  }
  return cache[key];
}

export interface MarkPath {
  d: string;
  stroke: string;
  sw: number;
  fill: string;
  o: number;
}

// Marks drawn on top of a photo, in the same 400 x 300 space.
export function markPaths(d: Defect): MarkPath[] {
  const box = d.box!;
  const x = box.x * 4, y = box.y * 3, w = box.w * 4, h = box.h * 3;
  const P = (fx: number, fy: number) => `${(x + w * fx).toFixed(1)} ${(y + h * fy).toFixed(1)}`;
  if (d.type === "Scratch") {
    const a = `M${P(0.08, 0.66)} Q${P(0.5, 0.4)} ${P(0.92, 0.3)}`;
    const b = `M${P(0.3, 0.7)} Q${P(0.55, 0.56)} ${P(0.74, 0.5)}`;
    return [
      { d: a, stroke: "#2A3345", sw: 1.8, fill: "none", o: 0.28 },
      { d: a, stroke: "#FFFFFF", sw: 1.1, fill: "none", o: 0.95 },
      { d: b, stroke: "#FFFFFF", sw: 0.7, fill: "none", o: 0.7 },
    ];
  }
  if (d.type === "Dent") {
    const cx = x + w / 2, cy = y + h / 2, rx = w * 0.4, ry = h * 0.36;
    const ell = (k: number, dx = 0, dy = 0) => {
      const a = rx * k, b = ry * k, px = cx + dx, py = cy + dy;
      return `M${(px - a).toFixed(1)} ${py.toFixed(1)}a${a.toFixed(1)} ${b.toFixed(1)} 0 1 0 ${(a * 2).toFixed(1)} 0a${a.toFixed(1)} ${b.toFixed(1)} 0 1 0 ${(-a * 2).toFixed(1)} 0z`;
    };
    const hi = `M${(cx - rx * 0.2).toFixed(1)} ${(cy + ry * 0.95).toFixed(1)}A${rx.toFixed(1)} ${ry.toFixed(1)} 0 0 0 ${(cx + rx * 0.95).toFixed(1)} ${(cy + ry * 0.2).toFixed(1)}`;
    return [
      { d: ell(1), stroke: "none", sw: 0, fill: "#1B2438", o: 0.1 },
      { d: ell(0.74, -rx * 0.06, -ry * 0.06), stroke: "none", sw: 0, fill: "#1B2438", o: 0.13 },
      { d: ell(0.46, -rx * 0.12, -ry * 0.12), stroke: "none", sw: 0, fill: "#1B2438", o: 0.18 },
      { d: hi, stroke: "#FFFFFF", sw: 1.4, fill: "none", o: 0.75 },
    ];
  }
  const main = `M${P(0.92, 0.04)} L${P(0.74, 0.26)} L${P(0.79, 0.38)} L${P(0.52, 0.6)} L${P(0.57, 0.72)} L${P(0.22, 0.96)}`;
  const br = `M${P(0.74, 0.26)} L${P(0.54, 0.2)} L${P(0.4, 0.27)} M${P(0.52, 0.6)} L${P(0.68, 0.82)}`;
  return [
    { d: main, stroke: "#FFFFFF", sw: 2.2, fill: "none", o: 0.55 },
    { d: main, stroke: "#141B2B", sw: 1.3, fill: "none", o: 0.95 },
    { d: br, stroke: "#141B2B", sw: 0.9, fill: "none", o: 0.85 },
  ];
}
