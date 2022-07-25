import { FC } from 'react';
import { Badge, IconButton } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { InputBar } from '../../Components';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/reducers/user/userSlice';
import './Chat.css';

const Chat: FC = () => {
  const { info } = useSelector(selectUser);
  return (
    <div className='chat'>
      <div className='chat__head'>
        <div className='chat__head__user-info'>
          <Badge variant='dot' color='success'>
            <h4 className='chat__head__user-name'>{info?.displayName}</h4>
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
