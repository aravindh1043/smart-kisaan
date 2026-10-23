import React, { useState, useEffect } from 'react';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Truck,
  Package,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Language, Crop, Mandi, NetReturnResponse } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { calculateNetReturn } from '../services/api';

interface NetReturnCalculatorProps {
  currentLang: Language;
  allCrops: Crop[];
  allMandis: Mandi[];
  initialCropId?: string;
  initialMandiId?: string;
  initialPrice?: number;
  userLat?: number;
  userLng?: number;
}

export const NetReturnCalculator: React.FC<NetReturnCalculatorProps> = ({
  currentLang,
  allCrops,
  allMandis,
  initialCropId = 'tomato',
  initialMandiId = 'tn_madurai',
  initialPrice = 2600,
  userLat = 9.9252,
  userLng = 78.1198,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [cropId, setCropId] = useState<string>(initialCropId);
  const [quantity, setQuantity] = useState<number>(30); // 30 quintals = 60 bags
  const [villageTraderPrice, setVillageTraderPrice] = useState<number>(
    Math.round(initialPrice * 0.8)
  );
  const [localMandiId, setLocalMandiId] = useState<string>(initialMandiId);
  const [distantMandiId, setDistantMandiId] = useState<string>('tn_chennai_koyambedu');
  const [transportRate, setTransportRate] = useState<number>(32);
  const [hamaliRate, setHamaliRate] = useState<number>(35);
  const [bagRate, setBagRate] = useState<number>(25);

  const [result, setResult] = useState<NetReturnResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const runCalculation = async () => {
    setLoading(true);
    try {
      const res = await calculateNetReturn({
        cropId,
        quantityQuintals: quantity,
        villageTraderPrice,
        localMandiId,
        distantMandiId,
        userLat,
        userLng,
        transportRatePerKm: transportRate,
        hamaliPerQuintal: hamaliRate,
        gunnyBagCostPerQuintal: bagRate,
      });
      if (res.success) {
        setResult(res);
      }
    } catch (err) {
      console.error('Calculator failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCalculation();
  }, [
    cropId,
    quantity,
    villageTraderPrice,
    localMandiId,
    distantMandiId,
    transportRate,
    hamaliRate,
    bagRate,
  ]);

  const selectedCrop = allCrops.find((c) => c.id === cropId);

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4" />
          <span>{t.navCalculator}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
          {t.calcHeading}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
          {t.calcSubheading}
        </p>

        {/* Input Parameters Grid */}
        <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Crop Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Crop / Commodity
            </label>
            <select
              value={cropId}
              onChange={(e) => {
                setCropId(e.target.value);
                // Adjust default farmgate price
                if (e.target.value === 'paddy') setVillageTraderPrice(2100);
                if (e.target.value === 'onion') setVillageTraderPrice(1850);
                if (e.target.value === 'wheat') setVillageTraderPrice(2200);
                if (e.target.value === 'cotton') setVillageTraderPrice(6600);
              }}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-800"
            >
              {allCrops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Quantity */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Harvest Volume
              </label>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {quantity} q ({quantity * 2} Bags)
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={150}
              step={5}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
              <span>5 q</span>
              <span>50 q (Tractor)</span>
              <span>150 q (Truck)</span>
            </div>
          </div>

          {/* 3. Farmgate Middleman Price */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {t.farmgateOffer}
              </label>
              <span className="text-xs font-bold text-stone-900 font-mono">
                ₹{villageTraderPrice}
              </span>
            </div>
            <input
              type="number"
              step={50}
              value={villageTraderPrice}
              onChange={(e) => setVillageTraderPrice(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono font-bold text-stone-900"
            />
          </div>

          {/* 4. Local Mandi Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Local APMC Mandi
            </label>
            <select
              value={localMandiId}
              onChange={(e) => setLocalMandiId(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-800"
            >
              {allMandis.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.split('(')[0]} ({m.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Logistics Sliders */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-6 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Transport (₹/km):</span>
            <input
              type="number"
              value={transportRate}
              onChange={(e) => setTransportRate(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-center font-mono font-bold"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">Hamali / Loading (₹/q):</span>
            <input
              type="number"
              value={hamaliRate}
              onChange={(e) => setHamaliRate(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-center font-mono font-bold"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">Gunny Bagging (₹/q):</span>
            <input
              type="number"
              value={bagRate}
              onChange={(e) => setBagRate(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-center font-mono font-bold"
            />
          </div>
        </div>
      </div>

      {/* Decision Insight Banner */}
      {result && (
        <div className="bg-emerald-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                Farmer Decision Insight
              </div>
              <h3 className="text-lg font-bold text-white font-display mt-0.5">
                Optimal Channel: {result.winnerChannel.title}
              </h3>
              <p className="mt-1 text-sm text-stone-200 leading-relaxed font-normal">
                {result.keyInsight}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Three-Channel Comparison Cards */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.channels.map((chan) => {
            const isWinner = chan.id === result.winnerChannel.id;

            return (
              <div
                key={chan.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isWinner
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-stone-200'
                }`}
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600 uppercase tracking-wider">
                      {chan.subtitle}
                    </span>
                    {isWinner && (
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Best Choice
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mt-2 leading-snug">
                    {chan.title}
                  </h3>

                  {/* Net Realization Box */}
                  <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      {t.netInPocket}
                    </span>
                    <div className="mt-1 text-3xl font-extrabold text-stone-950 font-mono tracking-tight">
                      ₹{chan.netReturn.toLocaleString('en-IN')}
                    </div>
                    <div className="mt-1 text-xs font-semibold text-emerald-800 font-mono">
                      ₹{chan.netPerQuintal.toLocaleString('en-IN')} / quintal net
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100 text-stone-600">
                      <span>Rate Offered / Modal Price</span>
                      <span className="font-bold font-mono text-stone-900">
                        ₹{chan.pricePerQuintal.toLocaleString('en-IN')} / q
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-stone-100 text-stone-600">
                      <span>{t.grossRevenue}</span>
                      <span className="font-semibold font-mono text-stone-800">
                        ₹{chan.grossRevenue.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {chan.costs.total > 0 ? (
                      <>
                        <div className="flex justify-between py-1 border-b border-stone-100 text-rose-700">
                          <span>Transport Cost</span>
                          <span className="font-mono">
                            - ₹{chan.costs.transport.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-100 text-rose-700">
                          <span>Hamali + Bags</span>
                          <span className="font-mono">
                            - ₹{(chan.costs.hamali + chan.costs.packaging).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-100 text-rose-700">
                          <span>APMC Mandi Fee</span>
                          <span className="font-mono">
                            - ₹{chan.costs.apmcCess.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1 font-bold text-rose-700">
                          <span>{t.totalExpenses}</span>
                          <span className="font-mono">
                            - ₹{chan.costs.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="py-2 text-center text-emerald-700 font-semibold bg-emerald-50 rounded-lg">
                        Zero expenses (Buyer collects directly from farm)
                      </div>
                    )}
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="mt-5 pt-3.5 border-t border-stone-100 text-[11px] space-y-1">
                  <div className="text-emerald-700">
                    <strong>Advantage:</strong> {chan.pros}
                  </div>
                  <div className="text-stone-500">
                    <strong>Trade-off:</strong> {chan.cons}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
