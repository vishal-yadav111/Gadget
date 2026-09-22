"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GadgetIqAuthLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/gadgetiq/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex items-center justify-center">
      <div className="flex items-center space-x-2 text-[#0052CC] font-semibold text-sm">
        <div className="w-4 h-4 border-2 border-[#0052CC] border-t-transparent rounded-full animate-spin" />
        <span>Redirecting to GadgetIQ  Login...</span>
      </div>
    </div>
  );
}