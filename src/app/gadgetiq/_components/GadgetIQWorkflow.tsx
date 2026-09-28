"use client";

import { motion } from "framer-motion";

import SectionHeading from "./SectionHeading";
import PageShell from "./PageShell";
import GadgetIQLiveDemo from "./GadgetIQLiveDemo";
import { fadeUp, stagger } from "./animations";

export default function GadgetIQWorkflow() {
  return (
    <PageShell id="gadgetiq-workflow" className="bg-white">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
      >
        <SectionHeading
          eyebrow="product walkthrough"
          title="Try Out Our"
          highlight="Interactive Demo"
          text="From login to final report: explore the full inspection and grading journey before you buy."
        />

        <motion.div variants={fadeUp} className="mt-10">
          <div className="relative h-[760px] w-full overflow-hidden rounded-[28px] border border-[#DDE4F3] bg-[#F4F6FB] shadow-sm sm:h-[820px] lg:h-[880px]">
            <GadgetIQLiveDemo />
          </div>
        </motion.div>
      </motion.div>
    </PageShell>
  );
}
