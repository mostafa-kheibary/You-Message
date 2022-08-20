import { FC } from 'react';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase.config';
import { selectUser } from '../../store/reducers/user/userSlice';
import { Avatar, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import GroupIcon from '@mui/icons-material/Group';
import useToast from '../../hook/useToast';
import { ConversationCard } from '../../Components';
import { selectConversations } from '../../store/reducers/conversations/conversationsSlice';
import './SideBar.css';

const SideBar: FC = () => {
    const auth = getAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { info } = useSelector(selectUser);
    const conversations = useSelector(selectConversations);

    const handleAddConversation = async () => {
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
                        <Avatar className='side-bar__avatar'>
                            <img width='100%' src={info!.avatar} alt='avatar' />
                        </Avatar>
                        <SettingsIcon color='action' className='side-bar__head__edit-profile' />
                    </IconButton>
                    <h2 className='side-bar__head__title'>Hi {info?.userName}</h2>
                </div>
            </div>
            <div className='side-bar__conversations-container'>
                {conversations.map((contact: any, i: number) => (
                    <ConversationCard key={i} messageData={contact} />
                ))}
            </div>
            <SpeedDial ariaLabel='SpeedDial basic example' icon={<SpeedDialIcon />} className='side-bar__dial'>
                <SpeedDialAction
                    onClick={handleAddConversation}
                    icon={<MapsUgcIcon />}
                    tooltipTitle='Create Conversation'
                />
                <SpeedDialAction icon={<GroupIcon />} tooltipTitle='Create Group' />
            </SpeedDial>
        </aside>
    );
};

export default SideBar;
