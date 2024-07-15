import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, UserState, Token } from 'app/types/user'

const initialState: UserState = {
  user: null,
  token: null,
  isLoggedIn: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{user: User, token: Token}>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    refresh: (state, action: PayloadAction<Token>) => {
        state.token = action.payload
    }
  }
});

export const { login, logout, refresh } = userSlice.actions;
export default userSlice.reducer;