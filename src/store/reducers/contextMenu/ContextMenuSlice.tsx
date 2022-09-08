import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContextMenuItem, IContextMenu } from '../../../interfaces';
import { RootState } from '../..';

const initialState: IContextMenu = {
    menu: [],
    open: false,
};

const contextMenu = createSlice({
    name: 'contextMenu',
    initialState: initialState,
    reducers: {
        changeStatus: (state: IContextMenu, action: PayloadAction<boolean>) => {
            state.open = action.payload;
        },
        setContextMenus: (state: IContextMenu, action: PayloadAction<ContextMenuItem[]>) => {
            state.menu = action.payload;
        },
    },
});

export default contextMenu.reducer;
export const { changeStatus, setContextMenus } = contextMenu.actions;
export const selectContextMenu = (state: RootState) => state.contextMenu;
