"use client";

import { Cpu, Hand } from "lucide-react";

type Mode = "Automatic" | "Assisted";

const TESTS: [string, Mode][] = [
  ["Audio Playback Test", "Automatic"],
  ["Battery Health Test", "Automatic"],
  ["Internet Test", "Automatic"],
  ["Wireless Test", "Automatic"],
  ["Bluetooth Test", "Automatic"],
  ["Camera Photo Test", "Automatic"],
  ["Camera Video Test", "Automatic"],
  ["Fan Test", "Automatic"],
  ["CPU Test", "Automatic"],
  ["RAM Test", "Automatic"],
  ["Motherboard Test", "Automatic"],
  ["PCI Express Test", "Automatic"],
  ["Storage Test", "Automatic"],
  ["Graphic Card Test", "Automatic"],
  ["GPU Test", "Automatic"],
  ["Charger Test", "Assisted"],
  ["Inbuild Speaker Test", "Assisted"],
  ["Inbuild Microphone Test", "Assisted"],
  ["Touchpad Test", "Assisted"],
  ["Keyboard Test", "Assisted"],
  ["Wired Ethernet Test", "Assisted"],
  ["USB Port Test", "Assisted"],
  ["Optical Disk Drive Test", "Assisted"],
  ["SD Card Slot Test", "Assisted"],
  ["Display Test", "Assisted"],
  ["Display Brightness Test", "Assisted"],
  ["Fingerprint Test", "Assisted"],
  ["TPM Test", "Automatic"],
  ["VGA Port Test", "Assisted"],
  ["HDMI Port Test", "Assisted"],
  ["Battery Charging Test", "Assisted"],
  ["Battery Discharging Test", "Assisted"],
  ["Realtime Clock Test", "Automatic"],
  ["Win Activation Test", "Automatic"],
  ["Battery Stress Test", "Automatic"],
];

export default function TestParameters() {
  const auto = TESTS.filter(([, m]) => m === "Automatic").length;
  return (
    <section id="test-parameters" className="relative bg-white px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-[1450px]">
        <div className="max-w-[850px]">
          <span className="inline-flex rounded-full bg-[#EAF2FF] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#0052CC]">
            Test Parameters
          </span>
          <h2 className="mt-4 text-[16px] font-bold leading-[1.1] tracking-[-0.03em] text-[#10244A] sm:text-[20px] lg:text-[24px]">
            {TESTS.length} functional tests, <span className="text-[#126BEE]">one report</span>
          </h2>
          <p className="mt-4 max-w-[720px] text-[15px] leading-7 text-[#65728D]">
            {auto} run automatically and {TESTS.length - auto} are assisted by the operator. Every laptop goes through the same checks.
          </p>
        </div>

        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TESTS.map(([name, mode], i) => (
            <li key={name} className="flex items-center gap-3 rounded-[14px] border border-[#DCE6F4] bg-[#F8FAFD] px-4 py-3">
              <span className="w-7 shrink-0 font-mono text-xs font-semibold text-[#5F6A86]">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#17284D]">{name}</span>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  mode === "Automatic" ? "bg-[#EAF2FF] text-[#0052CC]" : "bg-[#FFF1EC] text-[#B93A08]"
                }`}
              >
                {mode === "Automatic" ? <Cpu size={12} /> : <Hand size={12} />}
                {mode}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
