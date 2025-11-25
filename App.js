import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DailyEntryScreen from './src/screens/DailyEntryScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import WeeklySummaryScreen from './src/screens/WeeklySummaryScreen';
import { MoodProvider } from './src/context/MoodContext';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <MoodProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: '#F6A544',
            tabBarInactiveTintColor: '#B3A8A0',
            tabBarLabelStyle: {
              fontSize: 12,
              marginBottom: 4,
            },
            tabBarStyle: {
              height: 64,
              paddingBottom: 8,
              paddingTop: 6,
              backgroundColor: '#FBF7F1',
              borderTopColor: '#E1D7CC',
              borderTopWidth: 1,
            },
            tabBarIcon: ({ color, focused }) => {
              let iconChar = '📝';

              if (route.name === 'History') {
                iconChar = '📜';
              } else if (route.name === 'Summary') {
                iconChar = '📊';
              }

              return (
                <Text style={{ color, fontSize: focused ? 20 : 18 }}>
                  {iconChar}
                </Text>
              );
            },
          })}
        >
          <Tab.Screen
            name="Entry"
            component={DailyEntryScreen}
            options={{ title: 'Entry' }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: 'History' }}
          />
          <Tab.Screen
            name="Summary"
            component={WeeklySummaryScreen}
            options={{ title: 'Summary' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </MoodProvider>
  );
}
