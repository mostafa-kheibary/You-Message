import { getAuth } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';
import { db } from '../../config/firebase.config';
import { IConversation, IUser } from '../../interfaces';
import classNames from '../../utils/classNames';
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar';
import { motion } from 'framer-motion';
import './ConversationSelectCard.css';

interface IProps {
    conversationData: IConversation;
    onChange: (id: string, user: IUser, checked: boolean) => void;
}

const ConversationCardSelect: FC<IProps> = ({ conversationData, onChange }) => {
    const [isCheck, setIsCheck] = useState(false);
    const [toUser, setToUser] = useState<IUser | null>(null);
    const auth = getAuth();

    useEffect(() => {
        if (!auth.currentUser) return;

        let queryUserDoc = doc(db, 'users', conversationData.owners[0]);
        if (conversationData.owners[0] === auth.currentUser.uid) {
            queryUserDoc = doc(db, 'users', conversationData.owners[1]);
        }
        const unsub = onSnapshot(queryUserDoc, (snapShot) => {
            setToUser(snapShot.data() as IUser);
        });

        return unsub;
    }, []);

    if (!toUser) {
        return (
            <div>
                <h2>loading</h2>
            </div>
        );
    }
    const handleClick = () => {
        setIsCheck(!isCheck);
        onChange(conversationData.id, toUser, !isCheck);
    };

    return (
        <motion.div whileTap={{ scale: 0.98 }} onClick={handleClick} className='conversation-select-card'>
            <ProfileAvatar src={toUser.avatar} color={toUser.avatarColor} name={toUser.name} />
            <div>
                <h4 className='conversation-select-card__name'>{toUser.name}</h4>
                <h6 className='conversation-select-card__user-name'>@{toUser.userName}</h6>
            </div>
            <div className={classNames('conversation-select-card__checkbox', isCheck ? 'checked' : '')}></div>
        </motion.div>
    );
};

export default ConversationCardSelect;
