import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';
import { RootState } from '../..';

// *** types ***
export interface IUser {
  uid: string;
  userName: string;
  name:string;
  bio: string;
  email: string;
  lastSeen: Timestamp;
  isTyping: boolean;
  isOnline: boolean;
  avatar: string;
}
export interface IUserState {
  info: IUser | null;
  status: 'loading' | 'isAuth' | 'isNotAuth';
}
// *** types ***

const initialState: IUserState = {
  info: null,
  status: 'loading',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state: IUserState, action: PayloadAction<IUser | null>) => {
      state.info = action.payload;
      state.status = 'isAuth';
    },
    logout: (state: IUserState) => {
      state.info = null;
      state.status = 'isNotAuth';
    },
  },
});

export default userSlice.reducer;
export const { login, logout } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
