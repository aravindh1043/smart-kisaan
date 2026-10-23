import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Calendar,
  TrendingUp,
  AlertCircle,
  Info,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { Language, Crop, Mandi, TrendResponse } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { getPriceTrends } from '../services/api';

interface PriceTrendsProps {
  currentLang: Language;
  allCrops: Crop[];
  allMandis: Mandi[];
  initialCropId?: string;
  initialMandiId?: string;
}

export const PriceTrends: React.FC<PriceTrendsProps> = ({
  currentLang,
  allCrops,
  allMandis,
  initialCropId = 'tomato',
  initialMandiId = 'tn_madurai',
}) => {
  const t = TRANSLATIONS[currentLang];

  const [selectedCropId, setSelectedCropId] = useState<string>(initialCropId);
  const [selectedMandiId, setSelectedMandiId] = useState<string>(initialMandiId);
  const [timeframeDays, setTimeframeDays] = useState<number>(30);
  const [trendData, setTrendData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const res = await getPriceTrends(selectedCropId, selectedMandiId, timeframeDays);
      if (res.success) {
        setTrendData(res);
      }
    } catch (err) {
      console.error('Failed to load price trends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [selectedCropId, selectedMandiId, timeframeDays]);

  const selectedCrop = allCrops.find((c) => c.id === selectedCropId);
  const selectedMandi = allMandis.find((m) => m.id === selectedMandiId);

  // SVG Chart rendering calculation
  const chartPoints = trendData?.data || [];
  const minVal = chartPoints.length > 0 ? Math.min(...chartPoints.map((d) => d.minPrice)) : 0;
  const maxVal = chartPoints.length > 0 ? Math.max(...chartPoints.map((d) => d.maxPrice)) : 1000;
  const yPadding = (maxVal - minVal) * 0.15 || 200;
  const yMin = Math.max(0, Math.floor((minVal - yPadding) / 100) * 100);
  const yMax = Math.ceil((maxVal + yPadding) / 100) * 100;
  const yRange = yMax - yMin || 1;

  const width = 800;
  const height = 300;
  const paddingX = 50;
  const paddingY = 30;

  const getX = (idx: number) => {
    if (chartPoints.length <= 1) return paddingX;
    return paddingX + (idx / (chartPoints.length - 1)) * (width - 2 * paddingX);
  };

  const getY = (val: number) => {
    return height - paddingY - ((val - yMin) / yRange) * (height - 2 * paddingY);
  };

  const modalPath = chartPoints
    .map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(d.modalPrice)}`)
    .join(' ');

  // Area corridor path (min to max)
  const areaPath =
    chartPoints.length > 0
      ? chartPoints
          .map((d, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(d.maxPrice)}`)
          .join(' ') +
        chartPoints
          .slice()
          .reverse()
          .map((d, idx) => `L ${getX(chartPoints.length - 1 - idx)} ${getY(d.minPrice)}`)
          .join(' ') +
        ' Z'
      : '';

  const hoveredPoint = hoverIndex !== null ? chartPoints[hoverIndex] : null;

  return (
    <div className="space-y-6">
      {/* Title & Selectors */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
              <LineChart className="w-4 h-4" />
              <span>{t.navTrends}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
              {t.trendsHeading}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
              {t.trendsSubheading}
            </p>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setTimeframeDays(7)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframeDays === 7 ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
              }`}
            >
              {t.timeframe7d}
            </button>
            <button
              onClick={() => setTimeframeDays(30)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframeDays === 30 ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
              }`}
            >
              {t.timeframe30d}
            </button>
            <button
              onClick={() => setTimeframeDays(90)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframeDays === 90 ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
              }`}
            >
              {t.timeframe90d}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Select Commodity
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold"
            >
              {allCrops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Select APMC Mandi
            </label>
            <select
              value={selectedMandiId}
              onChange={(e) => setSelectedMandiId(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold"
            >
              {allMandis.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name.split('(')[0]} ({m.district}, {m.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      {trendData?.summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {t.highestPrice}
            </span>
            <div className="text-2xl font-extrabold text-stone-900 font-mono mt-1">
              ₹{trendData.summary.highestModal.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-stone-400">Peak modal price</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {t.lowestPrice}
            </span>
            <div className="text-2xl font-extrabold text-stone-900 font-mono mt-1">
              ₹{trendData.summary.lowestModal.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-stone-400">Trough modal price</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {t.averagePrice}
            </span>
            <div className="text-2xl font-extrabold text-stone-900 font-mono mt-1">
              ₹{trendData.summary.averageModal.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-stone-400">{timeframeDays}-day average</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {t.mspBenchmark}
            </span>
            <div className="text-2xl font-extrabold text-emerald-800 font-mono mt-1">
              {trendData.msp ? `₹${trendData.msp.toLocaleString('en-IN')}` : 'N/A'}
            </div>
            <span className="text-[11px] text-stone-400">Official Government MSP</span>
          </div>
        </div>
      )}

      {/* SVG Interactive Chart Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 text-xs font-semibold text-stone-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span>Modal Price Curve (₹/q)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300"></span>
              <span>Daily Min - Max Range</span>
            </div>
            {trendData?.msp && (
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-600"></span>
                <span>MSP Reference Line</span>
              </div>
            )}
          </div>

          {hoveredPoint && (
            <div className="bg-stone-900 text-white text-xs px-2.5 py-1 rounded-lg font-mono">
              {hoveredPoint.date}: ₹{hoveredPoint.modalPrice}/q (Min ₹{hoveredPoint.minPrice} - Max ₹{hoveredPoint.maxPrice})
            </div>
          )}
        </div>

        {/* Responsive SVG Container */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[650px] h-[280px] overflow-visible"
          >
            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const val = Math.round(yMin + pct * yRange);
              const y = getY(val);
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={width - paddingX}
                    y2={y}
                    stroke="#f0f0ee"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] font-mono fill-stone-400"
                  >
                    ₹{val}
                  </text>
                </g>
              );
            })}

            {/* Shaded Corridor between Min & Max */}
            {areaPath && (
              <path
                d={areaPath}
                fill="#ecfdf5"
                stroke="#a7f3d0"
                strokeWidth="1"
                className="opacity-70"
              />
            )}

            {/* MSP Baseline Line (if applicable) */}
            {trendData?.msp && trendData.msp >= yMin && trendData.msp <= yMax && (
              <g>
                <line
                  x1={paddingX}
                  y1={getY(trendData.msp)}
                  x2={width - paddingX}
                  y2={getY(trendData.msp)}
                  stroke="#d97706"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text
                  x={width - paddingX}
                  y={getY(trendData.msp) - 6}
                  textAnchor="end"
                  className="text-[10px] font-bold fill-amber-700"
                >
                  Govt MSP: ₹{trendData.msp}
                </text>
              </g>
            )}

            {/* Modal Price Line */}
            {modalPath && (
              <path
                d={modalPath}
                fill="none"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data Points */}
            {chartPoints.map((point, idx) => {
              const cx = getX(idx);
              const cy = getY(point.modalPrice);
              const isHovered = hoverIndex === idx;

              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoverIndex(idx)}
                  onMouseLeave={() => setHoverIndex(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 6 : point.isInterpolated ? 2.5 : 3.5}
                    fill={point.isInterpolated ? '#94a3b8' : '#059669'}
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Market Advisory Insight Box */}
        <div className="mt-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
          <div className="text-xs text-emerald-950">
            <span className="font-bold">{t.seasonalityNote}:</span>{' '}
            {trendData?.summary.trendNote} Prices for {selectedCrop?.nameEn} are expected to remain firm over the coming 2 weeks due to steady retail procurement. If you have clean, graded produce and proper on-farm storage, staggered liquidation can yield higher realization.
          </div>
        </div>
      </div>
    </div>
  );
};
