import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import defultTheme from './config/matrialStyle.config';
import store from './store';
import App from './App';
import './style/style.css';
import './config/firebase.config';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <ThemeProvider theme={defultTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
);
