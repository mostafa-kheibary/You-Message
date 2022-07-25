import { User } from 'firebase/auth';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUserState } from '../../../types/stateTypes';
import { RootState } from '../..';

const initialState: IUserState = {
  info: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state: IUserState, action: PayloadAction<User>) => {
      state.info = action.payload;
    },
    logout: (state: IUserState) => {
      state.info = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
