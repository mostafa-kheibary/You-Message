import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Chat, SideBar } from '../../Layout';
import { selectChatOpenStatus } from '../../store/reducers/message/messageSlice';
import classNames from '../../utils/classNames';
import './Main.css';

const Main: FC = () => {
  const isOpen = useSelector(selectChatOpenStatus);
  return (
    <div className={classNames('chat-app', isOpen ? 'open' : '')}>
      <SideBar />
      <Chat />
    </div>
  );
};

export default Main;
