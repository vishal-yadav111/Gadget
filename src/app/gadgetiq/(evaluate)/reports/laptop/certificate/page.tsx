"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { reportsService } from "../../services";
import { LaptopQCReportItem } from "../../types";
import { mapLaptopReportToCertificate, FormattedLaptopCertificateData } from "./laptopCertAdapter";
import LaptopCertificateView from "./_components/LaptopCertificateView";
import "@/app/gadgetiq/certificate/certificate.css";

function LaptopCertificateContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id") || "";
  const serviceKeyParam = searchParams.get("servicekey") || "";
  const serialParam = searchParams.get("serial") || "";
  const queryTarget = idParam || serialParam || serviceKeyParam || "";

  const [certData, setCertData] = useState<FormattedLaptopCertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCertificateData = async () => {
    setLoading(true);
    setError(null);

    try {
      let baselineItem: any = null;

      // 1. Check sessionStorage cache
      if (typeof window !== "undefined") {
        const cachedStr = sessionStorage.getItem("selected_laptop_report");
        if (cachedStr) {
          try {
            const cachedItem = JSON.parse(cachedStr);
            const cachedId = String(cachedItem.mstid || cachedItem.identification?.mstid || "");
            const cachedSerial = String(cachedItem.serial_number || cachedItem.device_serial_number || cachedItem.imei_1 || cachedItem.identification?.serial_number || "");
            const cachedKey = String(cachedItem.ServiceKey || cachedItem.certificate_number || cachedItem.identification?.certificate_number || "");

            const isMatching =
              !queryTarget ||
              cachedId === idParam ||
              cachedSerial === serialParam ||
              cachedKey === serviceKeyParam ||
              cachedId === queryTarget ||
              cachedSerial === queryTarget;

            if (isMatching) {
              baselineItem = cachedItem;
              // If cached item already has full detail diagnostics and specs, use it immediately
              if (
                cachedItem.hardware_diagnostics &&
                (cachedItem.component_specs || cachedItem.identification) &&
                (cachedItem.all_fields || cachedItem.component_specs?.motherboard || cachedItem.identification?.mstid)
              ) {
                setCertData(mapLaptopReportToCertificate(cachedItem));
                setLoading(false);
                return;
              }
            }
          } catch {
            // Ignore parse error and proceed to network fetch
          }
        }
      }

      // 2. Query detail API directly for this specific ID / Serial / ServiceKey
      const candidateLookups = [idParam, serialParam, serviceKeyParam, queryTarget].filter(
        (v, i, arr) => Boolean(v) && arr.indexOf(v) === i
      );

      let detailRes: any = null;
      for (const target of candidateLookups) {
        try {
          const res = await reportsService.getLaptopDetail(target);
          if (res && (res.identification || res.hardware_diagnostics || (res as any).mstid || (res as any).all_fields)) {
            detailRes = res;
            break;
          }
        } catch (detailErr) {
          console.warn(`Detail lookup for candidate "${target}" failed:`, detailErr);
        }
      }

      if (detailRes) {
        // Merge with baselineItem if available so summary metadata is preserved
        const merged = baselineItem
          ? {
            ...baselineItem,
            ...detailRes,
            identification: {
              ...(baselineItem.identification || baselineItem),
              ...(detailRes.identification || detailRes),
            },
            hardware_diagnostics: {
              ...(baselineItem.hardware_diagnostics || {}),
              ...(detailRes.hardware_diagnostics || {}),
            },
            component_specs: {
              ...(baselineItem.component_specs || {}),
              ...(detailRes.component_specs || {}),
            },
            battery_analytics: {
              ...(baselineItem.battery_analytics || {}),
              ...(detailRes.battery_analytics || {}),
            },
            all_fields: {
              ...(baselineItem.all_fields || baselineItem),
              ...(detailRes.all_fields || detailRes),
            },
          }
          : detailRes;

        if (typeof window !== "undefined") {
          sessionStorage.setItem("selected_laptop_report", JSON.stringify(merged));
        }

        setCertData(mapLaptopReportToCertificate(merged));
        setLoading(false);
        return;
      }

      // 3. Fallback: Search from paginated reports list
      const res = await reportsService.getLaptopReportsPaginated({
        search: queryTarget || serialParam || idParam,
        pageSize: 10,
      });

      if (res && res.data && res.data.length > 0) {
        const matchedItem = (queryTarget || serialParam || idParam)
          ? res.data.find(
            (item) =>
              (idParam && String(item.mstid) === idParam) ||
              (serialParam && (item.serial_number === serialParam || item.device_serial_number === serialParam || item.imei_1 === serialParam)) ||
              (serviceKeyParam && item.ServiceKey === serviceKeyParam) ||
              String(item.mstid) === queryTarget ||
              item.ServiceKey === queryTarget ||
              item.certificate_number === queryTarget ||
              item.device_serial_number === queryTarget ||
              item.serial_number === queryTarget ||
              item.imei_1 === queryTarget
          ) || res.data[0]
          : res.data[0];

        if (matchedItem) {
          // Attempt one secondary detail lookup on matchedItem's mstid or serial
          const secondaryTarget = matchedItem.mstid || matchedItem.serial_number || matchedItem.device_serial_number || matchedItem.imei_1;
          if (secondaryTarget) {
            try {
              const secondaryDetail = await reportsService.getLaptopDetail(secondaryTarget);
              if (secondaryDetail && (secondaryDetail.identification || secondaryDetail.hardware_diagnostics || (secondaryDetail as any).mstid)) {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("selected_laptop_report", JSON.stringify(secondaryDetail));
                }
                setCertData(mapLaptopReportToCertificate(secondaryDetail));
                setLoading(false);
                return;
              }
            } catch {
              // fallback to matchedItem
            }
          }

          if (typeof window !== "undefined") {
            sessionStorage.setItem("selected_laptop_report", JSON.stringify(matchedItem));
          }
          setCertData(mapLaptopReportToCertificate(matchedItem));
          setLoading(false);
          return;
        }
      }

      // 4. Fallback: If baseline item was found in sessionStorage, use it
      if (baselineItem) {
        setCertData(mapLaptopReportToCertificate(baselineItem));
        setLoading(false);
        return;
      }

      // 5. Fallback: Load recent report
      const fallbackRes = await reportsService.getLaptopReportsPaginated({
        pageSize: 1,
      });

      if (fallbackRes && fallbackRes.data && fallbackRes.data.length > 0) {
        setCertData(mapLaptopReportToCertificate(fallbackRes.data[0]));
      } else {
        setError("No QC inspection record found for this laptop.");
      }
    } catch (err: any) {
      console.error("Failed to load laptop certificate:", err);
      setError(err?.message || "Unable to load laptop QC certificate data. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificateData();
  }, [idParam, serialParam, serviceKeyParam, queryTarget]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-3">
        <RefreshCw className="w-9 h-9 animate-spin text-[#0052CC]" />
        <p className="text-xs font-bold text-[#17284D]">
          Resolving Official 64-Point Laptop QC Certificate...
        </p>
      </div>
    );
  }

  if (error || !certData) {
    return (
      <div className="p-8 max-w-md mx-auto my-12 bg-white rounded-2xl border border-[#DDE4F3] text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#17284D]">Certificate Not Found</h2>
        <p className="text-xs text-[#5F6A86]">{error || "No diagnostic certificate available."}</p>
        <div className="flex items-center justify-center space-x-2 pt-2">
          <button
            onClick={loadCertificateData}
            className="px-4 py-2 bg-[#0052CC] text-white text-xs font-bold rounded-xl hover:bg-[#003D99] transition-colors cursor-pointer"
          >
            Retry
          </button>
          <Link
            href="/gadgetiq/reports/laptop"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#F4F6FB] border border-[#DDE4F3] text-[#17284D] text-xs font-bold rounded-xl hover:bg-[#E9EEF9] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Reports</span>
          </Link>
        </div>
      </div>
    );
  }

  return <LaptopCertificateView data={certData} />;
}

export default function LaptopCertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-3">
          <RefreshCw className="w-9 h-9 animate-spin text-[#0052CC]" />
          <p className="text-xs font-bold text-[#17284D]">
            Loading Laptop QC Certificate...
          </p>
        </div>
      }
    >
      <LaptopCertificateContent />
    </Suspense>
  );
}
