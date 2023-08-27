import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/user.service";
import certificateService from "../../services/crypto.service";

export const login = createAsyncThunk(
  "user/login",
  ({ username, password }, _) => userService.login(username, password)
);

export const logout = createAsyncThunk("user/logout", (username, _) =>
  userService.logout(username)
);

const onSuccessAuth = (state, action) => {
  state.user = {
    ...action.payload,
    certificate: certificateService.convertCertToDer(
      action.payload.certificate
    ),
    privateKey: certificateService.convertPrivKeyToDer(
      action.payload.privateKey
    ),
  };
  state.authenticated = true;
  state.authenticationFailed = false;
  state.loading = false;
};

const logoutAction = (state, _) => {
  state.authenticated = false;
  state.loading = false;
  state.user = null;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    authenticated: false,
    authenticationFailed: false,
    loading: false,
    user: null,
  },
  reducers: {
    getLoggedUsers: () => userService.getLoggedUsers(),
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, _) => {
      state.loading = true;
    });
    builder.addCase(login.rejected, (state, _) => {
      state.authenticationFailed = true;
      state.loading = false;
      state.authenticated = false;
    });
    builder.addCase(login.fulfilled, onSuccessAuth);

    builder.addCase(logout.fulfilled, logoutAction);
  },
});

export default userSlice.reducer;
