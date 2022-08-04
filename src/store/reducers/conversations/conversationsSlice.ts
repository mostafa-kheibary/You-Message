import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentReference } from 'firebase/firestore';
import { RootState } from '../..';
import { IUser } from '../user/userSlice';

// *** type ***
export interface IConversation {
  id: string;
  owners: DocumentReference[];
}
export interface IConversationState {
  conversations: IConversation[];
  currentConversation: { toUser: null | IUser; id: string };
  isOpen: boolean;
}
// *** type ***

const initialState: IConversationState = {
  conversations: [],
  currentConversation: {
    toUser: null,
    id: '',
  },
  isOpen: false,
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState: initialState,
  reducers: {
    addConversation: (state: IConversationState, action: PayloadAction<IConversation>) => {
      const sameMessage = state.conversations.find((conversation: any) => conversation.id === action.payload.id);
      if (!sameMessage) {
        state.conversations.push(action.payload);
      }
    },
    removeConversation: (state: IConversationState, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.conversations.findIndex((m) => m.id === id);
      if (index !== -1) {
        state.conversations.splice(index, 1);
      }
    },
    editConversation: (state: IConversationState, action: PayloadAction<any>) => {
      const { id, conversation } = action.payload;
      const index = state.conversations.findIndex((m) => m.id === id);
      state.conversations[index] = conversation;
    },
    changeOpenStatus: (state: IConversationState, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setCurrentConversation: (state: IConversationState, action: PayloadAction<{ toUser: IUser; id: string }>) => {
      state.currentConversation = action.payload;
    },
  },
});
export default conversationSlice.reducer;
export const { addConversation, editConversation, removeConversation, changeOpenStatus,setCurrentConversation } = conversationSlice.actions;
export const selectOpenStatus = (state: RootState) => state.conversations.isOpen;
export const selectConversations = (state: RootState) => state.conversations.conversations;
export const selectCurrentConversation = (state: RootState) => state.conversations.currentConversation;
