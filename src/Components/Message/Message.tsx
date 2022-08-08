import { deleteDoc, doc } from 'firebase/firestore';
import { FC, useRef } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase.config';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import { selectUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import { motion } from 'framer-motion';
import { IMessage } from '../../store/reducers/message/messageSlice';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import './Message.css';

interface IProps {
  message: IMessage;
}
const Message: FC<IProps> = ({ message }) => {
  const { info } = useSelector(selectUser);
  const { id } = useSelector(selectCurrentConversation);
  const messageRef = useRef<HTMLDivElement | null>(null);

  const handleRightClick = async () => {
    if (message.owner !== info?.uid) return;
    const currentChatRef = doc(db, 'conversations', id, 'messages', message.id);
    await deleteDoc(currentChatRef);
  };

  return (
    <motion.div
      onContextMenu={handleRightClick}
      ref={messageRef}
      className={classNames(
        'message',
        message.owner === info!.uid ? 'owner' : 'reciver',
        message.status === 'pending' ? 'pending' : ''
      )}
    >
      {message.text}
      <p className='message-status'>
        {message.status === 'pending' ? (
          <AccessTimeIcon />
        ) : message.status === 'seen' && message.owner === info!.uid ? (
          <CheckIcon />
        ) : (
          ''
        )}
      </p>
    </motion.div>
  );
};

export default Message;
