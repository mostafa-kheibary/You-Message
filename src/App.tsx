import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { login, logout } from './store/reducers/user/userSlice';
import { SignIn, Main, SignUp } from './pages';
import { Toast } from './Components';
import PriveteRoute from './routes/PriveteRoute';
import useToast from './hook/useToast';
import { onValue, ref } from 'firebase/database';
import { db } from './config/firebase.config';

const App: FC = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  useEffect(() => {
    const auth = getAuth();
    const sub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapShot) => {
          const userData = snapShot.val();
          dispatch(login(userData));
        });
      } else {
        dispatch(logout());
      }
    });
    // online and ofline toast
    window.addEventListener('offline', () => toast('No internet! you are offline', 'error'));
    window.addEventListener('online', () => toast('Internet is back! you are online', 'success'));
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
