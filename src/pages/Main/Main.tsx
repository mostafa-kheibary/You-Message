import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Chat, SideBar } from '../../Layout';
import classNames from '../../utils/classNames';
import './Main.css';

const Main: FC = () => {
  return (
    <div className={classNames('chat-app', true ? 'open' : '')}>
      <SideBar />
      <Chat />
    </div>
  );
};

export default Main;
