import React, { useContext } from 'react';
import { TouchableOpacity, Text, View, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeContext } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import SummaryScreen from '../screens/SummaryScreen';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home:         { active: '⬛', inactive: '⬜', label: 'Home' },
  'Add Expense':{ active: '+',  inactive: '+',  label: 'Add' },
  Summary:      { active: '▦',  inactive: '▤',  label: 'Summary' },
};

export default function AppNavigator() {
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: theme.card,
            shadowColor: 'transparent',
            elevation: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.border,
          },
          headerTitleStyle: {
            fontSize: 17,
            fontWeight: '700',
            color: theme.text,
            letterSpacing: -0.3,
          },
          headerTintColor: theme.text,
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                marginRight: 16,
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: theme.primaryGlow,
                borderWidth: 1,
                borderColor: theme.primary + '40',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 16 }}>{isDark ? '☀' : '◑'}</Text>
            </TouchableOpacity>
          ),
          tabBarStyle: {
            backgroundColor: theme.tabBar,
            borderTopWidth: 1,
            borderTopColor: theme.border,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 80 : 62,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textMuted,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 0.3,
            marginTop: 2,
          },
          tabBarIcon: ({ focused, color }) => {
            if (route.name === 'Add Expense') {
              return (
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  backgroundColor: focused ? theme.primary : theme.primaryGlow,
                  borderWidth: 1.5,
                  borderColor: theme.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: 20,
                    fontWeight: '300',
                    color: focused ? '#fff' : theme.primary,
                    lineHeight: 24,
                  }}>+</Text>
                </View>
              );
            }
            if (route.name === 'Home') {
              return (
                <View style={{
                  width: 22, height: 22,
                  justifyContent: 'center', alignItems: 'center',
                }}>
                  <View style={{
                    width: 20, height: 20, borderRadius: 5,
                    borderWidth: focused ? 0 : 1.5,
                    borderColor: color,
                    backgroundColor: focused ? color : 'transparent',
                  }} />
                </View>
              );
            }
            if (route.name === 'Summary') {
              return (
                <View style={{ width: 22, height: 22, justifyContent: 'center', alignItems: 'center', gap: 3 }}>
                  {[80, 55, 95].map((w, i) => (
                    <View key={i} style={{
                      width: (w / 100) * 18,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: focused ? color : theme.textMuted,
                    }} />
                  ))}
                </View>
              );
            }
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: 'Home', title: 'Expenses' }}
        />
        <Tab.Screen
          name="Add Expense"
          component={AddExpenseScreen}
          options={{ tabBarLabel: 'Add', title: 'New Expense' }}
        />
        <Tab.Screen
          name="Summary"
          component={SummaryScreen}
          options={{ tabBarLabel: 'Summary', title: 'Summary' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}