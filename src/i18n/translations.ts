import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  disclaimer: string;
  sourceBadge: string;
  
  // Navigation
  navPrices: string;
  navCompare: string;
  navNearby: string;
  navCalculator: string;
  navTrends: string;
  navAlerts: string;
  navAiAssistant: string;
  navAdmin: string;
  
  // Auth
  login: string;
  profile: string;
  enterMobile: string;
  mobileNumber: string;
  sendOtp: string;
  verifyOtp: string;
  otpSentTo: string;
  enter6DigitOtp: string;
  farmerName: string;
  selectState: string;
  selectDistrict: string;
  villageName: string;
  preferredCrops: string;
  saveProfile: string;
  demoOtpHint: string;
  resendOtp: string;
  
  // Price Browser
  filterCrops: string;
  allCrops: string;
  allStates: string;
  allDistricts: string;
  searchPlaceholder: string;
  modalPrice: string;
  minPrice: string;
  maxPrice: string;
  arrivals: string;
  quintal: string;
  todayTrend: string;
  mspTag: string;
  compareThisMandi: string;
  calcReturn: string;
  setAlert: string;
  noPricesFound: string;
  lastUpdated: string;
  variety: string;
  grade: string;
  
  // Market Compare
  compareHeading: string;
  compareSubheading: string;
  selectCropToCompare: string;
  selectMandis: string;
  produceQuantity: string;
  transportRate: string;
  priceDiff: string;
  netInHandDiff: string;
  distance: string;
  estimatedTransport: string;
  mandiCess: string;
  hamaliCharges: string;
  netRealization: string;
  recommendation: string;
  
  // Nearby Mandis
  nearbyHeading: string;
  nearbySubheading: string;
  useMyLocation: string;
  operatingHours: string;
  facilities: string;
  secretaryContact: string;
  calculateReturnFromHere: string;
  
  // Net Return Calculator
  calcHeading: string;
  calcSubheading: string;
  channelVillage: string;
  channelLocalApmc: string;
  channelTerminal: string;
  grossRevenue: string;
  totalExpenses: string;
  netInPocket: string;
  netPerQuintal: string;
  farmgateOffer: string;
  
  // Price Trends
  trendsHeading: string;
  trendsSubheading: string;
  timeframe7d: string;
  timeframe30d: string;
  timeframe90d: string;
  highestPrice: string;
  lowestPrice: string;
  averagePrice: string;
  mspBenchmark: string;
  seasonalityNote: string;
  
  // Alerts
  alertsHeading: string;
  alertsSubheading: string;
  createNewAlert: string;
  targetPrice: string;
  alertWhen: string;
  notifyVia: string;
  activeAlerts: string;
  noAlertsYet: string;
  
  // AI Assistant
  aiHeading: string;
  aiSubheading: string;
  aiPlaceholder: string;
  askAssistant: string;
  listening: string;
  speakPrompt: string;
  voiceReadout: string;
  stopVoice: string;
  suggestedQuestions: string;
  
  // Admin
  adminHeading: string;
  updateDailyPrice: string;
  submitPrice: string;
  activeFeedStatus: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: 'Smart Kisaan',
    tagline: 'Know the Price. Compare the Market. Sell Smarter.',
    heroHeading: 'Know the Market Before You Sell',
    heroSubheading: 'Compare available agricultural market prices, understand price trends, explore nearby markets, and make better-informed selling decisions.',
    disclaimer: 'Smart Kisaan aggregates verified reported APMC market auction prices. Smart Kisaan does not set market prices; auction prices are determined by mandi buyers and sellers.',
    sourceBadge: 'Verified APMC / Agmarknet Market Intelligence',
    
    navPrices: 'Market Prices',
    navCompare: 'Compare Mandis',
    navNearby: 'Nearby Markets',
    navCalculator: 'Net Return Calculator',
    navTrends: 'Price Trends',
    navAlerts: 'Price Alerts',
    navAiAssistant: 'Smart Kisaan AI',
    navAdmin: 'APMC Desk',
    
    login: 'Farmer Login / Register',
    profile: 'My Farm Profile',
    enterMobile: 'Enter 10-digit Mobile Number',
    mobileNumber: 'Mobile Number',
    sendOtp: 'Send OTP via SMS',
    verifyOtp: 'Verify & Enter Platform',
    otpSentTo: 'Verification code sent to',
    enter6DigitOtp: 'Enter 6-Digit OTP',
    farmerName: 'Farmer Full Name',
    selectState: 'Select State',
    selectDistrict: 'Select District',
    villageName: 'Village / Taluk',
    preferredCrops: 'Primary Crops You Grow',
    saveProfile: 'Save Profile & Continue',
    demoOtpHint: 'Test Mode OTP: 123456',
    resendOtp: 'Resend OTP in',
    
    filterCrops: 'Select Crop',
    allCrops: 'All Commodities',
    allStates: 'All States',
    allDistricts: 'All Districts',
    searchPlaceholder: 'Search by crop, mandi name, or district...',
    modalPrice: 'Modal Price',
    minPrice: 'Min Price',
    maxPrice: 'Max Price',
    arrivals: 'Arrivals Today',
    quintal: 'Quintal (100 kg)',
    todayTrend: 'Day Trend',
    mspTag: 'Govt MSP',
    compareThisMandi: 'Compare Mandi',
    calcReturn: 'Calculate Return',
    setAlert: 'Set Alert',
    noPricesFound: 'No reported mandi prices matching your search filter.',
    lastUpdated: 'Updated Today',
    variety: 'Variety',
    grade: 'Grade',
    
    compareHeading: 'Compare Mandi Auctions Side-by-Side',
    compareSubheading: 'Compare modal prices, calculate transport travel cost, and find which mandi nets the most cash in your pocket.',
    selectCropToCompare: 'Commodity to Compare',
    selectMandis: 'Select Mandis to Compare',
    produceQuantity: 'Quantity of Produce',
    transportRate: 'Transport Rate (₹/km)',
    priceDiff: 'Price Difference',
    netInHandDiff: 'Net In-Hand Difference',
    distance: 'Distance',
    estimatedTransport: 'Est. Transport Cost',
    mandiCess: 'APMC Mandi Fee',
    hamaliCharges: 'Loading / Hamali',
    netRealization: 'Net Take-Home',
    recommendation: 'Smart Kisaan Recommendation',
    
    nearbyHeading: 'Nearby APMC Regulated Markets',
    nearbySubheading: 'Explore open market yards around your farm, auction timings, amenities, and direct trader desks.',
    useMyLocation: 'Detect My Location',
    operatingHours: 'Auction Timings',
    facilities: 'Mandi Facilities',
    secretaryContact: 'Secretary & Trader Desk',
    calculateReturnFromHere: 'Calculate Return From Here',
    
    calcHeading: 'Estimated Net Return Calculator',
    calcSubheading: 'Compare selling at your farmgate to local village middleman vs taking produce to local APMC or distant terminal wholesale hub.',
    channelVillage: 'Village Trader / Middleman (Farmgate)',
    channelLocalApmc: 'Local APMC Mandi Yard',
    channelTerminal: 'Distant Terminal Wholesale Market',
    grossRevenue: 'Gross Value',
    totalExpenses: 'Total Deductions',
    netInPocket: 'Net In-Pocket Profit',
    netPerQuintal: 'Net per Quintal',
    farmgateOffer: 'Farmgate Trader Offer (₹/q)',
    
    trendsHeading: 'Historical Price Trends & MSP Analysis',
    trendsSubheading: 'Analyze 7-day to 90-day modal price movements against government Minimum Support Prices (MSP) to time your sales smartly.',
    timeframe7d: '7 Days',
    timeframe30d: '30 Days',
    timeframe90d: '90 Days',
    highestPrice: 'Highest Modal',
    lowestPrice: 'Lowest Modal',
    averagePrice: 'Average Modal',
    mspBenchmark: 'Govt MSP Baseline',
    seasonalityNote: 'Market Advisory Insight',
    
    alertsHeading: 'Custom Price Alert Notifications',
    alertsSubheading: 'Never miss a price spike. Get instant SMS or WhatsApp notifications when mandi rates cross your target price.',
    createNewAlert: 'Create New Alert',
    targetPrice: 'Target Modal Price (₹/q)',
    alertWhen: 'Alert Condition',
    notifyVia: 'Notification Mode',
    activeAlerts: 'Active Alert Subscriptions',
    noAlertsYet: 'No price alerts configured yet. Add your first alert above.',
    
    aiHeading: 'Smart Kisaan AI Advisory Assistant',
    aiSubheading: 'Ask questions about market selling timings, crop grading, MSP schemes, or harvest handling in your own language.',
    aiPlaceholder: 'Type or speak your agricultural question...',
    askAssistant: 'Ask Assistant',
    listening: 'Listening to your voice...',
    speakPrompt: 'Speak in your language',
    voiceReadout: 'Listen to Answer',
    stopVoice: 'Stop Audio',
    suggestedQuestions: 'Suggested Questions for Today',
    
    adminHeading: 'APMC Mandi Price Submission Desk',
    updateDailyPrice: 'Post Daily Auction Price Report',
    submitPrice: 'Submit Mandi Feed',
    activeFeedStatus: 'Market Intelligence Source Monitor',
  },

  hi: {
    appName: 'स्मार्ट किसान',
    tagline: 'दाम जानें। मंडी परखें। समझदारी से बेचें।',
    heroHeading: 'फसल बेचने से पहले सही मंडी भाव जानें',
    heroSubheading: 'सत्यापित कृषि मंडी भावों की तुलना करें, मूल्य रुझान समझें, नजदीकी मंडियां खोजें और अपनी मेहनत का सही मुनाफा पाएं।',
    disclaimer: 'स्मार्ट किसान आधिकारिक कृषि मंडियों (APMC) के दैनिक नीलामी भाव प्रदर्शित करता है। स्मार्ट किसान स्वयं कोई मूल्य तय नहीं करता।',
    sourceBadge: 'सत्यापित APMC / एगमार्कनेट मंडी डेटा',
    
    navPrices: 'मंडी भाव',
    navCompare: 'बाजार तुलना',
    navNearby: 'नजदीकी मंडी',
    navCalculator: 'शुद्ध लाभ कैलकुलेटर',
    navTrends: 'मूल्य रुझान',
    navAlerts: 'भाव अलर्ट',
    navAiAssistant: 'किसान साथी AI',
    navAdmin: 'मंडी डेस्क',
    
    login: 'किसान लॉगिन / पंजीकरण',
    profile: 'मेरी कृषि प्रोफाइल',
    enterMobile: '10 अंकों का मोबाइल नंबर दर्ज करें',
    mobileNumber: 'मोबाइल नंबर',
    sendOtp: 'SMS से OTP भेजें',
    verifyOtp: 'सत्यापित करें और आगे बढ़ें',
    otpSentTo: 'सत्यापन कोड भेजा गया',
    enter6DigitOtp: '6 अंकों का OTP दर्ज करें',
    farmerName: 'किसान का पूरा नाम',
    selectState: 'राज्य चुनें',
    selectDistrict: 'जिला चुनें',
    villageName: 'गाँव / तहसील',
    preferredCrops: 'मुख्य फसलें जो आप उगाते हैं',
    saveProfile: 'प्रोफाइल सहेजें',
    demoOtpHint: 'परीक्षण OTP: 123456',
    resendOtp: 'दोबारा OTP भेजें',
    
    filterCrops: 'फसल चुनें',
    allCrops: 'सभी फसलें',
    allStates: 'सभी राज्य',
    allDistricts: 'सभी जिले',
    searchPlaceholder: 'फसल, मंडी या जिले के नाम से खोजें...',
    modalPrice: 'मॉडल भाव (औसत)',
    minPrice: 'न्यूनतम भाव',
    maxPrice: 'अधिकतम भाव',
    arrivals: 'आज की आवक',
    quintal: 'क्विंटल (100 किग्रा)',
    todayTrend: 'दैनिक रुझान',
    mspTag: 'सरकारी MSP',
    compareThisMandi: 'मंडी तुलना करें',
    calcReturn: 'लाभ निकालें',
    setAlert: 'अलर्ट लगाएं',
    noPricesFound: 'खोज के अनुसार कोई मंडी भाव उपलब्ध नहीं है।',
    lastUpdated: 'आज अपडेट हुआ',
    variety: 'किस्म',
    grade: 'श्रेणी (Grade)',
    
    compareHeading: 'मंडियों की आमने-सामने तुलना',
    compareSubheading: 'भाव अंतर और दूरी का भाड़ा जोड़कर देखें कि कौन सी मंडी में बेचने पर आपकी जेब में ज्यादा पैसा बचेगा।',
    selectCropToCompare: 'तुलना के लिए फसल',
    selectMandis: 'तुलना हेतु मंडियां चुनें',
    produceQuantity: 'फसल की मात्रा',
    transportRate: 'परिवहन दर (₹/किमी)',
    priceDiff: 'भाव का अंतर',
    netInHandDiff: 'शुद्ध बचत अंतर',
    distance: 'दूरी',
    estimatedTransport: 'अनुमानित भाड़ा',
    mandiCess: 'मंडी शुल्क (Cess)',
    hamaliCharges: 'हमाली / उतराई',
    netRealization: 'जेब में शुद्ध लाभ',
    recommendation: 'स्मार्ट किसान की सलाह',
    
    nearbyHeading: 'नजदीकी सरकारी APMC मंडियां',
    nearbySubheading: 'अपने खेत के पास खुली मंडियां, नीलामी का समय, सुविधाएं और संपर्क सूत्र देखें।',
    useMyLocation: 'मेरी लोकेशन खोजें',
    operatingHours: 'नीलामी का समय',
    facilities: 'मंडी सुविधाएं',
    secretaryContact: 'सचिव एवं व्यापारी संपर्क',
    calculateReturnFromHere: 'यहाँ से मुनाफा निकालें',
    
    calcHeading: 'शुद्ध लाभ कैलकुलेटर (Net Return)',
    calcSubheading: 'गाँव के आढ़ती, स्थानीय मंडी और दूर की बड़ी थोक मंडी में बेचने पर खर्च काटकर शुद्ध मुनाफा देखें।',
    channelVillage: 'गाँव का आढ़ती / बिचौलिया (खेत पर खरीद)',
    channelLocalApmc: 'स्थानीय APMC मंडी यार्ड',
    channelTerminal: 'दूर की बड़ी टर्मिनल थोक मंडी',
    grossRevenue: 'कुल बिक्री मूल्य',
    totalExpenses: 'कुल खर्चे (भाड़ा, हमाली, बोरी)',
    netInPocket: 'जेब में शुद्ध लाभ',
    netPerQuintal: 'प्रति क्विंटल शुद्ध दर',
    farmgateOffer: 'खेत पर व्यापारी का भाव (₹/क्विंटल)',
    
    trendsHeading: 'मूल्य रुझान एवं MSP विश्लेषण',
    trendsSubheading: 'पिछले 7 से 90 दिनों के भाव देखें और जानें कि फसल अभी बेचनी चाहिए या रोककर।',
    timeframe7d: '7 दिन',
    timeframe30d: '30 दिन',
    timeframe90d: '90 दिन',
    highestPrice: 'उच्चतम भाव',
    lowestPrice: 'न्यूनतम भाव',
    averagePrice: 'औसत भाव',
    mspBenchmark: 'सरकारी समर्थन मूल्य (MSP)',
    seasonalityNote: 'बाजार विशेषज्ञ सलाह',
    
    alertsHeading: 'मंडी भाव अलर्ट',
    alertsSubheading: 'जब भी मंडी में भाव आपके लक्ष्य तक पहुंचे, तुरंत मोबाइल पर SMS या WhatsApp पाएं।',
    createNewAlert: 'नया अलर्ट जोड़ें',
    targetPrice: 'लक्ष्य भाव (₹/क्विंटल)',
    alertWhen: 'अलर्ट शर्त',
    notifyVia: 'माध्यम',
    activeAlerts: 'सक्रिय अलर्ट',
    noAlertsYet: 'अभी कोई अलर्ट सक्रिय नहीं है। ऊपर नया अलर्ट जोड़ें।',
    
    aiHeading: 'स्मार्ट किसान AI सलाहकार',
    aiSubheading: 'अपनी भाषा में बोलकर या लिखकर मंडी, फसल ग्रेडिंग और सरकारी योजनाओं से जुड़े सवाल पूछें।',
    aiPlaceholder: 'अपनी कृषि समस्या या मंडी का सवाल यहाँ लिखें...',
    askAssistant: 'सवाल पूछें',
    listening: 'आपकी आवाज सुनी जा रही है...',
    speakPrompt: 'माइक दबाकर बोलें',
    voiceReadout: 'उत्तर सुनें',
    stopVoice: 'आवाज रोकें',
    suggestedQuestions: 'आज के महत्वपूर्ण सवाल',
    
    adminHeading: 'APMC मंडी भाव प्रविष्टि डेस्क',
    updateDailyPrice: 'दैनिक नीलामी भाव अपडेट करें',
    submitPrice: 'भाव सहेजें',
    activeFeedStatus: 'मंडी डेटा स्रोत स्थिति',
  },

  ta: {
    appName: 'Smart Kisaan',
    tagline: 'விலையை அறிவோம். சந்தையை ஒப்பிடுவோம். லாபகரமாக விற்போம்.',
    heroHeading: 'விளைபொருளை விற்பதற்கு முன் சரியான சந்தை விலையை அறியுங்கள்',
    heroSubheading: 'அங்கீகரிக்கப்பட்ட உழவர் சந்தை விலைகளை ஒப்பிட்டு, போக்குவரத்து செலவை கணக்கிட்டு, அதிக லாபம் தரும் சந்தையை தேர்வு செய்யுங்கள்.',
    disclaimer: 'Smart Kisaan அதிகாரப்பூர்வ ஒழுங்குமுறை விற்பனைக் கூடங்களின் (APMC) தினசரி ஏல விலைகளை வழங்குகிறது. Smart Kisaan விலையை நிர்ணயிப்பதில்லை.',
    sourceBadge: 'உறுதிசெய்யப்பட்ட APMC / Agmarknet உழவர் சந்தை தகவல்',
    
    navPrices: 'சந்தை விலை',
    navCompare: 'சந்தை ஒப்பீடு',
    navNearby: 'அருகிலுள்ள சந்தைகள்',
    navCalculator: 'நிகர லாப கணக்கீடு',
    navTrends: 'விலை போக்கு',
    navAlerts: 'விலை எச்சரிக்கை',
    navAiAssistant: 'கிசான் AI தோழன்',
    navAdmin: 'நிர்வாக மையம்',
    
    login: 'விவசாயி உள்நுழைவு / பதிவு',
    profile: 'என் விவசாய விவரம்',
    enterMobile: '10 இலக்க கைபேசி எண்',
    mobileNumber: 'கைபேசி எண்',
    sendOtp: 'SMS மூலம் OTP பெறுக',
    verifyOtp: 'சரிபார்த்து உள்நுழைக',
    otpSentTo: 'சரிபார்ப்பு குறியீடு அனுப்பப்பட்டது',
    enter6DigitOtp: '6 இலக்க OTP ஐ உள்ளிடவும்',
    farmerName: 'விவசாயியின் பெயர்',
    selectState: 'மாநிலம் தேர்வு செய்க',
    selectDistrict: 'மாவட்டம் தேர்வு செய்க',
    villageName: 'கிராமம் / தாலுகா',
    preferredCrops: 'நீங்கள் பயிரிடும் முக்கிய பயிர்கள்',
    saveProfile: 'விவரங்களைச் சேமிக்கவும்',
    demoOtpHint: 'சோதனை OTP: 123456',
    resendOtp: 'மீண்டும் OTP அனுப்ப',
    
    filterCrops: 'பயிர் தேர்வு செய்க',
    allCrops: 'அனைத்துப் பயிர்கள்',
    allStates: 'அனைத்து மாநிலங்கள்',
    allDistricts: 'அனைத்து மாவட்டங்கள்',
    searchPlaceholder: 'பயிர், சந்தை அல்லது மாவட்டப் பெயர் கொண்டு தேடவும்...',
    modalPrice: 'சராசரி ஏல விலை',
    minPrice: 'குறைந்தபட்ச விலை',
    maxPrice: 'அதிகபட்ச விலை',
    arrivals: 'இன்றைய வரத்து',
    quintal: 'குவிண்டால் (100 கிலோ)',
    todayTrend: 'விலை மாற்றம்',
    mspTag: 'அரசு கொள்முதல் விலை (MSP)',
    compareThisMandi: 'சந்தையை ஒப்பிடு',
    calcReturn: 'லாபம் கணக்கிடு',
    setAlert: 'விலை எச்சரிக்கை அமை',
    noPricesFound: 'தேடலுக்குரிய சந்தை விலைகள் ஏதும் கிடைக்கவில்லை.',
    lastUpdated: 'இன்று புதுப்பிக்கப்பட்டது',
    variety: 'ரகம்',
    grade: 'தரம் (Grade)',
    
    compareHeading: 'சந்தைகளை நேருக்கு நேர் ஒப்பிடுங்கள்',
    compareSubheading: 'விலை வேறுபாடு மற்றும் வண்டி வாடகையை கணக்கிட்டு, எந்த சந்தையில் விற்றால் கைக்கு அதிக பணம் கிடைக்கும் என அறிந்து கொள்ளுங்கள்.',
    selectCropToCompare: 'ஒப்பிட வேண்டிய விளைபொருள்',
    selectMandis: 'ஒப்பிட வேண்டிய சந்தைகள்',
    produceQuantity: 'விளைபொருள் அளவு',
    transportRate: 'போக்குவரத்து கட்டணம் (₹/கி.மீ)',
    priceDiff: 'விலை வித்தியாசம்',
    netInHandDiff: 'நிகர லாப வித்தியாசம்',
    distance: 'தூரம்',
    estimatedTransport: 'தோராய வண்டி வாடகை',
    mandiCess: 'சந்தை வரி',
    hamaliCharges: 'சுமை கூலி (ஹமாலி)',
    netRealization: 'கைக்குக் கிடைக்கும் நிகர லாபம்',
    recommendation: 'Smart Kisaan பரிந்துரை',
    
    nearbyHeading: 'அருகிலுள்ள ஒழுங்குமுறை விற்பனைக் கூடங்கள்',
    nearbySubheading: 'உங்கள் இருப்பிடத்திற்கு அருகிலுள்ள அரசு அங்கீகாரம் பெற்ற மண்டிகள், ஏல நேரம் மற்றும் வசதிகள்.',
    useMyLocation: 'என் இருப்பிடத்தைக் கண்டறி',
    operatingHours: 'ஏல நேரம்',
    facilities: 'சந்தை வசதிகள்',
    secretaryContact: 'செயலாளர் மற்றும் வியாபாரி தொடர்பு',
    calculateReturnFromHere: 'இங்கிருந்து லாபம் கணக்கிடு',
    
    calcHeading: 'நிகர வருவாய் கணக்கீட்டுக் கருவி',
    calcSubheading: 'கிராமத்து இடைத்தரகர், உள்ளூர் ஒழுங்குமுறை கூடம் மற்றும் பெருநகர மொத்த சந்தை - எதில் விற்றால் அதிக லாபம்?',
    channelVillage: 'கிராமத்து வியாபாரி (தோட்டத்திலேயே விற்பனை)',
    channelLocalApmc: 'உள்ளூர் ஒழுங்குமுறை விற்பனைக்கூடம்',
    channelTerminal: 'தொலைதூர பெருநகர மொத்த சந்தை',
    grossRevenue: 'மொத்த விற்பனைத் தொகை',
    totalExpenses: 'மொத்த செலவுகள் (வாடகை, கூலி, சாக்கு)',
    netInPocket: 'கைக்குக் கிடைக்கும் நிகர லாபம்',
    netPerQuintal: 'ஒரு குவிண்டாலுக்கான நிகர விலை',
    farmgateOffer: 'தோட்டத்து வியாபாரி தரும் விலை (₹/குவிண்டால்)',
    
    trendsHeading: 'விலை போக்கு & அரசு MSP ஒப்பீடு',
    trendsSubheading: 'கடந்த 7 முதல் 90 நாட்களின் சந்தை விலை நிலவரத்தை அறிந்து சரியான நேரத்தில் விற்பனை செய்யுங்கள்.',
    timeframe7d: '7 நாட்கள்',
    timeframe30d: '30 நாட்கள்',
    timeframe90d: '90 நாட்கள்',
    highestPrice: 'அதிகபட்ச சராசரி விலை',
    lowestPrice: 'குறைந்தபட்ச சராசரி விலை',
    averagePrice: 'சராசரி விலை',
    mspBenchmark: 'அரசு குறைந்தபட்ச ஆதரவு விலை (MSP)',
    seasonalityNote: 'சந்தை வல்லுநர் குறிப்பு',
    
    alertsHeading: 'மொபைல் விலை எச்சரிக்கை',
    alertsSubheading: 'நீங்கள் எதிர்பார்க்கும் விலை வரும்போது உங்கள் கைபேசிக்கு SMS அல்லது WhatsApp செய்தி பெறுங்கள்.',
    createNewAlert: 'புதிய எச்சரிக்கை பதிவு செய்க',
    targetPrice: 'இலக்கு விலை (₹/குவிண்டால்)',
    alertWhen: 'எச்சரிக்கை நிபந்தனை',
    notifyVia: 'செய்தி அனுப்பும் வழி',
    activeAlerts: 'செயலில் உள்ள எச்சரிக்கைகள்',
    noAlertsYet: 'எச்சரிக்கைகள் எதுவும் இதுவரை அமைக்கப்படவில்லை.',
    
    aiHeading: 'Smart Kisaan AI விவசாய ஆலோசகர்',
    aiSubheading: 'தமிழில் பேசியோ அல்லது தட்டச்சு செய்தோ சந்தை விலை, விளைபொருள் தரம் மற்றும் பயிர் பாதுகாப்பு ஆலோசனைகளைப் பெறுங்கள்.',
    aiPlaceholder: 'உங்கள் விவசாய அல்லது சந்தைக் கேள்வியை இங்கே கேட்கவும்...',
    askAssistant: 'கேள்வி கேட்க',
    listening: 'உங்கள் குரலைக் கவனிக்கிறது...',
    speakPrompt: 'மைக் அழுத்தி தமிழில் பேசுங்கள்',
    voiceReadout: 'பதிலை ஒலியாகக் கேட்க',
    stopVoice: 'ஒலியை நிறுத்து',
    suggestedQuestions: 'இன்றைய முக்கிய கேள்விகள்',
    
    adminHeading: 'மண்டி விலை பதிவு மையம்',
    updateDailyPrice: 'தினசரி ஏல விலை அறிக்கை',
    submitPrice: 'விலையை சேமிக்கவும்',
    activeFeedStatus: 'சந்தை தகவல் கண்காணிப்பு',
  },

  te: {
    appName: 'Smart Kisaan',
    tagline: 'ధర తెలుసుకోండి. మార్కెట్‌ను సరిపోల్చండి. తెలివిగా అమ్మండి.',
    heroHeading: 'పంట అమ్మే ముందే మార్కెట్ ధరలు తెలుసుకోండి',
    heroSubheading: 'ధృవీకరించబడిన మార్కెట్ ధరలను సరిపోల్చండి, ధరల పోకడలను అర్థం చేసుకోండి, మీ లాభాన్ని పెంచుకోండి.',
    disclaimer: 'Smart Kisaan మార్కెట్ యార్డుల (APMC) నివేదిత వేలం ధరలను అందిస్తుంది. ఇది ధరలను నిర్ణయించదు.',
    sourceBadge: 'ధృవీకరించబడిన APMC / అగ్‌మార్క్‌నెట్ మార్కెట్ సమాచారం',
    
    navPrices: 'మార్కెట్ ధరలు',
    navCompare: 'మార్కెట్ పోలిక',
    navNearby: 'సమీప మార్కెట్లు',
    navCalculator: 'నికర లాభ కాలిక్యులేటర్',
    navTrends: 'ధరల సరళి',
    navAlerts: 'ధర హెచ్చరికలు',
    navAiAssistant: 'కిసాన్ AI మిత్ర',
    navAdmin: 'మార్కెట్ డెస్క్',
    
    login: 'రైతు లాగిన్ / నమోదు',
    profile: 'నా వ్యవసాయ ప్రొఫైల్',
    enterMobile: '10 అంకెల మొబైల్ నంబర్',
    mobileNumber: 'మొబైల్ నంబర్',
    sendOtp: 'SMS ద్వారా OTP పంపండి',
    verifyOtp: 'ధృవీకరించి ప్రవేశించండి',
    otpSentTo: 'ధృవీకరణ కోడ్ పంపబడింది',
    enter6DigitOtp: '6 అంకెల OTP ని నమోదు చేయండి',
    farmerName: 'రైతు పూర్తి పేరు',
    selectState: 'రాష్ట్రం ఎంచుకోండి',
    selectDistrict: 'జిల్లా ఎంచుకోండి',
    villageName: 'గ్రామం / మండలం',
    preferredCrops: 'మీరు పండించే ప్రధాన పంటలు',
    saveProfile: 'వివరాలు భద్రపరచండి',
    demoOtpHint: 'టెస్ట్ OTP: 123456',
    resendOtp: 'మరలా OTP పంపండి',
    
    filterCrops: 'పంటను ఎంచుకోండి',
    allCrops: 'అన్ని పంటలు',
    allStates: 'అన్ని రాష్ట్రాలు',
    allDistricts: 'అన్ని జిల్లాలు',
    searchPlaceholder: 'పంట, మార్కెట్ లేదా జిల్లా పేరుతో శోధించండి...',
    modalPrice: 'సగటు ధర (Modal)',
    minPrice: 'కనిష్ట ధర',
    maxPrice: 'గరిష్ట ధర',
    arrivals: 'నేటి రాక',
    quintal: 'క్వింటాల్ (100 కిలోలు)',
    todayTrend: 'ధర మార్పు',
    mspTag: 'ప్రభుత్వ మద్దతు ధర (MSP)',
    compareThisMandi: 'మార్కెట్‌ను సరిపోల్చండి',
    calcReturn: 'లాభాన్ని లెక్కించండి',
    setAlert: 'ధర హెచ్చరిక సెట్ చేయండి',
    noPricesFound: 'ధరల వివరాలు అందుబాటులో లేవు.',
    lastUpdated: 'నేడు నవీకరించబడింది',
    variety: 'రకం',
    grade: 'నాణ్యత (Grade)',
    
    compareHeading: 'మార్కెట్ల ముఖాముఖి పోలిక',
    compareSubheading: 'ధరల తేడా మరియు రవాణా ఖర్చులను లెక్కించి ఎక్కడ అమ్మితే ఎక్కువ మిగులుతుందో తెలుసుకోండి.',
    selectCropToCompare: 'పోల్చవలసిన పంట',
    selectMandis: 'మార్కెట్లను ఎంచుకోండి',
    produceQuantity: 'దిగుబడి పరిమాణం',
    transportRate: 'రవాణా చార్జ్ (₹/కి.మీ)',
    priceDiff: 'ధర వ్యత్యాసం',
    netInHandDiff: 'నికర మిగులు తేడా',
    distance: 'దూరం',
    estimatedTransport: 'రవాణా ఖర్చు',
    mandiCess: 'మార్కెట్ రుసుము',
    hamaliCharges: 'హమాలీ ఖర్చులు',
    netRealization: 'చేతికి వచ్చే నికర మొత్తం',
    recommendation: 'Smart Kisaan సిఫార్సు',
    
    nearbyHeading: 'సమీపంలోని నియంత్రిత మార్కెట్ యార్డులు',
    nearbySubheading: 'మీ ప్రాంతానికి సమీపంలో ఉన్న మార్కెట్లు, వేలం సమయాలు మరియు సౌకర్యాలు.',
    useMyLocation: 'నా స్థానాన్ని గుర్తించండి',
    operatingHours: 'వేలం సమయం',
    facilities: 'సౌకర్యాలు',
    secretaryContact: 'సెక్రటరీ & వ్యాపారి సంప్రదింపు',
    calculateReturnFromHere: 'ఇక్కడి నుండి లాభం లెక్కించండి',
    
    calcHeading: 'నికర రాబడి కాలిక్యులేటర్',
    calcSubheading: 'గ్రామంలోని దళారీకి అమ్మడం వర్సెస్ స్థానిక మార్కెట్ వర్సెస్ పెద్ద టెర్మినల్ మార్కెట్.',
    channelVillage: 'గ్రామ వ్యాపారి / మధ్యవర్తి (పొలం వద్దే అమ్మకం)',
    channelLocalApmc: 'స్థానిక APMC మార్కెట్ యార్డ్',
    channelTerminal: 'దూరపు పెద్ద టోకు మార్కెట్',
    grossRevenue: 'మొత్తం అమ్మకం విలువ',
    totalExpenses: 'మొత్తం ఖర్చులు',
    netInPocket: 'జేబులో మిగిలే నికర లాభం',
    netPerQuintal: 'క్వింటాల్‌కు నికర ధర',
    farmgateOffer: 'దళారీ ఇచ్చిన ధర (₹/క్వింటాల్)',
    
    trendsHeading: 'ధరల సరళి & MSP విశ్లేషణ',
    trendsSubheading: 'గత 7 నుండి 90 రోజుల ధరల వివరాలను గమనించి సరైన సమయంలో పంటను అమ్మండి.',
    timeframe7d: '7 రోజులు',
    timeframe30d: '30 రోజులు',
    timeframe90d: '90 రోజులు',
    highestPrice: 'అత్యధిక సగటు ధర',
    lowestPrice: 'అత్యల్ప సగటు ధర',
    averagePrice: 'సగటు ధర',
    mspBenchmark: 'ప్రభుత్వ కనీస మద్దతు ధర (MSP)',
    seasonalityNote: 'మార్కెట్ సలహా',
    
    alertsHeading: 'ధర హెచ్చరిక నోటిఫికేషన్లు',
    alertsSubheading: 'మీరు కోరుకున్న ధర రాగానే SMS లేదా WhatsApp ద్వారా సమాచారం పొందండి.',
    createNewAlert: 'కొత్త హెచ్చరికను జోడించండి',
    targetPrice: 'లక్ష్య ధర (₹/క్వింటాల్)',
    alertWhen: 'షరతు',
    notifyVia: 'సమాచార మార్గం',
    activeAlerts: 'యాక్టివ్ అలర్టులు',
    noAlertsYet: 'ఇంకా అలర్టులు సెట్ చేయలేదు.',
    
    aiHeading: 'Smart Kisaan AI వ్యవసాయ సలహాదారు',
    aiSubheading: 'మీ భాషలో మాట్లాడి లేదా టైప్ చేసి మార్కెట్ ధరలు, పంట నిల్వ పద్ధతులు తెలుసుకోండి.',
    aiPlaceholder: 'మీ ప్రశ్నను ఇక్కడ అడగండి...',
    askAssistant: 'సలహా అడగండి',
    listening: 'వినబడుతోంది...',
    speakPrompt: 'మైక్ నొక్కి మాట్లాడండి',
    voiceReadout: 'సమాధానం వినండి',
    stopVoice: 'వాయిస్ ఆపండి',
    suggestedQuestions: 'నేటి ముఖ్య ప్రశ్నలు',
    
    adminHeading: 'APMC మార్కెట్ ధర నమోదు కేంద్రం',
    updateDailyPrice: 'రోజువారీ వేలం ధర అప్‌డేట్',
    submitPrice: 'ధరను నమోదు చేయండి',
    activeFeedStatus: 'మార్కెట్ ఫీడ్ పర్యవేక్షణ',
  },

  mr: {
    appName: 'Smart Kisaan',
    tagline: 'भाव जाणा. बाजारपेठ तपासा. हुशारीने विका.',
    heroHeading: 'शेतमाल विकण्यापूर्वी अचूक बाजारभाव जाणा',
    heroSubheading: 'अधिकृत कृषी उत्पन्न बाजार समित्यांचे (APMC) दर तपासा, वाहतूक खर्च वजा जाता कोणत्या बाजारात सर्वाधिक नफा मिळेल ते ठरवा.',
    disclaimer: 'Smart Kisaan केवळ APMC मधील अधिकृत लिलाव भाव दर्शवतो. Smart Kisaan स्वतः भाव ठरवत नाही.',
    sourceBadge: 'सत्यापित APMC / Agmarknet कृषी बाजार माहिती',
    
    navPrices: 'बाजार भाव',
    navCompare: 'बाजार तुलना',
    navNearby: 'जवळची बाजारपेठ',
    navCalculator: 'नफा कॅल्क्युलेटर',
    navTrends: 'किंमत कल',
    navAlerts: 'भाव अलर्ट',
    navAiAssistant: 'शेतकरी मित्र AI',
    navAdmin: 'प्रशासक डेस्क',
    
    login: 'शेतकरी लॉगिन / नोंदणी',
    profile: 'माझी शेती माहिती',
    enterMobile: '१० अंकी मोबाईल नंबर',
    mobileNumber: 'मोबाईल नंबर',
    sendOtp: 'SMS द्वारे OTP पाठवा',
    verifyOtp: 'सत्यापित करा',
    otpSentTo: 'पडताळणी कोड पाठवला आहे',
    enter6DigitOtp: '६ अंकी OTP टाका',
    farmerName: 'शेतकऱ्याचे पूर्ण नाव',
    selectState: 'राज्य निवडा',
    selectDistrict: 'जिल्हा निवडा',
    villageName: 'गाव / तालुका',
    preferredCrops: 'तुमची मुख्य पिके',
    saveProfile: 'माहिती जतन करा',
    demoOtpHint: 'चाचणी OTP: 123456',
    resendOtp: 'पुन्हा OTP पाठवा',
    
    filterCrops: 'पीक निवडा',
    allCrops: 'सर्व पिके',
    allStates: 'सर्व राज्ये',
    allDistricts: 'सर्व जिल्हे',
    searchPlaceholder: 'पीक, बाजार समिती किंवा जिल्ह्याचे नाव शोधा...',
    modalPrice: 'सरासरी लिलाव भाव',
    minPrice: 'किमान भाव',
    maxPrice: 'कमाल भाव',
    arrivals: 'आजची आवक',
    quintal: 'क्विंटल (१०० किलो)',
    todayTrend: 'दैनिक बदल',
    mspTag: 'शासकीय हमीभाव (MSP)',
    compareThisMandi: 'बाजार समिती तुलना',
    calcReturn: 'नफा काढा',
    setAlert: 'भाव अलर्ट लावा',
    noPricesFound: 'कोणताही बाजारभाव उपलब्ध नाही.',
    lastUpdated: 'आज अद्यतनित',
    variety: 'जात / प्रकार',
    grade: 'प्रत (Grade)',
    
    compareHeading: 'बाजार समित्यांची समोरासमोर तुलना',
    compareSubheading: 'दोन बाजारपेठांमधील भाव फरक आणि वाहतूक खर्च यांची तुलना करून खरोखर कोणत्या बाजारात जास्त नफा मिळतो ते तपासा.',
    selectCropToCompare: 'तुलनेसाठी पीक',
    selectMandis: 'बाजार समित्या निवडा',
    produceQuantity: 'मालाचे प्रमाण',
    transportRate: 'वाहतूक दर (₹/किमी)',
    priceDiff: 'भावातील फरक',
    netInHandDiff: 'खिशात राहणारा निव्वळ फरक',
    distance: 'अंतर',
    estimatedTransport: 'अंदाजे वाहतूक खर्च',
    mandiCess: 'बाजार समिती सेस',
    hamaliCharges: 'हमाली / तोलाई',
    netRealization: 'हातात येणारा निव्वळ नफा',
    recommendation: 'Smart Kisaan ची शिफारस',
    
    nearbyHeading: 'जवळपासच्या कृषी उत्पन्न बाजार समित्या (APMC)',
    nearbySubheading: 'तुमच्या शेताजवळील बाजार समित्या, लिलावाची वेळ, गोदाम आणि संपर्क क्रमांक.',
    useMyLocation: 'माझे स्थान शोधा',
    operatingHours: 'लिलाव वेळ',
    facilities: 'सुविधा',
    secretaryContact: 'सचिव व व्यापारी संपर्क',
    calculateReturnFromHere: 'येथून नफा मोजा',
    
    calcHeading: 'निव्वळ नफा कॅल्क्युलेटर (Net Return)',
    calcSubheading: 'गावातील व्यापारी विरुद्ध स्थानिक APMC विरुद्ध मुंबई/मोठ्या शहराची बाजारपेठ - कुठे विकणे फायदेशीर?',
    channelVillage: 'गावातील दलाल / व्यापारी (बांधावर खरेदी)',
    channelLocalApmc: 'स्थानिक APMC बाजार समिती',
    channelTerminal: 'लांबची मोठी घाऊक बाजारपेठ',
    grossRevenue: 'एकूण उत्पन्न',
    totalExpenses: 'एकूण खर्च (वाहतूक, हमाली, बारदाना)',
    netInPocket: 'खिशात उरणारा निव्वळ नफा',
    netPerQuintal: 'प्रति क्विंटल निव्वळ भाव',
    farmgateOffer: 'बांधावर व्यापाऱ्याचा भाव (₹/क्विंटल)',
    
    trendsHeading: 'भाव कल आणि हमीभाव (MSP) विश्लेषण',
    trendsSubheading: 'गेल्या ७ ते ९० दिवसांतील भावाचा कल तपासून माल साठवून ठेवायचा की लगेच विकायचा ते ठरवा.',
    timeframe7d: '७ दिवस',
    timeframe30d: '३० दिवस',
    timeframe90d: '९० दिवस',
    highestPrice: 'सर्वोच्च सरासरी भाव',
    lowestPrice: 'किमान सरासरी भाव',
    averagePrice: 'सरासरी भाव',
    mspBenchmark: 'शासकीय हमीभाव (MSP)',
    seasonalityNote: 'बाजार सल्ला',
    
    alertsHeading: 'किंमत अलर्ट सूचना',
    alertsSubheading: 'बाजार समितीत अपेक्षित भाव आल्यास थेट SMS किंवा WhatsApp संदेश मिळवा.',
    createNewAlert: 'नवीन अलर्ट जोडा',
    targetPrice: 'अपेक्षित भाव (₹/क्विंटल)',
    alertWhen: 'अट',
    notifyVia: 'संदेश माध्यम',
    activeAlerts: 'सक्रिय अलर्ट',
    noAlertsYet: 'सध्या कोणताही अलर्ट सक्रिय नाही.',
    
    aiHeading: 'Smart Kisaan AI शेती सल्लागार',
    aiSubheading: 'मराठीत बोलून किंवा लिहून बाजारभाव, शेतीमाल प्रतवारी व योजनांविषयी तात्काळ मार्गदर्शन मिळवा.',
    aiPlaceholder: 'तुमचा शेती किंवा बाजारभावाचा प्रश्न येथे विचारा...',
    askAssistant: 'सल्ला विचारा',
    listening: 'ऐकत आहे...',
    speakPrompt: 'माईक दाबून बोला',
    voiceReadout: 'उत्तर ऐका',
    stopVoice: 'आवाज थांबवा',
    suggestedQuestions: 'आजचे महत्त्वाचे प्रश्न',
    
    adminHeading: 'APMC बाजारभाव नोंदणी केंद्र',
    updateDailyPrice: 'दैनिक लिलाव भाव नोंदवा',
    submitPrice: 'भाव जतन करा',
    activeFeedStatus: 'बाजार माहिती देखरेख',
  },

  bn: {
    appName: 'Smart Kisaan',
    tagline: 'দাম জানুন। বাজার তুলনা করুন। লাভজনকভাবে বিক্রি করুন।',
    heroHeading: 'ফসল বিক্রির আগেই আসল বাজার দর জানুন',
    heroSubheading: 'সরকারি মান্ডির যাচাইকৃত দর তুলনা করুন, পরিবহণ খরচ হিসাব করুন এবং সঠিক সিদ্ধান্ত নিন।',
    disclaimer: 'Smart Kisaan সরকারি নিয়ন্ত্রিত কৃষি বাজারের (APMC) দৈনিক নিলাম দর প্রদর্শন করে। এটি নিজে কোনো দাম নির্ধারণ করে না।',
    sourceBadge: 'যাচাইকৃত APMC / Agmarknet বাজার তথ্য',
    
    navPrices: 'বাজার দর',
    navCompare: 'বাজার তুলনা',
    navNearby: 'নিকটবর্তী মান্ডি',
    navCalculator: 'নিট লাভ ক্যালকুলেটর',
    navTrends: 'মূল্য প্রবণতা',
    navAlerts: 'মূল্য সতর্কতা',
    navAiAssistant: 'কৃষক বন্ধু AI',
    navAdmin: 'অ্যাডমিন ডেস্ক',
    
    login: 'কৃষক লগইন / নিবন্ধন',
    profile: 'আমার খামার তথ্য',
    enterMobile: '১০ সংখ্যার মোবাইল নম্বর',
    mobileNumber: 'মোবাইল নম্বর',
    sendOtp: 'SMS-এ OTP পাঠান',
    verifyOtp: 'যাচাই করে এগিয়ে যান',
    otpSentTo: 'যাচাইকরণ কোড পাঠানো হয়েছে',
    enter6DigitOtp: '৬ সংখ্যার OTP লিখুন',
    farmerName: 'কৃষকের পুরো নাম',
    selectState: 'রাজ্য নির্বাচন করুন',
    selectDistrict: 'জেলা নির্বাচন করুন',
    villageName: 'গ্রাম / ব্লক',
    preferredCrops: 'আপনার প্রধান চাষ করা ফসল',
    saveProfile: 'তথ্য সংরক্ষণ করুন',
    demoOtpHint: 'টেস্ট OTP: 123456',
    resendOtp: 'পুনরায় OTP পাঠান',
    
    filterCrops: 'ফসল নির্বাচন করুন',
    allCrops: 'সকল ফসল',
    allStates: 'সকল রাজ্য',
    allDistricts: 'সকল জেলা',
    searchPlaceholder: 'ফসল, মান্ডি বা জেলার নাম দিয়ে খুঁজুন...',
    modalPrice: 'গড় নিলাম দর',
    minPrice: 'সর্বনিম্ন দর',
    maxPrice: 'সর্বোচ্চ দর',
    arrivals: 'আজকের আমদানি',
    quintal: 'কুইন্টাল (১০০ কেজি)',
    todayTrend: 'মূল্য পরিবর্তন',
    mspTag: 'সরকারি সহায়ক মূল্য (MSP)',
    compareThisMandi: 'মান্ডি তুলনা করুন',
    calcReturn: 'লাভ হিসাব করুন',
    setAlert: 'দর সতর্কতা দিন',
    noPricesFound: 'কোনো বাজার দর পাওয়া যায়নি।',
    lastUpdated: 'আজকের তথ্য',
    variety: 'জাত',
    grade: 'মান (Grade)',
    
    compareHeading: 'মান্ডিগুলির সরাসরি তুলনা',
    compareSubheading: 'ভাড়া ও অন্যান্য খরচ বাদ দিয়ে কোন বাজারে বিক্রি করলে বেশি টাকা ঘরে আসবে তা জানুন।',
    selectCropToCompare: 'তুলনার জন্য ফসল',
    selectMandis: 'মান্ডি নির্বাচন করুন',
    produceQuantity: 'ফসলের পরিমাণ',
    transportRate: 'গাড়ি ভাড়া (₹/কিমি)',
    priceDiff: 'দরের পার্থক্য',
    netInHandDiff: 'নিট লাভের পার্থক্য',
    distance: 'দূরত্ব',
    estimatedTransport: 'আনুমানিক ভাড়া',
    mandiCess: 'মান্ডি কর',
    hamaliCharges: 'কুলি / ওঠানো-নামানো খরচ',
    netRealization: 'হাতে পাওয়া নিট টাকা',
    recommendation: 'Smart Kisaan পরামর্শ',
    
    nearbyHeading: 'কাছের সরকারি APMC নিয়ন্ত্রিত বাজার',
    nearbySubheading: 'আপনার আশেপাশের বাজার, নিলামের সময়সূচি এবং সুযোগ-সুবিধা।',
    useMyLocation: 'আমার অবস্থান শনাক্ত করুন',
    operatingHours: 'নিলামের সময়',
    facilities: 'বাজারের সুবিধা',
    secretaryContact: 'সচিব ও ব্যবসায়ী যোগাযোগ',
    calculateReturnFromHere: 'এখান থেকে লাভ হিসাব করুন',
    
    calcHeading: 'নিট লাভ ক্যালকুলেটর (Net Return)',
    calcSubheading: 'গ্রামের ফড়িয়া বনাম স্থানীয় মান্ডি বনাম বড় পাইকারি আড়ত - কোথায় বিক্রি করলে আসল লাভ?',
    channelVillage: 'গ্রামের ফড়িয়া (জমিতেই বিক্রি)',
    channelLocalApmc: 'স্থানীয় নিয়ন্ত্রিত মান্ডি',
    channelTerminal: 'দূরের বড় পাইকারি বাজার',
    grossRevenue: 'মোট বিক্রয় মূল্য',
    totalExpenses: 'মোট খরচ (ভাড়া, কুলি, বস্তা)',
    netInPocket: 'পকেটে আসা নিট লাভ',
    netPerQuintal: 'প্রতি কুইন্টাল নিট দর',
    farmgateOffer: 'ফড়িয়ার দেওয়া দর (₹/কুইন্টাল)',
    
    trendsHeading: 'দরের ওঠানামা ও MSP বিশ্লেষণ',
    trendsSubheading: 'গত ৭ থেকে ৯০ দিনের নিলাম দর দেখে ফসল বিক্রির সঠিক সময় নির্ধারণ করুন।',
    timeframe7d: '৭ দিন',
    timeframe30d: '৩০ দিন',
    timeframe90d: '৯০ দিন',
    highestPrice: 'সর্বোচ্চ গড় দর',
    lowestPrice: 'সর্বনিম্ন গড় দর',
    averagePrice: 'গড় দর',
    mspBenchmark: 'সরকারি নূন্যতম সহায়ক মূল্য (MSP)',
    seasonalityNote: 'কৃষি বাজার বিশেষজ্ঞ পরামর্শ',
    
    alertsHeading: 'বাজার দর সতর্কতা',
    alertsSubheading: 'কাঙ্ক্ষিত দর আসলেই মোবাইল ফোনে সরাসরি SMS বা WhatsApp নোটিফিকেশন পান।',
    createNewAlert: 'নতুন সতর্কতা যোগ করুন',
    targetPrice: 'কাঙ্ক্ষিত দর (₹/কুইন্টাল)',
    alertWhen: 'শর্ত',
    notifyVia: 'বিজ্ঞপ্তি মাধ্যম',
    activeAlerts: 'সক্রিয় সতর্কতা',
    noAlertsYet: 'কোনো সতর্কতা তৈরি করা হয়নি।',
    
    aiHeading: 'Smart Kisaan AI কৃষি উপদেষ্টা',
    aiSubheading: 'বাংলায় কথা বলে বা লিখে সঠিক বাজার সময়, মান্ডির নিয়ম ও সরকারি প্রকল্প জানুন।',
    aiPlaceholder: 'আপনার প্রশ্ন এখানে লিখুন...',
    askAssistant: 'পরামর্শ চান',
    listening: 'শুনছি...',
    speakPrompt: 'মাইকে বাংলায় বলুন',
    voiceReadout: 'উত্তর শুনুন',
    stopVoice: 'অডিও থামান',
    suggestedQuestions: 'আজকের জরুরি প্রশ্নসমূহ',
    
    adminHeading: 'APMC বাজার দর এন্ট্রি ডেস্ক',
    updateDailyPrice: 'দৈনিক নিলাম দর নথিভুক্ত করুন',
    submitPrice: 'দর সংরক্ষণ করুন',
    activeFeedStatus: 'তথ্য পর্যবেক্ষণ কেন্দ্র',
  },
};
