// src/theme/theme.js
import {  createTheme,  ThemeProvider,  alpha,  getContrastRatio} from '@mui/material/styles';



const { palette } = createTheme();
const { augmentColor } = palette;
const seaGreenBase = "#2e8b57";
const seaGreenMain = alpha(seaGreenBase, 0.75);
const forestGreenBase = "#1a6d1a";
const forestGreenMain = "#228b22";
// const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  shape: {
    borderRadius: 4,  // Default border radius for MUI components
    pillRadius: 150,   // Custom radius for pill-shaped buttons
  },
  palette: {
    primary: {
      main: seaGreenMain,   // Define your primary color
      dark: seaGreenMain,   // Darker shade for hover
    },
    secondary: {
      main: '#dc004e',   // Define a secondary color
    },
    customGreen: {
      main: seaGreenBase,
      dark: seaGreenMain,
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
          backgroundColor: forestGreenMain,
          '&:hover': {
            backgroundColor: forestGreenBase,
          },
        },
        containedSecondary: {
          backgroundColor: '#dc004e',
          '&:hover': {
            backgroundColor: '#9a0036',
          },
        },
        containedCustomGreen: {
          backgroundColor: forestGreenMain,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: forestGreenBase,
          },
        },
      },
    },
  },
});

export default theme;
