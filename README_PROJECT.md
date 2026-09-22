# 🛡️ Gadget Evaluate — Enterprise SaaS Diagnostics Portal

> **Official Hardware Diagnostic, 64-Point Audit Suite & Device Grading SaaS Platform**  
> *Parent Company: XtraCover Technologies Private Limited*  
> *Tagline: **Reuse. Extend. Save.***

---

## 📖 Table of Contents
1. [Executive Overview](#-executive-overview)
2. [Technology Stack](#-technology-stack)
3. [Design System & Brand Specifications](#-design-system--brand-specifications)
4. [Project Directory & File Structure](#-project-directory--file-structure)
5. [Enterprise Portal Modules & Features](#-enterprise-portal-modules--features)
   - [Operations Dashboard (`/portal/dashboard`)](#1-operations-dashboard-portaldashboard)
   - [Live 64-Point Diagnostic Suite (`/portal/diagnostics`)](#2-live-64-point-diagnostic-suite-portaldiagnostics)
   - [Device Fleet & Inventory (`/portal/devices`)](#3-device-fleet--inventory-portaldevices)
   - [Audit Reports & Digital Certificates (`/portal/reports`)](#4-audit-reports--digital-certificates-portalreports)
   - [Quality Telemetry & Defect Analytics (`/portal/analytics`)](#5-quality-telemetry--defect-analytics-portalanalytics)
   - [Settings, QC Tolerances & API Keys (`/portal/settings`)](#6-settings-qc-tolerances--api-keys-portalsettings)
   - [Authentication & Onboarding (`/portal/auth`)](#7-authentication--onboarding-portalauth)
6. [Public Marketing Website](#-public-marketing-website)
7. [Installation & Getting Started](#-installation--getting-started)
8. [Architecture & Colocation Guidelines](#-architecture--colocation-guidelines)

---

## 🌟 Executive Overview

**Gadget Evaluate** is an automated enterprise hardware evaluation and certified grading platform built for refurbishment facilities, enterprise trade-ins, IT asset disposition (ITAD), and warranty protection services.

### Core Value Propositions:
- **64-Point Automated Hardware Diagnostics**: Real-time evaluation across 16 critical subsystems (CPU AVX stress, RAM bus bandwidth, NVMe S.M.A.R.T. health, GPU shaders, display sub-pixels, battery chemistry mV balance, biometric enclave, and I/O ports).
- **Cryptographic Audit Certificates**: Immutable SHA-256 sealed digital certificates with tamper-proof QR code verification and 12-month XtraCover warranty stamps.
- **Multi-Rig Fleet Operations**: Real-time multi-station testing bay throughput, automated batch ingestion, and technician velocity tracking.
- **Strict Quality Grading**: Algorithmic classification into **Grade A** (Pristine), **Grade B** (Good/Minor Wear), **Grade C** (Fair/Refurb), and **Quarantine/Defective**.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | High-performance React server and client components |
| **Runtime / UI** | React 19 + TypeScript | Strict typing, robust interfaces, and modern hooks |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`) | Semantic token-driven styling mapped to CSS variables |
| **Animations** | Framer Motion 13 + Lenis | Smooth scrolling, spring transitions, drawer interactions |
| **Iconography** | Lucide React | Clean, modern, unified UI symbols |

---

## 🎨 Design System & Brand Specifications

The project strictly follows the **XtraCover Tech Brand Kit (v3.0)** specification:

### 1. Color Palette (Semantic Tokens)
- **Brand Primary**: Cobalt (`#0052CC` Light / `#6FA6FF` Dark) — Primary actions, structural badges, active navigation.
- **Brand Accent / Action**: Warm Orange-Red (`#FF5630` / `#DE3E1B`) — High-priority CTAs, test scan buttons, urgency actions.
- **Surfaces**: Cool Blue-Tinted Paper (`#F4F6FB` Light / `#0B1220` Dark) with high-contrast card elevation (`#FFFFFF` / `#121B2D`).
- **Status Colors**:
  - `Passed / Grade A`: Emerald (`#00875A`)
  - `Review / Grade C`: Amber (`#8A5600`)
  - `Critical / Quarantine`: Crimson (`#C7300A`)

### 2. Typography
- **Display / Headings**: **Sora** (`font-display`) — Weights: 700 / 800, tracking `-0.022em`.
- **Body & Dense UI**: **Inter** (`font-sans`) — Weights: 400 / 500 / 600.
- **Serials, Telemetry & Code**: **JetBrains Mono** (`font-mono`) — High-readability monospace for cryptographic hashes, IMEIs, and sensor readings.

### 3. Structural Density & Radii
- **Engineered Corner Radius**: 8px standard pill/card radius (`--radius-md`) for an authentic engineering aesthetic.
- **WCAG 2.1 AA Compliance**: All contrast ratios measured and validated for high legibility across light and dark surfaces.

---

## 📁 Project Directory & File Structure

The codebase uses a **feature-first colocated folder architecture** where every page route inside `src/app/portal/` encapsulates its own private `_components/`, `_lib/`, and `_hooks/`:

```
src/
├── app/
│   ├── layout.tsx                                 # Root application HTML shell & fonts
│   ├── globals.css                                # Design tokens, light/dark variables, tailwind theme
│   ├── page.tsx                                   # Public Marketing Landing Page
│   │
│   ├── portal/                                    # Enterprise SaaS Portal
│   │   ├── layout.tsx                             # Master Portal Layout (Sidebar, Header, System Status)
│   │   ├── page.tsx                               # Redirects to /portal/dashboard
│   │   │
│   │   ├── _components/                           # Global Portal Layout Components
│   │   │   ├── PortalSidebar.tsx                  # Collapsible sidebar with navigation & active station status
│   │   │   └── PortalHeader.tsx                   # Universal search (⌘K), scan CTA, notifications, profile
│   │   │
│   │   ├── dashboard/                             # Operations Overview Dashboard
│   │   │   ├── page.tsx                           # Master dashboard view
│   │   │   ├── _lib/dashboard-data.ts             # KPI data models, activity feeds, bay station states
│   │   │   └── _components/
│   │   │       ├── StatCards.tsx                  # KPI metrics (Scanned, Pass Rate, Avg. Speed, Defects)
│   │   │       ├── QuickActionGrid.tsx            # Fast action cards (Scan, Ingest, Verify, Telemetry)
│   │   │       ├── LiveActivityFeed.tsx           # Multi-station real-time audit feed
│   │   │       ├── GradeDistribution.tsx          # 64-point fleet grading ratios (Grade A/B/C/Fail)
│   │   │       └── StationStatus.tsx              # Active hardware diagnostic bays (Bays 01-04)
│   │   │
│   │   ├── diagnostics/                           # Live 64-Point Diagnostic Runner
│   │   │   ├── page.tsx                           # Master diagnostic test console
│   │   │   ├── _lib/diagnostic-suite.ts           # 16 Hardware Subsystems & 64 automated checkpoints
│   │   │   ├── _hooks/useDiagnosticRunner.ts      # Live state machine, elapsed timer, log generator, grading
│   │   │   └── _components/
│   │   │       ├── DeviceIntakeBar.tsx            # Presets (MacBook Pro, ThinkPad, Galaxy, etc.) & scan controls
│   │   │       ├── DiagnosticSuiteRunner.tsx     # 16 test modules with live check badges & spinners
│   │   │       ├── TelemetryStream.tsx            # Terminal log stream with sensor readouts and execution timestamps
│   │   │       └── HealthScoreModal.tsx           # Completion modal with score radial & certificate link
│   │   │
│   │   ├── devices/                               # Device Fleet & Inventory
│   │   │   ├── page.tsx                           # Master fleet ledger view
│   │   │   ├── _lib/devices-data.ts               # Inventory dataset with specs, battery health, S.M.A.R.T.
│   │   │   └── _components/
│   │   │       ├── DeviceFilterToolbar.tsx        # Search and multi-filtering (Brand, Form Factor, Grade)
│   │   │       ├── DeviceDataTable.tsx            # High-density data table with battery wear & inspection trigger
│   │   │       ├── DeviceDetailDrawer.tsx         # Slide-out drawer with 64-point check breakdown
│   │   │       └── BatchIntakeModal.tsx           # Bulk barcode serial intake modal for warehouse queues
│   │   │
│   │   ├── reports/                               # Certified Audit Reports & Certificate Generator
│   │   │   ├── page.tsx                           # Master reports view
│   │   │   ├── _lib/reports-data.ts               # Cryptographic certificate records & SHA-256 hashes
│   │   │   └── _components/
│   │   │       ├── CertificateView.tsx            # Official certificate canvas with QR code, 64-pt seal, warranty stamp
│   │   │       └── ReportListTable.tsx            # Certificate registry ledger table
│   │   │
│   │   ├── analytics/                             # Quality Telemetry & Defect Analytics
│   │   │   ├── page.tsx                           # Master quality analytics dashboard
│   │   │   ├── _lib/analytics-data.ts             # Defect Pareto data, technician velocity, & brand benchmarks
│   │   │   └── _components/
│   │   │       ├── FailureParetoChart.tsx         # Component failure root-cause distribution
│   │   │       ├── TechnicianPerformance.tsx     # Auditor speed, accuracy, and throughput velocity
│   │   │       └── BrandBreakdown.tsx             # Comparative reliability across OEM manufacturers
│   │   │
│   │   ├── settings/                              # Portal Settings, QC Profile Rules & API Keys
│   │   │   ├── page.tsx                           # Master settings view
│   │   │   ├── _lib/settings-data.ts              # API key models, webhooks, team roles, and threshold parameters
│   │   │   └── _components/
│   │   │       ├── ApiKeyManager.tsx              # REST API key token generator (`xc_live_...`) with copy action
│   │   │       ├── QCThresholdEditor.tsx          # Dynamic grading sliders (Battery health % thresholds)
│   │   │       ├── WebhookManager.tsx             # Outbound HTTP POST notification dispatchers
│   │   │       └── TeamManager.tsx                # Auditor team management and RBAC permissions
│   │   │
│   │   └── auth/                                  # Enterprise Authentication
│   │       ├── login/ (page.tsx & _components/LoginForm.tsx)
│   │       └── register/ (page.tsx & _components/RegisterForm.tsx)
│   │
│   └── (marketing)/                               # Public Marketing Sections & Mockups
│       └── ...
│
├── components/                                    # Shared Atomic Design System
│   ├── ui/
│   │   ├── Badge.tsx                              # Tone tokens (success, brand, accent, warning, danger)
│   │   ├── Button.tsx                             # Engineered button with loading states & icons
│   │   ├── Card.tsx                               # Bordered container with hover elevations
│   │   ├── Modal.tsx                              # Accessible animated modal dialogs
│   │   ├── Tabs.tsx                               # Pill and underline navigation tabs
│   │   ├── LaptopMockup.tsx                       # Interactive 3D laptop diagnostic animation
│   │   ├── HealthGauge.tsx                        # Radial score gauge visualizer
│   │   └── DeviceVisualizer.tsx                   # Hardware component exploded view
│   └── layout/
│       ├── Navbar.tsx                             # Public header with direct "Enterprise Portal" CTA
│       ├── Footer.tsx                             # Site footer with brand credentials
│       └── SmoothScroll.tsx                       # Lenis smooth scroll engine
│
└── lib/
    └── utils.ts                                   # Tailwind merge & utility functions
```

---

## 💻 Enterprise Portal Modules & Features

### 1. Operations Dashboard (`/portal/dashboard`)
- **Key Metrics Row**: Total Scanned Devices (`1,428` +18.4%), 64-Point Pass Rate (`94.2%`), Average Speed (`11.8s`), Defect Rate (`3.1%`).
- **Live Activity Feed**: Real-time chronological hardware stream showing recent tests across testing bays.
- **Fleet Grading Breakdown**: Stacked visualizer showing distribution of Grade A (68%), Grade B (21%), Grade C (8%), and Quarantined (3%).
- **Active Testing Rigs**: Real-time status of hardware diagnostic bays (Rig 01 Thunderbolt 4, Rig 02 PCIe/CPU, Rig 03 Display/GPU, Bay 04 Mobile Multi-Dock).

---

### 2. Live 64-Point Diagnostic Suite (`/portal/diagnostics`)
- **16 Subsystems Tested in Real-Time**:
  1. *Operating System & Kernel* (Kernel signature, Secure Boot, ACPI/UEFI tables, TPM 2.0).
  2. *CPU Processor & Cores* (Multi-core AVX stress, L1/L2/L3 cache latency, frequency boost, thermal junction).
  3. *Memory Subsystem* (RAM address bit-pattern scan, bandwidth throughput, SPD EEPROM metadata).
  4. *NVMe / SSD Storage Health* (S.M.A.R.T. raw sectors, PCIe sequential IOPS, NAND flash wear TBW).
  5. *GPU & Video Pipeline* (3D shader mesh, VRAM parity, hardware AV1/HEVC decoders, eDP clock sync).
  6. *Display Panel & Digitizer* (Dead pixel plane scan, 9-point candela/m² uniformity, color accuracy, touch digitizer).
  7. *Battery & Power Management* (Design vs Actual mAh capacity, cycle count, mV cell balance, USB-PD 100W safety).
  8. *Motherboard & System Bus* (PCIe lane width, I2C/SMBus monitor chips, RTC CMOS oscillator, VRM diodes).
  9. *Wireless Wi-Fi 6E/7* (Tri-band 2.4/5/6GHz transmission, RSSI/SNR noise floor, 2x2/4x4 MIMO stream sync).
  10. *Bluetooth 5.3 Radio* (BLE beacon advertising, LDAC/AAC codec bitrate, RF interference coexistence).
  11. *Gigabit Ethernet* (PHY link auto-negotiation, packet loopback zero-loss, Wake-on-LAN filter).
  12. *Keyboard Matrix & Trackpad* (N-key rollover matrix, backlight LED uniformity, haptic gesture grid).
  13. *Webcam & Ambient Sensors* (CMOS image noise, autofocus edge clarity, lux ambient curve, privacy switch).
  14. *Audio DAC, Speakers & Mic* (20Hz–20kHz THD frequency sweep, beamforming noise cancellation, 3.5mm DAC).
  15. *USB / Thunderbolt I/O* (Thunderbolt 4 40Gbps PCIe tunneling, USB 3.2 20Gbps, SD UHS-II, polyfuse protection).
  16. *Biometrics & Security Enclave* (Capacitive fingerprint ridge scan, IR facial dot projector, Secure Enclave SEP).
- **Execution Controller**: Real-time timer, pause/resume/abort actions, live sensor log console, and instant Health Score & Grade calculation modal.

---

### 3. Device Fleet & Inventory (`/portal/devices`)
- **Filterable Fleet Ledger**: Real-time search across serials, IMEIs, models, brands (Apple, Lenovo, Dell, HP, Samsung, Asus, Microsoft), and grades (Grade A, B, C, Quarantine).
- **Device Details Drawer**: Deep slide-out drawer displaying full 64-point checklists, hardware specs, battery wear graphs, and auditor timestamps.
- **Batch Fleet Intake**: Bulk barcode / serial scanning modal with immediate queueing to active test bays.

---

### 4. Audit Reports & Digital Certificates (`/portal/reports`)
- **Official Digital Certificate Canvas**:
  - Gold / Cobalt XtraCover Certified Holographic Stamp.
  - Unique cryptographic SHA-256 verification hash.
  - Scan-ready verification QR Code.
  - Battery wear rating and 64-point sub-system breakdown.
  - 12-Month XtraCover Warranty activation seal.
  - Certified auditor digital signature.
- **Export Capabilities**: Direct print layout (`window.print()`) and signed PDF download action.

---

### 5. Quality Telemetry & Defect Analytics (`/portal/analytics`)
- **Failure Pareto Chart**: Root-cause analysis of top failing hardware components (Battery degradation 38.2%, Display sub-pixels 23.6%, NVMe bad blocks 12.4%, etc.).
- **Technician & Bay Throughput**: Productivity velocity, test pace (seconds per device), and audit accuracy benchmarks.
- **OEM Manufacturer Quality**: Comparative reliability and average health score benchmarks across device brands.

---

### 6. Settings, QC Tolerances & API Keys (`/portal/settings`)
- **REST API Key Management**: Generate scoped API keys (`xc_live_...`) with one-click clipboard copy for ERP/WMS warehouse integrations.
- **Dynamic QC Threshold Editor**: Interactive sliders to adjust minimum battery wear percentages for Grade A/B classification and dead pixel tolerances.
- **Outbound Webhooks**: Dispatch automated HTTP POST webhooks on `diagnostic.completed` and `device.quarantined`.
- **Team & RBAC Roles**: Manage Diagnosticians, Auditors, Lead QC Engineers, and Admins.

---

### 7. Authentication & Onboarding (`/portal/auth`)
- **Enterprise Sign-In (`/portal/auth/login`)**: Secure work email authentication with station rig authorization.
- **Enterprise Registration (`/portal/auth/register`)**: Company onboarding and fleet volume sizing.

---

## 🌐 Public Marketing Website

The root landing page (`/`) provides 18 rich marketing sections showcasing the Gadget Evaluate platform:
- **Hero**: Value proposition with animated live diagnostic laptop visualizer.
- **Video Showcase**: Operational demonstration video player.
- **Why Gadget Evaluate**: 64-point checks vs standard manual audits.
- **Supported Devices**: Multi-category hardware matrix (Laptops, Desktops, Mobiles, Tablets, Servers).
- **Business Solutions**: Workflows for E-commerce Refurbishers, ITAD Recyclers, Retail Trade-in Benches, and Corporate Fleet Managers.
- **Pricing & Plans**: Starter, Professional, and Enterprise volume tiers.
- **Direct Portal Link**: Integrated in both desktop navbar and mobile drawer.

---

## 🚀 Installation & Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm, yarn, or pnpm

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Start Local Development Server
```bash
npm run dev
# or
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public landing page.  
Open [http://localhost:3000/portal/dashboard](http://localhost:3000/portal/dashboard) to view the Enterprise Portal directly.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📐 Architecture & Colocation Guidelines

When adding new features or pages to this repository:
1. **Always colocate private components**: Create a dedicated folder for the route under `src/app/` (e.g. `src/app/portal/my-feature/`).
2. **Subfolder structure**:
   - `_components/` — UI cards, tables, and widgets used strictly on this page.
   - `_lib/` — Mock datasets, calculations, interfaces, and API helpers.
   - `_hooks/` — Page-specific state machines and custom hooks.
3. **Reference Brand Tokens**: Always use semantic variables (`--brand-primary`, `--brand-accent`, `--surface-page`, `--text-primary`) rather than hardcoded hex values.
4. **WCAG 2.1 AA Contrast**: Ensure text contrast clears AA guidelines across all states.

---

*Copyright © 2026 XtraCover Technologies Private Limited. All rights reserved.*
