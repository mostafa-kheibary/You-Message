import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './reducers/toast/toastSlice';
import messageReducer from './reducers/message/messageSlice';
import conversationReducer from './reducers/conversations/conversationsSlice';
import userReducer from './reducers/user/userSlice';
import ContextReducer from './reducers/contextMenu/ContextMenuSlice';
import messageInputReducer from './reducers/messageInput/messageInputSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    toast: toastReducer,
    conversations: conversationReducer,
    message: messageReducer,
    messageInput: messageInputReducer,
    contextMenu: ContextReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'user/login',
          'contextMenu/changeStatus',
          'contextMenu/setContextMenus',
          'conversation/addConversation',
          'conversation/removeConversation',
          'conversation/editConversation',
          'conversation/setCurrentConversation',
          'message/addMessage',
          'message/editMessage',
          'message/setMessages',
        ],
        ignoredState: ['conversations', 'contextMenu'],
        ignoredPaths: [
          'contextMenu.menu',
          'message.messages',
          'user.info.lastSeen',
          'conversations.currentConversation',
          'conversations.conversations',
        ],
      },
    }),
  devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
