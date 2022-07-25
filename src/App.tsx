import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { login } from './store/reducers/user/userSlice';
import { SignIn, Main, SignUp } from './pages';
import PriveteRoute from './routes/PriveteRoute';
import { Toast } from './Components';

const App: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(login(user));
      }
    });
    return () => sub();
  }, []);

  return (
    <BrowserRouter>
      <Toast />
      <Routes location={window.location} key={window.location.pathname}>
        <Route element={<PriveteRoute />}>
          <Route path='/' element={<Main />} />
        </Route>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
