
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Calendar } from 'lucide-react';

interface WelcomeCardProps {
  data: { companyName: string; teamName: string; welcomeMessage: string };
  isActive: boolean;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ data, isActive }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      setToday(now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric' 
      }));

      const target = new Date();
      target.setHours(18, 0, 0, 0);
      let diff = target.getTime() - now.getTime();
      if (diff < 0) { setTimeLeft("00:00:00"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#fdfdfc] text-[#0a0a0a] overflow-hidden flex flex-col p-14">
      {/* Top Header */}
      <div className="flex flex-col gap-2 mb-12">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.5em] font-black text-black">BEKIND LABS OFFICE</span>
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        </div>
        <div className="h-[2px] w-12 bg-black/10" />
      </div>

      {/* Main Branding */}
      <div className="mt-auto mb-10 flex flex-col gap-4">
        <h3 className="text-xs uppercase tracking-[0.3em] font-black text-black/20">
          {data.companyName}
        </h3>
        <h1 className="text-7xl font-serif leading-[0.85] text-black tracking-tighter">
          {data.teamName}
        </h1>
        <p className="mt-6 text-xl text-black/50 font-serif italic border-l-4 border-black/5 pl-6 max-w-[85%]">
          {data.welcomeMessage}
        </p>
      </div>

      {/* Footer Info Section */}
      <div className="mt-auto flex flex-col gap-8">
        {/* Date Row - Single line above divider */}
        <div className="flex items-center gap-3 text-black/70 px-1">
          <Calendar className="w-3.5 h-3.5 text-black/20" />
          <span className="text-[11px] uppercase tracking-[0.25em] font-bold">
            {today}
          </span>
          <div className="flex-1 h-[1px] bg-black/5 mx-2" />
        </div>

        {/* Bottom Metadata Section */}
        <div className="flex justify-between items-end pt-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-black/5 px-4 py-2 rounded-full border border-black/5">
              <div className="flex items-center gap-2 text-black/40">
                <Timer className="w-3 h-3" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-black">Shift Exit</span>
              </div>
              <span className="text-base font-mono font-bold tracking-tight text-black/90">{timeLeft}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-3xl font-serif text-black/80 font-medium tracking-tight">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Layer */}
      <motion.div 
        className="absolute top-[-50%] right-[-50%] w-[120%] h-[120%] border-[0.5px] border-black/[0.03] rounded-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default WelcomeCard;
