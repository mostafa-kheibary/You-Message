import { Button } from '@mui/material';
import { getAuth, signOut } from 'firebase/auth';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/reducers/user/userSlice';

const Profile: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    dispatch(logout);
    navigate('/');
  };

  return (
    <div>
      <Button color='error' onClick={handleSignOut}>
        sign out
      </Button>
    </div>
  );
};

export default Profile;
