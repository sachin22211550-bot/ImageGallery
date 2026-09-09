import { useState, useCallback } from 'react';
import { Image } from '../types';

export const useApi = () => {
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async (page: number = 1, limit: number = 50): Promise<Image[]> => {
    try {
      setError(null);
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return [];
    }
  }, []);

  return { fetchImages, error };
};
