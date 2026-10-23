import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  CheckCircle2,
  Phone,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Language, Crop, Mandi, PriceAlert } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { getAlerts, createAlert, deleteAlert } from '../services/api';

interface PriceAlertsProps {
  currentLang: Language;
  allCrops: Crop[];
  allMandis: Mandi[];
  farmerPhone?: string;
  initialCropId?: string;
  initialMandiId?: string;
  initialTargetPrice?: number;
}

export const PriceAlerts: React.FC<PriceAlertsProps> = ({
  currentLang,
  allCrops,
  allMandis,
  farmerPhone = '9876543210',
  initialCropId = 'tomato',
  initialMandiId = 'tn_madurai',
  initialTargetPrice = 2800,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [cropId, setCropId] = useState<string>(initialCropId);
  const [mandiId, setMandiId] = useState<string>(initialMandiId);
  const [targetPrice, setTargetPrice] = useState<number>(initialTargetPrice);
  const [condition, setCondition] = useState<'GREATER_THAN_EQUAL' | 'LESS_THAN_EQUAL'>('GREATER_THAN_EQUAL');
  const [channel, setChannel] = useState<'SMS' | 'WHATSAPP'>('SMS');

  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts(farmerPhone);
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [farmerPhone]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPrice || targetPrice <= 0) return;
    setLoading(true);
    try {
      const res = await createAlert({
        farmerPhone,
        cropId,
        mandiId,
        targetPrice,
        condition,
        channel,
      });
      if (res) {
        setAlerts([res, ...alerts]);
        setSuccessMsg(`Price alert active for ${res.cropName} at ₹${res.targetPrice}/q.`);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.error('Failed to create alert:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAlert(id);
      setAlerts(alerts.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete alert:', err);
    }
  };

  const handleSimulateTrigger = (alertItem: PriceAlert) => {
    setSimulatedNotice(
      `📲 [Smart Kisaan ${alertItem.channel} Alert] Good morning! Reported auction price for ${alertItem.cropName} at ${alertItem.mandiName} has reached ₹${alertItem.targetPrice + 120}/quintal (crossing your target of ₹${alertItem.targetPrice}/q). Early morning arrivals: 540 quintals.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
          <Bell className="w-4 h-4" />
          <span>{t.navAlerts}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
          {t.alertsHeading}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
          {t.alertsSubheading}
        </p>

        {/* Create Alert Form */}
        <form onSubmit={handleCreate} className="mt-6 pt-5 border-t border-stone-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                Mandi
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
                {t.targetPrice}
              </label>
              <input
                type="number"
                step={50}
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                placeholder="2800"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.notifyVia}
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('SMS')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    channel === 'SMS'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>SMS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('WHATSAPP')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                    channel === 'WHATSAPP'
                      ? 'bg-emerald-700 text-white border-emerald-700'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Alerts dispatched directly to registered number: <strong className="font-mono text-stone-800">+91 {farmerPhone}</strong>
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Setting Alert...' : t.createNewAlert}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Simulated SMS/WhatsApp Preview Banner */}
      {simulatedNotice && (
        <div className="bg-stone-900 text-stone-100 p-4 rounded-2xl border border-stone-800 shadow-lg relative">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">📱</span>
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  Live Dispatch Simulation
                </span>
                <p className="text-xs text-stone-200 mt-0.5 font-mono leading-relaxed">
                  {simulatedNotice}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSimulatedNotice(null)}
              className="text-stone-400 hover:text-white text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Active Subscriptions List */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-4">
          {t.activeAlerts} ({alerts.length})
        </h3>

        {alerts.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-400">
            {t.noAlertsYet}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {alerts.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {item.cropName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Target: ₹{item.targetPrice.toLocaleString('en-IN')}/q
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 font-mono">
                      {item.channel}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{item.mandiName}</span>
                    <span>•</span>
                    <span>Configured on {item.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleSimulateTrigger(item)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 rounded-lg text-xs font-semibold border border-stone-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test Notification</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
