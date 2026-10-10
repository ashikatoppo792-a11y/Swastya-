import { SymptomCheckRequest, SymptomCheckResult, PossibleCondition } from '../types';

export interface SymptomOption {
  id: string;
  label: string;
  labelHi: string;
  labelOr: string;
  category: 'General' | 'Respiratory' | 'Digestive' | 'Pain & Neurological' | 'Maternal / Skin';
  isRedFlagWarning?: boolean;
}

export const commonSymptomsList: SymptomOption[] = [
  { id: 'fever', label: 'Fever', labelHi: 'बुखार', labelOr: 'ଜ୍ୱର', category: 'General' },
  { id: 'cough', label: 'Cough', labelHi: 'खांसी', labelOr: 'କାଶ', category: 'Respiratory' },
  { id: 'headache', label: 'Headache', labelHi: 'सिरदर्द', labelOr: 'ମୁଣ୍ଡବିନ୍ଧା', category: 'Pain & Neurological' },
  { id: 'shortness_of_breath', label: 'Shortness of Breath', labelHi: 'सांस फूलना', labelOr: 'ଶ୍ୱାସକ୍ରିୟାରେ କଷ୍ଟ', category: 'Respiratory', isRedFlagWarning: true },
  { id: 'chest_pain', label: 'Chest Pain', labelHi: 'छाती में दर्द', labelOr: 'ଛାତି ଯନ୍ତ୍ରଣା', category: 'Pain & Neurological', isRedFlagWarning: true },
  { id: 'sore_throat', label: 'Sore Throat', labelHi: 'गले में खराश', labelOr: 'ଗଳା ଯନ୍ତ୍ରଣା', category: 'Respiratory' },
  { id: 'body_ache', label: 'Body Ache / Joint Pain', labelHi: 'बदन व जोड़ों में दर्द', labelOr: 'ଦେହ ହାତ ବିନ୍ଧା', category: 'Pain & Neurological' },
  { id: 'vomiting', label: 'Vomiting / Nausea', labelHi: 'उल्टी या मतली', labelOr: 'ବାନ୍ତି', category: 'Digestive' },
  { id: 'diarrhea', label: 'Diarrhea / Loose Motions', labelHi: 'दस्त', labelOr: 'ପତଳା ଝାଡ଼ା', category: 'Digestive' },
  { id: 'abdominal_pain', label: 'Abdominal Pain', labelHi: 'पेट दर्द', labelOr: 'ପେଟ ଯନ୍ତ୍ରଣା', category: 'Digestive' },
  { id: 'dizziness', label: 'Dizziness / Vertigo', labelHi: 'चक्कर आना', labelOr: 'ମୁଣ୍ଡ ବୁଲାଇବା', category: 'Pain & Neurological' },
  { id: 'skin_rash', label: 'Skin Rash / Itching', labelHi: 'त्वचा पर चकत्ते', labelOr: 'ଚର୍ମ କୁଣ୍ଡାଇ ହେବା', category: 'Maternal / Skin' },
  { id: 'extreme_fatigue', label: 'Extreme Weakness / Fatigue', labelHi: 'अत्यधिक थकान व कमजोरी', labelOr: 'ଅତ୍ୟଧିକ ଦୁର୍ବଳତା', category: 'General' },
  { id: 'bleeding_gums', label: 'Bleeding Gums / Spots', labelHi: 'मसूड़ों या त्वचा से खून', labelOr: 'ରକ୍ତସ୍ରାବ', category: 'General', isRedFlagWarning: true }
];

export function getLocalizedSymptomName(sym: SymptomOption, lang: string = 'en'): string {
  if (lang === 'hi') return sym.labelHi;
  if (lang === 'or') return sym.labelOr;
  return sym.label;
}

export function analyzeSymptoms(req: SymptomCheckRequest): SymptomCheckResult {
  const syms = req.symptoms.map(s => s.toLowerCase());
  const freeText = (req.freeTextDescription || '').toLowerCase();
  const sev = req.severity || 5;

  const hasChestPain = syms.includes('chest_pain') || freeText.includes('chest') || freeText.includes('छाती');
  const hasBreathless = syms.includes('shortness_of_breath') || freeText.includes('breath') || freeText.includes('सांस');
  const hasBleeding = syms.includes('bleeding_gums') || freeText.includes('bleed') || freeText.includes('खून');
  const hasFever = syms.includes('fever') || freeText.includes('fever') || freeText.includes('बुखार');
  const hasCough = syms.includes('cough') || freeText.includes('cough') || freeText.includes('खांसी');
  const hasHeadache = syms.includes('headache') || freeText.includes('headache') || freeText.includes('सिरदर्द');
  const hasDiarrhea = syms.includes('diarrhea') || syms.includes('vomiting') || freeText.includes('motion') || freeText.includes('दस्त');
  const hasBodyAche = syms.includes('body_ache') || freeText.includes('joint') || freeText.includes('बदन दर्द');

  // Rule 1: Emergency Red Flag (Chest pain or Severe Dyspnea or Mucosal bleeding with high fever)
  if (hasChestPain || (hasBreathless && sev >= 7) || (hasBleeding && hasFever)) {
    return {
      id: `SYM-RES-${Date.now()}`,
      timestamp: new Date().toISOString(),
      primaryTriageLevel: 'Emergency Medical Care (Immediate)',
      urgencyColor: 'rose',
      executiveSummary: {
        en: 'High-acuity red flag symptoms detected requiring immediate emergency medical evaluation. Do not delay or self-medicate.',
        hi: 'आपातकालीन उच्च-प्राथमिकता लक्षण पाए गए हैं। तुरंत नजदीकी आपातकालीन केंद्र (Emergency OPD / 108) पर संपर्क करें।',
        or: 'ଜରୁରୀକାଳୀନ ଡାକ୍ତରୀ ସହାୟତା ଆବଶ୍ୟକ। ତୁରନ୍ତ ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ କିମ୍ବା ୧୦୮ ଡାକନ୍ତୁ।'
      },
      possibleConditions: [
        {
          condition: 'Acute Cardiopulmonary or Hemorrhagic Event',
          conditionHi: 'हृदय या श्वसन संबंधी गंभीर आपातकाल',
          conditionOr: 'ହୃଦରୋଗ କିମ୍ବା ଜରୁରୀକାଳୀନ ଅବସ୍ଥା',
          likelihood: 'High Probability',
          description: 'Symptoms indicate potential severe cardiac ischemia, respiratory compromise, or dengue hemorrhagic plasma leakage.',
          typicalSymptoms: ['Chest pressure', 'Shortness of breath', 'Bleeding signs', 'Diaphoresis']
        },
        {
          condition: 'Severe Bronchospasm or Pulmonary Embolism',
          conditionHi: 'फेफड़ों में तीव्र रुकावट या गंभीर अस्थमा',
          conditionOr: 'ତୀବ୍ର ଶ୍ୱାସକଷ୍ଟ',
          likelihood: 'Moderate',
          description: 'Significant reduction in air entry requiring supplemental oxygen and nebulization.',
          typicalSymptoms: ['Wheezing', 'Tachypnea', 'Accessory muscle use']
        }
      ],
      recommendedNextSteps: {
        immediateActions: [
          'Alert attending family members or call National Ambulance Helpline 108 immediately.',
          'Keep patient sitting upright in a well-ventilated space. Loosen tight collars.',
          'Have current medicines and previous prescription slips ready for emergency staff.'
        ],
        homeCareMeasures: [
          'Strictly no heavy physical exertion or walking around.',
          'Do NOT give solid foods if nausea, diaphoresis, or altered consciousness occurs.'
        ],
        whatToAvoid: [
          'Avoid taking unprescribed painkiller pills like Ibuprofen or Diclofenac which can cause gastric bleeding.',
          'Do not drive yourself to the clinic; use an ambulance or accompaniment.'
        ],
        redFlagSigns: [
          'Cold clammy sweating with chest heaviness',
          'Bluish discoloration of lips or fingernails (Cyanosis)',
          'Sudden confusion, speech difficulty, or loss of consciousness'
        ]
      },
      recommendedSpecialty: 'Emergency Resuscitation & Cardiology / Critical Care',
      disclaimer: 'This is an AI-assisted health triage guidance tool. It is NOT a final clinical diagnosis or prescription. Qualified medical consultation is required.'
    };
  }

  // Rule 2: Dengue / Acute Febrile Illness (Fever + Body Ache + Headache)
  if (hasFever && (hasBodyAche || hasHeadache) && !hasDiarrhea) {
    const isHighSev = sev >= 7;
    return {
      id: `SYM-RES-${Date.now()}`,
      timestamp: new Date().toISOString(),
      primaryTriageLevel: isHighSev ? 'Urgent Clinic Evaluation (<4 hrs)' : 'Consult Doctor (Routine OPD)',
      urgencyColor: isHighSev ? 'orange' : 'amber',
      executiveSummary: {
        en: 'Clinical picture consistent with an Acute Febrile Illness such as Viral Fever, Dengue, or Malaria. Laboratory CBC and platelet monitoring advised.',
        hi: 'लक्षण वायरल बुखार, डेंगू या मौसमी संक्रमण की ओर संकेत करते हैं। पूर्ण रक्त गणना (CBC) और प्लेटलेट जांच की सलाह दी जाती है।',
        or: 'ଲକ୍ଷଣଗୁଡ଼ିକ ଭାଇରାଲ୍ ଜ୍ୱର, ଡେଙ୍ଗୁ କିମ୍ବା ମ୍ୟାଲେରିଆ ହେବାର ସମ୍ଭାବନା ଦର୍ଶାଉଛି। ରକ୍ତ ପରୀକ୍ଷା (CBC) କରାନ୍ତୁ।'
      },
      possibleConditions: [
        {
          condition: 'Viral Febrile Syndrome / Suspected Dengue',
          conditionHi: 'वायरल बुखार या संदिग्ध डेंगू संक्रमण',
          conditionOr: 'ଭାଇରାଲ୍ ଜ୍ୱର ବା ଡେଙ୍ଗୁ',
          likelihood: 'High Probability',
          description: 'High temperature accompanied by retro-orbital headache, backache, and generalized musculoskeletal pain.',
          typicalSymptoms: ['Fever spikes', 'Eye ache', 'Severe body pain', 'Loss of appetite']
        },
        {
          condition: 'Seasonal Influenza (Flu)',
          conditionHi: 'मौसमी इन्फ्लूएंजा (फ्लू)',
          conditionOr: 'ଋତୁକାଳୀନ ଫ୍ଲୁ',
          likelihood: 'Moderate',
          description: 'Respiratory viral transmission causing acute chills, headache, and fatigue.',
          typicalSymptoms: ['Chills', 'Sore throat', 'Myalgia']
        }
      ],
      recommendedNextSteps: {
        immediateActions: [
          'Visit your Primary Health Centre (PHC) or Community Clinic for a finger-prick CBC blood test.',
          'Monitor body temperature using a digital thermometer every 4 hours.',
          'Maintain high fluid intake: coconut water, lemon water, ORS, and warm soups.'
        ],
        homeCareMeasures: [
          'Take prescribed Paracetamol for temperature control if advised by a healthcare worker.',
          'Rest completely in bed; avoid physical labor under the sun.'
        ],
        whatToAvoid: [
          'Do NOT take Aspirin, Ibuprofen, or Brufen without medical advice (they increase bleeding risk in Dengue).',
          'Do not demand unnecessary antibiotics for common viral infections.'
        ],
        redFlagSigns: [
          'Bleeding from gums or nose, black tarry stools',
          'Persistent vomiting preventing all oral fluid intake',
          'Extreme lethargy, sudden cold hands and feet'
        ]
      },
      recommendedSpecialty: 'General Medicine / Community Health OPD',
      disclaimer: 'This guidance supports symptom awareness. Please consult an MBBS medical officer or PHC clinician for accurate diagnosis.'
    };
  }

  // Rule 3: Gastrointestinal Syndrome (Diarrhea / Vomiting / Abdominal pain)
  if (hasDiarrhea) {
    return {
      id: `SYM-RES-${Date.now()}`,
      timestamp: new Date().toISOString(),
      primaryTriageLevel: sev >= 7 ? 'Urgent Clinic Evaluation (<4 hrs)' : 'Consult Doctor (Routine OPD)',
      urgencyColor: sev >= 7 ? 'orange' : 'amber',
      executiveSummary: {
        en: 'Symptoms indicative of Acute Gastroenteritis, foodborne illness, or stomach infection. Immediate oral rehydration (ORS) is crucial.',
        hi: 'लक्षण पेट के संक्रमण (गैस्ट्रोएंटेराइटिस) या दूषित भोजन/पानी के प्रभाव को दर्शाते हैं। ओआरएस (ORS) से जलयोजन अत्यंत आवश्यक है।',
        or: 'ପେଟ ସଂକ୍ରମଣ କିମ୍ବା ଝାଡ଼ା-ବାନ୍ତିର ଲକ୍ଷଣ। ତୁରନ୍ତ ORS ପାଣି ପିଅନ୍ତୁ ଏବଂ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।'
      },
      possibleConditions: [
        {
          condition: 'Acute Infectious Gastroenteritis',
          conditionHi: 'तीव्र आंत्रशोध (गैस्ट्रो)',
          conditionOr: 'ତୀବ୍ର ପେଟ ସଂକ୍ରମଣ',
          likelihood: 'High Probability',
          description: 'Inflammation of digestive tract resulting from bacterial, viral, or amoebic waterborne pathogens.',
          typicalSymptoms: ['Watery stools', 'Cramping', 'Nausea', 'Low-grade fever']
        },
        {
          condition: 'Food Poisoning / Indigestion',
          conditionHi: 'विषाक्त भोजन (फूड पॉइजनिंग)',
          conditionOr: 'ବିଷାକ୍ତ ଖାଦ୍ୟ ପ୍ରଭାବ',
          likelihood: 'Moderate',
          description: 'Acute reaction to spoiled, unhygienic, or contaminated food or street water.',
          typicalSymptoms: ['Sudden vomiting', 'Abdominal spasms', 'Weakness']
        }
      ],
      recommendedNextSteps: {
        immediateActions: [
          'Start WHO-formula Oral Rehydration Salts (ORS) solution: mix 1 packet in 1 liter of safe drinking water.',
          'Take small, frequent sips of ORS after every loose stool or vomiting episode.',
          'Eat light bland meals: rice gruel (Khichdi), curd, banana, boiled potatoes.'
        ],
        homeCareMeasures: [
          'Wash hands thoroughly with soap before eating and after using the toilet.',
          'Drink only boiled or filtered water.'
        ],
        whatToAvoid: [
          'Avoid spicy, fried, street food, dairy cream, and raw cut fruits from open markets.',
          'Do NOT self-prescribe anti-diarrheal stop-capsules (Loperamide) without checking with a doctor.'
        ],
        redFlagSigns: [
          'Sunken eyes, extreme thirst, dry tongue, or no urine output for over 6-8 hours',
          'Blood or black mucus in stools',
          'Inability to retain liquids, continuous vomiting'
        ]
      },
      recommendedSpecialty: 'Internal Medicine / Gastroenterology OPD',
      disclaimer: 'This guidance does not replace a clinical examination. If dehydration persists, reach the nearest Primary Health Centre immediately.'
    };
  }

  // Rule 4: Respiratory Infection (Cough + Sore Throat / Breathlessness mild)
  if (hasCough || hasBreathless) {
    return {
      id: `SYM-RES-${Date.now()}`,
      timestamp: new Date().toISOString(),
      primaryTriageLevel: 'Consult Doctor (Routine OPD)',
      urgencyColor: 'amber',
      executiveSummary: {
        en: 'Symptoms suggestive of an Upper or Lower Respiratory Tract Infection, Allergic Bronchitis, or Seasonal Pharyngitis.',
        hi: 'लक्षण श्वसन नली के संक्रमण, ब्रोंकाइटिस या एलर्जी की ओर इशारा करते हैं। भाप लेना और चिकित्सक से परामर्श उचित है।',
        or: 'ଶ୍ୱାସନଳୀ ସଂକ୍ରମଣ ବା କାଶ-ଥଣ୍ଡାର ଲକ୍ଷଣ। ଡାକ୍ତରଙ୍କୁ ଦେଖାଇ ଛାତି ପରୀକ୍ଷା କରାନ୍ତୁ।'
      },
      possibleConditions: [
        {
          condition: 'Acute Bronchitis / Viral Pharyngitis',
          conditionHi: 'तीव्र ब्रोंकाइटिस या गले का संक्रमण',
          conditionOr: 'ଶ୍ୱାସନଳୀ ପ୍ରଦାହ ବା ଗଳା ଇନଫେକ୍ସନ',
          likelihood: 'High Probability',
          description: 'Inflammation of airways causing persistent hacking cough, throat irritation, and phlegm.',
          typicalSymptoms: ['Mucus cough', 'Scratchy throat', 'Mild chest tightness']
        },
        {
          condition: 'Allergic Rhinitis / Airway Hyperreactivity',
          conditionHi: 'धूल-धुएं से एलर्जी या मौसमी दमा',
          conditionOr: 'ଧୂଳି ଧୂଆଁ ଆଲର୍ଜି',
          likelihood: 'Moderate',
          description: 'Environmental dust, smoke, or seasonal pollen trigger causing dry cough and sneezing.',
          typicalSymptoms: ['Dry bouts of cough', 'Watery eyes', 'Nasal congestion']
        }
      ],
      recommendedNextSteps: {
        immediateActions: [
          'Inhale warm water steam twice a day for 10 minutes to soothe chest congestion.',
          'Gargle with warm salt water 2-3 times daily for throat relief.',
          'Sip warm water with honey and ginger; avoid refrigerated cold drinks.'
        ],
        homeCareMeasures: [
          'Wear a cloth mask in dusty or polluted outdoor areas.',
          'Rest properly and avoid tobacco smoke or indoor cooking fumes.'
        ],
        whatToAvoid: [
          'Avoid taking unprescribed antibiotics; majority of acute coughs are viral.',
          'Avoid smoking and cold dairy desserts at night.'
        ],
        redFlagSigns: [
          'Cough lasting more than 2 weeks with evening fever and weight loss (TB indicator)',
          'Blood in phlegm (Hemoptysis)',
          'Rapid breathing, chest retractions, or SpO2 falling below 94%'
        ]
      },
      recommendedSpecialty: 'Pulmonology / General Medicine OPD',
      disclaimer: 'This guidance is educational. Persistent cough > 2 weeks must be evaluated at an NTEP TB testing centre.'
    };
  }

  // Default Mild / General Symptoms (Headache, Mild fatigue, etc.)
  return {
    id: `SYM-RES-${Date.now()}`,
    timestamp: new Date().toISOString(),
    primaryTriageLevel: sev <= 4 ? 'Self-Care & Monitor' : 'Consult Doctor (Routine OPD)',
    urgencyColor: sev <= 4 ? 'emerald' : 'amber',
    executiveSummary: {
      en: 'Mild non-urgent symptoms reported. Likely related to fatigue, eye strain, dehydration, or mild stress. Simple rest and hydration recommended.',
      hi: 'हल्के सामान्य लक्षण पाए गए हैं। थकान, निर्जलीकरण या तनाव इसका कारण हो सकते हैं। विश्राम और पर्याप्त पानी पीने की सलाह है।',
      or: 'ସାଧାରଣ ଦୁର୍ବଳତା ବା ମୁଣ୍ଡବିନ୍ଧା। ବିଶ୍ରାମ ନିଅନ୍ତୁ ଏବଂ ପ୍ରଚୁର ପାଣି ପିଅନ୍ତୁ।'
    },
    possibleConditions: [
      {
        condition: 'Tension Headache or Dehydration Fatigue',
        conditionHi: 'तनाव सिरदर्द या पानी की कमी से थकान',
        conditionOr: 'ମାନସିକ ଚାପ ବା ପାଣି ଅଭାବ',
        likelihood: 'Moderate',
        description: 'Common benign symptom cluster responding well to rest, hydration, and regular sleep.',
        typicalSymptoms: ['Dull aching head', 'Eye heaviness', 'Low stamina']
      }
    ],
    recommendedNextSteps: {
      immediateActions: [
        'Drink at least 2 to 3 liters of water throughout the day.',
        'Take adequate 7-8 hours of uninterrupted sleep in a quiet dark room.',
        'Take breaks from mobile phone and computer screens.'
      ],
      homeCareMeasures: [
        'Gentle forehead massage with light balm or cold compress.',
        'Eat balanced home-cooked meals at regular meal times.'
      ],
      whatToAvoid: [
        'Avoid skipping meals or excessive intake of caffeine and strong tea.',
        'Do not take repeated analgesic painkillers daily without clinical review.'
      ],
      redFlagSigns: [
        'Sudden explosive worst headache of life (Thunderclap headache)',
        'Stiff neck with high fever and vomiting',
        'Weakness or numbness in one side of face or body'
      ]
    },
    recommendedSpecialty: 'Primary Health Centre (PHC) / General OPD',
    disclaimer: 'Always consult a qualified doctor if symptoms persist beyond 48 hours or increase in intensity.'
  };
}
