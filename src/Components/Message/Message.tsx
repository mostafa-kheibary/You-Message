import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useInView } from 'framer-motion';
import { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase.config';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import { selectCurrentChat } from '../../store/reducers/message/messageSlice';
import { selectUser } from '../../store/reducers/user/userSlice';
import { IMessageChat } from '../../types/stateTypes';
import classNames from '../../utils/classNames';
import './Message.css';

interface IProps {
  message: IMessageChat;
}
const Message: FC<IProps> = ({ message }) => {
  const { info } = useSelector(selectUser);
  const { id } = useSelector(selectCurrentChat);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const isSeen = useInView(messageRef);

  useEffect(() => {
    if (isSeen && message.status !== 'seen') {
      (async () => {
        console.log('seen');
      })();
    }
  }, [isSeen]);

  return (
    <div
      ref={messageRef}
      className={classNames(
        'message',
        message.owner === info!.uid ? 'owner' : 'reciver',
        message.status === 'pending' ? 'pending' : ''
      )}
    >
      {message.text}
      <p className='message-status'>{message.status === 'pending' ? <AccessTimeIcon /> : ''}</p>
    </div>
  );
};

export default Message;
