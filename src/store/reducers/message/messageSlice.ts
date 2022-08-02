import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { IMessage, IMessageChat, IMessageState, IUser } from '../../../types/stateTypes';

const initialState: IMessageState = {
  messages: [],
  currentChat: {
    id: '',
    to: null,
    chats: [],
  },
  isOpen: false,
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
    setCurrentChat: (state: IMessageState, action: PayloadAction<{ chats: IMessageChat[]; id: string }>) => {
      const { chats, id } = action.payload;
      state.currentChat.chats = chats;
      state.currentChat.id = id;
    },
    addCuurentChat: (state: IMessageState, action: PayloadAction<IMessageChat>) => {
      state.currentChat.chats.push(action.payload);
    },
    setCurrentChatTo: (state: IMessageState, action: PayloadAction<IUser | null>) => {
      state.currentChat.to = action.payload;
    },
    setChatOpenStatus: (state: IMessageState, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addMessages,
  deleteMessage,
  editMessage,
  setCurrentChat,
  setCurrentChatTo,
  setChatOpenStatus,
  addCuurentChat,
} = messageSlice.actions;
export default messageSlice.reducer;
export const selectMessage = (state: RootState) => state.message.messages;
export const selectCurrentChat = (state: RootState) => state.message.currentChat;
export const selectChatOpenStatus = (state: RootState) => state.message.isOpen;
