import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  CornerDownLeft,
  Bot,
  User,
  HelpCircle,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Language, Crop } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { askAiAssistant } from '../services/api';

interface SmartKisaanAssistantProps {
  currentLang: Language;
  userDistrict?: string;
  userState?: string;
  allCrops: Crop[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const SmartKisaanAssistant: React.FC<SmartKisaanAssistantProps> = ({
  currentLang,
  userDistrict = 'Madurai',
  userState = 'Tamil Nadu',
  allCrops,
}) => {
  const t = TRANSLATIONS[currentLang];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions tailored by language
  const suggestedQueriesByLang: Record<Language, string[]> = {
    en: [
      'When is the best time of morning to bring produce to the mandi auction?',
      'What is the official government MSP for Paddy and Wheat for 2026?',
      'How to properly grade and clean tomatoes before mandi auction to get highest price?',
      'How does e-NAM inter-state bidding work for a small farmer?',
    ],
    hi: [
      'मंडी नीलामी में फसल लाने का सबसे सही समय कौन सा है?',
      '2026 के लिए धान और गेहूं का सरकारी समर्थन मूल्य (MSP) क्या है?',
      'टमाटर और प्याज की सही ग्रेडिंग कैसे करें जिससे ज्यादा भाव मिले?',
      'फसल को सड़ने से बचाने के लिए खेत पर भंडारण के उपाय बताएं।',
    ],
    ta: [
      'ஒழுங்குமுறை விற்பனைக்கூட ஏலத்திற்கு விளைபொருளை கொண்டு செல்ல சரியான நேரம் எது?',
      '2026-ம் ஆண்டிற்கான நெல் மற்றும் பருத்தி அரசு கொள்முதல் விலை (MSP) என்ன?',
      'தக்காளி மற்றும் வெங்காயத்தை தரம் பிரித்து விற்றால் கூடுதல் லாபம் கிடைக்குமா?',
      'விளைபொருளை இடைத்தரகரிடம் விற்பதை விட ஒழுங்குமுறை கூடத்தில் விற்பது ஏன் சிறந்தது?',
    ],
    te: [
      'మార్కెట్ వేలానికి పంటను తీసుకెళ్లడానికి సరైన సమయం ఏది?',
      '2026 సంవత్సరానికి వరి మరియు పత్తి కనీస మద్దతు ధర (MSP) ఎంత?',
      'టమాటా మరియు ఉల్లిపాయల నాణ్యత గ్రేడింగ్ ఎలా చేయాలి?',
      'పంటను నిల్వ చేసి సరైన ధరకు ఎలా అమ్ముకోవాలి?',
    ],
    mr: [
      'बाजार समितीत लिलावासाठी माल नेण्याची उत्तम वेळ कोणती?',
      '२०२६ सालासाठी कापूस आणि सोयाबीनचा हमीभाव (MSP) किती आहे?',
      'टोमॅटो आणि कांद्याची प्रतवारी (Grading) कशी करावी जेणेकरून जास्तीत जास्त भाव मिळेल?',
      'गावातील व्यापाऱ्याऐवजी थेट APMC मध्ये विकण्याचे काय फायदे आहेत?',
    ],
    bn: [
      'মান্ডি নিলামে ফসল তোলার সঠিক সময় কোনটি?',
      '২০২৬ সালের জন্য ধান ও গমের সরকারি ন্যূনতম সহায়ক মূল্য (MSP) কত?',
      'টমেটো এবং আলুর সঠিক গ্রেডিং কিভাবে করবেন?',
      'ফসল সংরক্ষণ করে সঠিক সময়ে কিভাবে বিক্রি করবেন?',
    ],
  };

  const currentSuggestions = suggestedQueriesByLang[currentLang] || suggestedQueriesByLang.en;

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langCodeMap: Record<Language, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        ta: 'ta-IN',
        te: 'te-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
      };

      recognition.lang = langCodeMap[currentLang] || 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, [currentLang]);

  // Initial welcome message
  useEffect(() => {
    const greetings: Record<Language, string> = {
      en: `Namaste! I am your Smart Kisaan AI Advisory assistant. Ask me anything about mandi auction timings, crop grading for higher rates, government MSP procurement, or post-harvest storage tips in ${userDistrict}, ${userState}.`,
      hi: `नमस्ते किसान साथी! मैं आपका स्मार्ट किसान AI सलाहकार हूँ। मंडी के सही समय, अच्छी ग्रेडिंग, सरकारी समर्थन मूल्य (MSP) या खेत पर फसल भंडारण को लेकर कोई भी सवाल बेझिझक पूछें।`,
      ta: `வணக்கம் விவசாய தோழரே! நான் உங்கள் Smart Kisaan AI ஆலோசகர். ${userDistrict} சுற்றுவட்டார சந்தை ஏல நேரங்கள், விளைபொருளை தரம் பிரித்து அதிக விலைக்கு விற்பது மற்றும் அரசு திட்டங்கள் குறித்து எந்தக் கேள்வியையும் கேட்கலாம்.`,
      te: `నమస్కారం రైతు మిత్రమా! నేను మీ Smart Kisaan AI సహాయకుడిని. మార్కెట్ వేలం సమయాలు, నాణ్యతా ప్రమాణాలు, ప్రభుత్వ MSP మరియు నిల్వ పద్ధతుల గురించి నన్ను అడగండి.`,
      mr: `नमस्कार शेतकरी मित्रा! मी तुमचा Smart Kisaan AI शेती सल्लागार आहे. बाजार समिती लिलाव, शेतमालाची प्रतवारी, हमीभाव आणि साठवणुकीबद्दल काहीही विचारा.`,
      bn: `নমস্কার কৃষক বন্ধু! আমি আপনার Smart Kisaan AI কৃষি উপদেষ্টা। মান্ডির নিলাম সময়, ফসলের গ্রেডিং, সরকারি MSP এবং ফসল সংরক্ষণ নিয়ে যেকোনো প্রশ্ন করুন।`,
    };

    setMessages([
      {
        id: 'msg_welcome',
        sender: 'assistant',
        text: greetings[currentLang] || greetings.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [currentLang, userDistrict, userState]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use text input.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      recognitionRef.current.start();
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const langCodeMap: Record<Language, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
    };
    utterance.lang = langCodeMap[currentLang] || 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    window.speechSynthesis?.cancel();
    setIsSpeaking(false);

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await askAiAssistant(text, currentLang, {
        district: userDistrict,
        state: userState,
      });

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('AI assistant failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{t.navAiAssistant}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-display">
              {t.aiHeading}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl">
              {t.aiSubheading}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Multilingual Voice Ready</span>
          </div>
        </div>

        {/* Suggested Prompts */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            {t.suggestedQuestions}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentSuggestions.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(query)}
                className="text-left p-2.5 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-stone-200/80 hover:border-emerald-300 text-xs text-stone-700 hover:text-emerald-900 font-medium transition-colors flex items-center justify-between group"
              >
                <span>{query}</span>
                <CornerDownLeft className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                    isUser ? 'bg-stone-800' : 'bg-emerald-700 shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-700 text-white font-medium rounded-tr-xs'
                      : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {/* Actions & Timestamp */}
                  <div
                    className={`mt-2 flex items-center justify-between text-[11px] ${
                      isUser ? 'text-emerald-200' : 'text-stone-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.text)}
                        className="flex items-center gap-1 hover:text-emerald-700 font-semibold transition-colors ml-3"
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                            <span className="text-rose-600">{t.stopVoice}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{t.voiceReadout}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-stone-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></div>
                <span className="ml-1">Consulting agricultural market advisory...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-xl transition-all flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 border border-stone-200'
              }`}
              title={isListening ? t.listening : t.speakPrompt}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? t.listening : t.aiPlaceholder}
              className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:outline-hidden focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold rounded-xl text-sm shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span>{t.askAssistant}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-stone-400 px-1">
            <span>Powered by Smart Kisaan Agronomy Engine</span>
            <span>Microphone available for vernacular voice input</span>
          </div>
        </div>
      </div>
    </div>
  );
};
