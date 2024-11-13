import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme.js'; // Adjust the import path as needed
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={ theme}>
    <StrictMode>
    <App />
    </StrictMode>
  </ThemeProvider>
  
)
