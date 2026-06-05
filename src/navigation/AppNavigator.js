import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import SummaryScreen from '../screens/SummaryScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Add Expense" component={AddExpenseScreen} />
        <Tab.Screen name="Summary" component={SummaryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}