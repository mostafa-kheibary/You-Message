import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { ISettings } from '../../../interfaces';

const theme = JSON.parse(localStorage.getItem('youMessage-theme') || 'null') || { darkMode: false };

const initialState: ISettings = {
    theme: theme,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialState,
    reducers: {
        changeTheme: (state: ISettings, action: PayloadAction<boolean>) => {
            state.theme.darkMode = action.payload;
        },
    },
});
export const { changeTheme } = settingsSlice.actions;
export const selectSettings = (state: RootState) => state.settings;
export default settingsSlice.reducer;
