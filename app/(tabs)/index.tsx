import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { useData } from '../DataContext';
import { useFocusEffect } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';

import type { NavigationProp } from '@react-navigation/native';

export default function App({ navigation }: { navigation: NavigationProp<any> }) {
  const dataContext = useData();
  if (!dataContext) {
    return null; // or handle the undefined case appropriately
  }
  const { 
    correctArrayState, 
    setCorrectArrayState, 
    timedModeEnabled, 
    timeToAnswerCorrectArrayState, 
    setTimeToAnswerCorrectArrayState,
    updateFlashData,
    updateTimedData,
    timerSpeed,
  } = dataContext;
  
  const [numDots, setNumDots] = useState(0);
  const numDotsRef = useRef(numDots);
  const [dots, setDots] = useState<{ x: number; y: number }[]>([]);
  const [showDots, setShowDots] = useState(true);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const hideDotsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [inputLocked, setInputLocked] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      if (Platform.OS === 'web') {
        window.removeEventListener('keydown', handleKeyDown);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (hideDotsTimeoutRef.current) {
        clearTimeout(hideDotsTimeoutRef.current);
      }
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setShowStartScreen(true);
    }, [])
  );

  const startGame = () => {
    setShowStartScreen(false);
    resetGame();
  };

  const resetGame = () => {
    // Clear any existing timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Clear any timeouts for hiding dots
    if (typeof hideDotsTimeoutRef.current === 'number') {
      clearTimeout(hideDotsTimeoutRef.current);
      hideDotsTimeoutRef.current = null;
    }
    
    // Reset all game state
    setShowDots(true);
    setMessage("");
    setTimer(0);
    
    // Generate new dots
    const dotsCoordsArray = generateDotsCoords();
    setDots(dotsCoordsArray);
    setNumDots(dotsCoordsArray.length);
    
    // Start timer
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimer(Date.now() - startTimeRef.current);
    }, 1);
    
    // For flash mode, set timeout to hide dots
    if (!timedModeEnabled) {
      hideDotsTimeoutRef.current = setTimeout(() => {
        setShowDots(false);
      }, timerSpeed);
    }
  };

  useEffect(() => {
    if (!showStartScreen) {
      resetGame();
    }
  }, [timedModeEnabled]);

  useEffect(() => {
    console.log('Context values updated:', {
      timedModeEnabled,
      timerSpeed,
    });
  }, [timedModeEnabled, timerSpeed]);

  useEffect(() => {
    numDotsRef.current = numDots;
  }, [numDots]);

  function generateDotsCoords() {
    // Generate dots one-by-one so their coordinates don't overlap.
    const count = Math.floor(Math.random() * 9) + 1; // Between 1 and 10 dots
    const dotsCoordsArray: { x: number; y: number }[] = [];

    function distanceBetweenCoords(x1: number, y1: number, x2: number, y2: number) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function generateNewRandomCoords(array: { x: number; y: number }[]) {
      const x_coord = Math.random() * 200;
      const y_coord = Math.random() * 200;
      if (array.some((dot) => distanceBetweenCoords(dot.x, dot.y, x_coord, y_coord) < 25)) {
        return generateNewRandomCoords(array);
      }
      return { x: x_coord, y: y_coord };
    }

    for (let i = 0; i < count; i++) {
      const ithCoords = generateNewRandomCoords(dotsCoordsArray);
      dotsCoordsArray.push({ x: ithCoords.x, y: ithCoords.y });
    }

    return dotsCoordsArray;
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const currentTimedMode = dataContext?.timedModeEnabled;

    event.preventDefault();

    console.log('showDots', showDots);
    console.log('timedModeEnabled', currentTimedMode);
    setShowDots(false);

    if (!currentTimedMode && inputLocked) {
      console.log('Ignoring key press - dots visible or input locked');
      return;
    }

    const key = event.key;
    console.log('key pressed ', key);

    if (key === 'Enter') {
      console.log('Enter key pressed');
      if (showStartScreen) {
        startGame();
      }
      return;
    }
    // go back to the start screen if the user presses 'q'
    if (key === 'q') {
      console.log('q key pressed');
      setShowStartScreen(true);
      return;
    }
    
    const numericGuess = parseInt(key, 10);
    console.log('numericGuess ', numericGuess);
    if (!isNaN(numericGuess) && numericGuess >= 1 && numericGuess <= 10) {
      console.log('About to check answer with showDots = ', showDots);
      checkAnswer(numericGuess);
    }
  };

  const checkAnswer = (guess: number) => {
    console.log('checking guess ', guess);
    const currentNumDots = numDotsRef.current;
    const isCorrect = guess === currentNumDots;
    const currentTimer = Date.now() - startTimeRef.current;
    console.log('currentTimer ', currentTimer);

    if (timedModeEnabled) {
      // For timed mode, update only time data
      // Only track timing data for correct answers
      console.log('timed mode is enabled', timedModeEnabled)
      // Using the helper function if available
      if (typeof updateTimedData === 'function') {
        console.log('using timed data helper function')
        updateTimedData(currentNumDots, isCorrect, currentTimer);
      } else {
        // Fallback to direct state updates if helper isn't available
        
        if (isCorrect) {
          const newTimeArray = timeToAnswerCorrectArrayState.map((item, index) => {
            if (index === currentNumDots - 1) {
              return {
                total: item.total + 1,
                totalTime: item.totalTime + currentTimer,
              };
            }
            return item;
          });
          setTimeToAnswerCorrectArrayState(newTimeArray);
        }
      
      }
    } if (!timedModeEnabled) {
      console.log('flash mode enabled')
      // For flash mode, just update the correctness data
      if (typeof updateFlashData === 'function') {
        console.log('using flash data helper function')
        updateFlashData(currentNumDots, isCorrect);
      } else {
        const newCorrectArray = correctArrayState.map((item, index) => {
          if (index === currentNumDots - 1) {
            return {
              total: item.total + 1,
              correct: isCorrect ? item.correct + 1 : item.correct,
            };
          }
          return item;
        });
        setCorrectArrayState(newCorrectArray);
      }
    }

    if (isCorrect) {
      setMessage("Correct!");
    } else {
      setMessage(`The correct answer was ${currentNumDots}.`);
    }

    if (timerRef.current) {
      console.log('clearing timer')
      clearInterval(timerRef.current);
    }
    
    if (hideDotsTimeoutRef.current) {
      console.log('clearing hide dots timeout')
      clearTimeout(hideDotsTimeoutRef.current);
    }

    setTimeout(resetGame, 1000); // Restart after 1 second
  };

  return (
    <View style={styles.container}>
      {showStartScreen ? (
        <View style={styles.startScreen}>
          <Text style={styles.startScreenText}>Subtizing Game ({timedModeEnabled ? "Timed Mode" : "Flash Mode"})</Text>
          <TouchableOpacity onPress={startGame} style={styles.startButton}>
            <Text style={styles.startButtonText}>Start</Text>
          </TouchableOpacity>
        </View>
      ) : (
        timedModeEnabled ? (
          // Timed Mode. The dots and buttons are visible at the same time, and a clock counts up the time it takes to answer.
          <View style={styles.container}>
            <View style={styles.dotContainer}>
              {dots.map((dot, index) => (
                <View key={index} style={[styles.dot, { left: dot.x, top: dot.y }]} />
              ))}
            </View>
            <View style={styles.buttonContainer}>
              {[...Array(10).keys()].map((num) => (
                <TouchableOpacity key={num} onPress={() => checkAnswer(num + 1)} style={styles.button}>
                  <Text style={styles.buttonText}>{num + 1}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.message}>{message}</Text>
            <Text style={styles.timer}>Time: {timer}ms</Text>
          </View>
        ) : (
          // Flash Mode
          <View style={styles.container}>
            {showDots && (
              <View style={styles.dotContainer}>
                {dots.map((dot, index) => (
                  <View key={index} style={[styles.dot, { left: dot.x, top: dot.y }]} />
                ))}
              </View>
            )}
            {!showDots && (
              <View style={styles.buttonContainer}>
                {[...Array(10).keys()].map((num) => (
                  <TouchableOpacity key={num} onPress={() => checkAnswer(num + 1)} style={styles.button}>
                    <Text style={styles.buttonText}>{num + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <Text style={styles.message}>{message}</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#25292e',
  },
  startScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#25292e',
  },
  startScreenText: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 20,
  },
  startButton: {
    padding: 10,
    backgroundColor: '#ffd33d',
    borderRadius: 5,
  },
  startButtonText: {
    fontSize: 18,
    color: '#25292e',
  },
  dotContainer: {
    width: 250,
    height: 250,
    backgroundColor: '#25292e',
    position: "relative",
  },
  dot: {
    width: 20,
    height: 20,
    backgroundColor: '#ffd33d',
    borderRadius: 10,
    position: "absolute",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#ffd33d',
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#25292e',
    fontSize: 18,
  },
  message: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: '#ffd33d',
  },
  timer: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: '#ffd33d',
  },
});