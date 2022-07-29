import { Avatar } from '@mui/material';
import { onSnapshot } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentChat } from '../../store/reducers/message/messageSlice';
import { IMessage, IUser } from '../../types/stateTypes';
import './ContactCard.css';

interface IProps {
  messageData: IMessage;
}
const ContactCard: FC<IProps> = ({ messageData }) => {
  const [toUser, setToUser] = useState<IUser | null>(null);
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
    dispatch(setCurrentChat(messageData as IMessage));
  };

  if (!toUser) {
    return <div>loding</div>;
  }
  return (
    <div onClick={handleOpenChat} className='contact-card'>
      <div className='contact-card__content'>
        <Avatar />
        <div className='contact-card__info'>
          <h4 className='contact-card__user-name'>{toUser.userName}</h4>
        </div>
        <span className='contact-card__last-seen'>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
};

export default ContactCard;
