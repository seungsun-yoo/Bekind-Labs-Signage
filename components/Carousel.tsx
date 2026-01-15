
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

  // Visually we want 3 items to be the main focus, but we render 5 to handle smooth sliding
  const displayRange = [-2, -1, 0, 1, 2];

  return (
    <div className="relative w-full overflow-visible h-[80vh] flex items-center justify-center">
      <div className="flex items-center justify-center gap-12">
        <AnimatePresence mode="popLayout" initial={false}>
          {displayRange.map((offset) => {
            const itemIndex = (index + offset + items.length * 10) % items.length;
            const item = items[itemIndex];
            const isActive = offset === 0;
            const isVisibleMain = Math.abs(offset) <= 1; // The 3 items we really care about

            return (
              <motion.div
                key={`${item.id}-${index}-${offset}`}
                layout
                initial={{ opacity: 0, scale: 0.8, x: offset * 400 }}
                animate={{ 
                  opacity: isActive ? 1 : (isVisibleMain ? 0.7 : 0.2),
                  scale: isActive ? 1.05 : 0.82,
                  x: offset * (isActive ? 460 : 420), // Spacing adjusted for 3 main items
                  z: isActive ? 0 : -100,
                  filter: isActive ? 'grayscale(0%)' : 'grayscale(40%) blur(1px)',
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 25, 
                  mass: 1,
                  duration: transitionSpeed / 1000
                }}
                className={`absolute w-[440px] aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer shadow-3xl ${
                  isActive ? 'z-30' : 'z-10'
                }`}
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
