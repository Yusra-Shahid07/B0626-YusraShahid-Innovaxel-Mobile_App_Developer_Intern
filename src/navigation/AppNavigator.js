import React, { useContext } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ThemeContext } from "../constants/theme";

import HomeScreen from "../screens/HomeScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import SummaryScreen from "../screens/SummaryScreen";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: { active: "⌂", inactive: "⌂" },
  "Add Expense": { active: "+", inactive: "+" },
  Summary: { active: "≡", inactive: "≡" },
};

export default function AppNavigator() {
  const { theme, isDark, toggleTheme } = useContext(ThemeContext);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: {
            backgroundColor: isDark ? theme.card : theme.primary,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? theme.border : "rgba(255,255,255,0.2)",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: isDark ? theme.text : "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "700",
            fontSize: 17,
            fontFamily: "Inter_700Bold",
            color: isDark ? theme.text : "#FFFFFF",
          },
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleTheme}
              style={{
                marginRight: 16,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: theme.primaryGlow,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 18 }}>{isDark ? "☀️" : "🌙"}</Text>
            </TouchableOpacity>
          ),
          tabBarStyle: {
            backgroundColor: isDark ? theme.tabBar : "#FFFFFF",
            borderTopColor: theme.border,
            borderTopWidth: 1,
            paddingBottom: 10,
            paddingTop: 10,
            height: 76,
            elevation: 0,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: isDark ? theme.textMuted : "#9090A8",
          tabBarLabelStyle: {
            fontSize: 13,
            fontWeight: "630",
            marginTop: 2,
          },
          tabBarIcon: ({ focused }) => (
            <Text
              style={{
                fontSize: focused ? 28 : 26,
                color: focused ? theme.primary : theme.textMuted,
                fontWeight: "700",
              }}
            >
              {focused
                ? TAB_ICONS[route.name]?.active
                : TAB_ICONS[route.name]?.inactive}
            </Text>
          ),
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Expenses", tabBarLabel: "Home" }}
        />
        <Tab.Screen
          name="Add Expense"
          component={AddExpenseScreen}
          options={({ route }) => ({
            title: route.params?.expense ? "Edit Expense" : "New Expense",
            tabBarLabel: "Add",
          })}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Add Expense", { expense: null });
            },
          })}
        />
        <Tab.Screen
          name="Summary"
          component={SummaryScreen}
          options={{ title: "Summary", tabBarLabel: "Summary" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
