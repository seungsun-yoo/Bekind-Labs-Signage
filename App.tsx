
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Settings as SettingsIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppSettings, CarouselItem, WeatherData } from './types';
import { DEFAULT_SETTINGS } from './constants';
import Carousel from './components/Carousel';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('lumina_settings_v12');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeOverlay = useMemo(() => {
    const nowHours = currentTime.getHours();
    const nowMinutes = currentTime.getMinutes();
    const nowVal = nowHours * 60 + nowMinutes;

    for (const overlay of settings.timeOverlays) {
      const [startH, startM] = overlay.startTime.split(':').map(Number);
      const [endH, endM] = overlay.endTime.split(':').map(Number);
      
      const startVal = startH * 60 + startM;
      const endVal = endH * 60 + endM;

      if (startVal < endVal) {
        // Normal range
        if (nowVal >= startVal && nowVal < endVal) return overlay.label;
      } else {
        // Overnight range
        if (nowVal >= startVal || nowVal < endVal) return overlay.label;
      }
    }
    return null;
  }, [currentTime, settings.timeOverlays]);

  useEffect(() => {
    localStorage.setItem('lumina_settings_v12', JSON.stringify(settings));
  }, [settings]);

  const getTokyoWeatherImage = (condition: string) => {
    const now = new Date();
    const hour = now.getHours();
    const isRain = condition.includes('Rain') || condition.includes('Drizzle');
    const isCloudy = condition.includes('Cloud');
    const base = "https://images.unsplash.com/";

    if (isRain) return `${base}photo-1518550687729-8192159e8180?auto=format&fit=crop&q=80&w=1600&sat=-100`; 
    if (hour >= 20 || hour <= 5) return `${base}photo-1536098565842-c4b11dc5082a?auto=format&fit=crop&q=80&w=1600&sat=-50`;
    if (hour >= 17 && hour <= 19) return `${base}photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1600&sat=-40`;
    if (isCloudy) return `${base}photo-1490806678282-484c3763ee2c?auto=format&fit=crop&q=80&w=1600&sat=-60`;
    return `${base}photo-1542259009477-d625272157b7?auto=format&fit=crop&q=80&w=1600&sat=-40`;
  };

  const fetchWeather = async (location: string): Promise<WeatherData> => {
    try {
      let lat = 35.6895, lon = 139.6917;
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
      const data = await res.json();
      const current = data.current_weather;
      const daily = data.daily;
      const codeMap: Record<number, string> = {
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Fog', 51: 'Drizzle', 61: 'Rain', 71: 'Snow', 95: 'Thunderstorm'
      };
      const condition = codeMap[current.weathercode] || 'Clear Sky';
      return {
        temp: Math.round(current.temperature),
        condition: condition,
        location: location,
        high: Math.round(daily.temperature_2m_max[0]),
        low: Math.round(daily.temperature_2m_min[0]),
        imageUrl: getTokyoWeatherImage(condition)
      };
    } catch (e) {
      return {
        temp: 22,
        condition: 'Clear Sky',
        location: location,
        high: 26,
        low: 18,
        imageUrl: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&q=80&w=1600'
      };
    }
  };

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const carouselItems: CarouselItem[] = [];
      
      if (settings.showWelcomePanel && settings.welcomeCards) {
        settings.welcomeCards.forEach(wc => {
          carouselItems.push({
            id: `welcome-${wc.id}`,
            type: 'welcome',
            data: { ...wc }
          });
        });
      }

      carouselItems.push(...settings.customNews.map((n) => ({ id: `news-${n.id}`, type: 'news', data: n })));
      carouselItems.push(...settings.internalPanels.map((p) => ({ id: `internal-${p.id}`, type: 'internal', data: p })));
      
      const weatherData = await fetchWeather(settings.location);
      carouselItems.push({ id: 'w1', type: 'weather', data: weatherData });

      setItems(carouselItems.slice(0, 9));
    } catch (error) {
      console.error("Failed to refresh data", error);
    } finally {
      setIsLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="relative w-screen h-screen bg-[#010101] overflow-hidden flex flex-col items-center justify-center">
      <div className="bg-animated" />
      <div className="glow-layer">
        <div className="glow-blob" />
        <div className="glow-blob glow-blob-2" />
      </div>
      <div className="bg-overlay" />

      <main className="z-10 w-full">
        {!isLoading && items.length > 0 ? (
          <Carousel items={items} autoPlayInterval={settings.autoPlayInterval} transitionSpeed={settings.transitionSpeed} />
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-white/40 text-[10px] uppercase tracking-widest animate-pulse">Syncing...</span>
          </div>
        )}
      </main>

      <AnimatePresence>
        {timeOverlay && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-3xl"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-[1px] bg-white/20 mr-4" />
                <Clock className="w-10 h-10 text-white/40" />
                <div className="w-20 h-[1px] bg-white/20 ml-4" />
              </div>
              <h1 className="text-[12vw] font-serif tracking-tighter text-white leading-none">{timeOverlay}</h1>
              <p className="mt-10 text-white/50 font-mono tracking-[0.8em] uppercase text-lg">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setIsSettingsOpen(true)} className="fixed bottom-10 right-10 p-5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all duration-500 z-50 backdrop-blur-md border border-white/10 group">
        <SettingsIcon className="w-6 h-6 group-hover:rotate-180 transition-transform duration-1000" />
      </button>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal settings={settings} onSave={(newSettings) => { setSettings(newSettings); setIsSettingsOpen(false); }} onClose={() => setIsSettingsOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
