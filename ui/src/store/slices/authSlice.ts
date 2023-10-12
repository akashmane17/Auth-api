import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  user: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    isVerified: boolean;
  } | null;
}
let localUser;
if (localStorage.getItem("user_auth_api")) {
  localUser = await JSON.parse(localStorage.getItem("user_auth_api") || "");
}

const initialState = { user: localUser ? localUser : null } as UserState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user_auth_api", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user_auth_api");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
