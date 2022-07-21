import { User } from 'firebase/auth';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { UserState } from '../../../types/stateTypes';

const initialState: { user: UserState } = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state: { user: UserState }, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logOut: (state: { user: UserState }) => {
      state.user = null;
    },
  },
});

const { actions, reducer } = userSlice;
const { logIn, logOut } = actions;
export { logIn, logOut };
export default reducer;
