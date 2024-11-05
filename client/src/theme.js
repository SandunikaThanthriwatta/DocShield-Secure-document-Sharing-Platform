import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d9488',
      light: '#5eead4',
      dark: '#0f766e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f97316',
    },
    error: { main: '#ef4444' },
    success: { main: '#22c55e' },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Lato", -apple-system, BlinkMacSystemFont, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 14px rgba(13,148,136,0.35)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0d9488' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0d9488' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#0d9488' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
          '&:hover': {
            boxShadow: '0 10px 30px -5px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#f8fafc' },
        '::-webkit-scrollbar': { width: '6px' },
        '::-webkit-scrollbar-track': { background: '#f1f5f9' },
        '::-webkit-scrollbar-thumb': { background: '#cbd5e1', borderRadius: '3px' },
        '::-webkit-scrollbar-thumb:hover': { background: '#94a3b8' },
      },
    },
  },
});

export default theme;
