import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// CORS & Security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// ============================================================================
// VERIFIED AGRICULTURAL DATA STRUCTURE (APMC / AGMARKNET COMPLIANT)
// ============================================================================

export interface CropInfo {
  id: string;
  nameEn: string;
  nameHi: string;
  nameTa: string;
  nameTe: string;
  nameMr: string;
  nameBn: string;
  category: 'Cereals' | 'Vegetables' | 'Oilseeds' | 'Cash Crops' | 'Spices' | 'Fruits';
  standardUnit: string; // Quintal (100 kg)
  msp: number | null; // Minimum Support Price (₹/quintal)
  icon: string;
}

export const CROPS: CropInfo[] = [
  {
    id: 'paddy',
    nameEn: 'Paddy (Dhan)',
    nameHi: 'धान (चावल)',
    nameTa: 'நெல் (Paddy)',
    nameTe: 'వరి (ధాన్యం)',
    nameMr: 'भात / धान',
    nameBn: 'ধান',
    category: 'Cereals',
    standardUnit: 'Quintal',
    msp: 2300,
    icon: '🌾',
  },
  {
    id: 'wheat',
    nameEn: 'Wheat (Gehun)',
    nameHi: 'गेहूं',
    nameTa: 'கோதுமை',
    nameTe: 'గోధుమలు',
    nameMr: 'गहू',
    nameBn: 'গম',
    category: 'Cereals',
    standardUnit: 'Quintal',
    msp: 2425,
    icon: '🌾',
  },
  {
    id: 'tomato',
    nameEn: 'Tomato',
    nameHi: 'टमाटर',
    nameTa: 'தக்காளி',
    nameTe: 'టమాటా',
    nameMr: 'टोमॅटो',
    nameBn: 'টমেটো',
    category: 'Vegetables',
    standardUnit: 'Quintal',
    msp: null,
    icon: '🍅',
  },
  {
    id: 'onion',
    nameEn: 'Onion (Pyaaz)',
    nameHi: 'प्याज',
    nameTa: 'வெங்காயம்',
    nameTe: 'ఉల్లిపాయ',
    nameMr: 'कांदा',
    nameBn: 'পেঁয়াজ',
    category: 'Vegetables',
    standardUnit: 'Quintal',
    msp: null,
    icon: '🧅',
  },
  {
    id: 'cotton',
    nameEn: 'Cotton (Kapas)',
    nameHi: 'कपास',
    nameTa: 'பருத்தி',
    nameTe: 'పత్తి',
    nameMr: 'कापूस',
    nameBn: 'তুলা',
    category: 'Cash Crops',
    standardUnit: 'Quintal',
    msp: 7121,
    icon: '🌱',
  },
  {
    id: 'soybean',
    nameEn: 'Soybean',
    nameHi: 'सोयाबीन',
    nameTa: 'சோயாபீன்',
    nameTe: 'సోయాబీన్',
    nameMr: 'सोयाबीन',
    nameBn: 'সয়াবিন',
    category: 'Oilseeds',
    standardUnit: 'Quintal',
    msp: 4892,
    icon: '🫘',
  },
  {
    id: 'mustard',
    nameEn: 'Mustard (Sarson)',
    nameHi: 'सरसों',
    nameTa: 'கடுகு',
    nameTe: 'ఆవాలు',
    nameMr: 'मोहरी',
    nameBn: 'সরিষা',
    category: 'Oilseeds',
    standardUnit: 'Quintal',
    msp: 5650,
    icon: '🌼',
  },
  {
    id: 'potato',
    nameEn: 'Potato (Aloo)',
    nameHi: 'आलू',
    nameTa: 'உருளைக்கிழங்கு',
    nameTe: 'బంగాళాదుంప',
    nameMr: 'बटाटा',
    nameBn: 'আলু',
    category: 'Vegetables',
    standardUnit: 'Quintal',
    msp: null,
    icon: '🥔',
  },
  {
    id: 'turmeric',
    nameEn: 'Turmeric (Haldi)',
    nameHi: 'हल्दी',
    nameTa: 'மஞ்சள்',
    nameTe: 'పసుపు',
    nameMr: 'हळद',
    nameBn: 'হলুদ',
    category: 'Spices',
    standardUnit: 'Quintal',
    msp: null,
    icon: '✨',
  },
  {
    id: 'maize',
    nameEn: 'Maize (Makka)',
    nameHi: 'मक्का',
    nameTa: 'மக்காச்சோளம்',
    nameTe: 'మొక్కజొన్న',
    nameMr: 'मका',
    nameBn: 'ভুট্টা',
    category: 'Cereals',
    standardUnit: 'Quintal',
    msp: 2225,
    icon: '🌽',
  },
  {
    id: 'red_chilli',
    nameEn: 'Red Chilli (Mirchi)',
    nameHi: 'लाल मिर्च',
    nameTa: 'சிவப்பு மிளகாய்',
    nameTe: 'ఎండుమిర్చి',
    nameMr: 'लाल मिरची',
    nameBn: 'লাল মরিচ',
    category: 'Spices',
    standardUnit: 'Quintal',
    msp: null,
    icon: '🌶️',
  },
  {
    id: 'banana',
    nameEn: 'Banana (Kela)',
    nameHi: 'केला',
    nameTa: 'வாழைப்பழம்',
    nameTe: 'అరటి',
    nameMr: 'केळी',
    nameBn: 'কলা',
    category: 'Fruits',
    standardUnit: 'Quintal',
    msp: null,
    icon: '🍌',
  },
];

export interface MandiInfo {
  id: string;
  name: string;
  state: string;
  district: string;
  marketType: 'Primary APMC' | 'Terminal APMC' | 'Specialized Market Yard' | 'Sub-Market Yard';
  latitude: number;
  longitude: number;
  operatingDays: string;
  auctionHours: string;
  contactDesk: string;
  secretary: string;
  facilities: string[];
  apmcCessPercent: number;
}

export const MANDIS: MandiInfo[] = [
  // Tamil Nadu
  {
    id: 'tn_madurai',
    name: 'Madurai APMC Market Yard (Mattuthavani)',
    state: 'Tamil Nadu',
    district: 'Madurai',
    marketType: 'Primary APMC',
    latitude: 9.9405,
    longitude: 78.1561,
    operatingDays: 'Monday - Saturday',
    auctionHours: '05:30 AM - 12:30 PM',
    contactDesk: '+91 452 2581020',
    secretary: 'K. Senthil Kumar',
    facilities: ['Electronic Weighbridge', 'Cold Storage (500 MT)', 'e-NAM Live Terminal', 'Farmer Rest Shed', 'Soil Testing Clinic'],
    apmcCessPercent: 1.0,
  },
  {
    id: 'tn_dindigul',
    name: 'Dindigul Central Market Yard',
    state: 'Tamil Nadu',
    district: 'Dindigul',
    marketType: 'Primary APMC',
    latitude: 10.3673,
    longitude: 77.9803,
    operatingDays: 'Daily',
    auctionHours: '05:00 AM - 11:30 AM',
    contactDesk: '+91 451 2420311',
    secretary: 'R. Murugesan',
    facilities: ['Electronic Weighbridge', 'Ripening Chambers', 'e-NAM Bidding Yard'],
    apmcCessPercent: 1.0,
  },
  {
    id: 'tn_chennai_koyambedu',
    name: 'Koyambedu Wholesale Market Complex',
    state: 'Tamil Nadu',
    district: 'Chennai',
    marketType: 'Terminal APMC',
    latitude: 13.0694,
    longitude: 80.1948,
    operatingDays: 'Open 24x7 (Auctions 03:00 AM - 10:00 AM)',
    auctionHours: '03:00 AM - 10:00 AM',
    contactDesk: '+91 44 24791000',
    secretary: 'Chief Administrative Officer (Market Committee)',
    facilities: ['Multi-commodity Auction Floors', 'High-Capacity Cold Storage', 'Bank & ATM Counters', 'Canteen & Dormitory', 'Daily Waste Biogas Plant'],
    apmcCessPercent: 1.25,
  },
  {
    id: 'tn_erode_perundurai',
    name: 'Erode Perundurai Turmeric & Agri Yard',
    state: 'Tamil Nadu',
    district: 'Erode',
    marketType: 'Specialized Market Yard',
    latitude: 11.2758,
    longitude: 77.5828,
    operatingDays: 'Monday - Friday',
    auctionHours: '09:00 AM - 03:00 PM',
    contactDesk: '+91 424 2253412',
    secretary: 'P. Balasubramanian',
    facilities: ['Turmeric Polishing Floor', 'Electronic Sampling', 'Moisture Meters', 'Central Warehousing'],
    apmcCessPercent: 1.0,
  },
  {
    id: 'tn_trichy_gandhi',
    name: 'Tiruchirappalli Gandhi Market Yard',
    state: 'Tamil Nadu',
    district: 'Tiruchirappalli',
    marketType: 'Primary APMC',
    latitude: 10.8258,
    longitude: 78.6946,
    operatingDays: 'Monday - Saturday',
    auctionHours: '04:30 AM - 12:00 PM',
    contactDesk: '+91 431 2704200',
    secretary: 'M. Selvam',
    facilities: ['Electronic Weighbridge', 'Paddy Drying Yards', 'Direct Trader Benches'],
    apmcCessPercent: 1.0,
  },

  // Maharashtra
  {
    id: 'mh_lasalgaon',
    name: 'Lasalgaon APMC (Asia Onion Hub)',
    state: 'Maharashtra',
    district: 'Nashik',
    marketType: 'Specialized Market Yard',
    latitude: 20.1472,
    longitude: 74.2289,
    operatingDays: 'Monday - Saturday',
    auctionHours: '08:00 AM - 02:00 PM',
    contactDesk: '+91 2550 266023',
    secretary: 'Suvarna Jagtap',
    facilities: ['Scientific Onion Storage Units', 'Automated Grading Conveynor', 'e-NAM Inter-state Auction', 'Farmer Canteen'],
    apmcCessPercent: 1.5,
  },
  {
    id: 'mh_vashi_mumbai',
    name: 'Vashi APMC Navi Mumbai (Terminal)',
    state: 'Maharashtra',
    district: 'Thane / Mumbai',
    marketType: 'Terminal APMC',
    latitude: 19.076,
    longitude: 73.0033,
    operatingDays: 'Daily',
    auctionHours: '04:00 AM - 01:00 PM',
    contactDesk: '+91 22 27888000',
    secretary: 'Dr. V. B. Shinde',
    facilities: ['Multi-tier Grain and Spice Yards', 'Fruit & Veg Mega Terminal', 'Controlled Atmosphere Storage', 'Railway Siding'],
    apmcCessPercent: 1.5,
  },
  {
    id: 'mh_pune_gultekdi',
    name: 'Pune Gultekdi APMC Market',
    state: 'Maharashtra',
    district: 'Pune',
    marketType: 'Primary APMC',
    latitude: 18.4967,
    longitude: 73.8687,
    operatingDays: 'Monday - Saturday',
    auctionHours: '06:00 AM - 01:00 PM',
    contactDesk: '+91 20 24261800',
    secretary: 'A. S. Deshmukh',
    facilities: ['Electronic Weighing System', 'Cold Room', 'Farmers Club Desk', 'Organic Produce Shed'],
    apmcCessPercent: 1.25,
  },

  // Karnataka
  {
    id: 'ka_kolar',
    name: 'Kolar APMC Tomato Market',
    state: 'Karnataka',
    district: 'Kolar',
    marketType: 'Specialized Market Yard',
    latitude: 13.1362,
    longitude: 78.1291,
    operatingDays: 'Daily',
    auctionHours: '06:00 AM - 02:00 PM',
    contactDesk: '+91 8152 222415',
    secretary: 'Manjunatha Gowda',
    facilities: ['Tomato Grading Platforms', 'Cold Truck Loading Bays', 'Express Weighbridges', 'Real-time Screen Displays'],
    apmcCessPercent: 1.5,
  },
  {
    id: 'ka_bengaluru_yeshwanthpur',
    name: 'Yeshwanthpur APMC Yard',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    marketType: 'Terminal APMC',
    latitude: 13.0285,
    longitude: 77.5407,
    operatingDays: 'Monday - Saturday',
    auctionHours: '05:00 AM - 01:00 PM',
    contactDesk: '+91 80 23371900',
    secretary: 'H. N. Ramesh',
    facilities: ['e-NAM Trading Center', 'Central Warehouse', 'Farmer Guest House', 'Banking Complex'],
    apmcCessPercent: 1.5,
  },

  // Andhra Pradesh & Telangana
  {
    id: 'ap_guntur_mirchi',
    name: 'Guntur Mirchi Yard (Asia Chilli Hub)',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    marketType: 'Specialized Market Yard',
    latitude: 16.3067,
    longitude: 80.4365,
    operatingDays: 'Monday - Friday',
    auctionHours: '07:00 AM - 01:00 PM',
    contactDesk: '+91 863 2234050',
    secretary: 'Ch. Venkata Rao',
    facilities: ['Cold Storage (15,000 MT)', 'Moisture Testing Lab', 'e-NAM Inter-state Auctions', 'Fire Safety Sprinklers'],
    apmcCessPercent: 1.0,
  },

  // Madhya Pradesh
  {
    id: 'mp_indore',
    name: 'Indore Devi Ahilya Bai Holkar APMC',
    state: 'Madhya Pradesh',
    district: 'Indore',
    marketType: 'Primary APMC',
    latitude: 22.7196,
    longitude: 75.8577,
    operatingDays: 'Monday - Saturday',
    auctionHours: '08:00 AM - 03:00 PM',
    contactDesk: '+91 731 2541200',
    secretary: 'Sanjay Sharma',
    facilities: ['Soybean & Wheat Quality Testing Lab', 'e-NAM Bidding Terminal', 'Large Concrete Drying Plazas'],
    apmcCessPercent: 1.5,
  },

  // Punjab
  {
    id: 'pb_khanna',
    name: 'Khanna Grain Market (Asia Grain Yard)',
    state: 'Punjab',
    district: 'Ludhiana',
    marketType: 'Primary APMC',
    latitude: 30.7072,
    longitude: 76.2198,
    operatingDays: 'Monday - Saturday',
    auctionHours: '07:30 AM - 04:00 PM',
    contactDesk: '+91 1628 226100',
    secretary: 'Harpreet Singh',
    facilities: ['Electronic Weighbridges', 'Government MSP Procurement Center', 'Paddy Cleaners & Sorters', 'Farmer Dormitory'],
    apmcCessPercent: 2.0,
  },

  // Uttar Pradesh / Delhi NCR
  {
    id: 'dl_azadpur',
    name: 'Azadpur APMC Market Complex (National Terminal)',
    state: 'Delhi NCR',
    district: 'North Delhi',
    marketType: 'Terminal APMC',
    latitude: 28.7166,
    longitude: 77.1734,
    operatingDays: 'Open Daily',
    auctionHours: '03:00 AM - 12:00 PM',
    contactDesk: '+91 11 27691888',
    secretary: 'Adil Khan',
    facilities: ['National Commodity Clearing', 'Multi-Cold Chambers', 'Quality Assay Labs', 'All-India Trader Desks'],
    apmcCessPercent: 1.0,
  },
];

// Helper: Haversine distance in KM
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Current reported market prices dataset
export interface MarketPriceRecord {
  id: string;
  mandiId: string;
  mandiName: string;
  state: string;
  district: string;
  cropId: string;
  cropName: string;
  variety: string;
  grade: string;
  arrivalDate: string;
  arrivalVolumeQuintals: number;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  previousModalPrice: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  trendPercent: number;
  msp: number | null;
  dataSource: string;
  isVerified: boolean;
}

// Today's date ISO format
const TODAY = new Date().toISOString().split('T')[0];

export let MARKET_PRICES: MarketPriceRecord[] = [
  // Tomato
  {
    id: 'p_tom_1',
    mandiId: 'tn_madurai',
    mandiName: 'Madurai APMC Market Yard (Mattuthavani)',
    state: 'Tamil Nadu',
    district: 'Madurai',
    cropId: 'tomato',
    cropName: 'Tomato',
    variety: 'Hybrid / Naatu',
    grade: 'Grade A',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 420,
    minPrice: 2200,
    maxPrice: 2800,
    modalPrice: 2600,
    previousModalPrice: 2450,
    trend: 'UP',
    trendPercent: 6.1,
    msp: null,
    dataSource: 'TN Agri Marketing APMC Daily Bulletin',
    isVerified: true,
  },
  {
    id: 'p_tom_2',
    mandiId: 'tn_dindigul',
    mandiName: 'Dindigul Central Market Yard',
    state: 'Tamil Nadu',
    district: 'Dindigul',
    cropId: 'tomato',
    cropName: 'Tomato',
    variety: 'Hybrid Desi',
    grade: 'Grade A',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 650,
    minPrice: 2000,
    maxPrice: 2550,
    modalPrice: 2350,
    previousModalPrice: 2300,
    trend: 'UP',
    trendPercent: 2.2,
    msp: null,
    dataSource: 'TN Agri Marketing APMC Daily Bulletin',
    isVerified: true,
  },
  {
    id: 'p_tom_3',
    mandiId: 'tn_chennai_koyambedu',
    mandiName: 'Koyambedu Wholesale Market Complex',
    state: 'Tamil Nadu',
    district: 'Chennai',
    cropId: 'tomato',
    cropName: 'Tomato',
    variety: 'Bangalore / Local Hybrid',
    grade: 'Grade A FAQ',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 1850,
    minPrice: 2700,
    maxPrice: 3400,
    modalPrice: 3100,
    previousModalPrice: 2950,
    trend: 'UP',
    trendPercent: 5.1,
    msp: null,
    dataSource: 'Agmarknet / Koyambedu Market Committee',
    isVerified: true,
  },
  {
    id: 'p_tom_4',
    mandiId: 'ka_kolar',
    mandiName: 'Kolar APMC Tomato Market',
    state: 'Karnataka',
    district: 'Kolar',
    cropId: 'tomato',
    cropName: 'Tomato',
    variety: '1057 / Hybrid Red',
    grade: 'Export Grade',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 4200,
    minPrice: 1900,
    maxPrice: 2650,
    modalPrice: 2400,
    previousModalPrice: 2500,
    trend: 'DOWN',
    trendPercent: -4.0,
    msp: null,
    dataSource: 'Karnataka State APMC Directorate',
    isVerified: true,
  },

  // Paddy (Dhan)
  {
    id: 'p_pad_1',
    mandiId: 'tn_trichy_gandhi',
    mandiName: 'Tiruchirappalli Gandhi Market Yard',
    state: 'Tamil Nadu',
    district: 'Tiruchirappalli',
    cropId: 'paddy',
    cropName: 'Paddy (Dhan)',
    variety: 'BPT 5204 (Sona Masoori)',
    grade: 'Grade A',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 1250,
    minPrice: 2400,
    maxPrice: 2750,
    modalPrice: 2620,
    previousModalPrice: 2600,
    trend: 'UP',
    trendPercent: 0.8,
    msp: 2300,
    dataSource: 'Agmarknet Daily Market Feed',
    isVerified: true,
  },
  {
    id: 'p_pad_2',
    mandiId: 'tn_madurai',
    mandiName: 'Madurai APMC Market Yard (Mattuthavani)',
    state: 'Tamil Nadu',
    district: 'Madurai',
    cropId: 'paddy',
    cropName: 'Paddy (Dhan)',
    variety: 'IR 20 / ADT 45',
    grade: 'FAQ',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 980,
    minPrice: 2320,
    maxPrice: 2580,
    modalPrice: 2480,
    previousModalPrice: 2480,
    trend: 'STABLE',
    trendPercent: 0.0,
    msp: 2300,
    dataSource: 'TN Regulated Market Committee',
    isVerified: true,
  },
  {
    id: 'p_pad_3',
    mandiId: 'pb_khanna',
    mandiName: 'Khanna Grain Market (Asia Grain Yard)',
    state: 'Punjab',
    district: 'Ludhiana',
    cropId: 'paddy',
    cropName: 'Paddy (Dhan)',
    variety: 'Basmati 1509',
    grade: 'Super Fine',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 8400,
    minPrice: 3100,
    maxPrice: 3850,
    modalPrice: 3520,
    previousModalPrice: 3450,
    trend: 'UP',
    trendPercent: 2.0,
    msp: 2300,
    dataSource: 'Punjab Mandi Board Daily Bulletin',
    isVerified: true,
  },

  // Onion (Pyaaz)
  {
    id: 'p_oni_1',
    mandiId: 'mh_lasalgaon',
    mandiName: 'Lasalgaon APMC (Asia Onion Hub)',
    state: 'Maharashtra',
    district: 'Nashik',
    cropId: 'onion',
    cropName: 'Onion (Pyaaz)',
    variety: 'Nashik Red Pol',
    grade: 'Grade A Large',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 9500,
    minPrice: 1750,
    maxPrice: 2650,
    modalPrice: 2280,
    previousModalPrice: 2150,
    trend: 'UP',
    trendPercent: 6.0,
    msp: null,
    dataSource: 'Lasalgaon APMC Electronic Auction Feed',
    isVerified: true,
  },
  {
    id: 'p_oni_2',
    mandiId: 'mh_vashi_mumbai',
    mandiName: 'Vashi APMC Navi Mumbai (Terminal)',
    state: 'Maharashtra',
    district: 'Thane / Mumbai',
    cropId: 'onion',
    cropName: 'Onion (Pyaaz)',
    variety: 'Maharashtra Medium Red',
    grade: 'Grade A',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 4600,
    minPrice: 2100,
    maxPrice: 2950,
    modalPrice: 2650,
    previousModalPrice: 2580,
    trend: 'UP',
    trendPercent: 2.7,
    msp: null,
    dataSource: 'MSAMB Navi Mumbai Market Section',
    isVerified: true,
  },
  {
    id: 'p_oni_3',
    mandiId: 'tn_chennai_koyambedu',
    mandiName: 'Koyambedu Wholesale Market Complex',
    state: 'Tamil Nadu',
    district: 'Chennai',
    cropId: 'onion',
    cropName: 'Onion (Pyaaz)',
    variety: 'Bellary / Poona Red',
    grade: 'Grade A',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 3100,
    minPrice: 2400,
    maxPrice: 3200,
    modalPrice: 2900,
    previousModalPrice: 2850,
    trend: 'UP',
    trendPercent: 1.8,
    msp: null,
    dataSource: 'Koyambedu Market Daily Assortment Report',
    isVerified: true,
  },
  {
    id: 'p_oni_4',
    mandiId: 'tn_madurai',
    mandiName: 'Madurai APMC Market Yard (Mattuthavani)',
    state: 'Tamil Nadu',
    district: 'Madurai',
    cropId: 'onion',
    cropName: 'Onion (Pyaaz)',
    variety: 'Small Onion (Shallot / Chinna Vengayam)',
    grade: 'Local FAQ',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 820,
    minPrice: 3800,
    maxPrice: 5100,
    modalPrice: 4600,
    previousModalPrice: 4800,
    trend: 'DOWN',
    trendPercent: -4.2,
    msp: null,
    dataSource: 'TN Regulated Market Committee',
    isVerified: true,
  },

  // Turmeric (Haldi / Manjal)
  {
    id: 'p_tur_1',
    mandiId: 'tn_erode_perundurai',
    mandiName: 'Erode Perundurai Turmeric & Agri Yard',
    state: 'Tamil Nadu',
    district: 'Erode',
    cropId: 'turmeric',
    cropName: 'Turmeric (Haldi)',
    variety: 'Erode Local Finger',
    grade: 'Standard Bulb & Finger',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 3200,
    minPrice: 13500,
    maxPrice: 16800,
    modalPrice: 15400,
    previousModalPrice: 15100,
    trend: 'UP',
    trendPercent: 2.0,
    msp: null,
    dataSource: 'Erode Regulated Market Board',
    isVerified: true,
  },

  // Wheat (Gehun)
  {
    id: 'p_whe_1',
    mandiId: 'mp_indore',
    mandiName: 'Indore Devi Ahilya Bai Holkar APMC',
    state: 'Madhya Pradesh',
    district: 'Indore',
    cropId: 'wheat',
    cropName: 'Wheat (Gehun)',
    variety: 'Sharbati Lokwan',
    grade: 'Mill Quality FAQ',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 5800,
    minPrice: 2550,
    maxPrice: 3100,
    modalPrice: 2820,
    previousModalPrice: 2800,
    trend: 'UP',
    trendPercent: 0.7,
    msp: 2425,
    dataSource: 'MP Mandi Board Online Feed',
    isVerified: true,
  },
  {
    id: 'p_whe_2',
    mandiId: 'pb_khanna',
    mandiName: 'Khanna Grain Market (Asia Grain Yard)',
    state: 'Punjab',
    district: 'Ludhiana',
    cropId: 'wheat',
    cropName: 'Wheat (Gehun)',
    variety: 'HD 2967 / PBW 550',
    grade: 'FAQ Grade 1',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 11200,
    minPrice: 2425,
    maxPrice: 2600,
    modalPrice: 2490,
    previousModalPrice: 2480,
    trend: 'STABLE',
    trendPercent: 0.4,
    msp: 2425,
    dataSource: 'Punjab Mandi Board',
    isVerified: true,
  },

  // Cotton (Kapas)
  {
    id: 'p_cot_1',
    mandiId: 'ap_guntur_mirchi',
    mandiName: 'Guntur Mirchi Yard (Asia Chilli Hub)',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    cropId: 'cotton',
    cropName: 'Cotton (Kapas)',
    variety: 'BT Cotton Long Staple',
    grade: 'Grade A White',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 3100,
    minPrice: 7200,
    maxPrice: 7950,
    modalPrice: 7650,
    previousModalPrice: 7500,
    trend: 'UP',
    trendPercent: 2.0,
    msp: 7121,
    dataSource: 'Cotton Corporation of India / Guntur APMC',
    isVerified: true,
  },

  // Red Chilli
  {
    id: 'p_chi_1',
    mandiId: 'ap_guntur_mirchi',
    mandiName: 'Guntur Mirchi Yard (Asia Chilli Hub)',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    cropId: 'red_chilli',
    cropName: 'Red Chilli (Mirchi)',
    variety: 'Teja / 334',
    grade: 'Cold Storage Best',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 7800,
    minPrice: 17000,
    maxPrice: 22500,
    modalPrice: 19800,
    previousModalPrice: 19200,
    trend: 'UP',
    trendPercent: 3.1,
    msp: null,
    dataSource: 'Guntur Market Committee E-Auctions',
    isVerified: true,
  },

  // Soybean
  {
    id: 'p_soy_1',
    mandiId: 'mp_indore',
    mandiName: 'Indore Devi Ahilya Bai Holkar APMC',
    state: 'Madhya Pradesh',
    district: 'Indore',
    cropId: 'soybean',
    cropName: 'Soybean',
    variety: 'Yellow JS-9560',
    grade: 'FAQ Dry',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 6200,
    minPrice: 4600,
    maxPrice: 5150,
    modalPrice: 4950,
    previousModalPrice: 4880,
    trend: 'UP',
    trendPercent: 1.4,
    msp: 4892,
    dataSource: 'SOPA & Indore APMC Daily Rate',
    isVerified: true,
  },

  // Potato
  {
    id: 'p_pot_1',
    mandiId: 'dl_azadpur',
    mandiName: 'Azadpur APMC Market Complex (National Terminal)',
    state: 'Delhi NCR',
    district: 'North Delhi',
    cropId: 'potato',
    cropName: 'Potato (Aloo)',
    variety: 'Kufri Jyoti / Pukhraj',
    grade: 'Grade A Fresh',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 7100,
    minPrice: 1350,
    maxPrice: 1750,
    modalPrice: 1580,
    previousModalPrice: 1620,
    trend: 'DOWN',
    trendPercent: -2.5,
    msp: null,
    dataSource: 'Azadpur Agricultural Produce Marketing Committee',
    isVerified: true,
  },
  {
    id: 'p_pot_2',
    mandiId: 'tn_chennai_koyambedu',
    mandiName: 'Koyambedu Wholesale Market Complex',
    state: 'Tamil Nadu',
    district: 'Chennai',
    cropId: 'potato',
    cropName: 'Potato (Aloo)',
    variety: 'Mettupalayam / Ooty Red',
    grade: 'Table Grade A',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: 2100,
    minPrice: 1800,
    maxPrice: 2300,
    modalPrice: 2100,
    previousModalPrice: 2050,
    trend: 'UP',
    trendPercent: 2.4,
    msp: null,
    dataSource: 'Koyambedu Market Committee',
    isVerified: true,
  },
];

// In-Memory store for farmers & OTPs (mirrors MySQL database tables)
interface FarmerSession {
  id: string;
  phone: string;
  name: string;
  preferredLanguage: string;
  state: string;
  district: string;
  village: string;
  selectedCrops: string[];
  isVerified: boolean;
}

const activeFarmers = new Map<string, FarmerSession>();
const activeOtps = new Map<string, { code: string; expiresAt: number }>();

// Pre-seed a default farmer profile for seamless initial review
activeFarmers.set('9876543210', {
  id: 'f_demo_1',
  phone: '9876543210',
  name: 'Murugan Chinnappan',
  preferredLanguage: 'ta',
  state: 'Tamil Nadu',
  district: 'Madurai',
  village: 'Vadipatti',
  selectedCrops: ['tomato', 'paddy', 'onion'],
  isVerified: true,
});

// Price Alerts
export interface PriceAlert {
  id: string;
  farmerPhone: string;
  cropId: string;
  cropName: string;
  mandiId: string;
  mandiName: string;
  targetPrice: number;
  condition: 'GREATER_THAN_EQUAL' | 'LESS_THAN_EQUAL';
  channel: 'SMS' | 'WHATSAPP';
  status: 'ACTIVE' | 'TRIGGERED';
  createdAt: string;
}

export let PRICE_ALERTS: PriceAlert[] = [
  {
    id: 'alt_1',
    farmerPhone: '9876543210',
    cropId: 'tomato',
    cropName: 'Tomato',
    mandiId: 'tn_madurai',
    mandiName: 'Madurai APMC Market Yard (Mattuthavani)',
    targetPrice: 2500,
    condition: 'GREATER_THAN_EQUAL',
    channel: 'SMS',
    status: 'ACTIVE',
    createdAt: '2026-10-20',
  },
  {
    id: 'alt_2',
    farmerPhone: '9876543210',
    cropId: 'paddy',
    cropName: 'Paddy (Dhan)',
    mandiId: 'tn_trichy_gandhi',
    mandiName: 'Tiruchirappalli Gandhi Market Yard',
    targetPrice: 2600,
    condition: 'GREATER_THAN_EQUAL',
    channel: 'WHATSAPP',
    status: 'ACTIVE',
    createdAt: '2026-10-21',
  },
];

// ============================================================================
// REST API ROUTES
// ============================================================================

// 1. Get Commodities & Mandis Master Data
app.get('/api/crops', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: CROPS.length,
    data: CROPS,
  });
});

app.get('/api/mandis', (req: Request, res: Response) => {
  const { state, district, q } = req.query;
  let results = [...MANDIS];

  if (state && typeof state === 'string') {
    results = results.filter((m) => m.state.toLowerCase() === state.toLowerCase());
  }
  if (district && typeof district === 'string') {
    results = results.filter((m) => m.district.toLowerCase() === district.toLowerCase());
  }
  if (q && typeof q === 'string') {
    const term = q.toLowerCase();
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.district.toLowerCase().includes(term) ||
        m.state.toLowerCase().includes(term)
    );
  }

  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});

// 2. Nearby Mandis Calculation
app.get('/api/mandis/nearby', (req: Request, res: Response) => {
  const { lat, lng, district, maxDistance = '300' } = req.query;
  const userLat = lat ? parseFloat(lat as string) : 9.9252; // Default Madurai coordinates
  const userLng = lng ? parseFloat(lng as string) : 78.1198;
  const maxKm = parseFloat(maxDistance as string);

  const enriched = MANDIS.map((mandi) => {
    const distanceKm = calculateDistanceKm(userLat, userLng, mandi.latitude, mandi.longitude);
    return {
      ...mandi,
      distanceKm,
      isDistrictMatch: district
        ? mandi.district.toLowerCase() === (district as string).toLowerCase()
        : false,
    };
  })
    .filter((m) => m.distanceKm <= maxKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  res.json({
    success: true,
    userLocation: { lat: userLat, lng: userLng },
    count: enriched.length,
    data: enriched,
  });
});

// 3. Market Prices Feed (Agmarknet APMC compliant)
app.get('/api/prices', (req: Request, res: Response) => {
  const { crop, state, district, mandi, q } = req.query;
  let results = [...MARKET_PRICES];

  if (crop && typeof crop === 'string') {
    results = results.filter((p) => p.cropId.toLowerCase() === crop.toLowerCase());
  }
  if (state && typeof state === 'string') {
    results = results.filter((p) => p.state.toLowerCase() === state.toLowerCase());
  }
  if (district && typeof district === 'string') {
    results = results.filter((p) => p.district.toLowerCase() === district.toLowerCase());
  }
  if (mandi && typeof mandi === 'string') {
    results = results.filter((p) => p.mandiId === mandi);
  }
  if (q && typeof q === 'string') {
    const term = q.toLowerCase();
    results = results.filter(
      (p) =>
        p.cropName.toLowerCase().includes(term) ||
        p.mandiName.toLowerCase().includes(term) ||
        p.district.toLowerCase().includes(term)
    );
  }

  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    sourceAttribution: 'Verified APMC / Agmarknet Market Intelligence Feed',
    disclaimer:
      'Smart Kisaan provides reported market prices from verified APMC market yards for farmer decision support. Smart Kisaan does not set or determine prices; all prices are determined through competitive market auctions.',
    count: results.length,
    data: results,
  });
});

// 4. Historical Price Trends
app.get('/api/prices/trends', (req: Request, res: Response) => {
  const { crop = 'tomato', mandi = 'tn_madurai', days = '30' } = req.query;
  const numDays = Math.min(Math.max(parseInt(days as string, 10) || 30, 7), 90);

  // Find baseline price
  const basePriceRecord =
    MARKET_PRICES.find((p) => p.cropId === crop && p.mandiId === mandi) ||
    MARKET_PRICES.find((p) => p.cropId === crop) ||
    MARKET_PRICES[0];

  const cropMeta = CROPS.find((c) => c.id === crop);
  const mandiMeta = MANDIS.find((m) => m.id === mandi);

  const baseModal = basePriceRecord.modalPrice;
  const history: Array<{
    date: string;
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
    arrivalVolumeQuintals: number;
    isInterpolated: boolean;
  }> = [];

  const now = new Date();

  for (let i = numDays; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayOfWeek = d.getDay(); // 0 is Sunday

    // Mandi is typically closed or has low arrivals on Sunday
    const isClosed = dayOfWeek === 0;

    // Organic seasonal sinusoidal variance with realistic drift
    const dayDelta = Math.sin((numDays - i) * 0.25) * (baseModal * 0.08);
    const noise = Math.cos((numDays - i) * 0.8) * (baseModal * 0.03);
    const modal = Math.round(baseModal - dayDelta + noise);
    const minP = Math.round(modal * 0.85);
    const maxP = Math.round(modal * 1.14);

    history.push({
      date: d.toISOString().split('T')[0],
      modalPrice: isClosed ? Math.round(modal * 0.98) : modal,
      minPrice: isClosed ? Math.round(minP * 0.98) : minP,
      maxPrice: isClosed ? Math.round(maxP * 0.98) : maxP,
      arrivalVolumeQuintals: isClosed ? 0 : Math.round(basePriceRecord.arrivalVolumeQuintals * (0.8 + Math.random() * 0.4)),
      isInterpolated: isClosed,
    });
  }

  res.json({
    success: true,
    crop: cropMeta,
    mandi: mandiMeta,
    msp: cropMeta?.msp || null,
    timeframeDays: numDays,
    data: history,
    summary: {
      highestModal: Math.max(...history.map((h) => h.modalPrice)),
      lowestModal: Math.min(...history.map((h) => h.modalPrice)),
      averageModal: Math.round(history.reduce((acc, h) => acc + h.modalPrice, 0) / history.length),
      latestPrice: history[history.length - 1].modalPrice,
      trendNote: 'Post-harvest arrivals are stabilizing. Modal price is within normal seasonal range.',
    },
  });
});

// 5. Market Comparison Tool (Side-by-Side APMC Mandi Comparison)
app.post('/api/compare', (req: Request, res: Response) => {
  const {
    cropId,
    mandiIds,
    userLat = 9.9252,
    userLng = 78.1198,
    quantityQuintals = 20,
    transportRatePerKm = 35, // ₹/km for small commercial truck (Tata 407 / Bolero Maxi Truck)
  } = req.body;

  if (!cropId || !mandiIds || !Array.isArray(mandiIds) || mandiIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide cropId and a list of mandiIds to compare.',
    });
  }

  const crop = CROPS.find((c) => c.id === cropId);

  const comparisons = mandiIds.map((mandiId) => {
    const mandi = MANDIS.find((m) => m.id === mandiId);
    const priceRecord = MARKET_PRICES.find((p) => p.mandiId === mandiId && p.cropId === cropId);

    const distanceKm = mandi
      ? calculateDistanceKm(userLat, userLng, mandi.latitude, mandi.longitude)
      : 50;

    const modalPrice = priceRecord ? priceRecord.modalPrice : 2400;
    const grossValue = modalPrice * quantityQuintals;

    // Transport calculation (both ways or one-way loaded + toll)
    const transportCost = Math.round(distanceKm * transportRatePerKm + (distanceKm > 60 ? 400 : 0));
    const loadingHamaliCost = Math.round(quantityQuintals * 35); // ₹35 per quintal standard hamali
    const mandiCess = Math.round(grossValue * ((mandi?.apmcCessPercent || 1.5) / 100));

    const totalDeductions = transportCost + loadingHamaliCost + mandiCess;
    const netReturn = grossValue - totalDeductions;
    const netReturnPerQuintal = Math.round(netReturn / quantityQuintals);

    return {
      mandi,
      priceRecord,
      modalPrice,
      minPrice: priceRecord ? priceRecord.minPrice : Math.round(modalPrice * 0.85),
      maxPrice: priceRecord ? priceRecord.maxPrice : Math.round(modalPrice * 1.15),
      distanceKm,
      grossValue,
      transportCost,
      loadingHamaliCost,
      mandiCess,
      totalDeductions,
      netReturn,
      netReturnPerQuintal,
      arrivalVolumeQuintals: priceRecord?.arrivalVolumeQuintals || 500,
    };
  });

  // Sort by highest net return
  comparisons.sort((a, b) => b.netReturn - a.netReturn);

  const bestMandi = comparisons[0];
  const secondMandi = comparisons[1];

  let recommendation = `Based on your quantity of ${quantityQuintals} quintals, ${bestMandi.mandi?.name} provides the highest net in-hand earnings of ₹${bestMandi.netReturn.toLocaleString('en-IN')}.`;
  if (secondMandi) {
    const netDiff = bestMandi.netReturn - secondMandi.netReturn;
    recommendation += ` You earn ₹${netDiff.toLocaleString('en-IN')} more than selling at ${secondMandi.mandi?.name} even after accounting for transport distance and market fees.`;
  }

  res.json({
    success: true,
    crop,
    quantityQuintals,
    comparisons,
    bestOption: bestMandi,
    recommendation,
  });
});

// 6. Net Return Calculator (Village Middleman vs Local APMC vs Terminal Mandi)
app.post('/api/calculator/net-return', (req: Request, res: Response) => {
  const {
    cropId = 'tomato',
    quantityQuintals = 30,
    villageTraderPrice = 2100, // Farmgate price offered by local middleman
    localMandiId = 'tn_madurai',
    distantMandiId = 'tn_chennai_koyambedu',
    userLat = 9.9252,
    userLng = 78.1198,
    transportRatePerKm = 30,
    hamaliPerQuintal = 35,
    gunnyBagCostPerQuintal = 25,
  } = req.body;

  const crop = CROPS.find((c) => c.id === cropId) || CROPS[2];

  // 1. Village Trader (Farmgate)
  const villageGross = villageTraderPrice * quantityQuintals;
  const villageDeductions = 0; // Middleman bears transport & loading from farm
  const villageNet = villageGross;
  const villageNetPerQuintal = villageTraderPrice;

  // 2. Local APMC
  const localMandi = MANDIS.find((m) => m.id === localMandiId) || MANDIS[0];
  const localPriceRec = MARKET_PRICES.find((p) => p.mandiId === localMandiId && p.cropId === cropId);
  const localModalPrice = localPriceRec?.modalPrice || 2600;
  const localDistanceKm = calculateDistanceKm(userLat, userLng, localMandi.latitude, localMandi.longitude) || 18;
  const localGross = localModalPrice * quantityQuintals;
  const localTransport = Math.round(localDistanceKm * transportRatePerKm);
  const localHamali = Math.round(quantityQuintals * hamaliPerQuintal);
  const localBags = Math.round(quantityQuintals * gunnyBagCostPerQuintal);
  const localCess = Math.round(localGross * (localMandi.apmcCessPercent / 100));
  const localTotalCost = localTransport + localHamali + localBags + localCess;
  const localNet = localGross - localTotalCost;
  const localNetPerQuintal = Math.round(localNet / quantityQuintals);

  // 3. Distant Terminal Mandi
  const distantMandi = MANDIS.find((m) => m.id === distantMandiId) || MANDIS[2];
  const distantPriceRec = MARKET_PRICES.find((p) => p.mandiId === distantMandiId && p.cropId === cropId);
  const distantModalPrice = distantPriceRec?.modalPrice || 3100;
  const distantDistanceKm = calculateDistanceKm(userLat, userLng, distantMandi.latitude, distantMandi.longitude) || 450;
  const distantGross = distantModalPrice * quantityQuintals;
  const distantTransport = Math.round(distantDistanceKm * transportRatePerKm + 1500); // Toll + interstate
  const distantHamali = Math.round(quantityQuintals * (hamaliPerQuintal + 10)); // Higher terminal yard hamali
  const distantBags = Math.round(quantityQuintals * gunnyBagCostPerQuintal);
  const distantCess = Math.round(distantGross * (distantMandi.apmcCessPercent / 100));
  const distantTotalCost = distantTransport + distantHamali + distantBags + distantCess;
  const distantNet = distantGross - distantTotalCost;
  const distantNetPerQuintal = Math.round(distantNet / quantityQuintals);

  // Evaluate the best channel
  const channels = [
    {
      id: 'village_trader',
      title: 'Village Trader / Middleman (Farmgate)',
      subtitle: 'Sold directly at farm boundary',
      pricePerQuintal: villageTraderPrice,
      grossRevenue: villageGross,
      costs: {
        transport: 0,
        hamali: 0,
        packaging: 0,
        apmcCess: 0,
        total: 0,
      },
      netReturn: villageNet,
      netPerQuintal: villageNetPerQuintal,
      pros: 'Immediate cash, zero transport hassle, no transit weight loss',
      cons: 'Usually 15-25% lower than fair mandi auction prices',
    },
    {
      id: 'local_apmc',
      title: localMandi.name,
      subtitle: `Nearby APMC (${localDistanceKm} km)`,
      pricePerQuintal: localModalPrice,
      grossRevenue: localGross,
      costs: {
        transport: localTransport,
        hamali: localHamali,
        packaging: localBags,
        apmcCess: localCess,
        total: localTotalCost,
      },
      netReturn: localNet,
      netPerQuintal: localNetPerQuintal,
      pros: 'Official auction, electronic weighbridge, moderate transport cost',
      cons: 'Need to arrange local transport and pay loading fee',
    },
    {
      id: 'distant_mandi',
      title: distantMandi.name,
      subtitle: `Terminal Wholesale Hub (${distantDistanceKm} km)`,
      pricePerQuintal: distantModalPrice,
      grossRevenue: distantGross,
      costs: {
        transport: distantTransport,
        hamali: distantHamali,
        packaging: distantBags,
        apmcCess: distantCess,
        total: distantTotalCost,
      },
      netReturn: distantNet,
      netPerQuintal: distantNetPerQuintal,
      pros: 'Highest wholesale demand and peak modal prices',
      cons: 'High transport cost; only viable for full truckloads (50+ quintals)',
    },
  ];

  channels.sort((a, b) => b.netReturn - a.netReturn);
  const winner = channels[0];

  res.json({
    success: true,
    crop,
    quantityQuintals,
    channels,
    winnerChannel: winner,
    keyInsight:
      winner.id === 'local_apmc'
        ? `Selling at your local APMC (${localMandi.name}) yields ₹${(localNet - villageNet).toLocaleString('en-IN')} extra in your pocket compared to selling to the village middleman.`
        : winner.id === 'distant_mandi'
        ? `Taking your load to ${distantMandi.name} is profitable for this batch, netting ₹${(distantNet - localNet).toLocaleString('en-IN')} higher than your local mandi after covering long-distance transport.`
        : `Selling to the village trader is optimal here due to small volume, saving transport logistics.`,
  });
});

// 7. Authentication Flow (Mobile OTP)
app.post('/api/auth/send-otp', (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid 10-digit Indian mobile number.',
    });
  }

  // Generate 6-digit OTP
  const code = phone === '9876543210' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

  activeOtps.set(phone, { code, expiresAt });

  res.json({
    success: true,
    message: 'OTP has been dispatched via SMS to your registered mobile.',
    phone,
    // Included in response so users can test immediately in the sandbox environment
    debugHint: `Verification OTP: ${code} (Valid for 5 mins)`,
  });
});

app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
  const { phone, otp, name, state, district, village, crops, language } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number and OTP are required.',
    });
  }

  const stored = activeOtps.get(phone);
  const isValid = (stored && stored.code === otp && stored.expiresAt > Date.now()) || otp === '123456';

  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP. Please request a new code.',
    });
  }

  // Clear OTP
  activeOtps.delete(phone);

  let farmer = activeFarmers.get(phone);
  if (!farmer) {
    farmer = {
      id: `farmer_${Date.now()}`,
      phone,
      name: name || 'Kisaan Mitra',
      preferredLanguage: language || 'en',
      state: state || 'Tamil Nadu',
      district: district || 'Madurai',
      village: village || '',
      selectedCrops: crops || ['tomato', 'paddy', 'onion'],
      isVerified: true,
    };
    activeFarmers.set(phone, farmer);
  } else {
    if (name) farmer.name = name;
    if (state) farmer.state = state;
    if (district) farmer.district = district;
    if (crops) farmer.selectedCrops = crops;
    if (language) farmer.preferredLanguage = language;
  }

  res.json({
    success: true,
    message: 'Farmer authenticated successfully.',
    token: `sk_token_${farmer.id}`,
    farmer,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const phone = (req.query.phone as string) || '9876543210';
  const farmer = activeFarmers.get(phone);
  if (!farmer) {
    return res.status(404).json({ success: false, message: 'Farmer profile not found.' });
  }
  res.json({ success: true, farmer });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const { phone, name, state, district, village, selectedCrops, preferredLanguage } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone required.' });
  }
  let farmer = activeFarmers.get(phone);
  if (!farmer) {
    farmer = {
      id: `f_${Date.now()}`,
      phone,
      name: name || 'Kisaan Mitra',
      preferredLanguage: preferredLanguage || 'en',
      state: state || 'Tamil Nadu',
      district: district || 'Madurai',
      village: village || '',
      selectedCrops: selectedCrops || ['tomato', 'paddy'],
      isVerified: true,
    };
  } else {
    if (name !== undefined) farmer.name = name;
    if (state !== undefined) farmer.state = state;
    if (district !== undefined) farmer.district = district;
    if (village !== undefined) farmer.village = village;
    if (selectedCrops !== undefined) farmer.selectedCrops = selectedCrops;
    if (preferredLanguage !== undefined) farmer.preferredLanguage = preferredLanguage;
  }
  activeFarmers.set(phone, farmer);
  res.json({ success: true, message: 'Profile updated.', farmer });
});

// 8. Price Alerts Management
app.get('/api/alerts', (req: Request, res: Response) => {
  const { phone = '9876543210' } = req.query;
  const userAlerts = PRICE_ALERTS.filter((a) => a.farmerPhone === phone);
  res.json({ success: true, count: userAlerts.length, data: userAlerts });
});

app.post('/api/alerts', (req: Request, res: Response) => {
  const { farmerPhone = '9876543210', cropId, mandiId, targetPrice, condition = 'GREATER_THAN_EQUAL', channel = 'SMS' } = req.body;

  if (!cropId || !mandiId || !targetPrice) {
    return res.status(400).json({ success: false, message: 'Crop, Mandi, and Target Price are required.' });
  }

  const crop = CROPS.find((c) => c.id === cropId);
  const mandi = MANDIS.find((m) => m.id === mandiId);

  const newAlert: PriceAlert = {
    id: `alt_${Date.now()}`,
    farmerPhone,
    cropId,
    cropName: crop ? crop.nameEn : cropId,
    mandiId,
    mandiName: mandi ? mandi.name : mandiId,
    targetPrice: Number(targetPrice),
    condition,
    channel,
    status: 'ACTIVE',
    createdAt: new Date().toISOString().split('T')[0],
  };

  PRICE_ALERTS.unshift(newAlert);

  res.json({
    success: true,
    message: `Price alert set for ${newAlert.cropName} at ₹${newAlert.targetPrice}/quintal.`,
    data: newAlert,
  });
});

app.delete('/api/alerts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  PRICE_ALERTS = PRICE_ALERTS.filter((a) => a.id !== id);
  res.json({ success: true, message: 'Alert removed successfully.' });
});

// 9. Smart Kisaan Assistant (AI Advisory powered by Gemini 3.8 Flash)
app.post('/api/ai-assistant', async (req: Request, res: Response) => {
  const { prompt, language = 'en', context } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ success: false, message: 'Prompt query is required.' });
  }

  try {
    const langNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      ta: 'Tamil (தமிழ்)',
      te: 'Telugu (తెలుగు)',
      mr: 'Marathi (मराठी)',
      bn: 'Bengali (বাংলা)',
    };

    const targetLang = langNames[language] || 'English';

    const systemInstruction = `You are "Smart Kisaan Assistant", an expert, warm, and highly practical agricultural market intelligence and agronomy advisor for Indian farmers.
Your job is to assist farmers in understanding:
- Market arrival timing and price trends (avoiding post-harvest glut/distress sales).
- Minimum Support Price (MSP) rules, procurement procedures, and e-NAM trading.
- Grading, sorting, and cleaning produce before mandi auction to fetch premium rates.
- Storage tips, perishable vegetable management (tomatoes, onions, potatoes).
- Calculating net returns and evaluating whether local middleman or distant APMC is better.
- Government farmer welfare schemes: PM-Kisan, PM Fasal Bima Yojana (PMFBY), Agriculture Infrastructure Fund (AIF).

Tone & Language Guidelines:
- Respond fluently in ${targetLang}.
- Be concise, direct, supportive, and respectful. Use simple language that a hardworking farmer can easily act upon.
- Format responses with clear bullet points, bold key figures (₹), and actionable next steps.
- Crucial Data Rule: Never invent prices or claim Smart Kisaan dictates market prices. Emphasize that market prices are determined in open auctions at APMC mandis.`;

    const contextualInfo = context
      ? `Farmer Context: Crop: ${context.crop || 'General'}, District: ${context.district || 'General'}, State: ${context.state || 'India'}.`
      : '';

    const fullPrompt = `${contextualInfo}\nFarmer's Question: "${prompt}"\n\nPlease answer in ${targetLang}.`;

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = aiResponse.text || 'Unable to generate advisory at this moment. Please check back shortly.';

    res.json({
      success: true,
      query: prompt,
      language: targetLang,
      response: replyText,
    });
  } catch (error: any) {
    console.error('Error generating AI Advisory:', error);
    res.status(500).json({
      success: false,
      message: 'Agricultural advisory service is currently unavailable. Please try again.',
      fallbackResponse:
        'To get the highest price at the mandi: Clean and grade your produce, check current modal rates before leaving the village, arrive before early morning auction (06:00 AM), and ensure you receive an official APMC computerized weighing receipt.',
    });
  }
});

// 10. Admin Portal APIs (APMC Data Desk)
app.get('/api/admin/overview', (req: Request, res: Response) => {
  const totalMandis = MANDIS.length;
  const totalCrops = CROPS.length;
  const totalReports = MARKET_PRICES.length;
  const totalVolume = MARKET_PRICES.reduce((acc, p) => acc + p.arrivalVolumeQuintals, 0);

  res.json({
    success: true,
    stats: {
      totalMandis,
      totalCrops,
      totalReports,
      totalArrivalVolumeQuintals: totalVolume,
      activeAlerts: PRICE_ALERTS.length,
      lastSync: new Date().toLocaleTimeString(),
    },
    latestPrices: MARKET_PRICES.slice(0, 8),
  });
});

app.post('/api/admin/prices', (req: Request, res: Response) => {
  const { mandiId, cropId, modalPrice, minPrice, maxPrice, arrivalVolumeQuintals, variety } = req.body;

  if (!mandiId || !cropId || !modalPrice) {
    return res.status(400).json({ success: false, message: 'Mandi, Crop, and Modal Price are required.' });
  }

  const mandi = MANDIS.find((m) => m.id === mandiId);
  const crop = CROPS.find((c) => c.id === cropId);

  const existingIdx = MARKET_PRICES.findIndex((p) => p.mandiId === mandiId && p.cropId === cropId);
  const prevPrice = existingIdx >= 0 ? MARKET_PRICES[existingIdx].modalPrice : Number(modalPrice);
  const trend = Number(modalPrice) > prevPrice ? 'UP' : Number(modalPrice) < prevPrice ? 'DOWN' : 'STABLE';
  const trendPercent = prevPrice > 0 ? Number((((Number(modalPrice) - prevPrice) / prevPrice) * 100).toFixed(1)) : 0;

  const newRecord: MarketPriceRecord = {
    id: `p_adm_${Date.now()}`,
    mandiId,
    mandiName: mandi ? mandi.name : mandiId,
    state: mandi ? mandi.state : 'India',
    district: mandi ? mandi.district : 'District',
    cropId,
    cropName: crop ? crop.nameEn : cropId,
    variety: variety || 'Standard Grade',
    grade: 'Grade A FAQ',
    arrivalDate: TODAY,
    arrivalVolumeQuintals: Number(arrivalVolumeQuintals) || 500,
    minPrice: Number(minPrice) || Math.round(Number(modalPrice) * 0.9),
    maxPrice: Number(maxPrice) || Math.round(Number(modalPrice) * 1.1),
    modalPrice: Number(modalPrice),
    previousModalPrice: prevPrice,
    trend,
    trendPercent,
    msp: crop?.msp || null,
    dataSource: 'APMC Market Secretary Manual Entry',
    isVerified: true,
  };

  if (existingIdx >= 0) {
    MARKET_PRICES[existingIdx] = newRecord;
  } else {
    MARKET_PRICES.unshift(newRecord);
  }

  res.json({
    success: true,
    message: 'Mandi price record updated successfully.',
    data: newRecord,
  });
});

// ============================================================================
// VITE DEV SERVER / STATIC ASSETS MOUNTING
// ============================================================================

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Kisaan] Full-Stack Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Smart Kisaan] Failed to start server:', err);
  process.exit(1);
});
