import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogin(true);
        setLoading(false);
      } else {
        setIsLogin(false);
        setLoading(false);
      }
    });
  }, []);
  return { isLogin, loading };
};

export default useAuth;
