import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'models/User';
import { toast } from 'react-toastify';
import {
  changePassword,
  forgotPassword,
  login,
  loginByGoogle,
  register,
  resetPassword,
} from './authThunk';

export interface AuthState {
  login: {
    loading: boolean;
    error: string | null;
    loggedIn: boolean;
    user?: User;
  };
  register: {
    loading: boolean;
    error: string | null;
  };
  changePassword: {
    loading: boolean;
    error: string | null;
  };
  forgotPassword: {
    loading: boolean;
    error: string | null;
  };
  resetPassword: {
    loading: boolean;
    error: string | null;
  };
}

const initialState: AuthState = {
  login: {
    loading: false,
    error: null,
    loggedIn: false,
  },
  register: {
    loading: false,
    error: null,
  },
  changePassword: {
    loading: false,
    error: null,
  },
  forgotPassword: {
    loading: false,
    error: null,
  },
  resetPassword: {
    loading: false,
    error: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.login.user = action.payload;
      state.login.loggedIn = true;
    },
    clear: (state) => {
      state.login = initialState.login;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.login.loading = true;
      state.login.error = null;
      state.login.loggedIn = false;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.login.loading = false;
      state.login.loggedIn = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.login.loading = false;
      state.login.error = action.error.message as string;
      toast.error(action.error.message);
    });

    builder.addCase(loginByGoogle.pending, (state) => {
      state.login.loading = true;
      state.login.error = null;
      state.login.loggedIn = false;
    });
    builder.addCase(loginByGoogle.fulfilled, (state) => {
      state.login.loading = false;
      state.login.loggedIn = true;
    });
    builder.addCase(loginByGoogle.rejected, (state, action) => {
      state.login.loading = false;
      state.login.error = action.error.message as string;
      toast.error(action.error.message);
    });

    builder.addCase(register.pending, (state) => {
      state.register.loading = true;
      state.register.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.register.loading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.register.loading = false;
      state.register.error = action.error.message as string;
      toast.error(action.error.message);
    });

    builder.addCase(changePassword.pending, (state) => {
      state.changePassword.loading = true;
      state.changePassword.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.changePassword.loading = false;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.changePassword.loading = false;
      state.changePassword.error = action.error.message as string;
      toast.error(action.error.message);
    });

    builder.addCase(forgotPassword.pending, (state) => {
      state.forgotPassword.loading = true;
      state.forgotPassword.error = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.forgotPassword.loading = false;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.forgotPassword.loading = false;
      state.forgotPassword.error = action.error.message as string;
      toast.error(action.error.message);
    });

    builder.addCase(resetPassword.pending, (state) => {
      state.resetPassword.loading = true;
      state.resetPassword.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.resetPassword.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.resetPassword.loading = false;
      state.resetPassword.error = action.error.message as string;
      toast.error(action.error.message);
    });
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
