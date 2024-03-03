import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#dd3333', // Example primary color
    },
    secondary: {
      main: '#f50057', // Example secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif', // Example font family
  },
});

export default theme;