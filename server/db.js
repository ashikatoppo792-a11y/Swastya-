import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'database.json');

// Default Seed Data
const initialData = {
  facility: {
    id: 'FAC-PHC-042',
    name: 'Primary Health Centre Barabanki',
    state: 'Uttar Pradesh',
    district: 'Barabanki',
    facilityType: 'PHC', // PHC | CHC | District Hospital | Industrial Estate | Campus Clinic | Health Camp
    bedCount: 6,
    icuAvailable: false,
    connectivityMode: 'online', // 'online' | 'low-bandwidth' | 'offline'
    specialists: {
      generalPhysician: true,
      pediatrician: false,
      cardiologist: false,
      gynecologist: false,
      generalSurgeon: false,
      orthopedic: false,
    },
    nearestHigherFacility: 'District Hospital Barabanki (18 km) / KGMU Lucknow (42 km)',
    teleconsultService: 'eSanjeevani Ayushman Bharat',
    emergencyAmbulanceContact: '108',
  },
  patients: [
    {
      id: 'PT-2026-001',
      tokenNumber: 'A-101',
      name: 'Ramesh Patel',
      age: 54,
      sex: 'Male',
      bloodGroup: 'B+',
      phone: '+91 98765 43210',
      aadhaarLast4: '8842',
      primaryLanguage: 'gu', // Gujarati
      facilityId: 'FAC-IND-012',
      facilityName: 'Sanand Industrial Estate Health Centre, Gujarat',
      facilityType: 'Industrial Estate',
      checkInTime: new Date(Date.now() - 14 * 60 * 1000).toISOString(), // 14 mins ago
      status: 'pending_review', // pending_review | approved | overridden | referred | rejected
      bodyArea: 'chest',
      duration: '45 minutes',
      severity: 9,
      pregnant: false,
      chronicConditions: ['Hypertension (Stage 2)', 'Smoker (20 pack-years)'],
      currentMedicines: ['Amlodipine 5mg OD'],
      allergies: ['None known'],
      chiefComplaint: 'Severe retrosternal crushing chest pain radiating to left arm and jaw with cold diaphoresis',
      voiceTranscript: 'મને લગભગ પોણો કલાકથી છાતીમાં ખૂબ ભારેપણું લાગે છે, જાણે કોઈ વજન મૂકી દીધું હોય. દર્દ ડાબા હાથ અને જડબા સુધી જાય છે અને ખૂબ જ પરસેવો વળી રહ્યો છે.',
      voiceTranscriptEn: 'For about 45 minutes I have severe heaviness in my chest, as if someone put a heavy weight. The pain radiates to my left arm and jaw and I am breaking into cold sweat.',
      vitals: {
        bloodPressureSystolic: 168,
        bloodPressureDiastolic: 104,
        pulseRate: 108,
        spo2: 92,
        temperatureF: 98.4,
        respiratoryRate: 24,
      },
      reports: [
        {
          id: 'REP-001-A',
          type: 'ecg_snapshot',
          fileName: 'preliminary_lead2_strip.png',
          previewUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
          ocrExtractedText: 'ST-segment elevation > 2mm observed in anterolateral leads. HR: 106 bpm regular. Sinus tachycardia.',
          keyFindings: [
            { parameter: 'ST Elevation', value: 'Anterolateral Leads', status: 'CRITICAL', normalRange: 'Isoelectric' },
            { parameter: 'Heart Rate', value: '106 bpm', status: 'ABNORMAL', normalRange: '60-100 bpm' }
          ]
        }
      ],
      photos: [],
      triageNote: {
        aiGeneratedAt: new Date(Date.now() - 13 * 60 * 1000).toISOString(),
        suggestedPriority: 'Emergency', // Emergency | Urgent | Semi-urgent | Routine
        suggestedDepartment: 'Cardiology / Emergency Resuscitation',
        confidenceScore: 0.96,
        confidenceRationale: 'Concordance between clinical symptom cluster (radiating crushing chest pain + diaphoresis) and severe vitals derangement (BP 168/104, SpO2 92%).',
        redFlagsDetected: [
          'Acute Coronary Syndrome / STEMI red flag criteria met',
          'Hypoxia SpO2 92% on room air',
          'Pain radiation to left jaw and upper extremity'
        ],
        emergencyActionNotice: 'Administer loading dose (Aspirin 325mg + Clopidogrel 300mg + Atorvastatin 80mg) per clinical protocol. High-flow oxygen. Dispatch 108 Cardiac Ambulance to UN Mehta Institute of Cardiology Ahmedabad.',
        chiefComplaintSummary: '54-year-old male with acute severe crushing retrosternal chest pain radiating to left jaw, onset 45 min ago, accompanied by diaphoresis and tachypnea.',
        historyOfPresentIllness: 'Patient developed sudden onset retrosternal heaviness while at work. Pain described as 9/10 crushing sensation. Associated with diaphoresis, shortness of breath, and nausea. History of poorly controlled hypertension.',
        vitalsAssessment: 'Hypertensive crisis range (168/104 mmHg), sinus tachycardia (108 bpm), mild hypoxia (SpO2 92%).',
        findingsFromReports: 'Preliminary lead strip indicates marked ST elevation in anterolateral territory.',
        visualObservations: 'No surface trauma or visible swelling. Patient appears clinically pale, diaphoretic and distressed.',
        missingInformationToAsk: [
          'Exact time of symptom onset (symptom-to-door window for thrombolysis/PCI)',
          'Previous history of angina, stent placement, or CABG',
          'Contraindications to antiplatelet or thrombolytic therapy (recent GI bleed, stroke)'
        ],
        explainability: {
          primaryFactors: [
            'Retrosternal crushing pain radiating to arm/jaw (98% predictive for ACS)',
            'Diaphoresis + SpO2 < 94%',
            'Elevated BP with tachycardia indicating cardiac stress'
          ],
          sourceMapping: [
            { claim: 'Pain radiating to jaw', source: 'Patient voice transcript', rawText: 'દર્દ ડાબા હાથ અને જડબા સુધી જાય છે' },
            { claim: 'Hypoxia 92%', source: 'Triage vitals monitor', rawText: 'SpO2: 92%' }
          ]
        }
      },
      auditTrail: [
        {
          id: 'AUD-001',
          timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
          actorName: 'Self-Intake Kiosk',
          actorRole: 'Patient / Kiosk',
          action: 'intake_submitted',
          details: 'Patient submitted symptoms in Gujarati via voice input and uploaded ECG strip.'
        },
        {
          id: 'AUD-002',
          timestamp: new Date(Date.now() - 13 * 60 * 1000).toISOString(),
          actorName: 'TriageAssist AI Engine v2.4',
          actorRole: 'AI Assistant',
          action: 'note_generated',
          details: 'Rule-based red-flag trigger fired: Acute Coronary Syndrome. Priority set to Emergency.'
        }
      ]
    },
    {
      id: 'PT-2026-002',
      tokenNumber: 'A-102',
      name: 'Sunita Devi',
      age: 26,
      sex: 'Female',
      bloodGroup: 'O+',
      phone: '+91 97654 32109',
      aadhaarLast4: '3914',
      primaryLanguage: 'hi', // Hindi
      facilityId: 'FAC-PHC-042',
      facilityName: 'Primary Health Centre Barabanki, Uttar Pradesh',
      facilityType: 'PHC',
      checkInTime: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
      status: 'pending_review',
      bodyArea: 'head',
      duration: '2 days',
      severity: 8,
      pregnant: true,
      pregnancyTrimester: '3rd Trimester (34 Weeks)',
      chronicConditions: ['Primigravida', 'Gestational Hypertension'],
      currentMedicines: ['Labetalol 100mg BD', 'Iron & Folic Acid'],
      allergies: ['Penicillin'],
      chiefComplaint: 'Severe throbbing frontal headache with visual flashes and facial/pedal swelling in 34th week of pregnancy',
      voiceTranscript: 'मुझे दो दिन से सिर में बहुत तेज दर्द हो रहा है, आंखों के आगे चमक और धुंधलापन दिखता है। दोनों पैरों और चेहरे पर काफी सूजन आ गई है। बच्चा कम घूम रहा है।',
      voiceTranscriptEn: 'For two days I have severe headache, seeing flashes and blurred vision. Significant swelling in both legs and face. Baby movements feel reduced.',
      vitals: {
        bloodPressureSystolic: 174,
        bloodPressureDiastolic: 112,
        pulseRate: 94,
        spo2: 98,
        temperatureF: 98.6,
        respiratoryRate: 20,
      },
      reports: [
        {
          id: 'REP-002-A',
          type: 'urine_routine',
          fileName: 'anc_urine_dipstick_report.jpg',
          previewUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
          ocrExtractedText: 'Urine Albumin: +++ (3+ Proteinuria). Sugar: Nil. Pus cells: 2-3 /HPF.',
          keyFindings: [
            { parameter: 'Urine Albumin', value: '3+ (Proteinuria)', status: 'CRITICAL', normalRange: 'Nil / Trace' },
            { parameter: 'Urine Sugar', value: 'Negative', status: 'NORMAL', normalRange: 'Negative' }
          ]
        }
      ],
      photos: [],
      triageNote: {
        aiGeneratedAt: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
        suggestedPriority: 'Emergency',
        suggestedDepartment: 'Obstetrics & Gynecology / High-Risk Pregnancy',
        confidenceScore: 0.98,
        confidenceRationale: 'Classic triad of severe preeclampsia / impending eclampsia: gestational age 34w + BP 174/112 + 3+ proteinuria + neurological visual symptoms.',
        redFlagsDetected: [
          'Impending Eclampsia danger signs: severe headache and scotoma',
          'Severe range hypertension in 3rd trimester pregnancy (>160/110 mmHg)',
          'Patient report of decreased fetal movement'
        ],
        emergencyActionNotice: '🚨 OBSTETRIC EMERGENCY: Immediate Pritchard / Zuspan protocol (IV/IM Magnesium Sulphate loading dose). Secure airway. Arrange immediate referral via 108 ALS Ambulance to District Women Hospital Ayodhya / Barabanki.',
        chiefComplaintSummary: '26-year-old primigravida at 34 weeks gestation presenting with severe headache, visual scotomata, marked edema, and BP 174/112 mmHg.',
        historyOfPresentIllness: 'Known case of gestational hypertension presents with 48 hours of worsening headache unresponsive to paracetamol. Reports seeing flashing lights, pedal swelling extending to mid-calf, and subjectively diminished fetal movements.',
        vitalsAssessment: 'Critical systolic and diastolic hypertension (174/112 mmHg) indicating severe preeclampsia criteria.',
        findingsFromReports: 'Urine dipstick confirmed 3+ proteinuria indicating significant glomerular endotheliosis.',
        visualObservations: 'Marked non-pitting facial puffiness and bilateral pedal edema observed.',
        missingInformationToAsk: [
          'Any history of seizures, sudden twitching, or epigastric/right upper quadrant pain',
          'Exact time of last fetal movements felt',
          'Current fetal heart rate assessment by doppler/stethoscope'
        ],
        explainability: {
          primaryFactors: [
            'BP 174/112 in 34th week of pregnancy',
            'Severe persistent headache with visual disturbances',
            'Urine albumin 3+ on dipstick report'
          ],
          sourceMapping: [
            { claim: 'Seeing flashes and blurred vision', source: 'Patient voice transcript', rawText: 'आंखों के आगे चमक और धुंधलापन दिखता है' },
            { claim: 'Albumin 3+', source: 'Urine report OCR', rawText: 'Urine Albumin: +++ (3+ Proteinuria)' }
          ]
        }
      },
      auditTrail: [
        {
          id: 'AUD-003',
          timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
          actorName: 'ANM Rekha Verma',
          actorRole: 'Triage Nurse',
          action: 'intake_submitted',
          details: 'Recorded patient intake at ANC triage desk. High BP verified twice with mercury sphygmomanometer.'
        },
        {
          id: 'AUD-004',
          timestamp: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
          actorName: 'TriageAssist AI Engine v2.4',
          actorRole: 'AI Assistant',
          action: 'note_generated',
          details: 'Rule-based red-flag trigger fired: Severe Preeclampsia / Impending Eclampsia. Priority set to Emergency.'
        }
      ]
    },
    {
      id: 'PT-2026-003',
      tokenNumber: 'A-103',
      name: 'Aarav Sharma',
      age: 4,
      sex: 'Male',
      bloodGroup: 'A+',
      phone: '+91 94371 89201',
      aadhaarLast4: '1092',
      primaryLanguage: 'or', // Odia
      facilityId: 'FAC-PHC-042',
      facilityName: 'Primary Health Centre Barabanki (Health Camp Unit)',
      facilityType: 'Health Camp',
      checkInTime: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      status: 'pending_review',
      bodyArea: 'limbs',
      duration: '4 days',
      severity: 8,
      pregnant: false,
      chronicConditions: ['None'],
      currentMedicines: ['Paracetamol syrup intermittently'],
      allergies: ['None known'],
      chiefComplaint: 'Continuous high fever (103.4°F) for 4 days, vomiting, gum bleeding while brushing, petechial skin spots on shins',
      voiceTranscript: 'ପିଲାଟିକୁ ଚାରି ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଅଛି। ଆଜି ସକାଳେ ଦାନ୍ତ ଘଷିବା ବେଳେ ମାଢ଼ିରୁ ରକ୍ତ ବାହାରିଲା ଏବଂ ଗୋଡ଼ରେ ଲାଲ ଲାଲ ଦାଗ ଦେଖାଯାଉଛି। ପିଲାଟି ବହୁତ ଦୁର୍ବଳ ହୋଇ ଶୋଇ ରହୁଛି।',
      voiceTranscriptEn: 'The child has severe fever for four days. This morning while brushing, blood came from gums and red spots appeared on legs. The child is very weak and lethargic.',
      vitals: {
        bloodPressureSystolic: 86,
        bloodPressureDiastolic: 52,
        pulseRate: 142,
        spo2: 95,
        temperatureF: 103.4,
        respiratoryRate: 34,
      },
      reports: [
        {
          id: 'REP-003-A',
          type: 'cbc_report',
          fileName: 'cbc_platelet_count.pdf',
          previewUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
          ocrExtractedText: 'Hemoglobin: 14.8 g/dL. Platelet Count: 36,000 /cumm. Hematocrit (PCV): 46.2%. Dengue NS1: POSITIVE.',
          keyFindings: [
            { parameter: 'Platelet Count', value: '36,000 /cumm', status: 'CRITICAL', normalRange: '150,000 - 450,000' },
            { parameter: 'Hematocrit (PCV)', value: '46.2%', status: 'ABNORMAL', normalRange: '32 - 40% (Pediatric)' },
            { parameter: 'Dengue NS1 Antigen', value: 'POSITIVE', status: 'CRITICAL', normalRange: 'Negative' }
          ]
        }
      ],
      photos: [],
      triageNote: {
        aiGeneratedAt: new Date(Date.now() - 41 * 60 * 1000).toISOString(),
        suggestedPriority: 'Emergency',
        suggestedDepartment: 'Pediatrics / Dengue Critical Care Unit',
        confidenceScore: 0.95,
        confidenceRationale: 'Pediatric dengue with plasma leakage signs (PCV 46.2%), profound thrombocytopenia (36k), mucosal bleeding, and narrow pulse pressure (86/52 mmHg).',
        redFlagsDetected: [
          'Pediatric dengue with mucosal bleeding (gum bleed) and petechiae',
          'Platelet count < 50,000 /cumm with hemoconcentration',
          'Narrow pulse pressure (34 mmHg) and tachycardia (142 bpm) indicating impending dengue shock syndrome'
        ],
        emergencyActionNotice: '🚨 PEDIATRIC DENGUE WARNING: Impending Dengue Shock Syndrome. Start IV crystalloids (Ringer Lactate @ 5-7 ml/kg/hr titration protocol). Do NOT administer NSAIDs (Ibuprofen). Immediate referral to Pediatric Intensive Care.',
        chiefComplaintSummary: '4-year-old male child presenting on Day 4 of high fever with spontaneous mucosal bleeding, petechiae, platelet count 36,000/μL, and tachycardia.',
        historyOfPresentIllness: 'Mother reports persistent pyrexia up to 103.4°F. Today noted gum bleed while toothbrushing and multiple non-blanching purpuric spots on bilateral lower extremities. Decreased oral intake and wet nappies.',
        vitalsAssessment: 'Marked tachycardia (142 bpm), pediatric hypotension relative to age (86/52 mmHg), tachypnea (34/min).',
        findingsFromReports: 'Dengue NS1 positive, severe thrombocytopenia (36,000), raised hematocrit (46.2%) confirming active capillary leak.',
        visualObservations: 'Petechial rash on lower limbs. Child appears drowsy and dehydrated.',
        missingInformationToAsk: [
          'Urine output volume in past 6-8 hours',
          'Any abdominal pain, persistent vomiting, or black tarry stools (melena)',
          'Exact body weight for precise fluid resuscitation calculation'
        ],
        explainability: {
          primaryFactors: [
            'Platelets 36,000 + PCV 46.2% indicating capillary leakage',
            'Mucosal gum bleed in pediatric febrile illness',
            'Narrow pulse pressure and heart rate 142 bpm'
          ],
          sourceMapping: [
            { claim: 'Blood came from gums', source: 'Parent voice transcript', rawText: 'ମାଢ଼ିରୁ ରକ୍ତ ବାହାରିଲା' },
            { claim: 'Platelets 36,000', source: 'CBC lab report', rawText: 'Platelet Count: 36,000 /cumm' }
          ]
        }
      },
      auditTrail: [
        {
          id: 'AUD-005',
          timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
          actorName: 'Parent (Assisted by Camp Volunteer)',
          actorRole: 'Patient / Camp Attendant',
          action: 'intake_submitted',
          details: 'Submitted intake with uploaded CBC report from local diagnostic lab.'
        },
        {
          id: 'AUD-006',
          timestamp: new Date(Date.now() - 41 * 60 * 1000).toISOString(),
          actorName: 'TriageAssist AI Engine v2.4',
          actorRole: 'AI Assistant',
          action: 'note_generated',
          details: 'Rule-based red-flag trigger fired: Severe Pediatric Dengue with warning signs. Priority set to Emergency.'
        }
      ]
    },
    {
      id: 'PT-2026-004',
      tokenNumber: 'B-201',
      name: 'Mohammed Rafiq',
      age: 62,
      sex: 'Male',
      bloodGroup: 'B+',
      phone: '+91 93310 54321',
      aadhaarLast4: '7721',
      primaryLanguage: 'bn', // Bengali
      facilityId: 'FAC-CHC-018',
      facilityName: 'Community Health Centre Murshidabad, West Bengal',
      facilityType: 'CHC',
      checkInTime: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      status: 'pending_review',
      bodyArea: 'feet',
      duration: '3 weeks',
      severity: 6,
      pregnant: false,
      chronicConditions: ['Type 2 Diabetes Mellitus (15 years)', 'Diabetic Peripheral Neuropathy'],
      currentMedicines: ['Metformin 1000mg BD', 'Glimepiride 2mg OD'],
      allergies: ['Sulfa drugs'],
      chiefComplaint: 'Deep non-healing ulcer on right great toe with purulent yellow discharge, foul odor, and spreading redness',
      voiceTranscript: 'আমার ডান পায়ের বুড়ো আঙুলে তিন সপ্তাহ ধরে একটা ঘা হয়েছে। পুঁজ বের হচ্ছে এবং দুর্গন্ধ আসছে। ডায়াবেটিস আছে কিন্তু আঙুলে কোনো ব্যথা টের পাই না। চারপাশটা লাল হয়ে ফুলে গেছে।',
      voiceTranscriptEn: 'I have a sore on my right big toe for three weeks. Pus is coming out with foul smell. I have diabetes but feel no pain in the toe. The surrounding area is red and swollen.',
      vitals: {
        bloodPressureSystolic: 144,
        bloodPressureDiastolic: 88,
        pulseRate: 86,
        spo2: 97,
        temperatureF: 99.6,
        respiratoryRate: 18,
      },
      reports: [
        {
          id: 'REP-004-A',
          type: 'blood_glucose',
          fileName: 'glucometer_and_hba1c.jpg',
          previewUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80',
          ocrExtractedText: 'Random Blood Sugar: 312 mg/dL. HbA1c: 10.4%. Serum Creatinine: 1.1 mg/dL.',
          keyFindings: [
            { parameter: 'Random Blood Sugar', value: '312 mg/dL', status: 'CRITICAL', normalRange: '70-140 mg/dL' },
            { parameter: 'HbA1c', value: '10.4%', status: 'CRITICAL', normalRange: '< 6.5%' }
          ]
        }
      ],
      photos: [
        {
          id: 'PHT-004-A',
          fileName: 'diabetic_foot_ulcer.jpg',
          previewUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
          mockVisualAnalysis: 'Plantar aspect right hallux: approx 2.5 x 2.0 cm full thickness ulceration with slough base, purulent exudate, and surrounding perilesional cellulitis extending 3 cm proximal. Non-diagnostic screening.',
          confidence: 0.89
        }
      ],
      triageNote: {
        aiGeneratedAt: new Date(Date.now() - 54 * 60 * 1000).toISOString(),
        suggestedPriority: 'Urgent',
        suggestedDepartment: 'General Surgery / Diabetic Foot Clinic',
        confidenceScore: 0.91,
        confidenceRationale: 'Uncontrolled hyperglycemia (RBS 312 mg/dL, HbA1c 10.4%) with infected neuropathic diabetic foot ulcer (Wagner Grade 2-3) requiring surgical evaluation and wound swab.',
        redFlagsDetected: [
          'Spreading cellulitis on diabetic foot posing limb-threat risk',
          'Severe hyperglycemia (RBS > 300 mg/dL)',
          'Loss of protective sensation (peripheral neuropathy)'
        ],
        emergencyActionNotice: '',
        chiefComplaintSummary: '62-year-old diabetic male with infected neuropathic plantar ulcer of right hallux with purulent exudate and surrounding cellulitis.',
        historyOfPresentIllness: 'Ulcer began after minor barefoot shoe abrasion 3 weeks ago. Progressive purulent drainage and fetid odor. Lack of pain due to diabetic neuropathy masked severity. High sugars on regular testing.',
        vitalsAssessment: 'Low grade pyrexia (99.6°F) and stage 1 hypertension (144/88 mmHg).',
        findingsFromReports: 'Marked uncontrolled diabetes with RBS 312 mg/dL and HbA1c 10.4%.',
        visualObservations: 'Ulcer with slough base and visible erythematous border extending proximally. Basic visual screening observation only.',
        missingInformationToAsk: [
          'Probing to bone test (to evaluate for osteomyelitis)',
          'Status of dorsalis pedis and posterior tibial arterial pulses',
          'Prior history of foot ulceration or amputation'
        ],
        explainability: {
          primaryFactors: [
            'Deep infected foot ulcer in long-standing diabetic',
            'Surrounding erythema and foul discharge indicating spreading infection',
            'Severe uncontrolled blood glucose 312 mg/dL'
          ],
          sourceMapping: [
            { claim: 'Pus coming out with foul smell', source: 'Patient voice transcript', rawText: 'পুঁজ বের হচ্ছে এবং দুর্গন্ধ আসছে' },
            { claim: 'RBS 312 mg/dL', source: 'Lab report OCR', rawText: 'Random Blood Sugar: 312 mg/dL' }
          ]
        }
      },
      auditTrail: [
        {
          id: 'AUD-007',
          timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
          actorName: 'Patient Intake Tablet',
          actorRole: 'Patient',
          action: 'intake_submitted',
          details: 'Intake recorded in Bengali with wound photograph and lab report.'
        },
        {
          id: 'AUD-008',
          timestamp: new Date(Date.now() - 54 * 60 * 1000).toISOString(),
          actorName: 'TriageAssist AI Engine v2.4',
          actorRole: 'AI Assistant',
          action: 'note_generated',
          details: 'Multimodal analysis completed. Priority suggested: Urgent (review within 30 min).'
        }
      ]
    },
    {
      id: 'PT-2026-005',
      tokenNumber: 'B-202',
      name: 'Lakshmi Narayanan',
      age: 42,
      sex: 'Female',
      bloodGroup: 'AB+',
      phone: '+91 94440 12345',
      aadhaarLast4: '5561',
      primaryLanguage: 'ta', // Tamil
      facilityId: 'FAC-IND-012',
      facilityName: 'Sriperumbudur Industrial Estate Health Centre, Tamil Nadu',
      facilityType: 'Industrial Estate',
      checkInTime: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
      status: 'pending_review',
      bodyArea: 'arms',
      duration: '35 minutes',
      severity: 7,
      pregnant: false,
      chronicConditions: ['None'],
      currentMedicines: ['None'],
      allergies: ['None'],
      chiefComplaint: 'Chemical alkaline degreaser splash burn on right volar forearm during manufacturing shift',
      voiceTranscript: 'தொழிற்சாலையில் வேலை செய்யும் போது ரசாயன திரவம் என் வலது முழங்கையில் சிந்திவிட்டது. உடனடியாக தண்ணீரில் கழுவினேன், ஆனால் இப்போது தோல் சிவந்து கொப்புளங்கள் வந்து شدیدமாக எரிகிறது.',
      voiceTranscriptEn: 'While working in factory, chemical liquid splashed on my right forearm. I washed with water immediately, but now skin is red, blistered and burning severely.',
      vitals: {
        bloodPressureSystolic: 132,
        bloodPressureDiastolic: 84,
        pulseRate: 92,
        spo2: 99,
        temperatureF: 98.6,
        respiratoryRate: 18,
      },
      reports: [],
      photos: [
        {
          id: 'PHT-005-A',
          fileName: 'forearm_chemical_burn.jpg',
          previewUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
          mockVisualAnalysis: 'Right anterior forearm: irregular partial thickness dermal burn approx 8 x 5 cm with epidermolysis and serous bullae. Edges erythematous.',
          confidence: 0.92
        }
      ],
      triageNote: {
        aiGeneratedAt: new Date(Date.now() - 64 * 60 * 1000).toISOString(),
        suggestedPriority: 'Urgent',
        suggestedDepartment: 'Occupational Health / Minor OT & Burns',
        confidenceScore: 0.93,
        confidenceRationale: 'Occupational chemical burn with blistering (2nd degree) requiring continued copious lavage, pH testing, and sterile dressing.',
        redFlagsDetected: [
          'Chemical burn with active dermal blistering',
          'Potential progressive deep tissue damage from alkali agent'
        ],
        emergencyActionNotice: '',
        chiefComplaintSummary: '42-year-old female factory worker with acute partial thickness chemical burn on right forearm following industrial chemical splash.',
        historyOfPresentIllness: 'Sustained splash injury while handling industrial degreaser approx 35 mins ago. Co-workers assisted with 10 min tap water flush. Persistent burning pain 7/10.',
        vitalsAssessment: 'Hemodynamically stable with mild pain-associated tachycardia (92 bpm).',
        findingsFromReports: 'No laboratory reports attached.',
        visualObservations: 'Partial thickness burn with multiple intact and ruptured blisters on right forearm. Basic visual input only.',
        missingInformationToAsk: [
          'Exact chemical name / Material Safety Data Sheet (MSDS) pH level',
          'Tetanus toxoid vaccination status within past 5 years',
          'Any ocular, inhalation, or secondary splash exposure'
        ],
        explainability: {
          primaryFactors: [
            'Industrial chemical burn within 1 hour of injury',
            'Blister formation indicating partial thickness burn',
            'Severe pain rating (7/10)'
          ],
          sourceMapping: [
            { claim: 'Chemical liquid splashed on forearm', source: 'Patient voice transcript', rawText: 'ரசாயன திரவம் என் வலது முழங்கையில் சிந்திவிட்டது' }
          ]
        }
      },
      auditTrail: [
        {
          id: 'AUD-009',
          timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
          actorName: 'Company Nurse Priya',
          actorRole: 'Triage Nurse',
          action: 'intake_submitted',
          details: 'Workplace incident intake created with photo of forearm burn.'
        },
        {
          id: 'AUD-010',
          timestamp: new Date(Date.now() - 64 * 60 * 1000).toISOString(),
          actorName: 'TriageAssist AI Engine v2.4',
          actorRole: 'AI Assistant',
          action: 'note_generated',
          details: 'Suggested priority: Urgent (<30 mins review).'
        }
      ]
    },
    {
      id: 'PT-2026-006',
      tokenNumber: 'C-301',
      name: 'Gurpreet Singh',
      age: 38,
      sex: 'Male',
      bloodGroup: 'O-',
      phone: '+91 98150 67890',
      aadhaarLast4: '4120',
      primaryLanguage: 'pa', // Punjabi
      facilityId: 'FAC-PHC-042',
      facilityName: 'Primary Health Centre Barabanki',
      facilityType: 'PHC',
      checkInTime: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
      status: 'pending_review',
      bodyArea: 'chest',
      duration: '3.5 weeks',
      severity: 5,
      pregnant: false,
      chronicConditions: ['None'],
      currentMedicines: ['Cough syrup over the counter'],
      allergies: ['None'],
      chiefComplaint: 'Chronic productive cough for over 3 weeks with evening fever spikes, night sweats, and 4 kg weight loss',
      voiceTranscript: 'ਮੈਨੂੰ ਲਗਭਗ ਇੱਕ ਮਹੀਨੇ ਤੋਂ ਖੰਘ ਹੈ ਅਤੇ ਬਲਗਮ ਆਉਂਦੀ ਹੈ। ਸ਼ਾਮ ਨੂੰ ਹਲਕਾ ਬੁਖਾਰ ਚੜ੍ਹ ਜਾਂਦਾ ਹੈ ਅਤੇ ਰਾਤ ਨੂੰ ਬਹੁਤ ਪਸੀਨਾ ਆਉਂਦਾ ਹੈ। ਕੱਪੜੇ ਢਿੱਲੇ ਪੈ ਗਏ ਹਨ, ਭੁੱਖ ਨਹੀਂ ਲੱਗਦੀ।',
      voiceTranscriptEn: 'I have cough with phlegm for about a month. In the evening I get mild fever and sweat a lot at night. Clothes have become loose, no appetite.',
      vitals: {
        bloodPressureSystolic: 122,
        bloodPressureDiastolic: 78,
        pulseRate: 80,
        spo2: 96,
        temperatureF: 100.2,
        respiratoryRate: 20,
      },
      reports: [
        {
          id: 'REP-006-A',
          type: 'chest_xray',
          fileName: 'chest_xray_pa_view.jpg',
          previewUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80',
          ocrExtractedText: 'Impression: Heterogeneous patchy opacity with micro-cavitation in right upper lobe apical segment. Costophrenic angles clear.',
          keyFindings: [
            { parameter: 'Right Upper Lobe', value: 'Apical Opacity / Infiltrate', status: 'ABNORMAL', normalRange: 'Clear lung fields' }
          ]
        }
      ],
      photos: [],
      triageNote: {
        aiGeneratedAt: new Date(Date.now() - 84 * 60 * 1000).toISOString(),
        suggestedPriority: 'Semi-urgent',
        suggestedDepartment: 'Pulmonology / NTEP (TB Control Unit)',
        confidenceScore: 0.94,
        confidenceRationale: 'Cardinal symptoms of presumptive pulmonary tuberculosis: productive cough > 2 weeks, evening pyrexia, night sweats, B-symptoms (weight loss), and upper lobe X-ray infiltrate.',
        redFlagsDetected: [
          'Presumptive pulmonary tuberculosis criteria met per NTEP guidelines',
          'Unintentional weight loss and hemoptysis screening required'
        ],
        emergencyActionNotice: '',
        chiefComplaintSummary: '38-year-old male with 3-4 weeks history of productive cough, low-grade evening fever, drenching night sweats, and anorexia.',
        historyOfPresentIllness: 'Symptoms began insidiously. Sputum described as yellowish mucoid without gross blood streaks. Notable weight loss of approximately 4 kg in 4 weeks. No known TB contact identified.',
        vitalsAssessment: 'Mild pyrexia (100.2°F), hemodynamically stable.',
        findingsFromReports: 'Chest radiograph exhibits right upper lobe infiltrate suggestive of active mycobacterial pathology.',
        visualObservations: 'Patient appears thin-built and chronical fatigued. No acute cyanosis.',
        missingInformationToAsk: [
          'History of blood in sputum (hemoptysis)',
          'Household or workplace contacts undergoing TB treatment',
          'Previous anti-tubercular therapy (ATT) history'
        ],
        explainability: {
          primaryFactors: [
            'Cough > 2 weeks duration with night sweats and weight loss',
            'Chest radiograph upper lobe infiltrate',
            'Subfebrile evening fever pattern'
          ],
          sourceMapping: [
            { claim: 'Cough for about a month with phlegm and night sweats', source: 'Patient voice transcript', rawText: 'ਮੈਨੂੰ ਲਗਭਗ ਇੱਕ ਮਹੀਨੇ ਤੋਂ ਖੰਘ ਹੈ... ਰਾਤ ਨੂੰ ਬਹੁਤ ਪਸੀਨਾ ਆਉਂਦਾ ਹੈ' },
            { claim: 'Right upper lobe opacity', source: 'X-ray report OCR', rawText: 'opacity with micro-cavitation in right upper lobe' }
          ]
        }
      },
      auditTrail: [
        {
          id: 'AUD-011',
          timestamp: new Date(Date.now() - 85 * 60 * 1000).toISOString(),
          actorName: 'Kiosk Intake',
          actorRole: 'Patient',
          action: 'intake_submitted',
          details: 'Submitted intake in Punjabi with uploaded Chest X-ray from district scan centre.'
        },
        {
          id: 'AUD-012',
          timestamp: new Date(Date.now() - 84 * 60 * 1000).toISOString(),
          actorName: 'TriageAssist AI Engine v2.4',
          actorRole: 'AI Assistant',
          action: 'note_generated',
          details: 'Suggested priority: Semi-urgent (review within 60 mins). NTEP sputum cartridge test recommended.'
        }
      ]
    },
    {
      id: 'PT-2026-007',
      tokenNumber: 'D-401',
      name: 'Ananya Roy',
      age: 21,
      sex: 'Female',
      bloodGroup: 'A-',
      phone: '+91 98230 98765',
      aadhaarLast4: '9012',
      primaryLanguage: 'mr', // Marathi
      facilityId: 'FAC-CAMPUS-003',
      facilityName: 'University Campus Health Centre, Pune',
      facilityType: 'Campus Clinic',
      checkInTime: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
      status: 'pending_review',
      bodyArea: 'chest',
      duration: '5 days',
      severity: 4,
      pregnant: false,
      chronicConditions: ['None'],
      currentMedicines: ['None'],
      allergies: ['None'],
      chiefComplaint: 'Episodic palpitations, chest tightness during exam study, insomnia and anxiety for past 5 days',
      voiceTranscript: 'गेल्या पाच दिवसांपासून मला रात्री झोप येत नाहीये. परीक्षेचा खूप ताण आलाय, छातीत धडधड वाटते आणि अधूनमधून दम लागल्यासारखे होते. पण चालताना काही त्रास होत नाही.',
      voiceTranscriptEn: 'For the past five days I cannot sleep at night. Heavy exam stress, feeling palpitations in chest and occasional breathlessness. But walking does not cause trouble.',
      vitals: {
        bloodPressureSystolic: 118,
        bloodPressureDiastolic: 76,
        pulseRate: 84,
        spo2: 99,
        temperatureF: 98.4,
        respiratoryRate: 16,
      },
      reports: [],
      photos: [],
      triageNote: {
        aiGeneratedAt: new Date(Date.now() - 94 * 60 * 1000).toISOString(),
        suggestedPriority: 'Routine',
        suggestedDepartment: 'General OPD / Student Mental Health & Counseling',
        confidenceScore: 0.90,
        confidenceRationale: 'Young student with situational exam anxiety, normal vitals, no exertional angina or autonomic instability.',
        redFlagsDetected: [],
        emergencyActionNotice: '',
        chiefComplaintSummary: '21-year-old student presenting with situational anxiety, episodic palpitations, and sleep disturbance associated with academic examinations.',
        historyOfPresentIllness: 'Palpitations occur primarily during late night studying. Denies syncope, chest pain radiating to arm, or orthopnea. Normal exercise tolerance.',
        vitalsAssessment: 'All vital signs completely within normal physiological limits (BP 118/76, HR 84, SpO2 99%).',
        findingsFromReports: 'No laboratory or diagnostic tests attached.',
        visualObservations: 'Patient alert, oriented, slightly anxious demeanor but no respiratory distress.',
        missingInformationToAsk: [
          'Excessive caffeine or energy drink consumption',
          'Thyroid disease symptoms (heat intolerance, tremor)',
          'Any panic attacks or hyperventilation episodes'
        ],
        explainability: {
          primaryFactors: [
            'Situational exam stress context',
            'Completely normal resting vital signs',
            'No red-flag chest pain or syncope features'
          ],
          sourceMapping: [
            { claim: 'Palpitations linked to exam stress', source: 'Patient voice transcript', rawText: 'परीक्षेचा खूप ताण आलाय, छातीत धडधड वाटते' }
          ]
        }
      },
      auditTrail: [
        {
          id: 'AUD-013',
          timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
          actorName: 'Student Self-Intake App',
          actorRole: 'Patient',
          action: 'intake_submitted',
          details: 'Submitted intake via campus mobile portal in Marathi.'
        },
        {
          id: 'AUD-014',
          timestamp: new Date(Date.now() - 94 * 60 * 1000).toISOString(),
          actorName: 'TriageAssist AI Engine v2.4',
          actorRole: 'AI Assistant',
          action: 'note_generated',
          details: 'Suggested priority: Routine (standard queue).'
        }
      ]
    },
    {
      id: 'PT-2026-008',
      tokenNumber: 'D-402',
      name: 'Bhavna Ben',
      age: 68,
      sex: 'Female',
      bloodGroup: 'B+',
      phone: '+91 98250 11223',
      aadhaarLast4: '6219',
      primaryLanguage: 'gu', // Gujarati
      facilityId: 'FAC-PHC-042',
      facilityName: 'Primary Health Centre Barabanki',
      facilityType: 'PHC',
      checkInTime: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      status: 'pending_review',
      bodyArea: 'legs',
      duration: '2 years',
      severity: 4,
      pregnant: false,
      chronicConditions: ['Bilateral Knee Osteoarthritis', 'Mild Dyslipidemia'],
      currentMedicines: ['Paracetamol 650mg SOS', 'Calcium + Vitamin D3'],
      allergies: ['Diclofenac (gastritis)'],
      chiefComplaint: 'Bilateral knee pain worsening over months, needs routine medication refill and physiotherapist exercises',
      voiceTranscript: 'મને બંને ઘૂંટણમાં લાંબા સમયથી દુખાવો રહે છે. ચાલતી વખતે અવાજ આવે છે અને પગ વાળવામાં તકલીફ થાય છે. મારી જૂની દવા પૂરી થઈ ગઈ છે એટલે લખાવી લેવા આવી છું.',
      voiceTranscriptEn: 'I have pain in both knees for a long time. There is crepitus sound while walking and difficulty bending legs. My old medicine got finished so I came to get prescription refill.',
      vitals: {
        bloodPressureSystolic: 128,
        bloodPressureDiastolic: 80,
        pulseRate: 74,
        spo2: 98,
        temperatureF: 98.2,
        respiratoryRate: 16,
      },
      reports: [],
      photos: [],
      triageNote: {
        aiGeneratedAt: new Date(Date.now() - 109 * 60 * 1000).toISOString(),
        suggestedPriority: 'Routine',
        suggestedDepartment: 'Orthopedics / Physiotherapy OPD',
        confidenceScore: 0.95,
        confidenceRationale: 'Chronic degenerative joint disease seeking routine maintenance care and analgesia review.',
        redFlagsDetected: [],
        emergencyActionNotice: '',
        chiefComplaintSummary: '68-year-old female presenting for routine follow-up of bilateral knee osteoarthritis and prescription refill.',
        historyOfPresentIllness: 'Long-standing mechanical knee pain exacerbated by weight-bearing and stairs. No joint redness, hot swelling, fever, or traumatic incident.',
        vitalsAssessment: 'Normotensive and afebrile.',
        findingsFromReports: 'No new investigations uploaded.',
        visualObservations: 'Mild bilateral genu varum deformity consistent with chronic OA.',
        missingInformationToAsk: [
          'History of falls or mobility impairment',
          'Current stomach irritation with pain medications',
          'Need for walking aid assessment'
        ],
        explainability: {
          primaryFactors: [
            '2-year duration chronic stable joint pain',
            'No acute inflammatory signs or trauma',
            'Routine refill request'
          ],
          sourceMapping: [
            { claim: 'Chronic knee pain for prescription refill', source: 'Patient voice transcript', rawText: 'લાંબા સમયથી દુખાવો રહે છે... જૂની દવા પૂરી થઈ ગઈ છે' }
          ]
        }
      },
      auditTrail: [
        {
          id: 'AUD-015',
          timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
          actorName: 'PHC Registration Desk',
          actorRole: 'Clerk / Patient',
          action: 'intake_submitted',
          details: 'Recorded patient intake in Gujarati.'
        },
        {
          id: 'AUD-016',
          timestamp: new Date(Date.now() - 109 * 60 * 1000).toISOString(),
          actorName: 'TriageAssist AI Engine v2.4',
          actorRole: 'AI Assistant',
          action: 'note_generated',
          details: 'Suggested priority: Routine.'
        }
      ]
    }
  ],
  feedbacks: [
    {
      id: 'FB-001',
      patientId: 'PT-2026-001',
      clinicianName: 'Dr. Suresh Mehta, MD',
      rating: 'helpful', // helpful | incorrect | partially_accurate
      comment: 'Excellent red-flag pick-up on ACS. Saved critical 15 minutes before 108 ambulance dispatch.',
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
    }
  ],
  medicineReminders: [
    {
      id: 'MED-001',
      medicineName: 'Aspirin (Disprin / Ecosprin)',
      dosage: '75 mg (1 Tablet)',
      instructions: 'after_food',
      timings: [
        { timeSlot: 'morning', time: '08:30', takenToday: true, takenAt: '08:32 AM' }
      ],
      frequency: 'daily',
      startDate: '2026-10-01',
      doctorPrescribedBy: 'Dr. Suresh Mehta (Cardiology)',
      active: true
    },
    {
      id: 'MED-002',
      medicineName: 'Atorvastatin (Cholesterol)',
      dosage: '40 mg (1 Tablet)',
      instructions: 'after_food',
      timings: [
        { timeSlot: 'night', time: '21:00', takenToday: false }
      ],
      frequency: 'daily',
      startDate: '2026-10-01',
      doctorPrescribedBy: 'Dr. Suresh Mehta (Cardiology)',
      active: true
    },
    {
      id: 'MED-003',
      medicineName: 'Metformin Hydrochloride',
      dosage: '500 mg (1 Tablet)',
      instructions: 'with_food',
      timings: [
        { timeSlot: 'morning', time: '08:00', takenToday: true, takenAt: '08:15 AM' },
        { timeSlot: 'night', time: '20:30', takenToday: false }
      ],
      frequency: 'daily',
      startDate: '2026-09-15',
      doctorPrescribedBy: 'Dr. Ananya Sen (Medicine)',
      active: true
    },
    {
      id: 'MED-004',
      medicineName: 'Iron & Folic Acid (IFA Red Tablet)',
      dosage: '100 mg elemental iron (1 Tablet)',
      instructions: 'after_food',
      timings: [
        { timeSlot: 'afternoon', time: '14:00', takenToday: false }
      ],
      frequency: 'daily',
      startDate: '2026-08-01',
      doctorPrescribedBy: 'ANM Rekha Verma (Maternal Health)',
      active: true
    }
  ],
  appointmentReminders: [
    {
      id: 'APT-001',
      doctorOrClinic: 'Dr. Suresh Mehta, MD',
      department: 'Cardiology Follow-Up OPD',
      date: '2026-10-15',
      time: '10:30 AM',
      location: 'Room 4, District Hospital Barabanki',
      preparationNotes: [
        'Bring previous ECG strips and discharge summary',
        'Check fasting blood sugar and lipid profile before visit',
        'Carry all current medicines list'
      ],
      status: 'upcoming'
    },
    {
      id: 'APT-002',
      doctorOrClinic: 'Dr. Vandana Rao (OBGYN)',
      department: 'High-Risk Pregnancy & ANC Checkup',
      date: '2026-10-18',
      time: '11:00 AM',
      location: 'MCH Wing, District Women Hospital Ayodhya',
      preparationNotes: [
        'Carry Mother and Child Protection (MCP) card',
        'Record home blood pressure readings morning and evening',
        'Repeat urine albumin dipstick test report'
      ],
      status: 'upcoming'
    },
    {
      id: 'APT-003',
      doctorOrClinic: 'Dr. Tariq Ahmed (Surgery)',
      department: 'Diabetic Foot Dressing & Debridement',
      date: '2026-10-13',
      time: '09:00 AM',
      location: 'Minor OT, Community Health Centre Murshidabad',
      preparationNotes: [
        'Keep wound clean and dry',
        'Do not apply unprescribed household oils or powders'
      ],
      status: 'upcoming'
    }
  ]
};

let isDbInitialized = false;

// Initialize DB file if not exists
export function initDB() {
  if (isDbInitialized) return;
  if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  } else {
    // Ensure new reminder arrays exist if db already created
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(raw);
      let modified = false;
      if (!data.medicineReminders) {
        data.medicineReminders = initialData.medicineReminders;
        modified = true;
      }
      if (!data.appointmentReminders) {
        data.appointmentReminders = initialData.appointmentReminders;
        modified = true;
      }
      if (Array.isArray(data.patients)) {
        data.patients.forEach(p => {
          if (!p.bloodGroup) {
            const seedP = initialData.patients.find(sp => sp.id === p.id);
            p.bloodGroup = seedP ? seedP.bloodGroup : 'Unknown';
            modified = true;
          }
        });
      }
      if (modified) {
        writeDB(data);
      }
    } catch (e) {
      console.error('Error migrating DB in initDB', e);
    }
  }
  isDbInitialized = true;
}

// Read database
export function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    initDB();
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB, returning initial data', err);
    return initialData;
  }
}

// Write database atomically
export function writeDB(data) {
  const tempFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tempFile, DB_FILE);
}

// Patient helpers
export function getAllPatients() {
  const db = readDB();
  return db.patients || [];
}

export function getPatientById(id) {
  const db = readDB();
  return db.patients.find(p => p.id === id);
}

export function savePatient(patient) {
  const db = readDB();
  const existingIdx = db.patients.findIndex(p => p.id === patient.id);
  if (existingIdx >= 0) {
    db.patients[existingIdx] = patient;
  } else {
    db.patients.unshift(patient);
  }
  writeDB(db);
  return patient;
}

export function addAuditEntry(patientId, entry) {
  const db = readDB();
  const patient = db.patients.find(p => p.id === patientId);
  if (patient) {
    if (!patient.auditTrail) patient.auditTrail = [];
    patient.auditTrail.unshift({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry
    });
    writeDB(db);
    return patient;
  }
  return null;
}

export function getFacilityProfile() {
  const db = readDB();
  return db.facility;
}

export function updateFacilityProfile(updates) {
  const db = readDB();
  db.facility = { ...db.facility, ...updates };
  writeDB(db);
  return db.facility;
}

export function addClinicianFeedback(feedback) {
  const db = readDB();
  if (!db.feedbacks) db.feedbacks = [];
  const newFeedback = {
    id: `FB-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...feedback
  };
  db.feedbacks.unshift(newFeedback);
  writeDB(db);
  return newFeedback;
}

export function getFeedbacks() {
  const db = readDB();
  return db.feedbacks || [];
}

// Medicine Reminder Helpers
export function getMedicineReminders() {
  const db = readDB();
  return db.medicineReminders || [];
}

export function saveMedicineReminder(med) {
  const db = readDB();
  if (!db.medicineReminders) db.medicineReminders = [];
  const idx = db.medicineReminders.findIndex(m => m.id === med.id);
  if (idx >= 0) {
    db.medicineReminders[idx] = med;
  } else {
    db.medicineReminders.unshift(med);
  }
  writeDB(db);
  return med;
}

export function toggleMedicineTaken(id, slotIndex = 0) {
  const db = readDB();
  if (!db.medicineReminders) db.medicineReminders = [];
  const med = db.medicineReminders.find(m => m.id === id);
  if (med && med.timings && med.timings[slotIndex]) {
    const isTaken = !med.timings[slotIndex].takenToday;
    med.timings[slotIndex].takenToday = isTaken;
    med.timings[slotIndex].takenAt = isTaken ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : undefined;
    writeDB(db);
    return med;
  }
  return med;
}

export function deleteMedicineReminder(id) {
  const db = readDB();
  if (!db.medicineReminders) return false;
  db.medicineReminders = db.medicineReminders.filter(m => m.id !== id);
  writeDB(db);
  return true;
}

// Appointment Reminder Helpers
export function getAppointmentReminders() {
  const db = readDB();
  return db.appointmentReminders || [];
}

export function saveAppointmentReminder(apt) {
  const db = readDB();
  if (!db.appointmentReminders) db.appointmentReminders = [];
  const idx = db.appointmentReminders.findIndex(a => a.id === apt.id);
  if (idx >= 0) {
    db.appointmentReminders[idx] = apt;
  } else {
    db.appointmentReminders.unshift(apt);
  }
  writeDB(db);
  return apt;
}

export function deleteAppointmentReminder(id) {
  const db = readDB();
  if (!db.appointmentReminders) return false;
  db.appointmentReminders = db.appointmentReminders.filter(a => a.id !== id);
  writeDB(db);
  return true;
}

