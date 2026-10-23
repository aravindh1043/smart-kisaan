import React, { useState } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  Check,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Language, FarmerProfile, Crop } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { sendOtp, verifyOtp } from '../services/api';

interface FarmerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onLoginSuccess: (farmer: FarmerProfile) => void;
  allCrops: Crop[];
  currentFarmer: FarmerProfile | null;
}

export const FarmerAuthModal: React.FC<FarmerAuthModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onLoginSuccess,
  allCrops,
  currentFarmer,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [step, setStep] = useState<'PHONE' | 'OTP' | 'PROFILE'>('PHONE');
  const [phone, setPhone] = useState(currentFarmer?.phone || '9876543210');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState(currentFarmer?.name || '');
  const [state, setState] = useState(currentFarmer?.state || 'Tamil Nadu');
  const [district, setDistrict] = useState(currentFarmer?.district || 'Madurai');
  const [village, setVillage] = useState(currentFarmer?.village || 'Vadipatti');
  const [selectedCrops, setSelectedCrops] = useState<string[]>(
    currentFarmer?.selectedCrops || ['tomato', 'paddy', 'onion']
  );

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [debugOtpHint, setDebugOtpHint] = useState('123456');

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await sendOtp(phone);
      if (res.success) {
        if (res.debugHint) setDebugOtpHint(res.debugHint);
        setStep('OTP');
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg('Unable to dispatch OTP. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setErrorMsg('Please enter the verification OTP.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await verifyOtp({
        phone,
        otp,
        name: name || 'Murugan Chinnappan',
        state,
        district,
        village,
        crops: selectedCrops,
        language: currentLang,
      });

      if (res.success && res.farmer) {
        onLoginSuccess(res.farmer);
        setStep('PROFILE');
      } else {
        setErrorMsg(res.message || 'Invalid OTP code.');
      }
    } catch (err) {
      setErrorMsg('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtp({
        phone,
        otp: '123456',
        name,
        state,
        district,
        village,
        crops: selectedCrops,
        language: currentLang,
      });
      if (res.farmer) {
        onLoginSuccess(res.farmer);
        onClose();
      }
    } catch (err) {
      setErrorMsg('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const toggleCrop = (cropId: string) => {
    if (selectedCrops.includes(cropId)) {
      setSelectedCrops(selectedCrops.filter((id) => id !== cropId));
    } else {
      setSelectedCrops([...selectedCrops, cropId]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-display">
                {step === 'PROFILE' ? t.profile : t.login}
              </h3>
              <p className="text-xs text-emerald-300">
                {step === 'PHONE'
                  ? 'Sign in with your mobile number'
                  : step === 'OTP'
                  ? 'Verify mobile number'
                  : 'Customize your district & crop prices'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Mobile Phone */}
          {step === 'PHONE' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.mobileNumber}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500 font-mono text-sm font-semibold">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-2.5 bg-stone-50 border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-stone-900 font-mono text-base font-medium outline-hidden transition-all"
                    required
                  />
                </div>
                <p className="mt-1.5 text-xs text-stone-500">
                  We will send a 6-digit One-Time Password (OTP) to this mobile number.
                </p>
              </div>

              {/* Demo Hint Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-xs text-emerald-800">
                  <span className="font-bold">Test Sandbox Ready:</span> You can use sample number{' '}
                  <span className="font-mono font-semibold">9876543210</span> (OTP is{' '}
                  <span className="font-mono font-bold">123456</span>) to quickly test as a Tamil Nadu farmer.
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Sending SMS...' : t.sendOtp}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.enter6DigitOtp}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] py-3 bg-stone-50 border border-stone-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-stone-900 font-mono text-xl font-bold outline-hidden transition-all"
                  autoFocus
                  required
                />
                <div className="mt-2 flex items-center justify-between text-xs text-stone-500">
                  <span>{t.otpSentTo} +91 {phone}</span>
                  <button
                    type="button"
                    onClick={() => setStep('PHONE')}
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    Change Phone
                  </button>
                </div>
              </div>

              {/* Dev Hint */}
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                <span>{debugOtpHint}</span>
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="font-bold text-emerald-800 underline ml-2"
                >
                  Auto-fill 123456
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  className="w-1/3 py-2.5 border border-stone-300 text-stone-700 font-semibold text-sm rounded-xl hover:bg-stone-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Verifying...' : t.verifyOtp}</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Customize Farm Profile */}
          {step === 'PROFILE' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.farmerName}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Murugan Chinnappan"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t.selectState}
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium"
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t.selectDistrict}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Madurai"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.villageName}
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Vadipatti"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  {t.preferredCrops} (Select to prioritize on your dashboard)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                  {allCrops.map((crop) => {
                    const isSelected = selectedCrops.includes(crop.id);
                    return (
                      <button
                        type="button"
                        key={crop.id}
                        onClick={() => toggleCrop(crop.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200'
                        }`}
                      >
                        <span>{crop.icon}</span>
                        <span>{crop.nameEn}</span>
                        {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{loading ? 'Saving...' : t.saveProfile}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
