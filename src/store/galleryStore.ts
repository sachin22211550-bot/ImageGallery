import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from '../types';

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

interface GalleryStore {
  images: Image[];
  favorites: string[];
  searchQuery: string;
  filter: 'all' | 'a-m' | 'n-z';
  page: number;
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
  setImages: (images: Image[]) => void;
  appendImages: (images: Image[]) => void;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: 'all' | 'a-m' | 'n-z') => void;
  toggleFavorite: (imageId: string, userEmail: string) => Promise<void>;
  loadFavorites: (userEmail: string) => Promise<void>;
  clearFavorites: () => void;
  setLoading: (loading: boolean) => void;
  setRefreshing: (refreshing: boolean) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  getFilteredImages: () => Image[];
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  images: [],
  favorites: [],
  searchQuery: '',
  filter: 'all',
  page: 1,
  isLoading: false,
  isRefreshing: false,
  hasMore: true,

  setImages: (images: Image[]) => {
    set({ images, page: 1, hasMore: images.length >= 50 });
  },

  appendImages: (images: Image[]) => {
    set((state) => ({
      images: [...state.images, ...images],
      hasMore: images.length >= 50,
    }));
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setFilter: (filter: 'all' | 'a-m' | 'n-z') => {
    set({ filter });
  },

  toggleFavorite: async (imageId: string, userEmail: string) => {
    try {
      const { favorites } = get();
      const newFavorites = favorites.includes(imageId)
        ? favorites.filter((id) => id !== imageId)
        : [...favorites, imageId];

      set({ favorites: newFavorites });
      await safeAsyncStorage.setItem(`favorites_${userEmail}`, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  },

  loadFavorites: async (userEmail: string) => {
    try {
      const storedFavorites = await safeAsyncStorage.getItem(`favorites_${userEmail}`);
      if (storedFavorites) {
        set({ favorites: JSON.parse(storedFavorites) });
      } else {
        set({ favorites: [] });
      }
    } catch (error) {
      console.error('Load favorites error:', error);
    }
  },

  clearFavorites: () => {
    set({ favorites: [] });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setRefreshing: (refreshing: boolean) => {
    set({ isRefreshing: refreshing });
  },

  setPage: (page: number) => {
    set({ page });
  },

  setHasMore: (hasMore: boolean) => {
    set({ hasMore });
  },

  getFilteredImages: () => {
    const { images, searchQuery, filter } = get();
    
    let filtered = images;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((image) =>
        image.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply author name filter
    if (filter === 'a-m') {
      filtered = filtered.filter((image) =>
        image.author.toLowerCase().charAt(0) >= 'a' &&
        image.author.toLowerCase().charAt(0) <= 'm'
      );
    } else if (filter === 'n-z') {
      filtered = filtered.filter((image) =>
        image.author.toLowerCase().charAt(0) >= 'n' &&
        image.author.toLowerCase().charAt(0) <= 'z'
      );
    }

    return filtered;
  },
}));
