import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './reducers/toast/toastSlice';
import messageReducer from './reducers/message/messageSlice';
import conversationReducer from './reducers/conversations/conversationsSlice';

import userReducer from './reducers/user/userSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    toast: toastReducer,
    conversations: conversationReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'user/login',
          'conversations/addConversation',
          'conversations/removeConversation',
          'conversations/editConversation',
        ],
        ignoredState: ['user', 'conversations'],
        ignoredPaths: ['user.info.lastSeen', 'conversations.currentConversation', 'conversations.conversations'],
      },
    }),
  devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
