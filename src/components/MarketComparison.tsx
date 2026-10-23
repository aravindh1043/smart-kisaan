import React, { useState, useEffect } from 'react';
import {
  Scale,
  TrendingUp,
  MapPin,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  RefreshCw,
} from 'lucide-react';
import { Language, Crop, Mandi, ComparisonResponse } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { compareMandis } from '../services/api';

interface MarketComparisonProps {
  currentLang: Language;
  allCrops: Crop[];
  allMandis: Mandi[];
  initialCropId?: string;
  initialMandiId?: string;
  userLat?: number;
  userLng?: number;
}

export const MarketComparison: React.FC<MarketComparisonProps> = ({
  currentLang,
  allCrops,
  allMandis,
  initialCropId = 'tomato',
  initialMandiId,
  userLat = 9.9252,
  userLng = 78.1198,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId);
  const [selectedMandiIds, setSelectedMandiIds] = useState<string[]>([
    initialMandiId || 'tn_madurai',
    'tn_dindigul',
    'tn_chennai_koyambedu',
  ]);
  const [quantity, setQuantity] = useState<number>(30); // 30 quintals (~60 bags)
  const [transportRate, setTransportRate] = useState<number>(32); // ₹32/km

  const [comparisonData, setComparisonData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialCropId) setSelectedCropId(initialCropId);
    if (initialMandiId && !selectedMandiIds.includes(initialMandiId)) {
      setSelectedMandiIds((prev) => [initialMandiId, ...prev.slice(0, 2)]);
    }
  }, [initialCropId, initialMandiId]);

  const loadComparison = async () => {
    if (selectedMandiIds.length === 0) return;
    setLoading(true);
    try {
      const res = await compareMandis({
        cropId: selectedCropId,
        mandiIds: selectedMandiIds,
        userLat,
        userLng,
        quantityQuintals: quantity,
        transportRatePerKm: transportRate,
      });
      if (res.success) {
        setComparisonData(res);
      }
    } catch (err) {
      console.error('Failed to compare mandis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComparison();
  }, [selectedCropId, selectedMandiIds, quantity, transportRate]);

  const toggleMandi = (mandiId: string) => {
    if (selectedMandiIds.includes(mandiId)) {
      if (selectedMandiIds.length > 1) {
        setSelectedMandiIds(selectedMandiIds.filter((id) => id !== mandiId));
      }
    } else {
      if (selectedMandiIds.length < 4) {
        setSelectedMandiIds([...selectedMandiIds, mandiId]);
      } else {
        setSelectedMandiIds([...selectedMandiIds.slice(1), mandiId]);
      }
    }
  };

  const currentCrop = allCrops.find((c) => c.id === selectedCropId);

  return (
    <div className="space-y-6">
      {/* Title & Explainer */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4" />
              <span>{t.navCompare}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
              {t.compareHeading}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
              {t.compareSubheading}
            </p>
          </div>
          <button
            onClick={loadComparison}
            disabled={loading}
            className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
            title="Refresh comparison"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Controls: Commodity, Quantity, Transport */}
        <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Commodity Select */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {t.selectCropToCompare}
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-800 focus:border-emerald-500 outline-hidden"
            >
              {allCrops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {t.produceQuantity}
              </label>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {quantity} Quintals ({quantity * 2} Bags)
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={200}
              step={5}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
              <span>5 q (Pickup)</span>
              <span>50 q (Tractor)</span>
              <span>200 q (Full Truck)</span>
            </div>
          </div>

          {/* Transport Rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {t.transportRate}
              </label>
              <span className="text-xs font-bold text-stone-700 font-mono">
                ₹{transportRate} / km
              </span>
            </div>
            <input
              type="range"
              min={15}
              max={60}
              step={1}
              value={transportRate}
              onChange={(e) => setTransportRate(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
              <span>₹15 (Tempo)</span>
              <span>₹32 (Tata 407)</span>
              <span>₹55 (Heavy Truck)</span>
            </div>
          </div>
        </div>

        {/* Mandi Selection Pills */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            Select Mandis to Compare (Pick 2 to 4)
          </label>
          <div className="flex flex-wrap gap-2">
            {allMandis.map((mandi) => {
              const isSelected = selectedMandiIds.includes(mandi.id);
              return (
                <button
                  key={mandi.id}
                  onClick={() => toggleMandi(mandi.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-xs font-bold'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{mandi.name.split('(')[0]}</span>
                  <span className="opacity-75 text-[10px]">({mandi.district})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Smart Decision Recommendation Callout */}
      {comparisonData && (
        <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-stone-950 font-bold shrink-0 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                {t.recommendation}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mt-0.5 text-white font-display">
                Sell at {comparisonData.bestOption.mandi.name}
              </h3>
              <p className="mt-1 text-sm text-stone-200 leading-relaxed font-normal">
                {comparisonData.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Cards */}
      {comparisonData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisonData.comparisons.map((item, idx) => {
            const isWinner = item.mandi.id === comparisonData.bestOption.mandi.id;

            return (
              <div
                key={item.mandi.id}
                className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs relative ${
                  isWinner
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-stone-200'
                }`}
              >
                {/* Winner Ribbon */}
                {isWinner && (
                  <div className="bg-emerald-600 text-white text-[11px] font-bold py-1 px-3 text-center uppercase tracking-wider flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Highest Net Profit Option</span>
                  </div>
                )}

                <div className="p-5">
                  {/* Mandi Title */}
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600 uppercase tracking-wider">
                      {item.mandi.marketType}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1.5 leading-snug">
                      {item.mandi.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-stone-700">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {item.distanceKm} km away
                      </span>
                      <span>•</span>
                      <span>{item.mandi.district}, {item.mandi.state}</span>
                    </div>
                  </div>

                  {/* Net Take-Home In-Hand Highlighting */}
                  <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      {t.netRealization} ({quantity} q)
                    </div>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-stone-950 font-mono tracking-tight">
                        ₹{item.netReturn.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-emerald-800 font-semibold font-mono">
                      ₹{item.netReturnPerQuintal.toLocaleString('en-IN')} / quintal net in-hand
                    </div>
                  </div>

                  {/* Cost Breakdown Accordion / List */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100 text-stone-600">
                      <span>Reported Modal Price</span>
                      <span className="font-bold text-stone-900 font-mono">
                        ₹{item.modalPrice.toLocaleString('en-IN')} / q
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-100 text-stone-600">
                      <span>Gross Crop Value</span>
                      <span className="font-semibold text-stone-800 font-mono">
                        ₹{item.grossValue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-100 text-rose-700">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        {t.estimatedTransport} ({item.distanceKm} km)
                      </span>
                      <span className="font-semibold font-mono">
                        - ₹{item.transportCost.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-100 text-rose-700">
                      <span>{t.hamaliCharges}</span>
                      <span className="font-semibold font-mono">
                        - ₹{item.loadingHamaliCost.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-100 text-rose-700">
                      <span>{t.mandiCess} ({item.mandi.apmcCessPercent}%)</span>
                      <span className="font-semibold font-mono">
                        - ₹{item.mandiCess.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between pt-1 font-bold text-stone-900">
                      <span>{t.totalExpenses}</span>
                      <span className="font-mono text-rose-700">
                        ₹{item.totalDeductions.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Facilities Pill footer */}
                <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
                  <span>Auction: {item.mandi.auctionHours.split('-')[0]}</span>
                  <span className="font-mono text-stone-600 font-semibold">
                    {item.mandi.contactDesk}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
