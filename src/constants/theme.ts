export const lightTheme = {
  colors: {
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    primary: '#007AFF',
    secondary: '#5856D6',
    border: '#dddddd',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
  },
};

export const darkTheme = {
  colors: {
    background: '#000000',
    card: '#1c1c1e',
    text: '#ffffff',
    textSecondary: '#e5e5e5',
    textTertiary: '#a1a1a6',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    border: '#38383a',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
  },
};

export type Theme = typeof lightTheme;
