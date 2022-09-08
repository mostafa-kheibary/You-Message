import { ChangeEvent, FC, FormEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { doc, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../config/firebase.config';
import { AnimatePresence, motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { IconButton, OutlinedInput } from '@mui/material';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import CloseIcon from '@mui/icons-material/Close';

import { addMessage } from '../../store/reducers/message/messageSlice';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import { EmojiMessage } from '../';
import './SendMessageBar.css';
import {
    selectMessageInput,
    setMessageInput,
    clearMessageInput,
    clearReplyTo,
    clearEditMode,
} from '../../store/reducers/messageInput/messageInputSlice';
import { IMessage } from '../../interfaces';

const SendMessageBar: FC = () => {
    const auth = getAuth();
    const { id } = useSelector(selectCurrentConversation);
    const { message, mode, editInfo, replyTo } = useSelector(selectMessageInput);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useDispatch();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        switch (mode) {
            case 'create':
                sendMessage();
                break;
            case 'reply':
                sendMessage();
                break;
            case 'edit':
                editMessage();
                break;
        }
    };

    const editMessage = async () => {
        if (!editInfo) return;
        const messageText = message;
        dispatch(clearEditMode());
        await updateDoc(doc(db, 'conversations', id, 'messages', editInfo.id), {
            text: messageText,
        });
    };

    const sendMessage = async () => {
        if (!auth.currentUser) return;
        try {
            const messageId = uuidv4();
            let messagePayload: IMessage = {
                timeStamp: Timestamp.now(),
                owner: auth.currentUser.uid,
                text: message,
                status: 'sent',
                id: messageId,
            };
            if (replyTo) {
                messagePayload = { ...messagePayload, replyTo: replyTo };
            }
            dispatch(clearMessageInput());
            dispatch(clearReplyTo());
            dispatch(addMessage({ ...messagePayload, status: 'pending' }));

            const messageRef = doc(db, 'conversations', id, 'messages', messageId);
            await setDoc(messageRef, messagePayload);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(setMessageInput(e.target.value));
        // clearTimeout(x.current);
        // const userRef = doc(db, 'users', auth.currentUser!.uid);
        // await updateDoc(userRef, { isTyping: true });
        // x.current = setTimeout(async () => {
        //   await updateDoc(userRef, { isTyping: false });
        // }, 500);
    };

    return (
        <div className='send-message-bar'>
            <AnimatePresence>
                {replyTo && (
                    <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        className='send-message-bar__reply'
                    >
                        <ReplyAllIcon color='primary' />
                        <span className='send-message-bar__reply-message'>reply to : {replyTo.message}</span>
                        <IconButton
                            onClick={() => dispatch(clearReplyTo())}
                            className='send-message-bar__reply__close-button'
                        >
                            <CloseIcon />
                        </IconButton>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className='send-message-bar__wrapper'>
                <EmojiMessage />
                <form className='send-message-bar__form' onSubmit={handleSubmit}>
                    <OutlinedInput
                        inputRef={inputRef}
                        onChange={handleChange}
                        autoComplete='off'
                        value={message}
                        size='medium'
                        name='chat'
                        className='send-message-bar__input'
                        placeholder='Your message ...'
                    />
                </form>
                {/* <VoiceMessageSender /> */}
            </div>
        </div>
    );
};

export default SendMessageBar;
