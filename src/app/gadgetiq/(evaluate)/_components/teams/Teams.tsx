"use client";

import { useState, useEffect, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import TiltCard from "@/components/ui/TiltCard";
import SectionHeading from "@/components/ui/SectionHeading";

import enterprisesImg from "@/../public/images/enterprises.jpg";
import retailResaleImg from "@/../public/images/retail-resale.jpg";
import refurbishersImg from "@/../public/images/refurbishers.jpg";
import marketplacesImg from "@/../public/images/marketplaces.jpg";

interface TeamCardItem {
  title: string;
  tagline: string;
  desc: string;
  outcomes: string[];
  image: StaticImageData;
}

const teamCards: TeamCardItem[] = [
  {
    title: "Enterprises",
    tagline: "Turn retired assets into measurable recovery value.",
    desc: "Assess end-of-use assets, identify redeployment potential, and determine the right path across reuse, refurbishment, remarketing, parts recovery, and responsible disposition.",
    outcomes: [
      "Lower asset lifecycle costs",
      "Reduced value leakage",
      "Greater recovery from retired assets",
    ],
    image: enterprisesImg,
  },
  {
    title: "Retail and Resale",
    tagline: "Strengthen recovery, reporting, and disposition decisions.",
    desc: "Evaluate mixed asset batches, maintain condition traceability, and compare redeployment, refurbishment, remarketing, wholesale, parts harvesting, and responsible disposition options.",
    outcomes: [
      "Higher client recovery",
      "Faster disposition decisions",
      "Complete asset audit trails",
    ],
    image: retailResaleImg,
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
    image: refurbishersImg,
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
    image: marketplacesImg,
  },
];

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Teams() {
  const [activeTeam, setActiveTeam] = useState<TeamCardItem | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);

  // Prevent background scrolling when modal is open
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

  // Automatic smooth horizontal scrolling on mobile screens
  useEffect(() => {
    if (isInteracting || activeTeam) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Only auto-scroll if container has horizontal scroll overflow (mobile screens)
      if (container.scrollWidth <= container.clientWidth + 20) return;

      const nextIndex = (currentIndex + 1) % teamCards.length;
      const cardWidth = container.scrollWidth / teamCards.length;

      container.scrollTo({
        left: nextIndex * cardWidth,
        behavior: "smooth",
      });

      setCurrentIndex(nextIndex);
    }, 3200);

    return () => clearInterval(interval);
  }, [currentIndex, isInteracting, activeTeam]);

  // Sync currentIndex when user manually scrolls or swipes
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = container.scrollWidth / teamCards.length;
    if (cardWidth > 0) {
      const newIndex = Math.round(container.scrollLeft / cardWidth);
      if (newIndex >= 0 && newIndex < teamCards.length && newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
      }
    }
  };

  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = container.scrollWidth / teamCards.length;
    container.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  };

  return (
    <>
      <section id="built" className="relative py-16 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-brand-bg-deep overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,204,0.04),transparent_50%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
            <SectionHeading
              eyebrow="Wherever devices are being evaluated, Gadget Evaluate fits in"
              title="BUILT FOR REAL BUSINESS USE"
            />


            <motion.div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              onTouchStart={() => setIsInteracting(true)}
              onTouchEnd={() => setTimeout(() => setIsInteracting(false), 3000)}
              onMouseEnter={() => setIsInteracting(true)}
              onMouseLeave={() => setIsInteracting(false)}
              variants={stagger}
              className="mt-0 flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none no-scrollbar pb-5 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0 scroll-smooth"
            >
              {teamCards.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="w-[82vw] max-w-[320px] sm:w-auto sm:max-w-none shrink-0 sm:shrink snap-center h-full"
                >
                  <TiltCard className="h-full p-5 sm:p-6 flex flex-col justify-between rounded-3xl border border-brand-border bg-white transition duration-300 hover:shadow-2xl group min-h-[440px] sm:min-h-[460px] relative overflow-hidden">
                    <div className="flex flex-col flex-1">
                      <div className="overflow-hidden rounded-2xl mb-4 sm:mb-5 border border-brand-border/60 bg-brand-bg-deep aspect-[16/10] shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 300px"
                          placeholder="blur"
                          className="w-full h-full object-cover transform transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-brand-text-primary mb-1.5 sm:mb-2 font-display">{item.title}</h3>
                      <p className="text-xs font-semibold text-brand-primary mb-3 leading-relaxed min-h-[32px]">
                        {item.tagline}
                      </p>

                      <div className="border-t border-brand-border/60 pt-3.5 sm:pt-4 mb-4">
                        <p className="text-[10px] uppercase font-bold text-brand-text-muted mb-2 tracking-wider">Key Outcomes</p>
                        <ul className="space-y-1.5 text-xs text-brand-text-secondary leading-relaxed">
                          {item.outcomes.map((o) => (
                            <li key={o} className="flex items-start gap-2">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                              <span>{o}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveTeam(item)}
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-xl border border-brand-border bg-brand-bg-light hover:bg-brand-primary/5 hover:border-brand-primary/30 text-brand-text-primary hover:text-brand-primary transition-all duration-300 group mt-auto cursor-pointer"
                    >
                      <span>Know More</span>
                      <svg className="h-3 w-3 transform transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile Pagination Indicator Dots */}
            <div className="flex sm:hidden items-center justify-center space-x-2 mt-3.5">
              {teamCards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-6 bg-brand-primary"
                      : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to card ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Modal for detailed case view */}
      <AnimatePresence>
        {activeTeam && (
          <>
            {/* Semi-transparent backdrop with blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 top-[72px] sm:top-[76px] lg:top-[80px] z-[150] bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setActiveTeam(null)}
            />

            {/* Modal Card Centered Wrapper */}
            <div className="fixed inset-x-0 bottom-0 top-[72px] sm:top-[76px] lg:top-[80px] z-[150] flex items-center justify-center p-4 md:p-6 pointer-events-none">
              <motion.div
                data-lenis-prevent
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="device-card relative w-full max-w-2xl h-auto max-h-[85%] md:max-h-[80%] flex flex-col rounded-[32px] border border-brand-border bg-white overflow-hidden shadow-2xl p-6 md:p-8 pointer-events-auto overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Subtle Accent Radial Glow */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(0,82,204,0.05),transparent_50%)]" />

                {/* Close Button */}
                <button
                  onClick={() => setActiveTeam(null)}
                  className="absolute top-5 right-5 h-9 w-9 flex items-center justify-center rounded-full border border-brand-border hover:border-brand-border/80 bg-brand-bg-deep hover:bg-brand-bg-mid text-brand-text-secondary hover:text-brand-text-primary transition-all z-20 cursor-pointer"
                >
                  <X size={16} />
                </button>

                <div className="relative z-10">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-brand-primary font-bold">Built for teams</p>
                  <h3 className="text-2xl font-bold text-brand-text-primary mt-2 mb-3 font-display">{activeTeam.title}</h3>

                  <p className="text-sm font-semibold text-brand-text-secondary border-l-2 border-brand-primary pl-3 mb-6 leading-relaxed">
                    {activeTeam.tagline}
                  </p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs uppercase font-bold text-brand-text-muted tracking-wider mb-2">Overview</h4>
                      <p className="text-sm text-brand-text-secondary font-light leading-relaxed">
                        {activeTeam.desc}
                      </p>
                    </div>

                    <div className="border-t border-brand-border pt-5">
                      <h4 className="text-xs uppercase font-bold text-brand-primary tracking-wider mb-3">Key Outcomes & Benefits</h4>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {activeTeam.outcomes.map((o) => (
                          <div key={o} className="p-4 rounded-xl border border-brand-border bg-brand-bg-deep/40 flex flex-col justify-between">
                            <CheckCircle2 size={16} className="text-brand-success mb-2 shrink-0" />
                            <span className="text-xs font-semibold text-brand-text-primary leading-normal">{o}</span>
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
