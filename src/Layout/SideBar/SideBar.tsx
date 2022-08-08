import { FC } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { Avatar, IconButton } from '@mui/material';
import { logout, selectUser } from '../../store/reducers/user/userSlice';
import { db } from '../../config/firebase.config';
import { ContactCard } from '../../Components';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import useToast from '../../hook/useToast';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { selectConversations } from '../../store/reducers/conversations/conversationsSlice';
import './SideBar.css';

const SideBar: FC = () => {
  const auth = getAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { info } = useSelector(selectUser);
  const conversations = useSelector(selectConversations);

  const handleSignout = async () => {
    await signOut(auth);
    dispatch(logout);
  };

  const handleAddContact = async () => {
    const newUserName = prompt('enter userName');
    const userData = await getDocs(query(collection(db, 'users'), where('userName', '==', newUserName)));
    const docId: string = uuidv4();
    await setDoc(doc(db, 'conversations', docId), {
      id: docId,
      owners: [doc(db, 'users', info!.uid), doc(db, 'users', userData.docs[0].id)],
    });
  };

  return (
    <aside className='side-bar'>
      <div className='side-bar__head'>
        <div className='side-bar__head__left'>
          <IconButton onClick={() => navigate('/profile')} style={{ position: 'relative' }}>
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
      <div className='side-bar__conversations-container'>
        {conversations.map((contact: any, i: number) => (
          <ContactCard key={i} messageData={contact} />
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
