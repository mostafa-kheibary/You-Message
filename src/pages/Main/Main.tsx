import { FC } from 'react';
import { Chat, SideBar } from '../../Layout';
import './Main.css';

const Main: FC = () => {
  return (
    <div className='chat-app'>
      <SideBar />
      <Chat />
    </div>
  );
};

export default Main;
