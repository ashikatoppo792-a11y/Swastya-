import express from 'express';
import { extractReportData, generateTriageNote } from '../services/aiTriageService.js';
import { getFacilityProfile } from '../db.js';

const router = express.Router();

// POST /api/ai/extract-report - Mock OCR extraction for uploaded lab PDFs and images
router.post('/extract-report', (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const extraction = extractReportData({ fileName, fileType });
    res.json({
      success: true,
      data: {
        fileName: fileName || 'uploaded_document.pdf',
        ...extraction,
        scannedAt: new Date().toISOString(),
        disclaimer: 'Automated optical extraction for clinical decision support. Values must be verified by healthcare staff.'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/analyze-visual - Basic computer vision observation
router.post('/analyze-visual', (req, res) => {
  try {
    const { imageType, area } = req.body;
    let mockObservation = 'Visual screening observation: Surface skin discoloration and tissue changes noted. Non-diagnostic visual input only.';
    let confidence = 0.88;

    if (area === 'feet') {
      mockObservation = 'Plantar lesion observed: Ulcerated skin edge with granulation tissue and localized peri-wound redness. Rule out diabetic foot ulceration. Requires physical palpation.';
      confidence = 0.91;
    } else if (area === 'arms' || imageType?.includes('burn')) {
      mockObservation = 'Dermal erythema with localized blister/bullae formation observed. Consistent with partial thickness epidermal injury. Basic visual observation only.';
      confidence = 0.92;
    } else if (area === 'skin' || imageType?.includes('rash')) {
      mockObservation = 'Diffuse erythematous maculopapular cutaneous eruption. Basic visual screening only.';
      confidence = 0.86;
    }

    res.json({
      success: true,
      data: {
        observation: mockObservation,
        confidence,
        caveat: 'Basic visual input only. Strictly non-diagnostic. Qualified clinical examination required.'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/translate - Translates vernacular Indian text to English
router.post('/translate', (req, res) => {
  try {
    const { text, sourceLanguage } = req.body;
    
    // Quick translation dictionary for common Indian phrases in demo
    const translations = {
      'મને લગભગ પોણો કલાકથી છાતીમાં ખૂબ ભારેપણું લાગે છે, જાણે કોઈ વજન મૂકી દીધું હોય. દર્દ ડાબા હાથ અને જડબા સુધી જાય છે અને ખૂબ જ પરસેવો વળી રહ્યો છે.':
        'For about 45 minutes I have severe heaviness in my chest, as if someone put a heavy weight. The pain radiates to my left arm and jaw and I am breaking into cold sweat.',
      'मुझे दो दिन से सिर में बहुत तेज दर्द हो रहा है, आंखों के आगे चमक और धुंधलापन दिखता है। दोनों पैरों और चेहरे पर काफी सूजन आ गई है। बच्चा कम घूम रहा है।':
        'For two days I have severe headache, seeing flashes and blurred vision. Significant swelling in both legs and face. Baby movements feel reduced.',
      'ପିଲାଟିକୁ ଚାରି ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଅଛି। ଆଜି ସକାଳେ ଦାନ୍ତ ଘଷିବା ବେଳେ ମାଢ଼ିରୁ ରକ୍ତ ବାହାରିଲା ଏବଂ ଗୋଡ଼ରେ ଲାଲ ଲାଲ ଦାଗ ଦେଖାଯାଉଛି। ପିଲାଟି ବହୁତ ଦୁର୍ବଳ ହୋଇ ଶୋଇ ରହୁଛି।':
        'The child has severe fever for four days. This morning while brushing, blood came from gums and red spots appeared on legs. The child is very weak and lethargic.',
      'আমার ডান পায়ের বুড়ো আঙুলে তিন সপ্তাহ ধরে একটা ঘা হয়েছে। পুঁজ বের হচ্ছে এবং দুর্গন্ধ আসছে। ডায়াবেটিস আছে কিন্তু আঙুলে কোনো ব্যথা টের পাই না। चारপাশটা লাল হয়ে ফুলে গেছে।':
        'I have a sore on my right big toe for three weeks. Pus is coming out with foul smell. I have diabetes but feel no pain in the toe. The surrounding area is red and swollen.',
      'தொழிற்சாலையில் வேலை செய்யும் போது ரசாயன திரவம் என் வலது முழங்கையில் சிந்திவிட்டது. உடனடியாக தண்ணீரில் கழுவினேன், ஆனால் இப்போது தோல் சிவந்து கொப்புளங்கள் வந்து شدیدமாக எரிகிறது.':
        'While working in factory, chemical liquid splashed on my right forearm. I washed with water immediately, but now skin is red, blistered and burning severely.',
      'ਮੈਨੂੰ ਲਗਭਗ ਇੱਕ ਮਹੀਨੇ ਤੋਂ ਖੰਘ ਹੈ ਅਤੇ ਬਲਗਮ ਆਉਂਦੀ ਹੈ। ਸ਼ਾਮ ਨੂੰ ਹਲਕਾ ਬੁਖਾਰ ਚੜ੍ਹ ਜਾਂਦਾ ਹੈ ਅਤੇ ਰਾਤ ਨੂੰ ਬਹੁਤ ਪਸੀਨਾ ਆਉਂਦਾ ਹੈ। ਕੱਪੜੇ ਢਿੱਲੇ ਪੈ ਗਏ ਹਨ, ਭੁੱਖ ਨਹੀਂ ਲੱਗਦੀ।':
        'I have cough with phlegm for about a month. In the evening I get mild fever and sweat a lot at night. Clothes have become loose, no appetite.',
      'गेल्या पाच दिवसांपासून मला रात्री झोप येत नाहीये. परीक्षेचा खूप ताण आलाय, छातीत धडधड वाटते आणि अधूनमधून दम लागल्यासारखे होते. पण चालताना काही त्रास होत नाही.':
        'For the past five days I cannot sleep at night. Heavy exam stress, feeling palpitations in chest and occasional breathlessness. But walking does not cause trouble.',
      'મને બંને ઘૂંટણમાં લાંબા સમયથી દુખાવો રહે છે. ચાલતી વખતે અવાજ આવે છે અને પગ વાળવામાં તકલીફ થાય છે. મારી જૂની દવા પૂરી થઈ ગઈ છે એટલે લખાવી લેવા આવી છું.':
        'I have pain in both knees for a long time. There is crepitus sound while walking and difficulty bending legs. My old medicine got finished so I came to get prescription refill.'
    };

    const translated = translations[text] || `[Translated from ${sourceLanguage.toUpperCase()}]: ${text}`;

    res.json({
      success: true,
      originalText: text,
      sourceLanguage,
      translatedText: translated
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/preview-triage
router.post('/preview-triage', async (req, res) => {
  try {
    const patientData = req.body;
    const facility = getFacilityProfile();
    const note = await generateTriageNote(patientData, facility);
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/symptom-checker - AI Symptom evaluation
router.post('/symptom-checker', (req, res) => {
  try {
    const { symptoms = [], freeTextDescription = '', severity = 5, duration = '2-3 days' } = req.body;
    
    // Quick severity / emergency check
    const text = (freeTextDescription + ' ' + symptoms.join(' ')).toLowerCase();
    const isEmergency = text.includes('chest') || (text.includes('breath') && severity >= 7) || text.includes('bleed');

    res.json({
      success: true,
      data: {
        triageLevel: isEmergency ? 'Emergency Medical Care (Immediate)' : severity >= 7 ? 'Urgent Clinic Evaluation' : 'Consult Doctor (Routine OPD)',
        urgencyColor: isEmergency ? 'rose' : severity >= 7 ? 'orange' : 'amber',
        disclaimer: 'General health guidance only. The AI never diagnoses or prescribes. Requires qualified clinician review.'
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/chat - Conversational Health Triage & Guidance Assistant
router.post('/chat', (req, res) => {
  try {
    const { message = '', language = 'en', history = [] } = req.body;
    const lower = message.toLowerCase().trim();

    // Red flag / Emergency Detection
    const hasChestPain = lower.includes('chest') && (lower.includes('pain') || lower.includes('pressure') || lower.includes('heavy') || lower.includes('दौरा') || lower.includes('ଛାତି'));
    const hasBreathless = lower.includes('breath') || lower.includes('suffocat') || lower.includes('दम') || lower.includes('ନିଶ୍ୱାସ');
    const hasBleeding = lower.includes('bleed') || lower.includes('blood') || lower.includes('रक्त') || lower.includes('ରକ୍ତ');
    const hasStroke = lower.includes('paralys') || lower.includes('slur') || lower.includes('face droop') || lower.includes('लकवा');

    const isEmergency = hasChestPain || (hasBreathless && (lower.includes('severe') || lower.includes('crushing'))) || hasStroke;

    let reply = '';
    let suggestedActions = [];
    let redFlags = [];

    if (isEmergency) {
      redFlags.push(hasChestPain ? 'Acute Chest Heaviness / Suspected Cardiac Event' : 'Severe Respiratory Distress / Neurological Deficit');
      if (language === 'hi') {
        reply = '🚨 **तत्काल आपातकालीन चेतावनी:** आपके बताए गए लक्षण गंभीर स्थिति (जैसे दिल का दौरा या तीव्र श्वसन संकट) का संकेत हो सकते हैं। कृपया तुरंत **108 एम्बुलेंस** को कॉल करें या निकटतम 24x7 आपातकालीन केंद्र में जाएं। समय बहुत महत्वपूर्ण है!';
      } else if (language === 'or') {
        reply = '🚨 **ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ଚେତାବନୀ:** ଆପଣଙ୍କ ଲକ୍ଷଣ ଗମ୍ଭୀର ସମସ୍ୟାର ସୂଚନା ଦେଉଛି। ଦୟାକରି ତୁରନ୍ତ **୧୦୮ ଆମ୍ବୁଲାନ୍ସ** କଲ୍ କରନ୍ତୁ କିମ୍ବା ନିକଟସ୍ଥ ୨୪x୭ ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା କେନ୍ଦ୍ରକୁ ଯାଆନ୍ତୁ। ବିଳମ୍ବ କରନ୍ତୁ ନାହିଁ!';
      } else {
        reply = '🚨 **CRITICAL EMERGENCY ALERT:** The symptoms you described may indicate an acute medical emergency (such as acute coronary syndrome or severe respiratory distress). Please **call 108 Ambulance immediately** or proceed to the nearest 24x7 emergency trauma center without delay.';
      }

      suggestedActions = [
        { label: '📞 Call 108 Ambulance', action: 'tel:108', isHotline: true },
        { label: '🧭 Nearest 24x7 Emergency Centers', tab: 'nearby-hospitals', isEmergency: true }
      ];
    } else if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('phc') || lower.includes('अस्पताल') || lower.includes('ଡାକ୍ତରଖାନା') || lower.includes('near me')) {
      if (language === 'hi') {
        reply = 'मैंने आपके आसपास के सरकारी अस्पतालों, प्राथमिक स्वास्थ्य केंद्रों (PHC), और 24x7 फार्मेसियों की सूची तैयार की है। आप वास्तविक समय की दूरी, यात्रा समय और उपलब्ध बिस्तर देख सकते हैं।';
      } else if (language === 'or') {
        reply = 'ମୁଁ ଆପଣଙ୍କ ନିକଟସ୍ଥ ସରକାରୀ ଡାକ୍ତରଖାନା, ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (PHC) ଏବଂ ୨୪x୭ ଔଷଧ ଦୋକାନର ତାଲିକା ପ୍ରସ୍ତୁତ କରିଛି।';
      } else {
        reply = 'I can help you locate nearby healthcare facilities across Odisha and nationwide, including AIIMS Bhubaneswar, Capital Hospital, Community Health Centres (CHCs), and Ayushman Bharat PM-JAY empanelled centers with live travel times.';
      }
      suggestedActions = [
        { label: '📍 Open Nearby Care Finder', tab: 'nearby-hospitals' },
        { label: '🩺 Book OPD Doctor Appointment', tab: 'doctor-appointments' }
      ];
    } else if (lower.includes('fever') || lower.includes('cough') || lower.includes('headache') || lower.includes('बुखार') || lower.includes('खांसी') || lower.includes('ଜ୍ୱର') || lower.includes('cold') || lower.includes('pain') || lower.includes('dengue')) {
      if (language === 'hi') {
        reply = 'बुखार और सिरदर्द के लिए सामान्य प्राथमिक देखभाल:\n1. खूब पानी और ORS पिएं ताकि डिहाइड्रेशन न हो।\n2. पर्याप्त आराम करें और पैरासिटामोल के उपयोग से पहले डॉक्टर की सलाह लें।\n3. यदि बुखार 3 दिन से अधिक रहे या दाने/रक्तस्राव दिखे, तो तुरंत OPD में दिखाएं।\n\nविस्तृत AI लक्षण जांच (Symptom Checker) से अपनी जांच करें।';
      } else if (language === 'or') {
        reply = 'ଜ୍ୱର ଓ ମୁଣ୍ଡବିନ୍ଧା ପାଇଁ ପରାମର୍ଶ:\n୧. ପ୍ରଚୁର ପାଣି ଓ ORS ପିଅନ୍ତୁ।\n୨. ପର୍ଯ୍ୟାପ୍ତ ବିଶ୍ରାମ ନିଅନ୍ତୁ।\n୩. ଯଦି ଜ୍ୱର ୩ ଦିନରୁ ଅଧିକ ରହେ, ତେବେ ନିକଟସ୍ଥ PHC କିମ୍ବା ଡାକ୍ତରଖାନାରେ ଦେଖାନ୍ତୁ।';
      } else {
        reply = 'For fever, body ache, or cough symptoms:\n1. **Hydration & Rest:** Drink plenty of fluids (ORS, clean water) to prevent dehydration.\n2. **Monitoring:** Monitor body temperature twice daily.\n3. **Red-flag warning:** If fever persists $> 3$ days, or is accompanied by rash, mucosal bleeding, or extreme fatigue, get screened for Dengue/Malaria at your local PHC.\n\nUse our interactive Symptom Checker for structured triage routing.';
      }
      suggestedActions = [
        { label: '✨ Check Symptoms with AI', tab: 'symptom-checker' },
        { label: '🩺 Book OPD Doctor', tab: 'doctor-appointments' }
      ];
    } else if (lower.includes('report') || lower.includes('cbc') || lower.includes('sugar') || lower.includes('test') || lower.includes('रिपोर्ट') || lower.includes('ରିପୋର୍ଟ') || lower.includes('blood') || lower.includes('platelet')) {
      if (language === 'hi') {
        reply = 'आप अपनी रक्त जांच (जैसे CBC, ब्लड शुगर, प्लेटलेट्स) या डॉक्टर के पर्चे की फोटो हमारे **Medical Report Scanner** में अपलोड कर सकते हैं। यह कठिन शब्दों को सरल भाषा में समझाता है।';
      } else if (language === 'or') {
        reply = 'ଆପଣ ଆପଣଙ୍କର ରକ୍ତ ପରୀକ୍ଷା (CBC, Blood Sugar) କିମ୍ବା ଡାକ୍ତରଙ୍କ ପ୍ରେସକ୍ରିପସନ୍ ଆମର **Medical Report Scanner** ରେ ଅପଲୋଡ୍ କରି ସରଳ ଭାଷାରେ ବୁଝିପାରିବେ।';
      } else {
        reply = 'You can upload your diagnostic lab reports (CBC, HbA1c, Liver/Kidney function) or prescription photos to our **Medical Report Scanner**. It translates complex clinical terms into easy explanations in English, Hindi, and Odia with audio read-aloud.';
      }
      suggestedActions = [
        { label: '📝 Patient Intake & Registration', tab: 'intake' },
        { label: '💊 Set Medicine Reminders', tab: 'reminders' }
      ];
    } else if (lower.includes('book') || lower.includes('doctor') || lower.includes('appointment') || lower.includes('अपॉइंटमेंट') || lower.includes('ଡାକ୍ତର')) {
      reply = language === 'hi' 
        ? 'आप जनरल फिजिशियन, बाल रोग विशेषज्ञ, हृदय रोग विशेषज्ञ और अन्य डॉक्टरों के साथ OPD या eSanjeevani वीडियो परामर्श स्लॉट बुक कर सकते हैं।'
        : 'You can search verified doctors, view morning and afternoon OPD slots, and book your consultation token or eSanjeevani teleconsultation slip.';
      suggestedActions = [
        { label: '📅 Book Doctor Appointment', tab: 'doctor-appointments' },
        { label: '🏥 Find Nearby Hospitals', tab: 'nearby-hospitals' }
      ];
    } else {
      reply = language === 'hi'
        ? 'नमस्ते! मैं स्वास्थ सेतु AI सहायक हूँ। मैं आपके लक्षणों का आकलन करने, नजदीकी अस्पताल खोजने, मेडिकल रिपोर्ट समझाने या डॉक्टर अपॉइंटमेंट बुक करने में सहायता कर सकता हूँ। आप मुझसे क्या पूछना चाहते हैं?'
        : language === 'or'
        ? 'ନମସ୍କାର! ମୁଁ ସ୍ୱାସ୍ଥ୍ୟ ସେତୁ AI ସହାୟକ। ମୁଁ ଆପଣଙ୍କୁ ଲକ୍ଷଣ ଯାଞ୍ଚ, ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା ଖୋଜିବା, କିମ୍ବା ଡାକ୍ତର ବୁକିଂ କରିବାରେ ସାହାଯ୍ୟ କରିପାରିବି।'
        : 'Hello! I am your SwasthyaSetu AI Health Assistant. I can assist you with symptom evaluation, finding nearby government hospitals & PHCs, explaining medical lab reports, or booking doctor appointments. How can I help you today?';
      suggestedActions = [
        { label: '✨ Check Symptoms', tab: 'symptom-checker' },
        { label: '🏥 Find Nearby Hospitals', tab: 'nearby-hospitals' },
        { label: '📅 Book Doctor', tab: 'doctor-appointments' },
        { label: '📝 Patient Intake', tab: 'intake' }
      ];
    }

    res.json({
      success: true,
      reply,
      suggestedActions,
      isEmergency,
      redFlagsDetected: redFlags,
      disclaimer: 'Clinical decision-support only. The AI never diagnoses or prescribes. Requires qualified clinician review.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
