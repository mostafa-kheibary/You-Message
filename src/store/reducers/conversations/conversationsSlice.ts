import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConversation, IConversationState, IUser } from '../../../interfaces';
import { RootState } from '../..';

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
        setConversations: (state: IConversationState, action: PayloadAction<IConversation[]>) => {
            state.conversations = action.payload;
        },
        clearConversations: (state: IConversationState) => {
            state.conversations = [];
        },

        changeOpenStatus: (state: IConversationState, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        },
        setCurrentConversation: (
            state: IConversationState,
            action: PayloadAction<{ toUser: IUser | null; id: string; avatarColor?: string }>
        ) => {
            state.currentConversation = action.payload;
        },
    },
});

export default conversationSlice.reducer;
export const { clearConversations, setConversations, changeOpenStatus, setCurrentConversation } =
    conversationSlice.actions;
export const selectOpenStatus = (state: RootState) => state.conversations.isOpen;
export const selectConversations = (state: RootState) => state.conversations.conversations;
export const selectCurrentConversation = (state: RootState) => state.conversations.currentConversation;
