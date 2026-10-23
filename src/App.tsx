import React, { useState, useEffect } from 'react';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Scale,
  MapPin,
  Calculator,
  LineChart,
  Bell,
  Sparkles,
  Database,
  PhoneCall,
  Languages,
} from 'lucide-react';
import { Language, FarmerProfile, Crop, Mandi, MarketPriceRecord } from './types';
import { TRANSLATIONS } from './i18n/translations';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MarketPriceBrowser } from './components/MarketPriceBrowser';
import { MarketComparison } from './components/MarketComparison';
import { NearbyMarkets } from './components/NearbyMarkets';
import { NetReturnCalculator } from './components/NetReturnCalculator';
import { PriceTrends } from './components/PriceTrends';
import { PriceAlerts } from './components/PriceAlerts';
import { SmartKisaanAssistant } from './components/SmartKisaanAssistant';
import { AdminPortal } from './components/AdminPortal';
import { FarmerAuthModal } from './components/FarmerAuthModal';
import { getCrops, getMandis, getMarketPrices, getFarmerProfile } from './services/api';

export default function App() {
  // 1. Language state with persistence
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const saved = localStorage.getItem('smartkisaan_lang');
    return (saved as Language) || 'ta'; // Default to Tamil as greeted by user ("Mapla, இதுதான் நம்ம final architecture"), with instant switch to any of the 6 languages
  });

  const handleSelectLang = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('smartkisaan_lang', lang);
  };

  const t = TRANSLATIONS[currentLang];

  // 2. Navigation Tab state
  const [activeTab, setActiveTab] = useState<string>('prices');

  // 3. Farmer Profile state
  const [farmer, setFarmer] = useState<FarmerProfile | null>(() => {
    const saved = localStorage.getItem('smartkisaan_farmer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default demo profile for instant interactivity
    return {
      id: 'f_demo_1',
      phone: '9876543210',
      name: 'Murugan Chinnappan',
      preferredLanguage: 'ta',
      state: 'Tamil Nadu',
      district: 'Madurai',
      village: 'Vadipatti',
      selectedCrops: ['tomato', 'paddy', 'onion'],
      isVerified: true,
    };
  });

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // 4. Master Data
  const [crops, setCrops] = useState<Crop[]>([]);
  const [mandis, setMandis] = useState<Mandi[]>([]);
  const [prices, setPrices] = useState<MarketPriceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Cross-component transition state
  const [navContext, setNavContext] = useState<{
    cropId?: string;
    mandiId?: string;
    price?: number;
  }>({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [cropsData, mandisData, pricesData] = await Promise.all([
        getCrops(),
        getMandis(),
        getMarketPrices(),
      ]);
      setCrops(cropsData);
      setMandis(mandisData);
      setPrices(pricesData.records);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLoginSuccess = (profile: FarmerProfile) => {
    setFarmer(profile);
    localStorage.setItem('smartkisaan_farmer', JSON.stringify(profile));
  };

  // Navigations from Price cards
  const handleCompareMandi = (cropId: string, mandiId: string) => {
    setNavContext({ cropId, mandiId });
    setActiveTab('compare');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleCalculateReturn = (cropId: string, mandiId: string, price: number) => {
    setNavContext({ cropId, mandiId, price });
    setActiveTab('calculator');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSetAlert = (cropId: string, mandiId: string, price: number) => {
    setNavContext({ cropId, mandiId, price });
    setActiveTab('alerts');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleSelectMandiForPrices = (mandiId: string) => {
    setNavContext({ mandiId });
    setActiveTab('prices');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentLang={currentLang}
        onSelectLang={handleSelectLang}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: tab === 'prices' ? 0 : 380, behavior: 'smooth' });
        }}
        farmer={farmer}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* 2. Hero Section with Live Mandi Ticker */}
      <HeroSection
        currentLang={currentLang}
        onSelectTab={setActiveTab}
        topPrices={prices}
      />

      {/* 3. Main Dynamic Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md animate-bounce mb-3">
              <Sprout className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-stone-800">
              Loading Verified APMC Mandi Data...
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Synchronizing official agricultural market bulletins
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'prices' && (
              <MarketPriceBrowser
                currentLang={currentLang}
                prices={prices}
                allCrops={crops}
                allMandis={mandis}
                userPreferredCrops={farmer?.selectedCrops || []}
                onCompareMandi={handleCompareMandi}
                onCalculateReturn={handleCalculateReturn}
                onSetAlert={handleSetAlert}
              />
            )}

            {activeTab === 'compare' && (
              <MarketComparison
                currentLang={currentLang}
                allCrops={crops}
                allMandis={mandis}
                initialCropId={navContext.cropId || 'tomato'}
                initialMandiId={navContext.mandiId || 'tn_madurai'}
              />
            )}

            {activeTab === 'nearby' && (
              <NearbyMarkets
                currentLang={currentLang}
                userDistrict={farmer?.district || 'Madurai'}
                onSelectMandiForPrices={handleSelectMandiForPrices}
                onSelectMandiForCalc={(mandiId) => handleCalculateReturn('tomato', mandiId, 2600)}
              />
            )}

            {activeTab === 'calculator' && (
              <NetReturnCalculator
                currentLang={currentLang}
                allCrops={crops}
                allMandis={mandis}
                initialCropId={navContext.cropId || 'tomato'}
                initialMandiId={navContext.mandiId || 'tn_madurai'}
                initialPrice={navContext.price || 2600}
              />
            )}

            {activeTab === 'trends' && (
              <PriceTrends
                currentLang={currentLang}
                allCrops={crops}
                allMandis={mandis}
                initialCropId={navContext.cropId || 'tomato'}
                initialMandiId={navContext.mandiId || 'tn_madurai'}
              />
            )}

            {activeTab === 'alerts' && (
              <PriceAlerts
                currentLang={currentLang}
                allCrops={crops}
                allMandis={mandis}
                farmerPhone={farmer?.phone || '9876543210'}
                initialCropId={navContext.cropId || 'tomato'}
                initialMandiId={navContext.mandiId || 'tn_madurai'}
                initialTargetPrice={navContext.price ? Math.round(navContext.price * 1.1) : 2800}
              />
            )}

            {activeTab === 'ai' && (
              <SmartKisaanAssistant
                currentLang={currentLang}
                userDistrict={farmer?.district || 'Madurai'}
                userState={farmer?.state || 'Tamil Nadu'}
                allCrops={crops}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPortal
                currentLang={currentLang}
                allCrops={crops}
                allMandis={mandis}
                onRefreshPrices={loadData}
              />
            )}
          </>
        )}
      </main>

      {/* 4. Farmer Registration / Login Modal */}
      <FarmerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentLang={currentLang}
        onLoginSuccess={handleLoginSuccess}
        allCrops={crops}
        currentFarmer={farmer}
      />

      {/* 5. Production Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Branding Column */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5 text-white font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Sprout className="w-5 h-5" />
                </div>
                <span>Smart Kisaan</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed max-w-md">
                “Know the Price. Compare the Market. Sell Smarter.” A farmer-first agricultural market intelligence and decision-support platform designed to help small and marginal farmers make profitable harvest selling decisions.
              </p>
              <div className="pt-2 text-[11px] text-stone-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Official Agmarknet APMC Auction Data Aggregation Architecture
                </span>
              </div>
            </div>

            {/* Quick Nav */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
                Decision Tools
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('prices')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Daily Mandi Prices
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('compare')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Mandi Comparison
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('nearby')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Nearby APMC Yards
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Net Return Calculator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Smart Kisaan AI Advisory
                  </button>
                </li>
              </ul>
            </div>

            {/* Farmer Helpline & Support */}
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-3">
                Government Helplines
              </h4>
              <div className="space-y-3 text-stone-400">
                <div className="flex items-start gap-2">
                  <PhoneCall className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Kisan Call Centre (KCC)</div>
                    <div className="font-mono text-emerald-400 font-semibold">1800-180-1551</div>
                    <div className="text-[10px]">Toll-Free, 22 Languages (6 AM - 10 PM)</div>
                  </div>
                </div>

                <div className="pt-1">
                  <div className="font-bold text-white text-[11px]">e-NAM National Portal</div>
                  <div className="text-[10px] text-stone-400">Toll-Free 1800-270-0224</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Legal & Data Source Disclaimer */}
          <div className="mt-8 pt-6 border-t border-stone-800 text-[11px] text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              © 2026 Smart Kisaan. All rights reserved. Prices are reported from verified APMC market auctions; Smart Kisaan provides decision support and does not fix market prices.
            </p>
            <div className="flex items-center gap-4">
              <span>English</span>
              <span>•</span>
              <span>हिन्दी</span>
              <span>•</span>
              <span>தமிழ்</span>
              <span>•</span>
              <span>తెలుగు</span>
              <span>•</span>
              <span>मराठी</span>
              <span>•</span>
              <span>বাংলা</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
