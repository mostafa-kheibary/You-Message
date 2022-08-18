import { CircularProgress } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { AnimatePresence, useInView } from 'framer-motion';
import { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Message } from '../';
import { db } from '../../config/firebase.config';
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
  const messages = useSelector(selectMessage);
  const { info } = useSelector(selectUser);
  const { id } = useSelector(selectCurrentConversation);
  const isSeenRef = useRef<HTMLDivElement | null>(null);
  const messageDivRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(isSeenRef);

  // for seen messages when user see the bottom of the message
  useEffect(() => {
    if (isInView) {
      messages.messages.forEach(async (message) => {
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
    if (messages.messages.length <= 0 && messageLoaded === null) {
      return (
        <h4 className='message-wrapper__conversation-start-text'>
          conversation created <br /> No messages here yet... Send a message 👋
        </h4>
      );
    }
    return messages.messages.map((message) => {
      return <Message message={message} key={message.id} />;
    });
  };

  return (
    <div ref={messageDivRef} className={classNames('message-wrapper')}>
      {messageLoaded && <CircularProgress className='message-loading' />}
      <AnimatePresence>{renderdAllMessage()}</AnimatePresence>
      <div ref={isSeenRef}></div>
      <ElevatorButton containerRef={messageDivRef.current} />
    </div>
  );
};

export default MessageWrapper;
