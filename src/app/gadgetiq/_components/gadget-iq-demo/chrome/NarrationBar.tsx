"use client";

import { Activity, Wand2 } from "lucide-react";
import Button from "@/components/ui/Button";

export function NarrationBar({
  narration,
  gateAction,
  gateGo,
  showDoIt,
  doItDisabled,
  doItForMe,
}: {
  narration: string;
  gateAction: string;
  gateGo: () => void;
  showDoIt: boolean;
  doItDisabled: boolean;
  doItForMe: () => void;
}) {
  return (
    <div className="flex min-h-11 flex-wrap items-center gap-3 rounded-lg border border-[#DDE4F3] bg-white px-4 py-3">
      <Activity size={20} className="shrink-0 text-brand-primary" aria-hidden="true" />
      <p aria-live="polite" role="status" className="m-0 flex-1 basis-60 text-base font-medium leading-snug">
        {narration}
      </p>
      {!!gateAction && (
        <Button variant="primary" size="sm" onClick={gateGo}>
          {gateAction}
        </Button>
      )}
      {showDoIt && (
        <Button variant="secondary" size="sm" disabled={doItDisabled} onClick={doItForMe} icon={<Wand2 size={16} />}>
          Do it for me
        </Button>
      )}
    </div>
  );
}
