"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import GadgetIQWorkflow from "../_components/GadgetIQWorkflow";
import "../_components/home.css";

export default function InteractiveDemoPage() {
  return (
    <div className="relative min-h-screen bg-[#F4F6FB] text-[#17284D] overflow-hidden selection:bg-brand-accent/25 selection:text-[#17284D] font-sans">
      {/* Background ambient lighting mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,86,48,0.06),transparent_35%),radial-gradient(circle_at_80%_16%,rgba(0,82,204,0.05),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(255,86,48,0.03),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,82,204,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,82,204,0.025)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
      </div>

      <Navbar />

      <main className="relative z-10 flex flex-col w-full pt-20">
        <GadgetIQWorkflow />
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
