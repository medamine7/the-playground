import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    isLoading: false,
    showMenu: false,
  },
  reducers: {
    updateAppState: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },
  }
})


export const {
  updateAppState,
} = appSlice.actions

export default appSlice.reducer