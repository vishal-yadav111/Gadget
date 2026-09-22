"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import DarkCard from "./DarkCard";
import SectionHeading from "./SectionHeading";
import PageShell from "./PageShell";
import { fadeUp, stagger } from "./animations";

interface TeamCardItem {
  title: string;
  tagline: string;
  desc: string;
  outcomes: string[];
  image: string;
}

const teamCards: TeamCardItem[] = [
  {
    title: "Enterprises",
    tagline: "Streamline device lifecycles and maximize recovery value.",
    desc: "Maintain central visibility across laptops, desktops, and mobile fleets. Make data-driven decisions on redeployment, repair, employee buyback, and certified disposition.",
    outcomes: [
      "Accurate fleet health visibility",
      "Standardized grading across facilities",
      "Clear asset remarketing decisions",
    ],
    image: "/images/enterprises.jpg",
  },
  {
    title: "Refurbishers",
    tagline: "Increase throughput without compromising quality.",
    desc: "Standardize functional testing and cosmetic grading across operators, facilities, and asset categories. Use condition and repair data to identify the right remarketing path for every asset.",
    outcomes: [
      "Faster asset processing",
      "Fewer rechecks and returns",
      "Improved recovery margins",
    ],
    image: "/images/refurbishers.jpg",
  },
  {
    title: "Marketplaces",
    tagline: "Build buyer confidence with verified asset condition.",
    desc: "Create consistent grading standards across sellers and support every listing with diagnostic results, cosmetic evidence, and a traceable asset record.",
    outcomes: [
      "More accurate listings",
      "Fewer condition disputes",
      "Stronger seller compliance",
    ],
    image: "/images/marketplaces.jpg",
  },
];

export default function Teams() {
  const [activeTeam, setActiveTeam] = useState<TeamCardItem | null>(null);

  useEffect(() => {
    if (activeTeam) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeTeam]);

  return (
    <>
      <PageShell id="built" className="bg-white">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          <SectionHeading
            eyebrow="Teams"
            title="Built for teams that move devices"
            highlight="at every scale."
            text="From buying desks to refurb floors, each team gets the view it needs while staying on the same device truth."
          />

          <motion.div variants={stagger} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {teamCards.map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="h-full">
                <DarkCard className="h-full p-6 flex flex-col justify-between transition duration-300 hover:-translate-y-2 hover:border-[#0052CC]/40 hover:shadow-xl group bg-white border-[#DDE4F3]">
                  <div>
                    <div className="overflow-hidden rounded-2xl mb-5 border border-[#DDE4F3] bg-[#F4F6FB]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-60 object-cover transform transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <h3 className="text-lg font-bold text-[#17284D] mb-1.5 font-display">{item.title}</h3>
                    <p className="text-xs font-bold text-[#0052CC] mb-3 leading-relaxed min-h-[32px] font-display">
                      {item.tagline}
                    </p>

                    <div className="border-t border-[#DDE4F3] pt-4 mb-4">
                      <p className="text-[10px] uppercase font-bold text-[#5F6A86] mb-2.5 tracking-wider font-display">
                        Key Outcomes
                      </p>
                      <ul className="space-y-2 text-xs text-[#4A5875] leading-relaxed font-medium">
                        {item.outcomes.map((o) => (
                          <li key={o} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0052CC]" />
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTeam(item)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-brand-btn-orange/20 hover:shadow-brand-btn-orange/40 btn-shimmer border border-brand-btn-orange/30 cursor-pointer"
                  >
                    Know More
                    <svg
                      className="h-3 w-3 transform transition-transform duration-300 group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </DarkCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </PageShell>

      {/* Interactive Modal for detailed case view */}
      <AnimatePresence>
        {activeTeam && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setActiveTeam(null)}
            />

            <div className="fixed inset-0 z-[151] flex items-center justify-center p-4 md:p-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="device-card relative w-full max-w-2xl h-auto max-h-[85vh] flex flex-col rounded-[32px] border border-[#DDE4F3] bg-white overflow-hidden shadow-2xl p-6 md:p-8 pointer-events-auto overflow-y-auto text-[#17284D]"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveTeam(null)}
                  className="absolute top-5 right-5 h-9 w-9 flex items-center justify-center rounded-full border border-[#DDE4F3] hover:border-slate-300 bg-[#F4F6FB] hover:bg-[#E9EEF9] text-[#4A5875] hover:text-[#17284D] transition-all z-20 cursor-pointer shadow-xs"
                >
                  <X size={16} />
                </button>

                <div className="relative z-10">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#0052CC] font-bold font-display">
                    Built for teams
                  </p>
                  <h3 className="text-2xl font-bold text-[#17284D] mt-2 mb-3 font-display">{activeTeam.title}</h3>

                  <p className="text-sm font-semibold text-[#17284D] border-l-2 border-[#0052CC] pl-3 mb-6 leading-relaxed bg-[#0052CC]/8 py-2 rounded-r-lg">
                    {activeTeam.tagline}
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-[#5F6A86] tracking-wider mb-2 font-display">
                        Overview
                      </h4>
                      <p className="text-sm text-[#4A5875] leading-relaxed font-normal">{activeTeam.desc}</p>
                    </div>

                    <div className="border-t border-[#DDE4F3] pt-5">
                      <h4 className="text-xs uppercase font-bold text-[#0052CC] tracking-wider mb-3 font-display">
                        Key Outcomes & Benefits
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {activeTeam.outcomes.map((o) => (
                          <div
                            key={o}
                            className="p-4 rounded-xl border border-[#DDE4F3] bg-[#F4F6FB] flex flex-col justify-between shadow-xs"
                          >
                            <CheckCircle2 size={16} className="text-emerald-600 mb-2 shrink-0" />
                            <span className="text-xs font-bold text-[#17284D] leading-snug">
                              {o}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
