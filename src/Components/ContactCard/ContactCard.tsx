import { Avatar, Skeleton } from '@mui/material';
import { onSnapshot, Timestamp } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentChat, setCurrentChat, setCurrentChatTo } from '../../store/reducers/message/messageSlice';
import { IMessage, IUser } from '../../types/stateTypes';
import classNames from '../../utils/classNames';
import './ContactCard.css';

interface IProps {
  messageData: IMessage;
}
const ContactCard: FC<IProps> = ({ messageData }) => {
  const [toUser, setToUser] = useState<IUser | null>(null);
  const { to: selectedUser } = useSelector(selectCurrentChat);
  const dispatch = useDispatch();

  useEffect(() => {
    onSnapshot(messageData.to, (snapShot) => {
      setToUser(snapShot.data() as IUser);
    });
  }, []);

  const handleOpenChat = () => {
    if (!toUser) {
      return;
    }
    dispatch(setCurrentChatTo(toUser));
    dispatch(setCurrentChat(messageData.messages));
  };

  if (!toUser) {
    return (
      <div className='contact-card__skeleton'>
        <div className='contact-card__skeleton__avatar'>
          <Skeleton variant='circular' width={50} height={50} animation='pulse' />
        </div>
        <div className='contact-card__skeleton__texts'>
          <Skeleton variant='text' width='100%' height={20} animation='pulse' />
          <Skeleton variant='text' width='80%' height={15} animation='pulse' />
        </div>
      </div>
    );
  }
  return (
    <div
      onClick={handleOpenChat}
      className={classNames('contact-card', toUser.uid === selectedUser?.uid ? 'active' : '')}
    >
      <div className='contact-card__content'>
        <Avatar />
        <div className='contact-card__info'>
          <h4 className='contact-card__user-name'>{toUser.userName}</h4>
        </div>
        <span className='contact-card__last-seen'>
          {new Timestamp(toUser.lastSeen.seconds, toUser.lastSeen.nanoseconds).toDate().toDateString()}
        </span>
      </div>
    </div>
  );
};

export default ContactCard;
