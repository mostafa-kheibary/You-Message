import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { IMessageInput } from '../../../interfaces';

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
            state.mode = 'create';
            delete state.editInfo;
            delete state.replyTo;
        },
        addMessageInput: (state: IMessageInput, action: PayloadAction<string>) => {
            state.message += action.payload;
        },
        setReplyTo: (state: IMessageInput, action: PayloadAction<{ to: string; id: string; text: string }>) => {
            const { to, text, id } = action.payload;
            const replyTo = { to, message: text, id };
            state.replyTo = replyTo;
            state.mode = 'reply';
        },
        clearReplyTo: (state: IMessageInput) => {
            delete state.replyTo;
            state.mode = 'create';
        },
        setEditMode: (state: IMessageInput, action: PayloadAction<string>) => {
            const editPayload = { id: action.payload };
            state.mode = 'edit';
            state.editInfo = editPayload;
        },
        clearEditMode: (state: IMessageInput) => {
            delete state.editInfo;
            state.mode = 'create';
            state.message = '';
        },
        chnageMessageInputMode: (state: IMessageInput, action: PayloadAction<'create' | 'edit' | 'reply'>) => {
            state.mode = action.payload;
        },
    },
});

export default messageInput.reducer;
export const {
    setMessageInput,
    clearMessageInput,
    addMessageInput,
    clearReplyTo,
    setReplyTo,
    chnageMessageInputMode,
    clearEditMode,
    setEditMode,
} = messageInput.actions;
export const selectMessageInput = (state: RootState) => state.messageInput;
