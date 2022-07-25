import { Navigate, Outlet } from 'react-router-dom';
import { Loading } from '../pages';
import useAuth from '../hook/useAuth';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/reducers/user/userSlice';

const PriveteRoute = () => {
  const { isLogin, loading } = useAuth();
  const { status } = useSelector(selectUser);

  if (loading === true || status === 'loading') {
    return <Loading />;
  }
  return isLogin ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PriveteRoute;
