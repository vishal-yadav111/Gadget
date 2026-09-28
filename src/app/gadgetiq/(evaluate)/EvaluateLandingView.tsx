"use client";

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ParticleGrid from "@/components/ui/ParticleGrid";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import ScrollToTop from "@/components/ui/ScrollToTop";
import StickyQuoteForm from "../_components/StickyQuoteForm";

// Dynamic imports of sections segregated directly inside evaluate/_components
const Hero = dynamic(() => import("./_components/hero/Hero"), {
  loading: () => <SectionSkeleton />,
});
const WhyGadgetEvaluate = dynamic(() => import("./_components/why-gadget-evaluate/WhyGadgetEvaluate"), {
  loading: () => <SectionSkeleton />,
});
const WhatWeDo = dynamic(() => import("./_components/what-we-do/WhatWeDo"), {
  loading: () => <SectionSkeleton />,
});
const DeviceSupport = dynamic(() => import("./_components/supported-devices/DeviceSupport"), {
  loading: () => <SectionSkeleton />,
});
const HowItWorks = dynamic(() => import("./_components/how-it-works/HowItWorks"), {
  loading: () => <SectionSkeleton />,
});
const DeviceIntelligence = dynamic(() => import("./_components/device-intelligence/DeviceIntelligence"), {
  loading: () => <SectionSkeleton />,
});
const WhyItMatters = dynamic(() => import("./_components/why-it-matters/WhyItMatters"), {
  loading: () => <SectionSkeleton />,
});
const UseCases = dynamic(() => import("./_components/use-cases/UseCases"), {
  loading: () => <SectionSkeleton />,
});
const Teams = dynamic(() => import("./_components/teams/Teams"), {
  loading: () => <SectionSkeleton />,
});
const DigitalTrust = dynamic(() => import("./_components/digital-trust/DigitalTrust"), {
  loading: () => <SectionSkeleton />,
});
const FAQs = dynamic(() => import("./_components/faqs/FAQs"), {
  loading: () => <SectionSkeleton />,
});
const BookDemo = dynamic(() => import("./_components/book-demo/BookDemo"), {
  loading: () => <SectionSkeleton />,
});

export default function EvaluatePage() {
  return (
    <div className="relative min-h-screen bg-brand-bg-deep text-brand-text-primary overflow-hidden selection:bg-brand-accent/30 selection:text-white noise-overlay">
      {/* Scroll Controller */}
      <SmoothScroll />

      {/* Global Floating Grids & Lighting */}
      <ParticleGrid />

      {/* Header Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col w-full">
        <Hero />

        <WhyGadgetEvaluate />

        <HowItWorks />
        {/* <DeviceIntelligence /> */}
        <DeviceSupport />
        <WhyItMatters />
        {/* <Teams /> */}
        {/* <UseCases /> */}

        {/* <DigitalTrust /> */}
        <FAQs />
        <BookDemo />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

      {/* Sticky Book a Demo Tab */}
      <StickyQuoteForm />
    </div>
  );
}
