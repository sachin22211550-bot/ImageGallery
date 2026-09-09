import AsyncStorage from '@react-native-async-storage/async-storage';

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
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage error:', error);
    }
  },
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage error:', error);
    }
  },
};

export const useLocalStorage = () => {
  const getItem = async <T>(key: string): Promise<T | null> => {
    try {
      const value = await safeAsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Get item error:', error);
      return null;
    }
  };

  const setItem = async <T>(key: string, value: T): Promise<boolean> => {
    try {
      await safeAsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Set item error:', error);
      return false;
    }
  };

  const removeItem = async (key: string): Promise<boolean> => {
    try {
      await safeAsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Remove item error:', error);
      return false;
    }
  };

  const clear = async (): Promise<boolean> => {
    try {
      await safeAsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Clear error:', error);
      return false;
    }
  };

  return { getItem, setItem, removeItem, clear };
};
