import { FC } from 'react';
import { IconButton, OutlinedInput } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './InputBar.css';
import useForm from '../../hook/useForm';
import { useSelector } from 'react-redux';
import { selectCurrentChat } from '../../store/reducers/message/messageSlice';
import { arrayUnion, collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { getAuth } from 'firebase/auth';

const InputBar: FC = () => {
  const { to } = useSelector(selectCurrentChat);
  const auth = getAuth();

  const handleAddChats = async () => {
    if (!auth.currentUser || !to) return;

    try {
      const userToRef = doc(db, 'users', to.uid);
      const currentUserRef = doc(db, 'users', auth.currentUser.uid);
      console.log(userToRef.id, currentUserRef.id);

      const queryTo = query(collection(db, 'messages'), where('owners', '==', [userToRef, currentUserRef]));
      let docData = await getDocs(queryTo);
      if (docData.empty) {
        const queryTo2 = query(collection(db, 'messages'), where('owners', '==', [currentUserRef, userToRef]));
        docData = await getDocs(queryTo2);
      }
      console.log(docData.docs[0].data());
      const docRef = docData.docs[0].ref;
      await updateDoc(docRef, {
        messages: arrayUnion({ owner: currentUserRef.id, text: values.chat }),
      });
      setValues({ ...values, chat: '' });
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
