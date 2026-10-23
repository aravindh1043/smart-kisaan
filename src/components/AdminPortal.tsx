import React, { useState, useEffect } from 'react';
import {
  Database,
  Building2,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  FileSpreadsheet,
  Shield,
  Layers,
} from 'lucide-react';
import { Language, Crop, Mandi } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { getAdminOverview, submitAdminPrice } from '../services/api';

interface AdminPortalProps {
  currentLang: Language;
  allCrops: Crop[];
  allMandis: Mandi[];
  onRefreshPrices: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentLang,
  allCrops,
  allMandis,
  onRefreshPrices,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [stats, setStats] = useState<any>(null);
  const [latestPrices, setLatestPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State
  const [mandiId, setMandiId] = useState<string>('tn_madurai');
  const [cropId, setCropId] = useState<string>('tomato');
  const [modalPrice, setModalPrice] = useState<number>(2650);
  const [minPrice, setMinPrice] = useState<number>(2250);
  const [maxPrice, setMaxPrice] = useState<number>(2850);
  const [arrivals, setArrivals] = useState<number>(550);
  const [variety, setVariety] = useState<string>('Hybrid Grade A');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const loadOverview = async () => {
    setLoading(true);
    try {
      const res = await getAdminOverview();
      if (res.success) {
        setStats(res.stats);
        setLatestPrices(res.latestPrices || []);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitAdminPrice({
        mandiId,
        cropId,
        modalPrice,
        minPrice,
        maxPrice,
        arrivalVolumeQuintals: arrivals,
        variety,
      });
      if (res.success) {
        setStatusMsg('Mandi price feed successfully updated and published to farmers.');
        onRefreshPrices();
        loadOverview();
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (err) {
      setStatusMsg('Failed to update price feed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" />
              <span>APMC Market Committee Admin Desk</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
              {t.adminHeading}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
              Post verified daily APMC auction bulletins, update arrival volumes, and ensure data integrity across agricultural marketing boards.
            </p>
          </div>

          <button
            onClick={loadOverview}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Agmarknet Feeds</span>
          </button>
        </div>

        {/* Stats Metrics */}
        {stats && (
          <div className="mt-6 pt-5 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Mandis Monitored
              </span>
              <div className="text-xl font-extrabold text-stone-900 font-mono mt-0.5">
                {stats.totalMandis} APMCs
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Daily Arrivals
              </span>
              <div className="text-xl font-extrabold text-stone-900 font-mono mt-0.5">
                {stats.totalArrivalVolumeQuintals.toLocaleString('en-IN')} q
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Active Price Alerts
              </span>
              <div className="text-xl font-extrabold text-emerald-800 font-mono mt-0.5">
                {stats.activeAlerts} Subscriptions
              </div>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                Last Sync
              </span>
              <div className="text-xl font-extrabold text-stone-700 font-mono mt-0.5">
                {stats.lastSync}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post Daily Price Form Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 mb-4">
          {t.updateDailyPrice}
        </h3>

        {statusMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                APMC Mandi Yard
              </label>
              <select
                value={mandiId}
                onChange={(e) => setMandiId(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold"
              >
                {allMandis.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name.split('(')[0]} ({m.district})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Commodity
              </label>
              <select
                value={cropId}
                onChange={(e) => setCropId(e.target.value)}
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
                Modal Auction Price (₹/q)
              </label>
              <input
                type="number"
                step={10}
                value={modalPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setModalPrice(val);
                  setMinPrice(Math.round(val * 0.88));
                  setMaxPrice(Math.round(val * 1.12));
                }}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Today's Arrivals (Quintals)
              </label>
              <input
                type="number"
                value={arrivals}
                onChange={(e) => setArrivals(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Min Price (₹/q)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Max Price (₹/q)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Variety / Grade
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Desi Hybrid Grade 1"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
            >
              {submitting ? 'Submitting...' : t.submitPrice}
            </button>
          </div>
        </form>
      </div>

      {/* Latest Feed Log Table */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 mb-4">
          Latest Verified Daily Feed Entries
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-2.5 px-3">Commodity</th>
                <th className="py-2.5 px-3">Mandi Yard</th>
                <th className="py-2.5 px-3 font-mono">Modal Price</th>
                <th className="py-2.5 px-3 font-mono">Arrivals</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Source Feed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {latestPrices.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60">
                  <td className="py-2.5 px-3 font-bold text-stone-900">
                    {p.cropName}
                  </td>
                  <td className="py-2.5 px-3 text-stone-700">
                    {p.mandiName}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                    ₹{p.modalPrice.toLocaleString('en-IN')}/q
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-600">
                    {p.arrivalVolumeQuintals} q
                  </td>
                  <td className="py-2.5 px-3 font-mono text-stone-500">
                    {p.arrivalDate}
                  </td>
                  <td className="py-2.5 px-3 text-stone-500">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      Verified APMC
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
