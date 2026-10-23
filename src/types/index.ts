export type Language = 'en' | 'hi' | 'ta' | 'te' | 'mr' | 'bn';

export interface Crop {
  id: string;
  nameEn: string;
  nameHi: string;
  nameTa: string;
  nameTe: string;
  nameMr: string;
  nameBn: string;
  category: 'Cereals' | 'Vegetables' | 'Oilseeds' | 'Cash Crops' | 'Spices' | 'Fruits';
  standardUnit: string;
  msp: number | null;
  icon: string;
}

export interface Mandi {
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
  distanceKm?: number;
}

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

export interface FarmerProfile {
  id: string;
  phone: string;
  name: string;
  preferredLanguage: Language;
  state: string;
  district: string;
  village: string;
  selectedCrops: string[];
  isVerified: boolean;
}

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

export interface MandiComparisonItem {
  mandi: Mandi;
  priceRecord: MarketPriceRecord;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  distanceKm: number;
  grossValue: number;
  transportCost: number;
  loadingHamaliCost: number;
  mandiCess: number;
  totalDeductions: number;
  netReturn: number;
  netReturnPerQuintal: number;
  arrivalVolumeQuintals: number;
}

export interface ComparisonResponse {
  success?: boolean;
  crop: Crop;
  quantityQuintals: number;
  comparisons: MandiComparisonItem[];
  bestOption: MandiComparisonItem;
  recommendation: string;
}

export interface CalculatorChannel {
  id: string;
  title: string;
  subtitle: string;
  pricePerQuintal: number;
  grossRevenue: number;
  costs: {
    transport: number;
    hamali: number;
    packaging: number;
    apmcCess: number;
    total: number;
  };
  netReturn: number;
  netPerQuintal: number;
  pros: string;
  cons: string;
}

export interface NetReturnResponse {
  success?: boolean;
  crop: Crop;
  quantityQuintals: number;
  channels: CalculatorChannel[];
  winnerChannel: CalculatorChannel;
  keyInsight: string;
}

export interface TrendHistoryRecord {
  date: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  arrivalVolumeQuintals: number;
  isInterpolated: boolean;
}

export interface TrendResponse {
  success?: boolean;
  crop: Crop;
  mandi: Mandi;
  msp: number | null;
  timeframeDays: number;
  data: TrendHistoryRecord[];
  summary: {
    highestModal: number;
    lowestModal: number;
    averageModal: number;
    latestPrice: number;
    trendNote: string;
  };
}
