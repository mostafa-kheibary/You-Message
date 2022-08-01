import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import SendIcon from '@mui/icons-material/Send';
import { IconButton, OutlinedInput } from '@mui/material';
import useForm from '../../hook/useForm';
import { addCuurentChat, selectCurrentChat } from '../../store/reducers/message/messageSlice';
import { db } from '../../config/firebase.config';
import './InputBar.css';

const InputBar: FC = () => {
  const { to } = useSelector(selectCurrentChat);
  const dispacth = useDispatch();
  const auth = getAuth();

  const handleAddChats = async () => {
    const chatText = values.chat;
    if (!auth.currentUser || !to) return;

    try {
      const userToRef = doc(db, 'users', to.uid);
      const currentUserRef = doc(db, 'users', auth.currentUser.uid);
      dispacth(addCuurentChat({ owner: currentUserRef.id, text: chatText }));
      setValues({ ...values, chat: '' });
      const queryTo = query(collection(db, 'messages'), where('owners', '==', [userToRef, currentUserRef]));
      let docData = await getDocs(queryTo);
      if (docData.empty) {
        const queryTo2 = query(collection(db, 'messages'), where('owners', '==', [currentUserRef, userToRef]));
        docData = await getDocs(queryTo2);
      }
      const docRef = docData.docs[0].ref;
      await updateDoc(docRef, {
        messages: arrayUnion({ owner: currentUserRef.id, text: chatText }),
      });
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
