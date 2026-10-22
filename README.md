# BiodataCraft — Authentic Indian Marriage Biodata Creator

> **A modern, privacy-first web application designed for Indian families to create dignified, culturally nuanced marriage biodatas.**  
> 100% Free • No Customer Login • Zero Customer Data Stored on Servers • Instant High-Resolution PDF & WhatsApp PNG Export

---

## 1. Project Overview & Philosophy

**BiodataCraft** is purpose-built for Indian weddings, honoring cultural nuance while upholding uncompromising privacy standards. Unlike commercial matrimonial platforms that harvest, store, and monetize personal details and family photographs, BiodataCraft operates on a **client-side synthesis** model.

### Core Architectural Principles
1. **Zero-Storage Customer Privacy**: No customer database table or Firestore collection stores customer biodata documents or family pictures. Everything is synthesized in local browser memory.
2. **No Registration or Login Gates**: Visitors can immediately design, customize, and export biodatas without phone number verification, OTPs, or password barriers.
3. **Authentic Cultural Detail**: Native support for Gotra, Mama Ji (Mosal), Kuldevi/Kuldevta, Kundali, Rashi, Nakshatra, Charan, Gan, Nadi, Manglik status, and sacred Vedic invocations (Ganesh, Radha Krishna, Om, Jain Navkar, Sikh Ik Onkar, Islamic Bismillah).
4. **Bilingual & Multi-Language Support**: Seamlessly switch between English, Hindi (हिंदी), and bilingual biodata formats.
5. **High-Resolution Vector A4 Export**: Generates crisp, standard A4 PDFs (210mm × 297mm) and optimized PNG images formatted specifically for WhatsApp messaging.
6. **Policy-Compliant Monetization**: Optional, non-intrusive Google AdSense units strictly isolated from canvas capture (`no-print`, `data-html2canvas-ignore`) with anti-deception disclosures.

---

## 2. Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Cultural Typography (Cinzel, Rozha One, Playfair Display, Noto Sans Devanagari)
- **Routing**: React Router 7
- **Document & Image Export**:
  - `jspdf`: Standard vector A4 document generator
  - `html2canvas-pro`: High-performance canvas rasterizer supporting modern CSS formats including `oklch`, `oklab`, and `color(display-p3)`
- **Icons**: Lucide React
- **Confetti & Effects**: `canvas-confetti`
- **Backend / Cloud Services**:
  - Firebase SDK (Firestore + Authentication) exclusively used for anonymous aggregate telemetry and administrator settings
  - LocalStorage / SessionStorage for client-side drafts and offline recovery

---

## 3. Project Directory Structure

```
├── .env.example                     # Environment variables template
├── index.html                       # HTML5 entry point with SEO & font tags
├── package.json                     # Project manifest and dependencies
├── tsconfig.json                    # Strict TypeScript configuration
├── vite.config.ts                   # Vite configuration with aliases & chunk splitting
├── public/
│   ├── favicon.svg                  # Golden Om vector favicon
│   ├── robots.txt                   # Search crawler directives
│   ├── sitemap.xml                  # Dynamic comprehensive sitemap
│   └── ads.txt                      # Google AdSense authorized seller declaration
├── src/
│   ├── components/
│   │   ├── ads/                     # Google AdSense units & disclosures
│   │   │   ├── AdSlot.tsx           # Responsive AdSense ad wrapper
│   │   │   └── DownloadInterstitialArea.tsx # Policy-compliant download sponsor slot
│   │   ├── auth/
│   │   │   └── AdminProtectedRoute.tsx # Role-based admin route guard
│   │   ├── biodata-builder/         # Multi-step creation workspace components
│   │   │   ├── Step1BasicInfo.tsx   # Personal details, language & theme selection
│   │   │   ├── Step2FamilyLineage.tsx # Parents, Gotra, Mama Ji & ancestral roots
│   │   │   ├── Step3HoroscopeKundali.tsx # Vedic astrological particulars
│   │   │   ├── Step4PhotoStudio.tsx # Portrait cropper, zoom & aspect frame options
│   │   │   └── Step5CustomFields.tsx# Dynamic user-defined custom sections
│   │   ├── layout/                  # MainLayout, Header, Footer & AdminLayout
│   │   ├── preview/                 # Live preview modal & Download modal
│   │   ├── renderer/                # Modular BiodataRenderer & BiodataPage engines
│   │   ├── templates/               # Cultural template views & themes
│   │   └── ui/                      # Button, Card, Form, Modal, Toast components
│   ├── config/
│   │   ├── adConfig.ts              # AdSense monetization configuration & tiers
│   │   └── firebase.ts              # Secure Firebase client setup
│   ├── context/
│   │   ├── AdContext.tsx            # Global ad settings context
│   │   ├── AdminAuthContext.tsx     # Administrator session context
│   │   └── ToastContext.tsx         # Notification toast system
│   ├── data/
│   │   ├── blogData.ts              # Matrimonial guides & cultural traditions
│   │   ├── initialBiodata.ts        # Default empty & sample biodata structures
│   │   └── templateData.ts          # Curated template metadata & presets
│   ├── hooks/
│   │   └── useSEO.ts                # Metadata & OpenGraph injector
│   ├── pages/                       # Application route pages
│   │   ├── HomePage.tsx             # High-conversion landing page
│   │   ├── CreateBiodataPage.tsx    # 5-step interactive biodata builder
│   │   ├── TemplatesPage.tsx        # Cultural template showcase & filters
│   │   ├── TemplateDetailPage.tsx   # Deep-dive template preview
│   │   ├── BlogPage.tsx & BlogPostPage.tsx # Guides and editorial articles
│   │   ├── AboutPage.tsx, ContactPage.tsx, FaqPage.tsx
│   │   ├── PrivacyPolicyPage.tsx, TermsPage.tsx, RefundPolicyPage.tsx
│   │   ├── seo/                     # High-value regional & caste landing pages
│   │   └── admin/                   # Full administrative dashboard suite
│   ├── services/
│   │   ├── adFlowService.ts         # User journey and monetization flows
│   │   ├── adminAuthService.ts      # Admin authentication and session handling
│   │   ├── adminService.ts          # Global site settings & configuration
│   │   ├── analyticsService.ts      # Privacy-first anonymous event metrics
│   │   ├── pdfService.ts            # Client-side PDF & PNG export with fallback logic
│   │   └── storageService.ts        # Local draft auto-save and privacy cleanup
│   └── types/                       # TypeScript interfaces for biodata, templates & auth
```

---

## 4. Application Routes

| Path | Description | Access |
|---|---|---|
| `/` | Landing page highlighting templates, features, and privacy pledge | Public |
| `/create` | 5-step Biodata creation studio with real-time preview | Public |
| `/templates` | Full catalog of cultural, Vedic, and modern Indian designs | Public |
| `/templates/:slug` | Deep-dive template detail with sample data and color picker | Public |
| `/blog` | Matrimonial etiquette, Gotra guides, and regional biodata tips | Public |
| `/blog/:slug` | In-depth reader with related articles and share buttons | Public |
| `/format/marriage-biodata` | Comprehensive guide on standard marriage biodata formats | Public |
| `/format/hindu-marriage-biodata` | Vedic Hindu format with Kundali, Gotra, and Kuldevi details | Public |
| `/format/muslim-marriage-biodata` | Islamic Nikah format with Bismillah and family background | Public |
| `/format/marathi-biodata` | Traditional Marathi Lagna Patrika / Biodata format | Public |
| `/format/bengali-marriage-biodata` | Authentic Bengali Bibaho format | Public |
| `/format/yadav-marriage-biodata` | Community-specific biodata structure | Public |
| `/about`, `/contact`, `/faq` | Mission, customer inquiries, and frequently asked questions | Public |
| `/privacy-policy`, `/terms`, `/refund-policy` | Legal assurances, zero-storage policy, and terms | Public |
| `/admin/login` | Secure administrator authentication portal | Public |
| `/admin` | Administrative overview and health audit | Protected |
| `/admin/templates` | Template management and catalog visibility controls | Protected |
| `/admin/categories` | Regional categorization and taxonomy manager | Protected |
| `/admin/analytics` | Anonymous aggregated event and device analytics | Protected |
| `/admin/blog` | Blog article publisher and editor | Protected |
| `/admin/ads` | Google AdSense toggles, publisher ID, and slot management | Protected |
| `/admin/messages` | Inquiries submitted via the public contact form | Protected |
| `/admin/settings` | Site-wide announcement banner and branding configurations | Protected |

---

## 5. Development & Build Setup

### Prerequisites
- Node.js (version 20 or higher recommended)
- npm (version 10 or higher)

### Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment variables:
```bash
# Public Branding
VITE_APP_NAME="BiodataCraft"
VITE_APP_URL="https://biodatacraft.in"

# Firebase Client Configuration (Admin Authentication & Telemetry Only)
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="biodatacraft.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="biodatacraft"
VITE_FIREBASE_STORAGE_BUCKET="biodatacraft.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"

# Admin Access Credentials (For local development fallback)
VITE_ADMIN_PASSCODE="your-secure-admin-passcode"
```

### Commands

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run TypeScript linter and type-checker
npm run lint

# Build production bundle with optimized chunking
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Document Export & Technical Specifications

- **Print Dimension**: ISO 210mm × 297mm (Standard A4 Portrait).
- **Scale Factor**: 2× Retina Canvas rendering (`scale: 2`) for sharp vector typography and crisp photo reproduction.
- **Color Compatibility**: Uses `html2canvas-pro` to parse modern CSS colors (`oklch`, `oklab`, P3) generated by Tailwind CSS v4.
- **Privacy Enforcement**: Canvas rasterization and PDF generation execute synchronously within the user's browser runtime. Zero document artifacts are transmitted over the network.
