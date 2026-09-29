"use client";

import { Button } from "../ui";
import { Ico } from "../icons";

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
    <div className="box-content flex min-h-11 flex-wrap items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-card)] px-4 py-3">
      <Ico name="wave" size={20} color="var(--brand-primary)" />
      <p aria-live="polite" role="status" className="m-0 flex-1 basis-[240px] text-base font-medium leading-[1.45] [text-wrap:pretty]">
        {narration}
      </p>
      {!!gateAction && (
        <Button variant="primary" size="sm" onClick={gateGo}>
          {gateAction}
        </Button>
      )}
      {showDoIt && (
        <Button variant="secondary" size="sm" disabled={doItDisabled} onClick={doItForMe} icon={<Ico name="robot" />}>
          Do it for me
        </Button>
      )}
    </div>
  );
}
