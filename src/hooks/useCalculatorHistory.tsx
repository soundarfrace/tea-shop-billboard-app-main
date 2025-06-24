
import { useState, useEffect } from 'react';

interface CalculationEntry {
  id: string;
  expression: string;
  total: number;
  timestamp: Date;
}

export const useCalculatorHistory = () => {
  const [history, setHistory] = useState<CalculationEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = (expression: string, total: number) => {
    const newEntry: CalculationEntry = {
      id: Date.now().toString(),
      expression,
      total,
      timestamp: new Date()
    };
    
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 10); // Keep last 10 calculations
      return updated;
    });
    setCurrentIndex(-1); // Reset to current calculation
  };

  const navigateHistory = (direction: 'previous' | 'next') => {
    if (direction === 'previous' && currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'next' && currentIndex > -1) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const getCurrentEntry = () => {
    if (currentIndex === -1) return null;
    return history[currentIndex];
  };

  const isAtStart = currentIndex >= history.length - 1;
  const isAtEnd = currentIndex <= -1;

  return {
    history,
    currentIndex,
    addToHistory,
    navigateHistory,
    getCurrentEntry,
    isAtStart,
    isAtEnd
  };
};
