"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Tag, ArrowLeftRight, RotateCcw, Building } from "lucide-react";

interface UseCaseItem {
  id: string;
  label: string;
  icon: any;
  description: string;
  image: string;
}

export default function UseCases() {
  const useCases: UseCaseItem[] = [
    {
      id: "refurbishment",
      label: "Refurbishment",
      icon: RotateCcw,
      description: "Know what works before a device is refurbished and resold.",
      image: "/refurbish_illustration.jpg",
    },
    {
      id: "retail-resale",
      label: "Retail & Resale",
      icon: Tag,
      description: "Add a reliable functional check before the device reaches the customer.",
      image: "/retail_illustration.jpg",
    },
    {
      id: "trade-in",
      label: "Trade-In / BuyBack Programs",
      icon: ArrowLeftRight,
      description: "Understand device condition as it moves through your operation.",
      image: "/tradein_illustration.jpg",
    },
    {
      id: "enterprise-it",
      label: "Enterprise & IT",
      icon: Building,
      description: "Evaluate devices across internal quality and device lifecycle processes.",
      image: "/enterprise_illustration.jpg",
    },
  ];

  return (
    <section id="use-cases" className="relative py-24 px-6 md:px-12 bg-brand-bg-light overflow-hidden z-10">
      <div className="absolute inset-y-0 right-0 w-[350px] bg-brand-accent/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <SectionHeading
          eyebrow=" BUILT FOR REAL BUSINESS USE"
          title="Wherever devices are being evaluated, Gadget Evaluate fits in."
        />

        {/* 4-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <motion.div
                key={uc.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-slate-100 p-5 flex flex-col space-y-5 shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                {/* Card Image */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uc.image}
                    alt={uc.label}
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  {/* Title & Icon */}
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-5 h-5 text-brand-primary shrink-0" />
                    <h3 className="text-lg font-bold text-slate-900 font-display">
                      {uc.label}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm font-light leading-relaxed flex-1 pt-1">
                    {uc.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
