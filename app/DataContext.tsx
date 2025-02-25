import React, { createContext, useState, useContext } from 'react';
import { ReactNode } from 'react';

interface DataContextType {
  correctArrayState: { total: number; correct: number }[];
  setCorrectArrayState: React.Dispatch<React.SetStateAction<{ total: number; correct: number }[]>>;

  timeToAnswerCorrectArrayState: { total: number; totalTime: number }[];
  setTimeToAnswerCorrectArrayState: React.Dispatch<React.SetStateAction<{ total: number; totalTime: number }[]>>;
  
  timedModeEnabled: boolean;
  setTimedModeEnabled: React.Dispatch<React.SetStateAction<boolean>>;

  timerSpeed: number;
  setTimerSpeed: React.Dispatch<React.SetStateAction<number>>;
  
  // Add these helper functions to make updating data easier
  updateFlashData: (index: number, isCorrect: boolean) => void;
  updateTimedData: (index: number, isCorrect: boolean, timeInMs: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [correctArrayState, setCorrectArrayState] = useState(
    Array.from({ length: 10 }, () => ({ total: 0, correct: 0 }))
  );
  
  const [timeToAnswerCorrectArrayState, setTimeToAnswerCorrectArrayState] = useState(
    Array.from({ length: 10 }, () => ({ total: 0, totalTime: 0 }))
  );
  
  const [timedModeEnabled, setTimedModeEnabled] = useState(true);
  const [timerSpeed, setTimerSpeed] = useState(1000); // Default timer speed in ms

  // Helper function to update flash data
  const updateFlashData = (index: number, isCorrect: boolean) => {
    console.log('updating flash data with timeModeEnabled: ', timedModeEnabled);
    setCorrectArrayState(prev => {
      const newArray = [...prev];
      // Ensure index is within bounds (1-10 -> 0-9)
      const arrayIndex = index - 1;
      if (arrayIndex >= 0 && arrayIndex < newArray.length) {
        newArray[arrayIndex] = {
          correct: isCorrect ? newArray[arrayIndex].correct + 1 : newArray[arrayIndex].correct,
          total: newArray[arrayIndex].total + 1
        };
      }
      return newArray;
    });
  };

  // Helper function to update timed data
  const updateTimedData = (index: number, isCorrect: boolean, timeInMs: number) => {
    // Only update time data if the answer was correct
    if (isCorrect) {
      setTimeToAnswerCorrectArrayState(prev => {
        const newArray = [...prev];
        // Ensure index is within bounds (1-10 -> 0-9)
        const arrayIndex = index - 1;
        if (arrayIndex >= 0 && arrayIndex < newArray.length) {
          newArray[arrayIndex] = {
            totalTime: newArray[arrayIndex].totalTime + timeInMs,
            total: newArray[arrayIndex].total + 1
          };
        }
        return newArray;
      });
    }
  };

  return (
    <DataContext.Provider 
      value={{ 
        correctArrayState, 
        setCorrectArrayState, 
        timeToAnswerCorrectArrayState, 
        setTimeToAnswerCorrectArrayState, 
        timedModeEnabled, 
        setTimedModeEnabled,
        timerSpeed,
        setTimerSpeed,
        updateFlashData,
        updateTimedData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};