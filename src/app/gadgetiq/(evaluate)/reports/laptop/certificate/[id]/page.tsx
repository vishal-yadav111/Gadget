"use client";

import React, { use } from "react";
import LaptopCertificatePage from "../page";

export default function LaptopCertificateDynamicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwraps param and renders base certificate viewer
  const resolved = use(params);
  return <LaptopCertificatePage />;
}
