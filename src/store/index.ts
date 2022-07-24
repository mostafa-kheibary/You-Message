import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/user/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['user/login'],
        ignoredState: ['user'],
        ignoredPaths: ['user.info'],
      },
    }),
  devTools: true,
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
