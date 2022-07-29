import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import { login, logout } from './store/reducers/user/userSlice';
import { SignIn, Main, SignUp } from './pages';
import { Toast } from './Components';
import PriveteRoute from './routes/PriveteRoute';
import useToast from './hook/useToast';
import { db } from './config/firebase.config';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { IUser } from './types/stateTypes';

const App: FC = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    let subscribe: () => void;
    // get user if befor login
    const auth = getAuth();
    subscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        onSnapshot(doc(db, 'users', user.uid), (snapShot) => {
          dispatch(login(snapShot.data() as IUser));
        });
      } else {
        dispatch(logout());
      }
    });
    // online and ofline toast
    window.addEventListener('offline', () => toast('No internet! you are offline', 'error'));
    window.addEventListener('online', () => toast('Internet is back! you are online', 'success'));
    // disable default context menu
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    return () => subscribe();
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
