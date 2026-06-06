import { createContext, useContext } from 'react';

export const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

export const lightTheme = {
  dark: false,
  background: '#F4F4F8',
  backgroundSecondary: '#EAEAF2',
  card: '#FFFFFF',
  text: '#0A0A14',
  textSecondary: '#4A4A5A',
  textMuted: '#9090A8',
  border: '#E2E2EC',
  tabBar: '#FFFFFF',
  primary: '#6C63FF',
  primaryDark: '#5A52E8',
  primaryLight: '#8B85FF',
  primaryGlow: 'rgba(108,99,255,0.10)',
  danger: '#E53535',
  success: '#00C896',
  warning: '#FFB547',
  categories: {
    Food:      { bg: 'rgba(229,53,53,0.08)',   color: '#E53535' },
    Transport: { bg: 'rgba(0,167,157,0.08)',   color: '#00A79D' },
    Utilities: { bg: 'rgba(210,130,0,0.08)',   color: '#D28200' },
    Shopping:  { bg: 'rgba(108,99,255,0.08)',  color: '#6C63FF' },
    Health:    { bg: 'rgba(0,168,100,0.08)',   color: '#00A864' },
    Other:     { bg: 'rgba(120,120,150,0.08)', color: '#787896' },
  },
};

export const darkTheme = {
  dark: true,
  background: '#080810',
  backgroundSecondary: '#0F0F1C',
  card: '#111122',
  text: '#F0F0FF',
  textSecondary: '#A0A0C0',
  textMuted: '#5A5A8A',
  border: '#1E1E38',
  tabBar: '#0C0C1A',
  primary: '#7C74FF',
  primaryDark: '#6C63FF',
  primaryLight: '#9B95FF',
  primaryGlow: 'rgba(124,116,255,0.10)',
  danger: '#FF5A5A',
  success: '#00C896',
  warning: '#FFB547',
  categories: {
    Food:      { bg: 'rgba(255,107,107,0.12)', color: '#FF7B7B' },
    Transport: { bg: 'rgba(78,205,196,0.12)',  color: '#5EDDD4' },
    Utilities: { bg: 'rgba(255,181,71,0.12)',  color: '#FFC060' },
    Shopping:  { bg: 'rgba(124,116,255,0.12)', color: '#8C85FF' },
    Health:    { bg: 'rgba(0,200,150,0.12)',   color: '#00D8A8' },
    Other:     { bg: 'rgba(144,144,168,0.12)', color: '#A0A0C0' },
  },
};