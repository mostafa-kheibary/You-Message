import { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Message } from '../';
import { selectCurrentConversation } from '../../store/reducers/conversations/conversationsSlice';
import { selectMessage } from '../../store/reducers/message/messageSlice';
import './MessageWrapper.css';

const MessageWrapper: FC = () => {
  const messageDivRef = useRef<HTMLDivElement | null>(null);
  const messages = useSelector(selectMessage);
  const { id } = useSelector(selectCurrentConversation);

  useEffect(() => {
    messageDivRef.current?.scrollTo({ top: messageDivRef.current.scrollHeight });
  }, [id]);

  useEffect(() => {
    messageDivRef.current?.scrollTo({ top: messageDivRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  return (
    <div ref={messageDivRef} className='message-wrapper'>
      {messages.map((message, i) => (
        <Message message={message} key={i} />
      ))}
    </div>
  );
};

export default MessageWrapper;
