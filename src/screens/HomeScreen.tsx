import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, Image as ImageType } from '../types';
import { useGalleryStore } from '../store/galleryStore';
import { useAuthStore } from '../store/authStore';
import { useApi } from '../hooks/useApi';
import { useDebounce } from '../hooks/useDebounce';
import { Ionicons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'HomeScreen'>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { fetchImages } = useApi();
  const user = useAuthStore((state) => state.user);

  const {
    images,
    favorites,
    searchQuery,
    filter,
    page,
    isLoading,
    isRefreshing,
    hasMore,
    setImages,
    appendImages,
    setSearchQuery,
    setFilter,
    toggleFavorite,
    setLoading,
    setRefreshing,
    setPage,
    setHasMore,
    getFilteredImages,
    loadFavorites,
  } = useGalleryStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (user) {
      loadFavorites(user.email);
    }
  }, [user, loadFavorites]);

  const loadImages = useCallback(async (pageNum: number = 1, isRefresh: boolean = false) => {
    if (isLoading && !isRefresh) return;

    setLoading(true);
    try {
      const newImages = await fetchImages(pageNum, 50);

      if (isRefresh) {
        setImages(newImages);
      } else {
        appendImages(newImages);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchImages, isLoading, setLoading, setRefreshing, setImages, appendImages]);

  useEffect(() => {
    loadImages(1, true);
  }, []);

  useEffect(() => {
    if (page > 1) {
      loadImages(page, false);
    }
  }, [page]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    loadImages(1, true);
  }, [setRefreshing, setPage, loadImages]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(page + 1);
    }
  }, [isLoading, hasMore, page, setPage]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleFilterChange = (newFilter: 'all' | 'a-m' | 'n-z') => {
    setFilter(newFilter);
  };

  const handleToggleFavorite = async (imageId: string) => {
    if (user) {
      await toggleFavorite(imageId, user.email);
    }
  };

  const handleImagePress = (image: ImageType) => {
    navigation.navigate('ImageDetails', { image });
  };

  const filteredImages = getFilteredImages();

  const renderImageItem = ({ item }: { item: ImageType }) => {
    const isFavorite = favorites.includes(item.id);
    
    return (
      <TouchableOpacity
        style={styles.imageCard}
        onPress={() => handleImagePress(item)}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.download_url }} style={styles.image} />
        <View style={styles.imageInfo}>
          <Text style={styles.author} numberOfLines={1}>
            {item.author}
          </Text>
          <Text style={styles.imageId}>ID: {item.id}</Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => handleToggleFavorite(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#FF3B30' : '#999'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by author name..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'a-m' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('a-m')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'a-m' && styles.filterTextActive]}>
            A-M
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'n-z' && styles.filterButtonActive]}
          onPress={() => handleFilterChange('n-z')}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, filter === 'n-z' && styles.filterTextActive]}>
            N-Z
          </Text>
        </TouchableOpacity>
      </View>

      {filteredImages.length === 0 && !isLoading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="images-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No images found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredImages}
          renderItem={renderImageItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingRight: 40,
    fontSize: 16,
  },
  searchIcon: {
    position: 'absolute',
    right: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 8,
  },
  imageCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  imageInfo: {
    padding: 12,
  },
  author: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  imageId: {
    fontSize: 12,
    color: '#999',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  footerLoader: {
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});
