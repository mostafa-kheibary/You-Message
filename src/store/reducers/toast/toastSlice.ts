import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { IToastState } from '../../../interfaces';

const initialState: IToastState = {
  message: '',
  status: 'success',
  visibility: false,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState: initialState,
  reducers: {
    setVisibility: (state: IToastState, action: PayloadAction<boolean>) => {
      state.visibility = action.payload;
    },
    setToast: (state: IToastState, action: PayloadAction<IToastState>) => {
      state.visibility = action.payload.visibility;
      state.status = action.payload.status;
      state.message = action.payload.message;
    },
  },
});
export const selectToast = (state: RootState) => state.toast;
export const { setToast, setVisibility } = toastSlice.actions;
export default toastSlice.reducer;
