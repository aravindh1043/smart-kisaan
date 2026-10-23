import {
  Crop,
  Mandi,
  MarketPriceRecord,
  FarmerProfile,
  PriceAlert,
  ComparisonResponse,
  NetReturnResponse,
  TrendResponse,
} from '../types';

const API_BASE = '/api';

export async function getCrops(): Promise<Crop[]> {
  const res = await fetch(`${API_BASE}/crops`);
  const data = await res.json();
  return data.data || [];
}

export async function getMandis(state?: string, district?: string, q?: string): Promise<Mandi[]> {
  const params = new URLSearchParams();
  if (state) params.set('state', state);
  if (district) params.set('district', district);
  if (q) params.set('q', q);
  const res = await fetch(`${API_BASE}/mandis?${params.toString()}`);
  const data = await res.json();
  return data.data || [];
}

export async function getNearbyMandis(
  lat?: number,
  lng?: number,
  district?: string
): Promise<Mandi[]> {
  const params = new URLSearchParams();
  if (lat) params.set('lat', lat.toString());
  if (lng) params.set('lng', lng.toString());
  if (district) params.set('district', district);
  const res = await fetch(`${API_BASE}/mandis/nearby?${params.toString()}`);
  const data = await res.json();
  return data.data || [];
}

export async function getMarketPrices(filters?: {
  crop?: string;
  state?: string;
  district?: string;
  mandi?: string;
  q?: string;
}): Promise<{ records: MarketPriceRecord[]; sourceAttribution: string; disclaimer: string }> {
  const params = new URLSearchParams();
  if (filters?.crop) params.set('crop', filters.crop);
  if (filters?.state) params.set('state', filters.state);
  if (filters?.district) params.set('district', filters.district);
  if (filters?.mandi) params.set('mandi', filters.mandi);
  if (filters?.q) params.set('q', filters.q);

  const res = await fetch(`${API_BASE}/prices?${params.toString()}`);
  const data = await res.json();
  return {
    records: data.data || [],
    sourceAttribution: data.sourceAttribution || 'Verified APMC Market Intelligence',
    disclaimer: data.disclaimer || '',
  };
}

export async function getPriceTrends(
  crop: string,
  mandi?: string,
  days: number = 30
): Promise<TrendResponse> {
  const params = new URLSearchParams();
  params.set('crop', crop);
  if (mandi) params.set('mandi', mandi);
  params.set('days', days.toString());

  const res = await fetch(`${API_BASE}/prices/trends?${params.toString()}`);
  const data = await res.json();
  return data;
}

export async function compareMandis(payload: {
  cropId: string;
  mandiIds: string[];
  userLat?: number;
  userLng?: number;
  quantityQuintals?: number;
  transportRatePerKm?: number;
}): Promise<ComparisonResponse> {
  const res = await fetch(`${API_BASE}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function calculateNetReturn(payload: {
  cropId: string;
  quantityQuintals: number;
  villageTraderPrice: number;
  localMandiId: string;
  distantMandiId: string;
  userLat?: number;
  userLng?: number;
  transportRatePerKm?: number;
  hamaliPerQuintal?: number;
  gunnyBagCostPerQuintal?: number;
}): Promise<NetReturnResponse> {
  const res = await fetch(`${API_BASE}/calculator/net-return`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function sendOtp(phone: string): Promise<{ success: boolean; message: string; debugHint?: string }> {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return res.json();
}

export async function verifyOtp(payload: {
  phone: string;
  otp: string;
  name?: string;
  state?: string;
  district?: string;
  village?: string;
  crops?: string[];
  language?: string;
}): Promise<{ success: boolean; message: string; farmer?: FarmerProfile; token?: string }> {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getFarmerProfile(phone?: string): Promise<FarmerProfile | null> {
  const res = await fetch(`${API_BASE}/auth/me?phone=${phone || '9876543210'}`);
  const data = await res.json();
  return data.farmer || null;
}

export async function updateFarmerProfile(payload: Partial<FarmerProfile>): Promise<FarmerProfile> {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.farmer;
}

export async function getAlerts(phone?: string): Promise<PriceAlert[]> {
  const res = await fetch(`${API_BASE}/alerts?phone=${phone || '9876543210'}`);
  const data = await res.json();
  return data.data || [];
}

export async function createAlert(payload: {
  farmerPhone: string;
  cropId: string;
  mandiId: string;
  targetPrice: number;
  condition?: string;
  channel?: string;
}): Promise<PriceAlert> {
  const res = await fetch(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data.data;
}

export async function deleteAlert(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/alerts/${id}`, { method: 'DELETE' });
  const data = await res.json();
  return data.success;
}

export async function askAiAssistant(
  prompt: string,
  language: string,
  context?: { crop?: string; district?: string; state?: string }
): Promise<{ success: boolean; response: string }> {
  const res = await fetch(`${API_BASE}/ai-assistant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, language, context }),
  });
  return res.json();
}

export async function getAdminOverview(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/overview`);
  return res.json();
}

export async function submitAdminPrice(payload: {
  mandiId: string;
  cropId: string;
  modalPrice: number;
  minPrice?: number;
  maxPrice?: number;
  arrivalVolumeQuintals?: number;
  variety?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/prices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
