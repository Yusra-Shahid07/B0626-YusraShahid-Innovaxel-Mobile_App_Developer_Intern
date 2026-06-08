import { createContext, useContext } from "react";

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const lightTheme = {
  dark: false,
  backgroundSecondary: "#E8E8F2",
  background: "#EEEEF8",
  card: "#FFFFFF",
  border: "#D0D0E8",
  tabBar: "#FFFFFF",
  surface: "#E8E8F2",
  header: "#4F46E5",
  text: "#0A0A14",
  textSecondary: "#4A4A5A",
  textMuted: "#9090A8",

  primary: "#6C63FF",
  primaryGlow: "rgba(108,99,255,0.10)",
  primaryDark: "#5A52E8",
  primaryLight: "#8B85FF",

  danger: "#E53535",
  success: "#00C896",
  warning: "#FFB547",

  categories: {
    Food: { bg: "rgba(108,99,255,0.08)", color: "#6C63FF" },
    Transport: { bg: "rgba(108,99,255,0.08)", color: "#6C63FF" },
    Utilities: { bg: "rgba(108,99,255,0.08)", color: "#6C63FF" },
    Shopping: { bg: "rgba(108,99,255,0.08)", color: "#6C63FF" },
    Health: { bg: "rgba(108,99,255,0.08)", color: "#6C63FF" },
    Other: { bg: "rgba(108,99,255,0.08)", color: "#6C63FF" },
  },
};

export const darkTheme = {
  dark: true,
  background: "#080810",
  backgroundSecondary: "#0F0F1C",
  card: "#111122",
  text: "#F0F0FF",
  textSecondary: "#A0A0C0",
  textMuted: "#5A5A8A",
  border: "#1E1E38",
  tabBar: "#0C0C1A",
  primary: "#7C74FF",
  primaryDark: "#6C63FF",
  primaryLight: "#9B95FF",
  primaryGlow: "rgba(124,116,255,0.10)",
  danger: "#FF5A5A",
  success: "#00C896",
  warning: "#FFB547",
  surface: "#1A1A2E",
  categories: {
    Food: { bg: "rgba(124,116,255,0.15)", color: "#A89EFF" },
    Transport: { bg: "rgba(124,116,255,0.15)", color: "#A89EFF" },
    Utilities: { bg: "rgba(124,116,255,0.15)", color: "#A89EFF" },
    Shopping: { bg: "rgba(124,116,255,0.15)", color: "#A89EFF" },
    Health: { bg: "rgba(124,116,255,0.15)", color: "#A89EFF" },
    Other: { bg: "rgba(124,116,255,0.15)", color: "#A89EFF" },
  },
};
