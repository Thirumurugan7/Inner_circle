import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  referralInfo: {
    isValid: false,
    code: "",
  },
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

      // Removed localStorage.setItem as requested
    },
    // New reducer for handling referral information
    setReferralInfo: (state, action) => {
      state.referralInfo = action.payload;
    },
    clearReferralInfo: (state) => {
      state.referralInfo = {
        isValid: false,
        code: null,
      };
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  updateUserProfile,
  setReferralInfo,
  clearReferralInfo,
} = userSlice.actions;

export default userSlice.reducer;
