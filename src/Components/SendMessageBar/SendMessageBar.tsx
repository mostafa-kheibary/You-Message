import { ChangeEvent, FC, FormEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase.config';
import { OutlinedInput } from '@mui/material';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import useForm from '../../hook/useForm';
import { addMessage } from '../../store/reducers/message/messageSlice';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import { VoiceMessageSender, EmojiMessage } from '../';
import './SendMessageBar.css';
import {
  selectMessageInput,
  setMessageInput,
  clearMessageInput,
} from '../../store/reducers/messageInput/messageInputSlice';

const SendMessageBar: FC = () => {
  const auth = getAuth();
  const { id } = useSelector(selectCurrentConversation);
  const { message, mode } = useSelector(selectMessageInput);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispacth = useDispatch();

  const handleAddChats = async (e: FormEvent) => {
    e.preventDefault();
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
      dispacth(clearMessageInput());
      dispacth(addMessage({ ...messagePayload, status: 'pending' }));
      const messageRef = doc(db, 'conversations', id, 'messages', messageId);
      await setDoc(messageRef, messagePayload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispacth(setMessageInput(e.target.value));
  };

  return (
    <form className='send-message-bar' onSubmit={handleAddChats}>
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
    </form>
  );
};

export default SendMessageBar;
