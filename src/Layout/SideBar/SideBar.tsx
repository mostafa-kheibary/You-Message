import { ChangeEvent, FC, useEffect, useState } from 'react';
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
import { IconButton, OutlinedInput, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import { ConversationCard, ProfileAvatar } from '../../Components';
import {
    clearConversations,
    selectConversations,
    setConversations,
} from '../../store/reducers/conversations/conversationsSlice';
import useToast from '../../hook/useToast';
import { IConversation } from '../../interfaces';
import useStorage from '../../hook/useStorage';
import './SideBar.css';

const SideBar: FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const conversations = useSelector(selectConversations);
    const [filterdConversations, setFilterdConversation] = useState<IConversation[]>([]);

    const dispatch = useDispatch();
    const { info } = useSelector(selectUser);
    const { setStorage, getStorage } = useStorage();

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
            // --- empty the local storage for new conversations ---
            setStorage('youMessage-conversations', []);
            const conversationsData = snapShot.docs.map((conversation) => conversation.data());
            dispatch(setConversations(conversationsData as IConversation[]));
            setFilterdConversation(conversationsData as IConversation[]);
        });
    }, []);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const conversationsData = getStorage('youMessage-conversations') || [];
        const founded: any = [];
        conversationsData.forEach((conversation: { id: string; name: string }) => {
            if (conversation.name.includes(e.target.value.trim())) {
                const foundedConversation = conversations.find((con) => con.id === conversation.id);
                founded.push(foundedConversation);
            }
        });
        setFilterdConversation(founded);
    };

    return (
        <aside className='side-bar'>
            <div className='side-bar__head'>
                <div className='side-bar__head__left'>
                    <IconButton onClick={() => navigate('/profile')} style={{ position: 'relative' }}>
                        <ProfileAvatar color={info!.avatarColor} name={info!.name} src={info!.avatar} />
                        <SettingsIcon color='action' className='side-bar__head__edit-profile' />
                    </IconButton>
                    <div className='side-bar__head__titles'>
                        <h2 className='side-bar__head__title'>Hi {info?.name}</h2>
                        <h4 className='side-bar__head__user-name'>@{info?.userName}</h4>
                    </div>
                </div>
            </div>
            <div className='side-bar__search-wrapper'>
                <OutlinedInput
                    onChange={handleSearch}
                    size='small'
                    placeholder='search conversations name'
                    className='side-bar__search-input'
                    startAdornment={<SearchIcon color='primary' />}
                />
            </div>
            <div className='side-bar__conversations-container'>
                {filterdConversations.map((contact, i) => (
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
