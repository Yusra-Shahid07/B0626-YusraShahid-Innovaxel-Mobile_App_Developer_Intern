import React, { useState } from "react";
import { ThemeContext, lightTheme, darkTheme } from "./src/constants/theme";
import AppNavigator from "./src/navigation/AppNavigator";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  const oldTextRender = Text.render;
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = [{ fontFamily: "Inter_400Regular" }];
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.style = [{ fontFamily: "Inter_400Regular" }];

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, toggleTheme: () => setIsDark((prev) => !prev) }}
    >
      <AppNavigator />
    </ThemeContext.Provider>
  );
}
