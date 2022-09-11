import { FC, useEffect } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import PriveteRoute from './routes/PriveteRoute';
import { SignIn, Main, SignUp, Profile } from './pages';
import { Toast } from './Components';

import useInit from './hook/useInit';
import ContextMenu from './Components/ContextMenu/ContextMenu';

const App: FC = () => {
    const init = useInit();

    useEffect(() => {
        init();
    }, []);

    return (
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
    );
};

export default App;
