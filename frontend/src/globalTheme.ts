import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#216A12',
      contrastText: '#fff',
    },
    secondary: {
      main: '#408E2F',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    h1: { fontSize: '40px', fontWeight: 700 },
    h2: { fontSize: '32px', fontWeight: 600 },
    h3: { fontSize: '28px', fontWeight: 600 },
    h4: { fontSize: '24px', fontWeight: 600 },
    h5: { fontSize: '20px', fontWeight: 500 },
    h6: { fontSize: '16px', fontWeight: 500 },
    body1: { fontSize: '16px' },
    body2: { fontSize: '14px' },
  },
  spacing: 8,
});

export default theme;