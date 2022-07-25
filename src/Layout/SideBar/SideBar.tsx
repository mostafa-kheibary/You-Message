import { Button, IconButton } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';

import { FC } from 'react';
import './SideBar.css';
import { getAuth, signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/reducers/user/userSlice';

const SideBar: FC = () => {
  const auth = getAuth();
  const dispatch = useDispatch();
  const handleSignout = async () => {
    await signOut(auth);
    dispatch(logout);
  };
  return (
    <aside className='side-bar'>
      <div className='side-bar__head'>
        <h2 className='side-bar__head__title'>Message</h2>
        <div className='side-bar__head__buttons'>
          <IconButton color='secondary'>
            <MoreVertOutlinedIcon />
          </IconButton>
          <IconButton color='primary'>
            <MapsUgcIcon />
          </IconButton>
        </div>
      </div>
      <Button onClick={handleSignout} color='error'>
        sign out
      </Button>
    </aside>
  );
};

export default SideBar;
