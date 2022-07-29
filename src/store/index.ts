import { configureStore } from '@reduxjs/toolkit';
import toastReducer from './reducers/toast/toastSlice';
import messageReducer from './reducers/message/messageSlice';

import userReducer from './reducers/user/userSlice';
const store = configureStore({
  reducer: {
    user: userReducer,
    toast: toastReducer,
    message: messageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['user/login', 'message/addMessages', 'message/editMessage'],
        ignoredState: ['user', 'message'],
        ignoredPaths: ['user.info', 'message.messages'],
      },
    }),
  devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
