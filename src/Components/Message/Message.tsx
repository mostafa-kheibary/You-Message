import { FC, useRef } from 'react';
import { arrayRemove, arrayUnion, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { db } from '../../config/firebase.config';
import { selectUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import { IMessage } from '../../store/reducers/message/messageSlice';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import useContextMenu from '../../hook/useContextMenu';
import useToast from '../../hook/useToast';
import {
  chnageMessageInputMode,
  setEditMode,
  setMessageInput,
  setReplyTo,
} from '../../store/reducers/messageInput/messageInputSlice';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import ReplyIcon from '@mui/icons-material/Reply';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './Message.css';

interface IProps {
  message: IMessage;
  messagesDivRef: { current: HTMLDivElement | null };
}
const Message: FC<IProps> = ({ message, messagesDivRef }) => {
  const { info } = useSelector(selectUser);
  const { id } = useSelector(selectCurrentConversation);
  const { changeContextMenus, openContext } = useContextMenu();
  const messageRef = useRef<HTMLDivElement | null>(null);
  const toast = useToast();
  const dispatch = useDispatch();

  const deleteMessage = async () => {
    if (message.owner !== info?.uid) return;
    const currentChatRef = doc(db, 'conversations', id, 'messages', message.id);
    await deleteDoc(currentChatRef);
  };

  const editMessage = () => {
    dispatch(setMessageInput(message.text));
    dispatch(setEditMode(message.id));
  };

  const replyMessage = () => {
    const replyPayload = { to: message.owner, text: message.text, id: message.id };
    dispatch(setReplyTo(replyPayload));
  };
  const forwardMessage = () => {};
  const copyMessage = () => {
    navigator.clipboard.writeText(message.text);
    toast('Message succsesfully copid', 'success');
  };
  // for find a replyed message by click on it
  const handleGoToMessage = () => {
    if (!messagesDivRef.current || !message.replyTo) return;

    const replyedMessage = messagesDivRef.current.querySelector(`[id="${message.replyTo.id}"]`) as HTMLDivElement;
    replyedMessage.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
  };
  const handleAddReaction = async (reaction: string) => {
    if (message.reactions!.length > 0) {
      await updateDoc(doc(db, 'conversations', id, 'messages', message.id), {
        reactions: arrayRemove(reaction),
      });
      return;
    }
    await updateDoc(doc(db, 'conversations', id, 'messages', message.id), {
      reactions: arrayUnion(reaction),
    });
  };
  const handleRightClick = async () => {
    if (message.owner === info!.uid) {
      changeContextMenus([
        { icon: <ContentCopyIcon />, name: 'Copy', function: copyMessage },
        { icon: <ReplyAllIcon />, name: 'Reply', function: replyMessage },
        { icon: <ArrowForwardIcon />, name: 'Forward', function: forwardMessage },
        { icon: <EditIcon />, name: 'Edit', function: editMessage },
        { icon: <DeleteIcon />, name: 'Delete', function: deleteMessage },
      ]);
    } else {
      changeContextMenus([
        { icon: <ContentCopyIcon />, name: 'Copy', function: copyMessage },
        { icon: <ReplyAllIcon />, name: 'Reply', function: replyMessage },
        { icon: <ArrowForwardIcon />, name: 'Forward', function: forwardMessage },
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
      <div
        onDoubleClick={() => handleAddReaction('❤️')}
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
        <div className={classNames('message-reactions', message.owner === info!.uid ? 'owner' : '')}>
          <AnimatePresence>
            {message.reactions?.map((reaction, i) => (
              <span key={i} className='message-reactions__emoji'>
                {reaction}
              </span>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default Message;
