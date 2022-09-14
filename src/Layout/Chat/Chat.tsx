import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, IconButton } from '@mui/material';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { collection, doc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ProfileAvatar, SendMessageBar } from '../../Components';
import MessageWrapper from '../../Components/MessageWrapper/MessageWrapper';
import {
    changeOpenStatus,
    selectCurrentConversation,
    setCurrentConversation,
} from '../../store/reducers/conversations/conversationsSlice';
import { addMessage, clearMessage, editMessage, removeMessage } from '../../store/reducers/message/messageSlice';
import { serverTimestamp } from 'firebase/database';
import { db, rDb } from '../../config/firebase.config';
import { IMessage, IUser } from '../../interfaces';

import './Chat.css';
import { onValue, ref } from 'firebase/database';
import timeSince from '../../utils/timeSince';

type userPresenceType = {
    timeStamp: number | null;
    isOnline: boolean;
};

const Chat: FC = () => {
    const { id, toUser } = useSelector(selectCurrentConversation);
    const [userPresence, setUserPresence] = useState<userPresenceType>({ timeStamp: null, isOnline: true }); // --- last seen and user status
    const [loading, setLoading] = useState<boolean | null>(true); // --- null for no message
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const dispatch = useDispatch();

    const handleGoBack = (): void => {
        dispatch(changeOpenStatus(false));
        setTimeout(() => {
            dispatch(setCurrentConversation({ id: '', toUser: null }));
        }, 200);
    };

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        dispatch(clearMessage());
        const messagesRef = query(collection(db, 'conversations', id, 'messages'), orderBy('timeStamp', 'asc'));

        // --- get user presence from realtime database ---
        const unsub3 = onValue(ref(rDb, '/status/' + toUser!.uid), (snapShot) => {
            if (!snapShot.exists()) {
                setUserPresence(snapShot.val());
            } else {
                setUserPresence(snapShot.val());
            }
        });

        // --- lithen for chnage on touser for changes ---
        const unsub2 = onSnapshot(doc(db, 'users', toUser!.uid), (snapShot) => {
            dispatch(setCurrentConversation({ id, toUser: snapShot.data() as IUser }));
        });

        // --- get Messages ---
        const unsub = onSnapshot(messagesRef, { includeMetadataChanges: true }, (snapShot) => {
            if (snapShot.size <= 0) {
                setLoading(null); // --- null for no message
            }
            snapShot.docChanges().forEach((change) => {
                switch (change.type) {
                    case 'added':
                        const messageData = change.doc.data() as IMessage;
                        dispatch(addMessage(messageData));
                        break;
                    case 'modified':
                        dispatch(editMessage({ id: change.doc.id, message: change.doc.data() }));
                        break;
                    case 'removed':
                        dispatch(removeMessage(change.doc.id));
                        break;
                }
                setLoading(false);
            });
        });
        return () => {
            unsub();
            unsub2();
            unsub3();
        };
    }, [id]);

    if (!toUser) {
        return (
            <div className='chat'>
                <div className='chat__head'></div>
                <div className='chat__start-chat'>
                    <h2 className='chat__start-chat__title'>
                        Open chat <strong>or</strong> start conversation
                    </h2>
                </div>
            </div>
        );
    }
    const lastSeenTime = new Date(userPresence.timeStamp || 0);
    return (
        <div className='chat'>
            <div className='chat__head'>
                {/* <Modal handleClose={() => setIsModalOpen(false)} isOpen={isModalOpen}></Modal> */}
                <div onClick={() => setIsModalOpen(true)} className='chat__head__left'>
                    <IconButton className='chat__head__back-button' onClick={handleGoBack}>
                        <ArrowBackIosNewIcon />
                    </IconButton>
                    <ProfileAvatar color={toUser.avatarColor} name={toUser.name} src={toUser.avatar} />
                    <div className='chat__head__user-info'>
                        <Badge variant='dot' color={userPresence.isOnline ? 'success' : 'error'}>
                            <h4 className='chat__head__name'>{toUser.name}</h4>
                        </Badge>
                        <p className='chat__head__user-status'>
                            {userPresence.isOnline ? 'online' : `last seen ${timeSince(lastSeenTime)} ago`}
                        </p>
                    </div>
                </div>
                <div className='chat__head__buttons'>
                    <IconButton color='secondary'>
                        <MoreVertOutlinedIcon />
                    </IconButton>
                </div>
            </div>
            <MessageWrapper messageLoaded={loading} />
            <SendMessageBar />
        </div>
    );
};

export default Chat;
