"use client";

import React, { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, Loader2, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface BatchIntakeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

export default function BatchIntakeModal({
  open,
  onClose,
  onSuccess,
}: BatchIntakeModalProps) {
  const [batchName, setBatchName] = useState("BATCH-850 (Enterprise Return Fleet)");
  const [deviceType, setDeviceType] = useState("Laptop");
  const [serialsText, setSerialsText] = useState(
    "XC-AP-992104\nXC-LN-883192\nXC-DL-441029\nXC-HP-771920\nXC-AP-102934"
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(5);
      onClose();
    }, 800);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Batch Fleet Intake"
      description="Queue multiple devices for automated 64-point diagnostic evaluation"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#17284D] block mb-1">
            Batch Reference ID / Label
          </label>
          <input
            type="text"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] focus:outline-none focus:border-[#0052CC]"
            required
          />
        </div>

        <div>
          <label className="text-xs font-bold text-[#17284D] block mb-1">
            Device Category
          </label>
          <select
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] focus:outline-none focus:border-[#0052CC]"
          >
            <option value="Laptop">Laptops (MacBook, ThinkPad, Dell Latitude)</option>
            <option value="Smartphone">Smartphones (iPhone, Galaxy, Pixel)</option>
            <option value="Tablet">Tablets (iPad, Surface Pro)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-[#17284D] block mb-1">
            Paste Barcode Serials / IMEIs (One per line)
          </label>
          <textarea
            rows={5}
            value={serialsText}
            onChange={(e) => setSerialsText(e.target.value)}
            className="w-full p-3 font-mono text-xs bg-[#F4F6FB] border border-[#DDE4F3] rounded-lg text-[#17284D] focus:outline-none focus:border-[#0052CC]"
            placeholder="Scan or paste serial numbers..."
          />
        </div>

        <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-xs text-[#0052CC] flex items-center space-x-2">
          <FileSpreadsheet className="w-4 h-4 shrink-0" />
          <span>5 devices will be queued to active diagnostic test bays.</span>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-2">
          <Button variant="secondary" size="md" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="accent"
            size="md"
            type="submit"
            loading={loading}
            icon={<Plus className="w-4 h-4 text-white" />}
          >
            Queue Batch for Diagnostic
          </Button>
        </div>
      </form>
    </Modal>
  );
}
