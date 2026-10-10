import { HealthAwarenessTopic } from '../types';

export const healthAwarenessTopics: HealthAwarenessTopic[] = [
  {
    id: 'topic-diabetes',
    slug: 'diabetes',
    title: 'Type-2 Diabetes & Blood Sugar Care',
    titleHi: 'डायबिटीज (मधुमेह) एवं ब्लड शुगर प्रबंधन',
    titleOr: 'ମଧୁମେହ (ଡାଇବେଟିସ୍) ରୋଗ ଓ ଏହାର ଯତ୍ନ',
    category: 'Chronic Disease',
    summary: 'A condition where the body cannot regulate blood glucose properly. High blood sugar damages blood vessels, kidneys, eyes, and nerves over time.',
    summaryHi: 'शरीर में इंसुलिन की कमी या रुकावट से खून में शुगर बढ़ जाता है। सही खान-पान और दवा से इसे पूरी तरह नियंत्रित रखा जा सकता है।',
    summaryOr: 'ରକ୍ତରେ ଶର୍କରା ବଢ଼ିବା ଦ୍ୱାରା ହୃଦୟ, କିଡନୀ ଓ ଆଖି ଉପରେ ଖରାପ ପ୍ରଭାବ ପଡ଼େ। ନିୟମିତ ଔଷଧ ଓ ଖାଦ୍ୟ ନିୟନ୍ତ୍ରଣ ଜରୁରୀ।',
    keySigns: [
      'Frequent urination (especially at night)',
      'Excessive thirst and dry mouth',
      'Unexplained weight loss despite eating well',
      'Slow-healing foot wounds and recurring boils',
      'Numbness or tingling sensation in feet and fingers'
    ],
    causesAndRisks: [
      'Sedentary lifestyle and low physical activity',
      'Diet high in refined carbohydrates, white rice, sweets, and fried snacks',
      'Family history / genetic susceptibility in South Asians',
      'Obesity and abdominal belly fat'
    ],
    preventionAndDiet: [
      'Replace polished white rice with whole millets: Ragi, Jowar, Bajra, and brown rice.',
      'Take at least 30 to 45 minutes of brisk walking 5 days a week.',
      'Check feet every night before sleeping for minor cuts, blisters, or color changes.',
      'Never walk barefoot, even inside the home or village courtyard.'
    ],
    whenToSeeDoctor: 'If fasting sugar is >130 mg/dL, HbA1c is >7.0%, or you notice non-healing sores, numbness in feet, or blurred vision.',
    mythsAndFacts: [
      {
        myth: 'Myth: Eating sweet food is the only cause of diabetes.',
        fact: 'Fact: Lack of physical activity, belly fat, refined flour (maida), and genetic risk play equally major roles.'
      },
      {
        myth: 'Myth: If blood sugar is normal this week, I can stop taking prescribed medicines.',
        fact: 'Fact: Diabetes medicines maintain normal levels; stopping them without a doctor causes dangerous silent sugar spikes.'
      }
    ],
    audioPromptText: {
      en: 'Diabetes is a common condition where blood sugar levels are high. Key warning signs include frequent urination, unhealing sores on the feet, and excessive thirst. Protect your health by eating millets, walking 30 minutes daily, and inspecting your feet every night.',
      hi: 'डायबिटीज में खून में शुगर बढ़ जाती है। बार-बार पेशाब आना, पैरों में घाव का न भरना और ज्यादा प्यास लगना इसके मुख्य लक्षण हैं। रोज 30 मिनट टहलें, बाजरा-ज्वार खाएं और पैरों की रोज रात जांच करें।',
      or: 'ମଧୁମେହ ରୋଗରେ ରକ୍ତ ଶର୍କରା ବୃଦ୍ଧି ପାଏ। ବାରମ୍ବାର ପରିସ୍ରା ଲାଗିବା, ଗୋଡ଼ରେ ଘା’ ନ ଶୁଖିବା ଏହାର ଲକ୍ଷଣ। ପ୍ରତିଦିନ ଅଧ ଘଣ୍ଟା ଚାଲନ୍ତୁ ଏବଂ ପାଦର ଯତ୍ନ ନିଅନ୍ତୁ।'
    }
  },
  {
    id: 'topic-anemia',
    slug: 'anemia',
    title: 'Anemia & Iron Deficiency',
    titleHi: 'एनीमिया (खून की कमी) एवं आयरन पोषण',
    titleOr: 'ରକ୍ତହୀନତା (ଆନେମିଆ) ଓ ଲୌହସାର ଯୁକ୍ତ ଖାଦ୍ୟ',
    category: 'Maternal & Child',
    summary: 'A condition where the blood has too few healthy red blood cells or hemoglobin, starving body tissues of oxygen.',
    summaryHi: 'खून में हीमोग्लोबिन की कमी, जिससे शरीर के अंगों को पर्याप्त ऑक्सीजन नहीं मिल पाती। यह भारतीय महिलाओं और बच्चों में बहुत आम है।',
    summaryOr: 'ହିମୋଗ୍ଲୋବିନ୍ କମିବା ଦ୍ୱାରା ଶରୀର ଦୁର୍ବଳ ହୋଇଯାଏ। ଏହା ଗର୍ଭବତୀ ମହିଳା ଓ ଶିଶୁଙ୍କ ପାଇଁ ବିଶେଷ ଚିନ୍ତାର ବିଷୟ।',
    keySigns: [
      'Constant extreme fatigue and low stamina',
      'Pale or yellowish skin, pale conjunctiva (inside eyelids), pale nail beds',
      'Dizziness, fainting episodes, and cold hands/feet',
      'Shortness of breath even during minor climbing or walking',
      'Craving unusual substances like ice or clay (pica)'
    ],
    causesAndRisks: [
      'Low dietary iron intake (poverty, unbalanced diet)',
      'Intestinal worm infestation (hookworms drain blood)',
      'Heavy menstrual blood loss in adolescent girls and women',
      'Increased iron demands during pregnancy and breastfeeding'
    ],
    preventionAndDiet: [
      'Eat dark green leafy vegetables: Moringa / Sahjan (सहजन), Spinach, Fenugreek (मेथी).',
      'Include jaggery (गुड़), roasted Bengal gram (चना), beetroot, and lentils in daily meals.',
      'Take Vitamin C rich foods (Amla / आंवला, Lemon) alongside meals to double iron absorption.',
      'Take albendazole deworming tablets every 6 months as advised by ASHA/ANM workers.',
      'Pregnant women must take prescribed Iron & Folic Acid (IFA) tablets daily for 180 days.'
    ],
    whenToSeeDoctor: 'If hemoglobin drops below 9.0 g/dL, or you experience extreme dizziness, swelling of feet, or difficulty breathing.',
    mythsAndFacts: [
      {
        myth: 'Myth: Drinking tea or coffee immediately after food helps digestion.',
        fact: 'Fact: Tea contains tannins that bind with dietary iron and block up to 70% of iron absorption. Drink tea 2 hours after food.'
      },
      {
        myth: 'Myth: Feeling weak is normal for women and requires no medical check.',
        fact: 'Fact: Severe anemia in pregnancy increases risk of maternal mortality and low-birth-weight babies. It requires active treatment.'
      }
    ],
    audioPromptText: {
      en: 'Anemia means low blood count or hemoglobin. It causes pale eyelids, dizziness, and fast tiring. Eat green leafy vegetables, jaggery, chana, and take iron tablets as prescribed by your ASHA worker. Deworming every 6 months is also essential.',
      hi: 'एनीमिया का मतलब है खून में हीमोग्लोबिन की कमी। इसके कारण आंखों के नीचे पीलापन, चक्कर और जल्दी थकान होती है। सहजन, पालक, गुड़-चना खाएं और आशा दीदी की सलाह से आयरन की गोली जरूर लें।',
      or: 'ରକ୍ତହୀନତା ହେଲେ ଶରୀର ଫିକା ଦେଖାଯାଏ, ମୁଣ୍ଡ ବୁଲାଏ ଓ ଶୀଘ୍ର ଥକ୍କା ଲାଗେ। ସଜନା ଶାଗ, ପାଳଙ୍ଗ, ଗୁଡ଼ ଓ ବୁଟ ଖାଆନ୍ତୁ ଏବଂ ଆଇରନ୍ ବଟିକା ସେବନ କରନ୍ତୁ।'
    }
  },
  {
    id: 'topic-dengue',
    slug: 'dengue',
    title: 'Dengue & Vector-Borne Fever Care',
    titleHi: 'डेंगू बुखार, रोकथाम एवं खतरे के लक्षण',
    titleOr: 'ଡେଙ୍ଗୁ ଜ୍ୱର ଓ ସତର୍କତା ମୂଳକ ପଦକ୍ଷେପ',
    category: 'Infectious / Vector',
    summary: 'A mosquito-borne viral infection transmitted by Aedes mosquitoes that breed in clean stagnant water containers.',
    summaryHi: 'एडीज मच्छर के काटने से फैलने वाला बुखार जो साफ जमे हुए पानी में पनपता है। समय पर पहचान और पर्याप्त पानी पीना सबसे जरूरी है।',
    summaryOr: 'ଏଡିସ୍ ମଶା କାମୁଡ଼ିବା ଦ୍ୱାରା ଏହି ଜ୍ୱର ବ୍ୟାପେ। ଜଳୀୟ ଅଂଶ ବଜାୟ ରଖିବା ଓ ସଠିକ୍ ସମୟରେ ଡାକ୍ତର ଦେଖାଇବା ଜରୁରୀ।',
    keySigns: [
      'Sudden high fever (103°F-104°F) with intense retro-orbital eye pain',
      'Severe bone and joint pain ("breakbone fever")',
      'Nausea, persistent vomiting, and loss of appetite',
      'DANGER SIGNS (Days 3-7): Mucosal bleeding (gums/nose), red skin petechiae, severe abdominal pain, extreme cold clammy skin'
    ],
    causesAndRisks: [
      'Stagnant water in desert coolers, discarded tyres, flower pots, overhead tanks',
      'Aedes mosquitoes bite predominantly during daylight hours (early morning & late afternoon)',
      'Post-monsoon water logging in urban and rural settlements'
    ],
    preventionAndDiet: [
      'Empty and scrub desert coolers, coconut shells, and water tanks every Sunday (Dry Day).',
      'Sleep under insecticide-treated bed nets and use mosquito repellent coils/creams.',
      'Continuous hydration: Drink ORS, tender coconut water, lemon water, and clear dal soups.',
      'CRITICAL MEDICAL RULE: NEVER take Ibuprofen, Diclofenac, or Aspirin during suspected dengue as they trigger fatal gastrointestinal bleeding. Use only plain Paracetamol for fever.'
    ],
    whenToSeeDoctor: 'IMMEDIATELY if you notice gum bleeding, blood in vomit, black stools, persistent vomiting, or extreme weakness as the fever drops.',
    mythsAndFacts: [
      {
        myth: 'Myth: Dengue danger ends as soon as the fever goes away.',
        fact: 'Fact: The critical leakage phase begins precisely when fever subsides (Days 4 to 6). This is when blood platelets can plummet and shock can occur.'
      },
      {
        myth: 'Myth: Papaya leaf extract cures dengue completely without needing hospital fluids.',
        fact: 'Fact: Only intravenous fluids given under medical supervision can correct plasma leakage and save lives in severe dengue shock.'
      }
    ],
    audioPromptText: {
      en: 'Dengue is spread by mosquitoes that breed in clean standing water. If fever is accompanied by gum bleeding, vomiting, or stomach pain, seek hospital care immediately. Drink plenty of ORS and coconut water. Never take Brufen or Ibuprofen for dengue fever.',
      hi: 'डेंगू साफ पानी में पनपने वाले मच्छरों से होता है। यदि बुखार के साथ मसूड़ों से खून आए या उल्टी हो, तो तुरंत अस्पताल जाएं। ओआरएस और नारियल पानी खूब पिएं। डेंगू में कभी भी ब्रूफेन या एस्पिरिन न लें।',
      or: 'ଡେଙ୍ଗୁ ସଫା ପାଣିରେ ଜନ୍ମୁଥିବା ମଶା ଯୋଗୁଁ ହୁଏ। ଜ୍ୱର ସହ ମାଢ଼ିରୁ ରକ୍ତ ପଡ଼ିଲେ ବା ପେଟ କାଟିଲେ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ। ପ୍ରଚୁର ପାଣି ଓ ଓଆରଏସ୍ ପିଅନ୍ତୁ।'
    }
  },
  {
    id: 'topic-malnutrition',
    slug: 'malnutrition',
    title: 'Child Malnutrition & Growth Milestones',
    titleHi: 'बाल कुपोषण, आहार एवं पोषण अभियान',
    titleOr: 'ଶିଶୁ ଅପୁଷ୍ଟି ନିବାରଣ ଓ ପୁଷ୍ଟିକର ଆହାର',
    category: 'Maternal & Child',
    summary: 'Deficiencies in energy, protein, and essential micronutrients affecting growth and cognitive brain development in early childhood.',
    summaryHi: 'बच्चों में वजन और लंबाई का उम्र के हिसाब से कम होना। शुरुआती 1000 दिनों में सही पोषण बच्चे के पूरे भविष्य का निर्माण करता है।',
    summaryOr: 'ପିଲାଙ୍କର ବୟସ ଅନୁସାରେ ଓଜନ ନ ବଢ଼ିବା ଅପୁଷ୍ଟିର ଲକ୍ଷଣ। ପୁଷ୍ଟିକର ଖାଦ୍ୟ ଶିଶୁର ସଠିକ୍ ବିକାଶ ପାଇଁ ଏକାନ୍ତ ଆବଶ୍ୟକ।',
    keySigns: [
      'Child weighs much less than growth chart road-to-health curve',
      'Thin arms, visible ribs, sunken eyes, or swollen feet (edema)',
      'Frequent episodes of diarrhea and chest infections',
      'Child appears dull, irritable, and reluctant to play or crawl'
    ],
    causesAndRisks: [
      'Stopping exclusive breastfeeding before 6 completed months',
      'Delayed introduction of energy-dense semi-solid complementary foods',
      'Unsafe water leading to chronic gut inflammation and parasite infections',
      'Poverty and lack of maternal nutrition awareness'
    ],
    preventionAndDiet: [
      'Exclusive breastfeeding for the first 6 months (no honey, ghutti, or water).',
      'From 6 months onward, introduce mashed local foods: Khichdi with extra ghee/oil, smashed bananas, boiled eggs, boiled dal and sweet potato.',
      'Attend monthly Anganwadi Village Health Sanitation and Nutrition Days (VHSND) for weight monitoring.',
      'Feed frequently: Young children have small stomachs and need 4 to 5 small nutrient-dense meals a day.'
    ],
    whenToSeeDoctor: 'If the child is too weak to suckle, has swelling in both feet, vomits everything, or is visibly wasting away.',
    mythsAndFacts: [
      {
        myth: 'Myth: Giving eggs or lentils to young children causes heat in the stomach.',
        fact: 'Fact: Eggs, lentils, and groundnuts provide the essential proteins necessary to grow muscles and bones.'
      },
      {
        myth: 'Myth: Packaged biscuits and commercial baby cereals are more nourishing than home-cooked food.',
        fact: 'Fact: Home-cooked khichdi enriched with oil/ghee and vegetables is far superior and free from excess sugar and preservatives.'
      }
    ],
    audioPromptText: {
      en: 'Every child deserves complete nutrition. Breastfeed exclusively for the first six months. After six months, give homemade khichdi with ghee, mashed fruits, and eggs. Visit the Anganwadi center every month for growth checks.',
      hi: 'छह महीने तक बच्चे को सिर्फ मां का दूध पिलाएं। इसके बाद घर की बनी खिचड़ी में थोड़ा घी या तेल मिलाकर, उबला अंडा और फल खिलाएं। हर महीने आंगनवाड़ी केंद्र में बच्चे का वजन जरूर कराएं।',
      or: 'ପ୍ରଥମ ୬ ମାସ ପର୍ଯ୍ୟନ୍ତ ଶିଶୁକୁ କେବଳ ମା’ କ୍ଷୀର ଦିଅନ୍ତୁ। ତା’ପରେ ଘରେ ତିଆରି ଖେଚୁଡ଼ି, ଘିଅ, ଅଣ୍ଡା ଓ ଫଳ ଖୁଆନ୍ତୁ। ଅଙ୍ଗନୱାଡ଼ି କେନ୍ଦ୍ରରେ ନିୟମିତ ଓଜନ କରାନ୍ତୁ।'
    }
  },
  {
    id: 'topic-hygiene-ors',
    slug: 'hygiene-ors',
    title: 'Hygiene, Safe Drinking Water & ORS Preparation',
    titleHi: 'स्वच्छता, सुरक्षित पेयजल एवं ओआरएस (ORS)',
    titleOr: 'ପରିମଳ, ବିଶୁଦ୍ଧ ପାନୀୟ ଜଳ ଓ ଓଆରଏସ୍ ପ୍ରସ୍ତୁତି',
    category: 'Nutrition & Hygiene',
    summary: 'Simple community hygiene practices that prevent 80% of diarrheal deaths, typhoid, cholera, and hepatitis infections.',
    summaryHi: 'साबुन से सही हाथ धोना और दस्त होने पर तुरंत ओआरएस देना बच्चों की जान बचाने का सबसे असरदार और सस्ता उपाय है।',
    summaryOr: 'ସାବୁନରେ ହାତ ଧୋଇବା ଓ ଝାଡ଼ାବାନ୍ତି ହେଲେ ଓଆରଏସ୍ ପିଇବା ଦ୍ୱାରା ମୃତ୍ୟୁ ହାର ରୋକାଯାଇପାରିବ।',
    keySigns: [
      'Watery stools more than 3 times a day',
      'Dry tongue, sunken eyes, skin that stays pinched up (dehydration)',
      'Severe thirst followed by extreme drowsiness',
      'No urine output for more than 6 to 8 hours'
    ],
    causesAndRisks: [
      'Drinking untreated well or river water during rainy season',
      'Eating food with unwashed hands after using the toilet',
      'Flies landing on open food and cut market fruits',
      'Open defecation near village water sources'
    ],
    preventionAndDiet: [
      'HOW TO PREPARE ORS PROPERLY: Mix 1 full packet of government ORS powder into 1 litre of clean boiled water. Stir well. Drink in small sips throughout the day. Discard any leftover solution after 24 hours.',
      'Give Zinc tablets for 14 days during pediatric diarrhea to heal the intestinal lining.',
      'Boil drinking water for at least 1 minute during monsoons.',
      'Wash hands with soap: Before cooking, before eating, and after using the latrine.'
    ],
    whenToSeeDoctor: 'If there is blood in stool (dysentery), child is unable to drink liquids, or shows extreme lethargy and sunken eyes.',
    mythsAndFacts: [
      {
        myth: 'Myth: Stop giving water and food during diarrhea to give the intestines rest.',
        fact: 'Fact: Stopping fluids causes fatal dehydration. Continue breastfeeding and give plenty of fluids and ORS immediately.'
      },
      {
        myth: 'Myth: Commercial sweet energy drinks are just as good as medical ORS.',
        fact: 'Fact: Sugary drinks worsen diarrhea through osmotic water loss. Only standard WHO low-osmolarity ORS has the exact sodium-to-glucose balance.'
      }
    ],
    audioPromptText: {
      en: 'Diarrhea can be prevented by washing hands with soap and drinking clean boiled water. If loose motions begin, mix one full packet of government ORS in one litre of clean water. Drink throughout the day to prevent dehydration.',
      hi: 'दस्त और उल्टी होने पर तुरंत ओआरएस का घोल बनाएं। एक पैकेट ओआरएस को एक लीटर साफ पानी में मिलाएं। दिनभर थोड़ा-थोड़ा पिएं। साबुन से हाथ धोने से पेट की 80% बीमारियां रुकती हैं।',
      or: 'ଝାଡ଼ାବାନ୍ତି ହେଲେ ତୁରନ୍ତ ୧ ପ୍ୟାକେଟ୍ ଓଆରଏସ୍‌କୁ ୧ ଲିଟର ସଫା ପାଣିରେ ମିଶାଇ ପିଅନ୍ତୁ। ସାବୁନରେ ହାତ ଧୁଅନ୍ତୁ ଏବଂ ଫୁଟା ପାଣି ପିଅନ୍ତୁ।'
    }
  },
  {
    id: 'topic-preventive-care',
    slug: 'preventive-care',
    title: 'Preventive Lifestyle & Non-Communicable Screening',
    titleHi: 'निवारक देखभाल, नमक नियंत्रण एवं निःशुल्क जांच',
    titleOr: 'ନିବାରକ ସ୍ୱାସ୍ଥ୍ୟ ରକ୍ଷା ଓ ରକ୍ତଚାପ ନିୟନ୍ତ୍ରଣ',
    category: 'Preventive Care',
    summary: 'Simple everyday health habits that protect against premature heart attacks, strokes, and kidney failure.',
    summaryHi: 'कम नमक खाना, तंबाकू से दूर रहना और साल में एक बार बीपी और शुगर की जांच कराना आपको दिल के दौरे से सुरक्षित रखता है।',
    summaryOr: 'ଲୁଣ କମ୍ ଖାଇବା, ନିୟମିତ ବ୍ୟାୟାମ ଓ ବର୍ଷକୁ ଥରେ ବିପି-ସୁଗାର ପରୀକ୍ଷା କରାଇବା ଦ୍ୱାରା ସୁସ୍ଥ ରହିପାରିବେ।',
    keySigns: [
      'High blood pressure (hypertension) is known as the "silent killer" because it has no early symptoms!',
      'Occasional morning occipital headaches and mild dizziness',
      'Shortness of breath with moderate climbing',
      'Chest tightness or heaviness while walking uphill'
    ],
    causesAndRisks: [
      'Consuming more than 5 grams (1 teaspoon) of salt per day (pickles, papad, namkeen)',
      'Smoking bidis, cigarettes, or chewing gutkha / khaini (damages blood vessel lining)',
      'Chronic stress, lack of sleep, and zero aerobic exercise'
    ],
    preventionAndDiet: [
      'Cut dietary salt: Avoid adding extra raw salt on salads and curd. Limit pickles and salted fried snacks.',
      'Stop all forms of tobacco: Gutkha, bidi, and cigarettes cause 60% of oral cancers and early heart attacks in India.',
      'Visit your nearest Ayushman Arogya Mandir (Health & Wellness Centre) for free annual BP, Blood Sugar, and Oral Cancer screening.',
      'Practice 15 minutes of Pranayama or deep breathing daily to manage stress.'
    ],
    whenToSeeDoctor: 'If blood pressure exceeds 140/90 mmHg on two separate readings, or if you feel crushing chest heaviness or sudden facial numbness.',
    mythsAndFacts: [
      {
        myth: 'Myth: High blood pressure always gives you a headache, so if I feel fine I don’t have high BP.',
        fact: 'Fact: Hypertension is almost completely asymptomatic until a heart attack or stroke strikes. Routine measurement is the only way to know.'
      },
      {
        myth: 'Myth: Rock salt (sendha namak) has zero sodium and can be eaten in unlimited amounts.',
        fact: 'Fact: Rock salt and black salt contain approximately 85% to 95% sodium chloride, and will still elevate blood pressure if eaten excessively.'
      }
    ],
    audioPromptText: {
      en: 'Protect your heart by reducing salt to under one teaspoon a day. Avoid all tobacco and bidi products. Visit your local Ayushman Arogya Mandir once a year for free blood pressure and diabetes screening.',
      hi: 'दिनभर में एक चम्मच से कम नमक खाएं। बीड़ी और गुटखा दिल और फेफड़ों को भारी नुकसान पहुंचाते हैं। हर साल नजदीकी आयुष्मान आरोग्य मंदिर जाकर अपना ब्लड प्रेशर और शुगर मुफ्त में जरूर नपवाएं।',
      or: 'ଦିନକୁ ଏକ ଚାମଚରୁ କମ୍ ଲୁଣ ଖାଆନ୍ତୁ। ବିଡ଼ି ଓ ତମାଖୁ ଛାଡ଼ନ୍ତୁ। ବର୍ଷକୁ ଥରେ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ଯାଇ ମାଗଣାରେ ରକ୍ତଚାପ ଓ ଶର୍କରା ଯାଞ୍ଚ କରନ୍ତୁ।'
    }
  }
];
