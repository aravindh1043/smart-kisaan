import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Building,
  CheckCircle,
  Navigation,
  Compass,
  ArrowRight,
  TrendingUp,
  Warehouse,
  ExternalLink,
} from 'lucide-react';
import { Language, Mandi } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { getNearbyMandis } from '../services/api';

interface NearbyMarketsProps {
  currentLang: Language;
  userLat?: number;
  userLng?: number;
  userDistrict?: string;
  onSelectMandiForPrices: (mandiId: string) => void;
  onSelectMandiForCalc: (mandiId: string) => void;
}

export const NearbyMarkets: React.FC<NearbyMarketsProps> = ({
  currentLang,
  userLat = 9.9252,
  userLng = 78.1198,
  userDistrict = 'Madurai',
  onSelectMandiForPrices,
  onSelectMandiForCalc,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [mandis, setMandis] = useState<Mandi[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: userLat,
    lng: userLng,
  });
  const [gpsActive, setGpsActive] = useState<boolean>(false);

  const fetchNearby = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const data = await getNearbyMandis(lat, lng, userDistrict);
      setMandis(data);
    } catch (err) {
      console.error('Failed to load nearby mandis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby(currentCoords.lat, currentCoords.lng);
  }, [currentCoords, userDistrict]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCurrentCoords({ lat: latitude, lng: longitude });
        setGpsActive(true);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Fallback gracefully to default coordinates
        setGpsActive(false);
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Geolocation Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>{t.navNearby}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
              {t.nearbyHeading}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
              {t.nearbySubheading}
            </p>
          </div>

          <button
            onClick={handleDetectLocation}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              gpsActive
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            <Navigation className={`w-4 h-4 ${gpsActive ? 'text-emerald-700' : ''}`} />
            <span>{gpsActive ? 'GPS Location Active' : t.useMyLocation}</span>
          </button>
        </div>
      </div>

      {/* Mandis List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mandis.map((mandi) => (
          <div
            key={mandi.id}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Top Row: Distance and Market Type */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {mandi.distanceKm || 0} km away
                </span>

                <span className="text-[11px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  {mandi.marketType}
                </span>
              </div>

              {/* Title & Location */}
              <h3 className="text-lg font-bold text-stone-900 mt-2.5 leading-snug">
                {mandi.name}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {mandi.district}, {mandi.state} • APMC Cess: {mandi.apmcCessPercent}%
              </p>

              {/* Timings */}
              <div className="mt-4 space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    <strong className="text-stone-700">{t.operatingHours}:</strong>{' '}
                    {mandi.auctionHours} ({mandi.operatingDays})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    <strong className="text-stone-700">{t.secretaryContact}:</strong>{' '}
                    <span className="font-mono font-semibold text-emerald-800">
                      {mandi.contactDesk}
                    </span>{' '}
                    ({mandi.secretary})
                  </span>
                </div>
              </div>

              {/* Amenities / Facilities */}
              <div className="mt-3.5">
                <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  {t.facilities}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {mandi.facilities.map((fac, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>{fac}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center gap-2">
              <button
                onClick={() => onSelectMandiForPrices(mandi.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>View Today's Prices</span>
              </button>

              <button
                onClick={() => onSelectMandiForCalc(mandi.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span>{t.calculateReturnFromHere}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
