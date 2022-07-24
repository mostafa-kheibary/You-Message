import { Navigate, Outlet } from 'react-router-dom';
import { Loading } from '../pages';
import useAuth from '../hook/useAuth';

const PriveteRoute = () => {
  const { isLogin, loading } = useAuth();
  if (loading) {
    return <Loading />;
  }
  return isLogin ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PriveteRoute;
