import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Chat, SideBar } from '../../Layout';
import { selectOpenStatus } from '../../store/reducers/conversations/conversationsSlice';
import classNames from '../../utils/classNames';
import './Main.css';

const Main: FC = () => {
  const  isOpen = useSelector(selectOpenStatus);
  return (
    <div className={classNames('chat-app', isOpen ? 'open' : '')}>
      <SideBar />
      <Chat />
    </div>
  );
};

export default Main;
