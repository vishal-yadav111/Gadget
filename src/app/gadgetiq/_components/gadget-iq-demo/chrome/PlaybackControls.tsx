"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import Button from "@/components/ui/Button";
import { Segmented, Kbd } from "../ui";

export function PlaybackControls({
  playing,
  playLabel,
  onTogglePlay,
  speedVal,
  onSetSpeed,
  onPrev,
  onNext,
  onRestart,
  showKbd,
}: {
  playing: boolean;
  playLabel: string;
  onTogglePlay: () => void;
  speedVal: "1x" | "2x";
  onSetSpeed: (v: "1x" | "2x") => void;
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
  showKbd: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <Button variant="primary" onClick={onTogglePlay} icon={playing ? <Pause size={16} /> : <Play size={16} />}>
        {playLabel}
      </Button>
      <Segmented options={["1x", "2x"] as const} value={speedVal} onChange={onSetSpeed} ariaLabel="Speed" size="sm" />
      <Button variant="ghost" onClick={onPrev} aria-label="Previous step" icon={<SkipBack size={18} />} />
      <Button variant="ghost" onClick={onNext} aria-label="Next step" icon={<SkipForward size={18} />} />
      <Button variant="ghost" onClick={onRestart} icon={<RotateCcw size={18} />}>
        Restart
      </Button>
      <span className="flex-1" />
      {showKbd && (
        <span className="flex items-center gap-1.5 text-xs text-[#5F6A86]">
          <Kbd>Space</Kbd> play or pause
          <Kbd>←</Kbd>
          <Kbd>→</Kbd> steps
        </span>
      )}
    </div>
  );
}
