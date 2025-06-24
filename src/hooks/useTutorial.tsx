import { useState, useEffect } from 'react';

export const useTutorial = () => {
  const [hasSeenTutorial, setHasSeenTutorial] = useState<boolean>(true);

  useEffect(() => {
    const seen = localStorage.getItem('calbus-hasSeenTutorial');
    setHasSeenTutorial(seen === 'true');
  }, []);

  const markTutorialAsSeen = () => {
    localStorage.setItem('calbus-hasSeenTutorial', 'true');
    setHasSeenTutorial(true);
  };

  const resetTutorial = () => {
    localStorage.removeItem('calbus-hasSeenTutorial');
    setHasSeenTutorial(false);
  };

  return {
    hasSeenTutorial,
    markTutorialAsSeen,
    resetTutorial
  };
};
