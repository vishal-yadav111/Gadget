"use client";

import React, { useState } from "react";
import { Users, UserPlus, Mail, Shield } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { initialTeam, TeamMember } from "../_lib/settings-data";

export default function TeamManager() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [showInvite, setShowInvite] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMember["role"]>("Technician");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name,
      email,
      role,
      stationAssigned: "Rig Unassigned",
      status: "Invited",
    };

    setTeam([...team, newMember]);
    setName("");
    setEmail("");
    setShowInvite(false);
  };

  return (
    <Card padding="md" className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#DDE4F3]">
        <div>
          <h3 className="font-bold font-display text-sm sm:text-base text-[#17284D]">
            Auditors & Diagnostics Team Roles
          </h3>
          <p className="text-xs text-[#5F6A86] mt-0.5">
            Manage station assignments, auditor certificates, and access permissions
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<UserPlus className="w-3.5 h-3.5" />}
          onClick={() => setShowInvite(!showInvite)}
        >
          Invite Member
        </Button>
      </div>

      {showInvite && (
        <form
          onSubmit={handleInvite}
          className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3"
        >
          <h4 className="text-xs font-bold text-[#17284D]">
            Invite Team Diagnostician
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-[#DDE4F3] rounded-lg text-[#17284D]"
              required
            />
            <input
              type="email"
              placeholder="name@xtracover.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-[#DDE4F3] rounded-lg text-[#17284D]"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-white border border-[#DDE4F3] rounded-lg text-[#17284D]"
            >
              <option value="Technician">Technician</option>
              <option value="Auditor">Auditor</option>
              <option value="Lead QC Engineer">Lead QC Engineer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-1">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setShowInvite(false)}
            >
              Cancel
            </Button>
            <Button variant="accent" size="sm" type="submit">
              Send Invite
            </Button>
          </div>
        </form>
      )}

      <div className="divide-y divide-[#DDE4F3]">
        {team.map((m) => (
          <div
            key={m.id}
            className="py-3 flex items-center justify-between gap-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0052CC] font-bold text-xs flex items-center justify-center shrink-0">
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <span className="font-bold text-xs text-[#17284D] block">
                  {m.name}
                </span>
                <span className="text-[11px] text-[#5F6A86] block">
                  {m.email} • {m.stationAssigned}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge
                tone={
                  m.role === "Lead QC Engineer"
                    ? "accent"
                    : m.role === "Admin"
                    ? "brand"
                    : "neutral"
                }
                size="sm"
              >
                {m.role}
              </Badge>
              <Badge tone="success" size="sm">
                {m.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
