import { Avatar, Button, Skeleton } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { onSnapshot, Timestamp } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  changeOpenStatus,
  IConversation,
  selectCurrentConversation,
  setCurrentConversation,
} from '../../store/reducers/conversations/conversationsSlice';
import { IMessage } from '../../store/reducers/message/messageSlice';
import { IUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import './ContactCard.css';

interface IProps {
  messageData: IConversation;
}
const ContactCard: FC<IProps> = ({ messageData }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toUser, setToUser] = useState<IUser | null>(null);
  const [unReadMessage, setUnReadMessage] = useState<number>(0);

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

  const handleOpenChat = () => {
    if (!toUser) {
      return;
    }
    dispatch(setCurrentConversation({ id: messageData.id, toUser }));
    dispatch(changeOpenStatus(true));
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
      // className={classNames('contact-card', toUser.uid === selectedUser?.uid ? 'active' : '')}
      className='contact-card'
    >
      <div className='contact-card__content'>
        <span>{unReadMessage > 0 && unReadMessage}</span>
        <Avatar className='contact-card__avatar' src={toUser.avatar} />
        <div className='contact-card__info'>
          <h4 className='contact-card__user-name'>{toUser.userName}</h4>
          <p className='contact-card__last-message'></p>
        </div>
        <span className='contact-card__last-seen'>
          {new Timestamp(toUser.lastSeen.seconds, toUser.lastSeen.nanoseconds).toDate().toDateString()}
        </span>
      </div>
    </Button>
  );
};

export default ContactCard;
