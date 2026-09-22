"use client";

import React, { useState } from "react";
import { Key, Copy, Check, Plus, Trash2, ShieldCheck, Terminal } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { ApiKeyItem, initialApiKeys } from "../_lib/settings-data";

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKeyItem[]>(initialApiKeys);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const newKey: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      keyPrefix: "xc_live_" + Math.random().toString(36).substring(2, 6) + "...",
      fullKeyMock: "xc_live_" + Math.random().toString(36).substring(2, 12) + "9948201948201948",
      scope: "Read & Write (Full Diagnostic Access)",
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Just now",
      status: "active",
    };

    setKeys([newKey, ...keys]);
    setNewKeyName("");
    setShowAddForm(false);
  };

  const handleRevoke = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
  };

  return (
    <Card padding="md" className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
        <div>
          <h3 className="font-bold font-display text-sm sm:text-base text-[#17284D]">
            REST API Keys & Machine Access
          </h3>
          <p className="text-xs text-[#5F6A86] mt-0.5">
            Authenticate automated testing rigs, warehouse WMS, and ERP systems
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          Generate New Key
        </Button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleCreateKey}
          className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3"
        >
          <h4 className="text-xs font-bold text-[#17284D]">
            Create API Token
          </h4>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Warehouse Rig 05 Barcode Ingest"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#DDE4F3] rounded-lg text-[#17284D] focus:outline-none focus:border-[#0052CC]"
              required
            />
            <Button variant="accent" size="sm" type="submit">
              Save & Authorize
            </Button>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Keys Table */}
      <div className="divide-y divide-[#DDE4F3]">
        {keys.map((k) => (
          <div
            key={k.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-[#17284D]">
                  {k.name}
                </span>
                <Badge tone="brand" size="sm">
                  {k.scope.split(" ")[0]}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-[#5F6A86] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {k.keyPrefix}
                </span>
                <button
                  onClick={() => handleCopy(k.id, k.fullKeyMock)}
                  className="p-1 text-[#0052CC] hover:text-[#003D99] transition-colors cursor-pointer"
                  title="Copy full key"
                >
                  {copiedId === k.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-[#5F6A86]">
                Created: {k.createdAt} • Last used: {k.lastUsed}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleRevoke(k.id)}
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors text-xs font-semibold flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Revoke</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
