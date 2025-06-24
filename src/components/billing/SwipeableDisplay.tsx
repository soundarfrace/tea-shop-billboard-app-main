
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeableDisplayProps {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  showPreviousIndicator: boolean;
  showNextIndicator: boolean;
}

const SwipeableDisplay = ({ 
  children, 
  onSwipeLeft, 
  onSwipeRight, 
  showPreviousIndicator,
  showNextIndicator 
}: SwipeableDisplayProps) => {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diffX = currentX - startX;
    const threshold = 50;
    
    if (diffX > threshold) {
      onSwipeRight();
    } else if (diffX < -threshold) {
      onSwipeLeft();
    }
    
    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  const translateX = isDragging ? Math.max(-50, Math.min(50, currentX - startX)) : 0;

  return (
    <div className="relative">
      {/* Previous indicator */}
      {showPreviousIndicator && (
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 opacity-60">
          <ChevronLeft className="w-6 h-6 text-primary animate-pulse" />
        </div>
      )}
      
      {/* Next indicator */}
      {showNextIndicator && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 opacity-60">
          <ChevronRight className="w-6 h-6 text-primary animate-pulse" />
        </div>
      )}
      
      <div
        ref={containerRef}
        className="transition-transform duration-200 ease-out"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
      
      {/* History navigation hint */}
      <div className="px-4 pb-2">
        <div className="text-xs text-muted-foreground text-center">
          {showPreviousIndicator || showNextIndicator ? (
            "← Swipe to view calculation history →"
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SwipeableDisplay;
