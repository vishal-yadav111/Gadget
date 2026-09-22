import { motion } from "framer-motion";
import React from "react";

interface SectionHeadingProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  highlight?: React.ReactNode;
  text?: React.ReactNode;
  align?: "left" | "center";
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  text,
  align = "left",
}: SectionHeadingProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 1 },
        show: { opacity: 1 },
      }}
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="section-eyebrow mb-3 text-xs font-bold uppercase tracking-[0.25em] text-white text-[#fff] font-display"
        >
          {eyebrow}
        </motion.div>
      )}
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 12, filter: "blur(5px)" },
          show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] } },
        }}
        className="text-[15px] font-bold leading-tight tracking-tight text-[#17284D] sm:text-[21px] lg:text-[25px] font-display"
      >
        {title}{" "}
        {highlight && (
          <span className="font-bold text-brand-primary text-[#0052CC] ml-1">
            {highlight}
          </span>
        )}
      </motion.h2>
      {text && (
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0, transition: { duration: 0.52, delay: 0.16, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="mt-4 max-w-2xl text-sm leading-7 text-[#4A5875] sm:text-base font-normal font-sans"
        >
          {text}
        </motion.p>
      )}
    </motion.div>
  );
}
