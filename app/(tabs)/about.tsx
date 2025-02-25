import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { BarChart } from 'react-native-chart-kit';
import { useData } from '../DataContext';

export default function StatsScreen() {
  const dataContext = useData();
  if (!dataContext) {
    return null; // or handle the undefined case appropriately
  }
  
  const { correctArrayState, timeToAnswerCorrectArrayState, timerSpeed } = dataContext;
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 40; // Adjust width to fit the screen
  
  // Add these console logs to see what data is being received from context
  console.log("correctArrayState:", JSON.stringify(correctArrayState));
  console.log("timeToAnswerCorrectArrayState:", JSON.stringify(timeToAnswerCorrectArrayState));
  
  const calculatePercentageArray = () => {
    return correctArrayState.map((item) => {
      if (item.total === 0) {
        return 0;
      }
      return (item.correct / item.total) * 100;
    });
  };

  const calculateAvgTimeArray = () => {
    // Make sure we're properly calculating the time data
    return timeToAnswerCorrectArrayState.map((item) => {
      if (item.total === 0) {
        return 0;
      }
      // Convert to milliseconds if needed or keep as is depending on your data
      return (item.totalTime / item.total);
    });
  };

  // Initialize with empty data first
  const [flashData, setFlashData] = useState({
    labels: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
    datasets: [{ data: Array(10).fill(0) }],
  });

  const [timedData, setTimedData] = useState({
    labels: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
    datasets: [{ data: Array(10).fill(0) }],
  });

  // Explicitly handle flash data updates
  useEffect(() => {
    console.log("Flash data effect triggered");
    const percentageArray = calculatePercentageArray();
    console.log("Flash data calculated:", percentageArray);
    
    setFlashData({
      labels: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
      datasets: [{ data: percentageArray }],
    });
    console.log("setting flash data");
  }, [correctArrayState]);

  // Explicitly handle timed data updates
  useEffect(() => {
    console.log("Timed data effect triggered");
    const avgTimeArray = calculateAvgTimeArray();
    console.log("Timed data calculated:", avgTimeArray);
    
    setTimedData({
      labels: Array.from({ length: 10 }, (_, i) => (i + 1).toString()),
      datasets: [{ data: avgTimeArray }],

    });
    console.log("setting timed data");
  }, [timeToAnswerCorrectArrayState]);

  const flashTotal = correctArrayState.reduce((sum, item) => sum + item.total, 0);
  console.log("flashTotal:", flashTotal);
  const timedTotal = timeToAnswerCorrectArrayState.reduce((sum, item) => sum + item.total, 0);
  console.log("timedTotal:", timedTotal);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Flash ({ timerSpeed }ms, N = { flashTotal })</Text>
      <BarChart
        style={styles.chart}
        data={flashData}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix='%'
        chartConfig={flashChartConfig}
        verticalLabelRotation={0}
      />
      <View style={styles.divider} />
      <Text style={styles.text}>Timed (N = { timedTotal })</Text>
      <BarChart
        style={styles.chart}
        data={timedData}
        width={chartWidth}
        height={220}
        yAxisLabel=""
        yAxisSuffix='ms'
        chartConfig={timedChartConfig}
        verticalLabelRotation={0}
      />
    </View>
  );
}

const flashChartConfig = {
  backgroundGradientFrom: "#25292e",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#25292e",
  backgroundGradientToOpacity: 0,
  decimalPlaces: 0, // No decimal places
  color: (opacity = 1) => `rgba(255, 211, 61, ${opacity})`, // Orange highlight color
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForBackgroundLines: {
    strokeWidth: 0, // Remove dashed lines
  },
  propsForLabels: {
    fontSize: 12,
    fontFamily: 'System', // Use the same font as the rest of the app
  },
};

const timedChartConfig = {
  ...flashChartConfig,
  decimalPlaces: 0, // optionally include decimal places
};

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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: '#9e9e9e',
    opacity: 0.25,
    marginVertical: 20,
  },
});