import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Badge, IconButton } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { collection, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { SendMessageBar } from '../../Components';
import MessageWrapper from '../../Components/MessageWrapper/MessageWrapper';
import { changeOpenStatus, selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import { db } from '../../config/firebase.config';
import {
  addMessage,
  clearMessage,
  editMessage,
  IMessage,
  removeMessage,
} from '../../store/reducers/message/messageSlice';
import './Chat.css';

const Chat: FC = () => {
  const { id, toUser } = useSelector(selectCurrentConversation);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean | null>(true); // null for no message;

  const handleGoBack = (): void => {
    dispatch(changeOpenStatus(false));
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    dispatch(clearMessage());
    const messagesRef = query(collection(db, 'conversations', id, 'messages'), orderBy('timeStamp', 'asc'));
    const unsub = onSnapshot(messagesRef, { includeMetadataChanges: true }, (snapShot) => {
      if (snapShot.size <= 0) {
        setLoading(null); // null for no message
      }
      snapShot.docChanges().forEach((change) => {
        switch (change.type) {
          case 'added':
            const messageData = change.doc.data() as IMessage;
            dispatch(addMessage(messageData));
            break;
          case 'modified':
            dispatch(editMessage({ id: change.doc.id, message: change.doc.data() }));
            break;
          case 'removed':
            dispatch(removeMessage(change.doc.id));
            break;
        }
        setLoading(false);
      });
    });
    return unsub;
  }, [id]);

  if (!toUser) {
    return (
      <div className='chat'>
        <div className='chat__head'></div>
        <div className='chat__start-chat'>
          <h2 className='chat__start-chat__title'>
            Open chat <strong>or</strong> start conversation
          </h2>
        </div>
      </div>
    );
  }
  const lastSeenTime = new Timestamp(toUser.lastSeen.seconds, toUser.lastSeen.nanoseconds).toDate();
  return (
    <div className='chat'>
      <div className='chat__head'>
        <div className='chat__head__left'>
          <IconButton className='chat__head__back-button' onClick={handleGoBack}>
            <ArrowBackIosNewIcon />
          </IconButton>
          <Avatar src={toUser.avatar} />
          <div className='chat__head__user-info'>
            <Badge variant='dot' color={toUser.isOnline ? 'success' : 'error'}>
              <h4 className='chat__head__user-name'>{toUser.userName}</h4>
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
      <MessageWrapper messageLoaded={loading} />
      <SendMessageBar />
    </div>
  );
};

export default Chat;
