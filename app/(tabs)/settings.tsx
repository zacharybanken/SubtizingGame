import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Slider from '@react-native-community/slider';
import { useData } from '../DataContext';

export default function SettingsScreen() {
  const dataContext = useData();
  if (!dataContext) {
    return null; // or handle the undefined case appropriately
  }
  const { setCorrectArrayState, setTimeToAnswerCorrectArrayState, timedModeEnabled, setTimedModeEnabled, timerSpeed, setTimerSpeed } = dataContext;

  const toggleMode = () => {
    setTimedModeEnabled(!timedModeEnabled);
    console.log("set Timed mode enabled to ", !timedModeEnabled);
  };

  const resetStatistics = () => {
    setCorrectArrayState(Array.from({ length: 10 }, () => ({ total: 0, correct: 0 })));
    setTimeToAnswerCorrectArrayState(Array.from({ length: 10 }, () => ({ total: 0, totalTime: 0 })));
  };

  const handleSliderChange = (value: number) => {
    setTimerSpeed(value);
    setCorrectArrayState(Array.from({ length: 10 }, () => ({ total: 0, correct: 0 })));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMode} style={styles.modeButton}>
        <Text style={styles.modeButtonText}>{ timedModeEnabled ? 'Enable Flash Mode' : 'Enable Timed Mode'}</Text>
      </TouchableOpacity>
      
      <Text style={styles.text}>Flash Speed: {timerSpeed} ms (resets stats)</Text>
      <Slider
        style={styles.slider}
        minimumValue={100}
        maximumValue={2000}
        step={100}
        value={timerSpeed}
        onValueChange={handleSliderChange}
        minimumTrackTintColor="#ffd33d"
        maximumTrackTintColor="#ffffff"
        thumbTintColor="#ffd33d"
      />
      
      <TouchableOpacity onPress={resetStatistics} style={styles.resetButton}>
        <Text style={styles.resetButtonText}>Reset Data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  modeButton: {
    backgroundColor: '#ffd33d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  modeButtonText: {
    color: '#25292e',
    fontSize: 18,
    alignContent: 'center',
  },
  slider: {
    width: 300,
    height: 40,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    alignContent: 'center',
  },
});