import { FC, useRef, useState } from 'react';
import {
    arrayRemove,
    arrayUnion,
    deleteDoc,
    doc,
    serverTimestamp,
    setDoc,
    Timestamp,
    updateDoc,
} from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { db } from '../../config/firebase.config';
import { selectUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import { selectConversations, selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import useContextMenu from '../../hook/useContextMenu';
import useToast from '../../hook/useToast';
import { setEditMode, setMessageInput, setReplyTo } from '../../store/reducers/messageInput/messageInputSlice';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import ReplyIcon from '@mui/icons-material/Reply';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IMessage, IUser } from '../../interfaces';
import Modal from '../Modal/Modal';
import './Message.css';
import ConversationSelectCard from '../ConversationSelectCard/ConversationSelectCard';
import { Button } from '@mui/material';
import { uuidv4 } from '@firebase/util';

interface IProps {
    message: IMessage;
    messagesDivRef: { current: HTMLDivElement | null };
}
interface forwardUser {
    id: string;
    user: IUser;
    checked: boolean;
}
const Message: FC<IProps> = ({ message, messagesDivRef }) => {
    const [forwardUsers, setForwardUsers] = useState<forwardUser[]>([]);
    const [isForwardOpen, setIsForwardOpen] = useState<boolean>(false);
    const messageRef = useRef<HTMLDivElement | null>(null);
    const { info } = useSelector(selectUser);
    const { id } = useSelector(selectCurrentConversation);
    const conversations = useSelector(selectConversations);
    const { changeContextMenus, openContext } = useContextMenu();

    const toast = useToast();
    const dispatch = useDispatch();

    const deleteMessage = async () => {
        if (message.owner !== info?.uid) return;
        const currentChatRef = doc(db, 'conversations', id, 'messages', message.id);
        await deleteDoc(currentChatRef);
    };

    const editMessage = () => {
        dispatch(setMessageInput(message.text));
        dispatch(setEditMode(message.id));
    };

    const replyMessage = () => {
        const replyPayload = { to: message.owner, text: message.text, id: message.id };
        dispatch(setReplyTo(replyPayload));
    };

    const forwardMessage = () => {
        const docId = uuidv4();
        const messageData = {
            id: docId,
            owner: info!.uid,
            text: message.text,
            timeStamp: Timestamp.now(),
            status: 'sent',
        };

        forwardUsers.map((forward) => {
            setDoc(doc(db, 'conversations', forward.id, 'messages', docId), {
                ...messageData,
            });
            updateDoc(doc(db, 'conversations', forward.id), {
                timeStamp: Timestamp.now(),
            });
        });
        setIsForwardOpen(false);
        toast('message forwarded successfuly', 'success');
    };

    const handleSelectConversation = (id: string, user: IUser, checked: boolean) => {
        if (checked) {
            setForwardUsers([...forwardUsers, { id, user, checked }]);
            return;
        }
        const filterdForwardUser = forwardUsers.filter((forward) => forward.id !== id);
        setForwardUsers(filterdForwardUser);
    };

    const copyMessage = () => {
        navigator.clipboard.writeText(message.text);
        toast('Message succsesfully copid', 'success');
    };

    const handleGoToMessage = () => {
        if (!messagesDivRef.current || !message.replyTo) return;

        // for find a replyed message by click on it
        const replyedMessage = messagesDivRef.current.querySelector(`[id="${message.replyTo.id}"]`) as HTMLDivElement;

        if (!replyedMessage) {
            toast('cant scroll to message, message is deleted', 'error');
            return;
        }
        replyedMessage.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
    };

    const handleAddReaction = async (reaction: string) => {
        if (!message.reactions || message.reactions!.length === 0) {
            await updateDoc(doc(db, 'conversations', id, 'messages', message.id), {
                reactions: arrayUnion(reaction),
            });
            return;
        }
        await updateDoc(doc(db, 'conversations', id, 'messages', message.id), {
            reactions: arrayRemove(reaction),
        });
    };
    const handleRightClick = async () => {
        if (message.owner === info!.uid) {
            changeContextMenus([
                { icon: <ContentCopyIcon />, name: 'Copy', function: copyMessage },
                { icon: <ReplyAllIcon />, name: 'Reply', function: replyMessage },
                { icon: <ArrowForwardIcon />, name: 'Forward', function: () => setIsForwardOpen(true) },
                { icon: <EditIcon />, name: 'Edit', function: editMessage },
                { icon: <DeleteIcon />, name: 'Delete', function: deleteMessage },
            ]);
        } else {
            changeContextMenus([
                { icon: <ContentCopyIcon />, name: 'Copy', function: copyMessage },
                { icon: <ReplyAllIcon />, name: 'Reply', function: replyMessage },
                { icon: <ArrowForwardIcon />, name: 'Forward', function: () => setIsForwardOpen(true) },
            ]);
        }
        openContext();
    };

    const isPersian = /^[\u0600-\u06FF\s]+$/.test(message.text);

    return (
        <>
            {message.replyTo && (
                <motion.div
                    onClick={handleGoToMessage}
                    className={classNames('reply-message', message.owner === info!.uid ? 'owner' : 'reciver')}
                >
                    <span className='reply-message__line'></span>
                    <span className='reply-message-text'>{message.replyTo.message}</span>
                    <ReplyIcon className='reply-message__icon' />
                </motion.div>
            )}

            <Modal handleClose={() => setIsForwardOpen(false)} isOpen={isForwardOpen}>
                <div className='forward-modal'>
                    <h4 className='forward-modal__title'>Forward Message</h4>
                    <div className='forward-modal__users'>
                        {forwardUsers.map((forward) => (
                            <span key={forward.user.uid} className='forward-modal__user'>
                                {forward.user.name}
                            </span>
                        ))}
                    </div>
                    <div className='forward-modal__conversations'>
                        {conversations.map((conversation) => (
                            <ConversationSelectCard
                                onChange={handleSelectConversation}
                                key={conversation.id}
                                conversationData={conversation}
                            />
                        ))}
                    </div>
                    <Button onClick={forwardMessage} className='forward-modal__submit-button' color='primary'>
                        Send
                    </Button>
                </div>
            </Modal>

            <div
                onDoubleClick={() => handleAddReaction('❤️')}
                onContextMenu={handleRightClick}
                ref={messageRef}
                lang={isPersian ? 'fa' : window.navigator.language}
                id={message.id}
                className={classNames(
                    'message',
                    message.owner === info!.uid ? 'owner' : 'reciver',
                    message.status === 'pending' ? 'pending' : ''
                )}
            >
                {message.text.trim()}
                <span className='message-status'>
                    {message.status === 'pending' ? (
                        <AccessTimeIcon />
                    ) : message.status === 'seen' && message.owner === info!.uid ? (
                        <CheckIcon />
                    ) : (
                        ''
                    )}
                </span>

                <div className={classNames('message-reactions', message.owner === info!.uid ? 'owner' : '')}>
                    {message.reactions?.map((reaction, i) => (
                        <span key={i} className='message-reactions__emoji'>
                            {reaction}
                        </span>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Message;
