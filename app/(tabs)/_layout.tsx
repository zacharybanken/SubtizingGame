import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#25292e',
        tabBarStyle: {
          backgroundColor: '#25292e',
          borderTopWidth: 0, // Remove the top border
          elevation: 0, // Remove the shadow on Android
          shadowOpacity: 0, // Remove the shadow on iOS
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Play',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'play-circle' : 'play-circle-outline'} color={color} size={24}/>
          ),
        }}
        />
        
      <Tabs.Screen
        name="about"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} size={24}/>
          ),
        }}
      />  
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'settings' : 'settings-outline'} color={color} size={24}/>
          ),
        }}
      /> 
    </Tabs>
  );
}