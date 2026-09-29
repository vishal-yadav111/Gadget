"use client";

import { Button, Segmented, Kbd } from "../ui";
import { Ico } from "../icons";

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
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <Button variant="primary" onClick={onTogglePlay} icon={<Ico name={playing ? "pause" : "play"} fill />}>
        {playLabel}
      </Button>
      <Segmented options={["1x", "2x"] as const} value={speedVal} onChange={onSetSpeed} ariaLabel="Speed" size="sm" />
      <Button variant="ghost" onClick={onPrev} aria-label="Previous step" icon={<Ico name="skipPrev" size={18} fill />} />
      <Button variant="ghost" onClick={onNext} aria-label="Next step" icon={<Ico name="skipNext" size={18} fill />} />
      <Button variant="ghost" onClick={onRestart} icon={<Ico name="restart" size={18} />}>
        Restart
      </Button>
      <span className="flex-1" />
      {showKbd && (
        <span className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
          <Kbd>Space</Kbd> play or pause
          <Kbd>←</Kbd>
          <Kbd>→</Kbd> steps
        </span>
      )}
    </div>
  );
}
