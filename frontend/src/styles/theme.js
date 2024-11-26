// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const { palette } = createTheme();
const { augmentColor } = palette;

// const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  shape: {
    borderRadius: 4,  // Default border radius for MUI components
    pillRadius: 150,   // Custom radius for pill-shaped buttons
  },
  palette: {
    primary: {
      main: '#1976d2',   // Define your primary color
      dark: '#115293',   // Darker shade for hover
    },
    secondary: {
      main: '#dc004e',   // Define a secondary color
    },
    customGreen: {
      main: "#174d38",
      dark: "#123d2e",
      contrastText: '#ffffff'
    },
  },
  
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,  // Customize the border radius
          padding: '10px 20px',  // Customize the padding
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#115293',
          },
        },
        containedSecondary: {
          backgroundColor: '#dc004e',
          '&:hover': {
            backgroundColor: '#9a0036',
          },
        },
        containedCustomGreen: {
          backgroundColor: '#174d38',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#123d2e',
          },
        },
      },
    },
  },
});

export default theme;
