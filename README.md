# TriageAssist (SwasthyaSetu) 🩺
### Multimodal Healthcare Triage Assistant for Government and Institutional Health Facilities across India

> **Core Principle:** The AI **NEVER** diagnoses or prescribes. It only summarizes and suggests a triage priority (`Emergency` / `Urgent` / `Semi-urgent` / `Routine`). A qualified clinician (doctor or nurse) must review, edit, approve, or reject every note.

---

## 🚀 Key Highlights & Capabilities

- **Multimodal Patient Intake:**
  - **11 Indian Languages + English:** English, Hindi (हिंदी), Odia (ଓଡ଼ିଆ), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Marathi (मराठी), Gujarati (ગુજરાતી), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Punjabi (ਪੰਜਾਬੀ).
  - **Voice Input (Web Speech API):** Live speech-to-text with animated audio waveform and real-time editable transcripts.
  - **Interactive Anatomical Body Map:** Visual SVG selector for intuitive body area localization on low-end devices.
  - **Visual & Diagnostic Document OCR:** Upload lab PDFs (CBC, Blood Sugar, Urinalysis), ECG strips, and wound/rash photos with automated mock OCR parsing and explicit *"Basic visual input only, non-diagnostic"* caveats.
  - **DPDP Act 2023 Aligned Consent:** Transparent purpose-bound intake consent.

- **AI Triage Engine (Deterministic Red-Flag Layer + Pluggable LLM):**
  - **Acuity Stratification:** Emergency (Level 1, immediate), Urgent (Level 2, <30m), Semi-urgent (Level 3, <60m), Routine (Level 4, standard).
  - **Deterministic Safety Overrides:** Hard-coded rule engine for Acute Coronary Syndrome (crushing chest pain + radiation + diaphoresis), Severe Preeclampsia (BP >160/110 + scotoma + 3+ proteinuria), Pediatric Dengue Shock (platelets <50k + mucosal bleeding + tachycardia), Stroke signs, and Hypoxia (SpO2 <90%). Triggers immediate 108 ambulance dispatch banner.
  - **Explainability:** Evidence mapping connecting model inferences to raw patient quotes and vitals.
  - **Pluggable Architecture:** Clean Claude 3.5 Sonnet / Vision API integration adapter in `server/services/aiTriageService.js`.

- **Clinician Cockpit (Human-in-the-Loop Core):**
  - **Live Priority Queue:** Emergency cases pinned with pulsating alerts and wait-time counters.
  - **Side-by-Side Review:** Raw patient inputs (native transcript + English translation + reports) alongside the structured AI draft.
  - **Clinical Governance Actions:**
    - `Approve Note As Final`
    - `Edit & Approve` (inline editable Chief Complaint, HPI, Department)
    - `Override Priority` (mandatory justification category + clinical rationale)
    - `Refer to Higher Facility` (e-referral slip + 108 ambulance dispatch + eSanjeevani teleconsultation ID)
    - `Reject Note` & `Request More Info`
  - **Immutable Audit Trail:** Chronological record of who took each action, when, and what changed.
  - **Continuous AI Improvement Loop:** In-app clinician rating (`Helpful`, `Partially accurate`, `Incorrect`) with model telemetry notes.

- **Facility Admin & Analytics:**
  - **Real-Time KPIs:** Total patients, emergency cases, avg review time (6.8 mins), clinician override rate (12%), concordance rate (88%).
  - **Recharts Data Visualizations:** Hourly arrival load, triage acuity donut chart, linguistic distribution, syndromic surveillance.
  - **Adaptive Facility Configuration:** Toggle on-site specialists (Cardiologist, Gynecologist, Surgeon) to see triage routing dynamically adapt from "Local OPD" to "108 Ambulance / eSanjeevani Teleconsult Transfer to Higher Centre".

- **PWA & Offline-First:**
  - Works on 2G / intermittent connections. Submissions queue locally in IndexedDB / localStorage and automatically sync to the backend upon reconnection.

- **AI Symptom Checker (Feature 1):**
  - Interactive multi-select symptom chips (fever, cough, chest pain, headache, shortness of breath, etc.) + free-text and voice input in English, Hindi, and Odia.
  - Multi-tier clinical acuity assessment (`Self-Care & Monitor`, `Consult Routine OPD`, `Urgent Clinic (<4 hrs)`, `Emergency (Call 108 immediately)`).
  - Identification of potential medical conditions with probability tags, structured next steps (immediate actions, home care, what to avoid, red-flag signs), and voice assistance audio playback.
  - Seamless cross-linking to online doctor booking and nearby hospitals.

- **Nearby Care Finder Module (`/src/features/nearby-care/`):**
  - **Privacy-First Location Detection:**
    - Uses browser `navigator.geolocation` with `enableHighAccuracy: true`, 10s timeout, and 60s max age.
    - Transparent **Pre-Permission Dialog** explaining that location is strictly used for distance calculation and never stored without consent (DPDP Act 2023 aligned).
    - Graceful state handling: `loading`, `granted`, `denied`, `unavailable`, `timeout`, and `low_accuracy` (warns if accuracy radius > 500 m).
    - Robust fallbacks: manual search by City/Area, Indian 6-digit PIN code lookup (e.g. `751024`, `753001`, `752001`, `110029`), interactive "Pick on map" pin-drop, and session-only storage.
    - "Use my current location", "Change location", and "Clear location" controls with live reverse geocoding via Nominatim.
  - **Adapter Architecture (`PlacesService`):**
    - Swappable provider chain with common `NormalizedFacility` shape:
      - **OpenStreetMap Overpass API:** Live queries with exponential backoff retry.
      - **Offline Demo Seed:** 29+ realistic healthcare facilities around Bhubaneswar, Cuttack, and Puri (AIIMS, Capital Hospital, SCB Medical, DHH Puri, PHCs, CHCs, Jan Aushadhi Kendras) plus Indian metros (Delhi, Mumbai, Bengaluru, Lucknow).
      - **Configurable External Providers:** Optional Google Places / Geoapify via environment variables (`.env`).
    - Client-side 15-minute cache with TTL in `sessionStorage` / IndexedDB for low-bandwidth resilience.
  - **Interactive Leaflet Map & High-Contrast UI:**
    - Custom color-coded SVG markers: Red (Hospital), Teal (PHC/CHC), Sky (Clinic), Green (Pharmacy), Purple (Lab), Indigo (Nursing Home).
    - Pulsing user location marker with live accuracy circle.
    - "Search this area" floating pill on pan, full keyboard navigation, and high-contrast marker toggle.
    - **2G / List-Only Mode:** One-tap toggle that completely suppresses map tile requests on low-bandwidth connections.
  - **Facility Cards & Actions:**
    - Verified badges, Government vs Private tags, Ayushman Bharat PM-JAY empanelment status, ICU bed availability, and 24x7 Emergency status.
    - Real-time straight-line distance (Haversine formula) and estimated Indian traffic travel times (urban vs rural heuristics).
    - 1-click actions: `Call` (`tel:`), `Get Directions` (Google / Apple Maps navigation), `Share` (clipboard copy), `Save` (offline bookmark), and `Report Incorrect Info`.
  - **Emergency Protocol (3b):**
    - When triage detects high acuity or red-flag signs, automatically activates Emergency Care mode.
    - Displays prominent **Call 108 Ambulance** and **Call 112** hotline buttons at the top with persistent disclaimer: *"If this is an emergency, call 108 now. Do not wait for the app."*
    - One-tap navigation to the nearest emergency trauma center.
  - **Triage & Clinician Referral Integration:**
    - **Patient Status Page:** Recommends care tier (Routine → PHC; Urgent → District Hospital OPD; Emergency → 24x7 Trauma) immediately after intake.
    - **Clinician Cockpit:** "Refer to Nearby Facility" panel allowing doctors to select receiving centers, attach structured triage notes, verify patient consent for coordinate sharing, and log immutable referral slips.
    - **Facility Admin:** Nearby referral network view with specialty gap routing (auto-suggesting partner facilities when an on-site specialist is unavailable).

- **Online Doctor Appointment Booking (Feature 3):**
  - Search and filter verified doctors by specialization (General Medicine, Cardiology, OBGYN, Pediatrics, Surgery, Pulmonology, Orthopedics) and consultation mode (In-Person OPD vs Video Teleconsult via eSanjeevani).
  - Interactive calendar with live slot picker across morning and afternoon shifts.
  - Instant digital appointment slip generation with Booking Reference ID (`BK-2026-XXXX`), token number, and printable view.
  - Appointment management: View booked consultations, reschedule, or cancel with confirmation.

- **Medical Report Scanner (Feature 4):**
  - Upload lab reports, prescriptions, or discharge slips (PDF, PNG, JPG).
  - Converts medical jargon (e.g., HbA1c, Platelets, OD/BD, Proteinuria, Creatinine) into plain language in English, Hindi, and Odia.
  - Interactive speech synthesizer with text-to-speech audio read-aloud.

- **Community Health Awareness (Feature 5):**
  - Verified medical guidance on key Indian health challenges: Diabetes, Anemia, Dengue red-flags, Child Malnutrition, Hygiene/Safe Water/ORS, and Preventive Screenings.
  - Plain language summaries, symptom warning checklists, and Myth vs Fact debunker cards.
  - Voice playback in English, Hindi, and Odia for rural and illiterate users.

- **Medicine & Appointment Reminder (Feature 6):**
  - Daily dosage schedules (morning, night, before/after food) aligned with doctor prescriptions.
  - Weekly adherence percentage calculation with one-tap taken/untaken toggles.
  - Doctor appointment manager for PHC/CHC visits with preparation checklists and notification simulator.

- **Multilingual & Accessible Design (Feature 9):**
  - **1-Click Language Switcher:** High-visibility pills for **English**, **हिंदी (Hindi)**, and **ଓଡ଼ିଆ (Odia)** + 11 Indian languages dropdown.
  - **Elderly & Rural Accessibility:** Generous 48px+ touch targets, simple linear layout, high-contrast toggle, large text toggle.
  - **Voice Assistance:** Audio read-aloud for intake consent, report explanations, and awareness guidance.

- **Security & Privacy Governance (Feature 10):**
  - **Digital Personal Data Protection (DPDP) Act 2023 Compliance:** Section 6 explicit consent flow with purpose specification and audio read-aloud.
  - **Clinician PIN Security Gate:** Medical officer authentication (default demo PIN `1234`) to unmask sensitive Aadhaar/health records.
  - **Encrypted Connections:** In-transit TLS 1.3 indicators and AES-256 local isolation.
  - **PII Masking & Right to Erasure:** Instant "R*** P***" masking on shared OPD displays and Section 12 data purge functionality.

---

## 📂 Repository Structure

```
swastya-setu/
├── server/
│   ├── index.js                     # Express backend entry point (port 3001)
│   ├── db.js                        # Database store with 8 seeded Indian clinical cases
│   ├── data/
│   │   └── database.json            # Persistent JSON database
│   ├── routes/
│   │   ├── patients.js              # Intake submissions, live queue, batch sync
│   │   ├── clinician.js             # Approvals, overrides, audit trail, feedback
│   │   ├── analytics.js             # Hourly load, triage distribution, language stats
│   │   ├── facility.js              # Facility profile & specialist availability
│   │   └── ai.js                    # OCR extraction, translation, preview
│   └── services/
│       └── aiTriageService.js       # Rule engine, red flags, Claude API adapter
├── src/
│   ├── components/
│   │   ├── Navbar.tsx               # Header with role switcher, language & accessibility
│   │   ├── Footer.tsx               # Persistent clinical warning & DPDP notice
│   │   ├── InteractiveBodyMap.tsx   # Interactive anatomical SVG body selector
│   │   ├── VoiceInputButton.tsx     # Web Speech API recorder + regional sample chips
│   │   ├── ReportUploader.tsx       # Lab report & photo dropzone + mock OCR
│   │   ├── AuditTrailModal.tsx      # Immutable audit trail timeline modal
│   │   ├── PriorityOverrideModal.tsx# Required clinical justification modal
│   │   ├── ReferralModal.tsx        # Higher facility referral & 108 dispatch modal
│   │   └── FeedbackModal.tsx        # AI continuous improvement feedback modal
│   ├── pages/
│   │   ├── LandingPage.tsx          # Hero, 4-step workflow, facility types, demo launch
│   │   ├── PatientIntakePage.tsx    # 5-step accessible intake wizard
│   │   ├── ClinicianDashboardPage.tsx # Human-in-the-loop cockpit & live queue
│   │   ├── FacilityAdminPage.tsx    # Real-time Recharts analytics & adaptive profile
│   │   ├── PatientStatusPage.tsx    # Live token tracker & plain-language guide
│   │   └── ResponsibleAiPage.tsx    # SaMD Class B compliance, bias & Claude guide
│   ├── services/
│   │   ├── api.ts                   # REST API client with offline buffer & sync
│   │   └── exportPdf.ts             # ABDM Printable Slip & FHIR JSON export
│   ├── i18n/
│   │   └── translations.ts          # 11 Indian language dictionaries
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── App.tsx                      # Main app container & router
│   ├── main.tsx                     # React DOM entry point
│   └── index.css                    # Tailwind CSS & design tokens
├── public/
│   └── logo.svg                     # SwasthyaSetu medical SVG emblem
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## ⚡ How to Run Locally

### 1. Prerequisites
- **Node.js**: v20 or higher (portable Node.js v20.18.0 is included in `C:\Users\Admin\node20`)
- **npm**: 10+

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Frontend & Backend Concurrently
```bash
npm run dev
```
This runs:
- **Backend API Server:** `http://localhost:3001`
- **Frontend Vite Dev Server:** `http://localhost:3000` (auto-proxies `/api` to port 3001)

Or run individually:
```bash
npm run dev:server   # Starts Express backend on port 3001
npm run dev:client   # Starts Vite React frontend on port 3000
```

---

## 🏥 Seeded Realistic Clinical Cases

The system initializes with 8 realistic cases representing diverse Indian facilities:

1. **Ramesh Patel (54M, Sanand GIDC Industrial Unit, Gujarat)**
   - *Language:* Gujarati
   - *Chief Complaint:* Crushing retrosternal chest pain radiating to left jaw for 45 mins with cold diaphoresis. Vitals: BP 168/104, HR 108, SpO2 92%. Attached Lead II ECG strip showing ST elevation.
   - *Acuity:* **EMERGENCY (Level 1)**.
2. **Sunita Devi (26F, PHC Barabanki, Uttar Pradesh)**
   - *Language:* Hindi
   - *Chief Complaint:* 34 weeks pregnant, severe splitting headache, visual flashing scotoma, pedal/facial swelling. Vitals: BP 174/112 mmHg. Attached urine dipstick: 3+ Proteinuria.
   - *Acuity:* **EMERGENCY (Level 1)** — Impending Eclampsia danger signs.
3. **Master Aarav Sharma (4M, Primary Health Camp, Odisha)**
   - *Language:* Odia
   - *Chief Complaint:* 4 days high fever (103.4°F), mucosal gum bleed while brushing, lethargy. CBC report: Platelets 36,000 /cumm, PCV 46.2%, Dengue NS1 positive.
   - *Acuity:* **EMERGENCY (Level 1)** — Severe Dengue with plasma leakage / impending shock.
4. **Mohammed Rafiq (62M, Community Health Centre, West Bengal)**
   - *Language:* Bengali
   - *Chief Complaint:* Chronic diabetes for 15 years, non-healing deep plantar ulcer of right hallux with purulent discharge. Attached high-res wound photograph. RBS: 312 mg/dL.
   - *Acuity:* **URGENT (Level 2)** — Diabetic foot ulceration requiring surgical review.
5. **Lakshmi Narayanan (42F, Industrial Unit, Tamil Nadu)**
   - *Language:* Tamil
   - *Chief Complaint:* Chemical alkaline splash burn on right forearm. Attached clinical photograph showing epidermal blistering.
   - *Acuity:* **URGENT (Level 2)** — Occupational burn care.
6. **Gurpreet Singh (38M, Primary Health Centre, Punjab)**
   - *Language:* Punjabi
   - *Chief Complaint:* Productive cough for 3.5 weeks, evening fever spikes, 4.5kg weight loss. Attached Chest X-ray showing right upper lobe infiltrate.
   - *Acuity:* **SEMI-URGENT (Level 3)** — Presumptive Pulmonary Tuberculosis (NTEP).
7. **Ananya Roy (21F, University Campus Health Centre, Pune)**
   - *Language:* Marathi
   - *Chief Complaint:* Situational exam anxiety, episodic palpitations, insomnia. Normal resting vitals (BP 118/76, SpO2 99%).
   - *Acuity:* **ROUTINE (Level 4)** — Student wellness & counseling referral.
8. **Bhavna Ben (68F, PHC Anand, Gujarat)**
   - *Language:* Gujarati
   - *Chief Complaint:* Chronic knee osteoarthritis for 2 years, seeking routine prescription refill.
   - *Acuity:* **ROUTINE (Level 4)** — General Medicine / Physiotherapy.

---

## 🔒 Responsible AI & Regulatory Governance

1. **Software as a Medical Device (SaMD):** Classified as Class B Clinical Decision Support Software under CDSCO guidelines. Strictly non-autonomous.
2. **DPDP Act 2023 Alignment:** Mandatory purpose-bound consent at intake, one-click PII redaction toggle (`P*** R***`), and immutable audit trail.
3. **FHIR Interoperability:** Implements HL7 FHIR R4 ClinicalImpression and Encounter resource bundles compatible with Ayushman Bharat Health Account (ABHA).
