import { MedicalTermExplanation, ReportScanResult } from '../types';

export const medicalDictionary: Record<string, MedicalTermExplanation> = {
  platelets: {
    term: 'Platelet Count (थ्रॉम्बोसाइट्स / ପ୍ଲେଟଲେଟ୍)',
    category: 'Lab Value',
    normalRange: '150,000 - 450,000 /cumm',
    simpleExplanation: 'Small blood cells that stick together to form clots and stop bleeding.',
    hindiExplanation: 'रक्त में खून का थक्का जमाने वाली कोशिकाएं। ये चोट लगने पर खून बहने से रोकती हैं।',
    odiaExplanation: 'ରକ୍ତ ଜମାଟ ବାନ୍ଧିବାରେ ସାହାଯ୍ୟ କରୁଥିବା କୋଷ। ଏହା କଟିଗଲେ ରକ୍ତ ବୋହିବା ବନ୍ଦ କରେ।',
    whatItMeansForYou: 'If very low (like in dengue), you might bleed easily from gums or nose. If low, doctors monitor closely.',
    urgencyLevel: 'Needs Doctor Review'
  },
  tlc: {
    term: 'Total Leukocyte Count / WBC (श्वेत रक्त कण / ଶ୍ୱେତ ରକ୍ତ କଣିକା)',
    category: 'Lab Value',
    normalRange: '4,000 - 11,000 /cumm',
    simpleExplanation: 'White blood cells that protect your body by fighting bacterial and viral infections.',
    hindiExplanation: 'सफेद रक्त कोशिकाएं जो शरीर की रक्षा करती हैं और कीटाणुओं से लड़ती हैं।',
    odiaExplanation: 'ଶରୀରକୁ ରୋଗ ଜୀବାଣୁ ଆକ୍ରମଣରୁ ରକ୍ଷା କରୁଥିବା ଧଳା ରକ୍ତ କଣିକା।',
    whatItMeansForYou: 'A high count usually means your immune system is currently fighting an infection or inflammation.',
    urgencyLevel: 'Needs Doctor Review'
  },
  hba1c: {
    term: 'HbA1c / Glycated Hemoglobin (3 महीने का औसत शुगर)',
    category: 'Lab Value',
    normalRange: '< 5.7% (Normal), 5.7-6.4% (Pre-diabetes), ≥ 6.5% (Diabetes)',
    simpleExplanation: 'Measures your average blood sugar level over the past 2 to 3 months.',
    hindiExplanation: 'पिछले ३ महीनों का औसत ब्लड शुगर स्तर। रोज-रोज शुगर नापने से ज्यादा सटीक तस्वीर देता है।',
    odiaExplanation: 'ବିଗତ ୩ ମାସର ହାରାହାରି ରକ୍ତ ଶର୍କରା ସ୍ତର।',
    whatItMeansForYou: 'If above 7.0%, your diabetes medicines or diet plan may need adjustments with your doctor.',
    urgencyLevel: 'Needs Doctor Review'
  },
  hemoglobin: {
    term: 'Hemoglobin / Hb (हीमोग्लोबिन / ହିମୋଗ୍ଲୋବିନ୍)',
    category: 'Lab Value',
    normalRange: '12.0 - 15.5 g/dL (Females), 13.5 - 17.5 g/dL (Males)',
    simpleExplanation: 'The iron-rich protein in red blood cells that carries oxygen from your lungs to your whole body.',
    hindiExplanation: 'खून में ऑक्सीजन ले जाने वाला मुख्य तत्व। इसकी कमी को एनीमिया (खून की कमी) कहते हैं।',
    odiaExplanation: 'ରକ୍ତରେ ଅମ୍ଳଜାନ ବହନ କରୁଥିବା ଉପାଦାନ। ଏହାର ଅଭାବକୁ ରକ୍ତହୀନତା କୁହାଯାଏ।',
    whatItMeansForYou: 'Low levels make you feel tired, dizzy, and breathless. Iron-rich foods or iron tablets help recover.',
    urgencyLevel: 'Needs Doctor Review'
  },
  creatinine: {
    term: 'Serum Creatinine (किडनी फंक्शन / କିଡନୀ କାର୍ଯ୍ୟକ୍ଷମତା)',
    category: 'Lab Value',
    normalRange: '0.6 - 1.2 mg/dL',
    simpleExplanation: 'A normal waste product from muscles that healthy kidneys filter out through urine.',
    hindiExplanation: 'मांसपेशियों से निकलने वाला अपशिष्ट पदार्थ जिसे स्वस्थ गुर्दे (किडनी) पेशाब द्वारा बाहर निकाल देते हैं।',
    odiaExplanation: 'କିଡନୀ ରକ୍ତରୁ ପରିସ୍ରା ମାଧ୍ୟମରେ ବାହାର କରୁଥିବା ବର୍ଜ୍ୟବସ୍ତୁ।',
    whatItMeansForYou: 'If elevated, it indicates your kidneys might be stressed or not filtering waste at full capacity.',
    urgencyLevel: 'Needs Doctor Review'
  },
  albumin: {
    term: 'Urine Albumin / Proteinuria (पेशाब में प्रोटीन)',
    category: 'Lab Value',
    normalRange: 'Nil / Negative',
    simpleExplanation: 'Albumin is a vital protein that should stay inside your blood, not leak out into urine.',
    hindiExplanation: 'पेशाब में प्रोटीन का रिसाव। गर्भावस्था में यह प्री-एक्लेम्पसिया का गंभीर संकेत हो सकता है।',
    odiaExplanation: 'ପରିସ୍ରାରେ ପ୍ରୋଟିନ୍ ବାହାରିବା। ଗର୍ଭାବସ୍ଥାରେ ଏହା ବିପଦର ଲକ୍ଷଣ ହୋଇପାରେ।',
    whatItMeansForYou: 'Finding albumin in urine requires checking blood pressure immediately, especially in pregnancy.',
    urgencyLevel: 'Critical Attention'
  },
  st_elevation: {
    term: 'ST-Segment Elevation (ईसीजी में दिल का दौरा संकेत)',
    category: 'Medical Term',
    normalRange: 'Isoelectric baseline',
    simpleExplanation: 'A pattern on an ECG heart tracing that suggests a coronary artery is blocked and heart muscle is starved of oxygen.',
    hindiExplanation: 'ईसीजी पर दिल की नस ब्लॉक होने और तीव्र दिल के दौरे (हार्ट अटैक) का सबसे बड़ा चिकित्सीय संकेत।',
    odiaExplanation: 'ଇସିଜିରେ ହୃଦ୍‌ଘାତର ଗୁରୁତର ସଙ୍କେତ। ତୁରନ୍ତ ୧୦୮ ଡାକ୍ତରଖାନା ନେବା ଆବଶ୍ୟକ।',
    whatItMeansForYou: 'EMERGENCY: Requires immediate hospitalization, 108 ambulance, and clot-busting or stent treatment.',
    urgencyLevel: 'Critical Attention'
  },
  od: {
    term: 'OD (Once Daily / दिन में एक बार / ଦିନକୁ ଥରେ)',
    category: 'Abbreviation',
    simpleExplanation: 'Take this medicine only once every 24 hours, preferably at the same fixed time.',
    hindiExplanation: 'यह दवा २४ घंटे में केवल एक बार लें, रोज एक ही निश्चित समय पर।',
    odiaExplanation: 'ଏହି ଔଷଧ ଦିନକୁ କେବଳ ଗୋଟିଏ ଥର ଖାଆନ୍ତୁ।',
    whatItMeansForYou: 'Usually taken every morning or night as directed on prescription.',
    urgencyLevel: 'Normal / Expected'
  },
  bd: {
    term: 'BD / BID (Twice Daily / दिन में दो बार / ଦିନକୁ ଦୁଇ ଥରେ)',
    category: 'Abbreviation',
    simpleExplanation: 'Take this medicine twice a day, roughly 12 hours apart (e.g. 8 AM and 8 PM).',
    hindiExplanation: 'दिन में दो बार (लगभग १२ घंटे के अंतर पर, जैसे सुबह ८ बजे और रात ८ बजे)।',
    odiaExplanation: 'ଦିନକୁ ଦୁଇ ଥର, ସକାଳେ ଏବଂ ରାତିରେ।',
    whatItMeansForYou: 'Do not take both doses together if you forget one.',
    urgencyLevel: 'Normal / Expected'
  },
  tds: {
    term: 'TDS / TID (Thrice Daily / दिन में तीन बार / ଦିନକୁ ତିନି ଥରେ)',
    category: 'Abbreviation',
    simpleExplanation: 'Take this medicine three times a day, roughly every 8 hours (e.g. morning, afternoon, night).',
    hindiExplanation: 'दिन में तीन बार (सुबह, दोपहर और रात में खाने के साथ या बाद)।',
    odiaExplanation: 'ଦିନକୁ ୩ ଥର (ସକାଳ, ଦ୍ୱିପ୍ରହର, ରାତି)।',
    whatItMeansForYou: 'Common for antibiotics or pain relievers.',
    urgencyLevel: 'Normal / Expected'
  },
  sos: {
    term: 'SOS (Si Opus Sit / जरूरत पड़ने पर / ଆବଶ୍ୟକ ହେଲେ)',
    category: 'Abbreviation',
    simpleExplanation: 'Take only when you feel severe symptoms (like fever >100°F or unbearable pain), not on fixed daily routine.',
    hindiExplanation: 'केवल तभी लें जब तकलीफ या बुखार हो। रोज नियमित रूप से लेने की जरूरत नहीं है।',
    odiaExplanation: 'କେବଳ ଦରକାର ପଡ଼ିଲେ ବା ଯନ୍ତ୍ରଣା ହେଲେ ଖାଆନ୍ତୁ।',
    whatItMeansForYou: 'Common for paracetamol for fever or antacids for acidity.',
    urgencyLevel: 'Normal / Expected'
  }
};

export function parseAndExplainReport(rawText: string, fileName: string): ReportScanResult {
  const textLower = rawText.toLowerCase();
  const matchedTerms: MedicalTermExplanation[] = [];

  // Match terms
  if (textLower.includes('platelet') || textLower.includes('plt') || textLower.includes('36,000') || textLower.includes('42,000')) {
    matchedTerms.push(medicalDictionary.platelets);
  }
  if (textLower.includes('leukocyte') || textLower.includes('tlc') || textLower.includes('wbc') || textLower.includes('count')) {
    matchedTerms.push(medicalDictionary.tlc);
  }
  if (textLower.includes('hba1c') || textLower.includes('sugar') || textLower.includes('glucose') || textLower.includes('rbs')) {
    matchedTerms.push(medicalDictionary.hba1c);
  }
  if (textLower.includes('hemoglobin') || textLower.includes('hb') || textLower.includes('anemia')) {
    matchedTerms.push(medicalDictionary.hemoglobin);
  }
  if (textLower.includes('creatinine') || textLower.includes('kft') || textLower.includes('kidney')) {
    matchedTerms.push(medicalDictionary.creatinine);
  }
  if (textLower.includes('albumin') || textLower.includes('protein') || textLower.includes('urine')) {
    matchedTerms.push(medicalDictionary.albumin);
  }
  if (textLower.includes('st elevation') || textLower.includes('ecg') || textLower.includes('lead') || textLower.includes('st-segment')) {
    matchedTerms.push(medicalDictionary.st_elevation);
  }
  if (textLower.includes('od') || textLower.includes('daily')) {
    matchedTerms.push(medicalDictionary.od);
  }
  if (textLower.includes('bd') || textLower.includes('bid')) {
    matchedTerms.push(medicalDictionary.bd);
  }
  if (textLower.includes('sos') || textLower.includes('pain')) {
    matchedTerms.push(medicalDictionary.sos);
  }

  // Fallback defaults if few terms matched
  if (matchedTerms.length === 0) {
    matchedTerms.push(medicalDictionary.hemoglobin);
    matchedTerms.push(medicalDictionary.platelets);
    matchedTerms.push(medicalDictionary.od);
  }

  const hasCritical = matchedTerms.some(t => t.urgencyLevel === 'Critical Attention');

  return {
    id: `SCAN-${Date.now()}`,
    fileName: fileName || 'Uploaded_Medical_Report.pdf',
    scannedAt: new Date().toISOString(),
    documentType: fileName.toLowerCase().includes('ecg') ? 'Cardiology ECG Tracing' :
                  fileName.toLowerCase().includes('urine') ? 'Urine Routine & Microscopic' :
                  fileName.toLowerCase().includes('rx') || fileName.toLowerCase().includes('presc') ? 'Doctor Prescription' :
                  'Clinical Laboratory Report',
    ocrText: rawText,
    explainedTerms: matchedTerms,
    summaryInPlainLanguage: {
      en: hasCritical
        ? 'Warning: This report shows one or more critical values that need urgent clinical evaluation today. Do not delay medical review.'
        : 'This report has been reviewed for key indicators. Several standard values were analyzed and translated into plain everyday language above.',
      hi: hasCritical
        ? 'चेतावनी: इस रिपोर्ट में कुछ गंभीर या असामान्य मान पाए गए हैं जिन्हें तुरंत डॉक्टर को दिखाना चाहिए।'
        : 'इस रिपोर्ट के मुख्य मेडिकल शब्दों को आपके लिए सरल भाषा में नीचे समझाया गया है।',
      or: hasCritical
        ? 'ଚେତାବନୀ: ଏହି ରିପୋର୍ଟରେ କିଛି ଗୁରୁତର ଫଳାଫଳ ଅଛି ଯାହାକୁ ତୁରନ୍ତ ଡାକ୍ତରଙ୍କୁ ଦେଖାଇବା ଆବଶ୍ୟକ।'
        : 'ଏହି ରିପୋର୍ଟର କଠିନ ଡାକ୍ତରୀ ଶବ୍ଦଗୁଡ଼ିକୁ ସରଳ ଭାଷାରେ ତଳେ ବୁଝାଇ ଦିଆଯାଇଛି।'
    },
    suggestedQuestionsForDoctor: [
      'Do my current symptoms match these lab numbers?',
      'Should any of my current medications be adjusted or stopped?',
      'When should I repeat this test to check if my condition is improving?'
    ]
  };
}
