import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Scale,
  Calculator,
  Bell,
  MapPin,
  Calendar,
  Layers,
  CheckCircle,
  Sprout,
  ArrowUpRight,
} from 'lucide-react';
import { Language, MarketPriceRecord, Crop, Mandi } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface MarketPriceBrowserProps {
  currentLang: Language;
  prices: MarketPriceRecord[];
  allCrops: Crop[];
  allMandis: Mandi[];
  userPreferredCrops: string[];
  onCompareMandi: (cropId: string, mandiId: string) => void;
  onCalculateReturn: (cropId: string, mandiId: string, price: number) => void;
  onSetAlert: (cropId: string, mandiId: string, currentPrice: number) => void;
}

export const MarketPriceBrowser: React.FC<MarketPriceBrowserProps> = ({
  currentLang,
  prices,
  allCrops,
  allMandis,
  userPreferredCrops,
  onCompareMandi,
  onCalculateReturn,
  onSetAlert,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMyCropsOnly, setFilterMyCropsOnly] = useState<boolean>(false);

  // Extract unique states
  const states = useMemo(() => {
    const s = new Set<string>();
    prices.forEach((p) => s.add(p.state));
    return Array.from(s).sort();
  }, [prices]);

  // Filtered prices list
  const filteredPrices = useMemo(() => {
    return prices.filter((item) => {
      // Crop filter
      if (selectedCrop !== 'all' && item.cropId !== selectedCrop) {
        return false;
      }
      // My Crops filter
      if (filterMyCropsOnly && !userPreferredCrops.includes(item.cropId)) {
        return false;
      }
      // State filter
      if (selectedState !== 'all' && item.state !== selectedState) {
        return false;
      }
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.cropName.toLowerCase().includes(q);
        const matchesMandi = item.mandiName.toLowerCase().includes(q);
        const matchesDistrict = item.district.toLowerCase().includes(q);
        const matchesVariety = item.variety.toLowerCase().includes(q);
        if (!matchesName && !matchesMandi && !matchesDistrict && !matchesVariety) {
          return false;
        }
      }
      return true;
    });
  }, [prices, selectedCrop, selectedState, searchQuery, filterMyCropsOnly, userPreferredCrops]);

  // Helper to get localized crop name
  const getCropDisplayName = (cropId: string, fallback: string) => {
    const meta = allCrops.find((c) => c.id === cropId);
    if (!meta) return fallback;
    if (currentLang === 'hi' && meta.nameHi) return meta.nameHi;
    if (currentLang === 'ta' && meta.nameTa) return meta.nameTa;
    if (currentLang === 'te' && meta.nameTe) return meta.nameTe;
    if (currentLang === 'mr' && meta.nameMr) return meta.nameMr;
    if (currentLang === 'bn' && meta.nameBn) return meta.nameBn;
    return meta.nameEn;
  };

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-stone-200">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm font-medium outline-hidden transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700"
              >
                Clear
              </button>
            )}
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 focus:border-emerald-500 outline-hidden"
            >
              <option value="all">{t.allStates}</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>

            {/* My Crops Toggle */}
            {userPreferredCrops.length > 0 && (
              <button
                onClick={() => setFilterMyCropsOnly(!filterMyCropsOnly)}
                className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  filterMyCropsOnly
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                <Sprout className="w-4 h-4" />
                <span>My Crops</span>
              </button>
            )}
          </div>
        </div>

        {/* Commodity Chips Horizontal Scroll */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedCrop('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              selectedCrop === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {t.allCrops}
          </button>

          {allCrops.map((crop) => {
            const isSelected = selectedCrop === crop.id;
            const displayName = getCropDisplayName(crop.id, crop.nameEn);
            return (
              <button
                key={crop.id}
                onClick={() => setSelectedCrop(crop.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs font-bold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{crop.icon}</span>
                <span>{displayName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider px-1">
        <span>
          Showing {filteredPrices.length} Reported APMC Rates
        </span>
        <span className="text-emerald-700 font-medium lowercase">
          Prices quoted per quintal (100 kg)
        </span>
      </div>

      {/* Prices Grid */}
      {filteredPrices.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-stone-800">
            {t.noPricesFound}
          </h4>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            Try choosing a different state or clear your search keywords to view all reported mandi rates.
          </p>
          <button
            onClick={() => {
              setSelectedCrop('all');
              setSelectedState('all');
              setSearchQuery('');
              setFilterMyCropsOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrices.map((record) => {
            const cropMeta = allCrops.find((c) => c.id === record.cropId);
            const displayName = getCropDisplayName(record.cropId, record.cropName);
            const mspDiff = record.msp ? record.modalPrice - record.msp : null;

            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Top Details */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{cropMeta?.icon || '🌾'}</span>
                        <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                          {displayName}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="font-semibold text-stone-700 truncate max-w-[200px]">
                          {record.mandiName}
                        </span>
                      </div>
                    </div>

                    {/* Trend Badge */}
                    <div
                      className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                        record.trend === 'UP'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : record.trend === 'DOWN'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {record.trend === 'UP' ? (
                        <TrendingUp className="w-3.5 h-3.5" />
                      ) : record.trend === 'DOWN' ? (
                        <TrendingDown className="w-3.5 h-3.5" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {record.trend === 'UP' ? '+' : ''}
                        {record.trendPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Primary Modal Price display */}
                  <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200/60">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                        {t.modalPrice}
                      </span>
                      <span className="text-xs text-stone-400">
                        {t.quintal}
                      </span>
                    </div>

                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-stone-950 font-mono tracking-tight">
                        ₹{record.modalPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        / quintal
                      </span>
                    </div>

                    {/* Min & Max corridor */}
                    <div className="mt-2.5 pt-2 border-t border-stone-200/70 flex items-center justify-between text-xs">
                      <div className="text-stone-600">
                        <span className="text-stone-400">{t.minPrice}: </span>
                        <span className="font-semibold font-mono">
                          ₹{record.minPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="text-stone-600">
                        <span className="text-stone-400">{t.maxPrice}: </span>
                        <span className="font-semibold font-mono">
                          ₹{record.maxPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* MSP & Arrivals Metadata */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {/* MSP status */}
                    {record.msp ? (
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold text-[11px] ${
                          mspDiff !== null && mspDiff >= 0
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-amber-50 text-amber-800'
                        }`}
                      >
                        <span>MSP ₹{record.msp.toLocaleString('en-IN')}</span>
                        {mspDiff !== null && mspDiff > 0 && (
                          <span className="font-bold text-emerald-700">
                            (+₹{mspDiff})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-stone-400 text-[11px]">
                        Market Auction (Non-MSP)
                      </span>
                    )}

                    {/* Arrivals */}
                    <div className="text-stone-500 text-[11px]">
                      <span className="text-stone-400">{t.arrivals}: </span>
                      <span className="font-bold font-mono text-stone-700">
                        {record.arrivalVolumeQuintals.toLocaleString('en-IN')} q
                      </span>
                    </div>
                  </div>

                  {/* Variety & Grade Tag */}
                  <div className="mt-2.5 text-[11px] text-stone-500 flex items-center gap-2">
                    <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 font-medium">
                      {record.variety}
                    </span>
                    <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 font-medium">
                      {record.grade}
                    </span>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="bg-stone-50 px-4 py-2.5 border-t border-stone-200/80 flex items-center justify-between gap-1">
                  <button
                    onClick={() => onCompareMandi(record.cropId, record.mandiId)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    title="Compare this mandi with other markets"
                  >
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.compareThisMandi}</span>
                  </button>

                  <button
                    onClick={() =>
                      onCalculateReturn(record.cropId, record.mandiId, record.modalPrice)
                    }
                    className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    title="Calculate net in-hand return"
                  >
                    <Calculator className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.calcReturn}</span>
                  </button>

                  <button
                    onClick={() =>
                      onSetAlert(record.cropId, record.mandiId, record.modalPrice)
                    }
                    className="p-1.5 rounded-lg bg-white hover:bg-stone-100 border border-stone-200 text-stone-500 hover:text-emerald-700 transition-colors"
                    title="Set price notification alert"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
