
import React from 'react';
import { motion } from 'framer-motion';
import { InternalPanel } from '../types';
import { Quote, Link as LinkIcon } from 'lucide-react';

interface InternalPanelCardProps {
  data: InternalPanel;
  isActive: boolean;
}

const InternalPanelCard: React.FC<InternalPanelCardProps> = ({ data, isActive }) => {
  return (
    <div className="relative w-full h-full bg-[#0d0d0d] overflow-hidden flex flex-col border border-white/10 group">
      {/* Media Section - Distinct from News Cards */}
      {data.imageUrl && (
        <div className="h-2/5 w-full relative overflow-hidden">
          <motion.img 
            src={data.imageUrl} 
            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000"
            animate={{ scale: isActive ? 1.1 : 1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
          {data.url && (
            <div className="absolute top-6 right-6 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
              <LinkIcon className="w-3 h-3 text-white/40" />
            </div>
          )}
        </div>
      )}

      <div className={`flex flex-col p-10 flex-1 ${!data.imageUrl ? 'pt-12' : 'pt-2'}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-emerald-500">
              {data.category}
            </span>
            <div className="w-8 h-[1px] bg-emerald-500/30 mt-2" />
          </div>
          <Quote className="w-8 h-8 text-white/5" />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-serif text-white leading-tight">
            {data.title}
          </h2>
          <p className="text-white/50 text-base leading-relaxed font-light line-clamp-4 italic">
            {data.content}
          </p>
        </div>

        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 font-bold text-xs border border-white/5 shadow-inner">
              {data.sharedBy ? data.sharedBy.split(' ').map(n => n[0]).join('') : '?'}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-white/20 uppercase tracking-widest font-bold">Contributor</span>
              <span className="text-white/70 font-medium text-sm">{data.sharedBy}</span>
            </div>
          </div>
          <div className="text-[10px] text-white/10 font-mono italic">
            BEKIND SHARED CONTENT
          </div>
        </div>
      </div>
      
      {/* Distinct Gradient Accents */}
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
    </div>
  );
};

export default InternalPanelCard;
