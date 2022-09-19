import { CircularProgress } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { useInView } from 'framer-motion';
import { FC, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Message } from '../';
import { db } from '../../config/firebase.config';
import useStorage from '../../hook/useStorage';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import { selectMessage } from '../../store/reducers/message/messageSlice';
import { selectUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import ElevatorButton from '../ElevatorButton/ElevatorButton';
import './MessageWrapper.css';

interface IProps {
    messageLoaded: boolean | null;
}

const MessageWrapper: FC<IProps> = ({ messageLoaded }) => {
    const { messages, loading } = useSelector(selectMessage);
    const { info } = useSelector(selectUser);
    const { id } = useSelector(selectCurrentConversation);
    const isSeenRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(isSeenRef);
    const messagesDivRef = useRef<HTMLDivElement | null>(null);
    const { setStorage, getStorage } = useStorage();

    // for seen messages when user see the bottom of the message
    useEffect(() => {
        if (isInView) {
            messages.forEach(async (message) => {
                if (message.owner !== info?.uid && message.status !== 'seen') {
                    await updateDoc(doc(db, 'conversations', id, 'messages', message.id), {
                        status: 'seen',
                    });
                }
            });
        }
    }, [isInView, messages]);

    useEffect(() => {
        console.log('first');
        const scrollTop = getStorage(`youMessage-scroll-${id}`);
        messagesDivRef.current!.scrollTo({ top: scrollTop, left: 0, behavior: 'auto' });
    }, [loading]);

    useEffect(() => {
        const unsub = window.addEventListener('message-added', () => {
            setTimeout(() => {
                messagesDivRef.current?.scrollTo({
                    top: messagesDivRef.current.scrollHeight,
                    left: 0,
                    behavior: 'smooth',
                });
            }, 0);
        });
        return unsub;
    }, []);

    const handleScroll = (e: any) => {
        const target = e.target as HTMLDivElement;
        if (target.scrollTop === 0) return;

        setStorage(`youMessage-scroll-${id}`, target.scrollTop);
    };

    const renderdAllMessage = useCallback(() => {
        if (messages.length <= 0 && messageLoaded === null) {
            return (
                <h4 className='message-wrapper__conversation-start-text'>
                    conversation created 👋 <br /> No messages here yet . . .
                </h4>
            );
        }
        return messages.map((message) => {
            return <Message messagesDivRef={messagesDivRef} message={message} key={message.id} />;
        });
    }, [messages, messageLoaded]);

    return (
        <>
            <div onScroll={handleScroll} ref={messagesDivRef} className={classNames('message-wrapper')}>
                {messageLoaded && <CircularProgress className='message-loading' />}
                {renderdAllMessage()}
                <div ref={isSeenRef}></div>
            </div>
            <ElevatorButton
                unreadCount={messages.reduce(
                    (prev, message) =>
                        message.status !== 'seen' && message.owner !== info!.uid ? (prev += 1) : (prev += 0),
                    0
                )}
                containerRef={messagesDivRef.current}
            />
        </>
    );
};

export default MessageWrapper;
