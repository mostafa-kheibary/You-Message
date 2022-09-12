import { Button, Skeleton } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../../config/firebase.config';
import useContextMenu from '../../hook/useContextMenu';
import { ProfileAvatar } from '../';
import {
    changeOpenStatus,
    selectCurrentConversation,
    setCurrentConversation,
} from '../../store/reducers/conversations/conversationsSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import { selectUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import { IConversation, IMessage, IUser } from '../../interfaces';
import useStorage from '../../hook/useStorage';
import './ConversationCard.css';

interface IProps {
    conversationData: IConversation;
}

const ConversationCard: FC<IProps> = ({ conversationData }) => {
    const auth = getAuth();
    const dispatch = useDispatch();
    const { changeContextMenus, openContext } = useContextMenu();
    const { info } = useSelector(selectUser);
    const currentConversation = useSelector(selectCurrentConversation);
    const [toUser, setToUser] = useState<IUser | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [lastMessage, setLastMessage] = useState<null | IMessage>(null);
    const { setStorage, getStorage } = useStorage();

    useEffect(() => {
        if (!auth.currentUser) return;

        let queryUserDoc = doc(db, 'users', conversationData.owners[0]);
        if (conversationData.owners[0] === auth.currentUser.uid) {
            queryUserDoc = doc(db, 'users', conversationData.owners[1]);
        }
        const unsub = onSnapshot(queryUserDoc, (snapShot) => {
            setToUser(snapShot.data() as IUser);

            // --- set conversation to local storage for searching base on name ---
            const data = { id: conversationData.id, name: snapShot.data()!.name };
            let oldData = getStorage('youMessage-conversations') || [];
            oldData = oldData.filter((con: { id: string }) => con.id !== data.id);
            setStorage('youMessage-conversations', [...oldData, data]);
        });

        const lastMessageQuery = query(
            collection(db, 'conversations', conversationData.id, 'messages'),
            orderBy('timeStamp', 'desc')
        );
        const unsub2 = onSnapshot(lastMessageQuery, (snapShot) => {
            if (snapShot.size > 0) {
                setLastMessage(snapShot.docs[0].data() as IMessage);
                const messages: IMessage[] = snapShot.docs.map((message) => message.data() as IMessage);
                setUnreadCount(
                    messages.filter((message) => message.status === 'sent' && message.owner !== info?.uid).length
                );
            } else {
                setLastMessage(null);
                setUnreadCount(0);
            }
        });

        return () => {
            unsub();
            unsub2();
        };
    }, [conversationData]);

    const handleOpenChat = (): void => {
        if (!toUser) {
            return;
        }
        dispatch(setCurrentConversation({ id: conversationData.id, toUser }));
        dispatch(changeOpenStatus(true));
    };

    const deleteConversation = async () => {
        await deleteDoc(doc(db, 'conversations', conversationData.id));
        if (currentConversation.id === conversationData.id) {
            dispatch(setCurrentConversation({ toUser: null, id: '' }));
        }
    };

    const handleRightClick = (): void => {
        changeContextMenus([{ icon: <DeleteIcon />, name: 'Delete', function: deleteConversation }]);
        openContext();
    };

    // --- skeleton loading ---
    if (!toUser) {
        return (
            <div className='conversation-card__skeleton'>
                <div className='conversation-card__skeleton__avatar'>
                    <Skeleton variant='circular' width={40} height={40} animation='pulse' />
                </div>
                <div className='conversation-card__skeleton__texts'>
                    <Skeleton variant='text' width='100%' height={20} animation='pulse' />
                    <Skeleton variant='text' width='80%' height={15} animation='pulse' />
                </div>
            </div>
        );
    }
    return (
        <Button
            color='inherit'
            autoCapitalize='off'
            onClick={handleOpenChat}
            onContextMenu={handleRightClick}
            className={classNames('conversation-card', toUser.uid === currentConversation.toUser?.uid ? 'active' : '')}
        >
            <div className='conversation-card__content'>
                <ProfileAvatar src={toUser.avatar} name={toUser.name} color={toUser.avatarColor} />
                <div className='conversation-card__info'>
                    <h4 className='conversation-card__user-name'>{toUser.name}</h4>
                    <p className='conversation-card__last-message'>{lastMessage?.text || 'conversation started'}</p>
                </div>
                <div className='conversation-card__status'>
                    <h5 className='conversation-card__last-seen'>
                        {new Timestamp(toUser.lastSeen.seconds, toUser.lastSeen.nanoseconds)
                            .toDate()
                            .toLocaleTimeString()}
                    </h5>
                    {unreadCount > 0 && <h5 className='conversation-card__notif'>{unreadCount}</h5>}
                </div>
            </div>
        </Button>
    );
};

export default ConversationCard;
