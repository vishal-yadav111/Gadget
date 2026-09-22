import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  X,
  Search,
  Info,
  Check,
  HelpCircle,
  Laptop,
  Terminal,
  Cpu,
  Battery,
  Database,
  HardDrive,
  Wifi,
  Bluetooth,
  Network,
  Keyboard,
  Camera,
  Volume2,
  Disc,
  Layers,
  Activity,
  Video,
  MapPin,
  Gauge,
  ToggleLeft,
  Usb,
  Zap,
  Radio,
  Thermometer,
  Lock
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "device":
      return Laptop;
    case "operating system":
      return Terminal;
    case "motherboard":
      return Layers;
    case "battery":
      return Battery;
    case "memory":
      return Database;
    case "cpu":
      return Cpu;
    case "gpu":
      return Activity;
    case "storage":
      return HardDrive;
    case "wireless":
      return Wifi;
    case "bluetooth":
      return Bluetooth;
    case "wired ethernet":
      return Network;
    case "keyboard":
      return Keyboard;
    case "camera":
      return Camera;
    case "audio":
      return Volume2;
    case "optical disc drive":
      return Disc;
    case "sd card":
      return Database;
    default:
      return Cpu;
  }
}

function getMobileCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "battery":
      return Battery;
    case "display":
      return Laptop;
    case "audio":
      return Volume2;
    case "camera":
      return Camera;
    case "video":
      return Video;
    case "connectivity":
      return Bluetooth;
    case "network":
      return Wifi;
    case "location":
      return MapPin;
    case "storage":
      return HardDrive;
    case "sensor":
      return Gauge;
    case "button":
      return ToggleLeft;
    case "connector":
      return Usb;
    case "power":
      return Zap;
    case "multimedia":
      return Radio;
    case "performance":
      return Cpu;
    case "temperature":
      return Thermometer;
    case "security":
      return Lock;
    default:
      return HelpCircle;
  }
}

function PageShell({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative z-10 px-6 py-14 lg:py-16 md:px-12 ${className}`}>
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};
import { laptopTests, laptopSystemInfo, mobileTestsByCategory } from "./deviceTestData";

const deviceSupportCards = [
  {
    title: "Laptop Devices",
    device: "laptop",
    label: "Windows + Mac OS QC Applications",
    badge: "Win 7 SP1+ / M1-M4",
    platforms: ["Windows", "Mac OS"],
    coverage: "Windows laptops, desktops, MacBook Air and MacBook Pro with device identity, component, thermal, battery and display validation.",
  },
  {
    title: "Mobile Devices (Coming Soon)",
    device: "mobile",
    label: "Android + iOS QC Applications",
    badge: "Phones + tablets",
    platforms: ["Android", "iOS"],
    coverage: "Android smartphones, iPhones, tablets and iPads with assisted diagnostics, identity checks, sensor validation and cosmetic grading support.",
  },
];

function AppIcon({ type }: { type: string }) {
  if (type === "windows" || type === "laptop") {
    return (
      <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M8 12.8 29.5 9.6v20.9H8V12.8Zm26.5-4L56 5.6v24.9H34.5V8.8ZM8 34.5h21.5v19.9L8 51.2V34.5Zm26.5 0H56v23.9l-21.5-3.2V34.5Z" />
      </svg>
    );
  }

  if (type === "mac os" || type === "macbook" || type === "ios") {
    return (
      <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
        <path fill="currentColor" d="M43.8 33.7c-.1-6 4.9-8.9 5.1-9-2.8-4.1-7.1-4.6-8.6-4.7-3.7-.4-7.2 2.2-9.1 2.2-1.9 0-4.8-2.1-7.9-2-4.1.1-7.9 2.4-10 6.1-4.3 7.5-1.1 18.5 3.1 24.6 2 3 4.5 6.3 7.7 6.2 3.1-.1 4.3-2 8-2s4.8 2 8.1 1.9c3.4-.1 5.5-3 7.5-6 2.4-3.5 3.3-6.8 3.4-7-.1-.1-6.5-2.5-6.6-10.3Zm-5.9-17.6c1.7-2.1 2.9-5 2.6-7.8-2.5.1-5.5 1.7-7.3 3.8-1.6 1.8-3 4.8-2.6 7.6 2.8.2 5.6-1.4 7.3-3.6Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden="true">
      <path fill="currentColor" d="M21.2 23.8h21.6c3.2 0 5.8 2.6 5.8 5.8v14.7c0 3.2-2.6 5.8-5.8 5.8H21.2c-3.2 0-5.8-2.6-5.8-5.8V29.6c0-3.2 2.6-5.8 5.8-5.8Zm-10.3 6.6c1.7 0 3 1.3 3 3v10.8a3 3 0 0 1-6 0V33.4c0-1.7 1.3-3 3-3Zm42.2 0c1.7 0 3 1.3 3 3v10.8a3 3 0 0 1-6 0V33.4c0-1.7 1.3-3 3-3ZM24.6 52h4.6v7.5a2.3 2.3 0 0 1-4.6 0V52Zm10.2 0h4.6v7.5a2.3 2.3 0 0 1-4.6 0V52ZM23.3 14.8 18.8 8l2.2-1.5 4.8 7.2a21 21 0 0 1 12.4 0L43 6.5 45.2 8l-4.5 6.8c4 2 6.9 5.3 7.7 9H15.6c.8-3.7 3.7-7 7.7-9ZM24.6 19.6a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Zm14.8 0a2.1 2.1 0 1 0 0-4.2 2.1 2.1 0 0 0 0 4.2Z" />
    </svg>
  );
}

function DeviceCardItem({
  card,
  index,
  onOpen,
}: {
  card: typeof deviceSupportCards[0];
  index: number;
  onOpen: () => void;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div variants={fadeUp} className="h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onClick={onOpen}
        className="device-card group relative h-full overflow-hidden rounded-[32px] border border-brand-border bg-white transition duration-300 hover:-translate-y-1.5 hover:border-brand-primary/40 hover:shadow-2xl hover:shadow-brand-primary/10 cursor-pointer flex flex-col justify-between"
      >
        {/* Dynamic Cobalt Cursor Follower Light Spotlight */}
        <div
          className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
          style={{
            background: `radial-gradient(380px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 82, 204, 0.08), transparent 75%)`,
          }}
        />

        <div className="relative p-6 lg:p-7 flex flex-col h-full justify-between z-10">
          <div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-brand-text-muted">0{index + 1} / qc application</p>
              <h3 className="mt-2 text-2xl sm:text-[28px] lg:text-[30px] font-semibold tracking-[-0.7px] text-brand-text-primary group-hover:text-brand-primary transition-colors duration-200">{card.title}</h3>
            </div>

            {/* Horizontally aligned QC Application Label & Badge */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:gap-2.5">
              <p className="inline-flex items-center rounded-full border border-brand-border bg-brand-bg-light px-3.5 py-1.5 text-xs font-semibold text-brand-text-secondary">
                {card.label}
              </p>
              <span className="inline-flex items-center rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-primary">
                {card.badge}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {card.platforms.map((platform) => (
                <span key={platform} className="inline-flex items-center gap-2 rounded-full border border-brand-accent/20 bg-brand-accent/5 px-3 py-1.5 text-[11px] font-semibold text-brand-accent-ink">
                  <AppIcon type={platform.toLowerCase()} />
                  {platform}
                </span>
              ))}
            </div>

            <div className="device-info-card mt-6 rounded-[24px] border border-brand-border bg-brand-bg-deep/40 p-5 shadow-sm group-hover:border-brand-primary/20 group-hover:bg-brand-primary/[0.02] transition-colors duration-300">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-primary/20 bg-brand-primary/10 text-brand-primary transition-colors duration-300">
                  <ShieldCheck size={18} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold tracking-wider text-brand-text-muted mb-1">Coverage Details</p>
                  <p className="text-xs text-brand-text-secondary leading-relaxed font-light">
                    {card.coverage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Highlighted Call To Action Button with Bluish Theme on Card Hover */}
          <div className="mt-8">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className="w-full flex items-center justify-between gap-3 rounded-2xl border border-brand-border bg-white text-brand-text-primary px-5 py-3.5 sm:py-4 text-sm font-semibold shadow-sm transition-all duration-300 group-hover:bg-brand-primary group-hover:border-brand-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-primary/25 cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary group-hover:bg-white/20 group-hover:text-white transition-colors duration-300">
                  <Info size={14} />
                </span>
                Explore Diagnostics & Info
              </span>
              <svg className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DeviceSupport() {
  const [activeModal, setActiveModal] = useState<string | null>(null); // 'laptop', 'mobile' or null
  const [laptopActiveTab, setLaptopActiveTab] = useState("tests"); // 'tests' or 'systemInfo'
  const [laptopSearchQuery, setLaptopSearchQuery] = useState("");
  const [mobileActiveCategory, setMobileActiveCategory] = useState("Battery");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  // Reset search queries on modal close/change
  useEffect(() => {
    setLaptopSearchQuery("");
    setMobileSearchQuery("");
  }, [activeModal]);

  // Filter Laptop Diagnostics
  const filteredLaptopTests = laptopTests.filter(test =>
    test.name.toLowerCase().includes(laptopSearchQuery.toLowerCase())
  );

  // Filter Laptop System Info
  const filteredLaptopSystemInfo = Object.entries(laptopSystemInfo).reduce((acc: Record<string, string[]>, [category, fields]) => {
    const matchesCategory = category.toLowerCase().includes(laptopSearchQuery.toLowerCase());
    const matchingFields = fields.filter(field => field.toLowerCase().includes(laptopSearchQuery.toLowerCase()));
    if (matchesCategory || matchingFields.length > 0) {
      acc[category] = matchesCategory ? fields : matchingFields;
    }
    return acc;
  }, {} as Record<string, string[]>);

  // Flatten Mobile tests for search-wide queries
  const allMobileTests = Object.entries(mobileTestsByCategory).flatMap(([category, tests]) =>
    tests.map(test => ({ category, name: test }))
  );

  const filteredMobileTests = allMobileTests.filter(
    item => item.name.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(mobileSearchQuery.toLowerCase())
  );

  return (
    <>
      <PageShell id="devices" className="device-support-section bg-brand-bg-light relative">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.18 }} variants={stagger}>
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <SectionHeading
              eyebrow="WHAT WE CHECK"
              title="Check more than whether the device turns on."
              subtitle="Gadget Evaluate can assess supported functional areas across laptops, mobile devices and other supported electronics."
            />
          </div>



          <motion.div variants={stagger} className="mt-0 grid gap-6 md:grid-cols-2">
            {deviceSupportCards.map((card, index) => (
              <DeviceCardItem
                key={card.title}
                card={card}
                index={index}
                onOpen={() => setActiveModal(card.device)}
              />
            ))}
          </motion.div>
        </motion.div>
      </PageShell>

      {/* Shared Interactive Dialog Modal */}
      <AnimatePresence>
        {activeModal && (
          <>
            {/* Semi-transparent backdrop with blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 top-[72px] sm:top-[76px] lg:top-[80px] z-[150] bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />

            {/* Modal Card Centered Wrapper */}
            <div className="fixed inset-x-0 bottom-0 top-[72px] sm:top-[76px] lg:top-[80px] z-[150] flex items-center justify-center p-4 md:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="device-card relative w-full max-w-5xl h-full max-h-full md:h-[90%] md:max-h-[90%] flex flex-col rounded-[32px] border border-brand-border bg-white overflow-hidden shadow-2xl pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Subtle Cobalt Accent Radial Glow on Light Theme Modal */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,204,0.05),transparent_50%)]" />

                {/* Modal Header */}
                <div className="relative shrink-0 px-6 py-5 border-b border-brand-border flex items-center justify-between z-10">
                  <div>
                    <h3 className="text-xl font-semibold text-brand-text-primary tracking-tight">
                      {activeModal === "laptop" ? "Laptop QC Support Specifications" : "Mobile QC Support Specifications"}
                    </h3>
                    <p className="text-xs text-brand-text-secondary mt-1">
                      {activeModal === "laptop"
                        ? "Comprehensive list of diagnostic tests and system information parameters captured by Gadget IQ."
                        : "Categorized suite of quality check procedures available for mobile and tablet devices."}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="h-10 w-10 flex items-center justify-center rounded-full border border-brand-border hover:border-brand-border/80 bg-brand-bg-deep hover:bg-brand-bg-mid text-brand-text-secondary hover:text-brand-text-primary transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Action Controls (Tabs + Search) */}
                <div className="relative shrink-0 px-6 py-4 border-b border-brand-border bg-brand-bg-deep/30 flex flex-col md:flex-row md:items-center justify-between gap-4 z-10">
                  {activeModal === "laptop" ? (
                    <div className="flex rounded-xl bg-brand-bg-deep p-1 border border-brand-border">
                      <button
                        onClick={() => setLaptopActiveTab("tests")}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${laptopActiveTab === "tests"
                          ? "bg-brand-primary text-[#ffffff] shadow-md shadow-brand-primary/20"
                          : "text-brand-text-secondary hover:text-brand-text-primary"
                          }`}
                      >
                        Diagnostic Tests ({laptopTests.length})
                      </button>
                      <button
                        onClick={() => setLaptopActiveTab("systemInfo")}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${laptopActiveTab === "systemInfo"
                          ? "bg-brand-primary text-[#ffffff] shadow-md shadow-brand-primary/20"
                          : "text-brand-text-secondary hover:text-brand-text-primary"
                          }`}
                      >
                        System Info Captured ({Object.keys(laptopSystemInfo).length} Components)
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-brand-text-secondary uppercase tracking-widest flex items-center gap-2">
                      <Info size={14} className="text-brand-primary" />
                      Categorized Tests & Procedures
                    </div>
                  )}

                  {/* Search Bar */}
                  <div className="relative w-full md:w-72">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-brand-text-muted">
                      <Search size={14} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search specifications..."
                      value={activeModal === "laptop" ? laptopSearchQuery : mobileSearchQuery}
                      onChange={(e) => {
                        if (activeModal === "laptop") {
                          setLaptopSearchQuery(e.target.value);
                        } else {
                          setMobileSearchQuery(e.target.value);
                        }
                      }}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-brand-border text-xs text-brand-text-primary placeholder-brand-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 transition-all"
                    />
                  </div>
                </div>

                {/* Scrollable Contents Area */}
                <div data-lenis-prevent className="relative grow overflow-y-auto p-6 z-10 bg-transparent">
                  {/* 1. LAPTOP MODAL CONTENT */}
                  {activeModal === "laptop" && (
                    <>
                      {/* Diagnostic Tests Tab */}
                      {laptopActiveTab === "tests" && (
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                          {filteredLaptopTests.map((test, index) => (
                            <div key={test.name} className="flex items-center justify-between p-3.5 rounded-2xl border border-brand-border bg-brand-bg-deep/40 hover:bg-brand-bg-deep hover:border-brand-border/80 transition-all duration-200">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] text-brand-text-muted font-semibold font-mono w-5">
                                  {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="text-sm text-brand-text-primary font-medium">{test.name}</span>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${test.type === "Automatic"
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                                : "bg-indigo-500/10 text-indigo-700 border-indigo-500/20"
                                }`}>
                                {test.type}
                              </span>
                            </div>
                          ))}
                          {filteredLaptopTests.length === 0 && (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-brand-text-muted text-xs">
                              <HelpCircle size={32} className="mb-2 opacity-50" />
                              No matching tests found.
                            </div>
                          )}
                        </div>
                      )}

                      {/* System Information Tab */}
                      {laptopActiveTab === "systemInfo" && (
                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                          {Object.entries(filteredLaptopSystemInfo).map(([category, fields]) => {
                            const CategoryIcon = getCategoryIcon(category);
                            return (
                              <div key={category} className="p-5 rounded-2xl border border-brand-border bg-brand-bg-deep/40 hover:border-brand-primary/40 hover:bg-brand-bg-deep transition-all duration-300">
                                <h4 className="text-[13px] font-semibold text-brand-primary tracking-wider uppercase mb-3 flex items-center gap-2">
                                  <CategoryIcon className="w-4 h-4 text-brand-primary shrink-0" />
                                  {category}
                                </h4>
                                <div className="space-y-2">
                                  {fields.map((field) => (
                                    <div key={field} className="text-xs text-brand-text-secondary pl-3 border-l border-brand-border hover:text-brand-text-primary transition-colors py-0.5">
                                      {field}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                          {Object.keys(filteredLaptopSystemInfo).length === 0 && (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-brand-text-muted text-xs">
                              <HelpCircle size={32} className="mb-2 opacity-50" />
                              No matching system components found.
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* 2. MOBILE MODAL CONTENT */}
                  {activeModal === "mobile" && (
                    <>
                      {/* Search query layout (Flat list search) */}
                      {mobileSearchQuery ? (
                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                          {filteredMobileTests.map((item, index) => (
                            <div key={index} className="flex flex-col justify-center p-3.5 rounded-2xl border border-brand-border bg-brand-bg-deep/40 hover:bg-brand-bg-deep transition-all duration-200">
                              <span className="text-[9px] text-brand-primary font-bold uppercase tracking-wider mb-1">
                                {item.category}
                              </span>
                              <span className="text-sm text-brand-text-primary font-medium">{item.name}</span>
                            </div>
                          ))}
                          {filteredMobileTests.length === 0 && (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-brand-text-muted text-xs">
                              <HelpCircle size={32} className="mb-2 opacity-50" />
                              No matching diagnostic tests found.
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Category Browser Layout */
                        <div className="flex flex-col md:flex-row gap-6 h-full min-h-[40vh]">
                          {/* Mobile view scrollable tabs */}
                          <div data-lenis-prevent className="flex gap-2 overflow-x-auto pb-3 scrollbar-none md:hidden shrink-0 border-b border-brand-border">
                            {Object.keys(mobileTestsByCategory).map((category) => {
                              const count = mobileTestsByCategory[category as keyof typeof mobileTestsByCategory].length;
                              const isActive = mobileActiveCategory === category;
                              const CategoryIcon = getMobileCategoryIcon(category);
                              return (
                                <button
                                  key={category}
                                  onClick={() => setMobileActiveCategory(category)}
                                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isActive
                                    ? "bg-brand-primary text-[#ffffff]"
                                    : "bg-brand-bg-deep text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-bg-mid"
                                    }`}
                                >
                                  <CategoryIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#ffffff]" : "text-brand-text-secondary"}`} />
                                  <span>{category}</span>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-[#ffffff]" : "bg-brand-bg-mid text-brand-text-muted"
                                    }`}>
                                    {count}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Desktop Sidebar */}
                          <div data-lenis-prevent className="hidden md:flex flex-col w-64 shrink-0 border-r border-brand-border pr-6 gap-1 overflow-y-auto max-h-[50vh]">
                            {Object.keys(mobileTestsByCategory).map((category) => {
                              const count = mobileTestsByCategory[category as keyof typeof mobileTestsByCategory].length;
                              const isActive = mobileActiveCategory === category;
                              const CategoryIcon = getMobileCategoryIcon(category);
                              return (
                                <button
                                  key={category}
                                  onClick={() => setMobileActiveCategory(category)}
                                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-semibold transition-all duration-200 ${isActive
                                    ? "bg-brand-primary text-[#ffffff] shadow-[0_4px_12px_rgba(0,82,204,0.3)]"
                                    : "text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-bg-deep"
                                    }`}
                                >
                                  <span className="flex items-center gap-2.5">
                                    <CategoryIcon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#ffffff]" : "text-brand-text-muted"}`} />
                                    <span>{category}</span>
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-white/20 text-[#ffffff]" : "bg-brand-bg-mid text-brand-text-muted"
                                    }`}>
                                    {count}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Category contents */}
                          <div className="grow">
                            <div className="mb-4 hidden md:block">
                              <h4 className="text-base font-semibold text-brand-text-primary flex items-center gap-2">
                                {mobileActiveCategory} Tests
                                <span className="text-xs font-normal text-brand-text-muted">
                                  ({mobileTestsByCategory[mobileActiveCategory as keyof typeof mobileTestsByCategory]?.length} items)
                                </span>
                              </h4>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {mobileTestsByCategory[mobileActiveCategory as keyof typeof mobileTestsByCategory]?.map((test: string, index: number) => (
                                <div key={test} className="flex items-center gap-3 p-3.5 rounded-2xl border border-brand-border bg-brand-bg-deep/40 hover:bg-brand-bg-deep transition-all duration-200">
                                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                                    <Check size={11} strokeWidth={3} />
                                  </span>
                                  <span className="text-sm text-brand-text-primary font-medium leading-tight">{test}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
