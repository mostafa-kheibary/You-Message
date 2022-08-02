import { FC } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { Avatar, Button, Icon, IconButton } from '@mui/material';
import { logout, selectUser } from '../../store/reducers/user/userSlice';
import { db } from '../../config/firebase.config';
import { ContactCard } from '../../Components';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import useToast from '../../hook/useToast';
import { selectMessage } from '../../store/reducers/message/messageSlice';
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
      owners: [doc(db, 'users', info!.uid), doc(db, 'users', userData.docs[0].id)],
      messages: [],
    });
  };

  return (
    <aside className='side-bar'>
      <div className='side-bar__head'>
        <div className='side-bar__head__left'>
          <IconButton style={{ position: 'relative' }}>
            <Avatar className='side-bar__avatar' src={info?.avatar} />
            <SettingsIcon color='action' className='side-bar__head__edit-profile' />
          </IconButton>
          <h2 className='side-bar__head__title'>Hi {info?.userName}</h2>
        </div>
        <div className='side-bar__head__buttons'>
          <IconButton onClick={handleAddContact} color='primary'>
            <MapsUgcIcon />
          </IconButton>
        </div>
      </div>
      {messages.map((contact: any, i: number) => (
        <ContactCard key={i} messageData={contact} />
      ))}
    </aside>
  );
};

export default SideBar;
