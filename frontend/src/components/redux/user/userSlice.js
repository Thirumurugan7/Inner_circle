import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    updateUserProfile: (state, action) => {
      const updatedUser = {
        ...state.currentUser,
        user: { ...state.currentUser.user, ...action.payload },
      };
      state.currentUser = updatedUser;

      // Sync with localStorage to prevent data reset on reload
     // localStorage.setItem("authUser", JSON.stringify(updatedUser.user));
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  updateUserProfile,
} = userSlice.actions;

export default userSlice.reducer;
