import React, { useState } from 'react';
import { ThemeContext, lightTheme, darkTheme } from './src/constants/theme';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme: () => setIsDark(prev => !prev) }}>
      <AppNavigator />
    </ThemeContext.Provider>
  );
}