"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import TiltCard from "@/components/ui/TiltCard";

interface PricingPlan {
  name: string;
  price: string;
  licenses: string;
  desc: string;
  btnText: string;
  colorBar: string;
  featured: boolean;
  isCustom?: boolean;
}

export default function Pricing() {
  const plans: PricingPlan[] = [
    {
      name: "Try",
      price: "₹0",
      licenses: "Single Use",
      desc: "We offer the single use license for one-time users and testing purposes at a token cost.",
      btnText: "Try Now",
      colorBar: "bg-[#7E7E7E]",
      featured: false,
    },
    {
      name: "Starter",
      price: "₹1,250",
      licenses: "25 licenses",
      desc: "The Starter pack of 25 licenses are for the new entrants and entities still on a discovery mode and doing smaller numbers.",
      btnText: "Buy Now",
      colorBar: "bg-[#D97706]",
      featured: false,
    },
    {
      name: "Pro",
      price: "₹3,500",
      licenses: "100 licenses",
      desc: "The Professional pack of 100 licenses are for those who are working at a mid to large scale.",
      btnText: "Buy Now",
      colorBar: "bg-[#E11D48]",
      featured: true,
    },
    {
      name: "Grand",
      price: "₹15,000",
      licenses: "500 licenses",
      desc: "The Grand pack of 500 licenses are for the seasoned players who are doing some serious numbers.",
      btnText: "Buy Now",
      colorBar: "bg-[#2563EB]",
      featured: false,
    },
    {
      name: "All Star",
      price: "₹28,000",
      licenses: "1,000 licenses",
      desc: "The All Star pack of 1000 licenses are for those who are the masters of the game.",
      btnText: "Buy Now",
      colorBar: "bg-[#DC2626]",
      featured: false,
    },
    {
      name: "Customisable packs of 1000+ licenses",
      price: "",
      licenses: "",
      desc: "You may customise your pack of any number of licenses above 1,000. Rates will vary according to the pack size. Click on buy now button below to know more.",
      btnText: "Buy Now",
      colorBar: "bg-[#DC2626]",
      featured: false,
      isCustom: true,
    },
  ];

  return (
    <section id="pricing" className="relative py-12 sm:py-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-brand-bg-deep overflow-hidden z-10">
      {/* Background soft lighting glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Heading */}
        <SectionHeading
          eyebrow="PRICING"
          title="Choose a plan right for your business ◆"
          subtitle="Flexible plans tailored to fit high-throughput, repeatable diagnostic environments."
        />

        {/* 6-Plan Pricing Grid: Compact 2-column grid on mobile, 3-column on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mt-0 w-full">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              className="h-full"
            >
              <TiltCard
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-4 sm:p-8 flex flex-col justify-between shadow-xs sm:shadow-md hover:shadow-xl transition-all duration-300 relative h-full min-h-0 sm:min-h-[360px]"
              >
                <div className="space-y-2.5 sm:space-y-6">
                  {/* Top Color Bar */}
                  <div className={`w-6 sm:w-8 h-1 sm:h-1.5 rounded-full ${plan.colorBar}`} />

                  {/* Header details */}
                  {!plan.isCustom ? (
                    <div className="space-y-1 sm:space-y-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                        {plan.name}
                      </h4>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display">
                          {plan.price}
                        </span>
                      </div>
                      <span className="text-[11px] sm:text-xs font-bold text-sky-500 uppercase tracking-wide block">
                        {plan.licenses}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1 sm:space-y-2 pt-0.5 sm:pt-2">
                      <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider block">
                        Enterprise
                      </span>
                      <h3 className="text-xs sm:text-lg font-bold text-slate-900 leading-snug font-display">
                        {plan.name}
                      </h3>
                      <span className="text-[11px] sm:text-xs font-bold text-sky-500 uppercase tracking-wide block">
                        Custom Volume
                      </span>
                    </div>
                  )}

                  {/* Description: Hidden on mobile screens */}
                  <p className="hidden sm:block text-slate-500 text-sm font-light leading-relaxed">
                    {plan.desc}
                  </p>
                </div>

                {/* Featured Bookmark Ribbon */}
                {plan.featured && (
                  <div className="absolute top-0 right-3 sm:right-6 w-5 h-7 sm:w-8 sm:h-12 bg-brand-primary flex items-center justify-center rounded-b-md shadow-md">
                    <span className="text-white text-[10px] sm:text-xs">★</span>
                  </div>
                )}
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
