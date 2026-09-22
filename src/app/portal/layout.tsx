import React from "react";
import PortalShell from "./_components/PortalShell";

export const metadata = {
  title: "Enterprise Portal | Gadget Evaluate",
  description: "XtraCover Automated Hardware & Device Diagnostic Evaluation Suite",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell>{children}</PortalShell>;
}

