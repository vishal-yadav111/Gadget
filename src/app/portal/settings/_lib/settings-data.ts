export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
  fullKeyMock: string;
  scope: "Read & Write (Full Diagnostic Access)" | "Read Only (Report Verification)";
  createdAt: string;
  lastUsed: string;
  status: "active" | "revoked";
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: "active" | "failing";
  lastDelivery: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Lead QC Engineer" | "Technician" | "Auditor";
  stationAssigned: string;
  status: "Active" | "Invited";
}

export const initialApiKeys: ApiKeyItem[] = [
  {
    id: "key-1",
    name: "Warehouse ERP Sync Key",
    keyPrefix: "xc_live_9948...",
    fullKeyMock: "xc_live_99482019482019481029384710293847",
    scope: "Read & Write (Full Diagnostic Access)",
    createdAt: "2026-08-15",
    lastUsed: "3 mins ago",
    status: "active",
  },
  {
    id: "key-2",
    name: "Customer Portal Certificate Verifier",
    keyPrefix: "xc_live_7720...",
    fullKeyMock: "xc_live_77201948201938471029384710293847",
    scope: "Read Only (Report Verification)",
    createdAt: "2026-08-20",
    lastUsed: "22 mins ago",
    status: "active",
  },
  {
    id: "key-3",
    name: "Testing Sandbox Token",
    keyPrefix: "xc_test_3882...",
    fullKeyMock: "xc_test_38820491029384710293847102938471",
    scope: "Read & Write (Full Diagnostic Access)",
    createdAt: "2026-09-01",
    lastUsed: "1 day ago",
    status: "active",
  },
];

export const initialWebhooks: WebhookEndpoint[] = [
  {
    id: "wh-1",
    url: "https://api.xtracover.com/v1/webhooks/diagnostic-completed",
    events: ["diagnostic.completed", "certificate.issued"],
    status: "active",
    lastDelivery: "2 mins ago (200 OK)",
  },
  {
    id: "wh-2",
    url: "https://wms.enterprisehub.internal/events/quarantine",
    events: ["device.quarantined"],
    status: "active",
    lastDelivery: "45 mins ago (200 OK)",
  },
];

export const initialTeam: TeamMember[] = [
  { id: "tm-1", name: "Akhil Gupta", email: "akhil.gupta@xtracover.com", role: "Lead QC Engineer", stationAssigned: "Rig 01 (Thunderbolt 4)", status: "Active" },
  { id: "tm-2", name: "Rohan Sharma", email: "rohan.sharma@xtracover.com", role: "Technician", stationAssigned: "Rig 03 (Automated Rig)", status: "Active" },
  { id: "tm-3", name: "Priya Malhotra", email: "priya.m@xtracover.com", role: "Technician", stationAssigned: "Rig 02 (PCIe / CPU)", status: "Active" },
  { id: "tm-4", name: "Vikram Nair", email: "vikram.nair@xtracover.com", role: "Auditor", stationAssigned: "Mobile Dock Bay 04", status: "Active" },
];
