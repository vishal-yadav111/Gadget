"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  getGadgetIqSession,
  gadgetIqAuth,
  GadgetIqUser,
  ProjectAccess,
} from "@/lib/services/gadgetiq-api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isEvaluate = pathname
    ? pathname.startsWith("/gadgetiq/evaluate")
    : false;

  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  // User Session State
  const [session, setSession] = useState<{
    user: GadgetIqUser;
    projectAccess: ProjectAccess;
  } | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();

  // Check and sync user authentication status
  const syncSession = () => {
    const activeSession = getGadgetIqSession();
    if (activeSession && activeSession.user) {
      setSession({
        user: activeSession.user,
        projectAccess: activeSession.projectAccess,
      });
    } else {
      setSession(null);
    }
  };

  useEffect(() => {
    syncSession();
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, [pathname]);

  // Click outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setScrolled(currentScrollY > 20);

      // Always show the header near the top of the page. Otherwise,
      // hide it while scrolling down and bring it back as soon as
      // the user scrolls up.
      if (currentScrollY <= 80) {
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // Keep mobile submenus closed whenever the drawer is closed/reopened
  useEffect(() => {
    if (!mobileMenuOpen) {
      setOpenMobileSubmenu(null);
    }
  }, [mobileMenuOpen]);

  const handleSignOut = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    gadgetIqAuth.logout();
    setSession(null);
    router.push("/gadgetiq/login");
  };

  // Helper for User Avatar Initials
  const getUserInitials = (user: GadgetIqUser) => {
    if (user.fullName) {
      const parts = user.fullName.trim().split(" ");
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return user.fullName.substring(0, 2).toUpperCase();
    }
    return (user.username || "OP").substring(0, 2).toUpperCase();
  };

  // Navigation links
  interface NavLinkItem {
    name: string;
    href?: string;
    submenu?: { name: string; href: string }[];
  }

  const navLinks: NavLinkItem[] = [
    {
      name: "Solutions",
      submenu: [
        {
          name: "Gadget Evaluate",
          href: "/gadgetiq/evaluate",
        },
        {
          name: "Gadget Lens",
          href: "/gadgetiq/lens",
        },
      ],
    },
    {
      name: "How It Works",
      href: "/gadgetiq/#how-we-check",
    },
    {
      name: "What We Check",
      href: "/gadgetiq/#what-we-check",
    },
    {
      name: "Enterprises",
      href: "/gadgetiq/#built",
    },
    {
      name: "FAQs",
      href: "/gadgetiq/#faqs",
    },
    {
      name: "Contact Us",
      href: "/gadgetiq/#contact",
    },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    if (href.startsWith("#")) {
      const targetId = href.substring(1);
      const elem = document.getElementById(targetId);

      if (elem) {
        e.preventDefault();

        const headerOffset = 80;
        const elementPosition = elem.getBoundingClientRect().top;

        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        window.history.pushState(null, "", href);
      } else {
        const basePath = isEvaluate
          ? "/gadgetiq/evaluate"
          : "/gadgetiq";

        window.location.href = `${basePath}${href}`;
      }
    } else if (href.includes("#")) {
      const [path, hash] = href.split("#");

      const currentPath = pathname
        ? pathname.replace(/\/$/, "")
        : "";

      const targetPath = path.replace(/\/$/, "");

      if (currentPath === targetPath) {
        const targetId = hash;
        const elem = document.getElementById(targetId);

        if (elem) {
          e.preventDefault();

          const headerOffset = 80;
          const elementPosition =
            elem.getBoundingClientRect().top;

          const offsetPosition =
            elementPosition +
            window.pageYOffset -
            headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });


          window.history.pushState(null, "", `#${hash}`);
        }
      }
    }
  };


  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 bg-white transition-all duration-300 ease-in-out px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20",
          headerVisible ? "translate-y-0" : "-translate-y-full",
          scrolled
            ? "border-b border-brand-border/80 shadow-xs py-2.5 sm:py-3"
            : "py-4 sm:py-5"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* ================= LOGO ================= */}
          <Link
            href={
              isEvaluate
                ? "/gadgetiq/evaluate"
                : "/gadgetiq"
            }
            onClick={(e) => {
              const targetPath = isEvaluate
                ? "/gadgetiq/evaluate"
                : "/gadgetiq";

              if (pathname === targetPath) {
                e.preventDefault();

                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });

                if (window.location.hash) {
                  window.history.pushState(
                    null,
                    "",
                    targetPath
                  );
                }
              }
            }}
            className="group flex flex-col items-start justify-center py-1 cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logoblack.png"
              alt="Gadget IQ"
              className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-all duration-300"
            />

            {isEvaluate && (
              <span className="text-xs sm:text-sm md:text-[15px] font-black uppercase tracking-[0.22em] text-gradient-accent font-display leading-tight w-full text-left pl-5 mt-0.5">
                Evaluate
              </span>
            )}
          </Link>

          {/* ================= DESKTOP NAVIGATION ================= */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative group"
              >
                {/* SOLUTIONS MENU */}
                {"submenu" in link ? (
                  <>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs xl:text-sm font-medium text-brand-text-secondary hover:text-brand-text-primary transition-colors duration-200 relative py-2 cursor-pointer"
                    >
                      {link.name}

                      <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />

                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full" />
                    </button>

                    {/* SUBMENU */}
                    <div className="absolute left-0 top-full pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                      <div className="w-56 rounded-xl bg-brand-bg-deep border border-brand-border shadow-xl p-2">
                        {link.submenu?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() =>
                              setMobileMenuOpen(false)
                            }
                            className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-accent/5 transition-colors"
                          >
                            <span>
                              {subItem.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* NORMAL MENU ITEM */
                  <a
                    href={link.href}
                    onClick={(e) =>
                      handleNavClick(e, link.href || "")
                    }
                    className="text-xs xl:text-sm font-medium text-brand-text-secondary hover:text-brand-text-primary transition-colors duration-200 relative py-2 group cursor-pointer"
                  >
                    {link.name}

                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full" />
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* ================= DESKTOP ACTION BUTTONS / USER VCARD ================= */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* When Logged In: Render User Avatar & Profile Card Dropdown */}
            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[#DDE4F3] hover:border-[#0052CC]/50 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0052CC] to-[#0070F3] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {getUserInitials(session.user)}
                  </div>
                  <div className="text-left hidden xl:block">
                    <p className="text-xs font-bold text-[#17284D] leading-tight truncate max-w-[140px]">
                      {session.user.fullName || session.user.username}
                    </p>
                    <p className="text-[10px] text-[#5F6A86] capitalize leading-none mt-0.5">
                      {session.user.role || "Operator"}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-[#5F6A86] group-hover:text-[#0052CC] transition-transform duration-200",
                      userDropdownOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* USER LOGIN VCARD POPUP */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-full mt-2.5 w-64 rounded-2xl bg-white border border-[#DDE4F3] shadow-2xl p-4 z-50 overflow-hidden"
                    >
                      {/* VCard Profile Header: Just Name, Email & Role */}
                      <div className="flex items-center space-x-3 pb-3 border-b border-[#DDE4F3]">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0052CC] to-[#0070F3] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                          {getUserInitials(session.user)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-[#17284D] truncate font-display">
                            {session.user.fullName || session.user.username}
                          </h4>
                          <p className="text-xs text-[#5F6A86] truncate">
                            {session.user.email || `@${session.user.username}`}
                          </p>
                          <p className="text-[10px] font-semibold text-[#0052CC] uppercase tracking-wider mt-0.5">
                            {session.user.role || "Operator"}
                          </p>
                        </div>
                      </div>

                      {/* VCard Actions: ONLY Dashboard & Log Out */}
                      <div className="pt-2 space-y-1">
                        <Link
                          href="/gadgetiq/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#17284D] hover:bg-[#F4F6FB] hover:text-[#0052CC] transition-colors cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4 text-[#0052CC]" />
                          <span>Dashboard</span>
                        </Link>

                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#C7300A] hover:bg-[#FFF2F0] transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-[#C7300A]" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* When NOT Logged In: Route directly to /gadgetiq/login */
              <>
                <Link
                  href="/gadgetiq/dashboard"
                  className="px-4 py-2.5 rounded-full bg-blue-50/80 hover:bg-blue-100 text-[#0052CC] border border-blue-200/80 text-xs xl:text-sm font-bold transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer"
                >
                  <span>Portal Dashboard</span>
                </Link>

                <Link
                  href="/gadgetiq/login"
                  className="px-4 xl:px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-xs xl:text-sm font-semibold text-white shadow-md shadow-brand-btn-orange/20 hover:shadow-brand-btn-orange/40 flex items-center space-x-2 border border-brand-btn-orange/30 group transition-all duration-300 btn-shimmer cursor-pointer"
                >
                  <span>Sign In</span>
                </Link>
              </>
            )}
          </div>

          {/* ================= MOBILE / TABLET CONTROLS ================= */}
          <div className="flex items-center space-x-2 lg:hidden">
            {session ? (
              <Link
                href="/gadgetiq/dashboard"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0052CC] to-[#0070F3] text-white flex items-center justify-center font-bold text-xs shadow-xs"
                title={session.user.fullName || session.user.username}
              >
                {getUserInitials(session.user)}
              </Link>
            ) : (
              <Link
                href="/gadgetiq/login"
                className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-xs font-semibold text-white shadow-sm cursor-pointer"
              >
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-brand-text-primary hover:bg-slate-200/50 hover:text-brand-accent transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ================= SCROLL PROGRESS ================= */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-brand-accent origin-left w-full"
          style={{
            scaleX: scrollYProgress,
          }}
        />
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* DRAWER */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 260,
              }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[300px] sm:w-[340px] max-w-[88vw] bg-brand-bg-deep border-l border-brand-border shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
            >
              {/* SIDEBAR HEADER */}
              <div className="flex items-center justify-between pb-4 border-b border-brand-border/60">
                <Link
                  href={isEvaluate ? "/gadgetiq/evaluate" : "/gadgetiq"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="cursor-pointer flex flex-col items-start"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logoblack.png"
                    alt="Gadget IQ"
                    className="h-7 sm:h-8 w-auto object-contain"
                  />

                  {isEvaluate && (
                    <span className="text-xs sm:text-sm font-black uppercase tracking-[0.22em] text-gradient-accent font-display leading-tight w-full text-left pl-5 mt-0.5">
                      Evaluate
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-slate-200/60 transition-all cursor-pointer"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ================= MOBILE USER VCARD IF LOGGED IN ================= */}
              {session && (
                <div className="my-3 p-3.5 rounded-2xl bg-white border border-[#DDE4F3] shadow-xs">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0052CC] to-[#0070F3] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {getUserInitials(session.user)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#17284D] truncate">
                        {session.user.fullName || session.user.username}
                      </p>
                      <p className="text-[11px] text-[#5F6A86] truncate">
                        {session.user.email || `@${session.user.username}`}
                      </p>
                      <p className="text-[10px] font-semibold text-[#0052CC] uppercase tracking-wider mt-0.5">
                        {session.user.role || "Operator"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#DDE4F3] flex items-center justify-between">
                    <Link
                      href="/gadgetiq/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-bold text-[#0052CC] hover:underline flex items-center gap-1"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-xs font-bold text-[#C7300A] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================= MOBILE NAV ================= */}
              <nav className="flex flex-col space-y-1.5 pt-2 pb-4 flex-1">
                {navLinks.map((link, index) => (
                  <div key={link.name}>
                    {"submenu" in link ? (
                      <>
                        {/* SUBMENU TRIGGER */}
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMobileSubmenu((current) =>
                              current === link.name ? null : link.name
                            )
                          }
                          aria-expanded={openMobileSubmenu === link.name}
                          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-brand-text-primary hover:bg-brand-accent/5 transition-all cursor-pointer"
                        >
                          <span>{link.name}</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-brand-accent transition-transform duration-200",
                              openMobileSubmenu === link.name && "rotate-180"
                            )}
                          />
                        </button>

                        {/* SUBMENU */}
                        <AnimatePresence initial={false}>
                          {openMobileSubmenu === link.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="ml-2 overflow-hidden border-l border-brand-border/60 pl-2"
                            >
                              {link.submenu?.map((subItem) => (
                                <a
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={(e) =>
                                    handleNavClick(e, subItem.href)
                                  }
                                  className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/5 transition-all cursor-pointer"
                                >
                                  <span>{subItem.name}</span>
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <motion.a
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        href={link.href}
                        onClick={(e) =>
                          handleNavClick(e, link.href || "")
                        }
                        className="flex items-center px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-text-secondary hover:text-brand-accent hover:bg-brand-accent/5 transition-all cursor-pointer"
                      >
                        <span>{link.name}</span>
                      </motion.a>
                    )}
                  </div>
                ))}
              </nav>

              {/* ================= MOBILE CTA ================= */}
              <div className="pt-4 border-t border-brand-border/60 space-y-2 mt-auto">
                <Link
                  href="/gadgetiq/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center bg-blue-50 text-[#0052CC] border border-blue-200 rounded-xl text-sm font-bold flex items-center justify-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-[#0052CC]" />
                  <span>Workstation Dashboard</span>
                </Link>

                {!session && (
                  <Link
                    href="/gadgetiq/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center bg-gradient-to-r from-brand-btn-orange to-brand-btn-orange-highlight text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-btn-orange/20 flex items-center justify-center space-x-2 btn-shimmer cursor-pointer"
                  >
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}