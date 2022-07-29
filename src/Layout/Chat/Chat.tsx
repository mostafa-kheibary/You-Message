import { FC } from 'react';
import { Badge, IconButton } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { InputBar } from '../../Components';
import { useSelector } from 'react-redux';
import './Chat.css';
import { selectCurrentChat, selectMessage } from '../../store/reducers/message/messageSlice';
import MessageWrapper from '../../Components/MessageWrapper/MessageWrapper';

const Chat: FC = () => {
  const currentChats = useSelector(selectCurrentChat);
  return (
    <div className='chat'>
      <div className='chat__head'>
        <div className='chat__head__user-info'>
          <Badge variant='dot' color='success'>
            <h4 className='chat__head__user-name'></h4>
          </Badge>
          <p className='chat__head__user-status'>Last seen on Sat 8</p>
        </div>
        <div className='chat__head__buttons'>
          <IconButton color='secondary'>
            <MoreVertOutlinedIcon />
          </IconButton>
        </div>
      </div>
      <MessageWrapper />
      <InputBar />
    </div>
  );
};

export default Chat;
