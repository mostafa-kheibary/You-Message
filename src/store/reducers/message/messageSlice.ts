import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMessage, IMessageState } from '../../../interfaces';
import { RootState } from '../..';

const initialState: IMessageState = {
    messages: [],
    loading: true,
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
        setMessagesLoading: (state: IMessageState, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setMessages: (state: IMessageState, action: PayloadAction<IMessage[]>) => {
            state.messages = action.payload;
            state.loading = false;
        },

        clearMessages: (state: IMessageState) => {
            state.messages = [];
        },
    },
});

export const { setMessagesLoading, addMessage, clearMessages, setMessages } = messageSlice.actions;
export default messageSlice.reducer;
export const selectMessage = (state: RootState) => state.message;
