import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { domMax, useInView } from 'framer-motion';
import { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../config/firebase.config';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import { selectUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import { motion } from 'framer-motion';
import './Message.css';
import { IMessage } from '../../store/reducers/message/messageSlice';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';

interface IProps {
  message: IMessage;
}
const Message: FC<IProps> = ({ message }) => {
  const { info } = useSelector(selectUser);
  const { id } = useSelector(selectCurrentConversation);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const isSeen = useInView(messageRef);

  useEffect(() => {
    if (isSeen && message.status !== 'seen' && message.owner !== info?.uid) {
      (async () => {
        const currentChatRef = doc(db, 'conversations', id, 'messages', message.id);
        await updateDoc(currentChatRef, {
          status: 'seen',
        });
      })();
    }
  }, [isSeen]);

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
