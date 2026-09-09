import { useCallback } from 'react';

export const usePagination = (
  fetchData: (page: number) => Promise<void>,
  hasMore: boolean,
  isLoading: boolean
) => {
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    fetchData(1);
  }, [fetchData, hasMore, isLoading]);

  return { loadMore };
};
