import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Badge, IconButton } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Timestamp } from 'firebase/firestore';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { InputBar } from '../../Components';
import { selectCurrentChat, setChatOpenStatus } from '../../store/reducers/message/messageSlice';
import MessageWrapper from '../../Components/MessageWrapper/MessageWrapper';
import './Chat.css';

const Chat: FC = () => {
  const { to } = useSelector(selectCurrentChat);
  const dispatch = useDispatch();

  const handleGoBack = (): void => {
    dispatch(setChatOpenStatus(false));
  };

  if (!to) {
    return (
      <div className='chat'>
        <div className='chat__head'></div>
        <div className='chat__start-chat'>
          <h2 className='chat__start-chat__title'>Open chat and start conversation</h2>
        </div>
      </div>
    );
  }
  const lastSeenTime = new Timestamp(to.lastSeen.seconds, to.lastSeen.nanoseconds).toDate();
  return (
    <div className='chat'>
      <div className='chat__head'>
        <div className='chat__head__left'>
          <IconButton className='chat__head__back-button' onClick={handleGoBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Avatar src={to.avatar} />
          <div className='chat__head__user-info'>
            <Badge variant='dot' color={to.isOnline ? 'success' : 'error'}>
              <h4 className='chat__head__user-name'>{to.userName}</h4>
            </Badge>
            <p className='chat__head__user-status'>
              {lastSeenTime.toDateString()} , {lastSeenTime.toLocaleTimeString()}
            </p>
          </div>
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
