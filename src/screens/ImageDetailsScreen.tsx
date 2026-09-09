import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../types';
import { Button } from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

type ImageDetailsScreenRouteProp = RouteProp<AppStackParamList, 'ImageDetails'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const ImageDetailsScreen = () => {
  const route = useRoute<ImageDetailsScreenRouteProp>();
  const { image } = route.params;

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (Platform.OS === 'web') {
        // For web, trigger browser download
        const link = document.createElement('a');
        link.href = image.download_url;
        link.download = `image_${image.id}.jpg`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        Alert.alert('Success', 'Image download started');
      } else {
        // Dynamic import for mobile
        let FileSystem: any = null;
        let MediaLibrary: any = null;
        
        try {
          FileSystem = require('expo-file-system').default;
          MediaLibrary = require('expo-media-library/legacy').default;
        } catch (importError) {
          console.error('Failed to import native modules:', importError);
          Alert.alert(
            'Download Not Available',
            'Media library access is limited in Expo Go. To use full download features, create a development build.'
          );
          setIsDownloading(false);
          return;
        }

        if (!FileSystem || !MediaLibrary) {
          Alert.alert(
            'Download Not Available',
            'Media library access is limited in Expo Go. To use full download features, create a development build.'
          );
          setIsDownloading(false);
          return;
        }
        
        // Request permissions
        const { status } = await MediaLibrary.requestPermissionsAsync();
        
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Please grant permission to save photos');
          setIsDownloading(false);
          return;
        }

        // Download the image
        const downloadResult = await FileSystem.downloadAsync(
          image.download_url,
          FileSystem.documentDirectory + `image_${image.id}.jpg`
        );

        if (downloadResult.status === 200) {
          // Save to media library
          const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
          await MediaLibrary.createAlbumAsync('ImageGallery', asset, false);
          
          Alert.alert('Success', 'Image saved to gallery');
        } else {
          throw new Error('Download failed');
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert(
        'Download Not Available',
        'Media library access is limited in Expo Go. To use full download features, create a development build.'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    // In a real implementation, you would use Share.share()
    Alert.alert('Share', 'Share functionality would be implemented here');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setIsFullScreen(true)}
      >
        <Image
          source={{ uri: image.download_url }}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.author}>Author: {image.author}</Text>
        <Text style={styles.imageId}>Image ID: {image.id}</Text>
        <Text style={styles.dimensions}>
          Dimensions: {image.width} x {image.height}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Download"
          onPress={handleDownload}
          loading={isDownloading}
          style={styles.button}
        />
        <Button
          title="Share"
          onPress={handleShare}
          variant="secondary"
          style={styles.button}
        />
      </View>

      <Modal
        visible={isFullScreen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity
            style={styles.fullScreenBackground}
            activeOpacity={1}
            onPress={() => setIsFullScreen(false)}
          >
            <Image
              source={{ uri: image.download_url }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fullScreenDownloadButton}
            onPress={handleDownload}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsFullScreen(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  author: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  imageId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  dimensions: {
    fontSize: 14,
    color: '#999',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  fullScreenDownloadButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    padding: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    padding: 16,
  },
});
