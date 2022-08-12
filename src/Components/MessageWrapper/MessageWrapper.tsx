import { doc, updateDoc } from 'firebase/firestore';
import { AnimatePresence, useInView } from 'framer-motion';
import { FC, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Message } from '../';
import { db } from '../../config/firebase.config';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import { selectMessage } from '../../store/reducers/message/messageSlice';
import { selectUser } from '../../store/reducers/user/userSlice';
import ElevatorButton from '../ElevatorButton/ElevatorButton';
import './MessageWrapper.css';

const MessageWrapper: FC = () => {
  const messages = useSelector(selectMessage);
  const { info } = useSelector(selectUser);
  const { id } = useSelector(selectCurrentConversation);
  const isSeenRef = useRef<HTMLDivElement | null>(null);
  const messageDivRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(isSeenRef);

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
    messageDivRef.current?.scrollTo({ top: messageDivRef.current.scrollHeight, left: 0, behavior: 'auto' });
  }, [messages]);

  const renderdAllMessage = () => {
    if (messages.length <= 0) {
      return (
        <h4 className='message-wrapper__conversation-start-text'>
          conversation created <br /> No messages here yet... Send a message
        </h4>
      );
    }
    return messages.map((message) => {
      return <Message message={message} key={message.id} />;
    });
  };

  return (
    <div ref={messageDivRef} className='message-wrapper'>
      {false ? <h2>loading</h2> : renderdAllMessage()}
      <div ref={isSeenRef}></div>
      <ElevatorButton containerRef={messageDivRef.current} />
    </div>
  );
};

export default MessageWrapper;
