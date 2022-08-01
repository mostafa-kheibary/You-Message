import { Avatar, Button, Skeleton } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { onSnapshot, Timestamp } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentChat,
  setChatOpenStatus,
  setCurrentChat,
  setCurrentChatTo,
} from '../../store/reducers/message/messageSlice';
import { IMessage, IUser } from '../../types/stateTypes';
import classNames from '../../utils/classNames';
import './ContactCard.css';

interface IProps {
  messageData: IMessage;
}
const ContactCard: FC<IProps> = ({ messageData }) => {
  const auth = getAuth();
  const [toUser, setToUser] = useState<IUser | null>(null);
  const { to: selectedUser } = useSelector(selectCurrentChat);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.currentUser) return;

    if (messageData.owners[0].id === auth.currentUser.uid) {
      onSnapshot(messageData.owners[1], (snapShot) => {
        setToUser(snapShot.data() as IUser);
      });
    } else {
      onSnapshot(messageData.owners[0], (snapShot) => {
        setToUser(snapShot.data() as IUser);
      });
    }
  }, []);

  useEffect(() => {
    handleOpenChat();
  }, [messageData]);

  const handleOpenChat = () => {
    if (!toUser) {
      return;
    }
    dispatch(setCurrentChatTo(toUser));
    dispatch(setCurrentChat(messageData.messages));
    dispatch(setChatOpenStatus(true));
  };

  if (!toUser) {
    return (
      <div className='contact-card__skeleton'>
        <div className='contact-card__skeleton__avatar'>
          <Skeleton variant='circular' width={40} height={40} animation='pulse' />
        </div>
        <div className='contact-card__skeleton__texts'>
          <Skeleton variant='text' width='100%' height={20} animation='pulse' />
          <Skeleton variant='text' width='80%' height={15} animation='pulse' />
        </div>
      </div>
    );
  }
  return (
    <Button
      color='inherit'
      autoCapitalize='off'
      onClick={handleOpenChat}
      className={classNames('contact-card', toUser.uid === selectedUser?.uid ? 'active' : '')}
    >
      <div className='contact-card__content'>
        <Avatar src={toUser.avatar ? toUser.avatar : ''} />
        <div className='contact-card__info'>
          <h4 className='contact-card__user-name'>{toUser.userName}</h4>
          <p className='contact-card__last-message'>{messageData.messages[messageData.messages.length - 1].text}</p>
        </div>
        <span className='contact-card__last-seen'>
          {new Timestamp(toUser.lastSeen.seconds, toUser.lastSeen.nanoseconds).toDate().toDateString()}
        </span>
      </div>
    </Button>
  );
};

export default ContactCard;
