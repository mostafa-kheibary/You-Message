import { FC, useRef } from 'react';
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

const SendMessageBar: FC = () => {
  const dispacth = useDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { id } = useSelector(selectCurrentConversation);
  const auth = getAuth();

  const handleAddChats = async () => {
    if (!auth.currentUser) return;
    try {
      const chatText = values.chat;
      const messageId = uuidv4();
      const messagePayload = {
        timeStamp: Timestamp.now(),
        owner: auth.currentUser.uid,
        text: chatText,
        status: 'sent',
        id: messageId,
      };
      setValues({ ...values, chat: '' });
      dispacth(addMessage({ ...messagePayload, status: 'pending' }));
      const messageRef = doc(db, 'conversations', id, 'messages', messageId);
      await setDoc(messageRef, messagePayload);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    inputRef.current!.value += emoji;
    setValues({ ...values, chat: inputRef.current?.value });
  };

  const { handleChange, handleSubmit, setValues, values } = useForm(handleAddChats, {
    chat: '',
  });

  return (
    <form className='send-message-bar' onSubmit={handleSubmit}>
      <EmojiMessage addEmojis={handleAddEmoji} />
      <OutlinedInput
        inputRef={inputRef}
        onChange={handleChange}
        autoComplete='off'
        value={values.chat}
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
