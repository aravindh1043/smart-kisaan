import React, { useState } from 'react';
import {
  Sprout,
  Languages,
  User,
  ShieldCheck,
  TrendingUp,
  Scale,
  MapPin,
  Calculator,
  LineChart,
  Bell,
  Sparkles,
  Menu,
  X,
  Database,
} from 'lucide-react';
import { Language, FarmerProfile } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface NavbarProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  farmer: FarmerProfile | null;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  activeTab,
  onSelectTab,
  farmer,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];

  const languagesList: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  const navItems = [
    { id: 'prices', label: t.navPrices, icon: TrendingUp },
    { id: 'compare', label: t.navCompare, icon: Scale },
    { id: 'nearby', label: t.navNearby, icon: MapPin },
    { id: 'calculator', label: t.navCalculator, icon: Calculator },
    { id: 'trends', label: t.navTrends, icon: LineChart },
    { id: 'alerts', label: t.navAlerts, icon: Bell },
    { id: 'ai', label: t.navAiAssistant, icon: Sparkles, highlight: true },
    { id: 'admin', label: t.navAdmin, icon: Database },
  ];

  const currentLangMeta = languagesList.find((l) => l.code === currentLang);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner: Verification & Source Assurance */}
      <div className="bg-emerald-800 text-emerald-100 text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.sourceBadge}</span>
            <span className="hidden md:inline text-emerald-400">•</span>
            <span className="hidden md:inline text-emerald-200">
              {t.tagline}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {farmer ? (
              <div className="flex items-center gap-1.5 text-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>
                  {farmer.name} ({farmer.district || farmer.state})
                </span>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hover:underline text-emerald-300 hover:text-white"
              >
                {t.login}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Name */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab('prices')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-stone-900 font-display">
                  Smart Kisaan
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  APMC
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium -mt-0.5 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs border border-emerald-200/60'
                      : item.highlight
                      ? 'text-emerald-700 hover:bg-emerald-50/60 font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-emerald-700'
                        : item.highlight
                        ? 'text-emerald-600'
                        : 'text-stone-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Language Selector & Farmer Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-500 bg-white text-stone-700 hover:text-emerald-800 text-xs sm:text-sm font-medium shadow-2xs transition-colors"
                title="Change Language"
              >
                <Languages className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">{currentLangMeta?.native}</span>
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Select Language / भाषा चुनें
                  </div>
                  {languagesList.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => onSelectLang(lang.code)}
                      className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        currentLang === lang.code
                          ? 'bg-emerald-50/80 text-emerald-900 font-bold'
                          : 'text-stone-700'
                      }`}
                    >
                      <span className="text-base">{lang.native}</span>
                      <span className="text-xs text-stone-400 font-mono">
                        {lang.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Farmer Profile Button */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">
                {farmer ? farmer.name.split(' ')[0] : t.login}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-emerald-700' : 'text-stone-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
