import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { IconButton, OutlinedInput } from '@mui/material';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import SendIcon from '@mui/icons-material/Send';
import { v4 as uuidv4 } from 'uuid';
import useForm from '../../hook/useForm';
import { db } from '../../config/firebase.config';
import './InputBar.css';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import { addMessages } from '../../store/reducers/message/messageSlice';

const InputBar: FC = () => {
  const dispacth = useDispatch();
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
      dispacth(addMessages({ ...messagePayload, status: 'pending' }));
      const messageRef = doc(db, 'conversations', id, 'messages', messageId);
      await setDoc(messageRef, messagePayload);
    } catch (error) {
      console.log(error);
    }
  };

  const { handleChange, handleSubmit, setValues, values } = useForm(handleAddChats, {
    chat: '',
  });
  return (
    <form className='input-bar' onSubmit={handleSubmit}>
      <OutlinedInput
        onChange={handleChange}
        autoComplete='off'
        value={values.chat}
        size='medium'
        name='chat'
        className='input-bar__input'
        placeholder='Your message ...'
      />
      <div className='input-bar__buttons'>
        <IconButton type='submit' size='large' className='input-bar__send' color='primary'>
          <SendIcon />
        </IconButton>
      </div>
    </form>
  );
};

export default InputBar;
