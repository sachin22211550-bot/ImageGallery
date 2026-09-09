import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../constants/theme';

// Helper function to safely use AsyncStorage
const safeAsyncStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('AsyncStorage error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage error:', error);
    }
  },
};

interface ThemeStore {
  isDarkMode: boolean;
  theme: Theme;
  toggleTheme: () => Promise<void>;
  loadTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDarkMode: false,
  theme: lightTheme,

  toggleTheme: async () => {
    const { isDarkMode } = get();
    const newMode = !isDarkMode;
    
    set({
      isDarkMode: newMode,
      theme: newMode ? darkTheme : lightTheme,
    });
    
    await safeAsyncStorage.setItem('isDarkMode', JSON.stringify(newMode));
  },

  loadTheme: async () => {
    try {
      const storedMode = await safeAsyncStorage.getItem('isDarkMode');
      if (storedMode !== null) {
        const isDarkMode = JSON.parse(storedMode);
        set({
          isDarkMode,
          theme: isDarkMode ? darkTheme : lightTheme,
        });
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  },
}));
