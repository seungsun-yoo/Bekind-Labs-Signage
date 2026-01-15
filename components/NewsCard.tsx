
import React from 'react';
import { motion } from 'framer-motion';
import { NewsItem } from '../types';

interface NewsCardProps {
  data: NewsItem;
  isActive: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ data, isActive }) => {
  return (
    <div className="relative w-full h-full bg-[#111] overflow-hidden group">
      {/* Background Image with Overlay */}
      <motion.img 
        src={data.imageUrl} 
        alt={data.title}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: isActive ? 1.05 : 1.2 }}
        transition={{ duration: 15, repeat: Infinity, repeatType: 'reverse' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] uppercase tracking-[0.2em] text-white/60 font-medium">
            {data.source}
          </span>
          {/* Date removed as per request */}
        </div>
        <h2 className="text-3xl font-serif leading-tight text-white group-hover:text-white/90 transition-colors">
          {data.title}
        </h2>
        <motion.p 
          className="text-white/60 text-sm leading-relaxed line-clamp-3 font-light"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
          transition={{ delay: 0.3 }}
        >
          {data.summary}
        </motion.p>
      </div>

      {/* Aesthetic Accents */}
      <div className="absolute top-10 left-10 w-8 h-[1px] bg-white/30" />
    </div>
  );
};

export default NewsCard;
