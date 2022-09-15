import { FC, useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import PriveteRoute from './routes/PriveteRoute';
import { SignIn, Main, SignUp, Profile } from './pages';
import { defultTheme, darkTheme } from './config/matrialStyle.config';
import { Toast } from './Components';
import useInit from './hook/useInit';
import ContextMenu from './Components/ContextMenu/ContextMenu';
import { ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSettings } from './store/reducers/settings/settingsSlice';

const App: FC = () => {
    const init = useInit();
    const { theme } = useSelector(selectSettings);

    useEffect(() => {
        init();
    }, []);

    return (
        <ThemeProvider theme={theme.darkMode ? darkTheme : defultTheme}>
            <BrowserRouter>
                <Toast />
                <ContextMenu />
                <div className='app'>
                    <Routes>
                        <Route element={<PriveteRoute />}>
                            <Route path='/' element={<Main />} />
                            <Route path='/profile' element={<Profile />} />
                        </Route>
                        <Route path='/sign-in' element={<SignIn />} />
                        <Route path='/sign-up' element={<SignUp />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
