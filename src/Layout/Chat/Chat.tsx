import { FC } from 'react';
import { Badge, IconButton } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { InputBar } from '../../Components';
import { useSelector } from 'react-redux';
import './Chat.css';
import { selectChatOpenStatus, selectCurrentChat } from '../../store/reducers/message/messageSlice';
import MessageWrapper from '../../Components/MessageWrapper/MessageWrapper';
import { Timestamp } from 'firebase/firestore';
import classNames from '../../utils/classNames';

const Chat: FC = () => {
  const { to } = useSelector(selectCurrentChat);
  const isChatOpen = useSelector(selectChatOpenStatus);

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
    <div className={classNames('chat', isChatOpen ? 'open' : '')}>
      <div className='chat__head'>
        <div className='chat__head__user-info'>
          <Badge variant='dot' color={to.isOnline ? 'success' : 'error'}>
            <h4 className='chat__head__user-name'>{to.userName}</h4>
          </Badge>
          <p className='chat__head__user-status'>
            Last seen {lastSeenTime.toDateString()} , {lastSeenTime.toLocaleTimeString()}
          </p>
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
