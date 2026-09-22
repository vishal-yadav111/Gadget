"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EvaluateCertificateDetailPage from "@/app/gadgetiq/(evaluate)/certificate/[id]/EvaluateCertificateView";
import LensCertificatePage from "@/app/gadgetiq/(lens)/certificate/[id]/LensCertificateView";
import { certificateService as evalCertService } from "@/app/gadgetiq/(evaluate)/certificate/services";

export default function UnifiedCertificateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = useParams();
  const id = (unwrappedParams?.id as string) || "";
  const [certType, setCertType] = useState<"evaluate" | "lens" | "loading">("loading");

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    // Check if this ID belongs to Evaluate diagnostic certificate
    evalCertService
      .getCertificate(id)
      .then((data) => {
        if (isMounted) {
          if (data && (data.certificateNumber || data.brand || data.model || data.serviceKey)) {
            setCertType("evaluate");
          } else {
            setCertType("lens");
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setCertType("lens");
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (certType === "loading") {
    return (
      <div className="min-h-screen bg-[#F4F6FB] flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-3 border-[#0052CC] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs sm:text-sm font-semibold text-[#17284D]">
          Resolving Digital Inspection Certificate...
        </p>
      </div>
    );
  }

  if (certType === "evaluate") {
    return <EvaluateCertificateDetailPage params={params} />;
  }

  return <LensCertificatePage />;
}
