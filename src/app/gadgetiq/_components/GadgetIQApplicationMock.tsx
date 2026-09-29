"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Activity,
  Asterisk,
  BatteryCharging,
  Bluetooth,
  Camera,
  Check,
  CheckCircle2,
  CirclePlay,
  CircuitBoard,
  Cpu,
  CreditCard,
  Disc3,
  Fan,
  Gauge,
  HardDrive,
  Info,
  Keyboard,
  KeyRound,
  Loader2,
  MemoryStick,
  Monitor,
  MonitorCheck,
  MousePointer2,
  Network,
  Play,
  QrCode,
  ShieldCheck,
  Slash,
  Usb,
  Volume2,
  Waves,
  Wifi,
} from "lucide-react";

/* =========================================================
   This is the heavy, purely decorative "fake app" mockup
   shown inside the hero's laptop screen. It is loaded via a
   client-only dynamic import (see DiagnosticsHero.tsx) so
   its large bundle never blocks the hero headline/CTA from
   painting immediately on first load.
========================================================= */

/* =========================================================
   TEST TYPES
========================================================= */

type DiagnosticStatus = "passed" | "running" | "queued";

type DiagnosticTest = {
  device: string;
  test: string;
  icon: React.ElementType;
};

/* =========================================================
   FULL 35 TEST SUITE
========================================================= */

const DIAGNOSTIC_TESTS: DiagnosticTest[] = [
  {
    device: "Speaker",
    test: "Audio Playback Test",
    icon: Volume2,
  },
  {
    device: "Battery",
    test: "Battery Health Test",
    icon: BatteryCharging,
  },
  {
    device: "Internet Connectivity",
    test: "Internet Test",
    icon: Network,
  },
  {
    device: "Wireless",
    test: "Wireless Test",
    icon: Wifi,
  },
  {
    device: "Bluetooth",
    test: "Bluetooth Test",
    icon: Bluetooth,
  },
  {
    device: "Camera",
    test: "Camera Photo Test",
    icon: Camera,
  },
  {
    device: "Camera",
    test: "Camera Video Test",
    icon: Camera,
  },
  {
    device: "Cooling Fan",
    test: "Fan Test",
    icon: Fan,
  },
  {
    device: "Processor",
    test: "CPU Test",
    icon: Cpu,
  },
  {
    device: "Memory",
    test: "RAM Test",
    icon: MemoryStick,
  },
  {
    device: "Motherboard",
    test: "Motherboard Test",
    icon: CircuitBoard,
  },
  {
    device: "PCI Express",
    test: "PCI Express Test",
    icon: CircuitBoard,
  },
  {
    device: "Storage",
    test: "Storage Test",
    icon: HardDrive,
  },
  {
    device: "Graphics Card",
    test: "Graphic Card Test",
    icon: Gauge,
  },
  {
    device: "GPU",
    test: "GPU Test",
    icon: Gauge,
  },
  {
    device: "Charger",
    test: "Charger Test",
    icon: BatteryCharging,
  },
  {
    device: "Speaker",
    test: "Inbuild Speaker Test",
    icon: Volume2,
  },
  {
    device: "Microphone",
    test: "Inbuild Microphone Test",
    icon: Activity,
  },
  {
    device: "Touchpad",
    test: "Touchpad Test",
    icon: MousePointer2,
  },
  {
    device: "Keyboard",
    test: "Keyboard Test",
    icon: Keyboard,
  },
  {
    device: "Wired Ethernet",
    test: "Wired Ethernet Test",
    icon: Network,
  },
  {
    device: "USB Ports",
    test: "USB Port Test",
    icon: Usb,
  },
  {
    device: "Optical Disk Drive",
    test: "Optical Disk Drive Test",
    icon: Disc3,
  },
  {
    device: "SD Card Slot",
    test: "SD Card Slot Test",
    icon: CreditCard,
  },
  {
    device: "Display",
    test: "Display Test",
    icon: MonitorCheck,
  },
  {
    device: "Display",
    test: "Display Brightness Test",
    icon: MonitorCheck,
  },
  {
    device: "Fingerprint Reader",
    test: "Fingerprint Test",
    icon: ShieldCheck,
  },
  {
    device: "TPM Security Chip",
    test: "TPM Test",
    icon: ShieldCheck,
  },
  {
    device: "VGA Port",
    test: "VGA Port Test",
    icon: Monitor,
  },
  {
    device: "HDMI Port",
    test: "HDMI Port Test",
    icon: Monitor,
  },
  {
    device: "Battery",
    test: "Battery Charging Test",
    icon: BatteryCharging,
  },
  {
    device: "Battery",
    test: "Battery Discharging Test",
    icon: BatteryCharging,
  },
  {
    device: "Realtime Clock",
    test: "Realtime Clock Test",
    icon: Info,
  },
  {
    device: "Windows Activation",
    test: "Win Activation Test",
    icon: KeyRound,
  },
  {
    device: "Battery Stress",
    test: "Battery Stress Test",
    icon: BatteryCharging,
  },
];

const TOTAL_TESTS = DIAGNOSTIC_TESTS.length;

const TEST_INTERVAL = 110;

const VISIBLE_ROWS = 6;

/* =========================================================
   GADGET IQ APPLICATION
========================================================= */

type AppPhase = "running" | "detect" | "certificate";

export default function GadgetIQApplication() {
  const [completedTests, setCompletedTests] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<AppPhase>("running");

  const isFinished = completedTests >= TOTAL_TESTS;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (phase === "running") {
      if (isFinished) {
        timer = setTimeout(() => setPhase("detect"), 1800);
      } else {
        timer = setTimeout(() => {
          setCompletedTests((value) =>
            Math.min(value + 1, TOTAL_TESTS)
          );
        }, TEST_INTERVAL);
      }
    } else if (phase === "detect") {
      timer = setTimeout(() => setPhase("certificate"), 2400);
    } else {
      timer = setTimeout(() => {
        setCompletedTests(0);
        setCycle((value) => value + 1);
        setPhase("running");
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [completedTests, isFinished, phase]);

  const progress = (completedTests / TOTAL_TESTS) * 100;

  const activeIndex =
    completedTests >= TOTAL_TESTS
      ? TOTAL_TESTS - 1
      : Math.max(completedTests, 0);

  const visibleStart = Math.min(
    Math.max(activeIndex - 2, 0),
    TOTAL_TESTS - VISIBLE_ROWS
  );

  const visibleTests = DIAGNOSTIC_TESTS.slice(
    visibleStart,
    visibleStart + VISIBLE_ROWS
  );

  if (phase === "detect") {
    return <DetectIssuesScreen />;
  }

  if (phase === "certificate") {
    return (
      <CertificateDocument
        certificateId="XCFB589177"
        deviceName="Precision X-11"
        deviceType="Notebook"
        manufacturer="Precision"
        serial="XC-90210"
        model="X-11"
        issuedDate="07 Aug 2026"
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F5F7FB]">
      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div className="flex h-[42px] shrink-0 items-center justify-between border-b border-[#DCE2EA] bg-white px-4">
        {/* LOGO */}
        <div className="flex shrink-0 items-center">
          <span className="text-[17px] font-black tracking-[-0.05em] text-[#111]">
            Gadget
          </span>

          <span className="text-[17px] font-black tracking-[-0.05em] text-[#0875F7]">
            IQ
          </span>
        </div>

        {/* USER INFORMATION */}
        <div className="flex items-center gap-2.5 whitespace-nowrap text-[7px] font-semibold text-[#26344B]">
          <span>
            Welcome <strong>Gaurav3728</strong>
          </span>

          <Separator />

          <span>07-Aug-2026</span>

          <Separator />

          <span className="flex items-center gap-1">
            Licenses: 108
            <span className="group relative inline-flex">
              <button
                type="button"
                tabIndex={0}
                title="What is a license? Each license lets you run diagnostics on one device."
                className="flex h-3.5 w-3.5 shrink-0 cursor-help items-center justify-center rounded-full border border-[#C7D0DC] text-[#8A93A6] hover:border-[#0875F7] hover:text-[#0875F7]"
              >
                <Info size={9} />
              </button>
              <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1.5 w-44 -translate-x-1/2 rounded-lg bg-[#17233A] px-2.5 py-1.5 text-[9px] font-medium normal-case leading-snug text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                A license lets you run diagnostics on one device. More licenses let your team test more devices at once.
              </span>
            </span>
          </span>

          <Separator />

          <span className="flex items-center gap-1">
            Internet:
            <strong className="text-[#13A844]">Online</strong>

            <span className="h-[5px] w-[5px] rounded-full bg-[#16BE4B]" />
          </span>
        </div>
      </div>

      {/* =====================================================
          DEVICE INFORMATION
      ===================================================== */}

      <div className="flex h-[32px] shrink-0 items-center gap-5 border-b border-[#DDE2EA] bg-[#FBFCFE] px-4 text-[7.5px] font-medium text-[#33415A]">
        <span>
          <strong>System:</strong> Laptop
        </span>

        <span>
          <strong>Manufacturer:</strong> Precision
        </span>

        <span>
          <strong>Model:</strong> X-11
        </span>

        <span>
          <strong>Serial:</strong> XC-90210
        </span>
      </div>

      {/* =====================================================
          BODY
      ===================================================== */}

      <div className="min-h-0 flex-1 p-[10px]">
        <div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_190px] gap-[10px]">
          {/* =================================================
              LEFT TABLE
          ================================================= */}

          <div className="flex min-h-0 flex-col overflow-hidden rounded-[8px] border border-[#D7DEE8] bg-white shadow-[0_4px_12px_rgba(38,55,80,0.04)]">
            {/* TABS */}

            <div className="flex h-[39px] shrink-0 border-b border-[#DCE2EA]">
              <div className="flex w-[155px] items-center justify-center gap-[6px] border-b-[2px] border-[#0875F7] bg-[#F9FCFF] text-[9px] font-bold text-[#172239]">
                <Activity
                  size={12}
                  strokeWidth={2.3}
                  className="text-[#0875F7]"
                />

                Diagnostics
              </div>

              <div className="flex w-[165px] items-center justify-center gap-[6px] border-l border-[#E2E6ED] text-[9px] font-semibold text-[#596982]">
                <Info size={12} />
                System Information
              </div>
            </div>

            {/* TABLE HEADER */}

            <div className="grid h-[31px] shrink-0 grid-cols-[28px_1.05fr_1.45fr_72px_76px_28px] items-center border-b border-[#D9DEE6] bg-[#F0F2F5] px-[8px] text-[7.5px] font-bold text-[#29364B]">
              <span className="text-center">#</span>

              <span>Device</span>

              <span>Test Name</span>

              <span>Tested On</span>

              <span className="text-center">
                Result
              </span>

              <span className="text-center">
                Run
              </span>
            </div>

            {/* ROWS */}

            <div className="min-h-0 flex-1">
              {visibleTests.map((test, localIndex) => {
                const absoluteIndex =
                  visibleStart + localIndex;

                let status: DiagnosticStatus;

                if (
                  isFinished ||
                  absoluteIndex < completedTests
                ) {
                  status = "passed";
                } else if (
                  absoluteIndex === completedTests
                ) {
                  status = "running";
                } else {
                  status = "queued";
                }

                return (
                  <DiagnosticRow
                    key={`${cycle}-${absoluteIndex}`}
                    test={test}
                    number={absoluteIndex + 1}
                    status={status}
                  />
                );
              })}
            </div>
          </div>

          {/* =================================================
              RIGHT PANEL
          ================================================= */}

          <div className="flex min-h-0 flex-col rounded-[8px] border border-[#D7DEE8] bg-white p-[11px] shadow-[0_4px_12px_rgba(38,55,80,0.04)]">
            {/* CERTIFICATE */}

            <div className="border-b border-[#E3E8EF] pb-[7px]">
              <div className="flex items-center gap-[7px]">
                <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] bg-[#EBF4FF]">
                  <ShieldCheck
                    size={16}
                    className="text-[#0875F7]"
                  />
                </div>

                <div>
                  <p className="text-[7px] font-medium text-[#7A879A]">
                    Certificate
                  </p>

                  <p className="text-[9px] font-bold text-[#1F2D43]">
                    XC2C45920E
                  </p>
                </div>
              </div>
            </div>

            {/* RESULT */}

            <div className="mt-[8px]">
              <p className="text-[7px] font-semibold text-[#657289]">
                Test Result
              </p>

              <div className="mt-[3px] flex items-center gap-[5px]">
                {!isFinished ? (
                  <>
                    <span className="relative flex h-[7px] w-[7px]">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0875F7]/40" />

                      <span className="relative h-[7px] w-[7px] rounded-full bg-[#0875F7]" />
                    </span>

                    <p className="text-[10px] font-bold text-[#17233A]">
                      Testing in Progress
                    </p>
                  </>
                ) : (
                  <>
                    <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[#DDF5E5]">
                      <Check
                        size={9}
                        strokeWidth={3}
                        className="text-[#159447]"
                      />
                    </span>

                    <p className="text-[10px] font-bold text-[#159447]">
                      All Tests Passed
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* LARGE COUNTER */}

            <div className="mt-[10px] rounded-[9px] border border-[#DFE9F7] bg-[#F7FAFF] px-[10px] py-[9px]">
              <div className="flex items-center justify-between">
                <p className="text-[7px] font-bold text-[#66758B]">
                  Diagnostic Tests
                </p>

                {!isFinished && (
                  <Loader2
                    size={13}
                    className="animate-spin text-[#0875F7]"
                  />
                )}
              </div>

              <div className="mt-[4px] flex items-end">
                <span className="tabular-nums text-[24px] font-black leading-none tracking-[-0.04em] text-[#0875F7]">
                  {completedTests}
                </span>

                <span className="mb-[2px] ml-[3px] text-[9px] font-bold text-[#7D8AA0]">
                  / {TOTAL_TESTS}
                </span>
              </div>

              {/* PROGRESS BAR */}

              <div className="relative mt-[8px] h-[5px] overflow-hidden rounded-full bg-[#E1EAF5]">
                <div
                  className={`relative h-full rounded-full transition-[width] duration-200 ${
                    isFinished
                      ? "bg-[#22B263]"
                      : "bg-gradient-to-r from-[#0875F7] to-[#46A4FF]"
                  }`}
                  style={{
                    width: `${progress}%`,
                  }}
                >
                  {!isFinished && (
                    <span className="diagnostic-progress-shine absolute inset-y-0 w-[22px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  )}
                </div>
              </div>

              <div className="mt-[5px] flex items-center justify-between">
                <span className="text-[6.5px] font-medium text-[#7C899C]">
                  {isFinished
                    ? "Completed"
                    : "Running diagnostics"}
                </span>

                <span className="text-[7px] font-bold text-[#0875F7]">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* CURRENT TEST */}

            <div className="mt-[8px] rounded-[7px] bg-[#EEF6FF] px-[9px] py-[7px]">
              <p className="text-[6.5px] font-semibold text-[#718098]">
                Currently Testing
              </p>

              <div className="mt-[4px] flex items-center gap-[5px]">
                {!isFinished ? (
                  <>
                    <span className="relative flex h-[6px] w-[6px] shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0875F7]/50" />

                      <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-[#0875F7]" />
                    </span>

                    <p className="truncate text-[8px] font-bold text-[#0875F7]">
                      {
                        DIAGNOSTIC_TESTS[
                          Math.min(
                            completedTests,
                            TOTAL_TESTS - 1
                          )
                        ].test
                      }
                    </p>
                  </>
                ) : (
                  <>
                    <Check
                      size={9}
                      strokeWidth={3}
                      className="text-[#149447]"
                    />

                    <p className="text-[8px] font-bold text-[#149447]">
                      Diagnostics Complete
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* RUN BUTTON */}

            <button
              type="button"
              className="mt-auto flex h-[31px] shrink-0 items-center justify-center gap-[6px] rounded-[6px] bg-[#0789F5] text-[7.5px] font-bold uppercase tracking-[0.02em] text-white shadow-[0_5px_12px_rgba(8,117,247,0.20)]"
            >
              <CirclePlay size={12} />

              {cycle === 0 ? "Run All Tests" : "Run All Tests Again"}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          HELP BAR
      ===================================================== */}

      <div className="mx-[10px] mb-[6px] flex h-[29px] shrink-0 items-center rounded-[5px] bg-[#DDEEFF] px-[12px]">
        <Info size={10} className="mr-[6px] shrink-0 text-[#0875F7]" />

        <p className="truncate text-[7.5px] font-medium text-[#42536B]">
          Help Needed? Run all tests or use the Play button to run
          individual diagnostics.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   CERTIFICATE DOCUMENT

   Replaces the entire app screen once every test has
   completed, presenting a formal quality-assurance
   certificate for the device before the scan
   automatically restarts.
========================================================= */

function CertificateDocument({
  certificateId,
  deviceName,
  deviceType,
  manufacturer,
  serial,
  model,
  issuedDate,
}: {
  certificateId: string;
  deviceName: string;
  deviceType: string;
  manufacturer: string;
  serial: string;
  model: string;
  issuedDate: string;
}) {
  return (
    <div className="diagnostic-certificate-pop flex h-full min-h-0 flex-col bg-white px-[16px] py-[13px]">
      {/* HEADER */}
      <div className="flex items-start justify-between border-b border-[#E3E8EF] pb-[9px]">
        <div>
          <span className="text-[13px] font-black tracking-[-0.03em] text-[#101A2C]">
            XTRA
            <span className="text-[#0875F7]">COVER</span>
          </span>

          <p className="mt-[2px] text-[6px] font-semibold uppercase tracking-[0.16em] text-[#8896AC]">
            Reuse. Extend. Save.
          </p>
        </div>

        <div className="flex items-center gap-[10px]">
          <div className="text-right">
            <p className="text-[6px] font-bold uppercase tracking-[0.12em] text-[#8896AC]">
              Certificate Number
            </p>

            <p className="text-[10px] font-bold text-[#17233A]">
              {certificateId}
            </p>

            <p className="text-[6px] font-medium text-[#8896AC]">
              Issued {issuedDate}
            </p>
          </div>

          <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[5px] border border-[#DCE3EE] bg-[#FAFBFD]">
            <QrCode size={17} strokeWidth={1.6} className="text-[#17233A]" />
          </div>
        </div>
      </div>

      {/* TITLE */}
      <div className="mt-[9px]">
        <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-[#0875F7]">
          Certificate of Quality Assurance
        </p>

        <h2 className="mt-[2px] text-[15px] font-black leading-tight text-[#101A2C]">
          {deviceName}
        </h2>

        <p className="mt-[2px] text-[6.5px] font-medium text-[#66748C]">
          {deviceType} &middot; {manufacturer} Computer Inc.
          <span className="mx-[6px] text-[#C3CEE6]">|</span>
          Serial {serial}
          <span className="mx-[6px] text-[#C3CEE6]">|</span>
          Model SKU {model}
        </p>
      </div>

      {/* PASS BANNER */}
      <div className="mt-[9px] flex items-center justify-between rounded-[8px] border border-[#BFE6CC] bg-[#EFFAF2] px-[11px] py-[7px]">
        <div className="flex items-center gap-[8px]">
          <span className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#1FA855]">
            <Check size={11} strokeWidth={3} className="text-white" />
          </span>

          <div>
            <p className="text-[10px] font-black leading-none text-[#137A3D]">
              PASS
            </p>

            <p className="mt-[2px] text-[6.5px] font-semibold text-[#3E6A50]">
              {TOTAL_TESTS} of {TOTAL_TESTS} applicable tests passed
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[6px] font-semibold text-[#3E6A50]">
            Assessed {issuedDate}
          </p>

          <p className="text-[6px] font-semibold text-[#3E6A50]">
            All mandatory criteria met
          </p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="mt-[9px] grid grid-cols-4 gap-[7px]">
        <CertificateStat
          label="Device Health"
          value="Excellent"
          sub="No faults detected"
          barColor="#1FA855"
        />

        <CertificateStat
          label="Battery Health"
          value="92%"
          sub="Good · 240 cycles"
          barColor="#0875F7"
        />

        <CertificateStat
          label="Tests Completed"
          value={`${TOTAL_TESTS}/${TOTAL_TESTS}`}
          sub="100% applicable"
          barColor="#0875F7"
        />

        <CertificateStat
          label="Refurb. Grade"
          value="A+"
          sub="Functional / Cosmetic"
          barColor="#8B5CF6"
        />
      </div>

      {/* KEY SPECIFICATIONS */}
      <div className="mt-[9px] rounded-[8px] border border-[#E3E8EF] bg-[#FAFBFD] p-[9px]">
        <p className="text-[6px] font-bold uppercase tracking-[0.14em] text-[#66748C]">
          Key Specifications
        </p>

        <div className="mt-[6px] grid grid-cols-3 gap-x-[8px] gap-y-[5px]">
          <CertificateSpec icon={Cpu} label="Processor" value="Core i7-1360P" />
          <CertificateSpec icon={Gauge} label="Graphics" value="Iris Xe (integrated)" />
          <CertificateSpec icon={MemoryStick} label="Memory" value="16 GB LPDDR5" />
          <CertificateSpec icon={Monitor} label="Display" value='14" FHD+ 60Hz' />
          <CertificateSpec icon={HardDrive} label="Storage" value="512 GB NVMe SSD" />
          <CertificateSpec icon={ShieldCheck} label="Operating System" value="Windows 11 Pro" />
        </div>
      </div>

      {/* CONDITION, GRADING & SANITIZATION */}
      <div className="mt-[9px] grid flex-1 grid-cols-2 gap-[9px]">
        <div className="rounded-[8px] border border-[#E3E8EF] p-[9px]">
          <p className="text-[6px] font-bold uppercase tracking-[0.14em] text-[#66748C]">
            Condition, Grading &amp; Score
          </p>

          <div className="mt-[6px] flex items-start gap-[6px]">
            <span className="text-[10px] font-black leading-none text-[#137A3D]">
              A
            </span>

            <p className="text-[6.5px] font-medium text-[#66748C]">
              <span className="font-bold text-[#1F2D43]">
                Functional grade
              </span>
              <br />
              All functional, no defects found
            </p>
          </div>

          <div className="mt-[6px] flex items-start gap-[6px]">
            <span className="text-[10px] font-black leading-none text-[#0875F7]">
              B
            </span>

            <p className="text-[6.5px] font-medium text-[#66748C]">
              <span className="font-bold text-[#1F2D43]">
                Cosmetic grade
              </span>
              <br />
              Light wear: no cracks, dents or marks
            </p>
          </div>
        </div>

        <div className="rounded-[8px] border border-[#E3E8EF] p-[9px]">
          <p className="text-[6px] font-bold uppercase tracking-[0.14em] text-[#66748C]">
            Data Sanitization &amp; Warranty
          </p>

          <div className="mt-[6px] flex items-center justify-between">
            <p className="text-[6.5px] font-medium text-[#66748C]">
              NIST SP 800-88 Purge, verified
            </p>

            <span className="flex items-center gap-[3px] text-[6px] font-bold text-[#137A3D]">
              <Check size={7} strokeWidth={3} />
              PASS
            </span>
          </div>

          <div className="mt-[6px] flex items-center justify-between">
            <p className="text-[6.5px] font-medium text-[#66748C]">
              12 months, expires 27 Jun 2027
            </p>

            <span className="flex items-center gap-[3px] text-[6px] font-bold text-[#137A3D]">
              <Check size={7} strokeWidth={3} />
              PASS
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <p className="mt-[8px] border-t border-[#E3E8EF] pt-[6px] text-[5.5px] font-medium text-[#8896AC]">
        Ensure certificate {certificateId} matches the device before relying on
        this record.
      </p>
    </div>
  );
}

function CertificateStat({
  label,
  value,
  sub,
  barColor,
}: {
  label: string;
  value: string;
  sub: string;
  barColor: string;
}) {
  return (
    <div className="overflow-hidden rounded-[7px] border border-[#E3E8EF]">
      <div className="h-[3px]" style={{ backgroundColor: barColor }} />

      <div className="px-[8px] py-[6px]">
        <p className="text-[6px] font-bold uppercase tracking-[0.06em] text-[#8896AC]">
          {label}
        </p>

        <p className="mt-[2px] text-[11px] font-black leading-none text-[#101A2C]">
          {value}
        </p>

        <p className="mt-[3px] text-[6px] font-medium text-[#8896AC]">
          {sub}
        </p>
      </div>
    </div>
  );
}

function CertificateSpec({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-[6px]">
      <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[4px] bg-[#EAF0FB] text-[#0875F7]">
        <Icon size={9} strokeWidth={2.2} />
      </span>

      <div className="min-w-0">
        <p className="truncate text-[5.5px] font-semibold uppercase tracking-[0.04em] text-[#8896AC]">
          {label}
        </p>

        <p className="truncate text-[7px] font-bold text-[#1F2D43]">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   DETECT ISSUES SCREEN

   Shown right after the diagnostic run finishes, before the
   pass certificate - a glimpse of the AI cosmetic-defect
   detection pass across a photo of the device.
========================================================= */

const DETECT_DEFECTS = [
  { label: "Crack", color: "#EF4444" },
  { label: "Dent", color: "#10B981" },
  { label: "Scratch", color: "#F59E0B" },
  { label: "Scuff", color: "#3B82F6" },
];

const DETECT_MARKERS = [
  { x: 30, y: 33, tag: { x: 28, y: 17 }, Icon: Slash },
  { x: 68, y: 30, tag: { x: 70, y: 15 }, Icon: Asterisk },
  { x: 28, y: 56, tag: { x: 27, y: 67 }, Icon: Asterisk },
  { x: 70, y: 72, tag: { x: 71, y: 82 }, Icon: Waves },
];

function DetectIssuesScreen() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((value) =>
        value >= DETECT_DEFECTS.length ? value : value + 1
      );
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const isComplete = count >= DETECT_DEFECTS.length;

  return (
    <div className="diagnostic-certificate-pop flex h-full min-h-0 flex-col gap-[10px] bg-white px-[16px] py-[13px]">
      {/* HEADER */}
      <div className="flex items-center gap-[8px] border-b border-[#E3E8EF] pb-[9px]">
        <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-extrabold text-white shadow-[0_6px_14px_rgba(79,70,229,0.35)]">
          2
        </span>

        <div className="min-w-0">
          <p className="text-[14px] font-black leading-tight text-[#101A2C]">
            AI Detects Issues
          </p>

          <p className="truncate text-[9.5px] font-medium text-[#66748C]">
            AI-powered image recognition identifies visible defects.
          </p>
        </div>
      </div>

      {/* VISUAL */}
      <div className="relative flex-1 overflow-hidden rounded-[12px] bg-[#EEF1F8]">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(79,70,229,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,0.06) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <span className="absolute left-[8px] top-[8px] z-10 flex items-center gap-[5px] rounded-[6px] bg-[#0B1220]/85 px-[9px] py-[5px] text-[9.5px] font-bold text-white">
          {isComplete ? (
            <>
              <CheckCircle2 size={11} className="text-emerald-400" />
              Complete
            </>
          ) : (
            <>
              <span className="h-[5px] w-[5px] animate-pulse rounded-full bg-indigo-400" />
              Scanning
            </>
          )}
        </span>

        <span className="absolute right-[8px] top-[8px] z-10 rounded-[6px] bg-[#0B1220]/85 px-[9px] py-[5px] text-[9.5px] font-bold text-white">
          {count} Found
        </span>

        {/* LAPTOP IMAGE */}
        <div
          className="absolute overflow-hidden"
          style={{ left: "18%", top: "14%", width: "64%", height: "70%" }}
        >
          <Image
            src="/images/dent-laptop.png"
            alt="Laptop with detected cosmetic issues"
            fill
            sizes="320px"
            className="object-contain"
          />

          {!isComplete && (
            <span className="detect-scan-line pointer-events-none absolute left-0 top-[8%] h-[2px] w-full bg-indigo-400 shadow-[0_0_8px_2px_rgba(129,140,248,0.7)]" />
          )}
        </div>

        {/* CONNECTOR LINES */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          {DETECT_DEFECTS.map((defect, idx) => {
            const marker = DETECT_MARKERS[idx];
            const active = idx < count;

            return (
              <line
                key={defect.label}
                x1={marker.x}
                y1={marker.y}
                x2={marker.tag.x}
                y2={marker.tag.y}
                stroke={defect.color}
                strokeWidth={1.25}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className={`transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
              />
            );
          })}
        </svg>

        {/* MARKERS */}
        {DETECT_DEFECTS.map((defect, idx) => {
          const marker = DETECT_MARKERS[idx];
          const Icon = marker.Icon;
          const active = idx < count;

          return (
            <span
              key={defect.label}
              className={`pointer-events-none absolute flex h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] bg-white/90 shadow-sm transition-all duration-300 ${
                active ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
              style={{ left: `${marker.x}%`, top: `${marker.y}%`, borderColor: defect.color }}
            >
              <Icon size={9} strokeWidth={2.4} style={{ color: defect.color }} />
            </span>
          );
        })}

        {/* TAGS */}
        {DETECT_DEFECTS.map((defect, idx) => {
          const marker = DETECT_MARKERS[idx];
          const active = idx < count;

          return (
            <span
              key={defect.label}
              className={`pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-[10px] py-[4px] text-[9.5px] font-bold text-white shadow-md transition-all duration-300 ${
                active ? "scale-100 opacity-100" : "scale-90 opacity-0"
              }`}
              style={{ left: `${marker.tag.x}%`, top: `${marker.tag.y}%`, backgroundColor: defect.color }}
            >
              {defect.label} detected
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   DIAGNOSTIC ROW
========================================================= */

function DiagnosticRow({
  test,
  number,
  status,
}: {
  test: DiagnosticTest;
  number: number;
  status: DiagnosticStatus;
}) {
  const Icon = test.icon;

  return (
    <div
      className={`grid h-[42px] grid-cols-[28px_1.05fr_1.45fr_72px_76px_28px] items-center border-b border-[#E9EDF2] px-[8px] transition-all duration-300 ${
        status === "running"
          ? "diagnostic-running-row bg-[#F5F9FF]"
          : "bg-white"
      }`}
    >
      {/* NUMBER */}

      <span className="text-center text-[8px] font-semibold text-[#526078]">
        {number}
      </span>

      {/* DEVICE */}

      <span className="truncate pr-[4px] text-[8px] font-semibold text-[#25334A]">
        {test.device}
      </span>

      {/* TEST NAME */}

      <div className="flex min-w-0 items-center gap-[5px]">
        <div
          className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[5px] ${
            status === "running"
              ? "bg-[#E4F0FF]"
              : status === "passed"
                ? "bg-[#ECF7FF]"
                : "bg-[#F1F3F6]"
          }`}
        >
          <Icon
            size={11}
            strokeWidth={2.2}
            className={
              status === "queued"
                ? "text-[#9DA9BA]"
                : "text-[#0875F7]"
            }
          />
        </div>

        <span
          className={`truncate text-[8px] ${
            status === "queued"
              ? "font-medium text-[#8995A6]"
              : "font-semibold text-[#526078]"
          }`}
        >
          {test.test}
        </span>
      </div>

      {/* TESTED ON */}

      <span className="truncate text-[7px] font-medium text-[#7C8798]">
        {status === "passed"
          ? "15:35:46"
          : status === "running"
            ? "Testing"
            : "--"}
      </span>

      {/* STATUS */}

      <div className="flex justify-center">
        {status === "passed" && (
          <span className="flex h-[23px] w-[64px] items-center justify-center gap-[4px] rounded-[7px] bg-[#DDF4E2] text-[7px] font-bold text-[#16803B]">
            <Check size={9} strokeWidth={3} />
            PASS
          </span>
        )}

        {status === "running" && (
          <span className="flex h-[23px] w-[64px] items-center justify-center gap-[4px] rounded-[7px] bg-[#E2EFFF] text-[6.5px] font-bold text-[#0875F7]">
            <Loader2
              size={9}
              className="animate-spin"
            />

            RUNNING
          </span>
        )}

        {status === "queued" && (
          <span className="flex h-[23px] w-[64px] items-center justify-center rounded-[7px] bg-[#EDF0F3] text-[6.5px] font-bold text-[#7F8A99]">
            QUEUED
          </span>
        )}
      </div>

      {/* RUN BUTTON */}

      <div className="flex justify-center">
        <button
          type="button"
          className={`flex h-[20px] w-[20px] items-center justify-center rounded-full border transition-all ${
            status === "running"
              ? "diagnostic-run-button border-[#0875F7] bg-[#EFF6FF] text-[#0875F7]"
              : "border-[#86B8F5] bg-white text-[#0875F7]"
          }`}
        >
          <Play
            size={8}
            strokeWidth={2.5}
            fill="currentColor"
          />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   SEPARATOR
========================================================= */

function Separator() {
  return <span className="h-[10px] w-px bg-[#777]" />;
}
