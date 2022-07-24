import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from './store/reducers/user/userSlice';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { SignIn, Main, SignUp } from './pages';
import PriveteRoute from './routes/PriveteRoute';

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
      <Routes>
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
