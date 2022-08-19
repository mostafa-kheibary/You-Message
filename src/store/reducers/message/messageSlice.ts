import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Timestamp } from 'firebase/firestore';
import { RootState } from '../..';

export interface IMessage {
  timeStamp: Timestamp;
  id: string;
  owner: string;
  status: 'pending' | 'sent' | 'seen';
  text: string;
  replyTo?: { id: string; message: string; to: string };
}
export interface IMessageState {
  messages: IMessage[];
}

const initialState: IMessageState = {
  messages: [],
};

const messageSlice = createSlice({
  name: 'message',
  initialState: initialState,
  reducers: {
    addMessage: (state: IMessageState, action: PayloadAction<IMessage>) => {
      const oldMessage = state.messages.findIndex((message) => message.id === action.payload.id);
      if (oldMessage === -1) {
        state.messages.push(action.payload);
        return;
      }
      state.messages[oldMessage] = action.payload;
    },
    setMessages: (state: IMessageState, action: PayloadAction<IMessage[]>) => {
      state.messages = action.payload;
    },
    editMessage: (state: IMessageState, action: PayloadAction<{ id: string; message: any }>) => {
      const index = state.messages.findIndex((message) => message.id === action.payload.id);
      state.messages[index] = action.payload.message;
    },
    removeMessage: (state: IMessageState, action: PayloadAction<string>) => {
      state.messages = state.messages.filter((message) => message.id !== action.payload);
    },
    clearMessage: (state: IMessageState) => {
      state.messages = [];
    },
  },
});

export const { addMessage, removeMessage, editMessage, clearMessage, setMessages } = messageSlice.actions;
export default messageSlice.reducer;
export const selectMessage = (state: RootState) => state.message;
