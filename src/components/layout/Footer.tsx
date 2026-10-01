"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Footer() {
  const pathname = usePathname();
  const isEvaluate = pathname ? pathname.startsWith("/gadgetiq/evaluate") : false;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-brand-bg-deep/50 py-16 px-6 md:px-12 relative overflow-hidden">
      {/* Decorative radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,90,31,0.03),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">

        {/* Branding & CTA */}
        <div className="md:col-span-2 flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <Link
              href={isEvaluate ? "/gadgetiq/evaluate" : "/gadgetiq"}
              className="inline-flex flex-col items-start cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logoblack.png"
                alt="Gadget IQ"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain self-start"
              />
              {isEvaluate && (
                <span className="text-xs sm:text-sm md:text-[15px] font-black uppercase tracking-[0.22em] text-gradient-accent font-display leading-tight w-full text-left pl-5 mt-0.5">
                  Evaluate
                </span>
              )}
            </Link>
            <div className="flex items-center space-x-1.5 pt-0.5">
              <span className="text-[10px] tracking-wider text-brand-text-secondary">
                powered by
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/xtracover-logo1.png"
                alt="XtraCover Logo"
                className="h-5 w-auto object-contain opacity-80"
              />
            </div>
          </div>
          <p className="text-brand-text-secondary text-xs sm:text-sm max-w-sm">
            Intelligent device diagnostics, grading automation, and lifecycle transparency for modern circular electronics.
          </p>
          <ul className="space-y-3 text-sm font-light">
            <li className="flex items-start space-x-2.5">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-brand-text-secondary" />
              <span className="text-brand-text-secondary">
                A-1, 3rd Floor, FIEE Complex, Okhla Industrial Area Phase-2, New Delhi 110020
              </span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail className="h-4 w-4 shrink-0 text-brand-text-secondary" />
              <a href="mailto:corporate@xtracover.com" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                corporate@xtracover.com
              </a>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="h-4 w-4 shrink-0 text-brand-text-secondary" />
              <a href="tel:+919212181545" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                +91 921-218-1545
              </a>
            </li>
          </ul>
        </div>

        {/* Product column */}
        <div>
          <h4 className="text-brand-text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Product
          </h4>
          <ul className="space-y-4 text-sm font-light">
            <li>
              <Link href="/gadgetiq" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                GadgetIQ Core
              </Link>
            </li>
            <li>
              <Link href="/gadgetiq/dashboard" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                Workstation Dashboard
              </Link>
            </li>
            <li>
              <a href="/gadgetiq/#how-we-check" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                How It Works
              </a>
            </li>
            <li>
              <a href="/gadgetiq/#what-we-check" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                What We Check
              </a>
            </li>
           
          </ul>
        </div>

        {/* Solutions column */}
        <div>
          <h4 className="text-brand-text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Solutions
          </h4>
          <ul className="space-y-4 text-sm font-light">
            <li>
              <Link href="/gadgetiq/evaluate" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                Gadget Evaluate
              </Link>
            </li>
            <li>
              <Link href="/gadgetiq/lens" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                Gadget Lens
              </Link>
            </li>
            <li>
              <Link href="/gadgetiq/interactive-demo" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                Interactive Demo
              </Link>
            </li>
          </ul>
        </div>

        {/* Company column */}
        <div className="mb-4 sm:pb-0">
          <h4 className="text-brand-text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Company
          </h4>
          <ul className="space-y-4 text-sm font-light">
            <li>
              <a href="https://www.xtracover.com/about-us" target="_blank" rel="noopener noreferrer" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                About XtraCover
              </a>
            </li>
            <li>
              <a href="/gadgetiq/#contact" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                Contact / Trial
              </a>
            </li>
            <li>
              <a href="/gadgetiq/#faqs" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                FAQs
              </a>
            </li>
            <li>
              <Link href="#" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-brand-border/60 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 relative z-10 text-xs text-brand-text-secondary">
        <span>
          © {currentYear} GadgetIQ All rights reserved.
        </span>
      </div>
    </footer>
  );
}
