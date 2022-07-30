import { FC } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentChat } from '../../store/reducers/message/messageSlice';
import { selectUser } from '../../store/reducers/user/userSlice';
import classNames from '../../utils/classNames';
import './MessageWrapper.css';

const MessageWrapper: FC = () => {
  const { info } = useSelector(selectUser);
  const currentChat = useSelector(selectCurrentChat);

  return (
    <div className='message-wrapper'>
      {currentChat?.chats.map((message, i) => (
        <div
          key={i}
          className={classNames('message-wrapper__message', message.owner === info!.uid ? 'owner' : 'reciver')}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default MessageWrapper;
