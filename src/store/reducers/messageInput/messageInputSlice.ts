import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';

export interface IMessageInput {
  message: string;
  mode: 'create' | 'edit' | 'reply';
}
const initalState: IMessageInput = {
  message: '',
  mode: 'create',
};

const messageInput = createSlice({
  name: 'messageInput',
  initialState: initalState,
  reducers: {
    setMessageInput: (state: IMessageInput, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    clearMessageInput: (state: IMessageInput) => {
      state.message = '';
    },
    addMessageInput: (state: IMessageInput, action: PayloadAction<string>) => {
      state.message += action.payload;
    },
  },
});

export default messageInput.reducer;
export const { setMessageInput, clearMessageInput, addMessageInput } = messageInput.actions;
export const selectMessageInput = (state: RootState) => state.messageInput;
