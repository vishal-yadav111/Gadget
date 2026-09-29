"use client";

import { useEffect, useState } from "react";
import qrcode from "qrcode-generator";

/**
 * A real, scannable QR code (same encoder the reference demo uses). It points back at this page's
 * `#demo-verify` deep link, which opens the demo on the certificate's Verify step.
 */
export default function QrCode({ size = 106 }: { size?: number }) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    try {
      const q = qrcode(0, "M");
      q.addData(`${location.origin}${location.pathname}#demo-verify`);
      q.make();
      setSrc(`data:image/svg+xml;utf8,${encodeURIComponent(q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }))}`);
    } catch {
      setSrc("");
    }
  }, []);

  return (
    <div
      role="img"
      aria-label="QR code linking to this certificate"
      className="bg-contain bg-no-repeat [image-rendering:pixelated]"
      style={{ width: size, height: size, backgroundImage: src ? `url("${src}")` : "none" }}
    />
  );
}
