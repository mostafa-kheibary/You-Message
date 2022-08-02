import { AnimatePresence } from 'framer-motion';
import { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Message } from '../';
import { selectCurrentChat } from '../../store/reducers/message/messageSlice';
import './MessageWrapper.css';

const MessageWrapper: FC = () => {
  const currentChat = useSelector(selectCurrentChat);
  const messageDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageDivRef.current?.scrollTo({ top: messageDivRef.current.scrollHeight });
  }, [currentChat.to]);

  useEffect(() => {
    messageDivRef.current?.scrollTo({ top: messageDivRef.current.scrollHeight, behavior: 'smooth' });
  }, [currentChat.chats]);

  return (
    <div ref={messageDivRef} className='message-wrapper'>
      {currentChat?.chats.map((message, i) => (
        <Message message={message} key={i} />
      ))}
    </div>
  );
};

export default MessageWrapper;
