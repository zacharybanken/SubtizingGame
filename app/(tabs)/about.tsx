import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, Platform } from "react-native";
import { BarChart } from 'react-native-chart-kit';
import { useData } from '../DataContext';

const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

export default function StatsScreen() {
  const dataContext = useData();
  if (!dataContext) {
    return null; // or handle the undefined case appropriately
  }
  
  const { correctArrayState, timeToAnswerCorrectArrayState, timerSpeed, numDots } = dataContext;
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
  const [flashData, setFlashData] = useState<{ labels: string[], datasets: { data: number[] }[] }>({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [timedData, setTimedData] = useState<{ labels: string[], datasets: { data: number[] }[] }>({
    labels: [],
    datasets: [{ data: [] }],
  });

  // Explicitly handle flash data updates
  useEffect(() => {
    console.log("Flash data effect triggered");
    const percentageArray = calculatePercentageArray();
    console.log("Flash data calculated:", percentageArray);
    
    const filteredLabels = Array.from({ length: numDots[1] - numDots[0] + 1 }, (_, i) => (i + numDots[0]).toString());
    const filteredData = percentageArray.slice(numDots[0] - 1, numDots[1]);
    
    setFlashData({
      labels: filteredLabels,
      datasets: [{ data: filteredData }],
    });
    console.log("setting flash data");
  }, [correctArrayState, numDots]);

  // Explicitly handle timed data updates
  useEffect(() => {
    console.log("Timed data effect triggered");
    const avgTimeArray = calculateAvgTimeArray();
    console.log("Timed data calculated:", avgTimeArray);
    
    const filteredLabels = Array.from({ length: numDots[1] - numDots[0] + 1 }, (_, i) => (i + numDots[0]).toString());
    const filteredData = avgTimeArray.slice(numDots[0] - 1, numDots[1]);
    
    setTimedData({
      labels: filteredLabels,
      datasets: [{ data: filteredData }],
    });
    console.log("setting timed data");
  }, [timeToAnswerCorrectArrayState, numDots]);

  const flashTotal = correctArrayState.reduce((sum, item) => sum + item.total, 0);
  console.log("flashTotal:", flashTotal);
  const timedTotal = timeToAnswerCorrectArrayState.reduce((sum, item) => sum + item.total, 0);
  console.log("timedTotal:", timedTotal);

  const isFlashDataEmpty = flashData.datasets[0].data.every((item) => item === 0);
  const isTimedDataEmpty = timedData.datasets[0].data.every((item) => item === 0);

  return (
    <>
      {!isFlashDataEmpty && (
        <View style={styles.container}>
          <Text style={styles.text}>Flash ({ timerSpeed }ms, N = { flashTotal })</Text>
          <View style={styles.chartContainer}>
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
          </View>
          <View style={styles.divider} />
        </View>
      )}
      <View style={styles.container}>
        {isTimedDataEmpty ? (
          <Text style={styles.noDataText}>Come back with more data!</Text>
        ) : (
          <>
          <Text style={styles.text}>Timed (N = { timedTotal })</Text>
          <View style={styles.chartContainer}>
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
          </>
        )}
      </View>
    </>
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
  barPercentage: isMobile ? 0.1 : 1,
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
    padding: 20,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 20,
  },
  noDataText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  chartContainer: {
    padding: 0,
    width: '100%',
    alignItems: 'center',
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