import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useGalleryStore } from '../store/galleryStore';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Navigation = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const loadUser = useAuthStore((state) => state.loadUser);
  const loadTheme = useThemeStore((state) => state.loadTheme);
  const clearFavorites = useGalleryStore((state) => state.clearFavorites);
  const [key, setKey] = useState(0);

  useEffect(() => {
    loadUser();
    loadTheme();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      clearFavorites();
      setKey((prev) => prev + 1);
    }
  }, [isAuthenticated, clearFavorites]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <NavigationContainer key={key}>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
