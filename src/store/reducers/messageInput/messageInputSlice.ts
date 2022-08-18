import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';

export interface IMessageInput {
  message: string;
  replyTo?: { to: string; message: string };
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
    setReplyTo: (state: IMessageInput, action: PayloadAction<{ to: string; text: string }>) => {
      const { to, text } = action.payload;
      const replyTo = { to, message: text };
      state.replyTo = replyTo;
      state.mode = 'reply';
    },
    clearReplyTo: (state: IMessageInput) => {
      delete state.replyTo;
      state.mode = 'create';
    },
    chnageMessageInputMode: (state: IMessageInput, action: PayloadAction<'create' | 'edit' | 'reply'>) => {
      state.mode = action.payload;
    },
  },
});

export default messageInput.reducer;
export const { setMessageInput, clearMessageInput, addMessageInput, clearReplyTo, setReplyTo, chnageMessageInputMode } =
  messageInput.actions;
export const selectMessageInput = (state: RootState) => state.messageInput;
