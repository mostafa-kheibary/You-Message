import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUser, IUserState } from '../../../types/stateTypes';
import { RootState } from '../..';

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

export const { login, logout } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
