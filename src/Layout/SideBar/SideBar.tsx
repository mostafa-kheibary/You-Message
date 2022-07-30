import { FC, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { Button, IconButton } from '@mui/material';
import { logout, selectUser } from '../../store/reducers/user/userSlice';
import { db } from '../../config/firebase.config';
import { ContactCard } from '../../Components';
import { collection, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import useToast from '../../hook/useToast';
import { addMessages, deleteMessage, editMessage, selectMessage } from '../../store/reducers/message/messageSlice';
import { IMessage } from '../../types/stateTypes';
import { v4 as uuidv4 } from 'uuid';
import './SideBar.css';

const SideBar: FC = () => {
  const auth = getAuth();
  const toast = useToast();
  const { info } = useSelector(selectUser);
  const messages = useSelector(selectMessage);
  const dispatch = useDispatch();

  const handleSignout = async () => {
    await signOut(auth);
    dispatch(logout);
  };

  const handleAddContact = async () => {
    const newUserName = prompt('enter userName');
    const userData = await getDocs(query(collection(db, 'users'), where('userName', '==', newUserName)));
    const docId: string = uuidv4();
    await setDoc(doc(db, 'messages', docId), {
      id: docId,
      from: doc(db, 'users', info!.uid),
      to: doc(db, 'users', userData.docs[0].id),
      messages: [],
    });
  };

  useEffect(() => {
    if (!info?.uid) {
      return;
    }
    const userRef = doc(db, 'users', info.uid);
    const messagesQuery = query(collection(db, 'messages'), where('from', '==', userRef));
    onSnapshot(messagesQuery, (snapShot) => {
      snapShot.docChanges().forEach((itemSnap) => {
        switch (itemSnap.type) {
          case 'added':
            dispatch(addMessages(itemSnap.doc.data() as IMessage));
            break;
          case 'modified':
            dispatch(editMessage({ id: itemSnap.doc.id, message: itemSnap.doc.data() }));
            break;
          case 'removed':
            dispatch(deleteMessage(itemSnap.doc.id));
            break;
        }
      });
    });
  }, []);

  return (
    <aside className='side-bar'>
      <div className='side-bar__head'>
        <h2 className='side-bar__head__title'>Message</h2>
        <div className='side-bar__head__buttons'>
          <IconButton color='secondary'>
            <MoreVertOutlinedIcon />
          </IconButton>
          <IconButton onClick={handleAddContact} color='primary'>
            <MapsUgcIcon />
          </IconButton>
        </div>
        <Button onClick={handleSignout} color='error'>
          sign out
        </Button>
      </div>
      {messages.map((contact: any, i: number) => (
        <ContactCard key={i} messageData={contact} />
      ))}
    </aside>
  );
};

export default SideBar;
