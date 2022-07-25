import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/reducers/user/userSlice';
const useAuth = () => {
  const auth = getAuth();
  const { status, info } = useSelector(selectUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    if (status !== 'loading') {
      if (info && auth.currentUser) {
        setIsLogin(true);
        setLoading(false);
      } else {
        setIsLogin(false);
        setLoading(false);
      }
    }
  }, [status]);

  return { isLogin, loading };
};

export default useAuth;
