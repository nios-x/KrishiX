import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquareText, Send, Sparkles, Sprout, Activity, 
  BarChart3, User, ShieldCheck, MapPin, RefreshCw, Compass
} from 'lucide-react';
import { chatAdvisor } from '../services/api';
import { useFarm } from '../context/FarmContext';
import { useLanguage } from '../context/LanguageContext';

export default function AdvisorPage({ onNavigate }) {
  const { farmInfo, soilParams, latestRecommendation, latestHealth, latestYield } = useFarm();
  const { language } = useLanguage();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: (
        language === 'hi'
          ? `नमस्ते किसान साथी! 🌱 मैं **कृषिमित्र (KrishiMitra AI)** हूँ। मैं आपके खेत के स्थान (${farmInfo.district}, ${farmInfo.state}), मिट्टी परीक्षण और पत्ती के स्वास्थ्य के आधार पर व्यावहारिक वैज्ञानिक सलाह देने के लिए तैयार हूँ। आप मुझसे क्या पूछना चाहते हैं?`
          : language === 'hinglish'
          ? `Namaste! 🌱 Main **KrishiMitra AI** hoon, aapka precision farming assistant. Aapke farm location (${farmInfo.district}, ${farmInfo.state}), soil parameters, ya plant leaf diseases se related koi bhi question poochiye!`
          : `Hello! 🌱 I am **KrishiMitra AI**, your intelligent precision agricultural advisor. I have access to your active farm profile in ${farmInfo.district}, ${farmInfo.state}. Ask me anything regarding soil suitability, crop diseases, or regional yield benchmarks.`
      ),
      suggested_actions: ["What should I grow in my soil?", "My leaves look unhealthy", "What is the yield trend in my district?"]
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  const handleSend = async (messageText) => {
    const query = messageText || inputMessage;
    if (!query.trim() || loading) return;

    const userEntry = { sender: 'user', text: query };
    setChatHistory(prev => [...prev, userEntry]);
    setInputMessage('');
    setLoading(true);

    try {
      const activeContext = {
        location: { state: farmInfo.state, district: farmInfo.district },
        farm_area: farmInfo.area,
        current_crop: farmInfo.currentCrop,
        soil: soilParams,
        latest_recommendation: latestRecommendation,
        latest_health: latestHealth,
        latest_yield: latestYield
      };

      const res = await chatAdvisor(query, activeContext, language);
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'bot',
          text: res.response,
          suggested_actions: res.suggested_actions || [],
          grounding: res.grounding
        }
      ]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'bot',
          text: "I am temporarily having trouble reaching the advisory engine. Please verify your connection or try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-xs font-semibold text-purple-800 dark:text-purple-300 mb-2">
          <span>KRISHIMITRA AGRI-ASSISTANT</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          KrishiMitra AI Advisor
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Your intelligent agricultural assistant, seamlessly combining soil test data, plant leaf pathology, and regional Indian yield records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Farmer Context Panel (Prompt #17) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>Active Farmer Context</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
              Live State
            </span>
          </div>

          <div className="space-y-3 text-xs">
            
            {/* Location & Area */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Farm Location &amp; Scale</span>
              <div className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>{farmInfo.district}, {farmInfo.state}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Area: <strong>{farmInfo.area} Hectares</strong> • Current Crop: <strong>{farmInfo.currentCrop}</strong>
              </div>
            </div>

            {/* Soil Parameters */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Soil Parameters</span>
              <div className="grid grid-cols-3 gap-1 font-mono text-[11px] text-slate-700 dark:text-slate-200">
                <div>N: <strong>{soilParams.n}</strong></div>
                <div>P: <strong>{soilParams.p}</strong></div>
                <div>K: <strong>{soilParams.k}</strong></div>
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                pH: <strong>{soilParams.ph}</strong> • Rain: <strong>{soilParams.rainfall} mm</strong>
              </div>
            </div>

            {/* Latest Crop Recommendation */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Latest Recommendation</span>
              {latestRecommendation ? (
                <div className="font-bold text-emerald-600 dark:text-emerald-400">
                  {latestRecommendation.recommended_crop} ({latestRecommendation.confidence}%)
                </div>
              ) : (
                <div className="text-slate-400 italic">No soil analysis yet</div>
              )}
            </div>

            {/* Latest Health Diagnosis */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Latest Leaf Diagnosis</span>
              {latestHealth ? (
                <div>
                  <div className="font-bold text-slate-800 dark:text-white">
                    {latestHealth.condition} ({latestHealth.confidence}%)
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    latestHealth.is_healthy ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {latestHealth.status}
                  </span>
                </div>
              ) : (
                <div className="text-slate-400 italic">No leaf scan performed</div>
              )}
            </div>

          </div>

          <div className="pt-2 text-[11px] text-slate-400 leading-relaxed">
            KrishiMitra automatically incorporates this active context when answering your queries.
          </div>
        </div>

        {/* Right Column: Conversational Chat Interface */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col h-[650px] overflow-hidden">
          
          {/* Chat Window Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {item.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Sprout className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                  item.sender === 'user'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 space-y-2'
                }`}>
                  <div className="whitespace-pre-line">
                    {item.text}
                  </div>

                  {item.grounding && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span>Grounded on: {item.grounding}</span>
                    </div>
                  )}

                  {item.suggested_actions?.length > 0 && (
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {item.suggested_actions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(act)}
                          className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold hover:bg-emerald-50 transition-colors cursor-pointer"
                        >
                          {act}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {item.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Sprout className="w-4 h-4 animate-bounce" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span>KrishiMitra is reasoning over datasets &amp; farm context...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-6 py-2 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-500 whitespace-nowrap">
            <span className="font-semibold text-slate-400">Quick:</span>
            <button
              onClick={() => handleSend("My soil has pH 6.5 and rainfall is 900mm. What should I grow?")}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-emerald-600 transition-colors"
            >
              Soil pH 6.5 &amp; 900mm Rain
            </button>
            <button
              onClick={() => handleSend("My tomato leaves look unhealthy with dark concentric spots.")}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-emerald-600 transition-colors"
            >
              Unhealthy Tomato Leaves
            </button>
            <button
              onClick={() => handleSend(`What happened to rice production in ${farmInfo.district}?`)}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-emerald-600 transition-colors"
            >
              Rice in {farmInfo.district}
            </button>
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask KrishiMitra about soil, diseases, yields, or fertilizer..."
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
