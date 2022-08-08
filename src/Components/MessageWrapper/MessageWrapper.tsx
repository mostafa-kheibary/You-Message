import { doc, updateDoc } from 'firebase/firestore';
import { useInView } from 'framer-motion';
import { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Message } from '../';
import { db } from '../../config/firebase.config';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import { selectMessage } from '../../store/reducers/message/messageSlice';
import { selectUser } from '../../store/reducers/user/userSlice';
import ElevatorButton from '../ElevatorButton/ElevatorButton';
import './MessageWrapper.css';

const MessageWrapper: FC = () => {
  const messageDivRef = useRef<HTMLDivElement | null>(null);
  const isSeenRef = useRef<HTMLDivElement | null>(null);
  const messages = useSelector(selectMessage);
  const { info } = useSelector(selectUser);
  const { id } = useSelector(selectCurrentConversation);
  const isInView = useInView(isSeenRef);
  const isMount = useRef<boolean>(false);

  // for seen messages when user see the bottom of the message
  useEffect(() => {
    if (isInView) {
      messages.forEach(async (message) => {
        if (message.owner !== info?.uid) {
          await updateDoc(doc(db, 'conversations', id, 'messages', message.id), {
            status: 'seen',
          });
        }
      });
    }
  }, [isInView, messages]);

  useEffect(() => {
    if (!isMount.current) {
      messageDivRef.current?.scrollTo({ top: messageDivRef.current.scrollHeight, behavior: 'auto' });
    }
    if (messages[messages.length - 1]?.owner === info?.uid || isInView) {
      messageDivRef.current?.scrollTo({ top: messageDivRef.current.scrollHeight, behavior: 'smooth' });
      isMount.current = true;
    }
  }, [messages]);

  return (
    <div ref={messageDivRef} className='message-wrapper'>
      {messages.map((message, i) => (
        <Message message={message} key={i} />
      ))}
      <div ref={isSeenRef}></div>
      <ElevatorButton containerRef={messageDivRef.current} />
    </div>
  );
};

export default MessageWrapper;
