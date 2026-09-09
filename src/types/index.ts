export interface User {
  fullName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  mobileNumber: string;
  address: string;
  city: string;
  password: string;
  avatar?: string;
}

export interface Image {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface GalleryState {
  images: Image[];
  favorites: string[];
  searchQuery: string;
  filter: 'all' | 'a-m' | 'n-z';
  page: number;
  isLoading: boolean;
  isRefreshing: boolean;
  hasMore: boolean;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
  ImageDetails: { image: Image };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  HomeScreen: undefined;
  FavoritesScreen: undefined;
  ProfileScreen: undefined;
  ImageDetails: { image: Image };
};
