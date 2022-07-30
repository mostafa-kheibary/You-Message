import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { IMessage, IMessageChat, IMessageState, IUser } from '../../../types/stateTypes';

const initialState: IMessageState = {
  messages: [],
  currentChat: {
    to: null,
    chats: [],
  },
};

const messageSlice = createSlice({
  name: 'message',
  initialState: initialState,
  reducers: {
    addMessages: (state: IMessageState, action: PayloadAction<IMessage>) => {
      const sameMessage = state.messages.find((message: any) => message.id === action.payload.id);
      if (!sameMessage) {
        state.messages.push(action.payload);
      }
    },
    editMessage: (state: IMessageState, action: PayloadAction<{ id: string; message: any }>) => {
      const { id, message } = action.payload;
      const index = state.messages.findIndex((m) => m.id === id);
      state.messages[index] = message;
    },
    deleteMessage: (state: IMessageState, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.messages.findIndex((m) => m.id === id);
      if (index !== -1) {
        state.messages.splice(index, 1);
      }
    },
    setCurrentChat: (state: IMessageState, action: PayloadAction<IMessageChat[]>) => {
      state.currentChat.chats = action.payload;
    },
    setCurrentChatTo: (state: IMessageState, action: PayloadAction<IUser>) => {
      state.currentChat.to = action.payload;
    },
  },
});

export const { addMessages, deleteMessage, editMessage, setCurrentChat,setCurrentChatTo } = messageSlice.actions;
export default messageSlice.reducer;
export const selectMessage = (state: RootState) => state.message.messages;
export const selectCurrentChat = (state: RootState) => state.message.currentChat;
