"use client";

import React, { useState } from "react";
import { Webhook, Plus, Trash2, CheckCircle2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { initialWebhooks, WebhookEndpoint } from "../_lib/settings-data";

export default function WebhookManager() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(initialWebhooks);
  const [showAdd, setShowAdd] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const newWh: WebhookEndpoint = {
      id: `wh-${Date.now()}`,
      url: newUrl,
      events: ["diagnostic.completed", "certificate.issued"],
      status: "active",
      lastDelivery: "Just created",
    };

    setWebhooks([...webhooks, newWh]);
    setNewUrl("");
    setShowAdd(false);
  };

  return (
    <Card padding="md" className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
        <div>
          <h3 className="font-bold font-display text-sm sm:text-base text-[#17284D]">
            Outbound Webhook Dispatchers
          </h3>
          <p className="text-xs text-[#5F6A86] mt-0.5">
            Receive automated HTTP POST notifications upon diagnostic completion
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setShowAdd(!showAdd)}
        >
          Add Endpoint
        </Button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3"
        >
          <h4 className="text-xs font-bold text-[#17284D]">
            Register Webhook URL
          </h4>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://your-server.com/api/webhooks"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#DDE4F3] rounded-lg text-[#17284D] focus:outline-none focus:border-[#0052CC]"
              required
            />
            <Button variant="accent" size="sm" type="submit">
              Save Webhook
            </Button>
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="divide-y divide-[#DDE4F3]">
        {webhooks.map((wh) => (
          <div
            key={wh.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-xs text-[#17284D] truncate max-w-sm">
                  {wh.url}
                </span>
                <Badge tone="success" size="sm" dot>
                  Active
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-[11px] text-[#5F6A86]">
                <span>Events:</span>
                {wh.events.map((ev) => (
                  <span
                    key={ev}
                    className="bg-slate-100 px-1.5 py-0.2 rounded font-mono text-[10px] text-[#0052CC]"
                  >
                    {ev}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-[#5F6A86]">
                Last delivery: {wh.lastDelivery}
              </p>
            </div>

            <button
              onClick={() => setWebhooks(webhooks.filter((w) => w.id !== wh.id))}
              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center space-x-1 self-start sm:self-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
