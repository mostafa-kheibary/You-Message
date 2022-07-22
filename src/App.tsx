import { FC } from 'react';
import { Chat, SideBar } from './Layout';

const App: FC = () => {
  return (
    <div className='chat-app'>
      <SideBar />
      <Chat />
    </div>
  );
};

export default App;
