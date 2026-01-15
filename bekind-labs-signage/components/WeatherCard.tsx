
import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  data: WeatherData;
  isActive: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, isActive }) => {
  const isCloudy = data.condition.includes('Cloud');
  const isRainy = data.condition.includes('Rain') || data.condition.includes('Drizzle');
  const Icon = isCloudy ? Cloud : isRainy ? CloudRain : Sun;

  return (
    <div className="relative w-full h-full bg-[#050505] flex flex-col justify-between overflow-hidden group border border-white/10">
      {/* Cinematic Background Image with fixed cropping and dark overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {data.imageUrl ? (
          <motion.img 
            src={data.imageUrl} 
            className="w-full h-full object-cover transform-gpu"
            initial={{ scale: 1.2 }}
            animate={{ 
              scale: isActive ? 1 : 1.2, 
              opacity: isActive ? 0.6 : 0.3 
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        ) : (
          <div className="w-full h-full bg-blue-900/20" />
        )}
        
        {/* Readability Gradients - Improved to prevent white edges and text interference */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent z-[1]" />
      </div>

      <div className="relative z-10 flex justify-between items-start p-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <span className="text-white/60 text-[10px] uppercase tracking-[0.4em] font-bold">Weather Real-time</span>
          </div>
          <h2 className="text-4xl font-serif text-white tracking-tight drop-shadow-md">{data.location}</h2>
        </div>
        <div className="p-4 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-xl">
          <Icon className="w-8 h-8 text-white drop-shadow-md" strokeWidth={1.5} />
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6 p-10">
        <div className="flex items-baseline gap-2">
          <motion.span 
            className="text-[120px] font-serif leading-none tracking-tighter text-white drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: isActive ? 1 : 0.4, 
              scale: isActive ? 1 : 0.9 
            }}
            transition={{ duration: 1 }}
          >
            {data.temp}
          </motion.span>
          <span className="text-5xl font-light text-white/30">°C</span>
        </div>

        <div className="flex gap-10 border-t border-white/10 pt-8 bg-black/20 backdrop-blur-sm -mx-10 px-10">
          <div className="flex flex-col gap-1">
            <span className="block text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Outlook</span>
            <span className="text-white font-semibold text-lg">{data.condition}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="block text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">L/H Range</span>
            <span className="text-white font-semibold text-lg">{data.low}° / {data.high}°</span>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <span className="block text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Flow</span>
            <Wind className="w-6 h-6 text-white/60" />
          </div>
        </div>
      </div>

      {/* Subtle Corner Glow */}
      <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none z-0" />
    </div>
  );
};

export default WeatherCard;
