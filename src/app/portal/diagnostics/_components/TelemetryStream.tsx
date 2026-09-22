"use client";

import React, { useEffect, useRef } from "react";
import { Terminal, Activity, ShieldCheck, Download } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { LogMessage } from "../_hooks/useDiagnosticRunner";

interface TelemetryStreamProps {
  logs: LogMessage[];
  passedCount: number;
  failedCount: number;
  totalChecks: number;
}

export default function TelemetryStream({
  logs,
  passedCount,
  failedCount,
  totalChecks,
}: TelemetryStreamProps) {
  const logEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <Card padding="none" className="bg-[#0B1220] border-slate-800 text-slate-200">
      {/* Stream Header */}
      <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-100">
            Live Hardware Telemetry Bus (tty/diag0)
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <span className="text-emerald-400">✓ {passedCount} Pass</span>
          {failedCount > 0 && (
            <span className="text-amber-400">⚠ {failedCount} Degraded</span>
          )}
          <span className="text-slate-400">
            {passedCount + failedCount}/{totalChecks} Completed
          </span>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="p-4 font-mono text-xs max-h-56 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
        {logs.length === 0 ? (
          <p className="text-slate-500 italic">
            Engine standby. Click "Start 64-Pt Test" above to stream live sensor telemetry.
          </p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start space-x-2 leading-relaxed">
              <span className="text-slate-500 select-none">[{log.time}]</span>
              <span
                className={
                  log.type === "success"
                    ? "text-emerald-400 font-semibold"
                    : log.type === "warning"
                    ? "text-amber-300 font-semibold"
                    : log.type === "error"
                    ? "text-rose-400 font-semibold"
                    : "text-slate-300"
                }
              >
                {log.text}
              </span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </Card>
  );
}
