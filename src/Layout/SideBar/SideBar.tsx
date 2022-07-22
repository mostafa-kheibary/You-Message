import { IconButton } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';

import { FC } from 'react';
import './SideBar.css';

const SideBar: FC = () => {
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
    </aside>
  );
};

export default SideBar;
