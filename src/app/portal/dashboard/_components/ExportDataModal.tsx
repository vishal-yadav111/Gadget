"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Download, FileText, CheckCircle2, FileSpreadsheet, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportDataModal({ isOpen, onClose }: ExportDataModalProps) {
  const [format, setFormat] = useState<"csv" | "pdf" | "json">("csv");
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      // Create synthetic CSV download
      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Audit ID,Device Model,Brand,Serial,Score,Grade,Technician,Station,Timestamp\n" +
        "ACT-9021,MacBook Pro 16 M3 Pro,Apple,XC-AP-99210,98,Grade A,Akhil G.,Bay 01,Today 14:42\n" +
        "ACT-9020,ThinkPad X1 Carbon Gen 11,Lenovo,XC-LN-44120,92,Grade A,Rohan S.,Bay 03,Today 14:36\n" +
        "ACT-9019,Dell Latitude 5440,Dell,XC-DL-11029,84,Grade B,Priya M.,Bay 02,Today 14:28\n" +
        "ACT-9018,Samsung Galaxy S24 Ultra,Samsung,XC-SM-88491,96,Grade A,Akhil G.,Bay 01,Today 14:21\n" +
        "ACT-9017,HP EliteBook 840 G10,HP,XC-HP-33291,89,Grade B,Rohan S.,Bay 04,Today 14:15\n";

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `GadgetEvaluate_Telemetry_Batch_${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#DDE4F3] shadow-2xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0052CC] flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#17284D]">
                Export Diagnostic Telemetry
              </h3>
              <p className="text-xs text-[#5F6A86]">
                Generate certified audit archive
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-[#17284D] block">
            Select Archive Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormat("csv")}
              className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                format === "csv"
                  ? "bg-blue-50 border-[#0052CC] text-[#0052CC] ring-1 ring-[#0052CC]"
                  : "bg-white border-[#DDE4F3] text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>CSV Spreadsheet</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat("pdf")}
              className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                format === "pdf"
                  ? "bg-blue-50 border-[#0052CC] text-[#0052CC] ring-1 ring-[#0052CC]"
                  : "bg-white border-[#DDE4F3] text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-5 h-5 text-red-600" />
              <span>PDF Report</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat("json")}
              className={`p-3 rounded-xl border text-center text-xs font-semibold flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all ${
                format === "json"
                  ? "bg-blue-50 border-[#0052CC] text-[#0052CC] ring-1 ring-[#0052CC]"
                  : "bg-white border-[#DDE4F3] text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <span>JSON Telemetry</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">Dataset Summary:</span>
            <div className="flex justify-between">
              <span>Records included:</span>
              <strong className="font-mono">1,428 devices</strong>
            </div>
            <div className="flex justify-between">
              <span>Standard:</span>
              <strong className="font-mono">NIST SP 800-88 Compliant</strong>
            </div>
          </div>

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Export generated! Downloading file...</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="accent"
            size="md"
            onClick={handleDownload}
            loading={downloading}
            icon={<Download className="w-4 h-4" />}
          >
            Download Export
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
