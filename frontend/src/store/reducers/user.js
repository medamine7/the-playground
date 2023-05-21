import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    updateUser: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      };
    },
    reset: () => {
      return {};
    },
  },
});


export const {
  updateUser,
  reset,
} = userSlice.actions

export default userSlice.reducer