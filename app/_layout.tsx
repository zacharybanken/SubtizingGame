import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { DataProvider } from './DataContext';


export default function RootLayout() {
  return (
    <DataProvider>
        <Stack initialRouteName="index">
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
        </Stack>
    </DataProvider>
    
  );
}

