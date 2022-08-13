import { deleteDoc, doc } from 'firebase/firestore';
import { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../config/firebase.config';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import { selectUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import { motion } from 'framer-motion';
import { IMessage } from '../../store/reducers/message/messageSlice';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import useContextMenu from '../../hook/useContextMenu';
import './Message.css';
import { setReplyTo } from '../../store/reducers/messageInput/messageInputSlice';

interface IProps {
  message: IMessage;
}
const Message: FC<IProps> = ({ message }) => {
  const { info } = useSelector(selectUser);
  const { id } = useSelector(selectCurrentConversation);
  const { changeContextMenus, openContext } = useContextMenu();
  const dispatch = useDispatch();
  const messageRef = useRef<HTMLDivElement | null>(null);

  const deleteMessage = async () => {
    if (message.owner !== info?.uid) return;
    const currentChatRef = doc(db, 'conversations', id, 'messages', message.id);
    await deleteDoc(currentChatRef);
  };

  const editMessage = () => {};
  const replyMessage = () => {
    console.log('first');
    dispatch(setReplyTo({ to: message.owner, text: message.text }));
  };
  const forwardMessage = () => {};

  const handleRightClick = async () => {
    if (message.owner === info!.uid) {
      changeContextMenus([
        { name: 'Reply', function: replyMessage },
        { name: 'Forward', function: forwardMessage },
        { name: 'Edit', function: editMessage },
        { name: 'Delete', function: deleteMessage },
      ]);
    } else {
      changeContextMenus([
        { name: 'Reply', function: replyMessage },
        { name: 'Forward', function: forwardMessage },
      ]);
    }
    openContext();
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
