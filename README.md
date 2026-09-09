# Image Gallery App

A React Native mobile application built with Expo that demonstrates user authentication, image gallery with search/filter functionality, favorites management, and profile editing.

## Features

### Core Features
- **User Authentication**
  - User registration with comprehensive validation
  - Login with credential validation
  - Session persistence using AsyncStorage
  - Logout functionality

- **Image Gallery**
  - Fetch images from Picsum Photos API
  - Display images in a responsive grid layout using FlatList
  - Pull-to-refresh functionality
  - Infinite scrolling/pagination
  - Real-time search by author name (case-insensitive)
  - Filter images by author name (All, A-M, N-Z)
  - Mark/unmark images as favorites
  - Favorites persistence across app restarts

- **Image Details**
  - Full-screen image viewer
  - Download images to device gallery
  - Share image links
  - Display image metadata (author, ID, dimensions)

- **Profile Management**
  - View user profile information
  - Edit and update profile details
  - Profile avatar selection
  - Dark mode toggle

### Bonus Features
- **Dark Mode Support** - Toggle between light and dark themes with persistence
- **Debounced Search** - Optimized search with 500ms debounce
- **Reusable Components** - Modular UI components (Button, Input, Card, RadioButton, Dropdown)
- **Custom Hooks** - Reusable hooks for API handling, pagination, local storage, and debouncing
- **Centralized State Management** - Zustand for scalable state management without prop drilling

## Technical Stack

### Mandatory Technologies
- **React Native** - Mobile framework
- **TypeScript** - Type safety
- **Expo** - Development platform
- **React Navigation** - Navigation (Native Stack + Bottom Tabs)
- **AsyncStorage** - Local data persistence
- **Zustand** - Centralized state management

### Additional Libraries
- **@expo/vector-icons** - Icon library
- **expo-file-system** - File system operations
- **expo-media-library** - Media library access for saving images
- **expo-image-picker** - Image picker (for future avatar selection)

## Project Structure

```
ImageGalleryApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── RadioButton.tsx
│   ├── constants/           # App constants
│   │   └── theme.ts        # Theme configurations
│   ├── hooks/              # Custom React hooks
│   │   ├── useApi.ts       # API handling hook
│   │   ├── useDebounce.ts  # Debounce hook
│   │   ├── useLocalStorage.ts
│   │   └── usePagination.ts
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── Navigation.tsx
│   ├── screens/            # Screen components
│   │   ├── FavoritesScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ImageDetailsScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── store/              # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── galleryStore.ts
│   │   └── themeStore.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   └── utils/              # Utility functions
├── App.tsx                 # Main app component
├── app.json                # Expo configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Expo Go app on your physical device (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ImageGalleryApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run the app**
   - **iOS**: Press `i` in the terminal or run `npm run ios`
   - **Android**: Press `a` in the terminal or run `npm run android`
   - **Web**: Press `w` in the terminal or run `npm run web`
   - **Expo Go**: Scan the QR code with Expo Go app

### Building for Production

#### iOS
```bash
npm run ios
# Then use Xcode to build and archive
```

#### Android
```bash
npm run android
# Then use Android Studio to build the APK
```

## Assumptions Made During Development

1. **User Data Storage**: User credentials and profile data are stored locally using AsyncStorage. In a production app, this should be replaced with a secure backend API.

2. **Image API**: The app uses the Picsum Photos public API for image data. No authentication is required for this API.

3. **Image Download**: Image download functionality uses expo-file-system and expo-media-library. Permission handling is implemented for iOS and Android.

4. **City Selection**: A predefined list of 10 major US cities is provided for the city dropdown. This can be expanded based on requirements.

5. **Validation Rules**:
   - Email: Standard email format validation
   - Mobile Number: Exactly 10 digits, numeric only
   - Password: Minimum 6 characters
   - All fields are mandatory during registration

6. **Pagination**: The app implements client-side pagination by fetching 50 images per page from the API.

7. **Search & Filter**: Search and filter work together - search filters by author name, and filter groups by author name range.

8. **Dark Mode**: Theme preference is persisted in AsyncStorage and loaded on app startup.

## Libraries Used

### Core Dependencies
- `react` & `react-native` - Core React Native libraries
- `expo` - Expo SDK
- `typescript` - TypeScript compiler

### Navigation
- `@react-navigation/native` - Navigation core
- `@react-navigation/native-stack` - Native stack navigator
- `@react-navigation/bottom-tabs` - Bottom tab navigator

### State Management
- `zustand` - Lightweight state management

### Storage
- `@react-native-async-storage/async-storage` - Local storage

### UI Components
- `@expo/vector-icons` - Icon library
- `react-native-safe-area-context` - Safe area handling
- `react-native-screens` - Optimized screens

### File Operations
- `expo-file-system` - File system access
- `expo-media-library` - Media library access

## API Integration

### Picsum Photos API
- **Endpoint**: `https://picsum.photos/v2/list`
- **Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of images per page (default: 50)
- **Response**: Array of image objects with id, author, width, height, url, and download_url

## State Management Architecture

The app uses Zustand for centralized state management with three main stores:

1. **authStore**: Manages user authentication state, user data, and auth operations
2. **galleryStore**: Manages image data, favorites, search query, filter, and pagination
3. **themeStore**: Manages theme preferences (light/dark mode)

This architecture avoids prop drilling and provides a scalable solution for state management.

## Code Quality & Best Practices

- **TypeScript**: Full type safety across the application
- **Functional Components**: All components are functional with React Hooks
- **Custom Hooks**: Reusable logic extracted into custom hooks
- **Component Reusability**: Common UI patterns abstracted into reusable components
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Validation**: Form validation with clear error messages
- **Code Organization**: Logical folder structure for maintainability
- **Performance**: Optimized with debouncing, lazy loading, and efficient state updates

## Future Enhancements

- Backend API integration for user authentication
- Real-time image upload functionality
- Advanced image editing capabilities
- Social sharing features
- Image categorization and albums
- Offline mode with data synchronization
- Push notifications
- Analytics integration

## License

This project is created for educational purposes as part of a React Native internship assignment.

## Contact

For questions or feedback, please contact the development team.
