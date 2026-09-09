import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList, Image as ImageType } from '../types';
import { useGalleryStore } from '../store/galleryStore';
import { useAuthStore } from '../store/authStore';
import { useDebounce } from '../hooks/useDebounce';
import { Ionicons } from '@expo/vector-icons';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'FavoritesScreen'>;

export const FavoritesScreen = () => {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const user = useAuthStore((state) => state.user);

  const {
    images,
    favorites,
    searchQuery,
    setSearchQuery,
    toggleFavorite,
    loadFavorites,
  } = useGalleryStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (user) {
      loadFavorites(user.email);
    }
  }, [user, loadFavorites]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleToggleFavorite = async (imageId: string) => {
    if (user) {
      await toggleFavorite(imageId, user.email);
    }
  };

  const handleImagePress = (image: ImageType) => {
    navigation.navigate('ImageDetails', { image });
  };

  const favoriteImages = images.filter((image) => favorites.includes(image.id));
  
  const filteredFavorites = favoriteImages.filter((image) =>
    image.author.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const renderImageItem = ({ item }: { item: ImageType }) => {
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
          <Ionicons name="heart" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (favoriteImages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No favorites yet</Text>
        <Text style={styles.emptySubtext}>
          Tap the heart icon on any image to add it to your favorites
        </Text>
      </View>
    );
  }

  if (filteredFavorites.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search favorites..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No matching favorites</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search favorites..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
      </View>

      <FlatList
        data={filteredFavorites}
        renderItem={renderImageItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
      />
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
});
