import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

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
};

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (user: User) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  register: async (user: User) => {
    try {
      const existingUsers = await safeAsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userExists = users.some((u: User) => u.email === user.email);
      if (userExists) {
        throw new Error('User with this email already exists');
      }

      users.push(user);
      await safeAsyncStorage.setItem('users', JSON.stringify(users));
      
      set({ user, isAuthenticated: true });
      await safeAsyncStorage.setItem('currentUser', JSON.stringify(user));
    } catch (error) {
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const existingUsers = await safeAsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const user = users.find(
        (u: User) => u.email === email && u.password === password
      );

      if (user) {
        set({ user, isAuthenticated: true });
        await safeAsyncStorage.setItem('currentUser', JSON.stringify(user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      console.log('Starting logout...');
      await safeAsyncStorage.removeItem('currentUser');
      console.log('Removed currentUser from AsyncStorage');
      set({ user: null, isAuthenticated: false });
      console.log('Updated store state');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  updateUser: async (updatedUser: User) => {
    try {
      const existingUsers = await safeAsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userIndex = users.findIndex((u: User) => u.email === updatedUser.email);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await safeAsyncStorage.setItem('users', JSON.stringify(users));
      }
      
      await safeAsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      console.error('Update user error:', error);
    }
  },

  loadUser: async () => {
    try {
      const currentUser = await safeAsyncStorage.getItem('currentUser');
      if (currentUser) {
        const user = JSON.parse(currentUser);
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Load user error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
