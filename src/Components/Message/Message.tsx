import { deleteDoc, doc } from 'firebase/firestore';
import { FC, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../config/firebase.config';
import { motion, useDragControls } from 'framer-motion';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import ReplyIcon from '@mui/icons-material/Reply';
import { selectUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import { IMessage } from '../../store/reducers/message/messageSlice';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import useContextMenu from '../../hook/useContextMenu';
import './Message.css';
import {
  chnageMessageInputMode,
  setMessageInput,
  setReplyTo,
} from '../../store/reducers/messageInput/messageInputSlice';

interface IProps {
  message: IMessage;
  messagesDivRef: { current: HTMLDivElement | null };
}

const Message: FC<IProps> = ({ message, messagesDivRef }) => {
  const { info } = useSelector(selectUser);
  const { id } = useSelector(selectCurrentConversation);
  const onDrag = useDragControls();
  const { changeContextMenus, openContext } = useContextMenu();
  const dispatch = useDispatch();
  const messageRef = useRef<HTMLDivElement | null>(null);

  const deleteMessage = async () => {
    if (message.owner !== info?.uid) return;
    const currentChatRef = doc(db, 'conversations', id, 'messages', message.id);
    await deleteDoc(currentChatRef);
  };

  const editMessage = () => {
    dispatch(setMessageInput(message.text));
    dispatch(chnageMessageInputMode('edit'));
  };

  const replyMessage = () => {
    const replyPayload = { to: message.owner, text: message.text, id: message.id };
    dispatch(setReplyTo(replyPayload));
  };
  const forwardMessage = () => {};
  const handleGoToMessage = () => {
    if (!messagesDivRef.current || !message.replyTo) return;

    const replyedMessage = messagesDivRef.current.querySelector(`[id="${message.replyTo.id}"]`) as HTMLDivElement;
    replyedMessage.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
  };

  const handleDrag = (e: MouseEvent) => {
    onDrag.start(e);
    console.log(e);
  };
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
  const isPersian = /^[\u0600-\u06FF\s]+$/.test(message.text);
  return (
    <>
      {message.replyTo && (
        <motion.div onClick={handleGoToMessage} className='reply-message'>
          <span className='reply-message__line'></span>
          <span className='reply-message__text'>{message.replyTo.message}</span>
          <ReplyIcon className='reply-message__icon' />
        </motion.div>
      )}
      <motion.div
        onContextMenu={handleRightClick}
        ref={messageRef}
        lang={isPersian ? 'fa' : window.navigator.language}
        id={message.id}
        className={classNames(
          'message',
          message.owner === info!.uid ? 'owner' : 'reciver',
          message.status === 'pending' ? 'pending' : ''
        )}
      >
        {message.text}
        <span className='message-status'>
          {message.status === 'pending' ? (
            <AccessTimeIcon />
          ) : message.status === 'seen' && message.owner === info!.uid ? (
            <CheckIcon />
          ) : (
            ''
          )}
        </span>
      </motion.div>
    </>
  );
};

export default Message;
