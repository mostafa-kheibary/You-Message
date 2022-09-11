import { FC, useEffect } from 'react';
import {
    collection,
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
} from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase.config';
import { selectUser } from '../../store/reducers/user/userSlice';
import { Avatar, IconButton, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import GroupIcon from '@mui/icons-material/Group';
import { ConversationCard } from '../../Components';
import {
    clearConversations,
    selectConversations,
    setConversations,
} from '../../store/reducers/conversations/conversationsSlice';
import useToast from '../../hook/useToast';
import { IConversation } from '../../interfaces';
import './SideBar.css';

const SideBar: FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const conversations = useSelector(selectConversations);
    const dispatch = useDispatch();
    const { info } = useSelector(selectUser);

    const handleAddConversation = async () => {
        const newConversation = prompt('enter userName');
        try {
            const userData = await getDocs(
                query(collection(db, 'users'), where('userName', '==', newConversation), limit(1))
            );

            if (!userData) {
                toast('User not found,username is not correct', 'error');
                return;
            }
            if (conversations.find((conver) => conver.owners[1] === userData.docs[0].id)) {
                toast('user allready added', 'error');
                return;
            }
            const docId: string = uuidv4();
            await setDoc(doc(db, 'conversations', docId), {
                id: docId,
                owners: [info!.uid, userData.docs[0].id],
                timeStamp: serverTimestamp(),
            });
        } catch (error) {
            toast('error happend, try again', 'error');
        }
    };

    useEffect(() => {
        if (!info?.uid) return;

        const messagesQuery = query(
            collection(db, 'conversations'),
            where('owners', 'array-contains', info.uid),
            orderBy('timeStamp', 'desc')
        );

        onSnapshot(messagesQuery, (snapShot) => {
            dispatch(clearConversations());
            const conversationsData = snapShot.docs.map((conversation) => conversation.data());
            dispatch(setConversations(conversationsData as IConversation[]));
        });
    }, []);

    return (
        <aside className='side-bar'>
            <div className='side-bar__head'>
                <div className='side-bar__head__left'>
                    <IconButton onClick={() => navigate('/profile')} style={{ position: 'relative' }}>
                        <Avatar className='side-bar__avatar'>
                            {info?.avatar ? (
                                <img width='100%' src={info.avatar} alt={info!.name.slice(0, 1)} />
                            ) : (
                                <span>{info?.name?.slice(0, 1)}</span>
                            )}
                        </Avatar>
                        <SettingsIcon color='action' className='side-bar__head__edit-profile' />
                    </IconButton>
                    <h2 className='side-bar__head__title'>Hi {info?.userName}</h2>
                </div>
            </div>

            <div className='side-bar__conversations-container'>
                {conversations.map((contact, i) => (
                    <ConversationCard key={i} conversationData={contact} />
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
