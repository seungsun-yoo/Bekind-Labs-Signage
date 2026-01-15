
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarouselItem } from '../types';
import NewsCard from './NewsCard';
import WeatherCard from './WeatherCard';
import WelcomeCard from './WelcomeCard';
import InternalPanelCard from './InternalPanelCard';

interface CarouselProps {
  items: CarouselItem[];
  autoPlayInterval: number;
  transitionSpeed: number;
}

const Carousel: React.FC<CarouselProps> = ({ items, autoPlayInterval, transitionSpeed }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(next, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, autoPlayInterval]);

  const renderCard = (item: CarouselItem, isActive: boolean) => {
    const props = { data: item.data as any, isActive };
    switch (item.type) {
      case 'news': return <NewsCard {...props} />;
      case 'weather': return <WeatherCard {...props} />;
      case 'welcome': return <WelcomeCard {...props} />;
      case 'internal': return <InternalPanelCard {...props} />;
      default: return null;
    }
  };

  // Expanded range to show 9 items: 4 on each side + center
  const displayRange = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  return (
    <div className="relative w-full overflow-visible h-[80vh] flex items-center justify-center">
      <div className="flex items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {displayRange.map((offset) => {
            const itemIndex = (index + offset + items.length * 10) % items.length;
            const item = items[itemIndex];
            if (!item) return null;

            const isActive = offset === 0;
            const absOffset = Math.abs(offset);
            
            // Progressive fading and scaling for 9 items
            const opacity = isActive ? 1 : Math.max(0.1, 0.9 - (absOffset * 0.22));
            const scale = isActive ? 1.05 : 0.85 - (absOffset * 0.08);
            const zIndex = 30 - absOffset;
            
            // Non-linear spacing to keep 9 items visible on screen
            // Center stays at 0, items next to it have a gap, further items are packed tighter
            const xPos = offset === 0 
              ? 0 
              : Math.sign(offset) * (380 + (absOffset - 1) * 260);

            return (
              <motion.div
                key={`${item.id}-${index}-${offset}`}
                layout
                initial={{ opacity: 0, scale: 0.5, x: offset * 500 }}
                animate={{ 
                  opacity,
                  scale,
                  x: xPos,
                  z: isActive ? 0 : -100 * absOffset,
                  filter: isActive ? 'grayscale(0%) blur(0px)' : `grayscale(${absOffset * 15}%) blur(${absOffset * 0.5}px)`,
                }}
                exit={{ opacity: 0, scale: 0.5, x: offset * 500 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 120, 
                  damping: 20, 
                  mass: 0.8,
                  duration: transitionSpeed / 1000
                }}
                className={`absolute w-[420px] aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-3xl ${
                  isActive ? 'z-50' : ''
                }`}
                style={{ zIndex }}
                onClick={() => {
                   if (offset !== 0) setIndex((prev) => (prev + offset + items.length) % items.length);
                }}
              >
                {renderCard(item, isActive)}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-[-10vh] flex gap-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 transition-all duration-700 rounded-full ${
              index === i ? 'w-16 bg-white' : 'w-5 bg-white/10 hover:bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
