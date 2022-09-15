import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import store from './store';
import App from './App';
import './style/style.css';
import './config/firebase.config';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
serviceWorkerRegistration.unregister();
