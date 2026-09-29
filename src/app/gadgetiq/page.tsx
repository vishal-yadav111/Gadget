"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import Hero from "./_components/Hero";
import "./_components/home.css";
import CoreFeatures from "./_components/CoreFeatures";
import TestParameters from "./_components/TestParameters";
import DiagnosticsHero from "./_components/DiagnosticsHero";
import HowWeCheck from "./_components/HowWeCheck";
import BusinessSolutions from "./(evaluate)/_components/business-solutions/BusinessSolutions";


// Dynamic imports of subsequent sections directly from local _components
const GadgetIQWorkflow = dynamic(() => import("./_components/GadgetIQWorkflow"), {
  loading: () => <SectionSkeleton />,
});
const VideoShowcase = dynamic(() => import("./(evaluate)/_components/video-showcase/VideoShowcase"), {
  loading: () => <SectionSkeleton />,
});
const WorkflowRow = dynamic(() => import("./_components/WorkflowRow"), {
  loading: () => <SectionSkeleton />,
});
const Pillars = dynamic(() => import("./_components/Pillars"), {
  loading: () => <SectionSkeleton />,
});
const ValueLogic = dynamic(() => import("./_components/ValueLogic"), {
  loading: () => <SectionSkeleton />,
});
const PaperTrail = dynamic(() => import("./_components/PaperTrail"), {
  loading: () => <SectionSkeleton />,
});
const Teams = dynamic(() => import("./_components/Teams"), {
  loading: () => <SectionSkeleton />,
});
const FAQ = dynamic(() => import("./_components/FAQ"), {
  loading: () => <SectionSkeleton />,
});
const BookDemo = dynamic(() => import("./_components/BookDemo"), {
  loading: () => <SectionSkeleton />,
});

export default function GadgetIQPage() {
  return (
    <div className="relative min-h-screen bg-[#F4F6FB] text-[#17284D] overflow-hidden selection:bg-brand-accent/25 selection:text-[#17284D] font-sans">
      {/* Background ambient lighting mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,86,48,0.06),transparent_35%),radial-gradient(circle_at_80%_16%,rgba(0,82,204,0.05),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,86,48,0.03),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,82,204,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,82,204,0.025)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
      </div>

      {/* Header Navbar */}
      <Navbar />

      {/* Main Home Page Sections */}
      <main className="relative z-10 flex flex-col w-full">
        {/* <Hero /> */}
        <DiagnosticsHero />
        <CoreFeatures />
        {/* <TestParameters /> */}
        <GadgetIQWorkflow />
        <VideoShowcase />

        <HowWeCheck />
        <BusinessSolutions />
        {/* <WorkflowRow /> */}
        {/* <Pillars /> */}
        {/* <ValueLogic /> */}
        <PaperTrail />
    
        <Teams />
        <FAQ />
        <BookDemo />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />
    </div>
  );
}
