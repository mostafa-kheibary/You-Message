import { ChangeEvent, FC, FormEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase.config';
import { IconButton, OutlinedInput } from '@mui/material';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { addMessage } from '../../store/reducers/message/messageSlice';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import CloseIcon from '@mui/icons-material/Close';
import { VoiceMessageSender, EmojiMessage } from '../';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import './SendMessageBar.css';
import {
  selectMessageInput,
  setMessageInput,
  clearMessageInput,
  clearReplyTo,
} from '../../store/reducers/messageInput/messageInputSlice';

const SendMessageBar: FC = () => {
  const auth = getAuth();
  const { id } = useSelector(selectCurrentConversation);
  const { message, mode } = useSelector(selectMessageInput);
  const { replyTo } = useSelector(selectMessageInput);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    switch (mode) {
      case 'create':
        sendMessage();
        break;
      case 'reply':
        sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!auth.currentUser) return;
    try {
      const messageId = uuidv4();
      const messagePayload = {
        timeStamp: Timestamp.now(),
        owner: auth.currentUser.uid,
        text: message,
        status: 'sent',
        id: messageId,
      };
      dispatch(clearMessageInput());
      dispatch(addMessage({ ...messagePayload, status: 'pending' }));
      const messageRef = doc(db, 'conversations', id, 'messages', messageId);
      await setDoc(messageRef, messagePayload);
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setMessageInput(e.target.value));
  };

  const closeReply = () => {
    dispatch(clearReplyTo());
  };
  return (
    <form className='send-message-bar' onSubmit={handleSubmit}>
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            className='send-message-bar__reply'
          >
            <ReplyAllIcon color='primary' />
            <span className='send-message-bar__reply-message'>reply to : {replyTo.message}</span>
            <IconButton onClick={closeReply} className='send-message-bar__reply__close-button'>
              <CloseIcon />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>
      <div className='send-message-bar__wrapper'>
        <EmojiMessage />
        <OutlinedInput
          inputRef={inputRef}
          onChange={handleChange}
          autoComplete='off'
          value={message}
          size='medium'
          name='chat'
          className='send-message-bar__input'
          placeholder='Your message ...'
        />
        <VoiceMessageSender />
      </div>
    </form>
  );
};

export default SendMessageBar;
