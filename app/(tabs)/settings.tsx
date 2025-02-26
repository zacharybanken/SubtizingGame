import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useData } from '../DataContext';

export default function SettingsScreen() {
  const dataContext = useData();
  if (!dataContext) {
    return null; // or handle the undefined case appropriately
  }
  const { 
    setCorrectArrayState, 
    setTimeToAnswerCorrectArrayState, 
    timedModeEnabled, 
    setTimedModeEnabled, 
    timerSpeed, 
    setTimerSpeed,
    distractionDotsEnabled,
    setDistractionDotsEnabled,
    distractionDots,
    setDistractionDots,
    numDots,
    setNumDots
  } = dataContext;

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

  const toggleDistractionDots = () => {
    setDistractionDotsEnabled(!distractionDotsEnabled);
  };

  const handleDistractionDotsChange = (values: number[]) => {
    setDistractionDots(values);
  };

  const handleNumDotsChange = (values: number[]) => {
    setNumDots(values);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Number of dots: {numDots[0]}-{numDots[1]}</Text>
      <MultiSlider
        min={1}
        max={25}
        step={1}
        values={numDots}
        onValuesChange={handleNumDotsChange}
        selectedStyle={{ backgroundColor: "#ffd33d" }}
        unselectedStyle={{ backgroundColor: "#ffffff" }}
        markerStyle={{ backgroundColor: "#ffd33d" }}
        minMarkerOverlapDistance={1}
      />

      <TouchableOpacity onPress={toggleMode} style={styles.modeButton}>
        <Text style={styles.modeButtonText}>{ timedModeEnabled ? 'Enable Flash Mode' : 'Enable Timed Mode'}</Text>
      </TouchableOpacity>
      {!timedModeEnabled && (
        <>
          <Text style={styles.text}>Flash speed: {timerSpeed} ms</Text>
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
        </>
      )}

      <TouchableOpacity onPress={toggleDistractionDots} style={styles.modeButton}>
        <Text style={styles.modeButtonText}>{ distractionDotsEnabled ? 'Disable Distraction Dots' : 'Enable Distraction Dots'}</Text>
      </TouchableOpacity>

      {distractionDotsEnabled && (
        <>
          <Text style={styles.text}>Number of distraction dots: {distractionDots[0]}-{distractionDots[1]}</Text>
          <MultiSlider
            min={1}
            max={25}
            step={1}
            values={distractionDots}
            onValuesChange={handleDistractionDotsChange}
            selectedStyle={{ backgroundColor: "#ffd33d" }}
            unselectedStyle={{ backgroundColor: "#ffffff" }}
            markerStyle={{ backgroundColor: "#ffd33d" }}
            minMarkerOverlapDistance={1}
          />  
        </>
      )}

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
    padding: 20,
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
    alignContent: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    alignContent: 'center',
  },
});