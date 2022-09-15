import { createTheme } from '@mui/material';

// configure material styles
const defultTheme = createTheme({
    typography: { fontFamily: 'Poppins, sans-serif' },
    palette: { primary: { main: '#1088ff' }, secondary: { main: '#1e1e1e' } },
});
const darkTheme = createTheme({
    palette: { mode: 'dark', primary: { main: '#1088ff' }, secondary: { main: '#1e1e1e' } },
});
export { defultTheme, darkTheme };
