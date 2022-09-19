import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { ISettings } from '../../../interfaces';

const theme = JSON.parse(localStorage.getItem('youMessage-theme') || 'null') || { darkMode: false };

const initialState: ISettings = {
    theme: theme,
    unreadMessage: [],
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialState,
    reducers: {
        changeTheme: (state: ISettings, action: PayloadAction<boolean>) => {
            state.theme.darkMode = action.payload;
        },
        setUnreadMessage: (state: ISettings, action: PayloadAction<{ id: string; count: number }>) => {
            const { id } = action.payload;
            state.unreadMessage = state.unreadMessage.filter((message) => message.id !== id);
            state.unreadMessage.push(action.payload);
        },
    },
});
export const { changeTheme, setUnreadMessage } = settingsSlice.actions;
export const selectSettings = (state: RootState) => state.settings;
export default settingsSlice.reducer;
