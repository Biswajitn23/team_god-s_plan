# 🌿 Ayu-Setu

### **Digital Traceability & Supply Chain Platform for India's Herbal Ecosystem**

> **From collection to consumer — connecting every stakeholder, tracking every batch, and building trust through digital traceability.**

<p align="center">
  <img src="app/src/assets/ayuestufrontpage.png" alt="Ayu-Setu Platform" width="900">
</p>

<p align="center">
  <b>🌱 Farmer &nbsp;→&nbsp; 📦 Aggregator &nbsp;→&nbsp; 🚚 Distributor &nbsp;→&nbsp; ⚙️ Processor &nbsp;→&nbsp; 🏭 Manufacturer &nbsp;→&nbsp; 🔎 Consumer</b>
</p>

---

## 🚀 Overview

**Ayu-Setu** is a digital platform designed to bring transparency, traceability, accessibility, and market connectivity to India's herbal and medicinal plant supply chain.

The platform connects different stakeholders through a common digital ecosystem and gives each batch a unique digital identity that can be used throughout its journey.

### The core idea is simple:

```text
🌱 Origin
   ↓
📦 Batch Creation
   ↓
🔐 Unique Batch Identity
   ↓
🔄 Supply Chain Tracking
   ↓
🏭 Processing & Manufacturing
   ↓
📦 Final Product
   ↓
📱 QR Verification
   ↓
🔎 Trust
```

Ayu-Setu consists of **two interconnected applications**:

* **`app/`** → Farmer-facing application
* **`web/`** → Role-based supply-chain portal

---

# 🎯 Problem

India has a vast ecosystem of medicinal plants, herbs, traditional products, farmers, collectors, processors and manufacturers.

However, information across the supply chain can become fragmented.

This creates problems such as:

* Lack of end-to-end traceability
* Fragmented batch records
* Difficulty verifying origin
* Manual record keeping
* Limited visibility between stakeholders
* Limited market connectivity for farmers
* Language barriers for users
* Difficulty establishing trust in the final product

When information is disconnected, it becomes difficult to answer a simple question:

> **"Where did this product actually come from?"**

---

# 💡 Our Solution

Ayu-Setu creates a **digital identity for the supply-chain journey of a batch**.

Each batch can be associated with a unique **Batch ID** and **QR code**.

As the batch moves through different stages, its information can be connected to the digital record.

```text
                AYU-SETU
                   │
                   ▼
              🌱 FARMER
                   │
                   ▼
             📦 AGGREGATOR
                   │
                   ▼
             🚚 DISTRIBUTOR
                   │
                   ▼
              ⚙️ PROCESSOR
                   │
                   ▼
            🏭 MANUFACTURER
                   │
                   ▼
             🌿 PRODUCT
                   │
                   ▼
             📱 QR CODE
                   │
                   ▼
          🔎 PUBLIC VERIFICATION
```

The objective is to make **trust travel with the product**.

---

# 🏗️ Platform Architecture

```text
                         AYU-SETU
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       ┌──────────────┐            ┌──────────────┐
       │   FARMER APP │            │ SUPPLY CHAIN │
       │     /app     │            │    PORTAL    │
       │              │            │     /web     │
       └──────┬───────┘            └──────┬───────┘
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │ Data Layer   │
                    │ Firebase /   │
                    │ Supabase     │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          Batch Data      AI       Language Layer
             │             │             │
             ▼             ▼             ▼
          QR System    Gemini / AI    Bhashini
             │
             ▼
       Public Verification
```

---

# 📱 1. Farmer Application

Directory:

```text
/app
```

The farmer application is designed for field-level users and provides a simplified interface for registering collections, managing batches, accessing records and interacting with the platform.

## Key Features

### 👨‍🌾 Farmer Authentication

Secure authentication and farmer-specific access through the application's authentication context.

```text
src/context/AuthContext.tsx
src/pages/Login.tsx
```

---

### 🌱 Collection Registration

Farmers can register collection events digitally.

```text
src/components/forms/CollectionEventForm.tsx
```

This provides the foundation for creating a traceable batch record.

---

### 📦 Batch Management

Collection information can be associated with a unique batch identifier.

The **batch acts as the core traceability unit** of the platform.

---

### 🔳 QR Code Generation

The application contains a dedicated QR generator:

```text
src/components/QRGenerator.tsx
```

QR codes can be associated with batches and used for later verification.

---

### 🔎 Public Batch Verification

The application contains a dynamic batch verification route:

```text
src/pages/view/[batch_id].tsx
```

The basic flow is:

```text
Scan QR
   ↓
Batch ID
   ↓
/view/{batch_id}
   ↓
Batch Information
```

---

### 🌐 Multilingual Support

Ayu-Setu is designed for India's multilingual user base.

Current translation resources include:

* English
* Hindi
* Bengali
* Gujarati
* Kannada
* Malayalam
* Marathi
* Odia
* Punjabi
* Tamil
* Telugu

Translation files are maintained under:

```text
src/translations/
public/translations/
```

---

### 🗣️ Language & Voice Support

The platform contains dedicated language and text-to-speech architecture.

```text
src/context/LanguageContext.tsx
src/context/TTSContext.tsx
src/services/translation.ts
src/services/bhashini.ts
```

This helps make the system more accessible to users who may prefer regional languages or voice interaction.

---

### 🤖 AI Integration

The project contains a modular AI service layer:

```text
src/services/
├── ai.ts
├── gemini.ts
├── mockAi.ts
└── openrouter.ts
```

This allows AI-powered capabilities to be extended without tightly coupling the application to a single provider.

---

# 🖥️ 2. Supply Chain Portal

Directory:

```text
/web
```

The second application provides role-based interfaces for the wider supply chain.

### Supported Roles

```text
👨‍🌾 Farmer
📦 Aggregator
🚚 Distributor
⚙️ Processor
🏭 Manufacturer
```

Role-specific interfaces are implemented under:

```text
web/src/components/roles/
```

---

## 📦 Aggregator

Aggregators can operate between farmers and downstream stakeholders.

```text
web/src/components/roles/AggregatorView.tsx
```

The aggregator layer helps organize farmer and batch-related operations.

---

## 🚚 Distributor

The distributor represents the movement of batches through the supply chain.

```text
web/src/components/roles/DistributorView.tsx
```

---

## ⚙️ Processor

The processor represents the transformation or processing stage of the supply chain.

```text
web/src/components/roles/ProcessorView.tsx
```

---

## 🏭 Manufacturer

The manufacturer represents the downstream production stage.

```text
web/src/components/roles/ManufacturerView.tsx
```

---

## 👨‍🌾 Farmer

The supply-chain portal also provides a dedicated farmer role:

```text
web/src/components/roles/FarmerView.tsx
```

---

# 🔎 Public Verification

The supply-chain portal contains a dedicated public verification page:

```text
web/src/pages/PublicVerifyPage.tsx
```

This provides a public-facing interface for verifying batch/product information.

### Verification Flow

```text
             📱 SCAN QR
                  │
                  ▼
          🔎 VERIFY BATCH
                  │
                  ▼
          📦 BATCH DETAILS
                  │
                  ▼
       🌱 TRACEABILITY DATA
                  │
                  ▼
              ✅ TRUST
```

---

# 🧬 Batch Traceability

The **batch** is the central object around which the traceability system is designed.

A batch can conceptually contain:

```text
Batch ID
   │
   ├── Origin
   ├── Farmer / Collector
   ├── Collection Information
   ├── Supply Chain Events
   ├── Processing Information
   ├── Product Association
   └── Verification
```

This architecture provides a foundation for progressively adding more supply-chain events as the batch moves from origin to final product.

---

# 🌐 Multilingual Architecture

Ayu-Setu includes language resources for multiple Indian languages.

| Language  | Code |
| --------- | ---- |
| English   | `en` |
| Hindi     | `hi` |
| Bengali   | `bn` |
| Gujarati  | `gu` |
| Kannada   | `kn` |
| Malayalam | `ml` |
| Marathi   | `mr` |
| Odia      | `or` |
| Punjabi   | `pa` |
| Tamil     | `ta` |
| Telugu    | `te` |

The platform also includes integration points for:

* Bhashini
* Translation services
* LibreTrans
* Text-to-Speech

---

# 🤖 AI Architecture

```text
                    AI LAYER
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
       Gemini      OpenRouter    Mock AI
          │            │            │
          └────────────┼────────────┘
                       │
                       ▼
                 AYU-SETU APP
```

The modular architecture makes it possible to add or replace AI providers without redesigning the entire frontend.

---

# 🗄️ Data & Backend

The project contains integrations for:

### Firebase

```text
app/src/lib/firebase.ts
web/src/integrations/firebase/client.ts
```

### Supabase

```text
app/src/lib/supabase.ts
web/src/integrations/supabase/
```

### Storage

```text
app/src/lib/s3.ts
```

The separation of backend integrations from UI components helps keep the application modular and maintainable.

---

# 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* Radix UI
* React Router
* React Hook Form
* Zod
* Lucide React
* Recharts

### Backend / Data

* Firebase
* Firestore
* Supabase

### AI

* Google Gemini
* OpenRouter
* Mock AI service

### Language

* Bhashini
* Translation Service
* LibreTrans
* Text-to-Speech

### Storage

* AWS S3

### Utilities

* QR Code
* Local Storage
* Service Worker / PWA support

---

# 📁 Repository Structure

```text
team_god-s_plan/
│
├── app/                         # Farmer-facing application
│   │
│   ├── public/
│   │   ├── icons/
│   │   └── translations/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── chatbot/
│   │   │   ├── forms/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   └── translations/
│   │
│   └── package.json
│
├── web/                        # Supply-chain portal
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── roles/
│   │   │   │   ├── AggregatorView.tsx
│   │   │   │   ├── DistributorView.tsx
│   │   │   │   ├── FarmerView.tsx
│   │   │   │   ├── ManufacturerView.tsx
│   │   │   │   └── ProcessorView.tsx
│   │   │   └── ui/
│   │   │
│   │   ├── hooks/
│   │   ├── integrations/
│   │   ├── lib/
│   │   └── pages/
│   │
│   └── package.json
│
├── LICENSE
├── SECURITY.md
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/Biswajitn23/team_god-s_plan.git

cd team_god-s_plan
```

---

## 2. Run the Farmer Application

```bash
cd app
npm install
npm run dev
```

---

## 3. Run the Supply Chain Portal

Open another terminal:

```bash
cd web
npm install
npm run dev
```

---

# 🔐 Environment Configuration

Configure the required environment variables for the services used by the application, including:

* Firebase
* Supabase
* AI providers
* Bhashini
* AWS S3
* Other external services

Create the appropriate `.env` configuration for local development.

> **Never commit API keys, private tokens, service credentials or other secrets to GitHub.**

---

# 📦 Production Build

For either application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

---

# 🔄 End-to-End Workflow

```text
                    🌱 FARMER
                       │
                       ▼
              Register Collection
                       │
                       ▼
                  CREATE BATCH
                       │
                       ▼
                UNIQUE BATCH ID
                       │
                       ▼
                    QR CODE
                       │
                       ▼
                 📦 AGGREGATOR
                       │
                       ▼
                 🚚 DISTRIBUTOR
                       │
                       ▼
                  ⚙️ PROCESSOR
                       │
                       ▼
                🏭 MANUFACTURER
                       │
                       ▼
                  🌿 PRODUCT
                       │
                       ▼
                  📱 QR SCAN
                       │
                       ▼
              🔎 VERIFICATION
                       │
                       ▼
                    ✅ TRUST
```

---

# 🔮 Future Scope

Ayu-Setu is designed as a foundation that can be extended into a larger national-scale traceability ecosystem.

### 🗺️ Geo-Tagged Collection

Associate collection events with geographical origin.

### 🧪 Quality Verification

Integrate:

* Laboratory reports
* Quality certificates
* Testing information
* Batch quality metrics

### ⛓️ Immutable Ledger

Future versions can explore blockchain or other immutable-ledger technologies for tamper-evident anchoring of critical supply-chain events.

> Blockchain is a **future extension** of the architecture and is not represented as an already-implemented feature in the current codebase.

### 📡 Offline-First Field Collection

Allow field-level users to capture data without continuous connectivity and synchronize when connectivity is restored.

### 📊 Supply Chain Analytics

Future analytics can provide:

* Regional collection trends
* Buyer demand
* Batch movement
* Processing volume
* Market trends
* Supply-chain performance

### 🔗 Ecosystem Integration

The platform can eventually integrate with government, industry and other digital infrastructure to support interoperable traceability.

---

# 🌟 Why Ayu-Setu?

Ayu-Setu is built around one principle:

## **Trust should travel with the product.**

### 🌱 Farmers

Digital collection records, identity and market connectivity.

### 📦 Aggregators

Structured farmer and batch management.

### 🚚 Distributors

Improved visibility of batch movement.

### ⚙️ Processors

Digital association between incoming material and processing stages.

### 🏭 Manufacturers

Better visibility into material origin and supply-chain history.

### 🔎 Buyers & Consumers

QR-based access to verification information.

---

# 🎯 Vision

### **Origin → Identity → Traceability → Trust**

Ayu-Setu aims to create a more:

**Transparent · Connected · Accessible · Verifiable · Farmer-centric**

herbal supply-chain ecosystem.

---

# 👥 Team

## Team God's Plan

Built with ❤️ for innovation, technology and India's herbal ecosystem.

---

# 📄 License

This project is licensed under the terms specified in the repository's [`LICENSE`](LICENSE) file.

---

## ⭐ Support the Project

If you find this project useful:

* ⭐ Star the repository
* 🍴 Fork the project
* 🐛 Report issues
* 💡 Suggest improvements
* 🔧 Submit pull requests

---

# 🌿 Ayu-Setu

### **Connecting Origin. Building Trust. Enabling Traceability.**
