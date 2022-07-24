import { User } from 'firebase/auth';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserState } from '../../../types/stateTypes';

const initialState: UserState = {
  info: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state: UserState, action: PayloadAction<User>) => {
      state.info = action.payload;
    },
    logout: (state: UserState) => {
      state.info = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
