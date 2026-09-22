"use client";

import React, { useState } from "react";
import ApiKeyManager from "./_components/ApiKeyManager";
import QCThresholdEditor from "./_components/QCThresholdEditor";
import WebhookManager from "./_components/WebhookManager";
import TeamManager from "./_components/TeamManager";
import Tabs from "@/components/ui/Tabs";
import { Settings, Key, Sliders, Webhook, Users } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("api");

  const tabs = [
    { id: "api", label: "API Keys & Access", icon: <Key className="w-3.5 h-3.5" /> },
    { id: "qc", label: "QC Threshold Rules", icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: "webhooks", label: "Webhooks", icon: <Webhook className="w-3.5 h-3.5" /> },
    { id: "team", label: "Team & Roles", icon: <Users className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#DDE4F3] shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-display text-[#17284D] tracking-tight">
            Portal Settings & System Integrations
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6A86] mt-0.5">
            Configure machine access tokens, QC threshold profiles, and operational team roles
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Badge tone="brand" size="md">
            Environment: Production Hub
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Contents */}
      {activeTab === "api" && <ApiKeyManager />}
      {activeTab === "qc" && <QCThresholdEditor />}
      {activeTab === "webhooks" && <WebhookManager />}
      {activeTab === "team" && <TeamManager />}
    </div>
  );
}
