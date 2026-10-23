import React from 'react';
import {
  TrendingUp,
  Scale,
  Calculator,
  Sparkles,
  Info,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { Language, MarketPriceRecord } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface HeroSectionProps {
  currentLang: Language;
  onSelectTab: (tab: string) => void;
  topPrices: MarketPriceRecord[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onSelectTab,
  topPrices,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-stone-900 to-stone-900 text-white pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
      {/* Subtle organic pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {t.sourceBadge}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-800/80 text-stone-300 border border-stone-700">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            350+ APMC Mandi Feeds Tracked
          </span>
        </div>

        {/* Main Headings */}
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
            {t.heroHeading}
          </h1>
          <p className="mt-3 text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
            {t.heroSubheading}
          </p>
        </div>

        {/* Quick Action Decision Tools */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => onSelectTab('compare')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Scale className="w-4 h-4" />
            <span>{t.navCompare}</span>
          </button>

          <button
            onClick={() => onSelectTab('calculator')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-semibold text-sm border border-stone-700 transition-all hover:border-emerald-500/50"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>{t.navCalculator}</span>
          </button>

          <button
            onClick={() => onSelectTab('ai')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 font-semibold text-sm border border-emerald-700/50 transition-all"
          >
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span>{t.navAiAssistant}</span>
          </button>

          <button
            onClick={() => onSelectTab('nearby')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 font-semibold text-sm border border-stone-700 transition-all"
          >
            <span>{t.navNearby}</span>
          </button>
        </div>

        {/* Live Mandi Ticker Bar */}
        <div className="mt-8 pt-6 border-t border-stone-800/80">
          <div className="flex items-center justify-between mb-3 text-xs text-stone-400 font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Reported APMC Rates (₹/Quintal)
            </span>
            <span className="text-stone-400 font-mono">
              {t.lastUpdated}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {topPrices.slice(0, 6).map((price) => (
              <div
                key={price.id}
                onClick={() => onSelectTab('prices')}
                className="bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 hover:border-emerald-500/40 rounded-xl p-2.5 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-200 truncate">
                    {price.cropName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1 rounded flex items-center gap-0.5 ${
                      price.trend === 'UP'
                        ? 'text-emerald-400 bg-emerald-950/60'
                        : price.trend === 'DOWN'
                        ? 'text-rose-400 bg-rose-950/60'
                        : 'text-stone-400 bg-stone-900'
                    }`}
                  >
                    {price.trend === 'UP' ? '+' : ''}
                    {price.trendPercent}%
                  </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-extrabold text-white font-mono group-hover:text-emerald-400 transition-colors">
                    ₹{price.modalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-stone-400">/q</span>
                </div>
                <div className="text-[10px] text-stone-400 truncate mt-0.5">
                  {price.mandiName.split('(')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legal Transparency & Integrity Disclaimer */}
        <div className="mt-5 flex items-start gap-2 text-stone-400 text-xs bg-stone-950/40 p-3 rounded-lg border border-stone-800">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-stone-300">Data Integrity Notice:</strong>{' '}
            {t.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};
