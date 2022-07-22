import { FC } from 'react';

import { Badge, Chip, IconButton } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';

import './Chat.css';
import InputBar from '../../Components/InputBar/InputBar';

const Chat: FC = () => {
  return (
    <div className='chat'>
      <div className='chat__head'>
        <div className='chat__head__user-info'>
          <Badge variant='dot' color='success'>
            <h4 className='chat__head__user-name'>Joun Dou</h4>
          </Badge>
          <p className='chat__head__user-status'>Last seen on Sat 8</p>
        </div>
        <div className='chat__head__buttons'>
          <IconButton color='secondary'>
            <MoreVertOutlinedIcon />
          </IconButton>
        </div>
      </div>
      <InputBar />
    </div>
  );
};

export default Chat;
