import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F29F67', // Orange Primary
    },
    secondary: {
      main: '#3B8FF3', // Blue
    },
    info: {
      main: '#3B8FF3',
    },
    success: {
      main: '#34B1AA', // Teal
    },
    warning: {
      main: '#E0B50F', // Yellow
    },
    background: {
      default: '#F7F8FA', // Light gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1E2C', // Dark Navy text
      secondary: '#666666',
    },
  },
  shape: {
    borderRadius: 12, // 12-16px radius for cards
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F29F67',
    },
    secondary: {
      main: '#3B8FF3',
    },
    info: {
      main: '#3B8FF3',
    },
    success: {
      main: '#34B1AA',
    },
    warning: {
      main: '#E0B50F',
    },
    background: {
      default: '#12121A', // Darker than sidebar
      paper: '#1E1E2C', // Sidebar / Card background
    },
    text: {
      primary: '#F7F8FA',
      secondary: '#A0A0B0',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
